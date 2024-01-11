import { useParams, Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  ListGroupItem,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import products from '../products';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const selectedProduct = products.find((p) => p._id === productId);
  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={selectedProduct.image} alt={selectedProduct.name} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{selectedProduct.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={selectedProduct.rating}
                text={selectedProduct.numReviews}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${selectedProduct.price}</ListGroup.Item>
            <ListGroup.Item>
              Description: {selectedProduct.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${selectedProduct.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Col>Status:</Col>
                <Col>
                  <strong>
                    {selectedProduct.countInStock > 0
                      ? 'In Stock'
                      : 'Out of Stock'}
                  </strong>
                </Col>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={selectedProduct.countInStock === 0}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
