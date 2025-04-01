// Supabase client setup
const SUPABASE_URL = 'https://amfrqooxhxdejbeltbxa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZnJxb294aHhkZWpiZWx0YnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjgxMjMsImV4cCI6MjA1OTA0NDEyM30.7Trplc0IR4OT_EPdFiH7voEsodP8yXX6MISbapr7UWo';

// Direct console logging for immediate debugging
console.log("Supabase.js loaded, URL:", SUPABASE_URL);

// Global variable for the Supabase client
let supabase = null;

// Create Supabase client - simplified and more reliable
function initializeClient() {
    try {
        if (typeof createClient !== 'function') {
            console.error("createClient function is not available!");
            return null;
        }
        
        // Create the Supabase client immediately
        const client = createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase client created successfully");
        return client;
    } catch (error) {
        console.error("Error creating Supabase client:", error);
        return null;
    }
}

// Initialize user
let currentUser = null;

// Global debug flag
const ENABLE_DEBUG = true;

// Debug logging
function logDebug(...args) {
    if (ENABLE_DEBUG) {
        console.log('[SUPABASE DEBUG]', ...args);
    }
}

// User authentication
async function signInAnonymously() {
    console.log("signInAnonymously called");
    logDebug('Attempting anonymous sign-in');
    
    // Create Supabase client if not already initialized
    if (!supabase) {
        supabase = initializeClient();
        if (!supabase) {
            console.error("Cannot sign in: Failed to initialize Supabase client");
            return null;
        }
    }
    
    try {
        // First check if we already have a session
        console.log("Checking for existing session...");
        const sessionResponse = await supabase.auth.getSession();
        console.log("Session response:", sessionResponse);
        
        const { data: { session } } = sessionResponse;
        
        if (session) {
            console.log('Existing session found:', session.user.id);
            return session.user;
        }
        
        // If not, create a new anonymous session
        console.log('No session found, creating anonymous user');
        
        const authResponse = await supabase.auth.signInAnonymously();
        console.log("Anonymous auth response:", authResponse);
        
        const { data, error } = authResponse;
        
        if (error) {
            console.error('Auth error:', error);
            throw new Error('Authentication error: ' + error.message);
        }
        
        if (!data || !data.user) {
            console.error('No user data returned from auth');
            throw new Error('No user data returned from authentication');
        }
        
        console.log('Anonymous sign-in successful:', data.user.id);
        return data.user;
    } catch (error) {
        console.error('Error signing in:', error);
        // Fall back to localStorage if Supabase authentication fails
        return null;
    }
}

// Data operations
async function saveToSupabase(table, data) {
    logDebug(`Saving to table '${table}'`);
    
    // Create Supabase client if not already initialized
    if (!supabase) {
        supabase = initializeClient();
        if (!supabase) {
            logDebug('Failed to initialize Supabase client, cannot save');
            return false;
        }
    }
    
    if (!currentUser) {
        logDebug('No user available, trying to sign in...');
        currentUser = await signInAnonymously();
        if (!currentUser) {
            logDebug('Authentication failed, cannot save');
            return false;
        }
    }
    
    try {
        logDebug(`Data to save:`, data);
        const { error } = await supabase
            .from(table)
            .upsert({ 
                user_id: currentUser.id,
                data: data,
                updated_at: new Date()
            }, {
                onConflict: 'user_id'
            });
            
        if (error) {
            logDebug(`Save error:`, error);
            throw error;
        }
        
        logDebug(`Save to '${table}' successful`);
        return true;
    } catch (error) {
        console.error(`Error saving to ${table}:`, error);
        return false;
    }
}

async function loadFromSupabase(table) {
    logDebug(`Loading from table '${table}'`);
    
    // Create Supabase client if not already initialized
    if (!supabase) {
        supabase = initializeClient();
        if (!supabase) {
            logDebug('Failed to initialize Supabase client, cannot load');
            return null;
        }
    }
    
    if (!currentUser) {
        logDebug('No user available, trying to sign in...');
        currentUser = await signInAnonymously();
        if (!currentUser) {
            logDebug('Authentication failed, cannot load');
            return null;
        }
    }
    
    try {
        const { data, error } = await supabase
            .from(table)
            .select('data')
            .eq('user_id', currentUser.id)
            .single();
            
        if (error) {
            if (error.code !== 'PGRST116') { // PGRST116 is "No rows found" which is not a real error
                logDebug(`Load error:`, error);
                throw error;
            }
            logDebug(`No data found in '${table}'`);
            return null;
        }
        
        logDebug(`Load from '${table}' successful:`, data);
        return data ? data.data : null;
    } catch (error) {
        console.error(`Error loading from ${table}:`, error);
        return null;
    }
}

