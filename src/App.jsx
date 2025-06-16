import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

// Mock data
const MOCK_USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", projects: 3, lastPayment: "2025-05-01" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", projects: 2, lastPayment: "2025-04-28" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", projects: 1, lastPayment: "2025-05-10" }
];

const MOCK_PROJECTS = [
  { id: 1, name: "Website Redesign", client: "John Doe", status: "Active", nextPayment: "2025-06-01", amount: "$500" },
  { id: 2, name: "Mobile App Development", client: "Jane Smith", status: "Active", nextPayment: "2025-05-25", amount: "$1200" },
  { id: 3, name: "SEO Optimization", client: "John Doe", status: "Pending", nextPayment: "2025-05-30", amount: "$300" },
  { id: 4, name: "Logo Design", client: "Robert Johnson", status: "Completed", nextPayment: "2025-07-15", amount: "$250" }
];

const MOCK_PAYMENTS = [
  { id: 1, project: "Website Redesign", client: "John Doe", date: "2025-05-01", amount: "$500", status: "Paid" },
  { id: 2, project: "Mobile App Development", client: "Jane Smith", date: "2025-04-28", amount: "$1200", status: "Paid" },
  { id: 3, project: "SEO Optimization", client: "John Doe", date: "2025-05-30", amount: "$300", status: "Due" },
  { id: 4, project: "Logo Design", client: "Robert Johnson", date: "2025-07-15", amount: "$250", status: "Upcoming" }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState(MOCK_USERS);
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Dashboard
          users={users}
          setUsers={setUsers}
          projects={projects}
          setProjects={setProjects}
          payments={payments}
          setPayments={setPayments}
          setIsAuthenticated={setIsAuthenticated}
        />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}