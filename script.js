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
   


     
     
// Meaning of Life card data
// sM represents signMultiplication - a scaling factor based on number of ages
const meaningOfLifeData = [
    {
        name: "The Bilbies",
        description: "+sM if you have only 1 dominant trait in your trait pile. +10*sM if you have none."
    },
    {
        name: "The Cabochon",
        description: "+3*sM if you have only 1*sM to 2*sM red traits in your trait pile. +6*sM if you have none."
    },
    {
        name: "The Cosmic Jinx",
        description: "+4*sM if your Gene Pool is 3. +8*sM if your Gene Pool is 1 or 2."
    },
    {
        name: "The Dancer",
        description: "+12*sM if you have the lowest score, before Meaning of Life bonuses. +8*sM if you are tied for the lowest."
    },
    {
        name: "The Feelmonger",
        description: "+3*sM if you have only 1*sM to 2*sM blue traits in your trait pile. +6*sM if you have none."
    },
    {
        name: "The Jellyfish",
        description: "+3*sM if you have sM-5*sM blue traits in your trait pile. +6*sM if you have 6*sM or more."
    },
    {
        name: "The Logician",
        description: "+3*sM if you have 3*sM-5*sM effectless traits in your trait pile. +6*sM if you have 6*sM or more."
    },
    {
        name: "The Lumberjack",
        description: "+3*sM if you have only sM to sM green traits in your trait pile. +6*sM if you have none."
    },
    {
        name: "The Magician",
        description: "+3*sM if you have only 1*sM to 2*sM colorless traits in your trait pile. +6*sM if you have none."
    },
    {
        name: "The Maven",
        description: "+3*sM if you have 10*sM-14*sM traits in your trait pile. +sM if you have 15*sM or more."
    },
    {
        name: "The Soothsayer",
        description: "+3*sM if you have only 1*sM to sM*2 purple traits in your trait pile. +6*sM if you have none."
    },
    {
        name: "The Spirit Gardener",
        description: "+sM*3 if you have 3*sM-5*sM colorless traits in your trait pile. +sM*6 if you have 6 or more."
    },
    {
        name: "The Tigris",
        description: "+3*sM if you have 3*sM-5*sM traits with actions in your trait pile. +sM*6 if you have 6 or more."
    },
    {
        name: "The Vagrant",
        description: "+8*sM if you have fewer traits in your trait pile than your opponents. +6*sM if you're tied for the fewest."
    },
    {
        name: "The Vixen",
        description: "+3*sM if you have 3*sM-5*sM purple traits in your trait pile. +sM*6 if you have 6 or more."
    },
    {
        name: "The Warbler",
        description: "+3*sM if you have 3*sM-5*sM green traits in your trait pile. +6*sM if you have 6 or more."
    },
    {
        name: "The Warrior",
        description: "+3*sM if you have 3*sM-5*sM red traits in your trait pile. +6*sM if you have 6 or more."
    },
    {
        name: "The Weaver",
        description: "+3*sM for each set of all 4 colors (red, green, blue, purple) in your trait pile."
    },
    {
        name: "The Rain Golem",
        description: "+4*sM if you have more blue traits in your trait pile than your opponents, AND +1*sM A FOR every opponent with fewer blue traits in their trait pile than yours."
    },
    {
        name: "The Forest Keeper",
        description: "+4*sM if you have more green traits in your trait pile than your opponents, AND +1*sM for every opponent with fewer green traits in their trait pile than yours."
    },
    {
        name: "The Bramble",
        description: "+4*sM if you have more purple traits in your trait pile than your opponents, AND +1*sM for every opponent with fewer purple traits in their trait pile than yours."
    },
    {
        name: "The Fire Bandit",
        description: "+4*sM if you have more red traits in your trait pile than your opponents, AND +1*sM for every opponent with fewer red traits in their pile than yours."
    },
    {
        name: "The Jungler",
        description: "+4*sM if you have more colorless traits in your trait pile than your opponents, AND +1*sM for every opponent with fewer colorless traits in their trait pile than yours."
    },
    {
        name: "The Diamond Butterfly",
        description: "+2*sM if your trait pile has fewer blue traits than your opponents. +2*sM for fewer green traits. +6*sM if you achieve both goals."
    },
    {
        name: "The Ruby Tortoise",
        description: "+2*sM if your trait pile has fewer green traits than your opponents. +2*sM for fewer purple traits. +6*sM if you achieve both goals."
    },
    {
        name: "The Sapphire Ladybug",
        description: "+2*sM if your trait pile has fewer purple traits than your opponents. +2*sM for fewer red traits. +6*sM if you achieve both goals."
    },
    {
        name: "The Emerald Slug",
        description: "+2*sM if your trait pile has fewer red traits than your opponents. +2*sM for fewer blue traits. +6*sM if you achieve both goals."
    },
    {
        name: "The Tracker",
        description: "+1*sM for each colorless trait in your trait pile if you have all 4 colors in your trait pile."
    },
    {
        name: "The Clashing Crabs",
        description: "+4*sM if you have more negative face value traits in your trait pile than traits with a face value 4 or higher. +8*sM if you have an equal number of both, or none of either."
    },
    {
        name: "Thunder Frogs",
        description: "+2*sM for each different color in your trait pile with exactly one trait with a face value 2."
    },
    {
        name: "The Truffle Hunter",
        description: "+2*sM of you have 3*sM-5*sM traits in your trait pile with a face value of 1. +6*sM if you have 6 or more."
    },
    {
        name: "The Hero",
        description: "+4*sM for each dominant in your trait pile that shares a color/colorless with ONLY 0-1*sM trait in your trait pile. +12*sM if, against all odds, you have 3 dominant traits in your trait pile."
    },
    {
        name: "The Wilted Flower",
        description: "+4*sM if you are tied for the lowest Gene Pool. +7*sM if you have the lowest."
    },
    {
        name: "The Armored Melon",
        description: "+3*sM if you have 3-5 cards in hand. +6*sM if you have 6 or more."
    },
    {
        name: "The Stylite",
        description: "+3*sM if your Drop of Life bonus is 3-6. +7*sM if it's 2 or less."
    },
    {
        name: "The Medicine Master",
        description: "+3*sM if you have 1*sM-2*sM negative face value traits in your trait pile. +7*sM if you have 3 or more."
    },
    {
        name: "The Fortunate Alchemist",
        description: "+2*sM if you have 2*sM/2-4*sM/2 traits in your trait pile with a face value of 0, including non face value cards. +9*sM if you have 5. -4*sM if you have none."
    },
    {
        name: "The River Mist",
        description: "+2*sM to your total trait pile count. +4*sM if you have the most traits in your trait pile AND +1*sM for each opponent with fewer traits in their trait pile than yours."
    },
    {
        name: "The Golden Shrew",
        description: "+4*sM if you have 9*sM-12*sM traits in your trait pile. +7*sM if you have sM*8 or fewer."
    },
    {
        name: "The Blind Dragon",
        description: "To achieve this bonus, you must have 5*sM or more of a color in your trait pile. When scoring Meaning of Life, draw 2*sM Meaning of Life cards and all applicable bonuses to your final score."
    },
    {
        name: "The Silent Elder",
        description: "If you have 4 of fewer of each color in your trait pile, reveal the top 1 card of the trait deck. If you have 3 or fewer of each color, reveal 5. Add all face values of 4*sM or lower to your final score."
    },
    {
        name: "The Painter",
        description: "+3*sM for each color in your trait pile with a color count that equals an even number. (Colors with 0 trait don't count!)"
    },
    {
        name: "The Child and the Bear",
        description: "+1 for every color pair in your trait pile that shares a color with a dominant. (Max +5*sM.) +2 for every pair of you have 2 dominants with the same color. (Max +10*sM.) Dominant traits do not count toward color pairs for these bonuses."
    },
    {
        name: "The Genial Outsider",
        description: "+3*sM if you have 2 or fewer Drop of Lives in your trait pile, AND +6*sM if you ALSO have 3 or fewer actions."
    },
    {
        name: "The Bush Kid",
        description: "+3*sM if you have 3 or more Drop of Lifes in your trait pile, AND +6*sM if you ALSO have 5 or more actions."
    },
    {
        name: "The Parrot's Riddle",
        description: "+9*sM AND -2*sM for each action in your trait pile."
    },
    {
        name: "The Monkey Thief",
        description: "+8*sM AND -3*sM for each Drop of Life in your trait pile."
    },
    {
        name: "The Lunar Guard",
        description: "+4*sM if your trait pile in missing 1 color or colorless. +9*sM if it's missing at least 2 colors, or at least 1 color and colorless."
    }
];

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
     
