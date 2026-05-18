
import Header from '../components/Header'
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import FoodItem from "../components/FoodItem";
import { StoreContext } from "../Context/StoreContext";
import axios from "axios"

const Home = () => {

    const [categories, setCategories] = useState([]);
    const [featuredPicks, setFeaturedPicks] = useState([]);
    const navigate = useNavigate();

    // 1. Instantly pull the global food items from your existing StoreContext
    const { food_list, addToCart } = useContext(StoreContext);


    useEffect(() => {
        axios.get("http://localhost:8080/api/menu/categories")
            .then((res) => {
                // Randomize categories and pick 4
                const randomCats = [...res.data]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 4);
                setCategories(randomCats);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // 2. Handle Random Featured Picks (From Global Context List)
    useEffect(() => {
        if (food_list && food_list.length > 0) {
            // Randomize individual dishes and pick 4
            const randomItems = [...food_list]
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            setFeaturedPicks(randomItems);
        }
    }, [food_list]);


    return (
        <>

            <Header />

            <section className=" mx-auto max-w-6xl px-4 sm:px-6 mt-8 sm:mt-12">
                {/* This outer div creates the exact same border/card container layout as Featured Picks */}
                <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200">

                    <div className="flex items-end justify-between">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Browse by Category</h2>
                        <Link
                            to="/menu"
                            className="text-sm font-semibold text-amber-700 hover:text-amber-800"
                        >
                            See all →
                        </Link>
                    </div>

                    {/* The item grid matching Featured Picks */}
                    <div className="mt-5 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                        {categories.map((c, index) => (
                            <article
                                key={c.id || `cat-${index}`}
                                onClick={() => navigate(`/menu?category=${encodeURIComponent(c.menu_name)}`)}
                                className="rounded-xl overflow-hidden bg-white ring-1 ring-slate-200 shadow-sm hover:shadow transition cursor-pointer flex flex-col"
                            >
                                {/* Category Image - matching featured pick height */}
                                <div
                                    style={{
                                        backgroundImage: `url(http://localhost:8080${c.menu_img})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                    className="h-36 sm:h-40 w-full bg-slate-100"
                                />

                                {/* Category Text - clean and simple */}
                                <div className=" p-3 flex-1 flex items-center justify-center">
                                    <h3 className="font-semibold text-amber-600">
                                        {c.menu_name}
                                    </h3>
                                </div>
                            </article>
                        ))}
                    </div>

                </div>
            </section>



            {/* FEATURED DISHES */}

            {/* ================= FEATURED PICKS SECTION ================= */}
            <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 sm:mt-12">
                <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-end justify-between">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Featured Picks</h2>
                        <Link
                            to="/menu"
                            className="text-sm font-semibold text-amber-700 hover:text-amber-800"
                        >
                            Order now →
                        </Link>
                    </div>

                    <div className="mt-5 grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredPicks.map((item, index) => (
                            <article
                                key={item.id || `feat-${index}`}
                                className="rounded-xl overflow-hidden bg-white ring-1 ring-slate-200 shadow-sm hover:shadow transition flex flex-col"
                            >
                                {/* 1. Image URL matches backend property 'imageUrl' */}
                                <div
                                    style={{
                                        backgroundImage: item.imageUrl ? `url(http://localhost:8080${item.imageUrl})` : undefined,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                    className={`h-36 sm:h-40 w-full ${item.imageUrl ? "" : "bg-slate-100"}`}
                                />

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    {/* 2. Text matches backend property 'name' */}
                                    <h3 className="font-semibold text-slate-900 line-clamp-1">
                                        {item.name}
                                    </h3>

                                    <div className="mt-2 flex items-center justify-between">
                                        {/* 3. Dynamic Price */}
                                        <p className="text-sm font-semibold text-amber-700">
                                            ₹{item.price}
                                        </p>

                                        {/* 4. Real Interactive Add to Cart button */}
                                        <button
                                            onClick={() => addToCart(item.id)}
                                            className="text-sm font-semibold text-slate-700 hover:text-amber-700 active:scale-95 transition-transform cursor-pointer"
                                        >
                                            Add →
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
            {/* USP STRIP */}
            <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 sm:mt-12">
                <div className="rounded-2xl bg-amber-50 p-6 sm:p-8 ring-1 ring-amber-200">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: "Fresh Ingredients", desc: "Locally inspired, made fresh daily." },
                            { title: "Expert Chefs", desc: "Authentic flavors with creative twists." },
                            { title: "On-Time Delivery", desc: "Your food, hot & right on schedule." },
                            { title: "Customer First", desc: "Support that cares, always." },
                        ].map((u) => (
                            <div key={u.title}>
                                <p className="font-semibold text-amber-900">{u.title}</p>
                                <p className="text-sm text-amber-900/80 mt-1">{u.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS (optional skeleton) */}
            <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 sm:mt-12">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">What Customers Say</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            name: "Akhil",
                            text: "Super quick delivery and the food was 🔥. Will order again!",
                        },
                        {
                            name: "Priya",
                            text: "Loved the biryani. Perfect spice level and aroma.",
                        },
                        {
                            name: "Ravi",
                            text: "Great variety and portions. Family combos are value for money.",
                        },
                    ].map((t) => (
                        <figure
                            key={t.name}
                            className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm"
                        >
                            <blockquote className="text-sm text-slate-700">“{t.text}”</blockquote>
                            <figcaption className="mt-3 text-xs font-semibold text-slate-900">
                                — {t.name}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            {/* APP / CONTACT CTA */}
            <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 sm:mt-12 pb-14">
                <div className="rounded-2xl bg-white p-6 sm:p-8 ring-1 ring-slate-200 shadow-sm">
                    <div className="grid gap-6 items-center md:grid-cols-[1.2fr_1fr]">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                Dine-in, Take-away, or Order Online
                            </h3>
                            <p className="mt-2 text-slate-600 text-sm">
                                Your cravings, your way. Explore our full menu and order in a few taps.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <Link
                                    to="/menu"
                                    className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 shadow-sm"
                                >
                                    Start Order
                                </Link>
                                <Link
                                    to="/contact"
                                    className="rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                        <div className="h-40 rounded-xl bg-slate-50 ring-1 ring-slate-200 flex items-center justify-center text-slate-500 text-sm">
                            {/* Replace with app store badges or a promo image */}
                            Add your app/image here
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Home
