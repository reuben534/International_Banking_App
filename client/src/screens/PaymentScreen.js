import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [provider, setProvider] = useState('SWIFT');
  const [payeeAccount, setPayeeAccount] = useState('');
  const [swiftCode, setSwiftCode] = useState('ABSAZAJJ'); // Default to Absa
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const southAfricanBanks = [
    { name: 'Absa Bank', swift: 'ABSAZAJJ' },
    { name: 'African Bank', swift: 'AFRCZAJJ' },
    { name: 'Capitec Bank', swift: 'CABLZAJJ' },
    { name: 'First National Bank (FNB)', swift: 'FIRNZAJJ' },
    { name: 'Investec Bank', swift: 'IVESZAJJ' },
    { name: 'Nedbank', swift: 'NEDSZAJJ' },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login'); // Redirect if not logged in
    }

    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }

  }, [navigate, success, error]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors
    setSuccess(false); // Clear previous success messages

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        '/api/payments',
        { amount, currency, provider, payeeAccount, swiftCode },
        config
      );

      setLoading(false);
      setSuccess(true);
      // Clear form fields
      setAmount('');
      setCurrency('USD');
      setProvider('SWIFT');
      setPayeeAccount('');
      setSwiftCode('');

    } catch (err) {
      if (err.response && err.response.data.errors) {
        const errorMessages = err.response.data.errors.map(error => error.msg).join(', ');
        setError(errorMessages);
      } else if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className='justify-content-md-center mt-5'>
        <Col xs={12} md={8}>
          <Card className='p-4 shadow'>
            <Card.Body>
              <h1 className='text-center mb-4'>Initiate International Payment</h1>
              {error && <div className='alert alert-danger'>{error}</div>}
              {loading && <div>Loading...</div>}
              {success && <div className='alert alert-success'>Payment submitted successfully!</div>}
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='amount' className='my-3'>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='currency' className='my-3'>
                  <Form.Label>Currency</Form.Label>
                  <Form.Control
                    as='select'
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value='USD'>USD</option>
                    <option value='EUR'>EUR</option>
                    <option value='GBP'>GBP</option>
                    <option value='ZAR'>ZAR</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId='provider' className='my-3'>
                  <Form.Label>Provider</Form.Label>
                  <Form.Control
                    as='select'
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  >
                    <option value='SWIFT'>SWIFT</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId='payeeAccount' className='my-3'>
                  <Form.Label>Payee Account Information</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter payee account details'
                    value={payeeAccount}
                    onChange={(e) => setPayeeAccount(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='swiftCode' className='my-3'>
                  <Form.Label>Bank (SWIFT Code)</Form.Label>
                  <Form.Control
                    as='select'
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                  >
                    {southAfricanBanks.map(bank => (
                      <option key={bank.swift} value={bank.swift}>
                        {bank.name} - {bank.swift}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-3' disabled={loading}>
                  Pay Now
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentScreen;