import {useContext} from 'react';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { StoreContext } from "../Context/StoreContext";


const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(StoreContext);
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");

  // Handle inputs
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // TODO: Replace with your API call
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }
      else {
        console.log("Login successful, received token:", data);
      }
      localStorage.setItem("token", `${data.tokenType} ${data.token}`);

      setUser({
        id: data.userId,
        name: data.name,
        email: data.email,
      });

      navigate("/"); // redirect after login
    } catch (err) {
      setError(err.message);
    }

  };

  return (
    <main className="min-h-[calc(100vh-5rem)] grid place-items-center p-4 sm:p-6 lg:p-8">
      {/* Card with image + form */}
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: Image */}
          <div className="rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1600&auto=format&fit=crop"
              alt="Burger"
              className="w-full h-56 sm:h-64 md:h-full object-cover"
            />
          </div>

          {/* Right: Form */}
          <div className="px-1 sm:px-2">
            {/* Brand */}
            <div className="w-full grid place-items-center">
              <Logo />
            </div>

            {/* Title */}
            <div className="mt-2 sm:mt-3">
              <h2 className="text-base sm:text-lg text-center font-semibold text-gray-900">
                Login
              </h2>
            </div>

            {/* Global error */}
            {error && (
              <div className="mt-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-4" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="demo@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="remember" className="text-sm text-gray-700">
                  Remember my preference
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 transition"
              >
                Sign Me In
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 sm:my-5">
              <div className="flex items-center gap-3">
                <span className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-500">Continue With</span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>
            </div>

            {/* Social row (visual only) */}
            {/* <div className="grid place-items-center">
              <button
                type="button"
                className="col-span-1 px-6 rounded-lg border border-gray-300 h-10 sm:h-11 text-sm hover:bg-gray-50"
              >
                Google
              </button>
            </div> */}

            {/* Link to Signup */}
            <div className="mt-5 sm:mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-orange-600 font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default LoginPage;