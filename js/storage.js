/**
 * TermiType - LocalStorage & Persistence Manager
 * Manages user score history, custom lessons, and app preferences.
 */

const STORAGE_KEYS = {
    HISTORY: 'termi_type_history_v1',
    CUSTOM_LESSONS: 'termi_type_custom_lessons_v1',
    SETTINGS: 'termi_type_settings_v1'
};

class StorageManager {
    // Get session history
    static getHistory() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    // Save completed session record
    static saveSessionRecord(record) {
        const history = this.getHistory();
        const newRecord = {
            id: 'rec_' + Date.now(),
            timestamp: new Date().toISOString(),
            lessonId: record.lessonId,
            lessonTitle: record.lessonTitle,
            category: record.category,
            wpm: record.wpm,
            cpm: record.cpm,
            accuracy: record.accuracy,
            duration: record.duration,
            mistakes: record.mistakes
        };
        history.unshift(newRecord);
        // Keep last 50 records
        if (history.length > 50) history.pop();
        
        try {
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
        } catch (e) {}
        return newRecord;
    }

    // Get user custom lessons
    static getCustomLessons() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    // Save new custom lesson
    static saveCustomLesson(lesson) {
        const customLessons = this.getCustomLessons();
        const newLesson = {
            id: 'cust_' + Date.now(),
            category: 'custom',
            difficulty: 'Custom',
            title: lesson.title || 'Custom Script Practice',
            description: lesson.description || 'Latihan sintaks kustom pengguna',
            code: lesson.code
        };
        customLessons.unshift(newLesson);
        try {
            localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(customLessons));
        } catch (e) {}
        return newLesson;
    }

    // Delete custom lesson
    static deleteCustomLesson(id) {
        let customLessons = this.getCustomLessons();
        customLessons = customLessons.filter(l => l.id !== id);
        try {
            localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(customLessons));
        } catch (e) {}
    }

    // Get app settings
    static getSettings() {
        const defaults = {
            soundEnabled: true,
            fontSize: 'text-xl',
            selectedCategory: 'all'
        };
        try {
            const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            return data ? { ...defaults, ...JSON.parse(data) } : defaults;
        } catch (e) {
            return defaults;
        }
    }

    // Save settings
    static saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (e) {}
    }
}
