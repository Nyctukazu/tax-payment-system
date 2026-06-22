import { userAccessMockData } from "../mock/user-access-mock-data.js";
import { fetchJson } from "../api/http-client.js";
import { registerAdminWithBackend } from "./authService.js";

export async function getUserAccessData() {
    const apiUrl = "/api/accounts";

    try {
        const accountsList = await fetchJson(apiUrl);
        console.log(accountsList);
        return accountsList;
    } catch (error) {
        console.error("Critical error mapping stream inside userAccessService:", error);
        throw new Error(error.message || "Failed to synchronize system users matrix channel.");
    }
}


export async function createNewAdminFromUserControl(adminData) {
    const apiUrl = "/api/auth/register";
    
    const registrationPayload = {
        email: adminData.email.trim(),
        password: adminData.password,
        firstName: adminData.firstName.trim(),
        lastName: adminData.lastName.trim(),
        mobileNumber: adminData.mobileNumber.trim(),
        accountType: "ADMIN",
        adminClass: adminData.adminClass 
    };

    try {

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(registrationPayload)
        });

        const result = await response.json();

        if (response.ok) {
            console.log("✅ Admin created successfully via User Control:", result.message);
            return { success: true, message: result.message };
        } else {
            console.error("❌ Registration validation failed:", result.error);
            return { success: false, error: result.error };
        }

    } catch (error) {
        console.error("Critical communications failure during admin creation:", error);
        return { success: false, error: "System could not process creation request at this time." };
    }
}
