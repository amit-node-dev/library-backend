/**
 * Application validation and operation message constants
 * Organized by functional area with complete validation coverage
 */
const Messages = {
  COMMON: {
    WELCOME: "Welcome to LibraTech!",
    REGISTER_SUCCESS: "Registration completed successfully",
    ADD_SUCCESS: "Resource added successfully",
    UPDATE_SUCCESS: "Resource updated successfully",
    DELETE_SUCCESS: "Resource deleted successfully",
    NOT_FOUND: "Requested resource not found",
    FETCH_SUCCESS: "Resource retrieved successfully",
    LIST_FETCH_SUCCESS: "Resources listed successfully",
    SELF_DELETION_FORBIDDEN: "Self-deletion is not permitted",
    OPERATION_SUCCESS: "Operation completed successfully",
  },

  AUTH: {
    INVALID_CREDENTIALS: "Invalid Credentials",
    USER_NOT_FOUND: "User account not found",
    PASSWORD_MISMATCH: "Invalid password provided",
    OLD_PASSWORD_MISMATCH: "Current password is incorrect",
    LOGIN_SUCCESS: "Login successful",
    INVALID_TOKEN: "Invalid or malformed token",
    TOKEN_EXPIRED: "Session token has expired",
    UNAUTHORIZED: "Authorization required",
    ACCESS_DENIED: "Insufficient permissions",
    LOGOUT_SUCCESS: "Thank You! For visiting us.",
    INAVLID_OTP: "Invalid OTP Verification",
    OTP_SENT: "Verification code dispatched",
    OTP_VERIFIED: "Verification successful",
    USER_EXISTS: "User account already exists",
  },

  SERVER: {
    INTERNAL_ERROR: "An unexpected server error occurred",
    SERVICE_UNAVAILABLE: "Service temporarily unavailable",
    MAINTENANCE_MODE: "System maintenance in progress",
  },

  VALIDATION: {
    // Field requirements
    EMAIL_REQUIRED: "Email address is required",
    PASSWORD_REQUIRED: "Password is required",
    FIRSTNAME_REQUIRED: "First name is required",
    LASTNAME_REQUIRED: "Last name is required",
    MOBILE_REQUIRED: "Mobile number is required",
    ROLE_NAME_REQUIRED: "Role name is required",
    BOOK_NAME_REQUIRED: "Book name is required",
    DESCRIPTION_REQUIRED: "Description is required",
    AUTHOR_REQUIRED: "Author is required",
    USER_ID_REQUIRED: "User ID is required",
    RECORD_ID_REQUIRED: "Record ID is required",
    FINE_AMOUNT_REQUIRED: "Fine amount is required",
    FINE_DATE_REQUIRED: "Fine date is required",

    // Format validations
    INVALID_EMAIL: "Please enter a valid email address",
    INVALID_MOBILE: "Please enter a valid phone number",
    INVALID_DATE_FORMAT: "Please enter a valid date (YYYY-MM-DD)",

    // Length validations
    PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
    FIRSTNAME_MAX_LENGTH: "First name cannot exceed 50 characters",
    LASTNAME_MAX_LENGTH: "Last name cannot exceed 50 characters",
    ROLE_NAME_MAX_LENGTH: "Role name cannot exceed 30 characters",
    BOOK_NAME_MAX_LENGTH: "Book name cannot exceed 100 characters",
    DESCRIPTION_MAX_LENGTH: "Description cannot exceed 1000 characters",

    // Password complexity
    PASSWORD_UPPERCASE: "Password must contain at least one uppercase letter",
    PASSWORD_LOWERCASE: "Password must contain at least one lowercase letter",
    PASSWORD_NUMBER: "Password must contain at least one number",
    PASSWORD_SPECIAL_CHAR:
      "Password must contain at least one special character",

    // ID validations
    INVALID_USER_ID: "User ID must be a positive integer",
    INVALID_AUTHOR_ID: "Author ID must be a positive integer",
    INVALID_RECORD_ID: "Record ID must be a positive integer",

    // Numeric validations
    INVALID_FINE_AMOUNT: "Fine amount must be a positive number",

    // Existence checks
    USER_NOT_FOUND: "Specified user not found",
    AUTHOR_NOT_FOUND: "Specified author not found",
    RECORD_NOT_FOUND: "Specified record not found",

    // General validation
    VALIDATION_ERROR: "Validation failed",
    INVALID_INPUT: "Invalid input provided",
  },
};

// Prevent modifications to the message object
Object.freeze(Messages);

module.exports = Messages;
