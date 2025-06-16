import StatCard from "./StatCard";
import { Briefcase, CreditCard, Users } from "lucide-react";

export default function DashboardContent({ users, projects, payments }) {
  const activeProjects = projects.filter(p => p.status === "Active").length;
  const upcomingPayments = payments.filter(p => p.status === "Due").length;
  const totalClients = users.length;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Projects" 
          value={activeProjects} 
          icon={<Briefcase size={20} className="text-blue-500" />} 
          colorClass="bg-blue-100 text-blue-800"
        />
        <StatCard 
          title="Upcoming Payments" 
          value={upcomingPayments} 
          icon={<CreditCard size={20} className="text-green-500" />} 
          colorClass="bg-green-100 text-green-800"
        />
        <StatCard 
          title="Total Clients" 
          value={totalClients} 
          icon={<Users size={20} className="text-purple-500" />} 
          colorClass="bg-purple-100 text-purple-800"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {projects.slice(0, 3).map(project => (
              <div key={project.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                <div>
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-gray-500">Client: {project.client}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === "Active" ? "bg-green-100 text-green-800" :
                  project.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => {}}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View all projects →
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Payments</h3>
          <div className="space-y-4">
            {payments.filter(p => p.status === "Due" || p.status === "Upcoming").slice(0, 3).map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                <div>
                  <h4 className="font-medium">{payment.project}</h4>
                  <p className="text-sm text-gray-500">{payment.client} • {payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{payment.amount}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    payment.status === "Due" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => {}}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View all payments →
          </button>
        </div>
      </div>
    </div>
  );
}