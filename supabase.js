// Supabase client setup
const SUPABASE_URL = 'https://amfrqooxhxdejbeltbxa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZnJxb294aHhkZWpiZWx0YnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjgxMjMsImV4cCI6MjA1OTA0NDEyM30.7Trplc0IR4OT_EPdFiH7voEsodP8yXX6MISbapr7UWo';

// Table name constants to ensure consistency
const TABLE_NAMES = {
  PLAYER_NAMES: 'playerNames',
  AGE_SETUP: 'ageSetup',
  DOMINANT_STATE: 'dominantState',
  PERSISTENT_TIER_SELECTIONS: 'persistentTiersSelections', // Note the correct name
  PLAYER_TRINKETS: 'playerTrinkets',
  PLAYER_TRINKET_SCORES: 'playerTrinketScores',
  AVAILABLE_TRINKETS: 'availableTrinkets',
  PLAYER_MEANING_CARDS: 'playerMeaningCards',
  PLAYER_MEANING_CHOICES: 'playerMeaningChoices',
  CURRENT_AGE_DECK: 'currentAgeDeck',
  CURRENT_AGE_INDEX: 'currentAgeIndex',
  PLAYER_ASSIGNMENTS: 'playerAssignments'
};

// Direct console logging for immediate debugging
console.log("Supabase.js loaded, URL:", SUPABASE_URL);

// Global Variables
let supabase = null;
let currentUser = null;
let syncQueue = [];
let isSyncing = false;
let lastErrorDetails = null;

// App status tracking
const AppStatus = {
  OFFLINE: 'offline',
  ONLINE: 'online',
  ERROR: 'error',
  SYNCING: 'syncing',
  LOCAL_ONLY: 'localOnly'
};

let appStatus = navigator.onLine ? AppStatus.ONLINE : AppStatus.OFFLINE;
let networkErrorCount = 0;
const MAX_NETWORK_ERRORS = 3;
const ENABLE_DEBUG = true;

// Listen for online/offline events
window.addEventListener('online', () => {
  console.log('🟢 App is now online');
  updateStatus(AppStatus.ONLINE);
  // Try to reconnect and sync pending changes
  initSupabase().then(success => {
    if (success) {
      syncLocalChanges();
      console.log('Successfully reconnected to Supabase');
    }
  });
});

window.addEventListener('offline', () => {
  console.log('🔴 App is now offline');
  updateStatus(AppStatus.OFFLINE);
});

// Update status and UI
function updateStatus(status, errorInfo = null) {
  appStatus = status;
  
  if (errorInfo) {
    lastErrorDetails = errorInfo;
    console.error('Error details:', errorInfo);
  }
  
  // Update UI elements
  const statusElement = document.getElementById('supabaseStatus');
  const userIdElement = document.getElementById('supabaseUserId');
  
  if (statusElement) {
    switch (status) {
      case AppStatus.ONLINE:
        statusElement.textContent = 'Connected';
        statusElement.style.color = 'green';
        break;
      case AppStatus.OFFLINE:
        statusElement.textContent = 'Offline';
        statusElement.style.color = 'red';
        break;
      case AppStatus.ERROR:
        statusElement.textContent = errorInfo?.shortMessage || 'Connection Error';
        statusElement.style.color = 'red';
        break;
      case AppStatus.SYNCING:
        statusElement.textContent = 'Syncing...';
        statusElement.style.color = 'orange';
        break;
      case AppStatus.LOCAL_ONLY:
        statusElement.textContent = 'Using Local Storage';
        statusElement.style.color = 'orange';
        break;
    }
  }
  
  if (userIdElement && currentUser) {
    userIdElement.textContent = currentUser.id;
  } else if (userIdElement) {
    userIdElement.textContent = 'None';
  }
}

// Debug logging
function logDebug(...args) {
  if (ENABLE_DEBUG) {
    console.log('[SUPABASE DEBUG]', ...args);
  }
}

