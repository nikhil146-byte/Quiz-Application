import { 
  checkAuthRedirect, 
  getQuestions, 
  getCurrentAttempt, 
  saveCurrentAttempt, 
  clearCurrentAttempt, 
  addLeaderboardScore, 
  logout, 
  showToast 
} from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Authenticate user
  const user = checkAuthRedirect();
  if (!user) return;

  // 2. Load questions
  const questions = getQuestions();
  if (questions.length === 0) {
    showToast('No questions found in the database. Contact admin.', 'error');
    return;
  }

  // 3. UI Elements Setup
  document.getElementById('user-badge').textContent = user.username;
  
  // Set up Admin Panel shortcut if user is admin
  const adminContainer = document.getElementById('admin-link-container');
  if (user.isAdmin) {
    adminContainer.innerHTML = `<a href="admin.html" class="btn btn-secondary btn-sm" style="padding: 0.45rem 0.9rem; font-size: 0.85rem; margin-right: 0.75rem;">Admin Panel</a>`;
  }

  // Logout button
  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout? Your current quiz progress will be lost.')) {
      logout();
    }
  });

  const progressText = document.getElementById('progress-text');
  const progressFill = document.getElementById('progress-fill');
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  
  // Timer Elements
  const timerProgress = document.getElementById('timer-progress');
  const timerSeconds = document.getElementById('timer-seconds');
  
  // Modal Elements
  const submitModal = document.getElementById('submit-modal');
  const btnCancelSubmit = document.getElementById('btn-cancel-submit');
  const btnConfirmSubmit = document.getElementById('btn-confirm-submit');
  const unansweredWarning = document.getElementById('unanswered-warning');

  // 4. Quiz State Variables
  let currentIndex = 0;
  let userAnswers = new Array(questions.length).fill(-1); // -1 = unanswered
  let timeRemaining = 30; // 30 seconds per question
  let timerInterval = null;
  let startTime = null;
  let isPaused = false;

  // 5. Initialize or Resume Quiz Attempt
  const savedAttempt = getCurrentAttempt();
  if (savedAttempt && savedAttempt.username === user.username && savedAttempt.questionsLength === questions.length) {
    currentIndex = savedAttempt.currentIndex;
    userAnswers = savedAttempt.userAnswers;
    startTime = savedAttempt.startTime;
    showToast('Resuming your previous attempt...', 'info');
  } else {
    // Brand new attempt
    startTime = Date.now();
    saveAttemptState();
  }

  // Load first question
  loadQuestion(currentIndex);

  // 6. State saving helper
  function saveAttemptState() {
    saveCurrentAttempt({
      username: user.username,
      questionsLength: questions.length,
      currentIndex,
      userAnswers,
      startTime
    });
  }

  // 7. Load & Render Question
  function loadQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    
    // Reset warning styling on timer circle
    timerProgress.className.baseVal = 'timer-fill';
    
    // Clear UI highlights
    optionsContainer.innerHTML = '';
    
    const q = questions[index];
    questionText.textContent = q.questionText;

    // Render Options
    q.options.forEach((optText, optIdx) => {
      const button = document.createElement('button');
      button.className = 'option-btn';
      if (userAnswers[index] === optIdx) {
        button.classList.add('selected');
      }

      const letterBadge = String.fromCharCode(65 + optIdx); // A, B, C, D
      button.innerHTML = `
        <span class="option-letter">${letterBadge}</span>
        <span class="option-content">${escapeHTML(optText)}</span>
      `;

      // Select Answer Event
      button.addEventListener('click', () => {
        // Deselect others
        const buttons = optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));
        
        // Select current
        button.classList.add('selected');
        userAnswers[index] = optIdx;
        
        saveAttemptState();
      });

      optionsContainer.appendChild(button);
    });

    // Update Progress Indicators
    progressText.textContent = `Question ${index + 1} of ${questions.length}`;
    const progressPercent = ((index + 1) / questions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;

    // Manage Buttons
    btnPrev.disabled = index === 0;
    
    if (index === questions.length - 1) {
      btnNext.innerHTML = `Submit Quiz <span>✓</span>`;
      btnNext.className = 'btn btn-success';
    } else {
      btnNext.innerHTML = `Next <span>→</span>`;
      btnNext.className = 'btn btn-primary';
    }

    // Reset and start timer
    resetTimer();
  }

  // 8. Timer Functions
  function resetTimer() {
    clearInterval(timerInterval);
    timeRemaining = 30;
    isPaused = false;
    updateTimerUI();
    
    timerInterval = setInterval(() => {
      if (isPaused) return;

      timeRemaining--;
      updateTimerUI();

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 1000);
  }

  function updateTimerUI() {
    timerSeconds.textContent = timeRemaining;
    
    // Circumference of our SVG circle (r=34) = 213.628
    const circumference = 213.628;
    const offset = circumference * (1 - timeRemaining / 30);
    timerProgress.style.strokeDashoffset = offset;

    // Pulse warning states
    if (timeRemaining <= 5) {
      timerProgress.className.baseVal = 'timer-fill timer-danger';
    } else if (timeRemaining <= 12) {
      timerProgress.className.baseVal = 'timer-fill timer-warning';
    } else {
      timerProgress.className.baseVal = 'timer-fill';
    }
  }

  // Auto-advance or lock answer when timer expires
  function handleTimeout() {
    showToast(`Time's up for Question ${currentIndex + 1}!`, 'warning');
    
    // Lock current answer: keep whatever is chosen, or leave as -1
    // Save attempt state
    saveAttemptState();

    // Auto-advance
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      loadQuestion(currentIndex);
      saveAttemptState();
    } else {
      // Last question timed out, trigger submit confirmation modal
      openSubmitModal();
    }
  }

  // 9. Navigation Actions
  btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      loadQuestion(currentIndex);
      saveAttemptState();
    }
  });

  btnNext.addEventListener('click', () => {
    if (currentIndex === questions.length - 1) {
      openSubmitModal();
    } else {
      currentIndex++;
      loadQuestion(currentIndex);
      saveAttemptState();
    }
  });

  // 10. Modal Actions
  function openSubmitModal() {
    isPaused = true; // Stop timer
    
    // Check for unanswered questions
    const unansweredCount = userAnswers.filter(ans => ans === -1).length;
    if (unansweredCount > 0) {
      unansweredWarning.style.display = 'block';
      unansweredWarning.textContent = `⚠️ You have left ${unansweredCount} question(s) unanswered.`;
    } else {
      unansweredWarning.style.display = 'none';
    }

    submitModal.classList.add('active');
  }

  btnCancelSubmit.addEventListener('click', () => {
    submitModal.classList.remove('active');
    isPaused = false; // Resume timer
  });

  btnConfirmSubmit.addEventListener('click', () => {
    submitModal.classList.remove('active');
    clearInterval(timerInterval);
    processQuizSubmission();
  });

  // Calculate score and redirect to results
  function processQuizSubmission() {
    let score = 0;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((q, idx) => {
      const userAns = userAnswers[idx];
      if (userAns === -1) {
        unanswered++;
      } else if (userAns === q.correctAnswer) {
        correct++;
        score++;
      } else {
        wrong++;
      }
    });

    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // duration in seconds

    // Add score to leaderboard database
    addLeaderboardScore(score, timeTaken);

    // Save final report data in sessionStorage for results loading
    sessionStorage.setItem('dsa_quiz_results', JSON.stringify({
      score,
      total: questions.length,
      correct,
      wrong,
      unanswered,
      timeTaken,
      userAnswers
    }));

    // Clear attempt progress
    clearCurrentAttempt();

    showToast('Quiz submitted successfully! Loading results...', 'success');
    
    setTimeout(() => {
      window.location.href = 'result.html';
    }, 1200);
  }

  // HTML escaping helper
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
