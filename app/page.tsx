'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import DashboardCard from '@/components/DashboardCard'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const ETAPA_ORDEM = ['novo', 'contato', 'proposta', 'negociacao', 'ganho', 'perdido']
const ETAPA_LABEL: Record<string, string> = {
  novo: 'Novo',
  contato: 'Contato',
  proposta: 'Proposta',
  negociacao: 'Negociação',
  ganho: 'Ganho',
  perdido: 'Perdido',
}
const ETAPA_COR: Record<string, string> = {
  novo: '#3b82f6',
  contato: '#6366f1',
  proposta: '#f59e0b',
  negociacao: '#8b5cf6',
  ganho: '#10b981',
  perdido: '#ef4444',
}

interface Vendedora {
  nome: string
  leads: number
  qualificados: number
  em_negociacao: number
  ganhos: number
  perdidos: number
  mensagens: number
  valor_pipeline: number
  ultima_interacao: string | null
}

interface Relatorio {
  gerado_em: string
  data: string
  consolidado: {
    total_leads: number
    leads_hoje: number
    total_mensagens: number
    mensagens_hoje: number
    qualificados: number
    em_qualificacao: number
    valor_pipeline: number
    vendedores_ativos: number
  }
  funil: Record<string, number>
  atendimento: Record<string, number>
  vendedoras: Vendedora[]
}

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatHora(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const carregarRelatorio = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const { data, error } = await supabase.rpc('relatorio_diario_bmb')
      if (error) throw error
      setRelatorio(data as Relatorio)
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar dados')
    } finally {
      setCarregando(false)
    }
  }, [supabase])

  useEffect(() => {
    if (user) carregarRelatorio()
  }, [user, carregarRelatorio])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  const c = relatorio?.consolidado
  const funilData = relatorio
    ? ETAPA_ORDEM
        .filter((e) => relatorio.funil[e] !== undefined)
        .map((e) => ({ etapa: ETAPA_LABEL[e] || e, valor: relatorio.funil[e], cor: ETAPA_COR[e] || '#3b82f6' }))
    : []
  const vendedorasData = relatorio?.vendedoras.map((v) => ({ nome: v.nome.split(' ')[0], leads: v.leads, mensagens: v.mensagens })) || []

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Brasil Mostra Brasil — dados reais das conversas</p>
              {relatorio && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Conectado ao CRM · atualizado {formatHora(relatorio.gerado_em)}
                </p>
              )}
            </div>
            <button
              onClick={carregarRelatorio}
              disabled={carregando}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {carregando ? 'Atualizando...' : '↻ Atualizar'}
            </button>
          </div>

          {erro && (
            <div className="mb-6 p-4 rounded bg-red-50 text-red-800">
              Erro ao carregar dados reais: {erro}
            </div>
          )}

          {carregando && !relatorio && (
            <div className="p-8 text-center text-gray-500">Carregando dados reais do CRM...</div>
          )}

          {c && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <DashboardCard title="Total de Leads" value={c.total_leads} subtitle={`${c.leads_hoje} novos hoje`} icon="📊" />
                <DashboardCard title="Mensagens (total)" value={c.total_mensagens} subtitle={`${c.mensagens_hoje} hoje`} icon="💬" />
                <DashboardCard title="Pipeline Estimado" value={formatBRL(c.valor_pipeline)} subtitle={`${c.qualificados} qualificados`} icon="💰" />
                <DashboardCard title="Vendedoras Ativas" value={c.vendedores_ativos} subtitle="equipe BMB" icon="👥" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Funil de Vendas</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={funilData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="etapa" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="valor" name="Leads">
                        {funilData.map((entry, i) => (
                          <Cell key={i} fill={entry.cor} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Leads por Vendedora</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vendedorasData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nome" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="leads" name="Leads" fill="#3b82f6" />
                      <Bar dataKey="mensagens" name="Mensagens" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance por Vendedora</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-3 pr-4">Vendedora</th>
                        <th className="py-3 pr-4">Leads</th>
                        <th className="py-3 pr-4">Qualificados</th>
                        <th className="py-3 pr-4">Em Negociação</th>
                        <th className="py-3 pr-4">Mensagens</th>
                        <th className="py-3 pr-4">Pipeline</th>
                        <th className="py-3 pr-4">Última Atividade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatorio!.vendedoras.map((v) => (
                        <tr key={v.nome} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 pr-4 font-medium text-gray-900">{v.nome}</td>
                          <td className="py-3 pr-4">{v.leads}</td>
                          <td className="py-3 pr-4">{v.qualificados}</td>
                          <td className="py-3 pr-4">{v.em_negociacao}</td>
                          <td className="py-3 pr-4">{v.mensagens}</td>
                          <td className="py-3 pr-4">{formatBRL(v.valor_pipeline)}</td>
                          <td className="py-3 pr-4 text-gray-500">{formatHora(v.ultima_interacao)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
