import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import { CardForm } from "./CardForm";
import { Fetcher } from "./Fetcher";

const Wrapper = () => {
  return (
    <div className="px-6 py-4">
      <nav className="flex justify-end mb-6 space-x-6 text-xs text-gray-500 uppercase">
        <Link to="/">Root</Link>
        <Link to="/fetcher">Fetcher</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Wrapper />}>
          <Route index element={<CardForm />} />
          <Route path="fetcher" element={<Fetcher />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
