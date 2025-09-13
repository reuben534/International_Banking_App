import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginScreen = () => {
  const [idNumber, setIdNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
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
        <Col xs={12} md={6}>
          <Card className='p-4 shadow'>
            <Card.Body>
              <h1 className='text-center mb-4'>Sign In</h1>
              {error && <div className='alert alert-danger'>{error}</div>}
              {loading && <div>Loading...</div>}
              <Form onSubmit={submitHandler}>
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

                <Button type='submit' variant='primary' className='my-3' disabled={loading}>
                  Sign In
                </Button>
              </Form>

              <Row className='py-3'>
                <Col className='text-center'>
                  New Customer? <Link to='/register'>Register</Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
