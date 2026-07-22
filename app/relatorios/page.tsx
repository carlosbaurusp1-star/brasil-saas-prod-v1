'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const ETAPA_ORDEM = ['novo', 'contato', 'proposta', 'negociacao', 'ganho', 'perdido']
const ETAPA_LABEL: Record<string, string> = {
  novo: 'Novo', contato: 'Contato', proposta: 'Proposta',
  negociacao: 'Negociação', ganho: 'Ganho', perdido: 'Perdido',
}
const ETAPA_COR: Record<string, string> = {
  novo: '#3b82f6', contato: '#6366f1', proposta: '#f59e0b',
  negociacao: '#8b5cf6', ganho: '#10b981', perdido: '#ef4444',
}
const ATEND_LABEL: Record<string, string> = {
  pausado_30_min: 'Pausado 30min', encaminhado: 'Encaminhado',
  encerrado: 'Encerrado', sem_status: 'Sem status',
}
const PIE_CORES = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6']

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
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}
function formatData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo',
  })
}

export default function RelatoriosPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const { data, error } = await supabase.rpc('relatorio_diario_bmb')
      if (error) throw error
      setRelatorio(data as Relatorio)
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar')
    } finally {
      setCarregando(false)
    }
  }, [supabase])

  useEffect(() => {
    if (user) carregar()
  }, [user, carregar])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  const c = relatorio?.consolidado
  const funilData = relatorio
    ? ETAPA_ORDEM.filter((e) => relatorio.funil[e] !== undefined)
        .map((e) => ({ etapa: ETAPA_LABEL[e] || e, valor: relatorio.funil[e], cor: ETAPA_COR[e] || '#3b82f6' }))
    : []
  const atendData = relatorio
    ? Object.entries(relatorio.atendimento).map(([k, v], i) => ({
        name: ATEND_LABEL[k] || k, value: v, fill: PIE_CORES[i % PIE_CORES.length],
      }))
    : []

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatório de Vendas e Negociações</h1>
              <p className="text-gray-600">Brasil Mostra Brasil</p>
              {relatorio && (
                <p className="mt-2 text-sm text-gray-500">
                  Referente a {formatData(relatorio.data)} · gerado {formatHora(relatorio.gerado_em)}
                </p>
              )}
            </div>
            <button
              onClick={carregar}
              disabled={carregando}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {carregando ? 'Atualizando...' : '↻ Atualizar'}
            </button>
          </div>

          {erro && <div className="mb-6 p-4 rounded bg-red-50 text-red-800">Erro: {erro}</div>}
          {carregando && !relatorio && (
            <div className="p-8 text-center text-gray-500">Gerando relatório com dados reais...</div>
          )}

          {c && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-5">
                  <p className="text-gray-500 text-sm">Leads no total</p>
                  <p className="text-2xl font-bold text-gray-900">{c.total_leads}</p>
                  <p className="text-xs text-gray-400 mt-1">{c.leads_hoje} entraram hoje</p>
                </div>
                <div className="bg-white rounded-lg shadow p-5">
                  <p className="text-gray-500 text-sm">Mensagens trocadas</p>
                  <p className="text-2xl font-bold text-gray-900">{c.total_mensagens.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-gray-400 mt-1">{c.mensagens_hoje} hoje</p>
                </div>
                <div className="bg-white rounded-lg shadow p-5">
                  <p className="text-gray-500 text-sm">Pipeline estimado</p>
                  <p className="text-2xl font-bold text-gray-900">{formatBRL(c.valor_pipeline)}</p>
                  <p className="text-xs text-gray-400 mt-1">{c.qualificados} qualificados · {c.em_qualificacao} em qualificação</p>
                </div>
                <div className="bg-white rounded-lg shadow p-5">
                  <p className="text-gray-500 text-sm">Vendedoras ativas</p>
                  <p className="text-2xl font-bold text-gray-900">{c.vendedores_ativos}</p>
                  <p className="text-xs text-gray-400 mt-1">equipe BMB</p>
                </div>
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
                        {funilData.map((e, i) => <Cell key={i} fill={e.cor} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Situação dos Atendimentos</h2>
                  {atendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={atendData} cx="50%" cy="50%" labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={90} dataKey="value"
                        >
                          {atendData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400 text-center py-12">Sem dados de atendimento ainda</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhamento por Vendedora</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-3 pr-4">Vendedora</th>
                        <th className="py-3 pr-4">Leads</th>
                        <th className="py-3 pr-4">Qualificados</th>
                        <th className="py-3 pr-4">Em Negociação</th>
                        <th className="py-3 pr-4">Ganhos</th>
                        <th className="py-3 pr-4">Perdidos</th>
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
                          <td className="py-3 pr-4 text-green-600">{v.ganhos}</td>
                          <td className="py-3 pr-4 text-red-600">{v.perdidos}</td>
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
