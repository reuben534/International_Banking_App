import { useCallback } from 'react';

const useSimpleErrorHandler = (setError, setLoading, customMessageMap = {}, screenContext = '') => {
  const handleError = useCallback((err) => {
    let displayMessage = err.message; // Default to generic error message

    if (err.response) {
      if (err.response.status === 500) { // Check for 500 status first
        displayMessage = 'An unexpected server error occurred. Please try again later.';
      } else if (err.response.data.message) {
        const backendMessage = err.response.data.message;
        displayMessage = customMessageMap[backendMessage] || backendMessage;
      }
    }
    
    setError(displayMessage);
    setLoading(false);
  }, [setError, setLoading, customMessageMap, screenContext]);

  return handleError;
};

export default useSimpleErrorHandler;
