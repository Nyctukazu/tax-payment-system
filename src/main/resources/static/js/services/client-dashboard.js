/* =========================================================
   PasayBiz Portal — client-dashboard.js
   Fully dynamic: Portfolio, Returns, Assessments, Payment
   History, Receipt (last-clicked), Audit Logs, Settings
   ========================================================= */

'use strict';

/* =========================================================
   DATA STORE  (localStorage-backed, initialised once)
   ========================================================= */
const STORE_KEY = 'pasaybiz_data';

function loadStore() {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);

    // ---- seed data ----
    const seed = {
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
                amountDue: 52500.00,
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
                amountDue: 120000.00,
                status: 'Overdue',
                auditRef: 'AUD-2024-55D',
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
                amount: 52500.00,
                surcharge: 0,
                mode: 'Online Banking',
                status: 'Paid',
                period: 'Fiscal Year 2023',
                auditRef: 'AUD-2023-91B',
                items: [
                    { desc: 'Section 2B-01: Municipal Gross Tax on IT Services', base: 3500000, rate: '1.50%', total: 52500 },
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
                    { desc: 'Section 3A-01: Municipal Gross Tax on Health & Wellness', base: 800000, rate: '1.45%', total: 11600 },
                    { desc: 'Section 4D-01: Regulatory Health Services Fee', base: null, rate: 'Flat Rate', total: 400 },
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
            { ts: '2026-06-13 17:13', ref: 'OR-987654321', bizId: 'BIZ-001', action: 'Payment Processed', amount: 145200, status: 'Success' },
            { ts: '2024-03-12 09:45', ref: 'OR-876543210', bizId: 'BIZ-002', action: 'Payment Processed', amount: 52500,  status: 'Success' },
            { ts: '2024-01-20 14:22', ref: 'OR-765432109', bizId: 'BIZ-003', action: 'Payment Processed', amount: 12000,  status: 'Success' },
            { ts: '2023-06-30 11:00', ref: 'OR-654321098', bizId: 'BIZ-001', action: 'Permit Renewal',    amount: 5000,   status: 'Success' },
            { ts: '2024-01-15 08:30', ref: 'ASMT-2024-001', bizId: 'BIZ-001', action: 'Assessment Filed', amount: null,  status: 'Filed' },
            { ts: '2024-02-20 10:10', ref: 'ASMT-2024-002', bizId: 'BIZ-002', action: 'Assessment Filed', amount: null,  status: 'Filed' },
        ],
        lastViewedReceiptId: null,
    };

    localStorage.setItem(STORE_KEY, JSON.stringify(seed));
    return seed;
}

