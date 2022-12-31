import { Outlet } from "react-router-dom";
import * as React from "react";

import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import localforage from "localforage";
import { useNavigate } from "react-router-dom";

export default function NavLayout() {
  const navigate = useNavigate();

  const clearTokens = (e) => {
    e.preventDefault();

    localforage.clear()
      .then(function () {
        console.log("Database is now empty.");
        navigate('/');
      })
      .catch(function (err) {
        console.log(err, 'failed to clear localForage NavLayout ln 23');
      });
  };
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>My Travel Diary</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/trips">
                <Nav.Link>Trips</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav>
              <LinkContainer to="/signup">
                <Nav.Link>Sign Up</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link eventKey={2}>Login</Nav.Link>
              </LinkContainer>
              <NavDropdown title="User Icon" id="collapsible-nav-dropdown">
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={(e) => clearTokens(e)}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}
