import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, CheckCircle, Search } from 'lucide-react'

export default function ReportDetailsPage() {
  const { id } = useParams()

  // Mock data
  const report = {
    id,
    name: 'João Silva',
    status: 'completed',
    date: '20/11/2025',
    services: ['Redes Sociais', 'Documentos', 'Antecedentes'],
    summary: 'Análise concluída com sucesso. Nenhuma ocorrência relevante encontrada.',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Search className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">investigaree</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </Link>

          {/* Report Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.name}</h1>
                <p className="text-gray-600">ID: {report.id}</p>
              </div>
              <span className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                <CheckCircle className="w-5 h-5" />
                Concluído
              </span>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Serviços Incluídos</h2>
            <div className="flex flex-wrap gap-2">
              {report.services.map((service, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Resumo dos Resultados</h2>
            <p className="text-gray-700">{report.summary}</p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="font-medium">Relatório criado</p>
                  <p className="text-sm text-gray-600">{report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="font-medium">Processamento concluído</p>
                  <p className="text-sm text-gray-600">{report.date}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg">
            <Download className="w-6 h-6" />
            Download Relatório PDF
          </button>
        </div>
      </div>
    </div>
  )
}