function saveStore(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

let DB = loadStore();

/* =========================================================
   HELPERS
   ========================================================= */
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

function statusBadge(s) {
    const map = {
        'Assessment Received': 'status-received',
        'Filed': 'status-received',
        'Paid': 'status-received',
        'Success': 'status-received',
        'Pending Review': 'status-pending',
        'Pending Renewal': 'status-pending',
        'Overdue': 'status-missing',
        'Active': 'status-received',
    };
    return `<span class="lbl-status ${map[s] || 'status-pending'}">${s}</span>`;
}

function genOR() {
    return 'OR-' + Math.floor(100000000 + Math.random() * 900000000);
}

function nowTs() {
    return new Date().toISOString().replace('T', ' ').slice(0, 16);
}

function calcTax(gross, exempt) {
    const taxable = Math.max(0, gross - exempt);
    const rate = taxable > 5000000 ? 0.02 : taxable > 2000000 ? 0.0175 : 0.015;
    const fee = 200;
    const tax = taxable * rate;
    return { taxable, rate, fee, total: tax + fee };
}

/* =========================================================
   VIEW NAVIGATION
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

    // Render on demand
    switch (name) {
        case 'dashboard':        renderDashboard();       break;
        case 'portfolio':        renderPortfolioAssets(); break;
        case 'assessments':      renderAssessmentsTable(); break;
        case 'history':          renderPaymentHistory();   break;
        case 'general-history':  renderAuditLogs();        break;
        case 'settings':         renderSettings();         break;
        case 'receipt':          renderReceipt();          break;
        case 'create-application': renderCreateApp();      break;
    }
}

/* =========================================================
   DASHBOARD
   ========================================================= */
function renderDashboard() {
    renderPortfolioGrid();
    renderActiveTaxAssessment();
    renderLedger();
}

function renderPortfolioGrid() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    grid.innerHTML = DB.businesses.map(b => `
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
    const box = document.querySelector('.assessment-box');
    if (!box) return;
    // Show the first non-filed assessment
    const a = DB.assessments.find(x => x.status !== 'Filed' && x.status !== 'Paid') || DB.assessments[0];
    const biz = getBiz(a.bizId);
    box.innerHTML = `
        <div class="assessment-title">
            <div class="biz-icon"><i class="fa-solid ${biz.icon}"></i></div>
            <span>${biz.name}</span>
        </div>
        <div class="assessment-body">
            <p><span>Status:</span><strong>${a.status}</strong></p>
            <p><span>Period:</span><span>${a.period}</span></p>
            <p><span>Deadline:</span><span>${fmtDate(a.deadline)}</span></p>
            <p><span>Amount Due:</span><span class="amount">${peso(a.amountDue)}</span></p>
        </div>
        <button class="btn btn-primary btn-block" onclick="handlePayNow('${a.id}')">Pay Now</button>
        <button class="btn btn-secondary btn-block" style="margin-top:8px" onclick="showView('file-assessment')">File Protest</button>`;
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

/* =========================================================
   PORTFOLIO VIEW
   ========================================================= */
function renderPortfolioAssets(filter = '') {
    const container = document.getElementById('asset-list-container');
    if (!container) return;
    const filtered = DB.businesses.filter(b =>
        b.name.toLowerCase().includes(filter.toLowerCase()) ||
        b.type.toLowerCase().includes(filter.toLowerCase()) ||
        b.taxId.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = `<div class="card" style="text-align:center;padding:40px;color:var(--text-muted)">No matching business assets found.</div>`;
        return;
    }

    container.innerHTML = filtered.map(b => `
        <div class="card asset-row">
            <div class="asset-identity">
                <div class="asset-icon-box"><i class="fa-solid ${b.icon}"></i></div>
                <div>
                    <h4>${b.name}</h4>
                    <p class="asset-subtext">${b.taxId} · ${b.type}</p>
                    <p class="asset-subtext" style="margin-top:3px">${b.address}</p>
                </div>
            </div>
            <div class="asset-meta">
                <span class="meta-label">Last Filed</span>
                <span class="meta-val">${fmtDate(b.lastFiled)}</span>
            </div>
            <div class="asset-meta">
                <span class="meta-label">Status</span>
                <span class="meta-val">${statusBadge(b.status)}</span>
            </div>
            <div class="asset-control-btns">
                <button class="btn btn-blue btn-sm" onclick="viewReturnsForBiz('${b.id}')">View Returns</button>
                <button class="btn btn-secondary btn-sm" onclick="fileReturnForBiz('${b.id}')">File Return</button>
                <button class="btn btn-secondary btn-sm" onclick="editBusiness('${b.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn btn-sm" style="background:rgba(239,68,68,0.15);color:#EF4444" onclick="deleteBusiness('${b.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`).join('');
}

function viewReturnsForBiz(bizId) {
    showView('history');
    // Pre-filter history by this business after render
    setTimeout(() => {
        const sel = document.getElementById('history-filter-biz');
        if (sel) { sel.value = bizId; filterHistory(); }
    }, 100);
}

function fileReturnForBiz(bizId) {
    showView('create-application');
    setTimeout(() => {
        const sel = document.getElementById('app-biz-select');
        if (sel) { sel.value = bizId; }
    }, 100);
}

function editBusiness(bizId) {
    const b = getBiz(bizId);
    if (!b) return;
    const name = prompt('Business Name:', b.name);
    if (name === null) return;
    const type = prompt('Business Type:', b.type);
    if (type === null) return;
    const address = prompt('Registered Address:', b.address);
    if (address === null) return;
    b.name = name.trim() || b.name;
    b.type = type.trim() || b.type;
    b.address = address.trim() || b.address;
    saveStore(DB);
    renderPortfolioAssets();
    toast('Business updated successfully.');
}

function deleteBusiness(bizId) {
    const b = getBiz(bizId);
    if (!b) return;
    if (!confirm(`Remove "${b.name}" from your portfolio? This cannot be undone.`)) return;
    DB.businesses = DB.businesses.filter(x => x.id !== bizId);
    saveStore(DB);
    renderPortfolioAssets();
    toast('Business removed from portfolio.');
}

function registerNewBusiness() {
    const name    = prompt('Business Name:');
    if (!name) return;
    const type    = prompt('Business Type (e.g. Retail, IT Services):') || 'General';
    const address = prompt('Registered Address:') || 'Pasay City';
    const gross   = parseFloat(prompt('Annual Gross Sales (PHP):') || '0');

    const icons = ['fa-store','fa-laptop-code','fa-building','fa-utensils','fa-spa','fa-industry','fa-truck'];
    const newBiz = {
        id: 'BIZ-' + Date.now(),
        name: name.trim(),
        icon: icons[Math.floor(Math.random() * icons.length)],
        type: type.trim(),
        taxId: 'PX-' + Math.floor(1000 + Math.random() * 9000),
        address: address.trim(),
        grossSales: gross || 0,
        status: 'Pending Renewal',
        lastFiled: null,
        permitExpiry: null,
    };
    DB.businesses.push(newBiz);
    saveStore(DB);
    renderPortfolioAssets();
    toast(`"${newBiz.name}" registered successfully.`);
}

/* =========================================================
   ASSESSMENTS VIEW
   ========================================================= */
function renderAssessmentsTable(filterBiz = 'all', filterStatus = 'all') {
    // Summary boxes
    const outstanding = DB.assessments
        .filter(a => a.status !== 'Filed' && a.status !== 'Paid')
        .reduce((s, a) => s + a.amountDue, 0);
    const pending = DB.assessments.filter(a => a.status === 'Assessment Received' || a.status === 'Pending Review').length;
    const overdue = DB.assessments.filter(a => a.status === 'Overdue');
    const nextDeadline = DB.assessments
        .filter(a => a.status !== 'Filed' && a.status !== 'Paid')
        .map(a => new Date(a.deadline))
        .sort((a, b) => a - b)[0];

    const sv = document.querySelector('.summary-red .summary-value');
    const sa = document.querySelector('.summary-amber .summary-value');
    const sb = document.querySelector('.summary-blue .summary-value');
    if (sv) sv.textContent = peso(outstanding);
    if (sa) sa.textContent = pending + ' Pending';
    if (sb) sb.textContent = nextDeadline ? nextDeadline.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : 'None';

    // Populate filter dropdowns
    const fBiz    = document.querySelector('#view-assessments .filter-controls select:nth-child(1)');
    const fStatus = document.querySelector('#view-assessments .filter-controls select:nth-child(2)');

    if (fBiz && fBiz.options.length <= 1) {
        DB.businesses.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b.id; opt.textContent = b.name;
            fBiz.appendChild(opt);
        });
        fBiz.addEventListener('change', () => renderAssessmentsTable(fBiz.value, fStatus.value));
    }
    if (fStatus && fStatus.options.length <= 1) {
        ['Assessment Received','Pending Review','Filed','Overdue'].forEach(s => {
            const opt = document.createElement('option');
            opt.value = s; opt.textContent = s;
            fStatus.appendChild(opt);
        });
        fStatus.addEventListener('change', () => renderAssessmentsTable(fBiz ? fBiz.value : 'all', fStatus.value));
    }

    // Table rows
    const tbody = document.getElementById('assessments-tbody');
    if (!tbody) return;

    let list = [...DB.assessments];
    if (filterBiz   !== 'all' && filterBiz)    list = list.filter(a => a.bizId === filterBiz);
    if (filterStatus !== 'all' && filterStatus) list = list.filter(a => a.status === filterStatus);

    tbody.innerHTML = list.map(a => {
        const biz = getBiz(a.bizId);
        return `<tr>
            <td>
                <div style="display:flex;align-items:center;gap:10px">
                    <div class="biz-icon" style="width:30px;height:30px;font-size:0.85rem;margin:0"><i class="fa-solid ${biz.icon}"></i></div>
                    <div><strong>${biz.name}</strong><br><span class="cell-sm-text" style="color:var(--text-muted)">${biz.taxId}</span></div>
                </div>
            </td>
            <td class="cell-sm-text">${a.id}</td>
            <td class="cell-sm-text">${a.category}<br><span style="color:var(--text-muted)">${a.period}</span></td>
            <td class="cell-sm-text">${fmtDate(a.deadline)}</td>
            <td><strong>${peso(a.amountDue)}</strong></td>
            <td>${statusBadge(a.status)}</td>
            <td class="text-right">
                <div class="inline-actions">
                    ${a.status !== 'Filed' && a.status !== 'Paid' ? `<button class="btn btn-primary btn-sm" onclick="handlePayNow('${a.id}')">Pay Now</button>` : ''}
                    <button class="btn btn-secondary btn-sm" onclick="fileReturnForBiz('${a.bizId}')">File Return</button>
                    <button class="btn btn-blue btn-sm" onclick="viewReturnForAssessment('${a.id}')">View</button>
                </div>
            </td>
        </tr>`;
    }).join('');

    if (tbody.innerHTML === '') {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-muted)">No assessments match the selected filters.</td></tr>';
    }
}

