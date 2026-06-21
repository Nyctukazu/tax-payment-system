import { queueMockData } from "../queue/queue-mock-data.js";
import { fetchJson } from "../api/http-client.js";

export async function getQueueData(config = window.APP_CONFIG || {}) {
    const apiUrl = config.apiUrl || "/api/queue";

    if (config.useMockData === true) {
        return getQueueFromMock();
    }

    try {
        return await fetchJson(apiUrl);
    } catch (error) {
        if (config.useMockFallback === false) {
            throw new Error(`Failed to load queue data from backend. ${error.message}`);
        }

        return getQueueFromMock();
    }
}

async function getQueueFromMock() {
    await delay(120);
    return structuredClone(queueMockData);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}