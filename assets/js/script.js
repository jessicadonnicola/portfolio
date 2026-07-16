// script.js — Pulito, Ottimizzato e Integrato

// 1. ── EMAILJS INITIALIZATION ──
(function () {
  if (typeof emailjs === 'undefined') return;
  emailjs.init({ publicKey: 'Z0r20YlEb2aWizdzc' });
})();


document.addEventListener('DOMContentLoaded', () => {

  // 2. ── GESTIONE FORM CONTATTI ──
  const form = document.getElementById('contact-form');
  if (form && typeof emailjs !== 'undefined') {
    const messageDisplay = document.getElementById('form-message');
    const submitButton = document.getElementById('submit-button');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
      messageDisplay.style.display = 'none';

      emailjs.sendForm('service_3y532vq', 'template_mi319rm', this)
        .then(function () {
          messageDisplay.textContent = 'Messaggio inviato con successo! Ti risponderò al più presto.';
          messageDisplay.className = 'mt-3 text-center alert alert-success d-block';
          form.reset();
        }, function (error) {
          console.error('EmailJS Error:', error);
          messageDisplay.textContent = "Errore nell'invio del messaggio. Riprova più tardi oppure contattami a donnicolajessica@gmail.com";
          messageDisplay.className = 'mt-3 text-center alert alert-danger d-block';
        })
        .finally(function () {
          submitButton.disabled = false;
          submitButton.textContent = 'Send it →';
        });
    });
  }

  // 3. ── MENU FULLSCREEN ──
  const menuToggle = document.querySelector('.menu-toggle');
  const siteMenu = document.querySelector('#site-menu');
  const menuItems = document.querySelectorAll('.menu-item');
  const menuFooter = document.querySelector('.menu-footer');
  let isMenuOpen = false;

  if (menuToggle && siteMenu) {
    const menuTimeline = gsap.timeline({ paused: true, reversed: true });
    menuTimeline
      .to(siteMenu, { opacity: 1, duration: 0.6, ease: "power2.inOut" })
      .fromTo(menuItems, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out" },
        "-=0.3"
      )
      .fromTo(menuFooter,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.5"
      );

    menuToggle.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        document.body.classList.add('menu-is-open');
        menuToggle.textContent = 'Close';
        menuToggle.setAttribute('aria-expanded', 'true');
        siteMenu.setAttribute('aria-hidden', 'false');
        menuTimeline.play();
      } else {
        menuTimeline.reverse().then(() => {
          document.body.classList.remove('menu-is-open');
          menuToggle.textContent = 'Menu';
          menuToggle.setAttribute('aria-expanded', 'false');
          siteMenu.setAttribute('aria-hidden', 'true');
        });
      }
    });

    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        if(isMenuOpen) menuToggle.click();
      });
    });
  }


  // 4. ── EFFETTO MONOLOG (I contenuti si alzano mentre scrolli la pagina) ──
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Prendiamo i contenitori interni di ogni sezione principale
    const sezioniParallax = gsap.utils.toArray('section.section-block .custom-container');
    
    sezioniParallax.forEach((container) => {
      // Il contenitore parte 60px più in basso e finisce 60px più in alto rispetto al suo centro
      gsap.fromTo(container, 
        { y: 60 }, 
        {
          y: -60,
          ease: "none", 
          scrollTrigger: {
            trigger: container.parentElement, // Triggeriamo in base alla sezione che lo contiene
            start: "top bottom",              // Quando la sezione entra dal basso
            end: "bottom top",                // Quando la sezione esce dall'alto
            scrub: 1                          // Ritardo di 1 secondo per renderlo "burroso"
          }
        }
      );
    });
  }


  // 5. ── SOUND MANAGER + POPUP CONTATTI (LOGICA UNIFICATA) ──
  const audioFiles = {
  ambient: new Audio('assets/audio/ambient-loop.mp3'),
  // hover: new Audio('assets/audio/hover-ui.mp3'), // Rimosso: file non più utilizzato
  click: new Audio('assets/audio/click-ui.mp3'),
  contact: new Audio('assets/audio/contact-jazz.mp3')
};

audioFiles.ambient.loop = true;
audioFiles.ambient.volume = 0.9; 
audioFiles.contact.loop = true;
audioFiles.contact.volume = 0; // Il jazz parte muto

