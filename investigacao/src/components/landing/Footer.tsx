"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 py-12 border-t border-slate-200 dark:border-neutral-800">
      <div className="container max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">investigaree</span>
            </div>
            <p className="text-sm">
              Investigação Digital com Inteligência
            </p>
          </div>

          {/* Soluções Empresas */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Soluções Empresas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/solucoes/rh-compliance" className="hover:text-green-500 transition">RH & Compliance</Link></li>
              <li><Link href="/solucoes/due-diligence" className="hover:text-green-500 transition">Due Diligence M&A</Link></li>
              <li><Link href="/solucoes/coleta-provas-digitais" className="hover:text-green-500 transition">Provas Digitais</Link></li>
            </ul>
          </div>

          {/* Soluções Pessoas */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Soluções Pessoas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/solucoes/protecao-remocao" className="hover:text-green-500 transition">Proteção Digital</Link></li>
              <li><Link href="/solucoes/due-diligence-divorcios" className="hover:text-green-500 transition">Divórcio</Link></li>
            </ul>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-2 mt-4">Governo</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/solucoes/auditoria-licitacoes" className="hover:text-green-500 transition">Auditoria Licitações</Link></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/quemsomos" className="hover:text-green-500 transition">Quem Somos</Link></li>
              <li><Link href="/metodologia" className="hover:text-green-500 transition">Metodologia</Link></li>
              <li><Link href="/cases" className="hover:text-green-500 transition">Cases</Link></li>
              <li><Link href="/faq" className="hover:text-green-500 transition">FAQ</Link></li>
              <li><Link href="/contato" className="hover:text-green-500 transition">Contato</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacidade" className="hover:text-green-500 transition">Privacidade</Link></li>
              <li><Link href="/termos" className="hover:text-green-500 transition">Termos</Link></li>
              <li><Link href="/lgpd" className="hover:text-green-500 transition">LGPD</Link></li>
              <li><Link href="/cookies" className="hover:text-green-500 transition">Cookies</Link></li>
              <li><Link href="/disclaimer" className="hover:text-green-500 transition">Disclaimer</Link></li>
              <li className="pt-2">
                <WhatsAppButton
                  message="Olá! Gostaria de saber mais sobre os serviços de investigação digital."
                  source="footer"
                  variant="outline"
                  className="hover:text-green-400 transition inline-flex items-center gap-2 p-0"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </WhatsAppButton>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-200 dark:border-neutral-800 text-sm text-center">
          <p>© 2025 investigaree. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
