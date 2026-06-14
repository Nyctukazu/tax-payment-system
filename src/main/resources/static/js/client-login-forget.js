const modeButtons = document.querySelectorAll(".mode-btn");
const panels = document.querySelectorAll(".panel");
const stepBars = Array.from(document.querySelectorAll("#stepIndicator i"));

const usernameLookupForm = document.getElementById("usernameLookupForm");
const passwordLookupForm = document.getElementById("passwordLookupForm");
const usernameResetForm = document.getElementById("usernameResetForm");
const passwordResetForm = document.getElementById("passwordResetForm");

const newPasswordInput = document.getElementById("newPassword");
const passwordPeekButton = document.getElementById("passwordPeekButton");
const passwordStrengthFill = document.getElementById("passwordStrengthFill");
const passwordStrengthLabel = document.getElementById("passwordStrengthLabel");
const passwordStrengthMeta = document.getElementById("passwordStrengthMeta");
const passwordChecklistItems = Array.from(document.querySelectorAll(".password-check"));

let currentMode = "username";
let currentStep = 1;
let verifiedRecovery = {
  username: null,
  password: null
};

const config = {
  useDatabaseValidation: window.ClientLoginForgetConfig?.useDatabaseValidation ?? true
};

const demoAccounts = [
  { email: "juan@example.com", phone: "09171234567", username: "juan.delacruz" },
  { email: "maria@example.ph", phone: "09987654321", username: "maria.santos" }
];

const api = {
  checkRecoveryIdentifier: async (payload) => {
    if (!config.useDatabaseValidation) {
      return {
        exists: true,
        account: {
          email: payload.email || "",
          phone: payload.phone || ""
        },
        bypassed: true
      };
    }

    if (window.ClientLoginForgetAPI?.checkRecoveryIdentifier) {
      return window.ClientLoginForgetAPI.checkRecoveryIdentifier(payload);
    }

    const matched = demoAccounts.find((account) => {
      if (payload.email) {
        return account.email.toLowerCase() === payload.email.toLowerCase();
      }
      if (payload.phone) {
        return account.phone === payload.phone;
      }
      return false;
    });

    return matched ? { exists: true, account: matched } : { exists: false };
  },
  updateUsername: async (payload) => {
    if (window.ClientLoginForgetAPI?.updateUsername) {
      return window.ClientLoginForgetAPI.updateUsername(payload);
    }

    return { success: true, payload };
  },
  updatePassword: async (payload) => {
    if (window.ClientLoginForgetAPI?.updatePassword) {
      return window.ClientLoginForgetAPI.updatePassword(payload);
    }

    return { success: true, payload };
  }
};

function showPanel(flow, step) {
  currentMode = flow;
  currentStep = Number(step);

  panels.forEach((panel) => {
    const isActive = panel.dataset.flow === flow && panel.dataset.step === String(step);
    panel.classList.toggle("active", isActive);
  });

  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === flow);
  });

  stepBars.forEach((bar, index) => {
    bar.classList.toggle("active", index < currentStep);
  });
}

function setText(id, message = "") {
  const node = document.getElementById(id);
  if (node) node.textContent = message;
}

function markField(fieldId, hasError) {
  const field = document.getElementById(fieldId);
  if (field) field.classList.toggle("has-error", hasError);
}

function markInputField(inputId, hasError) {
  const field = document.getElementById(inputId)?.closest(".field");
  if (field) field.classList.toggle("has-error", hasError);
}

function clearLookupMessages(flow) {
  setText(`${flow}EmailError`);
  setText(`${flow}PhoneError`);
  setText(`${flow}LookupError`);
  setText(`${flow}LookupSuccess`);
  markInputField(`${flow}Email`, false);
  markInputField(`${flow}Phone`, false);
}

