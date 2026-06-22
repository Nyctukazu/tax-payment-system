import { getUserAccessData } from "../services/user-access-service.js";
import { generateCompliantPassword } from "../services/auto-password.js";
import { registerAdminWithBackend } from "../services/authService.js";

let cachedAccountsList = [];

export async function initUserControl() {
    try {
        // 1. Fetch data from backend once on startup
        cachedAccountsList = await getUserAccessData();
        
        // 2. Render initial dashboard summary cards
        calculateAndRenderSummary(cachedAccountsList);
        
        // 3. Populate table layout view with full user matrix
        renderUsers(cachedAccountsList);
        
        // 4. Bind listeners (including our brand new filters)
        bindStaticActions();
        bindFilterActions(); 
    } catch (error) {
        console.error("Initialization pipeline runtime failure:", error);
        renderFlash(error.message || "Failed to load user access data.");
    }
}

// 🔍 Active Filtering Algorithm
function handleTableFiltering() {
    const searchQuery = document.getElementById("tableSearch").value.trim().toLowerCase();
    const typeFilterValue = document.getElementById("typeFilter").value;
    const adminFilterValue = document.getElementById("adminFilter").value;
    const statusFilterValue = document.getElementById("statusFilter").value;
    console.log({ typeFilterValue, adminFilterValue, statusFilterValue, sampleRecord: cachedAccountsList[0] });


    // Filter array concurrently based on both targets
    const filteredResults = cachedAccountsList.filter(user => {
        // Target 1: Search string check (Matches name or email fields)
        const matchesSearch = 
            user.fullName.toLowerCase().includes(searchQuery) || 
            user.email.toLowerCase().includes(searchQuery);

        // Target 2: Dropdown criteria check
        const matchesType = 
            typeFilterValue === "ALL" || 
            user.accountType === typeFilterValue;

        const matchesAdmin = 
            adminFilterValue === "ALL" || 
            (user.adminClass && user.adminClass === adminFilterValue);
        
        const matchesStatus = 
            statusFilterValue === "ALL" || 
            user.status === statusFilterValue;

        return matchesSearch && matchesType && matchesAdmin && matchesStatus;
    });

    // Send filtered subsets back into your existing rendering pipeline
    renderUsers(filteredResults);
}

function bindFilterActions() {
    const searchInput = document.getElementById("tableSearch");
    const typeDropdown = document.getElementById("typeFilter");
    const classDropdown = document.getElementById("adminFilter");
    const statusDropdown = document.getElementById("statusFilter");

    if (searchInput && typeDropdown && classDropdown && statusDropdown) {
        searchInput.addEventListener("input", handleTableFiltering);
        typeDropdown.addEventListener("change", handleTableFiltering);
        classDropdown.addEventListener("change", handleTableFiltering);
        statusDropdown.addEventListener("change", handleTableFiltering);
    } else {
        console.warn("One or more filter dropdown elements are missing from your HTML structure.");
    }

}


function calculateAndRenderSummary(accountsList) {
    const totalUsers = accountsList.length;
    
    // Filter active admins vs regular accounts
    const activeAdmins = accountsList.filter(u => u.accountType === "ADMIN" && u.status === "ACTIVE").length;
    const activeTaxpayers = accountsList.filter(u => u.accountType === "TAXPAYER" && u.status === "ACTIVE").length;

    // Inject values dynamically into your existing dashboard DOM nodes
    document.getElementById("totalUsersValue").textContent = totalUsers;
    document.getElementById("totalUsersNote").textContent = "Total accounts in system database";
    
    document.getElementById("activeSessionsValue").textContent = activeAdmins;
    document.getElementById("activeSessionsNote").textContent = "Active system administrators";
    
    document.getElementById("securityAlertsValue").textContent = activeTaxpayers;
    document.getElementById("securityAlertsNote").textContent = "Active registered taxpayers";
}

