export default function StatCard({ title, value, icon, colorClass }) {
    return (
      <div className={`rounded-lg shadow p-6 ${colorClass}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-4">
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        </div>
      </div>
    );
  }