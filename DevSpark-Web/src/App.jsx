import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Body";
import Login from "./Login";
import Profile from "./Profile";

const App = () => {
  return (
    <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
