import { useCallback } from 'react';

const useErrorHandler = (setError, setLoading) => {
  const handleError = useCallback((err) => {
    const errorMessages = err.response?.data?.errors?.map(error => error.msg).join(', ');
    if (errorMessages) {
      setError(errorMessages);
    } else if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError(err.message);
    }
    setLoading(false);
  }, [setError, setLoading]);

  return handleError;
};

export default useErrorHandler;
