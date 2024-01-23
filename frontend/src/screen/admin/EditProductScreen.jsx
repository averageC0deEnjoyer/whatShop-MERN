import { useEffect, useState } from 'react';
import {
  useUpdateProductMutation,
  useGetProductDetailQuery,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import { Button, Form } from 'react-bootstrap';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const EditProductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');

  const [updateProduct, { isLoading: loadingUpdateProduct }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailQuery(productId);
  //fetch existing data
  useEffect(() => {
    if (product) {
      setName(product.name);
      setBrand(product.brand);
      setCategory(product.category);
      setImage(product.image);
      setDescription(product.description);
      setPrice(product.price);
      setCountInStock(product.countInStock);
    }
  }, [product]);

  //to submit updated product info
  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        brand,
        image,
        category,
        description,
        price,
        countInStock,
      });
      toast.success('Update Product Success');
      navigate('/admin/productlist');
    } catch (error) {
      toast.error(error.error);
    }
  };
  //handle image upload
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      console.log(res);
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Link to={`/admin/productlist`} className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h2>Edit Product</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={() => {}}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter image url"
                value={image}
                // onChange={setImage}
              ></Form.Control>
              <Form.Control
                type="file"
                label="Choose file"
                onChange={uploadFileHandler}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button onClick={updateHandler}>Submit</Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default EditProductScreen;
