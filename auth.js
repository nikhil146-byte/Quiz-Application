import { 
  getCurrentUser, 
  authenticateUser, 
  registerUser, 
  showToast 
} from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Check if user is already authenticated
  const currentUser = getCurrentUser();
  if (currentUser) {
    showToast(`Welcome back, ${currentUser.username}! Redirecting to arena...`, 'success');
    setTimeout(() => {
      window.location.href = 'quiz.html';
    }, 1200);
    return;
  }

  // 2. Select Elements
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  // Input Fields
  const loginEmail = document.getElementById('login-email');
  const loginPass = document.getElementById('login-password');
  
  const regUser = document.getElementById('register-username');
  const regEmail = document.getElementById('register-email');
  const regPass = document.getElementById('register-password');
  const regConfirm = document.getElementById('register-confirm-password');

  // 3. Tab Switching Logic
  tabLogin.addEventListener('click', () => {
    switchTab('login');
  });

  tabRegister.addEventListener('click', () => {
    switchTab('register');
  });

  function switchTab(mode) {
    if (mode === 'login') {
      tabLogin.classList.add('active');
      tabLogin.setAttribute('aria-selected', 'true');
      tabRegister.classList.remove('active');
      tabRegister.setAttribute('aria-selected', 'false');
      formLogin.classList.add('active');
      formRegister.classList.remove('active');
    } else {
      tabRegister.classList.add('active');
      tabRegister.setAttribute('aria-selected', 'true');
      tabLogin.classList.remove('active');
      tabLogin.setAttribute('aria-selected', 'false');
      formRegister.classList.add('active');
      formLogin.classList.remove('active');
    }
  }

  // 4. Handle Login Form Submit
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPass.value;

    try {
      const user = authenticateUser(email, password);
      showToast(`Welcome, ${user.username}! Access Granted.`, 'success');
      
      // Clear forms
      formLogin.reset();

      // Redirect after animations
      setTimeout(() => {
        window.location.href = 'quiz.html';
      }, 1000);
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // 5. Handle Registration Form Submit
  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = regUser.value;
    const email = regEmail.value;
    const password = regPass.value;
    const confirmPassword = regConfirm.value;

    // Validate Passwords
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    try {
      // Register
      registerUser(email, username, password);
      showToast('Account registered successfully!', 'success');
      
      // Clear form
      formRegister.reset();

      // Auto login
      authenticateUser(email, password);
      
      setTimeout(() => {
        window.location.href = 'quiz.html';
      }, 1200);
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
});
