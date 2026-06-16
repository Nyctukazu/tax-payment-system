export async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    // Handle Error Responses (Like HTTP 400 Bad Request) cleanly
    if (!response.ok) {
        let errorMessage = `Request failed. HTTP ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
                errorMessage = errorData.error; // Extracts "Email is already registered"
            }
        } catch (e) {
            // Fallback if the error response isn't structured JSON
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function postJson(url, body) {
    return fetchJson(url, {
        method: "POST",
        body: JSON.stringify(body)
    });
}
