import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import OrderSummary from "../components/OrderSummary";
import { StoreContext } from "../Context/StoreContext";

const Payment = ({ promoCode }) => {
  const { clearCart, getToken , BASE_URL } = useContext(StoreContext);
  const location = useLocation();
  const orderId = location.state?.orderId || order?.id;
  const [order, setOrder] = useState(location.state?.order || null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId || order) return;
    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
          headers: { Authorization: getToken() }
        });
        setOrder(res.data);
      } catch (err) { console.error("Failed to fetch order", err); }
    })();
  }, [orderId, order, getToken]);


  const handlePayment = async () => {
    if (!paymentMethod) return alert("Please select a payment method");
    try {
      const token = getToken();
      const res = await axios.post(`${BASE_URL}/api/payments/initiate`, { orderId, method: paymentMethod }, { headers: { Authorization: token } });
      const paymentId = res.data.paymentId;
      alert("Redirecting to payment gateway...");

      setTimeout(async () => {
        const confirmRes = await axios.post(`${BASE_URL}/api/payments/confirm`, { orderId, paymentId, success: true }, { headers: { Authorization: token } });
        console.log("Payment confirmed:", confirmRes.data);
        const placeRes = await axios.post(`${BASE_URL}/api/payments/place`, { orderId }, { headers: { Authorization: token } });
        console.log("Order placed:", placeRes.data);

        await clearCart();
        setOrder(placeRes.data);
        alert("Payment successful! Your order has been placed.");
        navigate("/orderConfirmation", { state: { orderId: placeRes.data.id, order: placeRes.data } });
      }, 2000);
    } catch (err) {
      console.error("Payment failed", err);
      alert("Payment failed!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Checkout</h1>
          <div className="flex gap-2 text-xs sm:text-sm text-slate-600">
            <span className="font-semibold text-green-600">Address</span> ➝ <span className="font-semibold text-green-600">Order</span> ➝ <span className="font-semibold text-slate-900">Payment</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 px-4 py-6 sm:px-6">
        <section className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-sm sm:text-lg font-semibold text-slate-900 mb-3">Delivering To</h2>
            {order?.address ? (
              <div className="rounded-lg border border-amber-200 p-4 bg-slate-50">
                <p className="font-medium">{order.address.fullName}</p>
                <p className="text-xs sm:text-sm text-slate-600">{order.address.address1}{order.address.address2 && `, ${order.address.address2}`}<br />{order.address.city}, {order.address.state} - {order.address.pin}</p>
                <p className="text-xs sm:text-sm text-slate-600">📞 {order.address.mobile}</p>
              </div>
            ) : <p className="text-sm text-red-600">No address found</p>}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-sm sm:text-lg font-semibold text-slate-900 mb-3">Choose Payment Method</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Card", icon: "💳" }, { label: "UPI", icon: "📱" }, { label: "Netbanking", icon: "🏦" }, { label: "Wallet", icon: "👛" }, { label: "Cash on Delivery", icon: "💵" }
              ].map(method => (
                <button
                  key={method.label} onClick={() => setPaymentMethod(method.label)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border px-4 py-6 text-xs sm:text-base font-medium transition w-full ${paymentMethod === method.label ? "border-green-600 bg-green-50 text-green-700" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}
                >
                  <span className="text-xl sm:text-2xl">{method.icon}</span>{method.label}
                </button>
              ))}
            </div>
          </div>
        </section>
        <aside className="lg:sticky lg:top-6"><OrderSummary order={order} promoCode={promoCode} showActionButton={false} /></aside>
      </main>

      <footer className="sticky bottom-0 bg-white border-t border-slate-200 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-base text-slate-700">Selected: <span className="font-semibold">{paymentMethod || "None"}</span></p>
          <button onClick={handlePayment} className="w-full sm:w-auto px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50" disabled={!paymentMethod}>Pay Now</button>
        </div>
      </footer>
    </div>
  );
};

export default Payment;