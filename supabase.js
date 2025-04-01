// Supabase client setup
const SUPABASE_URL = 'https://amfrqooxhxdejbeltbxa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZnJxb294aHhkZWpiZWx0YnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjgxMjMsImV4cCI6MjA1OTA0NDEyM30.7Trplc0IR4OT_EPdFiH7voEsodP8yXX6MISbapr7UWo';

// Direct console logging for immediate debugging
console.log("Supabase.js loaded, URL:", SUPABASE_URL);

// Global variables
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
    dnsTest: null
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
          updated_at: new Date()
        })
        .eq('id', existingData.id);
    } else {
      saveOp = supabase
        .from(operation.table)
        .insert({
          user_id: currentUser.id,
          data: operation.data,
          updated_at: new Date()
        });
    }
    
    const { error: saveError } = await saveOp;
    
    if (saveError) {
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
    
    let saveOperation;
    
    if (existingData && existingData.id) {
      logDebug(`Existing record found with ID ${existingData.id}, updating...`);
      saveOperation = supabase
        .from(table)
        .update({
          data: data,
          updated_at: new Date()
        })
        .eq('id', existingData.id);
    } else {
      logDebug(`No existing record found, inserting new record...`);
      saveOperation = supabase
        .from(table)
        .insert({
          user_id: currentUser.id,
          data: data,
          updated_at: new Date()
        });
    }
    
    const { error: saveError } = await saveOperation;
    
    if (saveError) {
      // Handle specific errors
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

// Test functions for diagnostics
async function testSupabaseConnection() {
  logDebug('=== RUNNING SUPABASE CONNECTION TEST ===');
  
  // Update UI
  document.getElementById('testResult').innerHTML = 'Running connection test...';
  
  // Check network status first
  if (!navigator.onLine) {
    const errorMsg = 'Your device appears to be offline. Please check your internet connection.';
    logDebug(errorMsg);
    document.getElementById('testResult').innerHTML = errorMsg;
    updateStatus(AppStatus.OFFLINE);
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
      document.getElementById('testResult').innerHTML = 'Testing authentication...';
      
      try {
        currentUser = await signInAnonymously();
      } catch (authError) {
        const diagnostics = await runConnectionDiagnostics();
        document.getElementById('testResult').innerHTML = 
          `Authentication failed: ${authError.message}<br><br>` +
          `<strong>Diagnostics:</strong><br>${diagnostics.report.replace(/\n/g, '<br>')}`;
        return false;
      }
      
      if (!currentUser) {
        const diagnostics = await runConnectionDiagnostics();
        document.getElementById('testResult').innerHTML = 
          `Authentication failed. Check console for details.<br><br>` +
          `<strong>Diagnostics:</strong><br>${diagnostics.report.replace(/\n/g, '<br>')}`;
        return false;
      }
    }
    
    logDebug('User ID:', currentUser.id);
    document.getElementById('supabaseUserId').textContent = currentUser.id;
    updateStatus(AppStatus.ONLINE);
    
    // 2. Try to save test data
    const testData = { test: 'Test data ' + new Date().toISOString() };
    logDebug('Testing data operations with:', testData);
    document.getElementById('testResult').innerHTML = 'Testing data operations...';
    
    try {
      // Check for existing record first
      const { data: existingData, error: checkError } = await supabase
        .from('playernames')
        .select('id')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
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
        if (saveError.code === '42501' || 
            saveError.message.includes('row-level security') ||
            saveError.message.includes('permission denied')) {
          
          logDebug('Row-level security error:', saveError);
          
          // Run diagnostics
          const diagnostics = await runConnectionDiagnostics();
          
          document.getElementById('testResult').innerHTML = 
            `RLS ERROR: Unable to write to database due to security policy.<br>` +
            `Your app will use localStorage instead.<br>Error: ${saveError.message}<br><br>` +
            `<strong>Diagnostics:</strong><br>${diagnostics.report.replace(/\n/g, '<br>')}`;
          
          updateStatus(AppStatus.LOCAL_ONLY, {
            shortMessage: 'Security Policy Error',
            message: saveError.message
          });
          
          return false;
        } else {
          throw saveError;
        }
      }
      
      logDebug('Test data saved successfully');
      
      // 3. Try to read the data back
      const { data: readData, error: readError } = await supabase
        .from('playernames')
        .select('data')
        .eq('user_id', currentUser.id)
        .single();
      
      if (readError) {
        throw readError;
      }
      
      logDebug('Test data read back successfully:', readData);
      
      document.getElementById('testResult').innerHTML = 
        `✅ SUCCESS! Record ${operationType}.<br>` +
        `User ID: ${currentUser.id}<br>` +
        `Data: ${JSON.stringify(readData.data)}`;
      
      return true;
    } catch (opError) {
      // Run diagnostics
      const diagnostics = await runConnectionDiagnostics();
      
      document.getElementById('testResult').innerHTML = 
        `ERROR: ${opError.message}<br><br>` +
        `<strong>Diagnostics:</strong><br>${diagnostics.report.replace(/\n/g, '<br>')}`;
      
      recordError('test_operations', opError);
      return false;
    }
  } catch (error) {
    // Run diagnostics
    const diagnostics = await runConnectionDiagnostics();
    
    document.getElementById('testResult').innerHTML = 
      `ERROR: ${error.message}<br><br>` +
      `<strong>Diagnostics:</strong><br>${diagnostics.report.replace(/\n/g, '<br>')}`;
    
    recordError('test_connection', error);
    return false;
  }
}

