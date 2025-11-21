import { Link } from 'react-router-dom'
import { CreditCard, Shield, Lock, CheckCircle } from 'lucide-react'
import Logo from '../components/Logo'

export default function PaymentsPage() {
  const handleCheckout = () => {
    alert('Redirecionando para o Stripe Checkout...')
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Pagamento</h1>
            <p className="text-gray-600">Complete seu pagamento de forma segura</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Checkout Seguro
              </h2>
              <p className="text-gray-600">
                Processamento via Stripe - 100% seguro
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Pagamento 100% seguro via Stripe</span>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Criptografia SSL de ponta a ponta</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Dados nunca armazenados em nossos servidores</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total a pagar</span>
                <span className="text-3xl font-bold text-blue-600">R$ 197</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg"
            >
              <CreditCard className="w-6 h-6" />
              Ir para Checkout
            </button>

            {/* Payment Methods */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-3">
                Formas de pagamento aceitas
              </p>
              <div className="flex items-center justify-center gap-4 text-gray-600">
                <span className="text-xl font-semibold">VISA</span>
                <span className="text-xl font-semibold">Mastercard</span>
                <span className="text-xl font-semibold">Pix</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
