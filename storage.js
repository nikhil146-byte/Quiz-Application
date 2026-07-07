import { seedQuestions } from './questions-seed.js';

// LocalStorage Keys
const KEYS = {
  USERS: 'dsa_quiz_users',
  QUESTIONS: 'dsa_quiz_questions',
  LEADERBOARD: 'dsa_quiz_leaderboard',
  SESSION_USER: 'dsa_quiz_current_user',
  ATTEMPT: 'dsa_quiz_current_attempt'
};

// Initial Setup & Seed Checks
export function initializeDB() {
  // 1. Seed default Admin if users database is empty
  if (!localStorage.getItem(KEYS.USERS)) {
    const defaultUsers = [
      {
        email: 'admin@dsa.com',
        username: 'Admin',
        password: 'admin123',
        isAdmin: true
      },
      {
        email: 'user@dsa.com',
        username: 'DSALover',
        password: 'user123',
        isAdmin: false
      }
    ];
    localStorage.setItem(KEYS.USERS, JSON.stringify(defaultUsers));
  }

  // 2. Seed default questions if empty
  if (!localStorage.getItem(KEYS.QUESTIONS)) {
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(seedQuestions));
  }

  // 3. Seed leaderboard if empty
  if (!localStorage.getItem(KEYS.LEADERBOARD)) {
    const dummyLeaderboard = [
      { username: 'CodeMaster', score: 28, timeTaken: 340, date: new Date().toLocaleDateString() },
      { username: 'AlgoGuru', score: 25, timeTaken: 420, date: new Date().toLocaleDateString() },
      { username: 'BinaryBoss', score: 22, timeTaken: 510, date: new Date().toLocaleDateString() },
      { username: 'StackQueuer', score: 18, timeTaken: 600, date: new Date().toLocaleDateString() }
    ];
    localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(dummyLeaderboard));
  }
}

// Invoke initialization on import
initializeDB();

/* --- Questions CRUD API --- */
export function getQuestions() {
  return JSON.parse(localStorage.getItem(KEYS.QUESTIONS)) || [];
}

export function saveQuestions(questions) {
  localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
}

/* --- Authentication API --- */
export function getUsers() {
  return JSON.parse(localStorage.getItem(KEYS.USERS)) || [];
}

export function registerUser(email, username, password) {
  const users = getUsers();
  const lowerEmail = email.toLowerCase().trim();
  
  if (users.some(u => u.email.toLowerCase() === lowerEmail)) {
    throw new Error('An account with this email already exists.');
  }
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase().trim())) {
    throw new Error('Username is already taken.');
  }

  const newUser = {
    email: lowerEmail,
    username: username.trim(),
    password, // Store as plaintext for simple local verification
    isAdmin: false
  };

  users.push(newUser);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return newUser;
}

export function authenticateUser(email, password) {
  const users = getUsers();
  const lowerEmail = email.toLowerCase().trim();
  
  const user = users.find(u => u.email.toLowerCase() === lowerEmail && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  setCurrentUser(user);
  return user;
}

export function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem(KEYS.SESSION_USER)) || null;
}

export function setCurrentUser(user) {
  sessionStorage.setItem(KEYS.SESSION_USER, JSON.stringify(user));
}

export function logout() {
  sessionStorage.removeItem(KEYS.SESSION_USER);
  clearCurrentAttempt();
  window.location.href = 'index.html';
}

export function checkAuthRedirect() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

/* --- Leaderboard API --- */
export function getLeaderboard() {
  const scores = JSON.parse(localStorage.getItem(KEYS.LEADERBOARD)) || [];
  // Sort by score (descending), then by timeTaken (ascending)
  return scores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeTaken - b.timeTaken;
  });
}

export function addLeaderboardScore(score, timeTaken) {
  const user = getCurrentUser();
  if (!user) return;

  const leaderboard = getLeaderboard();
  
  const entry = {
    username: user.username,
    score: score,
    timeTaken: timeTaken,
    date: new Date().toLocaleDateString()
  };

  leaderboard.push(entry);
  localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(leaderboard));
}

/* --- Attempt State Saving --- */
export function saveCurrentAttempt(state) {
  sessionStorage.setItem(KEYS.ATTEMPT, JSON.stringify(state));
}

export function getCurrentAttempt() {
  return JSON.parse(sessionStorage.getItem(KEYS.ATTEMPT)) || null;
}

export function clearCurrentAttempt() {
  sessionStorage.removeItem(KEYS.ATTEMPT);
}

/* --- Toast Helper Utility --- */
export function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Icon selector based on toast type
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
  container.appendChild(toast);

  // Auto-remove toast
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}
