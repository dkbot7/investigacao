'use client'

/**
 * Compliance Search Component (Client Component)
 *
 * Busca interativa para verificações de compliance:
 * - PEP (por CPF ou nome)
 * - Sanções CGU (CEIS/CNEP/CEAF)
 * - OFAC SDN List
 *
 * Best Practices 2025:
 * - useTransition para transições assíncronas
 * - useOptimistic para feedback imediato (opcional)
 * - Server Actions ao invés de fetch direto
 * - Error boundaries para tratamento robusto
 *
 * Fontes:
 * - https://react.dev/reference/react/useOptimistic
 * - https://medium.com/@lovleshpokra/react-19-how-to-use-usetransition-useoptimistic-and-useactionstatehooks-d77352c03128
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

import { useState, useTransition } from 'react'
import { Search, X, AlertCircle, Loader2 } from 'lucide-react'
import {
  verificarPEPAction,
  verificarSancoesAction,
  verificarOFACAction,
  buscarPEPPorNomeAction,
  type PEPVerificationResult,
  type SancoesConsolidadasResult,
  type OFACVerificationResult,
} from '@/app/actions/compliance'
import { ComplianceBadge } from './ComplianceBadge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SearchType = 'cpf' | 'cnpj' | 'nome'

interface ComplianceSearchProps {
  defaultSearchType?: SearchType
  className?: string
}

export function ComplianceSearch({ defaultSearchType = 'cpf', className }: ComplianceSearchProps) {
  const [searchType, setSearchType] = useState<SearchType>(defaultSearchType)
  const [searchValue, setSearchValue] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Resultados
  const [pepResult, setPepResult] = useState<PEPVerificationResult | null>(null)
  const [sancoesResult, setSancoesResult] = useState<SancoesConsolidadasResult | null>(null)
  const [ofacResult, setOfacResult] = useState<OFACVerificationResult | null>(null)
  const [nomeResults, setNomeResults] = useState<any[]>([])

  const handleSearch = () => {
    if (!searchValue.trim()) {
      setError('Digite um valor para buscar')
      return
    }

    // Reset estados
    setError(null)
    setPepResult(null)
    setSancoesResult(null)
    setOfacResult(null)
    setNomeResults([])

    // useTransition para marcar como transição assíncrona (React 19)
    startTransition(async () => {
      try {
        if (searchType === 'nome') {
          // Busca por nome (PEP + OFAC)
          const [pepResults, ofacResults] = await Promise.all([
            buscarPEPPorNomeAction(searchValue),
            verificarOFACAction(searchValue, 70),
          ])

          setNomeResults(pepResults)
          setOfacResult(ofacResults)
        } else {
          // Busca por documento (CPF/CNPJ)
          const documento = searchValue.replace(/\D/g, '')

          const [pep, sancoes] = await Promise.all([
            verificarPEPAction(documento),
            verificarSancoesAction(documento),
          ])

          setPepResult(pep)
          setSancoesResult(sancoes)
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao realizar busca')
        console.error('Erro na busca de compliance:', err)
      }
    })
  }

  const handleClear = () => {
    setSearchValue('')
    setError(null)
    setPepResult(null)
    setSancoesResult(null)
    setOfacResult(null)
    setNomeResults([])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isPending) {
      handleSearch()
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Controls */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Verificação Individual</h3>

        {/* Search Type Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSearchType('cpf')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              searchType === 'cpf'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-navy-700'
            )}
          >
            CPF
          </button>
          <button
            onClick={() => setSearchType('cnpj')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              searchType === 'cnpj'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-navy-700'
            )}
          >
            CNPJ
          </button>
          <button
            onClick={() => setSearchType('nome')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              searchType === 'nome'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-navy-700'
            )}
          >
            Nome
          </button>
        </div>

        {/* Search Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                searchType === 'cpf'
                  ? 'Digite o CPF...'
                  : searchType === 'cnpj'
                  ? 'Digite o CNPJ...'
                  : 'Digite o nome...'
              }
              disabled={isPending}
              className="w-full pl-10 pr-10 py-3 bg-slate-100 dark:bg-navy-800 border border-slate-300 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-50"
            />
            {searchValue && !isPending && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {isPending && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
            )}
          </div>

          <Button
            onClick={handleSearch}
            disabled={isPending || !searchValue.trim()}
            className="px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Verificando...' : 'Verificar'}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Results */}
      {(pepResult || sancoesResult || ofacResult || nomeResults.length > 0) && (
        <div className="space-y-4">
          {/* PEP Result */}
          {pepResult && (
            <div
              className={cn(
                'p-4 rounded-xl border',
                pepResult.isPEP
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {pepResult.isPEP ? '⚠️ Pessoa Exposta Politicamente (PEP)' : '✅ Não é PEP'}
                </h4>
                <ComplianceBadge nivelRisco={pepResult.nivel_risco} tipo="pep" />
              </div>
              {pepResult.isPEP && pepResult.pep && (
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Cargo:</strong> {pepResult.pep.cargo}
                  </p>
                  <p>
                    <strong>Órgão:</strong> {pepResult.pep.orgao}
                  </p>
                  <p>
                    <strong>Nível:</strong> {pepResult.pep.nivel_federacao}
                  </p>
                  {pepResult.pep.uf && (
                    <p>
                      <strong>UF:</strong> {pepResult.pep.uf}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sanções Result */}
          {sancoesResult && (
            <div
              className={cn(
                'p-4 rounded-xl border',
                sancoesResult.totalSancoes > 0
                  ? 'bg-orange-500/10 border-orange-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {sancoesResult.totalSancoes > 0
                    ? `⚠️ ${sancoesResult.totalSancoes} Sanção(ões) Encontrada(s)`
                    : '✅ Nenhuma Sanção'}
                </h4>
                <ComplianceBadge nivelRisco={sancoesResult.nivelRisco} tipo="sancoes" />
              </div>
              {sancoesResult.totalSancoes > 0 && (
                <ul className="text-sm space-y-1">
                  {sancoesResult.sancoes.ceis.total > 0 && (
                    <li>• CEIS (Inidôneas/Suspensas): {sancoesResult.sancoes.ceis.total}</li>
                  )}
                  {sancoesResult.sancoes.cnep.total > 0 && (
                    <li>• CNEP (Lei Anticorrupção): {sancoesResult.sancoes.cnep.total}</li>
                  )}
                  {sancoesResult.sancoes.ceaf.total > 0 && (
                    <li>• CEAF (Acordos de Leniência): {sancoesResult.sancoes.ceaf.total}</li>
                  )}
                </ul>
              )}
            </div>
          )}

          {/* OFAC Result */}
          {ofacResult && ofacResult.encontrado && (
            <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  🚨 OFAC SDN List - {ofacResult.matches.length} Match(es)
                </h4>
                <ComplianceBadge nivelRisco={ofacResult.nivel_risco} tipo="ofac" />
              </div>
              <div className="space-y-2">
                {ofacResult.matches.slice(0, 3).map((match, idx) => (
                  <div key={idx} className="text-sm bg-red-500/5 p-2 rounded">
                    <p>
                      <strong>Nome:</strong> {match.sdn_name}
                    </p>
                    <p>
                      <strong>Similaridade:</strong> {match.score}%
                    </p>
                    <p>
                      <strong>Programas:</strong> {match.programs.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nome Search Results */}
          {nomeResults.length > 0 && (
            <div className="p-4 rounded-xl border bg-yellow-500/10 border-yellow-500/30">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                📋 {nomeResults.length} PEP(s) Encontrado(s)
              </h4>
              <div className="space-y-2">
                {nomeResults.slice(0, 5).map((pep, idx) => (
                  <div key={idx} className="text-sm bg-yellow-500/5 p-2 rounded">
                    <p>
                      <strong>Nome:</strong> {pep.nome}
                    </p>
                    <p>
                      <strong>CPF:</strong> {pep.cpf}
                    </p>
                    <p>
                      <strong>Cargo:</strong> {pep.cargo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
