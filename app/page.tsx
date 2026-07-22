'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'
import DashboardCard from '@/components/DashboardCard'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline'>('offline')
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 342,
    leadsQualificados: 127,
    totalMensagens: 1853,
    agentesAtivos: 4,
    sentimentData: [
      { name: 'Positivo', value: 45, fill: '#10b981' },
      { name: 'Neutro', value: 35, fill: '#f59e0b' },
      { name: 'Negativo', value: 20, fill: '#ef4444' },
    ],
    qualidadeData: [
      { name: 'Hot', value: 45, fill: '#ef4444' },
      { name: 'Warm', value: 35, fill: '#f59e0b' },
      { name: 'Cold', value: 20, fill: '#3b82f6' },
    ],
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
        if (response.ok) {
          setBackendStatus('online')
        }
      } catch (error) {
        setBackendStatus('offline')
      }
    }
    checkBackend()
    const interval = setInterval(checkBackend, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral do seu negócio</p>
            <p className={`mt-2 text-sm ${backendStatus === 'online' ? 'text-green-600' : 'text-red-600'}`}>
              Backend: {backendStatus === 'online' ? '✓ Online' : '✗ Offline'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DashboardCard
              title="Total de Leads"
              value={dashboardData.totalLeads}
              change="+12%"
              icon="📊"
            />
            <DashboardCard
              title="Leads Qualificados"
              value={dashboardData.leadsQualificados}
              change="+8%"
              icon="⭐"
            />
            <DashboardCard
              title="Total de Mensagens"
              value={dashboardData.totalMensagens}
              change="+24%"
              icon="💬"
            />
            <DashboardCard
              title="Agentes Ativos"
              value={dashboardData.agentesAtivos}
              change="+2"
              icon="🤖"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sentiment das Conversas</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Qualidade dos Leads</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.qualidadeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.qualidadeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
