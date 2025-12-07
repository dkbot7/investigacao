/**
 * SERPRO Service
 *
 * Service layer para APIs do SERPRO (Serviço Federal de Processamento de Dados)
 * Endpoints: CPF, CNPJ, Dívida Ativa, Renda, Faturamento, DataValid, CND
 */

import { apiClient } from '../api-client'
import type {
  CpfResponse,
  CpfConsultaRequest,
  CnpjBasicaResponse,
  CnpjQsaResponse,
  CnpjEmpresaResponse,
  CnpjConsultaRequest,
  DividaAtivaResponse,
  DividaAtivaConsultaRequest,
  RendaResponse,
  RendaConsultaRequest,
  FaturamentoResponse,
  FaturamentoConsultaRequest,
  DataValidBiometriaRequest,
  DataValidBiometriaResponse,
  DataValidDocumentoRequest,
  DataValidDocumentoResponse,
  CndResponse,
  CndConsultaRequest,
  SerproApiResponse,
  SerproError,
} from '../types/serpro.types'

/**
 * SERPRO Service Class
 */
export class SerproService {
  // ============================================
  // CPF - Consulta
  // ============================================

  /**
   * Consulta dados de um CPF
   * @param cpf CPF com ou sem formatação
   */
  async consultarCpf(cpf: string): Promise<CpfResponse> {
    const cpfLimpo = this.limparCpf(cpf)

    if (!this.validarCpf(cpfLimpo)) {
      throw new SerproError('CPF inválido', 'INVALID_CPF')
    }

    const response = await apiClient.post<SerproApiResponse<CpfResponse>>(
      '/api/serpro/cpf',
      { cpf: cpfLimpo }
    )

    return response.data
  }

  // ============================================
  // CNPJ - Consulta Básica
  // ============================================

  /**
   * Consulta dados básicos de um CNPJ
   * @param cnpj CNPJ com ou sem formatação
   */
  async consultarCnpjBasica(cnpj: string): Promise<CnpjBasicaResponse> {
    const cnpjLimpo = this.limparCnpj(cnpj)

    if (!this.validarCnpj(cnpjLimpo)) {
      throw new SerproError('CNPJ inválido', 'INVALID_CNPJ')
    }

    const response = await apiClient.post<SerproApiResponse<CnpjBasicaResponse>>(
      '/api/serpro/cnpj/basica',
      { cnpj: cnpjLimpo }
    )

    return response.data
  }

  // ============================================
  // CNPJ - Quadro de Sócios (QSA)
  // ============================================

  /**
   * Consulta Quadro de Sócios e Administradores de um CNPJ
   * @param cnpj CNPJ com ou sem formatação
   */
  async consultarCnpjQsa(cnpj: string): Promise<CnpjQsaResponse> {
    const cnpjLimpo = this.limparCnpj(cnpj)

    if (!this.validarCnpj(cnpjLimpo)) {
      throw new SerproError('CNPJ inválido', 'INVALID_CNPJ')
    }

    const response = await apiClient.post<SerproApiResponse<CnpjQsaResponse>>(
      '/api/serpro/cnpj/qsa',
      { cnpj: cnpjLimpo }
    )

    return response.data
  }

  // ============================================
  // CNPJ - Estabelecimento/Empresa Completo
  // ============================================

  /**
   * Consulta dados completos de um CNPJ (inclui QSA)
   * @param cnpj CNPJ com ou sem formatação
   */
  async consultarCnpjEmpresa(cnpj: string): Promise<CnpjEmpresaResponse> {
    const cnpjLimpo = this.limparCnpj(cnpj)

    if (!this.validarCnpj(cnpjLimpo)) {
      throw new SerproError('CNPJ inválido', 'INVALID_CNPJ')
    }

    const response = await apiClient.post<SerproApiResponse<CnpjEmpresaResponse>>(
      '/api/serpro/cnpj/empresa',
      { cnpj: cnpjLimpo }
    )

    return response.data
  }

  // ============================================
  // Dívida Ativa - Consulta
  // ============================================

  /**
   * Consulta dívidas ativas de um CPF ou CNPJ
   * @param ni CPF ou CNPJ (com ou sem formatação)
   */
  async consultarDividaAtiva(ni: string): Promise<DividaAtivaResponse> {
    const niLimpo = this.limparDocumento(ni)

    if (!this.validarCpf(niLimpo) && !this.validarCnpj(niLimpo)) {
      throw new SerproError('CPF/CNPJ inválido', 'INVALID_NI')
    }

    const response = await apiClient.post<SerproApiResponse<DividaAtivaResponse>>(
      '/api/serpro/divida-ativa',
      { ni: niLimpo }
    )

    return response.data
  }

  // ============================================
  // Renda - Consulta
  // ============================================

