/**
 * Two-Factor Authentication Service
 * Client-side service for managing 2FA
 */

import { fetchAPI } from '@/lib/api';
import QRCode from 'qrcode';

export interface TwoFactorStatus {
  success: boolean;
  enabled: boolean;
  verified: boolean;
  created_at?: string;
  verified_at?: string | null;
  last_used_at?: string | null;
}

export interface SetupResponse {
  success: boolean;
  secret: string;
  qr_code_uri: string;
  manual_entry_key: string;
  message: string;
}

export interface VerifyResponse {
  success: boolean;
  recovery_codes: string[];
  message: string;
}

export interface DisableResponse {
  success: boolean;
  message: string;
}

export interface RegenerateRecoveryResponse {
  success: boolean;
  recovery_codes: string[];
  message: string;
}

export class TwoFactorService {
  /**
   * Get current 2FA status
   */
  async getStatus(): Promise<TwoFactorStatus> {
    return fetchAPI('/api/2fa/status');
  }

  /**
   * Setup 2FA (generate secret and QR code)
   */
  async setup(): Promise<SetupResponse> {
    return fetchAPI('/api/2fa/setup', {
      method: 'POST',
    });
  }

  /**
   * Verify TOTP code and enable 2FA
   */
  async verify(code: string): Promise<VerifyResponse> {
    return fetchAPI('/api/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  /**
   * Disable 2FA
   */
  async disable(code: string): Promise<DisableResponse> {
    return fetchAPI('/api/2fa/disable', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  /**
   * Regenerate recovery codes
   */
  async regenerateRecoveryCodes(code: string): Promise<RegenerateRecoveryResponse> {
    return fetchAPI('/api/2fa/regenerate-recovery', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  /**
   * Generate QR code as data URL
   */
  async generateQRCode(otpauthUri: string): Promise<string> {
    try {
      return await QRCode.toDataURL(otpauthUri, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Falha ao gerar QR code');
    }
  }

  /**
   * Format secret for manual entry (groups of 4)
   */
  formatSecretForDisplay(secret: string): string {
    return secret.match(/.{1,4}/g)?.join(' ') || secret;
  }

  /**
   * Download recovery codes as text file
   */
  downloadRecoveryCodes(codes: string[], filename = 'investigaree-recovery-codes.txt'): void {
    const content = `Investigaree - Códigos de Recuperação 2FA
Gerado em: ${new Date().toLocaleString('pt-BR')}

IMPORTANTE: Guarde estes códigos em local seguro!
Cada código pode ser usado apenas uma vez.

${codes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

Instruções:
- Use estes códigos se perder acesso ao seu app autenticador
- Cada código funciona apenas uma vez
- Você pode gerar novos códigos a qualquer momento
- Mantenha estes códigos em local seguro e privado
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Copy recovery codes to clipboard
   */
  async copyRecoveryCodes(codes: string[]): Promise<void> {
    const text = codes.join('\n');
    await navigator.clipboard.writeText(text);
  }

  /**
   * Validate TOTP code format (6 digits)
   */
  isValidTOTPFormat(code: string): boolean {
    return /^\d{6}$/.test(code);
  }

  /**
   * Validate recovery code format (8 hex chars)
   */
  isValidRecoveryCodeFormat(code: string): boolean {
    return /^[0-9A-F]{8}$/i.test(code);
  }

  /**
   * Get status badge
   */
  getStatusBadge(status: TwoFactorStatus): { text: string; color: string } {
    if (status.enabled && status.verified) {
      return { text: 'Ativado', color: 'bg-green-500' };
    }
    if (status.enabled && !status.verified) {
      return { text: 'Pendente', color: 'bg-yellow-500' };
    }
    return { text: 'Desativado', color: 'bg-gray-500' };
  }

  /**
   * Format date
   */
  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  }
}

export const twoFactorService = new TwoFactorService();
