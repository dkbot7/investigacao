/**
 * Investigação Service
 *
 * Service layer para operações de investigação
 * Endpoints: Funcionários, Óbitos, Vínculos, Candidatos, Doações, Sanções, Benefícios, OFAC
 */

import { apiClient } from '../api-client'
import type {
  Funcionario,
  FuncionariosResponse,
  Obito,
  ObitosResponse,
  Vinculo,
  VinculosResponse,
  Candidatura,
  CandidaturasResponse,
  Doacao,
  DoacoesResponse,
  Sancao,
  SancoesResponse,
  Beneficio,
  BeneficiosResponse,
  OFACMatch,
  OFACMatchesResponse,
  InvestigacaoStats,
  CreateInvestigacaoRequest,
  UpdateInvestigacaoRequest,
  InvestigacaoFilters,
} from '../types/investigacao.types'
import { InvestigacaoError } from '../types/investigacao.types'

/**
 * Investigação Service Class
 */
export class InvestigacaoService {
  // ============================================
  // Funcionários
  // ============================================

  /**
   * Lista todos os funcionários/investigados
   */
  async getFuncionarios(filters?: InvestigacaoFilters): Promise<FuncionariosResponse> {
    const params = new URLSearchParams()

    if (filters?.grupo) params.set('grupo', filters.grupo)
    if (filters?.search) params.set('search', filters.search)
    if (filters?.page) params.set('page', filters.page.toString())
    if (filters?.limit) params.set('limit', filters.limit.toString())

    const query = params.toString()
    const response = await apiClient.get<{ data: FuncionariosResponse }>(
      `/api/investigacoes/funcionarios${query ? `?${query}` : ''}`
    )
    return response.data
  }

  /**
   * Busca um funcionário por CPF
   */
  async getFuncionarioByCPF(cpf: string): Promise<Funcionario> {
    const cpfLimpo = this.limparCPF(cpf)
    const response = await apiClient.get<{ data: Funcionario }>(
      `/api/investigacoes/funcionarios/${cpfLimpo}`
    )
    return response.data
  }

  /**
   * Cria uma nova investigação
   */
  async createInvestigacao(data: CreateInvestigacaoRequest): Promise<Funcionario> {
    const cpfLimpo = this.limparCPF(data.cpf)

    if (!this.validarCPF(cpfLimpo)) {
      throw new InvestigacaoError('CPF inválido', 'INVALID_CPF')
    }

    const response = await apiClient.post<{ data: Funcionario }>(
      '/api/investigacoes/funcionarios',
      { ...data, cpf: cpfLimpo }
    )
    return response.data
  }

  /**
   * Atualiza uma investigação existente
   */
  async updateInvestigacao(cpf: string, data: UpdateInvestigacaoRequest): Promise<Funcionario> {
    const cpfLimpo = this.limparCPF(cpf)
    const response = await apiClient.patch<{ data: Funcionario }>(
      `/api/investigacoes/funcionarios/${cpfLimpo}`,
      data
    )
    return response.data
  }

  /**
   * Deleta uma investigação
   */
  async deleteInvestigacao(cpf: string): Promise<void> {
    const cpfLimpo = this.limparCPF(cpf)
    await apiClient.delete<{ success: boolean }>(
      `/api/investigacoes/funcionarios/${cpfLimpo}`
    )
  }

  // ============================================
  // Óbitos
  // ============================================

  /**
   * Lista todos os óbitos identificados
   */
  async getObitos(filters?: InvestigacaoFilters): Promise<ObitosResponse> {
    const params = new URLSearchParams()

    if (filters?.grupo) params.set('grupo', filters.grupo)
    if (filters?.search) params.set('search', filters.search)

    const query = params.toString()
    const response = await apiClient.get<{ data: ObitosResponse }>(
      `/api/investigacoes/obitos${query ? `?${query}` : ''}`
    )
    return response.data
  }

  /**
   * Verifica óbito de um CPF específico
   */
  async verificarObito(cpf: string): Promise<Obito | null> {
    const cpfLimpo = this.limparCPF(cpf)

    try {
      const response = await apiClient.get<{ data: Obito | null }>(
        `/api/investigacoes/obitos/${cpfLimpo}`
      )
      return response.data
    } catch (error: any) {
      if (error.status === 404) {
        return null // Não consta óbito
      }
      throw error
    }
  }

  // ============================================
  // Vínculos Empresariais
  // ============================================

