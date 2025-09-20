import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState('');
  const [idNumberError, setIdNumberError] = useState('');
  const [accountNumberError, setAccountNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigate = useNavigate();

  const validateName = (name) => {
    if (!/^[a-zA-Z ]+$/.test(name)) {
      setNameError('Name must be alphabetic');
    } else {
      setNameError('');
    }
  };

  const validateIdNumber = (idNumber) => {
    if (!/^\d{13}$/.test(idNumber)) {
      setIdNumberError('ID Number must be 13 digits');
    } else {
      setIdNumberError('');
    }
  };

  const validateAccountNumber = (accountNumber) => {
    if (!/^\d{10}$/.test(accountNumber)) {
      setAccountNumberError('Account Number must be 10 digits');
    } else {
      setAccountNumberError('');
    }
  };

  const validatePassword = (password) => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    } else {
      setPasswordError('');
    }
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/'); // Redirect if already logged in
    }

    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (success) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }

  }, [navigate, error, success]);

  const submitHandler = async (e) => {
    e.preventDefault();

    validateName(name);
    validateIdNumber(idNumber);
    validateAccountNumber(accountNumber);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);

    if (nameError || idNumberError || accountNumberError || passwordError || confirmPasswordError) {
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      setLoading(true);
      setError(null);
      setMessage(null);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const { data } = await axios.post(
          '/api/users/register',
          { name, idNumber, accountNumber, password, role: 'customer' },
          config
        );

        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false);
        setSuccess(true);
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
    }
  };

  return (
    <Container>
      <Row className='justify-content-md-center mt-5'>
        <Col xs={12} md={6}>
          <Card className='p-4 shadow'>
            <Card.Body>
              <h1 className='text-center mb-4'>Sign Up</h1>
              {message && <div className='alert alert-danger'>{message}</div>}
              {error && <div className='alert alert-danger'>{error}</div>}
              {success && <div className='alert alert-success'>Registration successful! Redirecting...</div>}
              {loading && <div>Loading...</div>}
              <Form noValidate onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-3'>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter full name'
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      validateName(e.target.value);
                    }}
                    isInvalid={!!nameError}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {nameError}
                  </Form.Control.Feedback>
                </Form.Group>

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

                <Form.Group controlId='confirmPassword' className='my-3'>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      validateConfirmPassword(e.target.value);
                    }}
                    isInvalid={!!confirmPasswordError}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    {confirmPasswordError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-3' disabled={loading || !!nameError || !!idNumberError || !!accountNumberError || !!passwordError || !!confirmPasswordError}>
                  Register
                </Button>
              </Form>

              <Row className='py-3'>
                <Col className='text-center'>
                  Have an Account? <Link to='/login'>Login</Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterScreen;