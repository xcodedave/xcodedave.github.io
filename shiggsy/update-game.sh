#!/bin/sh
# Usage: ./update-game.sh /path/to/rust-wasm-n64/web
# Copies the built web app into game/, recomputes the build stamp (first 8 chars of the wasm
# sha1), and rewrites every URL so browsers cannot serve a stale copy.
set -eu
SRC="${1:?usage: update-game.sh <path-to-rust-wasm-n64/web>}"
HERE="$(cd "$(dirname "$0")" && pwd)"
G="$HERE/game"
[ -f "$SRC/pkg/sm64_web_bg.wasm" ] || { echo "no built wasm in $SRC/pkg" >&2; exit 1; }
STAMP="$(shasum "$SRC/pkg/sm64_web_bg.wasm" | cut -c1-8)"
rm -rf "$G/pkg" "$G/icons"
mkdir -p "$G"
cp "$SRC/index.html" "$G/index.html"
cp -R "$SRC/pkg" "$G/pkg"; rm -f "$G/pkg/.gitignore"
[ -d "$SRC/icons" ] && cp -R "$SRC/icons" "$G/icons"
[ -f "$SRC/assets.pack" ] && cp "$SRC/assets.pack" "$G/assets.pack"   # ROM-derived: git-ignored
# game/index.html: version every script and link URL
sed -i.bak -e "s#src=\"\./main\.js[^\"]*\"#src=\"./main.js?v=$STAMP\"#" \
           -e "s#href=\"icons/n64/credits\.html[^\"]*\"#href=\"icons/n64/credits.html?v=$STAMP\"#" "$G/index.html"
rm -f "$G/index.html.bak"
# game/index.html: copy any other local files it references (scan src/href)
python3 - "$SRC" "$G" <<'PY'
import re, sys, os, shutil
src, g = sys.argv[1:3]
html = open(os.path.join(src, 'index.html')).read()
for ref in re.findall(r'(?:src|href)\s*=\s*"([^"]+)"', html):
    if re.match(r'(https?:|//|#|data:|mailto:|javascript:)', ref):
        continue
    p = re.split(r'[?#]', ref)[0]
    if not p or p in ('./main.js', 'main.js'):
        continue
    s_, d_ = os.path.join(src, p), os.path.join(g, p)
    if os.path.isdir(s_) or not os.path.exists(s_):
        if not os.path.exists(s_):
            sys.exit('index.html references missing file: ' + p)
        continue
    os.makedirs(os.path.dirname(d_), exist_ok=True)
    shutil.copyfile(s_, d_)
PY
# game/main.js: copy the REAL main.js and patch it in place; fail loudly on any miss
python3 - "$SRC/main.js" "$G/main.js" "$STAMP" <<'PY'
import re, sys
src, dst, V = sys.argv[1:4]
t = open(src).read()
t, n1 = re.subn(r"(from\s+)'\./pkg/sm64_web\.js[^']*'", r"\1'./pkg/sm64_web.js?v=" + V + "'", t)
t, n2 = re.subn(r"await init\(\s*\);", "await init({ module_or_path: new URL('pkg/sm64_web_bg.wasm?v=" + V + "', import.meta.url) });", t)
if n1 != 1: sys.exit('update-game: pkg import pattern not found in main.js (changed?)')
if n2 != 1: sys.exit('update-game: `await init();` not found in main.js (changed?)')
pre = """// --- added by update-game.sh (stamp %s): cache busting ---
const __V = '%s';
const __realFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  const u = typeof input === 'string' ? input : input instanceof URL ? input.href : null;
  if (u && /(^|\\/)assets\\.pack(\\?|$)/.test(u) && !/[?&]v=/.test(u)) {
    return __realFetch(u + (u.includes('?') ? '&' : '?') + 'v=' + __V, { ...init, cache: 'no-store' });
  }
  return __realFetch(input, init);
};
// --- end ---
""" % (V, V)
open(dst, 'w').write(pre + t)
# every local module main.js (transitively) imports or loads: copy, version, fail if missing
import os
srcdir, dstdir = os.path.dirname(src), os.path.dirname(dst)
ref = re.compile(r"""(['"])(\./[\w./-]+\.js)\1""")
queue, seen = ['main.js'], {'main.js'}
while queue:
    name = queue.pop()
    text = open(os.path.join(dstdir if name == 'main.js' else srcdir, name)).read()
    for m in ref.finditer(text):
        dep = m.group(2)[2:]
        if dep.startswith('pkg/'):
            continue
        if not os.path.exists(os.path.join(srcdir, dep)):
            sys.exit('update-game: %s references missing file %s' % (name, dep))
        if dep not in seen:
            seen.add(dep); queue.append(dep)
    if name == 'main.js':
        continue
    out = ref.sub(lambda m: m.group(1) + m.group(2) + '?v=' + V + m.group(1), text)
    os.makedirs(os.path.dirname(os.path.join(dstdir, name)) or dstdir, exist_ok=True)
    open(os.path.join(dstdir, name), 'w').write(out)
main = open(dst).read()
main = ref.sub(lambda m: m.group(1) + m.group(2) + '?v=' + V + m.group(1), main)
open(dst, 'w').write(main)
PY
# shiggsy/index.html: versioned iframe src
sed -i.bak -E "s#game/index\.html\?start=title[^']*'#game/index.html?start=title\&v=$STAMP'#" "$HERE/index.html"
rm -f "$HERE/index.html.bak"
echo "stamp $STAMP; wasm sha1 $(shasum "$G/pkg/sm64_web_bg.wasm" | cut -d' ' -f1)"