  /**
   * Lista todos os vínculos empresariais
   */
  async getVinculos(filters?: InvestigacaoFilters): Promise<VinculosResponse> {
    const params = new URLSearchParams()

    if (filters?.grupo) params.set('grupo', filters.grupo)
    if (filters?.search) params.set('search', filters.search)

    const query = params.toString()
    const response = await apiClient.get<{ data: VinculosResponse }>(
      `/api/investigacoes/vinculos${query ? `?${query}` : ''}`
    )
    return response.data
  }

  /**
   * Busca vínculos de um CPF específico
   */
  async getVinculosByCPF(cpf: string): Promise<Vinculo[]> {
    const cpfLimpo = this.limparCPF(cpf)
    const response = await apiClient.get<{ data: Vinculo[] }>(
      `/api/investigacoes/vinculos/cpf/${cpfLimpo}`
    )
    return response.data
  }

  /**
   * Busca vínculos de um CNPJ específico
   */
  async getVinculosByCNPJ(cnpj: string): Promise<Vinculo[]> {
    const cnpjLimpo = this.limparCNPJ(cnpj)
    const response = await apiClient.get<{ data: Vinculo[] }>(
      `/api/investigacoes/vinculos/cnpj/${cnpjLimpo}`
    )
    return response.data
  }

  // ============================================
  // Candidatos
  // ============================================

  /**
   * Lista todos os candidatos identificados
   */
  async getCandidatos(filters?: InvestigacaoFilters): Promise<CandidaturasResponse> {
    const params = new URLSearchParams()

    if (filters?.grupo) params.set('grupo', filters.grupo)
    if (filters?.search) params.set('search', filters.search)

    const query = params.toString()
    const response = await apiClient.get<{ data: CandidaturasResponse }>(
      `/api/investigacoes/candidatos${query ? `?${query}` : ''}`
    )
    return response.data
  }

  /**
   * Busca candidaturas de um CPF específico
   */
  async getCandidaturasByCPF(cpf: string): Promise<Candidatura[]> {
    const cpfLimpo = this.limparCPF(cpf)
    const response = await apiClient.get<{ data: Candidatura[] }>(
      `/api/investigacoes/candidatos/cpf/${cpfLimpo}`
    )
    return response.data
  }

  // ============================================
  // Doadores
  // ============================================

  /**
   * Lista todos os doadores identificados
   */
  async getDoadores(filters?: InvestigacaoFilters): Promise<DoacoesResponse> {
    const params = new URLSearchParams()

    if (filters?.grupo) params.set('grupo', filters.grupo)
    if (filters?.search) params.set('search', filters.search)

    const query = params.toString()
    const response = await apiClient.get<{ data: DoacoesResponse }>(
      `/api/investigacoes/doadores${query ? `?${query}` : ''}`
    )
    return response.data
  }

  /**
   * Busca doações de um CPF específico
   */
  async getDoacoesByCPF(cpf: string): Promise<Doacao[]> {
    const cpfLimpo = this.limparCPF(cpf)
    const response = await apiClient.get<{ data: Doacao[] }>(
      `/api/investigacoes/doadores/cpf/${cpfLimpo}`
    )
    return response.data
  }

  // ============================================
  // Sancionados
  // ============================================

  /**
   * Lista todos os sancionados identificados
   */
  async getSancionados(filters?: InvestigacaoFilters): Promise<SancoesResponse> {
    const params = new URLSearchParams()

    if (filters?.grupo) params.set('grupo', filters.grupo)
    if (filters?.search) params.set('search', filters.search)

    const query = params.toString()
    const response = await apiClient.get<{ data: SancoesResponse }>(
      `/api/investigacoes/sancionados${query ? `?${query}` : ''}`
    )
    return response.data
  }

  /**
   * Busca sanções de um CPF específico
   */
  async getSancoesByCPF(cpf: string): Promise<Sancao[]> {
    const cpfLimpo = this.limparCPF(cpf)
    const response = await apiClient.get<{ data: Sancao[] }>(
      `/api/investigacoes/sancionados/cpf/${cpfLimpo}`
    )
    return response.data
  }

  // ============================================
  // Benefícios
  // ============================================

