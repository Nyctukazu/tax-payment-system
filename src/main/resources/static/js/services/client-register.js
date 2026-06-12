document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const submitBtn = document.getElementById('submitBtn');
  
  // Containers for step navigation paths
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
    terms: document.getElementById('terms')
  };

  const reqItems = {
    length: document.getElementById('reqLength'),
    capital: document.getElementById('reqCapital'),
    symbol: document.getElementById('reqSymbol'),
    number: document.getElementById('reqNumber')
  };

  let selectedPhotoFile = null;

  // 1. Password Visibility Eye Toggle
  document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
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

  // 2. Comprehensive Validation Rules
  const validators = {
    firstName: (val) => {
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
      return val.trim().length >= 2 && val.trim().length <= 50 && nameRegex.test(val);
    },
    lastName: (val) => {
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
      return val.trim().length >= 2 && val.trim().length <= 50 && nameRegex.test(val);
    },
    email: (val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val.trim());
    },
    mobileNumber: (val) => {
      if (!val.trim()) return true; 
      const containsSymbols = /[^0-9]/.test(val);
      if (containsSymbols) return false;
      return val.length === 11; 
    },
    password: (val) => {
      return val.length >= 8 && 
             /[A-Z]/.test(val) && 
             /[\W_]/.test(val) && 
             /\d/.test(val);
    },
    confirmPassword: (val) => {
      return val === fields.password.value && val.length > 0;
    },
    terms: (val, element) => {
      return element.checked;
    }
  };

  // 3. Live Password Engine Feedback
  function handleLivePasswordFeedback(val) {
    const meter = document.getElementById('strengthMeter');
    
    if (val.length === 0) {
      meter.className = 'strength-meter';
      Object.values(reqItems).forEach(el => el.className = "requirement-item");
      return;
    }

    const checks = {
      length: val.length >= 8,
      capital: /[A-Z]/.test(val),
      symbol: /[\W_]/.test(val),
      number: /\d/.test(val)
    };

    let score = 0;
    Object.keys(checks).forEach(key => {
      if (checks[key]) {
        score++;
        reqItems[key].className = "requirement-item met"; 
      } else {
        reqItems[key].className = "requirement-item unmet"; 
      }
    });

    meter.className = 'strength-meter'; 
    if (score <= 1) meter.classList.add('weak');
    else if (score === 2) meter.classList.add('fair');
    else if (score === 3) meter.classList.add('good');
    else if (score === 4) meter.classList.add('strong');
  }

  // 4. Secure Field Verification UI Engine
  function validateField(fieldName, forceShowError = false) {
    const inputElement = fields[fieldName];
    if (!inputElement) return;

    const value = inputElement.value;
    const isValid = validators[fieldName](value, inputElement);

    if (fieldName === 'terms') {
      checkFormValidity();
      return;
    }

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

  // Bind Listeners
  Object.keys(fields).forEach(key => {
    if (key === 'terms') {
      fields[key].addEventListener('change', () => checkFormValidity());
      return;
    }

    fields[key].addEventListener('blur', () => {
      validateField(key, true);
    });
    
    fields[key].addEventListener('input', () => {
      if (key === 'password') {
        handleLivePasswordFeedback(fields.password.value);
        validateField('password', false);
        if (fields.confirmPassword.value.length > 0) {
          validateField('confirmPassword', false);
        }
      } else if (key === 'confirmPassword') {
        validateField('confirmPassword', false);
      } else {
        validateField(key, false);
      }
    });
  });

  function checkFormValidity() {
    const formIsFullyValid = Object.keys(fields).every(key => {
      return validators[key](fields[key].value, fields[key]);
    });
    submitBtn.disabled = !formIsFullyValid;
  }

  // STEP 1 DISPATCH: SLIDE TO STEP 2 UPLOAD
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Object.keys(fields).forEach(key => {
      if (key !== 'terms') validateField(key, true);
    });

    if (!submitBtn.disabled) {
      step1.classList.remove('active-step');
      step2.classList.add('active-step');
    }
  });

  // ==================== STEP 2: PROFILE UPLOAD ACTIONS ====================
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
    reader.onload = function(e) {
      photoPreviewImg.src = e.target.result;
      photoPreviewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  hiddenFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleImageSelected(e.target.files[0]);
    }
  });

  cameraOptionBtn.addEventListener('click', () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      hiddenFileInput.setAttribute('capture', 'user');
      hiddenFileInput.click();
    } else {
      hiddenFileInput.removeAttribute('capture');
      hiddenFileInput.click();
    }
  });

  removePhotoBtn.addEventListener('click', () => {
    selectedPhotoFile = null;
    hiddenFileInput.value = '';
    photoPreviewImg.src = '';
    photoPreviewContainer.style.display = 'none';
  });

  // ==================== NEW STEP 3: SUCCESS REDIRECT CONTROLLER ====================
  function triggerFinalSuccessRedirect(includePhoto = true) {
    const selectedCode = document.getElementById('countryCode').value;
    let rawPhone = fields.mobileNumber.value.trim();

    if (rawPhone.startsWith('0')) {
      rawPhone = rawPhone.substring(1);
    }
    const fullPhoneNumber = rawPhone ? `${selectedCode}${rawPhone}` : '';

    const finalAccountPackage = {
      firstName: fields.firstName.value.trim(),
      lastName: fields.lastName.value.trim(),
      email: fields.email.value.trim(),
      phone: fullPhoneNumber,
      password: fields.password.value,
      profileImage: includePhoto ? selectedPhotoFile : null
    };

    console.log('Account Packaged & Saved Internally:', finalAccountPackage);

    // Switch View Context smoothly from step 2 to step 3 success state
    step2.classList.remove('active-step');
    step3.classList.add('active-step');

    // Start a real live dynamic 5 second redirect countdown sequence
    let currentTimeLeft = 5;
    const countdownTimerElement = document.getElementById('countdownTimer');
    const manualRedirectLink = document.getElementById('manualRedirectLink');

    function executeRedirectAction() {
      // Replace with your real fallback page path route (e.g., 'landing.html')
      window.location.href = 'https://google.com'; 
    }

    const counterInterval = setInterval(() => {
      currentTimeLeft--;
      countdownTimerElement.textContent = currentTimeLeft;

      if (currentTimeLeft <= 0) {
        clearInterval(counterInterval);
        executeRedirectAction();
      }
    }, 1000);

    // Manual instant redirection bypass handler
    manualRedirectLink.addEventListener('click', (e) => {
      e.preventDefault();
      clearInterval(counterInterval);
      executeRedirectAction();
    });
  }

  // Step 2 final action button mappings route straight to Step 3 success layout
  finalUploadBtn.addEventListener('click', () => {
    if (!selectedPhotoFile) {
      alert('Please select or capture a photo first, or click Skip.');
      return;
    }
    triggerFinalSuccessRedirect(true);
  });

  skipPhotoBtn.addEventListener('click', () => {
    triggerFinalSuccessRedirect(false);
  });
});