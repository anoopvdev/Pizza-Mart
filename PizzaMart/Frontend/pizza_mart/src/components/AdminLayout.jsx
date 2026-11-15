

import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_access");
    localStorage.removeItem("admin_refresh");
    localStorage.removeItem("admin_user");
    navigate("/admin/login", { replace: true });
  };

  const links = [
    { path: "/admin/dashboard", name: "Dashboard", icon: "bi-house-door" },
    { path: "/admin/orders", name: "Orders", icon: "bi-bag" },
    { path: "/admin/products", name: "Products", icon: "bi-pizza" },
    { path: "/admin/categorys", name: "Category", icon: "bi-list" },
    { path: "/admin/users", name: "Customers", icon: "bi-people" },
    { path: "/admin/coupons", name: "Coupons", icon: "bi-ticket-perforated" },
    { path: "/admin/contact-message" , name: "Messages", icon: "bi bi-chat-text" }
  ];

  return (
    <div className="admin-layout d-flex min-vh-100 bg-light">

      {/* Sidebar */}
      <aside className="admin-sidebar bg-dark text-white d-flex flex-column">

        <div className="p-3 border-bottom border-secondary">
          <h5 className="mb-1">
            <i className="bi bi-pizza me-2 text-danger" />
            Mart Admin
          </h5>
          <small className="text-secondary">
            Control Everything
          </small>
        </div>

        <nav className="nav flex-column p-2 gap-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `nav-link rounded ${
                  isActive ? "bg-danger text-white" : "text-white-50"
                }`
              }
            >
              <i className={`bi ${link.icon} me-2`} />
              {link.name}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="btn text-start text-white-50 mt-auto border-top rounded-0 p-3"
        >
          <i className="bi bi-box-arrow-right me-2" />
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="admin-main flex-grow-1">

        <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between">
          <strong>PizzaMart Administration</strong>
          <span className="text-muted small">Super Admin</span>
        </header>

        <div className="p-3 p-lg-4">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default AdminLayout;
