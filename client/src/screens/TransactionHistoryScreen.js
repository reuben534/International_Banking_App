import React, { useState, useEffect, useCallback } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSimpleErrorHandler from '../hooks/useSimpleErrorHandler';

const transactionHistoryErrorMap = {
  'Transaction not found': 'Transaction history not available or transaction not found.',
};

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleError = useSimpleErrorHandler(setError, setLoading, transactionHistoryErrorMap, '');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.get('/api/payments/my', config);
      setTransactions(data);
      setLoading(false);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      fetchTransactions();
    } else {
      navigate('/login'); // Redirect if not logged in
    }
  }, [navigate, fetchTransactions]);

  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col>
          <h1>My Transaction History</h1>
          {error && <div className='alert alert-danger'>{error}</div>}
          {loading && <div>Loading...</div>}
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>AMOUNT</th>
                <th>CURRENCY</th>
                <th>PROVIDER</th>
                <th>PAYEE ACCOUNT</th>
                <th>SWIFT CODE</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction._id}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.currency}</td>
                  <td>{transaction.provider}</td>
                  <td>{transaction.payeeAccount}</td>
                  <td>{transaction.swiftCode}</td>
                  <td>{transaction.status}</td>
                  <td>{transaction.createdAt.substring(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default TransactionHistoryScreen;
