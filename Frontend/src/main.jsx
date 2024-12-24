import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserAuthContext from "./context/UserAuthContext";
import AdminAuthContext from "./context/AdminAuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminAuthContext>
      <UserAuthContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserAuthContext>
    </AdminAuthContext>
  </StrictMode>
);
