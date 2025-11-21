import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react'
import Logo from '../components/Logo'

export default function CreateReportPage() {
  const [targetName, setTargetName] = useState('')
  const [targetDocument, setTargetDocument] = useState('')
  const [services, setServices] = useState<string[]>([])
  const [urgency, setUrgency] = useState<'standard' | 'express'>('standard')
  const navigate = useNavigate()

  const serviceList = [
    { id: 'social_media', label: 'Redes Sociais' },
    { id: 'documents', label: 'Documentos' },
    { id: 'legal_records', label: 'Antecedentes' },
    { id: 'data_breach', label: 'Data Breach' },
    { id: 'google_search', label: 'Google Search' },
    { id: 'risk_analysis', label: 'Análise de Risco' },
  ]

  const toggleService = (id: string) => {
    setServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulação - em produção chamaria API
    alert(`Relatório criado!\nAlvo: ${targetName}\nServiços: ${services.length}\nValor: R$ ${urgency === 'express' ? '397' : '197'}`)
    navigate('/dashboard')
  }

  const price = urgency === 'express' ? 397 : 197

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
          {/* Back Button */}
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Novo Relatório de Investigação</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Target Info */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Informações do Alvo</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={targetName}
                      onChange={(e) => setTargetName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF (opcional)
                    </label>
                    <input
                      type="text"
                      value={targetDocument}
                      onChange={(e) => setTargetDocument(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Serviços *</h2>
                <div className="grid grid-cols-2 gap-3">
                  {serviceList.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        services.includes(service.id)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {services.includes(service.id) ? (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                        )}
                        <span className="font-medium">{service.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Urgência *</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setUrgency('standard')}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                      urgency === 'standard'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <h3 className="text-lg font-bold mb-2">Standard</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-1">R$ 197</p>
                    <p className="text-sm text-gray-600">Entrega em 48h</p>
                  </div>
                  <div
                    onClick={() => setUrgency('express')}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                      urgency === 'express'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <h3 className="text-lg font-bold mb-2">Express</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-1">R$ 397</p>
                    <p className="text-sm text-gray-600">Entrega em 6h</p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Resumo</h3>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-3xl font-bold text-blue-600">R$ {price}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  {services.length} serviços selecionados • {urgency === 'express' ? 'Express (6h)' : 'Standard (48h)'}
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!targetName || services.length === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FileText className="w-6 h-6" />
                Criar Relatório e Pagar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
