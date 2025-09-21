import { useCallback } from 'react';

const useSimpleErrorHandler = (setError, setLoading) => {
  const handleError = useCallback((err) => {
    setError(err.response?.data?.message
      ? err.response.data.message
      : err.message);
    setLoading(false);
  }, [setError, setLoading]);

  return handleError;
};

export default useSimpleErrorHandler;
