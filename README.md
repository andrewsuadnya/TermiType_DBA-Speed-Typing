# TermiType - DBA Speed Typing & Muscle Memory Trainer

**TermiType** is an interactive web-based typing speed trainer specifically designed for Junior DBAs and Linux System Administrators. It helps build finger muscle memory for typing Oracle DB syntax, PL/SQL, RMAN commands, and Linux CLI operations in a terminal environment without GUI dependency.

![TermiType Preview](https://img.shields.io/badge/Status-Ready_MVP-emerald) ![Tech](https://img.shields.io/badge/Stack-HTML5%20%7C%20TailwindCSS%20%7C%20VanillaJS-cyan)

---

## 🚀 Key Features

1. **25+ Real-World DBA Syntax Exercises**:
   - **Linux Basic for DBA**: Process monitoring (`ps -ef | grep pmon`), log tailing (`tail -200f alert.log`), disk usage (`df -h`), memory (`free -h`), top (`top -c`), network ports (`netstat`), file search (`find`).
   - **Oracle SQL & PL/SQL**: Querying dynamic performance views (`v$session`, `v$instance`, `v$lock`), anonymous PL/SQL blocks, stored procedures, cursor loops, and exception handlers.
   - **Oracle Administration**: Logfile switching (`ALTER SYSTEM SWITCH LOGFILE`), tablespace creation (`CREATE TABLESPACE`), user & privilege grants, `SHUTDOWN IMMEDIATE`, and dynamic SGA/PGA memory tuning.
   - **RMAN & Backup**: Recovery Manager CLI (`RMAN TARGET /`), archivelog backups, backup validation, crosschecks (`CROSSCHECK BACKUP`), obsolete deletion, and restore validation.
2. **Custom Lesson Mode**: Practice your own custom SQL/CLI scripts anytime via the interactive modal.
3. **Interactive Typing Engine**:
   - Real-time visual feedback with sub-50ms latency.
   - Animated glowing neon cyan caret.
   - Color-coded character validation: **emerald green** for correct keystrokes, **crimson red** for errors.
   - Special handling for Space, Enter (`↵`), and Tab/indentation.
4. **Metrics Dashboard & DBA Rank Titles**:
   - Computes Net WPM (Words Per Minute), CPM (Characters Per Minute), Accuracy %, Elapsed Duration, and Error counts.
   - Dynamic DBA Rank Badges (*DBA Apprentice*, *Junior DBA*, *Senior DBA*, *Oracle Master DBA*).
5. **Web Audio Synthesizer**: Synthesized mechanical keyboard click sounds and error audio feedback (toggleable/mutable).
6. **LocalStorage Persistence**: Automatically saves session performance history, accuracy metrics, and custom user lessons locally in your browser.

---

## ⌨️ Keyboard Shortcuts

- **`ESC`**: Reset / Restart the current typing session.
- **`Enter`** (on Result Modal): Advance to the next lesson module.
- **`Ctrl + Shift + P`**: Open the Custom Script Creation Modal.

---

## 📂 Project File Structure

```
DBA_Oracle/
├── index.html          # Main HTML5 application template with dark terminal theme
├── styles.css          # Custom terminal CSS, neon glow effects, monospace fonts, and animations
├── js/
│   ├── lessons.js      # Database containing 25+ real-world DBA & Linux practice lessons
│   ├── audio.js        # Web Audio API sound synthesizer engine
│   ├── storage.js      # LocalStorage manager for history and custom snippets
│   ├── engine.js       # Core typing engine (validation, timing, and WPM math)
│   └── app.js          # Main UI controller & event listeners
└── README.md           # Project documentation (English)
```
