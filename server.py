#!/usr/bin/env python3
"""
LifeFlow Production-Grade Dual HTTP / HTTPS Secure Server
Features:
- Multi-threaded non-blocking request processing (ThreadingHTTPServer)
- Dual Listeners: HTTP (Port 8080) & True TLS/SSL HTTPS (Port 8443)
- Injects Enterprise Cybersecurity Headers (HSTS, Anti-Clickjack, MIME nosniff, Server Masking)
- Full 3-Component Certificate Suite (CRT, KEY, CA Bundle)
"""

import http.server
import ssl
import threading
import os
import sys

DIRECTORY = os.path.dirname(os.path.abspath(__file__))
os.chdir(DIRECTORY)

SSL_CERT = os.path.join(DIRECTORY, "ssl", "certificate.crt")
SSL_KEY = os.path.join(DIRECTORY, "ssl", "private.key")
SSL_CA = os.path.join(DIRECTORY, "ssl", "ca_bundle.crt")

class SecureHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def version_string(self):
        # Mask server signature and OS details from automated reconnaissance scanners
        return "Secure-Edge-WAF/3.8"

    def end_headers(self):
        # 1. HSTS (Send only on HTTPS connections to prevent breaking plain HTTP)
        is_https = isinstance(self.request, ssl.SSLSocket) if hasattr(self, 'request') else False
        if is_https:
            self.send_header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

        # 2. Prevent MIME-type confusion attacks
        self.send_header("X-Content-Type-Options", "nosniff")
        
        # 3. Clickjacking Defense (Prevent embedding in malicious external iframes)
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        
        # 4. Browser Cross-Site Scripting (XSS) Filter
        self.send_header("X-XSS-Protection", "1; mode=block")
        
        # 5. Strict Referrer Policy
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        
        # 6. Restrict Sensitive Device Hardware APIs
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        
        # 7. WAF Shield Header
        self.send_header("X-Defense-Shield", "Active")
        
        super().end_headers()

    def do_GET(self):
        # Server-Level WAF check
        path_lower = self.path.lower()
        if any(bad in path_lower for bad in ["../", "..\\", "/etc/passwd", "<script", "union%20select"]):
            self.send_response(403)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(b"403 Forbidden: Blocked by Web Application Firewall (WAF).")
            return
        super().do_GET()

def start_http_server(port=8080):
    server = http.server.ThreadingHTTPServer(("0.0.0.0", port), SecureHTTPHandler)
    server.daemon_threads = True
    print(f"[*] HTTP Server running on http://localhost:{port}")
    server.serve_forever()

def start_https_server(port=8443):
    if not (os.path.exists(SSL_CERT) and os.path.exists(SSL_KEY)):
        print("[!] SSL certificate files missing. HTTPS listener skipped.")
        return

    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=SSL_CERT, keyfile=SSL_KEY)
    if os.path.exists(SSL_CA):
        context.load_verify_locations(cafile=SSL_CA)

    server = http.server.ThreadingHTTPServer(("0.0.0.0", port), SecureHTTPHandler)
    server.daemon_threads = True
    server.socket = context.wrap_socket(server.socket, server_side=True)
    print(f"[*] True TLS/SSL HTTPS Server running on https://localhost:{port}")
    server.serve_forever()

if __name__ == "__main__":
    http_port = 8080
    https_port = 8443

    # Start HTTPS server in dedicated background thread
    t_https = threading.Thread(target=start_https_server, args=(https_port,), daemon=True)
    t_https.start()

    # Run HTTP server on main thread
    try:
        start_http_server(http_port)
    except KeyboardInterrupt:
        print("\n[*] Server shutdown cleanly.")
        sys.exit(0)
