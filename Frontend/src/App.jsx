import React from "react";
import HomePage from "./pages/User/HomePage";
import { Route, Routes } from "react-router-dom";
import AdminDashoard from "./pages/Admin/AdminDashoard";
import Start from "./pages/Start";
import SignUpPage from "./pages/Auth/SignUpPage";
import AdminLogin from "./pages/Auth/AdminLogin";
import { useAdminAuth } from "./context/AdminAuthContext";
import { useUserAuth } from "./context/UserAuthContext";
const App = () => {
  const [authUserToken, setAuthUserToken] = useUserAuth();
  const [authAdminToken, setAuthAdminToken] = useAdminAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<Start />}></Route>
        <Route path="/register" element={<SignUpPage />}></Route>
        <Route path="/admin-login" element={<AdminLogin />}></Route>
        <Route
          path="/admin-dashboard"
          element={authAdminToken ? <AdminDashoard /> : <AdminLogin />}
        ></Route>
        <Route
          path="/user-dashboard"
          element={authUserToken ? <HomePage /> : <Start />}
        ></Route>
      </Routes>
    </>
  );
};

export default App;
