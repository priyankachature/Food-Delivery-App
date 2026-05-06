import React from "react";

const About = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 text-slate-800">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              About <span className="text-amber-600">FoodyPaws</span>
            </h1>
            <p className="mt-4 text-slate-600 leading-relaxed">
              At FoodyPaws, we believe food is more than a meal—it’s an
              experience. From locally sourced ingredients to chef-crafted
              recipes, we serve dishes that blend rich flavors with warm
              hospitality. Dine-in, take away, or order online—your cravings,
              delivered hot and fresh.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-amber-700 text-sm ring-1 ring-amber-200">
                Fresh Ingredients
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-sm ring-1 ring-emerald-200">
                Expert Chefs
              </span>
              <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-sky-700 text-sm ring-1 ring-sky-200">
                Fast Delivery
              </span>
              <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-violet-700 text-sm ring-1 ring-violet-200">
                Customer First
              </span>
            </div>
          </div>

          {/* Replace with your image */}
          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1600&auto=format&fit=crop"
              alt="Restaurant food collage"
              className="w-full rounded-2xl shadow-lg ring-1 ring-slate-200 object-cover"
            />
            <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-black/0 to-black/0 group-hover:to-black/10 transition" />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Our Story
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            FoodyPaws started with a simple idea: <em>"Good food should be
            enjoyed, not rushed."</em> What began as a cozy kitchen with big
            dreams is now a favorite destination for food lovers. We’ve stayed
            true to our values—quality, authenticity, and heartfelt service.
          </p>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          What Makes Us Special
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Fresh & Local",
              desc: "We source locally whenever possible to ensure freshness, flavor, and sustainability.",
              icon: "🥗",
            },
            {
              title: "Expert Chefs",
              desc: "Our chefs blend tradition with creativity to craft dishes you’ll remember.",
              icon: "👨‍🍳",
            },
            {
              title: "Fast Delivery",
              desc: "Your cravings shouldn’t wait. We deliver hot and on time, every time.",
              icon: "🚀",
            },
            {
              title: "Customer First",
              desc: "From order to last bite, we focus on comfort, convenience, and care.",
              icon: "🌟",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl bg-white p-5 ring-1 ring-slate-200 shadow-sm hover:shadow transition"
            >
              <div className="text-2xl">{card.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Our Menu Highlights
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 list-disc list-inside text-slate-700">
            <li>Indian, Chinese & Continental favorites</li>
            <li>Chef’s specials and seasonal picks</li>
            <li>Snacks, starters, desserts & beverages</li>
            <li>Vegetarian & non-vegetarian options</li>
            <li>Family combos & party packs</li>
            <li>Custom spice levels on request</li>
          </ul>
        </div>
      </section>

      {/* Mission + CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="rounded-2xl bg-amber-50 p-6 sm:p-8 ring-1 ring-amber-200">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-900">
            Our Mission
          </h2>
          <p className="mt-3 text-amber-900/80">
            To deliver delicious food, memorable experiences, and unmatched
            quality—every single time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/menu"
              className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2.5 text-white text-sm font-semibold hover:bg-amber-700 transition"
            >
              Explore Menu
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-amber-700 ring-1 ring-amber-300 hover:bg-amber-100 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer blurb */}
     
    </main>
  );
};

export default About;
