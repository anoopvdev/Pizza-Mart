
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

import axios from "axios";
import api from "../axios";

const CartContext = createContext();



export function CartProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const getToken = () => {
    return localStorage.getItem("access");
  };

  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
  });

  // 1. Fetch cart from Django backend
  const fetchCart = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("cart/", {
        headers: getHeaders(),
      });

      console.log("Cart API Response:", response.data);

      setCartItems(response.data.items || []);

    } catch (error) {
      console.log(
        "Fetch cart error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);


  const addToCart = async (pizza) => {
    const token = getToken();

    if (!token) {
      console.log("Please login first");
      return;
    }

    try {
      const response = await api.post(
        API,
        {
          pizza_id: pizza.id,
          quantity: 1,
        },
        {
          headers: getHeaders(),
        }
      );

      console.log("Added to cart:", response.data);

      await fetchCart();

      return response.data;

    } catch (error) {
      console.log(
        "Add cart error:",
        error.response?.data || error.message
      );
    }
  };

  // 4. Increase quantity
  const increaseQuantity = async (id) => {
    try {
      await api.patch(
        `${API}${id}/`,
        { action: "increase" },
        { headers: getHeaders() }
      );

      await fetchCart();

    } catch (error) {
      console.log(
        "Increase error:",
        error.response?.data || error.message
      );
    }
  };

  // 5. Decrease quantity
  const decreaseQuantity = async (id) => {
    try {
      await api.patch(
        `cart/${id}/`,
        { action: "decrease" },
        { headers: getHeaders() }
      );

      await fetchCart();

    } catch (error) {
      console.log(
        "Decrease error:",
        error.response?.data || error.message
      );
    }
  };

  // 6. Remove item
  const removeFromCart = async (id) => {
    try {
      await api.delete(
        `cart/${id}/`,
        { headers: getHeaders() }
      );

      await fetchCart();

    } catch (error) {
      console.log(
        "Remove cart error:",
        error.response?.data || error.message
      );
    }
  };

  // Local clear only — not database deletion
  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        fetchCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
