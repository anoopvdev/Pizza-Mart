
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from 'axios'
const CartContext = createContext();
const API =  "http://127.0.0.1:8000/api/user/auth/cart/"
export function CartProvider({ children }) {
  const[loading,setLoading] = useState(false)
  const[cartItems,setCartItems] = useState([])
  const accessToken = localStorage.getItem("access")
  const getToken = () =>{
    localStorage.getItem("access")
  }
  // const [cartItems, setCartItems] = useState(() => {
  //   try {
  //     return JSON.parse(localStorage.getItem("pizzamart-cart")) || [];
  //   } catch {
  //     return [];
  //   }
  // });
// ---------------------------next Step--------------------------------------
  // useEffect(() => {
  //   localStorage.setItem("pizzamart-cart", JSON.stringify(cartItems));
  // }, [cartItems]);
  const getHeaders = () =>({
    Authorization : `Bearer ${getToken()}`
  });
  const fetchCart = useCallback(async ()=>{
    const token = getToken();

    if(!token){
      setCartItems([]);
      return;
    }
    try{
      setLoading(true);
      const response = await axios.get(API,{
        headers : getHeaders(),
      });
      setCartItems(response.data.items || []);

    }catch(err){
      console.log("Fetch cart error",err.response?.data || err.message)
    }finally{
      setLoading(false)
    }
  },[])
  const addToCart = async (pizza) => {
    try{
      const response = await axios.post(API,{
        pizza_id : pizza.id,
        quantity : 1,
      },{
        headers :{
          Authorization : `Bearer ${accessToken}`
        }
      });
      await fetchCart();
      return response.data;
    }catch(error){
      console.log("Add cart error:",error.response?.data || error.message);
      // throw error;
    }
  };

  const increaseQuantity = async (id) =>{
    try{
      await axios.patch(
        `${API}${id}/`,
        {action : "increase"},
        {headers : getHeaders()}
      );
      await fetchCart();
    }catch(error){
      console.log("Increase error : ",error.response?.data || error.message)
    }
  }

  const decreaseQuantity = async (id) =>{
    try{
      await axios.patch(`${API}${id}/`,
        { action: "decrease"},
        {headers : getHeaders()}
      );
      await fetchCart();
    }catch(error){
      console.log("Decrease error",error.response?.data || error.message)
    }
  }
  const removeFromCart = async (id) =>{
    try{
      await axios.delete(`${API}${id}/`,{
        headers : getHeaders(),
      })
      await fetchCart()
    }catch(error){
      console.log("Remove cart ",error.response?.data || error.message)
    }
  }

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
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
