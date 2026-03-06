// ============================================
// DOM ELEMENTS
// ============================================
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');
const rememberMeCheckbox = document.getElementById('rememberMe');
const loginBtn = document.querySelector('.login-btn');
const messageContainer = document.getElementById('messageContainer');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const successModal = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');
const modalCloseBtn = document.querySelector('.close');
const modalBtn = document.querySelector('.modal-btn');
const forgotPasswordLink = document.querySelector('.forgot-password');
const signupLink = document.querySelector('.signup-link');

// ============================================
// DEMO CREDENTIALS
// ============================================
const DEMO_CREDENTIALS = {
    email: 'user@example.com',
    password: 'password123'
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadSavedEmail();
});

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleLoginSubmit);

    // Password visibility toggle
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
        clearError('email');
    });

    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', () => {
        clearError('password');
    });

    // Modal controls
    modalCloseBtn.addEventListener('click', closeSuccessModal);
    modalBtn.addEventListener('click', closeSuccessModal);
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) closeSuccessModal();
    });

    // Additional links
    forgotPasswordLink.addEventListener('click', handleForgotPassword);
    signupLink.addEventListener('click', handleSignup);

    // Social login buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });

    // Remember me functionality
    rememberMeCheckbox.addEventListener('change', updateRememberMe);
}

// ============================================
// FORM VALIDATION
// ============================================
function validateEmail() {
    const email = emailInput.value.trim();

    if (!email) {
        showError('email', 'Email is required');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address');
        return false;
    }

    clearError('email');
    return true;
}

function validatePassword() {
    const password = passwordInput.value;

    if (!password) {
        showError('password', 'Password is required');
        return false;
    }

    if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        return false;
    }

    clearError('password');
    return true;
}

function validateForm() {
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    return emailValid && passwordValid;
}

function showError(field, message) {
    if (field === 'email') {
        emailError.textContent = message;
        emailInput.classList.add('error');
    } else if (field === 'password') {
        passwordError.textContent = message;
        passwordInput.classList.add('error');
    }
}

function clearError(field) {
    if (field === 'email') {
        emailError.textContent = '';
        emailInput.classList.remove('error');
    } else if (field === 'password') {
        passwordError.textContent = '';
        passwordInput.classList.remove('error');
    }
}

// ============================================
// LOGIN HANDLER
// ============================================
async function handleLoginSubmit(e) {
    e.preventDefault();
    messageContainer.classList.remove('show', 'success', 'error');

    // Validate form
    if (!validateForm()) {
        showMessage('Please fix the errors above', 'error');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Show loading state
    setLoadingState(true);

    // Simulate API call with delay
    setTimeout(() => {
        // Check credentials (demo)
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
            // Successful login
            handleSuccessfulLogin(email);
        } else {
            // Failed login
            showMessage('Invalid email or password. Try user@example.com / password123', 'error');
            setLoadingState(false);
        }
    }, 1500);
}

function handleSuccessfulLogin(email) {
    // Save user data
    const userData = {
        email: email,
        loginTime: new Date().toISOString(),
        sessionToken: generateSessionToken()
    };

    sessionStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('lastLoginEmail', email);

    if (rememberMeCheckbox.checked) {
        localStorage.setItem('rememberEmail', email);
    } else {
        localStorage.removeItem('rememberEmail');
    }

    // Show success message
    setLoadingState(false);
    showMessage('Login successful!', 'success');
    successMessage.textContent = `Welcome back, ${email}!`;
    
    // Show modal and redirect after delay
    setTimeout(() => {
        showSuccessModal();
    }, 800);

    setTimeout(() => {
        resetForm();
    }, 3000);
}

function showMessage(message, type) {
    messageContainer.textContent = message;
    messageContainer.classList.add('show', type);
}

function setLoadingState(isLoading) {
    if (isLoading) {
        loginBtn.disabled = true;
        loginBtn.classList.add('loading');
        loginBtn.textContent = 'Signing In...';
    } else {
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
        loginBtn.textContent = 'Sign In';
    }
}

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================
function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.textContent = isPassword ? '👁️‍🗨️' : '👁️';
}

// ============================================
// REMEMBER ME FUNCTIONALITY
// ============================================
function loadSavedEmail() {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }
}

function updateRememberMe() {
    if (rememberMeCheckbox.checked && emailInput.value) {
        localStorage.setItem('rememberEmail', emailInput.value);
    } else {
        localStorage.removeItem('rememberEmail');
    }
}

// ============================================
// MODAL MANAGEMENT
// ============================================
function showSuccessModal() {
    successModal.classList.add('show');
}

function closeSuccessModal() {
    successModal.classList.remove('show');
}

// ============================================
// FORM RESET
// ============================================
function resetForm() {
    loginForm.reset();
    clearError('email');
    clearError('password');
    messageContainer.classList.remove('show', 'success', 'error');
    
    // Reload saved email if remember me was checked
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }
}

// ============================================
// ADDITIONAL HANDLERS
// ============================================
function handleForgotPassword(e) {
    e.preventDefault();
    showMessage('Password reset functionality would redirect to reset page', 'success');
    console.log('Forgot password clicked');
}

function handleSignup(e) {
    e.preventDefault();
    showMessage('Sign up functionality would redirect to signup page', 'success');
    console.log('Sign up clicked');
}

function handleSocialLogin(e) {
    e.preventDefault();
    const provider = e.currentTarget.classList.contains('google-btn') ? 'Google' : 'GitHub';
    showMessage(`${provider} login would redirect to ${provider} OAuth flow`, 'success');
    console.log(`${provider} login clicked`);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function generateSessionToken() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + 
           '_' + new Date().getTime();
}

// Export current user info
function getCurrentUser() {
    const userData = sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Logout function
function logout() {
    sessionStorage.removeItem('userData');
    resetForm();
    showMessage('Logged out successfully', 'success');
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Alt + L for Login
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        loginBtn.click();
    }
    // Alt + C to Clear
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        resetForm();
    }
});

// ============================================
// DEVELOPMENT HELPERS (Console)
// ============================================
console.log('%c🔐 Login Page Loaded', 'font-size: 14px; color: #4f46e5; font-weight: bold;');
console.log('%cDemo Credentials:', 'font-weight: bold;');
console.log(`Email: ${DEMO_CREDENTIALS.email}`);
console.log(`Password: ${DEMO_CREDENTIALS.password}`);
console.log('%cAvailable Functions:', 'font-weight: bold;');
console.log('getCurrentUser() - Get current session user');
console.log('logout() - Logout current user');
console.log('%cKeyboard Shortcuts:', 'font-weight: bold;');
console.log('Alt + L - Submit login form');
console.log('Alt + C - Clear form');
