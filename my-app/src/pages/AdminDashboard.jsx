import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [messages, setMessages] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("orders");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); 
    const [targetItemId, setTargetItemId] = useState(null);
    const [menuForm, setMenuForm] = useState({ name: "", description: "", price: "", imageUrl: "", category: "", active: true });

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = getToken();
                const config = { headers: { Authorization: token } };
                const [ordersRes, usersRes, menuRes, messagesRes] = await Promise.all([
                    axios.get("http://localhost:8080/api/admin/orders", config),
                    axios.get("http://localhost:8080/api/admin/users", config),
                    axios.get("http://localhost:8080/api/admin/menu", config),
                    axios.get("http://localhost:8080/api/admin/messages", config)
                ]);
                setOrders(ordersRes.data || []);
                setUsers(usersRes.data || []);
                setMenuItems(menuRes.data || []);
                setMessages(messagesRes.data || []);
            } catch (err) {
                console.error("Failed to populate dashboard metrics:", err);
            } finally { setLoading(false); }
        };
        fetchInitialData();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/orders/${orderId}/status`, { status: newStatus }, { headers: { Authorization: getToken() } });
            setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) { console.error("Failed to update status parameters:", err); }
    };

    const openModal = (mode, item = null) => {
        setModalMode(mode);
        setTargetItemId(item?.id || null);
        setMenuForm(item ? { name: item.name, description: item.description || "", price: item.price, imageUrl: item.imageUrl || "", category: item.category || "", active: item.active } : { name: "", description: "", price: "", imageUrl: "", category: "", active: true });
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!menuForm.name || !menuForm.price || !menuForm.category) return alert("Please fill out Name, Category, and Price fields.");
        try {
            const config = { headers: { Authorization: getToken() } };
            const isAdd = modalMode === "add";
            const res = await axios[isAdd ? "post" : "put"](`http://localhost:8080/api/admin/menu${isAdd ? "" : `/${targetItemId}`}`, menuForm, config);
            setMenuItems((prev) => isAdd ? [...prev, res.data] : prev.map((item) => item.id === targetItemId ? res.data : item));
            setIsModalOpen(false);
        } catch (err) { alert("Something went wrong. Make sure your backend entity auto-increments IDs correctly."); }
    };

    const toggleItemVisibility = async (item) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/menu/${item.id}`, { ...item, active: !item.active }, { headers: { Authorization: getToken() } });
            setMenuItems((prev) => prev.map((m) => m.id === item.id ? { ...m, active: !item.active } : m));
        } catch (err) { console.error("Failed to toggle item state:", err); }
    };

    const deleteMenuItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/admin/menu/${itemId}`, { headers: { Authorization: getToken() } });
            setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
        } catch (err) { console.error("Failed to remove item:", err); }
    };

    const getStatusBadgeStyle = (status) => {
        const styles = { DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200", CANCELLED: "bg-rose-50 text-rose-700 border-rose-200", OUT_FOR_DELIVERY: "bg-purple-50 text-purple-700 border-purple-200", PREPARING: "bg-amber-50 text-amber-700 border-amber-200" };
        return styles[status] || "bg-blue-50 text-blue-700 border-blue-200";
    };

    const renderNavButton = (tabName, icon, label) => (
        <button onClick={() => setTab(tabName)} className={`flex-1 sm:flex-none px-3 py-2 sm:px-4 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${tab === tabName ? "bg-orange-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>{icon} {label}</button>
    );

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans p-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold tracking-wide mt-4 text-sm text-center">Synchronizing Admin Panel Data...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 py-4 sm:py-8 px-2 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Responsive Navigation Header */}
                <div className="pb-5 border-b border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <span className="text-xs uppercase tracking-widest text-orange-600 font-bold block mb-0.5">Management Suite</span>
                        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
                    </div>
                    <div className="bg-white border border-slate-200 p-1 rounded-xl flex shadow-sm w-full md:w-auto overflow-x-auto scrollbar-none gap-1">
                        {renderNavButton("orders", "💼", "Orders")}
                        {renderNavButton("users", "👥", "Users")}
                        {renderNavButton("menu", "🍽️", "Menu")}
                        {renderNavButton("messages", "✉️", "Messages")}
                    </div>
                </div>

                {/* ---------------- ORDERS VIEW ---------------- */}
                {tab === "orders" && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full divide-y divide-slate-100 text-left whitespace-nowrap md:whitespace-normal">
                                <thead className="bg-slate-50/70 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                    <tr>{["Order ID", "Customer", "Items", "Status", "Actions"].map((h) => <th key={h} className="py-3.5 px-4 sm:px-6">{h}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900 text-xs sm:text-sm">#{order.id}</td>
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="font-bold text-slate-900 text-xs sm:text-sm max-w-37.5 sm:max-w-none truncate sm:whitespace-normal">{order.address?.fullName || order.user?.name || "Guest User"}</div>
                                                <div className="text-slate-400 text-[11px] sm:text-xs mt-0.5 max-w-37.5 sm:max-w-none truncate sm:whitespace-normal">{order.user?.email || `M: ${order.address?.mobile}`}</div>
                                            </td>
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="space-y-1 min-w-30 sm:min-w-0">
                                                    {order.items?.map((item, idx) => <div key={idx} className="text-xs sm:text-sm font-medium text-slate-600 max-w-50 truncate md:max-w-none md:whitespace-normal">{item.name} <span className="text-slate-400 font-bold text-[10px] sm:text-xs ml-0.5">x{item.quantity}</span></div>)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 sm:px-6"><span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${getStatusBadgeStyle(order.status)}`}>{order.status}</span></td>
                                            <td className="py-4 px-4 sm:px-6">
                                                <select className="border border-slate-200 rounded-lg px-2 py-1 sm:py-1.5 bg-white font-bold text-slate-700 shadow-sm outline-none text-xs focus:border-orange-500 cursor-pointer" value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                                                    {["PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map((st) => <option key={st} value={st}>{st}</option>)}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ---------------- REGISTERED USERS VIEW ---------------- */}
                {tab === "users" && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full divide-y divide-slate-100 text-left whitespace-nowrap">
                                <thead className="bg-slate-50/70 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                    <tr>{["User ID", "Full Name", "Email Address", "Role", "Joined Date"].map((h) => <th key={h} className="py-3.5 px-4 sm:px-6">{h}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700 bg-white text-xs sm:text-sm font-medium">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-500 text-xs">#{u.id}</td>
                                            <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">{u.name}</td>
                                            <td className="py-4 px-4 sm:px-6 text-slate-600">{u.email}</td>
                                            <td className="py-4 px-4 sm:px-6"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold tracking-wide ${u.role === "ROLE_ADMIN" ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-700"}`}>{u.role ? u.role.replace("ROLE_", "") : "USER"}</span></td>
                                            <td className="py-4 px-4 sm:px-6 text-slate-400 font-normal">{u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ---------------- MENU VIEW ---------------- */}
                {tab === "menu" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">Menu Catalog ({menuItems.length})</h2>
                            <button onClick={() => openModal("add")} className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-3 py-2 rounded-xl shadow-sm transition-all transform active:scale-[0.98] whitespace-nowrap">+ Add New Dish</button>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto w-full">
                                <table className="min-w-full divide-y divide-slate-100 text-left whitespace-nowrap md:whitespace-normal">
                                    <thead className="bg-slate-50/70 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="py-3.5 px-4 sm:px-6">ID</th>
                                            <th className="py-3.5 px-4 sm:px-6">Title</th>
                                            <th className="py-3.5 px-4 sm:px-6">Category</th>
                                            <th className="py-3.5 px-4 sm:px-6 hidden md:table-cell w-[35%]">Description</th>
                                            <th className="py-3.5 px-4 sm:px-6">Price</th>
                                            <th className="py-3.5 px-4 sm:px-6">Status</th>
                                            <th className="py-3.5 px-4 sm:px-6 text-center">Controls</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white text-xs sm:text-sm">
                                        {menuItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                                                <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-400 text-[11px] sm:text-xs">#{item.id}</td>
                                                <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 max-w-30 truncate md:max-w-none md:whitespace-normal">{item.name}</td>
                                                <td className="py-4 px-4 sm:px-6 font-semibold text-slate-600">{item.category || "—"}</td>
                                                <td className="py-4 px-4 sm:px-6 text-slate-500 font-medium hidden md:table-cell">{item.description || "—"}</td>
                                                <td className="py-4 px-4 sm:px-6 font-mono font-black text-slate-800">₹{item.price}</td>
                                                <td className="py-4 px-4 sm:px-6"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border ${item.active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>{item.active ? "ACTIVE" : "HIDDEN"}</span></td>
                                                <td className="py-4 px-4 sm:px-6">
                                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                        <button onClick={() => openModal("edit", item)} className="px-2.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 font-bold text-[11px] sm:text-xs rounded-xl transition-colors shadow-sm hover:bg-blue-100">Edit</button>
                                                        <button onClick={() => toggleItemVisibility(item)} className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] sm:text-xs transition-all shadow-sm ${item.active ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>{item.active ? "Deactivate" : "Activate"}</button>
                                                        <button onClick={() => deleteMenuItem(item.id)} className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[11px] sm:text-xs rounded-xl transition-colors shadow-sm">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ---------------- MESSAGES VIEW ---------------- */}
                {tab === "messages" && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
                        <div className="pb-2 border-b border-slate-100">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">Customer Enquiries ({messages.length})</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Real-time mail submissions stored in contact_messages.</p>
                        </div>
                        {messages.length === 0 ? <p className="text-slate-400 text-center py-8 text-sm font-medium">No contact entries logged yet.</p> : (
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                {messages.map((msg) => (
                                    <div key={msg.id} className="border border-slate-200/60 rounded-2xl p-4 bg-slate-50/40 flex flex-col justify-between space-y-3 shadow-sm hover:border-orange-200 transition-all">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <span className="text-[10px] bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">MSG #{msg.id}</span>
                                                    <h4 className="font-black text-slate-900 text-xs sm:text-sm mt-1 tracking-tight truncate max-w-40 sm:max-w-none">{msg.subject}</h4>
                                                </div>
                                                <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Just Now"}</span>
                                            </div>
                                            <p className="text-slate-600 text-xs leading-relaxed bg-white border border-slate-100 p-3 rounded-xl min-h-15 font-medium shadow-inner wrap-break-word">"{msg.message}"</p>
                                        </div>
                                        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5 break-all">
                                            <div className="font-bold text-slate-800 wrap-break-word">Sender: {msg.name}</div>
                                            <div>Email: <a href={`mailto:${msg.email}`} className="text-blue-600 font-medium hover:underline">{msg.email}</a></div>
                                            {msg.phone && <div>Phone: <span className="font-mono text-slate-700">{msg.phone}</span></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ---------------- RESPONSIVE MODAL OVERLAY ---------------- */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
                        <div className="bg-white rounded-t-2xl sm:rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col animate-slide-up sm:animate-zoom-in">
                            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex justify-between items-center shrink-0">
                                <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">{modalMode === "add" ? "Add New Menu Item" : "Edit Menu Item"}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 transition-colors leading-none">&times;</button>
                            </div>
                            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5 overflow-y-auto">
                                {[["Item Name", "name", "text", "e.g. Spicy Schezwan Noodles"], ["Category", "category", "text", "e.g. Noodles, Pure Veg, Dessert"], ["Description", "description", "text", "e.g. Fiery wok-tossed noodles mixed with shredded vegetables"]].map(([lbl, key, typ, ph]) => (
                                    <div key={key} className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{lbl}</label>
                                        <input required={key !== "description"} type={typ} placeholder={ph} className="w-full border border-slate-200 rounded-xl px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none font-medium focus:border-orange-500 bg-slate-50/50" value={menuForm[key]} onChange={(e) => setMenuForm({ ...menuForm, [key]: e.target.value })} />
                                    </div>
                                ))}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Price (₹)</label>
                                    <input required type="number" placeholder="160" className="w-full border border-slate-200 rounded-xl px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none font-mono font-bold focus:border-orange-500 bg-slate-50/50" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Image Asset Name</label>
                                    <input type="text" placeholder="e.g. schezwan-noodles.jpg" className="w-full border border-slate-200 rounded-xl px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none font-medium focus:border-orange-500 bg-slate-50/50" value={menuForm.imageUrl} onChange={(e) => setMenuForm({ ...menuForm, imageUrl: e.target.value })} />
                                </div>
                                <div className="flex gap-3 pt-3 justify-end shrink-0">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs sm:text-sm hover:bg-slate-50 transition-all">Cancel</button>
                                    <button type="submit" className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all">{modalMode === "add" ? "Save Item" : "Update Item"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;