function viewReturnForAssessment(asmtId) {
    const asmt = DB.assessments.find(a => a.id === asmtId);
    if (!asmt) return;
    const payment = DB.payments.find(p => p.assessmentId === asmtId);
    if (payment) {
        openReceipt(payment.id);
    } else {
        alert('No payment record found for this assessment. It may still be pending.');
    }
}

/* =========================================================
   PAY NOW (creates a payment record + receipt)
   ========================================================= */
function handlePayNow(asmtId) {
    const asmt = DB.assessments.find(a => a.id === asmtId);
    if (!asmt) return;
    const biz = getBiz(asmt.bizId);

    const modeOptions = ['Electronic Fund Transfer', 'Online Banking', 'Counter Payment', 'GCash / Maya'];
    const modeStr = modeOptions.map((m, i) => `${i + 1}. ${m}`).join('\n');
    const choice = parseInt(prompt(`Select payment mode:\n${modeStr}\n\nEnter number (1-4):`)) || 1;
    const mode = modeOptions[Math.min(Math.max(choice - 1, 0), 3)];

    if (!confirm(`Confirm payment of ${peso(asmt.amountDue)} for "${biz.name}" via ${mode}?`)) return;

    const orId = genOR();
    const rate = asmt.amountDue > 5200 ? '1.45%' : '1.50%';
    const taxBase = asmt.amountDue - 200;

    const payment = {
        id: orId,
        bizId: asmt.bizId,
        assessmentId: asmtId,
        date: new Date().toISOString().slice(0, 10),
        type: asmt.category,
        amount: asmt.amountDue,
        surcharge: 0,
        mode,
        status: 'Paid',
        period: asmt.period,
        auditRef: asmt.auditRef,
        items: [
            { desc: `Municipal Gross Tax – ${biz.type}`, base: taxBase / 0.0145, rate, total: taxBase },
            { desc: 'Section 4C-02: Local Environmental Regulatory Fee', base: null, rate: 'Flat Rate', total: 200 },
        ],
    };

    DB.payments.unshift(payment);
    asmt.status = 'Filed';
    const b = getBiz(asmt.bizId);
    if (b) b.lastFiled = payment.date;

    DB.auditLogs.unshift({
        ts: nowTs(),
        ref: orId,
        bizId: asmt.bizId,
        action: 'Payment Processed',
        amount: asmt.amountDue,
        status: 'Success',
    });

    saveStore(DB);
    toast(`Payment of ${peso(asmt.amountDue)} processed. Receipt ${orId} generated.`);
    openReceipt(orId);
}

