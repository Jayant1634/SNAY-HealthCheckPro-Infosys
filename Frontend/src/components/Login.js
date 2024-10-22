import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { API_URL } from '../services/api';
import loginImage from '../images/login.png'; // Adjust the path according to your folder structure
import './Login.css'; // Custom CSS for further styling

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(API_URL + '/users/login', { username, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');  
    }
  };

  return (
    <Container fluid className="login-page">
      <Row className="vh-100">
        {/* Left side with image */}
        <Col md={6} className="d-none d-md-block p-0">
          <div className="login-image-container">
            <img src={loginImage} alt="Login Visual" className="login-image" />
          </div>
        </Col>

        {/* Right side with login form */}
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <div className="login-box shadow-lg p-4 rounded bg-light">
            <h2 className="text-center mb-4 text-primary">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="py-2"
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="py-2"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mt-4 py-2">
                Login
              </Button>
              <div className="mt-3 text-center">
                <Button variant="link" onClick={() => navigate('/register')}>
                  New user? Register here
                </Button>
                <br />
                <Button variant="link" onClick={() => navigate('/forgot-password')}>
                  Forgot Password?
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
