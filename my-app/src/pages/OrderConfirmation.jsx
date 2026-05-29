import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../Context/StoreContext";
import OrderSummary from "../components/OrderSummary";
import axios from "axios";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getToken , BASE_URL } = useContext(StoreContext);
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (order) return;
    (async () => {
      try {
        const token = getToken();
        if (!token) return setLoading(false);
        const res = await axios.get(`${BASE_URL}/api/orders/${orderId}`, { headers: { Authorization: token } });
        if (res.data) setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch latest order:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [order, getToken, orderId]);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
      <p className="text-xs text-slate-500 mt-3">Loading your receipt...</p>
    </div>
  );

  const createdAt = new Date(order?.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-slate-50/60 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Success Banner */}
        <div className="text-center pb-6 sm:pb-8 border-b border-slate-200/80">
          <div className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-emerald-200/60 mb-4 shadow-sm">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            Order Placed Successfully
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">Arriving in <span className="text-orange-600">30 - 45 Mins</span></h1>
          <p className="text-sm text-slate-500 mt-2.5 font-medium flex flex-wrap items-center justify-center gap-1">Order Id : <span className="font-mono text-slate-800 font-bold bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded">#{orderId}</span></p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-xl text-orange-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Status</h3>
                <p className="text-sm sm:text-base font-bold text-orange-700 mt-0.5 tracking-wide px-2.5 py-0.5 rounded bg-orange-50 inline-block max-w-full truncate">{order?.status}</p>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600 mt-0.5 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Delivery Address</h3>
                {order?.address ? (
                  <div className="text-sm text-slate-600 space-y-1.5 leading-relaxed wrap-break-word font-medium">
                    <p className="font-bold text-slate-900 text-base">{order.address.fullName}</p>
                    <p>{order.address.address1}{order.address.address2 && `, ${order.address.address2}`}</p>
                    <p className="text-slate-500">{order.address.city}, {order.address.state} - {order.address.pin}</p>
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 mt-1"><span>📞</span> <span>{order.address.mobile}</span></div>
                  </div>
                ) : <p className="text-sm font-medium text-slate-400 italic">No address configured.</p>}
              </div>
            </div>
          </div>

          {/* Right Column: Summary Panel */}
          <div className="lg:col-span-5 w-full space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Ordered Items</h3>
              <div className="space-y-3 max-h-44 overflow-y-auto pr-1">
                {order?.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm gap-4">
                    <span className="text-slate-700 font-medium wrap-break-word max-w-[70%]">{item.menuItem?.name || item.name} <span className="text-slate-400 font-bold text-xs whitespace-nowrap">x{item.quantity}</span></span>
                    <span className="font-mono font-bold text-slate-800 whitespace-nowrap">₹{((item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full overflow-hidden"><OrderSummary order={order} showActionButton={false} /></div>
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="text-center space-y-4 max-w-md mx-auto pt-4 px-2">
          <button onClick={() => navigate(`/track-order/${orderId}`)} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all transform active:scale-[0.99] tracking-wide text-sm">Track Live Order Status</button>
          <div className="space-y-1 text-xs text-slate-400 font-medium">
            <p className="font-semibold">Placed on {createdAt}</p>
            <p>Need support? Contact us at <a href="mailto:contact@foodypaws.com" className="text-orange-600 hover:underline font-semibold">contact@foodypaws.com</a></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;