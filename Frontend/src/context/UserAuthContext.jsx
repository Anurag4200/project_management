import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from 'js-cookie';


export const AuthContext = createContext();

const UserAuthContext = ({ children }) => {
  const initialAuthUserToken = localStorage.getItem("user-token");
  const [authUserToken, setAuthUserToken] = useState(
    initialAuthUserToken ? JSON.parse(initialAuthUserToken) : null
  );

  useEffect(() => {
    if (authUserToken) {
      localStorage.setItem("user-token", JSON.stringify(authUserToken));
      Cookies.set('user', authUserToken)
    } else {
      localStorage.removeItem("user-token");
      Cookies.remove('user') 
    }
  }, [authUserToken]);

  return (
    <>
      <AuthContext.Provider value={[authUserToken, setAuthUserToken]}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useUserAuth = () => useContext(AuthContext);

export default UserAuthContext;
