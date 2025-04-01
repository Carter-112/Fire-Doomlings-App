// Local Storage management functions
// (Changed from cookies to localStorage per user request)

function setCookie(name, value, days = 7) {
    // Convert to JSON string and store in localStorage
    // days parameter is ignored as localStorage doesn't expire
    try {
        localStorage.setItem(name, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function getCookie(name) {
    try {
        const value = localStorage.getItem(name);
        if (value === null) {
            return null;
        }
        return JSON.parse(value);
    } catch (e) {
        console.error('Error retrieving from localStorage:', e);
        return null;
    }
}

function deleteCookie(name) {
    try {
        localStorage.removeItem(name);
    } catch (e) {
        console.error('Error deleting from localStorage:', e);
    }
}

// Game state specific functions
function saveGameState() {
    // Save player names from challenges
    const playerNames = Array.from(document.querySelectorAll('.name-input'))
        .map(input => input.value.trim() || input.placeholder);
    setCookie('playerNames', playerNames);

    // Save age setup
    setCookie('ageSetup', {
        normalAges: parseInt(document.getElementById('normalSlider').value),
        merchantAges: parseInt(document.getElementById('merchantSlider').value),
        catastropheAges: parseInt(document.getElementById('catastropheSlider').value),
        finalCatastropheAtEnd: document.getElementById('finalCatastropheMode').checked
    });

    // Save dominant data (tiers and player assignments)
    const dominantState = {};
    document.querySelectorAll('.dominant-card').forEach(card => {
        const stableId = card.dataset.stableId;
        if (stableId) {
            dominantState[stableId] = {
                tier: card.dataset.currentTier || null,
                player: card.querySelector('.player-select')?.value || null
            };
        }
    });
    setCookie('dominantState', dominantState);
    
    // Also explicitly save the persistentTierSelections object
    setCookie('persistentTierSelections', persistentTierSelections);

    // Save trinket data
    setCookie('playerTrinkets', playerTrinkets);
    setCookie('playerTrinketScores', playerTrinketScores);
    setCookie('availableTrinkets', availableTrinkets);

    // Save meaning of life data
    setCookie('playerMeaningCards', playerMeaningCards);
    setCookie('playerMeaningChoices', playerMeaningChoices);
    
    // Save current age deck and index
    setCookie('currentAgeDeck', currentAgeDeck);
    setCookie('currentAgeIndex', currentAgeIndex);
    
    console.log("Game state saved successfully");
}

function loadGameState() {
    // Load player names
    const savedPlayerNames = getCookie('playerNames');
    if (savedPlayerNames) {
        const inputs = document.querySelectorAll('.name-input');
        savedPlayerNames.forEach((name, index) => {
            if (inputs[index]) inputs[index].value = name;
        });
        // Update player count to match saved names
        const playerSlider = document.getElementById('playerSlider');
        if (playerSlider) {
            playerSlider.value = savedPlayerNames.length;
            document.getElementById('playerCount').textContent = savedPlayerNames.length;
        }
    }

    // Load age setup
    const savedAgeSetup = getCookie('ageSetup');
    if (savedAgeSetup) {
        // Update UI elements
        document.getElementById('normalSlider').value = savedAgeSetup.normalAges;
        document.getElementById('merchantSlider').value = savedAgeSetup.merchantAges;
        document.getElementById('catastropheSlider').value = savedAgeSetup.catastropheAges;
        document.getElementById('finalCatastropheMode').checked = savedAgeSetup.finalCatastropheAtEnd;
        
        // Update displayed counts
        document.getElementById('normalCount').textContent = savedAgeSetup.normalAges;
        document.getElementById('merchantCount').textContent = savedAgeSetup.merchantAges;
        document.getElementById('catastropheCount').textContent = savedAgeSetup.catastropheAges;
        
        // Update the ageSetup object in memory
        ageSetup.normalAges = savedAgeSetup.normalAges;
        ageSetup.merchantAges = savedAgeSetup.merchantAges;
        ageSetup.catastropheAges = savedAgeSetup.catastropheAges;
        ageSetup.finalCatastropheAtEnd = savedAgeSetup.finalCatastropheAtEnd;
    }
    
    // Load persistent tier selections
    const savedTierSelections = getCookie('persistentTierSelections');
    if (savedTierSelections) {
        // Update the global variable directly
        persistentTierSelections = savedTierSelections;
    }

    // Load dominant data
    const savedDominantState = getCookie('dominantState');
    if (savedDominantState) {
        Object.entries(savedDominantState).forEach(([stableId, data]) => {
            const card = document.querySelector(`.dominant-card[data-stable-id="${stableId}"]`);
            if (card) {
                if (data.tier) {
                    card.dataset.currentTier = data.tier;
                    const tierSelect = card.querySelector('.tier-select');
                    if (tierSelect) tierSelect.value = data.tier;
                    
                    // Update the tier display
                    const tierDisplay = card.querySelector('.tier-display');
                    if (tierDisplay) {
                        tierDisplay.textContent = data.tier;
                        tierDisplay.style.background = `hsl(${130 - (data.tier * 15)}, 70%, 30%)`;
                    }
                    
                    // Update the description
                    const descDisplay = card.querySelector('.tier-description');
                    if (descDisplay) {
                        const domName = card.querySelector('.dominant-name').textContent.trim();
                        const dominant = dominantData.find(d => d.name === domName);
                        if (dominant && dominant.tiers && dominant.tiers[data.tier]) {
                            descDisplay.textContent = dominant.tiers[data.tier];
                            descDisplay.style.display = 'block';
                        }
                    }
                }
                if (data.player) {
                    const playerSelect = card.querySelector('.player-select');
                    if (playerSelect) playerSelect.value = data.player;
                    
                    // Update the visual indicator
                    const domName = card.querySelector('.dominant-name').textContent.trim();
                    card.style.background = data.player ? 
                        `linear-gradient(to right, ${getNameColor(domName)}22, transparent)` : '';
                }
            }
        });
        
        // Save player assignments to the global variable
        playerAssignments = Object.entries(savedDominantState).reduce((acc, [stableId, data]) => {
            if (data.player) {
                acc[stableId] = data.player;
            }
            return acc;
        }, {});
    }

    // Load trinket data
    const savedPlayerTrinkets = getCookie('playerTrinkets');
    if (savedPlayerTrinkets) playerTrinkets = savedPlayerTrinkets;
    
    const savedPlayerTrinketScores = getCookie('playerTrinketScores');
    if (savedPlayerTrinketScores) playerTrinketScores = savedPlayerTrinketScores;
    
    const savedAvailableTrinkets = getCookie('availableTrinkets');
    if (savedAvailableTrinkets) availableTrinkets = savedAvailableTrinkets;

    // Load meaning of life data
    const savedPlayerMeaningCards = getCookie('playerMeaningCards');
    if (savedPlayerMeaningCards) playerMeaningCards = savedPlayerMeaningCards;
    
    const savedPlayerMeaningChoices = getCookie('playerMeaningChoices');
    if (savedPlayerMeaningChoices) playerMeaningChoices = savedPlayerMeaningChoices;

    // Load current age deck and index
    const savedCurrentAgeDeck = getCookie('currentAgeDeck');
    if (savedCurrentAgeDeck) currentAgeDeck = savedCurrentAgeDeck;
    
    const savedCurrentAgeIndex = getCookie('currentAgeIndex');
    if (savedCurrentAgeIndex !== null) currentAgeIndex = savedCurrentAgeIndex;
    
    // Update UI based on loaded data
    updatePlayerSelects();
    generateDominantList();
    updateTrinketSection();
    updateMeaningOfLifeSection();
    
    // Update age display if we have a current deck
    if (currentAgeDeck && currentAgeDeck.length > 0) {
        displayCurrentAge();
    }
    
    console.log("Game state loaded successfully");
}

// Auto-save when changes are made
function setupAutoSave() {
    // Save state when inputs change
    document.addEventListener('change', saveGameState);
    
    // Save state when buttons are clicked
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            // Small delay to ensure state is updated before saving
            setTimeout(saveGameState, 100);
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    setupAutoSave();
}); 