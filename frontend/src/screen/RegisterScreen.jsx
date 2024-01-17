import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerToServer, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((store) => store.auth);

  //to check if there is redirect or not
  const { search } = useLocation();
  console.log(search);
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    //why dont we use cookie here? cause i think if cookie can be tampered,
    //but to get userInfo, we have to use correct cookie .
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Password does not match');
    } else {
      try {
        const res = await registerToServer({ name, email, password }).unwrap();
        console.log(res);
        dispatch(setCredentials(res));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Register Page</h1>

      <Form onSubmit={formSubmitHandler}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="name"
            placeholder="enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            type="email"
            placeholder="enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row>
        <Col>
          Have an Account?{' '}
          {/* when does this redirect have value? maybe later on */}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