// audioFiles.hover.volume = 0.8; // Rimosso: gestione volume hover non necessaria
audioFiles.click.volume = 0.9;

let isMuted = false;
let audioUnlocked = false; 

const soundToggle = document.getElementById('sound-toggle');
const soundStatusText = document.getElementById('sound-status-text');

function unlockAndPlay() {
  if (audioUnlocked || isMuted) return;
  audioUnlocked = true;
  audioFiles.ambient.play().catch(() => { audioUnlocked = false; });
  audioFiles.contact.play().catch(() => {});
}

function toggleMasterMute() {
  isMuted = !isMuted;
  if (isMuted) {
    if (soundToggle) soundToggle.classList.remove('is-playing');
    if (soundToggle) soundToggle.setAttribute('aria-pressed', 'false');
    if (soundStatusText) soundStatusText.textContent = '[ AUDIO OFF ]';

    gsap.to([audioFiles.ambient, audioFiles.contact], { 
      volume: 0, 
      duration: 0.4,
      onComplete: () => {
        audioFiles.ambient.pause();
        audioFiles.contact.pause();
      }
    });
  } else {
    if (soundToggle) soundToggle.classList.add('is-playing');
    if (soundToggle) soundToggle.setAttribute('aria-pressed', 'true');
    if (soundStatusText) soundStatusText.textContent = '[ AUDIO ON ]';
    
    audioUnlocked = false; 
    unlockAndPlay(); 

    // Ripristina l'audio giusto a seconda se il popup è aperto o meno
    const isPopupOpen = document.getElementById('contact-modal')?.classList.contains('is-active');
    if (isPopupOpen) {
      gsap.to(audioFiles.ambient, { volume: 0, duration: 0.6 });
      gsap.to(audioFiles.contact, { volume: 0.15, duration: 0.6 });
    } else {
      gsap.to(audioFiles.ambient, { volume: 0.9, duration: 0.6 });
      gsap.to(audioFiles.contact, { volume: 0, duration: 0.6 });
    }
  }
}

if (soundToggle) {
  soundToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMasterMute();
  });
}

document.addEventListener('click', () => {
  if (!audioUnlocked && !isMuted) unlockAndPlay();
}, { once: true });

// Suoni UI (SOLO CLICK)
document.querySelectorAll('a, button, input, textarea, .menu-item').forEach(el => {
  if (el.id === 'sound-toggle' || el.closest('#sound-toggle')) return;
  
  /* Rimosso EventListener mouseenter per hover-ui.mp3:
    el.addEventListener('mouseenter', () => {
      if (isMuted) return;
      audioFiles.hover.currentTime = 0;
      audioFiles.hover.play().catch(() => {});
    });
  */

  el.addEventListener('click', () => {
    if (isMuted) return;
    audioFiles.click.currentTime = 0;
    audioFiles.click.play().catch(() => {});
  });
});

// 6. ── POPUP CONTATTI E CAMBIO MUSICA ──
const modal = document.getElementById('contact-modal');
const openButtons = document.querySelectorAll('a[href="#contact"], .btn-frame-cta, .trigger-contact');

if (modal) {
  const backdrop = modal.querySelector('.modal-backdrop');
  const closeButton = modal.querySelector('.modal-close');

  const openContactModal = (e) => {
    if(e) e.preventDefault();
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Sfuma l'ambiente e alza il jazz
    if (!isMuted && audioUnlocked) {
      gsap.to(audioFiles.ambient, { volume: 0, duration: 1.2, ease: 'power1.inOut' });
      gsap.to(audioFiles.contact, { volume: 0.15, duration: 1.2, ease: 'power1.inOut' });
    }
  };

  const closeContactModal = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = ''; 

    // Rimette l'ambiente e silenzia il jazz
    if (!isMuted && audioUnlocked) {
      gsap.to(audioFiles.ambient, { volume: 0.9, duration: 1.2, ease: 'power1.inOut' });
      gsap.to(audioFiles.contact, { volume: 0, duration: 1.2, ease: 'power1.inOut' });
    }
  };

  openButtons.forEach(btn => btn.addEventListener('click', openContactModal));
  closeButton.addEventListener('click', closeContactModal);
  backdrop.addEventListener('click', closeContactModal);
}
});