import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../Context/StoreContext";

const OrderSummary = ({ promoCode,
    showActionButton = false,
    actionLabel = "Proceed TO Checkout",
    actionPath = "/order",
    disabled = false

}) => {
    const { getCartSummary, cartCount, cartItems } = useContext(StoreContext);
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            const data = await getCartSummary(promoCode);
            setSummary(data);
        };
        fetchSummary();
    }, [promoCode, cartItems, cartCount]);

    const isEmpty = cartCount === 0;

    return (
        <div className="w-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="text-sm space-y-2 mt-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">${summary?.subtotal?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">${summary?.deliveryFee?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="font-semibold">${summary?.taxes?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span className="font-semibold">${summary?.platformFee?.toFixed(2) || "0.00"}</span>
                </div>

                <div className="border-t my-3"></div>

                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${summary?.total?.toFixed(2) || "0.00"}</span>
                </div>
            </div>

            {/* Checkout button */}
            {/* <button
        onClick={() => navigate("/order")}
        disabled={isEmpty}
        className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold text-white ${
          isEmpty ? "bg-slate-300 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700"
        }`}
      >
        PROCEED TO CHECKOUT
      </button> */}

            {showActionButton && (
                <button
                    onClick={() => navigate(actionPath)}
                    disabled={disabled || isEmpty}
                    className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold text-white ${disabled || isEmpty
                            ? "bg-slate-300 cursor-not-allowed"
                            : "bg-amber-600 hover:bg-amber-700"
                        }`}
                >
                    {actionLabel}
                </button>
            )}


            {/* Promo code input */}
            <div className="mt-4">
                <label className="text-sm font-medium">Have a Promo Code?</label>
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        placeholder="Enter promo code"
                        className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm"
                    />
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-full text-sm">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;