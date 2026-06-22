import { initClientHeader } from "../components/AppHeader.js";
import { initClientSidebar } from "../components/AppSidebar.js";
import { initAIPanel } from "../components/AIPanel.js";

/* =========================================================
   PasayBiz Portal — client-dashboard.js
   Fully dynamic: Portfolio, Returns, Assessments, Payment
   History, Receipt (last-clicked), Audit Logs, Settings
   ========================================================= */

'use strict';

/* =========================================================
   1) CONFIG
   ========================================================= */
const CONFIG = {
    storageKey: 'pasaybiz_data',

    office: {
        name: "Pasay City Treasurer's Office",
        division: 'Revenue & Tax Management Division',
        address: 'F.B. Harrison St., Pasay City, Metro Manila',
    },

    assessorContact: {
        name: 'Atty. Maria Rosario Santos',
        title: 'City Assessor',
        email: 'assessor@pasay.gov.ph',
        phone: '(02) 8551-2345 local 401',
        officeHours: 'Monday–Friday, 8:00 AM – 5:00 PM',
    },

    supportContact: {
        generalEmail: 'support@pasaybiz.gov.ph',
        generalPhone: '(02) 8551-2345',
        hotline: '8888 (Pasay City Hotline)',
        officeHours: 'Monday–Friday, 8:00 AM – 5:00 PM',
        address: 'Pasay City Hall, F.B. Harrison St., Pasay City, Metro Manila',
    },

    taxBrackets: [
        { minTaxable: 5000000, rate: 0.0200, label: '2.00%' },
        { minTaxable: 2000000, rate: 0.0175, label: '1.75%' },
        { minTaxable: 0,       rate: 0.0150, label: '1.50%' },
    ],

    fees: {
        regulatory: { desc: 'Section 4C-02: Local Environmental Regulatory Fee', amount: 200 },
    },

    mayorsPermit: {
        baseFee: 3000,
        additionalFeePerMillion: 500,
        maxFee: 25000,
    },

    newBusinessValidation: {
        nameMinLength: 3,
        nameMaxLength: 80,
        // Letters, numbers, spaces, and common business-name punctuation only.
        namePattern: /^[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜàáâãäåçèéêëìíîïñòóôõöùúûü0-9 .,'&\-]+$/,
        addressMinLength: 8,
        addressMaxLength: 150,
        typeMinLength: 2,
        typeMaxLength: 50,
        grossSalesMin: 1,
        grossSalesMax: 1000000000, // ₱1 billion ceiling — same scale as the filing form
    },

    // Minimal illustrative list — a production system would use a maintained
    // word list or third-party moderation API instead of a hardcoded array.
    blockedWords: ['fuck', 'shit', 'bitch', 'asshole', 'bastard'],

    businessTypes: [
        'Food & Beverage', 'Retail', 'IT Services', 'Health & Wellness',
        'Real Estate', 'Manufacturing', 'Professional Services',
        'Construction', 'Education', 'Transportation & Logistics', 'General',
    ],

    paymentModes: [
        'Electronic Fund Transfer',
        'Online Banking',
        'Counter Payment',
        'GCash / Maya',
    ],

    fileUpload: {
        maxSizeBytes: 5 * 1024 * 1024, // 5 MB
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
    },

    activeStatuses: ['Assessment Received', 'Pending Review', 'Overdue'],

    businessIcons: ['fa-store', 'fa-laptop-code', 'fa-building', 'fa-utensils', 'fa-spa', 'fa-industry', 'fa-truck'],

    statusColors: {
        'Assessment Received': 'status-received',
        'Filed':               'status-received',
        'Paid':                'status-received',
        'Success':             'status-received',
        'Active':              'status-received',
        'Pending Review':      'status-pending',
        'Pending Renewal':     'status-pending',
        'Overdue':             'status-missing',
        'Archived':            'status-missing',
    },
    defaultStatusColor: 'status-pending',

    settingsToggles: [
        { key: 'autoReminders', label: 'Automated Payment Reminders', desc: 'Receive automated reminders 30, 14, and 7 days before tax deadlines.' },
        { key: 'emailAlerts',   label: 'Email Notifications',          desc: 'Send assessment and receipt notifications to your registered email.' },
        { key: 'smsAlerts',     label: 'SMS Alerts',                   desc: 'Receive SMS alerts for critical deadlines and payment confirmations.' },
        { key: 'autoFiling',    label: 'Auto-File Assessment Drafts',  desc: 'Automatically draft assessment filings 48 hours before due dates.' },
        { key: 'darkMode',      label: 'Dark Mode Interface',          desc: 'Enable the dark theme for the portal interface.' },
    ],

    assessmentStatuses: ['Assessment Received', 'Pending Review', 'Filed', 'Overdue'],

    filing: {
        deadlineMonthsFromNow: 2,
    },
};

/* =========================================================
   2) SEED DATA
   ========================================================= */
const SEED_DATA = {
    settings: {
        name: 'Juan Dela Cruz',
        email: 'compliance@thedailygrind.com',
        phone: '+63 917 123 4567',
        language: 'English',
        toggles: {
            autoReminders: true,
            emailAlerts: true,
            smsAlerts: false,
            autoFiling: false,
            darkMode: true,
        }
    },

    businesses: [
        {
            id: 'BIZ-001',
            name: 'The Daily Grind Café',
            icon: 'fa-mug-hot',
            type: 'Food & Beverage',
            taxId: 'PX-1234',
            address: 'Mall of Asia Complex, Pasay City',
            grossSales: 1000000,
            status: 'Active',
            lastFiled: '2024-01-15',
            permitExpiry: '2025-12-31',
        },
        {
            id: 'BIZ-002',
            name: 'TechHub Solutions',
            icon: 'fa-laptop-code',
            type: 'IT Services',
            taxId: 'PX-5678',
            address: 'CyberPark Tower, Pasay City',
            grossSales: 3500000,
            status: 'Active',
            lastFiled: '2024-02-20',
            permitExpiry: '2025-12-31',
        },
        {
            id: 'BIZ-003',
            name: 'Green Leaf Wellness',
            icon: 'fa-spa',
            type: 'Health & Wellness',
            taxId: 'PX-9012',
            address: 'Roxas Blvd., Pasay City',
            grossSales: 800000,
            status: 'Active',
            lastFiled: '2023-11-10',
            permitExpiry: '2025-06-30',
        },
        {
            id: 'BIZ-004',
            name: 'Star Realty Group',
            icon: 'fa-building',
            type: 'Real Estate',
            taxId: 'PX-3456',
            address: 'Finance Drive, Pasay City',
            grossSales: 8000000,
            status: 'Pending Renewal',
            lastFiled: '2023-09-05',
            permitExpiry: '2024-12-31',
        },
    ],

    assessments: [
        {
            id: 'ASMT-2024-001',
            bizId: 'BIZ-001',
            period: 'Fiscal Year 2024',
            category: 'Annual Gross Tax',
            deadline: '2024-11-30',
            amountDue: 145200.00,
            status: 'Assessment Received',
            auditRef: 'AUD-2024-88A',
        },
        {
            id: 'ASMT-2024-002',
            bizId: 'BIZ-002',
            period: 'Fiscal Year 2024',
            category: 'Annual Gross Tax',
            deadline: '2024-12-15',
            amountDue: 61250.00,
            status: 'Pending Review',
            auditRef: 'AUD-2024-91B',
        },
        {
            id: 'ASMT-2023-003',
            bizId: 'BIZ-003',
            period: 'Fiscal Year 2023',
            category: 'Quarterly Declaration',
            deadline: '2024-01-31',
            amountDue: 12000.00,
            status: 'Filed',
            auditRef: 'AUD-2023-77C',
        },
        {
            id: 'ASMT-2024-004',
            bizId: 'BIZ-004',
            period: 'Fiscal Year 2024',
            category: 'Annual Gross Tax',
            deadline: '2024-10-01',
            amountDue: 160000.00,
            status: 'Overdue',
            auditRef: 'AUD-2024-55D',
        },
        {
            id: 'ASMT-2024-005',
            bizId: 'BIZ-001',
            period: 'Fiscal Year 2024',
            category: 'Quarterly Filing',
            deadline: '2024-12-31',
            amountDue: 36300.00,
            status: 'Assessment Received',
            auditRef: 'AUD-2024-92E',
        },
        {
            id: 'ASMT-2024-006',
            bizId: 'BIZ-003',
            period: 'Fiscal Year 2024',
            category: 'Annual Gross Tax',
            deadline: '2025-01-15',
            amountDue: 11285.00,
            status: 'Pending Review',
            auditRef: 'AUD-2024-93F',
        },
        {
            id: 'ASMT-2024-007',
            bizId: 'BIZ-002',
            period: 'Fiscal Year 2024',
            category: 'Quarterly Filing',
            deadline: '2024-11-15',
            amountDue: 15300.00,
            status: 'Assessment Received',
            auditRef: 'AUD-2024-94G',
        },
    ],

    payments: [
        {
            id: 'OR-987654321',
            bizId: 'BIZ-001',
            assessmentId: 'ASMT-2024-001',
            date: '2026-06-13',
            type: 'Annual Gross Tax',
            amount: 145200.00,
            surcharge: 0,
            mode: 'Electronic Fund Transfer',
            status: 'Paid',
            period: 'Fiscal Year 2024',
            auditRef: 'AUD-2024-88A',
            items: [
                { desc: 'Section 2A-01: Municipal Gross Tax on Retailers (Food Services)', base: 1000000, rate: '1.45%', total: 145000 },
                { desc: 'Section 4C-02: Local Environmental Regulatory Fee', base: null, rate: 'Flat Rate', total: 200 },
            ],
        },
        {
            id: 'OR-876543210',
            bizId: 'BIZ-002',
            assessmentId: 'ASMT-2024-002',
            date: '2024-03-12',
            type: 'Annual Gross Tax',
            amount: 61250.00,
            surcharge: 0,
            mode: 'Online Banking',
            status: 'Paid',
            period: 'Fiscal Year 2023',
            auditRef: 'AUD-2023-91B',
            items: [
                { desc: 'Section 2B-01: Municipal Gross Tax on IT Services', base: 3500000, rate: '1.75%', total: 61250 },
            ],
        },
        {
            id: 'OR-765432109',
            bizId: 'BIZ-003',
            assessmentId: 'ASMT-2023-003',
            date: '2024-01-20',
            type: 'Quarterly Declaration',
            amount: 12000.00,
            surcharge: 0,
            mode: 'Counter Payment',
            status: 'Paid',
            period: 'Q4 2023',
            auditRef: 'AUD-2023-77C',
            items: [
                { desc: 'Section 3A-01: Municipal Gross Tax on Health & Wellness', base: 800000, rate: '1.50%', total: 12000 },
            ],
        },
        {
            id: 'OR-654321098',
            bizId: 'BIZ-001',
            assessmentId: null,
            date: '2023-06-30',
            type: 'Mayor\'s Permit Renewal',
            amount: 5000.00,
            surcharge: 0,
            mode: 'Electronic Fund Transfer',
            status: 'Paid',
            period: 'FY 2023',
            auditRef: 'AUD-2023-11X',
            items: [
                { desc: 'Mayor\'s Permit Renewal Fee – Food Services', base: null, rate: 'Flat Rate', total: 5000 },
            ],
        },
    ],

    auditLogs: [
        { ts: '2026-06-13 17:13', ref: 'OR-987654321',  bizId: 'BIZ-001', action: 'Payment Processed', amount: 145200, status: 'Success' },
        { ts: '2024-03-12 09:45', ref: 'OR-876543210',  bizId: 'BIZ-002', action: 'Payment Processed', amount: 61250,  status: 'Success' },
        { ts: '2024-01-20 14:22', ref: 'OR-765432109',  bizId: 'BIZ-003', action: 'Payment Processed', amount: 12000,  status: 'Success' },
        { ts: '2023-06-30 11:00', ref: 'OR-654321098',  bizId: 'BIZ-001', action: 'Permit Renewal',    amount: 5000,   status: 'Success' },
        { ts: '2024-01-15 08:30', ref: 'ASMT-2024-001', bizId: 'BIZ-001', action: 'Assessment Filed',  amount: null,   status: 'Filed' },
        { ts: '2024-02-20 10:10', ref: 'ASMT-2024-002', bizId: 'BIZ-002', action: 'Assessment Filed',  amount: null,   status: 'Filed' },
    ],

    // Initialize with the first payment as the last viewed receipt
    lastViewedReceiptId: 'OR-987654321',
};

/* =========================================================
   3) DATA STORE
   ========================================================= */
const STORE_KEY = CONFIG.storageKey;

function loadStore() {
    let raw = null;
    try {
        raw = localStorage.getItem(STORE_KEY);
    } catch (err) {
        console.error('Could not read saved data:', err);
    }
    if (raw) {
        try {
            const data = JSON.parse(raw);
            if (!data.lastViewedReceiptId && data.payments && data.payments.length > 0) {
                data.lastViewedReceiptId = data.payments[0].id;
            }
            return data;
        } catch (err) {
            console.error('Saved data was corrupted, reseeding:', err);
        }
    }
    const seed = JSON.parse(JSON.stringify(SEED_DATA));
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(seed));
    } catch (err) {
        console.error('Could not persist initial data:', err);
    }
    return seed;
}

