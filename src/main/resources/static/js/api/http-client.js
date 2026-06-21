export async function fetchJson(url, options = {}) {
    const cachedUser = localStorage.getItem("currentUser");
    let authToken = null;
    
    if (cachedUser) {
        try {
            const user = JSON.parse(cachedUser);
            authToken = user.token;
        } catch (e) {
            console.error("Error parsing user session:", e);
        }
    }

    const response = await fetch(`${url.startsWith('/') ? '' : '/'}${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
            ...(options.headers || {})
        },
        ...options
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("currentUser"); 
        window.location.href = "/client-login";
        throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
        let errorMessage = `Request failed. HTTP ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
                errorMessage = errorData.error; 
            }
        } catch (e) {
            try {
                const textError = await response.text();
                if (textError) errorMessage = textError;
            } catch (textErr) {}
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204 || response.status === 205) {
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
