export async function fetchWithAuth(url, options = {}) {
    const cachedUser = localStorage.getItem("currentUser");
    if (!cachedUser) {
        window.location.href = "/client-login";
        throw new Error("No authenticated user session found.");
    }

    const user = JSON.parse(cachedUser);
    const authHeaders = {
        "Authorization": `Bearer ${user.token}`,
        "Content-Type": "application/json",
        ...options.headers
    };

    const response = await fetch(url, { ...options, headers: authHeaders });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("currentUser");
        window.location.href = "/client-login";
    }

    return response.json();
}
