#!/bin/sh
# Local dev server: no caching at all. PORT=8071 by default. http://<this-mac>:PORT/
cd "$(dirname "$0")"
exec python3 - <<'PY'
import http.server
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, max-age=0')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()
http.server.ThreadingHTTPServer(('0.0.0.0', int(__import__('os').environ.get('PORT', '8071'))), H).serve_forever()
PY
