import { useState, useCallback } from 'react';
import axios from 'axios';
import useErrorHandler from './useErrorHandler';

const useTransactions = (endpoint, errorMap, initialTransactions = []) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleError = useErrorHandler(setError, setLoading, errorMap, '');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.get(endpoint, config);
      setTransactions(data);
      setLoading(false);
    } catch (err) {
      handleError(err);
    }
  }, [endpoint, handleError]);

  return { transactions, loading, error, fetchTransactions, setTransactions, setLoading, setError };
};

export default useTransactions;
