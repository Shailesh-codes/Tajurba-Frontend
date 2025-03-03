import { useState, useEffect } from "react";
import "./styles/styles.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

import SignIn from "./authentications/SignIn";
import Layout from "./layout/Layout";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
}

export default App;
