import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./component/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Login
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/login/ForgotPassword";
import OtpVerify from "./pages/login/OtpVerify";
import ResetPassword from "./pages/login/ResetPassword";
import Users from "./component/Users";
import UserForm from "./component/UserForm";

// Profile
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import ChangePassword from "./pages/profile/ChangePassword";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

// Category
import Category from "./pages/Category/Category";
import CreateCategory from "./pages/Category/CreateCategory";

// Product
import ProductForm from "./pages/product/ProductForm";
import ProductList from "./pages/product/ProductList";

// Cart
import Cart from "./pages/cart/Cart";
import OrderList from "./order/OrderList";
import Checkout from "./component/Checkout";
import ProductDetails from "./pages/product/ProductDetails";
function App() {
  return (
    <BrowserRouter>
    <ToastContainer
  position="top-right"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
  theme="light"
/>
      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route path="/" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/otp-verify" element={<OtpVerify />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        {/* =========================
            LAYOUT ROUTES
        ========================= */}

        <Route element={<Layout />}>
          <Route path="/users" element={<Users />} />
          <Route path="/user/form" element={<UserForm />} />

          <Route path="/orders" element={<OrderList />} />

          <Route path="/dashboard" element={<Dashboard />} />

          {/* =========================
              CATEGORY
          ========================= */}

          <Route path="/category" element={<Category />} />

          <Route path="/category/form" element={<CreateCategory />} />

          {/* =========================
              PRODUCT
          ========================= */}

          <Route path="/product" element={<ProductList />} />

          <Route path="/product/form" element={<ProductForm />} />

          <Route path="/product/form/:id" element={<ProductForm />} />

          {/* =========================
              CART
          ========================= */}

          <Route path="/cart" element={<Cart />} />

          <Route path="/product-details" element={<ProductDetails />} />

          <Route path="/checkout" element={<Checkout />} />

          {/* =========================
              PROFILE
          ========================= */}

          <Route path="/profile" element={<Profile />} />

          <Route path="/profile/edit" element={<EditProfile />} />

          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
