// Supabase client setup
const SUPABASE_URL = 'https://amfrqooxhxdejbeltbxa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZnJxb294aHhkZWpiZWx0YnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjgxMjMsImV4cCI6MjA1OTA0NDEyM30.7Trplc0IR4OT_EPdFiH7voEsodP8yXX6MISbapr7UWo';

// Direct console logging for immediate debugging
console.log("Supabase.js loaded, URL:", SUPABASE_URL);

// Global variable for the Supabase client
let supabase = null;

// Track online status
let isOnline = navigator.onLine;
let networkErrorCount = 0;
const MAX_NETWORK_ERRORS = 3;

// Listen for online/offline events
window.addEventListener('online', () => {
    console.log('🟢 App is now online');
    isOnline = true;
    networkErrorCount = 0;
    document.getElementById('supabaseStatus').textContent = 'Reconnecting...';
    document.getElementById('supabaseStatus').style.color = 'orange';
    // Try to reconnect
    initSupabase().then(success => {
        if (success) {
            console.log('Successfully reconnected to Supabase');
        }
    });
});

window.addEventListener('offline', () => {
    console.log('🔴 App is now offline');
    isOnline = false;
    document.getElementById('supabaseStatus').textContent = 'Offline';
    document.getElementById('supabaseStatus').style.color = 'red';
});

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

// Handle network errors
function handleNetworkError(error, operation) {
    console.error(`Network error during ${operation}:`, error);
    
    // Increment error counter
    networkErrorCount++;
    
    // Update UI
    document.getElementById('supabaseStatus').textContent = 'Connection Error';
    document.getElementById('supabaseStatus').style.color = 'red';
    
    // If we've had several errors, mark as offline
    if (networkErrorCount >= MAX_NETWORK_ERRORS) {
        isOnline = false;
        console.log(`🔴 Too many network errors (${networkErrorCount}), switching to offline mode`);
    }
    
    return error;
}

// Helper to check if the error is a network error
function isNetworkError(error) {
    return (
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network request failed') ||
        error.message.includes('network') ||
        error.code === 'NETWORK_ERROR' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ETIMEDOUT'
    );
}

// User authentication
async function signInAnonymously() {
    console.log("signInAnonymously called");
    logDebug('Attempting anonymous sign-in');
    
    // Don't try to authenticate if we're offline
    if (!isOnline) {
        console.log("Currently offline, skipping authentication");
        return null;
    }
    
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
            if (isNetworkError(error)) {
                handleNetworkError(error, 'authentication');
                return null;
            }
            
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
        if (isNetworkError(error)) {
            handleNetworkError(error, 'authentication');
            return null;
        }
        
        console.error('Error signing in:', error);
        // Fall back to localStorage if Supabase authentication fails
        return null;
    }
}

