import { fetchJson } from "../api/http-client.js";

export async function getDashboardData(config = window.APP_CONFIG || {}) {
    const apiUrl = config.apiUrl || "/api/v1/dashboard";
 
    try {
        return await fetchJson(apiUrl);
    } catch (error) {
        await wait(120);
        throw new Error(`Failed to load evaluations from backend. ${error.message}`);
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}