// Run diagnostics to check why connection is failing
async function runConnectionDiagnostics() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    navigatorOnline: navigator.onLine,
    appStatus: appStatus,
    networkErrors: networkErrorCount,
    supabaseInitialized: !!supabase,
    userAuthenticated: !!currentUser,
    lastError: lastErrorDetails || 'None',
    cors: null,
    network: null,
    authTest: null,
    dnsTest: null,
    tableTests: {}
  };
  
  // Try a simple fetch to test CORS and basic connectivity
  try {
    const corsTestResponse = await fetch(SUPABASE_URL, { method: 'HEAD' });
    diagnostics.cors = {
      success: corsTestResponse.ok,
      status: corsTestResponse.status,
      statusText: corsTestResponse.statusText
    };
  } catch (error) {
    diagnostics.cors = {
      success: false,
      error: error.message
    };
  }
  
  // Try to resolve the domain to check DNS
  try {
    // We can't directly test DNS in the browser, so simulate with a fetch
    const dnsTestStart = Date.now();
    await fetch(`${SUPABASE_URL}/auth/v1/`, { 
      method: 'HEAD',
      headers: { 'Content-Type': 'application/json' }
    });
    const dnsTestTime = Date.now() - dnsTestStart;
    diagnostics.dnsTest = {
      success: true,
      resolveTime: dnsTestTime
    };
  } catch (error) {
    diagnostics.dnsTest = {
      success: false,
      error: error.message
    };
  }
  
  // Create a special auth test
  if (supabase) {
    try {
      const start = Date.now();
      const authResponse = await supabase.auth.getSession();
      const timeTaken = Date.now() - start;
      
      diagnostics.authTest = {
        success: !authResponse.error,
        timeTaken: timeTaken,
        error: authResponse.error ? authResponse.error.message : null
      };
    } catch (error) {
      diagnostics.authTest = {
        success: false,
        error: error.message
      };
    }
    
    // Test each table
    if (currentUser) {
      for (const tableName of Object.values(TABLE_NAMES)) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('id')
            .limit(1);
            
          diagnostics.tableTests[tableName] = {
            success: !error,
            error: error ? error.message : null
          };
        } catch (error) {
          diagnostics.tableTests[tableName] = {
            success: false,
            error: error.message
          };
        }
      }
    }
  }
  
  // Create a detailed report and log it
  console.log('📊 CONNECTION DIAGNOSTICS:', diagnostics);
  
  // Format a user-friendly report
  let report = `
    📊 CONNECTION DIAGNOSTICS REPORT:
    
    🕒 Time: ${diagnostics.timestamp}
    🌐 Browser Online: ${diagnostics.navigatorOnline ? 'Yes' : 'No'}
    🔌 App Status: ${diagnostics.appStatus}
    🔐 Auth Status: ${diagnostics.userAuthenticated ? 'Authenticated' : 'Not Authenticated'}
    
    🧪 TEST RESULTS:
    - CORS Test: ${diagnostics.cors?.success ? '✅ Passed' : '❌ Failed - ' + (diagnostics.cors?.error || diagnostics.cors?.statusText || 'Unknown error')}
    - DNS Test: ${diagnostics.dnsTest?.success ? '✅ Passed' : '❌ Failed - ' + (diagnostics.dnsTest?.error || 'Unknown error')}
    - Auth Test: ${diagnostics.authTest ? (diagnostics.authTest.success ? '✅ Passed' : '❌ Failed - ' + diagnostics.authTest.error) : '⚠️ Not tested'}
    
    ❌ Last Error: ${diagnostics.lastError !== 'None' ? diagnostics.lastError.message : 'None'}
  `;
  
  // Add table test results if available
  if (Object.keys(diagnostics.tableTests).length > 0) {
    report += `\n    📋 TABLE TESTS:\n`;
    for (const [table, result] of Object.entries(diagnostics.tableTests)) {
      report += `    - ${table}: ${result.success ? '✅ Passed' : '❌ Failed - ' + result.error}\n`;
    }
  }
  
  // Return the report for display
  return {
    report: report,
    raw: diagnostics
  };
}

