import { useParams, Link } from 'react-router-dom';
import {
  useGetOrderDetailQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useUpdateOrderToDeliveredMutation,
} from '../slices/ordersApiSlice';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const OrderDetailScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    isError,
    error,
  } = useGetOrderDetailQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  // console.log(order);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const [updateOrderToDelivered, { isLoading: loadingUpdateOrderToDelivered }] =
    useUpdateOrderToDeliveredMutation();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((store) => store.auth);

  //can refactor if payment method beside paypal, add code in useEffect and

  useEffect(() => {
    //i think this is requirement for paypal button
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypalDispatch, paypal?.clientId]);

  //this 3 func(onApprove, onError, createOrder) is for paypal
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Payment Successful');
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }
  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();
  //   toast.success('Payment Successful');
  // }

  async function deliverOrderHandler() {
    try {
      await updateOrderToDelivered(orderId);
      refetch();
      toast.success('Success Update Deliver Status');
    } catch (err) {
      toast.error(err?.error);
    }
  }

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name : </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email : </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address : </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered at {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method : </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid at {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>

                <Row>
                  <Col>Total Price</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: '10px' }}
                        disabled={false}
                      >
                        Test pay
                      </Button> */}
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {loadingUpdateOrderToDelivered && <Loader />}
              {/* check if user admin, order paid yet, order not delivered */}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderDetailScreen;
