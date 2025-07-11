import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../config/apiConfig";

export default function ProfileContent() {
  const [user] = useState({ name: "Admin", email: "admin@example.com" });
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: "",
  });
  
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT"
  });
  
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: "Failed to update profile.", type: "error" });
    }
  };
  
  const handleCreateClient = async () => {
    try {
      await axios.post(`${baseUrl}/clients`, clientData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setClientData({
        name: "",
        email: "",
        password: "",
        role: "CLIENT"
      });
      setMessage({ text: "Client created successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: "Failed to create client.", type: "error" });
      console.error("Error creating client:", err);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mt-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        
        <div className="flex border-b border-gray-200">
          <button 
            className={`py-2 px-4 font-medium ${activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </button>
          <button 
            className={`py-2 px-4 font-medium ${activeTab === "clients" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("clients")}
          >
            Create Client
          </button>
        </div>
      </div>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}
      
      {activeTab === "profile" ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">Create Client Account</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientName">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              name="name"
              value={clientData.name}
              onChange={handleClientChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientEmail">
              Client Email
            </label>
            <input
              type="email"
              id="clientEmail"
              name="email"
              value={clientData.email}
              onChange={handleClientChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientPassword">
              Client Password
            </label>
            <input
              type="password"
              id="clientPassword"
              name="password"
              value={clientData.password}
              onChange={handleClientChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleCreateClient}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Client
            </button>
          </div>
        </div>
      )}
    </div>
  );
}