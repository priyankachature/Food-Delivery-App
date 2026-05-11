import React, { useState } from "react";
import OrderSummary from "../components/OrderSummary";

const Payment = ({ selectedAddress, promoCode }) => {
  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    console.log("Proceeding with payment via:", paymentMethod);
    alert("Payment successful!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Stepper Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Checkout</h1>
          <div className="flex gap-2 text-xs sm:text-sm text-slate-600">
            <span className="font-semibold text-green-600">Address</span> ➝
            <span className="font-semibold text-green-600">Order</span> ➝
            <span className="font-semibold text-slate-900">Payment</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 px-4 py-6 sm:px-6">
        {/* LEFT: Payment Details */}
        <section className="space-y-6">
          {/* Address */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Delivering To</h2>
            {selectedAddress ? (
              <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                <p className="font-medium">{selectedAddress.fullName}</p>
                <p className="text-sm text-slate-600">
                  {selectedAddress.address1}
                  {selectedAddress.address2 && `, ${selectedAddress.address2}`}<br />
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pin}
                </p>
                <p className="text-sm text-slate-600">📞 {selectedAddress.mobile}</p>
              </div>
            ) : (
              <p className="text-sm text-red-600">No address selected</p>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Choose Payment Method</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Card", icon: "💳" },
                { label: "UPI", icon: "📱" },
                { label: "Netbanking", icon: "🏦" },
                { label: "Wallet", icon: "👛" },
                { label: "Cash on Delivery", icon: "💵" },
              ].map(method => (
                <button
                  key={method.label}
                  onClick={() => setPaymentMethod(method.label)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border px-4 py-6 text-sm sm:text-base font-medium transition
                    ${paymentMethod === method.label
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  {method.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT: Order Summary */}
        <aside className="lg:sticky lg:top-6">
          <OrderSummary promoCode={promoCode} showActionButton={false} />
        </aside>
      </main>

      {/* Sticky Bottom Bar */}
      <footer className="sticky bottom-0 bg-white border-t border-slate-200 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm sm:text-base text-slate-700">
            Selected: <span className="font-semibold">{paymentMethod || "None"}</span>
          </p>
          <button
            onClick={handlePayment}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
            disabled={!paymentMethod}
          >
            Pay Now
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Payment;