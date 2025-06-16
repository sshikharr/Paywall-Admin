import { useState } from "react";
import { Home, Users, Briefcase, CreditCard, User, Menu, X, ChevronDown } from "lucide-react";
import SidebarItem from "./SidebarItem";
import DashboardContent from "./DashboardContent";
import ClientsContent from "./ClientsContent";
import ProjectsContent from "./ProjectsContent";
import PaymentsContent from "./PaymentsContent";
import ProfileContent from "./ProfileContent";
import Modal from "./Modal";
import { baseUrl } from "../config/apiConfig";

export default function Dashboard({ users, setUsers, projects, setProjects, payments, setPayments, setIsAuthenticated }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [newCredentials, setNewCredentials] = useState({
    username: "",
    password: "",
    userType: "client",
    assignedClient: "",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  }

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setNewCredentials({ username: "", password: "", userType: "client", assignedClient: "" });
  };

  const handleDelete = (type, id) => {
    if (type === "user") {
      setUsers(users.filter(user => user.id !== id));
    } else if (type === "project") {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  const handleCreateCredentials = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: newCredentials.username,
          password: newCredentials.password,
          role: newCredentials.userType,
          assignedClientId: newCredentials.assignedClient || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user credentials.");
      }

      alert("User credentials created successfully!");
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCredentialChange = (e) => {
    const { name, value } = e.target;
    setNewCredentials(prev => ({ ...prev, [name]: value }));
  };

  const user = JSON.parse(localStorage.getItem("user")) || { name: "Admin" };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`bg-indigo-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">TechWire Services</h1>}
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-indigo-700">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 pt-4">
          <SidebarItem 
            active={activeTab === "dashboard"} 
            icon={<Home size={20} />} 
            text="Dashboard" 
            onClick={() => setActiveTab("dashboard")}
            expanded={sidebarOpen}
          />
          <SidebarItem 
            active={activeTab === "users"} 
            icon={<Users size={20} />} 
            text="Clients" 
            onClick={() => setActiveTab("users")}
            expanded={sidebarOpen}
          />
          <SidebarItem 
            active={activeTab === "projects"} 
            icon={<Briefcase size={20} />} 
            text="Projects" 
            onClick={() => setActiveTab("projects")}
            expanded={sidebarOpen}
          />
          <SidebarItem 
            active={activeTab === "payments"} 
            icon={<CreditCard size={20} />} 
            text="Payments" 
            onClick={() => setActiveTab("payments")}
            expanded={sidebarOpen}
          />
          <div className="border-t border-indigo-700 my-4"></div>
          <SidebarItem 
            active={activeTab === "profile"} 
            icon={<User size={20} />} 
            text="Admin Profile" 
            onClick={() => setActiveTab("profile")}
            expanded={sidebarOpen}
          />
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "users" && "Client Management"}
            {activeTab === "projects" && "Project Management"}
            {activeTab === "payments" && "Payment Details"}
            {activeTab === "profile" && "Admin Profile"}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                {user.name.charAt(0)}
              </div>
              <span className="ml-2 text-gray-700">{user.name}</span>
              <ChevronDown size={16} className="text-gray-500 ml-1" />
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === "dashboard" && <DashboardContent users={users} projects={projects} payments={payments} />}
          {activeTab === "users" && (
            <ClientsContent 
              users={users} 
              openModal={openModal} 
              handleDelete={(id) => handleDelete("user", id)} 
            />
          )}
          {activeTab === "projects" && (
            <ProjectsContent 
              projects={projects} 
              openModal={openModal} 
              refreshTrigger={refreshTrigger}
              triggerRefresh={triggerRefresh}
            />
          )}
          {activeTab === "payments" && <PaymentsContent payments={payments} />}
          {activeTab === "profile" && <ProfileContent />}
        </main>
      </div>

      {showModal && (
        <Modal
          modalType={modalType}
          selectedItem={selectedItem}
          users={users}
          closeModal={closeModal}
          newCredentials={newCredentials}
          handleCredentialChange={handleCredentialChange}
          handleCreateCredentials={handleCreateCredentials}
          onProjectUpdate={triggerRefresh}
        />
      )}
    </div>
  );
}