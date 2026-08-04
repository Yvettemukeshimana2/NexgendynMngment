import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PurchaseProvider } from "./context/PurchaseContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PurchaseProvider>
          <App />
        </PurchaseProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
