# LifeFlow | Universal Blood Bank Network

A real-world, production-ready Blood Bank Management Web Application that **runs directly on any system (Windows, Mac, Linux, Mobile)** in any modern browser without requiring PHP, Apache, XAMPP, or MySQL installations.

---

## 🔍 Search Engine Optimization (SEO) & Global Discovery

The website is engineered to be **100% crawlable, indexable, and rankable across all major search engines**:
- **Google Search** (Googlebot, Mobile-First Indexing)
- **Microsoft Bing** (Bingbot, IndexNow protocol)
- **Yahoo Search** (Powered automatically by Bing index)
- **DuckDuckGo** (Hybrid crawler network & Bing syndication)
- **Yandex & Baidu** (International search engines)

### 1. 📄 Discovery Directives & Feeds Installed
- **`robots.txt` ([`robots.txt`](robots.txt)):** Explicit directives welcoming Googlebot, Bingbot, Slurp (Yahoo), DuckDuckBot, Baiduspider, YandexBot, and Applebot while protecting private admin endpoints. Includes sitemap auto-discovery links.
- **`sitemap.xml` ([`sitemap.xml`](sitemap.xml)):** Search engine XML sitemap containing all public URLs with priorities, daily change frequencies, and Google Image metadata.
- **`sitemap.html` ([`sitemap.html`](sitemap.html)):** Human and bot-readable HTML directory for deep crawl discovery.

### 2. 🏷️ On-Page Technical SEO & Schema.org JSON-LD
- **Semantic Metadata:** Keywords, targeted descriptions, and canonical URL tags across all pages.
- **Google Rich Snippets (Schema.org JSON-LD):**
  - **`WebSite` with `SearchAction`:** Enables Google searchers to find specific blood groups directly from search engine result pages.
  - **`MedicalOrganization`:** Declares emergency 24/7 hotline (`1800-BLOOD-HELP`), medical blood matching service, and credentials.
  - **`FAQPage` Schema:** Powers Google Rich Answer dropdown boxes for blood donor eligibility and emergency blood finding questions.
- **Social & Messaging Previews:** Full Open Graph (`og:title`, `og:image`, `og:description`) and Twitter Cards for WhatsApp, Facebook, LinkedIn, and Twitter/X link sharing.

### 3. ⚡ IndexNow Protocol Integration
- Directly integrated into the **System Administration Portal (`admin.html`)**.
- Allows the administrator to send **instant push notifications** to Microsoft Bing, Yandex, Seznam, and Naver whenever new hospitals or blood stocks are added, bypassing typical multi-week crawling delays.

### 4. 🚀 How to Publish Live on a Public Domain (3 Methods)
Search engines require a publicly accessible URL to crawl:
1. **Netlify Drop (Free, 60 Seconds):** Visit [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `bloodbank-html` folder to get an instant HTTPS URL.
2. **GitHub Pages (Free):** Push this directory to a GitHub repository, go to **Settings ➔ Pages**, select branch `main`, and save.
3. **cPanel / Custom Hosting:** Upload `bloodbank-web-pages.zip` to `public_html` and extract.

Once live on your public URL, submit `https://yourdomain.com/sitemap.xml` to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters).

---

## 🔒 Enterprise Cybersecurity & SSL/TLS Architecture (Backend Managed)

The application implements defense-in-depth cybersecurity running **silently in the background**, with all monitoring, controls, and certificate configurations managed exclusively within the **System Administration Portal (`admin.html`)**. Public frontend pages (`index.html`, `login.html`, `register.html`, etc.) remain 100% clean, professional, and accessible.

