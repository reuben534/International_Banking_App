import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useTransactions from '../hooks/useTransactions';

const paymentsPortalErrorMap = {
  'Transaction not found': 'The requested transaction could not be found.',
};

const PaymentsPortalScreen = () => {
  const navigate = useNavigate();
  const { transactions, loading, error, fetchTransactions, setLoading, setError } = useTransactions(
    '/api/payments',
    paymentsPortalErrorMap
  );
  const [successMessage, setSuccessMessage] = useState(null);



  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo?.role === 'employee') {
      fetchTransactions();
    } else {
      navigate('/login');
    }
  }, [navigate, fetchTransactions]);

  const verifyHandler = async (id) => {
    setLoading(true);
    setSuccessMessage(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      await axios.put(`/api/payments/${id}/verify`, {}, config);
      setSuccessMessage('Transaction verified successfully!');
      fetchTransactions();
    } catch (err) {
      setError(err);
    }
  };

  const submitToSWIFTHandler = async (id) => {
    setLoading(true);
    setSuccessMessage(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      await axios.put(`/api/payments/${id}/submit`, {}, config);
      setSuccessMessage('Transaction submitted to SWIFT successfully!');
      fetchTransactions();
    } catch (err) {
      setError(err);
    }
  };

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    ZAR: 'R',
  };

  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col>
          <h1>International Payments Portal</h1>
          {error && <div className='alert alert-danger'>{error}</div>}
          {loading && <div>Loading...</div>}
          {successMessage && <div className='alert alert-success'>{successMessage}</div>}
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>AMOUNT</th>
                <th>CURRENCY</th>
                <th>PAYEE ACCOUNT</th>
                <th>SWIFT CODE</th>
                <th>STATUS</th>
                <th>VERIFIED</th>
                <th>SUBMITTED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction._id}</td>
                  <td>{transaction.user?.name || 'N/A'}</td>
                  <td>{currencySymbols[transaction.currency] || transaction.currency} {transaction.amount}</td>
                  <td>{transaction.currency}</td>
                  <td>{transaction.payeeAccount}</td>
                  <td>{transaction.swiftCode}</td>
                  <td>{transaction.status}</td>
                  <td>
                    {transaction.isVerified ? (
                      <i className='fas fa-check' style={{ color: 'green' }}></i>
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {transaction.isSubmittedToSWIFT ? (
                      <i className='fas fa-check' style={{ color: 'green' }}></i>
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {!transaction.isVerified && (
                      <Button
                        variant='info'
                        className='btn-sm'
                        onClick={() => verifyHandler(transaction._id)}
                      >
                        Verify
                      </Button>
                    )}
                    {transaction.isVerified && !transaction.isSubmittedToSWIFT && (
                      <Button
                        variant='success'
                        className='btn-sm ms-2'
                        onClick={() => submitToSWIFTHandler(transaction._id)}
                      >
                        Submit to SWIFT
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentsPortalScreen;