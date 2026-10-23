/**
 * Blood Bank Management Web Application
 * Client-Side Database & State Management (Runs on Any System)
 */

const BloodBank = (function () {
    const STORAGE_KEY_DB = 'bloodbank_db';
    const STORAGE_KEY_SESSION = 'bloodbank_session';

    const INITIAL_DATA = {
        admin: {
            email: 'admin@bloodbank.com',
            password: 'admin',
            name: 'System Administrator'
        },
        hospitals: [
            { id: 1, hname: 'Gandhi Memorial Hospital', hemail: 'gandhi@gmail.com', hpassword: 'gandhi', hphone: '+91 7865376358', hcity: 'Delhi', address: '12 Medical Square, Connaught Place, New Delhi', license: 'DL-HOSP-2018-091', status: 'Active' },
            { id: 2, hname: 'City Care Super Specialty', hemail: 'unknown@gmail.com', hpassword: 'unknown', hphone: '+91 9876543267', hcity: 'Mumbai', address: '45 Health Boulevard, Andheri West, Mumbai', license: 'MH-HOSP-2019-114', status: 'Active' },
            { id: 3, hname: 'Apollo Lifeline Center', hemail: 'apollo@gmail.com', hpassword: 'apollo', hphone: '+91 9452109876', hcity: 'Bangalore', address: '88 Tech Park Road, Whitefield, Bangalore', license: 'KA-HOSP-2020-562', status: 'Active' }
        ],
        donors: [
            { id: 1, dname: 'Rahul Sharma', demail: 'rahul.donor@gmail.com', dphone: '+91 9811223344', dbg: 'O+', dcity: 'Delhi', dgender: 'Male', dage: 28, lastDonation: '2026-08-15', status: 'Eligible', unitsDonated: 4 },
            { id: 2, dname: 'Priya Verma', demail: 'priya.v@gmail.com', dphone: '+91 9822334455', dbg: 'A+', dcity: 'Mumbai', dgender: 'Female', dage: 25, lastDonation: '2026-07-20', status: 'Eligible', unitsDonated: 2 },
            { id: 3, dname: 'Amit Patel', demail: 'amit.patel@gmail.com', dphone: '+91 9833445566', dbg: 'B+', dcity: 'Bangalore', dgender: 'Male', dage: 34, lastDonation: '2026-09-02', status: 'Eligible', unitsDonated: 5 },
            { id: 4, dname: 'Sneha Roy', demail: 'sneha.roy@gmail.com', dphone: '+91 9844556677', dbg: 'AB-', dcity: 'Delhi', dgender: 'Female', dage: 30, lastDonation: '2026-05-10', status: 'Eligible', unitsDonated: 3 },
            { id: 5, dname: 'Vikram Singh', demail: 'vikram.s@gmail.com', dphone: '+91 9855667788', dbg: 'O-', dcity: 'Mumbai', dgender: 'Male', dage: 42, lastDonation: '2026-09-28', status: 'Eligible', unitsDonated: 7 }
        ],
        receivers: [
            { id: 1, rname: 'Suresh Kumar', remail: 'test@gmail.com', rpassword: 'test', rphone: '+91 8875643456', rbg: 'A+', rcity: 'Delhi', address: 'Plot 4, Model Town, Delhi', emergencyContact: '+91 9876501234' },
            { id: 2, rname: 'Anjali Gupta', remail: 'xyz@gmail.com', rpassword: 'xyz', rphone: '+91 8875643457', rbg: 'AB+', rcity: 'Mumbai', address: 'Flat 302, Sea Green Apts, Mumbai', emergencyContact: '+91 9876505678' },
            { id: 3, rname: 'Karan Mehra', remail: 'karan@gmail.com', rpassword: 'karan', rphone: '+91 8875643458', rbg: 'B+', rcity: 'Bangalore', address: '14 Indiranagar, Bangalore', emergencyContact: '+91 9876509988' }
        ],
        bloodinfo: [
            { bid: 1, hid: 1, bg: 'B+', units: 14, lastUpdated: '2026-10-20' },
            { bid: 2, hid: 1, bg: 'O+', units: 8, lastUpdated: '2026-10-21' },
            { bid: 3, hid: 1, bg: 'A+', units: 10, lastUpdated: '2026-10-22' },
            { bid: 4, hid: 1, bg: 'O-', units: 4, lastUpdated: '2026-10-19' },
            { bid: 5, hid: 2, bg: 'A+', units: 12, lastUpdated: '2026-10-22' },
            { bid: 6, hid: 2, bg: 'AB+', units: 6, lastUpdated: '2026-10-18' },
            { bid: 7, hid: 2, bg: 'B-', units: 5, lastUpdated: '2026-10-20' },
            { bid: 8, hid: 3, bg: 'O+', units: 18, lastUpdated: '2026-10-23' },
            { bid: 9, hid: 3, bg: 'B+', units: 9, lastUpdated: '2026-10-21' },
            { bid: 10, hid: 3, bg: 'A-', units: 3, lastUpdated: '2026-10-15' }
        ],
        bloodrequest: [
            { reqid: 1, hid: 1, rid: 1, bg: 'B+', units: 2, urgency: 'Urgent', reason: 'Emergency cardiac bypass surgery', reqDate: '2026-10-22', status: 'Pending' },
            { reqid: 2, hid: 2, rid: 2, bg: 'AB+', units: 1, urgency: 'Normal', reason: 'Scheduled orthopedic procedure', reqDate: '2026-10-21', status: 'Accepted' },
            { reqid: 3, hid: 3, rid: 3, bg: 'B+', units: 3, urgency: 'Emergency', reason: 'Severe trauma & blood loss', reqDate: '2026-10-23', status: 'Pending' }
        ]
    };

    function getDB() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_DB);
            if (!raw) {
                saveDB(INITIAL_DATA);
                return JSON.parse(JSON.stringify(INITIAL_DATA));
            }
            const parsed = JSON.parse(raw);
            // Automatic schema migration if older version exists
            let needsSave = false;
            if (!parsed.admin) { parsed.admin = INITIAL_DATA.admin; needsSave = true; }
            if (!parsed.donors) { parsed.donors = INITIAL_DATA.donors; needsSave = true; }
            if (!parsed.hospitals || parsed.hospitals.length === 0) { parsed.hospitals = INITIAL_DATA.hospitals; needsSave = true; }
            if (!parsed.receivers || parsed.receivers.length === 0) { parsed.receivers = INITIAL_DATA.receivers; needsSave = true; }
            if (!parsed.bloodinfo || parsed.bloodinfo.length === 0) { parsed.bloodinfo = INITIAL_DATA.bloodinfo; needsSave = true; }
            
            // Ensure units and urgency fields exist on all records
            parsed.bloodinfo.forEach(item => {
                if (item.units === undefined) { item.units = 5; needsSave = true; }
            });
            if (parsed.bloodrequest) {
                parsed.bloodrequest.forEach(req => {
                    if (req.units === undefined) { req.units = 1; needsSave = true; }
                    if (req.urgency === undefined) { req.urgency = 'Normal'; needsSave = true; }
                    if (!req.reason) { req.reason = 'Medical requirement'; needsSave = true; }
                });
            }

            if (needsSave) saveDB(parsed);
            return parsed;
        } catch (e) {
            console.error('Error reading database:', e);
            return JSON.parse(JSON.stringify(INITIAL_DATA));
        }
    }

    function saveDB(db) {
        localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(db));
    }

    function resetDB() {
        localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(INITIAL_DATA));
        localStorage.removeItem(STORAGE_KEY_SESSION);
        window.location.href = 'index.html?msg=Database restored to initial default data!';
    }

    function getSession() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_SESSION);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function setSession(sessionData) {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
    }

    function logout() {
        localStorage.removeItem(STORAGE_KEY_SESSION);
        window.location.href = 'login.html?msg=You have been logged out successfully.';
    }

    // Helper: Parse URL query params
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        if (!queryString) return params;
        const pairs = queryString.split('&');
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            if (pair[0]) {
                params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
        }
        return params;
    }

    // Render alert message banner
    function initMessages() {
        const params = getUrlParams();
        const container = document.getElementById('message-container');
        if (!container) return;

        let html = '';
        if (params.msg) {
            html = `
            <div class="row justify-content-center mb-3">
                <div class="col-md-7 col-sm-10 alert alert-success alert-dismissible fade show card shadow-sm" id="message">
                    <button type="button" class="close" data-dismiss="alert" title="close">&times;</button>
                    <i class="fas fa-check-circle mr-2 text-success"></i> ${escapeHtml(params.msg)}
                </div>
            </div>`;
        } else if (params.error) {
            html = `
            <div class="row justify-content-center mb-3">
                <div class="col-md-7 col-sm-10 alert error alert-danger alert-dismissible fade show card shadow-sm" id="message">
                    <button type="button" class="close" data-dismiss="alert" title="close">&times;</button>
                    <i class="fas fa-exclamation-triangle mr-2 text-danger"></i> ${escapeHtml(params.error)}
                </div>
            </div>`;
        }

        if (html) {
            container.innerHTML = html;
            setTimeout(() => {
                if ($('#message').length) {
                    $('#message').fadeOut('slow');
                }
            }, 6000);
        }
    }

    function showBanner(msg, isError = false) {
        const container = document.getElementById('message-container');
        if (!container) return;
        const alertClass = isError ? 'alert error alert-danger' : 'alert alert-success';
        const icon = isError ? 'fa-exclamation-triangle text-danger' : 'fa-check-circle text-success';
        container.innerHTML = `
        <div class="row justify-content-center mb-3">
            <div class="col-md-7 col-sm-10 ${alertClass} alert-dismissible fade show card shadow-sm" id="message">
                <button type="button" class="close" data-dismiss="alert" title="close">&times;</button>
                <i class="fas ${icon} mr-2"></i> ${escapeHtml(msg)}
            </div>
        </div>`;
        setTimeout(() => {
            if ($('#message').length) {
                $('#message').fadeOut('slow');
            }
        }, 5000);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Render dynamic header/navigation based on login status
    function initNavbar(activePage) {
        const navContainer = document.getElementById('mainNav');
        if (!navContainer) return;

        const session = getSession();

        let navLinks = '';
        if (session && session.type === 'admin') {
            navLinks = `
                <ul class="navbar-nav ml-auto align-items-center">
                    <li class="nav-item ${activePage === 'admin' ? 'active font-weight-bold' : ''}">
                        <a class="nav-link btn btn-outline-danger btn-sm text-danger mr-2 px-3" href="admin.html">
                            <i class="fas fa-shield-alt mr-1"></i> Admin Portal
                        </a>
                    </li>
                    <li class="nav-item ${activePage === 'abs' ? 'active' : ''}">
                        <a class="nav-link btn btn-light" href="abs.html">Available Blood</a>
                    </li>
                    <li class="nav-item">
                        <span class="nav-link badge badge-dark px-2 py-1 text-white mr-2">
                            <i class="fas fa-user-shield mr-1 text-warning"></i> Admin
                        </span>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-danger btn-sm font-weight-bold text-white px-3" href="javascript:void(0);" onclick="BloodBank.logout()">Logout</a>
                    </li>
                </ul>
            `;
        } else if (session && session.type === 'hospital') {
            navLinks = `
                <ul class="navbar-nav ml-auto align-items-center">
                    <li class="nav-item ${activePage === 'bloodinfo' ? 'active' : ''}">
                        <a class="nav-link btn btn-light" href="bloodinfo.html"><i class="fas fa-plus-circle text-danger mr-1"></i> Add Blood Info</a>
                    </li>
                    <li class="nav-item ${activePage === 'bloodrequest' ? 'active' : ''}">
                        <a class="nav-link btn btn-light" href="bloodrequest.html"><i class="fas fa-inbox text-info mr-1"></i> Blood Requests</a>
                    </li>
                    <li class="nav-item ${activePage === 'abs' ? 'active' : ''}">
                        <a class="nav-link btn btn-light" href="abs.html">Available Blood Samples</a>
                    </li>
                    <li class="nav-item ${activePage === 'hprofile' ? 'active' : ''}">
                        <a href="hprofile.html" class="nav-link btn font-weight-bold">
                            <img src="image/hospital.png" width="16" height="16" class="rounded-circle mr-1">
                            <mark>${escapeHtml(session.name)}</mark>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-danger btn-sm font-weight-bold text-white px-3" href="javascript:void(0);" onclick="BloodBank.logout()">Logout</a>
                    </li>
                </ul>
            `;
        } else if (session && session.type === 'receiver') {
            navLinks = `
                <ul class="navbar-nav ml-auto align-items-center">
                    <li class="nav-item ${activePage === 'sentrequest' ? 'active' : ''}">
                        <a class="nav-link btn btn-light" href="sentrequest.html"><i class="fas fa-paper-plane text-primary mr-1"></i> My Blood Requests</a>
                    </li>
                    <li class="nav-item ${activePage === 'abs' ? 'active' : ''}">
                        <a class="nav-link btn btn-light" href="abs.html">Available Blood Samples</a>
                    </li>
                    <li class="nav-item ${activePage === 'rprofile' ? 'active' : ''}">
                        <a href="rprofile.html" class="nav-link btn font-weight-bold">
                            <img src="image/user.png" width="16" height="16" class="rounded-circle mr-1">
                            <mark>${escapeHtml(session.name)}</mark>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-danger btn-sm font-weight-bold text-white px-3" href="javascript:void(0);" onclick="BloodBank.logout()">Logout</a>
                    </li>
                </ul>
            `;
        } else {
            navLinks = `
                <ul class="navbar-nav ml-auto align-items-center">
                    <li class="nav-item ${activePage === 'abs' ? 'active' : ''}">
                        <a class="nav-link btn btn-light" href="abs.html"><i class="fas fa-search text-danger mr-1"></i> Find Blood</a>
                    </li>
                    <li class="nav-item ${activePage === 'register' ? 'active' : ''}">
                        <a class="nav-link btn btn-light" href="register.html">Register</a>
                    </li>
                    <li class="nav-item ${activePage === 'login' ? 'active' : ''}">
                        <a class="nav-link btn btn-primary text-white font-weight-bold px-3" href="login.html">Login</a>
                    </li>
                </ul>
            `;
        }

        const navbarHtml = `
            <div class="container">
                <a class="navbar-brand text-danger font-weight-bold" href="index.html">
                    <img src="image/favicon.jpg" width="32" height="32" class="rounded-circle mr-2 border border-danger">LifeFlow Blood Bank
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="collapse navbar-collapse" id="collapsibleNavbar">
                    ${navLinks}
                </div>
            </div>
        `;

        navContainer.innerHTML = navbarHtml;

        // Ensure old demo bar element is removed if lingering
        const existingDemoBar = document.getElementById('demo-role-bar');
        if (existingDemoBar) {
            existingDemoBar.remove();
        }
    }

    // Footer renderer
    function initFooter() {
        const yearSpan = document.getElementById('yearSpan');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    // Database System-Wide Statistics
    function getStats() {
        const db = getDB();
        const totalUnits = db.bloodinfo.reduce((acc, curr) => acc + (parseInt(curr.units) || 0), 0);
        const pendingReqs = db.bloodrequest.filter(r => r.status === 'Pending').length;
        const acceptedReqs = db.bloodrequest.filter(r => r.status === 'Accepted').length;
        return {
            hospitalsCount: db.hospitals.length,
            donorsCount: db.donors.length,
            receiversCount: db.receivers.length,
            totalBloodUnits: totalUnits,
            requestsCount: db.bloodrequest.length,
            pendingRequestsCount: pendingReqs,
            acceptedRequestsCount: acceptedReqs
        };
    }

    // Export Database as JSON
    function exportDatabaseJSON() {
        const db = getDB();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "bloodbank_database_" + new Date().toISOString().slice(0, 10) + ".json");
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
    }

    // Export Database as MySQL .sql File
    function exportDatabaseSQL() {
        const db = getDB();
        let sql = `-- LifeFlow Blood Bank System SQL Dump\n-- Generated on: ${new Date().toISOString()}\n\n`;
        sql += `CREATE DATABASE IF NOT EXISTS \`bloodbank\`;\nUSE \`bloodbank\`;\n\n`;

        // Hospitals
        sql += `-- Table: hospitals\nDROP TABLE IF EXISTS \`hospitals\`;\n`;
        sql += `CREATE TABLE \`hospitals\` (\n  \`id\` int(11) NOT NULL AUTO_INCREMENT,\n  \`hname\` varchar(150) NOT NULL,\n  \`hemail\` varchar(150) NOT NULL UNIQUE,\n  \`hpassword\` varchar(100) NOT NULL,\n  \`hphone\` varchar(50) NOT NULL,\n  \`hcity\` varchar(100) NOT NULL,\n  \`address\` text,\n  \`license\` varchar(100),\n  PRIMARY KEY (\`id\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
        db.hospitals.forEach(h => {
            sql += `INSERT INTO \`hospitals\` VALUES (${h.id}, '${escapeSQL(h.hname)}', '${escapeSQL(h.hemail)}', '${escapeSQL(h.hpassword)}', '${escapeSQL(h.hphone)}', '${escapeSQL(h.hcity)}', '${escapeSQL(h.address || '')}', '${escapeSQL(h.license || '')}');\n`;
        });

        // Donors
        sql += `\n-- Table: donors\nDROP TABLE IF EXISTS \`donors\`;\n`;
        sql += `CREATE TABLE \`donors\` (\n  \`id\` int(11) NOT NULL AUTO_INCREMENT,\n  \`dname\` varchar(150) NOT NULL,\n  \`demail\` varchar(150),\n  \`dphone\` varchar(50) NOT NULL,\n  \`dbg\` varchar(10) NOT NULL,\n  \`dcity\` varchar(100) NOT NULL,\n  \`dgender\` varchar(20),\n  \`dage\` int(4),\n  \`lastDonation\` date,\n  \`status\` varchar(50) DEFAULT 'Eligible',\n  \`unitsDonated\` int(11) DEFAULT 0,\n  PRIMARY KEY (\`id\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
        db.donors.forEach(d => {
            sql += `INSERT INTO \`donors\` VALUES (${d.id}, '${escapeSQL(d.dname)}', '${escapeSQL(d.demail || '')}', '${escapeSQL(d.dphone)}', '${escapeSQL(d.dbg)}', '${escapeSQL(d.dcity)}', '${escapeSQL(d.dgender || '')}', ${d.dage || 0}, '${d.lastDonation || ''}', '${escapeSQL(d.status || 'Eligible')}', ${d.unitsDonated || 0});\n`;
        });

        // Receivers
        sql += `\n-- Table: receivers\nDROP TABLE IF EXISTS \`receivers\`;\n`;
        sql += `CREATE TABLE \`receivers\` (\n  \`id\` int(11) NOT NULL AUTO_INCREMENT,\n  \`rname\` varchar(150) NOT NULL,\n  \`remail\` varchar(150) NOT NULL UNIQUE,\n  \`rpassword\` varchar(100) NOT NULL,\n  \`rphone\` varchar(50) NOT NULL,\n  \`rbg\` varchar(10) NOT NULL,\n  \`rcity\` varchar(100) NOT NULL,\n  \`address\` text,\n  \`emergencyContact\` varchar(50),\n  PRIMARY KEY (\`id\`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
        db.receivers.forEach(r => {
            sql += `INSERT INTO \`receivers\` VALUES (${r.id}, '${escapeSQL(r.rname)}', '${escapeSQL(r.remail)}', '${escapeSQL(r.rpassword)}', '${escapeSQL(r.rphone)}', '${escapeSQL(r.rbg)}', '${escapeSQL(r.rcity)}', '${escapeSQL(r.address || '')}', '${escapeSQL(r.emergencyContact || '')}');\n`;
        });

        // Bloodinfo
        sql += `\n-- Table: bloodinfo\nDROP TABLE IF EXISTS \`bloodinfo\`;\n`;
        sql += `CREATE TABLE \`bloodinfo\` (\n  \`bid\` int(11) NOT NULL AUTO_INCREMENT,\n  \`hid\` int(11) NOT NULL,\n  \`bg\` varchar(10) NOT NULL,\n  \`units\` int(11) NOT NULL DEFAULT 1,\n  \`lastUpdated\` date,\n  PRIMARY KEY (\`bid\`),\n  FOREIGN KEY (\`hid\`) REFERENCES \`hospitals\`(\`id\`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
        db.bloodinfo.forEach(b => {
            sql += `INSERT INTO \`bloodinfo\` VALUES (${b.bid}, ${b.hid}, '${escapeSQL(b.bg)}', ${b.units || 1}, '${b.lastUpdated || ''}');\n`;
        });

        // Bloodrequest
        sql += `\n-- Table: bloodrequest\nDROP TABLE IF EXISTS \`bloodrequest\`;\n`;
        sql += `CREATE TABLE \`bloodrequest\` (\n  \`reqid\` int(11) NOT NULL AUTO_INCREMENT,\n  \`hid\` int(11) NOT NULL,\n  \`rid\` int(11) NOT NULL,\n  \`bg\` varchar(10) NOT NULL,\n  \`units\` int(11) NOT NULL DEFAULT 1,\n  \`urgency\` varchar(50) DEFAULT 'Normal',\n  \`reason\` text,\n  \`reqDate\` date,\n  \`status\` varchar(50) DEFAULT 'Pending',\n  PRIMARY KEY (\`reqid\`),\n  FOREIGN KEY (\`hid\`) REFERENCES \`hospitals\`(\`id\`) ON DELETE CASCADE,\n  FOREIGN KEY (\`rid\`) REFERENCES \`receivers\`(\`id\`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
        db.bloodrequest.forEach(rq => {
            sql += `INSERT INTO \`bloodrequest\` VALUES (${rq.reqid}, ${rq.hid}, ${rq.rid}, '${escapeSQL(rq.bg)}', ${rq.units || 1}, '${escapeSQL(rq.urgency || 'Normal')}', '${escapeSQL(rq.reason || '')}', '${rq.reqDate || ''}', '${escapeSQL(rq.status || 'Pending')}');\n`;
        });

        function escapeSQL(text) {
            return String(text || '').replace(/'/g, "''");
        }

        const dataStr = "data:text/sql;charset=utf-8," + encodeURIComponent(sql);
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "bloodbank_export_" + new Date().toISOString().slice(0, 10) + ".sql");
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
    }

    // Import Database from JSON String
    function importDatabaseJSON(jsonStr) {
        try {
            const parsed = JSON.parse(jsonStr);
            if (!parsed.hospitals || !parsed.receivers || !parsed.bloodinfo) {
                throw new Error("Invalid Blood Bank database file structure.");
            }
            saveDB(parsed);
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    // Public API
    return {
        getDB,
        saveDB,
        resetDB,
        getSession,
        setSession,
        logout,
        getUrlParams,
        initMessages,
        showBanner,
        initNavbar,
        initFooter,
        escapeHtml,
        getStats,
        exportDatabaseJSON,
        exportDatabaseSQL,
        importDatabaseJSON
    };
})();
