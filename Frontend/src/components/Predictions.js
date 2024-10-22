import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, ListGroup, Container, Navbar, Nav, Form, Button, FormControl, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { FaSearch, FaSun, FaMoon } from 'react-icons/fa';
import { API_URL } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Predictions.css';

function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchPredictions();
    } else {
      navigate('/');
    }
  }, []);

  const fetchPredictions = async () => {
    try {
      const res = await axios.get(API_URL + `/predictions/${user.id}`);
      setPredictions(res.data);
    } catch (err) {
      console.error(err);
    }
  };



  
  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  return (
    <div className={`predictions-page ${theme}`}>
      {/* Navbar */}
      <Navbar fixed="top" expand="lg" className={`navbar-custom ${theme}`}>
        <Navbar.Brand href="/dashboard" className="mx-3">
          ExpenseTracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home" className="mx-3">
              Home
            </Nav.Link>
            <Nav.Link href="/dashboard" className="mx-3">
              Dashboard
            </Nav.Link>
            <Nav.Link href="/transactions" className="mx-3">
              Transactions
            </Nav.Link>
            <Nav.Link href="/predictions" className="mx-3">
              Predictions
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search Predictions"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-secondary">
              <FaSearch />
            </Button>
          </Form>
          <ToggleButtonGroup
            type="radio"
            name="theme-toggle"
            className="ms-3"
          >
            <ToggleButton
              variant="outline-secondary"
              onClick={handleThemeToggle}
              value={theme}
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </ToggleButton>
          </ToggleButtonGroup>
        </Navbar.Collapse>
      </Navbar>

      {/* Predictions Content */}
      <Container className="predictions-container my-4">
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-4">Spending Predictions</Card.Title>
            {predictions.length > 0 ? (
              <ListGroup variant="flush">
                {predictions.map((prediction, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between">
                    <span><strong>{prediction.month}</strong></span>
                    <span>${prediction.amount.toFixed(2)}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-center">No predictions available. <br />The Owner will add this funtionality later ... !! <br /> Thank You !!
              </p>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Predictions;
