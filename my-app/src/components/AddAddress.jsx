import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import axios from "axios";


const AddAddress = ({ initialData, onSave }) => {
  const [form, setForm] = useState(
    initialData || {
      fullName: "",
      mobile: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      pin: "",
    }
  );

    const [errors, setErrors] = useState({});

    



    const validate = () => {
        const newErrors = {};

        if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";

        // Basic India-focused check: 10 digits
        if (!/^\d{10}$/.test(form.mobile.trim())) {
            newErrors.mobile = "Enter a valid 10-digit mobile number.";
        }

        if (!form.address1.trim()) newErrors.address1 = "Address line 1 is required.";

        if (!form.city.trim()) newErrors.city = "City is required.";
        if (!form.state.trim()) newErrors.state = "State is required.";

        // Basic PIN (6 digits)
        if (!/^\d{6}$/.test(form.pin.trim())) {
            newErrors.pin = "Enter a valid 6-digit PIN code.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };


 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (initialData && initialData.id) {
        // Editing → just pass data up
        onSave(form);
      } else {
        // Adding new address → POST
        const res = await axios.post(
          "http://localhost:8080/api/user/7/addresses",
          form,
          { headers: { "Content-Type": "application/json" } }
        );
        onSave(res.data);
        console.log(res.data);
      }
    } catch (err) {
      console.error("Failed to save address", err);
    }
  };




useEffect(() => {
  if (initialData) {
    setForm(initialData);
  }
}, [initialData]);





    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-amber-100"
                        placeholder="Full name"
                        autoComplete="name"
                        required
                    />
                    {errors.fullName && (
                        <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                    )}
                </div>

                <div>
                    <input
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-amber-100"
                        placeholder="Mobile number"
                        inputMode="numeric"
                        pattern="\d{10}"
                        autoComplete="tel"
                        required
                    />
                    {errors.mobile && (
                        <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
                    )}
                </div>
            </div>

            <div>
                <input
                    name="address1"
                    value={form.address1}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-amber-100"
                    placeholder="Address line 1"
                    autoComplete="address-line1"
                    required
                />
                {errors.address1 && (
                    <p className="mt-1 text-xs text-red-600">{errors.address1}</p>
                )}
            </div>

            <div>
                <input
                    name="address2"
                    value={form.address2}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-amber-100"
                    placeholder="Address line 2 (optional)"
                    autoComplete="address-line2"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-amber-100"
                        placeholder="City"
                        autoComplete="address-level2"
                        required
                    />
                    {errors.city && (
                        <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                    )}
                </div>

                <div>
                    <input
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-amber-100"
                        placeholder="State"
                        autoComplete="address-level1"
                        required
                    />
                    {errors.state && (
                        <p className="mt-1 text-xs text-red-600">{errors.state}</p>
                    )}
                </div>

                <div>
                    <input
                        name="pin"
                        value={form.pin}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-amber-100"
                        placeholder="PIN code"
                        inputMode="numeric"
                        pattern="\d{6}"
                        autoComplete="postal-code"
                        required
                    />
                    {errors.pin && (
                        <p className="mt-1 text-xs text-red-600">{errors.pin}</p>
                    )}
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <Link
                    to="/cart"
                    className="rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50"
                >
                    ← Back to Cart
                </Link>

                {/* Submit triggers handleSubmit */}
                <button
                    type="submit"
                    className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
                >
                    {initialData ? "Save Changes" : "Add Address"}

                </button>
            </div>
        </form>
    )
}

export default AddAddress