// Run a direct diagnostic test
async function runDiagnosticTest() {
  document.getElementById('testResult').innerHTML = 'Running diagnostics...';
  
  try {
    const diagnostics = await runConnectionDiagnostics();
    document.getElementById('testResult').innerHTML = 
      `<strong>DIAGNOSTICS REPORT:</strong><br>${diagnostics.report.replace(/\n/g, '<br>')}`;
  } catch (error) {
    document.getElementById('testResult').innerHTML = 
      `Error running diagnostics: ${error.message}`;
  }
}

// Initialize Supabase connection
async function initSupabase() {
  logDebug('Initializing Supabase connection to:', SUPABASE_URL);
  
  // Load any pending operations
  await loadSyncQueue();
  
  // Check if we're online first
  if (!navigator.onLine) {
    console.log("Device is offline, initializing in offline mode");
    updateStatus(AppStatus.OFFLINE);
    return false;
  }
  
  // Create Supabase client if not already initialized
  if (!supabase) {
    supabase = initializeClient();
    if (!supabase) {
      return false;
    }
  }
  
  try {
    currentUser = await signInAnonymously();
    const success = !!currentUser;
    logDebug('Supabase initialized:', success ? 'SUCCESS' : 'FAILED', currentUser?.id);
    
    if (success) {
      updateStatus(AppStatus.ONLINE);
      
      // If we have pending operations, try to sync them
      if (syncQueue.length > 0) {
        syncLocalChanges();
      }
    } else {
      updateStatus(AppStatus.ERROR, {
        shortMessage: 'Authentication Failed',
        message: 'Could not authenticate with Supabase'
      });
    }
    
    return success;
  } catch (error) {
    recordError('initialization', error);
    return false;
  }
}

// Modified save/load game state functions
async function saveGameState() {
  // Same implementation as before, using offline-first approach
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
  
  console.log(`Game state saved (Status: ${appStatus})`);
}

async function loadGameState() {
  // Load data using offline-first approach
  const savedData = await getCookie('playerNames');
  if (savedData) {
    // Load player names and update UI
    try {
      updateNameInputs(savedData.length);
      
      const inputs = document.querySelectorAll('.name-input');
      savedData.forEach((name, index) => {
        if (index < inputs.length) {
          inputs[index].value = name;
        }
      });
      
      const playerSlider = document.getElementById('playerSlider');
      if (playerSlider) {
        playerSlider.value = savedData.length;
        document.getElementById('playerCount').textContent = savedData.length;
      }
    } catch (e) {
      console.error('Error restoring player names:', e);
    }
  }

  // Load other game state components using the same pattern
  // Each would use getCookie() which has offline-first approach
  
  console.log(`Game state loaded (Status: ${appStatus})`);
}