function saveStore(store) {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
        showSaveIndicator(true);
    } catch (err) {
        console.error('Save failed:', err);
        showSaveIndicator(false);
    }
}

function showSaveIndicator(success) {
    let el = document.getElementById('pb-save-indicator');
    if (!el) {
        el = document.createElement('span');
        el.id = 'pb-save-indicator';
        el.style.cssText = `
            font-size:0.75rem; font-weight:600; margin-right:10px;
            display:inline-flex; align-items:center; gap:6px;
            transition:opacity 0.4s; opacity:0;`;
        const navLeft = document.querySelector('.navbar-left');
        if (navLeft) navLeft.appendChild(el);
        else return;
    }
    el.innerHTML = success
        ? '<i class="fa-solid fa-circle-check" style="color:#00A86B"></i> Saved'
        : '<i class="fa-solid fa-triangle-exclamation" style="color:#EF4444"></i> Save failed';
    el.style.opacity = '1';
    clearTimeout(el._to);
    el._to = setTimeout(() => { el.style.opacity = '0'; }, 1800);
}

let DB = loadStore();

function peso(n) {
    if (n == null) return '--';
    return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(str) {
    if (!str) return '--';
    const d = new Date(str);
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getBiz(id) { return DB.businesses.find(b => b.id === id); }

function getActiveBusinesses() { return DB.businesses.filter(b => !b.archived); }

function statusBadge(s) {
    const cls = CONFIG.statusColors[s] || CONFIG.defaultStatusColor;
    return `<span class="lbl-status ${cls}">${s}</span>`;
}

function genOR() {
    return 'OR-' + Math.floor(100000000 + Math.random() * 900000000);
}

function nowTs() {
    return new Date().toISOString().replace('T', ' ').slice(0, 16);
}

/* Attaches a live "X / max" character counter to an input/textarea.
   Turns red and near the limit as a soft warning, consistent with the
   "live counter shown; block submit if exceeded" pattern used app-wide. */
function attachCharCounter(inputId, counterId, maxLength) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    if (!input || !counter) return;

    const update = () => {
        const len = input.value.length;
        counter.textContent = `${len} / ${maxLength}`;
        counter.style.color = len >= maxLength ? '#EF4444' : (len >= maxLength * 0.9 ? '#F59E0B' : 'var(--text-muted)');
    };
    input.addEventListener('input', update);
    update();
}

/* Disables a button and swaps in a spinner for the duration of `action`.
   Re-enables the button only if `action` throws/returns false — on success
   the button should usually stay disabled because the view changes anyway. */
function withSubmitLock(btn, action) {
    if (!btn || btn.disabled) return;
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

    let result;
    try {
        result = action();
    } catch (err) {
        console.error('Action failed:', err);
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        return;
    }

    if (result === false) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    } else {
        // Re-enable shortly after so the button isn't permanently stuck
        // if the user navigates back to this same view/form.
        setTimeout(() => { btn.disabled = false; btn.innerHTML = originalHTML; }, 1200);
    }
}

function containsProfanity(text) {
    const lower = text.toLowerCase();
    return CONFIG.blockedWords.some(w => lower.includes(w));
}

/* Returns true (valid) only if the trimmed value is non-empty and at
   least minLength characters — whitespace-only input is treated as empty. */
function isNonEmptyTrimmed(value, minLength = 1) {
    return !!value && value.trim().length >= minLength;
}

function calcTax(gross, exempt) {
    const taxable = Math.max(0, gross - exempt);
    const bracket = CONFIG.taxBrackets.find(b => taxable > b.minTaxable) || CONFIG.taxBrackets[CONFIG.taxBrackets.length - 1];
    const fee = CONFIG.fees.regulatory.amount;
    const tax = taxable * bracket.rate;
    return { taxable, rate: bracket.rate, rateLabel: bracket.label, fee, total: tax + fee };
}

function calcMayorsPermitFee(grossSales) {
    if (!grossSales || grossSales <= 0) return CONFIG.mayorsPermit.baseFee;
    const millions = Math.ceil(grossSales / 1000000);
    let fee = CONFIG.mayorsPermit.baseFee + (millions * CONFIG.mayorsPermit.additionalFeePerMillion);
    return Math.min(fee, CONFIG.mayorsPermit.maxFee);
}

function isActiveStatus(status) {
    return CONFIG.activeStatuses.includes(status);
}

function getActiveAssessments() {
    return DB.assessments.filter(a => {
        if (!isActiveStatus(a.status)) return false;
        const biz = getBiz(a.bizId);
        return biz && !biz.archived;
    });
}

function describeTaxBrackets() {
    const sorted = [...CONFIG.taxBrackets].sort((a, b) => a.minTaxable - b.minTaxable);
    return sorted.map((b, i) => {
        const next = sorted[i + 1];
        if (i === 0) return `${b.label} of annual gross sales for income up to ₱${(next ? next.minTaxable : b.minTaxable) / 1000000}M`;
        if (next) return `${b.label} for ₱${b.minTaxable / 1000000}M–${next.minTaxable / 1000000}M`;
        return `${b.label} above ₱${b.minTaxable / 1000000}M`;
    }).join(', ');
}

/* =========================================================
   5) VIEW NAVIGATION
   ========================================================= */
const VIEWS = ['dashboard','portfolio','assessments','history','file-assessment',
                'receipt','general-history','settings','create-application'];

function showView(name) {
    VIEWS.forEach(v => {
        const el = document.getElementById('view-' + v);
        if (el) el.classList.toggle('hidden', v !== name);
    });
    document.querySelectorAll('.menu-item').forEach(a => a.classList.remove('active'));
    const navEl = document.getElementById('nav-' + name);
    if (navEl) navEl.classList.add('active');

    switch (name) {
        case 'dashboard':        renderDashboard();       break;
        case 'portfolio':        renderPortfolioAssets(); break;
        case 'assessments':      renderAssessmentsView(); break;
        case 'history':          renderPaymentHistory();  break;
        case 'general-history':  renderAuditLogs();       break;
        case 'settings':         renderSettings();        break;
        case 'receipt':          renderReceipt();         break;
        case 'create-application': renderCreateApp();     break;
    }
}
window.showView = showView; 

/* =========================================================
   6) DASHBOARD VIEW
   ========================================================= */
function renderDashboard() {
    renderPortfolioGrid();
    renderActiveTaxAssessment();
    renderLedger();
    bindDashboardActionButtons();
}

function renderPortfolioGrid() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    grid.innerHTML = getActiveBusinesses().map(b => `
        <div class="biz-card">
            <div class="biz-icon"><i class="fa-solid ${b.icon}"></i></div>
            <h4>${b.name}</h4>
            <div class="biz-details">
                <p><span>Type</span><span>${b.type}</span></p>
                <p><span>Tax ID</span><span>${b.taxId}</span></p>
                <p><span>Last Filed</span><span>${fmtDate(b.lastFiled)}</span></p>
                <p><span>Status</span><span style="color:var(--accent-green)">${b.status}</span></p>
            </div>
            <div class="biz-actions">
                <button class="btn btn-blue" onclick="viewReturnsForBiz('${b.id}')">Returns</button>
                <button class="btn btn-secondary" onclick="fileReturnForBiz('${b.id}')">File</button>
            </div>
        </div>`).join('');
}

function renderActiveTaxAssessment() {
    const box = document.getElementById('active-assessment-box');
    if (!box) return;

    const activeAssessments = getActiveAssessments()
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    if (activeAssessments.length === 0) {
        box.innerHTML = `
            <div style="text-align:center; padding:30px 20px;">
                <i class="fa-solid fa-circle-check" style="font-size:2.5rem; color:var(--accent-green); margin-bottom:15px; display:block;"></i>
                <p style="font-weight:600; color:var(--accent-green); margin-bottom:8px;">All Clear!</p>
                <p style="font-size:0.8rem; color:var(--text-muted);">No active assessments pending.</p>
                <button class="btn btn-blue btn-block" style="margin-top:20px;" onclick="showView('create-application')">
                    <i class="fa-solid fa-file-circle-plus"></i> File New Assessment
                </button>
            </div>`;
        return;
    }

    const a = activeAssessments[0];
    const biz = getBiz(a.bizId);
    if (!biz) return;

    const deadlineDate = new Date(a.deadline);
    const today = new Date();
    const isOverdue = deadlineDate < today;
    const daysUntilDeadline = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    let deadlineClass = '';
    let deadlineIcon = '';
    let deadlineLabel = '';

    if (isOverdue) {
        deadlineClass = 'color:var(--color-red); font-weight:600;';
        deadlineIcon = '<i class="fa-solid fa-triangle-exclamation" style="color:var(--color-red); margin-right:4px;"></i>';
        deadlineLabel = 'Overdue';
    } else if (daysUntilDeadline <= 7) {
        deadlineClass = 'color:#F59E0B; font-weight:600;';
        deadlineIcon = '<i class="fa-solid fa-clock" style="color:#F59E0B; margin-right:4px;"></i>';
        deadlineLabel = `${daysUntilDeadline} day${daysUntilDeadline > 1 ? 's' : ''} remaining`;
    } else {
        deadlineLabel = `${daysUntilDeadline} days remaining`;
    }

    const totalActive = activeAssessments.length;
    const assessmentCountText = totalActive > 1 
        ? `<span style="font-size:0.7rem; color:var(--text-muted); display:block; margin-top:4px;">
             +${totalActive - 1} more active assessment${totalActive > 2 ? 's' : ''}
           </span>`
        : '';

    box.innerHTML = `
        <div class="assessment-title">
            <div class="biz-icon">
                <i class="fa-solid ${biz.icon}"></i>
            </div>
            <div>
                <span style="font-weight:600;">${biz.name}</span>
                ${assessmentCountText}
            </div>
        </div>
        <div class="assessment-body">
            <p><span>Status:</span><strong>${a.status}</strong></p>
            <p><span>Assessment:</span><span style="font-size:0.8rem;">${a.category}</span></p>
            <p><span>Period:</span><span>${a.period}</span></p>
            <p><span>Deadline:</span>
                <span style="${deadlineClass}">
                    ${deadlineIcon} ${fmtDate(a.deadline)}
                    <span style="font-size:0.72rem; display:block;">${deadlineLabel}</span>
                </span>
            </p>
            <p><span>Amount Due:</span><span class="amount">${peso(a.amountDue)}</span></p>
        </div>
        <button class="btn btn-primary btn-block" onclick="handlePayNow('${a.id}')">
            <i class="fa-solid fa-credit-card"></i> Pay Now
        </button>
        <button class="btn btn-secondary btn-block" style="margin-top:8px" onclick="showView('create-application')">
            <i class="fa-solid fa-file-pen"></i> File New Assessment
        </button>
        ${totalActive > 1 ? `
        <button class="btn btn-blue btn-block" style="margin-top:8px; background-color:transparent; border:1px solid var(--accent-blue); color:var(--accent-blue);" 
                onclick="showView('assessments')">
            <i class="fa-solid fa-list-check"></i> View All Active (${totalActive})
        </button>` : ''}`;
}

