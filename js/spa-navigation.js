/**
 * SPA Navigation System
 * Handles single-page application navigation for all pages
 */

(function() {
    'use strict';

    let currentPage = null;
    let writingSPAInitialized = false;

    /**
     * Initialize SPA Navigation
     */
    function initSPANavigation() {
        // Determine current page from URL or active nav
        const pathname = window.location.pathname;
        const activeNav = document.querySelector('.nav-link.active');

        if (activeNav) {
            currentPage = activeNav.dataset.page || extractPageFromPath(pathname);
        } else {
            currentPage = extractPageFromPath(pathname);
        }

        // Setup navigation handlers
        setupNavigationHandlers();

        // Setup browser history handlers
        setupHistoryHandlers();
    }

    /**
     * Extract page name from pathname
     */
    function extractPageFromPath(pathname) {
        if (pathname === '/' || pathname === '/index.html') return 'welcome';
        if (pathname.includes('bio')) return 'bio';
        if (pathname.includes('writing')) return 'writing';
        if (pathname.includes('quotes')) return 'quotes';
        if (pathname.includes('questions')) return 'questions';
        if (pathname.includes('investments')) return 'investments';
        return 'welcome';
    }

    /**
     * Load page content dynamically
     */
    function loadPageContent(pageKey) {
        const contentArea = document.querySelector('.content');
        if (!contentArea) return;

        // Update active navigation
        updateActiveNav(pageKey);

        // Load content based on page
        switch(pageKey) {
            case 'welcome':
                loadWelcomeContent(contentArea);
                break;
            case 'bio':
                loadBioContent(contentArea);
                break;
            case 'writing':
                loadWritingContent(contentArea);
                break;
            case 'quotes':
                loadQuotesContent(contentArea);
                break;
            case 'questions':
                loadQuestionsContent(contentArea);
                break;
            case 'investments':
                loadInvestmentsContent(contentArea);
                break;
        }

        currentPage = pageKey;

        // Update URL without reload
        const newUrl = `#${pageKey}`;
        if (window.location.hash !== newUrl) {
            history.pushState({ page: pageKey }, '', newUrl);
        }
    }

    /**
     * Update active navigation state
     */
    function updateActiveNav(pageKey) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageKey);
        });
    }

    /**
     * Load Welcome content
     */
    function loadWelcomeContent(container) {
        // Get current persona from localStorage or body class
        const savedPersona = localStorage.getItem('bustling_v2_persona');
        const bodyClass = document.body.className;
        const currentPersona = savedPersona || (bodyClass ? bodyClass.replace('persona-', '') : 'founder');

        // Define role-specific welcome content
        const welcomeContent = {
            founder: {
                title: 'Welcome, Builder',
                content: `
                    <p>Welcome! I'm Alan Curtis, a serial founder with five exits and a lifetime 300%+ IRR across $100M+ raised.</p>

                    <p>If you're here, you're likely exploring a potential collaboration, investment, or partnership. This site is designed to make me as legible as possible - to help you understand how I think, operate, and create value.</p>

                    <p>Start with my <a href="#bio" class="text-link spa-link" data-page="bio">founder journey</a> to see my track record, explore my <a href="#writing/entropy-golf" class="text-link spa-link" data-article="entropy-golf">frameworks for managing complexity</a>, or dive into my <a href="#writing/growth-strategies" class="text-link spa-link" data-article="growth-strategies">growth strategies</a>.</p>

                    <p>Currently building The Invention Network - let's <a href="https://twitter.com/alanjamescurtis" target="_blank" class="text-link">connect on X</a> or <a href="mailto:alanjamescurtis@gmail.com" class="text-link">email</a> if you're building something ambitious.</p>
                `
            },
            operator: {
                title: 'Welcome, Executor',
                content: `
                    <p>Welcome! I'm Alan Curtis, an operator who's scaled companies through $7B TGEs, $4B IPOs, and $2B mergers.</p>

                    <p>As COO at EigenLayer, CTO at Core Scientific, and CSO at Blockcap, I've specialized in turning chaos into systems and potential into performance.</p>

                    <p>Explore my <a href="#bio" class="text-link spa-link" data-page="bio">operational experience</a>, study my <a href="#writing/business-operating-systems" class="text-link spa-link" data-article="business-operating-systems">business operating systems</a>, or learn about <a href="#writing/metrics" class="text-link spa-link" data-article="metrics">metrics that matter</a>.</p>

                    <p>If you need someone who can execute at scale, let's talk via <a href="https://linkedin.com/in/alanjamescurtis" target="_blank" class="text-link">LinkedIn</a> or <a href="mailto:alanjamescurtis@gmail.com" class="text-link">email</a>.</p>
                `
            },
            investor: {
                title: 'Welcome, Allocator',
                content: `
                    <p>Welcome! I'm Alan Curtis, an investor in 50+ companies including seven unicorns and five successful exits.</p>

                    <p>As the first Head of Platform at Blockchain Capital and an active angel investor, I focus on ambitious founders solving real problems with defensible solutions.</p>

                    <p>Review my <a href="#investments" class="text-link spa-link" data-page="investments">portfolio</a>, understand my <a href="#writing/talent-investing" class="text-link spa-link" data-article="talent-investing">investment philosophy</a>, or explore my <a href="#writing/latticework" class="text-link spa-link" data-article="latticework">mental models</a>.</p>

                    <p>For deal flow or portfolio support, reach out on <a href="https://twitter.com/alanjamescurtis" target="_blank" class="text-link">X</a> or <a href="mailto:alanjamescurtis@gmail.com" class="text-link">email</a>.</p>
                `
            },
            dad: {
                title: 'Welcome, Friend',
                content: `
                    <p>Welcome! I'm Alan Curtis, a dad of two daughters living outside Boulder, Colorado.</p>

                    <p>Beyond the professional accomplishments, I'm a soccer coach, nail polish test subject, and amateur rock stacker who believes family should run more like organizations (with values, objectives, and weekly scorecards).</p>

                    <p>Check out my thoughts on <a href="#writing/family-strategy" class="text-link spa-link" data-article="family-strategy">family strategy</a>, explore my <a href="#writing/therapy" class="text-link spa-link" data-article="therapy">perspectives on growth</a>, or see my <a href="#quotes" class="text-link spa-link" data-page="quotes">favorite quotes</a> about life and parenting.</p>

                    <p>Always happy to connect with fellow parents navigating the startup life - find me on <a href="https://twitter.com/alanjamescurtis" target="_blank" class="text-link">X</a> or <a href="mailto:alanjamescurtis@gmail.com" class="text-link">email</a>.</p>
                `
            }
        };

        // Get the appropriate content or fall back to founder
        const content = welcomeContent[currentPersona] || welcomeContent.founder;

        container.className = 'content';
        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">${content.title}</h1>
            </div>
            <div class="content-body">
                ${content.content}
            </div>
        `;

        // Setup internal links after content loads
        setTimeout(() => {
            setupWelcomeLinks();
        }, 100);
    }

    /**
     * Setup Welcome page internal links
     */
    function setupWelcomeLinks() {
        // Handle all page links
        const pageLinks = document.querySelectorAll('.spa-link[data-page]');
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                if (page) {
                    loadPageContent(page);
                }
            });
        });

        // Handle all article links
        const articleLinks = document.querySelectorAll('.spa-link[data-article]');
        articleLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const article = link.dataset.article;
                if (article) {
                    loadPageContent('writing');
                    // After writing page loads, load the specific article
                    setTimeout(() => {
                        const targetLink = document.querySelector(`[data-article="${article}"]`);
                        if (targetLink) targetLink.click();
                    }, 200);
                }
            });
        });
    }

    /**
     * Load Bio content
     */
    function loadBioContent(container) {
        container.className = 'content';
        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Bio</h1>
            </div>
            <div class="content-body">
                <p>Alan Curtis is a Founder, Operator, Investor, and most importantly, a Dad.</p>

                <p>As a Founder, Alan has five exits and has delivered a lifetime 300%+ IRR for investors across $100M+ raised from 75+ venture capital funds and 100+ angel investors.</p>

                <p>As an Operator, Alan has been COO at EigenLayer during a $7B TGE ($EIGEN), CTO of Core Scientific during $4B IPO ($CORZ) and CSO at Blockcap during a $2B merger.</p>

                <p>As an Investor, Alan has invested in 50+ companies (seven unicorns and five exits) and 10+ he was also the first Head of Platform at Blockchain Capital to launch post-investment support.</p>

                <p>As a Dad, Alan lives with his wife and two daughters outside Boulder, Colorado and is proud soccer coach, avid nail polish test subject, and amateur "rock stacker."</p>

                <h2>2025</h2>
                <h3>Founder and CEO, The Invention Network</h3>
                <p>We help inventors win</p>

                <h2>2024</h2>
                <h3>COO, Eigen Labs</h3>
                <p>Led $7B TGE ($EIGEN) and launched EigenCloud</p>

                <h2>2023</h2>
                <h3>Co-Founder and CEO, Rio Network</h3>
                <p>Acquired by Eigen Labs for team and Liquid Restaking Network tech</p>

                <h2>2022-2025</h2>
                <h3>Co-Founder, ScaleIP</h3>
                <p>Acquired by The Invention Network for team</p>

                <h2>2022</h2>
                <h3>Head of Platform, Blockchain Capital</h3>
                <p>Launched post-investment support program</p>

                <h2>2022</h2>
                <h3>Co-Founder, Multisig Media</h3>
                <p>Acquired by Bitwave to scale media efforts</p>

                <h2>2021</h2>
                <h3>CTO, Core Scientific</h3>
                <p>Turned around technology team for a $4B IPO ($CORZ)</p>

                <h2>2021</h2>
                <h3>CSO, Blockcap</h3>
                <p>Led integrations into Core Scientific after a $2B merger</p>

                <h2>2017-2021</h2>
                <h3>Co-Founder and CEO, RADAR</h3>
                <p>Acquired by Blockcap for staking and trading businesses</p>

                <h2>2016</h2>
                <h3>Co-Founder and CEO, The Horse and I</h3>
                <p>Acquired by The Right Horse for technology platform</p>

                <h2>2014-2017</h2>
                <h3>Program Director, Innosphere</h3>
                <p>Managed accelerator: admissions, curriculum, and digital health vertical</p>

                <h2>2010-2016</h2>
                <h3>Bachelor and Master's Degree, Economics, Business Administration, and Public Health</h3>
                <p>Survived, barely</p>

                <h2>2000-2010</h2>
                <h3>Grew up in Chicago suburbs</h3>
                <p>One giant strip mall</p>

                <h2>1995-2000</h2>
                <h3>Born and raised in New Hampshire</h3>
                <p>Live free or die</p>
            </div>
        `;
    }

    /**
     * Load Writing content
     */
    function loadWritingContent(container) {
        container.className = 'content split-view';
        container.innerHTML = `
            <div class="list-pane">
                <div class="page-header">
                    <h1 class="page-title">Writing</h1>
                </div>
                <ul class="post-list">
                    <li><a href="#annual-retro" data-article="annual-retro">Annual Retro</a></li>
                    <li><a href="#asset-classes" data-article="asset-classes">Asset Classes</a></li>
                    <li><a href="#business-operating-systems" data-article="business-operating-systems">Business Operating Systems</a></li>
                    <li><a href="#communities-of-practice" data-article="communities-of-practice">Communities of Practice</a></li>
                    <li><a href="#culture" data-article="culture">Culture</a></li>
                    <li><a href="#entropy-golf" data-article="entropy-golf">Entropy Golf</a></li>
                    <li><a href="#family-strategy" data-article="family-strategy">Family Strategy</a></li>
                    <li><a href="#growth-strategies" data-article="growth-strategies">Growth Strategies</a></li>
                    <li><a href="#health-and-wellness-gear" data-article="health-and-wellness-gear">Health and Wellness Gear</a></li>
                    <li><a href="#latticework" data-article="latticework">Latticework</a></li>
                    <li><a href="#leadership" data-article="leadership">Leadership</a></li>
                    <li><a href="#metrics" data-article="metrics">Metrics</a></li>
                    <li><a href="#seven-basic-plots" data-article="seven-basic-plots">Seven Basic Plots</a></li>
                    <li><a href="#talent-investing" data-article="talent-investing">Talent Investing</a></li>
                    <li><a href="#therapy" data-article="therapy">Therapy</a></li>
                    <li><a href="#truth" data-article="truth">Truth</a></li>
                    <li><a href="#user-manual" data-article="user-manual">User Manual</a></li>
                </ul>
            </div>

            <div class="reading-pane">
                <div id="writing-content">
                    <p class="empty-state">Select an article to read</p>
                </div>
            </div>
        `;

        // Initialize writing sub-SPA after content loads
        setTimeout(() => {
            if (window.writingContent) {
                initWritingHandlers();
                writingSPAInitialized = true;
            }
        }, 100);
    }

    /**
     * Load Quotes content
     */
    function loadQuotesContent(container) {
        container.className = 'content split-view';
        container.innerHTML = `
            <div class="list-pane">
                <div class="page-header">
                    <h1 class="page-title">Quotes</h1>
                </div>
                <ul class="post-list">
                    <li><a href="#business" data-category="business">Business</a></li>
                    <li><a href="#communication" data-category="communication">Communication</a></li>
                    <li><a href="#health" data-category="health">Health</a></li>
                    <li><a href="#investing" data-category="investing">Investing</a></li>
                    <li><a href="#leadership" data-category="leadership">Leadership & Management</a></li>
                    <li><a href="#life" data-category="life">Life</a></li>
                    <li><a href="#productivity" data-category="productivity">Planning & Productivity</a></li>
                    <li><a href="#psychology" data-category="psychology">Psychology</a></li>
                    <li><a href="#thinking" data-category="thinking">Thinking</a></li>
                </ul>
            </div>

            <div class="reading-pane">
                <div id="quotes-content">
                    <p class="empty-state">Select a category to view quotes</p>
                </div>
            </div>
        `;

        // Initialize quotes handlers after content loads
        setTimeout(() => {
            if (window.quotesContent) {
                initQuotesHandlers();
            } else {
                console.log('quotesContent not found, trying again...');
                setTimeout(() => {
                    if (window.quotesContent) {
                        initQuotesHandlers();
                    }
                }, 500);
            }
        }, 100);
    }

    /**
     * Load Questions content
     */
    function loadQuestionsContent(container) {
        container.className = 'content split-view';
        container.innerHTML = `
            <div class="list-pane">
                <div class="page-header">
                    <h1 class="page-title">Questions</h1>
                </div>
                <ul class="post-list">
                    <li><a href="#brainstorming" data-section="brainstorming">Brainstorming</a></li>
                    <li><a href="#business-formation" data-section="business-formation">Business Formation</a></li>
                    <li><a href="#business-model" data-section="business-model">Business Model</a></li>
                    <li><a href="#execution" data-section="execution">Execution</a></li>
                    <li><a href="#interview" data-section="interview">Interview</a></li>
                    <li><a href="#investor-dd" data-section="investor-dd">Investor Due Diligence</a></li>
                    <li><a href="#market" data-section="market">Market</a></li>
                    <li><a href="#people" data-section="people">People</a></li>
                    <li><a href="#product" data-section="product">Product</a></li>
                    <li><a href="#risks" data-section="risks">Risks</a></li>
                </ul>
            </div>

            <div class="reading-pane">
                <div id="questions-content">
                    <p class="empty-state">Select a category to view questions</p>
                </div>
            </div>
        `;

        // Initialize questions handlers after content loads
        setTimeout(() => {
            if (window.questionsContent) {
                initQuestionsHandlers();
            } else {
                console.log('questionsContent not found, trying again...');
                setTimeout(() => {
                    if (window.questionsContent) {
                        initQuestionsHandlers();
                    }
                }, 500);
            }
        }, 100);
    }

    /**
     * Load Investments content
     */
    function loadInvestmentsContent(container) {
        container.className = 'content split-view';
        container.innerHTML = `
            <div class="list-pane">
                <div class="page-header">
                    <h1 class="page-title">Investments</h1>
                </div>
                <ul class="post-list">
                    <li><a href="#funds" data-investment="funds">Funds</a></li>
                    <li><a href="#tech" data-investment="tech">Tech</a></li>
                    <li><a href="#crypto" data-investment="crypto">Crypto</a></li>
                </ul>
            </div>

            <div class="reading-pane">
                <div id="investments-content">
                    <p class="empty-state">Select a category to view investments</p>
                </div>
            </div>
        `;

        // Initialize investments handlers after content loads
        setTimeout(() => {
            if (window.investmentsContent) {
                initInvestmentsHandlers();
            } else {
                console.log('investmentsContent not found, trying again...');
                setTimeout(() => {
                    if (window.investmentsContent) {
                        initInvestmentsHandlers();
                    }
                }, 500);
            }
        }, 100);
    }

    // Keep the original Investment content structure for reference
    function loadInvestmentsContentOld(container) {
        container.className = 'content';
        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Investments</h1>
            </div>
            <div class="content-body">
                <div class="investment-grid">
                    <div class="investment-category">
                        <h2>Unicorns 🦄</h2>
                        <ul class="investment-list">
                            <li><a href="https://rippling.com" target="_blank">Rippling</a> - Employee management platform</li>
                            <li><a href="https://deel.com" target="_blank">Deel</a> - Global payroll and compliance</li>
                            <li><a href="https://ramp.com" target="_blank">Ramp</a> - Corporate cards and expense management</li>
                            <li><a href="https://alchemy.com" target="_blank">Alchemy</a> - Blockchain developer platform</li>
                            <li><a href="https://eigenlayer.xyz" target="_blank">EigenLayer</a> - Ethereum restaking protocol</li>
                            <li><a href="https://fireblocks.com" target="_blank">Fireblocks</a> - Digital asset custody</li>
                            <li><a href="https://bitwave.io" target="_blank">Bitwave</a> - Digital asset accounting</li>
                        </ul>
                    </div>

                    <div class="investment-category">
                        <h2>Exits 💰</h2>
                        <ul class="investment-list">
                            <li><strong>Rio Network</strong> → EigenLayer (2023)</li>
                            <li><strong>ScaleIP</strong> → The Invention Network (2025)</li>
                            <li><strong>Multisig Media</strong> → Bitwave (2022)</li>
                            <li><strong>RADAR</strong> → Blockcap (2021)</li>
                            <li><strong>The Horse and I</strong> → The Right Horse (2016)</li>
                        </ul>
                    </div>

                    <div class="investment-category">
                        <h2>Active Portfolio 🚀</h2>
                        <ul class="investment-list">
                            <li><a href="https://openai.com" target="_blank">OpenAI</a> - Artificial intelligence research</li>
                            <li><a href="https://anthropic.com" target="_blank">Anthropic</a> - AI safety company</li>
                            <li><a href="https://figma.com" target="_blank">Figma</a> - Collaborative design platform</li>
                            <li><a href="https://notion.so" target="_blank">Notion</a> - Workspace and notes</li>
                            <li><a href="https://airtable.com" target="_blank">Airtable</a> - Spreadsheet database hybrid</li>
                            <li>+ 45 more companies...</li>
                        </ul>
                    </div>

                    <div class="investment-stats">
                        <div class="stat">
                            <span class="stat-value">50+</span>
                            <span class="stat-label">Companies</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">7</span>
                            <span class="stat-label">Unicorns</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">5</span>
                            <span class="stat-label">Exits</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">300%+</span>
                            <span class="stat-label">Lifetime IRR</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize Writing article handlers
     */
    function initWritingHandlers() {
        const postLinks = document.querySelectorAll('.post-list a');
        const writingContentDiv = document.getElementById('writing-content');

        if (!writingContentDiv) {
            console.warn('Writing content div not found');
            return;
        }

        if (!window.writingContent) {
            console.warn('Writing content data not loaded');
            return;
        }

        postLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const articleKey = link.dataset.article;

                if (articleKey && window.writingContent[articleKey]) {
                    const article = window.writingContent[articleKey];

                    writingContentDiv.innerHTML = `
                        <div class="article-header">
                            <h2 class="article-title">${article.title}</h2>
                        </div>
                        <div class="article-content">
                            ${article.content}
                        </div>
                    `;

                    // Update active state
                    postLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');

                    // Update URL
                    history.pushState({ page: 'writing', article: articleKey }, '', `#writing/${articleKey}`);

                    // Scroll to top of reading pane
                    writingContentDiv.scrollTop = 0;
                } else {
                    console.warn('Article not found:', articleKey);
                }
            });
        });

        console.log('Writing handlers initialized with', postLinks.length, 'article links');
    }

    /**
     * Initialize Quotes handlers
     */
    function initQuotesHandlers() {
        const categoryLinks = document.querySelectorAll('.post-list a');
        const quotesContentDiv = document.getElementById('quotes-content');

        if (!quotesContentDiv) {
            console.warn('Quotes content div not found');
            return;
        }

        if (!window.quotesContent) {
            console.warn('Quotes content data not loaded');
            return;
        }

        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryKey = link.dataset.category;

                if (categoryKey && window.quotesContent[categoryKey]) {
                    const category = window.quotesContent[categoryKey];

                    quotesContentDiv.innerHTML = `
                        <div class="article-header">
                            <h2 class="article-title">${category.title}</h2>
                        </div>
                        <div class="quotes-container">
                            ${category.items.map(item => {
                                const parts = item.split(' - ');
                                const quote = parts[0];
                                const author = parts[1] || '';
                                return `
                                    <div class="quote-item">
                                        <blockquote class="quote-text">"${quote}"</blockquote>
                                        ${author ? `<cite class="quote-author">— ${author}</cite>` : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;

                    // Update active state
                    categoryLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');

                    // Update URL
                    history.pushState({ page: 'quotes', category: categoryKey }, '', `#quotes/${categoryKey}`);

                    // Scroll to top of reading pane
                    quotesContentDiv.scrollTop = 0;
                } else {
                    console.warn('Category not found:', categoryKey);
                }
            });
        });

        console.log('Quotes handlers initialized with', categoryLinks.length, 'category links');
    }

    /**
     * Initialize Questions handlers
     */
    function initQuestionsHandlers() {
        const sectionLinks = document.querySelectorAll('.post-list a');
        const questionsContentDiv = document.getElementById('questions-content');

        if (!questionsContentDiv) {
            console.warn('Questions content div not found');
            return;
        }

        if (!window.questionsContent) {
            console.warn('Questions content data not loaded');
            return;
        }

        sectionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionKey = link.dataset.section;

                if (sectionKey && window.questionsContent[sectionKey]) {
                    const section = window.questionsContent[sectionKey];

                    questionsContentDiv.innerHTML = `
                        <div class="article-header">
                            <h2 class="article-title">${section.title}</h2>
                        </div>
                        <div class="questions-container">
                            ${section.items.map(item => {
                                // Check if item starts with <strong> for headers
                                if (item.startsWith('<strong>')) {
                                    return `<h3 class="questions-section-header">${item}</h3>`;
                                } else {
                                    return `<p class="question-item">${item}</p>`;
                                }
                            }).join('')}
                        </div>
                    `;

                    // Update active state
                    sectionLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');

                    // Update URL
                    history.pushState({ page: 'questions', section: sectionKey }, '', `#questions/${sectionKey}`);

                    // Scroll to top of reading pane
                    questionsContentDiv.scrollTop = 0;
                } else {
                    console.warn('Section not found:', sectionKey);
                }
            });
        });

        console.log('Questions handlers initialized with', sectionLinks.length, 'section links');
    }

    /**
     * Initialize Investments handlers
     */
    function initInvestmentsHandlers() {
        const categoryLinks = document.querySelectorAll('.post-list a');
        const investmentsContentDiv = document.getElementById('investments-content');

        if (!investmentsContentDiv) {
            console.warn('Investments content div not found');
            return;
        }

        if (!window.investmentsContent) {
            console.warn('Investments content data not loaded');
            return;
        }

        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryKey = link.dataset.investment;

                if (categoryKey && window.investmentsContent[categoryKey]) {
                    const category = window.investmentsContent[categoryKey];

                    investmentsContentDiv.innerHTML = `
                        <div class="article-header">
                            <h2 class="article-title">${category.title}</h2>
                        </div>
                        <ul class="investment-list">
                            ${category.items.map(item => `
                                <li>
                                    <a href="${item.url}" class="external-link" target="_blank">${item.name}</a>
                                    ${item.status ? `<span class="investment-status">${item.status}</span>` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    `;

                    // Update active state
                    categoryLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');

                    // Update URL
                    history.pushState({ page: 'investments', category: categoryKey }, '', `#investments/${categoryKey}`);

                    // Scroll to top of reading pane
                    investmentsContentDiv.scrollTop = 0;
                } else {
                    console.warn('Category not found:', categoryKey);
                }
            });
        });

        console.log('Investments handlers initialized with', categoryLinks.length, 'category links');
    }

    /**
     * Setup navigation click handlers
     */
    function setupNavigationHandlers() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const pageKey = link.dataset.page;

                e.preventDefault();

                if (pageKey && pageKey !== currentPage) {
                    loadPageContent(pageKey);
                }
            });
        });
    }

    /**
     * Setup browser history handlers
     */
    function setupHistoryHandlers() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                loadPageContent(e.state.page);
            } else {
                // Check hash
                const hash = window.location.hash.substring(1);
                if (hash) {
                    const pageKey = hash.split('/')[0];
                    if (pageKey) {
                        loadPageContent(pageKey);
                    }
                }
            }
        });

        // Handle initial hash
        const hash = window.location.hash.substring(1);
        if (hash) {
            const pageKey = hash.split('/')[0];
            if (pageKey && pageKey !== currentPage) {
                loadPageContent(pageKey);
            }
        }
    }

    // Expose loadPageContent globally for character selection
    window.loadPageContent = loadPageContent;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSPANavigation);
    } else {
        initSPANavigation();
    }

})();