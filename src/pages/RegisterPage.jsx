import React, { useState } from 'react'
import {Form, Button, Card, Container, Row,Col, Alert} from 'react-bootstrap';
import { useDispatch,useSelector } from 'react-redux';
import {register} from '../features/auth/authSlice.js';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const[formData,setFormData] = useState({name:'',email:'',password:''});
  const {loading,error} = useSelector((state)=>state.auth);
  const dispatch =  useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const resultAction = await dispatch(register(formData));
    if(register.fulfilled.match(resultAction)){
      navigate('/dashboard');
    }
  }
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <h3 className="mb-4 text-center">Sign Up</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                  {loading ? 'Creating account...' : 'Register'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage