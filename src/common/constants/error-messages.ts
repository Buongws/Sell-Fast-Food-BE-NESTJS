export const ERROR_MESSAGES = {
  // HTTP Status Messages
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  METHOD_NOT_ALLOWED: 'Method not allowed',
  CONFLICT: 'Resource conflict',
  VALIDATION_FAILED: 'Validation failed',
  TOO_MANY_REQUESTS: 'Too many requests',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  BAD_GATEWAY: 'Bad gateway',
  SERVICE_UNAVAILABLE: 'Service unavailable',
  REQUEST_TIMEOUT: 'Request timeout',

  // Sequelize Error Messages
  SEQUELIZE: {
    UNIQUE_CONSTRAINT: 'Data already exists in the system',
    VALIDATION_ERROR: 'Invalid data provided',
    FOREIGN_KEY_CONSTRAINT: 'Invalid reference provided',
    DATABASE_ERROR: 'Database error occurred',
    CONNECTION_ERROR: 'Unable to connect to database',
    TIMEOUT_ERROR: 'Request timeout exceeded',
    GENERAL_ERROR: 'Database error occurred',
  },

  // General Error Messages
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  UNKNOWN_ERROR: 'Unknown error occurred',
};

export const ERROR_NAMES = {
  // HTTP Status Error Names
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  METHOD_NOT_ALLOWED: 'Method Not Allowed',
  CONFLICT: 'Conflict',
  VALIDATION_FAILED: 'Unprocessable Entity',
  TOO_MANY_REQUESTS: 'Too Many Requests',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  BAD_GATEWAY: 'Bad Gateway',
  SERVICE_UNAVAILABLE: 'Service Unavailable',
  REQUEST_TIMEOUT: 'Request Timeout',

  // Sequelize Error Names
  SEQUELIZE: {
    UNIQUE_CONSTRAINT: 'Unique Constraint Violation',
    VALIDATION_ERROR: 'Validation Error',
    FOREIGN_KEY_CONSTRAINT: 'Foreign Key Constraint Error',
    DATABASE_ERROR: 'Database Error',
    CONNECTION_ERROR: 'Database Connection Error',
    TIMEOUT_ERROR: 'Database Timeout Error',
    GENERAL_ERROR: 'Database Error',
  },

  // General Error Names
  UNEXPECTED_ERROR: 'Error',
  UNKNOWN_ERROR: 'Unknown Error',
};
