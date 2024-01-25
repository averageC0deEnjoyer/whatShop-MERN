import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useParams, Link } from 'react-router-dom';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

const HomeScreen = () => {
  // console.log(params);
  const param = useParams();
  // console.log(param);
  const { pageNumber, searchKeyword, categoryName } = param;
  const { data, isLoading, error } = useGetProductsQuery(
    {
      searchKeyword,
      pageNumber,
      categoryName,
    },
    { refetchOnMountOrArgChange: true }
  );
  // console.log(data);

  return (
    <>
      {!searchKeyword && !categoryName ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      {isLoading ? (
        ''
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data.products?.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            searchKeyword={searchKeyword ? searchKeyword : ''}
            categoryName={categoryName ? categoryName : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
