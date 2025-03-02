import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AuthContextProvider from "./context/AuthContext.tsx";
import CustomerContextProvider from "./context/CustomerContext.tsx";
import StaffContextProvider from "./context/StaffContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <CustomerContextProvider>
      <StaffContextProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </StaffContextProvider>
    </CustomerContextProvider>
  </AuthContextProvider>
);
