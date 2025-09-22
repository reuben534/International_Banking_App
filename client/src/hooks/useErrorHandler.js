import { useCallback } from 'react';

const useErrorHandler = (setError, setLoading, customMessageMap = {}, screenContext = '') => {
  const handleError = useCallback((err) => {
    let displayMessage = err.message; // Default to generic error message (e.g., network error)

    if (err.response) {
      if (err.response.status === 500) { // Handle generic 500 errors first
        if (screenContext === 'login') { // Specific override for login screen 500
          displayMessage = 'Incorrect ID number, account number, or password. Please try again.';
        } else if (screenContext === 'register') { // Specific override for register screen 500
          displayMessage = 'Registration failed due to an unexpected server error. Please try again.';
        } else {
          displayMessage = 'An unexpected server error occurred. Please try again later.';
        }
      } else if (err.response.data.errors) {
        // Handle validation errors (array of errors)
        const errorMessages = err.response.data.errors.map(error => error.msg).join(', ');
        displayMessage = errorMessages;
      } else if (err.response.data.message) {
        // Handle single message errors from backend
        const backendMessage = err.response.data.message;
        // Check if there's a custom message for this backend message in the map
        displayMessage = customMessageMap[backendMessage] || backendMessage;
      }
    }
    
    setError(displayMessage);
    setLoading(false);
  }, [setError, setLoading, customMessageMap, screenContext]);

  return handleError;
};

export default useErrorHandler;
