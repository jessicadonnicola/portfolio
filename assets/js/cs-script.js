
// Logica del Tab Switcher Scoped (Valido per Hero, Logo e UI)
const tabLists = document.querySelectorAll('.cs-switch-tabs');

tabLists.forEach(tabList => {
  // Trova i bottoni isolati solo all'interno di questa specifica barra di tab
  const currentTabs = tabList.querySelectorAll('.cs-switch-btn');
  
  // Trova il contenitore genitore più vicino (evita interferenze tra sezioni diverse)
  const scopeContainer = tabList.closest('.cs-hero-switcher, .cs-section');
  if (!scopeContainer) return;

  const currentPanels = scopeContainer.querySelectorAll('.cs-switch-panel');

  currentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Rimuovi attivo SOLO dai bottoni di questo specifico gruppo
      currentTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      
      // Nascondi SOLO i pannelli di questo specifico gruppo
      currentPanels.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('hidden', 'true');
      });

      // Attiva il bottone cliccato
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Mostra il pannello corrispondente cercando solo dentro questo blocco
      const targetPanelId = tab.getAttribute('aria-controls');
      const targetPanel = scopeContainer.querySelector(`#${targetPanelId}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.removeAttribute('hidden');
      }
    });
  });
});