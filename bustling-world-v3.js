/**
 * The Bustling World v3 - Enhanced with Anime.js
 * Theme persistence and smooth animations
 */

class BustlingWorldV3 {
    constructor() {
        this.currentPersona = null;
        this.isFirstVisit = !localStorage.getItem('bustling_v3_visited');
        this.animeTimeline = null;

        this.personaData = {
            founder: {
                name: 'Warlord',
                badge: 'WARLORD',
                theme: 'persona-warlord',
                rank: '將',
                stats: {
                    leadership: 95,
                    strategy: 85,
                    commerce: 60,
                    wisdom: 70
                },
                content: {
                    welcome: "Welcome to my stronghold! As a battle-tested commander, I've conquered markets and built digital empires. Five successful campaigns, over $100M in war chest raised.",
                    focus: "Strategic expansion, market domination, and empire building through decisive action.",
                    ending: "Join my war council - together we shall conquer new territories."
                }
            },
            operator: {
                name: 'Strategist',
                badge: 'STRATEGIST',
                theme: 'persona-strategist',
                rank: '謀',
                stats: {
                    leadership: 70,
                    strategy: 100,
                    commerce: 75,
                    wisdom: 90
                },
                content: {
                    welcome: "Greetings, tactician. Here you'll find systematic approaches to complex challenges. Former COO at EigenLayer, CTO at Core Scientific. Every system has its optimal configuration.",
                    focus: "Operational excellence, scalable architecture, and systematic growth strategies.",
                    ending: "Let us devise strategies that transform complexity into competitive advantage."
                }
            },
            investor: {
                name: 'Merchant',
                badge: 'MERCHANT',
                theme: 'persona-merchant',
                rank: '商',
                stats: {
                    leadership: 60,
                    strategy: 75,
                    commerce: 100,
                    wisdom: 85
                },
                content: {
                    welcome: "Welcome to my trading hall! Gold flows where wisdom dwells. I transform opportunities into prosperity, identifying value where others see risk.",
                    focus: "Capital efficiency, portfolio construction, and value creation across market cycles.",
                    ending: "Great fortunes await those who recognize opportunity. Let us discuss your venture."
                }
            },
            dad: {
                name: 'Scholar',
                badge: 'SCHOLAR',
                theme: 'persona-scholar',
                rank: '文',
                stats: {
                    leadership: 75,
                    strategy: 80,
                    commerce: 50,
                    wisdom: 100
                },
                content: {
                    welcome: "Welcome to my study. Beyond titles and ventures, I'm a father and lifelong student. True wealth lies in wisdom shared and relationships nurtured.",
                    focus: "Mentorship, knowledge transfer, and building lasting human connections.",
                    ending: "The greatest returns come from investing in people. How may I guide your journey?"
                }
            }
        };

        this.init();
    }

    init() {
        // Apply saved theme immediately to prevent flash
        this.applyThemeFromStorage();

        // Check if first visit
        if (this.isFirstVisit) {
            this.showCharacterSelection();
            this.animateCharacterCards();
        } else {
            const savedPersona = localStorage.getItem('bustling_v3_persona') || 'founder';
            this.setPersona(savedPersona);
            this.hideCharacterSelection();
            this.showMainContent();
        }

        this.setupEventListeners();
        this.setupMobileMenu();
        this.initAnimations();
    }

    applyThemeFromStorage() {
        const savedPersona = localStorage.getItem('bustling_v3_persona');
        if (savedPersona && this.personaData[savedPersona]) {
            document.body.className = `${this.personaData[savedPersona].theme} no-transition`;
            // Apply CSS variables for theme
            const root = document.documentElement;
            const themeColors = {
                'persona-warlord': '#dc143c',
                'persona-strategist': '#5e72e4',
                'persona-merchant': '#ffd700',
                'persona-scholar': '#6b8e4e'
            };
            root.style.setProperty('--theme-accent', themeColors[this.personaData[savedPersona].theme]);
        }
    }

    animateCharacterCards() {
        if (typeof anime === 'undefined') return;

        // Animate cards entrance with stagger
        anime({
            targets: '.character-card',
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(100, {start: 200}),
            easing: 'easeOutQuart'
        });

        // Animate portraits
        anime({
            targets: '.portrait-border',
            rotate: [0, 360],
            duration: 1500,
            delay: anime.stagger(150, {start: 500}),
            easing: 'easeInOutQuad'
        });

        // Animate rank badges
        anime({
            targets: '.portrait-rank',
            scale: [0, 1],
            duration: 600,
            delay: anime.stagger(100, {start: 1000}),
            easing: 'easeOutElastic(1, .5)'
        });
    }

