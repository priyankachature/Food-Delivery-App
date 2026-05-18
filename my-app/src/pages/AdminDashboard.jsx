import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", imageUrl: "", active: true });

  const getToken = () => localStorage.getItem("token");

  /** ---------------- ORDERS ---------------- */
  const fetchOrders = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/admin/orders", {
        headers: { Authorization: token },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err.response?.data || err);
      alert("Failed to fetch orders. Please try again.");
    }
  };

  // 🔥 FIXED: Overwrites the state field explicitly to match backend updates instantly
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = getToken();
      const res = await axios.put(
        `http://localhost:8080/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: token } }
      );
      
      // Re-map state using confirmed data from server response or direct input fallback
      const updatedStatusValue = res.data?.status || newStatus;
      
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updatedStatusValue } : o))
      );
    } catch (err) {
      console.error("Failed to update order status", err.response?.data || err);
      alert("Failed to update order status. Please try again.");
    }
  };

  /** ---------------- MENU ITEMS ---------------- */
  const fetchMenuItems = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/admin/menu", {
        headers: { Authorization: token },
      });
      setMenuItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch menu items", err.response?.data || err);
      alert("Failed to fetch menu items. Please try again.");
    }
  };

  const addMenuItem = async () => {
    try {
      const token = getToken();
      const res = await axios.post("http://localhost:8080/api/admin/menu", newItem, {
        headers: { Authorization: token },
      });
      setMenuItems((prev) => [...prev, res.data]);
      setNewItem({ name: "", description: "", price: "", imageUrl: "", active: true });
    } catch (err) {
      console.error("Failed to add menu item", err.response?.data || err);
      alert("Failed to add menu item. Please try again.");
    }
  };

  const editMenuItem = async (itemId, updatedFields) => {
    try {
      const token = getToken();
      await axios.put(`http://localhost:8080/api/admin/menu/${itemId}`, updatedFields, {
        headers: { Authorization: token },
      });
      
      setMenuItems((prev) =>
        prev.map((item) => 
          item.id === itemId 
            ? { ...item, ...updatedFields } 
            : item
        )
      );
    } catch (err) {
      console.error("Failed to edit menu item", err.response?.data || err);
      alert("Failed to edit menu item. Please try again.");
    }
  };

  const deleteMenuItem = async (itemId) => {
    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/admin/menu/${itemId}`, {
        headers: { Authorization: token },
      });
      setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Failed to delete menu item", err.response?.data || err);
      alert("Failed to delete menu item. Please try again.");
    }
  };

  /** ---------------- LIFECYCLE ---------------- */
  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  /** ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

      {/* Orders Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Orders</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">#{order.id}</td>
                  {/* 🔥 FIXED: Shifted data pointers from .customer to .user to eliminate N/A error values */}
                  <td className="py-2 px-4 font-medium">
                    {order.user?.name || "N/A"} <br />
                    <span className="text-xs text-gray-500 font-normal">{order.user?.email}</span>
                  </td>
                  <td className="py-2 px-4">
                    {order.items?.map((i) => (
                      <div key={i.id} className="text-sm font-medium">
                        {i.menuItem?.name || i.name} <span className="text-gray-400 font-bold text-xs ml-0.5">x{i.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4">
                    <span className="font-bold text-sm tracking-wide text-slate-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      className="border rounded px-2 py-1 bg-white font-semibold text-gray-700 shadow-sm outline-none focus:border-orange-500 text-sm"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="PREPARING">PREPARING</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Menu Items Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Menu Items</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Name"
            className="border rounded px-3 py-2 flex-1 text-sm"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            className="border rounded px-3 py-2 flex-1 text-sm"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="border rounded px-3 py-2 w-32 text-sm"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image Name/URL (e.g. food.jpg)"
            className="border rounded px-3 py-2 flex-1 min-w-50 text-sm"
            value={newItem.imageUrl}
            onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
          />
          <button
            onClick={addMenuItem}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold text-sm"
          >
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Active</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm font-medium">#{item.id}</td>
                  <td className="py-2 px-4">
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => editMenuItem(item.id, { name: e.target.value })}
                      className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none py-0.5 text-sm font-medium"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input 
                      type="text" 
                      value={item.description || ""} 
                      onChange={(e) => editMenuItem(item.id, { description: e.target.value })}
                      className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none py-0.5 text-sm"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input 
                      type="number" 
                      value={item.price} 
                      onChange={(e) => editMenuItem(item.id, { price: Number(e.target.value) })}
                      className="w-20 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none py-0.5 text-sm font-mono font-bold"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        item.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        editMenuItem(item.id, {
                          name: prompt("Enter new name", item.name) || item.name,
                          description: prompt("Enter new description", item.description) || item.description,
                          price: prompt("Enter new price", item.price) || item.price,
                        })
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => editMenuItem(item.id, { active: !item.active })}
                      className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                        item.active
                          ? "bg-gray-600 text-white hover:bg-gray-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {item.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;