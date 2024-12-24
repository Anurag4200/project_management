import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

const AdminAuthContext = ({ children }) => {
  const initialAuthAdminToken = localStorage.getItem("admin-token");
  const [authAdminToken, setAuthAdminToken] = useState(
    initialAuthAdminToken ? JSON.parse(initialAuthAdminToken) : null
  );

  useEffect(() => {
    if (authAdminToken) {
      localStorage.setItem("admin-token", JSON.stringify(authAdminToken));
      Cookies.set('token', authAdminToken)
    } else {
      localStorage.removeItem("admin-token");
      Cookies.remove('token') 
    }
  }, [authAdminToken]);

  return (
    <>
      <AuthContext.Provider value={[authAdminToken, setAuthAdminToken]}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAdminAuth = () => useContext(AuthContext);

export default AdminAuthContext;
