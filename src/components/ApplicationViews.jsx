import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authorized } from "./Authorized";
import { Login } from "../pages/Login.jsx";
import { Register } from "../pages/Register.jsx";
import { Home } from "../pages/Home.jsx";
import { AllProducts } from "../pages/AllProducts.jsx";
import ProductDetails from "../pages/ProductDetails.jsx";
import CreateProduct from "../pages/CreateProduct.jsx";
import EditProduct from "../pages/EditProduct.jsx";

export const ApplicationViews = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Authorized />}>
          <Route path="/" element={<Home />} />
          <Route path="/allProducts" element={<AllProducts />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="addProduct" element={<CreateProduct />} />
          <Route path="editProduct/:id" element={<EditProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
