import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Plus, FileText, User, CreditCard, LogOut, Clock, CheckCircle } from 'lucide-react'
import Logo from '../components/Logo'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  const mockReports = [
    { id: '1', name: 'João Silva', status: 'completed', date: '20/11/2025' },
    { id: '2', name: 'Maria Santos', status: 'processing', date: '21/11/2025' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="text-2xl font-bold text-gray-900">investigaree</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                <User className="w-6 h-6" />
              </Link>
              <button onClick={logout} className="text-gray-600 hover:text-red-600">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo, {user?.email}</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/reports/new"
              className="bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-10 h-10 mb-3" />
              <h3 className="text-lg font-bold mb-1">Novo Relatório</h3>
              <p className="text-blue-100 text-sm">Criar investigação</p>
            </Link>

            <Link
              to="/payments"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-2 border-gray-200"
            >
              <CreditCard className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="text-lg font-bold mb-1 text-gray-900">Pagamentos</h3>
              <p className="text-gray-600 text-sm">Histórico financeiro</p>
            </Link>

            <Link
              to="/profile"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-2 border-gray-200"
            >
              <User className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="text-lg font-bold mb-1 text-gray-900">Perfil</h3>
              <p className="text-gray-600 text-sm">Gerenciar conta</p>
            </Link>
          </div>

          {/* Reports List */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Meus Relatórios</h2>
              <Link
                to="/reports/new"
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Novo
              </Link>
            </div>

            {mockReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum relatório ainda
                </h3>
                <p className="text-gray-600 mb-6">Crie seu primeiro relatório</p>
                <Link
                  to="/reports/new"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Criar Relatório
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <Link
                    key={report.id}
                    to={`/reports/${report.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-600">Criado em {report.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {report.status === 'completed' ? (
                          <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Concluído
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            <Clock className="w-4 h-4 animate-spin" />
                            Processando
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
