import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const StoreContextProvider = (props) => {
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);


    const getToken = () => {
        try {
            return localStorage.getItem("token") || sessionStorage.getItem("token");
        } catch {
            return null;
        }
    };



    // Fetch logged-in user
    useEffect(() => {
        const token = getToken();
        if (token) {
            axios
                .get(`${BASE_URL}/api/auth/me`, {
                    headers: { Authorization: token },
                })
                .then((res) => {
                    setUser(res.data);

                    // 🔥 Clear guest cart once user logs in (Zomato-style reset)
                    localStorage.removeItem("guestCart");
                    sessionStorage.removeItem("guestCart");
                })
                .catch((err) => {
                    console.error("Error fetching user:", err);
                })
                .finally(() => {
                    // ✅ Mark auth check as finished
                    setAuthLoading(false);
                });
        } else {
            // ✅ No token, so auth check is done
            setAuthLoading(false);
        }
        }, []);

    // Fetch food items
    useEffect(() => {
        axios
            .get(`${BASE_URL}/api/menu`)
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
            const token = getToken();
            const res = await axios.get(`${BASE_URL}/api/cart`, {
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
        const token = getToken();

        if (!user?.id || !token) {
            // Guest cart
            const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
            guestCart[itemId] = (guestCart[itemId] || 0) + 1;
            localStorage.setItem("guestCart", JSON.stringify(guestCart));
            setCartItems(guestCart);
            setCartCount(Object.values(guestCart).reduce((a, b) => a + b, 0));
            return;
        }

        // Logged-in cart
        await axios.post(
            `${BASE_URL}/api/cart/add?menuItemId=${itemId}&quantity=1`,
            {},
            { headers: { Authorization: token } }
        );

        await refreshCart();
        await refreshCartCount();
    };


    const removeFromCart = async (itemId) => {
        if (!user?.id) {
            // Guest cart
            const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
            if (guestCart[itemId]) {
                if (guestCart[itemId] > 1) {
                    guestCart[itemId] -= 1;   // decrement by 1
                } else {
                    delete guestCart[itemId]; // remove only if quantity goes to 0
                }
            }

            localStorage.setItem("guestCart", JSON.stringify(guestCart));
            setCartItems(guestCart);
            setCartCount(Object.values(guestCart).reduce((a, b) => a + b, 0));
            return;
        }

        const token = getToken();
        await axios.delete(
            `${BASE_URL}/api/cart/remove?menuItemId=${itemId}`,
            { headers: { Authorization: token } }
        );

        await refreshCart();
        await refreshCartCount();
    };


    const removeAllFromCart = async (itemId) => {
        if (!user?.id) return;
        const token = getToken();
        await axios.delete(
            `${BASE_URL}/api/cart/removeAll?menuItemId=${itemId}`,
            { headers: { Authorization: token } }
        );

        await refreshCart();
        await refreshCartCount();
    };

    const clearCart = async () => {
        if (!user?.id) return;
        const token = getToken();
        await axios.delete(`${BASE_URL}/api/cart/clear`, {
            headers: { Authorization: token },
        });

        await refreshCart();
        await refreshCartCount();
    };

    const refreshCartCount = async () => {
        if (!user?.id) return;
        try {
            const token = getToken();
            const res = await axios.get(`${BASE_URL}/api/cart/count`, {
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
            const token = getToken();
            const res = await axios.get(`${BASE_URL}/api/cart/summary`, {
                headers: { Authorization: token },
            });

            return res.data; // { subtotal, deliveryFee, taxes, platformFee, total }
        } catch (error) {
            console.error("Error fetching cart summary:", error);
            return null;
        }

    };

    const logout = () => {
        // Remove token from localStorage and sessionStorage
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("guestCart");


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
        getToken,
        authLoading, 
        BASE_URL,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;