import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Shield, FileText, Clock, Users, Globe, CheckCircle, X, Eye, EyeOff } from 'lucide-react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import Logo from '../components/Logo'

export default function LandingPage() {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [consentCommunications, setConsentCommunications] = useState(false)
  const [consentTerms, setConsentTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Modal de senha
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Dados temporários do formulário
  const [tempFormData, setTempFormData] = useState<{
    name: string
    whatsapp: string
    email: string
    consentCommunications: boolean
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !whatsapp) {
      setError('Preencha todos os campos')
      return
    }

    if (!consentTerms) {
      setError('Você precisa aceitar a Política de Privacidade e os Termos LGPD')
      return
    }

    // Salvar dados temporários e abrir modal de senha
    setTempFormData({
      name,
      whatsapp,
      email,
      consentCommunications,
    })
    setShowPasswordModal(true)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (!password || !confirmPassword) {
      setPasswordError('Preencha ambos os campos de senha')
      return
    }

    if (password.length < 6) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem')
      return
    }

    if (!tempFormData) {
      setPasswordError('Erro: dados do formulário não encontrados')
      return
    }

    setLoading(true)

    try {
      // Criar conta no Firebase com a senha fornecida
      const userCredential = await createUserWithEmailAndPassword(auth, tempFormData.email, password)
      const firebaseUid = userCredential.user.uid

      // Salvar lead no Supabase via API
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.investigaree.com.br'

      const response = await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: firebaseUid,
          name: tempFormData.name,
          email: tempFormData.email,
          phone: tempFormData.whatsapp,
          consent: tempFormData.consentCommunications,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar lead')
      }

      // Fechar modal e redirecionar para página de obrigado
      setShowPasswordModal(false)
      navigate('/obrigado')
    } catch (err: any) {
      console.error('Erro ao cadastrar:', err)

      if (err.code === 'auth/email-already-in-use') {
        setPasswordError('Este email já está cadastrado')
      } else if (err.code === 'auth/invalid-email') {
        setPasswordError('Email inválido')
      } else if (err.code === 'auth/configuration-not-found') {
        setPasswordError('Erro de configuração do Firebase. Por favor, habilite Email/Password no Firebase Console.')
      } else if (err.code === 'auth/weak-password') {
        setPasswordError('Senha muito fraca. Use no mínimo 6 caracteres.')
      } else {
        setPasswordError(`Erro: ${err.code || err.message || 'Tente novamente'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatWhatsApp = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '')

    // Formata como (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="text-2xl font-bold text-gray-900">investigaree</span>
            </div>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Investigação Digital
            <span className="text-blue-600"> Inteligente</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Entre para a lista de acesso antecipado e seja um dos primeiros a testar nossa plataforma.
          </p>

          {/* Formulário de Cadastro */}
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Entrar na Lista</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-left text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Seu nome"
                  required
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block text-left text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {/* Checkbox 1: Comunicações */}
              <div className="flex items-start gap-3 text-left">
                <input
                  id="consent-communications"
                  type="checkbox"
                  checked={consentCommunications}
                  onChange={(e) => setConsentCommunications(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="consent-communications" className="text-sm text-gray-600">
                  Aceito receber comunicações sobre o status dos meus relatórios e novidades da plataforma
                </label>
              </div>

              {/* Checkbox 2: Termos LGPD (OBRIGATÓRIO) */}
              <div className="flex items-start gap-3 text-left">
                <input
                  id="consent-terms"
                  type="checkbox"
                  checked={consentTerms}
                  onChange={(e) => setConsentTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <label htmlFor="consent-terms" className="text-sm text-gray-600">
                  Li e aceito a{' '}
                  <Link to="/privacidade" className="text-blue-600 hover:underline" target="_blank">
                    Política de Privacidade
                  </Link>{' '}
                  e os{' '}
                  <Link to="/termos-lgpd" className="text-blue-600 hover:underline" target="_blank">
                    Termos LGPD
                  </Link>
                  {' '}<span className="text-red-500">*</span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Cadastrando...'
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Criar Conta / Entrar na Lista
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-500">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Modal de Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Botão Fechar */}
            <button
              onClick={() => {
                setShowPasswordModal(false)
                setPassword('')
                setConfirmPassword('')
                setPasswordError('')
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar Senha</h2>
            <p className="text-sm text-gray-600 mb-6">
              Para finalizar seu cadastro, crie uma senha segura para acessar sua conta.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-left text-sm font-medium text-gray-700 mb-1">
                  Senha (mínimo 6 caracteres)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    placeholder="••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirm-password" className="block text-left text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    placeholder="••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Error */}
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Criando conta...'
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirmar e Criar Conta
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <Search className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">1. Informe os Dados</h3>
            <p className="text-gray-600">
              Digite nome, CPF ou outras informações da pessoa a ser investigada
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <FileText className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">2. Processamento IA</h3>
            <p className="text-gray-600">
              Nossa IA busca em múltiplas bases de dados e processa as informações
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">3. Receba o Relatório</h3>
            <p className="text-gray-600">
              Relatório completo com análise de riscos e recomendações
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Módulos Disponíveis</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { icon: Globe, title: 'Redes Sociais', desc: 'Análise de perfis públicos' },
            { icon: FileText, title: 'Documentos', desc: 'Validação de CPF, RG, CNH' },
            { icon: Users, title: 'Antecedentes', desc: 'Busca em registros públicos' },
            { icon: Shield, title: 'Data Breach', desc: 'Vazamentos de dados' },
            { icon: Search, title: 'Google Search', desc: 'Busca inteligente na web' },
            { icon: Clock, title: 'Histórico', desc: 'Timeline de atividades' },
          ].map((service, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <service.icon className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="font-bold text-lg mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Planos</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Standard</h3>
            <div className="text-4xl font-bold text-blue-600 mb-4">R$ 197</div>
            <p className="text-gray-600 mb-6">Relatório em até 48h</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                Todos os módulos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                Análise de IA
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                Suporte por email
              </li>
            </ul>
            <Link
              to="/register"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Escolher Plano
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-xl shadow-lg text-white relative">
            <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
              Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Express</h3>
            <div className="text-4xl font-bold mb-4">R$ 397</div>
            <p className="mb-6 text-blue-100">Relatório em até 6h</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                Tudo do Standard
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                Prioridade no processamento
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                Suporte prioritário
              </li>
            </ul>
            <Link
              to="/register"
              className="block w-full bg-white text-blue-600 text-center py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Escolher Plano
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Logo className="w-6 h-6" />
                <span className="text-xl font-bold">investigaree</span>
              </div>
              <p className="text-gray-400">
                Investigação digital inteligente e LGPD compliant
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Cadastrar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/termos-lgpd" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link to="/privacidade" className="hover:text-white">Política de Privacidade</Link></li>
                <li><Link to="/termos-lgpd" className="hover:text-white">LGPD</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 investigaree. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
