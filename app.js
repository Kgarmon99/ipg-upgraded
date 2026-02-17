/**
 * iPG Upgraded — YC Interview Simulator
 * Vanilla JS, no dependencies
 */

(function () {
  const STORAGE_KEY = 'ipg-upgraded-settings';
  const SHORTCUT_TIP_KEY = 'ipg-shortcut-tip-dismissed';
  const DEFAULT_TIMER = 15;
  const DEFAULT_COUNT = 20;

  const FOLLOW_UP_CHANCE = 0.25;

  let state = {
    queue: [],
    tips: [],
    timerDuration: DEFAULT_TIMER,
    timerId: null,
    currentTimer: 0,
    questionCount: 0,
    totalQuestions: 0,
    startTime: null,
    selectedCategories: Object.keys(QUESTION_CATEGORIES),
    strictMode: false,
  };

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  const screenSetup = $('#screenSetup');
  const screenInterview = $('#screenInterview');
  const screenEnd = $('#screenEnd');
  const categoryToggles = $('#categoryToggles');
  const questionText = $('#questionText');
  const categoryBadge = $('#categoryBadge');
  const tipText = $('#tipText');
  const timerEl = $('#timer');
  const timerWrap = $('#timerWrap');
  const pgWrap = $('#pgWrap');
  const questionProgress = $('#questionProgress');
  const progressBarFill = $('#progressBarFill');
  const progressBarLabel = $('#progressBarLabel');
  const progressBarWrap = $('#progressBarWrap');
  const hintWrap = $('#hintWrap');
  const hintToggle = $('#hintToggle');
  const hintContent = $('#hintContent');
  const sessionStats = $('#sessionStats');
  const modalSettings = $('#modalSettings');
  const bodyEl = document.getElementById('bodyEl');
  const countdownOverlay = $('#countdownOverlay');
  const countdownNumber = $('#countdownNumber');
  const followUpCard = $('#followUpCard');
  const followUpText = $('#followUpText');

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.timerDuration != null) $('#timerDuration').value = saved.timerDuration;
        if (saved.questionCount != null) $('#questionCount').value = saved.questionCount;
        if (Array.isArray(saved.selectedCategories) && saved.selectedCategories.length)
          state.selectedCategories = saved.selectedCategories;
        if (saved.strictMode != null) {
          state.strictMode = !!saved.strictMode;
          const cb = $('#strictMode');
          if (cb) cb.checked = state.strictMode;
        }
      }
    } catch (_) {}
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timerDuration: $('#timerDuration').value,
        questionCount: $('#questionCount').value,
        selectedCategories: state.selectedCategories,
        strictMode: state.strictMode,
      }));
    } catch (_) {}
  }

  function getSelectedCategoriesFromUI() {
    const checked = $$('input[name="category"]:checked').map((el) => el.value);
    return checked.length ? checked : Object.keys(QUESTION_CATEGORIES);
  }

  function buildCategoryToggles() {
    categoryToggles.innerHTML = '';
    for (const [key, meta] of Object.entries(QUESTION_CATEGORIES)) {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'category';
      input.value = key;
      input.checked = state.selectedCategories.includes(key);
      const span = document.createElement('span');
      span.textContent = `${meta.icon} ${meta.label}`;
      label.appendChild(input);
      label.appendChild(span);
      categoryToggles.appendChild(label);
    }
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function updateProgressBar() {
    const total = state.totalQuestions || 1;
    const current = state.questionCount;
    const pct = Math.round((current / total) * 100);
    progressBarFill.style.width = pct + '%';
    progressBarLabel.textContent = `${current}/${total}`;
    if (current > 0) {
      progressBarFill.classList.remove('advance');
      progressBarFill.offsetHeight;
      progressBarFill.classList.add('advance');
      setTimeout(() => progressBarFill.classList.remove('advance'), 450);
    }
  }

  function startSession(initialQueue) {
    if (!initialQueue) {
      state.selectedCategories = getSelectedCategoriesFromUI();
      if (state.selectedCategories.length === 0) {
        $('#categoryError').classList.remove('hidden');
        return;
      }
      $('#categoryError').classList.add('hidden');
      const countVal = $('#questionCount').value;
      const limit = countVal === '0' ? 999 : Math.max(1, parseInt(countVal, 10) || DEFAULT_COUNT);
      const filtered = QUESTIONS.filter((q) => state.selectedCategories.includes(q.category));
      state.queue = shuffle(filtered).slice(0, limit);
      state.strictMode = !!($('#strictMode') && $('#strictMode').checked);
    } else {
      state.queue = initialQueue.map((q) => ({ ...q }));
      state.strictMode = !!($('#strictMode') && $('#strictMode').checked);
    }
    state.timerDuration = parseInt($('#timerDuration').value, 10) || 0;
    state.tips = shuffle([...TIPS]);
    state.totalQuestions = state.queue.length;
    state.questionCount = 0;
    state.startTime = Date.now();
    saveSettings();

    if (state.strictMode) bodyEl.classList.add('strict-mode');
    else bodyEl.classList.remove('strict-mode');

    screenSetup.classList.add('hidden');
    screenEnd.classList.add('hidden');
    screenInterview.classList.remove('hidden');
    $('#btnHome').classList.remove('hidden');
    followUpCard.classList.add('hidden');

    countdownOverlay.classList.remove('hidden');
    const countdownPromptEl = $('#countdownPrompt');
    if (countdownPromptEl) countdownPromptEl.textContent = 'Breathe';
    countdownNumber.textContent = '';
    countdownNumber.classList.add('hidden');
    setTimeout(() => {
      if (countdownPromptEl) countdownPromptEl.textContent = '';
      countdownNumber.classList.remove('hidden');
      let step = 0;
      const steps = ['3', '2', '1', 'Go!'];
      const interval = setInterval(() => {
        countdownNumber.textContent = steps[step];
        step++;
        if (step >= steps.length) {
          clearInterval(interval);
          countdownOverlay.classList.add('hidden');
          startInterviewContent();
        }
      }, 1000);
    }, 1500);
  }

  function startInterviewContent() {
    pgWrap.classList.add('hidden');
    timerWrap.classList.toggle('hidden', state.timerDuration === 0);
    if (state.timerDuration > 0) {
      state.currentTimer = state.timerDuration;
      timerEl.textContent = state.currentTimer + ' s';
      timerEl.classList.remove('warning', 'fail');
      startTimerTick();
    }
    updateProgressBar();
    nextQuestion();
    questionText.focus({ preventScroll: true });
    if (!localStorage.getItem(SHORTCUT_TIP_KEY)) {
      $('#shortcutTip').classList.remove('hidden');
    } else {
      $('#shortcutTip').classList.add('hidden');
    }
  }

  function startQuickPractice() {
    const q = getQuestionOfTheDay();
    startSession([q]);
  }

  function nextQuestion() {
    pgWrap.classList.add('hidden');
    if (state.queue.length === 0) {
      endSession();
      return;
    }

    const item = state.queue.shift();
    state.questionCount++;

    const cat = QUESTION_CATEGORIES[item.category];
    categoryBadge.textContent = cat ? cat.label : item.category;
    categoryBadge.classList.remove('hidden');
    questionText.textContent = item.text;
    questionText.classList.remove('question-new');
    questionText.offsetHeight;
    questionText.classList.add('question-new');
    setTimeout(() => questionText.classList.remove('question-new'), 320);
    questionProgress.textContent = `${state.questionCount}/${state.totalQuestions}`;
    updateProgressBar();

    if (item.hint) {
      hintWrap.classList.remove('hidden');
      hintContent.textContent = item.hint;
      hintContent.classList.add('hidden');
      hintToggle.setAttribute('aria-expanded', 'false');
    } else {
      hintWrap.classList.add('hidden');
    }

    // Rotate tip
    if (state.tips.length) {
      const tip = state.tips.shift();
      state.tips.push(tip);
      tipText.textContent = tip;
    }

    if (state.timerDuration > 0) {
      state.currentTimer = state.timerDuration;
      timerEl.textContent = state.currentTimer + ' s';
      timerEl.classList.remove('warning', 'fail');
      timerWrap.classList.remove('hidden');
      pgWrap.classList.add('hidden');
    }
  }

  function endSession() {
    if (state.timerId) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }
    exitFocusMode();
    $('#btnHome').classList.add('hidden');
    screenInterview.classList.add('hidden');
    screenEnd.classList.remove('hidden');

    const elapsed = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0;
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    sessionStats.innerHTML = `
      <span><strong>${state.questionCount}</strong> questions</span>
      <span><strong>${mins}m ${secs}s</strong> total</span>
    `;
  }

  function startTimerTick() {
    if (state.timerId) clearTimeout(state.timerId);
    if (state.timerDuration === 0 || state.currentTimer <= 0) return;

    state.timerId = setTimeout(() => {
      state.currentTimer--;
      timerEl.textContent = state.currentTimer + ' s';
      timerEl.classList.remove('warning', 'fail');
      if (state.currentTimer < 10) timerEl.classList.add('warning');
      if (state.currentTimer < 5) {
        timerEl.classList.remove('warning');
        timerEl.classList.add('fail');
      }
      if (state.currentTimer <= 0) {
        timerWrap.classList.add('hidden');
        pgWrap.classList.remove('hidden');
        return;
      }
      startTimerTick();
    }, 1000);
  }

  function restartTimer() {
    if (state.strictMode || state.timerDuration === 0) return;
    pgWrap.classList.add('hidden');
    state.currentTimer = state.timerDuration;
    timerEl.textContent = state.currentTimer + ' s';
    timerEl.classList.remove('warning', 'fail', 'hidden');
    timerWrap.classList.remove('hidden');
    startTimerTick();
  }

  function goToSetup() {
    if (state.timerId) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }
    bodyEl.classList.remove('strict-mode');
    exitFocusMode();
    followUpCard.classList.add('hidden');
    $('#btnHome').classList.add('hidden');
    screenInterview.classList.add('hidden');
    screenEnd.classList.add('hidden');
    screenSetup.classList.remove('hidden');
    buildCategoryToggles();
    renderQuestionOfTheDay();
  }

  function toggleFocusMode() {
    const isFocus = bodyEl.getAttribute('data-focus-mode') === 'true';
    if (isFocus) {
      exitFocusMode();
    } else {
      bodyEl.setAttribute('data-focus-mode', 'true');
      $('#btnFocus').textContent = 'Exit focus';
    }
  }

  function exitFocusMode() {
    bodyEl.removeAttribute('data-focus-mode');
    const btn = $('#btnFocus');
    if (btn) btn.textContent = 'Focus';
  }

  function renderQuestionOfTheDay() {
    const el = $('#qotdQuestion');
    if (!el) return;
    const q = getQuestionOfTheDay();
    el.textContent = q.text;
  }

  function toggleTheme() {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('ipg-upgraded-theme', next);
    } catch (_) {}
  }

  function initTheme() {
    try {
      const theme = localStorage.getItem('ipg-upgraded-theme');
      if (theme === 'light' || theme === 'dark') document.documentElement.setAttribute('data-theme', theme);
    } catch (_) {}
  }

  function tryNextQuestion() {
    if (followUpCard.classList.contains('hidden') === false) {
      return;
    }
    if (Math.random() < FOLLOW_UP_CHANCE && state.queue.length > 0) {
      followUpText.textContent = FOLLOW_UP_LINES[Math.floor(Math.random() * FOLLOW_UP_LINES.length)];
      followUpCard.classList.remove('hidden');
    } else {
      nextQuestion();
    }
  }

  function dismissFollowUpAndNext() {
    followUpCard.classList.add('hidden');
    nextQuestion();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      if (bodyEl.getAttribute('data-focus-mode') === 'true') {
        exitFocusMode();
        $('#btnFocus').textContent = 'Focus';
      } else if (!screenSetup.classList.contains('hidden')) {
        return;
      } else {
        goToSetup();
      }
      e.preventDefault();
      return;
    }
    if (!screenInterview.classList.contains('hidden')) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (followUpCard.classList.contains('hidden') === false) {
          dismissFollowUpAndNext();
        } else {
          tryNextQuestion();
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        if (!state.strictMode) restartTimer();
      }
    }
  }

  // Init
  loadSettings();
  initTheme();
  buildCategoryToggles();
  renderQuestionOfTheDay();
  if (state.strictMode) bodyEl.classList.add('strict-mode');
  else bodyEl.classList.remove('strict-mode');

  $('#btnStart').addEventListener('click', () => startSession());
  $('#btnAgain').addEventListener('click', goToSetup);
  $('#btnHome').addEventListener('click', goToSetup);
  const btnQuick = $('#btnQuickPractice');
  if (btnQuick) btnQuick.addEventListener('click', startQuickPractice);
  $('#btnFocus').addEventListener('click', toggleFocusMode);
  $('#btnFocusExit').addEventListener('click', exitFocusMode);
  $('#btnRestartTimer').addEventListener('click', restartTimer);
  $('#btnResetTimer').addEventListener('click', restartTimer);
  $('#btnNextQuestion').addEventListener('click', tryNextQuestion);
  $('#btnFollowUpContinue').addEventListener('click', dismissFollowUpAndNext);
  $('#shortcutTipDismiss').addEventListener('click', () => {
    try { localStorage.setItem(SHORTCUT_TIP_KEY, '1'); } catch (_) {}
    $('#shortcutTip').classList.add('hidden');
  });
  categoryToggles.addEventListener('change', () => $('#categoryError').classList.add('hidden'));
  $('#btnSettings').addEventListener('click', () => modalSettings.showModal());
  $('#btnCloseSettings').addEventListener('click', () => modalSettings.close());
  $('#btnTheme').addEventListener('click', toggleTheme);
  document.addEventListener('keydown', onKeyDown);

  hintToggle.addEventListener('click', () => {
    const expanded = hintToggle.getAttribute('aria-expanded') === 'true';
    hintToggle.setAttribute('aria-expanded', !expanded);
    hintContent.classList.toggle('hidden', expanded);
  });

  modalSettings.addEventListener('click', (e) => {
    if (e.target === modalSettings) modalSettings.close();
  });
})();