function renderUsers(users) {
    const tbody = document.querySelector("#usersTable tbody");

    if (!users?.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">No user accounts found.</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(user => {
        // 🌟 CHECK: If the status is not ACTIVE, inject the CSS class to dim the row
        const isDeactivated = user.status !== "ACTIVE";
        const rowClass = isDeactivated ? 'class="deactivated-row"' : '';

        // Dynamically rename the action button text on the fly
        const toggleActionText = isDeactivated ? "Activate" : "Deactivate";

        return `
            <tr ${rowClass}>
                <td class="user-full-name">${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.mobileNumber || "N/A"}</td>
                <td>
                    <span class="type-badge ${user.accountType ? user.accountType.toLowerCase() : 'unknown'}">
                        ${user.accountType || 'UNKNOWN'}${user.adminClass ? ` (${user.adminClass})` : ''}
                    </span>
                </td>
                <td>${renderStatus(user.status)}</td>
                <td>
                    <div class="action-group" style="display: flex; gap: 8px;">
                        <button type="button" class="action-btn edit" data-action="edit" data-user-email="${user.email}">Edit</button>
                        <button type="button" class="action-btn resetPassword" data-action="reset" data-user-email="${user.email}">Reset Pass</button>
                        
                        <!-- 🌟 Toggles between red Deactivate and green/blue Activate label -->
                        <button type="button" class="action-btn ${isDeactivated ? 'activate-btn' : 'deactivate'}" data-action="toggle-status" data-user-email="${user.email}">
                            ${toggleActionText}
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    tbody.querySelectorAll("[data-action]").forEach(button => {
        button.addEventListener("click", onActionClick);
    });
}



function renderStatus(status) {
    const normalized = String(status).toLowerCase() === "active" ? "active" : "inactive";
    return `<span class="status-badge ${normalized}">${status}</span>`;
}

function renderActions(user) {
    return `
        <div class="action-group" style="display: flex; gap: 8px;">
            <button
                type="button"
                class="action-btn edit"
                data-action="edit"
                data-user-email="${user.email}"
                data-user-name="${user.fullName}">
                Edit
            </button>
            <button
                type="button"
                class="action-btn resetPassword"
                data-action="reset"
                data-user-email="${user.email}"
                data-user-name="${user.fullName}">
                Reset Pass
            </button>

            <button
                type="button"
                class="action-btn deactivate"
                data-action="delete"
                data-user-email="${user.email}"
                data-user-name="${user.fullName}">
                Deactivate
            </button>
            
        </div>
    `;
}

function mapActionClass(action) {
    const normalized = action.toLowerCase();

    if (normalized.includes("edit")) {
        return "edit";
    }
    if (normalized.includes("reset")) {
        return "reset";
    }
    if (normalized.includes("activate")) {
        return normalized === "deactivate" ? "deactivate" : "activate";
    }

    return "edit";
}

function onActionClick(event) {
    const action = event.currentTarget.dataset.action;
    const userName = event.currentTarget.dataset.userName;
    const userEmail = event.currentTarget.dataset.userEmail;

    renderFlash(`${action} action selected for ${userName}.`);

    // 1. Instantly locate the target record coordinates out of your memory cache array
    const selectedUser = cachedAccountsList.find(u => u.email === userEmail);
    
    if (!selectedUser) {
        renderFlash("Error: Could not retrieve local cache coordinates for selected profile.");
        return;
    }

    // 2. Clear, un-nested evaluation checks running sequentially
    if (action === "edit") {
        renderEditAccountForm(selectedUser);
    } 
    else if (action === "reset") {
        // ✅ FIXED: Now cleanly accessible when clicking the Reset button
        renderCredentialResetForm(selectedUser);
    } 
    else if (action === "toggle-status") {
        // 🌟 ROUTE DIRECTLY TO DYNAMIC STATUS ACTION COMPONENT 
        renderStatusToggleModal(selectedUser);
    }
}


function bindStaticActions() {
    document.getElementById("provisionButton").addEventListener("click", () => {
        renderFlash("Provision New Account action selected.");
        renderNewAccountForm();
    });
}

function renderFlash(message) {
    document.getElementById("flashHost").innerHTML = `<div class="flash">${message}</div>`;

}

function renderNewAccountForm() {
    const modalHTML = `
        <div class="modal-overlay" id="provisionModal">
        <div class="modal-card">
            <h2 class="modal-title">PROVISION NEW STAFF ACCOUNT</h2>

            <div id="modalAlerts" class="modal-alert-host"></div>
        
            <form id="provisionForm">

                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" id="firstName" placeholder="e.g. Nikutu" />
                </div>

                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" id="lastName" placeholder="e.g. Nyan" />
                </div>

                <div class="form-group">
                    <label>Corporate Email</label>
                    <input type="email" id="corporateEmail" placeholder="e.g. name@pasay.gov.ph" />
                </div>

                <div class="form-group">
                    <label>Mobile Number</label>
                    <input type="text" id="mobileNumber" placeholder="your mobile number" />
                </div>

                <div class="form-group">
                    <label>Assigned Roles</label>
                    <div class="select-wrapper">
                    <select id="assignedRole">
                        <option value="CLERK">CLERK</option>
                        <option value="SUPERVISOR">SUPERVISOR</option>
                        <option value="SUPERADMIN">SUPERADMIN</option>
                    </select>
                    </div>
                </div>

                <div class="form-group">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <label style="margin-bottom: 0;">Account Password</label>
                        <button type="button" id="genPasswordBtn" style="background: none; border: none; color: #ea580c; font-weight: 700; font-size: 0.8rem; cursor: pointer; padding: 0;">
                            ✨ Generate Secure Password
                        </button>
                    </div>
                    <div class="password-wrapper">
                        <input type="password" id="accountPassword" placeholder="Create account password..." />
                        <button type="button" class="password-toggle-btn" data-toggle="accountPassword">
                            <!-- Normal Eye SVG -->
                            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="form-group">
                    <label>Confirm Account Password</label>
                    <div class="password-wrapper">
                        <input type="password" id="confirmPassword" placeholder="Re-type account password..." />
                        <button type="button" class="password-toggle-btn" data-toggle="confirmPassword">
                            <!-- Normal Eye SVG -->
                            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>


                <div class="auth-section">
                    <label>Authorization Required</label>
                    <input type="password" id="superadminPass" placeholder="Enter Superadmin Password..." />
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn-cancel" id="closeModalBtn">Cancel</button>
                    <button type="submit" class="btn-confirm">Confirm & Save</button>
                </div>
            </form>
        </div>
        </div>
        `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalElement = document.getElementById("provisionModal");
    const closeBtn = document.getElementById("closeModalBtn");
    const formElement = document.getElementById("provisionForm");
    const alertsHost = document.getElementById("modalAlerts");

    const showAlert = (type, message) => {
        alertsHost.innerHTML = "";
        
        const icon = type === "success" ? "✅" : "⚠️";
        const alertHTML = `
            <div class="alert-banner ${type}">
                <span>${icon}</span>
                <span>${message}</span>
            </div>
        `;
        alertsHost.insertAdjacentHTML("beforeend", alertHTML);
    };

    formElement.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("corporateEmail").value.trim();
        const mobileNumber = document.getElementById("mobileNumber").value.trim();
        const accountPassword = document.getElementById("accountPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const superadminPassword = document.getElementById("superadminPass").value;
        const adminClass = document.getElementById("assignedRole").value;

        if (!firstName || !lastName || !email || !mobileNumber) {
            showAlert("error", "All credentials (First Name, LastName, Email, Mobile Number) are required.");
            return;
        }

        if (!accountPassword || !confirmPassword) {
            showAlert("error", "Please fill out both password validation targets.");
            return;
        }

        if (accountPassword !== confirmPassword) {
            showAlert("error", "Account passwords do not match.");
            return;
        }

        if (accountPassword.length < 12) {
            showAlert("error", "Password must be at least 12 characters long.");
            return;
        }

        if (!/[A-Z]/.test(accountPassword)) {
            showAlert("error", "Password must contain at least 1 capital letter.");
            return;
        }

        const numbersMatched = accountPassword.match(/\d/g);
        if (!numbersMatched || numbersMatched.length < 2) {
            showAlert("error", "Password must contain at least 2 numbers.");
            return;
        }

        const specialMatched = accountPassword.match(/[^A-Za-z0-9\s]/g);
        if (!specialMatched || specialMatched.length < 3) {
            showAlert("error", "Password must contain at least 3 special symbols.");
            return;
        }

        if (!superadminPassword) {
            showAlert("error", "Superadmin Password is required to save.");
            return;
        }

        const submitBtn = formElement.querySelector(".btn-confirm");

        try {

            submitBtn.disabled = true;
            submitBtn.textContent = "Processing...";
            alertsHost.innerHTML = ""; 

            const submissionPackage = {
                firstName,
                lastName,
                email,
                mobileNumber,
                password: accountPassword
            };
            const result = await registerAdminWithBackend(submissionPackage, adminClass);

            if (!result.success) {
                showAlert("error", result.error);
                submitBtn.disabled = false;
                submitBtn.textContent = "Confirm & Save";
                return;
            }

            showAlert("success", result.data || `Admin account successfully created for ${firstName}!`);
            
            setTimeout(() => {
                destroyModal();

                if (typeof initUserControl === "function") {
                    initUserControl(); 
                }
            }, 2000);

        } catch (err) {
            showAlert("error", err.message || "An unexpected rendering runtime exception occurred.");
            submitBtn.disabled = false;
            submitBtn.textContent = "Confirm & Save";
        }
    });

    requestAnimationFrame(() => {
        modalElement.classList.add("active");
    });

    const destroyModal = () => {
        modalElement.classList.remove("active");
        setTimeout(() => {
            modalElement.remove();
        }, 200);
    };

    closeBtn.addEventListener("click", destroyModal);
    
    modalElement.addEventListener("click", (e) => {
        if (e.target === modalElement) destroyModal();
    });

    const genPasswordBtn = document.getElementById("genPasswordBtn");
    const passwordInput = document.getElementById("accountPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    genPasswordBtn.addEventListener("click", () => {
        const securePass = generateCompliantPassword();
        
        passwordInput.value = securePass;
        confirmPasswordInput.value = securePass;
        

        passwordInput.type = "text";
        confirmPasswordInput.type = "text";
        
        showAlert("success", `Generated: ${securePass} (Copied to fields below)`);
        

        setTimeout(() => {
            passwordInput.type = "password";
            confirmPasswordInput.type = "password";
        }, 5000);
    });
    // Add this inside renderNewAccountForm() below document.body insertion:

    // Reusable SVG string variables for clean conditional swapping
    const eyeOpenSVG = `
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    `;

    const eyeClosedSVG = `
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c.766 2.897 3.334 5.23 6.347 6.136m5.722-.121a9.97 9.97 0 0 0 5.838-2.152M19 19l-2-2m-2-2l-4-4m-4-4L5 5m3 3a3 3 0 1 0 4.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.59-3.59m0 0A10.454 10.454 0 0 1 12 4.5c4.778 0 8.823 3.33 9.963 8a10.473 10.473 0 0 1-2.083 3.765m-2.717-2.717l-3.586-3.586" />
        </svg>
    `;

    modalElement.querySelectorAll(".password-toggle-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetInputId = btn.dataset.toggle;
            const inputField = document.getElementById(targetInputId);
            
            if (inputField.type === "password") {
                inputField.type = "text";
                btn.innerHTML = eyeClosedSVG; // Render the eye-slash vector
            } else {
                inputField.type = "password";
                btn.innerHTML = eyeOpenSVG;  // Revert back to the normal eye vector
            }
        });
    });


}

function renderEditAccountForm(user) {
    const isAdmin = user.accountType === "ADMIN";
    
    // Split full name back down into first/last targets to prepopulate input boxes cleanly
    const nameParts = user.fullName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const modalHTML = `
        <div class="modal-overlay" id="editAccountModal">
        <div class="modal-card">
            <h2 class="modal-title">EDIT ${user.accountType} ACCOUNT</h2>
            <div id="editModalAlerts" class="modal-alert-host"></div>
        
            <form id="editAccountForm">
                <div class="form-group">
                    <label>Corporate Email</label>
                    <input type="email" value="${user.email}" readonly style="background-color: #f3f4f6; color: #6b7280; cursor: not-allowed;" />
                </div>

                <div class="form-group active-field">
                    <label>First Name</label>
                    <input type="text" id="editFirstName" value="${firstName}" required />
                </div>

                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" id="editLastName" value="${lastName}" required />
                </div>

                <div class="form-group">
                    <label>Mobile Number</label>
                    <input type="text" id="editMobileNumber" value="${user.mobileNumber || ''}" required />
                </div>

                <div class="form-group" style="display: ${isAdmin ? 'flex' : 'none'};">
                    <label>Assigned Administrative Class</label>
                    <div class="select-wrapper">
                    <select id="editAdminClass" ${isAdmin ? '' : 'disabled'}>
                        <option value="CLERK" ${user.adminClass === 'CLERK' ? 'selected' : ''}>CLERK</option>
                        <option value="SUPERVISOR" ${user.adminClass === 'SUPERVISOR' ? 'selected' : ''}>SUPERVISOR</option>
                        <option value="SUPERADMIN" ${user.adminClass === 'SUPERADMIN' ? 'selected' : ''}>SUPERADMIN</option>
                    </select>
                    </div>
                </div>

                <div class="auth-section">
                    <label>Authorization Required</label>
                    <input type="password" id="editSuperadminPass" placeholder="Enter Superadmin Password..." required />
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn-cancel" id="closeEditModalBtn">Cancel</button>
                    <button type="submit" class="btn-confirm">Confirm & Save</button>
                </div>
            </form>
        </div>
        </div>
        `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalElement = document.getElementById("editAccountModal");
    const formElement = document.getElementById("editAccountForm");
    const closeBtn = document.getElementById("closeEditModalBtn");
    const alertsHost = document.getElementById("editModalAlerts");

    formElement.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedPayload = {
            firstName: document.getElementById("editFirstName").value.trim(),
            lastName: document.getElementById("editLastName").value.trim(),
            mobileNumber: document.getElementById("editMobileNumber").value.trim(),
            adminClass: isAdmin ? document.getElementById("editAdminClass").value : null
        };

        console.log("JSON Sent to backend:", updatedPayload); 
        const submitBtn = formElement.querySelector(".btn-confirm");

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Updating...";

            const storedToken = localStorage.getItem("authToken");

            const response = await fetch(`/api/accounts/${user.id}`, { 
                method: "PUT",
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${storedToken}`
                 },
                body: JSON.stringify(updatedPayload)
            });

            if (!response.ok) throw new Error("Could not update target profile.");

            alertsHost.innerHTML = `<div class="alert-banner success"><span>✅</span><span>Profile changes updated securely.</span></div>`;
            
            setTimeout(() => {
                destroyEditModal();
                initUserControl(); // Refetches all accounts to refresh grid layout values automatically!
            }, 1500);

        } catch (err) {
            alertsHost.innerHTML = `<div class="alert-banner error"><span>⚠️</span><span>${err.message}</span></div>`;
            submitBtn.disabled = false;
            submitBtn.textContent = "Confirm & Save";
        }
    });

    requestAnimationFrame(() => modalElement.classList.add("active"));
    const destroyEditModal = () => {
        modalElement.classList.remove("active");
        setTimeout(() => modalElement.remove(), 200);
    };
    closeBtn.addEventListener("click", destroyEditModal);
}

