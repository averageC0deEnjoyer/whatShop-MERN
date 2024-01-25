import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaLayerGroup } from 'react-icons/fa';
import logo from '../assets/react.svg';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox';
import { useGetCategoriesQuery } from '../slices/productsApiSlice';

const Header = () => {
  const { cartItems } = useSelector((store) => store.cart);
  const { userInfo } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutServer, { isLoading }] = useLogoutMutation();

  const itemsCount = cartItems.reduce((a, i) => a + i.qty, 0);

  const logoutHandler = async () => {
    try {
      await logoutServer().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  };

  const {
    data: categories,
    isLoading: loadingCategories,
    error,
  } = useGetCategoriesQuery({}, { refetchOnMountOrArgChange: true });
  // console.log(categories);
  return (
    <header>
      <Navbar expand="md" bg="dark" variant="dark" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="logo" />
              whatShop
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              <NavDropdown title="Category" id="basic-nav-dropdown">
                {categories?.map((category) => (
                  <LinkContainer to={`/category/${category}`} key={category}>
                    <NavDropdown.Item>{category}</NavDropdown.Item>
                  </LinkContainer>
                ))}
              </NavDropdown>
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems.length !== 0 ? (
                    <Badge pill bg="success" style={{ marginLeft: '5px' }}>
                      {itemsCount}
                    </Badge>
                  ) : (
                    ''
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaUser />
                      Sign In
                    </Nav.Link>
                  </LinkContainer>
                  {/* <LinkContainer to="/register">
                    <Nav.Link>
                      <FaUser />
                      Register
                    </Nav.Link>
                  </LinkContainer> */}
                </>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin Menu" id="admin">
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Product</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Order</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>User List</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