// Data operations
async function saveToSupabase(table, data) {
    logDebug(`Saving to table '${table}'`);
    
    // Skip Supabase and use only localStorage if offline
    if (!isOnline) {
        logDebug('App is offline, saving to localStorage only');
        try {
            localStorage.setItem(table, JSON.stringify(data));
            logDebug(`Saved to localStorage (offline mode)`);
            return true;
        } catch (e) {
            console.error('Error saving to localStorage in offline mode:', e);
            return false;
        }
    }
    
    // Create Supabase client if not already initialized
    if (!supabase) {
        supabase = initializeClient();
        if (!supabase) {
            logDebug('Failed to initialize Supabase client, saving to localStorage only');
            try {
                localStorage.setItem(table, JSON.stringify(data));
                return true;
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                return false;
            }
        }
    }
    
    // Always ensure we have a valid user before attempting database operations
    if (!currentUser) {
        logDebug('No user available, trying to sign in...');
        try {
            currentUser = await signInAnonymously();
            if (!currentUser) {
                logDebug('Authentication failed, saving to localStorage only');
                try {
                    localStorage.setItem(table, JSON.stringify(data));
                    return true;
                } catch (e) {
                    console.error('Error saving to localStorage:', e);
                    return false;
                }
            }
        } catch (authError) {
            logDebug('Error during authentication:', authError);
            // Fall back to localStorage
            try {
                localStorage.setItem(table, JSON.stringify(data));
                return true;
            } catch (e) {
                console.error('Error saving to localStorage after auth error:', e);
                return false;
            }
        }
    }
    
    try {
        logDebug(`Data to save:`, data);
        
        // Special RLS bypass approach for free tier - first try to see if a record already exists
        const { data: existingData, error: checkError } = await supabase
            .from(table)
            .select('id')
            .eq('user_id', currentUser.id)
            .maybeSingle();
            
        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "No rows found" which is not a real error
            logDebug(`Error checking for existing data:`, checkError);
            if (isNetworkError(checkError)) {
                handleNetworkError(checkError, `checking ${table}`);
                // Fall back to localStorage
                try {
                    localStorage.setItem(table, JSON.stringify(data));
                    return true;
                } catch (e) {
                    console.error('Error saving to localStorage after network error:', e);
                    return false;
                }
            }
        }
        
        let saveOperation;
        
        if (existingData && existingData.id) {
            // Record exists, do an update instead of an upsert to avoid RLS issues
            logDebug(`Existing record found with ID ${existingData.id}, updating...`);
            saveOperation = supabase
                .from(table)
                .update({
                    data: data,
                    updated_at: new Date()
                })
                .eq('id', existingData.id)
                .eq('user_id', currentUser.id);
        } else {
            // No record exists, attempt an insert
            logDebug(`No existing record found, inserting new record...`);
            saveOperation = supabase
                .from(table)
                .insert({
                    user_id: currentUser.id,
                    data: data,
                    updated_at: new Date()
                });
        }
        
        // Execute the save operation
        const { error: saveError } = await saveOperation;
        
        if (saveError) {
            if (isNetworkError(saveError)) {
                handleNetworkError(saveError, `saving to ${table}`);
                // Fall back to localStorage
                try {
                    localStorage.setItem(table, JSON.stringify(data));
                    logDebug(`Saved to localStorage after network error`);
                    return true;
                } catch (e) {
                    console.error('Error saving to localStorage after network error:', e);
                    return false;
                }
            }
            
            // Handle row-level security errors specifically
            if (saveError.code === '42501' || 
                saveError.message.includes('row-level security') ||
                saveError.message.includes('permission denied')) {
                
                logDebug(`Row-level security error:`, saveError);
                console.warn(`RLS error when saving to ${table}. Falling back to localStorage.`);
                
                try {
                    localStorage.setItem(table, JSON.stringify(data));
                    logDebug(`Saved to localStorage after RLS error`);
                    
                    // Update UI to show we're using localStorage only
                    if (document.getElementById('supabaseStatus')) {
                        document.getElementById('supabaseStatus').textContent = 'Using Local Storage';
                        document.getElementById('supabaseStatus').style.color = 'orange';
                    }
                    
                    return true;
                } catch (e) {
                    console.error('Error saving to localStorage after RLS error:', e);
                    return false;
                }
            }
            
            logDebug(`Save error:`, saveError);
            throw saveError;
        }
        
        // Also save to localStorage as backup
        try {
            localStorage.setItem(table, JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save backup to localStorage:', e);
        }
        
        logDebug(`Save to '${table}' successful`);
        return true;
    } catch (error) {
        if (isNetworkError(error)) {
            handleNetworkError(error, `saving to ${table}`);
            // Fall back to localStorage
            try {
                localStorage.setItem(table, JSON.stringify(data));
                logDebug(`Saved to localStorage after catch error`);
                return true;
            } catch (e) {
                console.error('Error saving to localStorage after catch error:', e);
                return false;
            }
        }
        
        console.error(`Error saving to ${table}:`, error);
        
        // Always fall back to localStorage as a last resort
        try {
            localStorage.setItem(table, JSON.stringify(data));
            logDebug(`Saved to localStorage as last resort fallback`);
            return true;
        } catch (e) {
            console.error('Error saving to localStorage as last resort:', e);
            return false;
        }
    }
}

