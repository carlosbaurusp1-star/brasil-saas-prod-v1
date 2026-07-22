'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold">Brasil SaaS</h2>
        <p className="text-sm text-gray-400">Análise de Conversas</p>
      </div>

      <nav className="flex-1 p-6 space-y-4">
        <Link
          href="/"
          className="block px-4 py-3 rounded hover:bg-gray-800 transition-colors"
        >
          📊 Dashboard
        </Link>
        <Link
          href="/relatorios"
          className="block px-4 py-3 rounded hover:bg-gray-800 transition-colors"
        >
          📈 Relatórios
        </Link>
        <Link
          href="/crms"
          className="block px-4 py-3 rounded hover:bg-gray-800 transition-colors"
        >
          🔗 CRMs
        </Link>
        <Link
          href="/agentes"
          className="block px-4 py-3 rounded hover:bg-gray-800 transition-colors"
        >
          🤖 Agentes
        </Link>
      </nav>

      <div className="p-6 border-t border-gray-800">
        <p className="text-sm text-gray-400 mb-4">Conectado como:</p>
        <p className="text-sm font-semibold break-all mb-4">{user?.email}</p>
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition-colors"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}
