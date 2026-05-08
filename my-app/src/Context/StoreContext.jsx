import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const userId = 1; // Replace with actual logged-in user id

  // Fetch food items from backend
  useEffect(() => {
    axios.get("http://localhost:8080/api/menu")
      .then(response => setFoodList(response.data))
      .catch(error => console.error("Error fetching food list:", error));
  }, []);


   useEffect(() => {
  refreshCartCount();
}, []);


  // Fetch cart items from backend
  useEffect(() => {
    axios.get(`http://localhost:8080/api/cart/${userId}`)
      .then(response => {
        const cartMap = {};
        response.data.forEach(item => {
          cartMap[item.menuItem.id] = item.quantity;
        });
        setCartItems(cartMap);
      })
      .catch(error => console.error("Error fetching cart:", error));
  }, []);

 

  const refreshCart = async () => {
    const res = await axios.get(`http://localhost:8080/api/cart/${userId}`);
    const cartMap = {};
    res.data.forEach(item => {
      cartMap[item.menuItem.id] = item.quantity;
    });
    setCartItems(cartMap);
  };

  const addToCart = async (itemId) => {
    await axios.post(`http://localhost:8080/api/cart/add?userId=${userId}&menuItemId=${itemId}&quantity=1`);
    await refreshCart();
    await refreshCartCount();
  };

  const removeFromCart = async (itemId) => {
    await axios.delete(`http://localhost:8080/api/cart/remove?userId=${userId}&menuItemId=${itemId}`);
    await refreshCart();
    await refreshCartCount();
  };

  const removeAllFromCart = async (itemId) => {
  await axios.delete(`http://localhost:8080/api/cart/removeAll?userId=${userId}&menuItemId=${itemId}`);
  await refreshCart();
  await refreshCartCount();
};


  const clearCart = async () => {
    await axios.delete(`http://localhost:8080/api/cart/clear/${userId}`);
    await refreshCart();
    await refreshCartCount();
  };



  const refreshCartCount = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/cart/${userId}/count`);
    // If backend returns { "count": 3 }
    setCartCount(res.data.count);
   
  } catch (error) {
    console.error("Error fetching cart count:", error);
  }
};

const getCartSummary = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/cart/${userId}/summary`);
    return res.data; // { subtotal, deliveryFee, taxes, platformFee, total }
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    return null;
  }
};





  const contextValue = {
    food_list,
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    removeAllFromCart,
    clearCart,
    getCartSummary, 
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;