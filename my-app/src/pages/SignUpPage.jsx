import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
/**
 * Signup form with fixed-height inline error messages (no layout shift).
 * Uses Tailwind's `invisible` to hide error line when there's no message.
 */

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Field-level error strings
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Optional: clear that field's error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = { username: "", email: "", password: "" };

    if (!form.username.trim()) next.username = "Username is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 6) next.password = "Minimum 6 characters.";

    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.username,
        email: form.email,
        password: form.password,
      }),
      });
 
      if (!response.ok) {
       let data = {};
      try {
        data = await response.json();
      } catch {}
      throw new Error(data.message || "Registration failed");
    }
      // On success go to login
      navigate("/login");
    } catch (err) {
    // Show error at the top (optional: add a global error state)
    setErrors((prev) => ({ ...prev, global: err.message }));

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDEFE6] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-orange-100 p-6 md:p-8 lg:p-10">
        {/* Brand */}
        {/* <div className="flex items-center justify-center gap-2">
          <div className="h-9 w-9 rounded-full bg-orange-500 text-white grid place-items-center font-bold">
            ≡
          </div>
          <span className="text-2xl font-extrabold text-orange-500">FoodDesk.</span>
        </div> */}
        <div className="w-full grid place-items-center">
          <Logo />
        </div>

        <p className="text-center text-gray-700 font-medium text-sm sm:text-base">Sign up your account</p>

        <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-2" noValidate>
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="username"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              aria-invalid={!!errors.username}
              aria-describedby="username-help"
              className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                          ${errors.username ? "border-red-500" : "border-gray-300"}`}
              required
            />
            <p
              id="username-help"
              aria-live="polite"
              className={`mt-1 text-xs min-h-4 ${errors.username ? "text-red-600 visible" : "invisible"}`}
            >
              {errors.username || "placeholder"}
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="hello@example.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby="email-help"
              className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                          ${errors.email ? "border-red-500" : "border-gray-300"}`}
              required
            />
            <p
              id="email-help"
              aria-live="polite"
              className={`mt-1 text-xs min-h-4 ${errors.email ? "text-red-600 visible" : "invisible"}`}
            >
              {errors.email || "placeholder"}
            </p>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby="password-help"
              className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                          ${errors.password ? "border-red-500" : "border-gray-300"}`}
              required
            />
            <p
              id="password-help"
              aria-live="polite"
              className={`mt-1 text-xs min-h-4 ${errors.password ? "text-red-600 visible" : "invisible"}`}
            >
              {errors.password || "placeholder"}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-orange-500 text-white font-semibold py-2.5
                       hover:bg-orange-600 active:bg-orange-700 transition
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Sign me up"}
          </button>
        </form>

        <p className="mt-4 sm:mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}