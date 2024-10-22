import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button, ListGroup, Container } from 'react-bootstrap';
import { API_URL } from '../services/api';

function FinancialGoals({ user, displayOnly, onGoalAdded }) {
  const [goals, setGoals] = useState([]);
  const [goalType, setGoalType] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(API_URL +  `/goals/${user.id}`);
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL +  '/goals', {
        userId: user.id,
        goalType,
        targetAmount,
        deadline,
      });
      alert('Goal added successfully');
      setGoalType('');
      setTargetAmount('');
      setDeadline('');
      fetchGoals();
      if (onGoalAdded) onGoalAdded(); // Notify the dashboard to refresh goals
    } catch (err) {
      console.error(err);
      alert('Failed to add goal');
    }
  };

  return (
    <Container>
      {!displayOnly && (
        <Card className="p-4 mb-4">
          <Card.Body>
            <h4 className="mb-4">Add New Goal</h4>
            <Form onSubmit={handleAddGoal}>
              <Form.Group className="mb-3">
                <Form.Label>Goal Type</Form.Label>
                <Form.Control
                  type="text"
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Target Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Add Goal
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
      <Card className="p-4 mb-4">
        <Card.Body>
          <h4 className="mb-4">Your Goals</h4>
          {goals.length > 0 ? (
            <ListGroup>
              {goals.map((goal) => (
                <ListGroup.Item key={goal._id}>
                  <strong>{goal.goalType}</strong>: ${goal.targetAmount} by {new Date(goal.deadline).toLocaleDateString()}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No goals added yet.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FinancialGoals;
