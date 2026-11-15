import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = "https://pizza-mart-mu8r.onrender.com/api/user/auth/";

const OrderSuccess = () => {

  const { orderNumber } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchOrder = async () => {

      try {

        const response = await axios.get(
          `${API}orders/${orderNumber}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        setOrder(response.data.order);

      } catch (err) {

        setError(
          err.response?.data?.detail ||
          "Unable to load order details"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

  }, [orderNumber]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">
          {error || "Order not found"}
        </div>

        <button
          className="btn btn-danger"
          onClick={() => navigate("/menu")}
        >
          Go to Menu
        </button>
      </div>
    );
  }

  const isPaid = order.payment_status === "paid";
  const isCOD = order.payment_method === "cod";

  return (

    <div className="container py-5">

      <div className="card shadow-sm mx-auto p-4" style={{ maxWidth: "750px" }}>

        <div className="text-center mb-4">

          <div
            className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: "75px",
              height: "75px",
              fontSize: "35px",
            }}
          >
            ✓
          </div>

          <h2 className="text-success">
            Order Placed Successfully!
          </h2>

          <p className="text-muted">
            Thank you for ordering from PizzaMart.
          </p>

        </div>

        <hr />

        <h5>Order Information</h5>

        <p>
          <strong>Order Number:</strong> {order.order_number}
        </p>

        <p>
          <strong>Order Status:</strong>{" "}
          <span className="badge bg-primary">
            {order.status.replaceAll("_", " ").toUpperCase()}
          </span>
        </p>

        <p>
          <strong>Payment Method:</strong>{" "}
          {isCOD ? "Cash on Delivery" : "Razorpay"}
        </p>

        <p>
          <strong>Payment Status:</strong>{" "}
          <span className={`badge ${isPaid ? "bg-success" : "bg-warning text-dark"}`}>
            {order.payment_status.toUpperCase()}
          </span>
        </p>

        <hr />

        <h5>Delivery Address</h5>

        <p className="mb-1">
          {order.delivery_name}
        </p>

        <p className="mb-1">
          {order.address}
        </p>

        <p>
          {order.city}, {order.state} - {order.pincode}
        </p>

        <hr />

        <h5>Ordered Pizzas</h5>

        {order.items.map((item) => (

          <div
            key={item.id}
            className="d-flex justify-content-between border-bottom py-3"
          >

            <div>
              <strong>{item.name}</strong>

              <div className="text-muted">
                ₹{Number(item.price).toFixed(2)} × {item.quantity}
              </div>
            </div>

            <strong>
              ₹{Number(item.subtotal).toFixed(2)}
            </strong>

          </div>

        ))}

        <hr />

        <div className="d-flex justify-content-between">
          <span>Subtotal</span>
          <strong>₹{Number(order.subtotal).toFixed(2)}</strong>
        </div>

        <div className="d-flex justify-content-between mt-2">
          <span>Delivery Fee</span>
          <strong>₹{Number(order.delivery_fee).toFixed(2)}</strong>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <h5>Total Amount</h5>

          <h5 className="text-danger">
            ₹{Number(order.total_amount).toFixed(2)}
          </h5>
        </div>

        {isCOD && (
          <div className="alert alert-info mt-3">
            Please pay ₹{Number(order.total_amount).toFixed(2)} when your order is delivered.
          </div>
        )}

        <div className="d-flex gap-2 mt-4">

          <button
            className="btn btn-danger flex-fill"
            onClick={() => navigate("/menu")}
          >
            Continue Shopping
          </button>

          <button
            className="btn btn-outline-dark flex-fill"
            onClick={() => navigate("/my-orders")}
          >
            My Orders
          </button>

        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;