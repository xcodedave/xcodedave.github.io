// Browser-side file download helpers. `download` wraps a text payload in a
// blob and triggers a click on an anchor; `triggerDownload` is exposed
// separately so callers that already have an object URL (e.g. canvas
// `toBlob`) can reuse the same anchor-click trick.

export function download(text, filename, mime) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function triggerDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
