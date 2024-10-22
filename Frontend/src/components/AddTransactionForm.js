import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';
import { API_URL } from '../services/api';

function AddTransactionForm({ onClose }) {
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense'); // Default to 'expense'
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      alert('User not found. Please log in again.');
      return;
    }

    try {
      await axios.post(API_URL +  '/transactions', {
        userId: user.id,
        category,
        type,
        amount: parseFloat(amount),
        date,
      });
      alert('Transaction added successfully');
      setCategory('');
      setType('expense');
      setAmount('');
      setDate('');
      if (onClose) onClose(); // Close the modal if onClose is provided
    } catch (err) {
      console.error(err);
      alert(`Failed to add transaction: ${err.response?.data?.message || 'An error occurred'}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formType">
        <Form.Label>Type:</Form.Label>
        <Form.Control 
          as="select" 
          value={type} 
          onChange={(e) => setType(e.target.value)} 
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formCategory">
        <Form.Label>Category:</Form.Label>
        <Form.Control 
          type="text" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formAmount">
        <Form.Label>Amount:</Form.Label>
        <Form.Control 
          type="number" 
          step="0.01"
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formDate">
        <Form.Label>Date:</Form.Label>
        <Form.Control 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Add Transaction
      </Button>
    </Form>
  );
}

export default AddTransactionForm;