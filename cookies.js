// Cookie management functions
const COOKIE_EXPIRY = 7; // Days until cookies expire

// Generic cookie functions
function setCookie(name, value, days = COOKIE_EXPIRY) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
}

function getCookie(name) {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(cookieName) === 0) {
            try {
                return JSON.parse(cookie.substring(cookieName.length));
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
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

    // Save trinket data
    setCookie('playerTrinkets', playerTrinkets);
    setCookie('playerTrinketScores', playerTrinketScores);
    setCookie('availableTrinkets', availableTrinkets);

    // Save meaning of life data
    setCookie('playerMeaningCards', playerMeaningCards);
    setCookie('playerMeaningChoices', playerMeaningChoices);
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
        document.getElementById('normalSlider').value = savedAgeSetup.normalAges;
        document.getElementById('merchantSlider').value = savedAgeSetup.merchantAges;
        document.getElementById('catastropheSlider').value = savedAgeSetup.catastropheAges;
        document.getElementById('finalCatastropheMode').checked = savedAgeSetup.finalCatastropheAtEnd;
        
        // Update displayed counts
        document.getElementById('normalCount').textContent = savedAgeSetup.normalAges;
        document.getElementById('merchantCount').textContent = savedAgeSetup.merchantAges;
        document.getElementById('catastropheCount').textContent = savedAgeSetup.catastropheAges;
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
                }
                if (data.player) {
                    const playerSelect = card.querySelector('.player-select');
                    if (playerSelect) playerSelect.value = data.player;
                }
            }
        });
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

    // Update UI
    updatePlayerSelects();
    generateDominantList();
    updateTrinketSection();
    updateMeaningOfLifeSection();
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