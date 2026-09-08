import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
   return (
      <AuthProvider>
         <BrowserRouter>
            <Toaster position="top-center" />
            <Routes>
               <Route path="/login" element={<Login />} />
               <Route
                  element={
                     <ProtectedRoute>
                        <Layout />
                     </ProtectedRoute>
                  }
               >
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
               </Route>
               <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
         </BrowserRouter>
      </AuthProvider>
   );
}