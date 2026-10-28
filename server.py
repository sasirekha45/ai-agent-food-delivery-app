#!/usr/bin/env python3
"""
BiteAgent - Local Web Server
Runs a lightweight HTTP server on port 8000 and opens the web application in your default browser.
No external dependencies required!
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    handler = CustomHTTPRequestHandler
    
    # Try port 8000 or fallback if busy
    port = PORT
    for attempt in range(5):
        try:
            with socketserver.TCPServer(("", port), handler) as httpd:
                url = f"http://localhost:{port}"
                print("=" * 60)
                print(" 🍕 BiteAgent • AI-Powered Food Delivery Web App")
                print("=" * 60)
                print(f" > Server running at: {url}")
                print(f" > Serving files from: {DIRECTORY}")
                print(" > Press Ctrl+C in terminal to stop server.")
                print("=" * 60)
                
                # Open browser automatically
                webbrowser.open(url)
                
                httpd.serve_forever()
        except OSError:
            port += 1
            continue
        except KeyboardInterrupt:
            print("\nShutting down server. Goodbye!")
            sys.exit(0)

if __name__ == '__main__':
    main()
