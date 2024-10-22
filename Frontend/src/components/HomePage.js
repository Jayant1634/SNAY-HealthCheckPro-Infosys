import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Navbar, Nav, Card } from 'react-bootstrap';
import { FaWallet, FaChartLine, FaLightbulb } from 'react-icons/fa';
import FlaskImage from '../images/health.png';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="home-page-bg">
      

      {/* Hero Section */}{/* Enhanced Navbar with Logout */}
      <Navbar expand="lg" className="fixed-top enhanced-navbar">
        <Container>
          <Navbar.Brand href="/home" className="text-white">
          Health Check Pro
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link href="/home" className="mx-3 text-white">Home</Nav.Link>
              <Nav.Link href="/dashboard" className="mx-3 text-white">Dashboard</Nav.Link>
              <Nav.Link href="/transactions" className="mx-3 text-white">Transactions</Nav.Link>
              <Nav.Link href="/predictions" className="mx-3 text-white">Predictions</Nav.Link>
              <Button variant="outline-danger" onClick={handleLogout} className="ms-3 logout-button">
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="d-flex align-items-center vh-100">
        <Row className="w-100 align-items-center">
          <Col xs={12} md={7} className="text-left position-relative">
            <h1 className="display-4 text-white">Track Your Health Effortlessly</h1>
            <p className="lead text-white-50">
              Gain full control of your Health with real-time insights.
            </p>
            <p className="text-white-50">
              Join us to manage your health, set routines, and achieve your health goals with ease.
            </p>

            {/* Animated Arrows */}
            <div className="arrow-container">
              <div className="arrow arrow-1"></div>
              <div className="arrow arrow-2"></div>
              <div className="arrow arrow-3"></div>
            </div>
          </Col>

          {/* Right Column with Flask Image */}
          <Col xs={12} md={5} className="d-flex align-items-center justify-content-center mt-4 mt-md-0">
            <img src={FlaskImage} alt="Flask Logo" className="img-fluid flask-image" />
          </Col>
        </Row>
      </Container>

      {/* Feature Cards */}
      <Container className="feature-cards-section my-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={6} md={4} className="mb-4">
            <Card className="feature-card futuristic-card">
              <Card.Body>
                <FaWallet className="feature-icon animated-icon" />
                <Card.Title>Manage Transactions</Card.Title>
                <Card.Text>
                  Add, view, and filter your daily expenses and incomes in a simple, intuitive interface.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/transactions")} className="futuristic-button">
                  View Transactions
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} className="mb-4">
            <Card className="feature-card futuristic-card">
              <Card.Body>
                <FaChartLine className="feature-icon animated-icon" />
                <Card.Title>Dashboard Overview</Card.Title>
                <Card.Text>
                  Get a quick overview of your current balance and spending patterns in the dashboard.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/dashboard")} className="futuristic-button">
                  Go to Dashboard
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} className="mb-4">
            <Card className="feature-card futuristic-card">
              <Card.Body>
                <FaLightbulb className="feature-icon animated-icon" />
                <Card.Title>Health Predictions</Card.Title>
                <Card.Text>
                  Use advanced algorithms to predict your future expenses and plan ahead.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/predictions")} className="futuristic-button">
                  See Predictions
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
{/* Footer Section */}
<footer className="footer-section text-center py-3">
        <Container>
          <p>Made by Snay Corporation | Owner: Jayant Khandelwal</p>
        </Container>
      </footer>
      
    </div>
  );
}

export default HomePage;
