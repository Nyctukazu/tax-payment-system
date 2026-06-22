document.addEventListener("DOMContentLoaded", async () => {

    const cachedUser = localStorage.getItem("currentUser");

    if (!cachedUser) {
        alert("Session expired. Please log in again.");
        window.location.href = "/client-login";
        return;
    }

        const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            console.log("Initiating secure logout sequence...");

            // 1. Wipe browser local security footprints
            localStorage.removeItem("currentUser");
            sessionStorage.clear();

            // 2. Clear the browser authentication cookie
            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";

            // 3. Clear session tracking row from database
            try {
                await fetch("/api/auth/logout", { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });
            } catch (err) {
                console.warn("Backend session cleanup skipped:", err);
            }

            // 4. Force page replacement so the back button is disabled
            window.location.replace('/portal');
        });
    }

    const user = JSON.parse(cachedUser);

    try {
        const response = await fetch("/api/auth/user/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.token}`, 
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("currentUser");
            window.location.href = "/client-login";
            return;
        }

        const secureData = await response.json();
        displayDashboardData(secureData);

    } catch (error) {
        console.error("Failed to fetch protected data:", error);
    }
});

function displayDashboardData(data) {
    document.getElementById("welcome-message").innerText = `Welcome back, ${data.name}!`;
}
