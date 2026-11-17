
import React, { useEffect, useState } from "react";
import adminApi from "../admin/adminApi";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statuses = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  const fetchOrders = async () => {
    try {
      const response = await adminApi.get(`orders/`);
      setOrders(response.data.results || response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewDetails = async (id) => {
    try {
      const response = await adminApi.get(`orders/${id}/`);
      setSelectedOrder(response.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to load order details.");
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await adminApi.patch(
        `orders/${orderId}/status/`,
        { status: newStatus.toLowerCase() },{

        }
      );
      console.log("STATUS UPADTEED:",response.data)

      setOrders((old) =>
        old.map((order) =>
          order.id === orderId
            ? { ...order, status: response.data.status || newStatus }
            : order
        )
      );

      setSelectedOrder((old) =>
        old && old.id === orderId
          ? { ...old, status: response.data.status || newStatus }
          : old
      );
    } catch (err) {
     console.log("STATUS ERROR:", err.response?.data);

    setError(
      err.response?.data?.error ||
      err.response?.data?.detail ||
      "Unable to update order status."
    );
    }
  };

  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer_name || ""} ${order.status || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

 if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" />
        <p className="text-muted mt-3">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold">Order Management</h3>
          <p className="text-muted">View and manage customer orders</p>
        </div>

        <button className="btn btn-outline-danger" onClick={fetchOrders}>
          <i className="bi bi-arrow-clockwise me-2" /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <input
            className="form-control mb-3"
            placeholder="Search order ID, customer or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length ? filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name || order.user}</td>
                    <td>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>₹{order.total_amount}</td>
                    <td>{order.payment_status || order.payment_method || "-"}</td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => viewDetails(order.id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Order Details #{selectedOrder.id}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                />
              </div>

              <div className="modal-body">
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <strong>Customer</strong>
                    <p>{selectedOrder.customer_name || selectedOrder.user}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Email</strong>
                    <p>{selectedOrder.customer_email || "-"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Phone</strong>
                    <p>{selectedOrder.phone || "-"}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Delivery Address</strong>
                    <p>{selectedOrder.delivery_address || "-"}</p>
                  </div>
                </div>

                <h6 className="fw-bold">Ordered Products</h6>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Pizza</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedOrder.items || []).map((item) => (
                        <tr key={item.id}>
                          <td>{item.product_name || item.pizza_name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.unit_price}</td>
                          <td>₹{item.subtotal || item.total_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-end">
                  <h5>
                    Total: ₹{selectedOrder.total_amount}
                  </h5>
                </div>

                <hr />

                <label className="form-label fw-bold">Update Order Status</label>
                <select
                  className="form-select"
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateStatus(selectedOrder.id, e.target.value)
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
