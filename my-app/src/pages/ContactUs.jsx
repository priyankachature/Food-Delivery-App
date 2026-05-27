import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email.";
    if (form.phone && !/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter a 10‑digit phone number.";
    if (!form.subject.trim()) e.subject = "Please add a subject.";
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = "Message should be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, success: "", error: "" });

    if (!validate()) return;

    try {
      setStatus({ loading: true, success: "", error: "" });

      const response = await axios.post("http://localhost:8080/api/contact", form);

      // 3. Handle Success (MessageResponse from backend)
      setStatus({
        loading: false,
        success: response.data.message || "Thanks! We’ve received your message.",
        error: ""
      });

      // Reset form
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });

    } catch (err) {
      // 4. Handle Errors (Validation or Server errors)
      const backendError = err.response?.data?.message || "Something went wrong. Please try again.";
      setStatus({
        loading: false,
        success: "",
        error: backendError,
      });
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 text-slate-800">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Contact Us</h1>
        <p className="mt-1 text-slate-600">
          We’d love to hear from you. Fill out the form or reach us using the details below.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-6 pb-16 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6">
        {/* Form Card */}
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Send a Message</h2>

          {/* Status Alerts */}
          {status.success && (
            <div className="mt-4 rounded-lg bg-emerald-50 text-emerald-800 text-sm p-3 ring-1 ring-emerald-200">
              {status.success}
            </div>
          )}
          {status.error && (
            <div className="mt-4 rounded-lg bg-red-50 text-red-800 text-sm p-3 ring-1 ring-red-200">
              {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                  placeholder="How can we help?"
                  required
                />
                {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm min-h-30"
                placeholder="Tell us a bit more…"
                required
              />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                disabled={status.loading}
                className={`rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {status.loading ? "Sending..." : "Send Message"}
              </button>
              <Link
                to="/menu"
                className="rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Back to Menu
              </Link>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Get in Touch</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-slate-700">
                <span className="font-semibold">Address:</span>{" "}
                123 Food Street, T. Nagar, Chennai, TN 600017
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Phone:</span>{" "}
                <a className="text-amber-700 hover:underline" href="tel:+919876543210">
                  +91 9845673489
                </a>
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Email:</span>{" "}
                <a className="text-amber-700 hover:underline" href="mailto:contact@foodypaws.com">
                  contact@foodypaws.com
                </a>
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Hours:</span> Mon–Sun, 11:00 AM – 11:00 PM
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="https://wa.me/919845673489?text=Hii%20FoodyPaws!"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full  bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  WhatsApp
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=12.9996,80.2337"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Directions
                </a>
              </div>
            </div>
          </div>

          {/* Map / Image */}
          <div
            style={{
              backgroundImage: `url(${assets?.aboutHero || assets?.homebg || ""})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="h-48 sm:h-56 rounded-2xl ring-1 ring-slate-200 bg-slate-100 shadow-sm"
            aria-label="Map or location image placeholder"
          />
        </aside>
      </section>
    </main>
  );
};

export default Contact;
