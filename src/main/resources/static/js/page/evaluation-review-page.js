import {
    calculateAssessment,
    getEvaluationByRequestId,
    routeToSupervisor
} from "../services/evaluation-service.js";

let state = {
    record: null,
    pageIndex: 0,
    calculatedTotal: null
};

export async function initEvaluationReview() {
    try {
        const requestId = new URLSearchParams(window.location.search).get("requestId");
        const record = await getEvaluationByRequestId(requestId);

        if (!record) {
            showFlash("error", "No evaluation record found.");
            return;
        }

        state.record = record;
        populateForm(record);
        bindActions();
        renderDocumentPage();
        renderAssessment();
    } catch (error) {
        showFlash("error", error.message || "Failed to load evaluation record.");
    }
}

function populateForm(record) {
    renderDetails(record);
    document.getElementById("taxCodeInput").value = record.taxCode;
    document.getElementById("verificationInput").value = record.verificationStatus;
    renderFees(record.fees);
    document.getElementById("docName").textContent = record.document.fileName;
}

function renderDetails(record) {
    const host = document.getElementById("declarationDetails");
    const rows = [
        ["Reference ID", record.requestId],
        ["Business Name", `${record.businessName} (${record.businessTin})`],
        ["Business Type", record.businessType.toUpperCase()],
        ["Ownership Type", record.ownershipType],
        ["Owner Name", record.ownerName],
        ["Declared Gross Receipts [Current Year]", formatCurrency(record.declaredGrossReceipts)]
    ];

    host.innerHTML = rows.map(([label, value]) => `
        <div class="detail-row">
            <dt>${label}</dt>
            <dd>${value}</dd>
        </div>
    `).join("");
}

function renderFees(fees) {
    const host = document.getElementById("feeList");
    host.innerHTML = fees.map(fee => `
        <div class="fee-item">
            <span>${fee.label}</span>
            <input type="number" min="0" step="0.01" data-fee-key="${fee.key}" value="${fee.amount}">
            <span class="fee-note">${fee.note}</span>
        </div>
    `).join("");
}

function bindActions() {
    document.getElementById("calculateBtn").addEventListener("click", onCalculate);
    document.getElementById("routeBtn").addEventListener("click", onRoute);
    document.getElementById("prevPageBtn").addEventListener("click", () => changePage(-1));
    document.getElementById("nextPageBtn").addEventListener("click", () => changePage(1));
}

async function onCalculate() {
    try {
        const payload = buildAssessmentPayload();
        const response = await calculateAssessment(state.record.requestId, payload);
        state.calculatedTotal = response.totalAssessmentDue;
        renderAssessment(response.regulatoryFeesTotal);
        showFlash("success", response.message || "Assessment calculated successfully.");
    } catch (error) {
        showFlash("error", error.message || "Failed to calculate assessment.");
    }
}

async function onRoute() {
    if (state.calculatedTotal == null) {
        showFlash("error", "Action blocked. Run a valid 'CALCULATE ASSESSMENT' configuration first.");
        return;
    }

    try {
        const response = await routeToSupervisor(state.record.requestId, {
            totalAssessmentDue: state.calculatedTotal
        });

        showFlash("success", response.message || "Done! Assessment routed to the Supervisor.");
    } catch (error) {
        showFlash("error", error.message || "Failed to route assessment.");
    }
}

function renderAssessment(explicitFeesTotal) {
    const feesTotal = explicitFeesTotal ?? state.record.fees.reduce((sum, fee) => sum + fee.amount, 0);
    document.getElementById("baseDue").textContent = formatCurrency(state.record.baseBusinessTaxDue);
    document.getElementById("feesTotal").textContent = formatCurrency(feesTotal);

    const totalNode = document.getElementById("assessmentTotal");
    if (state.calculatedTotal == null) {
        totalNode.textContent = "Awaiting Calculation";
        totalNode.className = "awaiting";
        return;
    }

    totalNode.textContent = formatCurrency(state.calculatedTotal);
    totalNode.className = "ready";
}

function renderDocumentPage() {
    const doc = state.record.document;
    const page = doc.pages[state.pageIndex];
    document.getElementById("docTitle").textContent = page.title;
    document.getElementById("docBody").innerHTML = page.blocks.map(block => `<p>${block}</p>`).join("");
    document.getElementById("pageCounter").textContent = `Page ${state.pageIndex + 1} of ${doc.pages.length}`;
    document.getElementById("prevPageBtn").disabled = state.pageIndex === 0;
    document.getElementById("nextPageBtn").disabled = state.pageIndex === doc.pages.length - 1;
}

function changePage(step) {
    const totalPages = state.record.document.pages.length;
    state.pageIndex = Math.min(totalPages - 1, Math.max(0, state.pageIndex + step));
    renderDocumentPage();
}

function showFlash(type, message) {
    const host = document.getElementById("flashHost");
    host.innerHTML = `<div class="flash ${type}">${message}</div>`;
}

function buildAssessmentPayload() {
    const fees = [...document.querySelectorAll("[data-fee-key]")].map(input => ({
        key: input.dataset.feeKey,
        amount: Number(input.value || 0)
    }));

    return {
        taxCode: document.getElementById("taxCodeInput").value,
        verificationStatus: document.getElementById("verificationInput").value,
        fees
    };
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(value);
}
