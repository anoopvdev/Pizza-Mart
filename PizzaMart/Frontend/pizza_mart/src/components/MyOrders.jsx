import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../axios";



const MyOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const response = await api.get(
          "orders/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        setOrders(response.data.orders || []);

      } catch (error) {

        console.log(
          "Orders error:",
          error.response?.data || error.message
        );

      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-3">Loading My Order...</p>
      </div>
    );
  }

  return (

    <div className="container py-5">

      <h2 className="mb-4">
        My Orders
      </h2>

      {orders.length === 0 ? (

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

        orders.map((order) => (

          <div
            className="card shadow-sm mb-3"
            key={order.id}
          >

            <div className="card-body">

              <div className="d-flex justify-content-between flex-wrap gap-2">

                <div>

                  <h5>
                    Order #{order.order_number}
                  </h5>

                  <small className="text-muted">
                    {new Date(order.created_at).toLocaleString()}
                  </small>

                </div>

                <div className="text-end">

                  <h5 className="text-danger">
                    ₹{Number(order.total_amount).toFixed(2)}
                  </h5>

                  <span className="badge bg-primary">
                    {order.status.replaceAll("_", " ").toUpperCase()}
                  </span>

                </div>

              </div>

              <hr />

              {order.items.map((item) => (

                <div
                  key={item.id}
                  className="d-flex justify-content-between py-1"
                >

                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    ₹{Number(item.subtotal).toFixed(2)}
                  </span>

                </div>

              ))}

              <hr />

              <div className="d-flex justify-content-between align-items-center">

                <span>
                  Payment: {order.payment_method.toUpperCase()} (
                  {order.payment_status.toUpperCase()})
                </span>

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

        ))

      )}

    </div>
  );
};

export default MyOrders;