/* =========================================================
   PAYMENT HISTORY VIEW
   ========================================================= */
function renderPaymentHistory() {
    // Summary stats
    const ytd = DB.payments.filter(p => p.status === 'Paid' && p.date.startsWith('2024') || p.date.startsWith('2026'))
                            .reduce((s, p) => s + p.amount, 0);
    const last = DB.payments[0];
    const activeBiz = DB.businesses.filter(b => b.status === 'Active').length;

    const boxes = document.querySelectorAll('#view-history .summary-value');
    if (boxes[0]) boxes[0].textContent = peso(ytd);
    if (boxes[1]) boxes[1].textContent = last ? peso(last.amount) : '--';
    if (boxes[2]) boxes[2].textContent = activeBiz;

    const lastPaidEl = document.querySelector('#view-history .meta-subtext');
    if (lastPaidEl && last) lastPaidEl.textContent = `Processed on ${fmtDate(last.date)}`;

    // Filter dropdowns
    const fBiz  = document.getElementById('history-filter-biz');
    const fType = document.getElementById('history-filter-type');

    if (fBiz && fBiz.options.length <= 1) {
        DB.businesses.forEach(b => {
            const o = document.createElement('option'); o.value = b.id; o.textContent = b.name; fBiz.appendChild(o);
        });
        fBiz.addEventListener('change', filterHistory);
    }
    if (fType && fType.options.length <= 1) {
        const types = [...new Set(DB.payments.map(p => p.type))];
        types.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; fType.appendChild(o); });
        fType.addEventListener('change', filterHistory);
    }

    // Search
    const search = document.getElementById('history-search-input');
    if (search) {
        search.oninput = () => filterHistory();
    }

    filterHistory();
}

