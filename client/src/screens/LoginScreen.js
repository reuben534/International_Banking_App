import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useErrorHandler from '../hooks/useErrorHandler';

const loginErrorMap = {
  'Invalid ID number, account number or password': 'Incorrect ID number, account number, or password. Please try again.',
};

const LoginScreen = () => {
  const [idNumber, setIdNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [idNumberError, setIdNumberError] = useState('');
  const [accountNumberError, setAccountNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  const handleError = useErrorHandler(setError, setLoading, loginErrorMap, 'login');

  const validateIdNumber = (idNumber) => {
    if (/^\d{13}$/.test(idNumber)) {
      setIdNumberError('');
    } else {
      setIdNumberError('ID Number must be 13 digits');
    }
  };

  const validateAccountNumber = (accountNumber) => {
    if (/^\d{10}$/.test(accountNumber)) {
      setAccountNumberError('');
    } else {
      setAccountNumberError('Account Number must be 10 digits');
    }
  };

  const validatePassword = (password) => {
    if (password) {
      setPasswordError('');
    } else {
      setPasswordError('Password is required');
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/'); // Redirect if already logged in
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    validateIdNumber(idNumber);
    validateAccountNumber(accountNumber);
    validatePassword(password);

    if (idNumberError || accountNumberError || passwordError) {
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/users/login',
        { idNumber, accountNumber, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/');
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <Container>
      <Row className='justify-content-md-center mt-5'>
        <Col xs={12} md={6}>
          <Card className='p-4 shadow'>
            <Card.Body>
              <h1 className='text-center mb-4'>Sign In</h1>
              {error && <div className='alert alert-danger'>{error}</div>}
              {loading && <div>Loading...</div>}
              <Form noValidate onSubmit={submitHandler}>
                <Form.Group controlId='idNumber' className='my-3'>
                  <Form.Label>ID Number</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter ID number'
                    value={idNumber}
                    onChange={(e) => {
                      setIdNumber(e.target.value);
                      validateIdNumber(e.target.value);
                    }}
                    isInvalid={!!idNumberError}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {idNumberError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId='accountNumber' className='my-3'>
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter account number'
                    value={accountNumber}
                    onChange={(e) => {
                      setAccountNumber(e.target.value);
                      validateAccountNumber(e.target.value);
                    }}
                    isInvalid={!!accountNumberError}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {accountNumberError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId='password' className='my-3'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    isInvalid={!!passwordError}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {passwordError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-3' disabled={loading || !!idNumberError || !!accountNumberError || !!passwordError}>
                  Sign In
                </Button>
              </Form>

 
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
