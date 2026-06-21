import { userAccessMockData } from "../mock/user-access-mock-data.js";
import { fetchJson } from "../api/http-client.js";

export async function getUserAccessData(config = window.APP_CONFIG || {}) {
    const apiUrl = config.apiUrl || "/api/users/access";

    if (config.useMockData === true) {
        return getFromMock();
    }

    try {
        return await fetchJson(apiUrl);
    } catch (error) {
        if (config.useMockFallback === false) {
            throw new Error(`Failed to load user access data from backend. ${error.message}`);
        }

        return getFromMock();
    }
}

async function getFromMock() {
    await delay(120);
    return structuredClone(userAccessMockData);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