function clearResetMessages(flow) {
  if (flow === "username") {
    setText("newUsernameError");
    setText("confirmUsernameError");
    setText("usernameResetError");
    markField("newUsernameField", false);
    markField("confirmUsernameField", false);
  } else {
    setText("newPasswordError");
    setText("confirmPasswordError");
    setText("passwordResetError");
    markField("newPasswordField", false);
    markField("confirmPasswordField", false);
  }
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function normalizePhone(value) {
  return value.replace(/\D/g, "");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhilippineMobile(value) {
  return /^09\d{9}$/.test(value);
}

function setLoading(button, isLoading, idleText = "Submit") {
  if (!button) return;
  button.disabled = isLoading;
  button.textContent = isLoading ? "Checking..." : idleText;
}

function setSaving(button, isLoading) {
  if (!button) return;
  button.disabled = isLoading;
  button.textContent = isLoading ? "Saving..." : "Submit";
}

function getLookupValues(flow) {
  return {
    email: normalizeEmail(document.getElementById(`${flow}Email`).value),
    phone: normalizePhone(document.getElementById(`${flow}Phone`).value)
  };
}

function validateLookupInput(flow) {
  clearLookupMessages(flow);

  const { email, phone } = getLookupValues(flow);
  let valid = true;

  if (!email && !phone) {
    setText(`${flow}LookupError`, "Enter a registered email or Philippine mobile number.");
    return null;
  }

  if (email) {
    const emailValid = isValidEmail(email);
    markInputField(`${flow}Email`, !emailValid);
    setText(`${flow}EmailError`, emailValid ? "" : "Enter a valid email address.");
    valid = valid && emailValid;
  }

  if (phone) {
    const phoneValid = isValidPhilippineMobile(phone);
    markInputField(`${flow}Phone`, !phoneValid);
    setText(`${flow}PhoneError`, phoneValid ? "" : "Use an 11-digit Philippine mobile number starting with 09.");
    valid = valid && phoneValid;
  }

  if (!valid) return null;

  return {
    email: email || "",
    phone: phone || "",
    type: email ? "email" : "phone",
    value: email || phone
  };
}

function getPasswordStrength(password) {
  const checks = {
    length8: password.length >= 8,
    length12: password.length >= 12,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    repeated: /(.)\1{2,}/.test(password),
    common: /password|qwerty|123456|letmein|admin/i.test(password),
    sequence: /0123|1234|2345|3456|abcd|qwer/i.test(password)
  };

  let score = 0;
  if (checks.length8) score += 1;
  if (checks.length12) score += 2;
  if (checks.lower) score += 1;
  if (checks.upper) score += 1;
  if (checks.digit) score += 1;
  if (checks.symbol) score += 1;
  if (checks.repeated) score -= 1;
  if (checks.common || checks.sequence) score -= 2;

  score = Math.max(0, Math.min(score, 6));

  let label = "Weak";
  let color = "#ff6b6b";
  let fill = 20;
  let acceptable = false;

  if (score >= 5) {
    label = "Strong";
    color = "#20d283";
    fill = 100;
    acceptable = true;
  } else if (score >= 4) {
    label = "Good";
    color = "#77d353";
    fill = 78;
    acceptable = true;
  } else if (score >= 3) {
    label = "Fair";
    color = "#ffb347";
    fill = 56;
  } else if (score >= 2) {
    label = "Weak";
    color = "#ff8c42";
    fill = 38;
  }

  let guidance = "Use 12+ characters or a long passphrase with upper/lowercase letters, numbers, and symbols.";
  if (label === "Fair") guidance = "Close, but make it longer or add more character variety.";
  if (label === "Good") guidance = "Accepted. A longer passphrase or extra randomness will make it stronger.";
  if (label === "Strong") guidance = "Strong password. Avoid reusing it on other systems.";
  if (checks.common || checks.sequence) guidance = "Avoid common words and obvious sequences like 1234 or qwerty.";

  return {
    score,
    label,
    color,
    fill,
    acceptable,
    guidance,
    checklist: {
      length12: checks.length12,
      lower: checks.lower,
      upper: checks.upper,
      digit: checks.digit,
      symbol: checks.symbol,
      safePattern: !checks.common && !checks.sequence
    }
  };
}

function updatePasswordStrengthMeter() {
  const { label, color, fill, guidance, checklist } = getPasswordStrength(newPasswordInput.value);
  passwordStrengthFill.style.width = `${fill}%`;
  passwordStrengthFill.style.background = color;
  passwordStrengthLabel.textContent = label;
  passwordStrengthLabel.style.color = color;
  passwordStrengthMeta.textContent = guidance;
  passwordChecklistItems.forEach((item) => {
    item.classList.toggle("is-met", Boolean(checklist[item.dataset.check]));
  });
}

function showPasswordWhilePressed() {
  newPasswordInput.type = "text";
}

function hidePasswordAfterPress() {
  newPasswordInput.type = "password";
}

async function handleLookupSubmit(flow, button) {
  const payload = validateLookupInput(flow);
  if (!payload) return;

  setLoading(button, true);
  setText(`${flow}LookupError`);
  setText(`${flow}LookupSuccess`);

  try {
    const result = await api.checkRecoveryIdentifier(payload);

    if (!result?.exists) {
      setText(
        `${flow}LookupError`,
        payload.type === "email"
          ? "This email was not found in the database."
          : "This mobile number was not found in the database."
      );
      return;
    }

    verifiedRecovery[flow] = {
      ...payload,
      account: result.account || null
    };

    setText(
      `${flow}LookupSuccess`,
      payload.type === "email"
        ? "Email verified. You can continue."
        : "Mobile number verified. You can continue."
    );

    setTimeout(() => showPanel(flow, 2), 250);
  } catch (error) {
    setText(`${flow}LookupError`, error?.message || "Unable to verify this account right now.");
  } finally {
    setLoading(button, false);
  }
}

async function handleUsernameReset(button) {
  clearResetMessages("username");

  if (!verifiedRecovery.username) {
    setText("usernameResetError", "Verify a registered email or phone number first.");
    showPanel("username", 1);
    return;
  }

  const newUsername = document.getElementById("newUsername").value.trim();
  const confirmUsername = document.getElementById("confirmUsername").value.trim();
  let valid = true;

  if (!/^[A-Za-z0-9._]{4,24}$/.test(newUsername)) {
    setText("newUsernameError", "Username must be 4 to 24 characters and use letters, numbers, . or _ only.");
    markField("newUsernameField", true);
    valid = false;
  }

  if (confirmUsername !== newUsername) {
    setText("confirmUsernameError", "Usernames do not match.");
    markField("confirmUsernameField", true);
    valid = false;
  }

  if (!valid) return;

  setSaving(button, true);

  try {
    const result = await api.updateUsername({
      recovery: verifiedRecovery.username,
      newUsername
    });

    if (!result?.success) {
      throw new Error(result?.message || "Unable to update username.");
    }

    showPanel("username", 3);
  } catch (error) {
    setText("usernameResetError", error?.message || "Unable to update username.");
  } finally {
    setSaving(button, false);
  }
}

async function handlePasswordReset(button) {
  clearResetMessages("password");

  if (!verifiedRecovery.password) {
    setText("passwordResetError", "Verify a registered email or phone number first.");
    showPanel("password", 1);
    return;
  }

  const password = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const strength = getPasswordStrength(password);
  let valid = true;

  if (!strength.acceptable) {
    setText("newPasswordError", "Password is too weak. Use at least a Good-strength password.");
    markField("newPasswordField", true);
    valid = false;
  }

  if (confirmPassword !== password) {
    setText("confirmPasswordError", "Passwords do not match.");
    markField("confirmPasswordField", true);
    valid = false;
  }

  if (!valid) return;

  setSaving(button, true);

  try {
    const result = await api.updatePassword({
      recovery: verifiedRecovery.password,
      newPassword: password,
      strength
    });

    if (!result?.success) {
      throw new Error(result?.message || "Unable to update password.");
    }

    showPanel("password", 3);
  } catch (error) {
    setText("passwordResetError", error?.message || "Unable to update password.");
  } finally {
    setSaving(button, false);
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.mode, 1));
});

