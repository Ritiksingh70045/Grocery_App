import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/Seller/SellerLogin';
import SellerLayout from './pages/Seller/SellerLayout';
import AddProduct from './pages/Seller/AddProduct';
import ProductList from './pages/Seller/ProductList';
import Orders from './pages/Seller/Orders';
import Loading from './components/Loading';
import UpdatePassword from './components/UpdatePassword';
import ForgotPassword from './components/ForgotPassword';
import AllSellerList from './components/AllSellerList';
import NoSeller from './pages/NoSeller';
import SellerForgotPassword from './components/Seller/SellerForgotPassword';
function App() {
  const isSellerPath = useLocation().pathname.includes('seller'); // checks if the URL contains the seller keyword
  const { showUserLogin, seller } = useAppContext();
  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      <Toaster />
      <div
        className={`${isSellerPath ? '' : 'px-6 md:px-16 lg:px-24 xl:px-32'}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/no-seller" element={<NoSeller />} />
          {/* <Route path="/products" element={<AllProducts />} /> */}
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/loader" element={<Loading />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/seller-list" element={<AllSellerList />} />
          <Route path="/user/:sellerId/products" element={<AllProducts />} />
          <Route path="/forgot-password-seller" element={<SellerForgotPassword/>} />
          <Route
            path="/seller"
            element={seller ? <SellerLayout /> : <SellerLogin />} 
          >
            <Route index element={seller ? <AddProduct /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
}

export default App;
