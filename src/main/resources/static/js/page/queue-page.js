import { getQueueData } from "../services/queue-service.js";

init();

async function init() {
    try {
        const data = await getQueueData();
        renderSummary(data.summary);
        renderPendingTable(data.pendingEvaluations);
        renderHistoryTable("#approvedHistoryTable", data.history.recentlyApproved);
        renderHistoryTable("#rejectedHistoryTable", data.history.recentlyRejected);
    } catch (error) {
        renderError(error.message || "Failed to load queue data.");
    }
}

function renderSummary(summary) {
    document.getElementById("totalPendingValue").textContent = summary.totalPending ?? 0;
    document.getElementById("approvedTodayValue").textContent = summary.approvedToday ?? 0;
    document.getElementById("rejectedTodayValue").textContent = summary.rejectedToday ?? 0;
}

function renderPendingTable(rows) {
    const tbody = document.querySelector("#pendingQueueTable tbody");

    if (!rows?.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No pending evaluations found.</td></tr>`;
        return;
    }

    tbody.innerHTML = rows.map(row => `
        <tr>
            <td>${row.requestId}</td>
            <td>${row.businessName}</td>
            <td>${row.businessType}</td>
            <td>${row.taxYear}</td>
            <td>${renderStatus(row.status)}</td>
            <td>${renderAction(row)}</td>
        </tr>
    `).join("");
}

function renderHistoryTable(selector, rows) {
    const tbody = document.querySelector(`${selector} tbody`);

    if (!rows?.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No history records found.</td></tr>`;
        return;
    }

    tbody.innerHTML = rows.map(row => `
        <tr>
            <td>${row.requestId}</td>
            <td>${row.businessName}</td>
            <td>${row.businessType}</td>
            <td>${row.dateProcessed}</td>
            <td>${renderStatus(row.status)}</td>
            <td>${renderAction(row)}</td>
        </tr>
    `).join("");
}

function renderStatus(status) {
    const normalized = String(status).toLowerCase().includes("approved")
        ? "approved"
        : String(status).toLowerCase().includes("rejected")
            ? "rejected"
            : "pending";

    return `<span class="status-badge ${normalized}">${status}</span>`;
}

function renderAction(row) {
    const baseUrl = window.APP_CONFIG?.viewUrl || "/evaluation/review";
    const requestId = row.viewRequestId || row.requestId;
    return `<a class="view-button" href="${baseUrl}?requestId=${encodeURIComponent(requestId)}">${row.actionLabel || "View"}</a>`;
}

function renderError(message) {
    const pendingBody = document.querySelector("#pendingQueueTable tbody");
    const approvedBody = document.querySelector("#approvedHistoryTable tbody");
    const rejectedBody = document.querySelector("#rejectedHistoryTable tbody");
    const html = `<tr><td colspan="6" class="empty-state">${message}</td></tr>`;

    pendingBody.innerHTML = html;
    approvedBody.innerHTML = html;
    rejectedBody.innerHTML = html;
}