// Age data arrays
const normalAgeData = [
    {
        name: "Birth of Life",
        description: "Set your gene pool to 5. Play one trait on your turn. Stabilize to end your turn."
    },
    {
        name: "Enlightenment",
        description: "You may discard up to 2 cards from your hand before you stabilize."
    },
    {
        name: "Arid Lands",
        description: "Players cannot play blue traits."
    },
    {
        name: "Tectonic Shift",
        description: "Players cannot play green traits."
    },
    {
        name: "Age of Peace",
        description: "Ignore all trait actions."
    },
    {
        name: "Glacial Drift",
        description: "You may only play traits with a face value of 3 or lower."
    },
    {
        name: "High Tides",
        description: "If you play an effectless trait, you may play another effectless trait."
    },
    {
        name: "Lunar Retreat",
        description: "Players cannot play purple traits."
    },
    {
        name: "Northern Winds",
        description: "Draw 1 card. Discard 1 card from your hand."
    },
    {
        name: "Sea Kingdoms",
        description: "Play 2 traits this turn. Ignore actions."
    },
    {
        name: "Age of Metadata",
        description: "Play this age with your hand revealed."
    },
    {
        name: "Ozmorian Winds",
        description: "After you stabilize, pass 1 card to your left at random."
    },
    {
        name: "Age of Wonder",
        description: "You must end your turn with 4 cards in your hand."
    },
    {
        name: "Alien Terraform",
        description: "You may discard dominant cards from your hand. If you do, then stabilize immediately."
    },
    {
        name: "Atmospheric Thickening",
        description: "Instead of taking this turn, play one trait from the top of the deck. Ignore its action. Do not stabilize. (If it has a requirement you cannot fulfill, discard the card.)"
    },
    {
        name: "Awakening",
        description: "Preview the next age before you take your turn."
    },
    {
        name: "Tropical Lands",
        description: "Players cannot play colorless traits."
    },
    {
        name: "Age of Dracula",
        description: "Discard 1 random card from your hand. If Vampirism is in your trait pile, steal 1 random card from an opponent's hand instead."
    },
    {
        name: "Age of Nietzsche",
        description: "Instead of stabilizing your turn, you may discard your hand and draw 3 cards."
    },
    {
        name: "Age of Reason",
        description: "Draw 3 cards. Keep 1, discard the other 2."
    },
    {
        name: "Comet Showers",
        description: "Discard 1 random card from your hand at random."
    },
    {
        name: "The Messiah",
        description: "Play this age in reverse: first player last and last player first."
    },
    {
        name: "Badlands",
        description: "Discard 1 card. Shuffle the discard pile, and deal 1 card face down to each player. Return any remaining cards to the discard pile."
    },
    {
        name: "Birth of a Hero",
        description: "If you hold Heroic, play it now without restriction."
    },
    {
        name: "Coastal Formations",
        description: "Draw one card after you stabilize."
    },
    {
        name: "Prosperity",
        description: "At the end of your turn, you may choose not to stabilize."
    },
    {
        name: "Reforestation",
        description: "Traits in your trait pile cannot be swapped, stolen, or discarded."
    },
    {
        name: "Temporal Sands",
        description: "Play the effect of the previous age. (Excluding catastrophes.)"
    },
    {
        name: "Natural Harmony",
        description: "You may not play a trait of the same color as the last trait played."
    },
    {
        name: "Flourish",
        description: "Draw 2 cards."
    },
    {
        name: "Joy",
        description: "Draw 1 card, or discard 2 cards."
    },
    {
        name: "Galactic Drift",
        description: "If you play a colorless trait, you may play another colorless trait."
    },
    {
        name: "Eclipse",
        description: "Players cannot play red traits."
    },
    {
        name: "Glimmering Gardens",
        description: "You may discard 1 trait from your trait pile."
    },
    {
        name: "The Living Library",
        description: "Before you stabilize, you may replay an action in your trait pile."
    },
    {
        name: "Backwoods Melodies",
        description: "Play all negative face value traits from your hand. (Excluding dominants.) Ignore actions."
    },
    {
        name: "Tangled Canopies",
        description: "Shuffle the discard pile into the trait deck."
    },
    {
        name: "Lingering Shadows",
        description: "Players cannot play multi-color traits."
    },
    {
        name: "Cleansing Rains",
        description: "You may discard any number of cards from your hand."
    },
    {
        name: "The Painted Valley",
        description: "Choose a color, then draw 1. If it is your chosen color, all opponents also draw 1."
    },
    {
        name: "Rustling Meadows",
        description: "You may discard 1 from your hand. If you do, draw one to replace it."
    },
    {
        name: "Age of Adventure",
        description: "Discard up to 4 from your hand. Draw 1. If it's a color you just discarded, you may play it now. (Excluding dominants.) Ignore actions."
    },
    {
        name: "Age of Certainty",
        description: "For this age, flip the deck upside down and draw cards face-up."
    },
    {
        name: "King of the Jungle",
        description: "All players reveal 1 card from their hand. If you show the highest face value, keep your cards. Otherwise, discard your hand and draw 3. (No ties!)"
    },
    {
        name: "Age of Envy",
        description: "At the end of your turn, stabilize to the size of the Gene Pool on your right."
    },
    {
        name: "Swamplands",
        description: "If you play any traits with actions, discard them after you stabilize, wherever they are."
    },
    {
        name: "Crackletown",
        description: "Choose a color. The player on your left passes you 1 of that color from their hand."
    },
    {
        name: "Star Tails",
        description: "Draw 3 cards. You may not draw any more cards this turn."
    },
    {
        name: "Ramblin' River Markets",
        description: "In turn order, choose a color. Neither you nor the player to your left may play that color this age."
    },
    {
        name: "Summer Solstice",
        description: "You may discard all red cards from your hand."
    },
    {
        name: "Slumberwood",
        description: "Players cannot play dominant traits."
    },
    {
        name: "Rainstorms",
        description: "You may discard all blue cards from your hand."
    },
    {
        name: "Misty Groves",
        description: "You may discard all green cards from your hand."
    },
    {
        name: "The Stranger",
        description: "Draw 1. You may play it immediately. (Excluding dominants.) Ignore actions."
    },
    {
        name: "Dueling Moons",
        description: "Place 1 from your hand on top of the trait deck, OR draw 1 from the bottom of the trait deck."
    },
    {
        name: "Age of Discovery",
        description: "Draw 3 cards."
    },
    {
        name: "Nostalgia",
        description: "You may return a trait in your trait pile to your hand."
    },
    {
        name: "Age of Doubt",
        description: "Players cannot play traits with a negative face value."
    },
    {
        name: "Lunar Advance",
        description: "You may discard all purple cards from your hand."
    },
    {
        name: "The Legend of Mokoko Village",
        description: "Draw 1. If Heroic is in your trait pile, you may play 2 traits on your turn if you ignore their actions."
    },
    {
        name: "Harlequin Falls",
        description: "Choose a color, then draw 3. Keep all of your chosen color and discard the rest."
    },
    {
        name: "Age of Solitude",
        description: "Suppress 1 card from your hand."
    },
    {
        name: "Fading Away",
        description: "After playing a trait and resolving its effect suppress it. (Excluding dominants.)"
    },
    {
        name: "A Quiet Moment",
        description: "Discard up to 3 from your hand. If you start your turn with an empty hand, draw 4."
    },
    {
        name: "Moonlight",
        description: "If your Gene Pool is 4 or higher, discard 1. If your Gene Pool is 3 or lower, draw 2."
    },
    {
        name: "Sunshine & Tea Parties",
        description: "Draw 1 and reveal it to all your friends."
    },
    {
        name: "Glitterstorm",
        description: "Discard 1, 2, or 3 cards from your hand at random. Then stabilize."
    },
    {
        name: "Age of Reverie",
        description: "Suppress 1 random card from hand then pass 1 left."
    },
    {
        name: "Unusual Friends",
        description: "If you play a Deepling, Moonling, or Glittering, draw 2."
    }
];

