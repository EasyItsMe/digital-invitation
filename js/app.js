/**
 * WEB UNDANGAN DIGITAL ONLINE - BLUE BUTTERFLY
 * Siti Ami & Abdul Azis | Walimatul Khitan: Andiks Satria & Raditya Panca
 * Interactive Scroll Engine & Components
 */

document.addEventListener('DOMContentLoaded', () => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  // Elements
  const audio = document.getElementById('bg-music');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const musicDisc = document.getElementById('music-disc');
  const iconMusicOff = document.getElementById('icon-music-off');

  const btnOpenInvitation = document.getElementById('btn-open-invitation');
  const floatingDock = document.getElementById('floating-dock-nav');
  const dockItems = Array.from(document.querySelectorAll('.dock-item'));
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const displayGuestName = document.getElementById('display-guest-name');

  // Lightbox Elements
  const galleryLightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const galleryItems = Array.from(document.querySelectorAll('.grid-item'));

  // Calendar & Copy Buttons
  const btnAddCalendar = document.getElementById('btn-add-calendar');
  const copyButtons = Array.from(document.querySelectorAll('.btn-copy-acc'));
  const toastNotify = document.getElementById('toast-notify');
  const toastMsg = document.getElementById('toast-msg');

  // RSVP Form & Wishes Feed
  const rsvpForm = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-list');
  const wishesCount = document.getElementById('wishes-count');

  // States
  let isAudioPlaying = false;
  let currentLightboxIndex = 0;
  let toastTimer = null;

  /* ==========================================================================
     1. GUEST PERSONALIZATION VIA URL QUERY
     ========================================================================== */
  function initGuestPersonalization() {
    let urlParams = new URLSearchParams(window.location.search);
    let guest = urlParams.get('to') || 
                urlParams.get('nama') || 
                urlParams.get('name') || 
                urlParams.get('tamu') || 
                urlParams.get('u') || 
                urlParams.get('guest') || 
                urlParams.get('undangan') || 
                urlParams.get('penerima');
    
    // Hash parameter fallback (misal: #to=Budi+Santoso)
    if (!guest && window.location.hash) {
      const hashClean = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
      const hashParams = new URLSearchParams(hashClean);
      guest = hashParams.get('to') || 
              hashParams.get('nama') || 
              hashParams.get('name') || 
              hashParams.get('tamu') || 
              hashParams.get('u') || 
              hashParams.get('guest');
    }

    if (guest && guest.trim()) {
      let cleanGuest = guest.trim();
      // Bila menggunakan underscore tanpa spasi (misal: Bpk_Ahmad), ubah jadi spasi
      if (cleanGuest.includes('_') && !cleanGuest.includes(' ')) {
        cleanGuest = cleanGuest.replace(/_/g, ' ');
      }
      if (displayGuestName) displayGuestName.textContent = cleanGuest;
      const inputName = document.getElementById('guest-input-name');
      if (inputName) inputName.value = cleanGuest;
    }
  }

  /* ==========================================================================
     2. AUDIO CONTROLLER
     ========================================================================== */
  function playAudio() {
    audio.play().then(() => {
      isAudioPlaying = true;
      if (btnSoundToggle) btnSoundToggle.classList.add('is-playing');
      musicDisc.classList.add('playing');
      musicDisc.style.display = 'flex';
      iconMusicOff.style.display = 'none';
    }).catch(err => {
      console.log('Audio autoplay prevented:', err);
      isAudioPlaying = false;
      if (btnSoundToggle) btnSoundToggle.classList.remove('is-playing');
      musicDisc.classList.remove('playing');
      musicDisc.style.display = 'none';
      iconMusicOff.style.display = 'block';
    });
  }

  function pauseAudio() {
    audio.pause();
    isAudioPlaying = false;
    if (btnSoundToggle) btnSoundToggle.classList.remove('is-playing');
    musicDisc.classList.remove('playing');
    musicDisc.style.display = 'none';
    iconMusicOff.style.display = 'block';
  }

  if (btnSoundToggle) {
    btnSoundToggle.addEventListener('click', () => {
      if (isAudioPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  /* ==========================================================================
     3. OPEN INVITATION & SCROLL & CELEBRATION SPARKLES
     ========================================================================== */
  function showFloatingDock() {
    if (floatingDock) {
      floatingDock.classList.add('is-visible');
    }
  }

  function triggerCelebrationSparkles(x, y) {
    const colors = ['#88b5d3', '#d8ecf8', '#f5e4b3', '#ffffff', '#4b85ab', '#c29953', '#b3d4ea'];
    const particleCount = 32;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      const size = Math.random() * 9 + 5;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 180 + 50;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 45; // upward celebratory bias
      const rot = (Math.random() - 0.5) * 540;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const isStar = Math.random() > 0.45;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      particle.style.setProperty('--rot', `${rot}deg`);
      
      if (isStar) {
        particle.style.borderRadius = '2px';
        particle.style.boxShadow = `0 0 10px ${color}, 0 0 4px #ffffff`;
      } else {
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 8px ${color}`;
      }
      
      document.body.appendChild(particle);
      setTimeout(() => {
        particle.remove();
      }, 1300);
    }
  }

  function unlockInvitation(withScroll = true) {
    const coverSec = document.getElementById('sec-cover');
    if (coverSec && withScroll) {
      coverSec.classList.add('cover-closing');
    }

    setTimeout(() => {
      // Temporarily set scroll behavior to auto to prevent smooth-scroll interpolation glitches during reflow
      document.documentElement.style.scrollBehavior = 'auto';

      document.documentElement.classList.remove('is-locked');
      document.body.classList.remove('is-locked');
      document.body.classList.add('invitation-opened');

      // Reset scroll position immediately
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      const quotesSec = document.getElementById('sec-quotes');
      if (quotesSec) {
        quotesSec.scrollIntoView({ behavior: 'auto', block: 'start' });
      }

      showFloatingDock();

      // Restore smooth scroll behavior and re-initialize scroll spy
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        initScrollReveals();
        updateScrollSpy();
        window.dispatchEvent(new CustomEvent('invitation-opened'));
      }, 100);
    }, withScroll ? 380 : 0);
  }

  if (btnOpenInvitation) {
    btnOpenInvitation.addEventListener('click', (e) => {
      // 0. Trigger celebratory sparkles from button
      const rect = btnOpenInvitation.getBoundingClientRect();
      const centerX = rect.left + (rect.width / 2);
      const centerY = rect.top + (rect.height / 2);
      triggerCelebrationSparkles(centerX, centerY);

      // 1. Play audio
      playAudio();

      // 2. Unlock invitation & scroll to Quotes
      unlockInvitation(true);
    });
  }

  // Handle direct hash navigation on initial load (e.g. index.html#sec-acara)
  if (window.location.hash && window.location.hash !== '#sec-cover') {
    unlockInvitation(false);
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  }

  // Auto show dock when scrolling past hero
  window.addEventListener('scroll', () => {
    if (document.body.classList.contains('invitation-opened') && window.scrollY > 80) {
      showFloatingDock();
    }
  }, { passive: true });

  /* ==========================================================================
     4. SCROLLSPY & DOCK NAVIGATION
     ========================================================================== */
  function updateScrollSpy() {
    const scrollPos = window.scrollY + (window.innerHeight * 0.35);

    let activeId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeId = sec.getAttribute('id');
      }
    });

    if (!activeId) {
      if (window.scrollY < 250) {
        activeId = 'sec-quotes';
      }
    }

    if (activeId) {
      dockItems.forEach(item => {
        if (item.getAttribute('data-target') === activeId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });

  dockItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ==========================================================================
     5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ========================================================================== */
  let revealObserver = null;

  function initScrollReveals() {
    const revealElements = document.querySelectorAll(
      '.reveal:not(.is-visible), .reveal-up:not(.is-visible), .reveal-fade:not(.is-visible), .reveal-zoom:not(.is-visible), .reveal-left:not(.is-visible), .reveal-right:not(.is-visible)'
    );

    if ('IntersectionObserver' in window) {
      if (!revealObserver) {
        revealObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -30px 0px'
        });
      }
      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('is-visible'));
    }
  }

  initScrollReveals();

  /* ==========================================================================
     6. COUNTDOWN TIMER (06 Desember 2026, 08:00 WIB)
     ========================================================================== */
  function initCountdown() {
    const targetDate = new Date('2026-12-06T08:00:00+07:00').getTime();

    const elDays = document.getElementById('count-days');
    const elHours = document.getElementById('count-hours');
    const elMinutes = document.getElementById('count-minutes');
    const elSeconds = document.getElementById('count-seconds');

    if (!elDays || !elHours || !elMinutes || !elSeconds) return;

    let prevValues = { d: '', h: '', m: '', s: '' };

    function updateBox(el, newVal, oldVal) {
      if (newVal !== oldVal) {
        el.textContent = newVal;
        if (oldVal !== '') {
          el.classList.remove('num-tick');
          void el.offsetWidth; // trigger reflow for smooth animation restart
          el.classList.add('num-tick');
        }
      }
    }

    function update() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        elDays.textContent = '00';
        elHours.textContent = '00';
        elMinutes.textContent = '00';
        elSeconds.textContent = '00';
        return;
      }

      const d = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
      const h = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
      const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

      updateBox(elDays, d, prevValues.d);
      updateBox(elHours, h, prevValues.h);
      updateBox(elMinutes, m, prevValues.m);
      updateBox(elSeconds, s, prevValues.s);

      prevValues = { d, h, m, s };
    }

    update();
    setInterval(update, 1000);
  }

  /* ==========================================================================
     7. GOOGLE CALENDAR BUTTON
     ========================================================================== */
  if (btnAddCalendar) {
    btnAddCalendar.addEventListener('click', () => {
      const title = encodeURIComponent('Pernikahan Siti Ami & Abdul Azis dan Khitanan Andiks & Raditya');
      const details = encodeURIComponent('Akad Nikah & Resepsi Pernikahan Siti Ami & Abdul Azis serta Khitanan Putra kami: Andiks Satria & Raditya Panca');
      const location = encodeURIComponent('Kediaman Mempelai Wanita, Kp. Buah Gede RT. 009 RW. 005 Ds. Sentul Kec. Kragilan Kab. Serang - Banten');
      const dates = '20261206T010000Z/20261206T100000Z';
      
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(gcalUrl, '_blank');
    });
  }

  /* ==========================================================================
     8. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(message) {
    if (!toastNotify || !toastMsg) return;
    toastMsg.textContent = message;
    toastNotify.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotify.classList.remove('active');
    }, 3200);
  }

  /* ==========================================================================
     9. COPY TO CLIPBOARD (Bank Account & Gift Address)
     ========================================================================== */
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const holder = btn.getAttribute('data-holder') || 'Informasi';
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        const textToCopy = targetEl.textContent.trim();
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`${holder} berhasil disalin ke clipboard!`);
        }).catch(() => {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = textToCopy;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast(`${holder} berhasil disalin!`);
        });
      }
    });
  });

  /* ==========================================================================
     10. GALLERY LIGHTBOX
     ========================================================================== */
  function initGalleryLightbox() {
    if (!galleryLightbox || galleryItems.length === 0) return;

    function openLightbox(index) {
      currentLightboxIndex = index;
      const item = galleryItems[currentLightboxIndex];
      const fullSrc = item.getAttribute('data-full');

      if (lightboxImg) {
        lightboxImg.classList.add('fade-transition');
        const tempImg = new Image();
        tempImg.onload = () => {
          lightboxImg.src = fullSrc;
          lightboxImg.classList.remove('fade-transition');
        };
        tempImg.src = fullSrc;
      }

      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryItems.length}`;
      }
      galleryLightbox.classList.add('active');
    }

    function closeLightbox() {
      galleryLightbox.classList.remove('active');
    }

    function showNext() {
      currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
      openLightbox(currentLightboxIndex);
    }

    function showPrev() {
      currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(currentLightboxIndex);
    }

    galleryItems.forEach((item, idx) => {
      item.addEventListener('click', () => openLightbox(idx));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

    galleryLightbox.addEventListener('click', (e) => {
      if (e.target === galleryLightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!galleryLightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

  /* ==========================================================================
     11. RSVP & GUESTBOOK (Local Storage Persistence)
     ========================================================================== */
  const DEFAULT_WISHES = [
    {
      name: "Bpk. Supangat (Kepala Desa Sentul)",
      attendance: "Hadir",
      message: "Selamat atas pernikahan Siti Ami & Abdul Azis, serta khitanan ananda Andiks Satria & Raditya Panca. Semoga kedua mempelai menjadi keluarga sakinah mawaddah warahmah dan ananda tumbuh menjadi anak sholeh yang membanggakan.",
      time: "2 jam yang lalu"
    },
    {
      name: "Bpk. Azwar Anas, S.T., M.I.Kom",
      attendance: "Hadir",
      message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khoir. Turut berbahagia untuk kedua keluarga besar di Kp. Buah Gede.",
      time: "4 jam yang lalu"
    },
    {
      name: "Keluarga Besar Kp. Buah Gede",
      attendance: "Hadir",
      message: "Selamat menempuh hidup baru Ami & Azis! Selamat juga buat Andiks & Raditya atas khitanannya, semoga lekas pulih dan menjadi kebanggaan orang tua.",
      time: "6 jam yang lalu"
    }
  ];

  function getStoredWishes() {
    try {
      const stored = localStorage.getItem('ami_azis_wishes_v2');
      return stored ? JSON.parse(stored) : DEFAULT_WISHES;
    } catch (e) {
      return DEFAULT_WISHES;
    }
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem('ami_azis_wishes_v2', JSON.stringify(wishes));
    } catch (e) {}
  }

  function renderWishes() {
    if (!wishesList || !wishesCount) return;
    const wishes = getStoredWishes();
    wishesCount.textContent = wishes.length;
    wishesList.innerHTML = '';

    wishes.forEach(w => {
      const item = document.createElement('div');
      item.className = 'wish-item-card';

      let attClass = '';
      if (w.attendance === 'Tidak Hadir') attClass = 'tidak-hadir';
      else if (w.attendance === 'Ragu-ragu') attClass = 'ragu';

      item.innerHTML = `
        <div class="wish-header-row">
          <span class="wish-author-name">${escapeHtml(w.name)}</span>
          <span class="wish-badge-att ${attClass}">${escapeHtml(w.attendance)}</span>
        </div>
        <p class="wish-body-msg">${escapeHtml(w.message)}</p>
        <span class="wish-time-lbl">${escapeHtml(w.time)}</span>
      `;
      wishesList.appendChild(item);
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;');
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('guest-input-name');
      const attRadio = document.querySelector('input[name="attendance"]:checked');
      const countSelect = document.getElementById('guest-count');
      const msgInput = document.getElementById('guest-message');
      const submitBtn = rsvpForm.querySelector('button[type="submit"]');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const attVal = attRadio ? attRadio.value : 'Hadir';
      const countVal = countSelect ? countSelect.value : '1 Orang';
      const msgVal = msgInput ? msgInput.value.trim() : '';

      if (!nameVal || !msgVal) return;

      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Mengirim konfirmasi...</span>`;
      }

      const newWish = {
        name: nameVal,
        attendance: `${attVal} (${countVal})`,
        message: msgVal
      };

      try {
        if (window.SupabaseRSVP) {
          await window.SupabaseRSVP.submitWish(newWish);
        } else {
          const wishes = getStoredWishes();
          wishes.unshift(Object.assign({ time: 'Baru saja' }, newWish));
          saveWishes(wishes);
        }
      } catch (err) {
        console.warn('Gagal simpan online, disimpan lokal:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }

      rsvpForm.reset();
      showToast('Terima kasih banyak atas doa restu & konfirmasi Anda!');
    });
  }

  /* ==========================================================================
     11b. FAST TYPEWRITER ANIMATION FOR QUOTES & PRAYERS
     ========================================================================== */
  function initFastTypewriter() {
    const typewriterElements = document.querySelectorAll('[data-typewriter="true"]');
    if (!typewriterElements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    typewriterElements.forEach(el => {
      const fullText = el.textContent.replace(/\s+/g, ' ').trim();
      el.setAttribute('data-full-text', fullText);

      if (prefersReducedMotion) {
        el.textContent = fullText;
        return;
      }

      el.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>';
    });

    if (prefersReducedMotion) return;

    function runTyping(el) {
      if (el.dataset.typingDone === 'true' || el.dataset.isTyping === 'true') return;
      el.dataset.isTyping = 'true';

      const fullText = el.getAttribute('data-full-text') || '';
      const textSpan = el.querySelector('.typewriter-text');
      const cursorSpan = el.querySelector('.typewriter-cursor');
      if (!textSpan) return;

      let charIndex = 0;
      // 1 character per tick with gentle, rhythmic pacing (~25ms) for authentic typewriter feel
      const step = 1;
      const speed = 25; // ms per keystroke

      const typingInterval = setInterval(() => {
        charIndex += step;
        if (charIndex >= fullText.length) {
          textSpan.textContent = fullText;
          clearInterval(typingInterval);
          el.dataset.typingDone = 'true';
          el.dataset.isTyping = 'false';
          if (cursorSpan) {
            setTimeout(() => {
              cursorSpan.classList.add('cursor-fade');
              setTimeout(() => cursorSpan.remove(), 400);
            }, 800);
          }
        } else {
          textSpan.textContent = fullText.substring(0, charIndex);
        }
      }, speed);

      // Tap to reveal full text immediately for convenience
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        if (el.dataset.typingDone !== 'true') {
          clearInterval(typingInterval);
          textSpan.textContent = fullText;
          el.dataset.typingDone = 'true';
          el.dataset.isTyping = 'false';
          if (cursorSpan) {
            cursorSpan.classList.add('cursor-fade');
            setTimeout(() => cursorSpan.remove(), 300);
          }
        }
      }, { once: true });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Only start typing once invitation is opened
            if (!document.documentElement.classList.contains('is-locked') && !document.body.classList.contains('is-locked')) {
              runTyping(entry.target);
              observer.unobserve(entry.target);
            }
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
      });

      typewriterElements.forEach(el => observer.observe(el));

      window.addEventListener('invitation-opened', () => {
        typewriterElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            runTyping(el);
            observer.unobserve(el);
          }
        });
      });
    } else {
      typewriterElements.forEach(el => {
        el.textContent = el.getAttribute('data-full-text');
      });
    }
  }

  /* ==========================================================================
     12. INITIALIZATION CALLS
     ========================================================================== */
  initGuestPersonalization();
  initCountdown();
  initGalleryLightbox();
  initFastTypewriter();
  renderWishes();
});
