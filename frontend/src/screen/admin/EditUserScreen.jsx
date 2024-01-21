import { useState, useEffect } from 'react';
import {
  useEditUserMutation,
  useGetUserByIdQuery,
  useUpdateProfileMutation,
} from '../../slices/usersApiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const EditUserScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: user, refetch, isLoading, error } = useGetUserByIdQuery(userId);

  const navigate = useNavigate();

  const [editUser, { isLoading: loadingEdit }] = useEditUserMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const updateUserHandler = async (e) => {
    e.preventDefault();
    try {
      await editUser({ _id: userId, name, email, isAdmin });
      toast.success('User updated');
      navigate('/admin/userlist');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <h2>Edit User</h2>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <FormContainer>
          <Form onSubmit={updateUserHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email" className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="isAdmin" className="my-2">
              <Form.Check
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                label="isAdmin"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="my-2">
              Submit
            </Button>
          </Form>
        </FormContainer>
      )}
    </>
  );
};

export default EditUserScreen;