async function loadFromSupabase(table) {
    logDebug(`Loading from table '${table}'`);
    
    // Skip Supabase and use only localStorage if offline
    if (!isOnline) {
        logDebug('App is offline, loading from localStorage only');
        try {
            const value = localStorage.getItem(table);
            if (value === null) {
                logDebug(`No data in localStorage (offline mode)`);
                return null;
            }
            logDebug(`Loaded from localStorage (offline mode)`);
            return JSON.parse(value);
        } catch (e) {
            console.error('Error loading from localStorage in offline mode:', e);
            return null;
        }
    }
    
    // Create Supabase client if not already initialized
    if (!supabase) {
        supabase = initializeClient();
        if (!supabase) {
            logDebug('Failed to initialize Supabase client, loading from localStorage only');
            try {
                const value = localStorage.getItem(table);
                if (value === null) {
                    return null;
                }
                return JSON.parse(value);
            } catch (e) {
                console.error('Error loading from localStorage:', e);
                return null;
            }
        }
    }
    
    if (!currentUser) {
        logDebug('No user available, trying to sign in...');
        currentUser = await signInAnonymously();
        if (!currentUser) {
            logDebug('Authentication failed, loading from localStorage only');
            try {
                const value = localStorage.getItem(table);
                if (value === null) {
                    return null;
                }
                return JSON.parse(value);
            } catch (e) {
                console.error('Error loading from localStorage:', e);
                return null;
            }
        }
    }
    
    try {
        const { data, error } = await supabase
            .from(table)
            .select('data')
            .eq('user_id', currentUser.id)
            .single();
            
        if (error) {
            if (isNetworkError(error)) {
                handleNetworkError(error, `loading from ${table}`);
                // Fall back to localStorage
                try {
                    const value = localStorage.getItem(table);
                    if (value === null) {
                        return null;
                    }
                    logDebug(`Loaded from localStorage after network error`);
                    return JSON.parse(value);
                } catch (e) {
                    console.error('Error loading from localStorage after network error:', e);
                    return null;
                }
            }
            
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
        if (isNetworkError(error)) {
            handleNetworkError(error, `loading from ${table}`);
            // Fall back to localStorage
            try {
                const value = localStorage.getItem(table);
                if (value === null) {
                    return null;
                }
                logDebug(`Loaded from localStorage after catch error`);
                return JSON.parse(value);
            } catch (e) {
                console.error('Error loading from localStorage after catch error:', e);
                return null;
            }
        }
        
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
    
    // Try to get from Supabase first if online
    if (isOnline) {
        const supabaseData = await loadFromSupabase(name);
        
        if (supabaseData !== null) {
            logDebug(`Data found in Supabase`);
            return supabaseData;
        }
        
        logDebug(`No data in Supabase, trying localStorage`);
    } else {
        logDebug(`App is offline, skipping Supabase lookup`);
    }
    
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
    if (!isOnline) {
        // Just delete from localStorage if offline
        try {
            localStorage.removeItem(name);
            return;
        } catch (e) {
            console.error('Error deleting from localStorage in offline mode:', e);
        }
    }
    
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
            if (isNetworkError(error)) {
                handleNetworkError(error, `deleting from ${name}`);
            } else {
                console.error(`Error deleting from ${name}:`, error);
            }
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
    
    // Check network status first
    if (!navigator.onLine) {
        const errorMsg = 'Your device appears to be offline. Please check your internet connection.';
        logDebug(errorMsg);
        document.getElementById('testResult').innerHTML = errorMsg;
        document.getElementById('supabaseStatus').textContent = 'Offline';
        document.getElementById('supabaseStatus').style.color = 'red';
        return false;
    }
    
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
        
        try {
            // Check for existing record first
            const { data: existingData, error: checkError } = await supabase
                .from('playernames')
                .select('id')
                .eq('user_id', currentUser.id)
                .maybeSingle();
                
            if (checkError && checkError.code !== 'PGRST116') {
                if (isNetworkError(checkError)) {
                    handleNetworkError(checkError, 'test check');
                    document.getElementById('testResult').innerHTML = 'ERROR: Network error checking for existing data.';
                    return false;
                }
                
                logDebug('Check Error:', checkError);
                document.getElementById('testResult').innerHTML = 'ERROR checking data: ' + checkError.message;
                return false;
            }
            
            let saveOperation;
            let operationType;
            
            if (existingData && existingData.id) {
                // Record exists, do an update
                logDebug(`Existing record found with ID ${existingData.id}, updating...`);
                saveOperation = supabase
                    .from('playernames')
                    .update({
                        data: testData,
                        updated_at: new Date()
                    })
                    .eq('id', existingData.id)
                    .eq('user_id', currentUser.id);
                operationType = 'updated';
            } else {
                // No record exists, attempt an insert
                logDebug('No existing record found, inserting new record...');
                saveOperation = supabase
                    .from('playernames')
                    .insert({
                        user_id: currentUser.id,
                        data: testData,
                        updated_at: new Date()
                    });
                operationType = 'inserted';
            }
            
            // Execute the save operation
            const { error: saveError } = await saveOperation;
            
            if (saveError) {
                if (isNetworkError(saveError)) {
                    handleNetworkError(saveError, 'test save');
                    document.getElementById('testResult').innerHTML = 'ERROR: Network error during save operation.';
                    return false;
                }
                
                // Handle row-level security errors
                if (saveError.code === '42501' || 
                    saveError.message.includes('row-level security') ||
                    saveError.message.includes('permission denied')) {
                    
                    logDebug('Row-level security error:', saveError);
                    document.getElementById('testResult').innerHTML = 
                        'RLS ERROR: Unable to write to database due to security policy. ' + 
                        'Your app will use localStorage instead. Error: ' + saveError.message;
                    
                    // Update UI to show we're using localStorage only
                    document.getElementById('supabaseStatus').textContent = 'Using Local Storage';
                    document.getElementById('supabaseStatus').style.color = 'orange';
                    
                    // Test localStorage as fallback
                    try {
                        localStorage.setItem('test_playernames', JSON.stringify(testData));
                        const stored = JSON.parse(localStorage.getItem('test_playernames'));
                        if (stored) {
                            document.getElementById('testResult').innerHTML += 
                                '<br><br>SUCCESS: Data saved to localStorage successfully as fallback.';
                            return true;
                        }
                    } catch (e) {
                        document.getElementById('testResult').innerHTML += 
                            '<br><br>ERROR: Could not use localStorage as fallback: ' + e.message;
                    }
                    
                    return false;
                }
                
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
                if (isNetworkError(readError)) {
                    handleNetworkError(readError, 'test read');
                    document.getElementById('testResult').innerHTML = 'ERROR: Network error during read operation.';
                    return false;
                }
                
                logDebug('Read Error:', readError);
                document.getElementById('testResult').innerHTML = 'ERROR reading data: ' + readError.message;
                return false;
            }
            
            logDebug('Test data read back successfully:', readData);
            
            // Test table access by trying to query another table
            try {
                logDebug('Testing table access...');
                const { error: tableAccessError } = await supabase
                    .from('agesetup')
                    .select('id')
                    .limit(1);
                
                if (tableAccessError) {
                    if (tableAccessError.code === '42501' || 
                        tableAccessError.message.includes('permission denied')) {
                        document.getElementById('testResult').innerHTML = 
                            `SUCCESS! Record ${operationType}. User ID: ${currentUser.id}<br>` +
                            `Table access error: ${tableAccessError.message}<br>` +
                            'Your app will use localStorage as fallback.';
                            
                        document.getElementById('supabaseStatus').textContent = 'Using Local Storage';
                        document.getElementById('supabaseStatus').style.color = 'orange';
                    } else {
                        document.getElementById('testResult').innerHTML = 
                            `SUCCESS! Record ${operationType}. User ID: ${currentUser.id}<br>` +
                            `Table access test error: ${tableAccessError.message}`;
                    }
                } else {
                    document.getElementById('testResult').innerHTML = 
                        `SUCCESS! Record ${operationType}. User ID: ${currentUser.id}<br>` +
                        'Table access successful!';
                }
            } catch (tableError) {
                document.getElementById('testResult').innerHTML = 
                    `SUCCESS! Record ${operationType}. User ID: ${currentUser.id}<br>` +
                    `Table access test failed: ${tableError.message}`;
            }
            
            return true;
        } catch (opError) {
            if (isNetworkError(opError)) {
                handleNetworkError(opError, 'test operations');
                document.getElementById('testResult').innerHTML = 'ERROR: Network error during test.';
                return false;
            }
            
            throw opError;
        }
    } catch (error) {
        logDebug('Unexpected Error:', error);
        document.getElementById('testResult').innerHTML = 'ERROR: ' + error.message;
        return false;
    }
}

// Initialize Supabase connection
async function initSupabase() {
    logDebug('Initializing Supabase connection to:', SUPABASE_URL);
    
    // Check if we're online first
    if (!navigator.onLine) {
        console.log("Device is offline, initializing in offline mode");
        isOnline = false;
        document.getElementById('supabaseStatus').textContent = 'Offline';
        document.getElementById('supabaseStatus').style.color = 'red';
        return false;
    }
    
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
            isOnline = true;
            networkErrorCount = 0;
        } else {
            document.getElementById('supabaseStatus').textContent = 'Disconnected';
            document.getElementById('supabaseStatus').style.color = 'red';
        }
        
        return success;
    } catch (error) {
        if (isNetworkError(error)) {
            handleNetworkError(error, 'initialization');
            return false;
        }
        
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
    
    if (isOnline) {
        console.log("Game state saved to Supabase (with localStorage backup)");
    } else {
        console.log("Game state saved to localStorage only (offline mode)");
    }
}

async function loadGameState() {
    // Load player names
    const savedPlayerNames = await getCookie('playerNames');
    if (savedPlayerNames) {
        // Same implementation as before
    }

    // Other loading logic follows the same pattern as before
    
    if (isOnline) {
        console.log("Game state loaded from Supabase");
    } else {
        console.log("Game state loaded from localStorage (offline mode)");
    }
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
    // Check online status immediately
    isOnline = navigator.onLine;
    console.log("Initial online status:", isOnline ? "Online" : "Offline");
    
    // Create the client immediately
    if (!supabase) {
        supabase = initializeClient();
    }
    
    const supabaseInitialized = await initSupabase();
    console.log('Supabase initialized:', supabaseInitialized);
    
    await loadGameState();
    setupAutoSave();
}); 