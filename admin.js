import { 
  checkAuthRedirect, 
  getQuestions, 
  saveQuestions, 
  logout, 
  showToast 
} from './storage.js';
import { seedQuestions } from './questions-seed.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Verify Authentication & Admin Clearance
  const user = checkAuthRedirect();
  if (!user) return;

  if (!user.isAdmin) {
    showToast('Access denied. Admin authorization required.', 'error');
    setTimeout(() => {
      window.location.href = 'quiz.html';
    }, 1200);
    return;
  }

  // 2. Set UI Header User Info
  document.getElementById('user-badge').textContent = user.username;
  
  // Logout click event
  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  });

  // 3. UI Elements Selection
  const statTotal = document.getElementById('stat-total-questions');
  const tbody = document.getElementById('questions-tbody');
  
  const btnAdd = document.getElementById('btn-add-question');
  const btnReset = document.getElementById('btn-reset-db');
  
  // Modal Elements
  const modal = document.getElementById('question-modal');
  const modalForm = document.getElementById('question-form');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  
  // Form Inputs
  const inputId = document.getElementById('edit-question-id');
  const inputText = document.getElementById('input-question-text');
  const inputA = document.getElementById('input-opt-a');
  const inputB = document.getElementById('input-opt-b');
  const inputC = document.getElementById('input-opt-c');
  const inputD = document.getElementById('input-opt-d');
  const selectCorrect = document.getElementById('select-correct');
  const inputExplanation = document.getElementById('input-explanation');

  // 4. Initial Rendering
  renderQuestionsList();

  // 5. Render Questions Table & Statistics
  function renderQuestionsList() {
    const questions = getQuestions();
    statTotal.textContent = questions.length;
    tbody.innerHTML = '';

    if (questions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center">No questions in the database. Add one to get started!</td></tr>`;
      return;
    }

    questions.forEach((q, idx) => {
      const row = document.createElement('tr');
      const displayIndex = idx + 1;

      // Generate HTML for options list with correct answer highlighted
      let optionsHtml = '';
      const letters = ['A', 'B', 'C', 'D'];
      q.options.forEach((opt, oIdx) => {
        const isCorrect = q.correctAnswer === oIdx;
        const correctClass = isCorrect ? 'correct-indicator' : '';
        const checkIcon = isCorrect ? ' (Correct) ✓' : '';
        optionsHtml += `
          <div class="mini-opt ${correctClass}">
            <strong>${letters[oIdx]}:</strong> ${escapeHTML(opt)}${checkIcon}
          </div>
        `;
      });

      const correctLetter = letters[q.correctAnswer] || '-';

      row.innerHTML = `
        <td><strong>#${displayIndex}</strong></td>
        <td>
          <div style="font-weight: 600; font-size: 1rem; color: var(--text-primary);">${escapeHTML(q.questionText)}</div>
          <div class="admin-mini-options">${optionsHtml}</div>
          ${q.explanation ? `<div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Explanation: ${escapeHTML(q.explanation)}</div>` : ''}
        </td>
        <td style="text-align: center;">
          <span class="user-badge" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); color: var(--success);">Option ${correctLetter}</span>
        </td>
        <td style="text-align: right;">
          <div class="admin-actions">
            <button class="btn btn-secondary btn-sm btn-edit" data-id="${q.id}">Edit</button>
            <button class="btn btn-danger btn-sm btn-delete" data-id="${q.id}">Delete</button>
          </div>
        </td>
      `;

      tbody.appendChild(row);
    });

    // Wire up Edit & Delete Actions dynamically
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.target.getAttribute('data-id');
        loadQuestionIntoForm(qId);
      });
    });

    tbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.target.getAttribute('data-id');
        deleteQuestionAction(qId);
      });
    });
  }

  // 6. Delete Action
  function deleteQuestionAction(id) {
    if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      let questions = getQuestions();
      const originalCount = questions.length;
      questions = questions.filter(q => q.id !== id);

      if (questions.length < originalCount) {
        saveQuestions(questions);
        showToast('Question deleted successfully.', 'success');
        renderQuestionsList();
      } else {
        showToast('Question not found.', 'error');
      }
    }
  }

  // 7. Load into Edit Form
  function loadQuestionIntoForm(id) {
    const questions = getQuestions();
    const q = questions.find(item => item.id === id);
    if (!q) {
      showToast('Error loading question details.', 'error');
      return;
    }

    // Set form fields
    inputId.value = q.id;
    inputText.value = q.questionText;
    inputA.value = q.options[0] || '';
    inputB.value = q.options[1] || '';
    inputC.value = q.options[2] || '';
    inputD.value = q.options[3] || '';
    selectCorrect.value = q.correctAnswer;
    inputExplanation.value = q.explanation || '';

    // Switch title
    modalTitle.textContent = 'Edit Question';
    modalSubtitle.textContent = `Modifying question ID: ${q.id}`;

    // Open Modal
    modal.classList.add('active');
  }

  // 8. Open Modal for ADD Mode
  btnAdd.addEventListener('click', () => {
    modalForm.reset();
    inputId.value = '';
    
    modalTitle.textContent = 'Add New Question';
    modalSubtitle.textContent = 'Create a custom DSA question with 4 choices.';
    
    modal.classList.add('active');
  });

  // 9. Close Modal Handlers
  btnCancelModal.addEventListener('click', () => {
    closeQuestionModal();
  });

  function closeQuestionModal() {
    modal.classList.remove('active');
    modalForm.reset();
    inputId.value = '';
  }

  // 10. Form Submit Add/Update Logic
  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const idVal = inputId.value;
    const textVal = inputText.value.trim();
    const optA = inputA.value.trim();
    const optB = inputB.value.trim();
    const optC = inputC.value.trim();
    const optD = inputD.value.trim();
    const correctVal = parseInt(selectCorrect.value, 10);
    const explVal = inputExplanation.value.trim();

    const newQuestion = {
      id: idVal ? idVal : 'q_' + Date.now(),
      questionText: textVal,
      options: [optA, optB, optC, optD],
      correctAnswer: correctVal,
      explanation: explVal
    };

    let questions = getQuestions();

    if (idVal) {
      // Edit Mode
      const index = questions.findIndex(item => item.id === idVal);
      if (index !== -1) {
        questions[index] = newQuestion;
        showToast('Question updated successfully.', 'success');
      } else {
        showToast('Error editing question: target ID mismatch.', 'error');
        return;
      }
    } else {
      // Add Mode
      questions.push(newQuestion);
      showToast('New question added to pool.', 'success');
    }

    saveQuestions(questions);
    closeQuestionModal();
    renderQuestionsList();
  });

  // 11. Database Reset Action
  btnReset.addEventListener('click', () => {
    const confirmation = confirm(
      '⚠️ WARNING: Resetting the question database will erase all custom questions ' +
      'and restore the original 30 seed DSA questions. Do you want to proceed?'
    );
    if (confirmation) {
      saveQuestions(seedQuestions);
      showToast('Database reset successfully. 30 seed questions loaded.', 'success');
      renderQuestionsList();
    }
  });

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