function filterHistory() {
    const query = (document.getElementById('history-search-input')?.value || '').toLowerCase();
    const fBiz  = document.getElementById('history-filter-biz')?.value || 'all';
    const fType = document.getElementById('history-filter-type')?.value || 'all';

    let list = [...DB.payments];
    if (fBiz !== 'all') list = list.filter(p => p.bizId === fBiz);
    if (fType !== 'all') list = list.filter(p => p.type === fType);
    if (query) list = list.filter(p => {
        const biz = getBiz(p.bizId);
        return p.id.toLowerCase().includes(query) ||
               (biz && biz.name.toLowerCase().includes(query)) ||
               p.type.toLowerCase().includes(query);
    });

    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;

    tbody.innerHTML = list.map(p => {
        const biz = getBiz(p.bizId);
        return `<tr>
            <td>${fmtDate(p.date)}</td>
            <td>${biz ? biz.name : p.bizId}</td>
            <td>${p.type}</td>
            <td><strong>${peso(p.amount)}</strong></td>
            <td>${statusBadge(p.status)}</td>
            <td>
                <div class="inline-actions">
                    <button class="btn btn-blue btn-sm" onclick="openReceipt('${p.id}')"><i class="fa-solid fa-receipt"></i> View Receipt</button>
                    <button class="btn btn-secondary btn-sm" onclick="downloadReceiptPdf('${p.id}')"><i class="fa-solid fa-file-pdf"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');

    if (!tbody.innerHTML) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-muted)">No records match your search.</td></tr>';
    }
}

// Export CSV
function exportCSV() {
    const rows = [['Date','Business Name','Assessment Type','Amount','Status','Receipt ID']];
    DB.payments.forEach(p => {
        const biz = getBiz(p.bizId);
        rows.push([fmtDate(p.date), biz ? biz.name : p.bizId, p.type, p.amount, p.status, p.id]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'PasayBiz_PaymentHistory.csv';
    a.click();
    toast('CSV exported.');
}

/* =========================================================
   RECEIPT VIEW
   ========================================================= */
function openReceipt(paymentId) {
    DB.lastViewedReceiptId = paymentId;
    saveStore(DB);
    showView('receipt');
}

function renderReceipt() {
    const pid = DB.lastViewedReceiptId;
    const p   = DB.payments.find(x => x.id === pid) || DB.payments[0];
    if (!p) return;

    const biz = getBiz(p.bizId);
    const total = p.amount + (p.surcharge || 0);

    // Alert bar
    const alertBar = document.querySelector('.receipt-alert-bar');
    if (alertBar) {
        alertBar.querySelector('.alert-text span').textContent =
            `Payment Finalized successfully — Receipt ${p.id} · ${fmtDate(p.date)}.`;
    }

    // Receipt card
    const card = document.querySelector('.receipt-card');
    if (!card) return;

    card.innerHTML = `
        <div class="receipt-header">
            <div class="receipt-header-left">
                <i class="fa-solid fa-building-columns receipt-logo"></i>
                <div>
                    <h4>Pasay City Treasurer's Office</h4>
                    <p>Revenue &amp; Tax Management Division</p>
                    <p>F.B. Harrison St., Pasay City, Metro Manila</p>
                </div>
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
                <h5 class="entity-name">${biz ? biz.name : p.bizId}</h5>
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
            <thead>
                <tr>
                    <th>Revenue Code Item / Description</th>
                    <th class="text-right">Base Assessment Scale</th>
                    <th class="text-right">Rate Index</th>
                    <th class="text-right">Total Settle Amount</th>
                </tr>
            </thead>
            <tbody>
                ${(p.items || []).map(item => `
                <tr>
                    <td>${item.desc}</td>
                    <td class="text-right">${item.base ? peso(item.base) : '--'}</td>
                    <td class="text-right">${item.rate}</td>
                    <td class="text-right">${peso(item.total)}</td>
                </tr>`).join('')}
            </tbody>
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

function printReceipt() {
    window.print();
}

function downloadReceiptPdf(paymentId) {
    if (paymentId) {
        DB.lastViewedReceiptId = paymentId;
        saveStore(DB);
        renderReceipt();
    }
    const pid = DB.lastViewedReceiptId;
    const p = DB.payments.find(x => x.id === pid) || DB.payments[0];
    const biz = getBiz(p?.bizId);

    // Build a clean printable HTML string
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Receipt ${p.id}</title>
<style>
body{font-family:Arial,sans-serif;color:#111;max-width:700px;margin:40px auto;padding:0 20px}
h2{margin-bottom:4px} .header{display:flex;justify-content:space-between;border-bottom:2px solid #333;padding-bottom:16px;margin-bottom:20px}
.right{text-align:right} table{width:100%;border-collapse:collapse;margin:20px 0}
th{background:#f0f0f0;padding:10px;text-align:left;font-size:13px} td{padding:10px;border-bottom:1px solid #eee;font-size:13px}
.totals{float:right;width:280px;margin-top:10px} .tr{display:flex;justify-content:space-between;padding:6px 0;font-size:13px}
.grand{font-weight:bold;font-size:15px;border-top:2px solid #333;padding-top:10px;margin-top:6px}
.footer{margin-top:60px;border-top:1px solid #ccc;padding-top:14px;font-size:11px;color:#666;text-align:center}
</style></head><body>
<div class="header">
  <div><h2>Pasay City Treasurer's Office</h2><p style="margin:0;font-size:13px">Revenue & Tax Management Division<br>F.B. Harrison St., Pasay City, Metro Manila</p></div>
  <div class="right"><h3 style="color:green;margin-bottom:6px">OFFICIAL RECEIPT</h3>
    <p style="margin:2px 0;font-size:13px">OR No: <strong>${p.id}</strong></p>
    <p style="margin:2px 0;font-size:13px">Date: <strong>${fmtDate(p.date)}</strong></p>
    <p style="margin:2px 0;font-size:13px">Mode: <strong>${p.mode}</strong></p>
  </div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;font-size:13px">
  <div><strong>Taxpayer:</strong> ${biz?.name || '--'}<br>Tax ID: ${biz?.taxId || '--'}<br>Business Type: ${biz?.type || '--'}<br>Address: ${biz?.address || '--'}</div>
  <div><strong>Assessment Context:</strong> ${p.type}<br>Filing Period: ${p.period}<br>Audit Ref: ${p.auditRef || '--'}</div>
</div>
<table><thead><tr><th>Description</th><th>Base Amount</th><th>Rate</th><th style="text-align:right">Total</th></tr></thead>
<tbody>${(p.items||[]).map(i=>`<tr><td>${i.desc}</td><td>${i.base?peso(i.base):'--'}</td><td>${i.rate}</td><td style="text-align:right">${peso(i.total)}</td></tr>`).join('')}</tbody></table>
<div class="totals">
  <div class="tr"><span>Subtotal:</span><span>${peso(p.amount)}</span></div>
  <div class="tr"><span>Surcharges:</span><span>${peso(p.surcharge||0)}</span></div>
  <div class="tr"><span>Status:</span><span style="color:green">Paid in Full</span></div>
  <div class="tr grand"><span>TOTAL:</span><span>${peso((p.amount)+(p.surcharge||0))}</span></div>
</div>
<div style="clear:both"></div>
<div class="footer"><p>This is an official electronic receipt under Pasay City local regulatory laws.</p><p>Digital signature: ${generateFingerprint(p.id)}</p></div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Receipt_${p.id}.html`;
    a.click();
    toast('Receipt downloaded.');
}

/* =========================================================
   AUDIT LOGS / HISTORY VIEW
   ========================================================= */
function renderAuditLogs(filterBiz = 'all', filterAction = 'all', query = '') {
    // Populate filters
    const fBiz    = document.getElementById('logs-filter-biz');
    const fAction = document.getElementById('logs-filter-action');

    if (fBiz && fBiz.options.length <= 1) {
        DB.businesses.forEach(b => { const o = document.createElement('option'); o.value = b.id; o.textContent = b.name; fBiz.appendChild(o); });
        fBiz.addEventListener('change', () => renderAuditLogs(fBiz.value, fAction?.value, document.getElementById('logs-search-input')?.value));
    }
    if (fAction && fAction.options.length <= 1) {
        [...new Set(DB.auditLogs.map(l => l.action))].forEach(a => { const o = document.createElement('option'); o.value = a; o.textContent = a; fAction.appendChild(o); });
        fAction.addEventListener('change', () => renderAuditLogs(fBiz?.value, fAction.value, document.getElementById('logs-search-input')?.value));
    }

    const search = document.getElementById('logs-search-input');
    if (search) search.oninput = () => renderAuditLogs(fBiz?.value, fAction?.value, search.value);

    let list = [...DB.auditLogs];
    if (filterBiz    !== 'all' && filterBiz)    list = list.filter(l => l.bizId === filterBiz);
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
            <td>${biz ? biz.name : l.bizId}<br><span class="cell-sm-text" style="color:var(--text-muted)">${biz ? biz.taxId : ''}</span></td>
            <td>${l.action}</td>
            <td>${l.amount ? peso(l.amount) : '--'}</td>
            <td>${statusBadge(l.status)}</td>
            <td class="text-right">
                <div class="inline-actions">
                    ${payment ? `<button class="btn btn-blue btn-sm" onclick="openReceipt('${l.ref}')"><i class="fa-solid fa-receipt"></i> Receipt</button>` : ''}
                    <button class="btn btn-secondary btn-sm" onclick="alert('Audit reference: ${l.ref}\\nTimestamp: ${l.ts}\\nAction: ${l.action}')"><i class="fa-solid fa-eye"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');

    if (!tbody.innerHTML) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-muted)">No audit log records match.</td></tr>';
    }
}

/* =========================================================
   FILE ASSESSMENT / CREATE APPLICATION VIEW
   ========================================================= */
function renderCreateApp() {
    const sel = document.getElementById('app-biz-select');
    if (!sel) return;

    // Populate business select
    if (sel.options.length === 0) {
        DB.businesses.forEach(b => {
            const o = document.createElement('option');
            o.value = b.id; o.textContent = b.name;
            sel.appendChild(o);
        });
    }

    // Live calc
    const gross  = document.getElementById('app-gross');
    const exempt = document.getElementById('app-exempt');
    if (gross) gross.addEventListener('input', updateCalc);
    if (exempt) exempt.addEventListener('input', updateCalc);
    updateCalc();

    // Submit
    const btn = document.getElementById('btn-submit-app');
    if (btn) btn.onclick = submitApplication;

    // Dropzone
    const dz = document.getElementById('app-dropzone');
    if (dz) {
        dz.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.jpg,.jpeg,.png';
            input.onchange = (e) => {
                if (e.target.files[0]) {
                    document.getElementById('dropzone-text').textContent = '✓ ' + e.target.files[0].name;
                    dz.classList.add('has-file');
                    dz.classList.remove('input-error');
                    document.getElementById('err-app-dropzone').classList.add('hidden');
                }
            };
            input.click();
        });
    }
}

function updateCalc() {
    const gross  = parseFloat(document.getElementById('app-gross')?.value) || 0;
    const exempt = parseFloat(document.getElementById('app-exempt')?.value) || 0;
    const { taxable, rate, fee, total } = calcTax(gross, exempt);

    const el = (id) => document.getElementById(id);
    if (el('calc-gross')) el('calc-gross').textContent = peso(taxable);
    if (el('calc-rate'))  el('calc-rate').textContent  = (rate * 100).toFixed(2) + '%';
    if (el('calc-fee'))   el('calc-fee').textContent   = peso(fee);
    if (el('calc-total')) el('calc-total').textContent = peso(total);
}

function submitApplication() {
    const bizId = document.getElementById('app-biz-select')?.value;
    const gross  = parseFloat(document.getElementById('app-gross')?.value) || 0;
    const exempt = parseFloat(document.getElementById('app-exempt')?.value) || 0;
    const desc   = document.getElementById('app-desc')?.value || '';
    const hasFile = document.getElementById('app-dropzone')?.classList.contains('has-file');

    let valid = true;

    const errGross  = document.getElementById('err-app-gross');
    const errExempt = document.getElementById('err-app-exempt');
    const errDesc   = document.getElementById('err-app-desc');
    const errDrop   = document.getElementById('err-app-dropzone');

    if (gross <= 0) { errGross?.classList.remove('hidden'); document.getElementById('app-gross')?.classList.add('input-error'); valid = false; }
    else { errGross?.classList.add('hidden'); document.getElementById('app-gross')?.classList.remove('input-error'); }

    if (exempt > gross) { errExempt?.classList.remove('hidden'); document.getElementById('app-exempt')?.classList.add('input-error'); valid = false; }
    else { errExempt?.classList.add('hidden'); document.getElementById('app-exempt')?.classList.remove('input-error'); }

    if (desc.length < 10) { errDesc?.classList.remove('hidden'); document.getElementById('app-desc')?.classList.add('input-error'); valid = false; }
    else { errDesc?.classList.add('hidden'); document.getElementById('app-desc')?.classList.remove('input-error'); }

    if (!hasFile) { errDrop?.classList.remove('hidden'); document.getElementById('app-dropzone')?.classList.add('input-error'); valid = false; }

    if (!valid) return;

    const { total } = calcTax(gross, exempt);
    const biz  = getBiz(bizId);
    const period = document.querySelector('#view-create-application input[readonly]')?.value || 'Annual Declaration - 2024';
    const asmtId = 'ASMT-' + Date.now();

    const newAsmt = {
        id: asmtId,
        bizId,
        period,
        category: 'Annual Gross Tax',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().slice(0, 10),
        amountDue: Math.round(total * 100) / 100,
        status: 'Assessment Received',
        auditRef: 'AUD-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000),
    };

    DB.assessments.unshift(newAsmt);
    if (biz) biz.lastFiled = new Date().toISOString().slice(0, 10);

    DB.auditLogs.unshift({
        ts: nowTs(),
        ref: asmtId,
        bizId,
        action: 'Assessment Filed',
        amount: null,
        status: 'Filed',
    });

    saveStore(DB);
    toast(`Assessment submitted for ${biz?.name}. Estimated due: ${peso(total)}`);
    showView('assessments');
}

/* =========================================================
   SETTINGS VIEW
   ========================================================= */
function renderSettings() {
    // Profile fields
    const s = DB.settings;
    const fields = { 'set-name': s.name, 'set-email': s.email, 'set-phone': s.phone };
    Object.entries(fields).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    });

    // Language dropdown
    const langSel = document.querySelector('#settings-form select');
    if (langSel) langSel.value = s.language;

    // Toggles
    renderSettingsToggles();

    // Settings nav
    document.querySelectorAll('.settings-nav-item').forEach((item, i) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.settings-nav-item').forEach(x => x.classList.remove('active'));
            item.classList.add('active');
            // For this demo, only Account Profile shows full content
            // Could be extended to swap content panels
        });
    });

    // Save button
    const saveBtn = document.getElementById('btn-save-settings');
    if (saveBtn) saveBtn.onclick = saveSettings;

    // Cancel button
    const cancelBtn = document.querySelector('.btn-ghost');
    if (cancelBtn) cancelBtn.onclick = () => { renderSettings(); toast('Changes discarded.'); };

    // Danger zone
    const unlinkBtn = document.querySelector('.btn-danger-outline');
    if (unlinkBtn) unlinkBtn.onclick = () => {
        if (confirm('Are you sure you want to unlink your profile? This action is irreversible.')) {
            toast('Profile unlinked. You will be redirected to login.');
        }
    };
}

function renderSettingsToggles() {
    const container = document.getElementById('settings-toggles');
    if (!container) return;

    const items = [
        { key: 'autoReminders', label: 'Automated Payment Reminders', desc: 'Receive automated reminders 30, 14, and 7 days before tax deadlines.' },
        { key: 'emailAlerts',   label: 'Email Notifications',          desc: 'Send assessment and receipt notifications to your registered email.' },
        { key: 'smsAlerts',     label: 'SMS Alerts',                   desc: 'Receive SMS alerts for critical deadlines and payment confirmations.' },
        { key: 'autoFiling',    label: 'Auto-File Assessment Drafts',  desc: 'Automatically draft assessment filings 48 hours before due dates.' },
        { key: 'darkMode',      label: 'Dark Mode Interface',          desc: 'Enable the dark theme for the portal interface.' },
    ];

    container.innerHTML = items.map(item => `
        <div class="settings-list-item">
            <div class="item-text">
                <h4>${item.label}</h4>
                <p>${item.desc}</p>
            </div>
            <div class="toggle-switch ${DB.settings.toggles[item.key] ? 'active' : ''}"
                 data-key="${item.key}" onclick="toggleSetting('${item.key}', this)"></div>
        </div>`).join('');
}

function toggleSetting(key, el) {
    DB.settings.toggles[key] = !DB.settings.toggles[key];
    el.classList.toggle('active', DB.settings.toggles[key]);
    saveStore(DB);
}

function saveSettings() {
    // Validate
    const name  = document.getElementById('set-name')?.value.trim();
    const email = document.getElementById('set-email')?.value.trim();
    const phone = document.getElementById('set-phone')?.value.trim();
    const lang  = document.querySelector('#settings-form select')?.value;

    let valid = true;

    const validateField = (id, errId, condition) => {
        const el = document.getElementById(id);
        const err = document.getElementById(errId);
        if (!condition) { el?.classList.add('input-error'); err?.classList.remove('hidden'); valid = false; }
        else { el?.classList.remove('input-error'); err?.classList.add('hidden'); }
    };

    validateField('set-name',  'err-set-name',  name  && name.length > 2);
    validateField('set-email', 'err-set-email', email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    validateField('set-phone', 'err-set-phone', phone && phone.length >= 7);

    if (!valid) return;

    DB.settings.name     = name;
    DB.settings.email    = email;
    DB.settings.phone    = phone;
    DB.settings.language = lang || 'English';
    saveStore(DB);
    toast('Settings saved successfully.');
}

/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */
function toast(msg) {
    let t = document.getElementById('pb-toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'pb-toast';
        t.style.cssText = `
            position:fixed; bottom:30px; left:50%; transform:translateX(-50%);
            background:#00A86B; color:#fff; padding:12px 24px; border-radius:6px;
            font-size:0.85rem; font-weight:600; z-index:9999; box-shadow:0 4px 20px rgba(0,0,0,0.3);
            transition:opacity 0.3s; white-space:nowrap; max-width:90vw; text-align:center;`;
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._to);
    t._to = setTimeout(() => { t.style.opacity = '0'; }, 3500);
}

/* =========================================================
   EVENT BINDINGS  (runs after DOM ready)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

    // ---- Sidebar navigation ----
    document.getElementById('nav-dashboard')?.addEventListener('click',       (e) => { e.preventDefault(); showView('dashboard'); });
    document.getElementById('nav-portfolio')?.addEventListener('click',       (e) => { e.preventDefault(); showView('portfolio'); });
    document.getElementById('nav-assessments')?.addEventListener('click',     (e) => { e.preventDefault(); showView('assessments'); });
    document.getElementById('nav-history')?.addEventListener('click',         (e) => { e.preventDefault(); showView('history'); });
    document.getElementById('nav-file-assessment')?.addEventListener('click', (e) => { e.preventDefault(); showView('create-application'); });
    document.getElementById('nav-receipt')?.addEventListener('click',         (e) => { e.preventDefault(); showView('receipt'); });
    document.getElementById('nav-general-history')?.addEventListener('click', (e) => { e.preventDefault(); showView('general-history'); });
    document.getElementById('nav-settings')?.addEventListener('click',        (e) => { e.preventDefault(); showView('settings'); });

    // ---- AI panel ----
    document.getElementById('ai-menu-trigger')?.addEventListener('click', (e) => {
        e.preventDefault();
        const panel = document.getElementById('ai-chat-panel');
        if (panel) panel.classList.toggle('hidden');
    });
    document.getElementById('close-ai-btn')?.addEventListener('click', () => {
        document.getElementById('ai-chat-panel')?.classList.add('hidden');
    });
    document.getElementById('ai-send-btn')?.addEventListener('click', handleAIChat);
    document.getElementById('ai-input-field')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleAIChat();
    });

    // ---- Sidebar toggle ----
    document.getElementById('menu-toggle-btn')?.addEventListener('click', () => {
        document.getElementById('sidebar-menu')?.classList.toggle('hidden');
    });

    // ---- Dashboard "View Returns" button ----
    document.querySelector('.portfolio-card .btn-blue')?.addEventListener('click', () => showView('history'));

    // ---- Portfolio "Register New Business" button ----
    document.querySelector('.portfolio-search-bar .btn-green')?.addEventListener('click', registerNewBusiness);

    // ---- Portfolio search ----
    document.querySelector('.portfolio-search-bar .search-input')?.addEventListener('input', (e) => {
        renderPortfolioAssets(e.target.value);
    });

    // ---- Payment history CSV export ----
    document.getElementById('btn-export-csv')?.addEventListener('click', exportCSV);

    // ---- Receipt print / download ----
    document.querySelector('.receipt-alert-bar .btn-secondary:nth-child(1)')?.addEventListener('click', printReceipt);
    document.querySelector('.receipt-alert-bar .btn-secondary:nth-child(2)')?.addEventListener('click', () => downloadReceiptPdf(null));

    // ---- Actions card buttons (dashboard) ----
    document.querySelector('.action-buttons .btn-blue')?.addEventListener('click', registerNewBusiness);

    // ---- Initial render ----
    showView('dashboard');
});

/* =========================================================
   AI CHAT (simple response)
   ========================================================= */
function handleAIChat() {
    const input = document.getElementById('ai-input-field');
    const body  = document.getElementById('chat-stream');
    const status = document.getElementById('ai-status-prompt');
    if (!input || !body) return;

    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';

    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-msg';
    userBubble.textContent = msg;
    body.insertBefore(userBubble, status);

    // Simple rule-based response
    let reply = '';
    const lower = msg.toLowerCase();

    if (lower.includes('tax') && lower.includes('retail')) {
        reply = 'For a retail store in Pasay City, the local business tax rate is 1.50% of annual gross sales for income up to ₱2M, 1.75% for ₱2M–5M, and 2.00% above ₱5M, plus a ₱200 regulatory fee.';
    } else if (lower.includes('deadline') || lower.includes('due')) {
        const next = DB.assessments.filter(a => a.status !== 'Filed').sort((a,b) => new Date(a.deadline)-new Date(b.deadline))[0];
        reply = next ? `Your next deadline is ${fmtDate(next.deadline)} for ${getBiz(next.bizId)?.name} — ${peso(next.amountDue)} due.` : 'You have no upcoming deadlines.';
    } else if (lower.includes('outstanding') || lower.includes('balance')) {
        const total = DB.assessments.filter(a => a.status !== 'Filed').reduce((s,a)=>s+a.amountDue,0);
        reply = `Your total outstanding balance is ${peso(total)} across ${DB.assessments.filter(a=>a.status!=='Filed').length} pending assessments.`;
    } else if (lower.includes('mayor') || lower.includes('permit')) {
        reply = "Mayor's Permit renewals are due every January. You can file via the portal under 'File Assessment' or visit the Pasay City Business Permits and Licensing Office.";
    } else if (lower.includes('business') && lower.includes('register')) {
        reply = "To register a new business, click 'Register New Business Entity' in the Business Portfolio view, fill in your details, and submit to the municipal assessor.";
    } else {
        reply = `I can help with tax calculations, deadlines, assessment status, and filing procedures for Pasay City. Your query: "${msg}" — could you clarify what you need?`;
    }

    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot-msg';
    botBubble.textContent = reply;
    body.insertBefore(botBubble, status);
    body.scrollTop = body.scrollHeight;
}