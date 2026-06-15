import { postJson } from "../api/http-client.js";

export async function loginWithBackend(email, password) {
    const apiUrl = "/api/auth/login";
    const loginPayload = {
        email: email,
        password: password
    };

    try {
        const response = await postJson(apiUrl, loginPayload);

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

export async function RegisterUserWithBackend(formData) {
    const apiUrl = "http://localhost:8080/api/auth/register";
    const registerPayload = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobileNumber: formData.mobileNumber,
        accountType: "TAXPAYER",
        adminClass: null  
    };

    try {
        const response = await postJson(apiUrl, registerPayload);

        if (response.ok) {
            const successMessage = await response.json();
            return { success: true, data: successMessage };
        } else {
            const errorText = await response.text();
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

export async function registerAdminWithBackend(formData, administrationClassification) {
    const apiUrl = "/api/auth/register";
    
    const registerPayload = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobileNumber: formData.mobileNumber,
        accountType: "ADMIN",
        adminClass: administrationClassification
    };

    try {
        const response = await postJson(apiUrl, registerPayload);

        if (response.ok) {
            const successMessage = await response.json();
            return { success: true, data: successMessage };
        } else {
            const errorText = await response.text();
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.error("Network error trying to register admin:", error);
        return {
            success: false,
            error: "Unable to reach security authentication server. Please try again later."
        };
    }
}