import React, { useEffect } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useTransactions from '../hooks/useTransactions';

const transactionHistoryErrorMap = {
  'Transaction not found': 'Transaction history not available or transaction not found.',
};

const TransactionHistoryScreen = () => {
  const navigate = useNavigate();
  const { transactions, loading, error, fetchTransactions } = useTransactions(
    '/api/payments/my',
    transactionHistoryErrorMap
  );

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      fetchTransactions();
    } else {
      navigate('/login');
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
