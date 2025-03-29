import React from 'react';
import Navbar1 from "./Components/Navbar1";
import { Outlet } from "react-router-dom";
const AdminLayout = () => {
  return (
    <div>
      <Navbar1 />
      <div className="content-container">
        <Outlet /> {/* This is where page content changes */}
      </div>
    </div>
  )
}

export default AdminLayout;
