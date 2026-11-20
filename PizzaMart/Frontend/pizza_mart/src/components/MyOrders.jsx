// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import api from "../axios";



// const MyOrders = () => {

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {

//     const fetchOrders = async () => {

//       try {

//         const response = await api.get(
//           "orders/",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("access")}`,
//             },
//           }
//         );

//         setOrders(response.data.orders || []);

//       } catch (error) {

//         console.log(
//           "Orders error:",
//           error.response?.data || error.message
//         );

//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();

//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center mt-5 py-5">
//         <div className="spinner-border text-danger" role="status"></div>
//         <p className="mt-3">Loading My Order...</p>
//       </div>
//     );
//   }

//   return (

//     <div className="container py-5">

//       <h2 className="mb-4">
//         My Orders
//       </h2>

//       {orders.length === 0 ? (

//         <div className="text-center py-5">

//           <h4>No orders found</h4>

//           <button
//             className="btn btn-danger mt-3"
//             onClick={() => navigate("/menu")}
//           >
//             Order Now
//           </button>

//         </div>

//       ) : (

//         orders.map((order) => (

//           <div
//             className="card shadow-sm mb-3"
//             key={order.id}
//           >

//             <div className="card-body">

//               <div className="d-flex justify-content-between flex-wrap gap-2">

//                 <div>

//                   <h5>
//                     Order #{order.order_number}
//                   </h5>

//                   <small className="text-muted">
//                     {new Date(order.created_at).toLocaleString()}
//                   </small>

//                 </div>

//                 <div className="text-end">

//                   <h5 className="text-danger">
//                     ₹{Number(order.total_amount).toFixed(2)}
//                   </h5>

//                   <span className="badge bg-primary">
//                     {order.status.replaceAll("_", " ").toUpperCase()}
//                   </span>

//                 </div>

//               </div>

//               <hr />

//               {order.items.map((item) => (

//                 <div
//                   key={item.id}
//                   className="d-flex justify-content-between py-1"
//                 >

//                   <span>
//                     {item.name} × {item.quantity}
//                   </span>

//                   <span>
//                     ₹{Number(item.subtotal).toFixed(2)}
//                   </span>

//                 </div>

//               ))}

//               <hr />

//               <div className="d-flex justify-content-between align-items-center">

//                 <span>
//                   Payment: {order.payment_method.toUpperCase()} (
//                   {order.payment_status.toUpperCase()})
//                 </span>

//                 <button
//                   className="btn btn-outline-danger btn-sm"
//                   onClick={() =>
//                     navigate(`/order-success/${order.order_number}`)
//                   }
//                 >
//                   View Details
//                 </button>

//               </div>

//             </div>

//           </div>

//         ))

//       )}

//     </div>
//   );
// };

// export default MyOrders;





import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../axios";
const API = "https://pizza-mart-mu8r.onrender.com/api/user/auth/";

// Orders in these statuses can still be cancelled by the customer.
// Change this list to match the statuses your backend uses.
const CANCELLABLE_STATUSES = ["pending", "confirmed", "placed"];

const STATUS_COLORS = {
  pending: "bg-warning text-dark",
  placed: "bg-warning text-dark",
  confirmed: "bg-primary",
  preparing: "bg-info text-dark",
  out_for_delivery: "bg-info text-dark",
  delivered: "bg-success",
  cancelled: "bg-secondary",
  canceled: "bg-secondary",
};

const formatStatus = (status = "") => status.replaceAll("_", " ").toUpperCase();

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Which order cards are expanded to show pizza details
  const [expanded, setExpanded] = useState({});

  // Cancel flow
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const navigate = useNavigate();

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("orders/", {
          headers: authHeaders(),
        });

        setOrders(response.data.orders || []);
      } catch (err) {
        console.log("Orders error:", err.response?.data || err.message);

        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError("Could not load your orders. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const canCancel = (order) =>
    CANCELLABLE_STATUSES.includes((order.status || "").toLowerCase());

  const toggleDetails = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const openCancelModal = (order) => {
    setOrderToCancel(order);
    setCancelReason("");
    setCancelError("");
  };

  const closeCancelModal = () => {
    if (cancelling) return;
    setOrderToCancel(null);
    setCancelError("");
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    setCancelling(true);
    setCancelError("");

    try {
      // NOTE: adjust this URL/method to match your Django endpoint.
      // Expected: POST /api/user/auth/orders/<order_number>/cancel/
      const response = await api.post(
        `orders/${orderToCancel.order_number}/cancel/`,
        { reason: cancelReason },
        { headers: authHeaders() }
      );

      // Update the order in the list without refetching everything
      const updated = response.data?.order;

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderToCancel.id
            ? updated
              ? { ...o, ...updated }
              : { ...o, status: "cancelled" }
            : o
        )
      );

      setMessage(`Order #${orderToCancel.order_number} has been cancelled.`);
      setOrderToCancel(null);
    } catch (err) {
      console.log("Cancel error:", err.response?.data || err.message);

      setCancelError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.response?.data?.detail ||
          "Could not cancel this order. Please try again."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-3">Loading My Orders...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Orders</h2>

      {message && (
        <div
          className="alert alert-success alert-dismissible"
          role="alert"
        >
          {message}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setMessage("")}
          ></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!error && orders.length === 0 ? (
        <div className="text-center py-5">
          <h4>No orders found</h4>

          <button
            className="btn btn-danger mt-3"
            onClick={() => navigate("/menu")}
          >
            Order Now
          </button>
        </div>
      ) : (
        orders.map((order) => {
          const items = order.items || [];
          const isOpen = !!expanded[order.id];
          const status = (order.status || "").toLowerCase();

          return (
            <div className="card shadow-sm mb-3" key={order.id}>
              <div className="card-body">
                {/* Header */}
                <div className="d-flex justify-content-between flex-wrap gap-2">
                  <div>
                    <h5>Order #{order.order_number}</h5>

                    <small className="text-muted">
                      {new Date(order.created_at).toLocaleString()}
                    </small>
                  </div>

                  <div className="text-end">
                    <h5 className="text-danger">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </h5>

                    <span
                      className={`badge ${
                        STATUS_COLORS[status] || "bg-primary"
                      }`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </div>
                </div>

                <hr />

                {/* Ordered pizzas */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>
                    Ordered Items ({items.length})
                  </strong>

                  <button
                    className="btn btn-link btn-sm p-0 text-decoration-none"
                    onClick={() => toggleDetails(order.id)}
                  >
                    {isOpen ? "Hide details" : "Show details"}
                  </button>
                </div>

                {items.map((item) => (
                  <div key={item.id} className="py-2 border-bottom">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div className="d-flex gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            width="56"
                            height="56"
                            className="rounded"
                            style={{ objectFit: "cover" }}
                          />
                        )}

                        <div>
                          <div className="fw-semibold">
                            {item.name} × {item.quantity}
                          </div>

                          {/* Quick summary always visible */}
                          {(item.size || item.crust) && (
                            <small className="text-muted">
                              {[item.size, item.crust]
                                .filter(Boolean)
                                .join(" • ")}
                            </small>
                          )}
                        </div>
                      </div>

                      <span className="fw-semibold">
                        ₹{Number(item.subtotal).toFixed(2)}
                      </span>
                    </div>

                    {/* Expanded pizza details */}
                    {isOpen && (
                      <div className="ms-1 mt-2 small bg-light rounded p-2">
                        {item.price !== undefined && (
                          <div>
                            <span className="text-muted">Price each: </span>₹
                            {Number(item.price).toFixed(2)}
                          </div>
                        )}

                        <div>
                          <span className="text-muted">Quantity: </span>
                          {item.quantity}
                        </div>

                        {item.size && (
                          <div>
                            <span className="text-muted">Size: </span>
                            {item.size}
                          </div>
                        )}

                        {item.crust && (
                          <div>
                            <span className="text-muted">Crust: </span>
                            {item.crust}
                          </div>
                        )}

                        {Array.isArray(item.toppings) &&
                          item.toppings.length > 0 && (
                            <div>
                              <span className="text-muted">Toppings: </span>
                              {item.toppings
                                .map((t) =>
                                  typeof t === "string" ? t : t.name
                                )
                                .join(", ")}
                            </div>
                          )}

                        {item.description && (
                          <div className="text-muted mt-1">
                            {item.description}
                          </div>
                        )}

                        {item.special_instructions && (
                          <div>
                            <span className="text-muted">Note: </span>
                            {item.special_instructions}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Order level details */}
                {isOpen && (
                  <div className="small mt-3">
                    {order.delivery_address && (
                      <div className="mb-1">
                        <span className="text-muted">Delivery address: </span>
                        {typeof order.delivery_address === "string"
                          ? order.delivery_address
                          : Object.values(order.delivery_address)
                              .filter(Boolean)
                              .join(", ")}
                      </div>
                    )}

                    {order.phone && (
                      <div className="mb-1">
                        <span className="text-muted">Phone: </span>
                        {order.phone}
                      </div>
                    )}

                    {order.cancel_reason && status.startsWith("cancel") && (
                      <div className="mb-1">
                        <span className="text-muted">Cancel reason: </span>
                        {order.cancel_reason}
                      </div>
                    )}
                  </div>
                )}

                <hr />

                {/* Footer */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span>
                    Payment: {(order.payment_method || "").toUpperCase()} (
                    {(order.payment_status || "").toUpperCase()})
                  </span>

                  <div className="d-flex gap-2">
                    {canCancel(order) && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => openCancelModal(order)}
                      >
                        Cancel Order
                      </button>
                    )}

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        navigate(`/order-success/${order.order_number}`)
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Cancel confirmation modal (pure React + Bootstrap classes, no JS needed) */}
      {orderToCancel && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            onClick={closeCancelModal}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Cancel order?</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeCancelModal}
                    disabled={cancelling}
                  ></button>
                </div>

                <div className="modal-body">
                  <p>
                    Are you sure you want to cancel order{" "}
                    <strong>#{orderToCancel.order_number}</strong>? This cannot
                    be undone.
                  </p>

                  <label htmlFor="cancelReason" className="form-label">
                    Reason (optional)
                  </label>
                  <textarea
                    id="cancelReason"
                    className="form-control"
                    rows="3"
                    placeholder="Tell us why you are cancelling"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    disabled={cancelling}
                  ></textarea>

                  {cancelError && (
                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                      {cancelError}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={closeCancelModal}
                    disabled={cancelling}
                  >
                    Keep Order
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                  >
                    {cancelling ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Cancelling...
                      </>
                    ) : (
                      "Yes, Cancel Order"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;