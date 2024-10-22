import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  Card,
  Container,
  ListGroup,
  Button,
  Modal,
  Navbar,
  Nav,
  ToggleButtonGroup,
  ToggleButton,
  Row,
  Col,
} from "react-bootstrap";
import AddTransactionForm from "./AddTransactionForm";
import { FaSun, FaMoon } from "react-icons/fa"; // Import sun and moon icons
import FinancialGoals from "./FinancialGoals";
import { API_URL } from "../services/api";
import "./Dashboard.css";

// Register the required elements
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [addMoneyAmount, setAddMoneyAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [particles, setParticles] = useState([]);


  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, index) => (
      <div
        key={index}
        className={`particle particle-${
          index + 1
        } particle-${
          ["small", "medium", "large"][
            Math.floor(Math.random() * 3)
          ]
        } particle-${
          ["blue", "pink", "yellow", "green"][
            Math.floor(Math.random() * 4)
          ]
        }`}
      />
    ));
    setParticles(newParticles);
  }, []); // Empty dependency array ensures this runs only once

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_URL + `/transactions/${user.id}`);
      setTransactions(res.data);
      calculateTotalAmount(res.data); // Now only calculates expenses
      calculateCurrentBalance(res.data); // Balance remains income minus expenses
    } catch (err) {
      console.error(err);
    }
  };
  
  const calculateTotalAmount = (data) => {
    const totalExpenses = data
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    setTotalAmount(totalExpenses);
  };
  
  
  const calculateCurrentBalance = (data) => {
    const totalIncome = data
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpenses = data
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const balance = totalIncome - totalExpenses;
    setCurrentBalance(balance);
  };

  const handleAddMoneyModalShow = () => setShowAddMoneyModal(true);
  const handleAddMoneyModalClose = () => setShowAddMoneyModal(false);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  const handleAddMoney = async () => {
    const amount = parseFloat(addMoneyAmount);

    if (!isNaN(amount) && amount > 0) {
      try {
        const userId = JSON.parse(window.localStorage.getItem("user")).id;

        const response = await fetch(`${API_URL}/users/updateBalance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, amount }),
        });

        const data = await response.json();

        if (response.ok) {
          fetchTransactions(); // Refresh transactions after adding money
          setAddMoneyAmount("");
          handleAddMoneyModalClose();
        } else {
          console.error(data.message);
          alert("Error updating balance: " + data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to update balance. Please try again.");
      }
    } else {
      alert("Please enter a valid amount.");
    }
  };

  const calculateExpensesByCategory = (data) => {
    const categoryTotals = data
      .filter((transaction) => transaction.type === "expense")
      .reduce((totals, transaction) => {
        const category = transaction.category;
        if (!totals[category]) {
          totals[category] = 0;
        }
        totals[category] += transaction.amount;
        return totals;
      }, {});
  
    return categoryTotals;
  };
  

  // Data for Pie Chart
  const overallPieData = {
    labels: ["Expenses", "Balance"],
    datasets: [
      {
        data: [totalAmount, currentBalance],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };
  
  const categoryExpenses = calculateExpensesByCategory(transactions);
  const categoryPieData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        data: Object.values(categoryExpenses),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
        ],
        hoverBackgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
        ],
      },
    ],
  };
  


  return (
    <div className={theme}>
    {/* Render Particles */}
    {particles}

    {/* Navbar */}
    <Navbar bg={theme} variant={theme} expand="lg" className="mb-4 fixed-top enhanced-navbar">
      <Navbar.Brand href="/dashboard" className="mx-3">
        SnayExpTracker
      </Navbar.Brand>
      
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="navbar-nav">
          <Nav.Link href="/home" className="mx-3">Home</Nav.Link>
          <Nav.Link href="/dashboard" className="mx-3">Dashboard</Nav.Link>
          <Nav.Link href="/transactions" className="mx-3">Transactions</Nav.Link>
          <Nav.Link href="/predictions" className="mx-3">Predictions</Nav.Link>
        </Nav>
        
        <div className="navbar-controls ml-auto">
          <Nav.Link href="/login" className="mx-3">LogOut</Nav.Link>
          <ToggleButtonGroup
            type="radio"
            name="theme-toggle"
            className="ml-3"
          >
            <ToggleButton
              variant="outline-secondary"
              onClick={handleThemeToggle}
              value={theme}
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Navbar.Collapse>
    </Navbar>


      <Container style={{ paddingTop: "80px" }}>
        <h2 className="my-4 text-center">Dashboard</h2>

        {/* Current Balance, Total Amount Spent & Pie Chart */}
        <Row className="mb-4">
        <Col md={4}>
          <Row className="h-100">
            <Col md={12} className="mb-4 d-flex flex-column justify-content-between">
              <Card className="h-100 card">
                <Card.Body>
                  <Card.Title>Current Balance</Card.Title>
                  <Card.Text className="display-4">
                    ${currentBalance.toFixed(2)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} className="d-flex flex-column justify-content-between">
              <Card className="h-100 card">
                <Card.Body>
                  <Card.Title>Total Amount Spent</Card.Title>
                  <Card.Text className="display-4">
                    ${totalAmount.toFixed(2)}
                  </Card.Text>
                  <Button variant="primary" className="button" onClick={() => setShowModal(true)}>
                    Add Transaction
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <Card className="mb-4 h-100 pie-chart">
            <Card.Body>
              <Card.Title>Expenses vs. Balance</Card.Title>
              <Pie data={overallPieData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 h-100 pie-chart">
            <Card.Body>
              <Card.Title>Expenses by Category</Card.Title>
              <Pie data={categoryPieData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>


        {/* Recent Transactions List */}
        <Card className="mb-4">
        <Card.Body>
          <Card.Title>Recent Transactions</Card.Title>
          {transactions.length > 0 ? (
            <ListGroup>
              {transactions.map((transaction) => (
                <ListGroup.Item key={transaction._id}>
                  {transaction.category}: 
                  <span 
                    className={
                      transaction.type === "income" 
                        ? "amount-income" 
                        : "amount-expense"
                    }
                  >
                    ${transaction.amount.toFixed(2)}
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No recent transactions.</p>
          )}
        </Card.Body>
      </Card>




        {/* Financial Goals */}
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Current Financial Goals</Card.Title>
            <FinancialGoals user={user} displayOnly />
            <Button variant="success" onClick={() => setShowGoalModal(true)}>
              Manage Goals
            </Button>
          </Card.Body>
        </Card>

        {/* Modals */}
        

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Transaction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddTransactionForm onClose={() => setShowModal(false)} />
          </Modal.Body>
        </Modal>

        <Modal show={showGoalModal} onHide={() => setShowGoalModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Manage Financial Goals</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FinancialGoals
              user={user}
              onGoalAdded={() => setShowGoalModal(false)}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default Dashboard;
