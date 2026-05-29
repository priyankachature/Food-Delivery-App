import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";
import AddAddressModal from "../components/AddAddressModal";

const ProfilePage = () => {
    const { user, setUser, getToken, logout, food_list , BASE_URL} = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editAddress, setEditAddress] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: "", email: "" });
    const navigate = useNavigate();

    useEffect(() => { if (user) setProfileForm({ name: user.name, email: user.email }); }, [user]);

    useEffect(() => {
        const token = getToken();
        if (!token) return;
        const config = { headers: { Authorization: token } };
        const fetchProfileData = async () => {
            try {
                const [ordersRes, addressRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/orders/my`, config),
                    axios.get(`${BASE_URL}/api/user/addresses`, config)
                ]);
                setOrders(ordersRes.data || []);
                setAddresses(addressRes.data || []);
            } catch (err) { console.error("Profile data fetch failed", err); }
            finally { setLoading(false); }
        };
        fetchProfileData();
        const intervalId = setInterval(fetchProfileData, 25000);
        return () => clearInterval(intervalId);
    }, [getToken]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${BASE_URL}/api/auth/update`, profileForm, { headers: { Authorization: getToken() } });
            setUser(res.data);
            setIsEditingProfile(false);
            alert("Profile updated successfully!");
        } catch (err) { alert(err.response?.data?.message || "Failed to update profile"); }
    };

    const getFoodImage = (itemId) => {
        const item = food_list.find(f => f.id === itemId);
        return item ? `${BASE_URL}${item.imageUrl}` : null;
    };

    const handleSaveAddress = (saved) => {
        setAddresses(prev => prev.find(a => a.id === saved.id) ? prev.map(a => a.id === saved.id ? saved : a) : [...prev, saved]);
        setShowForm(false);
        setEditAddress(null);
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/user/addresses/${id}`, { headers: { Authorization: getToken() } });
            setAddresses(prev => prev.filter(a => a.id !== id));
        } catch (err) { console.error("Delete failed", err); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#ff6347] font-bold uppercase">FoodyPaws</div>;

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#454545] pb-20">
            <div className="max-w-6xl mx-auto px-4 py-10">
                {(showForm || editAddress) && <AddAddressModal initialData={editAddress} onClose={() => { setShowForm(false); setEditAddress(null); }} onSave={handleSaveAddress} />}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            {!isEditingProfile ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className="w-14 h-14 rounded-2xl bg-[#FFF2ED] flex items-center justify-center text-xl font-bold text-[#ff6347] border border-orange-100 shrink-0">{user?.name?.charAt(0)}</div>
                                        <div className="overflow-hidden"><h2 className="text-lg font-bold text-[#262626] truncate mb-0.5">{user?.name}</h2><p className="text-sm text-gray-600 truncate">{user?.email}</p></div>
                                    </div>
                                    <button onClick={() => setIsEditingProfile(true)} className="text-xs font-bold text-[#ff6347] uppercase border border-[#ff6347] px-3 py-1 rounded-lg hover:bg-[#ff6347] hover:text-white transition-all tracking-wider cursor-pointer">Edit</button>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateProfile} className="space-y-3">
                                    {[['Name', 'name', 'text'], ['Email', 'email', 'email']].map(([label, key, type]) => (
                                        <div key={key} className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{label}</label>
                                            <input type={type} className="text-sm p-2 border rounded-lg outline-none focus:border-[#ff6347] cursor-pointer" value={profileForm[key]} onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })} />
                                        </div>
                                    ))}
                                    <div className="flex gap-2 pt-2">
                                        <button type="submit" className="text-[10px] bg-[#ff6347] text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest cursor-pointer">Save</button>
                                        <button type="button" onClick={() => setIsEditingProfile(false)} className="text-[10px] text-gray-400 font-bold uppercase px-2 cursor-pointer">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-500 uppercase text-xs tracking-wide">Saved Addresses</h3><button onClick={() => setShowForm(true)} className="text-[#ff6347] text-xs font-bold uppercase hover:underline cursor-pointer">+ ADD NEW</button></div>
                            <div className="space-y-4">
                                {addresses.map((addr) => (
                                    <div key={addr.id} className="p-4 bg-[#FCFCFB] rounded-2xl border border-gray-50 hover:border-orange-100 transition-all">
                                        <p className="text-[15px] font-bold text-[#393838] mb-1">{addr.fullName}</p>
                                        <p className="text-sm font-bold">{addr.mobile}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed">{addr.address1} , {addr.address2}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-2">{addr.city} , {addr.state} , {addr.pin}</p>
                                        <div className="flex gap-4 border-t border-gray-100 pt-3">
                                            <button onClick={() => setEditAddress(addr)} className="text-[12px] font-bold text-blue-500 uppercase tracking-tighter cursor-pointer">Edit</button>
                                            <button onClick={() => handleDeleteAddress(addr.id)} className="text-[12px] font-bold text-red-400 uppercase tracking-tighter cursor-pointer">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-[#262626] mb-8 tracking-tight">Order History</h3>
                            <div className="space-y-8">
                                {orders.map((order) => (
                                    <div key={order.id} onClick={() => navigate(`/track-order/${order.id}`)} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center group cursor-pointer hover:bg-orange-50/30 p-2 rounded-2xl transition-all">
                                        <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                                            <img src={getFoodImage(order.items?.[0]?.menuItemId)} alt="food" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-[#454545] text-base mb-1 group-hover:text-[#ff6347] transition-colors">{order.items?.map(i => i.name).join(", ")}</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-3xl bg-orange-500 text-white uppercase tracking-wider">{order.status}</span>
                                            </div>
                                            <p className="mt-2 text-sm font-bold text-[#454545]">Total: ₹{order.totalAmount}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center mt-8">
                            <button onClick={logout} className="w-1/2 flex items-center justify-center gap-3 py-3 bg-[#FFF8F8] text-xs text-red-500 rounded-xl font-bold uppercase tracking-widest hover:bg-[#3535390f] transition-all border border-red-50 shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;