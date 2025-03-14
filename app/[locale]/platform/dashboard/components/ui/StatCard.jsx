export default function StatCard({ title, value, icon, trend, color = "green" }) {
  return (
    <div className={`card bg-base-100 shadow-md border-l-4 border-${color}-500`}>
      <div className="card-body p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {icon && <span className={`text-${color}-500`}>{icon}</span>}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <div className={`text-xs ${trend.type === 'up' ? 'text-green-500' : 'text-red-500'} mt-1`}>
            {trend.type === 'up' ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
    </div>
  );
} 