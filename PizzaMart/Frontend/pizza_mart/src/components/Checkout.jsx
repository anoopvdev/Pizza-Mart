import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartCotext";

const API = "http://127.0.0.1:8000/api/user/auth/";

const Checkout = () => {

  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    fetchCart
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    delivery_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {

      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e) => {

    e.preventDefault();

    setError("");

    if (!cartItems.length) {
      setError("Your cart is empty");
      return;
    }

    try {

      setLoading(true);

      // 1. Create order in Django
      const response = await axios.post(
        `${API}orders/checkout/`,
        {
          ...formData,
          payment_method: paymentMethod,
        },
        {
          headers: getHeaders(),
        }
      );

      const data = response.data;

      // 2. Cash on Delivery
      if (paymentMethod === "cod") {

        await fetchCart();

        navigate(
          `/order-success/${data.order.order_number}`
        );

        return;
      }

      // 3. Load Razorpay Checkout
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Unable to load Razorpay Checkout");
      }

      // 4. Open Razorpay payment window
      const options = {

        key: data.razorpay.key,

        amount: data.razorpay.amount,

        currency: data.razorpay.currency,

        name: "PizzaMart",

        description: "Pizza Order Payment",

        order_id: data.razorpay.razorpay_order_id,

        prefill: {
          name: formData.delivery_name,
          contact: formData.phone,
        },

        theme: {
          color: "#dc3545",
        },

        handler: async function (paymentResponse) {

          try {

            const verifyResponse = await axios.post(
              `${API}orders/verify-payment/`,
              {
                order_number: data.order.order_number,

                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,
              },
              {
                headers: getHeaders(),
              }
            );

            if (verifyResponse.data.order.payment_status !== "paid") {
              setError("Payment is not confirmed yet. Please check your order status.");
              return;
            }

            await fetchCart();

            navigate(
              `/order-success/${data.order.order_number}`
            );

          } catch (err) {
            console.log("STATUS : ",err.response?.status);
            console.log("ERROR RESPONSE :",err.response?.data)
            alert(
              err.response?.data?.error || "Checkout faied Please try again"
            )
            setError(
              err.response?.data?.error ||
              "Payment verification failed. Please contact support if money was deducted."
            );
          }
        },

        modal: {
          ondismiss: function () {
            setError(
              "Payment window closed. Your cart has not been cleared."
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

    } catch (err) {

      setError(
        err.response?.data?.error ||
        err.message ||
        "Unable to place order"
      );

    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="container text-center py-5">
        <h3>Your cart is empty</h3>

        <button
          className="btn btn-danger mt-3"
          onClick={() => navigate("/menu")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (

    <div className="container py-5">

      <h2 className="text-center mb-4">
        Checkout
      </h2>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="row g-4">

        {/* Delivery information */}

        <div className="col-lg-7">

          <div className="card shadow-sm p-4">

            <h4 className="mb-3">
              Delivery Details
            </h4>

            <form onSubmit={handleCheckout}>

              <div className="mb-3">

                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  name="delivery_name"
                  className="form-control"
                  value={formData.delivery_name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="15"
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  className="form-control"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="mb-4">

                <label className="form-label">
                  PIN Code
                </label>

                <input
                  type="text"
                  name="pincode"
                  className="form-control"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength="6"
                  required
                />

              </div>

              <hr />

              <h5 className="mb-3">
                Select Payment Method
              </h5>

              <div className="form-check border rounded p-3 mb-2">

                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id="razorpay"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <label
                  className="form-check-label ms-2"
                  htmlFor="razorpay"
                >
                  <strong>Online Payment</strong>
                  <br />
                  <small>
                    Pay using Razorpay
                  </small>
                </label>

              </div>

              <div className="form-check border rounded p-3 mb-4">

                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id="cod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <label
                  className="form-check-label ms-2"
                  htmlFor="cod"
                >
                  <strong>Cash on Delivery</strong>
                  <br />
                  <small>
                    Pay when your pizza arrives
                  </small>
                </label>

              </div>

              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={loading}
              >

                {loading
                  ? "Processing..."
                  : paymentMethod === "cod"
                    ? "Place Order"
                    : "Proceed to Payment"
                }

              </button>

            </form>

          </div>

        </div>

        {/* Order summary */}

        <div className="col-lg-5">

          <div className="card shadow-sm p-4">

            <h4 className="mb-3">
              Order Summary
            </h4>

            {cartItems.map((item) => (

              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center border-bottom py-3"
              >

                <div className="d-flex align-items-center gap-3">

                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "65px",
                        height: "65px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}

                  <div>
                    <h6 className="mb-1">
                      {item.name}
                    </h6>

                    <small>
                      Quantity: {item.quantity}
                    </small>
                  </div>

                </div>

                <strong>
                  ₹{(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toFixed(2)}
                </strong>

              </div>

            ))}

            <div className="d-flex justify-content-between mt-3">
              <span>Subtotal</span>
              <strong>₹{Number(cartTotal).toFixed(2)}</strong>
            </div>

            <div className="d-flex justify-content-between mt-2">
              <span>Delivery Fee</span>
              <strong>₹0.00</strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
              <h5>Total</h5>

              <h5 className="text-danger">
                ₹{Number(cartTotal).toFixed(2)}
              </h5>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;