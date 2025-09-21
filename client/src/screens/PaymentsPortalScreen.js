import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentsPortalScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || userInfo.role !== 'employee') {
      navigate('/login'); // Redirect if not logged in as employee
    } else {
      fetchTransactions();
    }
  }, [navigate]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get('/api/payments', config);
      setTransactions(data);
      setLoading(false);
    } catch (err) {
      const errorMessages = err.response?.data?.errors?.map(error => error.msg).join(', ');
      if (errorMessages) {
        setError(errorMessages);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  const verifyHandler = async (id) => {
    setLoading(true);
    setSuccessMessage(null); // Clear previous success messages
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`/api/payments/${id}/verify`, {}, config);
      const errorMessages = err.response?.data?.errors?.map(error => error.msg).join(', ');
      if (errorMessages) {
        setError(errorMessages);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  const submitToSWIFTHandler = async (id) => {
    setLoading(true);
    setSuccessMessage(null); // Clear previous success messages
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`/api/payments/${id}/submit`, {}, config);
      setSuccessMessage('Transaction submitted to SWIFT successfully!');
      fetchTransactions(); // Refresh transactions after update
      setLoading(false);
    } catch (err) {
      const errorMessages = err.response?.data?.errors?.map(error => error.msg).join(', ');
      if (errorMessages) {
        setError(errorMessages);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
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
                  <td>{transaction.user ? transaction.user.name : 'N/A'}</td>
                  <td>${transaction.amount}</td>
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