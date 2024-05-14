// eslint-disable-next-line no-unused-vars
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
// import { GoogleOAuthProvider } from "@react-oauth/google";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Router>
    {/* <GoogleOAuthProvider clientId="760220743932-9a5l5ah351lvpelmeul1rns9s9pjr5qd.apps.googleusercontent.com"> */}
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>
    {/* </GoogleOAuthProvider> */}
  </Router>

  // </React.StrictMode>,
);
