import { initClientHeader } from "../components/AppHeader.js";
import { initClientSidebar } from "../components/AppSidebar.js";
import { initAIPanel } from "../components/AIPanel.js";

window.addEventListener("DOMContentLoaded", () => {
    initClientHeader();
    initClientSidebar();
    initAIPanel();
    init();
});

async function init() {
    const pageId = document.body.id;
    console.log("Current pageId detected:", pageId);

    switch (pageId) {
        case 'pageClientDashboard':
            await initDashboard();
            break;
        case 'pageBusinessPortfolio':
            await initEvaluationInbox();
            break;
        case 'pageTaxAssessments':
            await initEvaluationReview();
            break;
        case 'pagePaymentHistory':
            await initEvaluationReview();
            break;
        case 'pageFileAssessment':
            await initEvaluationReview();
            break;
        case 'pageReceipts':
            await initEvaluationReview();
            break;
        case 'pageHistory':
            await initEvaluationReview();
            break;
        case 'pageSystemSettings':
            await initEvaluationReview();
            break;
        default:
            console.warn('Unknown page layout', pageId);
    }
}

const ENDPOINTS = {
  businesses: '/api/dashboard/businesses',
  activeAssessment: '/api/client/dashboard/active-assessment',
  ledger: '/api/dashboard/ledger',
  submitApplication: '/api/applications'
};

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value ?? '';
  return div.innerHTML;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount ?? 0);
}

function formatDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const businessId = "12345";

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Request to ${url} failed: ${res.status} ${res.statusText}`);
  }
  if (res.status === 204) return null; // no active assessment, etc.
  return res.json();
}

function renderPortfolioCards(businesses) {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  if (!businesses || businesses.length === 0) {
    grid.innerHTML = `<p class="empty-state">No registered businesses yet.</p>`;
    return;
  }

  grid.innerHTML = businesses.map(biz => `
    <div class="biz-card" data-business-id="${escapeHtml(biz.id)}">
      <div class="biz-icon"><i class="fa-solid ${escapeHtml(biz.icon || 'fa-building')}"></i></div>
      <h4>${escapeHtml(biz.name)}</h4>
      <div class="biz-details">
        <p><span>Tax ID:</span> <span>${escapeHtml(biz.id)}</span></p>
        <p><span>Type:</span> <span>${escapeHtml(biz.type)}</span></p>
        <p><span>Last Filed:</span> <span>${formatDate(biz.lastFiled)}</span></p>
      </div>
      <div class="biz-actions">
        <button class="btn btn-secondary" data-action="manage" data-business-id="${escapeHtml(biz.id)}">Manage</button>
        <button class="btn btn-primary" data-action="file-returns" data-business-id="${escapeHtml(biz.id)}">File Returns</button>
      </div>
    </div>
  `).join('');
}

// ---------- render: active assessment ----------

function renderAssessment(assessment) {
  const box = document.getElementById('assessment-box');
  if (!box) return;

  if (!assessment) {
    box.innerHTML = `<p class="empty-state">No active assessment right now.</p>`;
    return;
  }

  box.innerHTML = `
    <div class="assessment-title">
      <div class="biz-icon"><i class="fa-solid ${escapeHtml(assessment.icon || 'fa-building')}"></i></div>
      <span>${escapeHtml(assessment.businessName)}</span>
    </div>
    <div class="assessment-body">
      <p><span>Status:</span> <strong>${escapeHtml(assessment.status)}</strong></p>
      <p><span>Deadline:</span> <span>${formatDate(assessment.deadlineDate)}</span></p>
      <p><span>Amount Due:</span> <span class="amount">${formatCurrency(assessment.amountDue)}</span></p>
    </div>
    <button class="btn btn-primary btn-block" data-action="pay-now" data-business-id="${escapeHtml(assessment.businessId)}">Pay Now</button>
    <button class="btn btn-secondary btn-block" data-action="file-protest" data-business-id="${escapeHtml(assessment.businessId)}">File Protest</button>
  `;
}

// ---------- render: ledger table ----------

function renderLedger(entries) {
  const tbody = document.getElementById('ledger-body');
  if (!tbody) return;

  if (!entries || entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-state">No ledger history yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = entries.map(entry => `
    <tr>
      <td>${formatDate(entry.date)}</td>
      <td>${escapeHtml(entry.type)}</td>
      <td>${formatCurrency(entry.amount)}</td>
      <td>
        <span class="badge ${entry.status === 'Paid' ? 'badge-success' : 'badge-pending'}">${escapeHtml(entry.status)}</span>
        ${entry.receiptNo ? `<a href="${escapeHtml(entry.receiptUrl || '#')}" class="rcpt-link">${escapeHtml(entry.receiptNo)}</a>` : ''}
      </td>
    </tr>
  `).join('');
}

// ---------- render: business dropdown + calc summary (New Application view) ----------

let businessCache = [];

function populateBusinessDropdown(businesses) {
  const select = document.getElementById('app-business-select');
  if (!select) return;

  if (!businesses || businesses.length === 0) {
    select.innerHTML = `<option value="">No registered businesses</option>`;
    return;
  }

  select.innerHTML = businesses.map(biz =>
    `<option value="${escapeHtml(biz.id)}">${escapeHtml(biz.name)} (${escapeHtml(biz.id)})</option>`
  ).join('');

  select.addEventListener('change', () => updateCalcSummary(select.value));
  updateCalcSummary(businesses[0].id);
}

function updateCalcSummary(businessId) {
  const biz = businessCache.find(b => b.id === businessId);
  const rateEl = document.getElementById('calc-tax-rate');
  if (rateEl && biz) {
    rateEl.textContent = `${Number(biz.taxRatePercent).toFixed(2)}%`;
  }
}

// ---------- card / button actions ----------
// Wire these to your real routes/SPA navigation as needed.

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;
  const businessId = target.dataset.businessId;

  switch (action) {
    case 'manage':
      window.location.href = `/businesses/${businessId}`;
      break;
    case 'file-returns':
      window.location.href = `/businesses/${businessId}/file-returns`;
      break;
    case 'pay-now':
      window.location.href = `/businesses/${businessId}/pay`;
      break;
    case 'file-protest':
      window.location.href = `/businesses/${businessId}/protest`;
      break;
  }
});

// ---------- application submit ----------

const submitBtn = document.getElementById('btn-submit-app');
if (submitBtn) {
  submitBtn.addEventListener('click', async () => {
    const businessId = document.getElementById('app-business-select')?.value;
    const dropzone = document.getElementById('app-dropzone');
    const errEl = document.getElementById('err-app-dropzone');
    const hasFile = dropzone?.dataset.hasFile === 'true'; // set this to 'true' in your upload handler

    if (!hasFile) {
      errEl?.classList.remove('hidden');
      return;
    }
    errEl?.classList.add('hidden');

    try {
      await fetchJSON(ENDPOINTS.submitApplication, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId })
        // switch to FormData if you're sending the actual uploaded file in this request
      });
      window.location.href = '/applications/confirmation';
    } catch (err) {
      console.error('Application submit failed', err);
      alert('Something went wrong submitting your application. Please try again.');
    }
  });
}

async function initDashboard() {
  try {
    const [businesses, assessment, ledger] = await Promise.all([
      fetchJSON(ENDPOINTS.businesses),
      fetchJSON(ENDPOINTS.activeAssessment).catch(() => null),
      fetchJSON(ENDPOINTS.ledger)
    ]);

    businessCache = businesses;

    renderPortfolioCards(businesses);
    renderAssessment(assessment);
    renderLedger(ledger);
    populateBusinessDropdown(businesses);
  } catch (err) {
    console.error('Failed to load dashboard data', err);
    const grid = document.getElementById('portfolio-grid');
    if (grid) grid.innerHTML = `<p class="error-state">Could not load your dashboard. Please refresh or try again later.</p>`;
  }
}