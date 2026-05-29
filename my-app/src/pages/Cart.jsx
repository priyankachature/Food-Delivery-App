import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../Context/StoreContext";
import OrderSummary from "../components/OrderSummary";

const Cart = ({ promoCode }) => {
  const {
    cartItems,
    food_list,
    cartCount,
    addToCart,
    removeFromCart,
    removeAllFromCart,
    clearCart,
    BASE_URL
  } = useContext(StoreContext);


  // Cart Empty Check
  const isEmpty = cartCount === 0;

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <h1 className="text-2xl font-extrabold sm:text-3xl text-slate-900">
          Your Cart
        </h1>
        <p className="text-slate-600 mt-1">Update quantities or remove items.</p>
      </header>

      <main className="mx-auto mt-6 max-w-6xl grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-6 px-4 pb-28 sm:px-6 md:pb-12">
        {/* LEFT SECTION */}
        <section className="space-y-4">
          {isEmpty ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-10">
              <div className="text-4xl">🛒</div>
              <h3 className="text-lg font-semibold mt-3">Your cart is empty</h3>
              <p className="text-sm text-slate-500 mt-1">
                Browse the menu and add some delicious items.
              </p>

              <Link
                to="/menu"
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-200">
              <ul className="divide-y divide-slate-100">
                {food_list.map((item) => {
                  const qty = cartItems[item.id] || 0;
                  if (qty === 0) return null;

                  return (
                    <li
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center py-4 gap-4"
                    >
                      {/* IMAGE */}
                      <div className="h-24 w-full sm:w-28 overflow-hidden rounded-xl bg-slate-100">
                        {item.imageUrl ? (
                          <img
                            src={`${BASE_URL}${item.imageUrl}`}
                            alt={item.name}
                            className="w-full h-full object-cover "
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-2xl text-slate-400">
                            🍽️
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-base font-semibold text-slate-900">
                            {item.name}
                          </h3>
                          <p className="text-base font-semibold text-slate-900">
                            ₹{Number(item.price) * qty}
                          </p>
                        </div>

                        {/* CONTROLS */}
                        <div className="mt-3 flex flex-col sm:flex-row sm:justify-between gap-3">
                          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="h-7 w-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            >
                              −
                            </button>

                            <span className="font-semibold min-w-8 text-center text-sm">
                              {qty}
                            </span>

                            <button
                              onClick={() => addToCart(item.id)}
                              className="h-7 w-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                            >
                              +
                            </button>
                          </div>

                          {/* REMOVE ALL */}
                          <button
                            onClick={() => removeAllFromCart(item.id)}
                            className="text-xs bg-rose-50 text-rose-600 font-medium px-5 py-1 rounded-full ring-1 ring-rose-200 hover:bg-rose-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* FOOTER SMALL INFO */}
              <div className="flex justify-between border-t border-slate-100 pt-4 mt-4">
                <Link
                  to="/menu"
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  ← Add more items
                </Link>

                <span className="text-sm text-slate-500">
                  Items in cart:{" "}
                  <strong className="text-slate-900">
                    {cartCount}
                  </strong>
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-xs bg-amber-600 text-white font-medium px-3.5 py-2 rounded-full"
                >
                  Clear Cart
                </button>
              </div>

            </div>
          )}
        </section>

        {/* RIGHT ORDER SUMMARY */}
        <aside className="md:sticky md:top-6">
          <OrderSummary
            promoCode={promoCode}
            showActionButton={true}
            actionLabel="PROCEED TO CHECKOUT"
            actionPath="/order"
          />

        </aside>
      </main>
    </div>
  );
};

export default Cart;
