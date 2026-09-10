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
        setTimeout(runTypewriterLoop, 60);
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
        setTimeout(runTypewriterLoop, 45);
      } else {
        // Line 2 finished typing, hold for 2.5s before deleting
        elLine2.innerHTML = `${currentLine2}<span class="typing-cursor">|</span>`;
        setTimeout(() => {
          isDeleting = true;
          runTypewriterLoop();
        }, 2500);
      }
    } else {
      // Erasing Line 2
      if (idx2 > 0) {
        idx2--;
        elLine2.innerHTML = `${currentLine2.slice(0, idx2)}<span class="typing-cursor">|</span>`;
        setTimeout(runTypewriterLoop, 25);
      } else {
        // Erase complete, move to next title in loop
        isDeleting = false;
        titleIndex = (titleIndex + 1) % line2Titles.length;
        setTimeout(runTypewriterLoop, 300);
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
  const lcUsername = 'jatins2405';

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
      const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${lcUsername}`);
      if (!res.ok) throw new Error('LeetCode API Error');
      const data = await res.json();
      if (data.status === 'success') {
        document.getElementById('lc-total').textContent = data.totalSolved || '350+';
        document.getElementById('lc-rank').textContent = data.ranking ? `#${data.ranking.toLocaleString()}` : '#85,400';
        document.getElementById('lc-easy-txt').textContent = `${data.easySolved || 150} / ${data.totalEasy || 700}`;
        document.getElementById('lc-med-txt').textContent = `${data.mediumSolved || 170} / ${data.totalMedium || 1500}`;
        document.getElementById('lc-hard-txt').textContent = `${data.hardSolved || 30} / ${data.totalHard || 600}`;

        document.getElementById('lc-easy-bar').style.width = `${Math.min(100, ((data.easySolved || 150) / (data.totalEasy || 700)) * 100)}%`;
        document.getElementById('lc-med-bar').style.width = `${Math.min(100, ((data.mediumSolved || 170) / (data.totalMedium || 1500)) * 100)}%`;
        document.getElementById('lc-hard-bar').style.width = `${Math.min(100, ((data.hardSolved || 30) / (data.totalHard || 600)) * 100)}%`;
      }
    } catch (err) {
      console.warn('LeetCode Stats API fallback:', err);
    }
  }

  fetchGitHubStats();
  fetchLeetCodeStats();

  document.getElementById('refresh-stats-btn').addEventListener('click', () => {
    fetchGitHubStats();
    fetchLeetCodeStats();
  });

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
          lineResp.textContent = `LeetCode: https://leetcode.com/jatins2405 (350+ Solved)`;
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
