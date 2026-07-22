interface DashboardCardProps {
  title: string
  value: number | string
  change?: string
  subtitle?: string
  icon: string
}

export default function DashboardCard({
  title,
  value,
  change,
  subtitle,
  icon,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
      </p>
      {change && <p className="text-sm text-green-600 mt-2">{change}</p>}
      {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
    </div>
  )
}