// Record errors and update status
function recordError(operation, error, context = {}) {
  const isNetwork = isNetworkError(error);
  
  // Create detailed error information
  const errorDetails = {
    message: error.message,
    code: error.code,
    operation: operation,
    timestamp: new Date().toISOString(),
    isNetwork: isNetwork,
    context: context
  };
  
  console.error(`Error during ${operation}:`, error, context);
  
  // Update error count for network errors
  if (isNetwork) {
    networkErrorCount++;
    
    // Switch to offline mode after multiple network errors
    if (networkErrorCount >= MAX_NETWORK_ERRORS) {
      console.log(`🔴 Too many network errors (${networkErrorCount}), switching to offline mode`);
      updateStatus(AppStatus.OFFLINE);
    } else {
      updateStatus(AppStatus.ERROR, { 
        shortMessage: `Network Error (${networkErrorCount}/${MAX_NETWORK_ERRORS})`,
        ...errorDetails 
      });
    }
  } else {
    // For non-network errors, just update status
    updateStatus(AppStatus.ERROR, {
      shortMessage: error.message.substring(0, 30) + (error.message.length > 30 ? '...' : ''),
      ...errorDetails
    });
  }
  
  return errorDetails;
}

// Helper to check if the error is a network error
function isNetworkError(error) {
  if (!error) return false;
  
  return (
    (error.message && (
      error.message.includes('NetworkError') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network request failed') ||
      error.message.includes('network') ||
      error.message.includes('CORS') ||
      error.message.includes('cross-origin')
    )) ||
    error.code === 'NETWORK_ERROR' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'ETIMEDOUT'
  );
}

// Create Supabase client
function initializeClient() {
  try {
    if (typeof createClient !== 'function') {
      console.error("createClient function is not available!");
      updateStatus(AppStatus.ERROR, {
        shortMessage: 'Supabase library not loaded',
        message: 'The createClient function is not available. Supabase library might not be loaded properly.'
      });
      return null;
    }
    
    // Create the Supabase client immediately
    const client = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase client created successfully");
    return client;
  } catch (error) {
    recordError('client_initialization', error);
    return null;
  }
}

// Handle queue of operations to sync when back online
async function addToSyncQueue(operation) {
  syncQueue.push({
    ...operation,
    added: Date.now()
  });
  
  // Save queue to localStorage
  try {
    localStorage.setItem('supabase_sync_queue', JSON.stringify(syncQueue));
  } catch (e) {
    console.error('Error saving sync queue to localStorage:', e);
  }
  
  console.log(`Added operation to sync queue. Queue length: ${syncQueue.length}`);
}

async function loadSyncQueue() {
  try {
    const queueData = localStorage.getItem('supabase_sync_queue');
    if (queueData) {
      syncQueue = JSON.parse(queueData);
      console.log(`Loaded ${syncQueue.length} operations from sync queue`);
    }
  } catch (e) {
    console.error('Error loading sync queue from localStorage:', e);
    syncQueue = [];
  }
}