function renderCredentialResetForm(user) {
    const modalHTML = `
        <div class="modal-overlay" id="resetCredentialsModal">
        <div class="modal-card" style="max-width: 440px; padding: 28px;">
            <h2 class="modal-title" style="border-bottom: none; margin-bottom: 8px;">Reset User Credentials</h2>
            <p style="font-family: sans-serif; font-size: 0.9rem; color: #4b5563; margin: 0 0 20px 0; line-height: 1.4;">
                Directly overwrite security credentials for user <strong style="color: #111827;">${user.fullName}</strong> (${user.email}).
            </p>

            <div id="resetModalAlerts" class="modal-alert-host"></div>
        
            <form id="resetCredentialsForm">
                <!-- New Password Row with Generator Integration -->
                <div class="form-group">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <label style="margin-bottom: 0;">New Password</label>
                        <button type="button" id="resetGenBtn" style="background: none; border: none; color: #ea580c; font-weight: 700; font-size: 0.8rem; cursor: pointer; padding: 0;">
                            ✨ Generate Secure Password
                        </button>
                    </div>
                    <div class="password-wrapper">
                        <input type="password" id="resetNewPassword" placeholder="Create new security key..." />
                        <button type="button" class="password-toggle-btn" data-toggle="resetNewPassword">
                            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        </button>
                    </div>
                </div>

                <!-- Confirm Password Row -->
                <div class="form-group">
                    <label>Confirm Password</label>
                    <div class="password-wrapper">
                        <input type="password" id="resetConfirmPassword" placeholder="Re-type security key..." />
                        <button type="button" class="password-toggle-btn" data-toggle="resetConfirmPassword">
                            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        </button>
                    </div>
                </div>

                <!-- Authorization Guard Box matching image padding/purple accents -->
                <div class="auth-section" style="margin-top: 20px; margin-bottom: 24px;">
                    <label>Authorization Required</label>
                    <input type="password" id="resetAuthPass" placeholder="Enter Superadmin Password..." required />
                </div>

                <!-- Control actions alignment -->
                <div class="modal-actions" style="gap: 12px;">
                    <button type="button" class="btn-cancel" id="closeResetModalBtn" style="border-radius: 6px; padding: 12px;">Cancel</button>
                    <button type="submit" class="btn-confirm" style="border-radius: 6px; padding: 12px;">Verify & Execute</button>
                </div>
            </form>
        </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalElement = document.getElementById("resetCredentialsModal");
    const formElement = document.getElementById("resetCredentialsForm");
    const closeBtn = document.getElementById("closeResetModalBtn");
    const genBtn = document.getElementById("resetGenBtn");
    const newPassInput = document.getElementById("resetNewPassword");
    const confirmPassInput = document.getElementById("resetConfirmPassword");
    const alertsHost = document.getElementById("resetModalAlerts");

    // Reusable SVG strings for password visibility masking toggles
    const eyeOpen = `<svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`;
    const eyeClosed = `<svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c.766 2.897 3.334 5.23 6.347 6.136m5.722-.121a9.97 9.97 0 0 0 5.838-2.152M19 19l-2-2m-2-2l-4-4m-4-4L5 5m3 3a3 3 0 1 0 4.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.59-3.59m0 0A10.454 10.454 0 0 1 12 4.5c4.778 0 8.823 3.33 9.963 8a10.473 10.473 0 0 1-2.083 3.765m-2.717-2.717l-3.586-3.586" /></svg>`;

    const showAlert = (type, message) => {
        alertsHost.innerHTML = `<div class="alert-banner ${type}"><span>${type === 'success' ? '✅' : '⚠️'}</span><span>${message}</span></div>`;
    };

    // 🌟 Bind Password Generator Action Button
    genBtn.addEventListener("click", () => {
        const generatedString = generateCompliantPassword(); // Safe list generator function we built
        newPassInput.value = generatedString;
        confirmPassInput.value = generatedString;
        
        // Turn plain text view on automatically so admin can copy characters immediately
        newPassInput.type = "text";
        confirmPassInput.type = "text";
        
        showAlert("success", `Generated: <strong>${generatedString}</strong> (Copied to fields below)`);
    });

    // 👁️ Bind Eye Toggle Event Listeners
    modalElement.querySelectorAll(".password-toggle-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const field = document.getElementById(btn.dataset.toggle);
            if (field.type === "password") {
                field.type = "text";
                btn.innerHTML = eyeClosed;
            } else {
                field.type = "password";
                btn.innerHTML = eyeOpen;
            }
        });
    });


    formElement.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newPassword = newPassInput.value;
        const confirmPassword = confirmPassInput.value;
        const authPassword = document.getElementById("resetAuthPass").value;

        // 🧠 Strict Password Complex Validation Metrics
        if (newPassword !== confirmPassword) {
            showAlert("error", "Passwords do not match.");
            return;
        }
        if (newPassword.length < 12) {
            showAlert("error", "Password must be at least 12 characters long.");
            return;
        }
        if (!/[A-Z]/.test(newPassword)) {
            showAlert("error", "Password must contain at least 1 capital letter.");
            return;
        }
        const nums = newPassword.match(/\d/g);
        if (!nums || nums.length < 2) {
            showAlert("error", "Password must contain at least 2 numbers.");
            return;
        }
        const specs = newPassword.match(/[^A-Za-z0-9\s]/g);
        if (!specs || specs.length < 3) {
            showAlert("error", "Password must contain at least 3 special symbols.");
            return;
        }

        const submitBtn = formElement.querySelector(".btn-confirm");

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing...";

            // Send standard partial update patch call directly to user ID path coordinate node
            const response = await fetch(`/api/accounts/${user.id}/reset-password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ newPassword, superadminPassword: authPassword })
            });

            if (!response.ok) throw new Error("Verification failed. Invalid Superadmin Password.");

            showAlert("success", "Password overwritten securely in core database tables!");
            
            setTimeout(() => {
                destroyResetModal();
                initUserControl();
            }, 1800);

        } catch (err) {
            showAlert("error", err.message);
            submitBtn.disabled = false;
            submitBtn.textContent = "Verify & Execute";
        }
    });

    requestAnimationFrame(() => modalElement.classList.add("active"));
    
    const destroyResetModal = () => {
        modalElement.classList.remove("active");
        setTimeout(() => modalElement.remove(), 200);
    };

    closeBtn.addEventListener("click", destroyResetModal);
    modalElement.addEventListener("click", (e) => {
        if (e.target === modalElement) destroyResetModal();
    });
}

function renderStatusToggleModal(user) {
    const isActivating = user.status !== "ACTIVE";
    const actionVerb = isActivating ? "activate" : "deactivate";
    const modalTitle = isActivating ? "Activate Account" : "Deactivate Account";

    const modalHTML = `
        <div class="modal-overlay" id="statusToggleModal">
        <div class="modal-card" style="max-width: 440px; padding: 28px;">
            <h2 class="modal-title" style="color: ${isActivating ? '#16a34a' : '#dc2626'}; border-bottom: none; margin-bottom: 8px;">${modalTitle}</h2>
            <p style="font-family: sans-serif; font-size: 0.95rem; color: #4b5563; margin: 0 0 20px 0; line-height: 1.5;">
                Are you sure you want to <strong style="color: #111827;">${actionVerb}</strong> access for <strong style="color: #111827;">${user.fullName}</strong>?
            </p>

            <div id="toggleModalAlerts" class="modal-alert-host"></div>
        
            <form id="statusToggleForm">
                <!-- Authorization Card layout matching image dimensions perfectly -->
                <div class="auth-section" style="margin-bottom: 24px;">
                    <label>Authorization Required</label>
                    <input type="password" id="toggleAuthPass" placeholder="Enter Superadmin Password..." required />
                </div>

                <div class="modal-actions" style="gap: 12px;">
                    <button type="button" class="btn-cancel" id="closeToggleModalBtn" style="border-radius: 6px; padding: 12px;">Cancel</button>
                    <button type="submit" class="btn-confirm" style="border-radius: 6px; padding: 12px; background: ${isActivating ? '#16a34a' : 'linear-gradient(90deg, #ea580c 0%, #701a75 100%)'}">
                        Verify & Execute
                    </button>
                </div>
            </form>
        </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalElement = document.getElementById("statusToggleModal");
    const formElement = document.getElementById("statusToggleForm");
    const closeBtn = document.getElementById("closeToggleModalBtn");
    const alertsHost = document.getElementById("toggleModalAlerts");

    formElement.addEventListener("submit", async (e) => {
        e.preventDefault();
        const superadminPassword = document.getElementById("toggleAuthPass").value;
        const submitBtn = formElement.querySelector(".btn-confirm");

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing...";

            const response = await fetch(`/api/accounts/${user.id}/soft-delete`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ superadminPassword }) // Passes password check validation parameters
            });

            if (!response.ok) throw new Error("Verification failed. Invalid authentication credentials.");

            alertsHost.innerHTML = `<div class="alert-banner success"><span>✅</span><span>Account status updated securely!</span></div>`;
            
            setTimeout(() => {
                destroyToggleModal();
                initUserControl(); // Instantly refetches list and renders the new opacity updates!
            }, 1500);

        } catch (err) {
            alertsHost.innerHTML = `<div class="alert-banner error"><span>⚠️</span><span>${err.message}</span></div>`;
            submitBtn.disabled = false;
            submitBtn.textContent = "Verify & Execute";
        }
    });

    requestAnimationFrame(() => modalElement.classList.add("active"));
    const destroyToggleModal = () => {
        modalElement.classList.remove("active");
        setTimeout(() => modalElement.remove(), 200);
    };
    closeBtn.addEventListener("click", destroyToggleModal);
}

