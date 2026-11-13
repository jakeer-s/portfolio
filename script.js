/**
 * Shaik Jakeer - Portfolio Website Scripts
 * Interactive features, theme toggle, spam classifier demo, project modal & copy-to-clipboard
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Set current year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     Theme Switcher (Dark / Light)
     ========================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('shaik-portfolio-theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('shaik-portfolio-theme', newTheme);
    });
  }

  /* ==========================================================================
     Mobile Menu Toggle
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close when clicking nav link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     Active Link on Scroll
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links .nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNavOnScroll);

  /* ==========================================================================
     Hero Typewriter Animation
     ========================================================================== */
  const typewriterText = document.getElementById('typewriterText');
  const roles = [
    'AI & Machine Learning Enthusiast',
    'Python Full Stack Developer',
    'Data & Algorithms Problem Solver',
    'MySQL & Database Designer'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function typeEffect() {
    if (!typewriterText) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 50;
    } else {
      typewriterText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingDelay = 1800; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 400; // Pause before new word
    }

    setTimeout(typeEffect, typingDelay);
  }
  typeEffect();

  /* ==========================================================================
     Skills Category Filter
     ========================================================================== */
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     Interactive Spam Detection Demo
     ========================================================================== */
  const demoInput = document.getElementById('demoInput');
  const runBtn = document.getElementById('runClassificationBtn');
  const clearBtn = document.getElementById('clearDemoBtn');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const demoPlaceholder = document.getElementById('demoPlaceholder');
  const demoResultContent = document.getElementById('demoResultContent');
  const resultStatusBadge = document.getElementById('resultStatusBadge');
  const resultScore = document.getElementById('resultScore');
  const meterPercentText = document.getElementById('meterPercentText');
  const meterFill = document.getElementById('meterFill');
  const analysisPointsList = document.getElementById('analysisPointsList');

  // Preset buttons handler
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text');
      if (demoInput) {
        demoInput.value = text;
        classifyMessage(text);
      }
    });
  });

  if (runBtn && demoInput) {
    runBtn.addEventListener('click', () => {
      const text = demoInput.value.trim();
      if (!text) {
        showToast('Please enter a message to classify.');
        return;
      }
      classifyMessage(text);
    });
  }

  if (clearBtn && demoInput) {
    clearBtn.addEventListener('click', () => {
      demoInput.value = '';
      if (demoResultContent) demoResultContent.classList.add('hidden');
      if (demoPlaceholder) demoPlaceholder.classList.remove('hidden');
    });
  }

  function classifyMessage(text) {
    if (!text || !demoResultContent || !demoPlaceholder) return;

    // Classification Heuristics
    const lower = text.toLowerCase();
    const spamTriggers = [
      'won', 'winner', 'cash', 'prize', 'urgent', 'lottery', 'free', 'reward',
      'claim', 'call now', 'click link', 'click this', 'http://', 'https://',
      'selected', 'selected for', 'coupon', 'dollar', 'credit', 'congratulations'
    ];

    let spamPoints = 0;
    const foundKeywords = [];

    spamTriggers.forEach(trigger => {
      if (lower.includes(trigger)) {
        spamPoints += 18;
        foundKeywords.push(trigger);
      }
    });

    // Check uppercase words count
    const words = text.split(/\s+/);
    let uppercaseWords = 0;
    words.forEach(w => {
      if (w.length > 2 && w === w.toUpperCase() && /[A-Z]/.test(w)) {
        uppercaseWords++;
      }
    });
    if (uppercaseWords >= 2) {
      spamPoints += 20;
    }

    // Exclamation marks
    const exclamations = (text.match(/!/g) || []).length;
    if (exclamations >= 2) {
      spamPoints += 15;
    }

    // Numbers & phone-like digits
    if (/\d{8,}/.test(text)) {
      spamPoints += 15;
    }

    // Cap probability between 4% and 98%
    let spamProbability = Math.min(Math.max(spamPoints, 6), 98);
    const isSpam = spamProbability >= 50;

    // Render results
    demoPlaceholder.classList.add('hidden');
    demoResultContent.classList.remove('hidden');

    if (isSpam) {
      resultStatusBadge.className = 'result-badge badge-spam';
      resultStatusBadge.textContent = 'Spam Detected';
      resultScore.textContent = `Confidence: ${spamProbability}%`;
      meterPercentText.textContent = `${spamProbability}% Spam Probability`;
      meterFill.className = 'meter-fill spam';
    } else {
      const hamConfidence = 100 - spamProbability;
      resultStatusBadge.className = 'result-badge badge-ham';
      resultStatusBadge.textContent = 'Legitimate / Ham';
      resultScore.textContent = `Confidence: ${hamConfidence}%`;
      meterPercentText.textContent = `${spamProbability}% Spam Probability`;
      meterFill.className = 'meter-fill ham';
    }

    meterFill.style.width = `${spamProbability}%`;

    // Render analysis breakdown
    analysisPointsList.innerHTML = '';
    const points = [];

    if (foundKeywords.length > 0) {
      points.push(`Trigger keywords identified: <strong>${foundKeywords.slice(0, 4).join(', ')}</strong>`);
    } else {
      points.push('No recognized promotional/spam trigger terms detected.');
    }

    if (uppercaseWords >= 2) {
      points.push(`High capitalization pattern detected (${uppercaseWords} all-caps words).`);
    } else {
      points.push('Standard sentence casing structure observed.');
    }

    if (exclamations >= 2) {
      points.push(`Urgency indicator: ${exclamations} exclamation marks detected.`);
    }

    if (isSpam) {
      points.push('Heuristic evaluation recommends routing to spam/quarantine box.');
    } else {
      points.push('Natural communication syntax aligned with genuine message distribution.');
    }

    points.forEach(pt => {
      const li = document.createElement('li');
      li.innerHTML = pt;
      analysisPointsList.appendChild(li);
    });
  }

  /* ==========================================================================
     Project Details Modal
     ========================================================================== */
  const projectModal = document.getElementById('projectModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalBody = document.getElementById('modalBody');
  const detailButtons = document.querySelectorAll('.project-details-btn');

  const projectDetailsData = {
    disease: {
      title: 'Multiple Disease Detection for Kidney Disease & Heart Disease',
      badge: 'Healthcare Machine Learning Framework',
      tags: ['Python', 'Scikit-learn', 'AdaBoost', 'Extra Trees Classifier', 'Pandas', 'NumPy', 'Healthcare AI'],
      sections: [
        {
          heading: 'System Architecture & Ensemble Strategy',
          content: 'This project implements an ensemble learning pipeline specifically built to simultaneously address high-stakes chronic diseases: Chronic Kidney Disease (CKD) and Cardiovascular Heart Disease (CVD). To overcome the limitations of single-algorithm biases, the architecture combines the sequential error-correction of AdaBoost with the randomized split diversity of Extra Trees Classifier.'
        },
        {
          heading: 'Clinical Dataset & Feature Engineering',
          content: 'Clinical features analyzed include blood pressure, specific gravity, albumin, blood urea, serum creatinine, sodium, potassium, hemoglobin, white blood cell count, chest pain types, resting ECG, and maximum heart rate achieved. Preprocessing includes median imputation, standard scaling, and synthetic minority oversampling to handle class imbalances.'
        },
        {
          heading: 'Performance & Validation Benchmarks',
          table: [
            { metric: 'Ensemble Model', accuracy: '96.4%', precision: '95.8%', recall: '97.1%', f1: '96.4%' },
            { metric: 'Extra Trees Alone', accuracy: '94.8%', precision: '94.0%', recall: '95.2%', f1: '94.6%' },
            { metric: 'AdaBoost Alone', accuracy: '93.6%', precision: '92.5%', recall: '94.0%', f1: '93.2%' },
            { metric: 'Baseline Logistic Reg.', accuracy: '86.2%', precision: '84.0%', recall: '87.5%', f1: '85.7%' }
          ]
        },
        {
          heading: 'Clinical Relevance & Impact',
          content: 'Dual-target screening significantly reduces diagnostic turn-around time. The system delivers calibrated prediction probabilities enabling doctors to prioritize high-risk patients before irreversible organ deterioration occurs.'
        }
      ]
    },
    spam: {
      title: 'Spam Detection Web System',
      badge: 'Interactive Natural Language Processing App',
      tags: ['Python', 'HTML5', 'CSS3', 'NLP Heuristics', 'Web Architecture', 'Tokenization'],
      sections: [
        {
          heading: 'Overview & Objectives',
          content: 'Developed as an end-to-end educational and demonstration platform that demystifies how email/SMS filters intercept suspicious messages. Users interact with a clean, responsive interface to observe classification logic in real time.'
        },
        {
          heading: 'Backend & Classification Logic',
          content: 'The core engine evaluates message semantics, token frequency, uppercase density, character distribution, and explicit spam keywords. Built with modular Python routines that can interface with either rule-based regex pipelines or probabilistic Naive Bayes models.'
        },
        {
          heading: 'Key User Features',
          content: 'Real-time classification confidence feedback, styled visual indicators (Ham vs. Spam badges), contextual diagnostic explanations detailing why a message was flagged, and instant test presets for rapid demonstrations.'
        }
      ]
    }
  };

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = projectDetailsData[projKey];
      if (!data || !modalBody || !projectModal) return;

      let html = `
        <span class="project-badge" style="margin-bottom: 0.5rem; display: inline-block;">${data.badge}</span>
        <h3 class="modal-title">${data.title}</h3>
        <div class="modal-tags">
          ${data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      `;

      data.sections.forEach(sec => {
        html += `
          <div class="modal-section">
            <h4>${sec.heading}</h4>
            ${sec.content ? `<p>${sec.content}</p>` : ''}
            ${sec.table ? `
              <div class="metrics-table-wrap">
                <table class="metrics-table">
                  <thead>
                    <tr>
                      <th>Model Architecture</th>
                      <th>Accuracy</th>
                      <th>Precision</th>
                      <th>Recall</th>
                      <th>F1-Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sec.table.map(row => `
                      <tr>
                        <td><strong>${row.metric}</strong></td>
                        <td>${row.accuracy}</td>
                        <td>${row.precision}</td>
                        <td>${row.recall}</td>
                        <td>${row.f1}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}
          </div>
        `;
      });

      modalBody.innerHTML = html;
      projectModal.classList.remove('hidden');
    });
  });

  if (closeModalBtn && projectModal) {
    closeModalBtn.addEventListener('click', () => {
      projectModal.classList.add('hidden');
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.add('hidden');
      }
    });
  }

  /* ==========================================================================
     Clipboard Copy Functionality
     ========================================================================== */
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied "${text}" to clipboard!`);
        }).catch(() => {
          fallbackCopy(text);
        });
      } else if (text) {
        fallbackCopy(text);
      }
    });
  });

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(`Copied "${text}" to clipboard!`);
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }

  /* ==========================================================================
     Download Resume (Print View)
     ========================================================================== */
  const downloadResumeBtn = document.getElementById('downloadResumeBtn');
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* ==========================================================================
     Contact Form Handler (Real Email Delivery via FormSubmit & Netlify Forms)
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('nameInput')?.value.trim();
      const email = document.getElementById('emailInput')?.value.trim();
      const subject = document.getElementById('subjectInput')?.value.trim();
      const message = document.getElementById('messageInput')?.value.trim();

      if (!name || !email || !subject || !message) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'Please fill out all fields before submitting.';
          formFeedback.classList.remove('hidden');
        }
        return;
      }

      // Update button state to sending
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnText) submitBtnText.textContent = 'Sending Message...';
      if (formFeedback) {
        formFeedback.className = 'form-feedback';
        formFeedback.textContent = 'Sending your message...';
        formFeedback.classList.remove('hidden');
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/shaikjakeer9441@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            Name: name,
            Email: email,
            Subject: subject,
            Message: message,
            _subject: `New Portfolio Message: ${subject} (from ${name})`,
            _template: 'table'
          })
        });

        if (response.ok) {
          if (formFeedback) {
            formFeedback.className = 'form-feedback success';
            formFeedback.innerHTML = `<strong>Message Sent Successfully!</strong> Thank you, ${name}. Your message has been delivered directly to <code>shaikjakeer9441@gmail.com</code>.`;
            formFeedback.classList.remove('hidden');
          }
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        // Fallback: standard form submit to FormSubmit / Netlify
        contactForm.submit();
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = 'Send Message';
      }
    });
  }
});
