document.addEventListener("DOMContentLoaded", async () => {

    const cachedUser = localStorage.getItem("currentUser");

    if (!cachedUser) {
        alert("Session expired. Please log in again.");
        window.location.href = "/client-login";
        return;
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
