import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

const Layout = ({ children }) => {
  return (
    <div className="bg-violet-100 h-screen">
      {/* <Nav/> */}
      <Outlet />
    </div>
  );
};

export default Layout;
