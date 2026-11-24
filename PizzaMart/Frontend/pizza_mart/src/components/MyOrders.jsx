
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../axios";




const CANCELLABLE_STATUSES = ["pending", "confirmed"];

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
 const [refundOrder,setRefundOrder] = useState(null);
 const [refundReason,setRefundReason] = useState("")
 const [refundloading,setRefundloading] = useState(false)
 const [refundError,setRefundError] = useState("");
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

  const handleRefundRequest = async () =>{
    if(!refundOrder || !refundReason.trim()){
      setRefundError("Please enter a refund reason.")
      return;
    }
    setRefundloading(true);
    setRefundError("")

    try{
      const response = await api.post(
        `orders/${refundOrder.order_number}/refund-request/`,
        {reason : refundReason},
        {headers: authHeaders()}
      );
      setMessage(response.data.message || "Refund Request submitted.")
      setRefundOrder(null)
      setRefundReason("")
    }catch(error){
      setRefundError(error.response?.data?.error || error.response?.data?.message || "Could not submite refund request.")
    }finally{
      setRefundloading(false)
    }

  }

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
const getPizzaImage = (item) => {
  const image =
    item.image ||
    item.pizza_image ||
    item.pizza?.image ||
    item.pizza?.image_url;

  if (!image) return "";

  // Already an absolute URL (Cloudinary or another image host)
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Convert Django media path into an absolute URL
  const baseURL = api.defaults.baseURL || window.location.origin;
  const backendOrigin = new URL(baseURL, window.location.origin).origin;

  return `${backendOrigin}${image.startsWith("/") ? "" : "/"}${image}`;
};

const handlePrintInvoice = (order) => {
  const items = order.items || [];

  const invoiceWindow = window.open("", "_blank");

  if (!invoiceWindow) {
    alert("Please allow pop-ups to print your invoice.");
    return;
  }

  const rows = items.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>₹${Number(item.price || 0).toFixed(2)}</td>
      <td>₹${Number(item.subtotal || 0).toFixed(2)}</td>
    </tr>
  `).join("");

  invoiceWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${order.order_number}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          color: #333;
        }
        h1 {
          color: #dc3545;
        }
        .details {
          margin: 20px 0;
          line-height: 1.8;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 25px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background: #f2f2f2;
        }
        .total {
          text-align: right;
          margin-top: 25px;
          font-size: 20px;
          font-weight: bold;
        }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>PizzaMart</h1>
      <h2>Order Invoice</h2>

      <div class="details">
        <strong>Order Number:</strong> ${order.order_number}<br>
        <strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}<br>
        <strong>Customer:</strong> ${order.delivery_name || ""}<br>
        <strong>Phone:</strong> ${order.phone || ""}<br>
        <strong>Address:</strong> ${order.address || ""}<br>
        <strong>Payment:</strong> ${(order.payment_method || "").toUpperCase()}
      </div>

      <table>
        <thead>
          <tr>
            <th>Pizza</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="total">
        Total: ₹${Number(order.total_amount).toFixed(2)}
      </div>

      <p style="margin-top:40px;text-align:center;">
        Thank you for ordering with PizzaMart!
      </p>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `);

  invoiceWindow.document.close();
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
      <button
  className="btn btn-outline-secondary mb-3"
  onClick={() => navigate(-1)}
>
  <i className="bi bi-arrow-left me-2"></i>
  Back
</button>


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
                {/* <div className="d-flex justify-content-between align-items-center mb-2">
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
                ))} */}
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

{items.map((item) => {
  const pizzaImage = item.image;
   console.log("Item:", item);
console.log("Image:", item.image);
console.log("Pizza image URL:", pizzaImage);
  return (
    <div key={item.id} className="py-3 border-bottom">

      <div className="d-flex justify-content-between align-items-center gap-3">

        {/* Pizza image and details */}
        <div className="d-flex align-items-center gap-3">

          {pizzaImage ? (
            <img
              src={pizzaImage}
              alt={item.name || "Pizza"}
              width="85"
              height="85"
              className="rounded"
              style={{
                objectFit: "cover",
                flexShrink: 0,
                border: "1px solid #dee2e6"
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}
          

          {/* Fallback if image is unavailable */}
          <div
            className="rounded bg-light border align-items-center justify-content-center"
            style={{
              width: "85px",
              height: "85px",
              flexShrink: 0,
              display: pizzaImage ? "none" : "flex"
            }}
          >
            <i className="bi bi-image text-secondary fs-3"></i>
          </div>

          <div>
            <div className="fw-semibold">
              {item.name} × {item.quantity}
            </div>

            {(item.size || item.crust) && (
              <small className="text-muted">
                {[item.size, item.crust]
                  .filter(Boolean)
                  .join(" • ")}
              </small>
            )}

            <div className="text-muted small mt-1">
              ₹{Number(item.price || 0).toFixed(2)} each
            </div>
          </div>
        </div>

        {/* Subtotal */}
        <span className="fw-semibold text-nowrap">
          ₹{Number(item.subtotal || 0).toFixed(2)}
        </span>
      </div>

      {/* Expanded pizza details */}
      {isOpen && (
        <div className="ms-1 mt-3 small bg-light rounded p-3">

          {item.price !== undefined && (
            <div>
              <span className="text-muted">Price each: </span>
              ₹{Number(item.price).toFixed(2)}
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
  );
})}
          
                {isOpen && (
                  <div className="small mt-3">
                    {order.address && (
                      <div className="mb-1">
                        <span className="text-muted">Delivery address: </span>
                        {typeof order.address === "string"
                          ? order.address
                          : Object.values(order.address)
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

                    {order.payment_method === "razorpay" &&
                     order.payment_status === "paid" &&
                    order.status === "cancelled" && (
                    <button
                      className="btn btn-warning btn-sm"
                       onClick={() => {
                          setRefundOrder(order);
                        setRefundReason("");
                          setRefundError("");
                          }}  
                          >
                          Request Refund
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
                    <button
  className="btn btn-outline-success btn-sm"
  onClick={() => handlePrintInvoice(order)}
>
  <i className="bi bi-file-earmark-pdf"></i> Invoice
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
      
{/* Refund confirmation modal */}
{refundOrder && (
  <>
    <div className="modal-backdrop fade show"></div>

    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Request Refund</h5>

            <button
              type="button"
              className="btn-close"
              onClick={() => {
                if (!refundloading) setRefundOrder(null);
              }}
              disabled={refundloading}
            ></button>
          </div>

          <div className="modal-body">
            <p>
              Refund request for order{" "}
              <strong>#{refundOrder.order_number}</strong>
            </p>

            <label className="form-label">
              Refund Reason
            </label>

            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter your refund reason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              disabled={refundloading}
            />

            {refundError && (
              <div className="alert alert-danger mt-3 mb-0">
                {refundError}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setRefundOrder(null)}
              disabled={refundloading}
            >
              Close
            </button>

            <button
              className="btn btn-warning"
              onClick={handleRefundRequest}
              disabled={refundloading}
            >
              {refundloading ? "Submitting..." : "Submit Request"}
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