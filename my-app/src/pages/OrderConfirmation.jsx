import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            No order found
          </h2>
          <p className="text-slate-600 mb-4">
            Please place an order before visiting this page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Order Confirmation
          </h1>
          <div className="flex gap-2 text-xs sm:text-sm text-slate-600">
            <span className="font-semibold text-green-600">Address</span> ➝
            <span className="font-semibold text-green-600">Order</span> ➝
            <span className="font-semibold text-green-600">Payment</span> ➝
            <span className="font-semibold text-slate-900">Confirmation</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 px-4 py-6 sm:px-6">
        {/* LEFT: Confirmation Details */}
        <section className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              🎉 Order Placed Successfully!
            </h2>
            <p className="text-slate-700 mb-4">
              Thank you for your purchase. Your order ID is{" "}
              <span className="font-semibold">{order.id}</span>.
            </p>
            <p className="text-slate-600">
              We’ll notify you when your food is on the way.
            </p>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-sm sm:text-lg font-semibold text-slate-900 mb-3">
              Delivering To
            </h2>
            {order?.address ? (
              <div className="rounded-lg border border-amber-200 p-4 bg-slate-50">
                <p className="font-medium">{order.address.fullName}</p>
                <p className="text-xs sm:text-sm text-slate-600">
                  {order.address.address1}
                  {order.address.address2 && `, ${order.address.address2}`}<br />
                  {order.address.city}, {order.address.state} -{" "}
                  {order.address.pin}
                </p>
                <p className="text-xs sm:text-sm text-slate-600">
                  📞 {order.address.mobile}
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-600">No address found</p>
            )}
          </div>
        </section>

        {/* RIGHT: Order Summary */}
        <aside className="lg:sticky lg:top-6">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-sm sm:text-lg font-semibold text-slate-900 mb-3">
              Order Summary
            </h2>
            <p className="text-slate-700">
              Total Paid:{" "}
              <span className="font-bold text-green-600">
                ₹{order.totalAmount}
              </span>
            </p>
            <p className="text-slate-600 text-sm mt-2">
              Payment Method: {order.paymentMethod}
            </p>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white border-t border-slate-200 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-base text-slate-700">
            Order ID: <span className="font-semibold">{order.id}</span>
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </footer>
    </div>
  );
};

export default OrderConfirmation;