function renderLedger() {
    const tbody = document.getElementById('ledger-tbody');
    if (!tbody) return;
    tbody.innerHTML = DB.payments.slice(0, 6).map(p => {
        const biz = getBiz(p.bizId);
        return `<tr>
            <td>${fmtDate(p.date)}</td>
            <td>${biz ? biz.name : p.bizId}<br><span class="cell-sm-text" style="color:var(--text-muted)">${p.type}</span></td>
            <td>${peso(p.amount)}</td>
            <td>${statusBadge(p.status)} <a class="rcpt-link" onclick="openReceipt('${p.id}')"><i class="fa-solid fa-receipt"></i></a></td>
        </tr>`;
    }).join('');
}

function bindDashboardActionButtons() {
    const actionBtns = document.querySelectorAll('.action-buttons .btn');
    if (actionBtns.length >= 3) {
        actionBtns[0].onclick = registerNewBusiness;
        actionBtns[1].onclick = applyForMayorsPermit;
        actionBtns[2].onclick = contactAssessor;
    }
}

/* =========================================================
   7) NEW BUSINESS APPLICATION
   ========================================================= */
function registerNewBusiness() {
    const v = CONFIG.newBusinessValidation;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;';

    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:var(--bg-dark-cards,#1A2332);border:1px solid var(--border-color,#2D3A4F);border-radius:12px;padding:28px;max-width:520px;width:90%;max-height:85vh;overflow-y:auto;color:var(--text-primary,#FFFFFF);box-shadow:0 20px 60px rgba(0,0,0,0.5);';

    const fieldStyle = 'width:100%;padding:10px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.04);color:inherit;font-size:0.85rem;margin-top:6px;';
    const errStyle = 'color:#EF4444;font-size:0.72rem;margin-top:4px;display:block;';
    const labelStyle = 'font-size:0.8rem;color:var(--text-muted);';

    dialog.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;">
            <h3 style="margin:0;font-size:1.1rem;"><i class="fa-solid fa-building" style="color:var(--accent-blue);"></i> Register New Business Entity</h3>
            <button id="close-newbiz-dialog" style="background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;">
            <label style="${labelStyle}">Business Name
                <input type="text" id="nb-name" maxlength="${v.nameMaxLength}" style="${fieldStyle}" placeholder="e.g., Sunshine Bakery">
                <span id="counter-nb-name" style="font-size:0.7rem;color:var(--text-muted);float:right;"></span>
                <span id="nb-err-name" style="${errStyle}display:none;"></span>
            </label>
            <label style="${labelStyle}">Business Type
                <select id="nb-type" style="${fieldStyle}">
                    <option value="">Select a business type...</option>
                    ${CONFIG.businessTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
                <span id="nb-err-type" style="${errStyle}display:none;"></span>
            </label>
            <label style="${labelStyle}">Registered Address
                <input type="text" id="nb-address" maxlength="${v.addressMaxLength}" style="${fieldStyle}" placeholder="e.g., 123 Roxas Blvd., Pasay City">
                <span id="counter-nb-address" style="font-size:0.7rem;color:var(--text-muted);float:right;"></span>
                <span id="nb-err-address" style="${errStyle}display:none;"></span>
            </label>
            <label style="${labelStyle}">Annual Gross Sales (PHP)
                <input type="number" id="nb-gross" min="${v.grossSalesMin}" max="${v.grossSalesMax}" style="${fieldStyle}" placeholder="e.g., 1000000">
                <span id="nb-err-gross" style="${errStyle}display:none;"></span>
            </label>
        </div>
        <div style="display:flex;gap:10px;margin-top:24px;">
            <button id="nb-submit" class="btn btn-green" style="flex:1;"><i class="fa-solid fa-check"></i> Register Business</button>
            <button id="nb-cancel" class="btn btn-secondary" style="flex:1;">Cancel</button>
        </div>`;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    attachCharCounter('nb-name', 'counter-nb-name', v.nameMaxLength);
    attachCharCounter('nb-address', 'counter-nb-address', v.addressMaxLength);

    const closeDialog = () => { overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s'; setTimeout(() => overlay.remove(), 200); };
    dialog.querySelector('#close-newbiz-dialog').onclick = closeDialog;
    dialog.querySelector('#nb-cancel').onclick = closeDialog;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });

    const showFieldError = (id, msg) => {
        const errEl = dialog.querySelector('#nb-err-' + id);
        const inputEl = dialog.querySelector('#nb-' + id);
        if (msg) { errEl.textContent = msg; errEl.style.display = 'block'; inputEl.style.borderColor = '#EF4444'; }
        else { errEl.style.display = 'none'; inputEl.style.borderColor = 'rgba(255,255,255,0.15)'; }
        return !msg;
    };

    const nbSubmitBtn = dialog.querySelector('#nb-submit');
    nbSubmitBtn.onclick = () => withSubmitLock(nbSubmitBtn, () => {
        const name = dialog.querySelector('#nb-name').value.trim();
        const type = dialog.querySelector('#nb-type').value;
        const address = dialog.querySelector('#nb-address').value.trim();
        const grossRaw = dialog.querySelector('#nb-gross').value.trim();
        const gross = parseFloat(grossRaw);

        let ok = true;
        if (!name) ok = showFieldError('name', 'Business name is required.') && ok;
        else if (name.length < v.nameMinLength) ok = showFieldError('name', `Must be at least ${v.nameMinLength} characters.`) && ok;
        else if (!v.namePattern.test(name)) ok = showFieldError('name', 'Only letters, numbers, and basic punctuation (. , \' & -) are allowed.') && ok;
        else if (containsProfanity(name)) ok = showFieldError('name', 'Business name contains inappropriate language.') && ok;
        else if (DB.businesses.some(b => b.name.toLowerCase() === name.toLowerCase())) ok = showFieldError('name', 'A business with this name is already registered.') && ok;
        else ok = showFieldError('name', null) && ok;

        if (!type) ok = showFieldError('type', 'Please select a business type.') && ok;
        else ok = showFieldError('type', null) && ok;

        if (!address) ok = showFieldError('address', 'Registered address is required.') && ok;
        else if (address.length < v.addressMinLength) ok = showFieldError('address', `Must be at least ${v.addressMinLength} characters — include street and city.`) && ok;
        else ok = showFieldError('address', null) && ok;

        if (!grossRaw) ok = showFieldError('gross', 'Annual gross sales is required.') && ok;
        else if (isNaN(gross) || gross < v.grossSalesMin) ok = showFieldError('gross', `Must be a positive number (at least ${peso(v.grossSalesMin)}).`) && ok;
        else if (gross > v.grossSalesMax) ok = showFieldError('gross', `Must not exceed ${peso(v.grossSalesMax)}.`) && ok;
        else ok = showFieldError('gross', null) && ok;

        if (!ok) return false;

        const icons = CONFIG.businessIcons;
        const newBiz = {
            id: 'BIZ-' + Date.now(),
            name,
            icon: icons[Math.floor(Math.random() * icons.length)],
            type,
            taxId: 'PX-' + Math.floor(1000 + Math.random() * 9000),
            address,
            grossSales: gross,
            status: 'Pending Renewal',
            lastFiled: null,
            permitExpiry: null,
            archived: false,
        };

        DB.businesses.push(newBiz);
        DB.auditLogs.unshift({ ts: nowTs(), ref: newBiz.id, bizId: newBiz.id, action: 'Business Registered', amount: null, status: 'Success' });
        saveStore(DB);
        closeDialog();

        if (document.getElementById('view-dashboard').classList.contains('hidden') === false) renderDashboard();
        if (document.getElementById('view-portfolio').classList.contains('hidden') === false) renderPortfolioAssets();

        toast(`"${newBiz.name}" registered successfully. Tax ID: ${newBiz.taxId}`);
    });
}

/* =========================================================
   8) APPLY FOR MAYOR'S PERMIT
   ========================================================= */
function applyForMayorsPermit() {
    const activeBiz = getActiveBusinesses();
    if (activeBiz.length === 0) {
        alert('No registered businesses found. Please register a business first.');
        return;
    }
    
    const bizOptions = activeBiz.map((b, i) => `${i + 1}. ${b.name} (${b.type}) - ${b.status}`).join('\n');
    const choice = prompt(`Select business to apply for Mayor's Permit:\n\n${bizOptions}\n\nEnter number (1-${activeBiz.length}) or 0 to cancel:`);
    if (!choice || choice === '0') return;
    
    const idx = parseInt(choice) - 1;
    if (idx < 0 || idx >= activeBiz.length) { alert('Invalid selection.'); return; }
    
    const biz = activeBiz[idx];
    const permitFee = calcMayorsPermitFee(biz.grossSales);
    
    if (!confirm(`Apply for Mayor's Permit for "${biz.name}"?\n\nBusiness Type: ${biz.type}\nAnnual Gross Sales: ${peso(biz.grossSales)}\nPermit Fee: ${peso(permitFee)}\n\nClick OK to proceed with payment.`)) return;
    
    const modeOptions = CONFIG.paymentModes;
    const modeChoice = parseInt(prompt(`Select payment mode:\n${modeOptions.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\nEnter number (1-${modeOptions.length}):`)) || 1;
    const mode = modeOptions[Math.min(Math.max(modeChoice - 1, 0), modeOptions.length - 1)];
    
    const orId = genOR();
    const today = new Date().toISOString().slice(0, 10);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    
    const payment = {
        id: orId, bizId: biz.id, assessmentId: null, date: today,
        type: "Mayor's Permit", amount: permitFee, surcharge: 0, mode, status: 'Paid',
        period: `FY ${new Date().getFullYear()}`,
        auditRef: `PRMT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        items: [{ desc: `Mayor's Permit Fee – ${biz.type}`, base: biz.grossSales, rate: 'Computed', total: permitFee }],
    };
    
    DB.payments.unshift(payment);
    biz.status = 'Active';
    biz.permitExpiry = nextYear.toISOString().slice(0, 10);
    
    DB.auditLogs.unshift({ ts: nowTs(), ref: orId, bizId: biz.id, action: "Mayor's Permit Issued", amount: permitFee, status: 'Success' });
    saveStore(DB);
    
    if (document.getElementById('view-dashboard').classList.contains('hidden') === false) renderDashboard();
    toast(`Mayor's Permit issued for "${biz.name}". Receipt ${orId} generated.`);
    openReceipt(orId);
}

/* =========================================================
   9) CONTACT ASSESSOR
   ========================================================= */
function showPortalInfo() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;';

    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:var(--bg-dark-cards,#1A2332);border:1px solid var(--border-color,#2D3A4F);border-radius:12px;padding:32px;max-width:520px;width:90%;max-height:80vh;overflow-y:auto;color:var(--text-primary,#FFFFFF);box-shadow:0 20px 60px rgba(0,0,0,0.5);';

    const items = [
        { icon: 'fa-building', text: 'Register and manage multiple business entities under one account.' },
        { icon: 'fa-file-pen', text: 'File annual or quarterly tax assessments and track their status.' },
        { icon: 'fa-credit-card', text: 'Pay outstanding assessments and Mayor\'s Permit fees online.' },
        { icon: 'fa-receipt', text: 'View, print, and download official receipts for every payment.' },
        { icon: 'fa-clock-rotate-left', text: 'Browse your full payment history and audit trail at any time.' },
        { icon: 'fa-gear', text: 'Update your contact details and notification preferences in Settings.' },
    ];

    dialog.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;">
            <h3 style="margin:0;font-size:1.15rem;"><i class="fa-solid fa-circle-info" style="color:var(--accent-blue);"></i> What You Can Do Here</h3>
            <button id="close-info-dialog" style="background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;">
            ${items.map(item => `
                <div style="display:flex;align-items:start;gap:12px;">
                    <div style="width:32px;height:32px;flex-shrink:0;background:rgba(30,102,245,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                        <i class="fa-solid ${item.icon}" style="color:var(--accent-blue);font-size:0.85rem;"></i>
                    </div>
                    <p style="margin:6px 0 0 0;font-size:0.85rem;color:var(--text-primary);">${item.text}</p>
                </div>`).join('')}
        </div>
        <button id="btn-close-info" class="btn btn-secondary btn-block" style="margin-top:24px;">Got it</button>`;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const closeDialog = () => { overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s'; setTimeout(() => overlay.remove(), 200); };
    dialog.querySelector('#close-info-dialog').onclick = closeDialog;
    dialog.querySelector('#btn-close-info').onclick = closeDialog;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
}

function showContactInfo() {
    const c = CONFIG.supportContact;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;';

    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:var(--bg-dark-cards,#1A2332);border:1px solid var(--border-color,#2D3A4F);border-radius:12px;padding:32px;max-width:480px;width:90%;color:var(--text-primary,#FFFFFF);box-shadow:0 20px 60px rgba(0,0,0,0.5);';

    dialog.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;">
            <h3 style="margin:0;font-size:1.15rem;"><i class="fa-solid fa-phone" style="color:var(--accent-green);"></i> Contact Us</h3>
            <button id="close-portalcontact-dialog" style="background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:6px;">
                <i class="fa-solid fa-envelope" style="color:var(--accent-blue);width:18px;"></i>
                <span style="font-size:0.85rem;">${c.generalEmail}</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:6px;">
                <i class="fa-solid fa-phone" style="color:var(--accent-green);width:18px;"></i>
                <span style="font-size:0.85rem;">${c.generalPhone}</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:6px;">
                <i class="fa-solid fa-headset" style="color:var(--accent-amber,#F59E0B);width:18px;"></i>
                <span style="font-size:0.85rem;">${c.hotline}</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:6px;">
                <i class="fa-regular fa-clock" style="color:var(--text-muted);width:18px;"></i>
                <span style="font-size:0.85rem;">${c.officeHours}</span>
            </div>
            <div style="display:flex;align-items:start;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:6px;">
                <i class="fa-solid fa-location-dot" style="color:var(--text-muted);width:18px;margin-top:2px;"></i>
                <span style="font-size:0.85rem;">${c.address}</span>
            </div>
        </div>
        <button id="btn-close-portalcontact" class="btn btn-secondary btn-block" style="margin-top:20px;">Close</button>`;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const closeDialog = () => { overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s'; setTimeout(() => overlay.remove(), 200); };
    dialog.querySelector('#close-portalcontact-dialog').onclick = closeDialog;
    dialog.querySelector('#btn-close-portalcontact').onclick = closeDialog;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
}

function contactAssessor() {
    const contact = CONFIG.assessorContact;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;';
    
    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:var(--bg-dark-cards,#1A2332);border:1px solid var(--border-color,#2D3A4F);border-radius:12px;padding:32px;max-width:480px;width:90%;color:var(--text-primary,#FFFFFF);box-shadow:0 20px 60px rgba(0,0,0,0.5);';
    
    dialog.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:24px;">
            <div>
                <h3 style="margin:0;font-size:1.2rem;"><i class="fa-solid fa-building-columns" style="color:var(--accent-blue);"></i> Contact City Assessor</h3>
                <p style="color:var(--text-muted);font-size:0.8rem;margin:4px 0 0 0;">Pasay City Treasurer's Office</p>
            </div>
            <button id="close-contact-dialog" style="background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;margin-bottom:20px;">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
                <div style="width:48px;height:48px;background:rgba(30,102,245,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                    <i class="fa-solid fa-user-tie" style="color:var(--accent-blue);font-size:1.2rem;"></i>
                </div>
                <div><h4 style="margin:0;font-size:1rem;">${contact.name}</h4><p style="margin:2px 0 0 0;color:var(--text-muted);font-size:0.8rem;">${contact.title}</p></div>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:6px;">
                    <i class="fa-solid fa-envelope" style="color:var(--accent-blue);width:18px;"></i>
                    <span style="font-size:0.85rem;">${contact.email}</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:6px;">
                    <i class="fa-solid fa-phone" style="color:var(--accent-green);width:18px;"></i>
                    <span style="font-size:0.85rem;">${contact.phone}</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.02);border-radius:6px;">
                    <i class="fa-regular fa-clock" style="color:var(--text-muted);width:18px;"></i>
                    <span style="font-size:0.85rem;">${contact.officeHours}</span>
                </div>
            </div>
        </div>
        <div style="display:flex;gap:10px;">
            <button id="btn-email-assessor" class="btn btn-blue" style="flex:1;"><i class="fa-solid fa-paper-plane"></i> Send Email</button>
            <button id="btn-close-assessor" class="btn btn-secondary" style="flex:1;">Close</button>
        </div>`;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    const closeDialog = () => { overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s'; setTimeout(() => overlay.remove(), 200); };
    dialog.querySelector('#close-contact-dialog').onclick = closeDialog;
    dialog.querySelector('#btn-close-assessor').onclick = closeDialog;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
    
    dialog.querySelector('#btn-email-assessor').onclick = () => {
        window.open(`mailto:${contact.email}?subject=${encodeURIComponent('Inquiry from PasayBiz Portal')}&body=${encodeURIComponent(`Dear Atty. ${contact.name},\n\nI am writing from the PasayBiz Portal regarding my business tax assessment.\n\n[Please describe your inquiry here]\n\nBest regards,\n${DB.settings.name}\n${DB.settings.email}`)}`, '_blank');
        closeDialog();
        toast('Email client opened.');
    };
}

/* =========================================================
   10) PORTFOLIO VIEW
   ========================================================= */
function renderPortfolioAssets(filter = '') {
    const container = document.getElementById('asset-list-container');
    if (!container) return;
    
    const filtered = getActiveBusinesses().filter(b =>
        b.name.toLowerCase().includes(filter.toLowerCase()) ||
        b.type.toLowerCase().includes(filter.toLowerCase()) ||
        b.taxId.toLowerCase().includes(filter.toLowerCase()));

    if (filtered.length === 0) {
        container.innerHTML = '<div class="card" style="text-align:center;padding:40px;color:var(--text-muted)"><i class="fa-solid fa-magnifying-glass" style="font-size:2rem;margin-bottom:10px;display:block"></i>No matching business assets found.</div>';
        return;
    }

    container.innerHTML = filtered.map(b => `
        <div class="card asset-row">
            <div class="asset-identity">
                <div class="asset-icon-box"><i class="fa-solid ${b.icon}"></i></div>
                <div><h4>${b.name}</h4><p class="asset-subtext">${b.taxId} · ${b.type}</p><p class="asset-subtext" style="margin-top:3px">${b.address}</p></div>
            </div>
            <div class="asset-meta"><span class="meta-label">Last Filed</span><span class="meta-val">${fmtDate(b.lastFiled)}</span></div>
            <div class="asset-meta"><span class="meta-label">Status</span><span class="meta-val">${statusBadge(b.status)}</span></div>
            <div class="asset-control-btns">
                <button class="btn btn-blue btn-sm" onclick="viewReturnsForBiz('${b.id}')">View Returns</button>
                <button class="btn btn-secondary btn-sm" onclick="fileReturnForBiz('${b.id}')">File Return</button>
                <button class="btn btn-secondary btn-sm" onclick="editBusiness('${b.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn btn-sm" style="background:rgba(239,68,68,0.15);color:#EF4444" onclick="deleteBusiness('${b.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`).join('') + renderArchivedBusinessesSection(filter);
}

function renderArchivedBusinessesSection(filter = '') {
    const archived = DB.businesses.filter(b => b.archived &&
        (b.name.toLowerCase().includes(filter.toLowerCase()) ||
         b.type.toLowerCase().includes(filter.toLowerCase()) ||
         b.taxId.toLowerCase().includes(filter.toLowerCase())));

    if (archived.length === 0) return '';

    return `
        <div class="card" style="margin-top:20px;">
            <h4 style="color:var(--text-muted);font-size:0.9rem;margin-bottom:12px;">
                <i class="fa-solid fa-box-archive"></i> Archived Businesses (${archived.length})
            </h4>
            ${archived.map(b => `
                <div class="card asset-row" style="opacity:0.6;background:rgba(255,255,255,0.02);margin-bottom:8px;">
                    <div class="asset-identity">
                        <div class="asset-icon-box"><i class="fa-solid ${b.icon}"></i></div>
                        <div><h4>${b.name} <span style="font-size:0.7rem;font-weight:400;color:var(--text-muted);">(Archived ${fmtDate(b.archivedDate)})</span></h4><p class="asset-subtext">${b.taxId} · ${b.type}</p></div>
                    </div>
                    <div class="asset-meta"><span class="meta-label">Last Filed</span><span class="meta-val">${fmtDate(b.lastFiled)}</span></div>
                    <div class="asset-meta"><span class="meta-label">Status</span><span class="meta-val">${statusBadge('Archived')}</span></div>
                    <div class="asset-control-btns">
                        <button class="btn btn-blue btn-sm" onclick="viewReturnsForBiz('${b.id}')">View History</button>
                        <button class="btn btn-secondary btn-sm" onclick="restoreBusiness('${b.id}')"><i class="fa-solid fa-rotate-left"></i> Restore</button>
                    </div>
                </div>`).join('')}
        </div>`;
}

function restoreBusiness(bizId) {
    const b = getBiz(bizId);
    if (!b) return;
    if (!confirm(`Restore "${b.name}" to your active portfolio?`)) return;
    b.archived = false;
    b.archivedDate = null;
    b.status = 'Pending Renewal';
    DB.auditLogs.unshift({ ts: nowTs(), ref: b.id, bizId: b.id, action: 'Business Restored', amount: null, status: 'Success' });
    saveStore(DB);
    renderPortfolioAssets();
    toast(`"${b.name}" restored to active portfolio.`);
}

function viewReturnsForBiz(bizId) {
    showView('history');
    setTimeout(() => {
        const sel = document.getElementById('history-filter-biz');
        if (sel) { sel.value = bizId; filterPaymentHistory(); }
    }, 100);
}

function fileReturnForBiz(bizId) {
    showView('create-application');
    setTimeout(() => { const sel = document.getElementById('app-biz-select'); if (sel) sel.value = bizId; }, 100);
}

function editBusiness(bizId) {
    const b = getBiz(bizId);
    if (!b) return;
    const v = CONFIG.newBusinessValidation;

    const name = prompt('Business Name:', b.name);
    if (name === null) return;
    const trimmedName = name.trim();
    if (trimmedName.length < v.nameMinLength || trimmedName.length > v.nameMaxLength) {
        alert(`Business name must be ${v.nameMinLength}–${v.nameMaxLength} characters.`);
        return;
    }
    if (!v.namePattern.test(trimmedName)) {
        alert("Business name can only contain letters, numbers, and basic punctuation (. , ' & -).");
        return;
    }
    if (containsProfanity(trimmedName)) {
        alert('Business name contains inappropriate language. Please revise.');
        return;
    }
    if (DB.businesses.some(other => other.id !== b.id && other.name.toLowerCase() === trimmedName.toLowerCase())) {
        alert('Another business with this name is already registered.');
        return;
    }

    const type = prompt('Business Type:', b.type);
    if (type === null) return;
    const trimmedType = type.trim();
    if (!isNonEmptyTrimmed(trimmedType, v.typeMinLength)) {
        alert(`Business type must be at least ${v.typeMinLength} characters.`);
        return;
    }

    const address = prompt('Registered Address:', b.address);
    if (address === null) return;
    const trimmedAddress = address.trim();
    if (trimmedAddress.length < v.addressMinLength || trimmedAddress.length > v.addressMaxLength) {
        alert(`Address must be ${v.addressMinLength}–${v.addressMaxLength} characters.`);
        return;
    }
    if (containsProfanity(trimmedAddress)) {
        alert('Address contains inappropriate language. Please revise.');
        return;
    }

    b.name = trimmedName;
    b.type = trimmedType;
    b.address = trimmedAddress;
    DB.auditLogs.unshift({ ts: nowTs(), ref: b.id, bizId: b.id, action: 'Business Details Updated', amount: null, status: 'Success' });
    saveStore(DB);
    renderPortfolioAssets();
    toast('Business updated successfully.');
}

function deleteBusiness(bizId) {
    const b = getBiz(bizId);
    if (!b) return;
    if (!confirm(`Archive "${b.name}"? It will be removed from your active portfolio, but its past assessments, payments, and audit history will be kept and clearly marked as archived. This can be undone by an administrator.`)) return;
    b.archived = true;
    b.archivedDate = new Date().toISOString().slice(0, 10);
    b.status = 'Archived';
    DB.auditLogs.unshift({ ts: nowTs(), ref: b.id, bizId: b.id, action: 'Business Archived', amount: null, status: 'Archived' });
    saveStore(DB);
    renderPortfolioAssets();
    if (document.getElementById('view-dashboard').classList.contains('hidden') === false) renderDashboard();
    toast(`"${b.name}" has been archived.`);
}

/* =========================================================
   11) ASSESSMENTS VIEW
   ========================================================= */
function renderAssessmentsView() {
    const fBiz = document.getElementById('assess-filter-biz');
    const fStatus = document.getElementById('assess-filter-status');
    
    const currentBizFilter = fBiz?.value || 'all';
    const currentStatusFilter = fStatus?.value || 'all';
    
    
    initializeAssessmentsFilters();
    applyAssessmentsFilters(currentBizFilter, currentStatusFilter);
}

function initializeAssessmentsFilters() {
    const fBiz = document.getElementById('assess-filter-biz');
    const fStatus = document.getElementById('assess-filter-status');
    
    
    if (fBiz && fBiz.options.length <= 1) {
        // Clear and rebuild business filter
        fBiz.innerHTML = '<option value="all">All Entities</option>';
        DB.businesses.forEach(b => { 
            const opt = document.createElement('option'); 
            opt.value = b.id; 
            opt.textContent = b.archived ? `${b.name} (Archived)` : b.name; 
            fBiz.appendChild(opt); 
        });
        
        fBiz.onchange = function() {
            const statusFilter = document.getElementById('assess-filter-status');
            const statusValue = statusFilter ? statusFilter.value : 'all';
            applyAssessmentsFilters(this.value, statusValue);
        };
    }
    
    if (fStatus && fStatus.options.length <= 1) {
        // Clear and rebuild status filter
        fStatus.innerHTML = '<option value="all">All Statuses</option>';
        CONFIG.assessmentStatuses.forEach(s => {
            const opt = document.createElement('option'); 
            opt.value = s; 
            opt.textContent = s; 
            fStatus.appendChild(opt); 
        });
        
        fStatus.onchange = function() {
            const bizFilter = document.getElementById('assess-filter-biz');
            const bizValue = bizFilter ? bizFilter.value : 'all';
            applyAssessmentsFilters(bizValue, this.value);
        };
    }
}

function applyAssessmentsFilters(filterBiz, filterStatus) {
    
    let filteredAssessments = [...DB.assessments];
    
    if (filterBiz && filterBiz !== 'all') {
        filteredAssessments = filteredAssessments.filter(a => a.bizId === filterBiz);
    } else {
        // When viewing "All Entities", exclude assessments belonging to archived
        // businesses from view by default — they're no longer active obligations.
        filteredAssessments = filteredAssessments.filter(a => {
            const biz = getBiz(a.bizId);
            return biz && !biz.archived;
        });
    }
    
    if (filterStatus && filterStatus !== 'all') {
        filteredAssessments = filteredAssessments.filter(a => a.status === filterStatus);
    }
    
    updateAssessmentsSummary(filteredAssessments);
    renderAssessmentsTable(filteredAssessments);
}

function updateAssessmentsSummary(filteredAssessments) {
    const outstanding = filteredAssessments
        .filter(a => isActiveStatus(a.status))
        .reduce((sum, a) => sum + a.amountDue, 0);
    
    const pendingCount = filteredAssessments.filter(a => isActiveStatus(a.status)).length;
    
    const upcoming = filteredAssessments
        .filter(a => isActiveStatus(a.status))
        .map(a => new Date(a.deadline))
        .sort((a, b) => a - b);
    const nextDeadline = upcoming[0];
    
    
    const outstandingEl = document.querySelector('.summary-red .summary-value');
    const pendingEl = document.querySelector('.summary-amber .summary-value');
    const deadlineEl = document.querySelector('.summary-blue .summary-value');
    
    if (outstandingEl) { 
        outstandingEl.textContent = peso(outstanding); 
        outstandingEl.style.color = outstanding > 0 ? 'var(--color-red)' : 'var(--accent-green)'; 
    }
    
    if (pendingEl) {
        pendingEl.textContent = `${pendingCount} Pending`;
    }
    
    if (deadlineEl) {
        if (nextDeadline) {
            deadlineEl.textContent = nextDeadline.toLocaleDateString('en-PH', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
            deadlineEl.style.color = 'var(--accent-sky)';
        } else {
            deadlineEl.textContent = 'No deadlines';
            deadlineEl.style.color = 'var(--accent-green)';
        }
    }
}

function renderAssessmentsTable(filteredAssessments) {
    const tbody = document.getElementById('assessments-tbody');
    if (!tbody) return;

    if (filteredAssessments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted)"><i class="fa-solid fa-folder-open" style="font-size:2rem;margin-bottom:10px;display:block;opacity:0.5"></i>No assessments match the selected filters</td></tr>';
        return;
    }

    tbody.innerHTML = filteredAssessments.map(a => {
        const biz = getBiz(a.bizId);
        if (!biz) return '';
        const isOverdue = new Date(a.deadline) < new Date() && isActiveStatus(a.status);
        return `<tr>
            <td><div style="display:flex;align-items:center;gap:10px"><div class="biz-icon" style="width:30px;height:30px;font-size:0.85rem;margin:0;background-color:#FFFFFF;color:var(--text-dark);"><i class="fa-solid ${biz.icon}"></i></div><div><strong>${biz.name}</strong><br><span class="cell-sm-text" style="color:var(--text-muted)">${biz.taxId}</span></div></div></td>
            <td class="cell-sm-text" style="font-family:monospace">${a.id}</td>
            <td class="cell-sm-text">${a.category}<br><span style="color:var(--text-muted)">${a.period}</span></td>
            <td class="cell-sm-text" style="${isOverdue ? 'color:var(--color-red);font-weight:600' : ''}">${fmtDate(a.deadline)}${isOverdue ? '<br><span style="font-size:0.7rem;color:var(--color-red)">⚠ Overdue</span>' : ''}</td>
            <td><strong>${peso(a.amountDue)}</strong></td>
            <td>${statusBadge(a.status)}</td>
            <td class="text-right"><div class="inline-actions">${isActiveStatus(a.status) ? `<button class="btn btn-primary btn-sm" onclick="handlePayNow('${a.id}')"><i class="fa-solid fa-credit-card"></i> Pay Now</button>` : ''}<button class="btn btn-secondary btn-sm" onclick="fileReturnForBiz('${a.bizId}')"><i class="fa-solid fa-file-pen"></i> File</button><button class="btn btn-blue btn-sm" onclick="viewReturnForAssessment('${a.id}')"><i class="fa-solid fa-eye"></i> View</button></div></td>
        </tr>`;
    }).join('');
}

window.handlePayNow = handlePayNow;
window.fileReturnForBiz = fileReturnForBiz;
window.viewReturnForAssessment = viewReturnForAssessment;

function viewReturnForAssessment(asmtId) {
    const asmt = DB.assessments.find(a => a.id === asmtId);
    if (!asmt) return;
    const payment = DB.payments.find(p => p.assessmentId === asmtId);
    if (payment) openReceipt(payment.id);
    else alert('No payment record found for this assessment. It may still be pending.');
}

/* =========================================================
   12) PAY NOW
   ========================================================= */
function handlePayNow(asmtId) {
    const asmt = DB.assessments.find(a => a.id === asmtId);
    if (!asmt) return;
    const biz = getBiz(asmt.bizId);

    const triggerBtn = event?.currentTarget;
    if (triggerBtn) { if (triggerBtn.disabled) return; triggerBtn.disabled = true; }
    const reEnable = () => { if (triggerBtn) triggerBtn.disabled = false; };

    const modeOptions = CONFIG.paymentModes;
    const choice = parseInt(prompt(`Select payment mode:\n${modeOptions.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\nEnter number (1-${modeOptions.length}):`)) || 1;
    const mode = modeOptions[Math.min(Math.max(choice - 1, 0), modeOptions.length - 1)];
    if (!confirm(`Confirm payment of ${peso(asmt.amountDue)} for "${biz.name}" via ${mode}?`)) { reEnable(); return; }

    const orId = genOR();
    const fee = CONFIG.fees.regulatory.amount;
    const { taxable, rateLabel } = calcTax(biz.grossSales || 0, 0);
    const taxBase = asmt.amountDue - fee;

    const payment = {
        id: orId, bizId: asmt.bizId, assessmentId: asmtId,
        date: new Date().toISOString().slice(0, 10), type: asmt.category,
        amount: asmt.amountDue, surcharge: 0, mode, status: 'Paid',
        period: asmt.period, auditRef: asmt.auditRef,
        items: [
            { desc: `Municipal Gross Tax – ${biz.type}`, base: taxable, rate: rateLabel, total: taxBase },
            { desc: CONFIG.fees.regulatory.desc, base: null, rate: 'Flat Rate', total: fee },
        ],
    };

    DB.payments.unshift(payment);
    asmt.status = 'Filed';
    const b = getBiz(asmt.bizId);
    if (b) {
        const allDatesForBiz = DB.payments.filter(p => p.bizId === b.id).map(p => p.date);
        b.lastFiled = allDatesForBiz.sort().slice(-1)[0] || payment.date;
    }
    DB.auditLogs.unshift({ ts: nowTs(), ref: orId, bizId: asmt.bizId, action: 'Payment Processed', amount: asmt.amountDue, status: 'Success' });
    saveStore(DB);
    
    if (document.getElementById('view-dashboard').classList.contains('hidden') === false) renderDashboard();
    if (document.getElementById('view-assessments').classList.contains('hidden') === false) renderAssessmentsView();
    
    toast(`Payment of ${peso(asmt.amountDue)} processed. Receipt ${orId} generated.`);
    openReceipt(orId);
}

/* =========================================================
   13) PAYMENT HISTORY VIEW
   ========================================================= */
function renderPaymentHistory() {
    const allPaidPayments = DB.payments.filter(p => p.status === 'Paid');
    const currentYear = new Date().getFullYear();
    const ytdPayments = allPaidPayments.filter(p => {
        const paymentYear = new Date(p.date).getFullYear();
        return paymentYear === currentYear || paymentYear === currentYear + 1;
    });
    const ytdTotal = ytdPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const previousYearPayments = allPaidPayments.filter(p => new Date(p.date).getFullYear() === currentYear - 1);
    const prevYearTotal = previousYearPayments.reduce((sum, p) => sum + p.amount, 0);
    const growthPercent = prevYearTotal > 0 ? ((ytdTotal - prevYearTotal) / prevYearTotal * 100).toFixed(1) : 0;
    const isGrowth = growthPercent >= 0;
    
    const lastPayment = allPaidPayments.length > 0 ? allPaidPayments.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;
    const activeBusinesses = getActiveBusinesses();
    const activeBizCount = activeBusinesses.filter(b => b.status === 'Active').length;
    const allCompliant = activeBusinesses.length > 0 && activeBusinesses.every(b => b.status === 'Active');
    
    const summaryValues = document.querySelectorAll('#view-history .summary-value');
    if (summaryValues[0]) summaryValues[0].textContent = peso(ytdTotal);
    if (summaryValues[1]) summaryValues[1].textContent = lastPayment ? peso(lastPayment.amount) : '₱0.00';
    if (summaryValues[2]) summaryValues[2].textContent = `${activeBizCount}`;
    
    const growthEl = document.querySelector('#view-history .growth-subtext');
    if (growthEl) {
        growthEl.innerHTML = `<i class="fa-solid ${isGrowth ? 'fa-arrow-up' : 'fa-arrow-down'}"></i> ${Math.abs(growthPercent)}% vs last year`;
        growthEl.style.color = isGrowth ? 'var(--accent-green)' : 'var(--color-red)';
    }
    
    const metaEl = document.querySelector('#view-history .meta-subtext');
    if (metaEl && lastPayment) {
        const biz = getBiz(lastPayment.bizId);
        metaEl.innerHTML = `Processed on ${fmtDate(lastPayment.date)}<br><span style="font-size:0.68rem;color:var(--text-muted);">${biz ? biz.name : ''} - ${lastPayment.type}</span>`;
    }
    
    const statusEl = document.querySelector('#view-history .status-subtext');
    if (statusEl) {
        statusEl.innerHTML = allCompliant ? '<i class="fa-solid fa-circle-check" style="color:var(--accent-green);"></i> All Compliant' : `<i class="fa-solid fa-triangle-exclamation" style="color:var(--color-red);"></i> ${activeBusinesses.length - activeBizCount} need attention`;
        statusEl.style.color = allCompliant ? 'var(--accent-green)' : 'var(--color-red)';
    }
    
    initializePaymentHistoryFilters();
    filterPaymentHistory();
}

function initializePaymentHistoryFilters() {
    const fBiz = document.getElementById('history-filter-biz');
    const fType = document.getElementById('history-filter-type');
    
    if (fBiz && fBiz.options.length <= 1) {
        fBiz.innerHTML = '<option value="all">All Businesses</option>';
        DB.businesses.forEach(b => { const opt = document.createElement('option'); opt.value = b.id; opt.textContent = b.archived ? `${b.name} (Archived)` : b.name; fBiz.appendChild(opt); });
        fBiz.onchange = function() { filterPaymentHistory(); };
    }
    
    if (fType && fType.options.length <= 1) {
        fType.innerHTML = '<option value="all">All Types</option>';
        [...new Set(DB.payments.map(p => p.type))].sort().forEach(t => { const opt = document.createElement('option'); opt.value = t; opt.textContent = t; fType.appendChild(opt); });
        fType.onchange = function() { filterPaymentHistory(); };
    }
    
    const searchInput = document.getElementById('history-search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => filterPaymentHistory(), 300); });
        searchInput.addEventListener('keydown', function(e) { if (e.key === 'Escape') { this.value = ''; filterPaymentHistory(); this.blur(); } });
    }
}

function filterPaymentHistory() {
    const query = (document.getElementById('history-search-input')?.value || '').trim().toLowerCase();
    const fBiz = document.getElementById('history-filter-biz')?.value || 'all';
    const fType = document.getElementById('history-filter-type')?.value || 'all';
    
    let filteredPayments = [...DB.payments];
    if (fBiz !== 'all') filteredPayments = filteredPayments.filter(p => p.bizId === fBiz);
    if (fType !== 'all') filteredPayments = filteredPayments.filter(p => p.type === fType);
    if (query) {
        filteredPayments = filteredPayments.filter(p => {
            const biz = getBiz(p.bizId);
            return [p.id, biz?.name || '', p.type || '', p.mode || '', p.period || '', p.auditRef || '', p.status || ''].join(' ').toLowerCase().includes(query);
        });
    }
    filteredPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderPaymentHistoryTable(filteredPayments, query);
}

function renderPaymentHistoryTable(payments, query) {
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;
    
    if (payments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:50px 20px;"><div style="margin-bottom:15px;">${query ? `<i class="fa-solid fa-magnifying-glass" style="font-size:2.5rem;color:var(--text-muted);opacity:0.5;display:block;margin-bottom:15px;"></i><p style="color:var(--text-muted);font-size:0.9rem;">No payments match "${query}"</p><button class="btn btn-blue btn-sm" style="margin-top:15px;" onclick="clearPaymentHistorySearch()"><i class="fa-solid fa-rotate-left"></i> Clear Search</button>` : '<i class="fa-solid fa-receipt" style="font-size:2.5rem;color:var(--text-muted);opacity:0.5;display:block;margin-bottom:15px;"></i><p style="color:var(--text-muted);font-size:0.9rem;">No payment records found</p>'}</div></td></tr>`;
        return;
    }
    
    tbody.innerHTML = payments.map((p, index) => {
        const biz = getBiz(p.bizId);
        const daysAgo = Math.floor((new Date() - new Date(p.date)) / (1000 * 60 * 60 * 24));
        let ageBadge = '';
        if (daysAgo === 0) ageBadge = '<span style="background:rgba(16,185,129,0.15);color:#10B981;padding:2px 6px;border-radius:3px;font-size:0.65rem;margin-left:5px;">Today</span>';
        else if (daysAgo === 1) ageBadge = '<span style="background:rgba(16,185,129,0.1);color:#10B981;padding:2px 6px;border-radius:3px;font-size:0.65rem;margin-left:5px;">Yesterday</span>';
        else if (daysAgo <= 7) ageBadge = `<span style="background:rgba(56,189,248,0.1);color:var(--accent-sky);padding:2px 6px;border-radius:3px;font-size:0.65rem;margin-left:5px;">${daysAgo}d ago</span>`;
        
        const modeIcons = { 'Electronic Fund Transfer': 'fa-solid fa-building-columns', 'Online Banking': 'fa-solid fa-globe', 'Counter Payment': 'fa-solid fa-cash-register', 'GCash / Maya': 'fa-solid fa-mobile-screen-button' };
        const modeIcon = modeIcons[p.mode] || 'fa-solid fa-credit-card';
        
        return `<tr style="${index === 0 ? 'background:rgba(30,102,245,0.02);' : ''}">
            <td><div style="display:flex;flex-direction:column;"><span>${fmtDate(p.date)}</span><span style="font-size:0.68rem;color:var(--text-muted);">${p.date?.slice(11,16) || ''}</span>${ageBadge}</div></td>
            <td><div style="display:flex;align-items:center;gap:10px;"><div style="width:32px;height:32px;background:rgba(255,255,255,0.05);border-radius:6px;display:flex;align-items:center;justify-content:center;"><i class="fa-solid ${biz ? biz.icon : 'fa-building'}" style="font-size:0.85rem;color:var(--text-muted);"></i></div><div><strong style="font-size:0.9rem;">${biz ? biz.name : 'Unknown Business'}</strong>${biz?.archived ? ' <span style="font-size:0.65rem;color:var(--text-muted);background:rgba(255,255,255,0.05);padding:1px 6px;border-radius:3px;">Archived</span>' : ''}<br><span style="font-size:0.72rem;color:var(--text-muted);">${biz ? biz.taxId : p.bizId}</span></div></div></td>
            <td><div style="display:flex;flex-direction:column;"><span style="font-size:0.85rem;">${p.type}</span><span style="font-size:0.7rem;color:var(--text-muted);"><i class="${modeIcon}" style="margin-right:3px;"></i>${p.mode}</span></div></td>
            <td><div style="display:flex;flex-direction:column;"><strong style="font-size:0.95rem;">${peso(p.amount)}</strong>${p.surcharge > 0 ? `<span style="font-size:0.68rem;color:var(--color-red);">+ ${peso(p.surcharge)} surcharge</span>` : '<span style="font-size:0.68rem;color:var(--accent-green);">No penalties</span>'}</div></td>
            <td><div style="display:flex;flex-direction:column;gap:4px;">${statusBadge(p.status)}<span style="font-size:0.68rem;color:var(--text-muted);font-family:monospace;">${p.id}</span></div></td>
            <td><div class="inline-actions" style="display:flex;gap:6px;justify-content:flex-end;">
                <button class="btn btn-blue btn-sm" onclick="openReceipt('${p.id}')"><i class="fa-solid fa-receipt"></i> View</button>
                <button class="btn btn-secondary btn-sm" onclick="downloadReceiptPdf('${p.id}')"><i class="fa-solid fa-download"></i></button>
                <button class="btn btn-sm" style="background:rgba(255,255,255,0.05);color:var(--text-muted);" onclick="viewPaymentDetails('${p.id}')"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            </div></td>
        </tr>`;
    }).join('');
}

function viewPaymentDetails(paymentId) {
    const payment = DB.payments.find(p => p.id === paymentId);
    if (!payment) return;
    const biz = getBiz(payment.bizId);
    
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;';
    
    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:var(--bg-dark-cards,#1A2332);border:1px solid var(--border-color,#2D3A4F);border-radius:12px;padding:28px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;color:var(--text-primary,#FFFFFF);box-shadow:0 20px 60px rgba(0,0,0,0.5);';
    
    dialog.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;">
            <div><h3 style="margin:0;font-size:1.1rem;"><i class="fa-solid fa-circle-info" style="color:var(--accent-blue);"></i> Payment Details</h3><p style="color:var(--text-muted);font-size:0.75rem;margin:4px 0 0 0;font-family:monospace;">${payment.id}</p></div>
            <button id="close-payment-detail" style="background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;">
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;">
                <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px;">TRANSACTION DETAILS</p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.85rem;">
                    <div><span style="color:var(--text-muted);font-size:0.7rem;">Date</span><br><strong>${fmtDate(payment.date)}</strong></div>
                    <div><span style="color:var(--text-muted);font-size:0.7rem;">Status</span><br>${statusBadge(payment.status)}</div>
                    <div><span style="color:var(--text-muted);font-size:0.7rem;">Amount</span><br><strong>${peso(payment.amount)}</strong></div>
                    <div><span style="color:var(--text-muted);font-size:0.7rem;">Surcharge</span><br><strong style="color:${payment.surcharge > 0 ? 'var(--color-red)' : 'var(--accent-green)'}">${peso(payment.surcharge || 0)}</strong></div>
                    <div style="grid-column:1/-1;"><span style="color:var(--text-muted);font-size:0.7rem;">Payment Mode</span><br><strong>${payment.mode}</strong></div>
                </div>
            </div>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;">
                <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px;">BUSINESS DETAILS</p>
                <div style="font-size:0.85rem;"><strong>${biz ? biz.name : 'Unknown'}</strong>${biz?.archived ? ' <span style="font-size:0.65rem;color:var(--text-muted);background:rgba(255,255,255,0.05);padding:1px 6px;border-radius:3px;">Archived</span>' : ''}<br><span style="color:var(--text-muted);font-size:0.75rem;">Tax ID: ${biz ? biz.taxId : payment.bizId}<br>Type: ${biz ? biz.type : 'N/A'}<br>Assessment: ${payment.type}<br>Period: ${payment.period}<br>Audit Ref: ${payment.auditRef || 'N/A'}</span></div>
            </div>
            ${payment.items && payment.items.length > 0 ? `
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;">
                <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px;">BREAKDOWN</p>
                ${payment.items.map(item => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.82rem;"><span style="flex:1;">${item.desc}</span><span style="margin-left:10px;white-space:nowrap;">${peso(item.total)}</span></div>`).join('')}
                <div style="display:flex;justify-content:space-between;padding-top:10px;font-weight:600;font-size:0.9rem;"><span>Total</span><span>${peso(payment.amount)}</span></div>
            </div>` : ''}
        </div>
        <div style="display:flex;gap:10px;margin-top:20px;">
            <button class="btn btn-blue" style="flex:1;" onclick="openReceipt('${payment.id}');document.getElementById('close-payment-detail').click();"><i class="fa-solid fa-receipt"></i> View Receipt</button>
            <button class="btn btn-secondary" style="flex:1;" id="close-detail-btn">Close</button>
        </div>`;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    const closeDialog = () => { overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s'; setTimeout(() => overlay.remove(), 200); };
    dialog.querySelector('#close-payment-detail').onclick = closeDialog;
    dialog.querySelector('#close-detail-btn').onclick = closeDialog;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
}

function clearPaymentHistorySearch() {
    const searchInput = document.getElementById('history-search-input');
    if (searchInput) { searchInput.value = ''; filterPaymentHistory(); }
}

function exportCSV() {
    const rows = [['Date', 'Business Name', 'Tax ID', 'Assessment Type', 'Payment Mode', 'Amount', 'Status', 'Receipt ID']];
    DB.payments.forEach(p => {
        const biz = getBiz(p.bizId);
        const bizName = biz ? (biz.archived ? `${biz.name} (Archived)` : biz.name) : 'Unknown Business';
        rows.push([fmtDate(p.date), bizName, biz ? biz.taxId : '--', p.type, p.mode, p.amount, p.status, p.id]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `PasayBiz_PaymentHistory_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    toast(`Exported ${DB.payments.length} payment records to CSV.`);
}

/* =========================================================
   14) RECEIPT VIEW — shows the most recently viewed receipt
   ========================================================= */
function openReceipt(paymentId) {
    DB.lastViewedReceiptId = paymentId;
    saveStore(DB);
    showView('receipt');
}

function renderReceipt() {
    
    // Use the last-viewed receipt, falling back to the most recent payment
    const pid = DB.lastViewedReceiptId || (DB.payments.length > 0 ? DB.payments[0].id : null);
    
    if (!pid) {
        const card = document.getElementById('receipt-content');
        if (card) {
            card.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)"><i class="fa-solid fa-receipt" style="font-size:3rem;margin-bottom:15px;display:block;opacity:0.3"></i><p>No receipts available yet.</p><p style="font-size:0.8rem;">Receipts will appear here after payments are processed.</p></div>';
        }
        return;
    }
    
    const p = DB.payments.find(x => x.id === pid);
    if (!p) {
        return;
    }
    
    
    const biz = getBiz(p.bizId);
    const total = p.amount + (p.surcharge || 0);

    const alertBar = document.querySelector('.receipt-alert-bar');
    if (alertBar) {
        const span = alertBar.querySelector('.alert-text span');
        if (span) span.textContent = `Payment Finalized successfully — Receipt ${p.id} · ${fmtDate(p.date)}.`;
    }

    const card = document.getElementById('receipt-content');
    if (!card) {
        return;
    }

    card.innerHTML = `
        <div class="receipt-header">
            <div class="receipt-header-left">
                <i class="fa-solid fa-building-columns receipt-logo"></i>
                <div><h4>${CONFIG.office.name}</h4><p>${CONFIG.office.division}</p><p>${CONFIG.office.address}</p></div>
            </div>
            <div class="receipt-header-right">
                <h4 class="text-green">Official Receipt</h4>
                <p>Transaction OR: <strong>${p.id}</strong></p>
                <p>Date of Issue: <strong>${p.date} ${nowTs().slice(11)}</strong></p>
                <p>Payment Mode: <strong>${p.mode}</strong></p>
            </div>
        </div>
        <div class="receipt-details">
            <div class="details-col">
                <p class="meta-label">Taxpayer Account Profile</p>
                <h5 class="entity-name">${biz ? biz.name : 'Unknown Business'}${biz?.archived ? ' <span style="font-size:0.65rem;color:var(--text-muted);font-weight:400;">(Archived)</span>' : ''}</h5>
                <p>Taxpayer ID: ${biz ? biz.taxId : '--'}</p>
                <p>Line of Business: ${biz ? biz.type : '--'}</p>
                <p>Registered Address: ${biz ? biz.address : '--'}</p>
            </div>
            <div class="details-col">
                <p class="meta-label">Filing Specifics</p>
                <p>Assessment Context: ${p.type}</p>
                <p>Filing Period: ${p.period}</p>
                <p>Audit Reference: ${p.auditRef || '--'}</p>
            </div>
        </div>
        <table class="receipt-table">
            <thead><tr><th>Revenue Code Item / Description</th><th class="text-right">Base Assessment Scale</th><th class="text-right">Rate Index</th><th class="text-right">Total Settle Amount</th></tr></thead>
            <tbody>${(p.items || []).map(item => `<tr><td>${item.desc}</td><td class="text-right">${item.base ? peso(item.base) : '--'}</td><td class="text-right">${item.rate}</td><td class="text-right">${peso(item.total)}</td></tr>`).join('')}</tbody>
        </table>
        <div class="receipt-totals-container">
            <div class="receipt-totals">
                <div class="total-row"><span>Subtotal Base Liability:</span><span>${peso(p.amount)}</span></div>
                <div class="total-row"><span>Surcharges / Penalties:</span><span>${peso(p.surcharge || 0)}</span></div>
                <div class="total-row"><span>Payment Status:</span><span class="text-green font-bold">Paid in Full</span></div>
                <div class="calc-divider"></div>
                <div class="total-row grand-total"><span>Total Charged Volume:</span><span>${peso(total)}</span></div>
            </div>
        </div>
        <div class="receipt-footer">
            <p>This document serves as an official electronic receipt of tax payment execution processed under Pasay City local regulatory laws.</p>
            <p>Secure digital signature: ${generateFingerprint(p.id)}</p>
        </div>`;
    
}

function generateFingerprint(id) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
    return Math.abs(h).toString(16).padStart(8, '0') + '...verified';
}

function printReceipt() { window.print(); }

function downloadReceiptPdf(paymentId) {
    if (paymentId) { 
        DB.lastViewedReceiptId = paymentId; 
        saveStore(DB); 
        renderReceipt(); 
    }
    const pid = DB.lastViewedReceiptId;
    const p = DB.payments.find(x => x.id === pid) || DB.payments[0];
    if (!p) return;
    const biz = getBiz(p?.bizId);
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Receipt ${p.id}</title><style>body{font-family:Arial,sans-serif;color:#111;max-width:700px;margin:40px auto;padding:0 20px}h2{margin-bottom:4px}.header{display:flex;justify-content:space-between;border-bottom:2px solid #333;padding-bottom:16px;margin-bottom:20px}.right{text-align:right}table{width:100%;border-collapse:collapse;margin:20px 0}th{background:#f0f0f0;padding:10px;text-align:left;font-size:13px}td{padding:10px;border-bottom:1px solid #eee;font-size:13px}.totals{float:right;width:280px;margin-top:10px}.tr{display:flex;justify-content:space-between;padding:6px 0;font-size:13px}.grand{font-weight:bold;font-size:15px;border-top:2px solid #333;padding-top:10px;margin-top:6px}.footer{margin-top:60px;border-top:1px solid #ccc;padding-top:14px;font-size:11px;color:#666;text-align:center}</style></head><body>
<div class="header"><div><h2>${CONFIG.office.name}</h2><p style="margin:0;font-size:13px">${CONFIG.office.division}<br>${CONFIG.office.address}</p></div><div class="right"><h3 style="color:green;margin-bottom:6px">OFFICIAL RECEIPT</h3><p style="margin:2px 0;font-size:13px">OR No: <strong>${p.id}</strong></p><p style="margin:2px 0;font-size:13px">Date: <strong>${fmtDate(p.date)}</strong></p><p style="margin:2px 0;font-size:13px">Mode: <strong>${p.mode}</strong></p></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;font-size:13px"><div><strong>Taxpayer:</strong> ${biz?.name || '--'}<br>Tax ID: ${biz?.taxId || '--'}<br>Business Type: ${biz?.type || '--'}<br>Address: ${biz?.address || '--'}</div><div><strong>Assessment Context:</strong> ${p.type}<br>Filing Period: ${p.period}<br>Audit Ref: ${p.auditRef || '--'}</div></div>
<table><thead><tr><th>Description</th><th>Base Amount</th><th>Rate</th><th style="text-align:right">Total</th></tr></thead><tbody>${(p.items||[]).map(i=>`<tr><td>${i.desc}</td><td>${i.base?peso(i.base):'--'}</td><td>${i.rate}</td><td style="text-align:right">${peso(i.total)}</td></tr>`).join('')}</tbody></table>
<div class="totals"><div class="tr"><span>Subtotal:</span><span>${peso(p.amount)}</span></div><div class="tr"><span>Surcharges:</span><span>${peso(p.surcharge||0)}</span></div><div class="tr"><span>Status:</span><span style="color:green">Paid in Full</span></div><div class="tr grand"><span>TOTAL:</span><span>${peso((p.amount)+(p.surcharge||0))}</span></div></div>
<div style="clear:both"></div><div class="footer"><p>This is an official electronic receipt under Pasay City local regulatory laws.</p><p>Digital signature: ${generateFingerprint(p.id)}</p></div></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Receipt_${p.id}.html`;
    a.click();
    toast('Receipt downloaded.');
}

/* =========================================================
   15) AUDIT LOGS
   ========================================================= */
function renderAuditLogs(filterBiz = 'all', filterAction = 'all', query = '') {
    const fBiz = document.getElementById('logs-filter-biz');
    const fAction = document.getElementById('logs-filter-action');

    if (fBiz && fBiz.options.length <= 1) {
        fBiz.innerHTML = '<option value="all">All Businesses</option>';
        DB.businesses.forEach(b => { const o = document.createElement('option'); o.value = b.id; o.textContent = b.archived ? `${b.name} (Archived)` : b.name; fBiz.appendChild(o); });
        fBiz.addEventListener('change', () => renderAuditLogs(fBiz.value, fAction?.value, document.getElementById('logs-search-input')?.value));
    }
    if (fAction && fAction.options.length <= 1) {
        fAction.innerHTML = '<option value="all">All Actions</option>';
        [...new Set(DB.auditLogs.map(l => l.action))].forEach(a => { const o = document.createElement('option'); o.value = a; o.textContent = a; fAction.appendChild(o); });
        fAction.addEventListener('change', () => renderAuditLogs(fBiz?.value, fAction.value, document.getElementById('logs-search-input')?.value));
    }

    const search = document.getElementById('logs-search-input');
    if (search) search.oninput = () => renderAuditLogs(fBiz?.value, fAction?.value, search.value);

    let list = [...DB.auditLogs];
    if (filterBiz !== 'all' && filterBiz) list = list.filter(l => l.bizId === filterBiz);
    if (filterAction !== 'all' && filterAction) list = list.filter(l => l.action === filterAction);
    if (query) {
        const q = query.toLowerCase();
        list = list.filter(l => l.ref.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.bizId.toLowerCase().includes(q));
    }

    const tbody = document.getElementById('logs-tbody');
    if (!tbody) return;

    tbody.innerHTML = list.map(l => {
        const biz = getBiz(l.bizId);
        const payment = DB.payments.find(p => p.id === l.ref);
        return `<tr>
            <td class="cell-sm-text">${l.ts}</td>
            <td class="cell-sm-text" style="font-family:monospace">${l.ref}</td>
            <td>${biz ? biz.name : 'Unknown Business'}${biz?.archived ? ' <span style="font-size:0.65rem;color:var(--text-muted);background:rgba(255,255,255,0.05);padding:1px 6px;border-radius:3px;">Archived</span>' : ''}<br><span class="cell-sm-text" style="color:var(--text-muted)">${biz ? biz.taxId : ''}</span></td>
            <td>${l.action}</td>
            <td>${l.amount ? peso(l.amount) : '--'}</td>
            <td>${statusBadge(l.status)}</td>
            <td class="text-right"><div class="inline-actions">${payment ? `<button class="btn btn-blue btn-sm" onclick="openReceipt('${l.ref}')"><i class="fa-solid fa-receipt"></i> Receipt</button>` : ''}<button class="btn btn-secondary btn-sm" onclick="alert('Audit reference: ${l.ref}\\nTimestamp: ${l.ts}\\nAction: ${l.action}')"><i class="fa-solid fa-eye"></i></button></div></td>
        </tr>`;
    }).join('') || '<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-muted)">No audit log records match.</td></tr>';
}

/* =========================================================
   16) CREATE APPLICATION VIEW
   ========================================================= */
function buildPeriodOptions() {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
    const options = [];

    years.forEach(y => {
        options.push(`Annual Declaration - ${y}`);
    });
    years.forEach(y => {
        ['Q1', 'Q2', 'Q3', 'Q4'].forEach(q => {
            options.push(`${q} Quarterly Filing - ${y}`);
        });
    });
    return options;
}

function populatePeriodOptions() {
    const sel = document.getElementById('app-period');
    if (!sel || sel.options.length > 0) return;

    const currentYear = new Date().getFullYear();
    const defaultValue = `Annual Declaration - ${currentYear}`;

    buildPeriodOptions().forEach(label => {
        const opt = document.createElement('option');
        opt.value = label;
        opt.textContent = label;
        if (label === defaultValue) opt.selected = true;
        sel.appendChild(opt);
    });
}

function renderCreateApp() {
    const sel = document.getElementById('app-biz-select');
    if (!sel) return;
    if (sel.options.length === 0) {
        getActiveBusinesses().forEach(b => { const o = document.createElement('option'); o.value = b.id; o.textContent = b.name; sel.appendChild(o); });
    }

    populatePeriodOptions();
    attachCharCounter('app-desc', 'counter-app-desc', 500);

    const gross = document.getElementById('app-gross');
    const exempt = document.getElementById('app-exempt');
    if (gross) gross.addEventListener('input', updateCalc);
    if (exempt) exempt.addEventListener('input', updateCalc);
    updateCalc();

    const btn = document.getElementById('btn-submit-app');
    if (btn) btn.onclick = () => withSubmitLock(btn, submitApplication);

    const dz = document.getElementById('app-dropzone');
    if (dz) {
        dz.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = CONFIG.fileUpload.allowedExtensions.join(',');
            input.onchange = (e) => {
                const file = e.target.files[0];
                const errEl = document.getElementById('err-app-dropzone');
                if (!file) return;

                const ext = '.' + file.name.split('.').pop().toLowerCase();
                const validExt = CONFIG.fileUpload.allowedExtensions.includes(ext);
                // Browsers don't always populate file.type reliably for all OSes,
                // so we check both the extension and, when available, the real
                // MIME type reported by the browser.
                const validMime = !file.type || CONFIG.fileUpload.allowedMimeTypes.includes(file.type);

                if (!validExt || !validMime) {
                    errEl.textContent = `Unsupported file type. Please upload a ${CONFIG.fileUpload.allowedExtensions.join(', ')} file.`;
                    errEl.classList.remove('hidden');
                    dz.classList.add('input-error');
                    dz.classList.remove('has-file');
                    document.getElementById('dropzone-text').textContent = 'Drag and drop corporate financial documents here';
                    input.value = '';
                    return;
                }

                if (file.size > CONFIG.fileUpload.maxSizeBytes) {
                    const maxMb = (CONFIG.fileUpload.maxSizeBytes / (1024 * 1024)).toFixed(0);
                    errEl.textContent = `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is ${maxMb} MB.`;
                    errEl.classList.remove('hidden');
                    dz.classList.add('input-error');
                    dz.classList.remove('has-file');
                    document.getElementById('dropzone-text').textContent = 'Drag and drop corporate financial documents here';
                    input.value = '';
                    return;
                }

                document.getElementById('dropzone-text').textContent = '✓ ' + file.name + ` (${(file.size / 1024).toFixed(0)} KB)`;
                dz.classList.add('has-file');
                dz.classList.remove('input-error');
                errEl.classList.add('hidden');
                dz.dataset.fileName = file.name;
            };
            input.click();
        });
    }
}

function updateCalc() {
    const gross = parseFloat(document.getElementById('app-gross')?.value) || 0;
    const exempt = parseFloat(document.getElementById('app-exempt')?.value) || 0;
    const { taxable, rateLabel, fee, total } = calcTax(gross, exempt);
    const el = (id) => document.getElementById(id);
    if (el('calc-gross')) el('calc-gross').textContent = peso(taxable);
    if (el('calc-rate'))  el('calc-rate').textContent  = rateLabel;
    if (el('calc-fee'))   el('calc-fee').textContent   = peso(fee);
    if (el('calc-total')) el('calc-total').textContent = peso(total);
}

function submitApplication() {
    const bizId = document.getElementById('app-biz-select')?.value;
    const gross = parseFloat(document.getElementById('app-gross')?.value) || 0;
    const exempt = parseFloat(document.getElementById('app-exempt')?.value) || 0;
    const desc = document.getElementById('app-desc')?.value || '';
    const hasFile = document.getElementById('app-dropzone')?.classList.contains('has-file');
    let valid = true;

    if (gross <= 0) { document.getElementById('err-app-gross')?.classList.remove('hidden'); document.getElementById('app-gross')?.classList.add('input-error'); valid = false; }
    else { document.getElementById('err-app-gross')?.classList.add('hidden'); document.getElementById('app-gross')?.classList.remove('input-error'); }
    if (exempt > gross) { document.getElementById('err-app-exempt')?.classList.remove('hidden'); document.getElementById('app-exempt')?.classList.add('input-error'); valid = false; }
    else { document.getElementById('err-app-exempt')?.classList.add('hidden'); document.getElementById('app-exempt')?.classList.remove('input-error'); }
    if (!isNonEmptyTrimmed(desc, 10)) { document.getElementById('err-app-desc')?.classList.remove('hidden'); document.getElementById('err-app-desc').textContent = 'Please provide a detailed description (min 10 chars).'; document.getElementById('app-desc')?.classList.add('input-error'); valid = false; }
    else if (containsProfanity(desc)) { document.getElementById('err-app-desc')?.classList.remove('hidden'); document.getElementById('err-app-desc').textContent = 'Description contains inappropriate language. Please revise.'; document.getElementById('app-desc')?.classList.add('input-error'); valid = false; }
    else { document.getElementById('err-app-desc')?.classList.add('hidden'); document.getElementById('app-desc')?.classList.remove('input-error'); }
    if (!hasFile) { document.getElementById('err-app-dropzone')?.classList.remove('hidden'); document.getElementById('app-dropzone')?.classList.add('input-error'); valid = false; }
    if (!valid) return false;

    const { total } = calcTax(gross, exempt);
    const biz = getBiz(bizId);
    const period = document.getElementById('app-period')?.value || `Annual Declaration - ${new Date().getFullYear()}`;
    const asmtId = 'ASMT-' + Date.now();

    const newAsmt = {
        id: asmtId, bizId, period, category: 'Annual Gross Tax',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + CONFIG.filing.deadlineMonthsFromNow)).toISOString().slice(0, 10),
        amountDue: Math.round(total * 100) / 100, status: 'Assessment Received',
        auditRef: 'AUD-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000),
    };

    DB.assessments.unshift(newAsmt);
    DB.auditLogs.unshift({ ts: nowTs(), ref: asmtId, bizId, action: 'Assessment Filed', amount: null, status: 'Filed' });
    saveStore(DB);
    toast(`Assessment submitted for ${biz?.name}. Estimated due: ${peso(total)}`);
    showView('assessments');
}

/* =========================================================
   17) SETTINGS VIEW
   ========================================================= */
function renderSettings() {
    const s = DB.settings;
    const fields = { 'set-name': s.name, 'set-email': s.email, 'set-phone': s.phone };
    Object.entries(fields).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
    const langSel = document.querySelector('#settings-form select');
    if (langSel) langSel.value = s.language;
    renderSettingsToggles();
    attachCharCounter('set-name', 'counter-set-name', 50);

    const saveBtn = document.getElementById('btn-save-settings');
    if (saveBtn) saveBtn.onclick = () => withSubmitLock(saveBtn, saveSettings);

    const cancelBtn = document.getElementById('btn-cancel-settings');
    if (cancelBtn) cancelBtn.onclick = () => { renderSettings(); toast('Changes discarded.'); };

    const unlinkBtn = document.getElementById('btn-unlink-profile');
    if (unlinkBtn) unlinkBtn.onclick = unlinkProfile;
}

function unlinkProfile() {
    const activeBiz = getActiveBusinesses();
    if (activeBiz.length === 0) {
        toast('No active businesses to unlink — your profile is already inactive.');
        return;
    }

    if (!confirm(`This will archive all ${activeBiz.length} of your active business(es) and remove them from your active portfolio. Your payment history and records will be kept and can be restored later. Continue?`)) return;

    const today = new Date().toISOString().slice(0, 10);
    activeBiz.forEach(b => {
        b.archived = true;
        b.archivedDate = today;
        b.status = 'Archived';
        DB.auditLogs.unshift({ ts: nowTs(), ref: b.id, bizId: b.id, action: 'Business Archived (Profile Unlink)', amount: null, status: 'Archived' });
    });

    saveStore(DB);
    toast(`Profile unlinked. ${activeBiz.length} business(es) archived.`);
    renderDashboard();
}

function renderSettingsToggles() {
    const container = document.getElementById('settings-toggles');
    if (!container) return;
    container.innerHTML = CONFIG.settingsToggles.map(item => `
        <div class="settings-list-item">
            <div class="item-text"><h4>${item.label}</h4><p>${item.desc}</p></div>
            <div class="toggle-switch ${DB.settings.toggles[item.key] ? 'active' : ''}" data-key="${item.key}" onclick="toggleSetting('${item.key}', this)"></div>
        </div>`).join('');
}

function toggleSetting(key, el) {
    DB.settings.toggles[key] = !DB.settings.toggles[key];
    el.classList.toggle('active', DB.settings.toggles[key]);
    saveStore(DB);
}

function saveSettings() {
    const name = document.getElementById('set-name')?.value.trim();
    const email = document.getElementById('set-email')?.value.trim();
    const phone = document.getElementById('set-phone')?.value.trim();
    const lang = document.querySelector('#settings-form select')?.value;
    let valid = true;

    const validateField = (id, errId, condition) => {
        const el = document.getElementById(id);
        const err = document.getElementById(errId);
        if (!condition) { el?.classList.add('input-error'); err?.classList.remove('hidden'); valid = false; }
        else { el?.classList.remove('input-error'); err?.classList.add('hidden'); }
    };

    validateField('set-name', 'err-set-name', name && name.length > 2);
    validateField('set-email', 'err-set-email', email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    validateField('set-phone', 'err-set-phone', phone && phone.length >= 7);
    if (!valid) return false;

    DB.settings.name = name;
    DB.settings.email = email;
    DB.settings.phone = phone;
    DB.settings.language = lang || 'English';
    saveStore(DB);
    toast('Settings saved successfully.');
}

/* =========================================================
   18) TOAST
   ========================================================= */
function toast(msg) {
    let t = document.getElementById('pb-toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'pb-toast';
        t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#00A86B;color:#fff;padding:12px 24px;border-radius:6px;font-size:0.85rem;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.3);transition:opacity 0.3s;white-space:nowrap;max-width:90vw;text-align:center;';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._to);
    t._to = setTimeout(() => { t.style.opacity = '0'; }, 3500);
}

async function logout() {
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            console.log("Initiating secure logout sequence...");

            // 1. Wipe browser local security footprints
            localStorage.removeItem("currentUser");
            sessionStorage.clear();

            // 2. Clear the browser authentication cookie
            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";

            // 3. Clear session tracking row from database
            try {
                await fetch("/api/auth/logout", { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });
            } catch (err) {
                console.warn("Backend session cleanup skipped:", err);
            }

            window.location.replace('/portal');
        });
    }
}



/* =========================================================
   19) EVENT BINDINGS
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => { e.preventDefault(); showView('dashboard'); });
    document.getElementById('nav-portfolio')?.addEventListener('click', (e) => { e.preventDefault(); showView('portfolio'); });
    document.getElementById('nav-assessments')?.addEventListener('click', (e) => { e.preventDefault(); showView('assessments'); });
    document.getElementById('nav-history')?.addEventListener('click', (e) => { e.preventDefault(); showView('history'); });
    document.getElementById('nav-file-assessment')?.addEventListener('click', (e) => { e.preventDefault(); showView('create-application'); });
    document.getElementById('nav-receipt')?.addEventListener('click', (e) => { e.preventDefault(); showView('receipt'); });
    document.getElementById('nav-general-history')?.addEventListener('click', (e) => { e.preventDefault(); showView('general-history'); });
    document.getElementById('nav-settings')?.addEventListener('click', (e) => { e.preventDefault(); showView('settings'); });

    document.getElementById('ai-menu-trigger')?.addEventListener('click', (e) => { e.preventDefault(); const panel = document.getElementById('ai-chat-panel'); if (panel) panel.classList.toggle('hidden'); });
    document.getElementById('close-ai-btn')?.addEventListener('click', () => { document.getElementById('ai-chat-panel')?.classList.add('hidden'); });
    document.getElementById('ai-send-btn')?.addEventListener('click', handleAIChat);
    document.getElementById('ai-input-field')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAIChat(); });

    document.getElementById('menu-toggle-btn')?.addEventListener('click', () => { document.getElementById('sidebar-menu')?.classList.toggle('hidden'); });
    document.getElementById('info-btn')?.addEventListener('click', showPortalInfo);
    document.getElementById('contact-btn')?.addEventListener('click', showContactInfo);
    document.querySelector('.portfolio-card .btn-blue')?.addEventListener('click', () => showView('history'));
    document.querySelector('.portfolio-search-bar .btn-green')?.addEventListener('click', registerNewBusiness);
    document.querySelector('.portfolio-search-bar .search-input')?.addEventListener('input', (e) => { renderPortfolioAssets(e.target.value); });
    document.getElementById('btn-export-csv')?.addEventListener('click', exportCSV);
    document.querySelector('.receipt-alert-bar .btn-secondary:nth-child(1)')?.addEventListener('click', printReceipt);
    document.querySelector('.receipt-alert-bar .btn-secondary:nth-child(2)')?.addEventListener('click', () => downloadReceiptPdf(null));

        const cachedUser = localStorage.getItem("currentUser");
        if (!cachedUser) {
            alert("Access Denied: Please log in to view your dashboard contract.");
            window.location.href = "/client-login";
        }

    
    logout();
    showView('dashboard');
    initClientHeader();
    initClientSidebar();
    initAIPanel();
});
