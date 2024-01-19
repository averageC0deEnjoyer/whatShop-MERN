import React from 'react';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import { Table, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ProductListScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Product List</h1>
        </Col>
        <Col className="text-end">
          <Button className="m-3 btn-sm">Create New Product</Button>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm mx-2">
                      Edit
                    </Button>
                  </LinkContainer>
                  <Button variant="danger" className="btn-sm">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProductListScreen;