const merchantAgeData = [
    {
        name: "Bon",
        description: "Bargain: Trash 1 trinket, then gain 1 trinket. You may repeat once."
    },
    {
        name: "Toddles",
        description: "Buy: Gain 1 trinket. Then trash 1."
    },
    {
        name: "Toddles",
        description: "Buy: Gain 1 trinket. Then trash 1."
    },
    {
        name: "Fowler",
        description: "Exchange: You may trash 1 trinket, then gain 1."
    },
    {
        name: "Huk",
        description: "Collect: Pocket 1 trinket, then gain 1."
    },
    {
        name: "Toddles",
        description: "Buy: Gain 1 trinket. Then trash 1."
    },
    {
        name: "Fowler",
        description: "Exchange: You may trash 1 trinket, then gain 1."
    },
    {
        name: "Fowler",
        description: "Exchange: You may trash 1 trinket, then gain 1."
    },
    {
        name: "Huk",
        description: "Collect: Pocket 1 trinket, then gain 1."
    },
    {
        name: "Toddles",
        description: "Buy: Gain 1 trinket. Then trash 1."
    }
];

const catastropheAgeData = [
    {
        name: "Mega Tsunami",
        description: "-1 Gene Pool. Pass your hand to the right.",
        worldsEnd: "Discard 1 red trait from your trait pile at random."
    },
    {
        name: "AI Takeover",
        description: "-1 Gene Pool. Discard all but 1 card from your hand.",
        worldsEnd: "Each colorless trait is now worth 2. Ignore all colorless trait effects. (Excluding dominants.)"
    },
    {
        name: "Nuclear Winter",
        description: "-1 Gene Pool. Stabilize. Then discard one card from your hand.",
        worldsEnd: "Discard one colorless trait from your trait pile."
    },
    {
        name: "Moonpocalypse",
        description: "-2 Gene Pool. This cata cannot reduce your gene pool lower than 4.",
        worldsEnd: "-5 if your genepool is 4 or higher"
    },
    {
        name: "Isolation",
        description: "-1 Gene Pool. If you hold 3 or fewer cards in your hand, suppress one random card in your hand and stabilize.",
        worldsEnd: "If you hold 3 or fewer cards, add the face value of 1 card in your hand to your final score."
    },
    {
        name: "Eyes Open From Behind The Stars",
        description: "-1 Gene Pool. Discard 1 from your hand. The player(s) who discarded the lowest face value must also discard one from their trait pile.",
        worldsEnd: "Discard your highest value trait from your trait pile to the old god."
    },
    {
        name: "Bioengineered Plague",
        description: "-1 Gene Pool. Each player chooses a color. The player on your left discards all cards of that color from their hand.",
        worldsEnd: "Discard 1 random trait from the highest color count in your trait pile. (If 2 or more colors are tied, pick 1.)"
    },
    {
        name: "Impact Event",
        description: "-1 Gene Pool. Discard 1 trait in your hand for every dominant trait in your trait pile.",
        worldsEnd: "-1 for each trait in your trait pile with a face value of 3 or more."
    },
    {
        name: "The Four Horsemen",
        description: "-1 Gene Pool. Discard 1 trait from your trait pile.",
        worldsEnd: "Discard 1 trait from your trait pile with a face value of 4 or higher."
    },
    {
        name: "Grey Goo",
        description: "+0 Gene Pool. Discard your hand and stabilize.",
        worldsEnd: "-5 points to the player(s) with the most traits in their trait pile."
    },
    {
        name: "Retrovirus",
        description: "-1 Gene Pool. Discard 1 trait from your hand for every green traits in your trait pile.",
        worldsEnd: "-1 for every green traits in your trait pile"
    },
    {
        name: "Overpopulation",
        description: "+1 Gene Pool. Draw 1 card for every color type in your trait pile.",
        worldsEnd: "+4 points to the player(s) with the fewest traits in their trait pile."
    },
    {
        name: "Pulse Event",
        description: "-1 Gene Pool. Discard 1 card from your hand for every purple traits in your trait pile.",
        worldsEnd: "Discard 1 purple traits in your trait pile."
    },
    {
        name: "Solar Flare",
        description: "-1 Gene Pool. Discard half your hand rounded up.",
        worldsEnd: "-1 for every purple traits in your trait pile."
    },
    {
        name: "The Big One",
        description: "-1 Gene Pool. Give 1 card from your hand to the opponent(s) on your left and right.",
        worldsEnd: "-2 to your score for every color missing from your trait pile."
    },
    {
        name: "Mass Extinction",
        description: "-1 Gene Pool. Discard 1 card from your hand for every colorless trait in your trait pile.",
        worldsEnd: "Discard 1 green traits from your trait pile."
    },
    {
        name: "Super Volcano",
        description: "-1 Gene Pool. Discard 1 card from your hand for every blue trait in your trait pile.",
        worldsEnd: "-1 for every blue trait in your trait pile."
    },
    {
        name: "Ice Age",
        description: "-1 Gene Pool. Discard 1 trait from your hand for every red trait in your trait pile.",
        worldsEnd: "-1 for every red trait in your trait pile."
    },
    {
        name: "Nuclear Winter",
        description: "-2 Gene Pool. Stabilize.",
        worldsEnd: "Discard 1 colorless trait from your trait pile."
    },
    {
        name: "Glacial Meltdown",
        description: "-1 Gene Pool. Discard 2 cards from your hand at random.",
        worldsEnd: "Discard 1 blue trait from your trait pile at random."
    },
    {
        name: "Ecological Collapse",
        description: "-1 Gene Pool. Discard 1 card from your hand for every color in your trait pile.",
        worldsEnd: "+2 for every negative face value in your trait pile."
    },
    {
        name: "Invasive Species",
        description: "-1 Gene Pool. Pass all green cards from your hand right.",
        worldsEnd: "Discard a card from your hand with a face value of 7 or less and add it to your final score."
    },
    {
        name: "Sacrifice",
        description: "-1 Gene Pool. Return a positive face value trait to your hand.",
        worldsEnd: "-4 if you have 2 or fewer red traits in your trait pile."
    },
    {
        name: "Tropical Superstore",
        description: "-1 Gene Pool. Pass all colorless cards in your hand right.",
        worldsEnd: "+1 for each purple trait in the trait pile to your left."
    },
    {
        name: "Endless Monsoon",
        description: "-1 Gene Pool. Pass all purple cards from your hand right.",
        worldsEnd: "-1 for each card in your hand."
    },
    {
        name: "Choking Vines",
        description: "-1 Gene Pool. Ignore blue and green actions.",
        worldsEnd: "+1 for each green trait in the trait pile to your left."
    },
    {
        name: "Jungle Rot",
        description: "-1 Gene Pool. Ignore red and purple actions.",
        worldsEnd: "-4 if you have 2 or fewer green traits in your trait pile."
    },
    {
        name: "Great Deluge",
        description: "-1 Gene Pool. Pass all blue cards from your hand right.",
        worldsEnd: "-4 if you have 2 or fewer blue traits in your trait pile."
    },
    {
        name: "Ancient Corruption",
        description: "-1 Gene Pool. Discard all actions from your hand.",
        worldsEnd: "-1 for all actions in your trait pile."
    },
    {
        name: "Ashlands",
        description: "-1 Gene Pool. Discard all purple and blue cards from your hand and stabilize.",
        worldsEnd: "-4 if you have 2 or fewer purple traits in your trait pile."
    },
    {
        name: "Strange Matter",
        description: "-1 Gene Pool. Pass all red cards from your hand right.",
        worldsEnd: "-2 for every Drop of Life in your trait pile."
    },
    {
        name: "Tragedy of the Commons",
        description: "-1 Gene Pool. Choose a color in your hand to keep. Discard the rest.",
        worldsEnd: "Discard a Drop of Life from your trait pile."
    },
    {
        name: "Planetary Deforestation",
        description: "-1 Gene Pool. Discard all green and red cards from your hand and stabilize.",
        worldsEnd: "Subtract your gene pool from your final score."
    },
    {
        name: "Algal Superbloom",
        description: "+0 Gene Pool. Draw one for each negative face value in your trait pile.",
        worldsEnd: "+1 for each blue trait in the trait pile to your left."
    },
    {
        name: "Volcanic Winter",
        description: "-1 Gene Pool. Discard all cards from your hand with a face value of 4 or greater.",
        worldsEnd: "+1 for each red trait in the trait pile to your left."
    },
    {
        name: "Too Much Pink",
        description: "-1 Gene Pool. Discard your hand. Draw 4 at the start of your turn.",
        worldsEnd: "Reveal the top card of the trait deck. +1 for each trait of that color in your trait pile."
    },
    {
        name: "Abyss Stares Back",
        description: "-1 Gene Pool. Suppress all cards from your hand. Stabilize.",
        worldsEnd: "-5 if you have 13 or more traits in your trait pile."
    },
    {
        name: "Deus Ex Machina",
        description: "+0 Gene Pool. Stabilize crisis averted.",
        worldsEnd: "Draw a card. Add its face value to its final score (+5 max). Then discard it."
    }
];
        // =================
        // DOMINANT SYSTEM
        // =================
        const dominantData = [
    // ======================
    // BLUE (Sorted A-Z)
    // ======================
    {
        name: "ECHOLOCATION",
        tiers: {
            1: "• Tier 1: Until World's End: Draw 1 card at the start of each of your turns. +4pt.",
            2: "• Tier 2: Until World's End: Draw 2 cards at the start of each of your turns. +6pt.",
            3: "• Tier 3: Until World's End: Draw 3 cards at the start of each of your turns. +9pt.",
            4: "• Tier 4: Until World's End: Draw 4 cards at the start of each of your turns. +12pt.",
            5: "• Tier 5: Until World's End: Draw 5 cards at the start of each of your turns. +15pt."
        }
    },
    {
        name: "ETHEREAL",
        tiers: {
            1: "• Tier 1: Until World's End: If you hold 6 or fewer cards at the end of your turn, you may suppress one from your hand instead of stabilizing. If this effect empties your hand, draw 2. +1pt.",
            2: "• Tier 2: Until World's End: If you hold 8 or fewer cards at the end of your turn, you may suppress two from your hand instead of stabilizing. If this effect empties your hand, draw 3. +3pt.",
            3: "• Tier 3: Until World's End: If you hold any number of cards at the end of your turn, you may suppress two from your hand instead of stabilizing. If this effect empties your hand, draw 4. +6pt.",
            4: "• Tier 4: Until World's End: If you hold any number of cards at the end of your turn, you may suppress three from your hand instead of stabilizing. If this effect empties your hand, draw 5. +9pt.",
            5: "• Tier 5: Until World's End: If you hold any number of cards at the end of your turn, you may suppress any number from your hand instead of stabilizing. If this effect empties your hand, draw 7. +12pt."
        }
    },
    {
        name: "IMMUNITY",
        tiers: {
            1: "• Tier 1: +2 for each trait with a negative face value in your trait pile. +4pt.",
            2: "• Tier 2: +3 for each trait with a negative face value in your trait pile. +6pt.",
            3: "• Tier 3: +4 for each trait with a negative face value in your trait pile. +9pt.",
            4: "• Tier 4: +5 for each trait with a negative face value in your trait pile. +12pt.",
            5: "• Tier 5: +7 for each trait with a negative face value in your trait pile. +15pt."
        }
    },
    {
        name: "LEGENDARY",
        tiers: {
            1: "• Tier 1: Discard your hand; do not stabilize. +8pt.",
            2: "• Tier 2: Discard your hand; draw 2 cards; do not stabilize. +11pt.",
            3: "• Tier 3: Discard your hand; draw 4 cards; do not stabilize. +14pt.",
            4: "• Tier 4: Discard your hand; draw 6 cards; do not stabilize. +17pt.",
            5: "• Tier 5: Discard your hand; draw 10 cards; do not stabilize. +22pt."
        }
    },
    {
        name: "RAVENOUS",
        tiers: {
            1: "• Tier 1: When you play a red trait on your turn, draw three cards before playing its effect. +3pt.",
            2: "• Tier 2: When you play a red trait on your turn, draw four cards before playing its effect. +5pt.",
            3: "• Tier 3: When you play a red or green trait on your turn, draw four cards before playing its effect. +8pt.",
            4: "• Tier 4: When you play a red, green, or blue trait on your turn, draw five cards before playing its effect. +11pt.",
            5: "• Tier 5: When you play any trait on your turn, draw six cards before playing its effect. +15pt."
        }
    },
    {
        name: "TINY",
        tiers: {
            1: "• Tier 1: -1 for each trait in your trait pile. Including this one. +17pt.",
            2: "• Tier 2: -0.5 for each trait in your trait pile. Including this one. +20pt.",
            3: "• Tier 3: No penalty for traits in your trait pile. +23pt.",
            4: "• Tier 4: +0.5 for each trait in your trait pile. Including this one. +26pt.",
            5: "• Tier 5: +1 for each trait in your trait pile. Including this one. +30pt."
        }
    },
   
    // ======================
    // COLORLESS (Sorted A-Z)
    // ======================
    {
        name: "DENIAL",
        tiers: {
            1: "• Tier 1: Ignore the next catastrophe. Warning: You cannot ignore The Four Horsemen. +4pt.",
            2: "• Tier 2: Ignore the next 2 catastrophes. Warning: You cannot ignore The Four Horsemen. +8pt.",
            3: "• Tier 3: Ignore the next 3 catastrophe. +12pt.",
            4: "• Tier 4: Ignore the next 4 catastrophes. +16pt.",
            5: "• Tier 5: Ignore all catastrophes. +20pt."
        }
    },
    {
        name: "FAITH",
        tiers: {
            1: "• Tier 1: At World's End: You may change all of your color traits of one color to 1 alternative color. +4pt.",
            2: "• Tier 2: At World's End: You may change all of your color traits of one color to 1 alternative color. Gain +1 for each trait changed. +6pt.",
            3: "• Tier 3: At World's End: You may change all of your color traits of up to two colors to 1 alternative color each. +8pt.",
            4: "• Tier 4: At World's End: You may change all of your color traits of up to three colors to any alternative colors. +12pt.",
            5: "• Tier 5: At World's End: You may change all of your color traits to any colors you wish. Gain +2 for each trait changed. +15pt."
        }
    },
    {
        name: "JIB WIB",
        tiers: {
            1: "• Tier 1: +5 to all players with a gene pool of 2 or lower. +6pt.",
            2: "• Tier 2: +8 to all players with a gene pool of 2 or lower. +8pt.",
            3: "• Tier 3: +10 to all players with a gene pool of 3 or lower. +10pt.",
            4: "• Tier 4: +12 to all players with a gene pool of 4 or lower. +12pt.",
            5: "• Tier 5: +15 to all players regardless of gene pool. +15pt."
        }
    },
    {
        name: "OPTIMISTIC NIHILISM",
        tiers: {
            1: "• Tier 1: Bring about the next catastrophe. Skip all turns; ignore all age effects along the way. Do not stabilize. +4pt.",
            2: "• Tier 2: Bring about the next catastrophe. Skip all turns; ignore all age effects along the way. Draw 3 cards after. Do not stabilize. +7pt.",
            3: "• Tier 3: Bring about the next 2 catastrophes. Skip all turns; ignore all age effects along the way. Draw 4 cards after. Do not stabilize. +10pt.",
            4: "• Tier 4: Bring about the next 3 catastrophes. Skip all turns; ignore all age effects along the way. Draw 5 cards after. Do not stabilize. +14pt.",
            5: "• Tier 5: Bring about all remaining catastrophes. Skip all turns; ignore all age effects along the way. Draw 7 cards after. Do not stabilize. +20pt."
        }
    },
    {
        name: "STYGIAN",
        tiers: {
            1: "• Tier 1: At World's End: Choose a color. Suppress all traits of that color in your trait pile. -2 for each color in your trait pile. +10pt.",
            2: "• Tier 2: At World's End: Choose a color. Suppress all traits of that color in your trait pile. -1 for each color in your trait pile. +13pt.",
            3: "• Tier 3: At World's End: Choose a color. Suppress all traits of that color in your trait pile. No penalty for colors in your trait pile. +16pt.",
            4: "• Tier 4: At World's End: Choose a color. Suppress all traits of that color in your trait pile. +1 for each color in your trait pile. +19pt.",
            5: "• Tier 5: At World's End: Choose two colors. Suppress all traits of those colors in your trait pile. +2 for each color in your trait pile. +22pt."
        }
    },
    {
        name: "RUGGEDIZED",
        tiers: {
            1: "• Tier 1: Attach to a trait. Host trait cannot be removed from your trait pile. You may attach to a new host trait at the end of each of your turns. +4pt.",
            2: "• Tier 2: Attach to a trait. Host trait cannot be removed from your trait pile. You may attach to a new host trait at any time during your turn. +7pt.",
            3: "• Tier 3: Attach to two traits. Host traits cannot be removed from your trait pile. You may attach to new host traits at the end of each of your turns. +10pt.",
            4: "• Tier 4: Attach to three traits. Host traits cannot be removed from your trait pile. You may attach to new host traits at any time during your turn. +13pt.",
            5: "• Tier 5: Attach to any number of traits of a single color. Host traits cannot be removed from your trait pile. You may change your chosen color at the end of each of your turns. +16pt."
        }
    },
   
   
    // ======================
    // GREEN (Sorted A-Z)
    // ======================
    {
        name: "HEROIC",
        tiers: {
            1: "• Tier 1: To play, you must have 3 or more green traits from your trait pile. +7pt.",
            2: "• Tier 2: To play, you must have 2 or more green traits from your trait pile. +10pt.",
            3: "• Tier 3: To play, you must have 1 or more green traits from your trait pile. +13pt.",
            4: "• Tier 4: No requirement to play. +1 for each green trait in your pile. +15pt.",
            5: "• Tier 5: No requirement to play. +2 for each green trait in your pile. +18pt."
        }
    },
    {
        name: "IRONWOOD",
        tiers: {
            1: "• Tier 1: Excluding dominants, if you have 5 or fewer green traits in your trait pile, they cannot be removed. +3pt.",
            2: "• Tier 2: Excluding dominants, if you have 7 or fewer green traits in your trait pile, they cannot be removed. +5pt.",
            3: "• Tier 3: Excluding dominants, all green traits in your trait pile cannot be removed. +8pt.",
            4: "• Tier 4: All green traits in your trait pile cannot be removed, including dominants. +11pt.",
            5: "• Tier 5: All green traits in your trait pile cannot be removed, including dominants. Gain +1 for each green trait protected. +15pt."
        }
    },
    {
        name: "PACK BEHAVIOR",
        tiers: {
            1: "• Tier 1: +1 for every color pair in your trait pile. +3pt.",
            2: "• Tier 2: +2 for every color pair in your trait pile. +5pt.",
            3: "• Tier 3: +3 for every color pair in your trait pile. +8pt.",
            4: "• Tier 4: +4 for every color pair in your trait pile. +11pt.",
            5: "• Tier 5: +5 for every color pair in your trait pile. +15pt."
        }
    },
    {
        name: "PACK BEHAVIOR",
        tiers: {
            1: "• Tier 1: +1 for every color pair in your trait pile. +3pt.",
            2: "• Tier 2: +2 for every color pair in your trait pile. +5pt.",
            3: "• Tier 3: +3 for every color pair in your trait pile. +8pt.",
            4: "• Tier 4: +4 for every color pair in your trait pile. +11pt.",
            5: "• Tier 5: +5 for every color pair in your trait pile. +15pt."
        }
    },
    {
        name: "POPPLEBELLY",
        tiers: {
            1: "• Tier 1: Your gene pool is 1 and cannot be modified. Draw 2 at the start of each of your turns. +4pt.",
            2: "• Tier 2: Your gene pool is 2 and cannot be modified. Draw 2 at the start of each of your turns. +6pt.",
            3: "• Tier 3: Your gene pool is 3 and cannot be modified. Draw 3 at the start of each of your turns. +8pt.",
            4: "• Tier 4: Your gene pool is 4 and cannot be modified. Draw 4 at the start of each of your turns. +10pt.",
            5: "• Tier 5: Your gene pool is 5 and cannot be modified. Draw 5 at the start of each of your turns. +15pt."
        }
    },
    {
        name: "PYROPHYTE",
        tiers: {
            1: "• Tier 1: At World's End: Draw 4 cards; you may play any with a face value of 2 or lower, ignore actions. +1pt.",
            2: "• Tier 2: At World's End: Draw 5 cards; you may play any with a face value of 3 or lower, ignore actions. +3pt.",
            3: "• Tier 3: At World's End: Draw 6 cards; you may play any with a face value of 4 or lower, ignore actions. +5pt.",
            4: "• Tier 4: At World's End: Draw 7 cards; you may play any with a face value of 5 or lower, keep their actions. +8pt.",
            5: "• Tier 5: At World's End: Draw 10 cards; you may play any cards regardless of face value, keep their actions. +12pt."
        }
    },
    {
        name: "SYMBIOSIS",
        tiers: {
            1: "• Tier 1: +2 for every trait in your lowest color count. Must have 2 or more colors. If there's a tie, pick one. +3pt.",
            2: "• Tier 2: +3 for every trait in your lowest color count. Must have 2 or more colors. If there's a tie, pick one. +5pt.",
            3: "• Tier 3: +4 for every trait in your lowest color count. Must have 2 or more colors. If there's a tie, pick one. +8pt.",
            4: "• Tier 4: +5 for every trait in your lowest color count. If there's a tie, pick all tied colors. +11pt.",
            5: "• Tier 5: +6 for every trait in your lowest color count. No color requirement. If there's a tie, pick all tied colors. +15pt."
        }
    },
   
    // ======================
    // PURPLE (Sorted A-Z)
    // ======================
    {
        name: "CAMOUFLAGE",
        tiers: {
            1: "• Tier 1: +1 gene pool. +1 for each card in your hand. +1pt.",
            2: "• Tier 2: +1 gene pool. +2 for each card in your hand. +3pt.",
            3: "• Tier 3: +2 gene pool. +2 for each card in your hand. +6pt.",
            4: "• Tier 4: +2 gene pool. +3 for each card in your hand. +9pt.",
            5: "• Tier 5: +3 gene pool. +4 for each card in your hand. +12pt."
        }
    },
    {
        name: "VAMPIRISM",
        tiers: {
            1: "• Tier 1: Steal a trait from an opponent's trait pile; play its action. +3pt.",
            2: "• Tier 2: Steal a trait from an opponent's trait pile; play its action. You may keep the trait in your trait pile. +6pt.",
            3: "• Tier 3: Steal two traits from any opponent's trait piles; play their actions. You may keep one trait in your trait pile. +9pt.",
            4: "• Tier 4: Steal three traits from any opponent's trait piles; play their actions. You may keep two traits in your trait pile. +12pt.",
            5: "• Tier 5: Steal five traits from any opponent's trait piles or steal one dominant; play their actions. You may keep all traits in your trait pile. +15pt."
        }
    },
    {
        name: "VAMPIRISM",
        tiers: {
            1: "• Tier 1: Steal a trait from an opponent's trait pile; play its action. +3pt.",
            2: "• Tier 2: Steal a trait from an opponent's trait pile; play its action. You may keep the trait in your trait pile. +6pt.",
            3: "• Tier 3: Steal two traits from any opponent's trait piles; play their actions. You may keep one trait in your trait pile. +9pt.",
            4: "• Tier 4: Steal three traits from any opponent's trait piles; play their actions. You may keep two traits in your trait pile. +12pt.",
            5: "• Tier 5: Steal five traits from any opponent's trait piles or steal one dominant; play their actions. You may keep all traits in your trait pile. +15pt."
        }
    },
    {
        name: "VIRAL",
        tiers: {
            1: "• Tier 1: At World's End: Choose a color. Opponents receive -1 for each trait of that color in their trait pile. +2pt.",
            2: "• Tier 2: At World's End: Choose a color. Opponents receive -2 for each trait of that color in their trait pile. +4pt.",
            3: "• Tier 3: At World's End: Choose two colors. Opponents receive -2 for each trait of those colors in their trait pile. +7pt.",
            4: "• Tier 4: At World's End: Choose three colors. Opponents receive -3 for each trait of those colors in their trait pile. +10pt.",
            5: "• Tier 5: At World's End: Opponents receive -4 for each trait in their trait pile. +15pt."
        }
    },
    {
        name: "VIRAL",
        tiers: {
            1: "• Tier 1: At World's End: Choose a color. Opponents receive -1 for each trait of that color in their trait pile. +2pt.",
            2: "• Tier 2: At World's End: Choose a color. Opponents receive -2 for each trait of that color in their trait pile. +4pt.",
            3: "• Tier 3: At World's End: Choose two colors. Opponents receive -2 for each trait of those colors in their trait pile. +7pt.",
            4: "• Tier 4: At World's End: Choose three colors. Opponents receive -3 for each trait of those colors in their trait pile. +10pt.",
            5: "• Tier 5: At World's End: Opponents receive -4 for each trait in their trait pile. +15pt."
        }
    },
   
    // ======================
    // RED (Sorted A-Z)
    // ======================
    {
        name: "APEX PREDATOR",
        tiers: {
            1: "• Tier 1: +4 if you have more traits in your trait pile than your opponents. Ties don't count. +4pt.",
            2: "• Tier 2: +7 if you have more traits in your trait pile than your opponents. Ties don't count. +6pt.",
            3: "• Tier 3: +10 if you have more traits in your trait pile than your opponents. Ties count in your favor. +9pt.",
            4: "• Tier 4: +15 if you have more traits in your trait pile than at least one opponent. +12pt.",
            5: "• Tier 5: +20 if you have more traits in your trait pile than at least one opponent. You also receive +1 for each trait over your closest opponent. +15pt."
        }
    },
    {
        name: "CARNOSAUR JAW",
        tiers: {
            1: "• Tier 1: To play, you must discard 2 red traits from your trait pile. +9pt.",
            2: "• Tier 2: To play, you must discard 1 red trait from your trait pile. +12pt.",
            3: "• Tier 3: To play, you must discard 1 trait of any color from your trait pile. +15pt.",
            4: "• Tier 4: No requirement to play. +18pt.",
            5: "• Tier 5: No requirement to play. Gain +2 for each red trait in your trait pile. +22pt."
        }
    },
    {
        name: "HYPER-INTELLIGENCE",
        tiers: {
            1: "• Tier 1: At World's End: Choose a color. Opponents discard 1 trait from their trait pile at random. +4pt.",
            2: "• Tier 2: At World's End: Choose a color. Opponents discard 2 traits from their trait pile at random. +7pt.",
            3: "• Tier 3: At World's End: Choose two colors. Opponents discard 2 traits of those colors from their trait pile. +10pt.",
            4: "• Tier 4: At World's End: Choose three colors. Opponents discard 3 traits of those colors from their trait pile. +13pt.",
            5: "• Tier 5: At World's End: Opponents discard 5 traits from their trait pile. You choose which traits they discard. +16pt."
        }
    },
    {
        name: "INDOMITABLE",
        tiers: {
            1: "• Tier 1: -2 gene pool. +8pt.",
            2: "• Tier 2: -1 gene pool. +11pt.",
            3: "• Tier 3: No gene pool penalty. +14pt.",
            4: "• Tier 4: +1 gene pool. +17pt.",
            5: "• Tier 5: +2 gene pool. +20pt."
        }
    },
    {
        name: "INDOMITABLE",
        tiers: {
            1: "• Tier 1: -2 gene pool. +8pt.",
            2: "• Tier 2: -1 gene pool. +11pt.",
            3: "• Tier 3: No gene pool penalty. +14pt.",
            4: "• Tier 4: +1 gene pool. +17pt.",
            5: "• Tier 5: +2 gene pool. +20pt."
        }
    },
    {
        name: "MIMICRY",
        tiers: {
            1: "• Tier 1: If you only play 1 trait on your turns, you may play 1 trait with a face value of 1 after you stabilize; ignore its action. +1pt.",
            2: "• Tier 2: If you only play 1 trait on your turns, you may play 1 trait with a face value of 2 or lower after you stabilize; ignore its action. +4pt.",
            3: "• Tier 3: If you only play 1 trait on your turns, you may play 1 trait with a face value of 3 or lower after you stabilize; you may choose to use its action. +7pt.",
            4: "• Tier 4: If you play any number of traits on your turns, you may play 1 trait with a face value of 4 or lower after you stabilize; you may choose to use its action. +10pt.",
            5: "• Tier 5: If you play any number of traits on your turns, you may play 2 traits of any value after you stabilize; you may choose to use their actions. +13pt."
        }
    },
    {
        name: "REMARKABLE",
        tiers: {
            1: "• Tier 1: To play, you must hold 3 or fewer cards. All your friends pass their hands right not you and stabilize. Then suppress your hand. +1pt.",
            2: "• Tier 2: To play, you must hold 4 or fewer cards. All your friends pass their hands right not you and stabilize. Then suppress your hand. +4pt.",
            3: "• Tier 3: To play, you must hold 5 or fewer cards. All your friends pass their hands right not you and stabilize. Draw 2 cards. Then suppress your hand. +7pt.",
            4: "• Tier 4: To play, you must hold 6 or fewer cards. All your friends pass their hands right not you and stabilize. Draw 4 cards. Then suppress your hand. +10pt.",
            5: "• Tier 5: No requirement to play. All your friends pass their hands right not you and stabilize. Draw 6 cards. Then suppress your hand. +13pt."
        }
    },
    {
        name: "SENTIENCE",
        tiers: {
            1: "• Tier 1: At World's End: Choose a color. +1 for all traits of that color in your trait pile. +2pt.",
            2: "• Tier 2: At World's End: Choose a color. +2 for all traits of that color in your trait pile. +5pt.",
            3: "• Tier 3: At World's End: Choose two colors. +2 for all traits of those colors in your trait pile. +8pt.",
            4: "• Tier 4: At World's End: Choose three colors. +3 for all traits of those colors in your trait pile. +11pt.",
            5: "• Tier 5: At World's End: +4 for all traits in your trait pile. +15pt."
        }
    },
    {
        name: "SPOTS",
        tiers: {
            1: "• Tier 1: At World's End: Choose a color. All opponents reveal all cards of that color from their hand. Play one immediately; ignore actions. +5pt.",
            2: "• Tier 2: At World's End: Choose a color. All opponents reveal all cards of that color from their hand. Play two immediately; ignore actions. +8pt.",
            3: "• Tier 3: At World's End: Choose two colors. All opponents reveal all cards of those colors from their hand. Play two immediately; you may use their actions. +11pt.",
            4: "• Tier 4: At World's End: Choose three colors. All opponents reveal all cards of those colors from their hand. Play three immediately; you may use their actions. +14pt.",
            5: "• Tier 5: At World's End: All opponents reveal their entire hand. Play any five cards immediately; you may use their actions. +18pt."
        }
    },
   
    // ======================
    // MULTI-COLOR (Sorted A-Z)
    // ======================
    {
        name: "AWESOME",
        tiers: {
            1: "• Tier 1: At World's End: Stabilize to 2; add 2 face values in your hand to your score (max +17). +1pt (redgreenbluepurple).",
            2: "• Tier 2: At World's End: Stabilize to 3; add 3 face values in your hand to your score (max +20). +4pt (redgreenbluepurple).",
            3: "• Tier 3: At World's End: Stabilize to 4; add 4 face values in your hand to your score (max +25). +7pt (redgreenbluepurple).",
            4: "• Tier 4: At World's End: Stabilize to 5; add 5 face values in your hand to your score (max +30). +10pt (redgreenbluepurple).",
            5: "• Tier 5: At World's End: Stabilize to 7; add all face values in your hand to your score (no maximum). +15pt (redgreenbluepurple)."
        }
    },
    {
        name: "LILY PAD",
        tiers: {
            1: "• Tier 1: At World's End: Return up to 3 traits from your trait pile to your hand. +1 for each trait retuned this way. +2pt (greenblue).",
            2: "• Tier 2: At World's End: Return up to 4 traits from your trait pile to your hand. +2 for each trait retuned this way. +4pt (greenblue).",
            3: "• Tier 3: At World's End: Return up to 5 traits from your trait pile to your hand. +3 for each trait retuned this way. +7pt (greenblue).",
            4: "• Tier 4: At World's End: Return up to 7 traits from your trait pile to your hand. +4 for each trait retuned this way. +10pt (greenblue).",
            5: "• Tier 5: At World's End: Return any number of traits from your trait pile to your hand. +5 for each trait retuned this way. +15pt (greenblue)."
        }
    },
    {
        name: "RAINBOW MAGIC",
        tiers: {
            1: "• Tier 1: You may return Rainbow Magic to your hand after you stabilize, then play one random card from your hand. Ignore restrictions and requirements. +3pt (redgreenbluepurple).",
            2: "• Tier 2: You may return Rainbow Magic to your hand after you stabilize, then play two random cards from your hand. Ignore restrictions and requirements. +6pt (redgreenbluepurple).",
            3: "• Tier 3: You may return Rainbow Magic to your hand after you stabilize, then play three random cards from your hand. Ignore restrictions and requirements. +9pt (redgreenbluepurple).",
            4: "• Tier 4: You may return Rainbow Magic to your hand after you stabilize, then play up to three cards of your choice from your hand. Ignore restrictions and requirements. +12pt (redgreenbluepurple).",
            5: "• Tier 5: You may return Rainbow Magic to your hand after you stabilize, then play any number of cards from your hand. Ignore restrictions and requirements. +15pt (redgreenbluepurple)."
        }
    },
    {
        name: "WILD",
        tiers: {
            1: "• Tier 1: +4pt (greenredbluepurple).",
            2: "• Tier 2: +8pt (greenredbluepurple).",
            3: "• Tier 3: +12pt (greenredbluepurple).",
            4: "• Tier 4: +18pt (greenredbluepurple).",
            5: "• Tier 5: +25pt (greenredbluepurple)."
        }
    }
];// Add your dominant data here as objects with name and tiers properties

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

        

        // =================
        // BASE GAME SYSTEM
        // =================
        const normalRules = [
            "1. Evolution Overdrive: Draw 8 cards, keep all of them. All other players draw 2 cards and must give 1 to any player of their choice.",
            "2. Genetic Dominance: Play unlimited traits this round. For each trait played beyond the first 3, steal 1 random trait from any player's trait pile without stealing more than 2 total from each pile.",
            "3. Resource Monopoly: Take 3 random cards from each other player. You don't have to give any cards away this turn.",
            "4. Adaptive Supremacy: Draw 6 cards, discard 1 trait from your trait pile excluding dominants. You choose which 3 cards to keep and discard the other 3. Then you have to play one of the 3 you kept.",
            "5. Apex Evolution: Play up to 5 traits this turn. For each trait played, look at another player's hand and take 1 card of your choice. Play all chosen traits up to five before picking traits to steal.",
            "6. Mutation Mastery: Look at top 10 cards of deck, add 5 to your hand and play 1, then place the other 5 on bottom of deck. You may reorganize your trait pile to move attachments or anything else.",
 "7. Dominant Exchange: You may discard up to 2 dominant traits from your trait pile. For each dominant discarded this way, draw 5 cards and keep any 1 dominant you draw (discard the rest)."
        ];

        const catastropheRules = [
            "1. Extinction Curse: You must shuffle your trait pile and remove 5 random traits. All other players remove 2 random traits.",
            "2. Genetic Collapse: Give your entire hand to another player. Discard 3 traits from your trait pile. Other players discard 1.",
            "3. Evolutionary Dead End: All other players may take 2 traits each from your trait pile. You draw 3 cards as compensation.",
            "4. Cosmic Punishment: You must sacrifice your 3 highest value traits in your trait pile including dominants. Other players sacrifice their lowest value trait.",
            "5. Dimensional Exile: Your hand is shuffled into the deck. Other players discard down to 3 cards but keep their best cards.",
            "6. Selective Pressure: You must discard 5 traits of a color chosen by the player to your right. Other players discard 2 trait of that color.",
"7. Dominant Decay: All dominants in your trait pile must be reduced by 1 tier (minimum tier 1) unless you discard 2 other traits from your trait pile for each dominant you wish to preserve."
        ];

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
    scrollToCurrentAge();
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
           
            scrollToCurrentAge();
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

