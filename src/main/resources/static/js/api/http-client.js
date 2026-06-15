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

    if (!response.ok) {
        throw new Error(`Request failed. HTTP ${response.status}`);
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
