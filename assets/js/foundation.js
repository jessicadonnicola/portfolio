// foundation.js — M2 "Atmosphere & Motion"
// 1) Theme engine: transizione UNICA e morbida al confine di sezione (niente scrub → niente sfarfallio)
// 2) Reveal system: contenuti che fluttuano dentro entrando nel viewport (stile dverso)
// 3) Hero glow orb: luce sfocata che reagisce al mouse
// 4) Process line: linea che si disegna con lo scroll
// 5) Cornice, menu interim, cursor orb
//
// Richiede PRIMA: gsap.min.js + ScrollTrigger.min.js (CDN)

(() => {
  'use strict';

  // Forziamo il browser a non ricordare la posizione dello scroll al refresh
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH = window.matchMedia('(pointer: coarse)').matches;

  // ── PALETTE EDITORIALE "CONCRETE PRESS" ────────────────────────────────
  // Due soli mood, alternati sezione per sezione via [data-theme]:
  // "paper" (carta cemento calda, inchiostro scuro) <-> "ink" (antracite, carta chiara)
  // Valori derivati 1:1 dagli oklch del design system (convertiti in hex per GSAP).
  const THEMES = {
    paper: {
      '--bg': '#EDE9E1', '--fg': '#18130E', '--accent': '#E74F00', '--surface': '#F6F3EC',
      '--hairline': 'rgba(24, 19, 14, 0.18)', '--concrete': '#D8D4CA', '--muted-fg': '#5A544E',
    },
    ink: {
      '--bg': '#100D09', '--fg': '#E9E4DA', '--accent': '#F46622', '--surface': '#1E1A15',
      '--hairline': 'rgba(233, 228, 218, 0.16)', '--concrete': '#2D2823', '--muted-fg': '#9C9890',
    },
  };

  function initThemeEngine() {
    const sections = gsap.utils.toArray('section[data-theme], footer[data-theme]');
    if (!sections.length) return;

    const root = document.documentElement;
    const themeOf = (el) => THEMES[el.dataset.theme] || THEMES.ink;

    // Forza il tema iniziale corretto al volo prima di fare qualsiasi cosa
    gsap.set(root, themeOf(sections[0]));

    const apply = (section) => {
      gsap.to(root, {
        ...themeOf(section),
        duration: REDUCED ? 0 : 0.7, // Più reattivo, evita sfarfallii lunghi
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    };

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => apply(section),
        onEnterBack: () => apply(section),
      });
    });
  }

  function initReveals() {
    const singles = gsap.utils.toArray('[data-reveal]');
    const groups = gsap.utils.toArray('[data-reveal-group]');

    if (REDUCED) {
      gsap.set(singles, { opacity: 1 });
      groups.forEach((g) => gsap.set(g.children, { opacity: 1 }));
      return;
    }

    // Effetto di ascesa con leggera prospettiva
    const FROM = { opacity: 0, y: 70, rotationX: 5, scale: 0.97, filter: 'blur(8px)' };
    const TO = {
      opacity: 1,
      y: 0,
      rotationX: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.4,
      ease: 'expo.out', // easing molto lungo e morbido
      clearProps: 'filter,transformOrigin'
    };

    singles.forEach((el) => {
      gsap.fromTo(el, FROM, {
        ...TO,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    groups.forEach((group) => {
      gsap.fromTo(group.children, FROM, {
        ...TO,
        stagger: 0.12, // Ritardo tra gli elementi interni per effetto a cascata
        scrollTrigger: { trigger: group, start: 'top 82%', once: true },
      });
    });
  }

  // ── PARALLAX IMMAGINI (Novità dinamica) ──
  function initParallax() {
    if (REDUCED || TOUCH) return;
    
    const images = gsap.utils.toArray('.project-img, .img-cover');
    images.forEach(img => {
      // Assicurati che l'elemento genitore abbia overflow:hidden via CSS
      gsap.fromTo(img, 
        { yPercent: -5, scale: 1.1 }, 
        {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true // Lega il movimento allo scroll del mouse
          }
        }
      );
    });
  }

  // ── HERO: apparizione fluida del messaggio (title, cta, filetti editoriali) ──
  // Nota: la vecchia versione richiedeva .hero-letter/.hero-circle (la parola
  // gigante che si frattura), markup oggi commentato in HTML — la funzione
  // usciva subito senza animare nulla. Questa versione lavora sugli elementi
  // realmente presenti in pagina: appare al caricamento (l'Hero è la prima
  // cosa visibile) e riparte anche quando si torna su con lo scroll.
  function initHeroFracture() {
    const stage = document.getElementById('hero-stage');
    const graphics = gsap.utils.toArray('#hero-stage .hero-graphic');
    const message = document.querySelector('#hero-stage .hero-message');
    const msgItems = gsap.utils.toArray('#hero-stage [data-hero-reveal]');
    if (!stage || !message || !msgItems.length) return;

    if (REDUCED) {
      gsap.set(graphics, { autoAlpha: 1 });
      gsap.set(message, { autoAlpha: 1 });
      gsap.set(msgItems, { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
      return;
    }

    gsap.set(message, { autoAlpha: 1 });
    gsap.set(graphics, { autoAlpha: 0 });
    gsap.set(msgItems, { autoAlpha: 0, y: 36, filter: 'blur(10px)' });

    const play = () => {
      gsap.to(graphics, { autoAlpha: 1, stagger: 0.08, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(msgItems, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.1,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'filter',
        overwrite: 'auto',
      });
    };

    const reset = () => {
      gsap.set(graphics, { autoAlpha: 0 });
      gsap.set(msgItems, { autoAlpha: 0, y: 36, filter: 'blur(10px)' });
    };

    // Riparte ogni volta che l'Hero rientra nel viewport (anche risalendo con
    // lo scroll), non solo la prima volta: al caricamento parte subito perché
    // l'Hero è già "dentro" la zona attiva del trigger fin dal primo frame.
    ScrollTrigger.create({
      trigger: stage,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: play,
      onEnterBack: play,
      onLeave: reset,
      onLeaveBack: reset,
    });
  }

  // ── ORB AMBIENTALE (segue il mouse su tutta la pagina) ────────
  function initAmbientGlow() {
    const orb = document.querySelector('.ambient-glow__orb');
    if (!orb || REDUCED || TOUCH) return;

    const qx = gsap.quickTo(orb, 'x', { duration: 1.6, ease: 'power2.out' });
    const qy = gsap.quickTo(orb, 'y', { duration: 1.6, ease: 'power2.out' });

    window.addEventListener('mousemove', (e) => {
      qx(e.clientX - window.innerWidth / 2);
      qy(e.clientY - window.innerHeight / 2);
    }, { passive: true });
  }

  // ── PROCESS: carosello verbale pinnato (porting 1:1 di Process.tsx) ──
  function initProcessCarousel() {
    const stage = document.getElementById('process-stage');
    const track = document.getElementById('process-track');
    const verbs = gsap.utils.toArray('#process-track .process-verb');
    const noteEl = document.getElementById('process-note');
    const tagsEl = document.getElementById('process-tags');
    const indexEl = document.getElementById('process-index');
    if (!stage || !track || !verbs.length) return;

    const n = verbs.length;
    let rowH = 0;
    let startY = 0;
    let endY = 0;
    let current = -1;

    const measure = () => {
      rowH = track.scrollHeight / n;
      const center = window.innerHeight / 2;
      startY = center - rowH / 2;          // centra la riga 0
      endY = center - rowH * (n - 0.5);    // centra l'ultima riga
    };
    measure();
    gsap.set(track, { y: startY });

    if (REDUCED) {
      gsap.set(verbs, { opacity: 1, scale: 1 });
      return;
    }

    const paint = (progress) => {
      const active = progress * (n - 1);
      verbs.forEach((v, i) => {
        const d = Math.abs(i - active);
        const opacity = gsap.utils.clamp(0.08, 1, 1 - d * 0.62);
        const scale = gsap.utils.clamp(0.82, 1, 1 - d * 0.09);
        gsap.set(v, { opacity, scale });
      });

      const idx = Math.round(active);
      if (idx !== current) {
        current = idx;
        const verb = verbs[idx];
        gsap.to([noteEl, tagsEl, indexEl], {
          autoAlpha: 0,
          duration: 0.2,
          onComplete: () => {
            if (noteEl) noteEl.textContent = verb.dataset.note || '';
            if (tagsEl) tagsEl.textContent = verb.dataset.tags || '';
            if (indexEl) indexEl.textContent = `0${idx + 1} / 0${n}`;
            gsap.to([noteEl, tagsEl, indexEl], { autoAlpha: 1, duration: 0.35 });
          },
        });
      }
    };

    const reposition = (progress) => {
      gsap.set(track, { y: gsap.utils.interpolate(startY, endY, progress) });
      paint(progress);
    };

    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: '+=320%',
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      onRefresh: (self) => {
        // Fondamentale dopo un resize: rimisura E riposiziona SUBITO la track
        // sul progresso corrente, coi nuovi startY/endY. Senza questo la track
        // restava "congelata" nella posizione calcolata coi valori vecchi,
        // finché non si scrollava di nuovo — da qui il comportamento anomalo.
        measure();
        reposition(self.progress);
      },
      onUpdate: (self) => reposition(self.progress),
    });

    paint(0);
  }

  // ── WORKS: indice editoriale con preview fluttuante (porting 1:1 di Works.tsx) ──
  // Desktop (pointer fine): una preview fluttuante segue il cursore e mostra
  // l'immagine del progetto sotto hover, con crossfade tra le immagini.
  // Touch (pointer coarse): ogni riga si espande inline mostrando la preview,
  // una sola aperta alla volta.
  function initWorksIndex() {
    const preview = document.getElementById('works-preview');
    const list = document.getElementById('works-list');
    if (!list) return;

    const rows = gsap.utils.toArray(list.querySelectorAll('[data-row]'));
    if (!rows.length) return;

    if (TOUCH) {
      return;
    }

    if (!preview) return;
    const previewImgs = gsap.utils.toArray(preview.querySelectorAll('.works-preview-img'));

    gsap.set(preview, { autoAlpha: 0, scale: 0.94, xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3.out' });

    let current = -1;

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onEnter = (i) => {
      if (i !== current) {
        previewImgs.forEach((img, k) => {
          img.classList.toggle('is-active', k === i);
        });
        current = i;
      }
      gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
    };

    const onLeave = () => {
      gsap.to(preview, { autoAlpha: 0, scale: 0.94, duration: 0.4, ease: 'power3.out' });
    };

    rows.forEach((row, i) => {
      row.addEventListener('mouseenter', () => onEnter(i));
    });
    list.addEventListener('mousemove', onMove);
    list.addEventListener('mouseleave', onLeave);
  }

  // ── CORNICE: swap scroll-cue / social ────────────────────────
  function initFrame() {
    const onScroll = () => {
      document.body.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  


  // ── MAGNETIC HOVER ───────────────────────────────────────────
  // Porting di useMagnetic (Lovable): l'elemento segue leggermente il
  // cursore mentre ci passi sopra (forza diversa per tipo di elemento),
  // e torna dolcemente al centro quando esci. Disattivo su touch/reduced-motion.
  function initMagnetic(selector, strength) {
    if (REDUCED || TOUCH) return;
    const els = gsap.utils.toArray(selector);

    els.forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
      });

      el.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  // ── CURSOR ORB ───────────────────────────────────────────────
  function initCursorOrb() {
    if (REDUCED || TOUCH) return;

    const orb = document.createElement('div');
    orb.className = 'cursor-orb';
    document.body.appendChild(orb);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    const EASE = 0.12;

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      orb.classList.add('is-active');
    }, { passive: true });

    document.addEventListener('mouseleave', () => orb.classList.remove('is-active'));

    document.addEventListener('mouseover', (e) => {
      const interactive = e.target.closest('a, button, .reason-tag, input, textarea, label');
      orb.classList.toggle('is-hover', Boolean(interactive));
    });

    (function loop() {
      x += (tx - x) * EASE;
      y += (ty - y) * EASE;
      orb.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(loop);
    })();
  }

 document.addEventListener('DOMContentLoaded', () => {
    // Forziamo ulteriore reset immediato prima del calcolo di ScrollTrigger
    window.scrollTo(0, 0);
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.documentElement.classList.remove('js');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Ogni init è isolato: se una funzione va in errore, non deve bloccare
    // silenziosamente tutte quelle elencate dopo (es. initReveals non partirebbe
    // mai se initThemeEngine, chiamata prima, lanciasse un'eccezione).
    const inits = [
      initThemeEngine,
      initReveals,
      initParallax,
      initAmbientGlow,
      initHeroFracture,
      initProcessCarousel,
      initFrame,
      initCursorOrb,
      initWorksIndex,
    ];

    inits.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error(`[foundation.js] ${fn.name} è fallita:`, err);
      }
    });

    try {
      initMagnetic('.hero-cta, .contact-cta-btn', 0.4);
    } catch (err) {
      console.error('[foundation.js] initMagnetic è fallita:', err);
    }

    // Rinfresca ScrollTrigger dopo aver posizionato tutto per evitare calcoli errati
    ScrollTrigger.refresh();

    // Le immagini (works, about, hero...) caricano in modo asincrono e possono
    // spostare leggermente il layout DOPO il primo refresh: se questo accade,
    // le soglie di trigger calcolate in anticipo restano sballate e i reveal
    // sembrano "non partire". Un secondo refresh a caricamento completo
    // ricalcola tutte le posizioni sui layout definitivi.
    window.addEventListener('load', () => ScrollTrigger.refresh());

    // Refresh esplicito (con debounce) al ridimensionamento della finestra:
    // GSAP lo fa già in automatico, ma qui forziamo comunque il ricalcolo per
    // sicurezza, così ogni trigger (incluso il carosello di Process) si
    // riallinea subito ai nuovi valori invece di restare in uno stato sballato.
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
  });



  // ── FIX CHIUSURA CASE STUDY E SCROLL ──
document.addEventListener('DOMContentLoaded', () => {
  const closeLinks = document.querySelectorAll('.cs-close');

  closeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // 1. Impedisce al browser di saltare all'inizio
      e.preventDefault();

      // 2. Esegui la tua logica di chiusura qui
      // (Se la chiusura richiede una classe, mettila qui)
      const modal = document.querySelector('.cs-modal'); // Cambia con la tua classe
      if (modal) modal.classList.remove('is-active');

      // 3. Usa GSAP per scrollare fluidamente alla sezione corretta
      // Assicurati di puntare correttamente all'id "#works"
      const target = document.querySelector('#works');
      if (target) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 0 },
          ease: 'power2.inOut'
        });
      }
    });
  });
});

})();
document.documentElement.classList.add('js');