'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'

export default function CRMsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [crms, setCrms] = useState([
    {
      id: 1,
      nome: 'Brasil Mostra Brasil',
      tipo: 'Supabase',
      status: 'Conectado',
      ultimaSincronizacao: '2024-01-15 14:30',
      conversas: 342,
    },
    {
      id: 2,
      nome: 'Evolution WhatsApp',
      tipo: 'Evolution',
      status: 'Conectado',
      ultimaSincronizacao: '2024-01-15 14:25',
      conversas: 156,
    },
    {
      id: 3,
      nome: 'RD Station',
      tipo: 'RD Station',
      status: 'Desconectado',
      ultimaSincronizacao: '2024-01-10 10:15',
      conversas: 89,
    },
  ])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de CRMs</h1>
            <p className="text-gray-600">Conecte e gerencie seus CRMs integrados</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {crms.map((crm) => (
              <div key={crm.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{crm.nome}</h3>
                    <p className="text-sm text-gray-600">Tipo: {crm.tipo}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    crm.status === 'Conectado'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {crm.status}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Conversas</p>
                    <p className="text-2xl font-bold text-gray-900">{crm.conversas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última Sincronização</p>
                    <p className="text-sm font-semibold text-gray-900">{crm.ultimaSincronizacao}</p>
                  </div>
                  <div className="text-right">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold mr-2">
                      Sincronizar
                    </button>
                    <button className="bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400 text-sm font-semibold">
                      Configurar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Conectar novo CRM</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de CRM
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Selecione um CRM</option>
                  <option>Supabase</option>
                  <option>Evolution (WhatsApp)</option>
                  <option>RD Station</option>
                  <option>Pipedrive</option>
                </select>
              </div>
              <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold">
                Conectar CRM
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
