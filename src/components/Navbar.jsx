import { Nav, Navbar, Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import React from "react";

const AppNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/dashboard"
          className="fw-bold text-success"
        >
          Splitwise
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={NavLink} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/friends">
              Friends
            </Nav.Link>
            <Nav.Link as={NavLink} to="/groups">
              Groups
            </Nav.Link>
            <Nav.Link as={NavLink} to="/expenses">
              Expenses
            </Nav.Link>
            {user ? (
              <Navbar.Text className="me-3">
                Signed in as:{" "}
                <span className="fw-semibold">{user.name || user.email}</span>
              </Navbar.Text>
            ) : (
              <Navbar.Text className="me-3 text-muted">
                Loading user...
              </Navbar.Text>
            )}
            {user ? (<Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>): (<Button variant="outline-primary" size="sm" onClick={()=>navigate("/login")}>
              Login
            </Button>)}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
