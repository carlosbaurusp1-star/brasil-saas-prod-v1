'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'

export default function AgentesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [agents, setAgents] = useState([
    {
      id: 1,
      nome: 'Agente Principal',
      status: 'Ativo',
      ultimaExecucao: '2024-01-15 18:00',
      conversasProcessadas: 342,
      tempoExecucao: '2m 34s',
      erros: 0,
    },
    {
      id: 2,
      nome: 'Agente de Análise',
      status: 'Ativo',
      ultimaExecucao: '2024-01-15 18:05',
      conversasProcessadas: 156,
      tempoExecucao: '1m 12s',
      erros: 0,
    },
    {
      id: 3,
      nome: 'Agente de Qualificação',
      status: 'Inativo',
      ultimaExecucao: '2024-01-14 18:00',
      conversasProcessadas: 89,
      tempoExecucao: '45s',
      erros: 2,
    },
    {
      id: 4,
      nome: 'Agente de Recomendação',
      status: 'Ativo',
      ultimaExecucao: '2024-01-15 18:10',
      conversasProcessadas: 234,
      tempoExecucao: '1m 58s',
      erros: 0,
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
            <h1 className="text-3xl font-bold text-gray-900">Agentes de IA</h1>
            <p className="text-gray-600">Gerenciar e monitorar agentes inteligentes</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{agent.nome}</h3>
                    <p className="text-sm text-gray-600">ID: Agent-{agent.id}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    agent.status === 'Ativo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {agent.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Última Execução</p>
                    <p className="text-sm font-semibold text-gray-900">{agent.ultimaExecucao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversas Processadas</p>
                    <p className="text-lg font-bold text-gray-900">{agent.conversasProcessadas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tempo de Execução</p>
                    <p className="text-sm font-semibold text-gray-900">{agent.tempoExecucao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Erros</p>
                    <p className={`text-lg font-bold ${agent.erros > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {agent.erros}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold">
                    Executar Agora
                  </button>
                  <button className="bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400 text-sm font-semibold">
                    Ver Logs
                  </button>
                  <button className="bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400 text-sm font-semibold">
                    Configurar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
