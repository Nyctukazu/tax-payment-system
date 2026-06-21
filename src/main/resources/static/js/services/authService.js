import { postJson } from "../api/http-client.js";

export async function loginWithBackend(email, password) {
    const apiUrl = "/api/auth/login";
    const loginPayload = {
        email: email,
        password: password
    };

    try {
        const data = await postJson(apiUrl, loginPayload);
        localStorage.setItem("currentUser", JSON.stringify(data)); 
        return { success: true, user: data };

    } catch (error) {
        console.error("Network error typing to connect to backend:", error);
        return {
            success: false,
            error: error.message || "Unable to reach security authentication server. Please try again later."
        };
    }
}

export async function RegisterUserWithBackend(formData) {
    const apiUrl = "/api/auth/register";
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
        const data = await postJson(apiUrl, registerPayload);
        return { success: true, data: data.message }; 

    } catch (error) {
        console.error("Network error typing to connect to backend:", error);
        return {
            success: false,
            error: error.message || "Unable to reach security authentication server. Please try again later."
        };
    }
}

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
        const data = await postJson(apiUrl, registerPayload);
        return { success: true, data: data.message }; 

    } catch (error) {
        console.error("Network error trying to register admin:", error);
        return {
            success: false,
            error: error.message || "Unable to reach security authentication server. Please try again later."
        };
    }

}

export async function loginWithGoogleBackend(googleTokenId) {
    const apiUrl = "/api/auth/google";
    const googlePayload = {
        token: googleTokenId
    };

    try {
        const data = await postJson(apiUrl, googlePayload);
        return { success: true, user: data };

    } catch (error) {
        console.error("Network error trying to connect to Google auth backend:", error);
        return {
            success: false,
            error: error.message || "Unable to reach Google security authentication server."
        };
    }
}

