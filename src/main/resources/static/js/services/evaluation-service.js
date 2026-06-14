import { evaluationMockData } from "../evaluation-mock-data.js";
import { fetchJson, postJson } from "../api/http-client.js";

export async function getEvaluationInbox(config = window.APP_CONFIG || {}) {
    if (config.useMockData === true) {
        await DelayNode(120);
        return structuredClone(evaluationMockData.inbox);
    }

    try {
        return await fetchJson(config.apiUrl || "/api/evaluations");

    } catch (error) {
        if (config.useMockFallback === false) {
            throw new Error(`Failed to load evaluations from backend. ${error.message}`);
        }

        await DelayNode(120);
        return structuredClone(evaluationMockData.inbox);
    }
}

export async function getEvaluationByRequestId(requestId, config = window.APP_CONFIG || {}) {
    if (config.useMockData === true) {
        const records = await getEvaluationInbox(config);
        return records.find(item => item.requestedId === requestId) || records[0] || null;
    }

    try {
        return await fetchJson(`${config.apiUrl || "/api/evaluations"}/${encodeURIComponent(requestId)}`);
    } catch (error) {
        if (config.useMockFallback === false) {
            throw new Error(`Failed to load evaluation detail from backend. ${error.message}`);
        }

        const records = await getEvaluationInbox({ ...config, useMockData: true});
        return records.find(item => item.requestId === requestId) || records[0] || null;
    }
}

export async function calculateAssessment(requestId, payload, config = window.APP_CONFIG || {}) {
    if (config.useMockData === true) {
        const record = await getEvaluationByRequestId(requestId, config);
        const feesTotal = payload.fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);

        return {
            baseBusinessTaxDue: record.baseBusinessTaxDue,
            regulatoryFeesTotal: feesTotal,
            totalAssessmentDue: record.baseBusinessTaxDue + feesTotal,
            message: "Assessment calculated successfully."
        };
    }

    try {
        return await postJson(`${config.apiUrl || "/api/evaluations"}/${encodeURIComponent(requestId)}/calculate`, payload);
    } catch (error) {
        if (config.useMockFallback === false) {
            throw new Error(`Failed to calculate assessment from backend. ${error.message}`);
        }


        return calculateAssessment(requestId, payload, { ...config, useMockData: true});
    }
}

export async function routeToSupervisor(requestId, payload, config = window.APP_CONFIG || {}) {
    if (config.useMockData === true) {
        if (payload.totalAssessmentDue == null) {
            throw new Error("Assessment must be calculated before routing.");
        }

        return {
            status: "success",
            message: "Done! Assessment routed to the Supervisor."
        };
    }

    try {
        return await postJson(`${config.apiUrl || "/api/evaluations"}/${encodeURIComponent(requestId)}/route`, payload);
    } catch (error) {
        if (config.useMockFallback === false) {
            throw new Error(`Failed to route assessment from backend. ${error.message}`);
        }

        return routeToSupervisor(requestId, payload, { ...config, useMockData: true });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}