### 1. 🛡️ Web Application Firewall (WAF) & Input Sanitization
- **SQL Injection (SQLi) Defense:** Continuously inspects form inputs for dangerous signatures (`UNION SELECT`, `' OR '1'='1'`, `--`, `DROP TABLE`, etc.).
- **Cross-Site Scripting (XSS) Filter:** Strips active scripts (`<script>`, `javascript:`, inline event handlers `onload=`, `onerror=`).
- **Path Traversal Shield:** Blocks directory traversal patterns (`../`, `..\`, `/etc/passwd`).

### 2. 🔐 Authentication & Session Hardening
- **Cryptographic Password Vault:** Passwords hashed with SHA-256 + cryptographic per-account salt. No plaintext credentials stored.
- **Brute-Force Rate Limiting:** Account lockout triggered after 5 consecutive failed attempts (configurable 3, 5, or 10 attempts in backend). 15-minute auto-unlock or manual administrator override.
- **Session Auto-Logout:** Automatic termination after 30 minutes of inactivity.
- **Tamper-Evident Security Audit Log:** Real-time event logging with JSON export capability for forensic compliance.

### 3. 📜 Full 3-Component SSL/TLS Certificate Installation Suite
All 3 required certificate components are generated and bundled inside the `ssl/` folder and accessible directly within `admin.html`:
1. **The Certificate (CRT) (`ssl/certificate.crt`):** X.509 PEM certificate (RSA 2048-bit, SHA-256) binding public key to domain identity (`localhost`, `*.bloodbank.org`).
2. **The Private Key (KEY) (`ssl/private.key`):** RSA-2048 PKCS#8 private key kept strictly on the backend.
3. **The CA Bundle / Intermediate Certificate (`ssl/ca_bundle.crt`):** Chains the certificate back up to the trusted root authority (`LifeFlow Global Root CA`). Crucial for eliminating "Not Secure" or "Not Trusted" warnings on mobile devices and browsers.
4. **Full Combined Chain (`ssl/server_bundle.pem`):** Pre-combined CRT + CA Bundle for modern reverse proxies (Nginx, HAProxy, Envoy).

### 4. 🌐 Web Server & Hosting Panel Deployment Guides
- **cPanel Installation:** 
  1. Open cPanel ➔ Security ➔ SSL/TLS ➔ Manage SSL Sites.
  2. Select Domain.
  3. Paste Certificate (CRT), Autofill Private Key (KEY), and paste CA Bundle (CABUNDLE).
  4. Click "Install Certificate".
- **Apache (`.htaccess` & `httpd-ssl.conf`):** Includes root `.htaccess` with permanent 301 HTTPS upgrade, HSTS (`max-age=31536000`), `X-Content-Type-Options: nosniff`, and `X-Frame-Options: SAMEORIGIN`.
- **Nginx:** Production `server { listen 443 ssl http2; ... }` configuration block.
- **Python Dual Server (`server.py`):** Multi-threaded `ThreadingHTTPServer` simultaneously serving:
  - **HTTP:** `http://localhost:8080` (with defensive security headers)
  - **HTTPS:** `https://localhost:8443` (True TLS 1.3/1.2 SSL with HSTS lockdown)

---

## 🌟 Real-World Blood Bank Management Features

### 1. 🛡️ System Administration Portal (`admin.html`)
- **Centralized Dashboard:** Real-time KPI counters (Hospitals, Active Donors, Recipients, Available Blood Units, Urgent & Pending Requests).
- **Hospitals & Receivers Hub:** Unified command center with live partner hospital inventory badges, registered receivers, and cross-network blood allocation matrix.
- **Add Blood Group & Units:** Modal to add units to any existing group or add rare groups (`Bombay Oh`, `Platelets`, `Plasma`).
- **Hospital Management:** Register new partner hospitals with license numbers, locations, and initial stock.
- **Voluntary Donors Registry:** Register voluntary donors with blood group, age, gender, contact details, donation history, and eligibility tracking. Record donations with 1 click (+1 unit added directly to stock).
- **Universal Database Tools (Runs on Any System):** Export JSON snapshot, Export MySQL `.sql`, Import JSON database, and Factory Reset.

### 2. 🏥 Complete Hospital Workflow
- **Inventory Management:** Add blood groups with bag/unit quantities and screening certification.
- **Quick Adjustments:** Increment (`+`) or decrement (`-`) stock bags on the fly.
- **Clinical Requisition Decisioning:** Review incoming requests with patient details, urgency grade, and clinical reason. Accept & allocate blood, or reject with feedback.

### 3. 👥 Patient & Recipient Features
- **Dual Location & Group Search:** Find blood by blood group and city or hospital name.
- **Graded Requisitions:** Request specific quantity of blood units with clinical urgency (Emergency / Urgent / Normal) and physician diagnosis.
- **Live Requisition Tracking:** View real-time fulfillment status (Accepted, Rejected, Under Review) with hospital address and emergency phone.

---

## 📁 File Structure

| Page | File | Description |
| :--- | :--- | :--- |
| **Home Page** | [`index.html`](index.html) | SEO-optimized hero, search widget, Schema.org JSON-LD, FAQ, blood matrix |
| **Find Blood** | [`abs.html`](abs.html) | Real-time inventory table with dual search & modal for submitting requests |
| **Sitemap Directory** | [`sitemap.html`](sitemap.html) | Human & crawler readable site index linking all public services |
| **XML Feed** | [`sitemap.xml`](sitemap.xml) | Standard XML sitemap for Googlebot, Bingbot, and webmaster tools |
| **Crawler Directives** | [`robots.txt`](robots.txt) | Search engine crawler permissions and indexation instructions |
| **Admin Portal** | [`admin.html`](admin.html) | Full administrative dashboard: hospitals, receivers, SEO center & SSL manager |
| **Login** | [`login.html`](login.html) | 3-tab login: Hospital, Recipient, and Administrator |
| **Register** | [`register.html`](register.html) | 3-tab registration: Hospital, Recipient, and Voluntary Donor |
| **Add Stock** | [`bloodinfo.html`](bloodinfo.html) | Hospital inventory manager with unit quantity adjustment (+ / -) |
| **Incoming Requests** | [`bloodrequest.html`](bloodrequest.html) | Hospital clinical requisition review & acceptance workflow |
| **My Requisitions** | [`sentrequest.html`](sentrequest.html) | Recipient request tracker with real-time status and cancel actions |
| **Hospital Profile** | [`hprofile.html`](hprofile.html) | Hospital contact and facility profile update |
| **Recipient Profile** | [`rprofile.html`](rprofile.html) | Patient / recipient contact and blood group profile update |
| **Core Database & State** | [`js/app.js`](js/app.js) | Universal client-side database, state manager, SQL/JSON exporter |
| **Cybersecurity Engine** | [`js/security.js`](js/security.js) | WAF, brute-force defense, password hasher, session hardening |
| **SSL/TLS Certificates** | [`ssl/`](ssl/) | Certificate (CRT), Private Key (KEY), CA Bundle, and Server Bundle PEM |
| **Production Server** | [`server.py`](server.py) | Python multi-threaded dual HTTP (8080) and HTTPS (8443) server |
| **Apache Config** | [`.htaccess`](.htaccess) | Force HTTPS 301, HSTS, and directory scan blocking |
| **Styles** | [`css/style.css`](css/style.css) | Clean Bootstrap-enhanced responsive styles and KPI cards |

---

## 🚀 Quick Start / How to Run

### Option 1: Direct File Access (No Server Needed)
Double-click [`index.html`](index.html) in any browser (Chrome, Edge, Firefox, Safari).

### Option 2: Production Dual HTTP & HTTPS Server
Run the included server:
```bash
python server.py
```
Then visit:
- **HTTPS (SSL/TLS Active):** `https://localhost:8443`
- **HTTP (Direct Fast Access):** `http://localhost:8080`
- **Sitemap Feed:** `http://localhost:8080/sitemap.xml`
- **Robots Directives:** `http://localhost:8080/robots.txt`
