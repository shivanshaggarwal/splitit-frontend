import React from 'react';
import { Container, Row, Col, Card,Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';

const Dashboard = () => {
  const navigate =  useNavigate();
  const handleAddExpense=()=>{
    navigate('/expenses');
  }
  return (
    <>
      
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Dashboard</h2>
          <Button variant="success" onClick={handleAddExpense}>
            ➕ Add Expense
          </Button>
        </div>
        <Row>
          <Col md={6}>
            <Card className="p-3 shadow-sm mb-4">
              <h5>Total Balance</h5>
              <p>You owe ₹0.00 and are owed ₹0.00</p>
            </Card>
            <Card className="p-3 shadow-sm mb-4">
              <h5>Recent Activity</h5>
              <p>No recent activity yet.</p>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-3 shadow-sm mb-4">
              <h5>Your Groups</h5>
              <p>Join or create groups to split expenses.</p>
            </Card>
            <Card className="p-3 shadow-sm mb-4">
              <h5>Your Friends</h5>
              <p>Add friends to start splitting expenses.</p>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
