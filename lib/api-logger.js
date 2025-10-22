// lib/api-logger.js - Browser compatible
let instrumentation;

// Try to load instrumentation, but don't fail if it's not available
try {
  instrumentation = require('./instrumentation');
} catch (error) {
  // Fallback to console logging
  instrumentation = {
    metrics: {
      apiCalls: 0,
      errors: 0,
      codeGenerations: 0,
      databaseSaves: 0
    },
    logger: {
      info: (message, data) => console.log(`[INFO] ${message}`, data),
      error: (message, data) => console.error(`[ERROR] ${message}`, data)
    },
    logMetrics: () => console.log('📊 Metrics:', instrumentation.metrics)
  };
}

const { metrics, logger } = instrumentation;

function logApiCall(method, endpoint, data = {}) {
  metrics.apiCalls++;
  
  logger.info(`API ${method} ${endpoint}`, {
    method,
    endpoint,
    timestamp: new Date().toISOString(),
    ...data
  });
}

function logApiError(method, endpoint, error, data = {}) {
  metrics.errors++;
  
  logger.error(`API ${method} ${endpoint} failed`, {
    method,
    endpoint,
    error: error.message,
    timestamp: new Date().toISOString(),
    ...data
  });
}

function logCodeGeneration(data = {}) {
  metrics.codeGenerations++;
  
  logger.info('Code generated', {
    event: 'code_generation',
    timestamp: new Date().toISOString(),
    ...data
  });
}

function logDatabaseOperation(operation, data = {}) {
  if (operation === 'save') {
    metrics.databaseSaves++;
  }
  
  logger.info(`Database ${operation}`, {
    operation,
    timestamp: new Date().toISOString(),
    ...data
  });
}

// Log metrics periodically in Node.js environment
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  setInterval(() => {
    instrumentation.logMetrics();
  }, 30000); // Every 30 seconds
}

module.exports = {
  logApiCall,
  logApiError,
  logCodeGeneration,
  logDatabaseOperation,
  metrics,
  logger
};