// Utility function for Diagnostic Panel
function createDiagnosticPanel() {
  // First check if panel already exists
  if (document.getElementById('diagnostic-panel')) {
    return;
  }
  
  const panel = document.createElement('div');
  panel.id = 'diagnostic-panel';
  panel.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 300px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 8px;
    padding: 15px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    display: none;
  `;
  
  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <h3 style="margin: 0; color: #fff;">Connection Diagnostics</h3>
      <button id="close-diagnostic" style="background: none; border: none; color: white; cursor: pointer;">✕</button>
    </div>
    <div id="diagnostic-content" style="max-height: 300px; overflow-y: auto;">
      <div><strong>Status:</strong> <span id="diag-status">Unknown</span></div>
      <div><strong>User ID:</strong> <span id="diag-userid">None</span></div>
      <div><strong>Network:</strong> <span id="diag-network">Unknown</span></div>
      <div><strong>Last Error:</strong> <span id="diag-error">None</span></div>
      <div><strong>Sync Queue:</strong> <span id="diag-queue">0 items</span></div>
      <div style="margin-top: 10px;">
        <button id="run-diagnostics" style="background: #555; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Run Diagnostics</button>
        <button id="force-sync" style="background: #555; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 5px;">Force Sync</button>
      </div>
      <div id="diagnostic-result" style="margin-top: 10px; white-space: pre-wrap;"></div>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Add event listeners
  document.getElementById('close-diagnostic').addEventListener('click', () => {
    panel.style.display = 'none';
  });
  
  document.getElementById('run-diagnostics').addEventListener('click', async () => {
    document.getElementById('diagnostic-result').textContent = 'Running diagnostics...';
    try {
      const diagnostics = await runConnectionDiagnostics();
      document.getElementById('diagnostic-result').textContent = diagnostics.report;
    } catch (error) {
      document.getElementById('diagnostic-result').textContent = `Error: ${error.message}`;
    }
  });
  
  document.getElementById('force-sync').addEventListener('click', async () => {
    document.getElementById('diagnostic-result').textContent = 'Forcing sync...';
    try {
      const result = await syncLocalChanges();
      document.getElementById('diagnostic-result').textContent = 
        result ? 'Sync completed successfully!' : 'Sync completed with errors. Check console.';
      updateDiagnosticPanel();
    } catch (error) {
      document.getElementById('diagnostic-result').textContent = `Sync error: ${error.message}`;
    }
  });
  
  // Add global shortcut to toggle panel (Ctrl+Shift+D)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      if (panel.style.display === 'block') {
        updateDiagnosticPanel();
      }
    }
  });
  
  return panel;
}

function updateDiagnosticPanel() {
  document.getElementById('diag-status').textContent = appStatus;
  document.getElementById('diag-userid').textContent = currentUser ? currentUser.id : 'None';
  document.getElementById('diag-network').textContent = navigator.onLine ? 'Online' : 'Offline';
  document.getElementById('diag-error').textContent = lastErrorDetails ? lastErrorDetails.shortMessage : 'None';
  document.getElementById('diag-queue').textContent = `${syncQueue.length} items`;
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
  updateStatus(navigator.onLine ? AppStatus.ONLINE : AppStatus.OFFLINE);
  console.log("Initial online status:", navigator.onLine ? "Online" : "Offline");
  
  // Create diagnostic panel (hidden by default, toggle with Ctrl+Shift+D)
  createDiagnosticPanel();
  
  // Create the client if online
  if (navigator.onLine) {
    supabase = initializeClient();
  }
  
  // Initialize
  const supabaseInitialized = await initSupabase();
  console.log('Supabase initialized:', supabaseInitialized);
  
  // Load game state (works offline-first)
  await loadGameState();
  
  // Setup auto-save
  setupAutoSave();
  
  // Add diagnostic info to the test panel
  const testPanel = document.querySelector('.test-panel');
  if (testPanel) {
    const diagnosticButton = document.createElement('button');
    diagnosticButton.textContent = 'Run Diagnostics';
    diagnosticButton.onclick = runDiagnosticTest;
    testPanel.appendChild(diagnosticButton);
  }
}); 