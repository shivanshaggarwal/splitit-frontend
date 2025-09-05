import React,{useState} from 'react'
import {Col,Card, Button, Row,Alert,Form,Container} from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice.js';



const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState(null);
  const { loading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setLocalError(null);
    try {
      const resultAction = await dispatch(login(formData)).unwrap();
      if (resultAction) navigate('/dashboard');
    } catch (err) {
      setLocalError('Invalid email or password');
    }
  }
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row>
        <Col>
          <Card className="p-4 shadow-lg" style={{ minWidth: '300px', borderRadius: '15px' }}>
            <h2 className="text-center mb-4">Log in to Splitwise</h2>
            {localError && <Alert variant="danger">{localError}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <small>
                Don’t have an account? <a href="/">Sign up</a>
              </small>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;