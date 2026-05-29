import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";
import OrderSummary from "../components/OrderSummary";
import { useNavigate } from "react-router-dom";
import AddAddressModal from "../components/AddAddressModal";

const PlaceOrder = ({ promoCode }) => {
  const { cartItems, getToken , BASE_URL } = useContext(StoreContext);
  const [addressAdded, setAddressAdded] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editAddress, setEditAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await axios.get(`${BASE_URL}/api/user/addresses`, { headers: { Authorization: token } });
        setAddresses(res.data);
        if (res.data.length === 0) {
          setShowForm(true);
        } else {
          setSelectedAddress(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      }
    };
    fetchAddresses();
  }, [getToken]);

  const handleSaveAddress = (saved) => {
    setAddresses(prev => [...prev, saved]);
    setSelectedAddress(saved);
    setShowForm(false);
    setAddressAdded(true);
  };

  const saveEditedAddress = async (formData) => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await axios.put(`${BASE_URL}/api/user/addresses/${editAddress.id}`, formData, { headers: { "Content-Type": "application/json", Authorization: token } });
      setAddresses(prev => prev.map(a => a.id === res.data.id ? res.data : a));
      setSelectedAddress(res.data);
      setEditAddress(null);
      setAddressAdded(true);
    } catch (err) {
      console.error("Failed to update address", err);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const token = getToken();
      if (!token) return;
      await axios.delete(`${BASE_URL}/api/user/addresses/${id}`, { headers: { Authorization: token } });
      setAddresses(prev => prev.filter(a => a.id !== id));
      if (selectedAddress?.id === id) {
        setSelectedAddress(null);
        setAddressAdded(false);
      }
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  const handlePlaceOrder = async () => {
    const itemsArray = Object.entries(cartItems).map(([menuItemId, quantity]) => ({ menuItemId: Number(menuItemId), quantity }));
    if (itemsArray.length === 0) {
      alert("Your cart is empty");
      return;
    }
    try {
      const token = getToken();
      if (!token) return;
      const res = await axios.post(`${BASE_URL}/api/orders`, { addressId: selectedAddress.id, items: itemsArray }, { headers: { "Content-Type": "application/json", Authorization: token } });
      console.log("Order created:", res.data);
      navigate("/payment", { state: { orderId: res.data.id, order: res.data } });
    } catch (err) {
      console.error("Failed to create order", err);
      alert("Order creation failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-slate-50 via-white to-slate-100">
      <header className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Place Order</h1>
        <p className="mt-1 text-slate-600">Review your details and confirm the order.</p>
      </header>
      <main className="mx-auto mt-6 max-w-6xl grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-6 px-4 pb-20 sm:px-6">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Delivery Details</h2>
          {showForm ? (
            <AddAddressModal onClose={() => setShowForm(false)} onSave={handleSaveAddress} />
          ) : (
            <div className="mt-6">
              {editAddress && <AddAddressModal initialData={editAddress} onClose={() => setEditAddress(null)} onSave={saveEditedAddress} />}
              <div className="space-y-4">
                {addresses.map(addr => (
                  <div key={addr.id} className={`rounded-xl border p-4 shadow-sm transition hover:shadow-md cursor-pointer ${selectedAddress?.id === addr.id ? "border-amber-500" : "border-slate-200"}`} onClick={() => { setSelectedAddress(addr); setAddressAdded(true); }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900">{addr.fullName}</p>
                        <p className="text-sm text-slate-600">{addr.address1}{addr.address2 && `, ${addr.address2}`}<br />{addr.city}, {addr.state} - {addr.pin}</p>
                        <p className="text-sm text-slate-600">📞 {addr.mobile}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200" onClick={(e) => { e.stopPropagation(); setEditAddress(addr); }}>Edit</button>
                        <button className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200" onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}>Delete</button>
                      </div>
                    </div>
                    {addr.isDefault && <span className="mt-2 inline-block text-xs font-semibold text-amber-600">★ Default Address</span>}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700" onClick={() => setShowForm(true)}>+ Add New Address</button>
                <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition" onClick={() => navigate("/cart")}>Back to Cart</button>
              </div>
            </div>
          )}
        </section>
        <aside className="md:sticky md:top-6">
          <OrderSummary promoCode={promoCode} showActionButton={true} actionLabel="PROCEED TO PAYMENT" actionPath={handlePlaceOrder} disabled={!addressAdded} />
        </aside>
      </main>
    </div>
  );
};

export default PlaceOrder;