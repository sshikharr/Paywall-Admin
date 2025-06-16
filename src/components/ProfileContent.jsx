import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { baseUrl } from "../config/apiConfig";
import axios from "axios";

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
  
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    clientId: "",
    dueAmount: "",
    status: "PENDING"
  });
  
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock clients data for the dropdown
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try{
        const res = await axios.get(`${baseUrl}/clients`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(res.data);
        setClients(res.data);
      }catch(error){
        console.error("Error fetching clients:", error);
      }
    }
    fetchClients();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: "Failed to update profile.", type: "error" });
    }
  };
  
  const handleCreateClient = async () => {
    try{
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
    }catch(err){
      setMessage({ text: "Failed to create client.", type: "error" });
      console.error("Error creating client:", err);
    }
  }
  
  const handleCreateProject = async () => {
    try {
      await axios.post(`${baseUrl}/projects`, projectData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setProjectData({
        name: "",
        description: "",
        clientId: "",
        dueAmount: "",
        status: "PENDING"
      });
      setMessage({ text: "Project created successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: "Failed to create project.", type: "error" });
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setProjectData({
      name: "",
      description: "",
      clientId: "",
      dueAmount: "",
      status: "PENDING"
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mt-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Project
          </button>
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
      
      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Project</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectName">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="name"
                value={projectData.name}
                onChange={handleProjectChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter project name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectDescription">
                Description
              </label>
              <textarea
                id="projectDescription"
                name="description"
                value={projectData.description}
                onChange={handleProjectChange}
                rows="3"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter project description"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientSelect">
                Client
              </label>
              <select
                id="clientSelect"
                name="clientId"
                value={projectData.clientId}
                onChange={handleProjectChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueAmount">
                Due Amount
              </label>
              <input
                type="number"
                id="dueAmount"
                name="dueAmount"
                value={projectData.dueAmount}
                onChange={handleProjectChange}
                step="0.01"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="0.00"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={projectData.status}
                onChange={handleProjectChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}