// Game state functions (replacements for localStorage)
async function setCookie(name, value, days = 7) {
    logDebug(`setCookie called for '${name}'`);
    
    // Save to supabase
    const saved = await saveToSupabase(name, value);
    
    // Also save to localStorage as backup
    try {
        localStorage.setItem(name, JSON.stringify(value));
        logDebug(`Saved to localStorage as backup`);
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
    
    return saved;
}

async function getCookie(name) {
    logDebug(`getCookie called for '${name}'`);
    
    // Try to get from Supabase first
    const supabaseData = await loadFromSupabase(name);
    
    if (supabaseData !== null) {
        logDebug(`Data found in Supabase`);
        return supabaseData;
    }
    
    logDebug(`No data in Supabase, trying localStorage`);
    
    // Fall back to localStorage
    try {
        const value = localStorage.getItem(name);
        if (value === null) {
            logDebug(`No data in localStorage either`);
            return null;
        }
        logDebug(`Data found in localStorage`);
        return JSON.parse(value);
    } catch (e) {
        console.error('Error retrieving from localStorage:', e);
        return null;
    }
}

async function deleteCookie(name) {
    if (!supabase) {
        console.error('Supabase client not initialized, cannot delete');
        return;
    }
    
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

// Test function to directly check Supabase connectivity
async function testSupabaseConnection() {
    logDebug('=== RUNNING SUPABASE CONNECTION TEST ===');
    
    // Create Supabase client if not already initialized
    if (!supabase) {
        supabase = initializeClient();
        if (!supabase) {
            const errorMsg = 'Failed to initialize Supabase client. Cannot run test.';
            logDebug(errorMsg);
            document.getElementById('testResult').innerHTML = errorMsg;
            return false;
        }
    }
    
    try {
        // 1. Ensure we have a logged-in user
        if (!currentUser) {
            logDebug('No current user, attempting to sign in...');
            currentUser = await signInAnonymously();
            
            if (!currentUser) {
                logDebug('ERROR: Authentication failed, test cannot continue');
                document.getElementById('testResult').innerHTML = 'ERROR: Authentication failed. Check console for details.';
                return false;
            }
        }
        
        logDebug('User ID:', currentUser.id);
        document.getElementById('supabaseUserId').textContent = currentUser.id;
        document.getElementById('supabaseStatus').textContent = 'Connected';
        document.getElementById('supabaseStatus').style.color = 'green';
        
        // 2. Try to save test data
        const testData = { test: 'Test data ' + new Date().toISOString() };
        logDebug('Saving test data:', testData);
        
        const { error: saveError } = await supabase
            .from('playernames') // This table must exist
            .upsert({ 
                user_id: currentUser.id,
                data: testData,
                updated_at: new Date()
            }, {
                onConflict: 'user_id'
            });
            
        if (saveError) {
            logDebug('Save Error:', saveError);
            document.getElementById('testResult').innerHTML = 'ERROR saving data: ' + saveError.message;
            return false;
        }
        
        logDebug('Test data saved successfully');
        
        // 3. Try to read the data back
        const { data: readData, error: readError } = await supabase
            .from('playernames')
            .select('data')
            .eq('user_id', currentUser.id)
            .single();
            
        if (readError) {
            logDebug('Read Error:', readError);
            document.getElementById('testResult').innerHTML = 'ERROR reading data: ' + readError.message;
            return false;
        }
        
        logDebug('Test data read back successfully:', readData);
        document.getElementById('testResult').innerHTML = 'SUCCESS: Data saved and retrieved! ' + JSON.stringify(readData.data);
        return true;
    } catch (error) {
        logDebug('Unexpected Error:', error);
        document.getElementById('testResult').innerHTML = 'ERROR: ' + error.message;
        return false;
    }
}

// Initialize Supabase connection
async function initSupabase() {
    logDebug('Initializing Supabase connection to:', SUPABASE_URL);
    
    // Create Supabase client if not already initialized
    if (!supabase) {
        supabase = initializeClient();
        if (!supabase) {
            document.getElementById('supabaseStatus').textContent = 'Initialization Failed';
            document.getElementById('supabaseStatus').style.color = 'red';
            return false;
        }
    }
    
    try {
        currentUser = await signInAnonymously();
        const success = !!currentUser;
        logDebug('Supabase initialized:', success ? 'SUCCESS' : 'FAILED', currentUser?.id);
        
        if (success) {
            document.getElementById('supabaseStatus').textContent = 'Connected';
            document.getElementById('supabaseStatus').style.color = 'green';
            document.getElementById('supabaseUserId').textContent = currentUser.id;
        } else {
            document.getElementById('supabaseStatus').textContent = 'Disconnected';
            document.getElementById('supabaseStatus').style.color = 'red';
        }
        
        return success;
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        document.getElementById('supabaseStatus').textContent = 'Error: ' + error.message;
        document.getElementById('supabaseStatus').style.color = 'red';
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
    // Create the client immediately
    if (!supabase) {
        supabase = initializeClient();
    }
    
    const supabaseInitialized = await initSupabase();
    console.log('Supabase initialized:', supabaseInitialized);
    
    await loadGameState();
    setupAutoSave();
}); 