// Add this function to your JavaScript
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
        // Scroll will happen in displayCurrentAge()
    }
}

function nextAge() {
    if (currentAgeIndex < currentAgeDeck.length - 1) {
        currentAgeIndex++;
        displayCurrentAge();
        // Scroll will happen in displayCurrentAge()
    }
}

const trinketData = [
  { name: "Unsolvable puzzle", power: "When stabilizing, stabilize to 4.", objective: "Play: Action.", points: 1 },
  { name: "Collector's cap", power: "If you play red, you may draw 1.", objective: "Reveal: 1 purple in hand.", points: 1 },
  { name: "Forbidden mushroom", power: "If you play purple, you may draw 1.", objective: "Reveal: 1 blue in hand.", points: 1 },
  { name: "Half-off sandwich", power: "Negative traits cannot be played in your trait pile.", objective: "Play: Face value 2 or higher.", points: 1 },
  { name: "Invisible painting", power: "Start of turn: You may play 1 effectless.", objective: "Play: Effectless.", points: 1 },
  { name: "Spyglass", power: "If you play blue, you may draw 1.", objective: "Reveal: 1 green in hand.", points: 1 },
  { name: "Tiny house", power: "Start of turn: You may discard 1 from hand.", objective: "Play: Face value 2 or higher.", points: 1 },
  { name: "Treasure goggles", power: "Start of turn: Draw 1.", objective: "Play: Face value of 1.", points: 1 },
  { name: "Unicorn horn", power: "If you play green, you may draw 1.", objective: "Reveal: 1 red in hand.", points: 1 },
  { name: "Anxiety elixir", power: "Start of turn: Discard dominants from hand.", objective: "Reveal: 2 reds in hand.", points: 2 },
  { name: "World's end insurance", power: "At World's End: Instead of losing this item, pocket it.", objective: "Play: 2 traits on 1 turn.", points: 2 },
  { name: "Apathy stone", power: "Cannot play blue.", objective: "Play: 1 colorless.", points: 2 },
  { name: "Bottled air", power: "Cannot play more than 1 trait on your turn.", objective: "Reveal: 2 blues in hand.", points: 2 },
  { name: "Chu box", power: "Cannot play dominants.", objective: "Reveal: 2 greens in hand.", points: 2 },
  { name: "Dimming hat", power: "Prevent actions that you play.", objective: "Play: Action.", points: 2 },
  { name: "Gilded lily", power: "Cannot draw unless stabilizing.", objective: "Reveal: 2 colorless in hand.", points: 2 },
  { name: "Lemony lemons", power: "Cannot play colorless.", objective: "Play: 1 green.", points: 2 },
  { name: "Mysterious lantern", power: "Cannot play purple.", objective: "Play: 1 red.", points: 2 },
  { name: "Omniscient ball", power: "Cannot play effectless.", objective: "Reveal: 2 colorless in hand.", points: 2 },
  { name: "Party mask", power: "Cannot play Drop of Life.", objective: "Hand discard: 1 blue or purple.", points: 2 },
  { name: "Pointy stick", power: "Cannot play red.", objective: "Play: 1 purple.", points: 2 },
  { name: "Silby bark", power: "Prevent actions that you play.", objective: "Reveal: 2 purples in hand.", points: 2 },
  { name: "Tome of common knowledge", power: "Cannot play green.", objective: "Play: 1 blue.", points: 2 },
  { name: "Glass hammer", power: "Cannot play traits with actions.", objective: "Hand discard: 1 red or green.", points: 3 },
  { name: "Glitter pouch", power: "Cannot play blue.", objective: "Trait pile: 3 greens.", points: 3 },
  { name: "Harmonic sea shell", power: "Cannot play purple.", objective: "Trait pile: 3 colorless.", points: 3 },
  { name: "Perpetual motion machine", power: "Cannot play colorless.", objective: "Trait pile: 3 reds.", points: 3 },
  { name: "Terror root", power: "Cannot play green.", objective: "Trait pile: 3 blues.", points: 3 },
  { name: "Tome of hidden knowledge", power: "Cannot play red.", objective: "Trait pile: 3 purples.", points: 3 },
  { name: "Unlabeled vial", power: "Cannot play traits on opponents' turns.", objective: "Trait pile: 2 dominants.", points: 3 },
  { name: "Unusual tooth", power: "When stabilizing, stabilize to 4.", objective: "Play: 1 negative.", points: 3 },
  { name: "Crackle ore", power: "When stabilizing, stabilize to 4.", objective: "Draw: 2 on your turn.", points: 4 },
  { name: "Fool's gold", power: "Cannot play dominants.", objective: "Hand discard: 1 dominant.", points: 4 },
  { name: "Galaxy in a jar", power: "Cannot play face value 1.", objective: "Reveal: 2 dominants in hand.", points: 4 },
  { name: "Muffins", power: "Cannot play face value 3 or higher.", objective: "Trait pile: 2 negatives.", points: 4 },
  { name: "T.O.M. Four", power: "Your opponents may draw 1 at the start of your turn. (If they notice...)", objective: "Reveal: 3 different colors in hand.", points: 4 },
  { name: "Weird map", power: "Start of turn: Discard 1 from hand.", objective: "Trait pile: 4 of the same color.", points: 4 },
  { name: "Izzy", power: "Cannot play colorless.", objective: "Reveal: 4 different colors in hand.", points: 5 },
  { name: "Philosopher's key", power: "Cannot play more than 1 trait on your turn.", objective: "Trait pile: 2 of each color.", points: 5 },
  { name: "Shade berry", power: "You may discard 1 dominant in your trait pile with your trait effects.", objective: "Trait pile removal: 1 dominant.", points: 5 }
];

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
   
    // Calculate scaling multiplier (total ages / 20)
    // 20 is considered the average number of ages in a normal game
    const sM = Math.max(1, totalAges / 20);
   
    return sM;
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
  `;
  document.head.appendChild(style);
});

        // Initialize
        updateNameInputs(2);
        generateDominantList();
        updatePlayerSelects();
        updateAgeSliders();
        initializeMeaningOfLife();
        initializeTrinkets();
        switchToChallengePage();