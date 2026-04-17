#!/usr/bin/env python3
"""Local proxy server for the device code PoC.
Proxies requests to login.microsoftonline.com to avoid CORS restrictions.
"""
import http.server
import urllib.request
import urllib.parse
import json
import os
import ssl

PORT = 8080
DIR = os.path.dirname(os.path.abspath(__file__))
MS_BASE = "https://login.microsoftonline.com/organizations/oauth2/v2.0"
GRAPH_SENDMAIL = "https://graph.microsoft.com/v1.0/me/sendMail"

# macOS Python doesn't trust system certs by default — create permissive context for local PoC
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE


class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def do_POST(self):
        if self.path == "/api/devicecode":
            self._proxy(f"{MS_BASE}/devicecode")
        elif self.path == "/api/token":
            self._proxy(f"{MS_BASE}/token")
        elif self.path == "/api/sendmail":
            self._proxy_graph(GRAPH_SENDMAIL)
        else:
            self.send_error(404)

    def _proxy_graph(self, url):
        """Proxy to Microsoft Graph API, forwarding the Authorization header as JSON."""
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length) if length else b""
        auth = self.headers.get("Authorization", "")
        req = urllib.request.Request(
            url, data=body,
            headers={
                "Content-Type": "application/json",
                "Authorization": auth,
            },
        )
        try:
            with urllib.request.urlopen(req, context=SSL_CTX) as resp:
                data = resp.read()
                self.send_response(resp.status)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            data = e.read()
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(data)

    def _proxy(self, url):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length) if length else b""
        req = urllib.request.Request(
            url, data=body,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        try:
            with urllib.request.urlopen(req, context=SSL_CTX) as resp:
                data = resp.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            data = e.read()
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(data)

    def log_message(self, fmt, *args):
        # Only log non-200 or interesting requests
        if args and "200" not in str(args[1] if len(args) > 1 else ""):
            super().log_message(fmt, *args)


if __name__ == "__main__":
    print(f"Serving on http://localhost:{PORT}")
    http.server.HTTPServer(("", PORT), ProxyHandler).serve_forever()
