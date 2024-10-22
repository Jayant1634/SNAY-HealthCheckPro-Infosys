import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { API_URL } from '../services/api'; // Adjust API_URL accordingly
import forgotPasswordImage from '../images/forgot-password.jpg'; // Use your uploaded image here
import './ForgotPassword.css'; // Custom CSS for further styling

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Send request to backend for password reset
      await axios.post(API_URL + '/users/forgot-password', { email });
      setMessage('If the email is registered, you will receive a password reset link.');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || 'Error processing request. Please try again later.');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <Container fluid className="forgot-password-page vh-100 d-flex align-items-center">
      <Row className="w-100">
        {/* Left side with image */}
        <Col md={6} className="d-none d-md-block p-0">
          <div className="forgot-password-image-container">
            <img src={forgotPasswordImage} alt="Forgot Password Visual" className="forgot-password-image" />
          </div>
        </Col>

        {/* Right side with form */}
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <div className="forgot-password-box shadow-lg p-4 rounded bg-white">
            <h2 className="text-center mb-4 text-primary">Forgot Password</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="py-2"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mt-4 py-2">
                Send Reset Link
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;