  /**
   * Lista todos os beneficiários identificados
   */
  async getBeneficiarios(filters?: InvestigacaoFilters): Promise<BeneficiosResponse> {
    const params = new URLSearchParams()

    if (filters?.grupo) params.set('grupo', filters.grupo)
    if (filters?.search) params.set('search', filters.search)

    const query = params.toString()
    const response = await apiClient.get<{ data: BeneficiosResponse }>(
      `/api/investigacoes/beneficios${query ? `?${query}` : ''}`
    )
    return response.data
  }

  /**
   * Busca benefícios de um CPF específico
   */
  async getBeneficiosByCPF(cpf: string): Promise<Beneficio[]> {
    const cpfLimpo = this.limparCPF(cpf)
    const response = await apiClient.get<{ data: Beneficio[] }>(
      `/api/investigacoes/beneficios/cpf/${cpfLimpo}`
    )
    return response.data
  }

  // ============================================
  // OFAC
  // ============================================

  /**
   * Lista todos os matches OFAC identificados
   */
  async getOFACMatches(filters?: InvestigacaoFilters): Promise<OFACMatchesResponse> {
    const params = new URLSearchParams()

    if (filters?.grupo) params.set('grupo', filters.grupo)
    if (filters?.search) params.set('search', filters.search)

    const query = params.toString()
    const response = await apiClient.get<{ data: OFACMatchesResponse }>(
      `/api/investigacoes/ofac${query ? `?${query}` : ''}`
    )
    return response.data
  }

  /**
   * Verifica match OFAC de um CPF/CNPJ específico
   */
  async verificarOFAC(cpfCnpj: string): Promise<OFACMatch[]> {
    const docLimpo = this.limparDocumento(cpfCnpj)
    const response = await apiClient.get<{ data: OFACMatch[] }>(
      `/api/investigacoes/ofac/${docLimpo}`
    )
    return response.data
  }

  // ============================================
  // Estatísticas
  // ============================================

  /**
   * Busca estatísticas gerais das investigações
   */
  async getStats(): Promise<InvestigacaoStats> {
    const response = await apiClient.get<{ data: InvestigacaoStats }>(
      '/api/investigacoes/stats'
    )
    return response.data
  }

  // ============================================
  // Exportação
  // ============================================

  /**
   * Exporta funcionários em CSV
   */
  async exportFuncionariosCSV(filters?: InvestigacaoFilters): Promise<Blob> {
    const params = new URLSearchParams()

    if (filters?.grupo) params.set('grupo', filters.grupo)
    if (filters?.search) params.set('search', filters.search)

    const query = params.toString()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/investigacoes/funcionarios/export${query ? `?${query}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${await this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
      }
    )

    if (!response.ok) {
      throw new InvestigacaoError('Erro ao exportar funcionários')
    }

    return response.blob()
  }

  /**
   * Exporta óbitos em CSV
   */
  async exportObitosCSV(filters?: InvestigacaoFilters): Promise<Blob> {
    const params = new URLSearchParams()

    if (filters?.grupo) params.set('grupo', filters.grupo)
    if (filters?.search) params.set('search', filters.search)

    const query = params.toString()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/investigacoes/obitos/export${query ? `?${query}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${await this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
      }
    )

    if (!response.ok) {
      throw new InvestigacaoError('Erro ao exportar óbitos')
    }

    return response.blob()
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Remove formatação de CPF
   */
  private limparCPF(cpf: string): string {
    return cpf.replace(/\D/g, '')
  }

  /**
   * Remove formatação de CNPJ
   */
  private limparCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, '')
  }

  /**
   * Remove formatação de CPF ou CNPJ
   */
  private limparDocumento(doc: string): string {
    return doc.replace(/\D/g, '')
  }

  /**
   * Valida CPF (algoritmo oficial)
   */
  private validarCPF(cpf: string): boolean {
    if (!cpf || cpf.length !== 11) return false

    // CPFs inválidos conhecidos
    const invalidCpfs = [
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999',
    ]

    if (invalidCpfs.includes(cpf)) return false

    // Validação dos dígitos verificadores
    let soma = 0
    let resto

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }

    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(9, 10))) return false

    soma = 0
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }

    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(10, 11))) return false

    return true
  }

  /**
   * Get authentication token
   */
  private async getAuthToken(): Promise<string> {
    const { auth } = await import('../firebase')
    const user = auth.currentUser
    if (!user) {
      throw new InvestigacaoError('Usuário não autenticado', 'AUTH_ERROR')
    }
    return user.getIdToken()
  }

}

/**
 * Singleton instance
 */
export const investigacaoService = new InvestigacaoService()
