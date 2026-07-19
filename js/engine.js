/**
 * TermiType - Typing Engine Core
 * Handles input listening, real-time metrics calculation, caret rendering, and validation.
 */

class TypingEngine {
    constructor(callbacks = {}) {
        this.currentLesson = null;
        this.typedText = "";
        this.startTime = null;
        this.timerInterval = null;
        this.totalKeyPresses = 0;
        this.mistakesCount = 0;
        this.isFinished = false;

        // Callbacks
        this.onRender = callbacks.onRender || (() => {});
        this.onStatsUpdate = callbacks.onStatsUpdate || (() => {});
        this.onFinish = callbacks.onFinish || (() => {});
        this.onCorrectKey = callbacks.onCorrectKey || (() => {});
        this.onErrorKey = callbacks.onErrorKey || (() => {});
    }

    setLesson(lesson) {
        this.currentLesson = lesson;
        this.reset();
    }

    reset() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.typedText = "";
        this.startTime = null;
        this.totalKeyPresses = 0;
        this.mistakesCount = 0;
        this.isFinished = false;
        this.onRender();
        this.onStatsUpdate(this.getStats());
    }

    handleInput(inputVal) {
        if (this.isFinished || !this.currentLesson) return;

        const targetCode = this.currentLesson.code;
        const prevLength = this.typedText.length;
        const newLength = inputVal.length;

        // Check if character was added
        if (newLength > prevLength) {
            this.totalKeyPresses++;
            const charIndex = prevLength;
            const typedChar = inputVal[charIndex];
            const expectedChar = targetCode[charIndex];

            if (typedChar === expectedChar) {
                this.onCorrectKey();
            } else {
                this.mistakesCount++;
                this.onErrorKey();
            }
        }

        this.typedText = inputVal;

        // Start timer on first keystroke
        if (!this.startTime && this.typedText.length > 0) {
            this.startTime = Date.now();
            this.timerInterval = setInterval(() => {
                this.onStatsUpdate(this.getStats());
            }, 300);
        }

        this.onRender();
        this.onStatsUpdate(this.getStats());

        // Check completion condition
        if (this.typedText.length >= targetCode.length) {
            this.finish();
        }
    }

    getStats() {
        if (!this.startTime || this.typedText.length === 0) {
            return {
                wpm: 0,
                cpm: 0,
                accuracy: 100,
                duration: 0,
                progress: 0,
                mistakes: this.mistakesCount
            };
        }

        const durationInSeconds = Math.max((Date.now() - this.startTime) / 1000, 0.5);
        const durationInMinutes = durationInSeconds / 60;
        const targetCode = this.currentLesson ? this.currentLesson.code : "";

        // Count correct characters in typed string
        let correctChars = 0;
        for (let i = 0; i < this.typedText.length; i++) {
            if (this.typedText[i] === targetCode[i]) {
                correctChars++;
            }
        }

        // Standard Net WPM formula: (Correct Characters / 5) / Time in Minutes
        const wpm = Math.max(0, Math.round((correctChars / 5) / durationInMinutes));
        const cpm = Math.max(0, Math.round(correctChars / durationInMinutes));
        const accuracy = this.totalKeyPresses > 0 
            ? Math.min(100, Math.max(0, Math.round((correctChars / this.totalKeyPresses) * 100))) 
            : 100;
        const progress = targetCode.length > 0 
            ? Math.min(100, Math.round((this.typedText.length / targetCode.length) * 100)) 
            : 0;

        return {
            wpm,
            cpm,
            accuracy,
            duration: Math.round(durationInSeconds),
            progress,
            mistakes: this.mistakesCount
        };
    }

    finish() {
        if (this.isFinished) return;
        this.isFinished = true;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const finalStats = this.getStats();
        // Calculate DBA Speed Rank Title
        let rankTitle = "Novice DBA";
        let rankBadgeClass = "bg-gray-700 text-gray-300";

        if (finalStats.wpm >= 65 && finalStats.accuracy >= 95) {
            rankTitle = "Oracle Master DBA 🏆";
            rankBadgeClass = "bg-purple-900/80 text-purple-300 border border-purple-500";
        } else if (finalStats.wpm >= 45 && finalStats.accuracy >= 90) {
            rankTitle = "Senior DBA 🚀";
            rankBadgeClass = "bg-cyan-900/80 text-cyan-300 border border-cyan-500";
        } else if (finalStats.wpm >= 30 && finalStats.accuracy >= 85) {
            rankTitle = "Junior DBA ⚡";
            rankBadgeClass = "bg-emerald-900/80 text-emerald-300 border border-emerald-500";
        } else {
            rankTitle = "DBA Apprentice 📖";
            rankBadgeClass = "bg-amber-900/80 text-amber-300 border border-amber-500";
        }

        finalStats.rankTitle = rankTitle;
        finalStats.rankBadgeClass = rankBadgeClass;

        this.onFinish(finalStats);
    }
}
