
export async function loginWithBackend(email, password) {
    const loginPayload = {
        email: email,
        password: password
    };

    try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginPayload)
        });

        if (response.ok) {
            const userData = await response.json();
            return { success: true, data: userData };
        } else {
            const errorText = await response.json();
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.error("Network error typing to connect to backend:", error);
        return {
            success: false,
            error: "Unable to reach security authentication server. Please try again later."
        }
    }
};