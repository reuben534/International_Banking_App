import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const storedUserInfo = localStorage.getItem('userInfo');

  useEffect(() => {
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      setUserInfo(null);
    }
  }, [storedUserInfo]); // Re-run effect when userInfo in localStorage changes

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/login');
  };

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>International Payments Portal</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {userInfo ? (
                <>
                  {userInfo.role === 'customer' && (
                    <>
                      <LinkContainer to='/payment'>
                        <Nav.Link>
                          <i className='fas fa-money-bill-wave'></i> Make Payment
                        </Nav.Link>
                      </LinkContainer>
                      <LinkContainer to='/transactions'>
                        <Nav.Link>
                          <i className='fas fa-history'></i> My Transactions
                        </Nav.Link>
                      </LinkContainer>
                    </>
                  )}
                  {userInfo.role === 'employee' && (
                    <LinkContainer to='/admin/payments'>
                      <Nav.Link>
                        <i className='fas fa-cogs'></i> Admin Portal
                      </Nav.Link>
                    </LinkContainer>
                  )}
                  <NavDropdown title={userInfo.name} id='username'>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link>
                      <i className='fas fa-user'></i> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/register'>
                    <Nav.Link>
                      <i className='fas fa-user-plus'></i> Register
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
