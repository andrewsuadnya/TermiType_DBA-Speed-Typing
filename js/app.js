/**
 * TermiType - Main Application Controller
 * Connects TypingEngine, SoundEngine, StorageManager, and UI elements.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Application State
    let allLessons = [...DEFAULT_LESSONS, ...StorageManager.getCustomLessons()];
    let currentCategory = 'all';
    let currentLesson = allLessons[0];

    // UI Elements
    const categoryContainer = document.getElementById('category-container');
    const lessonSelect = document.getElementById('lesson-select');
    const lessonTitleEl = document.getElementById('lesson-title');
    const lessonDescEl = document.getElementById('lesson-desc');
    const lessonDiffEl = document.getElementById('lesson-diff');

    const statWpmEl = document.getElementById('stat-wpm');
    const statCpmEl = document.getElementById('stat-cpm');
    const statAccEl = document.getElementById('stat-acc');
    const statTimeEl = document.getElementById('stat-time');
    const statMistakesEl = document.getElementById('stat-mistakes');
    const progressBarEl = document.getElementById('progress-bar');

    const typingBoxContainer = document.getElementById('typing-box-container');
    const hiddenInput = document.getElementById('hidden-input');
    const codeViewer = document.getElementById('code-viewer');
    const lineNumbersEl = document.getElementById('line-numbers');
    const liveKeyDisplay = document.getElementById('live-key-display');

    // Modals & Drawers
    const resultModal = document.getElementById('result-modal');
    const btnModalRestart = document.getElementById('btn-modal-restart');
    const btnModalNext = document.getElementById('btn-modal-next');

    const btnCustomLesson = document.getElementById('btn-custom-lesson');
    const customModal = document.getElementById('custom-modal');
    const customTitleInput = document.getElementById('custom-title-input');
    const customCodeInput = document.getElementById('custom-code-input');
    const btnSaveCustom = document.getElementById('btn-save-custom');
    const btnCloseCustom = document.getElementById('btn-close-custom');

    const btnHistoryDrawer = document.getElementById('btn-history-drawer');
    const historyDrawer = document.getElementById('history-drawer');
    const btnCloseHistory = document.getElementById('btn-close-history');
    const historyList = document.getElementById('history-list');
    const btnClearHistory = document.getElementById('btn-clear-history');

    const btnToggleSound = document.getElementById('btn-toggle-sound');
    const soundIcon = document.getElementById('sound-icon');
    const btnFontSize = document.getElementById('btn-font-size');

    let currentFontSizeIndex = 1; // 0: text-lg, 1: text-xl, 2: text-2xl
    const fontSizes = ['text-lg', 'text-xl', 'text-2xl'];

    // Initialize Typing Engine
    const engine = new TypingEngine({
        onRender: renderCodeView,
        onStatsUpdate: updateStatsDisplay,
        onFinish: handleSessionFinish,
        onCorrectKey: () => soundEngine.playKeyClick(),
        onErrorKey: () => soundEngine.playErrorSound()
    });

    // --- INITIALIZATION ---
    function init() {
        renderCategoryBadges();
        populateLessonSelect();
        loadLesson(allLessons[0].id);

        // Event Listeners
        categoryContainer.addEventListener('click', handleCategoryClick);
        lessonSelect.addEventListener('change', (e) => loadLesson(e.target.value));

        // Hidden Input Events
        hiddenInput.addEventListener('input', (e) => {
            engine.handleInput(e.target.value);
        });

        typingBoxContainer.addEventListener('click', () => {
            hiddenInput.focus();
        });

        // Global Keydown Handler
        document.addEventListener('keydown', handleGlobalKeydown);

        // Modal Controls
        btnModalRestart.addEventListener('click', () => {
            resultModal.classList.add('hidden');
            resetSession();
        });

        btnModalNext.addEventListener('click', loadNextLesson);

        // Custom Lesson Modal
        btnCustomLesson.addEventListener('click', () => {
            customModal.classList.remove('hidden');
            customTitleInput.focus();
        });

        btnCloseCustom.addEventListener('click', () => {
            customModal.classList.add('hidden');
        });

        btnSaveCustom.addEventListener('click', handleSaveCustomLesson);

        // History Drawer
        btnHistoryDrawer.addEventListener('click', () => {
            renderHistoryList();
            historyDrawer.classList.remove('translate-x-full');
        });

        btnCloseHistory.addEventListener('click', () => {
            historyDrawer.classList.add('translate-x-full');
        });

        btnClearHistory.addEventListener('click', () => {
            localStorage.removeItem('termi_type_history_v1');
            renderHistoryList();
        });

        // Sound Toggle
        btnToggleSound.addEventListener('click', () => {
            const isMuted = soundEngine.toggleMute();
            soundIcon.textContent = isMuted ? '🔇' : '🔊';
            btnToggleSound.classList.toggle('text-red-400', isMuted);
            btnToggleSound.classList.toggle('text-cyan-400', !isMuted);
        });

        // Font Size Toggle
        btnFontSize.addEventListener('click', () => {
            currentFontSizeIndex = (currentFontSizeIndex + 1) % fontSizes.length;
            codeViewer.className = `leading-relaxed tracking-wide font-mono-terminal select-none pointer-events-none ${fontSizes[currentFontSizeIndex]}`;
        });

        // Ensure input focus
        setTimeout(() => hiddenInput.focus(), 100);
    }

    // --- RENDER FUNCTIONS ---

    function renderCategoryBadges() {
        categoryContainer.innerHTML = LESSON_CATEGORIES.map(cat => `
            <button data-cat="${cat.id}" class="cat-badge px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                currentCategory === cat.id 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20' 
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:border-slate-600'
            }">
                ${cat.name}
            </button>
        `).join('');
    }

    function populateLessonSelect() {
        const filtered = currentCategory === 'all' 
            ? allLessons 
            : allLessons.filter(l => l.category === currentCategory);

        if (filtered.length === 0) {
            lessonSelect.innerHTML = '<option value="">(Tidak ada latihan)</option>';
            return;
        }

        lessonSelect.innerHTML = filtered.map(l => `
            <option value="${l.id}">[${l.difficulty}] ${l.title}</option>
        `).join('');
    }

    function loadLesson(lessonId) {
        const found = allLessons.find(l => l.id === lessonId);
        if (!found) return;

        currentLesson = found;
        lessonSelect.value = currentLesson.id;
        lessonTitleEl.textContent = currentLesson.title;
        lessonDescEl.textContent = currentLesson.description;

        // Difficulty tag color
        let diffColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800';
        if (currentLesson.difficulty === 'Medium') diffColor = 'text-amber-400 bg-amber-950/40 border-amber-800';
        if (currentLesson.difficulty === 'Hard') diffColor = 'text-red-400 bg-red-950/40 border-red-800';
        
        lessonDiffEl.className = `px-2 py-0.5 rounded text-xs border font-mono ${diffColor}`;
        lessonDiffEl.textContent = currentLesson.difficulty;

        // Reset session and clear textarea DOM value
        engine.setLesson(currentLesson);
        resetSession();
    }

    function resetSession() {
        hiddenInput.value = "";
        engine.reset();
        renderLineNumbers();
        setTimeout(() => hiddenInput.focus(), 50);
    }

    function renderLineNumbers() {
        if (!currentLesson) return;
        const linesCount = currentLesson.code.split('\n').length;
        lineNumbersEl.innerHTML = Array.from({ length: linesCount }, (_, i) => 
            `<div class="text-slate-600 text-sm leading-relaxed font-mono select-none">${i + 1}</div>`
        ).join('');
    }

    function renderCodeView() {
        if (!currentLesson) return;
        const targetCode = currentLesson.code;
        const typedText = engine.typedText;
        const isFinished = engine.isFinished;
        let htmlOutput = "";

        for (let i = 0; i < targetCode.length; i++) {
            const char = targetCode[i];
            let displayChar = char === '\n' ? '↵\n' : char;

            let charClass = "char-untyped";
            let caretClass = "";

            // Active caret position
            if (i === typedText.length && !isFinished) {
                caretClass = "caret-active";
            }

            // Checked typed chars
            if (i < typedText.length) {
                if (typedText[i] === targetCode[i]) {
                    charClass = "char-correct";
                } else {
                    charClass = "char-incorrect";
                }
            }

            htmlOutput += `<span class="${charClass} ${caretClass}">${escapeHtml(displayChar)}</span>`;
        }

        codeViewer.innerHTML = htmlOutput;
    }

    function updateStatsDisplay(stats) {
        statWpmEl.textContent = stats.wpm;
        statCpmEl.textContent = stats.cpm;
        statAccEl.textContent = `${stats.accuracy}%`;
        statTimeEl.textContent = `${stats.duration}s`;
        statMistakesEl.textContent = stats.mistakes;
        progressBarEl.style.width = `${stats.progress}%`;
    }

    function handleSessionFinish(stats) {
        soundEngine.playSuccessJingle();
        
        // Save record to storage
        StorageManager.saveSessionRecord({
            lessonId: currentLesson.id,
            lessonTitle: currentLesson.title,
            category: currentLesson.category,
            wpm: stats.wpm,
            cpm: stats.cpm,
            accuracy: stats.accuracy,
            duration: stats.duration,
            mistakes: stats.mistakes
        });

        // Fill Modal Data
        document.getElementById('modal-rank-badge').textContent = stats.rankTitle;
        document.getElementById('modal-rank-badge').className = `px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${stats.rankBadgeClass}`;
        
        document.getElementById('modal-lesson-title').textContent = currentLesson.title;
        document.getElementById('modal-wpm').textContent = `${stats.wpm} WPM`;
        document.getElementById('modal-cpm').textContent = `${stats.cpm} CPM`;
        document.getElementById('modal-acc').textContent = `${stats.accuracy}%`;
        document.getElementById('modal-time').textContent = `${stats.duration} detik`;
        document.getElementById('modal-mistakes').textContent = stats.mistakes;

        resultModal.classList.remove('hidden');
    }

    function loadNextLesson() {
        resultModal.classList.add('hidden');
        const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
        const nextIndex = (currentIndex + 1) % allLessons.length;
        loadLesson(allLessons[nextIndex].id);
    }

    // --- EVENT HANDLERS ---

    function handleCategoryClick(e) {
        const btn = e.target.closest('.cat-badge');
        if (!btn) return;

        currentCategory = btn.dataset.cat;
        renderCategoryBadges();
        populateLessonSelect();

        const filtered = currentCategory === 'all' 
            ? allLessons 
            : allLessons.filter(l => l.category === currentCategory);
        
        if (filtered.length > 0) {
            loadLesson(filtered[0].id);
        }
    }

    function handleGlobalKeydown(e) {
        // Show live key press in terminal status bar
        if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Tab') {
            liveKeyDisplay.textContent = e.key === ' ' ? 'SPACE' : e.key.toUpperCase();
            liveKeyDisplay.classList.add('text-cyan-400');
            setTimeout(() => liveKeyDisplay.classList.remove('text-cyan-400'), 200);
        }

        // Intercept Tab key during typing so focus isn't lost
        if (e.key === 'Tab' && resultModal.classList.contains('hidden') && customModal.classList.contains('hidden')) {
            e.preventDefault();
            hiddenInput.focus();
            const targetCode = currentLesson ? currentLesson.code : '';
            const currentIndex = hiddenInput.value.length;
            if (currentIndex < targetCode.length) {
                if (targetCode[currentIndex] === '\t') {
                    hiddenInput.value += '\t';
                } else if (targetCode[currentIndex] === ' ') {
                    let spaces = '';
                    let idx = currentIndex;
                    while (idx < targetCode.length && targetCode[idx] === ' ' && spaces.length < 2) {
                        spaces += ' ';
                        idx++;
                    }
                    hiddenInput.value += spaces || '  ';
                } else {
                    hiddenInput.value += '  ';
                }
                engine.handleInput(hiddenInput.value);
            }
            return;
        }

        // Shortcut: ESC to restart session
        if (e.key === 'Escape') {
            e.preventDefault();
            resultModal.classList.add('hidden');
            customModal.classList.add('hidden');
            historyDrawer.classList.add('translate-x-full');
            resetSession();
        }

        // Shortcut: Enter on result modal to repeat/next
        if (e.key === 'Enter' && !resultModal.classList.contains('hidden')) {
            e.preventDefault();
            loadNextLesson();
        }

        // Shortcut: Ctrl + Shift + P to open Custom Snippet Modal
        if (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
            e.preventDefault();
            customModal.classList.remove('hidden');
            customTitleInput.focus();
        }
    }

    function handleSaveCustomLesson() {
        const title = customTitleInput.value.trim();
        const code = customCodeInput.value.trim();

        if (!code) {
            alert('Silakan masukkan kode/sintaks yang ingin dilatih!');
            return;
        }

        const newLesson = StorageManager.saveCustomLesson({
            title: title || 'Custom DBA Practice',
            code: code
        });

        allLessons = [...DEFAULT_LESSONS, ...StorageManager.getCustomLessons()];
        currentCategory = 'custom';
        renderCategoryBadges();
        populateLessonSelect();
        loadLesson(newLesson.id);

        customTitleInput.value = '';
        customCodeInput.value = '';
        customModal.classList.add('hidden');
    }

    function renderHistoryList() {
        const history = StorageManager.getHistory();
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="text-center py-12 text-slate-500 text-sm">
                    Belum ada riwayat sesi latihan. Selesaikan satu sesi untuk melihat statistik kamu!
                </div>
            `;
            return;
        }

        historyList.innerHTML = history.map(item => `
            <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex justify-between items-center hover:border-cyan-500/40 transition-colors">
                <div>
                    <div class="font-semibold text-slate-200 text-sm mb-1">${escapeHtml(item.lessonTitle)}</div>
                    <div class="text-xs text-slate-500 flex space-x-3">
                        <span>⏱️ ${item.duration}s</span>
                        <span>❌ ${item.mistakes} error</span>
                        <span>📅 ${new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold text-cyan-400 font-mono">${item.wpm} WPM</div>
                    <div class="text-xs text-amber-400 font-medium">${item.accuracy}% Acc</div>
                </div>
            </div>
        `).join('');
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Launch App
    init();
});
