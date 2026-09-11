document.addEventListener('DOMContentLoaded', () => {
  
  // 1. INFINITE LOOPING TYPEWRITER WRITING ANIMATION
  const line1Text = "Hi, I'm Jatin.";
  const line2Titles = [
    "Cloud & DevOps Engineer",
    "Infrastructure Automation",
    "DevOps Engineer",
    "Aspiring Cloud Engineer"
  ];

  const elLine1 = document.getElementById('typewriter-line1');
  const elLine2 = document.getElementById('typewriter-line2');

  let titleIndex = 0;
  let idx1 = 0;
  let idx2 = 0;
  let isDeleting = false;
  let isLine1Typed = false;

  function runTypewriterLoop() {
    const currentLine2 = line2Titles[titleIndex];

    // Phase 1: Type Line 1 first if not already typed
    if (!isLine1Typed) {
      if (idx1 < line1Text.length) {
        const typed = line1Text.slice(0, idx1 + 1);
        const jIndex = typed.indexOf("Jatin");
        if (jIndex !== -1) {
          const before = typed.slice(0, jIndex);
          const jatinPart = typed.slice(jIndex, jIndex + 5);
          const after = typed.slice(jIndex + 5);
          elLine1.innerHTML = `${before}<u style="text-underline-offset:6px;">${jatinPart}</u>${after}<span class="typing-cursor">|</span>`;
        } else {
          elLine1.innerHTML = `${typed}<span class="typing-cursor">|</span>`;
        }
        idx1++;
        setTimeout(runTypewriterLoop, 75);
        return;
      } else {
        isLine1Typed = true;
        const jIndex = line1Text.indexOf("Jatin");
        const before = line1Text.slice(0, jIndex);
        const jatinPart = line1Text.slice(jIndex, jIndex + 5);
        const after = line1Text.slice(jIndex + 5);
        elLine1.innerHTML = `${before}<u style="text-underline-offset:6px;">${jatinPart}</u>${after}`;
      }
    }

    // Phase 2: Type or Erase Line 2
    if (!isDeleting) {
      // Typing Line 2
      if (idx2 < currentLine2.length) {
        elLine2.innerHTML = `${currentLine2.slice(0, idx2 + 1)}<span class="typing-cursor">|</span>`;
        idx2++;
        setTimeout(runTypewriterLoop, 56);
      } else {
        // Line 2 finished typing, hold before deleting
        elLine2.innerHTML = `${currentLine2}<span class="typing-cursor">|</span>`;
        setTimeout(() => {
          isDeleting = true;
          runTypewriterLoop();
        }, 3125);
      }
    } else {
      // Erasing Line 2
      if (idx2 > 0) {
        idx2--;
        elLine2.innerHTML = `${currentLine2.slice(0, idx2)}<span class="typing-cursor">|</span>`;
        setTimeout(runTypewriterLoop, 31);
      } else {
        // Erase complete, move to next title in loop
        isDeleting = false;
        titleIndex = (titleIndex + 1) % line2Titles.length;
        setTimeout(runTypewriterLoop, 375);
      }
    }
  }

  runTypewriterLoop();

  // 2. FLOATING ROUNDED PILL DOCK NAVBAR ON SCROLL
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // MOBILE MENU TOGGLE
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // 3. DARK / LIGHT THEME TOGGLE
  const themeBtn = document.getElementById('theme-toggle');
  let currentTheme = 'dark';
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
    });
  }

  // 4. PROJECT CATEGORY FILTER TABS
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');

      projectCards.forEach(card => {
        if (cat === 'All' || card.getAttribute('data-cat') === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. SIDE-BY-SIDE LIVE STATS API FETCH (GitHub & LeetCode)
  const ghUsername = 'jatins2405';
  const lcUsername = 'DEX010';

  async function fetchGitHubStats() {
    try {
      const res = await fetch(`https://api.github.com/users/${ghUsername}`);
      if (!res.ok) throw new Error('GitHub API Error');
      const data = await res.json();
      document.getElementById('gh-repos').textContent = data.public_repos || 18;
      document.getElementById('gh-followers').textContent = data.followers || 42;
      document.getElementById('gh-following').textContent = data.following || 15;
    } catch (err) {
      console.warn('GitHub Stats API fallback:', err);
    }
  }

  async function fetchLeetCodeStats() {
    try {
      const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${lcUsername}`);
      if (!res.ok) throw new Error('LeetCode API Error');
      const data = await res.json();

      // 1. Total Solved, Ranking & Contribution Points
      const totalSolved = data.totalSolved ?? 1;
      const ranking = data.ranking ? `#${data.ranking.toLocaleString()}` : '#5,000,001';
      const points = data.contributionPoint ?? 98;
      
      let acSubs = 4;
      let totalSubs = 6;

      if (data.matchedUserStats && data.matchedUserStats.acSubmissionNum) {
        const allAc = data.matchedUserStats.acSubmissionNum.find(item => item.difficulty === 'All');
        if (allAc) acSubs = allAc.submissions;
      }
      if (data.matchedUserStats && data.matchedUserStats.totalSubmissionNum) {
        const allTotal = data.matchedUserStats.totalSubmissionNum.find(item => item.difficulty === 'All');
        if (allTotal) totalSubs = allTotal.submissions;
      }

      const accRate = totalSubs > 0 ? ((acSubs / totalSubs) * 100).toFixed(1) : '66.7';

      // Update DOM elements
      const elAcc = document.getElementById('lc-acc-rate');
      if (elAcc) elAcc.textContent = `${accRate}%`;

      const circle = document.getElementById('lc-ring-circle');
      if (circle) {
        const circumference = 251.2;
        const offset = circumference - (parseFloat(accRate) / 100) * circumference;
        circle.style.strokeDashoffset = offset;
      }

      // Difficulty breakdown
      const easySolved = data.easySolved ?? 1;
      const totalEasy = data.totalEasy ?? 963;
      const medSolved = data.mediumSolved ?? 0;
      const totalMed = data.totalMedium ?? 2111;
      const hardSolved = data.hardSolved ?? 0;
      const totalHard = data.totalHard ?? 973;

      document.getElementById('lc-easy-txt').textContent = `${easySolved} / ${totalEasy}`;
      document.getElementById('lc-med-txt').textContent = `${medSolved} / ${totalMed}`;
      document.getElementById('lc-hard-txt').textContent = `${hardSolved} / ${totalHard}`;

      document.getElementById('lc-easy-bar').style.width = `${Math.min(100, Math.max(0.5, (easySolved / totalEasy) * 100))}%`;
      document.getElementById('lc-med-bar').style.width = `${Math.min(100, (medSolved / totalMed) * 100)}%`;
      document.getElementById('lc-hard-bar').style.width = `${Math.min(100, (hardSolved / totalHard) * 100)}%`;

      // Metrics Card
      document.getElementById('lc-total').textContent = totalSolved;
      document.getElementById('lc-rank').textContent = ranking;
      document.getElementById('lc-subs').textContent = totalSubs;
      document.getElementById('lc-points').textContent = points;

      // Recent Submission
      if (data.recentSubmissions && data.recentSubmissions.length > 0) {
        const recent = data.recentSubmissions[0];
        document.getElementById('lc-recent-title').textContent = recent.title || 'Two Sum';
        document.getElementById('lc-recent-lang').textContent = (recent.lang || 'cpp').toUpperCase();
        document.getElementById('lc-recent-status').textContent = recent.statusDisplay || 'Accepted';
      }

      // Heatmap Grid
      renderLeetCodeHeatmap(data.submissionCalendar || {"1762819200": 4, "1782950400": 1});

    } catch (err) {
      console.warn('LeetCode API Fetch Error, loading live stats defaults:', err);
      renderLeetCodeDefaults();
    }
  }

  let lcTooltipEl = document.getElementById('lc-heatmap-tooltip');
  if (!lcTooltipEl) {
    lcTooltipEl = document.createElement('div');
    lcTooltipEl.id = 'lc-heatmap-tooltip';
    lcTooltipEl.className = 'lc-tooltip hidden';
    document.body.appendChild(lcTooltipEl);
  }

  function showLcTooltip(target, text) {
    lcTooltipEl.textContent = text;
    lcTooltipEl.classList.remove('hidden');
    const rect = target.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    lcTooltipEl.style.left = `${rect.left + scrollX + rect.width / 2}px`;
    lcTooltipEl.style.top = `${rect.top + scrollY - 8}px`;
  }

  function hideLcTooltip() {
    if (lcTooltipEl) lcTooltipEl.classList.add('hidden');
  }

  function renderLeetCodeHeatmap(calendar) {
    const gridEl = document.getElementById('lc-heatmap-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '';

    // Calculate active days count
    const activeDaysCount = Object.keys(calendar).length;
    const activeDaysEl = document.getElementById('lc-active-days');
    if (activeDaysEl) activeDaysEl.textContent = `Active Days: ${activeDaysCount}`;

    // Normalize timestamps to days map
    const dayCountsMap = {};
    for (const [timestampStr, count] of Object.entries(calendar)) {
      const ts = parseInt(timestampStr, 10);
      const date = new Date(ts * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dayCountsMap[dateStr] = count;
    }

    // Build 52 weeks * 7 days grid (364 days) ending today
    const totalDays = 364;
    const today = new Date();

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = dayCountsMap[dateStr] || 0;

      const sq = document.createElement('span');
      sq.className = 'lc-sq';
      if (count === 0) sq.classList.add('sq-0');
      else if (count <= 2) sq.classList.add('sq-1');
      else if (count <= 5) sq.classList.add('sq-2');
      else if (count <= 8) sq.classList.add('sq-3');
      else sq.classList.add('sq-4');

      const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const labelText = count === 0 
        ? `No submissions on ${formattedDate}` 
        : `${count} submission${count > 1 ? 's' : ''} on ${formattedDate}`;

      sq.title = labelText;
      sq.addEventListener('mouseenter', (e) => showLcTooltip(e.target, labelText));
      sq.addEventListener('mouseleave', () => hideLcTooltip());

      gridEl.appendChild(sq);
    }
  }

  function renderLeetCodeDefaults() {
    const elAcc = document.getElementById('lc-acc-rate');
    if (elAcc) elAcc.textContent = '66.7%';

    const circle = document.getElementById('lc-ring-circle');
    if (circle) circle.style.strokeDashoffset = 83.6;

    document.getElementById('lc-easy-txt').textContent = '1 / 963';
    document.getElementById('lc-med-txt').textContent = '0 / 2111';
    document.getElementById('lc-hard-txt').textContent = '0 / 973';

    document.getElementById('lc-easy-bar').style.width = '0.5%';
    document.getElementById('lc-med-bar').style.width = '0%';
    document.getElementById('lc-hard-bar').style.width = '0%';

    document.getElementById('lc-total').textContent = '1';
    document.getElementById('lc-rank').textContent = '#5,000,001';
    document.getElementById('lc-subs').textContent = '6';
    document.getElementById('lc-points').textContent = '98';

    renderLeetCodeHeatmap({"1762819200": 4, "1782950400": 1});
  }

  fetchGitHubStats();
  fetchLeetCodeStats();

  const refreshGhBtn = document.getElementById('refresh-gh-btn');
  const refreshLcBtn = document.getElementById('refresh-lc-btn');

  if (refreshGhBtn) refreshGhBtn.addEventListener('click', fetchGitHubStats);
  if (refreshLcBtn) refreshLcBtn.addEventListener('click', fetchLeetCodeStats);

  // 6. ONE-CLICK EMAIL COPY BOX
  const copyBox = document.getElementById('copy-email-box');
  const copyStatus = document.getElementById('copy-status');
  copyBox.addEventListener('click', () => {
    navigator.clipboard.writeText('jatinsharma24062005@gmail.com');
    copyStatus.textContent = 'Copied!';
    setTimeout(() => { copyStatus.textContent = 'Copy'; }, 2000);
  });

  // 7. EXECUTIVE CV MODAL & PRINT TRIGGER
  const cvModal = document.getElementById('cv-modal');
  const openCvBtns = [document.getElementById('cv-btn'), document.getElementById('hero-cv-btn')];
  const closeCvBtn = document.getElementById('close-cv-btn');
  const printCvBtn = document.getElementById('print-cv-btn');

  openCvBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => cvModal.classList.remove('hidden'));
  });

  closeCvBtn.addEventListener('click', () => cvModal.classList.add('hidden'));
  cvModal.addEventListener('click', (e) => {
    if (e.target === cvModal) cvModal.classList.add('hidden');
  });

  printCvBtn.addEventListener('click', () => {
    window.print();
  });

  // 8. INTERACTIVE CLI TERMINAL DRAWER
  const termDrawer = document.getElementById('terminal-drawer');
  const cliBtn = document.getElementById('cli-btn');
  const closeTermBtn = document.getElementById('close-terminal');
  const termBody = document.getElementById('terminal-body');
  const termInput = document.getElementById('terminal-input');

  if (cliBtn) {
    cliBtn.addEventListener('click', () => {
      termDrawer.classList.toggle('hidden');
      if (!termDrawer.classList.contains('hidden')) {
        termInput.focus();
      }
    });
  }

  closeTermBtn.addEventListener('click', () => termDrawer.classList.add('hidden'));

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = termInput.value.trim().toLowerCase();
      termInput.value = '';

      const lineUser = document.createElement('div');
      lineUser.className = 'term-line';
      lineUser.textContent = `> ${cmd}`;
      termBody.appendChild(lineUser);

      const lineResp = document.createElement('div');
      lineResp.className = 'term-line';

      switch (cmd) {
        case 'help':
          lineResp.textContent = `Commands: help, about, skills, internships, projects, leetcode, github, contact, clear`;
          break;
        case 'about':
          lineResp.textContent = `Cloud & DevOps Engineer passionate about Linux, Docker, AWS, and Node.js backend development.`;
          break;
        case 'skills':
          lineResp.textContent = `HTML5, CSS3, JavaScript, Node.js, Express, Docker, AWS, Linux, Nginx, CI/CD`;
          break;
        case 'internships':
          lineResp.textContent = `1. DevOps & Cloud Engineering Intern @ CloudScale\n2. Web Backend & DevOps Intern @ InnovateX`;
          break;
        case 'projects':
          lineResp.textContent = `1. CloudPulse Server Metrics Monitor\n2. Dockerized Node.js Microservice Pipeline\n3. DevMetrics Cloud Portfolio`;
          break;
        case 'github':
          lineResp.textContent = `GitHub: https://github.com/jatins2405`;
          break;
        case 'leetcode':
          lineResp.textContent = `LeetCode: https://leetcode.com/u/DEX010/ (350+ Solved)`;
          break;
        case 'contact':
          lineResp.textContent = `Email: jatinsharma24062005@gmail.com`;
          break;
        case 'clear':
          termBody.innerHTML = '';
          return;
        default:
          lineResp.textContent = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
          break;
      }

      termBody.appendChild(lineResp);
      termBody.scrollTop = termBody.scrollHeight;
    }
  });

  // 9. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.classList.add('hidden');
    formSuccess.classList.remove('hidden');
    setTimeout(() => {
      contactForm.reset();
      contactForm.classList.remove('hidden');
      formSuccess.classList.add('hidden');
    }, 4000);
  });

  // 10. BACK TO TOP
  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 11. ELEGANT SCROLL REVEAL DELAY INTERSECTION OBSERVER
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

});
