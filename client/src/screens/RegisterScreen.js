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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/'); // Redirect if already logged in
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      setLoading(true);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const { data } = await axios.post(
          '/api/users/register',
          { name, idNumber, accountNumber, password },
          config
        );

        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false);
        navigate('/');
      } catch (err) {
        setError(err.response && err.response.data.message
          ? err.response.data.message
          : err.message);
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
              {loading && <div>Loading...</div>}
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-3'>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter full name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='idNumber' className='my-3'>
                  <Form.Label>ID Number</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter ID number'
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='accountNumber' className='my-3'>
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter account number'
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password' className='my-3'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='confirmPassword' className='my-3'>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-3' disabled={loading}>
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