async function syncLocalChanges() {
  if (isSyncing || appStatus === AppStatus.OFFLINE || !supabase || !currentUser) {
    console.log(`Cannot sync: isSyncing=${isSyncing}, appStatus=${appStatus}, supabase=${!!supabase}, currentUser=${!!currentUser}`);
    return false;
  }
  
  // Load any saved queue first
  await loadSyncQueue();
  
  if (syncQueue.length === 0) {
    console.log('No changes to sync');
    return true;
  }
  
  console.log(`Starting sync of ${syncQueue.length} operations`);
  updateStatus(AppStatus.SYNCING);
  isSyncing = true;
  
  // Track successful operations to remove from queue
  const completedOps = [];
  let hasErrors = false;
  
  try {
    for (const op of syncQueue) {
      try {
        console.log(`Syncing operation: ${op.type} for ${op.table}`);
        
        if (op.type === 'save') {
          const result = await syncSaveOperation(op);
          if (result.success) {
            completedOps.push(op);
          } else {
            hasErrors = true;
          }
        }
        // Add other operation types here if needed
        
      } catch (error) {
        console.error(`Error syncing operation ${op.type} for ${op.table}:`, error);
        hasErrors = true;
      }
    }
    
    // Remove completed operations from queue
    syncQueue = syncQueue.filter(op => !completedOps.includes(op));
    
    // Save updated queue
    localStorage.setItem('supabase_sync_queue', JSON.stringify(syncQueue));
    
    console.log(`Sync completed. ${completedOps.length} operations successful, ${syncQueue.length} remaining`);
    
    // Update status based on results
    if (syncQueue.length === 0) {
      updateStatus(AppStatus.ONLINE);
    } else {
      updateStatus(AppStatus.LOCAL_ONLY, {
        shortMessage: 'Some changes not synced',
        message: `${syncQueue.length} operations could not be synced`
      });
    }
    
    return !hasErrors;
  } catch (error) {
    recordError('sync_process', error);
    return false;
  } finally {
    isSyncing = false;
  }
}

async function syncSaveOperation(operation) {
  try {
    // First check if record already exists
    const { data: existingData, error: checkError } = await supabase
      .from(operation.table)
      .select('id')
      .eq('user_id', currentUser.id)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    let saveOp;
    
    if (existingData && existingData.id) {
      saveOp = supabase
        .from(operation.table)
        .update({
          data: operation.data,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);
    } else {
      saveOp = supabase
        .from(operation.table)
        .insert({
          user_id: currentUser.id,
          data: operation.data,
          updated_at: new Date().toISOString()
        });
    }
    
    const { error: saveError } = await saveOp;
    
    if (saveError) {
      // Handle unique constraint violations
      if (saveError.code === '23505') {
        console.log(`Unique constraint violation for ${operation.table}. Attempting direct update.`);
        
        // Try a direct update if insert failed due to unique constraint
        const { error: updateError } = await supabase
          .from(operation.table)
          .update({
            data: operation.data,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', currentUser.id);
          
        if (updateError) {
          throw updateError;
        }
        
        return { success: true };
      }
      
      throw saveError;
    }
    
    return { success: true };
  } catch (error) {
    recordError('sync_save', error, { operation });
    return { success: false, error };
  }
}

// User authentication
async function signInAnonymously() {
  console.log("signInAnonymously called");
  logDebug('Attempting anonymous sign-in');
  
  // Don't try to authenticate if we're offline
  if (appStatus === AppStatus.OFFLINE) {
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
      throw error;
    }
    
    if (!data || !data.user) {
      throw new Error('No user data returned from authentication');
    }
    
    console.log('Anonymous sign-in successful:', data.user.id);
    return data.user;
  } catch (error) {
    recordError('authentication', error);
    // Fall back to localStorage if Supabase authentication fails
    return null;
  }
}

// Verify database schema
async function verifyDatabaseSchema() {
  if (!supabase || !currentUser) return false;
  
  try {
    logDebug('Verifying database schema...');
    
    // Check if all required tables exist
    const requiredTables = Object.values(TABLE_NAMES);
    const missingTables = [];
    
    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
          
        if (error && error.code === '42P01') {
          missingTables.push(table);
        }
      } catch (err) {
        if (err.message && err.message.includes('relation') && err.message.includes('does not exist')) {
          missingTables.push(table);
        }
      }
    }
    
    if (missingTables.length > 0) {
      console.error('Missing database tables:', missingTables);
      updateStatus(AppStatus.ERROR, {
        shortMessage: 'Database Schema Error',
        message: `Missing tables: ${missingTables.join(', ')}`
      });
      return false;
    }
    
    logDebug('Database schema verification successful');
    return true;
  } catch (error) {
    recordError('schema_verification', error);
    return false;
  }
}

// Data operations
async function saveToSupabase(table, data) {
  logDebug(`Saving to table '${table}'`);
  
  // Always save to localStorage first - offline-first approach
  try {
    localStorage.setItem(table, JSON.stringify(data));
    logDebug(`Saved to localStorage`);
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    // Continue anyway to try Supabase if online
  }
  
  // If offline, add to sync queue and return
  if (appStatus === AppStatus.OFFLINE) {
    await addToSyncQueue({ 
      type: 'save', 
      table, 
      data, 
      timestamp: new Date().toISOString() 
    });
    return true;
  }
  
  // Try to save to Supabase if online
  if (!supabase) {
    supabase = initializeClient();
    if (!supabase) {
      logDebug('Failed to initialize Supabase client');
      await addToSyncQueue({ type: 'save', table, data, timestamp: new Date().toISOString() });
      return true;
    }
  }
  
  if (!currentUser) {
    logDebug('No user available, trying to sign in...');
    try {
      currentUser = await signInAnonymously();
      if (!currentUser) {
        logDebug('Authentication failed, queuing for later sync');
        await addToSyncQueue({ type: 'save', table, data, timestamp: new Date().toISOString() });
        return true;
      }
    } catch (authError) {
      recordError('authentication', authError);
      await addToSyncQueue({ type: 'save', table, data, timestamp: new Date().toISOString() });
      return true;
    }
  }
  
  try {
    logDebug(`Saving to Supabase table '${table}'...`);
    
    // First check if record exists
    const { data: existingData, error: checkError } = await supabase
      .from(table)
      .select('id')
      .eq('user_id', currentUser.id)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      if (isNetworkError(checkError)) {
        recordError('check_existing', checkError, { table });
        await addToSyncQueue({ type: 'save', table, data, timestamp: new Date().toISOString() });
        return true;
      }
      throw checkError;
    }
    
    let saveResult;
    
    if (existingData && existingData.id) {
      logDebug(`Existing record found with ID ${existingData.id}, updating...`);
      saveResult = await supabase
        .from(table)
        .update({
          data: data,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);
    } else {
      logDebug(`No existing record found, inserting new record...`);
      saveResult = await supabase
        .from(table)
        .insert({
          user_id: currentUser.id,
          data: data,
          updated_at: new Date().toISOString()
        });
    }
    
    const saveError = saveResult.error;
    
    if (saveError) {
      // Handle unique constraint violations
      if (saveError.code === '23505') {
        logDebug(`Unique constraint violation for ${table}. Attempting direct update.`);
        
        // Try a direct update if insert failed due to unique constraint
        const { error: updateError } = await supabase
          .from(table)
          .update({
            data: data,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', currentUser.id);
          
        if (updateError) {
          if (isNetworkError(updateError)) {
            recordError('save_data', updateError, { table });
            await addToSyncQueue({ type: 'save', table, data, timestamp: new Date().toISOString() });
            return true;
          }
          throw updateError;
        }
        
        logDebug(`Save to '${table}' successful after constraint handling`);
        return true;
      }
      
      // Handle network errors
      if (isNetworkError(saveError)) {
        recordError('save_data', saveError, { table });
        await addToSyncQueue({ type: 'save', table, data, timestamp: new Date().toISOString() });
        return true;
      }
      
      // Handle row-level security errors
      if (saveError.code === '42501' || 
          saveError.message.includes('row-level security') ||
          saveError.message.includes('permission denied')) {
        
        recordError('security_policy', saveError, { table });
        updateStatus(AppStatus.LOCAL_ONLY, {
          shortMessage: 'Security Policy Error',
          message: saveError.message
        });
        return true;
      }
      
      throw saveError;
    }
    
    logDebug(`Save to '${table}' successful`);
    return true;
  } catch (error) {
    recordError('save_operation', error, { table });
    
    // Queue for later if it's a network error
    if (isNetworkError(error)) {
      await addToSyncQueue({ type: 'save', table, data, timestamp: new Date().toISOString() });
    }
    
    return true; // Return true since we already saved to localStorage
  }
}

async function loadFromSupabase(table) {
  logDebug(`Loading from table '${table}'`);
  
  // Always try localStorage first - offline-first approach
  try {
    const value = localStorage.getItem(table);
    if (value) {
      logDebug(`Data found in localStorage for '${table}'`);
      const localData = JSON.parse(value);
      
      // If offline or in local-only mode, return localStorage data immediately
      if (appStatus === AppStatus.OFFLINE || appStatus === AppStatus.LOCAL_ONLY) {
        return localData;
      }
      
      // Otherwise continue to try Supabase but with local data as backup
      const backupData = localData;
      
      // Try to get from Supabase if online
      try {
        if (!supabase) {
          supabase = initializeClient();
          if (!supabase) {
            return backupData;
          }
        }
        
        if (!currentUser) {
          currentUser = await signInAnonymously();
          if (!currentUser) {
            return backupData;
          }
        }
        
        const { data, error } = await supabase
          .from(table)
          .select('data, updated_at')
          .eq('user_id', currentUser.id)
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // Not found is not a real error
            recordError('load_data', error, { table });
          }
          return backupData;
        }
        
        logDebug(`Data loaded from Supabase for '${table}'`);
        return data.data;
      } catch (error) {
        recordError('load_operation', error, { table });
        return backupData;
      }
    } else {
      logDebug(`No data in localStorage for '${table}'`);
    }
  } catch (e) {
    console.error(`Error loading from localStorage for '${table}':`, e);
  }
  
  // If we're offline or in local-only mode and no localStorage data, return null
  if (appStatus === AppStatus.OFFLINE || appStatus === AppStatus.LOCAL_ONLY) {
    return null;
  }
  
  // If no localStorage data but we're online, try Supabase
  try {
    if (!supabase) {
      supabase = initializeClient();
      if (!supabase) {
        return null;
      }
    }
    
    if (!currentUser) {
      currentUser = await signInAnonymously();
      if (!currentUser) {
        return null;
      }
    }
    
    const { data, error } = await supabase
      .from(table)
      .select('data')
      .eq('user_id', currentUser.id)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // Not found is not a real error
        recordError('load_data', error, { table });
      }
      return null;
    }
    
    // Store in localStorage for future offline use
    try {
      localStorage.setItem(table, JSON.stringify(data.data));
    } catch (e) {
      console.error(`Error saving Supabase data to localStorage for '${table}':`, e);
    }
    
    logDebug(`Data loaded from Supabase for '${table}'`);
    return data.data;
  } catch (error) {
    recordError('load_operation', error, { table });
    return null;
  }
}

async function deleteCookie(name) {
  // Always delete from localStorage
  try {
    localStorage.removeItem(name);
    logDebug(`Deleted from localStorage: '${name}'`);
  } catch (e) {
    console.error(`Error deleting from localStorage for '${name}':`, e);
  }
  
  // If offline, queue delete operation and return
  if (appStatus === AppStatus.OFFLINE) {
    await addToSyncQueue({ 
      type: 'delete', 
      table: name, 
      timestamp: new Date().toISOString() 
    });
    return;
  }
  
  // Try to delete from Supabase if online
  if (!supabase) {
    supabase = initializeClient();
    if (!supabase) {
      await addToSyncQueue({ type: 'delete', table: name, timestamp: new Date().toISOString() });
      return;
    }
  }
  
  if (!currentUser) {
    try {
      currentUser = await signInAnonymously();
      if (!currentUser) {
        await addToSyncQueue({ type: 'delete', table: name, timestamp: new Date().toISOString() });
        return;
      }
    } catch (error) {
      recordError('authentication', error);
      await addToSyncQueue({ type: 'delete', table: name, timestamp: new Date().toISOString() });
      return;
    }
  }
  
  try {
    const { error } = await supabase
      .from(name)
      .delete()
      .eq('user_id', currentUser.id);
    
    if (error) {
      if (isNetworkError(error)) {
        recordError('delete_data', error, { table: name });
        await addToSyncQueue({ type: 'delete', table: name, timestamp: new Date().toISOString() });
      } else {
        recordError('delete_operation', error, { table: name });
      }
    } else {
      logDebug(`Successfully deleted from Supabase: '${name}'`);
    }
  } catch (error) {
    recordError('delete_operation', error, { table: name });
    await addToSyncQueue({ type: 'delete', table: name, timestamp: new Date().toISOString() });
  }
}

