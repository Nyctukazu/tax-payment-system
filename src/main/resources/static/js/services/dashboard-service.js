import { dashboardMockData } from "../dashboard-mock-data.js";

export async function getDashboardData(config = window.APP_CONFIG || {}) {
    const useMockData = config.userMockData !== false;
    const apiUrl = config.apiUrl || "/api/dashboard";

    if (useMockData) {
        await wait(120);
        return structuredClone(dashboardMockData);
    }

    const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        throw new Error(`Failed to load dashboard data. HTTP ${response.status}`);
    }

    return response.json();
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}