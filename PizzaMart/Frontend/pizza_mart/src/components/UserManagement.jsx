
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css";
import { Link } from "react-router-dom";
import api from "../axios";



const UserManagement = () => {
   const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const[message,setMessage] = useState("")
  const [actionLoading, setActionLoading] = useState(null);

  // GET ADMIN TOKEN
  const getHeaders = () => {
    const token = localStorage.getItem("adminAccess");

    if (!token) {
      throw new Error("Admin access token not found. Please login again.");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // GET ALL CUSTOMERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminAccess")
      console.log("Admin token exists : ",!!token)
      console.log("Admin token :",token)
      const response = await api.get("users/", {
        headers: {
          Authorization : `Bearer ${token}`,
        }
      });

      console.log("Api response", response.data);
      console.log("Customer details",response.data.users)
      console.log("Full response:", response.data);
      console.log("Customer list:", response.data.users);
      console.log("Customer count:", response.data.users?.length);
      // Backend response: { users: [...] }
      setUsers(response.data.users || []);

    } catch (err) {
      console.log("HTTP status:", err.response?.status);
    console.log("Backend error:", err.response?.data);
    console.log("Request headers:", err.config?.headers);

      setError(
        err.response?.data?.detail ||
        err.message ||
        "Unable to load customers."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // BLOCK / UNBLOCK CUSTOMER
  const handleBlock = async (user) => {
    const action = user.is_active ? "block" : "unblock";

    if (!window.confirm(
      `Are you sure you want to ${action} ${user.username}?`
    )) return;

    try {
      setActionLoading(user.id);

      const response = await api.patch(
        `users/${user.id}/`,
        {
          is_active: !user.is_active,
        },
        {
          headers: getHeaders(),
        }
      );

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item.id === user.id ? response.data.user : item
        )
      );

      alert(response.data.message);

    } catch (err) {
      console.log("Block error:", err.response?.data);

      alert(
        err.response?.data?.error ||
        err.message ||
        "Unable to update customer status."
      );

    } finally {
      setActionLoading(null);
    }
  };

  // DELETE CUSTOMER
  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently remove ${user.username}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(user.id);

      const response = await api.delete(
        `users/${user.id}/`,
        {
          headers: getHeaders(),
        }
      );

      setUsers((previousUsers) =>
        previousUsers.filter((item) => item.id !== user.id)
      );

      alert(response.data.message);

    } catch (err) {
      console.log("Delete error:", err.response?.data);

      alert(
        err.response?.data?.error ||
        err.message ||
        "Unable to remove customer."
      );

    } finally {
      setActionLoading(null);
    }
  };

  // SEARCH CUSTOMERS
  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    return (
      user.username?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue) ||
      user.phone?.toLowerCase().includes(searchValue)
    );
  });

  const activeUsers = users.filter(
    (user) => user.is_active
  ).length;

  const blockedUsers = users.filter(
    (user) => !user.is_active
  ).length;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger"></div>
        <p className="mt-2">Loading customers...</p>
      </div>
    );
  }

  return (

    <>
    
    <div className="user-management container-fluid py-4">
      

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
         <Link to="/admin/users" className="nav-link fw-bold fs-3" >
  <i className="bi bi-people me-2"></i>
       User Management
</Link>
          <p className="text-muted text-center">
             Manage your PizzaMart customers
          </p>
        </div>

        <button
          className="btn btn-outline-danger"
          onClick={fetchUsers}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* CUSTOMER STATISTICS */}
      <div className="row g-3 mb-4">

        <div className="col-md-4">
          <div className="card user-stat-card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Total Customers</h6>
              <h3 className="fw-bold">{users.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card user-stat-card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Active Customers</h6>
              <h3 className="fw-bold text-success">{activeUsers}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card user-stat-card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Blocked Customers</h6>
              <h3 className="fw-bold text-danger">{blockedUsers}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* SEARCH */}
      <div className="card shadow-sm border-0">
        <div className="card-body">

          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search username, email or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* CUSTOMER TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">

              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>

                      <td>{user.id}</td>

                      <td className="fw-semibold">
                        {user.username}
                      </td>

                      <td>{user.email}</td>

                      <td>{user.phone || "N/A"}</td>

                      <td>
                        {user.date_joined
                          ? new Date(user.date_joined).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td>
                        {user.is_active ? (
                          <span className="badge bg-success">
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            Blocked
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="d-flex gap-2">

                          <button
                            className={`btn btn-sm ${
                              user.is_active
                                ? "btn-warning"
                                : "btn-success"
                            }`}
                            disabled={actionLoading === user.id}
                            onClick={() => handleBlock(user)}
                          >
                            {user.is_active ? "Block" : "Unblock"}
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            disabled={actionLoading === user.id}
                            onClick={() => handleDelete(user)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </div>
      </div>

    </div>
    </>
  );
};

export default UserManagement;
