import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, MessageCircle, Search } from 'lucide-react'
import Logo from '../components/Logo'

export default function ObrigadoPage() {
  useEffect(() => {
    // Carregar o Snake.js quando a página montar
    const script = document.createElement('script')
    script.src = '/snake.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup: remover o script quando desmontar
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="text-2xl font-bold text-gray-900">investigaree</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Mensagem de Agradecimento */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-green-100">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Obrigado por entrar para a lista de acesso antecipado!
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              A equipe profissional da <span className="font-bold text-blue-600">INVESTIGAREE</span> entrará em contato em breve.
            </p>
            <p className="text-gray-500">
              Enquanto isso, aproveite o nosso jogo clássico para passar o tempo.
            </p>
          </div>

          {/* Onboarding do Joguinho */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-8 text-center border-2 border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Reviva o clássico jogo da cobrinha!
            </h2>
            <p className="text-gray-600 mb-4">
              Escolha uma dificuldade, capture as maçãs e tente bater seu próprio recorde.
            </p>

            {/* Dificuldades */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => {
                  const event = new CustomEvent('snakeStart', { detail: { difficulty: 'easy' } })
                  window.dispatchEvent(event)
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Fácil
              </button>
              <button
                onClick={() => {
                  const event = new CustomEvent('snakeStart', { detail: { difficulty: 'medium' } })
                  window.dispatchEvent(event)
                }}
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition"
              >
                Média
              </button>
              <button
                onClick={() => {
                  const event = new CustomEvent('snakeStart', { detail: { difficulty: 'hard' } })
                  window.dispatchEvent(event)
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Difícil
              </button>
            </div>

            {/* Canvas do Snake */}
            <div className="bg-black/90 rounded-lg p-4 inline-block">
              <canvas
                id="snakeGame"
                width="400"
                height="400"
                className="border-4 border-gray-700 rounded"
              />
            </div>

            {/* Controles */}
            <div className="mt-6 text-sm text-gray-600">
              <p className="font-medium mb-2">Controles:</p>
              <p>Use as setas do teclado (↑ ↓ ← →) para mover a cobrinha</p>
              <p className="mt-2">Pressione ESPAÇO para pausar/continuar</p>
            </div>
          </div>

          {/* Botão WhatsApp */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-blue-100">
            <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Precisa falar conosco agora?
            </h3>
            <p className="text-gray-600 mb-6">
              Nossa equipe está disponível via WhatsApp para tirar suas dúvidas.
            </p>
            <a
              href="https://wa.me/5547992611117?text=Olá,%20quero%20saber%20mais%20sobre%20a%20Investigaree"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </div>

          {/* Voltar para Home */}
          <div className="text-center">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Search className="w-6 h-6" />
            <span className="text-xl font-bold">investigaree</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; 2025 investigaree. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
