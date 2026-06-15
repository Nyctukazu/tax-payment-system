import { getEvaluationInbox } from "../services/evaluation-service.js";

initEvaluationInbox();

export async function initEvaluationInbox() {
    try {
        const items = await getEvaluationInbox();
        renderTable(items);
    } catch (error) {
        renderError(error.message || "Failed to load applications.");
    }
}

function renderTable(items) {
    const tbody = document.querySelector("#applicationsTable tbody");
    const reviewPageUrl = window.APP_CONFIG?.reviewPageUrl || "/evaluation/review";

    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${item.requestId}</td>
            <td>${item.businessName}</td>
            <td>${item.businessType}</td>
            <td>${item.taxYear}</td>
            <td>${item.submittedAt}</td>
            <td>
                <a class="table-action" href="${reviewPageUrl}?requestId=${encodeURIComponent(item.requestId)}">Evaluate</a>
            </td>
        </tr>
    `).join("");
}

function renderError(message) {
    const tbody = document.querySelector("#applicationsTable tbody");
    tbody.innerHTML = `
        <tr>
            <td colspan="6">${message}</td>
        </tr>
    `;
}