    initAnimations() {
        if (typeof anime === 'undefined') return;

        // Animate background elements continuously
        this.animateBackgroundElements();

        // Add hover animations to character cards
        const cards = document.querySelectorAll('.character-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.animateCardHover(card));
            card.addEventListener('mouseleave', () => this.animateCardLeave(card));
        });
    }

    animateBackgroundElements() {
        if (typeof anime === 'undefined') return;

        // Floating mist animation
        anime({
            targets: '.mist',
            opacity: [0.3, 0.6, 0.3],
            duration: 8000,
            easing: 'easeInOutSine',
            loop: true
        });

        // Mountain parallax effect
        anime({
            targets: '.mountain-layer.back',
            translateX: [-20, 20],
            duration: 20000,
            easing: 'easeInOutSine',
            loop: true,
            direction: 'alternate'
        });

        anime({
            targets: '.mountain-layer.mid',
            translateX: [-10, 10],
            duration: 15000,
            easing: 'easeInOutSine',
            loop: true,
            direction: 'alternate'
        });
    }

    animateCardHover(card) {
        if (typeof anime === 'undefined') return;

        anime({
            targets: card,
            scale: 1.05,
            translateY: -10,
            duration: 300,
            easing: 'easeOutQuart'
        });

        // Animate the portrait on hover
        anime({
            targets: card.querySelector('.portrait-image'),
            rotate: 5,
            duration: 300,
            easing: 'easeOutQuart'
        });
    }

    animateCardLeave(card) {
        if (typeof anime === 'undefined') return;

        anime({
            targets: card,
            scale: 1,
            translateY: 0,
            duration: 300,
            easing: 'easeOutQuart'
        });

        anime({
            targets: card.querySelector('.portrait-image'),
            rotate: 0,
            duration: 300,
            easing: 'easeOutQuart'
        });
    }

    animateStatBars(persona) {
        if (typeof anime === 'undefined') return;

        const stats = this.personaData[persona].stats;
        const statBars = document.querySelectorAll('.stat-fill');

        statBars.forEach((bar, index) => {
            const statNames = ['leadership', 'strategy', 'commerce', 'wisdom'];
            const value = stats[statNames[index]] || 50;

            anime({
                targets: bar,
                width: '0%',
                duration: 0
            });

            anime({
                targets: bar,
                width: value + '%',
                duration: 1000,
                delay: index * 100,
                easing: 'easeOutQuart'
            });
        });
    }

    setupEventListeners() {
        // Character selection cards
        const characterCards = document.querySelectorAll('.character-card');
        characterCards.forEach(card => {
            card.addEventListener('click', () => {
                const persona = card.dataset.persona;
                this.selectCharacterWithAnimation(persona);
            });
        });

        // Setup persona switcher hover
        const personaSwitcher = document.getElementById('personaSwitcher');
        let hoverTimeout = null;

        if (personaSwitcher) {
            const dropdown = personaSwitcher.querySelector('.persona-dropdown');

            personaSwitcher.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                if (dropdown) {
                    anime({
                        targets: dropdown,
                        opacity: [0, 1],
                        translateY: [-10, 0],
                        duration: 300,
                        easing: 'easeOutQuart',
                        begin: () => {
                            dropdown.style.visibility = 'visible';
                        }
                    });
                }
            });

            personaSwitcher.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    if (dropdown) {
                        anime({
                            targets: dropdown,
                            opacity: [1, 0],
                            translateY: [0, -10],
                            duration: 300,
                            easing: 'easeInQuart',
                            complete: () => {
                                dropdown.style.visibility = 'hidden';
                            }
                        });
                    }
                }, 100);
            });
        }

        // Persona dropdown items
        const dropdownItems = document.querySelectorAll('.dropdown-item:not(.reset-btn)');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const persona = item.dataset.persona;
                if (persona) {
                    this.switchPersonaWithAnimation(persona);
                }
            });
        });

        // Reset button
        const resetBtn = document.getElementById('resetSelection');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetToCharacterSelection();
            });
        }

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.resetToCharacterSelection();
            }
        });

        // Fix navigation links to maintain theme
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Store current theme before navigation
                const currentPersona = this.currentPersona;
                if (currentPersona) {
                    localStorage.setItem('bustling_v3_persona', currentPersona);
                }
            });
        });
    }

    selectCharacterWithAnimation(persona) {
        if (typeof anime !== 'undefined') {
            // Animate selection
            anime({
                targets: '.character-select-modal',
                scale: [1, 0.9],
                opacity: [1, 0],
                duration: 500,
                easing: 'easeInQuart',
                complete: () => {
                    this.selectCharacter(persona);
                }
            });
        } else {
            this.selectCharacter(persona);
        }
    }

    selectCharacter(persona) {
        // Save selection
        localStorage.setItem('bustling_v3_visited', 'true');
        localStorage.setItem('bustling_v3_persona', persona);

        // Apply persona
        this.setPersona(persona);

        // Hide modal and show content
        this.hideCharacterSelection();
        this.showMainContent();
    }

    showMainContent() {
        const container = document.getElementById('mainContainer');
        if (container) {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: container,
                    opacity: [0, 1],
                    duration: 500,
                    easing: 'easeOutQuart',
                    begin: () => {
                        container.style.opacity = '0';
                    }
                });
            } else {
                container.style.opacity = '1';
            }
        }

        const switcher = document.getElementById('personaSwitcher');
        if (switcher) {
            switcher.classList.remove('hidden');
        }
    }

    hideCharacterSelection() {
        const modal = document.getElementById('characterSelect');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    setPersona(persona) {
        if (!this.personaData[persona]) return;

        this.currentPersona = persona;
        const data = this.personaData[persona];

        // Apply theme class
        document.body.className = `${data.theme} no-transition`;

        // Store in localStorage for persistence
        localStorage.setItem('bustling_v3_persona', persona);

        // Update persona badge
        const badge = document.getElementById('personaBadge');
        if (badge) {
            const badgeText = badge.querySelector('.badge-text');
            if (badgeText) {
                badgeText.textContent = data.name;
            }
        }

        // Update current persona icon with rank
        const currentIcon = document.querySelector('.current-persona-icon');
        if (currentIcon) {
            currentIcon.textContent = data.rank;
        }

        // Update content
        this.updatePersonaContent();

        // Animate stat bars if on character select
        if (!this.isFirstVisit) {
            this.animateStatBars(persona);
        }

        // Remove transition class
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 50);
    }

    switchPersonaWithAnimation(persona) {
        if (persona === this.currentPersona) return;

        if (typeof anime !== 'undefined') {
            // Fade out current content
            anime({
                targets: '.content-body',
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuart',
                complete: () => {
                    this.setPersona(persona);
                    // Fade in new content
                    anime({
                        targets: '.content-body',
                        opacity: [0, 1],
                        duration: 300,
                        easing: 'easeOutQuart'
                    });
                }
            });
        } else {
            this.setPersona(persona);
        }
    }

    updatePersonaContent() {
        const data = this.personaData[this.currentPersona];
        if (!data) return;

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            const titles = {
                founder: 'Welcome to the War Room',
                operator: 'Strategic Operations Center',
                investor: 'The Trading Hall',
                dad: "The Scholar's Sanctuary"
            };
            pageTitle.textContent = titles[this.currentPersona] || 'Welcome to the Kingdom';
        }

        // Update content body
        const contentBody = document.getElementById('contentBody');
        if (contentBody) {
            contentBody.innerHTML = `
                <p class="intro-text">${data.content.welcome}</p>

                <p><strong>Current Focus:</strong> ${data.content.focus}</p>

                <p>Begin with my <a href="/bio.html" class="text-link">chronicle</a> to understand my path,
                explore my <a href="/writing/user-manual.html" class="text-link">manual</a> for collaboration insights,
                or study my <a href="/writing/latticework.html" class="text-link">frameworks</a>.</p>

                <p>${data.content.ending}</p>

                <p>Connect through <a href="https://twitter.com/alanjamescurtis" target="_blank" class="text-link">X</a>,
                <a href="https://linkedin.com/in/alanjamescurtis" target="_blank" class="text-link">LinkedIn</a>,
                or <a href="mailto:alanjamescurtis@gmail.com" class="text-link">email</a> to explore opportunities.</p>
            `;
        }
    }

    resetToCharacterSelection() {
        // Clear localStorage
        localStorage.removeItem('bustling_v3_visited');
        localStorage.removeItem('bustling_v3_persona');

        // Reset state
        this.currentPersona = null;

        // Animate out main content
        if (typeof anime !== 'undefined') {
            anime({
                targets: '#mainContainer',
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuart',
                complete: () => {
                    // Hide main content
                    const switcher = document.getElementById('personaSwitcher');
                    if (switcher) {
                        switcher.classList.add('hidden');
                    }

                    // Show character selection
                    this.showCharacterSelection();
                    this.animateCharacterCards();
                }
            });
        } else {
            const container = document.getElementById('mainContainer');
            if (container) {
                container.style.opacity = '0';
            }

            const switcher = document.getElementById('personaSwitcher');
            if (switcher) {
                switcher.classList.add('hidden');
            }

            this.showCharacterSelection();
        }
    }

    showCharacterSelection() {
        const modal = document.getElementById('characterSelect');
        if (modal) {
            modal.classList.remove('hidden');

            if (typeof anime !== 'undefined') {
                anime({
                    targets: '.character-select-modal',
                    scale: [0.9, 1],
                    opacity: [0, 1],
                    duration: 500,
                    easing: 'easeOutQuart'
                });
            }
        }
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const sidebar = document.querySelector('.sidebar');

        if (hamburger && sidebar) {
            hamburger.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                hamburger.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                    sidebar.classList.remove('open');
                    hamburger.classList.remove('active');
                }
            });
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.bustlingWorldV3 = new BustlingWorldV3();
    });
} else {
    window.bustlingWorldV3 = new BustlingWorldV3();
}