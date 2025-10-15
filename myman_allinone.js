// ==UserScript==
// @name         MyManager All-in-One Suite (Ελληνικά)
// @namespace    http://tampermonkey.net/
// @updateURL    https://raw.githubusercontent.com/PanosGK/myman-allinone/main/myman_allinone.js
// @downloadURL  https://raw.githubusercontent.com/PanosGK/myman-allinone/main/myman_allinone.js
// @version      115
// @description  An all-in-one suite for mymanager.gr, combining Advanced Search, Auto-Refresh, Quick Navigation, a Dashboard, and more.
// @description  Συνδυάζει λειτουργίες Αναζήτησης, Αυτόματης Ανανέωσης και Γρήγορης Πλοήγησης για το mymanager.gr.
// @author       Gkorogias - Gemini AI - Chat GPT
// @match        *://thefixers.mymanager.gr/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      thefixers.mymanager.gr
// ==/UserScript==

(function() {
    'use strict';

    // ===================================================================
    // === LOGIN PAGE REIMAGINED
    // ===================================================================

    const LOGIN_USERS_KEY = 'tm_login_users';

    /**
     * Initializes the custom minimal login experience.
     */
    function initLoginPage() {
        // 1. Hide the original, cluttered login page content
        const originalForm = document.querySelector('.rnr-page');
        if (originalForm) {
            originalForm.style.display = 'none';
        }

        // Load users from GM_storage
        const USER_CREDENTIALS = JSON.parse(GM_getValue(LOGIN_USERS_KEY, '{}'));


        // 2. Inject new, minimal HTML and styles
        GM_addStyle(`
            .minimal-login-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 70vh;
                text-align: center;
                color: #fff;
                text-shadow: 0 1px 3px rgba(0,0,0,0.5);
            }
            .minimal-login-container h1 {
                font-size: 2.5rem;
                font-weight: 300;
                margin-bottom: 1rem;
            }
            #minimal-username-input {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.4);
                border-radius: 8px;
                padding: 15px 25px;
                font-size: 1.5rem;
                color: #fff;
                text-align: center;
                width: 100%;
                max-width: 400px;
                outline: none;
                transition: all 0.3s ease;
            }
            #minimal-username-input:focus {
                border-color: #00aaff;
                box-shadow: 0 0 15px rgba(0, 170, 255, 0.6);
            }
            /* Use mascot styles already defined in the script */
            #tm-mascot-container {
                opacity: 0;
                transform: scale(0.8);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            #tm-mascot-container.visible {
                opacity: 1;
                transform: scale(1);
            }
            /* Login Settings Panel */
            #login-settings-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0,0,0,0.3);
                color: white;
                border: 1px solid rgba(255,255,255,0.4);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 10001;
            }
            #login-settings-btn:hover {
                background: rgba(0,0,0,0.5);
                transform: rotate(90deg);
            }
            #login-settings-panel {
                position: fixed;
                top: 0;
                right: -450px; /* Start off-screen */
                width: 420px;
                height: 100%;
                background: #f8f9fa;
                box-shadow: -5px 0 15px rgba(0,0,0,0.3);
                z-index: 10000;
                transition: right 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                padding: 20px;
                color: #343a40;
                display: flex;
                flex-direction: column;
            }
            #login-settings-panel.visible {
                right: 0;
            }
            #login-settings-panel h2 {
                margin-top: 0;
                font-weight: 400;
                border-bottom: 1px solid #dee2e6;
                padding-bottom: 10px;
            }
            #login-users-list {
                flex-grow: 1;
                overflow-y: auto;
                margin-bottom: 20px;
            }
            .login-user-item {
                background: #ffffff;
                border: 1px solid #e9ecef;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s ease-in-out;
                cursor: pointer;
            }
            .login-user-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                border-color: #ced4da;
            }
            .login-user-item span { font-weight: 500; font-size: 1.1rem; color: #495057; }
            .login-user-item button {
                background: #f1f3f5;
                border: none;
                color: #868e96;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .login-user-item button:hover {
                background: #e63946;
                color: white;
            }
            #login-settings-panel input {
                width: 100%;
                padding: 12px;
                margin-bottom: 10px;
                border-radius: 4px;
                border: 1px solid #ced4da;
                background: #ffffff;
                color: #495057;
                box-sizing: border-box;
                font-size: 1rem;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            #login-settings-panel input:focus {
                outline: none;
                border-color: #80bdff;
                box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
            }
            #save-login-user-btn {
                width: 100%;
                padding: 12px;
                background: #007bff;
                border: none;
                color: white;
                font-size: 1rem;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            #save-login-user-btn:hover {
                background: #0056b3;
            }
        `);

        const minimalContainer = document.createElement('div');
        minimalContainer.className = 'minimal-login-container';
        minimalContainer.innerHTML = `
            <h1>Who are you?</h1>
            <input type="text" id="minimal-username-input" placeholder="Enter your username" autocomplete="off">
            <button id="login-settings-btn" title="Manage Users">&#9881;</button>
        `;
        // Insert our new UI before the hidden original form
        originalForm.parentNode.insertBefore(minimalContainer, originalForm);

        // 3. Add the mascot to the page (it will be hidden initially)
        initInteractiveMascot();

        initLoginSettingsPanel(USER_CREDENTIALS);

        // 4. Logic to handle username input
        const usernameInput = document.getElementById('minimal-username-input');
        usernameInput.addEventListener('input', debounce(() => {
            const username = usernameInput.value.trim().toLowerCase();
            const credentials = USER_CREDENTIALS[username];

            if (credentials) {
                // A known user is found!
                const mascotContainer = document.getElementById('tm-mascot-container');
                if (mascotContainer) {
                    mascotContainer.classList.add('visible');                   
                    setMascotState('happy', 5000);
                    showMascotBubble(credentials.mascotGreeting, 4000);
                }

                // Automatically fill the hidden form and submit after a short delay
                setTimeout(() => {
                    document.getElementById('username').value = username;
                    document.getElementById('password').value = credentials.password;
                    document.getElementById('iProfileID').value = credentials.storeId;
                    document.getElementById('form1').submit();
                }, 1500); // 1.5 second delay to see the mascot's greeting
            }
        }, 500)); // Wait 500ms after user stops typing

        usernameInput.focus();
    }

    /**
     * Initializes the settings panel for the login page.
     * @param {object} initialUsers The currently loaded user credentials.
     */
    function initLoginSettingsPanel(initialUsers) {
        const panel = document.createElement('div');
        panel.id = 'login-settings-panel';
        panel.innerHTML = `
            <h2>Manage Users</h2>
            <div id="login-users-list"></div>
            <h3>Add / Edit User</h3>
            <input type="text" id="login-username" placeholder="Username (e.g., 'alex')">
            <input type="password" id="login-password" placeholder="Password">
            <input type="text" id="login-storeid" placeholder="Store ID (e.g., '3300000')">
            <input type="text" id="login-greeting" placeholder="Mascot Greeting (Optional)">
            <button id="save-login-user-btn">Save User</button>
        `;
        document.body.appendChild(panel);

        const settingsBtn = document.getElementById('login-settings-btn');
        const usersList = document.getElementById('login-users-list');
        const saveBtn = document.getElementById('save-login-user-btn');
        const usernameInput = document.getElementById('login-username');
        const passwordInput = document.getElementById('login-password');
        const storeIdInput = document.getElementById('login-storeid');
        const greetingInput = document.getElementById('login-greeting');

        let users = { ...initialUsers };

        function renderUsers() {
            usersList.innerHTML = '';
            if (Object.keys(users).length === 0) {
                usersList.innerHTML = '<p>No users saved. Add one below!</p>';
                return;
            }
            for (const username in users) {
                const userItem = document.createElement('div');
                userItem.className = 'login-user-item';
                userItem.innerHTML = `
                    <span title="Click to edit">${username}</span>
                    <button data-username="${username}">Remove</button>
                `;
                usersList.appendChild(userItem);
            }
        }

        usersList.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') { // Remove user
                const userToRemove = e.target.dataset.username;
                if (confirm(`Are you sure you want to remove user '${userToRemove}'?`)) {
                    delete users[userToRemove];
                    GM_setValue(LOGIN_USERS_KEY, JSON.stringify(users));
                    renderUsers();
                }
            } else if (e.target.tagName === 'SPAN') { // Edit user
                const userToEdit = e.target.textContent;
                const userData = users[userToEdit];
                usernameInput.value = userToEdit;
                passwordInput.value = userData.password;
                storeIdInput.value = userData.storeId;
                greetingInput.value = userData.mascotGreeting || '';
            }
        });

        saveBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim().toLowerCase();
            const password = passwordInput.value.trim();
            const storeId = storeIdInput.value.trim();
            const greeting = greetingInput.value.trim();

            if (!username || !password || !storeId) {
                alert('Please fill in Username, Password, and Store ID.');
                return;
            }

            users[username] = {
                password: password,
                storeId: storeId,
                mascotGreeting: greeting || `Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}!`
            };

            GM_setValue(LOGIN_USERS_KEY, JSON.stringify(users));
            alert(`User '${username}' saved!`);
            renderUsers();
            // Clear form
            usernameInput.value = passwordInput.value = storeIdInput.value = greetingInput.value = '';
        });

        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the button from submitting the form
            panel.classList.toggle('visible');
        });

        renderUsers();
    }
    // ===================================================================
    // === UTILITY FUNCTIONS
    // ===================================================================

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds.
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Displays a temporary positive message in the center of the screen.
     * @param {string} message The message to display.
     */
    function showPositiveMessage(message) {
        let msgEl = document.getElementById('tm-positive-message');
        if (!msgEl) {
            msgEl = document.createElement('div');
            msgEl.id = 'tm-positive-message';
            document.body.appendChild(msgEl);
        }
        msgEl.textContent = message;
        msgEl.style.opacity = '1';
        setTimeout(() => {
            msgEl.style.opacity = '0';
            setTimeout(() => {
                if (msgEl.parentElement) msgEl.parentElement.removeChild(msgEl);
            }, 500); // Wait for fade out
        }, 2000); // Display for 2 seconds
    }

    /**
     * Creates a confetti explosion animation.
     * @param {number} [count=50] The number of confetti particles.
     */
    function triggerConfetti(count = 50) {
        const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'];
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'tm-confetti-particle';
            const x = Math.random() * 100; // vw
            const delay = Math.random() * 0.5; // seconds
            const duration = 2 + Math.random() * 2; // seconds

            particle.style.left = `${x}vw`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.transform = `scale(${0.5 + Math.random()})`;

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), duration * 1000 + delay * 1000);
        }
    }

    /**
     * Displays a temporary achievement notification.
     * @param {string} message The message to display.
     */
    function showAchievementNotification(message) {
        // New: Log this to the notification center
        if (typeof createNotification === 'function') {
            createNotification(message, '✨');
        }

        let notification = document.getElementById('tm-achievement-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'tm-achievement-notification';
            document.body.appendChild(notification);
        }
        notification.innerHTML = `✨ ${message}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
            // Remove after transition
            setTimeout(() => {
                if (notification.parentElement) notification.parentElement.removeChild(notification);
            }, 500);
        }, 4000);
    }

    /**
     * Checks for and triggers achievement notifications based on daily stats.
     * @param {string} statName The name of the stat that was just incremented.
     * @param {number} currentCount The new count for the stat.
     */
    function checkAchievements(statName, currentCount) {
        let unlockedAchievements = config.levelUpSystemEnabled ? JSON.parse(GM_getValue(STORAGE_KEYS.ACHIEVEMENTS, '{}')) : {};

        const achievements = {
            'searches': [
                { count: 1, message: 'Πρώτη Αναζήτηση! 🔍' },
                { count: 10, message: '10 Αναζητήσεις! Είσαι Master του Search! 🕵️' },
                { count: 50, message: '50 Αναζητήσεις! Δεν σου ξεφεύγει τίποτα! 🚀' },
                { count: 100, message: '100 Αναζητήσεις! Είσαι ο Βασιλιάς του Search! 👑' },
                { count: 250, message: '250 Αναζητήσεις! Το Matrix σε ζηλεύει! 💻' },
                { count: 500, message: '500 Αναζητήσεις! Είσαι μια μηχανή αναζήτησης! 🧠' },
                { count: 1000, message: '1000 Αναζητήσεις! All your base are belong to us! 👾' },
            ],
            'repairsCompleted': [
                { count: 1, message: 'Πρώτη Επισκευή Ολοκληρώθηκε! Συγχαρητήρια! 🎉' },
                { count: 10, message: '10 Επισκευές Ολοκληρώθηκαν! Είσαι ο Fixer! 🛠️' },
                { count: 50, message: '50 Επισκευές Ολοκληρώθηκαν! Ασταμάτητος! 🏆' },
                { count: 100, message: '100 Επισκευές! Είσαι Θρύλος! 🦾' },
                { count: 250, message: '250 Επισκευές! Μπορείς να φτιάξεις τα πάντα! ✨' },
                { count: 500, message: '500 Επισκευές! Ούτε ο MacGyver τέτοια στέλνεις! 📎' },
                { count: 1000, message: '1000 Επισκευές! Έχεις γίνει ένα με το κατσαβίδι! 🌀' },
            ],
            'ordersCreated': [
                { count: 1, message: 'Πρώτη Παραγγελία Καταχωρήθηκε! Ωραία δουλειά! 📝' },
                { count: 10, message: '10 Παραγγελίες Καταχωρήθηκαν! Είσαι ο Οργανωτής! 💼' },
                { count: 50, message: '50 Παραγγελίες Καταχωρήθηκαν! Απίστευτος! 🌟' },
                { count: 100, message: '100 Παραγγελίες! Είσαι ο Αυτοκράτορας της Οργάνωσης! 🏯' },
                { count: 250, message: '250 Παραγγελίες! Η τάξη είναι το δεύτερό σου όνομα! 📚' },
                { count: 500, message: '500 Παραγγελίες! Το χάος τρέμει στο πέρασμά σου! 🌌' },
                { count: 1000, message: '1000 Παραγγελίες! Έχεις φτάσει στο επίπεδο του Βιβλιοθηκονόμου! 📜' },
            ]
        };

        if (achievements[statName]) {
            achievements[statName].forEach(achievement => {
                if (currentCount === achievement.count && !unlockedAchievements[`${statName}-${achievement.count}`]) {
                    showAchievementNotification(achievement.message);
                    unlockedAchievements[`${statName}-${achievement.count}`] = true;
                    if (config.levelUpSystemEnabled) {
                        // Grant bonus XP for achievements
                        if (XP_CONFIG.achievement) {
                            grantXp(XP_CONFIG.achievement);
                        }
                        // New: Trigger Eureka animation on achievement unlock
                        if (config.interactiveMascotEnabled && typeof triggerEurekaAnimation === 'function') {
                            triggerEurekaAnimation();
                        }
                        if (config.interactiveMascotEnabled) setMascotState('happy', 5000);
                    }
                    GM_setValue(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(unlockedAchievements));
                }
            });
        }
    }

    /**
     * Checks if the current time is within the configured working hours and days.
     * @returns {boolean} True if it's currently working time, false otherwise.
     */
    function isWorkingHours() {
        const now = new Date();
        const day = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
        const hour = now.getHours();

        const isWorkingDay = config.workingDays.includes(day);
        // End hour 24 means up to 23:59:59
        const endHourCheck = config.workingHoursEnd === 24 ? 24 : config.workingHoursEnd;
        const isWorkingTime = hour >= config.workingHoursStart && hour < endHourCheck;

        return isWorkingDay && isWorkingTime;
    }

    /**
     * Cleans a raw device model name by removing prefixes, colors, and other noise.
     * @param {string} rawName The raw model name string.
     * @returns {string|null} The cleaned model name or null.
     */
    function cleanModelName(rawName) {
        if (!rawName) return null;

        let cleanedName = rawName.toUpperCase(); // Work with uppercase for consistency


        // --- Step 1: Remove known prefixes ---
        const prefixesToRemove = [
            'KINHTO ANDROID SMARTPHONE',
            'NOTEBOOK-NETBOOK ΕΜΠΟΡΙΟΥ',
            'ΣΥΣΚΕΥΗ DIGITAL ΕΜΠΟΡΙΟΥ',
            'NOTEBOOK-NETBOOK',
            'ΚΙΝΗΤΟ', // Greek K
            'KINHTO', // Latin K
            'CONSOLE',
            'SAMSUNG',
        ];

        for (const prefix of prefixesToRemove) {
            if (cleanedName.startsWith(prefix)) {
                cleanedName = cleanedName.substring(prefix.length).trim();
                break; // Stop after finding the first matching prefix
            }
        }

        // --- Step 2: Remove color and material keywords from anywhere ---
        const keywordsToRemove = [
            // Multi-word first to ensure they are matched before single words (e.g., 'NATURAL TITANIUM' before 'NATURAL')
            'NATURAL TITANIUM', 'BLUE TITANIUM', 'WHITE TITANIUM', 'BLACK TITANIUM',
            'ROSE GOLD', 'SPACE GRAY', 'MIDNIGHT GREEN', 'DEEP PURPLE', 'SIERRA BLUE', 'ALPINE GREEN',
            // Single-word
            'NATURAL', 'TITANIUM', 'BLACK', 'WHITE', 'BLUE', 'RED', 'GREEN', 'GOLD', 'SILVER',
            'PURPLE', 'YELLOW', 'ORANGE', 'PINK', 'BRONZE', 'GRAPHITE',
            // Greek Colors and other keywords
            'ΜΑΥΡΟ', 'ΑΣΠΡΟ', 'ΜΠΛΕ', 'ΚΟΚΚΙΝΟ', 'ΠΡΑΣΙΝΟ', 'ΧΡΥΣΟ', 'ΑΣΗΜΙ',
            'ΜΩΒ', 'ΚΙΤΡΙΝΟ', 'ΠΟΡΤΟΚΑΛΙ', 'ΡΟΖ', 'samsung'
        ];

        for (const keyword of keywordsToRemove) {
            // Use a regex to remove the keyword as a whole word, case-insensitive.
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            cleanedName = cleanedName.replace(regex, '');
        }

        // --- Step 3: Transliterate Greek to Latin (AFTER removing prefixes/keywords) ---
        const greekToLatinMap = {
            'Α': 'A', 'Β': 'V', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I', 'Θ': 'TH',
            'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P',
            'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'O'
        };

        // Use a single regex for efficiency
        const greekCharsRegex = new RegExp(Object.keys(greekToLatinMap).join('|'), 'g');
        cleanedName = cleanedName.replace(greekCharsRegex, (matched) => greekToLatinMap[matched]);
        // Fallback for final sigma
        cleanedName = cleanedName.replace(/Σ/g, 'S');


        // --- Step 3: Clean up extra spaces and remove trailing codes ---
        cleanedName = cleanedName.replace(/\s+/g, ' ').trim(); // Collapse multiple spaces to one
        cleanedName = cleanedName.replace(/\s*-\s*\d+\s*$/, '').trim();

        // --- Step 4: Handle adjacent duplicated words ---
        const words = cleanedName.split(' ');
        const uniqueWords = [];
        for (let i = 0; i < words.length; i++) {
            if (i === 0 || words[i] !== words[i - 1]) {
                uniqueWords.push(words[i]);
            }
        }
        cleanedName = uniqueWords.join(' ');

        return cleanedName.trim();
    }

    /**
     * Attempts to find and clean the phone model name from the current page.
     * @returns {string|null} The cleaned model name or null if not found.
     */
    function getPhoneModelFromPage() {
        let rawModel = null;
        // Try to find the model from common field names on the page.
        const modelInput = document.querySelector('div[data-fieldname="strProductName"] input, div[data-fieldname="strDeviceDescription"] input');
        if (modelInput && modelInput.value) {
            rawModel = modelInput.value.trim();
        }

        // Fallback: try to get it from the page title if the input field wasn't found or was empty.
        if (!rawModel) {
            const titleElement = document.querySelector('.pagetitle, h1.page-header, h1, h2');
            if (titleElement) {
                const match = titleElement.innerText.match(/\[(.*?)\]/);
                if (match && match[1]) {
                    rawModel = match[1].trim();
                }
            }
        }

        return cleanModelName(rawModel);
    }

    // ===================================================================
    // === FUN FEATURE: LEVEL UP SYSTEM
    // ===================================================================
    const STORAGE_KEYS = {
        USER_XP: 'tm_user_xp',
        USER_LEVEL: 'tm_user_level',
        ACHIEVEMENTS: 'tm_achievements_unlocked',
        USER_COINS: 'tm_user_coins',
        USER_TITLE: 'tm_user_title', // New: For cosmetic titles
        PURCHASED_ITEMS: 'tm_purchased_items',
        EQUIPPED_ITEM: 'tm_equipped_item',
        EQUIPPED_THEME: 'tm_equipped_theme',
        PET_STATS: 'tm_pet_stats',
        DAILY_STATS: 'tm_daily_stats_v2',
        DAILY_QUESTS: 'tm_daily_quests',
        USER_REROLL_TOKENS: 'tm_user_reroll_tokens',
        // New Scratchpad Keys
        SCRATCHPAD_NOTES: 'tm_scratchpad_notes_v2',
        SCRATCHPAD_ACTIVE_NOTE_ID: 'tm_scratchpad_active_note_id',
        SCRATCHPAD_TEMPLATES: 'tm_scratchpad_templates',
        // New Talent System Keys
        USER_TALENT_POINTS: 'tm_user_talent_points',
        UNLOCKED_TALENTS: 'tm_unlocked_talents',
        USER_NOTIFICATIONS: 'tm_user_notifications_v1',
        ENERGIZED_BUFF_EXPIRES: 'tm_energized_buff_expires',
        DOUBLE_COINS_BUFF_EXPIRES: 'tm_double_coins_buff_expires',

        // Add other keys here as needed
    };

    const XP_CONFIG = {
        searches: 5,
        repairsCompleted: 50,
        ordersCreated: 20,
        achievement: 100, // Bonus for unlocking any achievement
        statusChange: 15, // For any repair status change
        printOrder: 25, // For printing an order/repair ticket
        viewTechStats: 10, // For opening the technician stats modal
        viewCustomerHistory: 10, // For opening the customer history modal
        setScratchpadReminder: 20, // For setting a reminder in the scratchpad
        feedMascot: 5, // For feeding the interactive mascot
        petMascot: 5, // For petting the interactive mascot
        memoryGame: 15, // Base XP for playing the memory mini-game
        bugSquishGame: 30, // Base XP for playing the bug squish mini-game
    };

    const QUEST_POOL = [
        { id: 'complete_3_repairs', description: 'Complete 3 repairs', targetStat: 'repairsCompleted', targetCount: 3, rewardXp: 150, rewardCoins: 50 },
        { id: 'create_5_orders', description: 'Create 5 new orders', targetStat: 'ordersCreated', targetCount: 5, rewardXp: 100, rewardCoins: 30 },
        { id: 'search_10_times', description: 'Use Advanced Search 10 times', targetStat: 'searches', targetCount: 10, rewardXp: 75, rewardCoins: 15 },
        { id: 'pet_mascot_5_times', description: 'Pet the mascot 5 times', targetStat: 'petMascot', targetCount: 5, rewardXp: 50, rewardCoins: 10 },
        { id: 'feed_mascot_3_times', description: 'Feed the mascot 3 times', targetStat: 'feedMascot', targetCount: 3, rewardXp: 40, rewardCoins: 10 },
        { id: 'change_5_statuses', description: 'Change the status of 5 repairs', targetStat: 'statusChanges', targetCount: 5, rewardXp: 80, rewardCoins: 20 },
        { id: 'print_2_orders', description: 'Print 2 order tickets', targetStat: 'printOrder', targetCount: 2, rewardXp: 50, rewardCoins: 15 },
        { id: 'view_5_histories', description: 'View customer history 5 times', targetStat: 'viewCustomerHistory', targetCount: 5, rewardXp: 60, rewardCoins: 15 },
        { id: 'play_2_games', description: 'Play any mini-game 2 times', targetStat: 'anyGamePlayed', targetCount: 2, rewardXp: 70, rewardCoins: 25 },
        { id: 'earn_100_xp', description: 'Earn 100 XP from any source', targetStat: 'xpEarned', targetCount: 100, rewardXp: 100, rewardCoins: 30 },
        { id: 'earn_20_coins', description: 'Earn 20 Fixer-Coins', targetStat: 'coinsEarned', targetCount: 20, rewardXp: 50, rewardCoins: 50 },
    ];

    // Unified constant for all ranks and titles.
    const RANKS = [
        { level: 1,   title: 'Novice Tech',             color: '#d1d1d1' },
        { level: 5,   title: 'Component Handler',       color: '#d1d1d1' },
        { level: 10,  title: 'Adept Troubleshooter',    color: '#1eff00' },
        { level: 15,  title: 'Screen Specialist',       color: '#1eff00' },
        { level: 20,  title: 'Microsoldering Master',   color: '#0070dd' },
        { level: 25,  title: 'Data Recovery Agent',     color: '#0070dd' },
        { level: 30,  title: 'Firmware Wizard',         color: '#0070dd' },
        { level: 40,  title: 'Board-Level Expert',      color: '#a335ee' },
        { level: 50,  title: 'Silicon Prophet',         color: '#a335ee' },
        { level: 75,  title: 'Kernel Commander',        color: '#a335ee' },
        { level: 100, title: 'Master of the Mainboard', color: '#ff8000', glow: true },
        { level: 250, title: 'Digital Archon',          color: '#e5cc80', glow: true }
    ];

    const TALENT_TREE = [
        {
            id: 'repair_xp_boost_1', name: 'Repair Specialist I', cost: 1,
            description: 'Gain +10% bonus XP from completing repairs.',
            bonus: { type: 'xp_modifier', stat: 'repairsCompleted', multiplier: 0.10 }
        },
        {
            id: 'order_xp_boost_1', name: 'Logistics Expert I', cost: 1,
            description: 'Gain +10% bonus XP from creating new orders.',
            bonus: { type: 'xp_modifier', stat: 'ordersCreated', multiplier: 0.10 }
        },
        {
            id: 'search_xp_boost_1', name: 'Data Miner I', cost: 1,
            description: 'Gain +20% bonus XP from using Advanced Search.',
            bonus: { type: 'xp_modifier', stat: 'searches', multiplier: 0.20 }
        },
        {
            id: 'coin_finder_1', name: 'Coin Scavenger', cost: 2,
            description: 'Gain +10% more Fixer-Coins from all sources.',
            bonus: { type: 'coin_modifier', multiplier: 0.10 }
        },
        {
            id: 'game_master_1', name: 'Game Enthusiast', cost: 2,
            description: 'Gain +25% bonus XP from playing mini-games.',
            bonus: { type: 'xp_modifier', stat: 'anyGamePlayed', multiplier: 0.25 }
        },
    ];
    function getXpForLevel(level) {
        return Math.floor(100 * Math.pow(1.2, level - 1));
    }

    function triggerLevelUpAnimation(newLevel, oldLevel, rewards = [], isLegendary = false) {
        const overlay = document.createElement('div');
        overlay.id = 'tm-level-up-overlay';

        let evolutionMessage = '';
        const evolutionMilestones = [10, 25, 50, 100];
        if (evolutionMilestones.some(milestone => oldLevel < milestone && newLevel >= milestone)) {
            evolutionMessage = '<div class="tm-level-up-evolution">Your Mascot has Evolved!</div>';
            // Update the mascot's appearance in real-time
            const mascotContainer = document.getElementById('tm-mascot-container');
            if (mascotContainer) {
                updateMascotAppearanceByLevel(newLevel);
            }
        }

        if (isLegendary) {
            overlay.classList.add('legendary');
        }

        const rewardsHTML = rewards.map(reward => `<div class="tm-level-up-reward">${reward}</div>`).join('');
        const progressBarHTML = `
            <div class="tm-level-up-progress-bar">
                <div class="tm-level-up-progress-fill"></div>
            </div>
        `;

        overlay.innerHTML = `
            <div class="tm-level-up-content">
                <div class="tm-level-up-title">LEVEL UP!</div>
                ${evolutionMessage}
                <div class="tm-level-up-new-level">Level ${newLevel}</div>
                <div class="tm-level-up-rewards-container">${rewardsHTML}</div>
                ${progressBarHTML}
                <div class="tm-level-up-stat-increase">Your stats have improved!</div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Placeholder for sound effect
        // playSound('level-up.mp3');

        triggerConfetti(200);

        // Trigger the progress bar animation
        setTimeout(() => {
            const fill = overlay.querySelector('.tm-level-up-progress-fill');
            if (fill) fill.style.width = '100%';
        }, 500);

        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 1000);
        }, 5000); // Show for 5 seconds
    }

    function grantXp(points, sourceStat = null) {
        let indicator = null; // Declare indicator at the function scope
        let currentXp = config.levelUpSystemEnabled ? GM_getValue(STORAGE_KEYS.USER_XP, 0) : 0;
        let currentLevel = GM_getValue(STORAGE_KEYS.USER_LEVEL, 1);

        // --- Apply Talent Bonuses ---
        const unlockedTalents = JSON.parse(GM_getValue(STORAGE_KEYS.UNLOCKED_TALENTS, '[]'));
        let talentMultiplier = 1.0; // Start with a base multiplier of 1
        // Find if any talent modifies the XP for the current action
        const relevantTalent = TALENT_TREE.find(t => unlockedTalents.includes(t.id) && t.bonus.type === 'xp_modifier' && t.bonus.stat === sourceStat);
        if (sourceStat && relevantTalent) {
            talentMultiplier += relevantTalent.bonus.multiplier; // Add the bonus from the talent
        }

        // Apply XP Boost based on level
        const xpBoost = Math.floor(currentLevel / 5) * 0.01; // +1% boost every 5 levels
        if (typeof updateQuestProgress === 'function') {
            updateQuestProgress('xpEarned', points);
        }


        // Apply "Energized" buff if active
        const energizedExpires = GM_getValue(STORAGE_KEYS.ENERGIZED_BUFF_EXPIRES, 0);
        if (Date.now() < energizedExpires) {
            talentMultiplier += 0.10; // Add 10% boost
        }


        // Grant Fixer-Coins along with XP (1 coin per 10 XP)
        const coinsEarned = Math.floor(points / 10);
        if (coinsEarned > 0) grantCoins(coinsEarned);

        const finalPoints = Math.ceil(points * (1 + xpBoost) * talentMultiplier);
        currentXp += finalPoints;

        let xpForNextLevel = getXpForLevel(currentLevel);
        while (currentXp >= xpForNextLevel) {
            currentXp -= xpForNextLevel;
            const oldLevel = currentLevel;
            currentLevel++;

            // --- Grant Level-Up Rewards ---
            const rewards = [];
            // 1. Grant bonus coins
            grantCoins(100);
            // New: Grant 1 Talent Point per level up
            const currentTalentPoints = GM_getValue(STORAGE_KEYS.USER_TALENT_POINTS, 0);
            GM_setValue(STORAGE_KEYS.USER_TALENT_POINTS, currentTalentPoints + 1);
            rewards.push('🌟 +1 Talent Point!');

            rewards.push('🪙 +100 Fixer-Coins!');
            // 2. Grant XP Boost every 5 levels
            // 2. Grant XP Boost & Reroll Token every 5 levels
            let isLegendaryLevelUp = false;
            if (currentLevel % 5 === 0) {
                rewards.push('✨ +1% Permanent XP Gain!');
                const currentTokens = GM_getValue(STORAGE_KEYS.USER_REROLL_TOKENS, 0);
                GM_setValue(STORAGE_KEYS.USER_REROLL_TOKENS, currentTokens + 1);
                rewards.push('🔄 +1 Bounty Reroll Token!');
            }
            // 3. Increase search history every 10 levels
            if (currentLevel % 10 === 0) {
                config.searchMaxHistory += 1;
                GM_setValue('searchMaxHistory', config.searchMaxHistory);
                rewards.push('📜 +1 Search History Slot!');
            }
            // 4. Grant a new cosmetic title at certain levels
            const newRank = RANKS.find(r => r.level === currentLevel);
            if (newRank) {
                GM_setValue(STORAGE_KEYS.USER_TITLE, newRank.title);
                if (newRank.glow) {
                    isLegendaryLevelUp = true;
                }
                const glowStyle = newRank.glow ? 'text-shadow: 0 0 5px #fff;' : '';
                rewards.push(`🏆 New Title Unlocked: <span style="color:${newRank.color}; font-weight:bold; ${glowStyle}">${newRank.title}</span>!`);
            }
            // 5. Unlock a free theme at a specific level
            if (currentLevel === 15) {
                let purchased = JSON.parse(GM_getValue(STORAGE_KEYS.PURCHASED_ITEMS, '[]'));
                if (!purchased.includes('oceanic')) {
                    purchased.push('oceanic');
                    GM_setValue(STORAGE_KEYS.PURCHASED_ITEMS, JSON.stringify(purchased));
                    rewards.push('🌊 Free Theme Unlocked: Oceanic!');
                }
            }
            // 6. Grant special reward at level 100
            if (currentLevel === 100) {
                let purchased = JSON.parse(GM_getValue(STORAGE_KEYS.PURCHASED_ITEMS, '[]'));
                if (!purchased.includes('master_crown')) {
                    purchased.push('master_crown');
                    GM_setValue(STORAGE_KEYS.PURCHASED_ITEMS, JSON.stringify(purchased));
                    rewards.push('👑 Legendary Reward: The Master\'s Crown!');

                    // Auto-equip the crown
                    const oldEquippedItem = GM_getValue(STORAGE_KEYS.EQUIPPED_ITEM, null);
                    if (oldEquippedItem) {
                        const oldAccessory = document.getElementById(oldEquippedItem);
                        if (oldAccessory) oldAccessory.style.display = 'none';
                    }
                    GM_setValue(STORAGE_KEYS.EQUIPPED_ITEM, 'master_crown');
                    let newAccessory;
                    // Handle special cases where item ID doesn't match element ID
                    // In this specific case, we know the item is 'master_crown'
                    switch ('master_crown') {
                        case 'bookworm_kit': newAccessory = document.querySelector('.tm-mascot-book'); break;
                        case 'stunt_bike': newAccessory = document.querySelector('.tm-mascot-bicycle'); break;
                        case 'juggling_balls': newAccessory = document.querySelector('.tm-mascot-ball'); break;
                        case 'cool_shades': newAccessory = document.querySelector('.tm-mascot-sunglasses'); break;
                        case 'rainy_day_umbrella': newAccessory = document.querySelector('.tm-mascot-umbrella'); break;
                        default: newAccessory = document.getElementById('master_crown');
                    }
 
                    if (newAccessory) {
                        newAccessory.style.display = 'block';
                    }
                }
            }

            triggerLevelUpAnimation(currentLevel, oldLevel, rewards, isLegendaryLevelUp);
            xpForNextLevel = getXpForLevel(currentLevel);
        }

        // --- New: Show XP Gain Indicator ---
        const xpBarContainer = document.getElementById('tm-xp-bar-container');
        if (xpBarContainer && points > 0) {
            indicator = document.createElement('div');
            indicator.className = 'tm-xp-gain-indicator';
            xpBarContainer.appendChild(indicator);

            // Update XP indicator to show boosted points if they are different
            if (finalPoints > points) {
                indicator.textContent = `+${points} XP (+${finalPoints - points} Bonus)`;
                indicator.style.color = '#28a745'; // Green for bonus
                indicator.style.fontSize = '15px';
            } else {
                indicator.textContent = `+${finalPoints} XP`;
            }


            // Remove the indicator after the animation finishes
            setTimeout(() => {
                if (indicator.parentElement) {
                    indicator.parentElement.removeChild(indicator);
                }
            }, 1500); // Must match the animation duration in CSS
        }
        GM_setValue(STORAGE_KEYS.USER_XP, currentXp);
        GM_setValue(STORAGE_KEYS.USER_LEVEL, currentLevel);

        // Update the UI
        const xpBarFill = document.getElementById('tm-xp-bar-fill');
        const xpText = document.getElementById('tm-xp-text');
        const levelText = document.getElementById('tm-level-text');
        const titleText = document.getElementById('tm-user-title-text');
        if (xpBarFill && xpText && levelText && titleText) {
            // --- New: Add temporary visual effects for XP gain ---
            if (finalPoints > 0) {
                const xpBar = xpBarContainer.querySelector('.tm-xp-bar');
                if (xpBar) {
                    xpBar.classList.add('tm-xp-gain-flash');
                    setTimeout(() => xpBar.classList.remove('tm-xp-gain-flash'), 500);
                }
                if (levelText) {
                    levelText.classList.add('tm-level-pop');
                    setTimeout(() => levelText.classList.remove('tm-level-pop'), 500);
                }
            }


            updateXpBarUI(currentLevel, currentXp, xpForNextLevel);
        }
    }

    function grantCoins(amount) {
        if (!config.levelUpSystemEnabled) return;
        let currentCoins = GM_getValue(STORAGE_KEYS.USER_COINS, 0);

        // Apply coin talent bonus
        const unlockedTalents = JSON.parse(GM_getValue(STORAGE_KEYS.UNLOCKED_TALENTS, '[]'));
        let coinMultiplier = 1.0;
        const coinTalent = TALENT_TREE.find(t => unlockedTalents.includes(t.id) && t.bonus.type === 'coin_modifier');
        if (coinTalent) {
            coinMultiplier += coinTalent.bonus.multiplier;
        }

        // Apply "Double Coins" buff if active
        const doubleCoinsExpires = GM_getValue(STORAGE_KEYS.DOUBLE_COINS_BUFF_EXPIRES, 0);
        if (Date.now() < doubleCoinsExpires) {
            coinMultiplier += 1.0; // Add 100% bonus
        }


        currentCoins += Math.ceil(amount * coinMultiplier);
        GM_setValue(STORAGE_KEYS.USER_COINS, currentCoins);
        // Update quest progress for earning coins
        if (typeof updateQuestProgress === 'function') {
            updateQuestProgress('coinsEarned', amount);
        }
        updateCoinBalanceUI(currentCoins);
    }

    function updateCoinBalanceUI(balance) {
        const coinDisplay = document.getElementById('tm-coin-balance');
        if (!coinDisplay) return;
        coinDisplay.innerHTML = `🪙 ${balance}`;
    }

    /**
     * Tracks a daily statistic. Resets if the day has changed.
     * @param {string} statName The name of the stat to increment (e.g., 'searches').
     */
    function trackDailyStat(statName, value = 1) {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        let stats = {
            date: today,
            searches: 0,
            repairsCompleted: 0,
            ordersCreated: 0,
            statusChanges: 0,
            printOrder: 0,
            viewTechStats: 0,
            viewCustomerHistory: 0,
            setScratchpadReminder: 0,
            feedMascot: 0,
            petMascot: 0,
            memoryGame: 0,
            bugSquishGame: 0,
            xpEarned: 0,
            coinsEarned: 0
        };

        try {
            const savedStats = JSON.parse(GM_getValue(STORAGE_KEYS.DAILY_STATS, '{}'));
            // If the saved date is today, use it. Otherwise, the fresh object will be used.
            if (savedStats.date === today) {
                stats = savedStats;
            } else {
                // New day, so generate new quests
                generateDailyQuests();
            }
        } catch (e) {
            console.error('[MMS] Could not parse daily stats, resetting.', e);
        }

        stats[statName] = (stats[statName] || 0) + value;
        GM_setValue(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats)); // Save before checking achievements

        // Don't check for achievements on every single action to avoid spam
        const achievementTrackedStats = ['searches', 'repairsCompleted', 'ordersCreated'];
        if (achievementTrackedStats.includes(statName))
        checkAchievements(statName, stats[statName]);

        // Update quest progress for all stats
        if (typeof updateQuestProgress === 'function') {
            updateQuestProgress(statName, value);
        }

        // Handle combined stats like 'anyGamePlayed'
        if (statName === 'memoryGame' || statName === 'bugSquishGame') {
            stats['anyGamePlayed'] = (stats['anyGamePlayed'] || 0) + value;
            updateQuestProgress('anyGamePlayed', value);
        }

        // Grant XP for the action
        if (config.levelUpSystemEnabled && XP_CONFIG[statName]) {
            grantXp(XP_CONFIG[statName], statName); // Pass the source stat for talent calculation
        }
        if (config.interactiveMascotEnabled) {
            // Make the pet happy for user activity
            const happinessGain = (statName === 'repairsCompleted' || statName === 'ordersCreated') ? 20 : 5;
            updatePetStats(happinessGain, 0);
        }
    }

    /**
     * Requests permission for and shows a desktop notification.
     * @param {string} title The title of the notification.
     * @param {string} body The body text of the notification.
     */
    function showNotification(title, body) {
        if (!("Notification" in window)) {
            alert(`Reminder: ${body}`); // Fallback for browsers without Notification API
            return;
        }

        if (Notification.permission === "granted") {
            new Notification(title, { body: body, icon: 'https://www.google.com/s2/favicons?domain=thefixers.mymanager.gr' });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body: body, icon: 'https://www.google.com/s2/favicons?domain=thefixers.mymanager.gr' });
                }
            });
        }
    }

    // ===================================================================
    // === DAILY BOUNTIES / QUESTS SYSTEM
    // ===================================================================
    function generateDailyQuests() {
        const shuffled = QUEST_POOL.sort(() => 0.5 - Math.random());
        const dailyQuests = shuffled.slice(0, 3).map(quest => ({
            ...quest,
            progress: 0,
            claimed: false
        }));
        GM_setValue(STORAGE_KEYS.DAILY_QUESTS, JSON.stringify(dailyQuests));
        console.log('[MMS] New daily quests generated!');
    }

    function updateQuestProgress(statName, value = 1) {
        let quests = JSON.parse(GM_getValue(STORAGE_KEYS.DAILY_QUESTS, '[]'));
        if (quests.length === 0) return;

        let questsUpdated = false;
        quests.forEach(quest => {
            if (quest.targetStat === statName && !quest.claimed && quest.progress < quest.targetCount) {
                quest.progress += value;
                if (quest.progress >= quest.targetCount) {
                    quest.progress = quest.targetCount; // Cap progress at target
                    const completeMessage = `Bounty Complete: ${quest.description}`;
                    showPositiveMessage(completeMessage);
                    // New: Log bounty completion to notification center
                    createNotification(completeMessage, '📜');
                }
                questsUpdated = true;
            }
        });

        if (questsUpdated) {
            GM_setValue(STORAGE_KEYS.DAILY_QUESTS, JSON.stringify(quests));
        }
    }

    function showQuestsModal() {
        if (document.querySelector('.tm-modal-overlay')) return; // Prevent multiple modals

        const overlay = document.createElement('div');
        overlay.className = 'tm-modal-overlay';
        overlay.innerHTML = `
            <div class="tm-modal-content" style="max-width: 600px; height: auto;">
                <div class="tm-modal-header">
                    <h2 class="tm-modal-title">📜 Daily Bounties</h2>
                    <span id="tm-reroll-token-display" title="Bounty Reroll Tokens"></span>
                    <button class="tm-modal-close">&times;</button>
                </div>
                <div id="tm-quests-container"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('.tm-modal-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        populateQuestsModal();
    }

    function populateQuestsModal() {
        const container = document.getElementById('tm-quests-container');
        if (!container) return;

        const rerollTokens = GM_getValue(STORAGE_KEYS.USER_REROLL_TOKENS, 0);
        const tokenDisplay = document.getElementById('tm-reroll-token-display');
        if (tokenDisplay) {
            tokenDisplay.innerHTML = `🔄 ${rerollTokens}`;
        }

        const quests = JSON.parse(GM_getValue(STORAGE_KEYS.DAILY_QUESTS, '[]'));
        if (quests.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#666;">Bounties refresh daily. Check back tomorrow!</p>';
            return;
        }

        container.innerHTML = quests.map(quest => {
            const isComplete = quest.progress >= quest.targetCount;
            const progressPercent = (quest.progress / quest.targetCount) * 100;
            const canReroll = !quest.claimed && !isComplete && rerollTokens > 0;
            return `
                <div class="tm-quest-item ${quest.claimed ? 'completed' : ''}">
                    <div class="tm-quest-status-icon">${isComplete ? '✅' : '⏳'}</div>
                    <div class="tm-quest-details">
                        <div class="tm-quest-description">${quest.description}</div>
                        <div class="tm-quest-progress-bar" title="${quest.progress} / ${quest.targetCount}">
                            <div style="width: ${progressPercent}%;"></div>
                        </div>
                        <div class="tm-quest-progress-text">${quest.progress} / ${quest.targetCount}</div>
                    </div>
                    <div class="tm-quest-reward">
                        XP: ${quest.rewardXp}<br>Coins: ${quest.rewardCoins}
                    </div>
                    <div class="tm-quest-actions">
                        <button class="tm-quest-claim-btn" data-quest-id="${quest.id}" ${(!isComplete || quest.claimed) ? 'disabled' : ''}>
                            ${quest.claimed ? 'Claimed' : 'Claim'}
                        </button>
                        <button class="tm-quest-reroll-btn" data-quest-id="${quest.id}" title="Reroll this bounty" ${!canReroll ? 'disabled' : ''}>🔄</button>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.tm-quest-claim-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const questId = e.target.dataset.questId;
                let quests = JSON.parse(GM_getValue(STORAGE_KEYS.DAILY_QUESTS, '[]'));
                const quest = quests.find(q => q.id === questId);
                if (quest && !quest.claimed && quest.progress >= quest.targetCount) {
                    grantXp(quest.rewardXp);
                    grantCoins(quest.rewardCoins);
                    quest.claimed = true;
                    // New: Chance to trigger Energized state on bounty completion
                    if (Math.random() < 0.33) { // 33% chance
                        triggerEnergizedState(5 * 60 * 1000); // 5 minutes
                    }
                    GM_setValue(STORAGE_KEYS.DAILY_QUESTS, JSON.stringify(quests));
                    populateQuestsModal(); // Re-render the modal to update state
                }
            });
        });

        container.querySelectorAll('.tm-quest-reroll-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const questIdToReroll = e.target.dataset.questId;
                let currentTokens = GM_getValue(STORAGE_KEYS.USER_REROLL_TOKENS, 0);

                if (currentTokens <= 0) {
                    showPositiveMessage("No reroll tokens left!");
                    return;
                }

                if (!confirm("Use 1 Reroll Token to get a new bounty?")) return;

                // Decrement token and save
                currentTokens--;
                GM_setValue(STORAGE_KEYS.USER_REROLL_TOKENS, currentTokens);

                // Find a new quest
                let quests = JSON.parse(GM_getValue(STORAGE_KEYS.DAILY_QUESTS, '[]'));
                const currentQuestIds = quests.map(q => q.id);
                const availableNewQuests = QUEST_POOL.filter(p => !currentQuestIds.includes(p.id));

                if (availableNewQuests.length > 0) {
                    const newQuestTemplate = availableNewQuests[Math.floor(Math.random() * availableNewQuests.length)];
                    const newQuest = { ...newQuestTemplate, progress: 0, claimed: false };

                    // Replace the old quest
                    const questIndex = quests.findIndex(q => q.id === questIdToReroll);
                    if (questIndex !== -1) {
                        quests[questIndex] = newQuest;
                        GM_setValue(STORAGE_KEYS.DAILY_QUESTS, JSON.stringify(quests));
                        populateQuestsModal(); // Re-render
                    }
                } else {
                    showPositiveMessage("No more unique bounties available today!");
                }
            });
        });
    }
    // ===================================================================
    // === 0. CONFIGURATION & SETTINGS
    // ===================================================================

    const DEFAULTS = {
        refreshIntervalMinutes: 7,
        autoRefreshEnabled: true,
        debugEnabled: false,
        workingHoursStart: 9,
        workingHoursEnd: 21,
        workingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
        searchFeatureEnabled: true,
        // New config for themes
        hackerSearchEnabled: true,
        equippedTheme: 'default',
        // Default theme colors (matches the initial CSS variables)
        defaultThemeColors: { '--tm-primary-color': '#007bff', '--tm-primary-hover': '#0056b3', '--tm-success-color': '#28a745', '--tm-success-hover': '#218838', '--tm-dark-color': '#343a40', '--tm-dark-hover': '#23272b', '--tm-info-color': '#17a2b8', '--tm-warning-color': '#ffc107' },

        searchMaxHistory: 10,
        quickSearchEnabled: true,
        quickSearchWidgetOnRepairPage: true, // This was the new setting
        quickSearchButtons: [
            { label: 'LCD', term: 'LCD' },
            { label: 'Dock', term: 'DOCK' },
            { label: 'Battery', term: 'BATTERY' },
            { label: 'Back Cover', term: 'Back Cover' },
        ],
        scratchpadEnabled: true,
        scrollToTopEnabled: true,
        technicianStatsEnabled: true,
        customerHistoryEnabled: true,
        dashboardWidgetEnabled: true,
        levelUpSystemEnabled: true,
        interactiveMascotEnabled: true,
        confettiEnabled: true,
        weatherLocation: 'Athens, GR',
        mascotRoamingSpeed: 100,
        automatedPartsSearchEnabled: true,
    };
    DEFAULTS.customLoginPageEnabled = true; // Added separately to avoid merge conflicts

    const UI_THEMES = {
        'default': { name: 'Default', icon: '🎨', cost: 0, colors: DEFAULTS.defaultThemeColors },
        'matrix': {
            name: 'Matrix', icon: '📟', cost: 500, type: 'theme',
            colors: { '--tm-primary-color': '#00ff00', '--tm-primary-hover': '#00aa00', '--tm-success-color': '#00dd00', '--tm-success-hover': '#009900', '--tm-dark-color': '#080808', '--tm-dark-hover': '#000000', '--tm-info-color': '#00cc00', '--tm-warning-color': '#00ff00' },
            pageStyles: `
                body, .rnr-c, .rnr-cw-grid, .rnr-s-2, .rnr-s-undermenu, .rnr-s-menu, .rnr-page { background: #050505 !important; color: #0f0 !important; }
                .rnr-b-vmenu a, .rnr-b-vmenu a:hover { color: #0f0 !important; }
                .rnr-b-vmenu li.current > div { background: #0a2a0a !important; border-left: 3px solid #0f0; }
                .rnr-top, #head-outter, #footer-outter { background-color: #000 !important; }
                .rnr-gridtable tr.rnr-row, .rnr-gridtable tr.rnr-toprow { background: #080808 !important; color: #0f0 !important; }
                .rnr-gridtable tr.rnr-row:hover { background: #111 !important; }
                .rnr-gridtable td, .rnr-gridtable th { border-color: #0f0 !important; color: #0f0 !important; }
                a, a:visited { color: #3f3 !important; }
                input, select { background: #111 !important; color: #0f0 !important; border: 1px solid #0f0 !important; }
            `
        },
        'oceanic': {
            name: 'Oceanic', icon: '🌊', cost: 500, type: 'theme',
            colors: { '--tm-primary-color': '#1E90FF', '--tm-primary-hover': '#104E8B', '--tm-success-color': '#20B2AA', '--tm-success-hover': '#2F4F4F', '--tm-dark-color': '#000080', '--tm-dark-hover': '#000033', '--tm-info-color': '#48D1CC', '--tm-warning-color': '#FFD700' },
            pageStyles: `
                body, .rnr-page { background: #f0f8ff !important; }
                #head-outter, #footer-outter { background-color: #000080 !important; }
                .rnr-s-menu { background: #e6f2ff !important; }
                .rnr-b-vmenu li.current > div { background: #cce4ff !important; border-left: 3px solid #1E90FF; }
                .rnr-cw-grid, .rnr-s-2, .rnr-s-undermenu { background: #ffffff !important; }
                .rnr-gridtable tr.rnr-row:hover { background: #e6f2ff !important; }
            `
        },
        'cyberpunk': {
            name: 'Cyberpunk', icon: '🌃', cost: 750, type: 'theme',
            colors: { '--tm-primary-color': '#ff00ff', '--tm-primary-hover': '#cc00cc', '--tm-success-color': '#00ffff', '--tm-success-hover': '#00cccc', '--tm-dark-color': '#1a0a2a', '--tm-dark-hover': '#0a001a', '--tm-info-color': '#00aaff', '--tm-warning-color': '#ffff00' },
            pageStyles: `
                body, .rnr-page { background: #0a001a !important; color: #00ffff !important; }
                #head-outter, #footer-outter { background-color: #1a0a2a !important; border-bottom: 1px solid #ff00ff; border-top: 1px solid #ff00ff; }
                .rnr-s-menu { background: #100520 !important; }
                .rnr-b-vmenu a, .rnr-b-vmenu a:hover { color: #00ffff !important; }
                .rnr-b-vmenu li.current > div { background: #2a0a3a !important; border-left: 3px solid #ff00ff; }
                .rnr-cw-grid, .rnr-s-2, .rnr-s-undermenu { background: #100520 !important; }
                .rnr-gridtable tr.rnr-row, .rnr-gridtable tr.rnr-toprow { background: #1a0a2a !important; color: #00ffff !important; }
                .rnr-gridtable tr.rnr-row:hover { background: #2a0a3a !important; }
                .rnr-gridtable td, .rnr-gridtable th { border-color: #ff00ff !important; color: #00ffff !important; }
                a, a:visited { color: #ff00ff !important; }
                input, select { background: #1a0a2a !important; color: #00ffff !important; border: 1px solid #ff00ff !important; }
            `
        },
        'solarized_dark': {
            name: 'Solarized Dark', icon: '☀️', cost: 750, type: 'theme',
            colors: { '--tm-primary-color': '#268bd2', '--tm-primary-hover': '#1a6094', '--tm-success-color': '#859900', '--tm-success-hover': '#5d6b00', '--tm-dark-color': '#073642', '--tm-dark-hover': '#002b36', '--tm-info-color': '#2aa198', '--tm-warning-color': '#b58900' },
            pageStyles: `
                body, .rnr-page { background: #002b36 !important; color: #839496 !important; }
                #head-outter, #footer-outter { background-color: #073642 !important; }
                .rnr-s-menu { background: #073642 !important; }
                .rnr-b-vmenu a, .rnr-b-vmenu a:hover { color: #93a1a1 !important; }
                .rnr-b-vmenu li.current > div { background: #002b36 !important; border-left: 3px solid #268bd2; }
                .rnr-cw-grid, .rnr-s-2, .rnr-s-undermenu { background: #073642 !important; }
                .rnr-gridtable tr.rnr-row, .rnr-gridtable tr.rnr-toprow { background: #073642 !important; color: #839496 !important; }
                .rnr-gridtable tr.rnr-row:hover { background: #002b36 !important; }
                .rnr-gridtable td, .rnr-gridtable th { border-color: #586e75 !important; color: #839496 !important; }
                a, a:visited { color: #268bd2 !important; }
                input, select { background: #002b36 !important; color: #93a1a1 !important; border: 1px solid #586e75 !important; }
            `
        },
    };

    function applyTheme(themeId) {
        // Remove any existing theme stylesheet
        const existingStyle = document.getElementById('tm-page-theme-styles');
        if (existingStyle) existingStyle.remove();

        const theme = UI_THEMES[themeId] || UI_THEMES['default'];
        console.log(`[MMS] Applying theme: ${theme.name}`);
        for (const [variable, color] of Object.entries(theme.colors)) {
            document.documentElement.style.setProperty(variable, color);
        }
        GM_setValue(STORAGE_KEYS.EQUIPPED_THEME, themeId);
        config.equippedTheme = themeId;

        // Inject page-specific styles if they exist for the theme
        if (theme.pageStyles) {
            const styleEl = document.createElement('style');
            styleEl.id = 'tm-page-theme-styles';
            styleEl.innerHTML = theme.pageStyles;
            document.head.appendChild(styleEl);
        }
    }

    // The global config object. It will be populated by loadSettings().
    let config = {};

    // ===================================================================
    // === 1. STYLING (ALL FEATURES)
    // ===================================================================
    function addGlobalStyles() {
        GM_addStyle(`
            /* --- Global CSS Variables for Theming --- */
            :root {
                --tm-primary-color: #007bff;
                --tm-primary-hover: #0056b3;
                --tm-secondary-color: #6c757d;
                --tm-secondary-hover: #5a6268;
                --tm-success-color: #28a745;
                --tm-success-hover: #218838;
                --tm-danger-color: #dc3545;
                --tm-danger-hover: #c82333;
                --tm-warning-color: #ffc107;
                --tm-warning-hover: #e0a800;
                --tm-info-color: #17a2b8;
                --tm-info-hover: #138496;
                --tm-dark-color: #343a40;
                --tm-dark-hover: #23272b;

                /* Shop Item Styles */
                --tm-shop-item-bg: #f8f9fa;
                --tm-shop-item-border: #dee2e6;
                --tm-shop-item-hover-bg: #e9ecef;
                --tm-shop-item-owned-bg: #e7f1ff;
            }
            /* --- Feature: Advanced Search --- */
            /* --- Notification Center Styles --- */
            #tm-notification-bell-wrapper { position: relative; }
            #tm-notification-bell-btn {
                background-color: var(--tm-dark-color); color: white; border: none;
                width: 36px; height: 36px; border-radius: 50%; font-size: 20px;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background-color 0.2s;
            }
            #tm-notification-bell-btn:hover { background-color: var(--tm-dark-hover); }
            #tm-notification-unread-count {
                position: absolute; top: -2px; right: -2px;
                background-color: var(--tm-danger-color); color: white;
                border-radius: 50%; width: 18px; height: 18px;
                font-size: 11px; font-weight: bold;
                display: flex; align-items: center; justify-content: center;
                pointer-events: none;
                transform: scale(0); transition: transform 0.2s ease-out;
            }
            #tm-notification-unread-count.visible { transform: scale(1); }
            #tm-notification-panel {
                position: absolute; bottom: 50px; right: 0;
                width: 350px; max-height: 400px;
                background: #fff; border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 10001; display: flex; flex-direction: column;
                overflow: hidden;
            }
            .tm-notification-header { padding: 10px 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
            .tm-notification-header h4 { margin: 0; font-size: 16px; }
            .tm-notification-header button { background: none; border: none; color: var(--tm-primary-color); cursor: pointer; font-size: 12px; text-decoration: underline; }
            #tm-notification-list { flex-grow: 1; overflow-y: auto; padding: 8px; }
            .tm-notification-item { display: flex; gap: 10px; padding: 10px; border-bottom: 1px solid #f5f5f5; }
            .tm-notification-item:last-child { border-bottom: none; }
            .tm-notification-item.unread { background-color: #f0f8ff; }
            .tm-notification-icon { font-size: 18px; flex-shrink: 0; }
            .tm-notification-content { flex-grow: 1; }
            .tm-notification-message { font-size: 14px; color: #333; }
            .tm-notification-timestamp { font-size: 11px; color: #888; margin-top: 4px; }
            #tm-notification-empty-state { text-align: center; color: #999; padding: 40px 20px; }









            /* --- Talent Tree Styles --- */
            .tm-talent-points-display { font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 10px; background: #f0f8ff; padding: 8px; border-radius: 6px; }
            .tm-talent-points-display span { color: var(--tm-primary-color); }
            #tm-talents-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
            .tm-talent-item { border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; text-align: center; background: #fff; transition: all 0.2s ease; }
            .tm-talent-item.unlocked { background: #e7f1ff; border-left: 4px solid var(--tm-primary-color); }
            .tm-talent-name { font-weight: bold; font-size: 15px; margin-bottom: 8px; }
            .tm-talent-description { font-size: 12px; color: #6c757d; min-height: 40px; margin-bottom: 12px; }
            .tm-talent-btn { width: 100%; padding: 8px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; color: white; }
            .tm-talent-btn.unlockable { background-color: var(--tm-success-color); }
            .tm-talent-btn.unlockable:hover { background-color: var(--tm-success-hover); }
            .tm-talent-btn.unlocked { background-color: var(--tm-secondary-color); cursor: default; }
            .tm-talent-btn:disabled:not(.unlocked) { background-color: #ccc; cursor: not-allowed; }

            /* --- Data Management Styles --- */
            .tm-data-actions { display: flex; justify-content: center; gap: 20px; margin-top: 20px; }
            .tm-data-btn {
                padding: 12px 25px;
                font-size: 16px;
                font-weight: bold;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.2s, transform 0.1s;
            }
            .tm-data-btn.export { background-color: var(--tm-primary-color); }
            .tm-data-btn.export:hover {
                background-color: var(--tm-primary-hover);
                transform: translateY(-2px);
            }
            .tm-data-btn.import { background-color: var(--tm-info-color); }
            .tm-data-btn.import:hover {
                background-color: var(--tm-info-hover);
                transform: translateY(-2px);
            }





            #tm-search-container {
                position: fixed;
                top: 100px;
                right: 0;
                z-index: 9999;
                padding: 20px 5px 20px 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: flex-end; /* Align buttons to the right edge */
            }

            /* Common style for buttons that slide out from the right */
            .tm-slide-out-btn {
                padding: 10px 15px;
                border: none;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: -2px 2px 8px rgba(0,0,0,0.2);
                transform: translateX(100%);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                pointer-events: none; /* Not clickable when hidden */
                color: white;
                width: 180px; /* Set a fixed width for consistency */
                text-align: left; /* Align text to the left */
                box-sizing: border-box; /* Ensure padding is included in the width */
            }

            /* Individual button colors */
            #tm-search-btn { background-color: var(--tm-primary-color); }
            #tm-search-btn:hover { background-color: var(--tm-primary-hover); }

            #tm-quests-btn { background-color: #8B4513; } /* SaddleBrown */
            #tm-quests-btn:hover { background-color: #A0522D; } /* Sienna */

            #tm-tech-stats-btn { background-color: var(--tm-info-color); }
            #tm-tech-stats-btn:hover { background-color: var(--tm-info-hover); }

            /* Customer History Link Style */
            .tm-customer-history-link {
                cursor: pointer; text-decoration: underline; color: var(--tm-info-color);
                font-weight: bold;
            }

            /* Customer History Modal Content */
            #tm-customer-history-container {
                overflow-y: auto; /* Make the history list scrollable */
            }

            /* Sortable headers in history modal */
            .tm-sortable-header {
                cursor: pointer;
            }
            .tm-sortable-header:hover { background-color: #e9ecef; }
            /* Hover effect on container to show buttons */
            #tm-search-container:hover .tm-slide-out-btn {
                transform: translateX(0);
                opacity: 1;
                pointer-events: auto;
            }

            /* Modal Styles */
            .tm-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.6); z-index: 10000;
                display: flex; align-items: center; justify-content: center;
                animation: tm-fade-in 0.3s ease-out;
            }
            .tm-modal-content {
                background: #fff; padding: 25px; border-radius: 8px;
                width: 90%; max-width: 800px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                height: 85vh; /* Use fixed height to prevent resizing between tabs */
                display: flex; flex-direction: column;
                animation: tm-scale-up 0.3s ease-out;
            }
            #tm-settings-content {
                flex-grow: 1;
                overflow-y: auto;
                padding-right: 10px; /* Space for scrollbar */
            }
            .tm-modal-header {
                display: flex; justify-content: space-between; align-items: center;
                border-bottom: 1px solid #dee2e6; padding-bottom: 15px; margin-bottom: 20px;
            }
            .tm-modal-title { font-size: 20px; color: #333; margin: 0; flex-grow: 1; text-align: center; }
            .tm-integrated-panel-header {
                display: flex; justify-content: space-between; align-items: center;
                border-bottom: 1px solid #dee2e6; padding-bottom: 15px; margin-bottom: 20px;
            }
            .tm-integrated-panel-title {
                font-size: 20px; color: #333; margin: 0; flex-grow: 1;
                text-align: center;
            }
            /* Settings layout as panel with sidebar */
            .tm-settings-layout { display: flex; gap: 16px; }
            .tm-settings-sidebar { width: 220px; border-right: 1px solid #eee; padding-right: 12px; }
            .tm-settings-sidebar .tm-nav { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
            .tm-settings-sidebar .tm-nav a { text-decoration: none; color: #333; font-weight: 600; border-radius: 6px; padding: 8px 10px; display: block; background: #f8f9fa; }
            .tm-settings-sidebar .tm-nav a.active { background: #e7f1ff; color: #0b5ed7; }
            .tm-settings-sidebar .tm-nav a:hover { background: #eef2f7; }
            .tm-settings-main { flex: 1; padding-left: 4px; }
            .tm-settings-main section { display: none; }
            .tm-settings-main section.active { display: block; }
            @keyframes tm-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes tm-scale-up {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .tm-modal-close { font-size: 28px; font-weight: bold; cursor: pointer; border: none; background: none; color: var(--tm-secondary-color); }
            .tm-modal-close:hover { color: var(--tm-secondary-hover); }

            /* Search Input Area */
            #tm-search-input-area { display: flex; margin-bottom: 20px; }
            #tm-search-input { flex-grow: 1; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; text-align: center; }
            #tm-search-submit { padding: 10px 20px; font-size: 16px; background-color: var(--tm-success-color); color: white; border: none; cursor: pointer; }
            #tm-search-submit:disabled { background-color: var(--tm-secondary-color); cursor: not-allowed; }
            /* Default focus style for search input */
            #tm-search-input:focus {
                border-color: var(--tm-primary-color);
                box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25); /* Standard bootstrap-like focus */
                transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
            }
            /* "Hacker" effect on focus, only when theme is enabled */
            .tm-hacker-theme-enabled #tm-search-input:focus {
                border-color: #0f0;
                box-shadow: 0 0 8px #0f0, 0 0 15px #0f0;
                color: #0f0;
                background-color: #030d03;
                text-shadow: 0 0 4px #0f0;
            }
            /* Full hacker theme for the search modal */
            .tm-hacker-theme-enabled .tm-modal-content {
                background: #050505;
                color: #0f0;
                border: 1px solid #0f0;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
            }
            .tm-hacker-theme-enabled .tm-modal-header { border-bottom-color: #0f0; }
            .tm-hacker-theme-enabled .tm-modal-title { color: #0f0; }
            .tm-hacker-theme-enabled .tm-modal-close { color: #0f0; }
            .tm-hacker-theme-enabled #tm-search-submit { background-color: #009900; border-color: #0f0; }
            .tm-hacker-theme-enabled #tm-search-submit:hover { background-color: #00cc00; }
            .tm-hacker-theme-enabled #tm-search-favorite-btn { border-color: #0f0; color: #0f0; }
            .tm-hacker-theme-enabled #tm-search-favorite-btn.favorited { color: #ffff00; }
            .tm-hacker-theme-enabled #tm-search-history-favorites-container { border-top-color: #0f0; }
            .tm-hacker-theme-enabled .tm-search-list-section h4 { color: #0f0; border-bottom-color: #0f0; }
            .tm-hacker-theme-enabled .tm-search-list-item a { color: #3f3; }
            .tm-hacker-theme-enabled .tm-search-list-action-btn { color: #0f0; }
            .tm-hacker-theme-enabled .tm-search-list-action-btn:hover { color: #ff0000; }
            .tm-hacker-theme-enabled #tm-status-message { color: #0f0; }
            .tm-hacker-theme-enabled .tm-result-item { border-color: #0f0; background: #080808; }
            .tm-hacker-theme-enabled .tm-result-header { background: #111; }
            .tm-hacker-theme-enabled .tm-result-table td { border-color: #0f0; }
            .tm-hacker-theme-enabled .tm-result-highlight { background-color: #00ff00; color: #000; }
            .tm-hacker-theme-enabled .tm-goto-btn, .tm-hacker-theme-enabled .tm-print-btn { background-color: #009900; }
            .tm-hacker-theme-enabled .tm-goto-btn:hover, .tm-hacker-theme-enabled .tm-print-btn:hover { background-color: #00cc00; }

            /* Search History & Favorites */
            #tm-search-input { border-top-right-radius: 0; border-bottom-right-radius: 0; }
            #tm-search-favorite-btn {
                padding: 10px; font-size: 18px; background: none;
                border: 1px solid #ccc; border-left: none;
                cursor: pointer; color: #6c757d;
                display: flex; align-items: center; justify-content: center;
            }
            #tm-search-favorite-btn:hover { background-color: #f0f0f0; }
            #tm-search-favorite-btn.favorited { color: var(--tm-warning-color); /* Gold for favorited */ }
            #tm-search-submit { border-radius: 0 4px 4px 0; }

            #tm-search-history-favorites-container {
                display: flex;
                gap: 20px;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #eee;
            }
            .tm-search-list-section { flex: 1; min-width: 0; }
            .tm-search-list-section h4 {
                margin-top: 0; margin-bottom: 8px; font-size: 14px;
                color: #555; border-bottom: 1px solid #f0f0f0; padding-bottom: 4px;
            }
            .tm-search-list {
                list-style: none; padding: 0; margin: 0;
                max-height: 120px; overflow-y: auto;
            }
            .tm-search-list-item {
                display: flex; justify-content: space-between; align-items: center;
                padding: 4px 0; font-size: 13px;
            }
            .tm-search-list-item a {
                color: var(--tm-primary-color); text-decoration: none; cursor: pointer;
                flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .tm-search-list-item a:hover { text-decoration: underline; }
            .tm-search-list-action-btn {
                background: none; border: none; cursor: pointer; font-size: 14px;
                margin-left: 5px; color: #888; padding: 2px; line-height: 1;
                flex-shrink: 0;
            }
            .tm-search-list-action-btn:hover { color: #dc3545; } /* Red for remove */

            /* Results Area */
            #tm-results-container { overflow-y: auto; }
            .tm-result-item { border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px; overflow: hidden; }
            .tm-result-clickable { cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; }
            .tm-result-clickable:hover {
                box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
            }
            .tm-result-header { background-color: #f7f7f7; padding: 8px 12px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; text-align: center; }
            .tm-result-body { padding: 12px; }
            .tm-result-table { width: 100%; border-collapse: collapse; }
            .tm-result-table td { padding: 5px; border-bottom: 1px solid #eee; font-size: 13px; text-align: center; }
            .tm-result-table tr:last-child td { border-bottom: none; }
            .tm-result-highlight { background-color: yellow; }
            .tm-print-btn, .tm-goto-btn {
                background-color: var(--tm-info-color); color: white; border: none; border-radius: 4px;
                padding: 5px 10px; font-size: 12px; cursor: pointer; text-decoration: none;
                margin-left: 5px;
            }
            .tm-print-btn:hover { background-color: var(--tm-info-hover); }
            .tm-goto-btn {
                background-color: var(--tm-success-color);
            }
            .tm-goto-btn:hover {
                background-color: var(--tm-success-hover);
            }

            /* Quick Action Buttons within details */
            .tm-quick-action-btn {
                margin-left: 5px;
                padding: 2px 5px;
                font-size: 10px;
                background-color: var(--tm-primary-color);
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                vertical-align: middle; /* Align with text */
            }
            .tm-quick-action-btn:hover {
                background-color: var(--tm-primary-hover);
            }
            #tm-status-message { text-align: center; padding: 20px; font-size: 16px; color: #666; }

            /* Inline Details Styles */
            .tm-result-details-container {
                padding: 15px;
                background-color: #fdfdfd;
                border-top: 1px dashed #ccc;
            }
            .tm-details-loading, .tm-details-error {
                color: #888; font-style: italic; padding: 10px 0;
            }
            .tm-details-error { color: var(--tm-danger-color); }
            .tm-details-table { width: 100%; border-collapse: collapse; }
            .tm-details-table td {
                padding: 8px; border: 1px solid #e9ecef; text-align: center;
                font-size: 13px; vertical-align: top;
            }
            .tm-details-label {
                font-weight: bold; background-color: #f8f9fa;
                width: 25%;
            }
            .tm-details-value {
                width: 75%; white-space: pre-wrap; word-break: break-word;
            }

            /* --- Feature: Auto-Refresh Timer --- */
            #tm-refresh-timer-container {
                color: #fff; /* Match footer text color */
                font-family: Arial, sans-serif;
                font-size: 12px;
                display: flex;
                align-items: center;
                white-space: nowrap; /* Prevent text from wrapping */
                gap: 10px;
            }
            #tm-refresh-cancel-btn {
                background: none;
                border: none;
                color: #fff; /* Match footer text color */
                cursor: pointer;
                font-size: 12px;
                text-decoration: underline;
                padding: 0;
            }

            /* --- Feature: Quick Search Buttons --- */
            #tm-quick-search-container {
                /* Injected as a set of inline buttons/tags */
                display: inline-flex;
                align-items: center;
                gap: 5px;
                margin-left: 15px; /* Space from the 'Add' button */
            }
            #tm-quick-search-panel {
                display: contents; /* Makes the panel a non-visual container */
            }
            .tm-quick-search-btn {
                background-color: #e9ecef;
                color: #495057;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                font-weight: bold;
                transition: background-color 0.2s;
            }
            .tm-quick-search-btn:hover {
                background-color: #d4dae0;
                color: #000;
            }

            /* --- Feature: Settings Panel --- */
            #tm-settings-btn {
                background-color: var(--tm-dark-color);
                color: white;
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }
            #tm-settings-btn {
                transition: background-color 0.2s, transform 0.4s ease-out;
            }
            #tm-settings-btn:hover { background-color: var(--tm-dark-hover); transform: rotate(90deg); }
            /* New Settings Panel Styles */
            .tm-settings-section {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            }
            .tm-settings-section:last-of-type {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            .tm-settings-section h3 {
                margin-top: 0;
                margin-bottom: 20px;
                font-size: 16px;
                color: #343a40;
                text-align: left;
                border-bottom: 1px solid #f1f1f1;
                padding-bottom: 10px;
            }
            .tm-setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding: 0 10px;
            }
            .tm-setting-label {
                flex-basis: 60%;
                text-align: left;
            }
            .tm-setting-label label {
                font-weight: bold;
                color: #495057;
                font-size: 14px;
            }
            .tm-setting-control {
                flex-basis: 35%;
                text-align: right;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 10px;
            }
            .tm-setting-control input[type="number"] {
                width: 70px;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                text-align: center;
            }
            .tm-setting-control input[type="checkbox"] {
                transform: scale(1.3);
                cursor: pointer;
            }
            .tm-setting-description {
                font-size: 12px;
                color: #6c757d;
                margin-top: 4px;
                text-align: left;
                margin-bottom: 0;
            }
            #tm-settings-feedback {
                margin-left: 15px; color: #28a745; font-weight: bold;
                font-size: 14px;
                transition: opacity 0.3s;
            }
            .tm-modal-footer {
                padding-top: 20px;
                margin-top: 10px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 10px;
            }
            #tm-settings-save, #tm-settings-reset {
                padding: 12px 25px;
                font-size: 16px;
                font-weight: bold;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                min-width: 220px; /* Ensure buttons have the same width */
                transition: background-color 0.2s, transform 0.1s ease-out, box-shadow 0.2s;
            }
            #tm-settings-save { background-color: var(--tm-primary-color); }
            #tm-settings-save:hover {
                background-color: var(--tm-primary-hover);
                transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            #tm-settings-reset { background-color: var(--tm-secondary-color); }
            #tm-settings-reset:hover { background-color: var(--tm-secondary-hover); }

            /* Specific Editor Styles */
            #tm-quick-search-editor .tm-quick-search-row {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
                align-items: center;
            }
            #tm-quick-search-editor input[type="text"] {
                padding: 8px;
                border: 1px solid #ccc; text-align: center;
                border-radius: 4px;
                flex: 1;
            }
            .tm-quick-search-remove-btn, #tm-quick-search-add-btn {
                padding: 5px 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                color: white;
            }
            .tm-quick-search-remove-btn { background-color: var(--tm-danger-color); }
            .tm-quick-search-remove-btn:hover { background-color: var(--tm-danger-hover); }
            #tm-quick-search-add-btn { background-color: var(--tm-primary-color); margin-top: 5px; }
            #tm-quick-search-add-btn:hover { background-color: var(--tm-primary-hover); }

            #tm-working-hours-editor {
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 5px;
                margin-top: 15px;
            }
            #tm-working-hours-time-inputs {
                display: flex;
                justify-content: center;
                gap: 10px;
                align-items: center;
                margin-bottom: 15px;
            }
            #tm-working-days-editor {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 15px;
            }
            #tm-working-days-editor label {
                font-weight: normal;
            }
            /* --- Bottom Center Controls Container --- */
            #tm-bottom-center-container {
                position: fixed;
                bottom: 50px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            /* --- Supercharged Scratchpad Styles --- */
            #tm-scratchpad-tabs-container {
                display: flex;
                background-color: #f0f0f0;
                border-bottom: 1px solid #ccc;
                padding: 5px 5px 0 5px;
            }
            #tm-scratchpad-tabs { display: flex; flex-grow: 1; gap: 2px; }
            .tm-scratchpad-tab {
                padding: 6px 10px; background: #ddd; border-radius: 5px 5px 0 0;
                cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 5px;
            }
            .tm-scratchpad-tab.active { background: #fff; font-weight: bold; }
            .tm-scratchpad-tab.pinned { border-left: 3px solid var(--tm-primary-color); }
            .tm-scratchpad-tab-pin { background: none; border: none; cursor: pointer; font-size: 12px; padding: 0 2px; opacity: 0.6; }
            .tm-scratchpad-tab-close { background: none; border: none; cursor: pointer; font-size: 14px; padding: 0 2px; }
            .tm-scratchpad-tab-close:hover { color: var(--tm-danger-color); }
            #tm-scratchpad-new-tab-btn {
                background: #ccc; border: none; border-radius: 5px 5px 0 0; padding: 0 8px;
                font-size: 16px; font-weight: bold; cursor: pointer;
            }
            #tm-scratchpad-new-tab-btn:hover { background: #bbb; }
            #tm-scratchpad-editor { flex-grow: 1; padding: 10px; overflow-y: auto; outline: none; }
            #tm-scratchpad-editor h1, #tm-scratchpad-editor h2 { margin: 0.5em 0; padding-bottom: 0.2em; border-bottom: 1px solid #eee; }
            .tm-scratchpad-checkbox { vertical-align: middle; margin: 0 2px; }
            .tm-scratchpad-source-link { font-size: 10px; text-decoration: none; background: #f0f0f0; padding: 1px 4px; border-radius: 3px; color: var(--tm-info-color); }
            .tm-scratchpad-source-link:hover { background: #e0e0e0; }
            /* --- Footer Controls Container --- */
            #tm-footer-controls-container {
                display: flex;
                align-items: center;
                justify-content: center; /* Center the items */
                gap: 15px;
            }
            #tm-footer-controls-left, #tm-footer-controls-right {
                display: flex;
                align-items: center;
                gap: 15px;
                flex-basis: 33%; /* Give each side a third of the space */
            }
            #tm-footer-controls-right { justify-content: flex-end; } /* Align right container's content to the end */

            /* --- Feature: Persistent Scratchpad --- */
            #tm-scratchpad-toggle-btn {
                background-color: var(--tm-secondary-color); /* Specific color */
            }
            #tm-scratchpad-toggle-btn:hover { background-color: var(--tm-secondary-hover); }
            #tm-scratchpad-container {
                position: fixed; /* Will be adjusted by JS */
                bottom: 60px;
                left: 20px; /* Default position */
                z-index: 9998;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: none; /* Hidden by default */
                flex-direction: column;
                width: 250px; /* Default width */
                height: 300px; /* Default height */
                resize: both; /* Allow user resizing */
                overflow: hidden; /* Important for resize */
                min-width: 150px;
                min-height: 100px;
            }
            #tm-scratchpad-header {
                background-color: #e9ecef;
                padding: 6px 10px;
                cursor: move; /* Allow dragging */
                border-bottom: 1px solid #ccc;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none; /* Prevent text selection while dragging */
                height: 32px;
                box-sizing: border-box;
            }
            #tm-scratchpad-title { font-weight: bold; font-size: 13px; color: #333; flex-grow: 1; }
            #tm-scratchpad-search {
                border: 1px solid #ccc; border-radius: 10px; padding: 2px 8px;
                font-size: 11px; width: 100px; transition: width 0.3s;
            }
            #tm-scratchpad-search:focus { width: 150px; }
            #tm-scratchpad-header-controls { display: flex; align-items: center; gap: 8px; }
            #tm-scratchpad-header-controls button {
                background: none; border: none; font-size: 16px;
                cursor: pointer; color: #555; line-height: 1;
                padding: 2px 4px; border-radius: 3px;
            }
            #tm-scratchpad-header-controls button:hover { background-color: #d4d9de; color: #000; }
            #tm-scratchpad-clear-btn:hover { color: var(--tm-danger-hover); }
            #tm-scratchpad-close-btn:hover { color: var(--tm-dark-hover); }
            #tm-scratchpad-last-edited {
                font-size: 10px; color: #6c757d; margin-left: 10px; font-style: italic;
            }
            #tm-scratchpad-reminder-popover {
                position: absolute;
                top: 35px;
                right: 10px;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 6px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 10000;
                padding: 15px;
                width: 280px;
                display: none; /* Hidden by default */
                flex-direction: column;
                gap: 10px;
            }
            #tm-scratchpad-reminder-popover h5 { margin: 0 0 10px 0; font-size: 14px; text-align: center; }
            #tm-scratchpad-reminder-popover input, #tm-scratchpad-reminder-popover select {
                width: 100%;
                padding: 8px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            #tm-scratchpad-reminder-controls { display: flex; gap: 10px; justify-content: space-between; }
            #tm-scratchpad-reminder-controls button {
                flex: 1;
                padding: 8px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                color: white;
            }
            #tm-scratchpad-set-reminder-btn { background-color: var(--tm-primary-color); }
            #tm-scratchpad-set-reminder-btn:hover { background-color: var(--tm-primary-hover); }
            #tm-scratchpad-reminder-1hr-btn { background-color: var(--tm-info-color); }
            #tm-scratchpad-reminder-1hr-btn:hover { background-color: var(--tm-info-hover); }
            #tm-scratchpad-reminder-cancel-btn { background-color: var(--tm-secondary-color); }
            #tm-scratchpad-reminder-cancel-btn:hover { background-color: var(--tm-secondary-hover); }
            #tm-scratchpad-active-reminder { font-size: 11px; color: var(--tm-success-color); font-weight: bold; margin-top: 5px; text-align: center; }
            #tm-scratchpad-clear-reminder-btn { background: none; border: none; color: var(--tm-danger-color); cursor: pointer; text-decoration: underline; font-size: 11px; }
            #tm-scratchpad-reminder-btn.active { color: var(--tm-primary-color); }
            .tm-scratchpad-popover {
                position: absolute; top: 70px; right: 10px;
                background: #fff; border: 1px solid #ccc; border-radius: 6px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 10000;
                padding: 15px; width: 200px; display: none;
            }
            .tm-scratchpad-popover h5 { margin: 0 0 10px 0; font-size: 14px; text-align: center; }
            #tm-scratchpad-template-list { display: flex; flex-direction: column; gap: 5px; }
            #tm-scratchpad-template-list button {
                padding: 8px; border: 1px solid #ccc; border-radius: 4px;
                background: #f8f9fa; cursor: pointer; text-align: left;
            }
            #tm-scratchpad-toolbar {
                background-color: #f0f0f0;
                padding: 5px;
                border-bottom: 1px solid #ccc;
                display: flex;
                gap: 5px;
                flex-wrap: wrap;
                justify-content: center;
            }
            #tm-scratchpad-toolbar button {
                background: none;
                border: 1px solid transparent; /* Add border for consistent size */
                font-size: 14px;
                cursor: pointer;
                color: #333;
                line-height: 1;
                padding: 4px 6px;
                border-radius: 4px;
                min-width: 28px; /* Ensure consistent width */
                transition: background-color 0.2s, border-color 0.2s;
            }
            #tm-scratchpad-toolbar button:hover { background-color: #d4d9de; border-color: #bbb; }
            .tm-toolbar-separator {
                width: 1px;
                background-color: #ccc;
                margin: 2px 5px;
                align-self: stretch;
            }
            /* Maximized state for scratchpad */
            #tm-scratchpad-container.maximized {
                transition: all 0.3s ease-in-out !important;
            }




            /* --- Feature: Scroll to Top Button --- */
            #tm-scroll-to-top-btn {
                position: fixed;
                bottom: 20px;
                left: 20px; /* Moved from right */
                z-index: 9997; /* Below other controls */
                background-color: var(--tm-dark-color);
                color: white;
                border: none;
                width: 32px; /* Made smaller */
                height: 32px; /* Made smaller */
                border-radius: 50%;
                font-size: 18px; /* Made smaller */
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                display: none; /* Hidden by default */
                align-items: center;
                justify-content: center;
                transition: opacity 0.3s, visibility 0.3s;
            }

            /* --- Fun Feature: Confetti --- */
            .tm-confetti-particle {
                position: fixed;
                top: 0;
                left: 0;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                animation: tm-confetti-fall 3s ease-out forwards;
            }
            @keyframes tm-confetti-fall {
                0% {
                    transform: translateY(-10vh) rotateZ(0);
                    opacity: 1;
                }
                100% {
                    transform: translateY(110vh) rotateZ(720deg);
                    opacity: 0;
                }
            }

            /* --- Feature: Achievement Notification --- */
            #tm-achievement-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--tm-success-color);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                font-size: 14px;
                font-weight: bold;
                z-index: 10000;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease-out, transform 0.5s ease-out;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #tm-achievement-notification.show {
                opacity: 1;
                transform: translateY(0);
            }

            /* --- Fun Feature: Hacker Terminal Loader --- */
            #tm-hacker-terminal {
                background-color: #000;
                color: #0f0;
                font-family: 'Courier New', monospace;
                padding: 20px;
                border-radius: 5px;
                height: 300px;
                overflow-y: hidden;
                display: flex;
                flex-direction: column;
                justify-content: flex-end; /* Start from the bottom */
            }
            #tm-hacker-output {
                font-size: 14px;
                line-height: 1.4;
                white-space: pre-wrap;
                word-break: break-all;
            }
            #tm-hacker-output div {
                opacity: 0;
                animation: tm-fade-in 0.2s forwards;
            }
            .tm-hacker-cursor {
                display: inline-block;
                width: 10px;
                height: 16px;
                background-color: #0f0;
                animation: tm-hacker-blink 1s step-end infinite;
                vertical-align: bottom;
            }
            @keyframes tm-hacker-blink {
                from, to { background-color: transparent; }
                50% { background-color: #0f0; }
            }
            #tm-hacker-output .tm-hacker-success {
                color: #0f0;
                font-weight: bold;
                background-color: #0f0;
                color: #000;
                padding: 2px 5px;
            }

            /* --- Minimalist Search Loader --- */
            .tm-minimal-loader {
                display: flex; align-items: center; justify-content: center; gap: 10px;
            }
            .tm-spinner {
                display: inline-block;
                width: 20px; height: 20px;
                border: 3px solid rgba(0,0,0,0.2);
                border-radius: 50%;
                border-top-color: var(--tm-primary-color);
                animation: tm-spin 1s ease-in-out infinite;
            }
            @keyframes tm-spin {
                to { transform: rotate(360deg); }
            }
            /* --- Fun Feature: Level Up Animation --- */
            #tm-level-up-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: #000; z-index: 20000;
                display: flex; align-items: center; justify-content: center;
                transition: opacity 1s ease-out;
                overflow: hidden; /* Hide overflowing rays */
                animation: tm-level-up-bg-fade-in 0.5s ease-out;
            }
            @keyframes tm-level-up-bg-fade-in {
                from { background: rgba(0,0,0,0.7); }
                to { background: #000; }
            }
            #tm-level-up-overlay.legendary {
                --level-up-color-1: #ffc107;
                --level-up-color-2: #e5cc80;
            }
            #tm-level-up-overlay::before, #tm-level-up-overlay::after {
                content: ''; position: absolute; top: 50%; left: 50%;
                width: 200%; height: 200%;
                background: radial-gradient(circle, var(--level-up-color-1, #007bff) 0%, transparent 40%),
                            radial-gradient(circle, var(--level-up-color-2, #17a2b8) 0%, transparent 40%);
                background-size: 20px 20px, 30px 30px;
                animation: tm-level-up-bg-spin 20s linear infinite;
                opacity: 0.3;
            }
            .tm-level-up-content {
                text-align: center; color: white;
                text-shadow: 0 0 10px #ffc107, 0 0 20px #ffc107;
                animation: tm-level-up-content-appear 0.5s ease-out forwards;
            }
            .tm-level-up-title {
                font-size: 10vw; font-weight: bold;
                animation: tm-level-up-throb 1.5s infinite, tm-level-up-slide-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                opacity: 0;
            }
            #tm-level-up-overlay.legendary .tm-level-up-content {
                border: 3px solid #e5cc80;
                border-radius: 20px;
                padding: 2vw 4vw;
                box-shadow: 0 0 30px #ffc107, inset 0 0 20px #ffc107;
            }
            .tm-level-up-new-level {
                font-size: 5vw; margin: 10px 0 20px 0;
                animation: tm-level-up-slide-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.2s forwards;
                opacity: 0;
            }
            .tm-level-up-rewards-container {
                display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;
            }
            .tm-level-up-reward {
                font-size: 2.5vw; color: #ffc107;
                background: rgba(255,255,255,0.1); padding: 5px 10px;
                border-radius: 5px; display: inline-block;
                opacity: 0;
                animation: tm-level-up-slide-in 0.6s ease-out 0.5s forwards;
            }
            /* Staggered animation for rewards */
            .tm-level-up-reward:nth-child(2) { animation-delay: 0.6s; }
            .tm-level-up-reward:nth-child(3) { animation-delay: 0.7s; }
            .tm-level-up-reward:nth-child(4) { animation-delay: 0.8s; }

            /* New: Progress Bar for level up */
            .tm-level-up-progress-bar {
                width: 80%; max-width: 400px; height: 10px;
                background: rgba(255,255,255,0.2); border-radius: 5px;
                margin: 20px auto; overflow: hidden;
            }
            .tm-level-up-progress-fill {
                width: 0%; height: 100%;
                background: linear-gradient(90deg, #ffc107, #ff8000);
                border-radius: 5px;
                transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .tm-level-up-stat-increase {
                font-size: 1.5vw; color: #eee; font-style: italic;
                margin-top: 20px;
                opacity: 0;
                animation: tm-level-up-slide-in 0.8s ease-out 1s forwards;
            }
            .tm-level-up-evolution {
                font-size: 3vw; color: #ffc107; margin-top: 20px;
                animation: tm-level-up-throb 1.5s infinite 0.5s; /* Delayed throb */
                text-shadow: 0 0 8px #fff;
            }
            @keyframes tm-level-up-bg-spin {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes tm-level-up-content-appear {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes tm-level-up-slide-in {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes tm-level-up-throb {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            /* --- New: Mascot Mood Backgrounds --- */
            #tm-mascot-container::before {
                content: ''; position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%); width: 200px; height: 200px;
                border-radius: 50%; z-index: -1; transition: all 0.8s ease-in-out;
                opacity: 0;
            }
            #tm-mascot-container.mascot-happy::before {
                background: radial-gradient(circle, rgba(255,223,186,0.6) 0%, rgba(255,223,186,0) 70%);
                opacity: 1;
            }
            #tm-mascot-container.mascot-sad::before {
                background: radial-gradient(circle, rgba(176,196,222,0.7) 0%, rgba(176,196,222,0) 70%);
                opacity: 1;
            }
            #tm-mascot-container.mascot-energized::before {
                background: radial-gradient(circle, rgba(0,191,255,0.5) 0%, rgba(0,191,255,0) 70%);
                box-shadow: 0 0 20px #00bfff, 0 0 30px #00bfff;
                opacity: 1;
            }
            /* --- Fun Feature: Interactive Mascot --- */
            #tm-mascot-container {
                position: fixed;
                top: 0;
                left: 0;
                /* The transition is now handled by the Web Animations API, so this is no longer needed for roaming. */
                /* It's kept for specific, short animations like dodging. */
                will-change: transform;

                width: 100px;
                height: 100px;
                z-index: 9990;
                pointer-events: none; /* The container itself is not clickable... */
            }
            /* ...but the robot and its panel inside are. */
            #tm-mascot-container > svg, #tm-mascot-container > #tm-mascot-interaction-panel {
                pointer-events: auto;
            }
            .tm-mascot-robot {
                width: 100%; height: 100%;
                /* Default idle animation */
                animation: tm-mascot-idle-float 4s ease-in-out infinite;
                cursor: pointer;
                image-rendering: pixelated; /* Key for the retro look */
                transition: transform 0.2s ease-out; /* For hover effect */
            }
            #tm-mascot-container .tm-mascot-eye { animation: tm-mascot-blink 5s infinite; }
            /* New: Add subtle secondary animation to the antenna */
            #tm-mascot-container .tm-mascot-antenna {
                transform-origin: 50% 15px; /* Set rotation point at the base of the antenna */
                animation: tm-mascot-antenna-sway 6s ease-in-out infinite;
            }

            #tm-mascot-container .tm-mascot-magnifying-glass { display: none; }

            .tm-mascot-flipper {
                transition: transform 0.4s ease;
                transform-origin: 50% 50%;
            }

            /* Make the pet react to hover */
            #tm-mascot-container:hover .tm-mascot-robot {
                transform: rotate(5deg) scale(1.05);
            }

            /* Mascot States */
            #tm-mascot-container.mascot-idle .tm-mascot-main-body { animation: tm-mascot-roam-fly 1.2s ease-in-out infinite; }
            #tm-mascot-container.mascot-idle .tm-mascot-eye-open,
            #tm-mascot-container.mascot-happy .tm-mascot-eye-open,
            #tm-mascot-container.mascot-sad .tm-mascot-eye-open {
                animation: tm-mascot-blink 5s steps(1, end) infinite;
            }
            #tm-mascot-container.mascot-searching .tm-mascot-robot { animation: tm-mascot-search-move 2s ease-in-out infinite; }
            #tm-mascot-container.mascot-searching .tm-mascot-magnifying-glass { display: block; }

            #tm-mascot-container.mascot-happy .tm-mascot-robot { animation: tm-mascot-happy-dance 0.8s ease-in-out infinite; }
            #tm-mascot-container.mascot-energized .tm-mascot-robot { animation: tm-mascot-glitch 0.5s infinite; }
            /* Enhanced Searching Animation */
            #tm-mascot-container.mascot-searching .tm-mascot-robot { animation: tm-mascot-search-move 2s ease-in-out infinite; }
            #tm-mascot-container.mascot-searching .tm-mascot-antenna { animation: tm-mascot-antenna-spin 1s linear infinite; }
            #tm-mascot-container.mascot-searching .tm-mascot-magnifying-glass { display: block; }
            /* Use the simpler float animation for sad/sleeping states on the main body */
            #tm-mascot-container.mascot-sad .tm-mascot-robot {
                animation: tm-mascot-idle-float 6s ease-in-out infinite;
                transform: rotate(-2deg); /* Add a slight sad tilt */
            }
            #tm-mascot-container.mascot-sleeping .tm-mascot-robot { animation: tm-mascot-idle-float 8s ease-in-out infinite; }
            #tm-mascot-container.mascot-sleeping .tm-mascot-eye-open { display: none; }
            #tm-mascot-container.mascot-sleeping .tm-mascot-eye-closed { display: block; }

            #tm-mascot-container.mascot-sad .tm-mascot-mouth-happy { display: none; }
            #tm-mascot-container.mascot-sad .tm-mascot-mouth-sad { display: block; }

            #tm-mascot-container.mascot-dodging .tm-mascot-robot { animation: tm-mascot-startled 0.4s ease-out; }

            /* New Playful States - These override the idle animation */
            #tm-mascot-container.mascot-reading .tm-mascot-main-body { animation: tm-mascot-read-book 0.5s forwards; }
            #tm-mascot-container.mascot-reading .tm-mascot-book { display: block; }

            #tm-mascot-container.mascot-biking .tm-mascot-main-body { animation: tm-mascot-ride-bike 1.5s ease-in-out; }
            #tm-mascot-container.mascot-biking .tm-mascot-bicycle { display: block; }

            #tm-mascot-container.mascot-juggling .tm-mascot-ball { display: block; animation: tm-mascot-juggle 1s ease-in-out infinite; }

            /* Mascot Animations */
            @keyframes tm-mascot-barrel-roll {
                from { transform: rotate(0deg) scale(1); }
                to { transform: rotate(360deg) scale(1.2); }
            }
            @keyframes tm-mascot-antenna-spin {
                from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes tm-mascot-glitch {
                0%, 100% { transform: translate(0, 0); }
                20% { transform: translate(-3px, 3px) rotate(-2deg); }
                40% { transform: translate(3px, -3px) rotate(2deg); }
                60% { transform: translate(-3px, -3px) rotate(1deg); }
                80% { transform: translate(3px, 3px) rotate(-1deg); }
            }
            @keyframes tm-mascot-idle-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            /* New: Keyframe for antenna sway */
            @keyframes tm-mascot-antenna-sway {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(8deg); }
            }
            @keyframes tm-mascot-blink {
                0%, 95%, 100% { transform: scaleY(1); transform-origin: center; }
                97% { transform: scaleY(0.1); transform-origin: center; }
            }
            @keyframes tm-mascot-search-move {
                0%, 100% { transform: translate(0, 0) rotate(0); }
                25% { transform: translate(5px, -5px) rotate(5deg); }
                75% { transform: translate(-5px, 0) rotate(-5deg); }
            }
            @keyframes tm-mascot-happy-dance {
                0%, 100% { transform: translateY(0) rotate(0) scale(1); }
                25% { transform: translateY(-15px) rotate(-12deg) scale(1.05); }
                50% { transform: translateY(0) rotate(0) scale(1.1); }
                75% { transform: translateY(-15px) rotate(12deg) scale(1.05); }
            }
            @keyframes tm-mascot-roam-fly {
                0%, 100% { transform: translateY(0) rotate(1deg); }
                50% { transform: translateY(-5px) rotate(-1deg); }
            }
            #tm-mascot-container.mascot-idle .tm-mascot-thruster-left,
            #tm-mascot-container.mascot-dodging .tm-mascot-thruster-left { animation: tm-mascot-thruster-anim 1.2s ease-in-out infinite 0.1s; }
            #tm-mascot-container.mascot-idle .tm-mascot-thruster-right,
            #tm-mascot-container.mascot-dodging .tm-mascot-thruster-right { animation: tm-mascot-thruster-anim 1.2s ease-in-out infinite; }
            @keyframes tm-mascot-thruster-anim {
                0%, 100% { transform: translateY(0) scaleY(1); opacity: 1; }
                50% { transform: translateY(4px) scaleY(0.8); opacity: 0.7; }
            }

            @keyframes tm-mascot-eat {
                0%, 100% { transform: scale(1); }
                20%, 80% { transform: scale(1.1) rotate(5deg); }
                50% { transform: scale(1.1) rotate(-5deg); }
            }
            @keyframes tm-mascot-startled {
                0%, 100% { transform: translate(0, 0); }
                30% { transform: translate(0, -15px) scale(1.05, 0.9); }
                60% { transform: translateY(0) scale(0.95, 1.05); }
            }
            @keyframes tm-mascot-read-book {
                to { transform: translateY(10px) rotate(15deg); }
            }
            @keyframes tm-mascot-ride-bike {
                0%, 100% { transform: translateY(0) rotate(0); }
                30% { transform: translateY(-10px) rotate(-20deg); } /* Wheelie up */
                60% { transform: translateY(-10px) rotate(-20deg); } /* Hold wheelie */
                90% { transform: translateY(0) rotate(5deg); } /* Land */
            }
            @keyframes tm-mascot-juggle {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(15px, -30px); }
                50% { transform: translate(0, 0); }
                75% { transform: translate(-15px, -30px); }
            }
            @keyframes tm-mascot-powersave-drift {
                0%, 100% { transform: translateY(0); opacity: 1; }
                50% { transform: translateY(15px); opacity: 0.7; }
            }
            @keyframes tm-mascot-eye-dim {
                0%, 100% { fill-opacity: 1; }
                50% { fill-opacity: 0.3; }
            }
            @keyframes tm-mascot-think {
                0%, 100% { transform: rotate(0); }
                50% { transform: rotate(10deg) translateY(5px); }
            }
            @keyframes tm-mascot-sparks {
                0%, 100% { opacity: 0; transform: scale(0.5); }
                50% { opacity: 1; transform: scale(1); }
            }
            #tm-mascot-container.mascot-glitching .tm-mascot-sparks { display: block; animation: tm-mascot-sparks 0.2s steps(1, end) infinite; }
            #tm-mascot-container.mascot-thinking .tm-mascot-main-body { animation: tm-mascot-think 2s ease-in-out infinite; }
            #tm-mascot-container.mascot-thinking .tm-mascot-thinking-bubble { display: block;
            }
            /* New Eureka State */
            #tm-mascot-container.mascot-eureka .tm-mascot-robot { animation: tm-mascot-barrel-roll 1s ease-out; }
            #tm-mascot-container.mascot-eureka .tm-mascot-eureka-bubble { display: block; }

            /* New Weather States */
            #tm-mascot-container.mascot-sunny .tm-mascot-sunglasses { display: block; }
            #tm-mascot-container.mascot-rainy .tm-mascot-umbrella { display: block; }

            /* New Power-Save State */
            #tm-mascot-container.mascot-powersave .tm-mascot-robot { animation: tm-mascot-powersave-drift 8s ease-in-out infinite; }
            #tm-mascot-container.mascot-powersave .tm-mascot-eye-open circle:last-child { animation: tm-mascot-eye-dim 4s ease-in-out infinite; }
            #tm-mascot-container.mascot-powersave .tm-mascot-zzz-bubble { display: block; }
            #tm-mascot-container.mascot-powersave .tm-mascot-thruster-left, #tm-mascot-container.mascot-powersave .tm-mascot-thruster-right { display: none; }





            /* Mascot Interaction Panel */
            #tm-mascot-interaction-panel {
                position: absolute;
                bottom: 110px; /* Position above the mascot */
                left: 0;
                background-color: rgba(255, 255, 255, 0.95);
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                padding: 10px;
                width: 180px;
                z-index: 9991;
                display: none; /* Hidden by default */
                flex-direction: column;
                gap: 8px;
                font-size: 12px;
            }
            .tm-pet-stat-bar {
                width: 100%; height: 14px; background-color: #e9ecef;
                border-radius: 7px; overflow: hidden; border: 1px solid #ccc;
            }
            .tm-pet-stat-bar-fill {
                height: 100%; transition: width 0.3s ease-out;
            }
            #tm-pet-happiness-bar .tm-pet-stat-bar-fill { background-color: #ffc107; } /* Yellow */
            #tm-pet-hunger-bar .tm-pet-stat-bar-fill { background-color: #28a745; } /* Green */
            .tm-pet-stat-label { font-weight: bold; margin-bottom: 2px; }
            #tm-mascot-interaction-buttons {
                display: flex;
                gap: 8px;
                margin-top: 5px;
            }
            #tm-mascot-interaction-buttons button {
                flex: 1;
                padding: 5px;
                font-size: 12px;
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
                background-color: #f8f9fa;
                transition: background-color 0.2s;
            }

            /* Mascot Speech Bubble */
            .tm-mascot-speech-bubble {
                position: absolute;
                top: -20px; /* Start position for animation */
                left: 50%;
                transform: translateX(-50%);
                background-color: white;
                border: 2px solid #333;
                border-radius: 10px;
                padding: 5px 10px;
                font-size: 12px;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                white-space: nowrap;
                z-index: 9992;
                box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
                opacity: 0;
                transition: opacity 0.3s ease-out, top 0.3s ease-out;
            }
            .tm-mascot-speech-bubble.show {
                top: -30px; /* End position */
                opacity: 1;
            }
            /* Add a little tail for the bubble */
            .tm-mascot-speech-bubble::after {
                content: '';
                position: absolute;
                bottom: -8px; left: 50%; transform: translateX(-50%);
                width: 0; height: 0; border-left: 8px solid transparent;
                border-right: 8px solid transparent; border-top: 8px solid #333;
            }
            /* XP Bar in Footer */
            #tm-xp-bar-container {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-left: 15px; /* Add some space from the stats */
                color: #fff;
                position: relative; /* For positioning the XP gain indicator */
                font-size: 12px;
            }
            /* --- New: Energized Buff Indicator --- */
            #tm-energized-buff-indicator {
                color: #00bfff; font-weight: bold;
                text-shadow: 0 0 5px #000;
                animation: tm-pulse-glow 1.5s infinite;
                --tm-warning-color: #00bfff; /* Override glow color for this element */
            }

            .tm-xp-bar {
                width: 150px; height: 12px;
                background-color: rgba(0,0,0,0.4);
                border: 1px solid #666;
                border-radius: 6px;
                overflow: hidden;
                position: relative;
            }
            #tm-xp-bar-fill {
                height: 100%; width: 0%;
                background-color: var(--tm-warning-color);
                transition: width 0.5s ease-out;
                animation: tm-pulse-glow 2.5s ease-in-out infinite;
            }
            #tm-xp-text {
                position: absolute; width: 100%; text-align: center;
                font-size: 9px; line-height: 12px; color: #000; font-weight: bold;
            }
            @keyframes tm-pulse-glow {
                0%, 100% { box-shadow: 0 0 4px var(--tm-warning-color); }
                50% { box-shadow: 0 0 12px var(--tm-warning-color), 0 0 18px var(--tm-warning-color); }
            }
            /* --- XP Gain Indicator --- */
            .tm-xp-gain-indicator {
                position: absolute;
                bottom: 20px; /* Start just above the bar */
                left: 50%;
                transform: translateX(-50%);
                color: #ffc107; /* Same as the XP bar color */
                font-weight: bold;
                font-size: 14px;
                text-shadow: 0 0 5px black;
                pointer-events: none;
                opacity: 0;
                animation: tm-xp-float-up-enhanced 1.5s ease-out forwards;
            }
            @keyframes tm-xp-float-up-enhanced {
                0% { opacity: 1; transform: translate(-50%, 0) scale(0.8); }
                20% { transform: translate(-50%, -10px) scale(1.2); }
                100% { opacity: 0; transform: translate(-50%, -50px) scale(0.5); }
            }
            /* New: Animation for the XP bar flashing on gain */
            .tm-xp-gain-flash {
                animation: tm-xp-bar-flash 0.5s ease-out;
            }
            @keyframes tm-xp-bar-flash {
                50% { box-shadow: 0 0 15px #fff, 0 0 25px #fff; }
            }
            /* New: Animation for the level text popping on gain */
            .tm-level-pop { animation: tm-level-text-pop 0.5s ease-out; }
            @keyframes tm-level-text-pop {
                50% { transform: scale(1.4); color: #ffc107; text-shadow: 0 0 8px #fff; }
            }




            /* Coin Balance in Footer */
            #tm-coin-balance {
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                background-color: rgba(0,0,0,0.4);
                padding: 4px 8px;
                border-radius: 6px;
                border: 1px solid #666;
                white-space: nowrap; /* Prevent the icon and number from wrapping */
            }

            /* --- Feature: Shop --- */
            #tm-shop-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px;
            }
            .tm-shop-tabs { display: flex; gap: 5px; margin-bottom: 15px; border-bottom: 1px solid #ccc; }
            .tm-shop-tab { padding: 8px 15px; cursor: pointer; border: 1px solid #ccc; border-bottom: none; border-radius: 5px 5px 0 0; background: #f1f1f1; }
            .tm-shop-tab.active { background: #fff; border-bottom: 1px solid #fff; margin-bottom: -1px; font-weight: bold; }
            .tm-shop-category-content {
                display: none; /* Hide all categories by default */
            }
            .tm-shop-category-content.active {
                display: block; /* Show only the active one */
            }
            .tm-shop-item {
                border: 1px solid var(--tm-shop-item-border);
                border-radius: 8px;
                padding: 10px;
                text-align: center;
                background-color: var(--tm-shop-item-bg);
                transition: background-color 0.2s, transform 0.2s;
            }
            .tm-shop-item:hover { background-color: var(--tm-shop-item-hover-bg); transform: translateY(-3px); }
            .tm-shop-item.owned { background-color: var(--tm-shop-item-owned-bg); }
            .tm-shop-item-icon { font-size: 48px; margin-bottom: 10px; }
            .tm-shop-item-name { font-weight: bold; font-size: 14px; }
            .tm-shop-item-cost { font-size: 12px; color: #6c757d; margin: 5px 0; }
            .tm-shop-item-btn {
                width: 100%; padding: 8px; border: none; border-radius: 5px;
                cursor: pointer; font-weight: bold; color: white; margin-top: 10px;
            }
            .tm-shop-item-btn.buy { background-color: var(--tm-primary-color); }
            .tm-shop-item-btn.buy:hover { background-color: var(--tm-primary-hover); }
            .tm-shop-item-btn.equip { background-color: var(--tm-success-color); }
            .tm-shop-item-btn.equip:hover { background-color: var(--tm-success-hover); }
            .tm-shop-item-btn.equipped { background-color: var(--tm-secondary-color); cursor: default; }
            .tm-shop-item-btn:disabled { background-color: #ccc; cursor: not-allowed; }

            /* --- Feature: Memory Mini-Game --- */
            #tm-memory-game-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7); z-index: 10001;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                gap: 20px;
            }
            #tm-memory-game-status {
                background: rgba(0,0,0,0.8); color: white; padding: 15px 25px;
                border-radius: 10px; font-size: 24px; font-weight: bold;
                text-align: center;
            }
            #tm-memory-game-mascot-container {
                position: relative; width: 200px; height: 200px;
            }
            #tm-memory-game-mascot-container .tm-mascot-robot {
                width: 100%; height: 100%;
            }
            .tm-memory-game-pad {
                position: absolute;
                border-radius: 50%;
                cursor: pointer;
                background: rgba(255,255,255,0.1);
                border: 2px dashed white;
                transition: background-color 0.1s;
            }
            .tm-memory-game-pad.active {
                background: rgba(255,255,255,0.8);
                transform: scale(1.1);
            }

            /* --- Feature: Bug Squish Mini-Game --- */
            #tm-game-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.2); z-index: 10001;
                cursor: crosshair;
            }
            #tm-game-ui {
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background: rgba(0,0,0,0.7); color: white; padding: 10px 20px;
                border-radius: 10px; font-size: 24px; font-weight: bold;
                display: flex; gap: 30px; z-index: 10002;
            }
            .tm-game-bug {
                position: absolute;
                font-size: 32px;
                cursor: pointer;
                user-select: none;
                transition: transform 0.2s ease-out;
                animation: tm-bug-crawl 8s linear infinite;
            }
            .tm-game-bug:hover {
                transform: scale(1.2);
            }
            .tm-game-bug.squished {
                animation: tm-bug-squish 0.3s forwards;
                pointer-events: none;
            }
            @keyframes tm-bug-squish {
                0% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(0.5) rotate(90deg); opacity: 0; }
            }
            @keyframes tm-bug-crawl {
                0% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(20px, 10px) rotate(15deg); }
                50% { transform: translate(0px, 20px) rotate(0deg); }
                75% { transform: translate(-20px, 10px) rotate(-15deg); }
                100% { transform: translate(0, 0) rotate(0deg); }
            }
            #tm-game-end-screen {
                text-align: center;
            }

            /* --- Feature: Daily Quests (Bounties) --- */
            #tm-quests-container {
                display: flex; flex-direction: column; gap: 15px; padding: 10px;
            }
            .tm-quest-item {
                display: flex; align-items: center; gap: 15px;
                background: #f8f9fa; border: 1px solid #dee2e6;
                border-radius: 8px; padding: 10px;
                transition: all 0.3s;
            }
            .tm-quest-item.completed {
                background: #e8f5e9; /* Light green */
                border-color: #a5d6a7;
                opacity: 0.7;
            }
            .tm-quest-status-icon { font-size: 24px; }
            .tm-quest-details { flex-grow: 1; }
            .tm-quest-description { font-weight: bold; font-size: 14px; margin-bottom: 5px; }
            .tm-quest-progress-bar {
                height: 8px; background: #e9ecef; border-radius: 4px;
                overflow: hidden; border: 1px solid #ccc;
            }
            .tm-quest-progress-bar div {
                height: 100%; background-color: var(--tm-success-color);
                transition: width 0.5s ease-out;
            }
            .tm-quest-item.completed .tm-quest-progress-bar div {
                background-color: #66bb6a; /* Darker green for completed */
            }
            .tm-quest-progress-text {
                font-size: 11px; color: #6c757d; text-align: right;
                margin-top: 2px;
            }
            .tm-quest-reward {
                font-weight: bold; font-size: 13px; color: #4CAF50;
                background: #f1f8e9; padding: 5px 8px; border-radius: 5px;
                white-space: nowrap;
            }
            .tm-quest-actions { display: flex; flex-direction: column; gap: 5px; }
            .tm-quest-reroll-btn { background: var(--tm-info-color); color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 14px; cursor: pointer; }
            .tm-quest-reroll-btn:hover { background: var(--tm-info-hover); }
            .tm-quest-reroll-btn:disabled { background: var(--tm-secondary-color); cursor: not-allowed; }
            #tm-reroll-token-display { font-size: 14px; font-weight: bold; color: var(--tm-info-color); margin: 0 15px; }
            .tm-quest-item.completed .tm-quest-reward {
                color: #388e3c;
                text-decoration: line-through;
            }

            /* --- Titles Modal --- */
            #tm-titles-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;
                max-height: 60vh;
                overflow-y: auto;
            }
            .tm-title-item {
                display: flex;
                align-items: center;
                gap: 15px;
                background: var(--tm-dark-color);
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 12px 15px;
                transition: all 0.2s;
            }
            .tm-title-item.locked {
                opacity: 0.5;
                filter: grayscale(60%);
            }
            .tm-title-item.unlocked {
                border-left: 4px solid var(--tm-success-color);
            }
            .tm-title-level {
                font-weight: bold;
                font-size: 14px;
                color: #fff;
                background-color: var(--tm-secondary-color);
                padding: 4px 8px;
                border-radius: 5px;
                min-width: 50px;
                text-align: center;
            }
            .tm-title-name {
                font-weight: bold;
                font-size: 16px;
                flex-grow: 1;
            }
            .tm-title-mascot-preview {
                flex-shrink: 0;
                width: 60px;
                margin-right: 15px;
            }




            /* --- Feature: Positive Message --- */
            #tm-positive-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 123, 255, 0.9);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                font-size: 20px;
                font-weight: bold;
                z-index: 10001;
                opacity: 0;
                transition: opacity 0.5s ease-out;
                pointer-events: none;
            }
        `);
    }

    // ===================================================================
    // === GLOBAL PRINTING FUNCTIONS (Accessible from anywhere)
    // ===================================================================
    /**
     * Handles the click event for any print button. Fetches the order details page
     * and opens a formatted print dialog.
     * @param {string} url The URL of the order page to print.
     * @param {HTMLButtonElement} [buttonElement=null] The button that was clicked, to provide visual feedback.
     */
    function handlePrintClick(url, buttonElement = null) {
        trackDailyStat('printOrder'); // Grant XP for printing
        if (!url) return;

        if (buttonElement) {
            buttonElement.textContent = 'Φόρτωση...';
            buttonElement.disabled = true;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const details = scrapeOrderDetails(doc);
                generatePrintPage(details);
                if (buttonElement) {
                    buttonElement.textContent = 'Εκτύπωση Παραγγελίας';
                    buttonElement.disabled = false;
                }
            },
            onerror: function(error) {
                console.error('Failed to fetch order details for printing:', error);
                alert('Αποτυχία φόρτωσης δεδομένων για εκτύπωση.');
                if (buttonElement) {
                    buttonElement.textContent = 'Εκτύπωση Παραγγελίας';
                    buttonElement.disabled = false;
                }
            }
        });
    }

    /**
     * Scrapes all relevant order details from a given order page document.
     * It tries multiple scraping strategies to be robust against HTML changes.
     * @param {Document} doc The HTML document of the order page to scrape.
     * @returns {{title: string, fields: {label: string, value: string}[]}} An object containing the order title and an array of field-label pairs.
     */
    function scrapeOrderDetails(doc) {
        console.log('[MMS] Starting scrapeOrderDetails. Analyzing fetched page...');
        const details = { title: 'Λεπτομέρειες Παραγγελίας', fields: [] };
        // Try to find a title using a few common selectors
        const titleElement = doc.querySelector('.pagetitle, h1.page-header, h1, h2');
        if (titleElement) {
            details.title = titleElement.innerText.trim();
            console.log(`[MMS] Found page title: "${details.title}"`);
        }

        const addField = (label, value) => {
            if (label && value !== null && value !== undefined && !details.fields.some(f => f.label === label)) {
                details.fields.push({ label, value: value.toString().trim() });
            }
        };

        // This new method is based on the provided HTML structure for the edit page.
        console.log('[MMS] Scraping: Using primary method (div.rnr-field).');
        doc.querySelectorAll('div.rnr-field').forEach(fieldDiv => {
            const labelEl = fieldDiv.querySelector('.rnr-label label');
            const controlEl = fieldDiv.querySelector('.rnr-control');

            if (!labelEl || !controlEl) return;

            const label = labelEl.innerText.trim();
            let value = null;

            const textInput = controlEl.querySelector('input[type="text"], input[type="Text"], input[type="number"], textarea');
            const checkboxInput = controlEl.querySelector('input[type="Checkbox"], input[type="checkbox"]');
            const readonlySpan = controlEl.querySelector('span[id^="readonly_value_"]');

            if (checkboxInput) {
                value = checkboxInput.checked ? 'Ναι' : 'Όχι';
            } else if (textInput) {
                value = textInput.value;
            } else if (readonlySpan) {
                value = readonlySpan.innerText;
            } else {
                value = controlEl.innerText.trim();
            }

            addField(label, value);
        });
        console.log(`[MMS] Scraping: Found ${details.fields.length} fields.`);

        // --- Final Check ---
        if (details.fields.length === 0) {
            console.error('[MMS] Scraping: ALL METHODS FAILED. Could not extract any details from the fetched page. Please report this issue.');
            console.error(doc.body.innerHTML);
        }

        return details;
    }

    /**
     * Generates and opens a new browser window with a print-friendly layout
     * for the provided order details.
     * @param {{title: string, fields: {label: string, value: string}[]}} details The scraped order details.
     */
    function generatePrintPage(details) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html><head><title>Εκτύπωση - ${details.title}</title>
            <style>
               @page { size: A4; margin: 15mm; }
               body {
                    font-family: Arial, sans-serif; font-size: 10px;
                    display: flex; justify-content: center; /* Horizontal centering */
                    align-items: flex-start; /* Align items to the top */
                    margin: 0; /* Reset default body margins */
                }
                .print-container {
                    width: 100%;
                }
                h1 {
                    text-align: center; color: #333; border-bottom: 1px solid #666;
                    padding-bottom: 5px; margin-bottom: 15px; font-size: 16px;
                }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                td { padding: 5px; border: 1px solid #ddd; text-align: center; }
                td.label { font-weight: bold; background-color: #f7f7f7; width: 35%; }
                td.value { width: 65%; white-space: pre-wrap; word-break: break-word; }
            </style></head><body>
            <div class="print-container">
                <h1>${details.title}</h1>
                <table>
                    ${details.fields.filter(field => field.value).map(field => `
                        <tr>
                            <td class="label">${field.label}</td>
                            <td class="value">${field.value}</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <td class="label">Ενημερώθηκε ο πελάτης</td>
                        <td class="value" style="height: 25px;">&nbsp;</td>
                    </tr>
                </table>
            </div>
            <script>
                window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; }
            </script>
            </body></html>
        `);
        printWindow.document.close();
    }

    /**
     * Finds the primary navigable link within a table row.
     * Used by multiple features to get the detail page URL for an item in a list.
     * @param {HTMLTableRowElement} row The table row element to search within.
     * @param {string} pageBaseUrl The base URL of the page, used to resolve relative links.
     * @returns {string|null} The absolute URL of the order link, or null if not found.
     */
    function findOrderLink(row, pageBaseUrl) {
        // Method 1: Check for a 'data-href' on the row itself OR a child TD. This is the most common pattern for this framework.
        let href = row.dataset.href;
        if (!href) {
            const tdWithHref = row.querySelector('td[data-href]');
            if (tdWithHref && tdWithHref.dataset.href) {
                href = tdWithHref.dataset.href;
            }
        }
        if (href && !href.startsWith('javascript:')) {
            console.log('[MMS] Link finder: Success with data-href attribute.');
            return new URL(href, pageBaseUrl).href;
        }

        // Method 2: Find any plausible link inside the row as a fallback.
        const anyLink = row.querySelector('a[href*="editid1="], a[href*="viewid1="], a[href*="edit"], a[href*="view"]');
        if (anyLink && anyLink.getAttribute('href')) {
            href = anyLink.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                 console.log('[MMS] Link finder: Success with generic fallback link.');
                 return anyLink.href;
            }
        }

        // If all methods fail, return null. The calling function should handle this.
        return null;
    }

    // ===================================================================
    // === 2. FEATURE: ADVANCED SEARCH & PRINT
    // ===================================================================
    function initSearchFeature() {
        if (!config.searchFeatureEnabled) return;

        /**
         * Creates the main container on the right side of the screen for slide-out buttons.
         * This is called early to ensure the container exists for other features.
         */
        function createRightSidePanel() {
            if (document.getElementById('tm-search-container')) return; // Already exists

            const container = document.createElement('div');
            container.id = 'tm-search-container';
            document.body.appendChild(container);
            console.log('[MMS] Right-side panel container created.');
        }
        createRightSidePanel(); // Ensure the panel exists

        // --- Feature-specific Constants ---
        const QUICK_SEARCH_HIDDEN_KEY = 'tm_quick_search_hidden';

        // --- Configuration & Constants ---
        const SEARCH_URLS = [
            '/mymanagerservice/srvorders_list.php?pagesize=-1',      // Merchandise Orders
            '/mymanagerservice/sparepartstoorder_list.php?pagesize=-1' // Spare Parts Orders
        ];
        const SEARCH_HISTORY_KEY = 'tm_search_history';
        const FAVORITE_SEARCHES_KEY = 'tm_favorite_searches';

        // State Variables
        let searchResults = []; // Holds results from a search
        let searchTerms = []; // Holds the split terms of the current query

        function createSearchModal() {
            if (document.querySelector('.tm-modal-overlay')) return; // Prevent multiple modals

            const overlay = document.createElement('div');
            overlay.className = 'tm-modal-overlay';
            overlay.classList.toggle('tm-hacker-theme-enabled', config.hackerSearchEnabled);
            overlay.innerHTML = `
                <div class="tm-modal-content">
                    <div class="tm-modal-header">
                        <h2 class="tm-modal-title">Αναζήτηση Παραγγελίας</h2>
                        <button class="tm-modal-close">&times;</button>
                    </div>
                    <div id="tm-search-input-area">
                        <input type="text" id="tm-search-input" placeholder="Αρ. Παραγγελίας, Όνομα, Ανταλλακτικό...">
                        <button id="tm-search-favorite-btn" title="Προσθήκη στα Αγαπημένα">&#9734;</button>
                        <button id="tm-search-submit">Αναζήτηση</button>
                    </div>
                    <div id="tm-search-history-favorites-container">
                        <div class="tm-search-list-section">
                            <h4>Πρόσφατες Αναζητήσεις</h4>
                            <ul id="tm-search-history-list" class="tm-search-list"></ul>
                        </div>
                        <div class="tm-search-list-section">
                            <h4>Αγαπημένες Αναζητήσεις</h4>
                            <ul id="tm-search-favorites-list" class="tm-search-list"></ul>
                        </div>
                    </div>
                    <div id="tm-results-container">
                        <div id="tm-status-message">Εισάγετε έναν όρο αναζήτησης για να ξεκινήσετε.</div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            renderHistoryAndFavorites(overlay);

            // Event Listeners
            overlay.querySelector('.tm-modal-close').addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
            overlay.querySelector('#tm-search-submit').addEventListener('click', handleSearchSubmit);

            const searchInput = overlay.querySelector('#tm-search-input');
            const favoriteBtn = overlay.querySelector('#tm-search-favorite-btn');

            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') handleSearchSubmit();
                updateFavoriteButtonState(searchInput.value, favoriteBtn);
            });

            favoriteBtn.addEventListener('click', () => {
                toggleFavoriteSearch(searchInput.value, favoriteBtn);
                renderHistoryAndFavorites(overlay); // Re-render to show changes
            });

            updateFavoriteButtonState(searchInput.value, favoriteBtn);

            // Auto-focus the input field for immediate typing
            setTimeout(() => searchInput.focus(), 100);
        }

        // --- History & Favorites Logic ---
        function getSearchHistory() { return JSON.parse(GM_getValue(SEARCH_HISTORY_KEY, '[]')); }
        function saveSearchHistory(history) { GM_setValue(SEARCH_HISTORY_KEY, JSON.stringify(history)); }

        function getFavoriteSearches() { return JSON.parse(GM_getValue(FAVORITE_SEARCHES_KEY, '[]')); }
        function saveFavoriteSearches(favorites) { GM_setValue(FAVORITE_SEARCHES_KEY, JSON.stringify(favorites)); }

        function addSearchToHistory(query) {
            if (!query) return;
            let history = getSearchHistory();
            // Remove existing instance to move it to the top
            history = history.filter(item => item !== query);
            // Add to the front
            history.unshift(query);
            // Trim to max length
            if (history.length > config.searchMaxHistory) {
                history.length = config.searchMaxHistory;
            }
            saveSearchHistory(history);
        }

        function toggleFavoriteSearch(query, starButton) {
            if (!query) return;
            let favorites = getFavoriteSearches();
            const index = favorites.indexOf(query);

            if (index > -1) { // It's already a favorite, so remove it
                favorites.splice(index, 1);
            } else { // Not a favorite, so add it
                favorites.unshift(query);
            }
            saveFavoriteSearches(favorites);
            updateFavoriteButtonState(query, starButton);
        }

        function updateFavoriteButtonState(query, starButton) {
            if (!starButton) return;
            const favorites = getFavoriteSearches();
            if (query && favorites.includes(query)) {
                starButton.innerHTML = '&#9733;'; // Solid star
                starButton.classList.add('favorited');
                starButton.title = 'Αφαίρεση από τα Αγαπημένα';
            } else {
                starButton.innerHTML = '&#9734;'; // Outline star
                starButton.classList.remove('favorited');
                starButton.title = 'Προσθήκη στα Αγαπημένα';
            }
        }

        function renderHistoryAndFavorites(modal) {
            const historyList = modal.querySelector('#tm-search-history-list');
            const favoritesList = modal.querySelector('#tm-search-favorites-list');

            historyList.innerHTML = '';
            favoritesList.innerHTML = '';

            // Render History
            const history = getSearchHistory();
            if (history.length === 0) {
                historyList.innerHTML = '<li style="color: #888; font-style: italic;">Δεν υπάρχουν πρόσφατες αναζητήσεις.</li>';
            } else {
                history.forEach(query => {
                    const li = document.createElement('li');
                    li.className = 'tm-search-list-item';
                    li.innerHTML = `<a href="#" title="Αναζήτηση για: ${query}">${query}</a>`;
                    li.querySelector('a').addEventListener('click', (e) => {
                        e.preventDefault();
                        performSearchInModal(query);
                    });
                    historyList.appendChild(li);
                });
            }

            // Render Favorites
            const favorites = getFavoriteSearches();
            if (favorites.length === 0) {
                favoritesList.innerHTML = '<li style="color: #888; font-style: italic;">Δεν υπάρχουν αγαπημένες αναζητήσεις.</li>';
            } else {
                favorites.forEach(query => {
                    const li = document.createElement('li');
                    li.className = 'tm-search-list-item';
                    li.innerHTML = `
                        <a href="#" title="Αναζήτηση για: ${query}">${query}</a>
                        <button class="tm-search-list-action-btn" title="Αφαίρεση Αγαπημένου">&#128465;</button>
                    `;
                    li.querySelector('a').addEventListener('click', (e) => { e.preventDefault(); performSearchInModal(query); });
                    li.querySelector('button').addEventListener('click', () => {
                        toggleFavoriteSearch(query, modal.querySelector('#tm-search-favorite-btn'));
                        renderHistoryAndFavorites(modal); // Re-render after removal
                    });
                    favoritesList.appendChild(li);
                });
            }
        }

        function addMainButton() {
            const container = document.getElementById('tm-search-container');
            if (!container) return;

            const button = document.createElement('button');
            button.id = 'tm-search-btn';
            button.className = 'tm-slide-out-btn';
            button.textContent = 'Αναζήτηση Παραγγελίας';
            button.addEventListener('click', createSearchModal);

            container.appendChild(button);

            // Add Daily Bounties button (Feature is not yet implemented)
            const questsButton = document.createElement('button');
            questsButton.id = 'tm-quests-btn';
            questsButton.className = 'tm-slide-out-btn';
            questsButton.innerHTML = '📜 Daily Bounties';
            questsButton.addEventListener('click', showQuestsModal);
            container.appendChild(questsButton);

            // Add Technician Stats button if on the correct page
            // This function is called on 'window.load', so the DOM is already ready.
            const isOnServiceListPage = window.location.pathname.includes('/mymanagerservice/service_list.php');
            const isView105 = new URLSearchParams(window.location.search).get('view') === '105';

            let status105Count = 0;
            if (isOnServiceListPage && isView105) {
                const gridTable = document.querySelector('table.rnr-b-grid');
                if (gridTable) {
                    const allHeaders = Array.from(gridTable.querySelectorAll('thead th'));
                    const headerTexts = allHeaders.map(th => th.innerText.trim());
                    const statusIndex = headerTexts.findIndex(text => text.includes('Κατάσταση'));

                    if (statusIndex !== -1) {
                        const rows = gridTable.querySelectorAll('tbody tr[id^="gridRow"]');
                        rows.forEach(row => {
                            const statusCell = row.cells[statusIndex];
                            // The status is inside a span with an ID like 'edit5_ccc_iStatusID'
                            const statusSpan = statusCell ? statusCell.querySelector('span[id$="_ccc_iStatusID"]') : null;
                            if (statusSpan && statusSpan.innerText.trim() === '105') {
                                status105Count++;
                            }
                        });
                    }
                }
            }

            if (config.technicianStatsEnabled && isOnServiceListPage && isView105 && status105Count >= 10) {
                const statsButton = document.createElement('button');
                statsButton.id = 'tm-tech-stats-btn';
                statsButton.innerHTML = '📊 Στατιστικά Τεχνικών';
                statsButton.className = 'tm-slide-out-btn';
                statsButton.onclick = initTechnicianStatsFeature; // Use onclick to prevent multiple listeners
                container.appendChild(statsButton);
            }
        }

        function createQuickSearchPanel() {
            if (!config.quickSearchEnabled) return;

            const phoneModel = getPhoneModelFromPage();
            console.log('[MMS] Detected phone model for quick search:', phoneModel || 'None');


            // The content of the "Spare Parts" tab is loaded dynamically.
            // We must use a MutationObserver to wait for the target element to appear.
            const observer = new MutationObserver((mutations, obs) => {
                // The target is the "Add" button inside the spare parts tab's content.
                // The tab's content is inside a div with id="detailPreview3"
                const sparePartsTabContent = document.getElementById('detailPreview3');
                if (!sparePartsTabContent) return; // Not loaded yet

                const addButton = sparePartsTabContent.querySelector('a[id^="inlineAdd"]');
                if (addButton) {
                    console.log('[MMS] Quick Search: Found the "Add" button in the spare parts tab.');

                    // Check if we've already added the container to prevent duplicates
                    if (addButton.parentElement.querySelector('#tm-quick-search-container')) {
                        obs.disconnect(); // Already added, stop observing
                        return;
                    }

                    // Create a main container for the tags
                    const container = document.createElement('div');
                    container.id = 'tm-quick-search-container';

                    const panel = document.createElement('div');
                    panel.id = 'tm-quick-search-panel';

                    config.quickSearchButtons.forEach(buttonInfo => {
                        const button = document.createElement('button');
                        const searchTerm = phoneModel ? `${phoneModel} ${buttonInfo.term}` : buttonInfo.term;

                        button.textContent = buttonInfo.label;
                        button.className = 'tm-quick-search-btn';
                        button.title = `Αναζήτηση για: "${searchTerm}"`;
                        button.dataset.term = searchTerm;
                        button.addEventListener('click', handleQuickSearchClick);
                        panel.appendChild(button);
                    });
                    container.appendChild(panel);

                    // Insert the container right after the "Add" button
                    addButton.parentElement.insertBefore(container, addButton.nextSibling);

                    obs.disconnect(); // We're done, stop observing to save resources
                }
            });

            // Start observing the document for changes to find our target
            observer.observe(document.body, { childList: true, subtree: true });
        }

        // Helper to perform a search from anywhere (e.g., history, quick actions)
        function performSearchInModal(query) {
            const modal = document.querySelector('.tm-modal-overlay');
            if (!modal) {
                // If modal isn't open, open it and then search
                createSearchModal();
                // Need to wait a moment for the modal to be in the DOM
                setTimeout(() => performSearchInModal(query), 100);
                return;
            }

            const searchInput = modal.querySelector('#tm-search-input');
            const searchButton = modal.querySelector('#tm-search-submit');

            if (searchInput && searchButton) {
                searchInput.value = query;
                searchButton.click();
            }
        }

        // --- Search Logic ---
        function handleSearchSubmit() {
            const input = document.getElementById('tm-search-input');
            const submitBtn = document.getElementById('tm-search-submit');
            const resultsContainer = document.getElementById('tm-results-container');

            const query = input.value.trim();
            if (!query) return;

            trackDailyStat('searches');
            addSearchToHistory(query);
            renderHistoryAndFavorites(document.querySelector('.tm-modal-overlay')); // Update history live

            // Split the query by spaces or commas for an "AND" search where all terms must match.
            searchTerms = query.split(/[\s,]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
            if (searchTerms.length === 0) return;

            searchResults = [];
            processedUrls.clear();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Αναζήτηση...';

            let terminalInterval = null;

            if (config.hackerSearchEnabled) {
                resultsContainer.innerHTML = `<div id="tm-hacker-terminal"><div id="tm-hacker-output"></div><span class="tm-hacker-cursor"></span></div>`;
                const hackerOutput = document.getElementById('tm-hacker-output');
                const hackerLines = [
                    'Booting MyManager All-in-One Suite v1.0...',
                    'Establishing connection to thefixers.mymanager.gr...',
                    'Connection successful. Bypassing security protocols...',
                    'Accessing main database...',
                    'Injecting search query: ' + query,
                    'Compiling data streams...',
                    'Filtering results through quantum entanglement matrix...',
                    'Parsing HTML nodes... 10%...',
                    'Parsing HTML nodes... 30%...',
                    'Parsing HTML nodes... 70%...',
                    'Decompressing data packets...',
                    'Finalizing results...',
                    '<span class="tm-hacker-success">QUERY EXECUTED SUCCESSFULLY</span>'
                ];

                let lineIndex = 0;
                terminalInterval = setInterval(() => {
                    if (lineIndex < hackerLines.length) {
                        const lineDiv = document.createElement('div');
                        lineDiv.innerHTML = hackerLines[lineIndex];
                        hackerOutput.appendChild(lineDiv);
                        hackerOutput.parentElement.scrollTop = hackerOutput.parentElement.scrollHeight;
                        lineIndex++;
                    } else {
                        clearInterval(terminalInterval);
                    }
                }, 250);
            } else {
                resultsContainer.innerHTML = `<div id="tm-status-message" class="tm-minimal-loader"><div class="tm-spinner"></div>Αναζήτηση...</div>`;
            }

            // This function will be called when the search is complete.
            const onSearchComplete = () => {
                setMascotState('idle');
                if (terminalInterval) clearInterval(terminalInterval);
                // A small delay to let the "SUCCESS" message be seen if using hacker theme
                setTimeout(displayResults, config.hackerSearchEnabled ? 500 : 0);
            };

            if (config.interactiveMascotEnabled) setMascotState('searching');
            urlsToProcess = [...SEARCH_URLS]; // Re-initialize the queue with the base URLs
            processNextUrl(onSearchComplete); // Start the search
        }

        function handleQuickSearchClick(event) {
            const term = event.target.dataset.term;
            if (!term) return;

            const baseUrl = '/mymanagerservice/products_list.php';
            // The term is already formatted (e.g., "POCO X3 GT, LCD"), so we just need to URL-encode it.
            const searchUrl = `${baseUrl}?qs=${encodeURIComponent(term)}`;

            window.open(searchUrl, '_blank');
            trackDailyStat('searches'); // Grant XP for using quick search
        }

        let urlsToProcess = [];
        let processedUrls = new Set();
        let activeSearchRequests = 0;

        // This function remains within initSearchFeature as it's specific to the search modal's operation
        function processNextUrl(onComplete) {
            if (urlsToProcess.length === 0) {
                if (onComplete) onComplete();
                return;
            }

            const url = urlsToProcess.shift();
            // If we have already processed this exact URL, skip to the next one.
            if (processedUrls.has(url)) {
                processNextUrl(onComplete);
                return;
            }
            // Mark the URL as processed *before* the request to avoid race conditions.
            // where a page might be added to the queue multiple times.
            processedUrls.add(url);

            activeSearchRequests++; // Increment for the new request
            console.log(`Searching in: ${url} for terms:`, searchTerms);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    parseAndSearchPage(doc, response.finalUrl);
                    activeSearchRequests--; // Decrement after processing
                    // Process the next URL in the queue if there is one
                    if (urlsToProcess.length > 0) {
                        processNextUrl(onComplete);
                    } else if (activeSearchRequests === 0) {
                        // Only call onComplete when all requests are finished
                        if (onComplete) onComplete();
                    }
                },
                onerror: function(error) {
                    console.error(`Error fetching ${url}:`, error);
                    activeSearchRequests--; // Decrement on error too
                    if (urlsToProcess.length > 0) processNextUrl(onComplete);
                }
            });
        }

        // This function remains within initSearchFeature as it's specific to the search modal's operation
        function parseAndSearchPage(doc, pageBaseUrl) {
            doc.querySelectorAll('.pagination a').forEach(a => {
                const pageHref = a.getAttribute('href');
                if (pageHref && !pageHref.startsWith('javascript:')) {
                    const absoluteUrl = new URL(pageHref, pageBaseUrl).href;
                    if (!processedUrls.has(absoluteUrl)) {
                        urlsToProcess.push(absoluteUrl);
                    }
                }
            });

            doc.querySelectorAll('tbody tr').forEach(row => {
                const rowText = row.innerText.toLowerCase();
                // Check if the row text includes ALL search terms (AND logic)
                const allTermsMatch = searchTerms.every(term => rowText.includes(term));

                if (allTermsMatch) {
                    const linkUrl = findOrderLink(row, pageBaseUrl);

                    if (linkUrl && !searchResults.some(r => r.orderLink === linkUrl)) {
                        searchResults.push({
                            term: document.getElementById('tm-search-input').value.trim(),
                            rowHTML: row.innerHTML,
                            orderLink: linkUrl
                        });
                    }
                }
            });
        }

        // --- Results & Printing ---
        function toggleOrderDetails(result, itemDiv) {
            console.log('[MMS] Toggling details for:', result);
            const existingDetails = itemDiv.querySelector('.tm-result-details-container');

            // If details are already visible, remove them to collapse the view.
            if (existingDetails) {
                existingDetails.remove();
                return;
            }

            console.log('[MMS] Creating details container and fetching from:', result.orderLink);
            // Create a container and show a loading message.
            const detailsContainer = document.createElement('div');
            detailsContainer.className = 'tm-result-details-container';
            detailsContainer.innerHTML = '<div class="tm-details-loading">Φόρτωση λεπτομερειών...</div>';
            itemDiv.appendChild(detailsContainer);

            GM_xmlhttpRequest({
                method: 'GET',
                url: result.orderLink,
                onload: function(response) {
                    console.log('[MMS] Successfully fetched order details page.');
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const details = scrapeOrderDetails(doc);
                    console.log('[MMS] Scraped details object:', details);

                    let detailsHTML = '<table class="tm-details-table">';
                    details.fields.forEach(field => {
                        detailsHTML += `
                                <tr>
                                    <td class="tm-details-label">${field.label}</td>
                                    <td class="tm-details-value">${field.value}</td>
                                </tr>`;
                    });
                    detailsHTML += '</table>';
                    detailsContainer.innerHTML = detailsHTML;

                },
                onerror: function(error) {
                    console.error('[MMS] Failed to fetch order details:', error);
                    detailsContainer.innerHTML = '<div class="tm-details-error">Αποτυχία φόρτωσης λεπτομερειών.</div>';
                }
            });
        }

        function displayResults() {
            const resultsContainer = document.getElementById('tm-results-container');
            const submitBtn = document.getElementById('tm-search-submit');
            const input = document.getElementById('tm-search-input');

            if (searchResults.length === 0) {
                resultsContainer.innerHTML = `<div id="tm-status-message">Δεν βρέθηκαν αποτελέσματα για "${input.value}". Δοκιμάστε ξανά.</div>`;
            } else {
                if (config.confettiEnabled) triggerConfetti(30); // Fun: Confetti on successful search
                resultsContainer.innerHTML = '';
                searchResults.forEach((result, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'tm-result-item';

                    // Highlight all search terms
                    let highlightedHTML = result.rowHTML;
                    searchTerms.forEach(term => {
                        const regex = new RegExp(term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
                        highlightedHTML = highlightedHTML.replace(regex, `<span class="tm-result-highlight">$&</span>`);
                    });

                    itemDiv.innerHTML = `
                        <div class="tm-result-header">
                            <span>Αποτέλεσμα #${index + 1} (Βρέθηκε για: ${result.term})</span>
                            <div>
                                ${result.orderLink ? `<a href="${result.orderLink}" target="_blank" class="tm-goto-btn">Μετάβαση στην Παραγγελία</a>` : ''}
                                ${result.orderLink ? `<button class="tm-print-btn" data-link="${result.orderLink}">Εκτύπωση Παραγγελίας</button>` : ''}
                            </div>
                        </div>
                        <div class="tm-result-body">
                            <table class="tm-result-table">${highlightedHTML}</table>
                        </div>
                    `;
                    resultsContainer.appendChild(itemDiv);

                    // Make the result body clickable if it has an order link
                    if (result.orderLink) {
                        const resultBody = itemDiv.querySelector('.tm-result-body');
                        console.log(`[MMS] Result #${index + 1}: Found orderLink: ${result.orderLink}. Attaching click listener.`);
                        if (resultBody) {
                            resultBody.classList.add('tm-result-clickable');
                            resultBody.title = 'Κάντε κλικ για εμφάνιση/απόκρυψη λεπτομερειών';
                            resultBody.addEventListener('click', () => {
                                toggleOrderDetails(result, itemDiv);
                            });
                        }
                    } else {
                        console.warn(`[MMS] Result #${index + 1}: No orderLink found. Not making clickable. Row HTML:`, result.rowHTML);
                    }
                });

                resultsContainer.querySelectorAll('.tm-print-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const url = e.target.dataset.link;
                        handlePrintClick(url, e.target);
                    });
                });
            }

            submitBtn.disabled = false;
            submitBtn.textContent = 'Αναζήτηση';
        }

        // New function for adding print button to edit pages
        function addPrintButtonToEditPage() {
            const buttonsLeftContainer = document.querySelector('.rnr-buttons-left');
            if (!buttonsLeftContainer || document.querySelector('.tm-print-page-btn')) {
                console.warn('[MMS] Could not find .rnr-buttons-left container for print button.');
                return;
            }

            const printButton = document.createElement('a'); // Using 'a' for consistent styling with other buttons
            printButton.className = 'rnr-button main tm-print-page-btn'; // Reusing rnr-button main for consistent look
            printButton.style.marginLeft = '10px'; // Add some spacing

            printButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                handlePrintClick(window.location.href, printButton);
            });

            buttonsLeftContainer.appendChild(printButton);
            printButton.textContent = 'Εκτύπωση Παραγγελίας';
            printButton.href = '#'; // Prevent actual navigation
            console.log('[MMS] Print button added to edit page.');
        }

        // --- Feature Initializer ---
        const pathname = window.location.pathname;
        const isEditPage = pathname.includes('_edit.php');

        if (isEditPage && pathname.includes('/mymanagerservice/service_edit.php')) {
            createQuickSearchPanel();
        } else if (isEditPage) {
            addPrintButtonToEditPage();
        } else if (pathname.includes('_list.php')) {
            // On non-edit pages (list pages), just add the main search button.
            addMainButton();
        }
    }

    // ===================================================================
    // === 3. FEATURE: AUTO-REFRESH
    // ===================================================================
    function initRefreshFeature(parentContainer) {
        if (!config.autoRefreshEnabled) {
            console.log('[MMS] Auto-refresh is disabled in settings.');
            return;
        }

        // --- Configuration ---
        const REFRESH_INTERVAL_MINUTES = config.refreshIntervalMinutes;
        const REFRESH_INTERVAL_MS = REFRESH_INTERVAL_MINUTES * 60 * 1000;

        let countdownInterval = null;
        let refreshTimeout = null;

        // --- UI Creation ---
        function createTimerUI() {
            const container = document.createElement('div');
            container.id = 'tm-refresh-timer-container';

            const textSpan = document.createElement('span');
            textSpan.id = 'tm-refresh-countdown-text';

            const cancelButton = document.createElement('button');
            cancelButton.id = 'tm-refresh-cancel-btn';
            cancelButton.textContent = 'Ακύρωση';

            cancelButton.addEventListener('click', () => {
                clearTimeout(refreshTimeout);
                if (countdownInterval) clearInterval(countdownInterval);
                container.innerHTML = 'Η αυτόματη ανανέωση ακυρώθηκε.';
                console.log('Auto-refresh cancelled by user.');
                setTimeout(() => container.remove(), 3000);
            });

            container.appendChild(textSpan);
            container.appendChild(cancelButton);
            parentContainer.appendChild(container);

            if (isWorkingHours()) {
                let timeLeft = REFRESH_INTERVAL_MS;
                countdownInterval = setInterval(() => {
                    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
                    const seconds = Math.floor((timeLeft / 1000) % 60);
                    textSpan.textContent = `Ανανέωση σε: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    timeLeft -= 1000;
                }, 1000);
            } else {
                textSpan.textContent = 'Εκτός ωραρίου - σε παύση.';
                cancelButton.style.display = 'none';
            }
        }

        // --- Logic ---
        createTimerUI();
        console.log(`Page will auto-refresh in ${REFRESH_INTERVAL_MINUTES} minutes.`);
        if (isWorkingHours()) { refreshTimeout = setTimeout(() => {
            // Check again right before refreshing to handle cases where the page was left open.
            if (isWorkingHours()) {
                console.log('Refreshing page now...');
                window.location.reload();
            } else {
                console.log('Working hours ended. Auto-refresh will not occur.');
                const timerContainer = document.getElementById('tm-refresh-timer-container');
                if (timerContainer) {
                    timerContainer.innerHTML = 'Η αυτόματη ανανέωση τέθηκε σε παύση εκτός ωραρίου.';
                    setTimeout(() => timerContainer.remove(), 5000);
                }
            }
        }, REFRESH_INTERVAL_MS); }
    }

    // ===================================================================
    // === 4. FEATURE: SETTINGS PANEL
    // ===================================================================

    function loadSettings() {
        config = { ...DEFAULTS }; // Start with defaults
        Object.keys(DEFAULTS).forEach(key => {
            const savedValue = GM_getValue(key);
            if (savedValue !== undefined) {
                // If it's a JSON string, parse it.
                if (typeof DEFAULTS[key] === 'object' && typeof savedValue === 'string') {
                    try {
                        config[key] = JSON.parse(savedValue);
                    } catch (e) {
                        console.error(`[MMS] Failed to parse saved setting for ${key}, using default.`);
                    }
                } else {
                    config[key] = savedValue;
                }
            }
        });

        const savedButtons = GM_getValue('quickSearchButtons');
        if (savedButtons) {
            try {
                config.quickSearchButtons = JSON.parse(savedButtons);
            } catch (e) {
                console.error("[MMS] Error parsing saved quick search buttons, using defaults.", e);
            }
        }
        console.log('[MMS] Settings loaded:', config);
    }

    function updateMascotAppearanceByLevel(level) {
        const base = document.getElementById('tm-mascot-base');
        const evo1 = document.getElementById('tm-mascot-evo1');
        const evo2 = document.getElementById('tm-mascot-evo2');
        const evo3 = document.getElementById('tm-mascot-evo3');
        const evo4 = document.getElementById('tm-mascot-evo4');

        if (!base || !evo1 || !evo2 || !evo3 || !evo4) return;

        // Hide all forms first
        base.style.display = 'none';
        evo1.style.display = 'none';
        evo2.style.display = 'none';
        evo3.style.display = 'none';
        evo4.style.display = 'none';

        if (level >= 100) evo4.style.display = 'block';
        else if (level >= 50) evo3.style.display = 'block';
        else if (level >= 25) evo2.style.display = 'block';
        else if (level >= 10) evo1.style.display = 'block';
        else base.style.display = 'block';
    }
    /**
     * Initializes the settings button and the settings modal panel.
     * @param {HTMLElement} parentContainer The container element to which the settings button will be appended.
     */
    function initSettingsPanel(parentContainer) {

        function resetSettings() {
            if (!confirm('Είστε σίγουροι; Όλες οι ρυθμίσεις θα επανέλθουν στις αρχικές τους τιμές και η σελίδα θα ανανεωθεί.')) {
                 return;
            }

             const ALL_STORAGE_KEYS = [
                // Settings
                ...Object.keys(DEFAULTS),
                STORAGE_KEYS.USER_REROLL_TOKENS,
                // Search Feature State
                'tm_search_history', 'tm_favorite_searches',
                // Scratchpad State
                'tm_user_scratchpad_text', 'tm_user_scratchpad_geometry', 'tm_user_scratchpad_is_open', 'tm_user_scratchpad_font_size', 'tm_user_scratchpad_last_edited', 'tm_user_scratchpad_is_maximized', // Old keys for cleanup
                STORAGE_KEYS.SCRATCHPAD_NOTES, STORAGE_KEYS.SCRATCHPAD_ACTIVE_NOTE_ID, STORAGE_KEYS.SCRATCHPAD_TEMPLATES,
                // Fun Features State
                STORAGE_KEYS.USER_XP, STORAGE_KEYS.USER_LEVEL, STORAGE_KEYS.ACHIEVEMENTS, STORAGE_KEYS.PET_STATS, STORAGE_KEYS.USER_COINS, STORAGE_KEYS.PURCHASED_ITEMS, STORAGE_KEYS.EQUIPPED_ITEM, STORAGE_KEYS.EQUIPPED_THEME, STORAGE_KEYS.DAILY_QUESTS,
                STORAGE_KEYS.USER_TITLE,
            ];
            // Also reset shop/coin keys
            ALL_STORAGE_KEYS.push(STORAGE_KEYS.USER_TALENT_POINTS, STORAGE_KEYS.UNLOCKED_TALENTS);
            ALL_STORAGE_KEYS.push(STORAGE_KEYS.USER_NOTIFICATIONS);
            ALL_STORAGE_KEYS.forEach(key => GM_deleteValue(key));
            alert('Οι ρυθμίσεις επανήλθαν. Η σελίδα θα ανανεωθεί τώρα.');
            window.location.reload();
        }

        function saveSettings() {
            const feedback = document.getElementById('tm-settings-feedback');
            feedback.textContent = ''; // Clear previous feedback

            // --- Helper to save a checkbox setting ---
            const saveCheckbox = (id, key) => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    const value = checkbox.checked;
                    GM_setValue(key, value);
                    config[key] = value;
                }
            };

            // --- Helper to save a number setting ---
            const saveNumber = (id, key) => {
                const input = document.getElementById(id);
                if (input) {
                    const value = parseInt(input.value, 10);
                    if (!isNaN(value) && value >= (input.min || 0)) {
                        GM_setValue(key, value);
                        config[key] = value;
                    }
                }
            };

            // --- Save General UI Settings ---
            saveCheckbox('tm-setting-debug-enabled', 'debugEnabled');
            saveCheckbox('tm-setting-login-page-enabled', 'customLoginPageEnabled');
            saveCheckbox('tm-setting-dashboard-enabled', 'dashboardWidgetEnabled');
            saveCheckbox('tm-setting-scroll-top-enabled', 'scrollToTopEnabled');
            saveCheckbox('tm-setting-tech-stats-enabled', 'technicianStatsEnabled');
            saveCheckbox('tm-setting-customer-history-enabled', 'customerHistoryEnabled');
            saveCheckbox('tm-setting-automated-parts-search-enabled', 'automatedPartsSearchEnabled');

            // --- Save Auto-Refresh settings ---
            saveCheckbox('tm-setting-autorefresh-enabled', 'autoRefreshEnabled');
            const startHourInput = document.getElementById('tm-setting-wh-start');
            const endHourInput = document.getElementById('tm-setting-wh-end');

            const newStartHour = parseInt(startHourInput.value, 10);
            const newEndHour = parseInt(endHourInput.value, 10);
            if (!isNaN(newStartHour) && newStartHour >= 0 && newStartHour < 24) {
                GM_setValue('workingHoursStart', newStartHour);
                config.workingHoursStart = newStartHour;
            }
            if (!isNaN(newEndHour) && newEndHour > 0 && newEndHour <= 24) {
                GM_setValue('workingHoursEnd', newEndHour);
                config.workingHoursEnd = newEndHour;
            }

            // Save Working Days
            const newWorkingDays = [];
            document.querySelectorAll('.tm-working-day-checkbox:checked').forEach(cb => {
                newWorkingDays.push(parseInt(cb.value, 10));
            });
            GM_setValue('workingDays', JSON.stringify(newWorkingDays));
            config.workingDays = newWorkingDays;

            // Save Refresh Interval
            saveNumber('tm-setting-refresh-interval', 'refreshIntervalMinutes');

            // --- Save Search Settings ---
            saveCheckbox('tm-setting-search-enabled', 'searchFeatureEnabled');
            saveCheckbox('tm-setting-hacker-search-enabled', 'hackerSearchEnabled');
            saveNumber('tm-setting-search-history-max', 'searchMaxHistory');
            saveCheckbox('tm-setting-quick-search-enabled', 'quickSearchEnabled');

            // --- Save Scratchpad Settings ---
            saveCheckbox('tm-setting-scratchpad-enabled', 'scratchpadEnabled');

            // --- Save Gamification/Fun Settings ---
            saveCheckbox('tm-setting-levelup-enabled', 'levelUpSystemEnabled');
            saveCheckbox('tm-setting-mascot-enabled', 'interactiveMascotEnabled');
            saveCheckbox('tm-setting-confetti-enabled', 'confettiEnabled');
            saveNumber('tm-setting-mascot-speed', 'mascotRoamingSpeed');

            // --- Save Mascot Settings ---
            const weatherLocationInput = document.getElementById('tm-setting-weather-location');
            if (weatherLocationInput && weatherLocationInput.value.trim()) {
                const newLocation = weatherLocationInput.value.trim();
                GM_setValue('weatherLocation', newLocation);
                config.weatherLocation = newLocation;
                sessionStorage.removeItem('tm_weather_fetched'); // Allow weather to be re-fetched on next load
            }

            // --- Save Quick Search Buttons ---
            const newButtons = [];
            document.querySelectorAll('#tm-quick-search-editor .tm-quick-search-row').forEach(row => {
                const labelInput = row.querySelector('input[data-type="label"]');
                const termInput = row.querySelector('input[data-type="term"]');
                if (labelInput.value.trim() && termInput.value.trim()) {
                    newButtons.push({
                        label: labelInput.value.trim(),
                        term: termInput.value.trim()
                    });
                }
            });
            GM_setValue('quickSearchButtons', JSON.stringify(newButtons));
            config.quickSearchButtons = newButtons;

            // --- Save Scratchpad Templates ---
            const newTemplates = [];
            document.querySelectorAll('#tm-scratchpad-templates-editor .tm-template-row').forEach(row => {
                const titleInput = row.querySelector('input[data-type="title"]');
                const contentInput = row.querySelector('textarea[data-type="content"]');
                if (titleInput.value.trim() && contentInput.value.trim()) {
                    newTemplates.push({
                        id: row.dataset.id || `template_${Date.now()}`,
                        title: titleInput.value.trim(),
                        content: contentInput.value.trim()
                    });
                }
            });
            GM_setValue(STORAGE_KEYS.SCRATCHPAD_TEMPLATES, JSON.stringify(newTemplates));

            // --- Save Scratchpad Settings ---
            saveCheckbox('tm-setting-scratchpad-enabled', 'scratchpadEnabled');

            // --- Save Gamification/Fun Settings ---
            saveCheckbox('tm-setting-levelup-enabled', 'levelUpSystemEnabled');
            saveCheckbox('tm-setting-mascot-enabled', 'interactiveMascotEnabled');
            saveCheckbox('tm-setting-confetti-enabled', 'confettiEnabled');

            console.log('[MMS] Settings saved:', config);
            // Reload the page so settings apply immediately
            showPositiveMessage('Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς!');
            try { window.location.reload(); } catch (_) {}
        }

        // --- Settings Modal HTML Generators (for better readability) ---
        function getGeneralUISettingsHTML() {
            // Merged General and Login settings
            return `
                <div class="tm-settings-section">
                    <h3>Γενικές Ρυθμίσεις</h3>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label">
                            <label for="tm-setting-login-page-enabled">Προσαρμοσμένη Σελίδα Σύνδεσης</label>
                            <p class="tm-setting-description">Αντικαθιστά την προεπιλεγμένη σελίδα σύνδεσης με μια μινιμαλιστική έκδοση.</p>
                        </div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-login-page-enabled"></div>
                    </div>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-setting-dashboard-enabled">Εμφάνιση Widget "Σήμερα"</label></div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-dashboard-enabled"></div>
                    </div>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-setting-scroll-top-enabled">Εμφάνιση Κουμπιού "Scroll to Top"</label></div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-scroll-top-enabled"></div>
                    </div>
                    <div class="tm-setting-row" style="background: #fffbe6; padding-top: 10px; padding-bottom: 10px; border: 1px solid #ffe58f; border-radius: 5px;">
                        <div class="tm-setting-label">
                            <label for="tm-setting-debug-enabled">Ενεργοποίηση Debug Mode</label>
                            <p class="tm-setting-description">Ενεργοποιεί επιλογές για testing και δωρεάν αντικείμενα στο κατάστημα.</p>
                        </div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-debug-enabled"></div>
                    </div>
                </div>
            `;
        }

        function getDebugSettingsHTML() {
            return `
                <div class="tm-settings-section">
                    <h3>🔧 Εργαλεία Debug</h3>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-debug-level-input">Ορισμός Level</label></div>
                        <div class="tm-setting-control"><input type="number" id="tm-debug-level-input" min="1" value="${GM_getValue(STORAGE_KEYS.USER_LEVEL, 1)}"><button id="tm-debug-set-level-btn">Set</button></div>
                    </div>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-debug-xp-input">Προσθήκη XP</label></div>
                        <div class="tm-setting-control"><input type="number" id="tm-debug-xp-input" value="100"><button id="tm-debug-add-xp-btn">Add</button></div>
                    </div>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-debug-coins-input">Προσθήκη Coins</label></div>
                        <div class="tm-setting-control"><input type="number" id="tm-debug-coins-input" value="1000"><button id="tm-debug-add-coins-btn">Add</button></div>
                    </div>
                </div>
            `;
        }

        function showShopModal() {
            if (document.querySelector('#tm-shop-modal')) return; // Prevent multiple modals

            const overlay = document.createElement('div');
            overlay.className = 'tm-modal-overlay';
            overlay.id = 'tm-shop-modal';
            overlay.innerHTML = `
                <div class="tm-modal-content" style="max-width: 700px;">
                    <div class="tm-modal-header">
                        <h2 class="tm-modal-title">🪙 Shop</h2>
                        <button class="tm-modal-close">&times;</button>
                    </div>
                    <div id="tm-shop-content-container" style="flex-grow: 1; overflow-y: auto; padding: 10px;">
                        <div class="tm-shop-tabs">
                            <button class="tm-shop-tab active" data-category="themes">🎨 Themes</button>
                            <button class="tm-shop-tab" data-category="accessories">🎩 Accessories</button>
                            <button class="tm-shop-tab" data-category="consumables">⚡ Consumables</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('.tm-modal-close').addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

            populateShop(); // Populate the content

            // Add tab switching logic
            const tabsContainer = overlay.querySelector('.tm-shop-tabs');
            tabsContainer.addEventListener('click', (e) => {
                if (e.target.matches('.tm-shop-tab')) {
                    const category = e.target.dataset.category;
                    // Update tab active state
                    tabsContainer.querySelectorAll('.tm-shop-tab').forEach(tab => tab.classList.remove('active'));
                    e.target.classList.add('active');
                    // Update content active state
                    overlay.querySelectorAll('.tm-shop-category-content').forEach(content => content.classList.remove('active'));
                    overlay.querySelector(`#tm-shop-category-${category}`).classList.add('active');
                }
            });

            // --- Shop Logic ---
            overlay.querySelector('#tm-shop-container')?.addEventListener('click', (e) => {
                if (e.target.matches('.tm-shop-item-btn')) {
                    if (e.target.classList.contains('buy')) {
                        handleShopPurchase(e.target); // This function is already defined and handles purchases
                    } else if (e.target.classList.contains('equip')) {
                        const button = e.target;
                        const itemId = button.dataset.itemId;
                        const itemType = button.dataset.itemType;

                        // Equip logic
                        if (itemType === 'accessory') {
                            const equippedItem = GM_getValue(STORAGE_KEYS.EQUIPPED_ITEM, null);
                            if (equippedItem) {
                                let oldAccessory;
                                // Handle special cases for unequipping
                                switch (equippedItem) {
                                    case 'bookworm_kit': oldAccessory = document.querySelector('.tm-mascot-book'); break;
                                    case 'stunt_bike': oldAccessory = document.querySelector('.tm-mascot-bicycle'); break;
                                    case 'juggling_balls': oldAccessory = document.querySelector('.tm-mascot-ball'); break;
                                    case 'cool_shades': oldAccessory = document.querySelector('.tm-mascot-sunglasses'); break;
                                    case 'rainy_day_umbrella': oldAccessory = document.querySelector('.tm-mascot-umbrella'); break;
                                    default: oldAccessory = document.getElementById(equippedItem);
                                }
                                if (oldAccessory) oldAccessory.style.display = 'none';
                            }
                            GM_setValue(STORAGE_KEYS.EQUIPPED_ITEM, itemId);
                            let newAccessory;
                            // Handle special cases for equipping
                            switch (itemId) {
                                case 'bookworm_kit': newAccessory = document.querySelector('.tm-mascot-book'); break;
                                case 'stunt_bike': newAccessory = document.querySelector('.tm-mascot-bicycle'); break;
                                case 'juggling_balls': newAccessory = document.querySelector('.tm-mascot-ball'); break;
                                case 'cool_shades': newAccessory = document.querySelector('.tm-mascot-sunglasses'); break;
                                case 'rainy_day_umbrella': newAccessory = document.querySelector('.tm-mascot-umbrella'); break;
                                default: newAccessory = document.getElementById(itemId);
                            }
                            if (newAccessory) newAccessory.style.display = 'block';
                        } else if (itemType === 'theme') {
                            applyTheme(itemId);
                        }
                        populateShop(); // Re-render shop to update buttons
                    }
                }
            });
        }

        function getSearchSettingsHTML() {
            return `
                <div class="tm-settings-section">
                    <h3>Προηγμένη Αναζήτηση</h3>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-setting-search-enabled">Ενεργοποίηση Προηγμένης Αναζήτησης</label></div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-search-enabled"></div>
                    </div>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label">
                            <label for="tm-setting-hacker-search-enabled">Ενεργοποίηση "Hacker" Θέματος Αναζήτησης</label>
                            <p class="tm-setting-description">Εμφανίζει μια animation τερματικού κατά την αναζήτηση.</p>
                        </div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-hacker-search-enabled"></div>
                    </div>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-setting-search-history-max">Μέγεθος Ιστορικού Αναζητήσεων</label></div>
                        <div class="tm-setting-control"><input type="number" id="tm-setting-search-history-max" min="0" max="50"></div>
                    </div>
                </div>
                <div class="tm-settings-section">
                    <h3>Γρήγορη Αναζήτηση & Εργαλεία</h3>
                     <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-setting-quick-search-enabled">Ενεργοποίηση Κουμπιών Γρήγορης Αναζήτησης</label></div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-quick-search-enabled"></div>
                    </div>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-setting-tech-stats-enabled">Ενεργοποίηση Στατιστικών Τεχνικών</label></div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-tech-stats-enabled"></div>
                    </div>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-setting-customer-history-enabled">Ενεργοποίηση Ιστορικού Πελάτη</label></div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-customer-history-enabled"></div>
                    </div>
                </div>`;
        }

        function getAutoRefreshSettingsHTML() {
            return `
                <div class="tm-settings-section">
                    <h3>Αυτόματη Ανανέωση</h3>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label">
                            <label for="tm-setting-autorefresh-enabled">Ενεργοποίηση Αυτόματης Ανανέωσης</label>
                            <p class="tm-setting-description">Ανανεώνει αυτόματα τις σελίδες λίστας.</p>
                        </div>
                        <div class="tm-setting-control">
                            <input type="checkbox" id="tm-setting-autorefresh-enabled" ${config.autoRefreshEnabled ? 'checked' : ''}>
                        </div>
                    </div>
                    <div id="tm-autorefresh-options">
                        <div class="tm-setting-row">
                            <div class="tm-setting-label">
                                <label for="tm-setting-refresh-interval">Διάστημα Ανανέωσης</label>
                                <p class="tm-setting-description">Ορίστε το διάστημα σε λεπτά.</p>
                            </div>
                            <div class="tm-setting-control">
                                <input type="number" id="tm-setting-refresh-interval" value="${config.refreshIntervalMinutes}" min="1" max="120">
                                <span>λεπτά</span>
                            </div>
                        </div>
                        <div id="tm-working-hours-editor">
                            <p class="tm-setting-description" style="text-align:center; margin-bottom:10px;">Ενεργό μόνο τις παρακάτω ώρες και ημέρες:</p>
                            <div id="tm-working-hours-time-inputs">
                                <label for="tm-setting-wh-start">Από:</label>
                                <input type="number" id="tm-setting-wh-start" value="${config.workingHoursStart}" min="0" max="23">
                                <label for="tm-setting-wh-end">Έως:</label>
                                <input type="number" id="tm-setting-wh-end" value="${config.workingHoursEnd}" min="1" max="24">
                            </div>
                            <div id="tm-working-days-editor"></div>
                        </div>
                    </div>
                </div>
            `;
        }

        function getQuickSearchEditorHTML() {
            return `
                <div class="tm-settings-section">
                    <h3>Επεξεργαστής Γρήγορης Αναζήτησης</h3>
                    <p class="tm-setting-description">Προσαρμόστε τα κουμπιά που εμφανίζονται στις σελίδες επεξεργασίας παραγγελιών για γρήγορες αναζητήσεις ανταλλακτικών. Η 'Ετικέτα' είναι αυτό που εμφανίζει το κουμπί, και ο 'Όρος Αναζήτησης' είναι η λέξη-κλειδί που αναζητά.</p>
                    <div id="tm-quick-search-editor" style="padding: 0 10px;"></div>
                    <button id="tm-quick-search-add-btn" style="margin-top: 15px;">Προσθήκη Νέου Κουμπιού</button>
                </div>
            `;
        }

        function getScratchpadTemplatesEditorHTML() {
            return `
                <div class="tm-settings-section">
                    <h3>Πρότυπα Σημειωματαρίου</h3>
                    <p class="tm-setting-description">Δημιουργήστε πρότυπα για γρήγορη εισαγωγή στο σημειωματάριο. Χρήσιμο για checklists ή επαναλαμβανόμενες σημειώσεις.</p>
                    <div id="tm-scratchpad-templates-editor" style="padding: 0 10px;"></div>
                    <button id="tm-scratchpad-template-add-btn" style="margin-top: 15px;">Προσθήκη Νέου Προτύπου</button>
                </div>
            `;
        }

        function getScratchpadSettingsHTML() {
            return `
                <div class="tm-settings-section">
                    <h3>Σημειωματάριο</h3>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-setting-scratchpad-enabled">Ενεργοποίηση Σημειωματαρίου</label></div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-scratchpad-enabled"></div>
                    </div>
                </div>
                ${getScratchpadTemplatesEditorHTML()}
            `;
        }

        function getLevelUpSettingsHTML() {
            return `
                <div class="tm-settings-section">
                    <h3>Gamification</h3>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-setting-levelup-enabled">Ενεργοποίηση Συστήματος Level-Up</label><p class="tm-setting-description">Κερδίστε XP και ανεβείτε level ολοκληρώνοντας εργασίες.</p></div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-levelup-enabled"></div>
                    </div>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-setting-confetti-enabled">Ενεργοποίηση Εφέ Confetti</label></div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-confetti-enabled"></div>
                    </div>
                </div>`;
        }

        function getMascotSettingsHTML() {
            return `
                <div class="tm-settings-section">
                    <h3>🤖 Mascot</h3>
                    <div class="tm-setting-row">
                        <div class="tm-setting-label"><label for="tm-setting-mascot-enabled">Ενεργοποίηση Mascot</label><p class="tm-setting-description">Εμφανίζει έναν διαδραστικό βοηθό στην οθόνη.</p></div>
                        <div class="tm-setting-control"><input type="checkbox" id="tm-setting-mascot-enabled"></div>
                    </div>
                <div class="tm-setting-row">
                    <div class="tm-setting-label">
                        <label for="tm-setting-weather-location">Τοποθεσία Καιρού</label>
                        <p class="tm-setting-description">Ορίστε την τοποθεσία για την αντίδραση του mascot στον καιρό (π.χ., "Athens, GR").</p>
                    </div>
                    <div class="tm-setting-control">
                        <input type="text" id="tm-setting-weather-location" style="width: 150px; text-align: left; padding: 8px;">
                    </div>
                </div>
                <div class="tm-setting-row">
                    <div class="tm-setting-label">
                        <label for="tm-setting-mascot-speed">Ταχύτητα Περιπλάνησης</label>
                        <p class="tm-setting-description">Ορίστε την ταχύτητα κίνησης του mascot (pixels ανά δευτερόλεπτο).</p>
                    </div>
                    <div class="tm-setting-control">
                        <input type="number" id="tm-setting-mascot-speed" min="25" max="500" step="25">
                    </div>
                </div>
                </div>`;
        }

        function getTalentsHTML() {
            const talentPoints = GM_getValue(STORAGE_KEYS.USER_TALENT_POINTS, 0);
            const unlockedTalents = JSON.parse(GM_getValue(STORAGE_KEYS.UNLOCKED_TALENTS, '[]'));

            const talentsGrid = TALENT_TREE.map(talent => {
                const isUnlocked = unlockedTalents.includes(talent.id);
                const canAfford = talentPoints >= talent.cost;
                let buttonHTML;

                if (isUnlocked) {
                    buttonHTML = `<button class="tm-talent-btn unlocked" disabled>Unlocked</button>`;
                } else {
                    buttonHTML = `<button class="tm-talent-btn unlockable" data-talent-id="${talent.id}" ${!canAfford ? 'disabled' : ''}>Unlock (${talent.cost} TP)</button>`;
                }

                return `
                    <div class="tm-talent-item ${isUnlocked ? 'unlocked' : ''}">
                        <div class="tm-talent-name">${talent.name}</div>
                        <div class="tm-talent-description">${talent.description}</div>
                        ${buttonHTML}
                    </div>
                `;
            }).join('');

            return `
                <div class="tm-settings-section">
                    <h3>🌟 Talents</h3>
                    <div class="tm-talent-points-display">Διαθέσιμοι Πόντοι Talent: <span>${talentPoints}</span></div>
                    <p class="tm-setting-description">Ξοδέψτε πόντους που κερδίζετε από τα level up για να ξεκλειδώσετε μόνιμα passive bonuses.</p>
                    <div id="tm-talents-grid">${talentsGrid}</div>
                </div>
            `;
        }

        function getDataManagementHTML() {
            return `
                <div class="tm-settings-section">
                    <h3>💾 Διαχείριση Δεδομένων</h3>
                    <p class="tm-setting-description">Εξάγετε την πρόοδό σας (levels, coins, ρυθμίσεις, κ.λπ.) σε ένα αρχείο για backup ή για μεταφορά σε άλλο browser. Η εισαγωγή θα αντικαταστήσει τα τρέχοντα δεδομένα.</p>
                    <div class="tm-data-actions">
                        <button id="tm-export-data-btn" class="tm-data-btn export">Export Data</button>
                        <button id="tm-import-data-btn" class="tm-data-btn import">Import Data</button>
                    </div>
                </div>
            `;
        }

        function handleExportData() {
            const backupData = {};
            const keysToBackup = [
                ...Object.keys(DEFAULTS), // All config keys
                ...Object.values(STORAGE_KEYS) // All dynamic data keys
            ];

            keysToBackup.forEach(key => {
                const value = GM_getValue(key);
                if (value !== undefined) {
                    backupData[key] = value;
                }
            });

            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            const today = new Date().toISOString().slice(0, 10);
            a.download = `MyManagerSuite_Backup_${today}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showPositiveMessage('Data exported successfully!');
        }

        function handleImportData() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = readerEvent => {
                    try {
                        const importedData = JSON.parse(readerEvent.target.result);

                        // Basic validation
                        if (typeof importedData.USER_XP === 'undefined' && typeof importedData.autoRefreshEnabled === 'undefined') {
                            throw new Error('Μη έγκυρη μορφή αρχείου backup.');
                        }

                        if (!confirm('Are you sure you want to import this data? All current progress and settings will be overwritten.')) {
                            return;
                        }

                        Object.keys(importedData).forEach(key => {
                            GM_setValue(key, importedData[key]);
                        });

                        alert('Τα δεδομένα εισήχθησαν με επιτυχία! Η σελίδα θα ανανεωθεί για να εφαρμοστούν οι αλλαγές.');
                        window.location.reload();

                    } catch (error) {
                        alert(`Σφάλμα κατά την εισαγωγή δεδομένων: ${error.message}`);
                        console.error('[MMS] Import failed:', error);
                    }
                };

                reader.readAsText(file);
            };

            input.click();
        }

        function populateShop() {
            const contentContainer = document.getElementById('tm-shop-content-container');
            if (!contentContainer) return;

            // Define categories
            const categories = {
                themes: [],
                accessories: [],
                consumables: []
            };

            // Sort all items into categories
            Object.keys(UI_THEMES).forEach(id => categories.themes.push({ id, ...UI_THEMES[id], type: 'theme' }));
            categories.accessories.push(
                { id: 'top_hat', name: 'Top Hat', icon: '🎩', cost: 250, type: 'accessory' },
                { id: 'cool_shades', name: 'Cool Shades', icon: '😎', cost: 350, type: 'accessory' },
                { id: 'rainy_day_umbrella', name: 'Rainy Day Umbrella', icon: '☂️', cost: 350, type: 'accessory' },
                { id: 'bookworm_kit', name: 'Bookworm Kit', icon: '📚', cost: 300, type: 'accessory' },
                { id: 'stunt_bike', name: 'Stunt Bike', icon: '🚲', cost: 750, type: 'accessory' },
                { id: 'juggling_balls', name: 'Juggling Balls', icon: '🤹', cost: 400, type: 'accessory' }
            );
            categories.consumables.push(
                { id: 'reroll_token', name: 'Bounty Reroll Token', icon: '🔄', cost: 100, type: 'consumable' },
                { id: 'energized_drink', name: 'Energized Drink', icon: '⚡️', cost: 150, type: 'consumable' },
                { id: 'double_coins_voucher', name: 'Double Coins Voucher', icon: '💰', cost: 200, type: 'consumable' },
                { id: 'happiness_snack', name: 'Happiness Snack', icon: '💖', cost: 50, type: 'consumable' },
                { id: 'confetti_bomb', name: 'Confetti Bomb', icon: '🎉', cost: 25, type: 'consumable' }
            );

            const purchasedItems = JSON.parse(GM_getValue(STORAGE_KEYS.PURCHASED_ITEMS, '[]'));
            const equippedItem = GM_getValue(STORAGE_KEYS.EQUIPPED_ITEM, null);
            let currentCoins = GM_getValue(STORAGE_KEYS.USER_COINS, 0);

            contentContainer.innerHTML = ''; // Clear previous items

            // Create content for each category
            for (const category in categories) {
                const categoryContent = document.createElement('div');
                categoryContent.id = `tm-shop-category-${category}`;
                categoryContent.className = 'tm-shop-category-content';
                if (category === 'themes') categoryContent.classList.add('active'); // Make first tab active

                const shopGrid = document.createElement('div');
                shopGrid.id = 'tm-shop-container'; // Keep the ID for the event listener

                categories[category].forEach(item => {
                    const isOwned = purchasedItems.includes(item.id);
                    const isEquipped = (item.type === 'accessory' && equippedItem === item.id) || (item.type === 'theme' && config.equippedTheme === item.id);

                    const itemDiv = document.createElement('div');
                    itemDiv.className = `tm-shop-item ${isOwned || (config.debugEnabled && item.type !== 'consumable') ? 'owned' : ''}`;
                    itemDiv.innerHTML = `
                        <div class="tm-shop-item-icon">${item.icon}</div>
                        <div class="tm-shop-item-name">${item.name}</div>
                        <div class="tm-shop-item-cost">${(isOwned && item.type !== 'consumable') ? 'Αγορασμένο' : (config.debugEnabled ? '🪙 0 (Free)' : `🪙 ${item.cost}`)}</div>
                        <button class="tm-shop-item-btn" data-item-id="${item.id}" data-item-cost="${item.cost}" data-item-type="${item.type}"></button>
                    `;

                    const button = itemDiv.querySelector('.tm-shop-item-btn');
                    if (isOwned || (config.debugEnabled && item.type !== 'consumable')) {
                        button.textContent = isEquipped ? 'Εξοπλισμένο' : 'Εξόπλισε';
                        button.className += isEquipped ? ' equipped' : ' equip';
                        if (isEquipped) button.disabled = true;
                    } else {
                        button.textContent = config.debugEnabled ? 'Get (Free)' : 'Αγόρασε';
                        button.className += ' buy';
                        if (!config.debugEnabled && currentCoins < item.cost) button.disabled = true;
                    }
                    shopGrid.appendChild(itemDiv);
                });
                categoryContent.appendChild(shopGrid);
                contentContainer.appendChild(categoryContent);
            }
        }

        function handleShopPurchase(button) {
            const itemId = button.dataset.itemId;
            const itemCost = parseInt(button.dataset.itemCost, 10);
            const itemType = button.dataset.itemType;

            let currentCoins = GM_getValue(STORAGE_KEYS.USER_COINS, 0);
            if (!config.debugEnabled && currentCoins < itemCost) {
                alert('Δεν έχετε αρκετά Fixer-Coins!');
                return;
            }

            if (!config.debugEnabled) {
                currentCoins -= itemCost;
                GM_setValue(STORAGE_KEYS.USER_COINS, currentCoins);
                updateCoinBalanceUI(currentCoins);
            }

            if (itemType === 'consumable' && itemId === 'reroll_token') {
                const currentTokens = GM_getValue(STORAGE_KEYS.USER_REROLL_TOKENS, 0);
                GM_setValue(STORAGE_KEYS.USER_REROLL_TOKENS, currentTokens + 1);
            } else if (itemType === 'consumable') {
                // Handle immediate use of other consumables
                switch (itemId) {
                    case 'energized_drink':
                        triggerEnergizedState(15 * 60 * 1000); // 15 minutes
                        break;
                    case 'double_coins_voucher':
                        GM_setValue(STORAGE_KEYS.DOUBLE_COINS_BUFF_EXPIRES, Date.now() + (10 * 60 * 1000)); // 10 minutes
                        showPositiveMessage('Double Coins active for 10 mins!');
                        break;
                    case 'happiness_snack':
                        updatePetStats(100, 0); // Max out happiness
                        setMascotState('happy', 3000);
                        break;
                    case 'confetti_bomb':
                        triggerConfetti(200);
                        break;
                }
            } else {
                let purchased = JSON.parse(GM_getValue(STORAGE_KEYS.PURCHASED_ITEMS, '[]'));
                if (!purchased.includes(itemId)) purchased.push(itemId);
                GM_setValue(STORAGE_KEYS.PURCHASED_ITEMS, JSON.stringify(purchased));
            }

            showPositiveMessage('Αγορά επιτυχής!');
            populateShop(); // Re-render the shop
        }

        function createSettingsModal() {
            const overlay = document.createElement('div');
            overlay.className = 'tm-modal-overlay';
            overlay.innerHTML = `
                <div class="tm-modal-content">
                    <div class="tm-modal-header">
                        <h2 class="tm-modal-title">Ρυθμίσεις MyManager Suite</h2>
                        <button class="tm-modal-close">&times;</button>
                    </div>
                    <div class="tm-settings-layout">
                        <aside class="tm-settings-sidebar">
                            <ul class="tm-nav">
                                <li><a href="#sec-general">Γενικές</a></li>
                                <li><a href="#sec-search">Αναζήτηση & Εργαλεία</a></li>
                                <li><a href="#sec-autorefresh">Αυτόματη Ανανέωση</a></li>
                                <li><a href="#sec-scratchpad">Σημειωματάριο</a></li>
                                <li><a href="#sec-gamification">Gamification</a></li>
                                <li><a href="#sec-data">Δεδομένα & Backup</a></li>
                                <li style="display: none;" data-debug-only="true"><a href="#sec-debug">🔧 Debug</a></li>
                            </ul>
                        </aside>
                        <main class="tm-settings-main" id="tm-settings-content">
                            <section id="sec-general">${getGeneralUISettingsHTML()}</section>
                            <section id="sec-search">${getSearchSettingsHTML()}</section>
                            <section id="sec-autorefresh">${getAutoRefreshSettingsHTML()}</section>
                            <section id="sec-scratchpad">${getScratchpadSettingsHTML()}</section>
                            <section id="sec-gamification">${getLevelUpSettingsHTML()}${getMascotSettingsHTML()}${getTalentsHTML()}</section>
                            <section id="sec-debug">${getDebugSettingsHTML()}</section>
                            <section id="sec-data">${getDataManagementHTML()}</section>
                        </main>
                    </div>
                    <div class="tm-modal-footer">
                        <span id="tm-settings-feedback"></span>
                        <button id="tm-settings-reset">Επαναφορά</button>
                        <button id="tm-settings-save">Αποθήκευση Ρυθμίσεων</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            // Event Listeners
            overlay.querySelector('.tm-modal-close').addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
            overlay.querySelector('#tm-settings-save').addEventListener('click', saveSettings);
            overlay.querySelector('#tm-settings-reset').addEventListener('click', resetSettings);
            overlay.querySelector('#tm-export-data-btn')?.addEventListener('click', handleExportData);
            overlay.querySelector('#tm-import-data-btn')?.addEventListener('click', handleImportData);

            // Sidebar nav -> tabs
            try {
                const links = overlay.querySelectorAll('.tm-settings-sidebar .tm-nav a');
                const sections = overlay.querySelectorAll('.tm-settings-main section');
                const debugTab = overlay.querySelector('[data-debug-only="true"]');
                const shopLink = Array.from(links).find(a => a.getAttribute('href') === '#sec-shop');

                function activate(id) {
                    sections.forEach(sec => sec.classList.toggle('active', '#' + sec.id === id));
                    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
                }
                links.forEach(a => {
                    a.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        const id = a.getAttribute('href');
                        activate(id);
                    });
                });
                // Special handling for debug tab
                if (debugTab) {
                    debugTab.style.display = config.debugEnabled ? 'block' : 'none';
                }
                // default active first
                if (links.length) activate(links[0].getAttribute('href'));
            } catch(_) {}

            // Talent unlock logic - Attach listener to the main content area for delegation
            const settingsContent = overlay.querySelector('#tm-settings-content');
            if (settingsContent) {
                initDebugControls(); // Initialize debug button listeners
                settingsContent.addEventListener('click', handleTalentUnlock);
            }

            // --- Populate Checkboxes ---
            const populateCheckbox = (id, key) => {
                const checkbox = document.getElementById(id);
                if (checkbox) checkbox.checked = config[key];
            };
            populateCheckbox('tm-setting-debug-enabled', 'debugEnabled');
            populateCheckbox('tm-setting-login-page-enabled', 'customLoginPageEnabled');
            populateCheckbox('tm-setting-dashboard-enabled', 'dashboardWidgetEnabled');
            populateCheckbox('tm-setting-scroll-top-enabled', 'scrollToTopEnabled');
            populateCheckbox('tm-setting-tech-stats-enabled', 'technicianStatsEnabled');
            populateCheckbox('tm-setting-search-enabled', 'searchFeatureEnabled');
            populateCheckbox('tm-setting-hacker-search-enabled', 'hackerSearchEnabled');
            populateCheckbox('tm-setting-quick-search-enabled', 'quickSearchEnabled');
            populateCheckbox('tm-setting-scratchpad-enabled', 'scratchpadEnabled');
            populateCheckbox('tm-setting-levelup-enabled', 'levelUpSystemEnabled');
            populateCheckbox('tm-setting-mascot-enabled', 'interactiveMascotEnabled');
            populateCheckbox('tm-setting-confetti-enabled', 'confettiEnabled');
            populateCheckbox('tm-setting-customer-history-enabled', 'customerHistoryEnabled');

            document.getElementById('tm-setting-weather-location').value = config.weatherLocation;
            document.getElementById('tm-setting-mascot-speed').value = config.mascotRoamingSpeed;
            document.getElementById('tm-setting-search-history-max').value = config.searchMaxHistory;

            // Logic for the new checkbox
            const checkbox = overlay.querySelector('#tm-setting-autorefresh-enabled');
            const optionsDiv = overlay.querySelector('#tm-autorefresh-options');

            checkbox.checked = config.autoRefreshEnabled;
            optionsDiv.style.display = config.autoRefreshEnabled ? 'block' : 'none';

            checkbox.addEventListener('change', () => {
                optionsDiv.style.display = checkbox.checked ? 'block' : 'none';
            });

            // --- Populate Working Hours Editor ---
            const whDaysEditor = overlay.querySelector('#tm-working-days-editor');
            const daysOfWeek = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
            daysOfWeek.forEach((day, index) => {
                const isChecked = config.workingDays.includes(index);
                whDaysEditor.innerHTML += `
                    <span>
                        <input type="checkbox" class="tm-working-day-checkbox" id="day-${index}" value="${index}" ${isChecked ? 'checked' : ''}>
                        <label for="day-${index}" style="display: inline; font-weight: normal;">${day}</label>
                    </span>
                `;
            });

            // --- Populate and manage Quick Search Editor ---
            const editorContainer = overlay.querySelector('#tm-quick-search-editor');

            function renderQuickSearchRows() {
                editorContainer.innerHTML = ''; // Clear existing rows
                config.quickSearchButtons.forEach((button) => {
                    addNewQuickSearchRow(button.label, button.term);
                });
            }

            function addNewQuickSearchRow(label = '', term = '') {
                const row = document.createElement('div');
                row.className = 'tm-quick-search-row';
                row.innerHTML = `
                    <input type="text" placeholder="Ετικέτα (π.χ., Οθόνη)" data-type="label" value="${label}">
                    <input type="text" placeholder="Όρος Αναζήτησης (π.χ., LCD)" data-type="term" value="${term}">
                    <button class="tm-quick-search-remove-btn" title="Αφαίρεση Κουμπιού">&times;</button>
                `;
                editorContainer.appendChild(row);
                row.querySelector('.tm-quick-search-remove-btn').addEventListener('click', (e) => {
                    e.target.closest('.tm-quick-search-row').remove();
                });
            }

            overlay.querySelector('#tm-quick-search-add-btn').addEventListener('click', (e) => {
                e.preventDefault();
                addNewQuickSearchRow();
            });

            // --- Populate and manage Scratchpad Templates Editor ---
            const templatesEditorContainer = overlay.querySelector('#tm-scratchpad-templates-editor');
            const savedTemplates = JSON.parse(GM_getValue(STORAGE_KEYS.SCRATCHPAD_TEMPLATES, '[]'));

            function renderScratchpadTemplateRows() {
                templatesEditorContainer.innerHTML = ''; // Clear existing rows
                savedTemplates.forEach(template => {
                    addNewScratchpadTemplateRow(template);
                });
            }

            function addNewScratchpadTemplateRow(template = { id: '', title: '', content: '' }) {
                const row = document.createElement('div');
                row.className = 'tm-template-row';
                row.dataset.id = template.id;
                row.style.marginBottom = '15px';
                row.innerHTML = `
                    <input type="text" placeholder="Τίτλος Προτύπου" data-type="title" value="${template.title}" style="width: 100%; padding: 8px; box-sizing: border-box; margin-bottom: 5px;">
                    <textarea placeholder="Περιεχόμενο Προτύπου..." data-type="content" style="width: 100%; min-height: 80px; padding: 8px; box-sizing: border-box; font-family: monospace;">${template.content}</textarea>
                    <button class="tm-template-remove-btn" title="Αφαίρεση Προτύπου" style="background: var(--tm-danger-color); color: white; border: none; border-radius: 4px; cursor: pointer; float: right; margin-top: 5px;">&times;</button>
                `;
                templatesEditorContainer.appendChild(row);
                row.querySelector('.tm-template-remove-btn').addEventListener('click', (e) => {
                    e.target.closest('.tm-template-row').remove();
                });
            }

            overlay.querySelector('#tm-scratchpad-template-add-btn').addEventListener('click', (e) => {
                e.preventDefault();
                addNewScratchpadTemplateRow();
            });

            renderScratchpadTemplateRows();
            renderQuickSearchRows(); // Initial render
        }

        function initDebugControls() {
            if (!config.debugEnabled) return;

            document.getElementById('tm-debug-set-level-btn')?.addEventListener('click', () => {
                const newLevel = parseInt(document.getElementById('tm-debug-level-input').value, 10);
                if (newLevel > 0) { GM_setValue(STORAGE_KEYS.USER_LEVEL, newLevel); GM_setValue(STORAGE_KEYS.USER_XP, 0); showPositiveMessage(`Level set to ${newLevel}.`); updateXpBarUI(newLevel, 0, getXpForLevel(newLevel)); }
            });
            document.getElementById('tm-debug-add-xp-btn')?.addEventListener('click', () => {
                const xpToAdd = parseInt(document.getElementById('tm-debug-xp-input').value, 10); if (xpToAdd) grantXp(xpToAdd);
            });
            document.getElementById('tm-debug-add-coins-btn')?.addEventListener('click', () => {
                const coinsToAdd = parseInt(document.getElementById('tm-debug-coins-input').value, 10); if (coinsToAdd) grantCoins(coinsToAdd);
            });
        }
        function handleTalentUnlock(e) {
            if (!e.target.matches('.tm-talent-btn.unlockable')) return;

            const button = e.target;
            const talentId = button.dataset.talentId;
            const talent = TALENT_TREE.find(t => t.id === talentId);

            if (talent) {
                let talentPoints = GM_getValue(STORAGE_KEYS.USER_TALENT_POINTS, 0);
                if (talentPoints >= talent.cost) {
                    talentPoints -= talent.cost;
                    GM_setValue(STORAGE_KEYS.USER_TALENT_POINTS, talentPoints);

                    let unlockedTalents = JSON.parse(GM_getValue(STORAGE_KEYS.UNLOCKED_TALENTS, '[]'));
                    unlockedTalents.push(talentId);
                    GM_setValue(STORAGE_KEYS.UNLOCKED_TALENTS, JSON.stringify(unlockedTalents));

                    // Re-render the talents section
                    document.getElementById('sec-talents').innerHTML = getTalentsHTML();
                }
            }
        }
        function addSettingsButton() {
            // --- Notification Bell ---
            const bellWrapper = document.createElement('div');
            bellWrapper.id = 'tm-notification-bell-wrapper';
            bellWrapper.innerHTML = `
                <button id="tm-notification-bell-btn" title="Notifications">🔔</button>
                <span id="tm-notification-unread-count">0</span>
            `;
            parentContainer.appendChild(bellWrapper);
            bellWrapper.querySelector('#tm-notification-bell-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the outside click listener from firing immediately
                toggleNotificationPanel();
            });
            updateNotificationBadge(); // Initial check

            const button = document.createElement('button');
            button.id = 'tm-settings-btn';
            button.innerHTML = '&#9881;'; // Gear icon
            button.title = 'Ρυθμίσεις MyManager Suite';
            button.addEventListener('click', createSettingsModal);
            parentContainer.appendChild(button);

            const coinBalance = document.createElement('div');
            coinBalance.id = 'tm-coin-balance';
            coinBalance.title = 'Fixer-Coins (Click to open Shop)';
            coinBalance.style.cursor = 'pointer';
            coinBalance.addEventListener('click', showShopModal);
            parentContainer.appendChild(coinBalance);
            updateCoinBalanceUI(GM_getValue(STORAGE_KEYS.USER_COINS, 0));

            // This button seems unused, so I'm commenting it out for now.
            // const wordCloudButton = document.createElement('button');
            // wordCloudButton.id = 'tm-word-cloud-btn';
            // wordCloudButton.className = 'tm-slide-out-btn';
            // wordCloudButton.textContent = '☁️ Word Cloud Σήμερα';
        }

        // Initializer for settings
        addSettingsButton();
    }

    // ===================================================================
    // === 4a. FEATURE: NOTIFICATION CENTER
    // ===================================================================
    function createNotification(message, icon = '🔔') {
        let notifications = JSON.parse(GM_getValue(STORAGE_KEYS.USER_NOTIFICATIONS, '[]'));

        const newNotification = {
            id: `notif_${Date.now()}`,
            message: message,
            icon: icon,
            timestamp: Date.now(),
            read: false
        };

        notifications.unshift(newNotification);

        // Keep the list to a reasonable size (e.g., 30)
        if (notifications.length > 30) {
            notifications.length = 30;
        }

        GM_setValue(STORAGE_KEYS.USER_NOTIFICATIONS, JSON.stringify(notifications));
        updateNotificationBadge();
    }

    function updateNotificationBadge() {
        const badge = document.getElementById('tm-notification-unread-count');
        if (!badge) return;

        const notifications = JSON.parse(GM_getValue(STORAGE_KEYS.USER_NOTIFICATIONS, '[]'));
        const unreadCount = notifications.filter(n => !n.read).length;

        badge.textContent = unreadCount;
        badge.classList.toggle('visible', unreadCount > 0);
    }

    function toggleNotificationPanel() {
        let panel = document.getElementById('tm-notification-panel');
        if (panel) {
            panel.remove();
            return;
        }

        panel = document.createElement('div');
        panel.id = 'tm-notification-panel';

        const notifications = JSON.parse(GM_getValue(STORAGE_KEYS.USER_NOTIFICATIONS, '[]'));
        let listHTML = '';

        if (notifications.length === 0) {
            listHTML = '<div id="tm-notification-empty-state">No notifications yet!</div>';
        } else {
            listHTML = notifications.map(n => `
                <div class="tm-notification-item ${n.read ? '' : 'unread'}">
                    <div class="tm-notification-icon">${n.icon}</div>
                    <div class="tm-notification-content">
                        <div class="tm-notification-message">${n.message}</div>
                        <div class="tm-notification-timestamp">${new Date(n.timestamp).toLocaleString('el-GR')}</div>
                    </div>
                </div>
            `).join('');
        }

        panel.innerHTML = `
            <div class="tm-notification-header">
                <h4>Notifications</h4>
                <button id="tm-mark-all-read-btn">Mark all as read</button>
            </div>
            <div id="tm-notification-list">${listHTML}</div>
        `;

        document.getElementById('tm-notification-bell-wrapper').appendChild(panel);

        // Mark all as read logic
        panel.querySelector('#tm-mark-all-read-btn').addEventListener('click', () => {
            let notifs = JSON.parse(GM_getValue(STORAGE_KEYS.USER_NOTIFICATIONS, '[]'));
            notifs.forEach(n => n.read = true);
            GM_setValue(STORAGE_KEYS.USER_NOTIFICATIONS, JSON.stringify(notifs));
            updateNotificationBadge();
            toggleNotificationPanel(); // Close and re-open to refresh view
            setTimeout(toggleNotificationPanel, 10);
        });

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', (e) => { if (!panel.contains(e.target) && e.target.closest('#tm-notification-bell-btn') === null) panel.remove(); }, { once: true });
        }, 0);
    }
    // ===================================================================
    // === 5. FEATURE: PERSISTENT SCRATCHPAD
    // ===================================================================
    /**
     * Initializes the persistent scratchpad feature, which includes a draggable,
     * resizable text area whose content and geometry are saved.
     */
    function initScratchpadFeature() {
        if (!config.scratchpadEnabled) return;

        const SCRATCHPAD_STORAGE_KEY_IS_MAXIMIZED = 'tm_user_scratchpad_is_maximized'; // For maximized state

        // --- UI Creation ---
        // 1. Create the Scratchpad Panel
        const container = document.createElement('div');
        container.id = 'tm-scratchpad-container';
        container.innerHTML = `
            <div id="tm-scratchpad-tabs-container">
                <div id="tm-scratchpad-tabs"></div>
                <button id="tm-scratchpad-new-tab-btn" title="Νέα Σημείωση">+</button>
            </div>
            <div id="tm-scratchpad-header">
                <span id="tm-scratchpad-title">Σημειωματάριο</span>
                <div id="tm-scratchpad-header-controls">
                    <input type="search" id="tm-scratchpad-search" placeholder="Αναζήτηση...">
                    <span id="tm-scratchpad-last-edited" style="display:none;"></span>
                    <button id="tm-scratchpad-template-btn" title="Εισαγωγή Προτύπου">📋</button>
                    <button id="tm-scratchpad-reminder-btn" title="Ορισμός Υπενθύμισης">🔔</button>
                    <button id="tm-scratchpad-clear-btn" title="Καθαρισμός τρέχουσας σημείωσης">&#128465;</button>
                    <button id="tm-scratchpad-font-size-down" title="Μείωση Μεγέθους Γραμματοσειράς">A-</button>
                    <button id="tm-scratchpad-font-size-up" title="Αύξηση Μεγέθους Γραμματοσειράς">A+</button>
                    <button id="tm-scratchpad-maximize-btn" title="Μεγιστοποίηση/Επαναφορά">&#x26F6;</button>
                    <button id="tm-scratchpad-close-btn" title="Κλείσιμο Σημειωματαρίου">&times;</button>
                </div>
            </div>
            <div id="tm-scratchpad-toolbar">
                <!-- Group 1: Lists -->
                <button data-command="insertUnorderedList" title="Bulleted List">●</button>
                <button data-command="insertOrderedList" title="Numbered List">1.</button>
                <div class="tm-toolbar-separator"></div>
                <!-- Group 2: Block Styles -->
                <button data-command="formatBlock" data-value="h1" title="Heading 1">H1</button>
                <button data-command="formatBlock" data-value="p" title="Paragraph">P</button>
                <div class="tm-toolbar-separator"></div>
                <!-- Group 3: Inline Styles -->
                <button data-command="bold" title="Bold (Ctrl+B)"><b>B</b></button>
                <button data-command="italic" title="Italic (Ctrl+I)"><i>I</i></button>
                <button data-command="underline" title="Underline (Ctrl+U)"><u>U</u></button>
                <button data-command="strikeThrough" title="Strikethrough"><s>S</s></button>
                <div class="tm-toolbar-separator"></div>
                <!-- Group 4: Actions -->
                <button data-command="createLink" title="Insert Link">🔗</button>
                <button data-command="removeFormat" title="Clear Formatting">🧹</button>
            </div>
            <div id="tm-scratchpad-editor" contenteditable="true" spellcheck="false" placeholder="Προσωρινές σημειώσεις..."></div>
            <div id="tm-scratchpad-reminder-popover">
                <h5>Ορισμός Υπενθύμισης</h5>
                <input type="text" id="tm-scratchpad-reminder-text" placeholder="Τι να σας θυμίσω;">
                <input type="datetime-local" id="tm-scratchpad-reminder-datetime">
                <select id="tm-scratchpad-reminder-recurrence">
                    <option value="none">Χωρίς επανάληψη</option>
                    <option value="daily">Καθημερινά</option>
                    <option value="weekly">Εβδομαδιαία</option>
                </select>
                <div id="tm-scratchpad-reminder-controls">
                    <button id="tm-scratchpad-set-reminder-btn">Ορισμός</button>
                    <button id="tm-scratchpad-reminder-1hr-btn">Σε 1 Ώρα</button>
                </div>
                <button id="tm-scratchpad-reminder-cancel-btn">Ακύρωση</button>
                <div id="tm-scratchpad-active-reminder"></div>
            </div>
            <div id="tm-scratchpad-template-popover" class="tm-scratchpad-popover">
                <h5>Εισαγωγή Προτύπου</h5>
                <div id="tm-scratchpad-template-list"></div>
            </div>
        `;
        document.body.appendChild(container);

        // 2. Find the main search button container and add the toggle button there.
        const rightSideContainer = document.getElementById('tm-search-container');
        if (!rightSideContainer) {
            console.log('[MMS] Right-side container not found, not adding Scratchpad toggle button.');
            return; // Don't add the button if the main container isn't there
        }

        const toggleButton = document.createElement('button');
        toggleButton.id = 'tm-scratchpad-toggle-btn';
        toggleButton.className = 'tm-slide-out-btn';
        toggleButton.textContent = '🗒️ Σημειωματάριο';
        rightSideContainer.appendChild(toggleButton);

        const editor = container.querySelector('#tm-scratchpad-editor');
        const header = container.querySelector('#tm-scratchpad-header');
        const searchInput = container.querySelector('#tm-scratchpad-search');
        const clearBtn = container.querySelector('#tm-scratchpad-clear-btn');
        const fontSizeDownBtn = container.querySelector('#tm-scratchpad-font-size-down');
        const fontSizeUpBtn = container.querySelector('#tm-scratchpad-font-size-up');
        const maximizeBtn = container.querySelector('#tm-scratchpad-maximize-btn');
        const closeBtn = container.querySelector('#tm-scratchpad-close-btn');
        const lastEditedSpan = container.querySelector('#tm-scratchpad-last-edited');
        const reminderBtn = container.querySelector('#tm-scratchpad-reminder-btn');
        const reminderTextInput = container.querySelector('#tm-scratchpad-reminder-text');
        const reminderPopover = container.querySelector('#tm-scratchpad-reminder-popover');
        const reminderDateTimeInput = container.querySelector('#tm-scratchpad-reminder-datetime');
        const reminderRecurrenceSelect = container.querySelector('#tm-scratchpad-reminder-recurrence');
        const setReminderBtn = container.querySelector('#tm-scratchpad-set-reminder-btn');
        const setReminder1hrBtn = container.querySelector('#tm-scratchpad-reminder-1hr-btn');
        const cancelReminderBtn = container.querySelector('#tm-scratchpad-reminder-cancel-btn');
        const activeReminderDiv = container.querySelector('#tm-scratchpad-active-reminder');
        const newTabBtn = container.querySelector('#tm-scratchpad-new-tab-btn');
        const tabsContainer = container.querySelector('#tm-scratchpad-tabs');
        const templateBtn = container.querySelector('#tm-scratchpad-template-btn');
        const templatePopover = container.querySelector('#tm-scratchpad-template-popover');
        const templateList = container.querySelector('#tm-scratchpad-template-list');
        const toolbar = container.querySelector('#tm-scratchpad-toolbar');

        // --- Data Migration from old format ---
        function migrateOldScratchpadData() {
            const oldText = GM_getValue('tm_user_scratchpad_text');
            if (oldText !== undefined && oldText !== null) {
                console.log('[MMS] Migrating old scratchpad data to new multi-note format.');
                const oldReminder = JSON.parse(GM_getValue('tm_scratchpad_reminder', 'null'));
                const oldLastEdited = GM_getValue('tm_user_scratchpad_last_edited');

                const newNote = {
                    id: `note_${Date.now()}`,
                    title: 'Default Note',
                    content: oldText,
                    reminder: oldReminder,
                    isPinned: false,
                    lastEdited: oldLastEdited,
                    fontSize: GM_getValue('tm_user_scratchpad_font_size', 13)
                };

                GM_setValue(STORAGE_KEYS.SCRATCHPAD_NOTES, JSON.stringify([newNote]));
                GM_setValue(STORAGE_KEYS.SCRATCHPAD_ACTIVE_NOTE_ID, newNote.id);

                // Delete old keys
                GM_deleteValue('tm_user_scratchpad_text');
                GM_deleteValue('tm_scratchpad_reminder');
                GM_deleteValue('tm_user_scratchpad_last_edited');
                GM_deleteValue('tm_user_scratchpad_font_size');
            }
        }
        migrateOldScratchpadData();

        // --- Data Access Functions ---
        function getNotes() {
            const notes = JSON.parse(GM_getValue(STORAGE_KEYS.SCRATCHPAD_NOTES, '[]'));
            if (notes.length === 0) {
                const firstNote = { id: `note_${Date.now()}`, title: 'Note 1', content: '', reminder: null, isPinned: false, lastEdited: null, fontSize: 13 };
                return [firstNote];
            }
            return notes;
        }

        function saveNotes(notes) {
            GM_setValue(STORAGE_KEYS.SCRATCHPAD_NOTES, JSON.stringify(notes));
        }

        function getActiveNoteId() {
            const notes = getNotes();
            let activeId = GM_getValue(STORAGE_KEYS.SCRATCHPAD_ACTIVE_NOTE_ID);
            // Ensure the active ID is valid
            if (!activeId || !notes.some(n => n.id === activeId)) {
                activeId = notes[0]?.id;
                GM_setValue(STORAGE_KEYS.SCRATCHPAD_ACTIVE_NOTE_ID, activeId);
            }
            return activeId;
        }

        function getActiveNote() {
            const notes = getNotes();
            const activeId = getActiveNoteId();
            return notes.find(n => n.id === activeId) || notes[0];
        }

        function updateActiveNote(props) {
            let notes = getNotes();
            const activeId = getActiveNoteId();
            const noteIndex = notes.findIndex(n => n.id === activeId);
            if (noteIndex !== -1) {
                notes[noteIndex] = { ...notes[noteIndex], ...props };
                saveNotes(notes);
            }
        }

        // --- Load saved state ---
        function loadActiveNote() {
            const note = getActiveNote();
            if (!note) return;

            editor.innerHTML = note.content || '';
            renderCheckboxesInEditor();
            updateLastEditedDisplay(note.lastEdited);
            editor.style.fontSize = `${note.fontSize || 13}px`;
            highlightSearchTermsInEditor(); // Highlight after loading
            updateReminderDisplay();
        }

        // --- Toolbar Logic ---
        toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const command = button.dataset.command;
            const value = button.dataset.value || null;

            e.preventDefault(); // Prevent button from taking focus away from the editor
            editor.focus();

            if (command === 'createLink') {
                const url = prompt('Enter the URL:');
                if (url) {
                    document.execCommand(command, false, url);
                }
            } else {
                document.execCommand(command, false, value);
            }
            debouncedSaveText(); // Save changes after formatting
        });

        // Load visibility state
        const wasOpen = GM_getValue('tm_user_scratchpad_is_open', false);
        if (wasOpen) {
            container.style.display = 'flex';
        }

        // Load saved position and size
        const savedGeometryJSON = GM_getValue('tm_user_scratchpad_geometry');
        if (savedGeometryJSON) {
            try {
                const geo = JSON.parse(savedGeometryJSON);
                if (geo.top && geo.left) {
                    container.style.top = geo.top;
                    container.style.left = geo.left;
                    container.style.bottom = 'auto';
                    container.style.right = 'auto';
                }
                if (geo.width && geo.height) {
                    container.style.width = geo.width;
                    container.style.height = geo.height;
                }
            } catch (e) { console.error('[MMS] Could not parse saved scratchpad geometry.', e); }
        }

        // Load maximized state
        let isMaximized = GM_getValue(SCRATCHPAD_STORAGE_KEY_IS_MAXIMIZED, false);
        let originalGeometry = null;
        if (isMaximized) {
            toggleMaximize(); // Apply maximized state
        }

        // --- Logic ---
        function updateLastEditedDisplay(timestamp) {
            if (timestamp) {
                const date = new Date(timestamp);
                lastEditedSpan.textContent = `Τελευταία επεξεργασία: ${date.toLocaleDateString('el-GR')} ${date.toLocaleTimeString('el-GR')}`;
            } else {
                lastEditedSpan.textContent = '';
            }
        }

        // Show/Hide Logic
        toggleButton.addEventListener('click', () => {
            const willBeVisible = container.style.display === 'none';
            container.style.display = willBeVisible ? 'flex' : 'none';
            GM_setValue('tm_user_scratchpad_is_open', willBeVisible);
        });

        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
            GM_setValue('tm_user_scratchpad_is_open', false);
        });

        // Save text on input
        const debouncedSaveText = debounce((e) => {
            const content = editor.innerHTML;
            const now = new Date().toISOString();
            updateActiveNote({ content: content, lastEdited: now });
            updateLastEditedDisplay(now);
        }, 500);
        editor.addEventListener('input', debouncedSaveText);

        // --- Markdown Formatting ---
        const applyMarkdownFormatting = debounce(() => {
            // This is a simple implementation. More complex scenarios might need a proper parser.
            let content = editor.innerHTML;
            // Use more specific regex to avoid matching inside tags. The `>` ensures we are not inside a tag.
            content = content.replace(/&gt; \*\*([^\*]+)\*\*/g, '> <strong>$1</strong>'); // Bold
            content = content.replace(/&gt; \*([^\*]+)\*/g, '> <em>$1</em>');     // Italic
            content = content.replace(/&gt; ~([^~]+)~/g, '> <s>$1</s>');         // Strikethrough

            // For headings, it's safer to use formatBlock if possible, but this is a simple regex way.
            // This is fragile and for demonstration. A real implementation would be more complex.
            if (content.includes('<div># ')) {
                content = content.replace(/<div># (.+?)<\/div>/g, '<h1>$1</h1>');
            }
            if (content.includes('<div>## ')) {
                content = content.replace(/<div>## (.+?)<\/div>/g, '<h2>$1</h2>');
            }

            editor.innerHTML = content;
        }, 700);
        editor.addEventListener('input', applyMarkdownFormatting);

        // --- Tabs Logic ---
        function renderTabs() {
            let notes = getNotes();
            const activeId = getActiveNoteId();
            const query = searchInput.value.toLowerCase().trim();

            // Filter notes based on the search query
            if (query) {
                notes = notes.filter(note => {
                    // To search content, we need to convert the saved HTML to plain text.
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = note.content || '';
                    const textContent = tempDiv.innerText.toLowerCase();

                    return note.title.toLowerCase().includes(query) ||
                           textContent.includes(query);
                });
            }

            // Sort notes so pinned ones are first
            notes.sort((a, b) => {
                if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned;
                return (a.order || 0) - (b.order || 0);
            });

            tabsContainer.innerHTML = '';
            if (notes.length === 0 && query) {
                tabsContainer.innerHTML = `<span style="padding: 6px 10px; font-size: 12px; color: #666; font-style: italic;">No matches found.</span>`;
            }
            notes.forEach(note => {
                const tab = document.createElement('div');
                tab.className = 'tm-scratchpad-tab';
                tab.dataset.noteId = note.id;
                tab.draggable = true; // Make tabs draggable
                if (note.id === activeId) tab.classList.add('active');
                if (note.isPinned) tab.classList.add('pinned');

                const pinIcon = note.isPinned ? '📌' : '📍';
                tab.innerHTML = `<button class="tm-scratchpad-tab-pin" title="Pin Note">${pinIcon}</button><span class="tm-scratchpad-tab-title" title="Double-click to rename">${note.title}</span><button class="tm-scratchpad-tab-close" title="Delete Note">&times;</button>`;
                tabsContainer.appendChild(tab);
            });
        }

        function handleTabClick(e) {
            const tab = e.target.closest('.tm-scratchpad-tab');
            if (!tab) return;
            if (e.type === 'dblclick') {
                const titleSpan = e.target.closest('.tm-scratchpad-tab-title');
                if (titleSpan) {
                    const noteId = titleSpan.parentElement.dataset.noteId;
                    const newTitle = prompt('Enter new note title:', titleSpan.textContent);
                    if (newTitle && newTitle.trim()) {
                        let notes = getNotes();
                        const note = notes.find(n => n.id === noteId);
                        if (note) {
                            note.title = newTitle.trim();
                            saveNotes(notes);
                            renderTabs();
                        }
                    }
                }
                return; // Stop further processing for dblclick
            }
            const noteId = tab.dataset.noteId;
            if (e.target.classList.contains('tm-scratchpad-tab-pin')) {
                // Pin/Unpin note
                let notes = getNotes();
                const note = notes.find(n => n.id === noteId);
                if (note) {
                    note.isPinned = !note.isPinned;
                    saveNotes(notes);
                    renderTabs();
                }

            } else if (e.target.classList.contains('tm-scratchpad-tab-close')) {
                // Close tab
                if (getNotes().length <= 1) {
                    showPositiveMessage('Cannot close the last note.');
                    return;
                }
                if (confirm(`Are you sure you want to delete "${tab.querySelector('.tm-scratchpad-tab-title').textContent}"?`)) {
                    let notes = getNotes().filter(n => n.id !== noteId);
                    saveNotes(notes);
                    if (getActiveNoteId() === noteId) {
                        GM_setValue(STORAGE_KEYS.SCRATCHPAD_ACTIVE_NOTE_ID, notes[0].id);
                    }
                    renderTabs();
                    loadActiveNote();
                }
            } else {
                // Switch tab
                GM_setValue(STORAGE_KEYS.SCRATCHPAD_ACTIVE_NOTE_ID, noteId);
                renderTabs();
                loadActiveNote();
            }
        }

        newTabBtn.addEventListener('click', () => {
            let notes = getNotes();
            const newNote = { id: `note_${Date.now()}`, title: `Note ${notes.length + 1}`, content: '', reminder: null, isPinned: false, lastEdited: null, fontSize: 13 };
            notes.push(newNote);
            saveNotes(notes);
            GM_setValue(STORAGE_KEYS.SCRATCHPAD_ACTIVE_NOTE_ID, newNote.id);
            renderTabs();
            loadActiveNote();
        });

        // --- Drag and Drop Tab Reordering ---
        let draggedTab = null;

        tabsContainer.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('tm-scratchpad-tab')) {
                draggedTab = e.target;
                setTimeout(() => {
                    e.target.classList.add('dragging');
                }, 0);
            }
        });

        tabsContainer.addEventListener('dragend', (e) => {
            if (draggedTab) {
                draggedTab.classList.remove('dragging');
                draggedTab = null;

                // Save the new order
                const orderedIds = Array.from(tabsContainer.querySelectorAll('.tm-scratchpad-tab')).map(tab => tab.dataset.noteId);
                let notes = getNotes();
                notes.forEach(note => {
                    const newIndex = orderedIds.indexOf(note.id);
                    note.order = newIndex !== -1 ? newIndex : 999; // Assign order, put missing ones at the end
                });
                saveNotes(notes);
                renderTabs(); // Re-render to solidify the order
            }
        });

        tabsContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(tabsContainer, e.clientX);
            if (draggedTab) {
                if (afterElement == null) {
                    tabsContainer.appendChild(draggedTab);
                } else {
                    tabsContainer.insertBefore(draggedTab, afterElement);
                }
            }
        });

        function getDragAfterElement(container, x) {
            const draggableElements = [...container.querySelectorAll('.tm-scratchpad-tab:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                return (offset < 0 && offset > closest.offset) ? { offset: offset, element: child } : closest;
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
        // --- New, more robust click handling to differentiate single vs. double clicks ---
        let clickTimer = null;
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.tm-scratchpad-tab');
            if (!tab) return;

            // If a timer is already running, it means this is the second click (a double-click)
            if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;

                // --- Double-click logic ---
                const titleSpan = e.target.closest('.tm-scratchpad-tab-title');
                if (titleSpan) {
                    const noteId = titleSpan.parentElement.dataset.noteId;
                    const currentNote = getNotes().find(n => n.id === noteId);
                    const newTitle = prompt('Enter new note title:', currentNote.title);
                    if (newTitle && newTitle.trim()) {
                        let notes = getNotes();
                        const noteToUpdate = notes.find(n => n.id === noteId);
                        if (noteToUpdate) {
                            noteToUpdate.title = newTitle.trim();
                            saveNotes(notes);
                            renderTabs();
                        }
                    }
                }
            } else {
                // This is the first click. Start a timer.
                clickTimer = setTimeout(() => {
                    clickTimer = null; // Reset timer

                    // --- Single-click logic (runs after 250ms if no second click) ---
                    const noteId = tab.dataset.noteId;
                    if (e.target.classList.contains('tm-scratchpad-tab-pin')) {
                        let notes = getNotes();
                        const note = notes.find(n => n.id === noteId);
                        if (note) { note.isPinned = !note.isPinned; saveNotes(notes); renderTabs(); }
                    } else if (e.target.classList.contains('tm-scratchpad-tab-close')) {
                        if (getNotes().length <= 1) { showPositiveMessage('Cannot close the last note.'); return; }
                        if (confirm(`Are you sure you want to delete "${tab.querySelector('.tm-scratchpad-tab-title').textContent}"?`)) {
                            let notes = getNotes().filter(n => n.id !== noteId);
                            saveNotes(notes);
                            if (getActiveNoteId() === noteId) { GM_setValue(STORAGE_KEYS.SCRATCHPAD_ACTIVE_NOTE_ID, notes[0].id); }
                            renderTabs(); loadActiveNote();
                        }
                    } else { // Switch tab
                        GM_setValue(STORAGE_KEYS.SCRATCHPAD_ACTIVE_NOTE_ID, noteId);
                        renderTabs(); loadActiveNote();
                    }
                }, 250); // 250ms delay to wait for a potential second click
            }
        });

        // --- Search Logic ---
        searchInput.addEventListener('input', debounce(() => {
            renderTabs();
            // Also re-apply highlighting to the currently visible editor content
            highlightSearchTermsInEditor();
        }, 200));

        // --- Highlighting Logic for Search ---
        function highlightSearchTermsInEditor() {
            const query = searchInput.value.trim();
            // First, remove any existing highlights
            editor.querySelectorAll('mark.tm-search-highlight').forEach(mark => {
                mark.outerHTML = mark.innerHTML; // Unwrap the text
            });
            // Normalize the editor's HTML to merge adjacent text nodes
            editor.normalize();

            if (!query) return; // No query, no highlighting

            const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
            const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
            let node;
            const nodesToReplace = [];

            while (node = walker.nextNode()) {
                if (node.parentElement.tagName === 'MARK') continue; // Don't search within highlights
                if (regex.test(node.nodeValue)) {
                    nodesToReplace.push(node);
                }
            }

            nodesToReplace.forEach(textNode => {
                const newHTML = textNode.nodeValue.replace(regex, '<mark class="tm-search-highlight">$1</mark>');
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newHTML;
                const fragment = document.createDocumentFragment();
                while (tempDiv.firstChild) {
                    fragment.appendChild(tempDiv.firstChild);
                }
                textNode.parentNode.replaceChild(fragment, textNode);
            });
        }

        // --- Interactive Checklists Logic ---
        function renderCheckboxesInEditor() {
            // Use a more robust method that doesn't rely on simple string replacement
            const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
            let node;
            while (node = walker.nextNode()) {
                const text = node.nodeValue;
                if (text.includes('[ ]') || text.includes('[x]')) {
                    const fragment = document.createDocumentFragment();
                    const parts = text.split(/(\[ \]|\\[x\\])/g); // Split by checkbox syntax
                    parts.forEach(part => {
                        if (part === '[ ]') {
                            const cb = document.createElement('input');
                            cb.type = 'checkbox';
                            cb.className = 'tm-scratchpad-checkbox';
                            fragment.appendChild(cb);
                        } else if (part === '[x]') {
                            const cb = document.createElement('input');
                            cb.type = 'checkbox';
                            cb.className = 'tm-scratchpad-checkbox';
                            cb.checked = true;
                            fragment.appendChild(cb);
                        } else {
                            fragment.appendChild(document.createTextNode(part));
                        }
                    });
                    node.parentNode.replaceChild(fragment, node);
                }
            }
        }

        editor.addEventListener('input', debounce(renderCheckboxesInEditor, 300));

        editor.addEventListener('change', (e) => {
            if (e.target.matches('.tm-scratchpad-checkbox')) {
                // This is tricky because the innerHTML doesn't update on checkbox change.
                // We need to reconstruct the text representation and save it.
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = editor.innerHTML;
                tempDiv.querySelectorAll('.tm-scratchpad-checkbox').forEach(cb => {
                    // Replace the checkbox input with its text equivalent
                    const textNode = document.createTextNode(cb.checked ? '[x]' : '[ ]');
                    cb.parentNode.replaceChild(textNode, cb);
                });
                const newContent = tempDiv.innerHTML;
                updateActiveNote({ content: newContent });
                // The 'input' event listener will re-render the checkboxes visually.
            }
        });

        // --- Template Logic ---
        templateBtn.addEventListener('click', () => {
            const templates = JSON.parse(GM_getValue(STORAGE_KEYS.SCRATCHPAD_TEMPLATES, '[]'));
            if (templates.length === 0) {
                showPositiveMessage('No templates saved. Add them in the settings.');
                return;
            }
            templateList.innerHTML = templates.map(t => `<button data-content="${encodeURIComponent(t.content)}">${t.title}</button>`).join('');
            templatePopover.style.display = 'block';
        });

        templateList.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const content = decodeURIComponent(e.target.dataset.content);
                document.execCommand('insertHTML', false, `<br>${content}`);
                templatePopover.style.display = 'none';
                renderCheckboxesInEditor();
            }
        });

        // Hide popovers on outside click
        document.addEventListener('click', (e) => {
            if (!templatePopover.contains(e.target) && e.target !== templateBtn) {
                templatePopover.style.display = 'none';
            }
            if (!reminderPopover.contains(e.target) && e.target !== reminderBtn) {
                reminderPopover.style.display = 'none';
            }
        });

        // Font Size Controls
        fontSizeDownBtn.addEventListener('click', () => {
            let note = getActiveNote();
            let newSize = (note.fontSize || 13) - 1;
            if (newSize >= 8) {
                editor.style.fontSize = `${newSize}px`;
                updateActiveNote({ fontSize: newSize });
            }
        });

        fontSizeUpBtn.addEventListener('click', () => {
            let note = getActiveNote();
            let newSize = (note.fontSize || 13) + 1;
            if (newSize <= 30) {
                editor.style.fontSize = `${newSize}px`;
                updateActiveNote({ fontSize: newSize });
            }
        });

        // Maximize/Restore Logic
        function toggleMaximize() {
            if (!isMaximized) {
                // Save current geometry before maximizing
                const rect = container.getBoundingClientRect();
                originalGeometry = {
                    top: container.style.top,
                    left: container.style.left,
                    width: `${rect.width}px`,
                    height: container.style.height
                };
                container.classList.add('maximized');
                container.style.top = '10px';
                container.style.left = '10px';
                container.style.width = 'calc(100vw - 20px)';
                container.style.height = 'calc(100vh - 20px)';
            } else {
                // Restore original geometry
                container.classList.remove('maximized');
                if (originalGeometry) {
                    container.style.top = originalGeometry.top;
                    container.style.left = originalGeometry.left;
                    container.style.width = originalGeometry.width;
                    container.style.height = originalGeometry.height;
                }
            }
            isMaximized = !isMaximized;
            GM_setValue(SCRATCHPAD_STORAGE_KEY_IS_MAXIMIZED, isMaximized);
        }
        maximizeBtn.addEventListener('click', toggleMaximize);

        // --- Reminder Logic ---
        function updateReminderDisplay() {
            const note = getActiveNote();
            const reminder = note?.reminder;
            if (reminder && reminder.dueTime) {
                const dueDate = new Date(reminder.dueTime);
                let recurrenceText = '';
                if (reminder.recurrence === 'daily') recurrenceText = ' (Καθημερινά)';
                if (reminder.recurrence === 'weekly') recurrenceText = ' (Εβδομαδιαία)';

                activeReminderDiv.innerHTML = `
                    <span style="font-weight:normal; display:block; margin-bottom: 3px;">${reminder.text}</span>
                    ${dueDate.toLocaleString('el-GR')}${recurrenceText}
                    <button id="tm-scratchpad-clear-reminder-btn">Καθαρισμός</button>
                `;
                activeReminderDiv.querySelector('#tm-scratchpad-clear-reminder-btn').addEventListener('click', clearReminder);
                reminderBtn.classList.add('active');
            } else {
                activeReminderDiv.innerHTML = '';
                reminderBtn.classList.remove('active');
            }
        }

        function saveReminder(dueTime, recurrence, text) {
            if (!text) {
                alert('Παρακαλώ εισάγετε το κείμενο της υπενθύμισης.');
                return;
            }

            // Request permission if needed
            if (window.Notification && Notification.permission !== "granted") {
                Notification.requestPermission();
            }

            const newReminder = {
                id: `scratchpad_${Date.now()}`,
                text: text,
                dueTime: dueTime,
                recurrence: recurrence,
                createdAt: Date.now()
            };
            updateActiveNote({ reminder: newReminder });
            console.log('[MMS] Reminder set:', newReminder);
            trackDailyStat('setScratchpadReminder'); // Grant XP for setting a reminder
            updateReminderDisplay();
            reminderPopover.style.display = 'none';
        }

        function clearReminder() {
            updateActiveNote({ reminder: null });
            console.log('[MMS] Reminder cleared.');
            updateReminderDisplay();
        }

        reminderBtn.addEventListener('click', () => {
            reminderPopover.style.display = reminderPopover.style.display === 'flex' ? 'none' : 'flex';
            if (reminderPopover.style.display === 'flex') {
                // Pre-fill with existing reminder text if available
                const note = getActiveNote();
                const reminder = note?.reminder;
                reminderTextInput.value = reminder?.text || '';
                if (reminder?.dueTime) {
                    const d = new Date(reminder.dueTime);
                    reminderDateTimeInput.value = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}T${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
                }
            }
        });

        cancelReminderBtn.addEventListener('click', () => {
            reminderPopover.style.display = 'none';
        });

        setReminderBtn.addEventListener('click', () => {
            const dueTime = new Date(reminderDateTimeInput.value).getTime();
            if (isNaN(dueTime) || dueTime < Date.now()) {
                alert('Παρακαλώ επιλέξτε μια μελλοντική ημερομηνία και ώρα.');
                return;
            }
            saveReminder(dueTime, reminderRecurrenceSelect.value, reminderTextInput.value.trim());
        });

        setReminder1hrBtn.addEventListener('click', () => {
            const dueTime = Date.now() + 60 * 60 * 1000;
            saveReminder(dueTime, reminderRecurrenceSelect.value, reminderTextInput.value.trim());
        });

        // --- Dragging and Sizing Logic ---
        let isDragging = false;
        let offsetX, offsetY;

        const saveGeometry = debounce(() => {
            const rect = container.getBoundingClientRect();
            const geometry = {
                top: `${rect.top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`
            };
            GM_setValue('tm_user_scratchpad_geometry', JSON.stringify(geometry));
            console.log('[MMS] Saved scratchpad geometry:', geometry);
        }, 500);

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || isMaximized) return;

            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            container.style.transition = 'none'; // Disable transitions during drag
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (isMaximized) return; // No dragging when maximized
            if (!isDragging) return;
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            container.style.left = `${newX}px`;
            container.style.top = `${newY}px`;
            container.style.bottom = 'auto';
            container.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.transition = ''; // Re-enable transitions
                document.body.style.userSelect = '';
                if (!isMaximized) saveGeometry();
                saveGeometry();
            }
        });

        // Use a ResizeObserver to save geometry when the user resizes the panel
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                if (container.style.display === 'flex' && !isMaximized) {
                    saveGeometry();
                }
            });
            resizeObserver.observe(container);
        }

        // --- "Send to Scratchpad" Integration ---
        window.sendToScratchpad = (text, sourceUrl = null) => {
            // Ensure scratchpad is open
            if (container.style.display !== 'flex') {
                toggleButton.click();
            }
            // Add source link if provided
            const sourceLinkHTML = sourceUrl ? `<a href="${sourceUrl}" target="_blank" class="tm-scratchpad-source-link">🔗 Go to Source</a>` : '';

            // Append text to the current note
            const currentContent = editor.innerHTML;
            const newContent = currentContent ? `${currentContent}<br><br>${text} ${sourceLinkHTML}` : `${text} ${sourceLinkHTML}`;
            editor.innerHTML = newContent;
            debouncedSaveText(); // Save the changes
            showPositiveMessage('Sent to Scratchpad!');
        };

        // Add a click listener to the editor to handle links inside contenteditable
        editor.addEventListener('click', (e) => {
            // Check if the clicked element is an anchor tag with an href
            if (e.target.tagName === 'A' && e.target.href) {
                e.preventDefault(); // Prevent the default contenteditable behavior (like placing a cursor)
                window.open(e.target.href, '_blank'); // Manually open the link in a new tab
            }
        });

        // Initial Load
        renderTabs();
        loadActiveNote();
    }

    // ===================================================================
    // === 6. FEATURE: REMINDER SYSTEM
    // ===================================================================
    function initReminderSystem() {

        function checkReminders() {
            const now = Date.now();
            let notes = JSON.parse(GM_getValue(STORAGE_KEYS.SCRATCHPAD_NOTES, '[]'));
            let notesUpdated = false;

            notes.forEach(note => {
                const reminder = note.reminder;
                if (!reminder || !reminder.dueTime || reminder.dueTime > now) {
                    return; // No reminder or not due yet
                }

                // --- Reminder is due ---
                console.log(`[MMS] Reminder is due for note "${note.title}":`, reminder);
                showNotification(`Υπενθύμιση: ${note.title}`, reminder.text);
                notesUpdated = true;

                if (reminder.recurrence === 'none') {
                    // One-time reminder, so delete it
                    note.reminder = null;
                } else {
                    // Recurring reminder, calculate next due time
                    let nextDueTime = new Date(reminder.dueTime);
                    if (reminder.recurrence === 'daily') {
                        nextDueTime.setDate(nextDueTime.getDate() + 1);
                    } else if (reminder.recurrence === 'weekly') {
                        nextDueTime.setDate(nextDueTime.getDate() + 7);
                    }

                    // Ensure the next due time is in the future
                    while (nextDueTime.getTime() < now) {
                        if (reminder.recurrence === 'daily') nextDueTime.setDate(nextDueTime.getDate() + 1);
                        if (reminder.recurrence === 'weekly') nextDueTime.setDate(nextDueTime.getDate() + 7);
                    }

                    reminder.dueTime = nextDueTime.getTime();
                    console.log(`[MMS] Rescheduled recurring reminder for "${note.title}" to:`, new Date(reminder.dueTime));
                }
            });

            if (notesUpdated) GM_setValue(STORAGE_KEYS.SCRATCHPAD_NOTES, JSON.stringify(notes));

            // Update the UI if the scratchpad is open
            if (document.getElementById('tm-scratchpad-container')) {
                // This is a bit of a hack, but it's the simplest way to trigger a UI update
                // A more robust solution would use custom events.
                const reminderBtn = document.getElementById('tm-scratchpad-reminder-btn');
                if (reminderBtn) {
                    // Simulate a click to force a re-render of the reminder info
                    reminderBtn.click();
                    reminderBtn.click();
                }
            }
        }

        // Check for reminders every 30 seconds
        setInterval(checkReminders, 30 * 1000);
        console.log('[MMS] Reminder check system initialized.');
    }

    /**
     * Creates and displays a modal showing all available titles and ranks.
     */
    function showTitlesModal() {
        if (document.querySelector('#tm-titles-modal')) return; // Prevent multiple modals

        const currentLevel = GM_getValue(STORAGE_KEYS.USER_LEVEL, 1);

        const overlay = document.createElement('div');
        overlay.className = 'tm-modal-overlay';
        overlay.id = 'tm-titles-modal';

        // Get the base SVG for the mascot to display its evolutions
        const mascotSVGTemplate = `
            <svg class="tm-mascot-robot" viewBox="0 0 100 100" style="overflow: visible; width: 60px; height: 60px;">
                <g class="tm-mascot-flipper" transform-origin="50 50">
                    <g id="tm-mascot-base" style="display: none;">
                        <g class="tm-mascot-antenna"><line x1="50" y1="15" x2="50" y2="5" stroke="#333" stroke-width="2"/><circle cx="50" cy="5" r="3" fill="#ffc107"/></g>
                        <g class="tm-mascot-main-body"><rect x="25" y="15" width="50" height="40" rx="10" fill="#e0e0e0" stroke="#333" stroke-width="3"/><g class="tm-mascot-eye-open"><circle cx="40" cy="35" r="5" fill="white"/><circle cx="40" cy="35" r="2" fill="black"/><circle cx="60" cy="35" r="5" fill="white"/><circle cx="60" cy="35" r="2" fill="black"/></g><path class="tm-mascot-mouth-happy" d="M 40 45 Q 50 55 60 45" stroke="black" stroke-width="2" fill="none"/><rect x="20" y="55" width="60" height="30" rx="5" fill="#d0d0d0" stroke="#333" stroke-width="3"/></g>
                        <g class="tm-mascot-thrusters"><rect class="tm-mascot-thruster-left" x="30" y="85" width="15" height="10" fill="#6c757d"/><rect class="tm-mascot-thruster-right" x="55" y="85" width="15" height="10" fill="#6c757d"/></g>
                    </g>
                    <g id="tm-mascot-evo1" style="display: none;">
                        <g class="tm-mascot-antenna"><line x1="50" y1="15" x2="50" y2="5" stroke="#555" stroke-width="2"/><circle cx="50" cy="5" r="3" fill="#17a2b8"/></g>
                        <g class="tm-mascot-main-body"><rect x="25" y="15" width="50" height="40" rx="5" fill="#d4e6f1" stroke="#34495e" stroke-width="3"/><g class="tm-mascot-eye-open"><rect x="35" y="32" width="10" height="6" fill="white" rx="1"/><rect x="55" y="32" width="10" height="6" fill="white" rx="1"/></g><path class="tm-mascot-mouth-happy" d="M 40 45 Q 50 50 60 45" stroke="black" stroke-width="2" fill="none"/><rect x="20" y="55" width="60" height="30" rx="3" fill="#b9d7ea" stroke="#34495e" stroke-width="3"/></g>
                        <g class="tm-mascot-thrusters"><rect class="tm-mascot-thruster-left" x="30" y="85" width="15" height="10" fill="#5d6d7e" rx="2"/><rect class="tm-mascot-thruster-right" x="55" y="85" width="15" height="10" fill="#5d6d7e" rx="2"/></g>
                    </g>
                    <g id="tm-mascot-evo2" style="display: none;">
                        <g class="tm-mascot-antenna"><line x1="50" y1="15" x2="50" y2="5" stroke="#333" stroke-width="2"/><circle cx="50" cy="5" r="3" fill="#ffc107" stroke="#fff" stroke-width="0.5"/></g>
                        <g class="tm-mascot-main-body"><rect x="25" y="15" width="50" height="40" rx="8" fill="#f1f1f1" stroke="#ffc107" stroke-width="3"/><g class="tm-mascot-eye-open"><path d="M 35 32 L 45 32 L 40 40 Z" fill="#17a2b8"/><path d="M 55 32 L 65 32 L 60 40 Z" fill="#17a2b8"/></g><path class="tm-mascot-mouth-happy" d="M 40 48 L 60 48" stroke="black" stroke-width="2" fill="none"/><rect x="20" y="55" width="60" height="30" rx="5" fill="#e0e0e0" stroke="#ffc107" stroke-width="3"/></g>
                        <g class="tm-mascot-thrusters"><rect class="tm-mascot-thruster-left" x="30" y="85" width="15" height="12" fill="#333" rx="3"/><rect class="tm-mascot-thruster-right" x="55" y="85" width="15" height="12" fill="#333" rx="3"/></g>
                    </g>
                    <g id="tm-mascot-evo3" style="display: none;">
                        <g class="tm-mascot-antenna"><line x1="50" y1="15" x2="50" y2="5" stroke="#a335ee" stroke-width="2.5"/><circle cx="50" cy="5" r="3.5" fill="#f0f" stroke="#fff" stroke-width="1"/></g>
                        <g class="tm-mascot-main-body"><rect x="25" y="15" width="50" height="40" rx="12" fill="#2c2c2c" stroke="#a335ee" stroke-width="3"/><g class="tm-mascot-eye-open"><path d="M 35 30 L 45 40 M 45 30 L 35 40" stroke="#f0f" stroke-width="2"/><path d="M 55 30 L 65 40 M 65 30 L 55 40" stroke="#f0f" stroke-width="2"/></g><path class="tm-mascot-mouth-happy" d="M 40 48 L 60 48" stroke="#f0f" stroke-width="2" fill="none"/><rect x="20" y="55" width="60" height="30" rx="8" fill="#3c3c3c" stroke="#a335ee" stroke-width="3"/></g>
                        <g class="tm-mascot-thrusters"><rect class="tm-mascot-thruster-left" x="30" y="85" width="15" height="15" fill="#a335ee" rx="4"/><rect class="tm-mascot-thruster-right" x="55" y="85" width="15" height="15" fill="#a335ee" rx="4"/></g>
                    </g>
                    <g id="tm-mascot-evo4" style="display: none;">
                        <g class="tm-mascot-antenna"><line x1="50" y1="15" x2="50" y2="5" stroke="#ff8000" stroke-width="3"/><circle cx="50" cy="5" r="4" fill="#ffc107" stroke="#fff" stroke-width="1"><animate attributeName="r" values="4;5;4" dur="1.5s" repeatCount="indefinite"/></circle></g>
                        <g class="tm-mascot-main-body"><rect x="25" y="15" width="50" height="40" rx="15" fill="#fff" stroke="#ff8000" stroke-width="4"/><g class="tm-mascot-eye-open"><circle cx="40" cy="35" r="6" fill="#ff8000"/><circle cx="60" cy="35" r="6" fill="#ff8000"/></g><path class="tm-mascot-mouth-happy" d="M 40 45 Q 50 55 60 45" stroke="#ff8000" stroke-width="3" fill="none"/><rect x="20" y="55" width="60" height="30" rx="10" fill="#eee" stroke="#ff8000" stroke-width="4"/></g>
                        <g class="tm-mascot-thrusters"><rect class="tm-mascot-thruster-left" x="30" y="85" width="15" height="15" fill="#ff8000" rx="5"/><rect class="tm-mascot-thruster-right" x="55" y="85" width="15" height="15" fill="#ff8000" rx="5"/></g>
                    </g>
                </g>
            </svg>
        `;

        const titlesHTML = RANKS.map(rank => {
            const isUnlocked = currentLevel >= rank.level;
            const glowStyle = rank.glow ? `text-shadow: 0 0 5px ${rank.color};` : '';
            let mascotDisplayHTML = '';

            if (config.interactiveMascotEnabled) {
                if (rank.level === 1) mascotDisplayHTML = mascotSVGTemplate.replace('id="tm-mascot-base" style="display: none;"', 'id="tm-mascot-base" style="display: block;"');
                if (rank.level === 10) mascotDisplayHTML = mascotSVGTemplate.replace('id="tm-mascot-evo1" style="display: none;"', 'id="tm-mascot-evo1" style="display: block;"');
                if (rank.level === 25) mascotDisplayHTML = mascotSVGTemplate.replace('id="tm-mascot-evo2" style="display: none;"', 'id="tm-mascot-evo2" style="display: block;"');
                if (rank.level === 50) mascotDisplayHTML = mascotSVGTemplate.replace('id="tm-mascot-evo3" style="display: none;"', 'id="tm-mascot-evo3" style="display: block;"');
                if (rank.level === 100) mascotDisplayHTML = mascotSVGTemplate.replace('id="tm-mascot-evo4" style="display: none;"', 'id="tm-mascot-evo4" style="display: block;"');
            }

            return `
                <div class="tm-title-item ${isUnlocked ? 'unlocked' : 'locked'}">
                    ${mascotDisplayHTML ? `<div class="tm-title-mascot-preview">${mascotDisplayHTML}</div>` : ''}
                    <div class="tm-title-level">Lv. ${rank.level}</div>
                    <div class="tm-title-name" style="color: ${rank.color}; ${glowStyle}">${rank.title}</div>
                </div>
            `;
        }).join('');

        overlay.innerHTML = `
            <div class="tm-modal-content" style="max-width: 600px; height: auto;">
                <div class="tm-modal-header"><h2 class="tm-modal-title">🏆 Titles & Ranks</h2><button class="tm-modal-close">&times;</button></div>
                <div id="tm-titles-container">${titlesHTML}</div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('.tm-modal-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }
    /**
     * Adds "Send to Scratchpad" buttons on relevant pages.
     */
    function initScratchpadIntegration() {
        if (!config.scratchpadEnabled) return;

        // On service list page, add button to each row
        if (window.location.pathname.includes('/mymanagerservice/service_list.php')) {
            const gridTable = document.querySelector('table.rnr-b-grid');
            if (!gridTable) return;

            // Get headers once for all rows
            const headers = Array.from(gridTable.querySelectorAll('thead th')).map(th => th.innerText.trim());

            gridTable.querySelectorAll('tbody tr[id^="gridRow"]').forEach(row => {
                const firstCell = row.cells[0];
                if (firstCell) {
                    const button = document.createElement('button');
                    button.innerHTML = '🗒️';
                    button.title = 'Send to Scratchpad';
                    button.className = 'tm-quick-action-btn';
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const orderLink = findOrderLink(row, window.location.href);

                        // Create a key-value string from headers and cell content
                        const rowText = Array.from(row.cells)
                            .map((cell, index) => {
                                const header = headers[index];
                                const text = cell.innerText.trim();
                                // Skip the first column (checkbox) and any empty cells
                                if (index === 0 || !text || !header) {
                                    return null;
                                }
                                return text;
                            })
                            .filter(Boolean) // Remove null entries
                            .join(' | ');

                        if (typeof window.sendToScratchpad === 'function') {
                            window.sendToScratchpad(rowText, orderLink);
                        }
                    });
                    firstCell.appendChild(button);
                }
            });
        }
    }
    // ===================================================================
    /**
     * Initializes a "Scroll to Top" button that appears on long pages.
     */
    function initScrollToTopFeature() {
        if (!config.scrollToTopEnabled) return;

        const btn = document.createElement('button');
        btn.id = 'tm-scroll-to-top-btn';
        btn.innerHTML = '&#9650;'; // Up arrow
        btn.title = 'Μετάβαση στην κορυφή';
        document.body.appendChild(btn);

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        const debouncedScrollCheck = debounce(() => {
            if (window.scrollY > 300) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        }, 150);

        window.addEventListener('scroll', debouncedScrollCheck);
    }



    /**
     * Checks if a new order has been created and tracks it.
     */
    function initOrderTracking() {
        const pathname = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);

        const isOrderListPage = pathname.includes('srvorders_list.php') || pathname.includes('sparepartstoorder_list.php');
        const isRecordAdded = urlParams.get('a') === 'added';

            if (config.levelUpSystemEnabled && isOrderListPage && isRecordAdded) {
            // Use sessionStorage to prevent re-tracking on reload within the same tab session.
            const trackedKey = `tm_tracked_add_${pathname}`;
            if (!sessionStorage.getItem(trackedKey)) {
                console.log('[MMS] New order detected. Tracking stat.');
                trackDailyStat('ordersCreated');
                sessionStorage.setItem(trackedKey, 'true');
            }
        }
    }

    /**
     * Initializes fun, non-essential features like confetti.
     */
    function initFunFeatures() {
        if (!config.confettiEnabled) return;

        // --- Track Status Changes & Confetti on Completion ---
        if (window.location.pathname.includes('/mymanagerservice/service_edit.php')) {
            const buttons = document.querySelectorAll('.rnr-b-editbuttons a.rnr-button');
            buttons.forEach(button => {
                // Assume any button in this container that isn't "Back to List" or "Print" is a status change.
                const buttonText = button.innerText.toUpperCase();
                const isStatusButton = !buttonText.includes('BACK TO LIST') && !buttonText.includes('ΕΚΤΥΠΩΣΗ');

                if (isStatusButton) {
                    button.addEventListener('click', () => {
                        // A small delay to let the page's own logic run before we track.
                        setTimeout(() => {
                            console.log(`[MMS] Status change button clicked: "${button.innerText}".`);
                            trackDailyStat('statusChanges'); // Grant XP for any status change.

                            // Special rewards for completing a repair
                            if (button.innerHTML.includes('ΠΡΟΣ ΠΑΡΑΔΟΣΗ')) {
                                trackDailyStat('repairsCompleted');
                                if (config.interactiveMascotEnabled) {
                                    setMascotState('happy', 5000);
                                }
                                if (config.confettiEnabled) triggerConfetti(100);
                            }
                        }, 500);
                    });
                }
            });
        }
    }

    // ===================================================================
    // === 7. FEATURE: TECHNICIAN STATS ON SERVICE LIST
    // ===================================================================
    /**
     * On the service list page, calculates and displays statistics for each technician.
     * Stats include: number of repairs, total labor cost, and total parts cost.
     */
    function initTechnicianStatsFeature() {
        // Prevent creating multiple modals if one is already open
        if (document.querySelector('.tm-modal-overlay')) {
            return;
        }

        // 1. Helper functions
        function parsePrice(priceText) {
            if (!priceText) return 0;
            // Remove currency symbols, spaces, and use dot as decimal separator
            const cleanText = priceText.replace(/€/g, '').replace(/\./g, '').replace(/,/g, '.').trim();
            const price = parseFloat(cleanText);
            return isNaN(price) ? 0 : price;
        }

        // 2. Find the main data table and its headers
        const gridTable = document.querySelector('table.rnr-b-grid');
        if (!gridTable) {
            console.error('[MMS Stats] Could not find the main data grid table.');
            return;
        }

        const headers = Array.from(gridTable.querySelectorAll('thead th'));
        const headerTexts = headers.map(th => th.innerText.trim());

        // 3. Find the column indexes dynamically by header text
        const technicianIndex = headerTexts.findIndex(text => text.includes('Τεχνικός'));
        const laborCostIndex = headerTexts.findIndex(text => text.includes('Επισκευή'));
        const partsCostIndex = headerTexts.findIndex(text => text.includes('Ανταλλακτικά'));

        if (technicianIndex === -1 || laborCostIndex === -1 || partsCostIndex === -1) {
            console.error('[MMS Stats] Could not find all required columns (Technician, Labor Cost, Parts Cost).');
            console.log('[MMS Stats] Found Headers:', headerTexts);
            console.log(`[MMS Stats] Indexes - Tech: ${technicianIndex}, Labor: ${laborCostIndex}, Parts: ${partsCostIndex}`);
            return;
        }

        // 4. Iterate through all rows and aggregate data directly
        const stats = {};
        const rows = gridTable.querySelectorAll('tbody tr[id^="gridRow"]');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const technicianName = cells[technicianIndex]?.innerText.trim();
            if (technicianName) {
                const laborCost = parsePrice(cells[laborCostIndex]?.innerText);
                const partsCost = parsePrice(cells[partsCostIndex]?.innerText);

                if (!stats[technicianName]) {
                    stats[technicianName] = { repairs: 0, totalLabor: 0, totalParts: 0 };
                }
                stats[technicianName].repairs++;
                stats[technicianName].totalLabor += laborCost;
                stats[technicianName].totalParts += partsCost;
            }
        });

        if (Object.keys(stats).length === 0) {
            alert('Δεν βρέθηκαν δεδομένα τεχνικών για ανάλυση σε αυτή τη σελίδα.');
            return;
        }

        // 5. Build the HTML for the stats table
        let totalRepairs = 0, totalLabor = 0, totalParts = 0;
        let rowsHTML = '';
        const sortedTechs = Object.keys(stats).sort();

        for (const tech of sortedTechs) {
            rowsHTML += `
                <tr>
                    <td>${tech}</td>
                    <td>${stats[tech].repairs}</td>
                    <td>${stats[tech].totalLabor.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</td>
                    <td>${stats[tech].totalParts.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</td>
                </tr>`;
            totalRepairs += stats[tech].repairs;
            totalLabor += stats[tech].totalLabor;
            totalParts += stats[tech].totalParts;
        }

        const tableHTML = `
             <table class="table table-bordered table-striped" style="width: 100%; text-align: center; margin-top: 10px;">
                 <thead style="background-color: #e9ecef;">
                     <tr><th>Τεχνικός</th><th>Πλήθος Επισκευών</th><th>Σύνολο Εργασίας</th><th>Σύνολο Ανταλ/κών</th></tr>
                 </thead>
                 <tbody>${rowsHTML}</tbody>
                 <tfoot style="font-weight: bold; background-color: #e9ecef;">
                     <tr><td>ΣΥΝΟΛΟ</td><td>${totalRepairs}</td><td>${totalLabor.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</td><td>${totalParts.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</td></tr>
                 </tfoot>
             </table>`;

        // 6. Create the modal UI
        trackDailyStat('viewTechStats'); // Grant XP only when the modal is about to be successfully created.
        console.log('[MMS] On service_list page, initializing Technician Stats feature.');

        const overlay = document.createElement('div');
        overlay.className = 'tm-modal-overlay';
        overlay.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-modal-header">
                    <h2 class="tm-modal-title">Στατιστικά Τεχνικών (Τρέχουσα Σελίδα)</h2>
                    <button class="tm-modal-close">&times;</button>
                </div>
                <div id="tm-stats-table-container">${tableHTML}</div>
            </div>
        `;
        document.body.appendChild(overlay);
        console.log('[MMS Stats] Technician stats modal displayed.');

        // 7. Set up event listeners for closing the modal
        overlay.querySelector('.tm-modal-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }

    // ===================================================================
    // === 8. FEATURE: CUSTOMER HISTORY QUICK VIEW
    // ===================================================================

    /**
     * Fetches and displays a customer's repair history in a modal.
     * @param {string} searchTerm The name or phone number of the customer to search for.
     */
    function showCustomerHistoryModal(searchTerm) {
        trackDailyStat('viewCustomerHistory'); // Grant XP for viewing history
        // Close any existing history modal to prevent race conditions and overlap.
        const existingModal = document.getElementById('tm-customer-history-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 1. Create and show a loading modal immediately
        const overlay = document.createElement('div');
        overlay.className = 'tm-modal-overlay';
        overlay.id = 'tm-customer-history-modal'; // Assign a unique ID
        overlay.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-modal-header">
                    <h2 class="tm-modal-title">Ιστορικό Επισκευών: ${searchTerm}</h2>
                    <button class="tm-modal-close">&times;</button>
                </div>
                <div id="tm-customer-history-container">
                    <div id="tm-status-message">Αναζήτηση ιστορικού...</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('.tm-modal-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        // 2. Perform the background search
        const searchUrl = `/mymanagerservice/service_list.php?qs=${encodeURIComponent(searchTerm)}&pagesize=-1`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: searchUrl,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const historyContainer = overlay.querySelector('#tm-customer-history-container');

                const rows = doc.querySelectorAll('tbody tr[id^="gridRow"]');
                if (rows.length === 0) {
                    historyContainer.innerHTML = `<div id="tm-status-message">Δεν βρέθηκαν άλλες επισκευές για αυτόν τον πελάτη.</div>`;
                    return;
                }

                // Find column indexes from the fetched document
                const headers = Array.from(doc.querySelectorAll('thead th'));
                const headerTexts = headers.map(th => th.innerText.trim());
                const dateIndex = headerTexts.findIndex(text => text.includes('Ημ.Εισαγωγής'));
                const deviceIndex = headerTexts.findIndex(text => text.includes('Συσκευή'));
                const ageIndex = headerTexts.findIndex(text => text.includes('Παλαιότητα'));
                const repairNumberIndex = headerTexts.findIndex(text => text.includes('Αρ.'));
                const statusIndex = headerTexts.findIndex(text => text.includes('Κατάσταση'));

                // 3. Build the results table
                let tableHTML = `
                    <table class="table table-bordered table-striped" style="width: 100%; text-align: center; margin-top: 10px;">
                        <thead><tr style="text-align: center;">
                            <th class="tm-sortable-header" data-column="0" data-sort-type="date">Ημ/νία Εισαγωγής</th>
                            <th class="tm-sortable-header" data-column="1" data-sort-type="string">Παλαιότητα</th>
                            <th class="tm-sortable-header" data-column="2" data-sort-type="string">Αρ.</th>
                            <th class="tm-sortable-header" data-column="3" data-sort-type="string">Συσκευή</th>
                            <th class="tm-sortable-header" data-column="4" data-sort-type="string">Κατάσταση</th>
                        </tr></thead>
                        <tbody>`;

                rows.forEach(row => {
                    const cells = row.cells;
                    const repairLink = findOrderLink(row, response.finalUrl) || '#';
                    const dateText = cells[dateIndex]?.innerText.trim() || 'N/A';
                    const ageText = cells[ageIndex]?.innerText.trim() || 'N/A';
                    const repairNumberText = cells[repairNumberIndex]?.innerText || 'N/A';
                    const statusHTML = cells[statusIndex]?.innerHTML || 'N/A';
                    tableHTML += `
                        <tr>
                            <td>${dateText}</td>
                            <td>${ageText}</td>
                            <td><a href="${repairLink}" target="_blank">${repairNumberText}</a></td>
                            <td>${cells[deviceIndex]?.innerText.trim() || 'N/A'}</td>
                            <td>${statusHTML}</td>
                        </tr>
                    `;
                });

                tableHTML += `</tbody></table>`;
                historyContainer.innerHTML = tableHTML;

                // 4. Add sorting logic
                const table = historyContainer.querySelector('table');
                const sortableHeaders = table.querySelectorAll('.tm-sortable-header');
                const tbody = table.querySelector('tbody');
                let currentSort = { column: -1, direction: 'asc' };

                sortableHeaders.forEach(header => {
                    header.addEventListener('click', () => {
                        const columnIndex = parseInt(header.dataset.column, 10);
                        const sortType = header.dataset.sortType || 'string';
                        const direction = (currentSort.column === columnIndex && currentSort.direction === 'asc') ? 'desc' : 'asc';

                        const rowsArray = Array.from(tbody.querySelectorAll('tr'));

                        const parseValue = (cell, type) => {
                            const text = cell.innerText.trim();
                            if (type === 'date') {
                                const parts = text.split(' ')[0].split('/');
                                return parts.length === 3 ? new Date(parts[2], parts[1] - 1, parts[0]) : new Date(0);
                            }
                            if (type === 'price') {
                                return parseFloat(text.replace(/€/g, '').replace(/\./g, '').replace(/,/g, '.').trim()) || 0;
                            }
                            return text.toLowerCase();
                        };

                        rowsArray.sort((a, b) => {
                            const valA = parseValue(a.cells[columnIndex], sortType);
                            const valB = parseValue(b.cells[columnIndex], sortType);

                            if (valA < valB) return direction === 'asc' ? -1 : 1;
                            if (valA > valB) return direction === 'asc' ? 1 : -1;
                            return 0;
                        });

                        // Re-append sorted rows
                        rowsArray.forEach(row => tbody.appendChild(row));

                        // Update header indicators
                        sortableHeaders.forEach(h => h.innerHTML = h.innerHTML.replace(/ [▲▼]/, ''));
                        header.innerHTML += direction === 'asc' ? ' ▲' : ' ▼';

                        currentSort = { column: columnIndex, direction: direction };
                    });
                });

                // Automatically sort by date descending on first load
                const dateHeader = historyContainer.querySelector('[data-column="0"]');
                if (dateHeader) {
                    // Click twice to get descending order
                    dateHeader.click();
                    setTimeout(() => {
                        if (currentSort.direction === 'asc') {
                            dateHeader.click();
                        }
                    }, 0);
                }
            },
            onerror: function(error) {
                overlay.querySelector('#tm-customer-history-container').innerHTML = `<div id="tm-status-message" class="tm-details-error">Σφάλμα κατά την ανάκτηση ιστορικού.</div>`;
                console.error('[MMS History] Failed to fetch customer history:', error);
            }
        });
    }

    /**
     * Finds customer name and phone cells in the service list and makes them clickable to show history.
     */
    function initCustomerHistoryFeature() {
        if (!config.customerHistoryEnabled || !window.location.pathname.includes('/mymanagerservice/service_list.php')) return;

        const gridTable = document.querySelector('table.rnr-b-grid');
        if (!gridTable) return;

        const headers = Array.from(gridTable.querySelectorAll('thead th'));
        const customerNameIndex = headers.findIndex(th => th.innerText.trim().includes('Πελάτης'));
        const phoneIndex = headers.findIndex(th => th.innerText.trim().includes('Τηλέφωνο'));

        const makeCellClickable = (cell, isPhoneNumber = false) => {
            if (cell && cell.innerText.trim()) {
                cell.classList.add('tm-customer-history-link');
                cell.title = 'Εμφάνιση ιστορικού επισκευών';
                cell.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let rawSearchTerm = cell.innerText.trim();
                    // If it's a phone number, clean it by removing all non-digit characters.
                    // This handles formats like '69X XXX XXXX' by turning them into '69XXXXXXXX'.
                    if (isPhoneNumber) {
                        rawSearchTerm = rawSearchTerm.replace(/\D/g, '');
                    }
                    // If the cell contains multiple lines (e.g., multiple phone numbers),
                    // only use the first line for the search to ensure a clean query.
                    const searchTerm = cell.innerText.trim().split('\n')[0];
                    showCustomerHistoryModal(searchTerm);
                });
            }
        };

        gridTable.querySelectorAll('tbody tr[id^="gridRow"]').forEach(row => {
            if (customerNameIndex > -1) makeCellClickable(row.cells[customerNameIndex], false);
            if (phoneIndex > -1) makeCellClickable(row.cells[phoneIndex], true);
        });
        console.log('[MMS] Customer History Quick View initialized.');
    }

    // ===================================================================
    // === 8a. FEATURE: AUTOMATED PARTS SEARCH SIDEBAR
    // ===================================================================
    /**
     * On repair pages, automatically searches for common parts for the detected
     * device model and displays them in a non-intrusive sidebar.
     */
    function initAutomatedPartsSearch() {
        // Only run on service edit pages and if the feature is enabled
        if (!config.automatedPartsSearchEnabled || !window.location.pathname.includes('/mymanagerservice/service_edit.php')) {
            return;
        }

        const deviceModel = getPhoneModelFromPage();
        if (!deviceModel) {
            console.log('[MMS Parts Search] No device model detected on this page. Aborting.');
            return;
        }

        console.log(`[MMS Parts Search] Detected model: "${deviceModel}". Initializing sidebar.`);

        // 1. Create the Sidebar UI
        const sidebar = document.createElement('div');
        sidebar.id = 'tm-auto-parts-sidebar';
        sidebar.innerHTML = `
            <div id="tm-auto-parts-header">
                <span id="tm-auto-parts-title">Suggested Parts</span>
                <button id="tm-auto-parts-close">&times;</button>
            </div>
            <div id="tm-auto-parts-content"></div>
        `;
        document.body.appendChild(sidebar);

        // Add styles for the new sidebar
        GM_addStyle(`
            #tm-auto-parts-sidebar {
                position: fixed; top: 80px; left: 10px; width: 280px;
                max-height: calc(100vh - 100px); background: #f9f9f9;
                border: 1px solid #ccc; border-radius: 8px; z-index: 9995;
                box-shadow: 0 3px 10px rgba(0,0,0,0.15); display: flex;
                flex-direction: column; font-size: 13px;
            }
            #tm-auto-parts-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 8px 12px; background: #e9ecef; border-bottom: 1px solid #ccc;
            }
            #tm-auto-parts-title { font-weight: bold; color: #333; }
            #tm-auto-parts-close { background: none; border: none; font-size: 20px; cursor: pointer; }
            #tm-auto-parts-content { padding: 10px; overflow-y: auto; }
            .tm-parts-category { margin-bottom: 15px; }
            .tm-parts-category-title { font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 8px; }
            .tm-parts-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
            .tm-parts-list-item a {
                display: block; padding: 4px 6px; border-radius: 4px;
                text-decoration: none; color: var(--tm-primary-color);
                background: #fff; border: 1px solid #eee;
            }
            .tm-parts-list-item a:hover { background: #e7f1ff; }
            .tm-parts-loading, .tm-parts-not-found { color: #888; font-style: italic; }
        `);

        sidebar.querySelector('#tm-auto-parts-close').addEventListener('click', () => sidebar.remove());

        const contentContainer = sidebar.querySelector('#tm-auto-parts-content');

        // 2. Perform searches for each common part
        config.quickSearchButtons.forEach(part => {
            const searchTerm = `${deviceModel} ${part.term}`;
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'tm-parts-category';
            categoryDiv.innerHTML = `
                <div class="tm-parts-category-title">${part.label}</div>
                <div class="tm-parts-loading">Searching...</div>
                <ul class="tm-parts-list"></ul>
            `;
            contentContainer.appendChild(categoryDiv);

            const searchUrl = `/mymanagerservice/products_list.php?qs=${encodeURIComponent(searchTerm)}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: searchUrl,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const list = categoryDiv.querySelector('.tm-parts-list');
                    const rows = doc.querySelectorAll('tbody tr[id^="gridRow"]');

                    categoryDiv.querySelector('.tm-parts-loading').style.display = 'none';

                    if (rows.length === 0) {
                        categoryDiv.innerHTML += '<div class="tm-parts-not-found">No results found.</div>';
                    } else {
                        rows.forEach(row => {
                            const link = row.querySelector('a[href*="products_edit.php"]');
                            const description = row.cells[2]?.innerText.trim(); // Assuming description is in the 3rd cell
                            if (link && description) {
                                list.innerHTML += `<li class="tm-parts-list-item"><a href="${link.href}" target="_blank">${description}</a></li>`;
                            }
                        });
                    }
                }
            });
        });
    }

    // ===================================================================
    // === 9. FEATURE: DAILY DASHBOARD WIDGET
    // ===================================================================
    /**
     * Creates a small widget in the footer to display today's tracked statistics.
     * @param {HTMLElement} parentContainer The container element to which the widget will be appended.
     */
    function initDailyDashboardWidget(parentContainer) {
        if (!config.dashboardWidgetEnabled) return;

        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        // Load stats from GM storage
        let stats = { date: today, searches: 0, repairsCompleted: 0, ordersCreated: 0 };
        try {
            const savedStats = JSON.parse(GM_getValue(STORAGE_KEYS.DAILY_STATS, '{}'));
            // If the saved date is today, use the saved stats. Otherwise, the fresh object (all zeros) will be used.
            if (savedStats.date === today) {
                stats = savedStats;
            }
        } catch (e) {
            console.error('[MMS] Could not parse daily stats for dashboard, showing zeros.', e);
        }

        // Create the widget's HTML
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'tm-daily-dashboard-widget';
        widgetContainer.style.color = '#fff';
        widgetContainer.style.fontSize = '12px';
        widgetContainer.style.display = 'flex';
        widgetContainer.style.alignItems = 'center';
        widgetContainer.style.gap = '8px';
        widgetContainer.title = `Σημερινά Στατιστικά:\n- ${stats.ordersCreated || 0} Νέες Παραγγελίες\n- ${stats.repairsCompleted || 0} Ολοκληρωμένες Επισκευές\n- ${stats.searches || 0} Αναζητήσεις`;

        widgetContainer.innerHTML = `
            <span style="font-weight: bold;">Σήμερα:</span>
            <span>📝 ${stats.ordersCreated || 0}</span>
            <span style="opacity: 0.5;">|</span>
            <span>🛠️ ${stats.repairsCompleted || 0}</span>
            <span style="opacity: 0.5;">|</span>
            <span>🔍 ${stats.searches || 0}</span>
        `;

        // Add the widget to the parent container in the footer
        parentContainer.appendChild(widgetContainer);
        console.log('[MMS] Daily Dashboard widget initialized in footer.');
    }

    /**
     * Creates a small widget in the footer to display the user's XP bar.
     * @param {HTMLElement} parentContainer The container element to which the widget will be appended.
     */
    function initXpBarWidget(parentContainer) {
        if (!config.levelUpSystemEnabled) return;

        const currentLevel = GM_getValue(STORAGE_KEYS.USER_LEVEL, 1);
        const currentTitle = GM_getValue(STORAGE_KEYS.USER_TITLE, RANKS[0].title);
        const currentXp = GM_getValue(STORAGE_KEYS.USER_XP, 0);

        const xpBarContainer = document.createElement('div');
        xpBarContainer.id = 'tm-xp-bar-container';
        const xpForNextLevel = getXpForLevel(currentLevel);
        xpBarContainer.title = `${currentTitle}\nExperience Points`;
        xpBarContainer.innerHTML = `
            <span id="tm-user-title-text"></span>
            <span id="tm-energized-buff-indicator" style="display: none;"></span>
            <span id="tm-level-text">Lv. ${currentLevel}</span>
            <div class="tm-xp-bar" title="${currentXp} / ${xpForNextLevel} XP">
                <div id="tm-xp-bar-fill" style="width: ${(currentXp / xpForNextLevel) * 100}%;"></div>
                <div id="tm-xp-text">${xpForNextLevel - currentXp} XP to next level</div>
            </div>
        `;
        const rankInfo = RANKS.slice().reverse().find(r => currentLevel >= r.level) || RANKS[0];
        const titleColor = rankInfo.color;
        const glowStyle = rankInfo.glow ? `text-shadow: 0 0 5px ${titleColor};` : '';

        parentContainer.appendChild(xpBarContainer);
        // Now that the elements are in the DOM, update them with the correct title and style
        const titleText = document.getElementById('tm-user-title-text');
        titleText.textContent = currentTitle;
        titleText.style.color = titleColor;
        titleText.style.textShadow = glowStyle;

        // Make the entire bar clickable to show the titles modal
        xpBarContainer.style.cursor = 'pointer';
        xpBarContainer.addEventListener('click', showTitlesModal);

        console.log('[MMS] XP Bar widget initialized in footer.');
    }

    function updateXpBarUI(level, xp, xpForNext) {
        const xpBarFill = document.getElementById('tm-xp-bar-fill');
        const xpText = document.getElementById('tm-xp-text');
        const levelText = document.getElementById('tm-level-text');
        const titleText = document.getElementById('tm-user-title-text');
        const xpBar = document.querySelector('.tm-xp-bar');

        const percentage = (xp / xpForNext) * 100;
        if (xpBarFill) xpBarFill.style.width = `${percentage}%`;
        if (xpText) xpText.textContent = `${xpForNext - xp} XP to next level`;
        if (xpBar) xpBar.title = `${xp} / ${xpForNext} XP`;

        const rankInfo = RANKS.slice().reverse().find(r => level >= r.level) || RANKS[0];

        if (titleText) {
            titleText.textContent = rankInfo.title;
            titleText.style.color = rankInfo.color;
            titleText.style.textShadow = rankInfo.glow ? `0 0 5px ${rankInfo.color}` : 'none';
        }
        levelText.textContent = `Lv. ${level}`;
    }


    // ===================================================================
    // === 10. FUN FEATURE: INTERACTIVE MASCOT
    // ===================================================================
    let mascotStateTimeout = null;
    let idleTimer = null;
    let isRoaming = false;
    let roamingTimeout = null;
    let playfulTimeout = null;
    let petStats = { happiness: 100, hunger: 100, lastUpdate: Date.now() };

    function stopRoaming() {
        if (roamingTimeout) clearTimeout(roamingTimeout);
        if (playfulTimeout) clearTimeout(playfulTimeout);

        const mascotContainer = document.getElementById('tm-mascot-container');
        if (mascotContainer) {
            // Get the current computed transform matrix
            const computedStyle = window.getComputedStyle(mascotContainer);
            mascotContainer.style.transform = computedStyle.transform;
            // Now cancel the animation. The element will keep its computed style.
            mascotContainer.getAnimations().forEach(anim => anim.cancel());
        }

        roamingTimeout = null;
        isRoaming = false;
    }

    function startRoaming() {
        const mascotContainer = document.getElementById('tm-mascot-container');
        if (!mascotContainer || isRoaming) return;

        isRoaming = true;

        // Set initial position before starting to move
        if (!mascotContainer.style.transform) {
            mascotContainer.style.transform = `translate(50px, 150px)`;
        }

        // Set a timer for a random playful action
        function schedulePlayfulAction() {
            if (playfulTimeout) clearTimeout(playfulTimeout);
            const randomDelay = 30000 + Math.random() * 30000; // 30-60 seconds
            playfulTimeout = setTimeout(() => {
                const actions = ['reading', 'biking', 'juggling', 'thinking', 'glitching'];
                const randomAction = actions[Math.floor(Math.random() * actions.length)];
                // Set state with a duration, after which it will revert to idle (and thus roaming)
                setMascotState(randomAction, 10000); // Action lasts 10 seconds
            }, randomDelay);
        }

        // Initial schedule
        schedulePlayfulAction();

        async function moveToNewPosition() {
            // Triple-check: Only move if the mascot is truly in an idle/roaming state.
            // This prevents a new move from starting if a temporary state (like 'happy') was just triggered.
            const currentMascotState = mascotContainer.className;
            if (!isRoaming || !currentMascotState.includes('mascot-idle')) {
                return; // Exit if not in a valid roaming state.
            }

            if (!isRoaming) return; // Stop if roaming has been cancelled

            const body = mascotContainer.querySelector('.tm-mascot-main-body');
            const flipper = mascotContainer.querySelector('.tm-mascot-flipper');

            // Get current translation from the transform property
            const transformMatrix = new DOMMatrix(window.getComputedStyle(mascotContainer).transform);
            const [currentX, currentY] = [transformMatrix.m41, transformMatrix.m42];

            // Calculate new random position within viewport bounds
            const mascotWidth = mascotContainer.offsetWidth;
            const mascotHeight = mascotContainer.offsetHeight;
            let newX = Math.random() * (window.innerWidth - mascotWidth);
            let newY = Math.random() * (window.innerHeight - mascotHeight);

            // Clamp values to be safe

            // Refined "collision" check: if moving to the top of the screen, the panel might go off.
            // Let's re-roll the position quickly instead of just stopping.
            if (newY < 150) { // 150px is a safe buffer for the panel
                roamingTimeout = setTimeout(moveToNewPosition, 100); // Try again quickly
                return;
            }

            // Flip the pet's SVG based on horizontal direction
            if (flipper) {
                flipper.style.transform = (newX < currentX) ? 'scaleX(-1)' : 'scaleX(1)';
            }

            // Tilt the body into the turn
            const angle = Math.atan2(newY - currentY, newX - currentX) * (180 / Math.PI);
            const tilt = Math.max(-15, Math.min(15, (newX - currentX) * 0.05)); // Tilt based on horizontal speed
            if (body) {
                body.style.transition = 'transform 0.5s ease-out';
                body.style.transform = `rotate(${tilt}deg)`;
            }

            // Calculate distance to keep speed constant
            const distance = Math.sqrt(Math.pow(newX - currentX, 2) + Math.pow(newY - currentY, 2));
            const speed = config.mascotRoamingSpeed || 100; // pixels per second
            const duration = Math.max(2, distance / speed); // Minimum 2s duration

            // --- Web Animations API Implementation ---

            // 1. Calculate a control point for a quadratic Bezier curve to create an arc.
            const midX = (currentX + newX) / 2;
            const midY = (currentY + newY) / 2;
            const dx = newX - currentX;
            const dy = newY - currentY;
            const bulge = (Math.random() - 0.5) * 0.6; // A random curve factor
            const controlX = midX - dy * bulge;
            const controlY = midY + dx * bulge;

            // 2. Define the animation keyframes for a curved path.
            // CRITICAL: Clear the inline transform style before starting a new animation
            // to prevent conflicts between the old position and the new animation's start frame.
            mascotContainer.style.transform = '';
            const keyframes = [
                { transform: `translate(${currentX}px, ${currentY}px)` }, // Start
                { transform: `translate(${controlX}px, ${controlY}px)`, offset: 0.5 }, // Mid-point (curve)
                { transform: `translate(${newX}px, ${newY}px)` }  // End
            ];

            // 3. Create and play the animation.
            const animation = mascotContainer.animate(keyframes, {
                duration: duration * 1000, // duration in milliseconds
                easing: 'ease-in-out',
                fill: 'forwards' // Keep the final state
            });

            try {
                // 4. Wait for the animation to finish. The 'finished' promise is a key part of the API.
                await animation.finished;
            } catch (error) {
                // The animation might be cancelled (e.g., by another state change).
                // In that case, we just stop this movement sequence.
                console.log('[MMS Mascot] Roaming animation was cancelled.');
                return;
            }

            if (!isRoaming) return; // Check again if roaming was cancelled during the move

            // Reset body tilt after settling
            if (body) {
                // Small delay for a more natural pause
                await new Promise(resolve => setTimeout(resolve, 200));
                body.style.transform = 'rotate(0deg)';
            }

            if (!isRoaming) return; // Final check before scheduling next move

            // Set a timeout to move again after the transition ends
            schedulePlayfulAction(); // Reschedule playful action
            roamingTimeout = setTimeout(moveToNewPosition, 2000 + Math.random() * 3000); // Wait 2-5 seconds before next move
        }

        moveToNewPosition();
    }

    function showMascotBubble(text, duration = 2000) {
        const bubble = document.getElementById('tm-mascot-speech-bubble');
        if (!bubble) return;

        const messages = [ "Whoa!", "Eek!", "Yikes!", "!!!", "Zoinks!", "Watch it!" ];
        // If no text is provided, pick a random one.
        const messageToShow = text || messages[Math.floor(Math.random() * messages.length)];

        bubble.textContent = messageToShow;
        bubble.style.display = 'block';
        // Use a timeout to allow the display property to apply before adding the class for transition
        setTimeout(() => {
            bubble.classList.add('show');
        }, 10);

        // Hide it after the duration
        setTimeout(() => {
            bubble.classList.remove('show');
            // Set display to none after the transition ends
            setTimeout(() => { bubble.style.display = 'none'; }, 300);
        }, duration);
    }

    function triggerDodgeAnimation(moveX, moveY) {
        const mascotContainer = document.getElementById('tm-mascot-container');
        if (!mascotContainer || mascotContainer.classList.contains('mascot-dodging')) {
            return; // Don't dodge if already dodging
        }

        // Stop roaming and set the dodging state. `setMascotState` will call `stopRoaming()`.
        setMascotState('dodging', 1000); // State lasts for 1s
        showMascotBubble(null, 1000); // Show a random bubble for 1s

        // The dodge movement logic
        // The dodge direction should be opposite to the mouse movement
        const dodgeDistance = 75; // Make the dodge shorter
        const magnitude = Math.sqrt(moveX * moveX + moveY * moveY) || 1;
        const dodgeX = -(moveX / magnitude) * dodgeDistance;
        const dodgeY = -(moveY / magnitude) * dodgeDistance;

        // Apply an immediate, short-lived transform
        const currentTransform = new DOMMatrix(window.getComputedStyle(mascotContainer).transform);
        let newX = currentTransform.m41 + dodgeX;
        let newY = currentTransform.m42 + dodgeY;

        // Boundary checks to keep the mascot on screen
        const mascotWidth = mascotContainer.offsetWidth;
        const mascotHeight = mascotContainer.offsetHeight;
        newX = Math.max(0, Math.min(newX, window.innerWidth - mascotWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - mascotHeight));

        mascotContainer.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'; // Use CSS transition for this short, sharp movement
        mascotContainer.style.transform = `translate(${newX}px, ${newY}px)`;

        // The state will automatically revert via the timeout in setMascotState.
        // When it reverts, it will call updatePetStateByStats(), which can restart roaming if appropriate.
        setTimeout(() => {
            mascotContainer.style.transition = 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)'; // Restore default transition
        }, 400); // Match the dodge transition duration
    }

    function setMascotState(state, duration = 0) {
        const mascotContainer = document.getElementById('tm-mascot-container');
        if (!mascotContainer) return;

        // Clear any previous temporary state timeout
        if (mascotStateTimeout) {
            clearTimeout(mascotStateTimeout);
            mascotStateTimeout = null;
        }

        mascotContainer.className = 'tm-mascot-container mascot-' + state;

        // If a duration is set, revert to the correct base state after the time is up
        if (duration > 0) {
            mascotStateTimeout = setTimeout(() => {
                updatePetStateByStats(true); // Revert based on current needs, passing 'true' to indicate the temp state is over.
            }, duration);
        }

        // Handle roaming based on the new state, AFTER the class has been set.
        if (state === 'idle' && !isRoaming) {
            startRoaming();
        } else if (state !== 'idle' && isRoaming) {
            stopRoaming();
        }
    }

    function updatePetStateByStats(isExitingTempState = false) {
        // If a temporary state is active, don't override it with a base state
        const mascotContainer = document.getElementById('tm-mascot-container');
        // This function is called periodically AND at the end of temporary states (like 'dodging').
        // We only want to interrupt a temporary state if we are explicitly being told to do so by its timeout finishing. Also, don't interrupt the energized state.
        if (!isExitingTempState && mascotContainer && ['mascot-happy', 'mascot-eating', 'mascot-dodging', 'mascot-reading', 'mascot-biking', 'mascot-juggling', 'mascot-thinking', 'mascot-glitching', 'mascot-eureka', 'mascot-sunny', 'mascot-rainy', 'mascot-energized'].some(c => mascotContainer.classList.contains(c))) {
            return; // Don't override a temporary state unless its timer has expired.
        }

        if (petStats.hunger < 30 || petStats.happiness < 30) {
            setMascotState('sad');
        } else {
            setMascotState('idle');
        }
    }

    function loadPetStats() {
        const savedStats = JSON.parse(GM_getValue(STORAGE_KEYS.PET_STATS, 'null'));
        if (savedStats) {
            petStats = savedStats;
        }
        // Apply decay for the time the script was inactive
        const timeDiffHours = (Date.now() - petStats.lastUpdate) / (1000 * 60 * 60);
        const decayAmount = Math.floor(timeDiffHours * 5); // Decay 5 points per hour
        if (decayAmount > 0) {
            console.log(`[MMS Pet] Applying ${decayAmount} decay for offline time.`);
            petStats.happiness = Math.max(0, petStats.happiness - decayAmount);
            petStats.hunger = Math.max(0, petStats.hunger - decayAmount);
        }
        updatePetStats(0, 0); // This will save the potentially decayed stats
    }

    function updatePetStats(happinessChange, hungerChange) {
        petStats.happiness = Math.max(0, Math.min(100, petStats.happiness + happinessChange));
        petStats.hunger = Math.max(0, Math.min(100, petStats.hunger + hungerChange));
        petStats.lastUpdate = Date.now();

        GM_setValue(STORAGE_KEYS.PET_STATS, JSON.stringify(petStats));
        updatePetInteractionPanel();
        updatePetStateByStats();
    }

    function updatePetInteractionPanel() {
        const happinessFill = document.getElementById('tm-pet-happiness-fill');
        const hungerFill = document.getElementById('tm-pet-hunger-fill');
        if (!happinessFill || !hungerFill) return;

        happinessFill.style.width = `${petStats.happiness}%`;
        hungerFill.style.width = `${petStats.hunger}%`;
    }

    function resetIdleTimer() {
        if (idleTimer) { clearTimeout(idleTimer); }
        const mascotContainer = document.getElementById('tm-mascot-container');
        // If waking up from power-save, do a little jolt
        if (mascotContainer && mascotContainer.classList.contains('mascot-powersave')) {
            const robot = mascotContainer.querySelector('.tm-mascot-robot');
            if (robot) {
                robot.style.animation = 'tm-mascot-startled 0.4s ease-out';
                setTimeout(() => { robot.style.animation = ''; }, 400);
            }
        }

        updatePetStateByStats(); // Wake up and set to idle/sad

        // Set mascot to sleep after 3 minutes of inactivity
        idleTimer = setTimeout(() => {
            setMascotState('powersave');
        }, 3 * 60 * 1000);
    }

    function initInteractiveMascot() {
        if (!config.interactiveMascotEnabled) return;

        const container = document.createElement('div');
        container.id = 'tm-mascot-container';
        container.classList.add('tm-mascot-container');
        container.title = "Click me!";
        // Simple robot SVG
        container.innerHTML = `
            <div id="tm-mascot-speech-bubble" class="tm-mascot-speech-bubble" style="display: none;"></div>
            <div id="tm-mascot-interaction-panel">
                <div id="tm-pet-happiness-bar" title="Η ευτυχία μειώνεται με τον χρόνο και αυξάνεται όταν τον χαϊδεύετε ή κάνετε εργασίες.">
                    <div class="tm-pet-stat-label">😊 Happiness</div>
                    <div class="tm-pet-stat-bar"><div id="tm-pet-happiness-fill" class="tm-pet-stat-bar-fill"></div></div>
                </div>
                <div id="tm-pet-hunger-bar">
                    <div class="tm-pet-stat-label">🍔 Hunger</div>
                    <div class="tm-pet-stat-bar"><div id="tm-pet-hunger-fill" class="tm-pet-stat-bar-fill"></div></div>
                </div>
                <div id="tm-mascot-interaction-buttons">
                    <button id="tm-pet-feed-btn">Feed</button>
                    <button id="tm-pet-pet-btn">Pet</button>
                    <button id="tm-play-bug-game-btn" title="Play Bug Squish!">Squish 🐞</button>
                    <button id="tm-play-memory-game-btn" title="Play Memory Game!">Memory 🧠</button>
                </div>
            </div>
            <svg class="tm-mascot-robot" viewBox="0 0 100 100" style="overflow: visible;">
                <!-- Flipper group for horizontal flipping -->
                <g class="tm-mascot-flipper" transform-origin="50 50">
                    <!-- Base Form (Lv 1-9) -->
                    <g id="tm-mascot-base" style="display: block;">
                        <g class="tm-mascot-antenna"><line x1="50" y1="15" x2="50" y2="5" stroke="#333" stroke-width="2"/><circle cx="50" cy="5" r="3" fill="#ffc107"/></g>
                        <g class="tm-mascot-main-body">
                            <rect x="25" y="15" width="50" height="40" rx="10" fill="#e0e0e0" stroke="#333" stroke-width="3"/>
                            <g class="tm-mascot-eye-open"><circle cx="40" cy="35" r="5" fill="white"/><circle cx="40" cy="35" r="2" fill="black"/><circle cx="60" cy="35" r="5" fill="white"/><circle cx="60" cy="35" r="2" fill="black"/></g>
                            <g class="tm-mascot-eye-closed" style="display:none;"><path d="M 35 35 Q 40 30 45 35" stroke="black" stroke-width="2" fill="none"/><path d="M 55 35 Q 60 30 65 35" stroke="black" stroke-width="2" fill="none"/></g>
                            <path class="tm-mascot-mouth-happy" d="M 40 45 Q 50 55 60 45" stroke="black" stroke-width="2" fill="none"/>
                            <path class="tm-mascot-mouth-sad" style="display:none;" d="M 40 50 Q 50 40 60 50" stroke="black" stroke-width="2" fill="none"/>
                            <rect x="20" y="55" width="60" height="30" rx="5" fill="#d0d0d0" stroke="#333" stroke-width="3"/>
                        </g>
                        <g class="tm-mascot-thrusters"><rect class="tm-mascot-thruster-left" x="30" y="85" width="15" height="10" fill="#6c757d"/><rect class="tm-mascot-thruster-right" x="55" y="85" width="15" height="10" fill="#6c757d"/></g>
                    </g>

                    <!-- Evo 1 Form (Lv 10-24) - Sleeker, blueish tint -->
                    <g id="tm-mascot-evo1" style="display: none;">
                        <g class="tm-mascot-antenna"><line x1="50" y1="15" x2="50" y2="5" stroke="#555" stroke-width="2"/><circle cx="50" cy="5" r="3" fill="#17a2b8"/></g>
                        <g class="tm-mascot-main-body">
                            <rect x="25" y="15" width="50" height="40" rx="5" fill="#d4e6f1" stroke="#34495e" stroke-width="3"/>
                            <g class="tm-mascot-eye-open"><rect x="35" y="32" width="10" height="6" fill="white" rx="1"/><rect x="55" y="32" width="10" height="6" fill="white" rx="1"/></g>
                            <g class="tm-mascot-eye-closed" style="display:none;"><line x1="35" y1="35" x2="45" y2="35" stroke="black" stroke-width="2"/><line x1="55" y1="35" x2="65" y2="35" stroke="black" stroke-width="2"/></g>
                            <path class="tm-mascot-mouth-happy" d="M 40 45 Q 50 50 60 45" stroke="black" stroke-width="2" fill="none"/>
                            <path class="tm-mascot-mouth-sad" style="display:none;" d="M 40 50 Q 50 45 60 50" stroke="black" stroke-width="2" fill="none"/>
                            <rect x="20" y="55" width="60" height="30" rx="3" fill="#b9d7ea" stroke="#34495e" stroke-width="3"/>
                        </g>
                        <g class="tm-mascot-thrusters"><rect class="tm-mascot-thruster-left" x="30" y="85" width="15" height="10" fill="#5d6d7e" rx="2"/><rect class="tm-mascot-thruster-right" x="55" y="85" width="15" height="10" fill="#5d6d7e" rx="2"/></g>
                    </g>

                    <!-- Evo 2 Form (Lv 25+) - Gold trim, more advanced -->
                    <g id="tm-mascot-evo2" style="display: none;">
                        <g class="tm-mascot-antenna"><line x1="50" y1="15" x2="50" y2="5" stroke="#333" stroke-width="2"/><circle cx="50" cy="5" r="3" fill="#ffc107" stroke="#fff" stroke-width="0.5"/></g>
                        <g class="tm-mascot-main-body">
                            <rect x="25" y="15" width="50" height="40" rx="8" fill="#f1f1f1" stroke="#ffc107" stroke-width="3"/>
                            <g class="tm-mascot-eye-open"><path d="M 35 32 L 45 32 L 40 40 Z" fill="#17a2b8"/><path d="M 55 32 L 65 32 L 60 40 Z" fill="#17a2b8"/></g>
                            <g class="tm-mascot-eye-closed" style="display:none;"><line x1="35" y1="35" x2="45" y2="35" stroke="black" stroke-width="2"/><line x1="55" y1="35" x2="65" y2="35" stroke="black" stroke-width="2"/></g>
                            <path class="tm-mascot-mouth-happy" d="M 40 48 L 60 48" stroke="black" stroke-width="2" fill="none"/>
                            <path class="tm-mascot-mouth-sad" style="display:none;" d="M 40 50 Q 50 45 60 50" stroke="black" stroke-width="2" fill="none"/>
                            <rect x="20" y="55" width="60" height="30" rx="5" fill="#e0e0e0" stroke="#ffc107" stroke-width="3"/>
                        </g>
                        <g class="tm-mascot-thrusters"><rect class="tm-mascot-thruster-left" x="30" y="85" width="15" height="12" fill="#333" rx="3"/><rect class="tm-mascot-thruster-right" x="55" y="85" width="15" height="12" fill="#333" rx="3"/></g>
                    </g>

                    <!-- Evo 3 Form (Lv 50+) - Prophet, purple/dark theme -->
                    <g id="tm-mascot-evo3" style="display: none;">
                        <g class="tm-mascot-antenna"><line x1="50" y1="15" x2="50" y2="5" stroke="#a335ee" stroke-width="2.5"/><circle cx="50" cy="5" r="3.5" fill="#f0f" stroke="#fff" stroke-width="1"/></g>
                        <g class="tm-mascot-main-body">
                            <rect x="25" y="15" width="50" height="40" rx="12" fill="#2c2c2c" stroke="#a335ee" stroke-width="3"/>
                            <g class="tm-mascot-eye-open"><path d="M 35 30 L 45 40 M 45 30 L 35 40" stroke="#f0f" stroke-width="2"/><path d="M 55 30 L 65 40 M 65 30 L 55 40" stroke="#f0f" stroke-width="2"/></g>
                            <path class="tm-mascot-mouth-happy" d="M 40 48 L 60 48" stroke="#f0f" stroke-width="2" fill="none"/>
                            <rect x="20" y="55" width="60" height="30" rx="8" fill="#3c3c3c" stroke="#a335ee" stroke-width="3"/>
                        </g>
                        <g class="tm-mascot-thrusters"><rect class="tm-mascot-thruster-left" x="30" y="85" width="15" height="15" fill="#a335ee" rx="4"/><rect class="tm-mascot-thruster-right" x="55" y="85" width="15" height="15" fill="#a335ee" rx="4"/></g>
                    </g>

                    <!-- Evo 4 Form (Lv 100+) - Master, gold/white theme -->
                    <g id="tm-mascot-evo4" style="display: none;">
                        <g class="tm-mascot-antenna"><line x1="50" y1="15" x2="50" y2="5" stroke="#ff8000" stroke-width="3"/><circle cx="50" cy="5" r="4" fill="#ffc107" stroke="#fff" stroke-width="1"><animate attributeName="r" values="4;5;4" dur="1.5s" repeatCount="indefinite"/></circle></g>
                        <g class="tm-mascot-main-body">
                            <rect x="25" y="15" width="50" height="40" rx="15" fill="#fff" stroke="#ff8000" stroke-width="4"/>
                            <g class="tm-mascot-eye-open"><circle cx="40" cy="35" r="6" fill="#ff8000"/><circle cx="60" cy="35" r="6" fill="#ff8000"/></g>
                            <path class="tm-mascot-mouth-happy" d="M 40 45 Q 50 55 60 45" stroke="#ff8000" stroke-width="3" fill="none"/>
                            <rect x="20" y="55" width="60" height="30" rx="10" fill="#eee" stroke="#ff8000" stroke-width="4"/>
                        </g>
                        <g class="tm-mascot-thrusters"><rect class="tm-mascot-thruster-left" x="30" y="85" width="15" height="15" fill="#ff8000" rx="5"/><rect class="tm-mascot-thruster-right" x="55" y="85" width="15" height="15" fill="#ff8000" rx="5"/></g>
                    </g>

                    <!-- Accessories (apply to all forms) -->
                    <g id="top_hat" class="tm-mascot-accessory" style="display: none;" transform="translate(0, -5)">
                        <rect x="30" y="5" width="40" height="5" fill="#333" rx="1"/>
                        <rect x="35" y="0" width="30" height="15" fill="#333" />
                    </g>
                    <!-- New: Crown for Level 100 Reward -->
                    <g id="master_crown" class="tm-mascot-accessory" style="display: none;" transform="translate(0, -5)">
                        <path d="M 30 15 L 35 5 L 45 10 L 50 2 L 55 10 L 65 5 L 70 15 Z" fill="#ffc107" stroke="#e5cc80" stroke-width="1.5" stroke-linejoin="round"/>
                    </g>
                    <g class="tm-mascot-accessory tm-mascot-book" style="display: none;"><rect x="20" y="50" width="25" height="20" fill="#a0522d" rx="2"/><rect x="22" y="52" width="21" height="16" fill="#fff"/></g>
                    <g class="tm-mascot-accessory tm-mascot-bicycle" style="display: none;"><rect x="20" y="80" width="60" height="5" fill="#dc3545" rx="2"/><circle cx="30" cy="90" r="5" stroke="#333" stroke-width="2" fill="white"/><circle cx="70" cy="90" r="5" stroke="#333" stroke-width="2" fill="white"/></g>
                    <circle class="tm-mascot-accessory tm-mascot-ball" cx="50" cy="10" r="5" fill="#ffc107" style="display: none;"/>
                    <!-- New: Thinking Accessory -->
                    <g class="tm-mascot-accessory tm-mascot-thinking-bubble" style="display: none;" transform="translate(15, -35)">
                        <path d="M 50 20 C 65 10, 75 25, 60 35 C 70 45, 55 55, 40 45" fill="white" stroke="#333" stroke-width="2"/>
                        <text x="50" y="38" font-size="18" font-family="Arial" font-weight="bold" text-anchor="middle">?</text>
                    </g>
                    <!-- New: Glitching Accessory -->
                    <g class="tm-mascot-accessory tm-mascot-sparks" style="display: none;">
                        <path d="M 40 20 L 45 30 L 35 30 Z" fill="#ffc107" transform="rotate(20 40 25)"/>
                        <path d="M 60 40 L 65 50 L 55 50 Z" fill="#17a2b8" transform="rotate(-30 60 45)"/>
                    </g>
                    <!-- New: Eureka Accessory -->
                    <g class="tm-mascot-accessory tm-mascot-eureka-bubble" style="display: none;" transform="translate(15, -35)">
                        <path d="M 50 20 C 65 10, 75 25, 60 35 C 70 45, 55 55, 40 45" fill="white" stroke="#333" stroke-width="2"/>
                        <text x="50" y="38" font-size="24" font-family="Arial" text-anchor="middle">💡</text>
                    </g>
                    <!-- New: Weather Accessories -->
                    <g class="tm-mascot-accessory tm-mascot-sunglasses" style="display: none;" transform="translate(0, 28)">
                        <rect x="32" y="0" width="16" height="8" rx="4" fill="#222" stroke="black" stroke-width="1"/>
                        <rect x="52" y="0" width="16" height="8" rx="4" fill="#222" stroke="black" stroke-width="1"/>
                        <line x1="48" y1="4" x2="52" y2="4" stroke="black" stroke-width="2"/>
                    </g>
                    <g class="tm-mascot-accessory tm-mascot-umbrella" style="display: none;" transform="translate(40, -30) rotate(-20)">
                        <path d="M 0 20 Q 25 0 50 20" fill="#dc3545" stroke="#333" stroke-width="2"/>
                        <line x1="25" y1="20" x2="25" y2="40" stroke="#333" stroke-width="2"/>
                    </g>
                    <!-- New: Power-Save Accessory -->
                    <g class="tm-mascot-accessory tm-mascot-zzz-bubble" style="display: none;" transform="translate(15, -35)">
                        <text x="50" y="0" font-size="18" font-family="Arial" font-weight="bold" text-anchor="middle">Zzz</text>
                    </g>
                </g>
            </svg>
        `;
        document.body.appendChild(container);

        const interactionPanel = container.querySelector('#tm-mascot-interaction-panel');

        // --- Dodge on fast hover logic ---
        let lastMousePos = { x: 0, y: 0, time: 0 };
        container.addEventListener('mouseenter', () => {
            lastMousePos = { x: 0, y: 0, time: 0 }; // Reset on enter
        });
        container.addEventListener('mousemove', (e) => {
            if (lastMousePos.time === 0) {
                lastMousePos = { x: e.clientX, y: e.clientY, time: Date.now() };
                return;
            }

            const now = Date.now();
            const timeDiff = now - lastMousePos.time;

            if (timeDiff < 25) return; // Sample every 25ms

            const deltaX = e.clientX - lastMousePos.x;
            const deltaY = e.clientY - lastMousePos.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const speed = distance / timeDiff; // pixels per millisecond

            lastMousePos = { x: e.clientX, y: e.clientY, time: now };

            const speedThreshold = 1.5; // 1500 pixels/second
            if (speed > speedThreshold) {
                triggerDodgeAnimation(deltaX, deltaY);
            }
        });


        // --- Pet Interaction Logic ---
        // This flag prevents the mascot from immediately roaming when the panel is closed.
        let justClosedPanel = false;
 
        container.addEventListener('click', (e) => {
            // Ignore clicks on the panel's buttons
            if (e.target.closest('button')) return;

            // Dynamically position panel based on mascot's vertical position
            const mascotRect = container.getBoundingClientRect(); // Mascot's position on screen
            const panelHeight = interactionPanel.offsetHeight || 150; // Use offsetHeight or fallback
            const panelWidth = interactionPanel.offsetWidth || 180; // Use offsetWidth or fallback

            // Vertical positioning: show below if not enough space above
            if (mascotRect.top < panelHeight + 20) {
                interactionPanel.style.bottom = 'auto';
                interactionPanel.style.top = '110px';
            } else { // Otherwise, show panel above (default CSS position)
                interactionPanel.style.top = 'auto';
                interactionPanel.style.bottom = '110px';
            }

            // Horizontal positioning: Keep the panel fully inside the viewport.
            if (mascotRect.left + panelWidth > window.innerWidth - 10) { // If it would go off the right edge...
                // ...align the panel's right edge with the mascot's right edge.
                interactionPanel.style.left = 'auto';
                interactionPanel.style.right = '0px'; // Aligns panel's right to mascot's right
            } else { // Otherwise, align left edge with mascot's left edge (default CSS position)
                interactionPanel.style.left = '0px';
                interactionPanel.style.right = 'auto';
            }

            const willBeVisible = interactionPanel.style.display !== 'flex';
            if (willBeVisible) {
                stopRoaming();
                interactionPanel.style.display = 'flex';
            } else {
                interactionPanel.style.display = 'none';
                // Set a flag and a short timeout before allowing roaming to resume.
                justClosedPanel = true;
                setTimeout(() => {
                    justClosedPanel = false;
                    updatePetStateByStats(); // Now check if it should roam.
                }, 1000); // Wait 1 second before resuming movement.
            }
            e.stopPropagation();
        });
        // Close on outside click, but don't resume roaming immediately.
        document.body.addEventListener('click', () => { if (interactionPanel.style.display === 'flex') { container.click(); } });

        container.querySelector('#tm-pet-feed-btn').addEventListener('click', () => {
            if (petStats.hunger < 100) {
                updatePetStats(0, 30);
                trackDailyStat('feedMascot'); // Grant XP
                setMascotState('eating', 2000);
            }
        });

        container.querySelector('#tm-pet-pet-btn').addEventListener('click', () => {
            if (petStats.happiness < 100) {
                trackDailyStat('petMascot'); // Grant XP
                updatePetStats(15, 0);
                setMascotState('happy', 2000);
            }
        });

        container.querySelector('#tm-play-bug-game-btn').addEventListener('click', () => {
            startBugSquishGame();
            interactionPanel.style.display = 'none'; // Close panel after starting game
        });

        container.querySelector('#tm-play-memory-game-btn').addEventListener('click', () => {
            startMemoryGame();
            interactionPanel.style.display = 'none';
        });
        // --- Load equipped item ---
        const equippedItem = GM_getValue(STORAGE_KEYS.EQUIPPED_ITEM, null);
        if (equippedItem) {
            console.log(`[MMS Mascot] Equipping item: ${equippedItem}`);
            const accessory = container.querySelector(`#${equippedItem}`);
            if (accessory) {
                accessory.style.display = 'block';
            }
        }
        // --- Initialization ---
        loadPetStats();
        resetIdleTimer();
        updatePetStateByStats(); // Initial state check to start roaming

        // --- Set appearance based on level ---
        const currentLevel = GM_getValue(STORAGE_KEYS.USER_LEVEL, 1);
        updateMascotAppearanceByLevel(currentLevel);

        // Listen for user activity to reset idle timer
        ['mousemove', 'keydown', 'click'].forEach(eventType => {
            document.addEventListener(eventType, resetIdleTimer);
        });

        // Periodic decay of stats
        setInterval(() => {
            // Only decay if user is active
            if (document.getElementById('tm-mascot-container').className.includes('sleeping')) return;
            updatePetStats(-1, -2); // Happiness decays slower than hunger
        }, 60 * 1000); // Decay every minute

        console.log('[MMS Fun] Interactive Mascot initialized.');
    }

    // ===================================================================
    // === 10a. MASCOT SUB-FEATURES (EUREKA, WEATHER)
    // ===================================================================

    /** Triggers the "Eureka!" animation for the mascot. */
    function triggerEurekaAnimation() {
        setMascotState('eureka', 1500); // Animation lasts 1.5 seconds
        showMascotBubble('Eureka!', 1500);
    }

    /** Triggers the "Energized" state for the mascot, providing a temporary XP boost. */
    function triggerEnergizedState(duration) {
        const expires = Date.now() + duration;
        GM_setValue(STORAGE_KEYS.ENERGIZED_BUFF_EXPIRES, expires);

        setMascotState('energized', duration);
        showPositiveMessage('Mascot is ENERGIZED! +10% XP Boost!');
        createNotification('Mascot is ENERGIZED! +10% XP Boost for 5 minutes!', '⚡');

        updateEnergizedBuffUI(); // Immediately show the UI
    }

    /** Updates the UI element for the energized buff timer. */
    function updateEnergizedBuffUI() {
        const indicator = document.getElementById('tm-energized-buff-indicator');
        if (!indicator) return;

        const expires = GM_getValue(STORAGE_KEYS.ENERGIZED_BUFF_EXPIRES, 0);
        const timeLeft = expires - Date.now();

        if (timeLeft > 0) {
            indicator.style.display = 'inline';
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            indicator.innerHTML = `⚡ ${minutes}:${seconds.toString().padStart(2, '0')}`;
            indicator.title = `Energized! +10% XP Boost active for ${minutes}m ${seconds}s.`;
        } else {
            indicator.style.display = 'none';
            // If the buff just expired, check if the mascot state needs updating
            const mascotContainer = document.getElementById('tm-mascot-container');
            if (mascotContainer && mascotContainer.classList.contains('mascot-energized')) {
                updatePetStateByStats(true); // Force revert from temp state
            }
        }
    }


    /** Fetches weather and updates the mascot's appearance. Runs once per session. */
    function fetchWeatherAndReact() {
        if (!config.interactiveMascotEnabled) return;

        // Use a session flag to prevent multiple fetches
        if (sessionStorage.getItem('tm_weather_fetched')) return;

        // Step 1: Geocode the user-defined location to get lat/lon
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(config.weatherLocation)}&count=1`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: geocodeUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data.results || data.results.length === 0) {
                        console.error(`[MMS Weather] Geocoding failed. Could not find location: "${config.weatherLocation}"`);
                        showMascotBubble(`Can't find "${config.weatherLocation}"!`, 4000);
                        sessionStorage.setItem('tm_weather_fetched', 'true'); // Mark as fetched to avoid retrying
                        return;
                    }

                    const { latitude, longitude, name } = data.results[0];
                    console.log(`[MMS Weather] Geocoded "${config.weatherLocation}" to: ${name} (${latitude}, ${longitude})`);

                    // Step 2: Fetch weather using the found coordinates
                    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code`;
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: weatherUrl,
                        onload: function(weatherResponse) {
                            try {
                                const weatherData = JSON.parse(weatherResponse.responseText);
                                const weatherCode = weatherData.current.weather_code;
                                console.log(`[MMS Weather] Fetched weather code: ${weatherCode}`);
                                sessionStorage.setItem('tm_weather_fetched', 'true');

                                // Weather codes: 0-3 are generally clear/sunny. 51-99 are rainy/snowy.
                                if (weatherCode >= 0 && weatherCode <= 3) {
                                    setMascotState('sunny', 120000); // Show for 2 minutes
                                    showMascotBubble('What a day!', 3000);
                                } else if (weatherCode >= 51 && weatherCode <= 99) {
                                    setMascotState('rainy', 120000); // Show for 2 minutes
                                    showMascotBubble('Drip, drop...', 3000);
                                }
                            } catch (e) {
                                console.error('[MMS Weather] Failed to parse weather data.', e);
                            }
                        },
                        onerror: function(error) {
                            console.error('[MMS Weather] Failed to fetch weather data.', error);
                        }
                    });

                } catch (e) {
                    console.error('[MMS Weather] Failed to parse geocoding data.', e);
                }
            },
            onerror: function(error) {
                console.error('[MMS Weather] Failed to fetch geocoding data.', error);
            }
        });
    }

    // ===================================================================
    // === 11. FUN FEATURE: MEMORY MINI-GAME
    // ===================================================================
    function startMemoryGame() {
        if (document.getElementById('tm-memory-game-overlay')) return;

        trackDailyStat('memoryGame'); // Grant base XP for playing

        const overlay = document.createElement('div');
        overlay.id = 'tm-memory-game-overlay';
        document.body.appendChild(overlay);

        overlay.innerHTML = `
            <div id="tm-memory-game-status">Get Ready...</div>
            <div id="tm-memory-game-mascot-container">
                ${document.getElementById('tm-mascot-container').querySelector('.tm-mascot-robot').outerHTML}
                <div class="tm-memory-game-pad" data-pad="0" style="top: 15%; left: 30%; width: 20%; height: 20%;"></div>
                <div class="tm-memory-game-pad" data-pad="1" style="top: 15%; left: 50%; width: 20%; height: 20%;"></div>
                <div class="tm-memory-game-pad" data-pad="2" style="bottom: 15%; left: 30%; width: 20%; height: 20%;"></div>
                <div class="tm-memory-game-pad" data-pad="3" style="bottom: 15%; left: 50%; width: 20%; height: 20%;"></div>
            </div>
            <div id="tm-memory-game-score" style="color: white; font-size: 20px;">Round: 1</div>
        `;

        const statusEl = overlay.querySelector('#tm-memory-game-status');
        const scoreEl = overlay.querySelector('#tm-memory-game-score');
        const pads = overlay.querySelectorAll('.tm-memory-game-pad');
        const padColors = ['#007bff', '#28a745', '#dc3545', '#ffc107'];

        let sequence = [];
        let playerSequence = [];
        let round = 1;
        let canPlayerClick = false;

        function flashPad(padIndex) {
            return new Promise(resolve => {
                const pad = pads[padIndex];
                pad.style.backgroundColor = padColors[padIndex];
                pad.classList.add('active');
                setTimeout(() => {
                    pad.style.backgroundColor = '';
                    pad.classList.remove('active');
                    setTimeout(resolve, 150); // Pause between flashes
                }, 400);
            });
        }

        async function playSequence() {
            canPlayerClick = false;
            statusEl.textContent = "Watch...";
            await new Promise(r => setTimeout(r, 1000));

            for (const padIndex of sequence) {
                await flashPad(padIndex);
            }

            canPlayerClick = true;
            statusEl.textContent = "Your Turn!";
            playerSequence = [];
        }

        function nextRound() {
            scoreEl.textContent = `Round: ${round}`;
            sequence.push(Math.floor(Math.random() * 4));
            playSequence();
        }

        function endGame(isWin) {
            canPlayerClick = false;
            const finalRound = round - 1;
            const bonusXp = finalRound * 5; // 5 XP per successful round
            grantXp(bonusXp);

            statusEl.innerHTML = `
                Game Over! You reached round ${finalRound}.<br>
                You earned ${XP_CONFIG.memoryGame + bonusXp} XP!
            `;
            overlay.style.cursor = 'pointer';
            overlay.addEventListener('click', () => overlay.remove());
        }

        pads.forEach(pad => {
            pad.addEventListener('click', async () => {
                if (!canPlayerClick) return;

                const padIndex = parseInt(pad.dataset.pad, 10);
                await flashPad(padIndex);
                playerSequence.push(padIndex);

                // Check if the player's move was correct so far
                const lastPlayerMoveIndex = playerSequence.length - 1;
                if (playerSequence[lastPlayerMoveIndex] !== sequence[lastPlayerMoveIndex]) {
                    endGame(false);
                    return;
                }

                // If the player has completed the sequence
                if (playerSequence.length === sequence.length) {
                    round++;
                    setTimeout(nextRound, 500);
                }
            });
        });

        setTimeout(nextRound, 1500); // Start the first round
    }

    // ===================================================================
    // === 11. FUN FEATURE: BUG SQUISH MINI-GAME
    // ===================================================================
    function startBugSquishGame() {
        // Don't start if a game is already running
        if (document.getElementById('tm-game-overlay')) return;

        trackDailyStat('bugSquishGame'); // Grant base XP for playing

        const overlay = document.createElement('div');
        overlay.id = 'tm-game-overlay';
        document.body.appendChild(overlay);

        const gameUI = document.createElement('div');
        gameUI.id = 'tm-game-ui';
        gameUI.innerHTML = `
            <div id="tm-game-timer">Time: 15</div>
            <div id="tm-game-score">Score: 0</div>
        `;
        document.body.appendChild(gameUI);

        let score = 0;
        let timeLeft = 15;
        let gameInterval = null;
        let bugSpawner = null;

        const timerEl = document.getElementById('tm-game-timer');
        const scoreEl = document.getElementById('tm-game-score');

        function spawnBug() {
            const bug = document.createElement('div');
            bug.className = 'tm-game-bug';
            bug.textContent = '🐞';

            // Position bug randomly, avoiding edges
            bug.style.top = `${Math.random() * 85 + 5}%`;
            bug.style.left = `${Math.random() * 90 + 5}%`;

            bug.addEventListener('click', () => {
                if (bug.classList.contains('squished')) return;
                score++;
                scoreEl.textContent = `Score: ${score}`;
                bug.classList.add('squished');
                setTimeout(() => bug.remove(), 300);
            });

            overlay.appendChild(bug);

            // Remove bug after a few seconds if not clicked
            setTimeout(() => {
                if (bug.parentElement) bug.remove();
            }, 4000);
        }

        function endGame() {
            clearInterval(gameInterval);
            clearTimeout(bugSpawner);

            // Grant bonus XP based on score (2 XP per bug)
            const bonusXp = score * 2;
            if (bonusXp > 0) {
                grantXp(bonusXp);
            }

            overlay.innerHTML = `
                <div id="tm-game-end-screen">
                    <h1>Game Over!</h1>
                    <h2>Final Score: ${score}</h2>
                    <p>You earned ${XP_CONFIG.bugSquishGame + bonusXp} XP!</p>
                    <p>(Click to close)</p>
                </div>
            `;
            overlay.style.background = 'rgba(0,0,0,0.7)';
            overlay.style.cursor = 'pointer';
            overlay.addEventListener('click', () => {
                overlay.remove();
                gameUI.remove();
            });
        }

        gameInterval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = `Time: ${timeLeft}`;
            if (timeLeft <= 0) endGame();
            else spawnBug(); // Spawn a new bug every second
        }, 1000);

        spawnBug(); // Spawn the first bug immediately
    }

    /**
     * Makes the mascot react to success or error messages on the page.
     */
    function initMascotPageReactions() {
        if (!config.interactiveMascotEnabled) return;

        const mascotContainer = document.getElementById('tm-mascot-container');
        if (!mascotContainer) return;

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;

                        // --- Check for Success Messages ---
                        const isSuccess = node.classList.contains('message_success') || node.classList.contains('alert-success') || (node.innerText && node.innerText.toLowerCase().includes(' επιτυχ'));
                        if (isSuccess) {
                            console.log('[MMS Mascot] Detected success message. Reacting happily.');
                            setMascotState('happy', 5000);
                            showMascotBubble('Yay! 🎉', 3000);
                            if (config.confettiEnabled) triggerConfetti(100);
                            return; // Stop checking once a reaction is triggered
                        }

                        // --- Check for Error Messages ---
                        const isError = node.classList.contains('message_error') || node.classList.contains('alert-danger') || (node.innerText && (node.innerText.toLowerCase().includes('σφάλμα') || node.innerText.toLowerCase().includes('error')));
                        if (isError) {
                            console.log('[MMS Mascot] Detected error message. Reacting sadly.');
                            setMascotState('sad', 5000);
                            showMascotBubble('Oh no...', 3000);
                            // A small, sad shake animation
                            mascotContainer.style.animation = 'tm-mascot-startled 0.5s ease-out';
                            setTimeout(() => { mascotContainer.style.animation = ''; }, 500);
                            return;
                        }
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log('[MMS Mascot] Page reaction observer initialized.');
    }

    /**
     * Initializes global keyboard shortcuts for productivity.
     */
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Use Ctrl + Shift + F to open Advanced Search
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                document.getElementById('tm-search-btn')?.click();
            }

            // Use Ctrl + Shift + S to toggle Scratchpad
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                document.getElementById('tm-scratchpad-toggle-btn')?.click();
            }
        });
        console.log('[MMS] Keyboard shortcuts initialized (Ctrl+Shift+F for Search, Ctrl+Shift+S for Scratchpad).');
    }

    // ===================================================================
    // === 8. SCRIPT INITIALIZER
    // ===================================================================
    window.addEventListener('load', () => {
        // Load settings first, as they determine which features to run.
        loadSettings();

        try {
            // Check if we are on the login page AND the feature is enabled.
            if (config.customLoginPageEnabled && window.location.pathname.includes('/login.php')) {
                initLoginPage();
                return; // Stop the rest of the script on the login page
            }
        } catch (e) { /* ignore */ }

        // Apply theme first, so all subsequent UI elements get the right colors
        applyTheme(GM_getValue(STORAGE_KEYS.EQUIPPED_THEME, 'default'));
        addGlobalStyles();

        // Create a shared container for bottom controls
        // const bottomControlsContainer = document.createElement('div');
        // bottomControlsContainer.id = 'tm-bottom-center-container';
        // document.body.appendChild(bottomControlsContainer);
        const footerCenterCell = document.querySelector('#footer-outterwrap table td[width="60%"]');
        // Initialize floating/other features that don't depend on the footer
        initInteractiveMascot(); // Handles the mascot


        if (footerCenterCell) {
            // Create a wrapper to hold both existing content and our new controls
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.justifyContent = 'space-between'; // Use space-between for a three-part layout
            wrapper.style.width = '100%';

            // Create our controls containers
            const footerControlsLeft = document.createElement('div');
            footerControlsLeft.id = 'tm-footer-controls-left';

            const footerControlsRight = document.createElement('div');
            footerControlsRight.id = 'tm-footer-controls-right';

            // Add left controls
            wrapper.appendChild(footerControlsLeft);

            // Move existing content into the wrapper
            while (footerCenterCell.firstChild) {
                wrapper.appendChild(footerCenterCell.firstChild);
            }
            footerCenterCell.appendChild(wrapper);

            // Add right controls
            wrapper.appendChild(footerControlsRight);

            // Initialize features and place them in the correct containers
            initDailyDashboardWidget(footerControlsLeft); // Stats widget on the left
            initXpBarWidget(footerControlsLeft); // XP bar widget on the left
            if (config.autoRefreshEnabled) initRefreshFeature(footerControlsRight);     // Refresh timer on the right
            initSettingsPanel(footerControlsRight); // Settings button always visible
        }

        // Initialize remaining features
        initSearchFeature();
        initScratchpadFeature();
        initScrollToTopFeature();
        initReminderSystem();
        initAutomatedPartsSearch();
        initFunFeatures(); // Handles confetti
        initMascotPageReactions(); // Mascot reactions to page events.
        initScratchpadIntegration();
        fetchWeatherAndReact(); // Check the weather for the mascot
        initCustomerHistoryFeature();
        // New: Check for and update the Energized buff UI on every page load
        updateEnergizedBuffUI();
        setInterval(updateEnergizedBuffUI, 1000); // Update the timer every second
        initOrderTracking();
        initKeyboardShortcuts();

        console.log('[MMS] MyManager All-in-One Suite Loaded!');
    });

})();
