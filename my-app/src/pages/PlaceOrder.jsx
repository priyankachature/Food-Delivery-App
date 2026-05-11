import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";
import OrderSummary from "../components/OrderSummary";

import AddAddressModal from "../components/AddAddressModal";

const PlaceOrder = ({ promoCode }) => {
  // const { getCartSummary } = useContext(StoreContext);

  const [addressAdded, setAddressAdded] = useState(false);




  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editAddress, setEditAddress] = useState(null);



useEffect(() => {
  const fetchAddresses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/user/7/addresses");
      const data = res.data;
      setAddresses(data);
      if (data.length === 0) {
        setShowForm(true); // new user → show form
      } else {
        setSelectedAddress(data.find(a => a.isDefault) || data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };
  fetchAddresses();
}, []);


  // ✅ Add new address
  const handleSaveAddress = (saved) => {
    setAddresses(prev => [...prev, saved]);
    setSelectedAddress(saved);
    setShowForm(false); // hide form after saving
    setAddressAdded(true);
  };




 const saveEditedAddress = async (formData) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/user/7/addresses/${editAddress.id}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      const updated = res.data;

      console.log("Address updated successfully:", updated);

      // Replace old address in state with backend response
      setAddresses(prev => prev.map(a => a.id === updated.id ? updated : a));
      setSelectedAddress(updated);
      setEditAddress(null);
      setAddressAdded(true);
    } catch (err) {
      console.error("Failed to update address", err);
    }
  };

const handleDeleteAddress = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/api/user/7/addresses/${id}`);
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(null);
      setAddressAdded(false);
    }
  } catch (err) {
    console.error("Failed to delete address", err);
  }
};



 






  return (
    <div className="min-h-screen w-full bg-linear-to-b from-slate-50 via-white to-slate-100">
      <header className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Place Order
        </h1>
        <p className="mt-1 text-slate-600">
          Review your details and confirm the order.
        </p>
      </header>

      <main className="mx-auto mt-6 max-w-6xl grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-6 px-4 pb-20 sm:px-6">
        {/* LEFT: Delivery Details */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Delivery Details</h2>

          {showForm ? (
            <AddAddressModal
              onClose={() => setShowForm(false)}
              onSave={handleSaveAddress}
            />
          ) : (
            <div className="mt-6">
              {/* <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
    Saved Addresses
  </h3> */}

              {editAddress && (
                <AddAddressModal
                  initialData={editAddress}   // pass current address to pre-fill form
                  onClose={() => setEditAddress(null)}
                  onSave={saveEditedAddress}
                />
              )}



              <div className="space-y-4">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    className={`rounded-xl border p-4 shadow-sm transition hover:shadow-md cursor-pointer ${selectedAddress?.id === addr.id ? "border-amber-500" : "border-slate-200"
                      }`}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setAddressAdded(true);
                    }}

                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900">{addr.fullName}</p>
                        <p className="text-sm text-slate-600">
                          {addr.address1}
                          {addr.address2 && `, ${addr.address2}`}<br />
                          {addr.city}, {addr.state} - {addr.pin}
                        </p>
                        <p className="text-sm text-slate-600">📞 {addr.mobile}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditAddress(addr);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr.id);

                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {addr.isDefault && (
                      <span className="mt-2 inline-block text-xs font-semibold text-amber-600">
                        ★ Default Address
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="mt-5 w-full sm:w-auto px-2 py-2 text-sm font-medium rounded-lg bg-green-600 text-white  hover:bg-green-700"
                onClick={() => setShowForm(true)}
              >
                + Add New Address
              </button>
            </div>
          )}

        </section>



        {/* RIGHT: Order Summary */}
        <aside className="md:sticky md:top-6">
          <OrderSummary
            promoCode={promoCode}
            showActionButton={true}
            actionLabel="PROCEED TO PAYMENT"
            actionPath="/payment"
            disabled={!addressAdded} // only enabled after address is added/selected
          />


        </aside>
      </main>
    </div>
  );
};

export default PlaceOrder;


//  want that the add address form should be for only new user and when user fills that form istaed of that form the filles address should comed thetir form should be not visisble and for old user address list shiuld come or other option such as change address for old address edit dlete and add ne address so in that add new address form will visible
