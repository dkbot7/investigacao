'use client';

/**
 * Security Settings Dashboard
 * Manage 2FA and other security settings
 */

import { useEffect, useState } from 'react';
import { useTwoFactor } from '@/hooks/useTwoFactor';
import { twoFactorService } from '@/lib/services/two-factor.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  Smartphone,
  RefreshCw,
} from 'lucide-react';

export default function SecurityPage() {
  const {
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
  } = useTwoFactor();

  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [regenerateCode, setRegenerateCode] = useState('');

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSetup = async () => {
    try {
      await setup();
      setShowSetupDialog(true);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verify(verifyCode);
      setShowSetupDialog(false);
      setShowRecoveryDialog(true);
      setVerifyCode('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await disable(disableCode);
      setShowDisableDialog(false);
      setDisableCode('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleRegenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await regenerateRecoveryCodes(regenerateCode);
      setShowRegenerateDialog(false);
      setShowRecoveryDialog(true);
      setRegenerateCode('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const statusBadge = status ? twoFactorService.getStatusBadge(status) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Segurança</h1>
        <p className="text-gray-600">
          Configure autenticação de dois fatores e outras opções de segurança
        </p>
      </div>

      {/* 2FA Status Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Autenticação de Dois Fatores (2FA)
              </CardTitle>
              <CardDescription className="mt-2">
                Adicione uma camada extra de segurança à sua conta
              </CardDescription>
            </div>
            {statusBadge && (
              <Badge className={`${statusBadge.color} text-white`}>{statusBadge.text}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading && !status ? (
            <div className="text-center py-4 text-gray-500">Carregando...</div>
          ) : (
            <>
              {/* Status Info */}
              {status?.enabled && status.verified ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900">2FA está ativado</p>
                      <p className="text-sm text-green-700 mt-1">
                        Sua conta está protegida com autenticação de dois fatores
                      </p>
                      {status.last_used_at && (
                        <p className="text-xs text-green-600 mt-2">
                          Último uso: {twoFactorService.formatDate(status.last_used_at)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowRegenerateDialog(true)}
                      disabled={loading}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerar Códigos de Recuperação
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDisableDialog(true)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      Desativar 2FA
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-900">2FA não está ativado</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Recomendamos fortemente ativar a autenticação de dois fatores para
                        proteger sua conta
                      </p>
                    </div>
                  </div>

                  <Button onClick={handleSetup} disabled={loading}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Ativar 2FA
                  </Button>
                </div>
              )}

              {/* How it works */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold mb-3">Como funciona?</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-3">
                    <Smartphone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <p>
                      Instale um app autenticador como Google Authenticator, Authy ou Microsoft
                      Authenticator no seu smartphone
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Key className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <p>
                      Configure o 2FA escaneando o QR code ou inserindo a chave manualmente no
                      app
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <p>
                      A partir disso, você precisará do código gerado pelo app (além da senha)
                      para fazer login
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Autenticação de Dois Fatores</DialogTitle>
            <DialogDescription>
              Escaneie o QR code com seu app autenticador
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* QR Code */}
            {qrCodeDataUrl && (
              <div className="flex justify-center">
                <img src={qrCodeDataUrl} alt="QR Code 2FA" className="w-64 h-64" />
              </div>
            )}

            {/* Manual Entry */}
            {secret && (
              <div>
                <Label className="text-xs text-gray-600">
                  Ou insira manualmente esta chave:
                </Label>
                <div className="mt-1 p-3 bg-gray-100 rounded font-mono text-sm break-all">
                  {twoFactorService.formatSecretForDisplay(secret)}
                </div>
              </div>
            )}

            {/* Verify Code */}
            <form onSubmit={handleVerify} className="space-y-3">
              <div>
                <Label htmlFor="verify-code">Código de Verificação (6 dígitos)</Label>
                <Input
                  id="verify-code"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-widest font-mono"
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Insira o código de 6 dígitos gerado pelo app
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSetupDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || verifyCode.length !== 6}>
                  {loading ? 'Verificando...' : 'Verificar e Ativar'}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recovery Codes Dialog */}
      <Dialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Códigos de Recuperação
            </DialogTitle>
            <DialogDescription>
              <strong className="text-red-600">Importante:</strong> Guarde estes códigos em local
              seguro. Use-os se perder acesso ao app autenticador.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {recoveryCodes.map((code, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-100 rounded font-mono text-sm text-center"
                >
                  {code}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadRecoveryCodes} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Baixar
              </Button>
              <Button variant="outline" onClick={copyRecoveryCodes} className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                Copiar
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowRecoveryDialog(false)}>
              Guardei os códigos com segurança
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desativar Autenticação de Dois Fatores</DialogTitle>
            <DialogDescription>
              Digite um código TOTP ou de recuperação para confirmar
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDisable} className="py-4 space-y-4">
            <div>
              <Label htmlFor="disable-code">Código de Verificação</Label>
              <Input
                id="disable-code"
                type="text"
                placeholder="Código TOTP (6 dígitos) ou de recuperação"
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value.toUpperCase())}
                className="font-mono"
                required
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDisableDialog(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="destructive" disabled={loading}>
                {loading ? 'Desativando...' : 'Desativar 2FA'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Regenerate Recovery Codes Dialog */}
      <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerar Códigos de Recuperação</DialogTitle>
            <DialogDescription>
              Os códigos antigos deixarão de funcionar. Digite o código TOTP para continuar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegenerate} className="py-4 space-y-4">
            <div>
              <Label htmlFor="regenerate-code">Código TOTP (6 dígitos)</Label>
              <Input
                id="regenerate-code"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={regenerateCode}
                onChange={(e) => setRegenerateCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest font-mono"
                required
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRegenerateDialog(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || regenerateCode.length !== 6}>
                {loading ? 'Gerando...' : 'Gerar Novos Códigos'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
