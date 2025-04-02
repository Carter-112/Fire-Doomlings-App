// FIRE-THEMED BUTTON ANIMATIONS - Consolidated System
(() => {
  // Auto-initialization system to catch dynamically created buttons
  const buttonObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          // Check if the added node is a button or contains buttons
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'BUTTON') {
              applyAnimationsToButton(node);
            } else if (node.querySelectorAll) {
              node.querySelectorAll('button').forEach(button => {
                applyAnimationsToButton(button);
              });
            }
          }
        });
      }
    });
  });

  // Add pixelation filters once
  function addPixelationFilters() {
    if (document.getElementById('pixel-filters')) return;
    
    const svgFilters = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgFilters.id = 'pixel-filters';
    svgFilters.style.height = '0';
    svgFilters.style.width = '0';
    svgFilters.style.position = 'absolute';
    svgFilters.style.visibility = 'hidden';
    
    svgFilters.innerHTML = `
      <filter id="pixel-filter-0" x="0%" y="0%" width="100%" height="100%">
        <feFlood x="0%" y="0%" width="100%" height="100%" flood-color="transparent" result="transparent" />
        <feTile />
      </filter>
      <filter id="pixel-filter-1" x="0%" y="0%" width="100%" height="100%">
        <feFlood x="0%" y="0%" width="100%" height="100%" flood-color="transparent" result="transparent" />
        <feTile patternUnits="userSpaceOnUse" width="15" height="15" />
      </filter>
      <filter id="pixel-filter-2" x="0%" y="0%" width="100%" height="100%">
        <feFlood x="0%" y="0%" width="100%" height="100%" flood-color="transparent" result="transparent" />
        <feTile patternUnits="userSpaceOnUse" width="8" height="8" />
      </filter>
    `;
    
    document.body.appendChild(svgFilters);
  }

  // EFFECT FUNCTIONS
  function createFireRipple(event) {
    const button = event.currentTarget;
    
    const ripple = document.createElement('span');
    ripple.className = 'button-ripple';
    
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.background = 'radial-gradient(circle, rgba(255,105,0,0.6) 0%, rgba(255,60,0,0.2) 70%)';
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  function createLavaExplosion(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    for (let i = 0; i < 12; i++) {
      const lavaParticle = document.createElement('span');
      lavaParticle.className = 'lava-particle';
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 10 + Math.random() * 30;
      const x = rect.width/2 + Math.cos(angle) * 5; // Start closer to center
      const y = rect.height/2 + Math.sin(angle) * 5;
      
      lavaParticle.style.left = `${x}px`;
      lavaParticle.style.top = `${y}px`;
      
      // Fire color scheme
      const colors = ['#ff4500', '#ff7800', '#ff9a00', '#ffbf00', '#ff3300'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      lavaParticle.style.backgroundColor = color;
      lavaParticle.style.boxShadow = `0 0 ${6 + Math.random() * 10}px 2px ${color}`;
      
      button.appendChild(lavaParticle);
      
      // End position 
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance;
      
      lavaParticle.animate([
        { transform: 'scale(0.5) translate(0, 0)', opacity: 1 },
        { transform: `scale(${0.8 + Math.random() * 1.2}) translate(${destX}px, ${destY}px)`, opacity: 0.8 },
        { transform: `scale(0) translate(${destX * 1.5}px, ${destY * 1.5}px)`, opacity: 0 }
      ], {
        duration: 600 + Math.random() * 300,
        easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)'
      });
      
      setTimeout(() => lavaParticle.remove(), 900);
    }
  }

  function createFireTrailEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const numEmbers = 14;
    
    for (let i = 0; i < numEmbers; i++) {
      // Create ember element
      const ember = document.createElement('div');
      ember.className = 'fire-ember';
      
      // Position at center of button
      ember.style.left = `${rect.width/2}px`;
      ember.style.top = `${rect.height/2}px`;
      
      const angle = Math.random() * Math.PI * 2;
      const length = 5 + Math.random() * 15;
      
      // Set width (length) and angle of ember
      ember.style.width = `${length}px`;
      ember.style.transform = `rotate(${angle}rad)`;
      
      // Fire colors
      const hue = 20 + Math.random() * 40; // Orange-red range
      ember.style.background = `linear-gradient(90deg, rgba(255,${Math.floor(80 + Math.random() * 100)},0,1), rgba(255,50,0,0))`;
      ember.style.boxShadow = `0 0 8px 2px hsla(${hue}, 100%, 65%, 0.7)`;
      
      button.appendChild(ember);
      
      // Animate outward motion
      ember.animate([
        { transform: `rotate(${angle}rad) scaleX(0.3)`, opacity: 0.9 },
        { transform: `rotate(${angle}rad) scaleX(1)`, opacity: 0 }
      ], {
        duration: 300 + Math.random() * 300,
        easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)'
      });
      
      setTimeout(() => ember.remove(), 600);
    }
  }

  function createPhoenixEffect(event) {
    const button = event.currentTarget;
    if (!button.classList.contains('phoenix-effect')) {
      button.classList.add('phoenix-effect');
    }
    
    const rect = button.getBoundingClientRect();
    const featherCount = 12;
    
    for (let i = 0; i < featherCount; i++) {
      const feather = document.createElement('div');
      feather.className = 'phoenix-feather';
      
      // Position in center
      feather.style.left = rect.width/2 + 'px';
      feather.style.top = rect.height/2 + 'px';
      
      // Random orange-red-gold colors
      const hue = Math.random() > 0.7 ? 
                  35 + Math.floor(Math.random() * 15) :  // Gold
                  5 + Math.floor(Math.random() * 25);    // Red-orange
      
      const saturation = 90 + Math.floor(Math.random() * 10);
      const lightness = 45 + Math.floor(Math.random() * 15);
      
      feather.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      feather.style.boxShadow = `0 0 8px 3px hsla(${hue}, 100%, ${lightness + 10}%, 0.7)`;
      
      // Set feather shape and size
      const size = 4 + Math.random() * 6;
      feather.style.width = size + 'px';
      feather.style.height = (size * 3) + 'px';
      
      button.appendChild(feather);
      
      // Create wing-like animation paths
      const angle = (i / featherCount) * Math.PI * 2;
      const distance = 20 + Math.random() * 40;
      const curve = 30 + Math.random() * 50;
      
      // Different easing for more natural movement
      const easings = [
        'cubic-bezier(0.2, 0.9, 0.1, 1)',
        'cubic-bezier(0.1, 0.8, 0.2, 1)',
        'cubic-bezier(0.3, 0.7, 0.1, 1)'
      ];
      const easing = easings[Math.floor(Math.random() * easings.length)];
      
      feather.animate([
        { 
          transform: `translate(0, 0) rotate(0deg) scale(1)`, 
          opacity: 0.2 
        },
        { 
          transform: `translate(${Math.cos(angle) * distance * 0.3}px, ${Math.sin(angle) * distance * 0.3 - curve * 0.5}px) rotate(${Math.random() * 180 - 90}deg) scale(1.2)`, 
          opacity: 0.9 
        },
        { 
          transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance - curve}px) rotate(${Math.random() * 360 - 180}deg) scale(0.5)`, 
          opacity: 0 
        }
      ], {
        duration: 800 + Math.random() * 500,
        easing: easing
      });
      
      setTimeout(() => feather.remove(), 1300);
    }
  }

  function createMagmaEffect(button) {
    if (!button.classList.contains('magma-effect')) {
      button.classList.add('magma-effect');
    }
    button.classList.add('animate');
    
    setTimeout(() => {
      button.classList.remove('animate');
    }, 800);
  }

  function createSteamEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
      const steamCloud = document.createElement('div');
      steamCloud.className = 'steam-cloud';
      
      // Position at top of button
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      
      steamCloud.style.left = `${x}px`;
      steamCloud.style.top = `${y}px`;
      
      // Size variation
      const size = 6 + Math.random() * 8;
      steamCloud.style.width = `${size}px`;
      steamCloud.style.height = `${size}px`;
      
      button.appendChild(steamCloud);
      
      // Rising animation
      const xOffset = (Math.random() - 0.5) * 20;
      const riseHeight = 20 + Math.random() * 30;
      
      steamCloud.animate([
        { transform: 'translate(0, 0) scale(0.2)', opacity: 0 },
        { transform: `translate(${xOffset}px, -${riseHeight * 0.3}px) scale(1.5)`, opacity: 0.8 },
        { transform: `translate(${xOffset * 1.5}px, -${riseHeight}px) scale(2)`, opacity: 0 }
      ], {
        duration: 600 + Math.random() * 400,
        easing: 'ease-out'
      });
      
      setTimeout(() => steamCloud.remove(), 1000);
    }
  }

  function applyFireGlow(button) {
    button.classList.add('fire-glow-animation');
    setTimeout(() => {
      button.classList.remove('fire-glow-animation');
    }, 800);
  }

  function applyFirePulse(button) {
    button.classList.add('fire-pulse-animation');
    setTimeout(() => {
      button.classList.remove('fire-pulse-animation');
    }, 500);
  }

  function applyFireBurst(button) {
    if (!button.classList.contains('fire-burst')) {
      button.classList.add('fire-burst');
    }
    button.classList.add('animate');
    
    setTimeout(() => {
      button.classList.remove('animate');
    }, 700);
  }

  // Main function to apply animations to a button
  function applyAnimationsToButton(button) {
    // Don't re-apply to buttons that already have animations
    if (button.hasAttribute('data-fire-animation')) return;
    button.setAttribute('data-fire-animation', 'true');
    
    // Button position must be relative or absolute for animations to work
    if (window.getComputedStyle(button).position === 'static') {
      button.style.position = 'relative';
    }
    
    // Apply overflow: hidden if not already set
    if (window.getComputedStyle(button).overflow === 'visible') {
      button.style.overflow = 'hidden';
    }
    
    // Add appropriate animation based on button type
    if (button.classList.contains('nav-button')) {
      // Navigation buttons get phoenix and fire trail effects
      button.addEventListener('click', (event) => {
        createPhoenixEffect(event);
        createFireTrailEffect(event);
        applyFireBurst(button);
      });
    } 
    else if (button.id === 'worldsEndButton' || button.id === 'worldsEndTrinketButton' || 
             button.id === 'assignMeaningCards' || button.id === 'assignTrinkets') {
      // Special buttons get magma and explosion effects
      button.addEventListener('click', (event) => {
        createLavaExplosion(event);
        createMagmaEffect(button);
        applyFireGlow(button);
      });
    }
    else if (button.classList.contains('tier-roll-button') || button.classList.contains('show-all-button')) {
      // Button interactions get fire pulse effects
      button.addEventListener('click', (event) => {
        createFireRipple(event);
        applyFirePulse(button);
        createSteamEffect(event);
      });
    }
    else if (button.classList.contains('add-btn') || button.classList.contains('remove-btn') || 
             button.classList.contains('pocket-btn')) {
      // Trinket buttons get simple fire effects
      button.addEventListener('click', (event) => {
        createFireRipple(event);
        createFireTrailEffect(event);
      });
    }
    else {
      // All other buttons get random fire effects
      button.addEventListener('click', (event) => {
        const effectNum = Math.floor(Math.random() * 4);
        
        switch (effectNum) {
          case 0:
            createLavaExplosion(event);
            applyFirePulse(button);
            break;
          case 1:
            createFireRipple(event);
            createPhoenixEffect(event);
            break;
          case 2:
            createFireTrailEffect(event);
            applyFireGlow(button);
            break;
          case 3:
            createSteamEffect(event);
            applyFireBurst(button);
            break;
        }
      });
    }
  }

  // Initialize all button animations and set up the observer
  function initializeFireAnimations() {
    // Add pixelation filters
    addPixelationFilters();
    
    // Find all buttons and apply animations
    document.querySelectorAll('button').forEach(button => {
      applyAnimationsToButton(button);
    });
    
    // Start observing the entire document for new buttons
    buttonObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFireAnimations);
  } else {
    initializeFireAnimations();
  }
})();
      

      
// Create ember container
const emberContainer = document.createElement('div');
emberContainer.id = 'ember-container';
document.body.prepend(emberContainer);

// Add blue accent elements
function addBlueAccents() {
    const positions = [
        { top: '10%', left: '5%', size: '80px' },
        { top: '30%', right: '8%', size: '120px' },
        { top: '70%', left: '15%', size: '100px' },
        { top: '85%', right: '10%', size: '70px' },
        { top: '50%', left: '8%', size: '90px' }
    ];
   
    positions.forEach(pos => {
        const accent = document.createElement('div');
        accent.className = 'blue-accent-element';
        accent.style.top = pos.top;
        pos.left ? accent.style.left = pos.left : accent.style.right = pos.right;
        accent.style.width = pos.size;
        accent.style.height = pos.size;
        document.body.appendChild(accent);
    });
}
addBlueAccents();

// Generate ember particles
function createEmbers() {
    const count = 30; // Number of embers
   
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const ember = document.createElement('div');
            ember.className = 'ember';
            ember.style.left = `${Math.random() * 100}%`;
            ember.style.bottom = `-20px`;
            ember.style.width = `${2 + Math.random() * 6}px`;
            ember.style.height = ember.style.width;
           
            const duration = 5 + Math.random() * 15;
            const delay = Math.random() * 10;
           
            ember.style.animation = `floatUp ${duration}s ease-in ${delay}s infinite`;
           
            // Create custom keyframe animation for each ember
            const keyframes = `
                @keyframes floatUp {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0;
                    }
                    10% { opacity: ${0.3 + Math.random() * 0.5}; }
                    ${30 + Math.random() * 20}% {
                        transform: translateX(${-50 + Math.random() * 100}px) translateY(-${100 + Math.random() * 200}px) rotate(${Math.random() * 360}deg);
                        opacity: ${0.3 + Math.random() * 0.5};
                    }
                    ${60 + Math.random() * 20}% {
                        transform: translateX(${-100 + Math.random() * 200}px) translateY(-${300 + Math.random() * 400}px) rotate(${Math.random() * 720}deg);
                        opacity: ${0.1 + Math.random() * 0.3};
                    }
                    100% {
                        transform: translateX(${-200 + Math.random() * 400}px) translateY(-${600 + Math.random() * 200}px) rotate(${Math.random() * 1080}deg);
                        opacity: 0;
                    }
                }
            `;
           
            const style = document.createElement('style');
            style.innerHTML = keyframes;
            document.head.appendChild(style);
           
            emberContainer.appendChild(ember);
        }, i * 300); // Stagger the creation of embers
    }
}
createEmbers();

// Add click spark effect to buttons
function addSparkEffects() {
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' ||
            e.target.classList.contains('dominant-card') ||
            e.target.classList.contains('trinket-card') ||
            e.target.classList.contains('meaning-card')) {
           
            const target = e.target;
            const rect = target.getBoundingClientRect();
           
            // Calculate click position relative to the element
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
           
            // Create multiple sparks in a radial pattern
            for (let i = 0; i < 12; i++) {
                const spark = document.createElement('div');
                spark.className = 'spark';
               
                // Set initial position to the click location
                spark.style.left = `${x}px`;
                spark.style.top = `${y}px`;
               
                // Calculate direction and distance
                const angle = (i / 12) * Math.PI * 2;
                const distance = 30 + Math.random() * 70; // Random distance
                const duration = 0.5 + Math.random() * 0.5; // Random duration
               
                // Calculate end position using polar coordinates
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;
               
                // Apply animation
                spark.animate([
                    { opacity: 1, transform: 'scale(1) translate(0, 0)' },
                    { opacity: 0, transform: `scale(0) translate(${endX}px, ${endY}px)` }
                ], {
                    duration: duration * 1000,
                    easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
                });
               
                // Remove spark after animation
                setTimeout(() => {
                    spark.remove();
                }, duration * 1000);
               
                // Append to the clicked element
                if (target.style.position !== 'static') {
                    target.style.position = 'relative';
                }
                target.appendChild(spark);
            }
        }
    });
}
addSparkEffects();

// Add lava flow animation to cards
function addLavaFlowAnimation() {
    const cards = document.querySelectorAll('.player-control, .mode-toggle, .age-config, .player-meaning-card, .player-trinket-card');
   
    cards.forEach(card => {
        // Create lava flow element
        const lavaFlow = document.createElement('div');
        lavaFlow.className = 'lava-flow';
        lavaFlow.style.position = 'absolute';
        lavaFlow.style.top = '0';
        lavaFlow.style.left = '0';
        lavaFlow.style.width = '100%';
        lavaFlow.style.height = '100%';
        lavaFlow.style.pointerEvents = 'none';
        lavaFlow.style.zIndex = '0';
        lavaFlow.style.overflow = 'hidden';
        lavaFlow.style.borderRadius = '10px';
       
        // Create lava stream
        const lavaStream = document.createElement('div');
        lavaStream.style.position = 'absolute';
        lavaStream.style.width = '200%';
        lavaStream.style.height = '200%';
        lavaStream.style.backgroundImage = `
            radial-gradient(circle at 30% 30%, rgba(255, 180, 30, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(255, 70, 30, 0.05) 0%, transparent 50%)
        `;
        lavaStream.style.transform = 'rotate(5deg)';
       
        // Create animation
        const duration = 15 + Math.random() * 10;
        const keyframes = `
            @keyframes lavaStreamAnimation${Math.floor(Math.random() * 1000)} {
                0% { transform: rotate(5deg) translateX(-50%) translateY(-50%); }
                50% { transform: rotate(10deg) translateX(-40%) translateY(-60%); }
                100% { transform: rotate(5deg) translateX(-50%) translateY(-50%); }
            }
        `;
       
        const style = document.createElement('style');
        style.innerHTML = keyframes;
        document.head.appendChild(style);
       
        lavaStream.style.animation = `lavaStreamAnimation${Math.floor(Math.random() * 1000)} ${duration}s ease-in-out infinite`;
       
        lavaFlow.appendChild(lavaStream);
       
        // Set card position to relative if it's not already
        if (card.style.position !== 'relative') {
            card.style.position = 'relative';
        }
       
        // Add to card
        card.prepend(lavaFlow);
    });
}
addLavaFlowAnimation();

// Add heat shimmer effect to rules and dominant displays
function addHeatShimmer() {
    const elements = document.querySelectorAll('.rule-display, .age-display, .dominant-card');
   
    elements.forEach(element => {
        // Create heat shimmer element
        const shimmer = document.createElement('div');
        shimmer.className = 'heat-shimmer';
        shimmer.style.position = 'absolute';
        shimmer.style.top = '0';
        shimmer.style.left = '0';
        shimmer.style.width = '100%';
        shimmer.style.height = '100%';
        shimmer.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")';
        shimmer.style.pointerEvents = 'none';
        shimmer.style.opacity = '0.7';
        shimmer.style.mixBlendMode = 'overlay';
        shimmer.style.zIndex = '1';
       
        // Create animation
        const keyframes = `
            @keyframes shimmerAnimation${Math.floor(Math.random() * 1000)} {
                0% { transform: translateY(0) scale(1); opacity: 0.7; }
                50% { transform: translateY(-${1 + Math.random() * 3}px) scale(1.02); opacity: 0.5; }
                100% { transform: translateY(0) scale(1); opacity: 0.7; }
            }
        `;
       
        const style = document.createElement('style');
        style.innerHTML = keyframes;
        document.head.appendChild(style);
       
        shimmer.style.animation = `shimmerAnimation${Math.floor(Math.random() * 1000)} ${4 + Math.random() * 3}s ease-in-out infinite`;
       
        // Set element position to relative if it's not already
        if (element.style.position !== 'relative') {
            element.style.position = 'relative';
        }
       
        // Add to element
        element.appendChild(shimmer);
    });
}
addHeatShimmer();
   
// State variables for Meaning of Life feature
let playerMeaningCards = {};
let playerMeaningChoices = {};
let currentRevealPlayer = null;
     
      let playerAssignments = getCookie('playerAssignments') || {}; // Initialize from cookies if available
let nextCardId = 1;
let cardNameToIdsMap = {}; // Tracks all IDs for each card name
let persistentTierSelections = {}; // Stores permanent tier selections by stable ID

// Replace these functions completely:


function assignDominant(select, dominantName) {
    const card = select.closest('.dominant-card');
    const stableId = card.dataset.stableId;
    const playerName = select.value;
   
    // Update player assignments
    if (playerName) {
        playerAssignments[stableId] = playerName;
    } else {
        delete playerAssignments[stableId];
    }
   
    // Save to cookies instead of localStorage
    setCookie('playerAssignments', playerAssignments);
    
    // First update visual indicator for immediate feedback
    card.style.background = playerName ? 
        `linear-gradient(to right, ${getNameColor(dominantName)}22, transparent)` : '';
    
    // Then regenerate the list to apply the sorting
    generateDominantList();
}

function generateDominantList() {
  const container = document.getElementById('dominantList');
  container.innerHTML = '';
 
  // Keep track of count for each card name to create stable IDs
  const cardCounts = {};
 
  // First identify which cards are assigned to players
  const assignedCards = [];
  const unassignedCards = [];
 
  dominantData.forEach(dom => {
      if (!cardCounts[dom.name]) {
          cardCounts[dom.name] = 0;
      }
     
      const instanceNum = cardCounts[dom.name]++;
      const cardId = `${dom.name}::${instanceNum}`;
     
      const player = playerAssignments[cardId];
     
      if (player) {
          assignedCards.push({ card: dom, player, stableId: cardId });
      } else {
          unassignedCards.push({ card: dom, cardId });
      }
  });
 
  // Sort assigned cards by player number, then alphabetically by card name
  assignedCards.sort((a, b) => {
      const playerA = a.player;
      const playerB = b.player;
      
      // Extract the numeric part of the player name
      const playerNumA = parseInt(playerA.match(/\d+/)[0]);
      const playerNumB = parseInt(playerB.match(/\d+/)[0]);
      
      // First sort by player number
      if (playerNumA !== playerNumB) {
          return playerNumA - playerNumB;
      }
      
      // Then sort alphabetically by card name
      return a.card.name.localeCompare(b.card.name);
  });
 
  // Sort unassigned cards alphabetically
  unassignedCards.sort((a, b) => a.card.name.localeCompare(b.card.name));
 
  // Combine sorted lists: assigned first, then unassigned
  const allCards = [...assignedCards, ...unassignedCards];
 
  // Render all cards
  allCards.forEach(item => {
      const dom = item.card;
      const cardId = item.stableId || item.cardId;
      const player = item.player || "";
     
      const card = document.createElement('div');
      card.className = 'dominant-card';
      card.style.borderColor = getNameColor(dom.name);
      card.dataset.cardId = cardId;
      card.dataset.stableId = cardId;
     
      if (player) {
          card.style.background = `linear-gradient(to right, ${getNameColor(dom.name)}22, transparent)`;
      }
     
      const storedTier = persistentTierSelections[cardId];
     
      if (storedTier) {
          card.dataset.currentTier = storedTier;
      }
     
      const tierSelectOptions = Object.keys(dom.tiers).map(tier =>
          `<option value="${tier}" ${storedTier === tier ? 'selected' : ''}>Tier ${tier}</option>`
      ).join('');
     
      card.innerHTML = `
          <div class="dominant-name" style="color: ${getNameColor(dom.name)}">
              ${dom.name}
          </div>
          <div class="tier-display">${storedTier || '-'}</div>
          <button class="tier-roll-button" onclick="rollDominantTier(this)">🎲</button>
          <button class="tier-roll-button" onclick="toggleAllTiers(this, '${dom.name}')">Show All</button>
          <div class="dominant-button-group">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tier:</label>
              <select class="tier-select" style="width: 100%; margin-bottom: 10px;" onchange="setDominantTier(this)">
                  <option value="">Select Tier</option>
                  ${tierSelectOptions}
              </select>
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Player:</label>
              <select class="player-select" style="width: 100%;" onchange="assignDominant(this, '${dom.name}')">
                  <option value="">Unassigned</option>
                  ${getPlayerNames().map(p => `<option value="${p}" ${p === player ? 'selected' : ''}>${p}</option>`).join('')}
              </select>
          </div>
          <div class="tier-description">${storedTier && dom.tiers[storedTier] ? dom.tiers[storedTier] : ''}</div>
      `;
      container.appendChild(card);
  });
}

function rollDominantTier(button) {
    const card = button.closest('.dominant-card');
    const domName = card.querySelector('.dominant-name').textContent.trim();
    const tierSelect = card.querySelector('.tier-select');
    
    // Set weights with your specified percentages
    const tierWeights = {
        "1": 15,  // 15% chance
        "2": 35,  // 35% chance (most common)
        "3": 25,  // 25% chance
        "4": 15,  // 15% chance
        "5": 10   // 10% chance
    };
    
    // Generate a random number
    const random = Math.random() * 100;
    
    // Select tier based on weight
    let selectedTier = "2"; // Default to most common
    let cumulativeWeight = 0;
    
    for (const [tier, weight] of Object.entries(tierWeights)) {
        cumulativeWeight += weight;
        if (random <= cumulativeWeight) {
            selectedTier = tier;
            break;
        }
    }
    
    // Set the value in the select element
    tierSelect.value = selectedTier;
    
    // Update tier display
    setDominantTier(tierSelect);
    
    // Add visual effect for the roll
    button.classList.add('fire-pulse-animation');
    setTimeout(() => {
        button.classList.remove('fire-pulse-animation');
    }, 500);
}

function setDominantTier(select) {
    const tier = select.value;
    if (!tier) return;
    
    const card = select.closest('.dominant-card');
    const domName = card.querySelector('.dominant-name').textContent.trim();
    const tierDisplay = card.querySelector('.tier-display');
    const descDisplay = card.querySelector('.tier-description');
    const stableId = card.dataset.stableId;
    
    // Store the current tier
    card.dataset.currentTier = tier;
    persistentTierSelections[stableId] = tier;
    
    // Find the matching dominant
    const dominant = dominantData.find(d => d.name === domName);
    
    if (dominant && dominant.tiers && dominant.tiers[tier]) {
        descDisplay.textContent = dominant.tiers[tier];
        descDisplay.style.display = 'block';
        
        // Reset the "Show All" button if visible
        const showAllButton = card.querySelector('[onclick^="toggleAllTiers"]');
        if (showAllButton) {
            showAllButton.textContent = 'Show All';
        }
    } else {
        descDisplay.textContent = 'Description not available';
        descDisplay.style.display = 'block';
    }
    
    tierDisplay.textContent = tier;
    tierDisplay.style.background = `hsl(${130 - (tier * 15)}, 70%, 30%)`;
    
}




      // Age setup global variables
      let ageSetup = {
          normalAges: 69,
          merchantAges: 10,
          catastropheAges: 38,
          finalCatastropheAtEnd: true
      };
      let currentAgeDeck = [];
      let currentAgeIndex = 0;
     
        // Age setup event listeners - add these to your window.onload or initialization code
        document.getElementById('normalSlider').addEventListener('input', function(e) {
            const count = e.target.value;
            document.getElementById('normalCount').textContent = count;
            ageSetup.normalAges = parseInt(count);
        });
       
        document.getElementById('merchantSlider').addEventListener('input', function(e) {
            const count = e.target.value;
            document.getElementById('merchantCount').textContent = count;
            ageSetup.merchantAges = parseInt(count);
        });
       
        document.getElementById('catastropheSlider').addEventListener('input', function(e) {
            const count = e.target.value;
            document.getElementById('catastropheCount').textContent = count;
            ageSetup.catastropheAges = parseInt(count);
        });
       
        document.getElementById('finalCatastropheMode').addEventListener('change', function(e) {
            ageSetup.finalCatastropheAtEnd = e.target.checked;
        });

function showSection(section) {
  document.getElementById('challengesSection').style.display =
      section === 'challenges' ? 'block' : 'none';
  document.getElementById('dominantSection').style.display =
      section === 'dominants' ? 'block' : 'none';
  document.getElementById('ageSetupSection').style.display =
      section === 'ageSetup' ? 'block' : 'none';
  document.getElementById('meaningOfLifeSection').style.display =
      section === 'meaningOfLife' ? 'block' : 'none';
  document.getElementById('trinketsSection').style.display =
      section === 'trinkets' ? 'block' : 'none';
 
  if (section === 'ageSetup') {
      updateAgeSliders();
  }
  // Add at the end of your showSection function
document.body.style.height = 'auto';
setTimeout(function() {
  window.scrollTo(0, 0);
  document.body.style.height = '100%';
}, 10);
}

function initializeMeaningOfLife() {
    // Bind event listeners
    document.getElementById('assignMeaningCards').addEventListener('click', assignMeaningCards);
    document.getElementById('worldsEndButton').addEventListener('click', revealAllMeaningCards);
    document.getElementById('resetMeaningButton').addEventListener('click', resetMeaningCards);
   
    // Initialize state
    updateMeaningOfLifeSection();
}

        
       
        function showTierSelect(button) {
            const card = button.closest('.dominant-card');
            const tierSelect = card.querySelector('.tier-select');
           
            // Toggle visibility of the tier select dropdown
            if (tierSelect.style.display === 'none') {
                tierSelect.style.display = 'block';
            } else {
                tierSelect.style.display = 'none';
            }
        }

        

        function getNameColor(name) {
            const hash = Array.from(name).reduce((acc, char) =>
                char.charCodeAt(0) + (acc << 5) - acc, 0);
            return `hsl(${Math.abs(hash % 360)}, 70%, 60%)`;
        }

        
       
        function toggleAllTiers(button, dominantName) {
          const card = button.closest('.dominant-card');
          const tierDescription = card.querySelector('.tier-description');
         
          if (button.textContent === 'Show All') {
              const dominant = dominantData.find(d => d.name === dominantName);
              if (dominant && dominant.tiers) {
                  // Display all tiers
                  tierDescription.innerHTML = Object.entries(dominant.tiers)
                      .map(([tier, desc]) => desc)
                      .join('<br><br>');
                  tierDescription.style.display = 'block';
                  button.textContent = 'Hide All';
              }
          } else {
              // Check if there was a previously rolled tier
              const currentTier = card.dataset.currentTier;
             
              if (currentTier && currentTier !== '-') {
                  // Restore the previously selected tier description
                  const dominant = dominantData.find(d => d.name === dominantName);
                  if (dominant && dominant.tiers && dominant.tiers[currentTier]) {
                      tierDescription.textContent = dominant.tiers[currentTier];
                      tierDescription.style.display = 'block';
                  }
              } else {
                  // No previous tier was rolled, hide the description
                  tierDescription.style.display = 'none';
              }
             
              button.textContent = 'Show All';
          }
        }
       
        function updatePlayerSelects() {
            const selects = document.querySelectorAll('.player-select');
            const players = getPlayerNames();
           
            selects.forEach(select => {
                const currentValue = select.value;
                select.innerHTML = `
                    <option value="">Player:</option>
                    ${players.map(p => `
                        <option value="${p}" ${p === currentValue ? 'selected' : ''}>${p}</option>
                    `).join('')}
                `;
            });
        }


        let selectionHistory = [];

        function updateNameInputs(count) {
            const container = document.getElementById('nameInputs');
            container.innerHTML = '';
           
            for (let i = 1; i <= count; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'name-input';
                input.placeholder = `Player ${i} Name`;
                input.addEventListener('input', () => {
                    updatePlayerSelects();
                    generateDominantList();
                });
                container.appendChild(input);
            }
        }

        function getPlayerNames() {
            return Array.from(document.querySelectorAll('.name-input'))
                .map(input => input.value.trim() || input.placeholder);
        }

        document.getElementById('playerSlider').addEventListener('input', function(e) {
            const count = e.target.value;
            document.getElementById('playerCount').textContent = count;
            updateNameInputs(count);
            generateDominantList();
            updatePlayerSelects();
        });

        function rollNewAge() {
            const isCatastrophe = document.getElementById('catastropheMode').checked;
            const rules = isCatastrophe ? catastropheRules : normalRules;
            const players = getPlayerNames();
           
            let eligiblePlayers = [...players];
            if (selectionHistory.length >= 2) {
                const [secondLast, last] = selectionHistory.slice(-2);
                if (secondLast === last) {
                    eligiblePlayers = players.filter(p => p !== last);
                }
            }

            if (eligiblePlayers.length === 0) eligiblePlayers = [...players];
           
            const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
            const selectedPlayer = eligiblePlayers[randomIndex];
           
            selectionHistory.push(selectedPlayer);
            if (selectionHistory.length > 2) selectionHistory.shift();

            const randomRule = rules[Math.floor(Math.random() * rules.length)];
            const ruleDisplay = document.getElementById('ruleDisplay');
            const playerDisplay = document.getElementById('playerDisplay');
           
            ruleDisplay.style.animation = 'none';
            void ruleDisplay.offsetWidth;
            ruleDisplay.style.animation = 'fadeIn 0.5s';
           
            ruleDisplay.textContent = randomRule;
            playerDisplay.textContent = `🎯 ${selectedPlayer}`;
            document.getElementById('catastropheMode').checked = false;

            playerDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
       
        // Shuffle helper function
        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
       
function generateAgeDeck() {
    // Get input values
    const normalAges = ageSetup.normalAges;
    const merchantAges = ageSetup.merchantAges;
    let catastropheAges = ageSetup.catastropheAges;
    const guaranteeEndCatastrophe = ageSetup.finalCatastropheAtEnd;
   
    // Apply scaling to the values if enabled
    const { enableScaling, scalingMultiplier } = getScalingSettings();
    
    // Optionally apply scaling to age values - this affects the game balance
    // For example, you could scale points or rewards in age descriptions
    // We'll save the scaling info for later use in the game
    const currentScalingMultiplier = enableScaling ? scalingMultiplier : 1;
    // Store for use elsewhere if needed
    localStorage.setItem('currentScalingMultiplier', currentScalingMultiplier);
    
    // Validate inputs
    if (normalAges + merchantAges + catastropheAges <= 0) {
        alert("Please select at least one age.");
        return;
    }
   
    // Create arrays of indexes
    let normalIndexes = [...Array(normalAgeData.length).keys()];
   
    // MODIFICATION: Remove Birth of Life (index 0) from the normal indexes
    normalIndexes.splice(0, 1);
   
    let merchantIndexes = [...Array(merchantAgeData.length).keys()];
    let catastropheIndexes = [...Array(catastropheAgeData.length).keys()];
   
    // Shuffle the indexes
    normalIndexes = shuffleArray(normalIndexes);
    merchantIndexes = shuffleArray(merchantIndexes);
    catastropheIndexes = shuffleArray(catastropheIndexes);
   
    // Select the required number of each age type
    // MODIFICATION: Select one less normal age since Birth of Life will be added manually
    normalIndexes = normalIndexes.slice(0, normalAges - 1);
    merchantIndexes = merchantIndexes.slice(0, merchantAges);
   
    // Handle guaranteed end catastrophe
    let forcedEndCatastrophe = false;
    let finalCatastropheIndex = null;
    if (guaranteeEndCatastrophe && catastropheAges > 0) {
        finalCatastropheIndex = catastropheIndexes.pop();
        catastropheAges--;
        forcedEndCatastrophe = true;
    }
   
    // Total regular ages (normal + merchant)
    // MODIFICATION: Subtract 1 from normalAges since Birth of Life is handled separately
    const regularAges = (normalAges - 1) + merchantAges;
   
    // Calculate minimum required spacing between catastrophes
    let minSpacing = -1;
    if (catastropheAges >= 2) {
        // Try different spacings, starting with 10
        for (let spacing = 10; spacing >= 0; spacing--) {
            // Check if we can fit all catastrophes with this spacing
            if ((catastropheAges - 1) * spacing <= regularAges) {
                minSpacing = spacing;
                break;
            }
        }
    }
   
    // Create placeholders for all ages (excluding final catastrophe and Birth of Life)
    const totalPositions = regularAges + catastropheAges;
    let ageTypes = new Array(totalPositions).fill(0); // 0 = regular, 2 = catastrophe
   
    // Randomly place catastrophes with proper spacing
    if (catastropheAges > 0 && minSpacing > 0) {
        // Create array of all positions, excluding the first 3
        let availablePositions = Array.from({length: totalPositions}, (_, i) => i)
            .filter(i => i >= 3); // No catastrophes in first 3 ages
       
        // If we have a guaranteed end catastrophe, also exclude positions too close to the end
        if (forcedEndCatastrophe) {
            const endPosition = totalPositions;
            availablePositions = availablePositions.filter(pos =>
                Math.abs(pos - endPosition) >= minSpacing);
        }
       
        // Check if we have enough available positions
        if (availablePositions.length >= catastropheAges) {
            // Place first catastrophe randomly (from valid positions)
            const firstPositionIdx = Math.floor(Math.random() * availablePositions.length);
            const firstPosition = availablePositions[firstPositionIdx];
            ageTypes[firstPosition] = 2; // Mark as catastrophe
           
            // Keep track of placed catastrophes
            const catastrophePositions = [firstPosition];
           
            // If we have a final catastrophe, also consider it for spacing
            if (forcedEndCatastrophe) {
                catastrophePositions.push(totalPositions); // Virtual position of end catastrophe
            }
           
            // Place remaining catastrophes
            for (let i = 1; i < catastropheAges; i++) {
                // Get positions that respect minimum spacing from all existing catastrophes
                let validPositions = availablePositions.filter(pos => {
                    // Position must be at least minSpacing away from all existing catastrophes
                    return catastrophePositions.every(catPos =>
                        Math.abs(pos - catPos) >= minSpacing);
                });
               
                // Remove positions already used
                validPositions = validPositions.filter(pos => !catastrophePositions.includes(pos));
               
                // If we have valid positions, place a catastrophe randomly among them
                if (validPositions.length > 0) {
                    // Shuffle the valid positions to get real randomness in placement
                    validPositions = shuffleArray(validPositions);
                   
                    // Select a random position from valid ones
                    const position = validPositions[0];
                    ageTypes[position] = 2; // Mark as catastrophe
                    catastrophePositions.push(position);
                } else {
                    // If no valid positions with minimum spacing, we'll place them later
                    break;
                }
            }
           
            // If we couldn't place all catastrophes with proper spacing,
            // place remaining ones in best possible positions
            const placedCatastrophes = catastrophePositions.length - (forcedEndCatastrophe ? 1 : 0);
            if (placedCatastrophes < catastropheAges) {
                // For remaining catastrophes, try to maximize the minimum distance
                const remainingToPlace = catastropheAges - placedCatastrophes;
               
                for (let i = 0; i < remainingToPlace; i++) {
                    // Find all positions not yet used for catastrophes and not in first 3 ages
                    let remainingPositions = Array.from({length: totalPositions}, (_, i) => i)
                        .filter(pos => pos >= 3 && !catastrophePositions.includes(pos));
                   
                    if (remainingPositions.length === 0) break;
                   
                    // Calculate distances to existing catastrophes
                    let bestScore = -1;
                    let bestPositions = [];
                   
                    for (const pos of remainingPositions) {
                        const distances = catastrophePositions.map(catPos =>
                            Math.abs(pos - catPos));
                        const minDistance = Math.min(...distances);
                       
                        if (minDistance > bestScore) {
                            bestScore = minDistance;
                            bestPositions = [pos];
                        } else if (minDistance === bestScore) {
                            bestPositions.push(pos);
                        }
                    }
                   
                    // Randomly select one of the best positions
                    const position = bestPositions[Math.floor(Math.random() * bestPositions.length)];
                    ageTypes[position] = 2; // Mark as catastrophe
                    catastrophePositions.push(position);
                }
            }
        } else {
            // Not enough positions respecting all constraints, use standard approach
            const positions = Array.from({length: totalPositions}, (_, i) => i)
                .filter(i => i >= 3); // No catastrophes in first 3 ages
               
            // Also avoid too close to end catastrophe if applicable
            const filteredPositions = forcedEndCatastrophe ?
                positions.filter(pos => Math.abs(pos - totalPositions) >= minSpacing) :
                positions;
               
            const shuffledPositions = shuffleArray(filteredPositions.length > 0 ? filteredPositions : positions);
           
            for (let i = 0; i < Math.min(catastropheAges, shuffledPositions.length); i++) {
                ageTypes[shuffledPositions[i]] = 2;
            }
        }
    } else if (catastropheAges > 0) {
        // Just randomly distribute catastrophes (no spacing constraints)
        // But still avoid first 3 ages and too close to final catastrophe
        let positions = Array.from({length: totalPositions}, (_, i) => i)
            .filter(i => i >= 3);
           
        // If we have a guaranteed end catastrophe, also exclude positions too close to the end
        if (forcedEndCatastrophe) {
            const endPosition = totalPositions;
            positions = positions.filter(pos => pos < endPosition - 3);
        }
       
        const shuffledPositions = shuffleArray(positions);
       
        for (let i = 0; i < Math.min(catastropheAges, shuffledPositions.length); i++) {
            ageTypes[shuffledPositions[i]] = 2;
        }
    }
   
    // Distribute merchant ages among normal ages
    const normalPositions = ageTypes
        .map((type, idx) => type === 0 ? idx : -1)
        .filter(idx => idx !== -1);
   
    // Shuffle the normal positions
    const shuffledNormalPositions = shuffleArray([...normalPositions]);
   
    // Mark merchant positions (1 = merchant)
    for (let i = 0; i < Math.min(merchantAges, shuffledNormalPositions.length); i++) {
        ageTypes[shuffledNormalPositions[i]] = 1;
    }
   
    // Generate the final age data
    currentAgeDeck = [];
   
    // MODIFICATION: Add Birth of Life as the first age
    currentAgeDeck.push({
        type: 'normal',
        index: 0  // Birth of Life is at index 0
    });
   
    let normalCount = 0;
    let merchantCount = 0;
    let catastropheCount = 0;
   
    for (let i = 0; i < ageTypes.length; i++) {
        switch (ageTypes[i]) {
            case 0: // Normal age
                // Skip if we've used all normal ages
                if (normalCount < normalIndexes.length) {
                    currentAgeDeck.push({
                        type: 'normal',
                        index: normalIndexes[normalCount++]
                    });
                }
                break;
            case 1: // Merchant age
                // Skip if we've used all merchant ages
                if (merchantCount < merchantIndexes.length) {
                    currentAgeDeck.push({
                        type: 'merchant',
                        index: merchantIndexes[merchantCount++]
                    });
                }
                break;
            case 2: // Catastrophe age
                // Skip if we've used all catastrophe ages
                if (catastropheCount < catastropheIndexes.length) {
                    currentAgeDeck.push({
                        type: 'catastrophe',
                        index: catastropheIndexes[catastropheCount++]
                    });
                }
                break;
        }
    }
   
    // Add the final catastrophe if needed
    if (forcedEndCatastrophe) {
        currentAgeDeck.push({
            type: 'catastrophe',
            index: finalCatastropheIndex,
            isFinal: true
        });
    }
   
    // Reset to first age
    currentAgeIndex = 0;
    displayCurrentAge();
    
    // Add gentle scrolling for better UX when generating a new deck
    const ageDisplay = document.getElementById('ageDisplay');
    if (ageDisplay) {
        // Calculate position to scroll to (about halfway to the element)
        const rect = ageDisplay.getBoundingClientRect();
        const targetY = window.scrollY + rect.top - (window.innerHeight / 2);
        
        // Scroll smoothly to the position
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });
    }
}
               
        // Display the current age
        function displayCurrentAge() {
            if (currentAgeDeck.length === 0) {
                document.getElementById('ageDisplay').textContent = 'Generate an age deck first!';
                document.getElementById('ageCounter').textContent = '';
                return;
            }
           
            if (currentAgeIndex >= currentAgeDeck.length) {
                document.getElementById('ageDisplay').innerHTML = '<strong>Game Over!</strong><br>All ages have been played.';
                document.getElementById('ageCounter').textContent = `${currentAgeIndex}/${currentAgeDeck.length}`;
                return;
            }
           
            const currentAge = currentAgeDeck[currentAgeIndex];
            let ageContent = '';
            let ageTypeEmoji = '';
           
            switch (currentAge.type) {
                case 'normal':
                    const normalAge = normalAgeData[currentAge.index];
                    ageTypeEmoji = '🌱';
                    ageContent = `
                        <strong style="color: var(--accent1);">${ageTypeEmoji} NORMAL AGE: ${normalAge.name}</strong><br><br>
                        ${normalAge.description}
                    `;
                    break;
                   
                case 'merchant':
                    const merchantAge = merchantAgeData[currentAge.index];
                    ageTypeEmoji = '💰';
                    ageContent = `
                        <strong style="color: gold;">${ageTypeEmoji} MERCHANT AGE: ${merchantAge.name}</strong><br><br>
                        ${merchantAge.description}
                    `;
                    break;
                   
                case 'catastrophe':
                    const catastropheAge = catastropheAgeData[currentAge.index];
                    ageTypeEmoji = '☠️';
                    let finalWarning = currentAge.isFinal ? '<br><br><strong style="color: red;">FINAL CATASTROPHE - THIS ENDS THE GAME!</strong>' : '';
                   
                    ageContent = `
                        <strong style="color: var(--accent2);">${ageTypeEmoji} CATASTROPHE AGE: ${catastropheAge.name}</strong>${finalWarning}<br><br>
                        ${catastropheAge.description}<br><br>
                        <strong style="color: orange;">World's End Effect:</strong><br>
                        ${catastropheAge.worldsEnd}
                    `;
                    break;
            }
           
            document.getElementById('ageDisplay').innerHTML = ageContent;
            document.getElementById('ageCounter').textContent = `Age ${currentAgeIndex + 1}/${currentAgeDeck.length}`;
           
            // Removed scrollToCurrentAge() call to prevent auto-scrolling
        }
       
        // Navigate to the next age
        function nextAge() {
            if (currentAgeDeck.length === 0) return;
           
            if (currentAgeIndex < currentAgeDeck.length) {
                currentAgeIndex++;
                displayCurrentAge();
            }
        }
       
        // Navigate to the previous age
        function previousAge() {
            if (currentAgeDeck.length === 0) return;
           
            if (currentAgeIndex > 0) {
                currentAgeIndex--;
                displayCurrentAge();
            }
        }
       
        function updateAgeSliders() {
    // Update normal ages slider
    document.getElementById('normalCount').textContent = ageSetup.normalAges;
    document.getElementById('normalSlider').value = ageSetup.normalAges;
    document.getElementById('normalSlider').max = normalAgeData.length;
   
    // Update merchant ages slider
    document.getElementById('merchantCount').textContent = ageSetup.merchantAges;
    document.getElementById('merchantSlider').value = ageSetup.merchantAges;
    document.getElementById('merchantSlider').max = merchantAgeData.length;
   
    // Update catastrophe ages slider
    document.getElementById('catastropheCount').textContent = ageSetup.catastropheAges;
    document.getElementById('catastropheSlider').value = ageSetup.catastropheAges;
    document.getElementById('catastropheSlider').max = catastropheAgeData.length;
}

// This function remains available but we don't call it automatically for prev/next
function scrollToCurrentAge() {
    // Get the element that displays the current age
    const ageDisplay = document.getElementById('current-age-display');
   
    // If the element exists, scroll to it
    if (ageDisplay) {
        ageDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        // If there's no specific element, just scroll to the bottom
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
}

// For previous/next age buttons
function previousAge() {
    if (currentAgeIndex > 0) {
        currentAgeIndex--;
        displayCurrentAge();
        // Removed comment about scrolling happening in displayCurrentAge
    }
}

function nextAge() {
    if (currentAgeIndex < currentAgeDeck.length - 1) {
        currentAgeIndex++;
        displayCurrentAge();
        // Removed comment about scrolling happening in displayCurrentAge
    }
}

// State variables for Trinkets feature
let playerTrinkets = {}; // Holds each player's current trinkets
let playerTrinketScores = {}; // Holds each player's trinket scores
let availableTrinkets = []; // Available trinkets to choose from

// Function to initialize trinket system
function initializeTrinkets() {
  // Add event listeners
  document.getElementById('assignTrinkets').addEventListener('click', assignTrinkets);
  document.getElementById('worldsEndTrinketButton').addEventListener('click', showTrinketScores);
  document.getElementById('resetTrinketsButton').addEventListener('click', resetTrinkets);
 
  // Initialize state
  resetTrinkets();
}

function updateTrinketSection() {
  const playerTrinketsContainer = document.getElementById('playerTrinkets');
  playerTrinketsContainer.innerHTML = '';
 
  const players = getPlayerNames();
 
  if (Object.keys(playerTrinkets).length === 0) {
    playerTrinketsContainer.innerHTML = '<div class="status-message">Click "Assign Trinkets" to start.</div>';
    return;
  }
 
  players.forEach(player => {
    const playerCard = document.createElement('div');
    playerCard.className = 'player-trinket-card';
   
    const trinkets = playerTrinkets[player] || [];
    const score = playerTrinketScores[player] || 0;
   
    // Create player header
    const playerHeader = document.createElement('div');
    playerHeader.className = 'player-trinket-header';
    playerHeader.innerHTML = `
      <span class="player-name">${player}</span>
      <span class="trinket-score">Score: ${score}</span>
    `;
    playerCard.appendChild(playerHeader);
   
    // Create trinkets container
    const trinketsContainer = document.createElement('div');
    trinketsContainer.className = 'trinkets-container';
   
    if (trinkets.length > 0) {
      trinkets.forEach((trinket, index) => {
        const trinketElement = document.createElement('div');
        trinketElement.className = 'trinket-card';
       
        trinketElement.innerHTML = `
          <div class="trinket-name">${trinket.name}</div>
          <div class="trinket-power"><strong>Power:</strong> ${trinket.power}</div>
          <div class="trinket-objective"><strong>Objective:</strong> ${trinket.objective}</div>
          <div class="trinket-points"><strong>Points:</strong> ${trinket.points}</div>
          <div class="trinket-actions">
            <button class="trinket-btn add-btn" onclick="addTrinket('${player}', ${index})"${trinkets.length === 2 ? '' : (availableTrinkets.length === 0 ? ' disabled' : '')}>Add</button>
            <button class="trinket-btn remove-btn" onclick="removeTrinket('${player}', ${index})">Remove</button>
            <button class="trinket-btn pocket-btn" onclick="pocketTrinket('${player}', ${index})"${trinkets.length === 2 ? ' disabled' : ''}>Pocket</button>
          </div>
        `;
        trinketsContainer.appendChild(trinketElement);
      });
    } else {
      // For players with 0 trinkets, show a single card with only the Add button enabled
      const emptyCard = document.createElement('div');
      emptyCard.className = 'trinket-card empty-trinket';
      emptyCard.innerHTML = `
        <div class="no-trinkets">No trinkets assigned</div>
        <div class="trinket-actions">
          <button class="trinket-btn add-btn" onclick="addTrinket('${player}', 0)"${availableTrinkets.length === 0 ? ' disabled' : ''}>Add</button>
          <button class="trinket-btn remove-btn" disabled>Remove</button>
          <button class="trinket-btn pocket-btn" disabled>Pocket</button>
        </div>
      `;
      trinketsContainer.appendChild(emptyCard);
    }
   
    playerCard.appendChild(trinketsContainer);
    playerTrinketsContainer.appendChild(playerCard);
  });
 
  updateTrinketStatus();
}

function updateTrinketStatus() {
  const statusElement = document.getElementById('trinketStatus');
  const players = getPlayerNames();
  const availableCount = availableTrinkets.length;
 
  if (Object.keys(playerTrinkets).length === 0) {
    statusElement.textContent = `Ready to assign trinkets to ${players.length} players. ${availableCount} trinkets available.`;
    return;
  }
 
  statusElement.textContent = `${availableCount} trinkets available. Use add/remove/pocket to manage your trinkets.`;
}

// Function to assign initial trinkets to all players
function assignTrinkets() {
  const players = getPlayerNames();
 
  // Check if any players already have trinkets
  const playersWithTrinkets = Object.keys(playerTrinkets).some(player =>
    playerTrinkets[player] && playerTrinkets[player].length > 0
  );
 
  if (playersWithTrinkets) {
    alert("Some players already have trinkets. You need to reset trinkets first before reassigning.");
    return;
  }
 
  // Reset state
  resetTrinkets();
 
  // Shuffle available trinkets initially
  availableTrinkets.sort(() => Math.random() - 0.5);
 
  // Assign 2 trinkets to each player from the top of the deck
  players.forEach(player => {
    if (availableTrinkets.length >= 2) {
      playerTrinkets[player] = [
        availableTrinkets.shift(),
        availableTrinkets.shift()
      ];
      playerTrinketScores[player] = 0;
    } else {
      alert("Not enough trinkets available!");
    }
  });
 
  // Update UI
  updateTrinketSection();
}

function addTrinket(playerName, trinketIndex) {
  const currentTrinkets = playerTrinkets[playerName] || [];
 
  // If 2 trinkets, handle the special case first (keep one, return the other)
  if (currentTrinkets.length === 2) {
    // Find the index of the "other" trinket (the one NOT clicked)
    const otherIndex = trinketIndex === 0 ? 1 : 0;
   
    // Return the other trinket to the bottom of the deck
    availableTrinkets.push(currentTrinkets[otherIndex]);
   
    // Keep only the current trinket
    playerTrinkets[playerName] = [currentTrinkets[trinketIndex]];
  }
  // For 0 or 1 trinket, check if we have available trinkets to draw
  else if (availableTrinkets.length === 0) {
    alert("No trinkets available!");
    return;
  }
  // If 0 trinkets, add one from the top
  else if (currentTrinkets.length === 0) {
    const newTrinket = availableTrinkets.shift();
    playerTrinkets[playerName] = [newTrinket];
  }
  // If 1 trinket, add another from the top
  else if (currentTrinkets.length === 1) {
    const newTrinket = availableTrinkets.shift();
    currentTrinkets.push(newTrinket);
    playerTrinkets[playerName] = currentTrinkets;
  }
 
  // Update UI
  updateTrinketSection();
}

function removeTrinket(playerName, trinketIndex) {
  const currentTrinkets = playerTrinkets[playerName] || [];
 
  if (currentTrinkets.length === 0) {
    return;
  }
 
  // Return the trinket to the bottom of the deck
  availableTrinkets.push(currentTrinkets[trinketIndex]);
 
  // Remove that specific trinket
  currentTrinkets.splice(trinketIndex, 1);
  playerTrinkets[playerName] = currentTrinkets;
 
  // If player now has 0 trinkets and there are available trinkets,
  // automatically add a new one from the top
  if (currentTrinkets.length === 0 && availableTrinkets.length > 0) {
    addTrinket(playerName, 0);
    return; // addTrinket will call updateTrinketSection
  }
 
  // Update UI
  updateTrinketSection();
}

function pocketTrinket(playerName, trinketIndex) {
  const currentTrinkets = playerTrinkets[playerName] || [];
 
  if (currentTrinkets.length === 0 || trinketIndex >= currentTrinkets.length) {
    alert("No trinket to pocket!");
    return;
  }
 
  // Add trinket's points to the player's score
  const trinket = currentTrinkets[trinketIndex];
  playerTrinketScores[playerName] = (playerTrinketScores[playerName] || 0) + trinket.points;
 
  // Remove the trinket from the player (don't return it to the pool)
  currentTrinkets.splice(trinketIndex, 1);
  playerTrinkets[playerName] = currentTrinkets;
 
  // If player now has 0 trinkets and there are available trinkets,
  // automatically add a new one from the top
  if (currentTrinkets.length === 0 && availableTrinkets.length > 0) {
    addTrinket(playerName, 0);
    return; // addTrinket will call updateTrinketSection
  }
 
  // Update UI
  updateTrinketSection();
}

// Function to show World's End scores
function showTrinketScores() {
  const players = getPlayerNames();
  let scoreDisplay = '<h3>World\'s End Trinket Scores</h3>';
 
  players.forEach(player => {
      const score = playerTrinketScores[player] || 0;
      scoreDisplay += `<div class="player-score"><strong>${player}:</strong> ${score} points</div>`;
  });
 
  // Display the scores in the status area
  const statusElement = document.getElementById('trinketStatus');
  statusElement.innerHTML = scoreDisplay;
}

function resetTrinkets() {
  playerTrinkets = {};
  playerTrinketScores = {};
  availableTrinkets = [...trinketData]; // Create a fresh copy of the trinket data
  updateTrinketSection();
}

// Function to update the Meaning of Life section
function updateMeaningOfLifeSection() {
    const playerCardsContainer = document.getElementById('playerMeaningCards');
    playerCardsContainer.innerHTML = '';
   
    const players = getPlayerNames();
   
    if (Object.keys(playerMeaningCards).length === 0) {
        playerCardsContainer.innerHTML = '<div class="status-message">Click "Assign Meaning of Life Cards" to start.</div>';
        return;
    }
   
    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-meaning-card';
       
        const cards = playerMeaningCards[player] || [];
        const chosenCardIndex = playerMeaningChoices[player];
        const isRevealed = currentRevealPlayer === player;
       
        // Create player header
        const playerHeader = document.createElement('div');
        playerHeader.className = 'player-meaning-header';
        playerHeader.innerHTML = `
            <span class="player-name">${player}</span>
            <button class="reveal-button" onclick="toggleRevealForPlayer('${player}')">
                ${isRevealed ? 'Hide' : 'Reveal'}
            </button>
        `;
        playerCard.appendChild(playerHeader);
       
        // Create cards container
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'meaning-cards-container';
        cardsContainer.style.display = isRevealed ? 'flex' : 'none';
       
        if (cards.length > 0) {
            cards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'meaning-card';
               
                // Add selected class if this card is chosen
                if (chosenCardIndex === index) {
                    cardElement.classList.add('selected-card');
                }
               
                cardElement.innerHTML = `
                    <div class="meaning-card-name">${card.name}</div>
                    <div class="meaning-card-desc">${card.description}</div>
                    ${chosenCardIndex === undefined ?
                        `<button class="choose-card-btn" onclick="chooseCard('${player}', ${index})">Choose</button>` :
                        ''}
                `;
                cardsContainer.appendChild(cardElement);
            });
        } else {
            cardsContainer.innerHTML = '<div class="no-cards">No cards assigned yet</div>';
        }
       
        playerCard.appendChild(cardsContainer);
        playerCardsContainer.appendChild(playerCard);
    });
   
// At the end of your updateMeaningOfLifeSection function, add:
updateMeaningCardStatus();

// If no player is currently revealing, highlight the next player
if (currentRevealPlayer === null) {
    highlightPlayers();
}
}

// Function to update the status display
function updateMeaningCardStatus() {
    const statusElement = document.getElementById('meaningCardStatus');
    const players = getPlayerNames();
    const totalPlayers = players.length;
    const playersWithChoices = Object.keys(playerMeaningChoices).length;
   
    if (Object.keys(playerMeaningCards).length === 0) {
        statusElement.textContent = `Ready to assign cards to ${totalPlayers} players.`;
        return;
    }
   
    statusElement.textContent = `${playersWithChoices}/${totalPlayers} players have chosen their Meaning of Life.`;
}

// Function to assign cards to all players
// Function to assign cards to all players
// Function to calculate the scaling multiplier based on total ages
function calculateScalingMultiplier() {
    // Get total number of ages
    const totalAges = ageSetup.normalAges + ageSetup.merchantAges + ageSetup.catastropheAges;
   
    // Calculate base scaling multiplier (total ages / 20)
    // 20 is considered the average number of ages in a normal game
    const baseSM = Math.max(1, totalAges / 20);
   
    // Get the manual scaling multiplier from settings
    const { enableScaling, scalingMultiplier } = getScalingSettings();
    
    // If dynamic scaling is disabled, use 1 as the base
    const finalSM = enableScaling ? baseSM * scalingMultiplier : scalingMultiplier;
    
    return finalSM;
}

// Function to process Meaning of Life card descriptions with the scaling multiplier
function processCardDescriptions() {
    const sM = calculateScalingMultiplier();
   
    // Create a deep copy of the original data
    const processedCards = JSON.parse(JSON.stringify(meaningOfLifeData));
   
    // Process each card's description
    processedCards.forEach(card => {
        // Replace all instances of "sM" or "X*sM" or "sM*X" with calculated values
        card.description = card.description.replace(/(\d+)\*sM/g, (match, number) => {
            return Math.round(parseInt(number) * sM);
        });
       
        card.description = card.description.replace(/sM\*(\d+)/g, (match, number) => {
            return Math.round(parseInt(number) * sM);
        });
       
        // Replace standalone "sM" with the calculated value
        card.description = card.description.replace(/\bsM\b/g, Math.round(sM));
    });
   
    return processedCards;
}

// Modified assignMeaningCards function to use processed descriptions
function assignMeaningCards() {
    const players = getPlayerNames();
    const processedCards = processCardDescriptions();
    const totalCards = processedCards.length;
    const requiredCards = players.length * 2;
   
    if (totalCards < requiredCards) {
        alert(`Not enough Meaning of Life cards! You need at least ${requiredCards} cards for ${players.length} players, but only have ${totalCards}.`);
        return;
    }
   
    // Display the scaling multiplier
    const sM = calculateScalingMultiplier();
    const statusElement = document.getElementById('meaningCardStatus');
    statusElement.innerHTML = `<strong>Scaling Multiplier:</strong> ${sM.toFixed(2)}x (based on ${ageSetup.normalAges + ageSetup.merchantAges + ageSetup.catastropheAges} total ages)`;
   
    playerMeaningCards = {};
    playerMeaningChoices = {};
    currentRevealPlayer = null;
   
    const shuffledCards = [...processedCards].sort(() => Math.random() - 0.5);
   
    players.forEach((player, index) => {
        playerMeaningCards[player] = [
            shuffledCards[index * 2],
            shuffledCards[index * 2 + 1]
        ];
    });
   
    // Update the UI
    updateMeaningOfLifeSection();
}

// Add a button to the age setup section to show the current scaling multiplier
function addScalingMultiplierDisplay() {
    const ageConfig = document.querySelector('.age-config');
   
    const smDisplay = document.createElement('div');
    smDisplay.className = 'status-display';
    smDisplay.id = 'scalingMultiplierDisplay';
    smDisplay.style.marginTop = '1rem';
   
    const sM = calculateScalingMultiplier();
    smDisplay.innerHTML = `<strong>Meaning of Life Scaling:</strong> ${sM.toFixed(2)}x`;
   
    ageConfig.appendChild(smDisplay);
   
    // Update the display whenever sliders change
    document.getElementById('normalSlider').addEventListener('input', updateScalingDisplay);
    document.getElementById('merchantSlider').addEventListener('input', updateScalingDisplay);
    document.getElementById('catastropheSlider').addEventListener('input', updateScalingDisplay);
}

// Function to update the scaling multiplier display
function updateScalingDisplay() {
    const smDisplay = document.getElementById('scalingMultiplierDisplay');
    if (smDisplay) {
        const sM = calculateScalingMultiplier();
        smDisplay.innerHTML = `<strong>Meaning of Life Scaling:</strong> ${sM.toFixed(2)}x`;
    }
}

// Add this to your initialization code
window.addEventListener('load', function() {
    addScalingMultiplierDisplay();
});

// Function to toggle revealing cards for a player
function toggleRevealForPlayer(playerName) {
    // Check if we're trying to hide the current player's cards
    if (currentRevealPlayer === playerName) {
        // Hide the cards
        currentRevealPlayer = null;
       
        // Find the next player who hasn't revealed yet
        highlightPlayers();
        updateMeaningOfLifeSection();
        return;
    }
   
    // If we're revealing a new player's cards
    if (currentRevealPlayer !== null) {
        const previousPlayer = currentRevealPlayer;
       
        if (playerMeaningChoices[previousPlayer] === undefined &&
            playerMeaningCards[previousPlayer] &&
            playerMeaningCards[previousPlayer].length > 0) {
            alert(`${previousPlayer} must choose a Meaning of Life card before proceeding.`);
            return;
        }
    }
   
    // Set the new player to reveal
    currentRevealPlayer = playerName;
    updateMeaningOfLifeSection();
}

// Function for a player to choose their card
function chooseCard(playerName, cardIndex) {
    playerMeaningChoices[playerName] = cardIndex;
    updateMeaningOfLifeSection();
   
    setTimeout(() => {
        if (currentRevealPlayer === playerName) {
            toggleRevealForPlayer(playerName);
        }
    }, 1000);
}

// Function to reveal all cards at World's End
function revealAllMeaningCards() {
    const playerCardsContainer = document.getElementById('playerMeaningCards');
   
    const playerCardElements = playerCardsContainer.querySelectorAll('.player-meaning-card');
    playerCardElements.forEach(card => {
        const cardsContainer = card.querySelector('.meaning-cards-container');
        cardsContainer.style.display = 'flex';
       
        const chooseButtons = cardsContainer.querySelectorAll('.choose-card-btn');
        chooseButtons.forEach(btn => btn.style.display = 'none');
    });
   
    const revealButtons = playerCardsContainer.querySelectorAll('.reveal-button');
    revealButtons.forEach(btn => btn.disabled = true);
   
    const statusElement = document.getElementById('meaningCardStatus');
    statusElement.innerHTML = '<strong style="color: var(--accent2);">WORLD\'S END!</strong> All Meaning of Life cards are revealed.';
}

// Function to reset the Meaning of Life cards
function resetMeaningCards() {
    playerMeaningCards = {};
    playerMeaningChoices = {};
    currentRevealPlayer = null;
    updateMeaningOfLifeSection();
}

// Function to highlight the next player who should reveal their cards
// Function to highlight all players who haven't made a choice yet
function highlightPlayers() {
    // Clear existing highlights
    const revealButtons = document.querySelectorAll('.reveal-button');
    revealButtons.forEach(btn => {
        btn.classList.remove('next-player-highlight');
    });
   
    // Find players who haven't made a choice yet
    const players = getPlayerNames();
    const playersWithoutChoice = players.filter(player =>
        playerMeaningCards[player] &&
        playerMeaningCards[player].length > 0 &&
        playerMeaningChoices[player] === undefined
    );
   
    if (playersWithoutChoice.length > 0) {
        // Highlight ALL players who haven't made a choice yet
        const playerCards = document.querySelectorAll('.player-meaning-card');
        playerCards.forEach(card => {
            const playerName = card.querySelector('.player-name').textContent;
            if (playersWithoutChoice.includes(playerName)) {
                const revealButton = card.querySelector('.reveal-button');
                revealButton.classList.add('next-player-highlight');
            }
        });
    }
}

function switchToChallengePage() {
    // Hide all sections
    document.getElementById('challengesSection').style.display = 'block';
    document.getElementById('dominantSection').style.display = 'none';
    document.getElementById('ageSetupSection').style.display = 'none';
    document.getElementById('meaningOfLifeSection').style.display = 'none';
    document.getElementById('trinketsSection').style.display = 'none';
}

// Data storage variables
let meaningOfLifeData = [];
let normalAgeData = [];
let merchantAgeData = [];
let catastropheAgeData = [];
let dominantData = [];
let normalRules = [];
let catastropheRules = [];
let trinketData = [];

// Function to load all JSON data
async function loadAllData() {
    try {
        // Use XMLHttpRequest instead of fetch for better local file support
        const loadJson = (url) => {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'json';
                
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`Failed to load ${url}: ${xhr.statusText}`));
                    }
                };
                
                xhr.onerror = function() {
                    console.error(`Network error while loading ${url}`);
                    reject(new Error(`Network error while loading ${url}`));
                };
                
                xhr.send();
            });
        };

        // Load all data in parallel
        const [
            meaningOfLife,
            normalAge,
            merchantAge,
            catastropheAge,
            dominant,
            normalRule,
            catastropheRule,
            trinket
        ] = await Promise.all([
            loadJson('meaningOfLifeData.json'),
            loadJson('normalAgeData.json'),
            loadJson('merchantAgeData.json'),
            loadJson('catastropheData.json'),
            loadJson('dominantData.json'),
            loadJson('normalRules.json'),
            loadJson('catastropheRules.json'),
            loadJson('trinketData.json')
        ]);

        // Assign loaded data to variables
        meaningOfLifeData = meaningOfLife;
        normalAgeData = normalAge;
        merchantAgeData = merchantAge;
        catastropheAgeData = catastropheAge;
        dominantData = dominant;
        normalRules = normalRule;
        catastropheRules = catastropheRule;
        trinketData = trinket;
        
        console.log("All game data loaded successfully");
        return true;
    } catch (error) {
        console.error('Error loading game data:', error);
        alert('Error loading game data. Make sure all JSON files exist in the same directory as your HTML file.\n\nFor best results, use a local web server instead of opening files directly.');
        return false;
    }
}

// Master initialization function
async function initApplication() {
    // Step 1: Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingIndicator);
    
    // Disable interactive elements until data is loaded
    document.querySelectorAll('button, select, input').forEach(el => {
        el.classList.add('loading-disabled');
        el.disabled = true;
    });
    
    try {
        // Step 2: Load JSON data
        const dataLoaded = await loadAllData();
        if (!dataLoaded) {
            throw new Error("Failed to load data");
        }
        
        // Step 3: Initialize UI components
        updateNameInputs(2);
        generateDominantList();
        updatePlayerSelects();
        updateAgeSliders();
        initializeMeaningOfLife();
        initializeTrinkets();
        switchToChallengePage();
        
        // Step 4: Load saved state from localStorage
        if (typeof loadGameState === 'function') {
            loadGameState();
        } else {
            console.warn("loadGameState function not found - saved state won't be loaded");
        }
        
        // Step 5: Setup auto-save
        if (typeof setupAutoSave === 'function') {
            setupAutoSave();
        } else {
            console.warn("setupAutoSave function not found - auto-save won't be enabled");
        }
        
        // Step 6: Enable UI
        document.querySelectorAll('.loading-disabled').forEach(el => {
            el.classList.remove('loading-disabled');
            el.disabled = false;
        });
        
        // Remove loading indicator
        loadingIndicator.remove();
        
        console.log("Application initialized successfully");
    } catch (error) {
        console.error('Failed to initialize application:', error);
        loadingIndicator.innerHTML = `
            <div style="color: white; text-align: center; padding: 20px;">
                <p>Error initializing the application.</p>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="padding: 8px 16px; margin-top: 10px;">Retry</button>
            </div>
        `;
    }
}

// Single DOMContentLoaded event handler for all initialization
document.addEventListener('DOMContentLoaded', function() {
    // Create the phoenix logo
    const phoenixLogo = document.createElement('div');
    phoenixLogo.className = 'phoenix-logo';
   
    // Add logo elements
    phoenixLogo.innerHTML = `
      <div class="phoenix-image"></div>
      <div class="logo-text">
        <h1>DOOMLINGS</h1>
        <h2>COMPANION</h2>
      </div>
    `;
   
    // Insert the logo at the top of the container
    const container = document.querySelector('.container');
    const nav = container.querySelector('.nav');
    container.insertBefore(phoenixLogo, nav);
   
    // Add the CSS to the head
    const style = document.createElement('style');
    style.textContent = `
      .phoenix-logo {
        position: relative;
        width: 100%;
        max-width: 350px;
        height: 120px;
        margin: 0 auto 20px;
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(255, 60, 0, 0.3), 0 0 30px rgba(0, 150, 200, 0.2);
      }
     
      .phoenix-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('fire_water_phoenix.png');
        background-size: cover;
        background-position: center;
        z-index: 1;
      }
     
      .logo-text {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 10px;
        background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        text-align: center;
        z-index: 2;
      }
     
      .logo-text h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 800;
        color: var(--accent1);
        text-shadow: 0 0 10px rgba(255, 60, 0, 0.8);
      }
     
      .logo-text h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 400;
        color: var(--text);
        letter-spacing: 2px;
      }
      
      .loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }
      
      .loading-spinner {
        width: 80px;
        height: 80px;
        border: 8px solid rgba(255, 60, 0, 0.3);
        border-radius: 50%;
        border-top-color: var(--accent1);
        animation: spin 1s ease-in-out infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    // Start the application initialization process
    initApplication();
});

// Remove the original initialization code since we've moved it to initApplication function
// updateNameInputs(2);
// generateDominantList();
// updatePlayerSelects();
// updateAgeSliders();
// initializeMeaningOfLife();
// initializeTrinkets();
// switchToChallengePage();

// Load scaling settings
function getScalingSettings() {
    const enableScaling = localStorage.getItem('enableScaling') !== 'false';
    const scalingMultiplier = parseFloat(localStorage.getItem('scalingMultiplier')) || 1;
    return { enableScaling, scalingMultiplier };
}

// Apply scaling to a value
function applyScaling(value) {
    const { enableScaling, scalingMultiplier } = getScalingSettings();
    if (!enableScaling) return value;
    return value * scalingMultiplier;
}

// Don't redefine generateAgeDeck - the function is already defined earlier
// The scaling functionality can be used in the existing function

// ... rest of the existing code ...