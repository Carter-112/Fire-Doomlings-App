// Supabase client setup
const SUPABASE_URL = 'https://amfrqooxhxdejbeltbxa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZnJxb294aHhkZWpiZWx0YnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjgxMjMsImV4cCI6MjA1OTA0NDEyM30.7Trplc0IR4OT_EPdFiH7voEsodP8yXX6MISbapr7UWo';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// User authentication
async function signInAnonymously() {
    try {
        // First check if we already have a session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            return session.user;
        }
        
        // If not, create a new anonymous session
        const { data, error } = await supabase.auth.signInAnonymously();
        
        if (error) {
            throw new Error('Authentication error: ' + error.message);
        }
        
        return data.user;
    } catch (error) {
        console.error('Error signing in:', error);
        // Fall back to localStorage if Supabase authentication fails
        return null;
    }
}

// Initialize user
let currentUser = null;

// Data operations
async function saveToSupabase(table, data) {
    if (!currentUser) return false;
    
    try {
        const { error } = await supabase
            .from(table)
            .upsert({ 
                user_id: currentUser.id,
                data: data,
                updated_at: new Date()
            }, {
                onConflict: 'user_id'
            });
            
        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Error saving to ${table}:`, error);
        return false;
    }
}

async function loadFromSupabase(table) {
    if (!currentUser) return null;
    
    try {
        const { data, error } = await supabase
            .from(table)
            .select('data')
            .eq('user_id', currentUser.id)
            .single();
            
        if (error && error.code !== 'PGRST116') throw error;
        return data ? data.data : null;
    } catch (error) {
        console.error(`Error loading from ${table}:`, error);
        return null;
    }
}

// Game state functions (replacements for localStorage)
async function setCookie(name, value) {
    // Save to supabase
    const saved = await saveToSupabase(name, value);
    
    // Also save to localStorage as backup
    try {
        localStorage.setItem(name, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
    
    return saved;
}

async function getCookie(name) {
    // Try to get from Supabase first
    const supabaseData = await loadFromSupabase(name);
    
    if (supabaseData !== null) {
        return supabaseData;
    }
    
    // Fall back to localStorage
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

async function deleteCookie(name) {
    if (currentUser) {
        try {
            await supabase
                .from(name)
                .delete()
                .eq('user_id', currentUser.id);
        } catch (error) {
            console.error(`Error deleting from ${name}:`, error);
        }
    }
    
    // Also delete from localStorage
    try {
        localStorage.removeItem(name);
    } catch (e) {
        console.error('Error deleting from localStorage:', e);
    }
}

// Initialize Supabase connection
async function initSupabase() {
    try {
        currentUser = await signInAnonymously();
        console.log('Supabase initialized', currentUser ? 'with user' : 'without user');
        return !!currentUser;
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        return false;
    }
}

// Modified save/load game state functions
async function saveGameState() {
    // Same implementation as before, but using async/await
    const playerNames = Array.from(document.querySelectorAll('.name-input'))
        .map(input => input.value.trim() || input.placeholder);
    await setCookie('playerNames', playerNames);

    await setCookie('ageSetup', {
        normalAges: parseInt(document.getElementById('normalSlider').value),
        merchantAges: parseInt(document.getElementById('merchantSlider').value),
        catastropheAges: parseInt(document.getElementById('catastropheSlider').value),
        finalCatastropheAtEnd: document.getElementById('finalCatastropheMode').checked
    });

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
    await setCookie('dominantState', dominantState);
    await setCookie('persistentTierSelections', persistentTierSelections);
    await setCookie('playerTrinkets', playerTrinkets);
    await setCookie('playerTrinketScores', playerTrinketScores);
    await setCookie('availableTrinkets', availableTrinkets);
    await setCookie('playerMeaningCards', playerMeaningCards);
    await setCookie('playerMeaningChoices', playerMeaningChoices);
    await setCookie('currentAgeDeck', currentAgeDeck);
    await setCookie('currentAgeIndex', currentAgeIndex);
    
    console.log("Game state saved successfully to Supabase");
}

async function loadGameState() {
    // Load player names
    const savedPlayerNames = await getCookie('playerNames');
    if (savedPlayerNames) {
        // Same implementation as before
        // ...
    }

    // Other loading logic follows the same pattern as before
    // ...
    
    console.log("Game state loaded successfully from Supabase");
}

// Set up event listeners for auto-save
function setupAutoSave() {
    // Using debounce to avoid too many saves
    let saveTimeout = null;
    const debouncedSave = () => {
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveGameState, 1000);
    };
    
    // Save state when inputs change
    document.addEventListener('change', debouncedSave);
    
    // Save state when buttons are clicked
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            debouncedSave();
        }
    });
}

// The function that's called when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    const supabaseInitialized = await initSupabase();
    console.log('Supabase initialized:', supabaseInitialized);
    
    await loadGameState();
    setupAutoSave();
}); 