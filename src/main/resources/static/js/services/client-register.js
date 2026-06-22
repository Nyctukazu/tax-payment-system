import { initStartHeader } from "../components/StartHeader.js";
import { initializeParticles } from "../components/particles.js";
import { RegisterUserWithBackend } from "./authService.js";


document.addEventListener('DOMContentLoaded', () => {
  initStartHeader();
  initializeParticles();

  const form = document.getElementById('registrationForm');
  const submitBtn = document.getElementById('submitBtn');

  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');

  const fields = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    mobileNumber: document.getElementById('mobileNumber'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
  };

  const reqItems = {
    length: document.getElementById('reqLength'),
    capital: document.getElementById('reqCapital'),
    symbol: document.getElementById('reqSymbol'),
    number: document.getElementById('reqNumber')
  };

  // Track whether user has accepted terms (replaces checkbox)
  let termsAccepted = false;
  let selectedPhotoFile = null;

  // ==================== 1. PASSWORD EYE TOGGLE ====================
  document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function () {
      const targetInput = document.getElementById(this.getAttribute('data-target'));
      if (targetInput.type === 'password') {
        targetInput.type = 'text';
        this.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        targetInput.type = 'password';
        this.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });

  // ==================== 2. VALIDATION RULES ====================
  const validators = {
    firstName: (val) => {
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
      return val.trim().length >= 2 && val.trim().length <= 50 && nameRegex.test(val);
    },
    lastName: (val) => {
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
      return val.trim().length >= 2 && val.trim().length <= 50 && nameRegex.test(val);
    },
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    mobileNumber: (val) => {
      if (!val.trim()) return true;
      if (/[^0-9]/.test(val)) return false;
      return val.length === 10 || (val.length === 11 && val.startsWith('0'));
    },
    password: (val) => {
      return val.length >= 12 &&
        (val.match(/[A-Z]/g) || []).length >= 1 &&
        (val.match(/[\W_]/g) || []).length >= 3 &&
        (val.match(/\d/g) || []).length >= 2;
    },
    confirmPassword: (val) => val === fields.password.value && val.length > 0,
  };

  // ==================== 3. LIVE PASSWORD FEEDBACK ====================
  function handleLivePasswordFeedback(val) {
    const meter = document.getElementById('strengthMeter');

    if (val.length === 0) {
      meter.className = 'strength-meter';
      Object.values(reqItems).forEach(el => el.className = 'requirement-item');
      return;
    }

    const checks = {
      length: val.length >= 12,
      capital: (val.match(/[A-Z]/g) || []).length >= 1,
      symbol: (val.match(/[\W_]/g) || []).length >= 3,
      number: (val.match(/\d/g) || []).length >= 2
    };

    let score = 0;
    Object.keys(checks).forEach(key => {
      if (checks[key]) { score++; reqItems[key].className = 'requirement-item met'; }
      else { reqItems[key].className = 'requirement-item unmet'; }
    });

    meter.className = 'strength-meter';
    if (score <= 1) meter.classList.add('weak');
    else if (score === 2) meter.classList.add('fair');
    else if (score === 3) meter.classList.add('good');
    else if (score === 4) meter.classList.add('strong');
  }

  // ==================== 4. FIELD VALIDATION ====================
  function validateField(fieldName, forceShowError = false) {
    const inputElement = fields[fieldName];
    if (!inputElement) return;

    const value = inputElement.value;
    const isValid = validators[fieldName](value);

    if (fieldName === 'mobileNumber' && !value.trim()) {
      inputElement.classList.remove('invalid', 'valid');
      checkFormValidity();
      return;
    }

    if (isValid) {
      inputElement.classList.remove('invalid');
      inputElement.classList.add('valid');
    } else {
      if (forceShowError || value.length > 0) {
        inputElement.classList.remove('valid');
        inputElement.classList.add('invalid');
      } else {
        inputElement.classList.remove('invalid', 'valid');
      }
    }

    checkFormValidity();
  }

  Object.keys(fields).forEach(key => {
    fields[key].addEventListener('blur', () => validateField(key, true));
    fields[key].addEventListener('input', () => {
      if (key === 'password') {
        handleLivePasswordFeedback(fields.password.value);
        validateField('password', false);
        if (fields.confirmPassword.value.length > 0) validateField('confirmPassword', false);
      } else if (key === 'confirmPassword') {
        validateField('confirmPassword', false);
      } else {
        validateField(key, false);
      }
    });
  });

  // Form is valid only when all fields pass AND terms are accepted
  function checkFormValidity() {
    const fieldsValid = Object.keys(fields).every(key =>
      validators[key](fields[key].value)
    );
    submitBtn.disabled = !(fieldsValid && termsAccepted);
  }

  // ==================== 5. STEP 1 SUBMIT ====================
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = {
        firstName: fields.firstName.value.trim(),
        lastName: fields.lastName.value.trim(),
        email: fields.email.value.trim(),
        mobileNumber: fields.mobileNumber.value.trim(),
        password: fields.password.value,
        accountType: 'TAXPAYER',
        adminClass: null
      };

      submitBtn.disabled = true;
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Registering...';

      try {
        const result = await RegisterUserWithBackend(formData);

        if (result.success) {
          if (step1) step1.classList.remove('active-step');
          triggerFinalSuccessRedirect(false);
        } else {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
          alert(result.error || 'An error occurred during registration.');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
        console.error('Submission crash details:', err);
        alert('A critical interface error occurred. Please try again.');
      }
    });
  }

  // ==================== 6. STEP 2: PHOTO UPLOAD ====================
  const hiddenFileInput = document.getElementById('hiddenFileInput');
  const cameraOptionBtn = document.getElementById('cameraOptionBtn');
  const photoPreviewContainer = document.getElementById('photoPreviewContainer');
  const photoPreviewImg = document.getElementById('photoPreviewImg');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  const finalUploadBtn = document.getElementById('finalUploadBtn');
  const skipPhotoBtn = document.getElementById('skipPhotoBtn');

  function handleImageSelected(file) {
    if (!file) return;
    selectedPhotoFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreviewImg.src = e.target.result;
      photoPreviewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  hiddenFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleImageSelected(e.target.files[0]);
  });

  cameraOptionBtn.addEventListener('click', () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      hiddenFileInput.setAttribute('capture', 'user');
    } else {
      hiddenFileInput.removeAttribute('capture');
    }
    hiddenFileInput.click();
  });

  removePhotoBtn.addEventListener('click', () => {
    selectedPhotoFile = null;
    hiddenFileInput.value = '';
    photoPreviewImg.src = '';
    photoPreviewContainer.style.display = 'none';
  });

  finalUploadBtn.addEventListener('click', () => {
    if (!selectedPhotoFile) {
      alert('Please select or capture a photo first, or click Skip.');
      return;
    }
    triggerFinalSuccessRedirect(true);
  });

  skipPhotoBtn.addEventListener('click', () => triggerFinalSuccessRedirect(false));

  // ==================== 7. STEP 3: SUCCESS REDIRECT ====================
  function triggerFinalSuccessRedirect(includePhoto = true) {
    const selectedCode = document.getElementById('countryCode').value;
    let rawPhone = fields.mobileNumber.value.trim();
    if (rawPhone.startsWith('0')) rawPhone = rawPhone.substring(1);
    const fullPhoneNumber = rawPhone ? `${selectedCode}${rawPhone}` : '';

    console.log('Account Packaged:', {
      firstName: fields.firstName.value.trim(),
      lastName: fields.lastName.value.trim(),
      email: fields.email.value.trim(),
      phone: fullPhoneNumber,
      profileImage: includePhoto ? selectedPhotoFile : null
    });

    if (step2) step2.classList.remove('active-step');
    step3.classList.add('active-step');

    let currentTimeLeft = 5;
    const countdownTimerElement = document.getElementById('countdownTimer');
    const manualRedirectLink = document.getElementById('manualRedirectLink');

    function executeRedirectAction() {
      window.location.href = '/portal';
    }

    const counterInterval = setInterval(() => {
      currentTimeLeft--;
      countdownTimerElement.textContent = currentTimeLeft;
      if (currentTimeLeft <= 0) {
        clearInterval(counterInterval);
        executeRedirectAction();
      }
    }, 1000);

    manualRedirectLink.addEventListener('click', (e) => {
      e.preventDefault();
      clearInterval(counterInterval);
      executeRedirectAction();
    });
  }

  // ==================== 8. TERMS MODAL ====================
  const termsModal = document.getElementById('termsModal');
  const termsOpenBtn = document.getElementById('termsOpenBtn');
  const termsStatusBadge = document.getElementById('termsStatusBadge');
  const termsStatusText = document.getElementById('termsStatusText');
  const closeTermsBtn = document.getElementById('closeTermsBtn');
  const acceptTermsBtn = document.getElementById('acceptTermsBtn');
  const termsBody = document.getElementById('termsBody');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const footerNote = document.getElementById('footerNote');
  const readNudge = document.getElementById('readNudge');

  // Has the user scrolled to the bottom at least once?
  let hasScrolledToBottom = false;

  function openTermsModal() {
    termsModal.classList.add('active');
    // Only reset scroll state if they haven't read it yet
    if (!hasScrolledToBottom) {
      termsBody.scrollTop = 0;
      scrollProgressBar.style.width = '0%';
      acceptTermsBtn.disabled = true;
      acceptTermsBtn.innerHTML = '<i class="fa-solid fa-lock btn-lock-icon"></i> Read all terms to accept';
      footerNote.textContent = 'Scroll to read all terms';
      footerNote.classList.remove('ready');
      readNudge.classList.remove('hidden');
    }
  }

  function closeTermsModal() {
    termsModal.classList.remove('active');
  }

  function markTermsAccepted() {
    termsAccepted = true;

    // Update the button in the form
    termsOpenBtn.classList.add('terms-accepted');
    termsOpenBtn.querySelector('span').textContent = 'Terms & Conditions — Accepted';
    termsOpenBtn.querySelector('.terms-chevron').className = 'fa-solid fa-circle-check terms-chevron';

    // Update the status badge
    termsStatusBadge.classList.add('accepted');
    termsStatusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Terms and conditions accepted — you may proceed</span>';

    checkFormValidity();
  }

  // Scroll tracking — unlock accept button when user reaches the bottom
  termsBody.addEventListener('scroll', () => {
    if (hasScrolledToBottom) return;

    const scrollTop = termsBody.scrollTop;
    const scrollHeight = termsBody.scrollHeight - termsBody.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 100;

    scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;

    if (scrollTop > 40) readNudge.classList.add('hidden');

    if (scrollTop + termsBody.clientHeight >= termsBody.scrollHeight - 30) {
      hasScrolledToBottom = true;
      scrollProgressBar.style.width = '100%';
      acceptTermsBtn.disabled = false;
      acceptTermsBtn.innerHTML = 'I Understand &amp; Accept';
      footerNote.textContent = 'You have read all the terms ✓';
      footerNote.classList.add('ready');
      readNudge.classList.add('hidden');
    }
  });

  termsOpenBtn.addEventListener('click', openTermsModal);
  closeTermsBtn.addEventListener('click', closeTermsModal);

  acceptTermsBtn.addEventListener('click', () => {
    if (acceptTermsBtn.disabled) return;
    markTermsAccepted();
    closeTermsModal();
  });

  // Click outside modal to close
  termsModal.addEventListener('click', (e) => {
    if (e.target === termsModal) closeTermsModal();
  });

});