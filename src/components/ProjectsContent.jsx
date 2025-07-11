import { Plus, Edit, Trash, X, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../config/apiConfig";

export default function ProjectsContent({ openModal, refreshTrigger, triggerRefresh }) {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [tokenData, setTokenData] = useState({ token: null, accessKey: null });
  
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    clientId: "",
    dueAmount: "",
    status: "PENDING"
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/projects/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${baseUrl}/clients`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setClients(res.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`${baseUrl}/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        triggerRefresh();
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateProject = async () => {
    try {
      const response = await axios.post(`${baseUrl}/projects`, projectData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProjectData({
        name: "",
        description: "",
        clientId: "",
        dueAmount: "",
        status: "PENDING"
      });
      setMessage({ text: "Project created successfully!", type: "success" });
      setTokenData({
        token: response.data.accessTokenInfo?.accessToken || "Not available",
        accessKey: response.data.accessTokenInfo?.accessKey || "Not available"
      });
      setIsProjectModalOpen(false);
      setIsTokenModalOpen(true);
      triggerRefresh();
    } catch (err) {
      setMessage({ text: "Failed to create project.", type: "error" });
    }
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setProjectData({
      name: "",
      description: "",
      clientId: "",
      dueAmount: "",
      status: "PENDING"
    });
  };

  const closeTokenModal = () => {
    setIsTokenModalOpen(false);
    setTokenData({ token: null, accessKey: null });
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage({ text: `${type} copied to clipboard!`, type: "success" });
      setTimeout(() => {
        setMessage({ text: "Project created successfully!", type: "success" });
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy:", err);
      setMessage({ text: "Failed to copy to clipboard.", type: "error" });
    });
  };

  // Generate the paywall code with the access key
  const generatePaywallCode = (accessKey) => {
    return `// Add this to your App.jsx file
import { useState, useEffect } from 'react';
import axios from 'axios';

const PAYMENT_API_URL = "http://localhost:5001/api/projects";

// Payment Blocked Component
const PaymentBlockedScreen = () => (
  <div className="fixed inset-0 bg-red-600 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Required</h1>
      <p className="text-gray-700 mb-4">
        Your payment is pending. Please complete your payment to continue using the application.
      </p>
    </div>
  </div>
);

// Add this to your main App component
function App() {
  const [isPaymentBlocked, setIsPaymentBlocked] = useState(false);
  
  // Your access key (generated automatically)
  const ACCESS_KEY = "${accessKey}";

  // Payment status monitoring
  useEffect(() => {
    if (!ACCESS_KEY) {
      console.warn("Access key is not provided. Payment monitoring disabled.");
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(\`\${PAYMENT_API_URL}/payment-details/\${ACCESS_KEY}\`);
        const paymentStatus = response.data.paymentStatus || response.data.status;
        
        if (paymentStatus === "PENDING_PAYMENT") {
          setIsPaymentBlocked(true);
        } else {
          setIsPaymentBlocked(false);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        // Optionally handle error - you might want to block or allow based on your business logic
      }
    };

    // Check payment status immediately
    checkPaymentStatus();

    // Set up interval to check every 30 seconds
    const intervalId = setInterval(checkPaymentStatus, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [ACCESS_KEY]);

  // If payment is blocked, show the blocked screen
  if (isPaymentBlocked) {
    return <PaymentBlockedScreen />;
  }

  // Your existing app content goes here
  return (
    <div className="App">
      {/* Your existing app components */}
    </div>
  );
}

export default App;`;
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, [refreshTrigger]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Project Management</h1>
        <button 
          onClick={() => setIsProjectModalOpen(true)} 
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add Project
        </button>
      </div>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded-lg shadow-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Next Payment</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="h-64 text-center align-middle">
                  <svg className="animate-spin h-6 w-6 text-indigo-600 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Loading projects...
                </td>
              </tr>
            ) : (
              projects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                      project.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      project.status === "COMPLETED" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(project.finalPaymentDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${project.dueAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => openModal("editProject", project)} 
                        className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
                        title="Edit Project"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)} 
                        className="text-red-600 hover:text-red-800 transition-colors duration-150"
                        title="Delete Project"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Project</h2>
              <button
                onClick={closeProjectModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="projectName">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="name"
                  value={projectData.name}
                  onChange={handleProjectChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-150"
                  placeholder="Enter project name"
                />
              </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="projectDescription">
                  Description
                </label>
                <textarea
                  id="projectDescription"
                  name="description"
                  value={projectData.description}
                  onChange={handleProjectChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-150"
                  placeholder="Enter project description"
                />
              </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="clientSelect">
                  Client
                </label>
                <select
                  id="clientSelect"
                  name="clientId"
                  value={projectData.clientId}
                  onChange={handleProjectChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-150"
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="dueAmount">
                  Due Amount
                </label>
                <input
                  type="number"
                  id="dueAmount"
                  name="dueAmount"
                  value={projectData.dueAmount}
                  onChange={handleProjectChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-150"
                  placeholder="0.00"
                />
              </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={projectData.status}
                  onChange={handleProjectChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-150"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={closeProjectModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-150 font-medium"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {isTokenModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-4xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Paywall Integration Code</h2>
              <button
                onClick={closeTokenModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Copy the code below and paste it into your project's App.jsx file to enable the paywall functionality.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> This code includes your unique access key. Keep it secure and don't share it publicly.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => copyToClipboard(generatePaywallCode(tokenData.accessKey), "Paywall code")}
                  className="flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors duration-150"
                  title="Copy Paywall Code"
                >
                  <Copy size={16} className="mr-1" />
                  Copy Code
                </button>
              </div>
              
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                <code>{generatePaywallCode(tokenData.accessKey)}</code>
              </pre>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Integration Instructions:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Copy the code above</li>
                <li>2. Open your project's App.jsx file</li>
                <li>3. Replace the existing App component code with the copied code</li>
                <li>4. Make sure to install axios if not already installed: <code className="bg-blue-100 px-1 rounded">npm install axios</code></li>
                <li>5. The paywall will automatically check payment status every 30 seconds</li>
              </ol>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={closeTokenModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}