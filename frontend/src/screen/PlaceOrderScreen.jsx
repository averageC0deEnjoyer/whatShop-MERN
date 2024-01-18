import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((store) => store.cart);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    }
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1>Place Order</h1>
    </>
  );
};

export default PlaceOrderScreen;
