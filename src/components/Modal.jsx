import axios from "axios";
import { X } from "lucide-react";
import { useState } from "react";
import { baseUrl } from "../config/apiConfig";

export default function Modal({ modalType, selectedItem, users, closeModal, newCredentials, handleCredentialChange, handleCreateCredentials, onProjectUpdate }) {
  const [loading, setLoading] = useState(false);

  // Function to handle project update
  const handleProjectUpdate = async (e) => {
    e.preventDefault();
    
    if (modalType === "editProject" && selectedItem) {
      const updatedProject = {
        ...selectedItem,
        name: e.target.name.value,
        client: e.target.client.value,
        status: e.target.status.value,
        dueAmount: e.target.dueAmount.value,
        description: e.target.description.value,
      };

      setLoading(true);
      try {
        const res = await axios.put(`${baseUrl}/projects/${selectedItem.id}`, updatedProject, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Project updated successfully:", res.data);
        closeModal(); // Close modal on success
        if(onProjectUpdate) {
          onProjectUpdate();
        }
      } catch (error) {
        console.error("Error updating project:", error);
        alert("Failed to update project. Please try again.");
      } finally {
        setLoading(false);

      }
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {modalType === "createUser" && "Create New Client"}
            {modalType === "editUser" && "Edit Client"}
            {modalType === "createProject" && "Create New Project"}
            {modalType === "editProject" && "Edit Project"}
            {modalType === "createCredentials" && "Create User Credentials"}
          </h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {(modalType === "createUser" || modalType === "editUser") && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedItem?.name || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedItem?.email || ""}
                />
              </div>
            </>
          )}

          {(modalType === "createProject" || modalType === "editProject") && (
            <form onSubmit={handleProjectUpdate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedItem?.name || ""}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select name="client" className="w-full p-2 border border-gray-300 rounded-md" required>
                  {users.map((user) => (
                    <option key={user.id} value={user.name} selected={selectedItem?.client === user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" className="w-full p-2 border border-gray-300 rounded-md" required>
                  <option value="ACTIVE" selected={selectedItem?.status === "ACTIVE"}>Active</option>
                  <option value="PENDING" selected={selectedItem?.status === "PENDING"}>Pending</option>
                  <option value="COMPLETED" selected={selectedItem?.status === "COMPLETED"}>Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Payment Date</label>
                <input
                  type="date"
                  name="nextPayment"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedItem?.nextPayment || ""}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="text"
                  name="dueAmount"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={selectedItem?.dueAmount || ""}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  className="w-full p-2 border border-gray-300 rounded-md min-h-44"
                  defaultValue={selectedItem?.description || ""}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          )}

          {modalType === "createCredentials" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={newCredentials.username}
                  onChange={handleCredentialChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newCredentials.password}
                  onChange={handleCredentialChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                <select
                  name="userType"
                  value={newCredentials.userType}
                  onChange={handleCredentialChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Client</label>
                <select
                  name="assignedClient"
                  value={newCredentials.assignedClient}
                  onChange={handleCredentialChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Client</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCredentials}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}