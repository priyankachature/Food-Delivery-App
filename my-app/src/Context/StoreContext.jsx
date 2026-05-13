import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8080/api/auth/me", {
          headers: { Authorization: token },
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, []);

  // Fetch food items
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/menu")
      .then((response) => setFoodList(response.data))
      .catch((error) => console.error("Error fetching food list:", error));
  }, []);

  // Refresh cart when user changes
  useEffect(() => {
    if (user?.id) {
      refreshCart();
      refreshCartCount();
    }
  }, [user]);

  const refreshCart = async () => {
    if (!user?.id) return;
    try {
        const token = localStorage.getItem("token");
       const res = await axios.get(`http://localhost:8080/api/cart`, {
        headers: { Authorization: token },
      });

      const cartMap = {};
      res.data.forEach((item) => {
        cartMap[item.menuItem.id] = item.quantity;
      });
      setCartItems(cartMap);
    } catch (err) {
      console.error("Error refreshing cart:", err);
    }
  };

  const addToCart = async (itemId) => {
    if (!user?.id) return;
    const token = localStorage.getItem("token");

    await axios.post(
      `http://localhost:8080/api/cart/add?menuItemId=${itemId}&quantity=1`,
      {},
      { headers: { Authorization: token } }
    );

    await refreshCart();
    await refreshCartCount();
  };

  const removeFromCart = async (itemId) => {
    if (!user?.id) return;
   const token = localStorage.getItem("token");
    await axios.delete(
      `http://localhost:8080/api/cart/remove?menuItemId=${itemId}`,
      { headers: { Authorization: token } }
    );

    await refreshCart();
    await refreshCartCount();
  };

  const removeAllFromCart = async (itemId) => {
    if (!user?.id) return;
    const token = localStorage.getItem("token");
    await axios.delete(
      `http://localhost:8080/api/cart/removeAll?menuItemId=${itemId}`,
      { headers: { Authorization: token } }
    );

    await refreshCart();
    await refreshCartCount();
  };

  const clearCart = async () => {
    if (!user?.id) return;
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:8080/api/cart/clear`, {
      headers: { Authorization: token },
    });

    await refreshCart();
    await refreshCartCount();
  };

  const refreshCartCount = async () => {
    if (!user?.id) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/cart/count`, {
        headers: { Authorization: token },
      });

      setCartCount(res.data.count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const getCartSummary = async () => {
    if (!user?.id) return null;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/cart/summary`, {
        headers: { Authorization: token },
      });

      return res.data; // { subtotal, deliveryFee, taxes, platformFee, total }
    } catch (error) {
      console.error("Error fetching cart summary:", error);
      return null;
    }

  };

   const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem("token");

  // Reset user and cart state
  setUser(null);
  setCartItems({});
  setCartCount(0);
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
    user,
    setUser,
    logout, 
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;