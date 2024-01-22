import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';
import { Table, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';
import { useSelector } from 'react-redux';

const ProductListScreen = () => {
  const { searchKeyword, pageNumber } = useParams();
  const { data, refetch, isLoading, error } = useGetProductsQuery({
    searchKeyword,
    pageNumber,
  });
  console.log(data);
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const { userInfo } = useSelector((store) => store.auth);
  //create new product
  const createProductHandler = async () => {
    try {
      await createProduct();
      refetch();
      toast.success('Success create product');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  //delete a product
  const deleteProductHandler = async (productId) => {
    try {
      await deleteProduct(productId);
      refetch();
      toast.success('Product Deleted');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Product List</h1>
        </Col>
        <Col className="text-end">
          <Button className="m-3 btn-sm" onClick={createProductHandler}>
            Create New Product
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

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
            {data?.products?.map((product) => (
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
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => {
                      deleteProductHandler(product._id);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Paginate
        page={data?.page}
        pages={data?.pages}
        isAdmin={userInfo.isAdmin}
      />
    </>
  );
};

export default ProductListScreen;
