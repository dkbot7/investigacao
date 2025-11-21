import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Download, Trash2, Shield } from 'lucide-react'
import Logo from '../components/Logo'

export default function ProfilePage() {
  const { user } = useAuth()

  const handleExport = () => {
    alert('Exportando seus dados...')
  }

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      alert('Conta marcada para exclusão')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="text-2xl font-bold text-gray-900">investigaree</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Meu Perfil</h1>

          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informações da Conta
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{user?.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 text-sm font-mono">{user?.uid}</span>
                </div>
              </div>
            </div>
          </div>

          {/* LGPD Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Direitos LGPD
            </h2>
            <p className="text-gray-600 mb-6">
              De acordo com a LGPD, você tem direito de acessar e excluir seus dados.
            </p>

            <div className="space-y-4">
              {/* Export Data */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Download className="w-5 h-5 text-blue-600" />
                      Exportar Meus Dados
                    </h3>
                    <p className="text-sm text-gray-600">
                      Baixe uma cópia de todos os seus dados em formato JSON
                    </p>
                  </div>
                  <button
                    onClick={handleExport}
                    className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Exportar
                  </button>
                </div>
              </div>

              {/* Delete Account */}
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-1 flex items-center gap-2">
                      <Trash2 className="w-5 h-5 text-red-600" />
                      Excluir Minha Conta
                    </h3>
                    <p className="text-sm text-red-800">
                      Excluir permanentemente sua conta e todos os dados. Ação irreversível.
                    </p>
                  </div>
                  <button
                    onClick={handleDelete}
                    className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Suas informações estão seguras
            </h3>
            <p className="text-sm text-blue-800">
              Todos os seus dados são criptografados e nunca compartilhados com terceiros.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
