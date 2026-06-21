import { getUserAccessData } from "../services/user-access-service.js";

init();

async function init() {
    try {
        const data = await getUserAccessData();
        renderSummary(data.summary);
        renderUsers(data.users);
        bindStaticActions();
    } catch (error) {
        renderFlash(error.message || "Failed to load user access data.");
    }
}

function renderSummary(summary) {
    document.getElementById("totalUsersValue").textContent = summary.totalSystemUsers ?? 0;
    document.getElementById("totalUsersNote").textContent = summary.totalUsersNote ?? "";
    document.getElementById("activeSessionsValue").textContent = summary.activeSessionsToday ?? 0;
    document.getElementById("activeSessionsNote").textContent = summary.activeSessionsNote ?? "";
    document.getElementById("securityAlertsValue").textContent = summary.securityAlerts ?? 0;
    document.getElementById("securityAlertsNote").textContent = summary.securityAlertsNote ?? "";
}

function renderUsers(users) {
    const tbody = document.querySelector("#usersTable tbody");

    if (!users?.length) {
        tbody.innerHTML = `<tr><td colspan="6">No users found.</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td class="employee-id">${user.employeeId}</td>
            <td class="user-full-name">${user.fullName}</td>
            <td>${user.corporateEmail}</td>
            <td>${user.assignedRoles.join(", ")}</td>
            <td>${renderStatus(user.status)}</td>
            <td>${renderActions(user)}</td>
        </tr>
    `).join("");

    tbody.querySelectorAll("[data-action]").forEach(button => {
        button.addEventListener("click", onActionClick);
    });
}

function renderStatus(status) {
    const normalized = String(status).toLowerCase() === "active" ? "active" : "inactive";
    return `<span class="status-badge ${normalized}">${status}</span>`;
}

function renderActions(user) {
    return `
        <div class="action-group">
            ${user.actions.map(action => `
                <button
                    type="button"
                    class="action-btn ${mapActionClass(action)}"
                    data-action="${action}"
                    data-user-name="${user.fullName}">
                    ${action}
                </button>
            `).join("")}
        </div>
    `;
}

function mapActionClass(action) {
    const normalized = action.toLowerCase();

    if (normalized.includes("edit")) {
        return "edit";
    }
    if (normalized.includes("reset")) {
        return "reset";
    }
    if (normalized.includes("activate")) {
        return normalized === "deactivate" ? "deactivate" : "activate";
    }

    return "edit";
}

function onActionClick(event) {
    const action = event.currentTarget.dataset.action;
    const userName = event.currentTarget.dataset.userName;
    renderFlash(`${action} action selected for ${userName}.`);
}

function bindStaticActions() {
    document.getElementById("provisionButton").addEventListener("click", () => {
        renderFlash("Provision New Account action selected.");
    });
}

function renderFlash(message) {
    document.getElementById("flashHost").innerHTML = `<div class="flash">${message}</div>`;
}
