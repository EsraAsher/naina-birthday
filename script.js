/**
 * NAINA'S BIRTHDAY SURPRISE - CLIENT LOGIC
 * Pure Vanilla JavaScript - Mobile-first 3D Card Stack with Gestures & Confetti
 */

/* ==========================================================================
   CONFIG - EASY TO CUSTOMIZE FOR NIHAL
   ========================================================================== */
const CONFIG = {
  // Names
  recipientName: "Naina",
  senderName: "Nihal",

  // The 11 Birthday Card Images in /assets/cards/
  // The system uses high-performance WebP with automatic PNG fallback
  cards: [
    "assets/cards/1.webp",
    "assets/cards/2.webp",
    "assets/cards/3.webp",
    "assets/cards/4.webp",
    "assets/cards/5.webp",
    "assets/cards/6.webp",
    "assets/cards/7.webp",
    "assets/cards/8.webp",
    "assets/cards/9.webp",
    "assets/cards/10.webp",
    "assets/cards/11.webp"
  ],

  // Romantic Birthday Quote & Letter shown after all cards are slid
  finalMessage: `“In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.” 💖✨

Happy Birthday to the girl who stole my heart! 🎂💖

Every moment spent with you is a little treasure I hold close. Thank you for your warmth, your sweetness, your goofy laughs, and all the happiness you bring into my world.

I hope this year brings you everything your heart wishes for and more. You deserve all the joy in the universe, and I'm so lucky to celebrate another wonderful year of you.

Happy Birthday, my Naina! 💕✨`
};


/* ==========================================================================
   WEB AUDIO API SOUND SYNTHESIS
   100% Offline, Zero external audio assets, works instantly in any browser
   ========================================================================== */
class SoundEffects {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playHappyChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      setTimeout(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.35);
        } catch (e) {}
      }, index * 85);
    });
  }

  playSadChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const notes = [440, 392, 349.23]; // A4, G4, F4
    notes.forEach((freq, index) => {
      setTimeout(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.4);
        } catch (e) {}
      }, index * 120);
    });
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(860, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.45);
        } catch (e) {}
      }, idx * 110);
    });
  }
}

const sfx = new SoundEffects();


/* ==========================================================================
   CONFETTI GENERATOR
   ========================================================================== */
class ConfettiEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    this.colors = ['#FF8FBA', '#FFCDE1', '#BDE7FF', '#FFE483', '#E7D9FF', '#FFFFFF'];
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 50, originY = 0.5) {
    const startX = this.canvas.width / 2;
    const startY = this.canvas.height * originY;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * Math.random());
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 5 + Math.random() * 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.22,
        drag: 0.96,
        opacity: 1,
        life: 0.012 + Math.random() * 0.015,
        isHeart: Math.random() > 0.65
      });
    }

    if (!this.animId) {
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.life;

      if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.isHeart) {
        const s = p.size * 0.7;
        this.ctx.beginPath();
        this.ctx.moveTo(0, s * 0.3);
        this.ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.2, s * 0.6, 0, s * 1.2);
        this.ctx.bezierCurveTo(s * 1.2, s * 0.6, s, -s * 0.6, 0, s * 0.3);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
    }
  }
}


/* ==========================================================================
   CARD STACK CONTROLLER
   Gestures: Touch swipe left/right, Mouse drag, Buttons, Undo, Progress
   ========================================================================== */
class CardStackManager {
  constructor(containerId, onComplete, sfxInstance) {
    this.container = document.getElementById(containerId);
    this.onComplete = onComplete;
    this.sfx = sfxInstance;
    this.cards = CONFIG.cards;
    this.totalCards = this.cards.length;
    this.currentIndex = 0;
    this.cardElements = [];

    // State tracking
    this.isDragging = false;
    this.isAnimating = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.activeCard = null;

    // UI elements
    this.progressBar = document.getElementById('stack-progress-bar');
    this.btnSwipeLeft = document.getElementById('btn-swipe-left');
    this.btnSwipeRight = document.getElementById('btn-swipe-right');
  }

  init() {
    this.renderCards();
    this.updateStackPositions();
    this.setupButtonListeners();
  }

