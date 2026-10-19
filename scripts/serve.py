"""Serve the actual release build with SPA routes for local acceptance testing."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
import os
ROOT = Path(__file__).resolve().parent.parent / 'dist'
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def do_GET(self):
        route = urlsplit(self.path).path
        if not Path(route).suffix and not (ROOT / route.lstrip('/')).is_file():
            self.path = '/index.html'
        return super().do_GET()
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
port = int(os.environ.get('PORT', '5178'))
print(f'Contract: http://localhost:{port}', flush=True)
ThreadingHTTPServer.request_queue_size = 128
ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
