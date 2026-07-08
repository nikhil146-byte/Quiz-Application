import { 
  checkAuthRedirect, 
  getQuestions, 
  getLeaderboard, 
  logout 
} from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Check Authentication
  const user = checkAuthRedirect();
  if (!user) return;

  // 2. Set up Header
  document.getElementById('user-badge').textContent = user.username;
  
  const adminContainer = document.getElementById('admin-link-container');
  if (user.isAdmin) {
    adminContainer.innerHTML = `<a href="admin.html" class="btn btn-secondary btn-sm" style="padding: 0.45rem 0.9rem; font-size: 0.85rem; margin-right: 0.75rem;">Admin Panel</a>`;
  }

  // Logout button
  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  });

  // 3. Load results from sessionStorage
  const resultsData = sessionStorage.getItem('dsa_quiz_results');
  if (!resultsData) {
    showToast('No quiz results found. Redirecting to Quiz Arena...', 'error');
    setTimeout(() => {
      window.location.href = 'quiz.html';
    }, 1500);
    return;
  }

  const results = JSON.parse(resultsData);
  const questions = getQuestions();

  // 4. Render Scorecard Metrics
  const percentage = Math.round((results.score / results.total) * 100);
  document.getElementById('score-percentage').textContent = `${percentage}%`;
  
  // Animate circular fill
  const radialFill = document.getElementById('radial-fill');
  const circumference = 314.16; // 2 * pi * r = 2 * 3.14159 * 50
  const offset = circumference * (1 - percentage / 100);
  
  // Trigger animation slightly delayed for page transition smoothness
  setTimeout(() => {
    radialFill.style.strokeDashoffset = offset;
  }, 100);

  document.getElementById('val-correct').textContent = results.correct;
  document.getElementById('val-wrong').textContent = results.wrong;
  document.getElementById('val-skipped').textContent = results.unanswered;
  
  // Format Time Taken (seconds -> mm:ss)
  const mins = Math.floor(results.timeTaken / 60);
  const secs = results.timeTaken % 60;
  document.getElementById('val-time').textContent = `${mins}m ${secs}s`;

  // 5. Render Leaderboard Table
  renderLeaderboard();

  // 6. Render Question Review Section
  renderReview(questions, results.userAnswers);

  // --- Helper Functions ---

  function renderLeaderboard() {
    const leaderboard = getLeaderboard();
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';

    if (leaderboard.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center">No high scores registered yet!</td></tr>`;
      return;
    }

    // Display Top 10 users
    const topTen = leaderboard.slice(0, 10);
    topTen.forEach((entry, idx) => {
      const rank = idx + 1;
      let rankBadgeClass = 'rank-default';
      
      if (rank === 1) rankBadgeClass = 'rank-1';
      else if (rank === 2) rankBadgeClass = 'rank-2';
      else if (rank === 3) rankBadgeClass = 'rank-3';

      const entryMins = Math.floor(entry.timeTaken / 60);
      const entrySecs = entry.timeTaken % 60;
      const timeStr = `${entryMins}m ${entrySecs}s`;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="rank-badge ${rankBadgeClass}">${rank}</span></td>
        <td style="font-weight: 600;">${escapeHTML(entry.username)}</td>
        <td style="text-align: center; font-weight: 700; color: var(--primary);">${entry.score} / ${questions.length}</td>
        <td style="text-align: center; color: var(--text-secondary);">${timeStr}</td>
        <td style="text-align: right; color: var(--text-muted); font-size: 0.85rem;">${entry.date}</td>
      `;
      tbody.appendChild(row);
    });
  }

  function renderReview(qList, userAnsList) {
    const container = document.getElementById('review-container');
    container.innerHTML = '';

    qList.forEach((q, idx) => {
      const userAns = userAnsList[idx];
      let statusClass = 'skipped';
      let statusText = 'Skipped';

      if (userAns !== -1) {
        if (userAns === q.correctAnswer) {
          statusClass = 'correct';
          statusText = 'Correct';
        } else {
          statusClass = 'wrong';
          statusText = 'Incorrect';
        }
      }

      const itemCard = document.createElement('div');
      itemCard.className = `review-item ${statusClass}`;

      // Question Title Line
      const title = document.createElement('div');
      title.className = 'review-question';
      title.innerHTML = `<strong>Q${idx + 1}.</strong> ${escapeHTML(q.questionText)}`;
      itemCard.appendChild(title);

      // Options List
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'review-options';

      q.options.forEach((optText, optIdx) => {
        const optionBar = document.createElement('div');
        optionBar.className = 'review-option';

        // Check matching states
        const isUserSelection = userAns === optIdx;
        const isCorrectOption = q.correctAnswer === optIdx;

        if (isCorrectOption) {
          if (isUserSelection) {
            optionBar.classList.add('selected-correct');
          } else {
            optionBar.classList.add('target-correct');
          }
        } else if (isUserSelection) {
          optionBar.classList.add('selected-wrong');
        }

        const letterBadge = String.fromCharCode(65 + optIdx);
        optionBar.innerHTML = `
          <span class="review-badge">${letterBadge}</span>
          <span>${escapeHTML(optText)}</span>
        `;
        optionsDiv.appendChild(optionBar);
      });

      itemCard.appendChild(optionsDiv);

      // Explanation Box
      const explanationBox = document.createElement('div');
      explanationBox.className = 'explanation-box';
      explanationBox.innerHTML = `
        <div class="explanation-title">Explanation</div>
        <div>${escapeHTML(q.explanation || 'No explanation provided for this question.')}</div>
      `;
      itemCard.appendChild(explanationBox);

      container.appendChild(itemCard);
    });
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

  function showToast(message, type = 'info') {
    // Falls back to global notification if storage module not accessible in window
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>ℹ️</span> <div>${message}</div>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
});
