/* ═══════════════════════════════════════════════════════════════
   HEMANTH BIRTHDAY SURPRISE — JAVASCRIPT
   All interactivity: intro, confetti, counters, reveals, 
   lightbox, cake, music, particles
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ────────────────────────────────────────────
    // DOM ELEMENTS
    // ────────────────────────────────────────────
    const introScreen = document.getElementById('intro-screen');
    const openBtn = document.getElementById('open-surprise-btn');
    const mainSite = document.getElementById('main-site');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const ctx = confettiCanvas.getContext('2d');

    // ────────────────────────────────────────────
    // INTRO PARTICLES
    // ────────────────────────────────────────────
    function createIntroParticles() {
        const container = document.getElementById('intro-particles');
        const colors = ['#a78bfa', '#f472b6', '#38bdf8', '#fbbf24', '#fb923c'];
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'intro-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 6 + 's';
            p.style.animationDuration = (4 + Math.random() * 4) + 's';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.width = (2 + Math.random() * 4) + 'px';
            p.style.height = p.style.width;
            container.appendChild(p);
        }
    }
    createIntroParticles();

    // ────────────────────────────────────────────
    // FLOATING BACKGROUND PARTICLES
    // ────────────────────────────────────────────
    function createFloatingParticles() {
        const container = document.getElementById('floating-particles');
        if (!container) return;
        const colors = ['#a78bfa', '#f472b6', '#38bdf8', '#fbbf24'];
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'floating-particle';
            const size = 100 + Math.random() * 300;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;
            p.style.animationDelay = Math.random() * 20 + 's';
            p.style.animationDuration = (15 + Math.random() * 15) + 's';
            container.appendChild(p);
        }
    }

    // ────────────────────────────────────────────
    // CONFETTI ENGINE
    // ────────────────────────────────────────────
    let confettiPieces = [];
    let confettiRunning = false;

    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function createConfettiPiece() {
        const colors = ['#a78bfa', '#f472b6', '#38bdf8', '#fbbf24', '#fb923c', '#34d399', '#f43f5e', '#818cf8'];
        return {
            x: Math.random() * confettiCanvas.width,
            y: -20,
            w: 6 + Math.random() * 8,
            h: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            speedY: 2 + Math.random() * 4,
            speedX: (Math.random() - 0.5) * 3,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.03 + Math.random() * 0.05,
            opacity: 1
        };
    }

    function launchConfetti(duration = 4000) {
        confettiRunning = true;
        const startTime = Date.now();

        function spawnBatch() {
            if (Date.now() - startTime < duration) {
                for (let i = 0; i < 5; i++) {
                    confettiPieces.push(createConfettiPiece());
                }
                requestAnimationFrame(spawnBatch);
            } else {
                confettiRunning = false;
            }
        }
        spawnBatch();
        animateConfetti();
    }

    function animateConfetti() {
        if (confettiPieces.length === 0) return;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        confettiPieces.forEach((p, i) => {
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.wobble) * 0.5;
            p.wobble += p.wobbleSpeed;
            p.rotation += p.rotSpeed;

            if (p.y > confettiCanvas.height) {
                p.opacity -= 0.02;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        confettiPieces = confettiPieces.filter(p => p.opacity > 0);

        if (confettiPieces.length > 0 || confettiRunning) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }

    // ────────────────────────────────────────────
    // OPEN SURPRISE BUTTON
    // ────────────────────────────────────────────
    openBtn.addEventListener('click', () => {
        introScreen.classList.add('fade-out');
        mainSite.classList.remove('hidden');
        createFloatingParticles();

        setTimeout(() => {
            launchConfetti(5000);
        }, 300);

        setTimeout(() => {
            introScreen.style.display = 'none';
            initCounters();
            initRevealAnimations();
        }, 800);
    });

    // ────────────────────────────────────────────
    // SCROLL REVEAL ANIMATIONS
    // ────────────────────────────────────────────
    function initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    }

    // ────────────────────────────────────────────
    // ANIMATED COUNTERS
    // ────────────────────────────────────────────
    function initCounters() {
        // Dynamically calculate days and years so it increases automatically
        const startDate = new Date('2012-10-06T00:00:00'); // 14 years ago from original date
        const now = new Date();
        const diffTime = Math.abs(now - startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Calculate exact years difference
        let diffYears = now.getFullYear() - startDate.getFullYear();
        if (now.getMonth() < startDate.getMonth() || (now.getMonth() === startDate.getMonth() && now.getDate() < startDate.getDate())) {
            diffYears--;
        }

        const yearsCard = document.getElementById('years-card');
        const daysCard = document.getElementById('days-card');
        
        if (yearsCard) yearsCard.dataset.count = diffYears;
        if (daysCard) daysCard.dataset.count = diffDays;

        const counterCards = document.querySelectorAll('.counter-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const target = parseInt(card.dataset.count);
                    const numberEl = card.querySelector('.counter-number');
                    animateCounter(numberEl, target);
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.5 });

        counterCards.forEach(card => observer.observe(card));
    }

    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = Date.now();

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        update();
    }

    // ────────────────────────────────────────────
    // PHOTO GALLERY LIGHTBOX
    // ────────────────────────────────────────────
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // ────────────────────────────────────────────
    // INTERACTIVE CAKE
    // ────────────────────────────────────────────
    const cakeContainer = document.getElementById('cake-container');
    const cakeInstruction = document.getElementById('cake-instruction');
    const cakeWish = document.getElementById('cake-wish');
    let candlesBlown = false;

    cakeContainer.addEventListener('click', () => {
        if (candlesBlown) return;
        candlesBlown = true;

        const candles = document.querySelectorAll('.candle');
        candles.forEach((candle, i) => {
            setTimeout(() => {
                candle.classList.remove('lit');
                // Smoke effect
                const smoke = document.createElement('div');
                smoke.style.cssText = `
                    position: absolute;
                    top: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(200, 200, 200, 0.5);
                    animation: smokeRise 1s forwards;
                    pointer-events: none;
                `;
                candle.appendChild(smoke);
            }, i * 200);
        });

        // Add smoke keyframe if not exists
        if (!document.getElementById('smoke-style')) {
            const style = document.createElement('style');
            style.id = 'smoke-style';
            style.textContent = `
                @keyframes smokeRise {
                    0% { opacity: 0.8; transform: translateX(-50%) translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-40px) scale(3); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            cakeInstruction.classList.add('hidden');
            cakeWish.classList.remove('hidden');
            launchConfetti(3000);
            playBirthdaySong();
        }, 1200);
    });

    // ────────────────────────────────────────────
    // MUSIC (Birthday Tune via Web Audio)
    // ────────────────────────────────────────────
    let audioCtx = null;

    // Happy Birthday melody (simplified)
    const melody = [
        { note: 'C4', dur: 0.3 }, { note: 'C4', dur: 0.3 }, { note: 'D4', dur: 0.6 },
        { note: 'C4', dur: 0.6 }, { note: 'F4', dur: 0.6 }, { note: 'E4', dur: 1.2 },
        { note: 'C4', dur: 0.3 }, { note: 'C4', dur: 0.3 }, { note: 'D4', dur: 0.6 },
        { note: 'C4', dur: 0.6 }, { note: 'G4', dur: 0.6 }, { note: 'F4', dur: 1.2 },
        { note: 'C4', dur: 0.3 }, { note: 'C4', dur: 0.3 }, { note: 'C5', dur: 0.6 },
        { note: 'A4', dur: 0.6 }, { note: 'F4', dur: 0.6 }, { note: 'E4', dur: 0.6 }, { note: 'D4', dur: 1.2 },
        { note: 'Bb4', dur: 0.3 }, { note: 'Bb4', dur: 0.3 }, { note: 'A4', dur: 0.6 },
        { note: 'F4', dur: 0.6 }, { note: 'G4', dur: 0.6 }, { note: 'F4', dur: 1.2 },
    ];

    const noteFreqs = {
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
        'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'C5': 523.25
    };

    function playNote(freq, startTime, duration) {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(2.0, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    function playBirthdaySong() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Stop music after exactly 30 seconds
            setTimeout(() => {
                if (audioCtx) {
                    audioCtx.close().then(() => { audioCtx = null; });
                }
            }, 30000);
        }

        let time = audioCtx.currentTime + 0.1;
        melody.forEach(({ note, dur }) => {
            playNote(noteFreqs[note], time, dur);
            time += dur;
        });

        // Repeat the melody
        const totalDuration = melody.reduce((sum, n) => sum + n.dur, 0);
        setTimeout(() => {
            if (audioCtx && audioCtx.state !== 'closed') {
                playBirthdaySong();
            }
        }, totalDuration * 1000 + 500);
    }

    // ────────────────────────────────────────────
    // PARALLAX ON HERO IMAGE (subtle)
    // ────────────────────────────────────────────
    const heroPhoto = document.getElementById('hero-photo');
    if (heroPhoto) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            heroPhoto.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // ────────────────────────────────────────────
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
