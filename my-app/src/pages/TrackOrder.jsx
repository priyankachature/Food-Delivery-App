import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../Context/StoreContext";
import axios from "axios";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useContext(StoreContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = getToken();
        if (!token) return setLoading(false);
        const res = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
          headers: { Authorization: token }
        });
        if (res.data) setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
    const liveInterval = setInterval(fetchOrder, 25000);
    return () => clearInterval(liveInterval);
  }, [orderId, getToken]);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
      <p className="text-sm text-slate-500 mt-3 font-medium">Fetching order status...</p>
    </div>
  );

  if (!order) return <div className="p-6 text-center text-slate-500 font-bold text-base">Order not found.</div>;

  const steps = ["PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
  const currentStepIndex = steps.indexOf(order.status);
  const stepDescs = { PLACED: "We've confirmed your order", PREPARING: "Chefs are preparing your items", OUT_FOR_DELIVERY: "Out with our delivery valet", DELIVERED: "Handed over. Enjoy your meal!", CANCELLED: "Order was cancelled" };

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-700">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-orange-600 font-bold text-xs uppercase tracking-widest block mb-0.5">Live Tracker</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Track Live Order</h1>
            <div className="text-xs sm:text-sm font-medium text-slate-500">
              Order <span className="font-mono font-bold text-slate-800 bg-slate-200/60 px-1.5 py-0.5 rounded">#{order.id}</span> • Placed {new Date(order.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          <button onClick={() => navigate("/profile")} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl border border-amber-600 shadow-sm transition-all active:scale-[0.98] group">
            <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 rounded-t-xl" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Status Timeline</h3>
              <div className="relative pl-6 space-y-5 border-l-2 border-slate-100">
                {steps.map((step, idx) => (
                  <div key={step} className="relative flex flex-col min-w-0">
                    <div className={`absolute -left-8 w-3.5 h-3.5 rounded-full border-[3px] transition-all duration-300 mt-1 ${idx === currentStepIndex ? "bg-orange-500 border-orange-100 ring-4 ring-orange-500/10 scale-105" : idx <= currentStepIndex ? "bg-emerald-500 border-emerald-50" : "bg-white border-slate-200"}`} />
                    <span className={`font-bold tracking-wide uppercase text-sm sm:text-base ${idx === currentStepIndex ? "text-orange-600 font-black" : idx <= currentStepIndex ? "text-slate-900" : "text-slate-400"}`}>{step.replace("_", " ")}</span>
                    <span className={`text-xs sm:text-sm mt-0.5 ${idx === currentStepIndex ? "text-slate-600 font-medium" : "text-slate-400"}`}>{stepDescs[step]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div className="flex items-start gap-3.5">
                <span className="text-xl mt-0.5">📦</span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Delivery Partner</h3>
                  <p className="font-extrabold text-slate-900 text-sm sm:text-base">Ravi Kumar</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">Professional Courier Valet</p>
                </div>
              </div>
              <a href="tel:9976575646" className="mt-4 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs sm:text-sm font-bold py-2.5 rounded-lg border border-purple-100/60 text-center transition-colors block shadow-sm">📞 Call Valet</a>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-slate-400 mb-1"><span className="text-lg">📍</span><h3 className="font-bold uppercase tracking-wider text-xs mt-0.5">Delivery Address</h3></div>
              {order.address ? (
                <div className="pl-7 text-xs sm:text-sm text-slate-600 space-y-1">
                  <p className="font-black text-slate-900 text-sm sm:text-base mb-1">{order.address.fullName}</p>
                  <p className="leading-relaxed font-medium text-slate-700">{order.address.address1}{order.address.address2 && `, ${order.address.address2}`}</p>
                  <p className="text-slate-500 font-medium">{order.address.city}, {order.address.state} - {order.address.pin}</p>
                  {order.address.mobile && <p className="text-slate-800 font-bold text-xs sm:text-sm mt-3 pt-2 border-t border-slate-100">Phone: {order.address.mobile}</p>}
                </div>
              ) : <p className="text-xs text-slate-400 italic pl-7">No destination linked.</p>}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-xs text-slate-400">Order Summary</h3>
              <div className="max-h-40 overflow-y-auto pr-1 space-y-2.5 border-b border-dashed border-slate-100 pb-3">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm sm:text-base text-slate-800">
                    <span className="font-black truncate max-w-50 sm:max-w-none text-slate-900">
                      {item.menuItem?.name || item.name} <span className="text-slate-400 font-extrabold text-xs sm:text-sm ml-1">x{item.quantity}</span>
                    </span>
                    <span className="font-mono font-bold text-slate-700">₹{item.unitPrice * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-500 font-semibold">
                {[['Subtotal', order.subtotalAmount], ['Delivery Fee', order.deliveryFee], ['Taxes', order.taxes], ['Platform Fee', order.platformFee]].map(([label, val]) => (
                  <div key={label} className="flex justify-between"><span>{label}</span><span className="font-mono text-slate-700">₹{val}</span></div>
                ))}
                <div className="flex justify-between items-center text-slate-900 border-t border-slate-100 pt-3 mt-1">
                  <span className="font-black text-sm sm:text-base text-slate-800">Total Paid</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-orange-600">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-[11px] sm:text-xs text-slate-400 font-semibold pt-2">Need support? Connect with the team at <a href="mailto:contact@foodypaws.com" className="text-orange-600 font-bold hover:underline transition-all">contact@foodypaws.com</a></p>
      </div>
    </div>
  );
};

export default TrackOrder;