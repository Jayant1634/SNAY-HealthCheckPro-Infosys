import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Pagination,
} from "react-bootstrap";
import { FaSearch, FaSun, FaMoon, FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Importing icons
import { API_URL } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Transactions.css";

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    setFilteredTransactions(
      transactions
        .filter((transaction) =>
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (sortField) {
            const isAsc = sortOrder === "asc";
            if (a[sortField] < b[sortField]) {
              return isAsc ? -1 : 1;
            }
            if (a[sortField] > b[sortField]) {
              return isAsc ? 1 : -1;
            }
            return 0;
          }
          return 0;
        })
    );
  }, [searchTerm, transactions, sortField, sortOrder]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_URL + `/transactions/${user.id}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={`transactions-page ${theme}`}>
      {/* Navbar */}
      <Navbar expand="lg" className={`navbar-custom ${theme}`}>
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
              placeholder="Search Transactions"
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
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

      {/* Paragraph Above Table */}
      <Container className={`transactions-container ${theme}`}>
        

        <h2 className="my-4 text-center">All Transactions</h2>
        <p className="table-description text-center my-3">
          Below is a detailed overview of your recent transactions. Use the search feature or pagination to navigate through the records efficiently.
        </p>
        <Table striped bordered hover variant={theme}>
          <thead>
            <tr>
              <th onClick={() => handleSort("_id")}>
                # {sortField === "_id" && (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => handleSort("category")}>
                Category {sortField === "category" && (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => handleSort("type")}>
                Type {sortField === "type" && (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => handleSort("amount")}>
                Amount {sortField === "amount" && (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
              <th onClick={() => handleSort("date")}>
                Date {sortField === "date" && (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction, index) => (
                <tr key={transaction._id}>
                  <td>{indexOfFirstTransaction + index + 1}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.type}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        <Pagination className="justify-content-center">
          {pageNumbers.map((number) => (
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => paginate(number)}
            >
              {number}
            </Pagination.Item>
          ))}
        </Pagination>
      </Container>
    </div>
  );
}

export default TransactionsPage;
