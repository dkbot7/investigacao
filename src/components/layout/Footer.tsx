import { Link } from 'react-router-dom'
import { Search, Mail, Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-white">investigaree</span>
            </div>
            <p className="text-sm text-gray-400">
              Plataforma de investigação digital e due diligence de pessoas.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Preços
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Casos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">
                  LGPD
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:contato@investigaree.com.br" className="hover:text-white transition">
                  contato@investigaree.com.br
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-gray-400">100% LGPD Compliant</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} investigaree. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