document.querySelectorAll(".jump-mode").forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.mode, 1));
});

document.querySelectorAll(".back-btn").forEach((button) => {
  button.addEventListener("click", () => {
    clearResetMessages(button.dataset.targetFlow);
    showPanel(button.dataset.targetFlow, button.dataset.targetStep);
  });
});

document.querySelectorAll(".reset-btn").forEach((button) => {
  button.addEventListener("click", () => {
    clearLookupMessages(currentMode);
    showPanel(currentMode, 1);
  });
});

document.querySelectorAll(".restart-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPanel(link.dataset.flow, 1);
  });
});

usernameLookupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleLookupSubmit("username", event.submitter);
});

passwordLookupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleLookupSubmit("password", event.submitter);
});

usernameResetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleUsernameReset(event.submitter);
});

passwordResetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handlePasswordReset(event.submitter);
});

["usernamePhone", "passwordPhone"].forEach((id) => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(0, 11);
  });
});

newPasswordInput.addEventListener("input", updatePasswordStrengthMeter);

["mousedown", "touchstart", "pointerdown"].forEach((eventName) => {
  passwordPeekButton.addEventListener(eventName, (event) => {
    event.preventDefault();
    showPasswordWhilePressed();
  });
});

["mouseup", "mouseleave", "touchend", "touchcancel", "pointerup", "pointercancel", "blur"].forEach((eventName) => {
  passwordPeekButton.addEventListener(eventName, hidePasswordAfterPress);
});

updatePasswordStrengthMeter();
showPanel("username", 1);
