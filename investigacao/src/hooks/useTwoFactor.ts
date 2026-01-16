/**
 * React hooks for Two-Factor Authentication
 */

import { useState, useCallback, useEffect } from 'react';
import { twoFactorService, TwoFactorStatus } from '@/lib/services/two-factor.service';
import { useToast } from '@/hooks/use-toast';

export function useTwoFactor() {
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const { toast } = useToast();

  /**
   * Fetch 2FA status
   */
  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const result = await twoFactorService.getStatus();
      setStatus(result);
      return result;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar status 2FA',
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Setup 2FA (generate secret and QR code)
   */
  const setup = useCallback(async () => {
    setLoading(true);
    try {
      const result = await twoFactorService.setup();
      setSecret(result.secret);

      // Generate QR code image
      const qrCode = await twoFactorService.generateQRCode(result.qr_code_uri);
      setQrCodeDataUrl(qrCode);

      toast({
        title: 'Setup iniciado',
        description: result.message,
      });

      return result;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao iniciar setup 2FA',
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Verify code and enable 2FA
   */
  const verify = useCallback(
    async (code: string) => {
      if (!twoFactorService.isValidTOTPFormat(code)) {
        toast({
          variant: 'destructive',
          title: 'Código inválido',
          description: 'O código deve ter 6 dígitos',
        });
        return;
      }

      setLoading(true);
      try {
        const result = await twoFactorService.verify(code);
        setRecoveryCodes(result.recovery_codes);

        toast({
          title: '2FA ativado!',
          description: result.message,
        });

        // Refresh status
        await fetchStatus();

        return result;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao verificar código',
          description: error.message,
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast, fetchStatus]
  );

  /**
   * Disable 2FA
   */
  const disable = useCallback(
    async (code: string) => {
      setLoading(true);
      try {
        const result = await twoFactorService.disable(code);

        toast({
          title: '2FA desativado',
          description: result.message,
        });

        // Clear state and refresh
        setQrCodeDataUrl(null);
        setSecret(null);
        setRecoveryCodes([]);
        await fetchStatus();

        return result;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao desativar 2FA',
          description: error.message,
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast, fetchStatus]
  );

  /**
   * Regenerate recovery codes
   */
  const regenerateRecoveryCodes = useCallback(
    async (code: string) => {
      if (!twoFactorService.isValidTOTPFormat(code)) {
        toast({
          variant: 'destructive',
          title: 'Código inválido',
          description: 'O código deve ter 6 dígitos',
        });
        return;
      }

      setLoading(true);
      try {
        const result = await twoFactorService.regenerateRecoveryCodes(code);
        setRecoveryCodes(result.recovery_codes);

        toast({
          title: 'Novos códigos gerados',
          description: result.message,
        });

        return result;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao regenerar códigos',
          description: error.message,
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Download recovery codes
   */
  const downloadRecoveryCodes = useCallback(() => {
    if (recoveryCodes.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Nenhum código disponível',
        description: 'Ative o 2FA primeiro para gerar códigos',
      });
      return;
    }

    twoFactorService.downloadRecoveryCodes(recoveryCodes);
    toast({
      title: 'Download iniciado',
      description: 'Códigos salvos em arquivo',
    });
  }, [recoveryCodes, toast]);

  /**
   * Copy recovery codes to clipboard
   */
  const copyRecoveryCodes = useCallback(async () => {
    if (recoveryCodes.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Nenhum código disponível',
      });
      return;
    }

    try {
      await twoFactorService.copyRecoveryCodes(recoveryCodes);
      toast({
        title: 'Códigos copiados',
        description: 'Códigos copiados para área de transferência',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar os códigos',
      });
    }
  }, [recoveryCodes, toast]);

  return {
    status,
    loading,
    qrCodeDataUrl,
    secret,
    recoveryCodes,
    fetchStatus,
    setup,
    verify,
    disable,
    regenerateRecoveryCodes,
    downloadRecoveryCodes,
    copyRecoveryCodes,
  };
}
