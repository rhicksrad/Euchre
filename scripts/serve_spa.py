#!/usr/bin/env python3
import http.server
import socketserver
import os
import argparse
from urllib.parse import unquote


class SpaRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    # Prevent aggressive browser caching during local dev
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def do_GET(self):
        # Try to serve static file first
        path = unquote(self.path.split('?', 1)[0])
        full_path = self.translate_path(path)

        if os.path.isdir(full_path):
            # Serve directory index if available
            for index in ("index.html", "index.htm"):
                index_path = os.path.join(full_path, index)
                if os.path.exists(index_path):
                    self.path = os.path.join(path.rstrip('/'), index)
                    return http.server.SimpleHTTPRequestHandler.do_GET(self)

        if os.path.exists(full_path):
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # Fallback to root index.html for SPA routes
        self.path = "/index.html"
        return http.server.SimpleHTTPRequestHandler.do_GET(self)


def main():
    parser = argparse.ArgumentParser(description='Simple SPA server with fallback to index.html')
    parser.add_argument('--port', type=int, default=5173)
    parser.add_argument('--dir', type=str, default='dist')
    args = parser.parse_args()

    directory = os.path.abspath(args.dir)
    if not os.path.exists(os.path.join(directory, 'index.html')):
        raise SystemExit(f"index.html not found in {directory}. Build first (npm run build).")

    handler = lambda *h_args, **h_kwargs: SpaRequestHandler(*h_args, directory=directory, **h_kwargs)
    with socketserver.TCPServer(('', args.port), handler) as httpd:
        print(f"Serving SPA from {directory} on http://localhost:{args.port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down...")


if __name__ == '__main__':
    main()