  /**
   * Consulta dados de renda de um CPF
   * @param cpf CPF com ou sem formatação
   * @param anoExercicio Ano do exercício (opcional, padrão: ano anterior)
   */
  async consultarRenda(cpf: string, anoExercicio?: string): Promise<RendaResponse> {
    const cpfLimpo = this.limparCpf(cpf)

    if (!this.validarCpf(cpfLimpo)) {
      throw new SerproError('CPF inválido', 'INVALID_CPF')
    }

    const response = await apiClient.post<SerproApiResponse<RendaResponse>>(
      '/api/serpro/renda',
      { cpf: cpfLimpo, anoExercicio }
    )

    return response.data
  }

  // ============================================
  // Faturamento - Consulta
  // ============================================

  /**
   * Consulta dados de faturamento de um CNPJ
   * @param cnpj CNPJ com ou sem formatação
   * @param anoCalendario Ano calendário (opcional, padrão: ano anterior)
   */
  async consultarFaturamento(cnpj: string, anoCalendario?: string): Promise<FaturamentoResponse> {
    const cnpjLimpo = this.limparCnpj(cnpj)

    if (!this.validarCnpj(cnpjLimpo)) {
      throw new SerproError('CNPJ inválido', 'INVALID_CNPJ')
    }

    const response = await apiClient.post<SerproApiResponse<FaturamentoResponse>>(
      '/api/serpro/faturamento',
      { cnpj: cnpjLimpo, anoCalendario }
    )

    return response.data
  }

  // ============================================
  // DataValid - Biometria Facial
  // ============================================

  /**
   * Valida biometria facial de um CPF
   * @param cpf CPF com ou sem formatação
   * @param fotoBase64 Foto em base64 para comparação
   */
  async validarBiometria(cpf: string, fotoBase64: string): Promise<DataValidBiometriaResponse> {
    const cpfLimpo = this.limparCpf(cpf)

    if (!this.validarCpf(cpfLimpo)) {
      throw new SerproError('CPF inválido', 'INVALID_CPF')
    }

    const response = await apiClient.post<SerproApiResponse<DataValidBiometriaResponse>>(
      '/api/serpro/datavalid/biometria',
      { cpf: cpfLimpo, fotoBase64 }
    )

    return response.data
  }

  // ============================================
  // DataValid - Validação de Documentos
  // ============================================

  /**
   * Valida dados de um documento (CPF + dados pessoais)
   * @param data Dados do documento para validação
   */
  async validarDocumento(data: DataValidDocumentoRequest): Promise<DataValidDocumentoResponse> {
    const cpfLimpo = this.limparCpf(data.cpf)

    if (!this.validarCpf(cpfLimpo)) {
      throw new SerproError('CPF inválido', 'INVALID_CPF')
    }

    const response = await apiClient.post<SerproApiResponse<DataValidDocumentoResponse>>(
      '/api/serpro/datavalid/documento',
      { ...data, cpf: cpfLimpo }
    )

    return response.data
  }

  // ============================================
  // CND - Certidão Negativa de Débitos
  // ============================================

  /**
   * Consulta certidões negativas de débitos de um CPF ou CNPJ
   * @param ni CPF ou CNPJ (com ou sem formatação)
   */
  async consultarCnd(ni: string): Promise<CndResponse> {
    const niLimpo = this.limparDocumento(ni)

    if (!this.validarCpf(niLimpo) && !this.validarCnpj(niLimpo)) {
      throw new SerproError('CPF/CNPJ inválido', 'INVALID_NI')
    }

    const response = await apiClient.post<SerproApiResponse<CndResponse>>(
      '/api/serpro/cnd',
      { ni: niLimpo }
    )

    return response.data
  }

  // ============================================
  // Helper Methods - Validação e Limpeza
  // ============================================

  /**
   * Remove formatação de CPF
   */
  private limparCpf(cpf: string): string {
    return cpf.replace(/\D/g, '')
  }

  /**
   * Remove formatação de CNPJ
   */
  private limparCnpj(cnpj: string): string {
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
  private validarCpf(cpf: string): boolean {
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
   * Valida CNPJ (algoritmo oficial)
   */
  private validarCnpj(cnpj: string): boolean {
    if (!cnpj || cnpj.length !== 14) return false

    // CNPJs inválidos conhecidos
    const invalidCnpjs = [
      '00000000000000',
      '11111111111111',
      '22222222222222',
      '33333333333333',
      '44444444444444',
      '55555555555555',
      '66666666666666',
      '77777777777777',
      '88888888888888',
      '99999999999999',
    ]

    if (invalidCnpjs.includes(cnpj)) return false

    // Validação dos dígitos verificadores
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    const digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(0))) return false

    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(1))) return false

    return true
  }

  /**
   * Formata CPF para exibição
   */
  formatarCpf(cpf: string): string {
    const cpfLimpo = this.limparCpf(cpf)
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  /**
   * Formata CNPJ para exibição
   */
  formatarCnpj(cnpj: string): string {
    const cnpjLimpo = this.limparCnpj(cnpj)
    return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
}

/**
 * Singleton instance
 */
export const serproService = new SerproService()
