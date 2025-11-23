import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-12 border-t border-neutral-800">
      <div className="container max-w-7xl px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-bold text-white">investigaree</span>
            </div>
            <p className="text-sm">
              Due Diligence Digital Premium
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition">Red Flag Express</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Due Diligence Corporativo</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Startup & Founders</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition">Sobre</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Privacidade</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">LGPD</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-neutral-800 text-sm text-center">
          <p>© 2025 investigaree. Todos os direitos reservados.</p>
          <p className="mt-2 text-xs">CNPJ: XX.XXX.XXX/0001-XX</p>
        </div>
      </div>
    </footer>
  );
}