  renderCards() {
    this.container.innerHTML = '';
    this.cardElements = [];

    this.cards.forEach((cardSrc, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'stack-card';
      cardEl.dataset.index = idx;

      // Badges that show while dragging
      const badgeLeft = document.createElement('div');
      badgeLeft.className = 'stack-badge badge-swipe-left';
      badgeLeft.textContent = '💖 NEXT';

      const badgeRight = document.createElement('div');
      badgeRight.className = 'stack-badge badge-swipe-right';
      badgeRight.textContent = '🌸 NEXT';

      // Card Image with async decoding and smart loading
      const img = document.createElement('img');
      img.className = 'stack-card-img';
      img.alt = `Birthday card ${idx + 1} for Naina`;
      img.decoding = 'async';
      img.loading = idx < 3 ? 'eager' : 'lazy';
      img.src = cardSrc;

      // Fallback: If WebP fails, try PNG. If PNG fails, show cute message
      img.addEventListener('error', () => {
        if (img.src.endsWith('.webp')) {
          img.src = cardSrc.replace('.webp', '.png');
        } else {
          img.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = 'stack-card-fallback';
          fallback.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 8px;">🐧💌</div>
            <h4 style="font-family: var(--font-display); color: var(--pink-dark); margin-bottom: 4px;">Memory #${idx + 1}</h4>
            <p style="font-size: 0.9rem; color: #475467;">A sweet surprise from Nihal to Naina 💕</p>
          `;
          cardEl.appendChild(fallback);
        }
      });

      cardEl.appendChild(badgeLeft);
      cardEl.appendChild(badgeRight);
      cardEl.appendChild(img);
      this.container.appendChild(cardEl);
      this.cardElements.push(cardEl);
    });
  }

  updateStackPositions() {
    this.cardElements.forEach((card, idx) => {
      card.className = 'stack-card';
      card.style.transform = '';
      card.style.opacity = '';
      card.style.transition = '';

      // Reset badges
      const badges = card.querySelectorAll('.stack-badge');
      badges.forEach(b => b.style.opacity = '0');

      if (idx === this.currentIndex) {
        card.classList.add('card-top');
        this.attachPointerEvents(card);
      } else if (idx === this.currentIndex + 1) {
        card.classList.add('card-next-1');
      } else if (idx === this.currentIndex + 2) {
        card.classList.add('card-next-2');
      } else {
        card.classList.add('card-hidden');
      }
    });

    // Update Progress Bar
    const progressPercent = Math.max(9, ((this.currentIndex + 1) / this.totalCards) * 100);
    if (this.progressBar) {
      this.progressBar.style.width = `${progressPercent}%`;
    }
  }

  attachPointerEvents(card) {
    this.activeCard = card;

    card.onpointerdown = (e) => {
      if (this.isAnimating || this.currentIndex >= this.totalCards) return;
      this.isDragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.currentX = 0;
      this.currentY = 0;
      card.classList.add('dragging');
      try {
        card.setPointerCapture(e.pointerId);
      } catch (err) {}
    };

    card.onpointermove = (e) => {
      if (!this.isDragging || !this.activeCard) return;

      this.currentX = e.clientX - this.startX;
      this.currentY = (e.clientY - this.startY) * 0.3; // subtle vertical dampening
      const rot = this.currentX * 0.08;

      this.activeCard.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0) rotate(${rot}deg)`;

      // Dynamic Badges Feedback
      const badgeLeft = this.activeCard.querySelector('.badge-swipe-left');
      const badgeRight = this.activeCard.querySelector('.badge-swipe-right');

      if (this.currentX > 20) {
        if (badgeRight) badgeRight.style.opacity = Math.min(1, (this.currentX - 20) / 70);
        if (badgeLeft) badgeLeft.style.opacity = 0;
      } else if (this.currentX < -20) {
        if (badgeLeft) badgeLeft.style.opacity = Math.min(1, (-this.currentX - 20) / 70);
        if (badgeRight) badgeRight.style.opacity = 0;
      } else {
        if (badgeLeft) badgeLeft.style.opacity = 0;
        if (badgeRight) badgeRight.style.opacity = 0;
      }

      // Smoothly scale up next card underneath
      const nextCard = this.cardElements[this.currentIndex + 1];
      if (nextCard) {
        const progress = Math.min(1, Math.abs(this.currentX) / 140);
        const scale = 0.96 + 0.04 * progress;
        const translateY = 10 - 10 * progress;
        const rotate = -2 * (1 - progress);
        nextCard.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotate}deg)`;
      }
    };

    const handlePointerEnd = (e) => {
      if (!this.isDragging || !this.activeCard) return;
      this.isDragging = false;
      this.activeCard.classList.remove('dragging');
      try {
        this.activeCard.releasePointerCapture(e.pointerId);
      } catch (err) {}

      const threshold = 70;
      if (Math.abs(this.currentX) > threshold) {
        this.dismissCard(this.currentX > 0 ? 'right' : 'left');
      } else {
        // Snap back to center
        this.activeCard.style.transition = 'transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
        this.activeCard.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';

        const badges = this.activeCard.querySelectorAll('.stack-badge');
        badges.forEach(b => b.style.opacity = '0');

        const nextCard = this.cardElements[this.currentIndex + 1];
        if (nextCard) {
          nextCard.style.transition = 'transform 0.3s ease';
          nextCard.style.transform = 'translate3d(0, 10px, 0) scale(0.96) rotate(-2deg)';
        }
      }
    };

    card.onpointerup = handlePointerEnd;
    card.onpointercancel = handlePointerEnd;
  }

  dismissCard(direction = 'right') {
    if (this.isAnimating || this.currentIndex >= this.totalCards) return;
    this.isAnimating = true;

    const topCard = this.cardElements[this.currentIndex];
    if (!topCard) {
      this.isAnimating = false;
      return;
    }

    this.sfx.playPop();

    // Fly away animation with 3D acceleration
    const flyX = direction === 'right' ? '125vw' : '-125vw';
    const flyRot = direction === 'right' ? '28deg' : '-28deg';

    topCard.style.transition = 'transform 0.32s cubic-bezier(0.2, 0.8, 0.3, 1), opacity 0.28s ease';
    topCard.style.transform = `translate3d(${flyX}, ${this.currentY || 0}px, 0) rotate(${flyRot})`;
    topCard.style.opacity = '0';

    // Simultaneously animate next card seamlessly into top position
    const nextCard = this.cardElements[this.currentIndex + 1];
    if (nextCard) {
      nextCard.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.3, 1), opacity 0.28s ease';
      nextCard.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
      nextCard.style.opacity = '1';
    }

    this.currentIndex++;

    setTimeout(() => {
      if (this.currentIndex >= this.totalCards) {
        this.isAnimating = false;
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      } else {
        this.updateStackPositions();
        this.isAnimating = false;
      }
    }, 300);
  }

  reset() {
    this.currentIndex = 0;
    this.isAnimating = false;
    this.updateStackPositions();
  }

  setupButtonListeners() {
    this.btnSwipeLeft.addEventListener('click', () => this.dismissCard('left'));
    this.btnSwipeRight.addEventListener('click', () => this.dismissCard('right'));

    // Keyboard support on Desktop
    document.addEventListener('keydown', (e) => {
      const slideshowScreen = document.getElementById('screen-slideshow');
      if (slideshowScreen && slideshowScreen.classList.contains('active')) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          this.dismissCard('right');
        } else if (e.key === 'ArrowLeft') {
          this.dismissCard('left');
        }
      }
    });
  }
}


/* ==========================================================================
   APP STATE MANAGEMENT & MAIN CONTROLLER
   ========================================================================== */
class BirthdayApp {
  constructor() {
    this.dom = {
      // Screens
      screenWelcome: document.getElementById('screen-welcome'),
      screenSlideshow: document.getElementById('screen-slideshow'),
      screenFinal: document.getElementById('screen-final'),
      
      // Welcome Screen Elements
      penguinMascot: document.getElementById('penguin-mascot'),
      penguinBubble: document.getElementById('penguin-bubble'),
      bubbleText: document.getElementById('bubble-text'),
      welcomeActions: document.getElementById('welcome-actions'),
      btnYes: document.getElementById('btn-yes'),
      btnNo: document.getElementById('btn-no'),
      recoverArea: document.getElementById('recover-area'),
      btnRecover: document.getElementById('btn-recover'),
      
      // Gift Overlay
      giftOverlay: document.getElementById('gift-overlay'),
      giftBox: document.getElementById('animated-gift-box'),
      giftStatusText: document.getElementById('gift-status-text'),
      
      // Final Screen Elements
      finalMessageText: document.getElementById('final-message-text'),
      btnConfettiMore: document.getElementById('btn-confetti-more'),
      btnReplay: document.getElementById('btn-replay')
    };

    // Background Music Audio Engine
    this.bgMusic = document.getElementById('bg-music');
    this.isMusicPlaying = false;

    this.confetti = new ConfettiEffect('confetti-canvas');
    this.stackManager = new CardStackManager('card-stack', () => this.handleStackCompleted(), sfx);
  }

  init() {
    this.setupConfig();
    this.setupEventListeners();
    this.stackManager.init();
  }

  setupConfig() {
    this.dom.finalMessageText.textContent = CONFIG.finalMessage;
  }

  setupEventListeners() {
    // Welcome Screen: YES
    this.dom.btnYes.addEventListener('click', () => this.handleYesClick());

    // Welcome Screen: NO
    this.dom.btnNo.addEventListener('click', () => this.handleNoClick());

    // Welcome Screen: RECOVER ("TAP HERE")
    this.dom.btnRecover.addEventListener('click', () => this.handleRecoverClick());

    // Final Screen Actions
    this.dom.btnConfettiMore.addEventListener('click', () => {
      sfx.playFanfare();
      this.confetti.burst(85, 0.4);
    });

    this.dom.btnReplay.addEventListener('click', () => this.replaySurprise());
  }

  /* ==========================================================================
     MUSIC CONTROLLER (FADE-IN & LOOPING TO 70% VOLUME)
     ========================================================================== */
  playMusicWithFade(targetVolume = 0.70, durationMs = 2600) {
    if (!this.bgMusic) return;
    this.bgMusic.loop = true;

    // Start playback if paused
    if (!this.isMusicPlaying || this.bgMusic.paused) {
      try {
        this.bgMusic.volume = 0;
      } catch (e) {}

      const playPromise = this.bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isMusicPlaying = true;

          const startTime = performance.now();
          const fadeStep = (now) => {
            if (!this.isMusicPlaying) return;
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / durationMs);
            try {
              this.bgMusic.volume = progress * targetVolume;
            } catch (e) {}
            if (progress < 1) {
              requestAnimationFrame(fadeStep);
            }
          };
          requestAnimationFrame(fadeStep);
        }).catch(err => {
          console.log("Audio autoplay prevented:", err);
        });
      }
    }
  }

  /* ==========================================================================
     INTERACTIONS: YES / NO / RECOVER FLOW
     ========================================================================== */
  handleYesClick() {
    sfx.playHappyChime();
    
    // Fade in background music automatically on YES!
    this.playMusicWithFade();

    // 1. Penguin jumps excitedly with joyful eyes
    this.dom.penguinMascot.classList.remove('sad');
    this.dom.penguinMascot.classList.add('excited');
    this.dom.penguinMascot.classList.add('state-happy');
    this.dom.screenWelcome.classList.remove('dimmed');

    // 2. Speech bubble celebration
    this.dom.bubbleText.textContent = "YAYYYYY!! 💕🐧";

    // 3. Confetti burst
    this.confetti.burst(35, 0.6);

    // 4. Disable buttons during transition
    this.dom.btnYes.disabled = true;
    this.dom.btnNo.disabled = true;

    // 5. Short transition into gift opening (0.9s)
    setTimeout(() => {
      this.triggerGiftOpening();
    }, 950);
  }

  handleNoClick() {
    sfx.playSadChime();

    // 1. Penguin gets sad with crying tears and gentle shiver
    this.dom.penguinMascot.classList.remove('excited');
    this.dom.penguinMascot.classList.add('sad');
    this.dom.penguinMascot.classList.remove('state-happy');
    this.dom.penguinMascot.classList.add('state-sad');
    this.dom.screenWelcome.classList.add('dimmed');

    // 2. Speech bubble update
    this.dom.bubbleText.textContent = "Oh... 🥺";

    // 3. Hide initial buttons, show prominent TAP HERE recover area
    this.dom.welcomeActions.style.display = 'none';
    this.dom.recoverArea.style.display = 'flex';
  }

  handleRecoverClick() {
    sfx.playPop();

    // Fade in background music automatically on TAP HERE!
    this.playMusicWithFade();

    // 1. Penguin becomes happy again
    this.dom.penguinMascot.classList.remove('sad');
    this.dom.penguinMascot.classList.remove('state-sad');
    this.dom.penguinMascot.classList.add('excited');
    this.dom.penguinMascot.classList.add('state-happy');
    this.dom.screenWelcome.classList.remove('dimmed');

    // 2. Speech bubble cheerful response
    this.dom.bubbleText.textContent = "I knew you'd want it!! 💗🐧";

    // 3. Confetti burst
    this.confetti.burst(35, 0.6);

    // 4. Disable button
    this.dom.btnRecover.disabled = true;

    // 5. Transition into gift opening
    setTimeout(() => {
      this.triggerGiftOpening();
    }, 950);
  }

  /* ==========================================================================
     GIFT OPENING ANIMATION & TRANSITION TO CARD STACK
     ========================================================================== */
  triggerGiftOpening() {
    sfx.playFanfare();

    this.dom.giftOverlay.classList.add('active');
    this.dom.giftBox.classList.add('shake');

    // Pop open the box
    setTimeout(() => {
      this.dom.giftBox.classList.remove('shake');
      this.dom.giftBox.classList.add('opened');
      this.dom.giftStatusText.textContent = "Surprise for Naina! 💖";
      this.confetti.burst(65, 0.5);

      // Transition smoothly into card stack screen
      setTimeout(() => {
        // Activate slideshow underneath BEFORE fading overlay to eliminate background flicker
        this.switchToScreen('slideshow');
        this.dom.giftOverlay.classList.remove('active');
      }, 700);

    }, 750);
  }

  /* ==========================================================================
     TRIGGERED WHEN ALL 11 CARDS ARE SLID / SWIPED
     ========================================================================== */
  handleStackCompleted() {
    sfx.playFanfare();
    this.confetti.burst(80, 0.45);

    setTimeout(() => {
      this.switchToScreen('final');
      // Extra celebration confetti shower on the quote screen!
      setTimeout(() => {
        this.confetti.burst(60, 0.35);
      }, 400);
    }, 350);
  }

  replaySurprise() {
    sfx.playPop();

    // Reset Welcome Screen state
    this.dom.welcomeActions.style.display = 'flex';
    this.dom.recoverArea.style.display = 'none';
    this.dom.btnYes.disabled = false;
    this.dom.btnNo.disabled = false;
    this.dom.btnRecover.disabled = false;
    
    // Reset Penguin Mascot
    this.dom.penguinMascot.className = 'penguin-wrapper';
    this.dom.screenWelcome.classList.remove('dimmed');
    this.dom.bubbleText.textContent = "Hi Naina! I have something special for you! 🎂";

    // Reset Gift Box & Overlay
    this.dom.giftBox.className = 'gift-box';
    this.dom.giftStatusText.textContent = "Opening your surprise... ✨";
    this.dom.giftOverlay.classList.remove('active');

    // Reset the card stack
    this.stackManager.reset();

    // Switch back to welcome screen
    this.switchToScreen('welcome');
  }

  switchToScreen(screenName) {
    this.dom.screenWelcome.classList.remove('active');
    this.dom.screenSlideshow.classList.remove('active');
    this.dom.screenFinal.classList.remove('active');

    if (screenName === 'welcome') {
      this.dom.screenWelcome.classList.add('active');
    } else if (screenName === 'slideshow') {
      this.dom.screenSlideshow.classList.add('active');
    } else if (screenName === 'final') {
      this.dom.screenFinal.classList.add('active');
    }
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new BirthdayApp();
  app.init();
});