// Game state functions (replacements for localStorage)
async function setCookie(name, value, days = 7) {
  return await saveToSupabase(name, value);
}

async function getCookie(name) {
  return await loadFromSupabase(name);
}

// Helper function to check CORS settings
function checkCorsSettings() {
  const corsInfo = document.createElement('div');
  corsInfo.className = 'cors-info';
  corsInfo.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    max-width: 300px;
  `;
  
  corsInfo.innerHTML = `
    <h4 style="margin-top: 0;">CORS Configuration</h4>
    <p>If you're seeing CORS errors, make sure these origins are allowed in your Supabase project:</p>
    <ul>
      <li>${window.location.origin}</li>
      <li>http://localhost:8000</li>
      <li>http://127.0.0.1:8000</li>
      <li>http://localhost:3000</li>
      <li>http://localhost</li>
    </ul>
    <p>Configure these in your Supabase dashboard under:</p>
    <p><strong>Project Settings > API > CORS</strong></p>
    <button id="closeCorsInfo" style="margin-top: 10px;">Close</button>
  `;
  
  document.body.appendChild(corsInfo);
  
  document.getElementById('closeCorsInfo').addEventListener('click', () => {
    corsInfo.remove();
  });
}

// Initialize Supabase on page load
async function initSupabase() {
  if (supabase) {
    console.log("Supabase already initialized");
    return true;
  }
  
  console.log("Initializing Supabase...");
  
  // Create the client
  supabase = initializeClient();
  if (!supabase) {
    console.error("Failed to initialize Supabase client");
    return false;
  }
  
  // Try to authenticate
  try {
    currentUser = await signInAnonymously();
    if (!currentUser) {
      console.log("Authentication failed, will operate in local-only mode");
      updateStatus(AppStatus.LOCAL_ONLY);
      return false;
    }
    
    console.log("Authentication successful, user ID:", currentUser.id);
    
    // Verify database schema
    const schemaValid = await verifyDatabaseSchema();
    if (!schemaValid) {
      console.error("Database schema verification failed");
      return false;
    }
    
    // Sync any pending changes
    await syncLocalChanges();
    
    updateStatus(AppStatus.ONLINE);
    console.log("Supabase initialization complete");
    return true;
  } catch (error) {
    recordError('initialization', error);
    return false;
  }
}

// Add initialization to page load
document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM loaded, initializing Supabase...");
  
  // Create status indicators in the UI if they don't exist
  if (!document.getElementById('supabaseStatus')) {
    const statusContainer = document.createElement('div');
    statusContainer.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #ccc;
      padding: 5px 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
    `;
    
    statusContainer.innerHTML = `
      <div>Supabase: <span id="supabaseStatus">Connecting...</span></div>
      <div>User ID: <span id="supabaseUserId">None</span></div>
    `;
    
    document.body.appendChild(statusContainer);
  }
  
  // Initialize Supabase
  await initSupabase();
  
  // Load game state from Supabase or localStorage
  try {
    // Load player names
    const playerNames = await getCookie(TABLE_NAMES.PLAYER_NAMES);
    if (playerNames) {
      console.log("Loaded player names:", playerNames);
      // Update UI with player names
      // ...
    }
    
    // Load other game state
    // ...
    
  } catch (error) {
    console.error("Error loading game state:", error);
  }
});

// Export functions for use in other scripts
window.supabaseHelpers = {
  saveToSupabase,
  loadFromSupabase,
  deleteCookie,
  setCookie,
  getCookie,
  runConnectionDiagnostics,
  checkCorsSettings,
  initSupabase
};