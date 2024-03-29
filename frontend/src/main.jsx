import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import store from './store.js';
import HomeScreen from './screen/HomeScreen.jsx';
import ProductScreen from './screen/ProductScreen.jsx';
import CartScreen from './screen/CartScreen.jsx';
import LoginScreen from './screen/LoginScreen.jsx';
import RegisterScreen from './screen/RegisterScreen.jsx';
import ShippingScreen from './screen/ShippingScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import SelectPaymentScreen from './screen/SelectPaymentScreen.jsx';
import PlaceOrderScreen from './screen/PlaceOrderScreen.jsx';
import OrderDetailScreen from './screen/OrderDetailScreen.jsx';
import ProfileScreen from './screen/ProfileScreen.jsx';

import AdminRoute from './components/AdminRoute.jsx';
import OrderListScreen from './screen/admin/OrderListScreen.jsx';
import ProductListScreen from './screen/admin/ProductListScreen.jsx';
import UserListScreen from './screen/admin/UserListScreen.jsx';
import EditProductScreen from './screen/admin/EditProductScreen.jsx';
import EditUserScreen from './screen/admin/EditUserScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/search/:searchKeyword" element={<HomeScreen />} />
      <Route path="/page/:pageNumber" element={<HomeScreen />} />
      <Route path="/category/:categoryName" element={<HomeScreen />} />
      <Route
        path="/search/:searchKeyword/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route
        path="/category/:categoryName/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route
        path="/category/:categoryName/search/:searchKeyword"
        element={<HomeScreen />}
      />

      <Route
        path="/category/:categoryName/search/:searchKeyword/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route path="/products/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<SelectPaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderDetailScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderlist" element={<OrderListScreen />} />
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        <Route
          path="/admin/productlist/page/:pageNumber"
          element={<ProductListScreen />}
        />
        <Route path="/admin/product/:id/edit" element={<EditProductScreen />} />
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<EditUserScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);
