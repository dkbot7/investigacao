"use client";

/**
 * Página de Configuração de Credenciais SERPRO
 *
 * Permite que admins configurem credenciais SERPRO por tenant (BYO System)
 * Agent 3 - Frontend Engineer
 * Data: 2025-12-08
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/hooks/useTenant';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Shield,
  Check,
  X,
  Plus,
  Trash2,
  Key,
  AlertTriangle,
  RefreshCw,
  Info,
  Lock,
  Unlock,
} from 'lucide-react';
import {
  serproCredentialsService,
  SERPRO_API_LABELS,
  SERPRO_API_DESCRIPTIONS,
  type SerproMode,
  type SerproApiName,
  type SerproCredential,
  type SerproEnvironment,
} from '@/lib/services/serpro-credentials.service';

// Admin emails (same as layout.tsx)
const ADMIN_EMAILS = ['dkbotdani@gmail.com'];

export default function SerproCredentialsPage() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const router = useRouter();

  // State
  const [mode, setMode] = useState<SerproMode>('managed');
  const [notes, setNotes] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<SerproCredential[]>([]);
  const [availableApis, setAvailableApis] = useState<SerproApiName[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState<SerproApiName | null>(null);
  const [deleting, setDeleting] = useState<SerproApiName | null>(null);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApi, setEditingApi] = useState<SerproApiName | null>(null);
  const [formData, setFormData] = useState({
    consumer_key: '',
    consumer_secret: '',
    environment: 'production' as SerproEnvironment,
  });

  // Check if user is admin
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      toast.error('Acesso negado', {
        description: 'Apenas administradores podem acessar esta página',
      });
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  // Load credentials
  useEffect(() => {
    if (currentTenant && isAdmin) {
      loadCredentials();
    }
  }, [currentTenant, isAdmin]);

  const loadCredentials = async () => {
    if (!currentTenant) return;

    setLoading(true);
    try {
      const response = await serproCredentialsService.listCredentials(currentTenant.id);
      setMode(response.mode);
      setNotes(response.notes);
      setCredentials(response.credentials);
      setAvailableApis(response.apis_available);
    } catch (error: any) {
      console.error('Error loading credentials:', error);
      toast.error('Erro ao carregar credenciais', {
        description: error.message || 'Tente novamente',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = async () => {
    if (!currentTenant) return;

    const newMode: SerproMode = mode === 'managed' ? 'byo' : 'managed';

    // Confirm if changing to BYO without credentials
    if (newMode === 'byo' && credentials.length === 0) {
      if (
        !window.confirm(
          'Você está alternando para modo BYO (Bring Your Own) mas não possui credenciais configuradas. As consultas SERPRO não funcionarão até que você adicione credenciais. Deseja continuar?'
        )
      ) {
        return;
      }
    }

    // Confirm if changing to managed
    if (newMode === 'managed') {
      if (
        !window.confirm(
          'Você está alternando para modo GERENCIADO. As credenciais do Investigaree serão usadas (se disponíveis). Suas credenciais BYO serão mantidas mas não serão utilizadas. Deseja continuar?'
        )
      ) {
        return;
      }
    }

    setSaving(true);
    try {
      await serproCredentialsService.updateMode(currentTenant.id, newMode);
      setMode(newMode);
      toast.success('Modo alterado com sucesso', {
        description: `Modo alterado para: ${newMode === 'managed' ? 'Gerenciado' : 'BYO (Suas Credenciais)'}`,
      });
    } catch (error: any) {
      console.error('Error updating mode:', error);
      toast.error('Erro ao alterar modo', {
        description: error.message || 'Tente novamente',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddCredential = (apiName: SerproApiName) => {
    const existing = credentials.find((c) => c.api_name === apiName);
    if (existing) {
      // Edit existing
      setEditingApi(apiName);
      setFormData({
        consumer_key: existing.consumer_key,
        consumer_secret: '', // Never show existing secret
        environment: existing.environment,
      });
    } else {
      // Add new
      setEditingApi(apiName);
      setFormData({
        consumer_key: '',
        consumer_secret: '',
        environment: 'production',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveCredential = async () => {
    if (!currentTenant || !editingApi) return;

    if (!formData.consumer_key || !formData.consumer_secret) {
      toast.error('Campos obrigatórios', {
        description: 'Preencha Consumer Key e Consumer Secret',
      });
      return;
    }

    setSaving(true);
    try {
      await serproCredentialsService.saveCredential(currentTenant.id, {
        api_name: editingApi,
        consumer_key: formData.consumer_key,
        consumer_secret: formData.consumer_secret,
        environment: formData.environment,
      });

      toast.success('Credencial salva com sucesso', {
        description: `API: ${SERPRO_API_LABELS[editingApi]}`,
      });

      setIsDialogOpen(false);
      setEditingApi(null);
      setFormData({ consumer_key: '', consumer_secret: '', environment: 'production' });
      loadCredentials();
    } catch (error: any) {
      console.error('Error saving credential:', error);
      toast.error('Erro ao salvar credencial', {
        description: error.message || 'Tente novamente',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleValidateCredential = async (apiName: SerproApiName) => {
    if (!currentTenant) return;

    setValidating(apiName);
    try {
      const response = await serproCredentialsService.validateCredential(currentTenant.id, apiName);

      if (response.success) {
        toast.success('Credenciais válidas!', {
          description: `API ${SERPRO_API_LABELS[apiName]} validada com sucesso`,
        });
        loadCredentials(); // Refresh to show last_validated_at
      } else {
        toast.error('Credenciais inválidas', {
          description: response.details || response.error || 'Verifique suas credenciais',
        });
        loadCredentials(); // Refresh to show validation_error
      }
    } catch (error: any) {
      console.error('Error validating credential:', error);
      toast.error('Erro ao validar credencial', {
        description: error.message || 'Tente novamente',
      });
    } finally {
      setValidating(null);
    }
  };

  const handleDeleteCredential = async (apiName: SerproApiName) => {
    if (!currentTenant) return;

    if (!window.confirm(`Tem certeza que deseja remover as credenciais da API ${SERPRO_API_LABELS[apiName]}?`)) {
      return;
    }

    setDeleting(apiName);
    try {
      await serproCredentialsService.deleteCredential(currentTenant.id, apiName);
      toast.success('Credencial removida', {
        description: `API: ${SERPRO_API_LABELS[apiName]}`,
      });
      loadCredentials();
    } catch (error: any) {
      console.error('Error deleting credential:', error);
      toast.error('Erro ao remover credencial', {
        description: error.message || 'Tente novamente',
      });
    } finally {
      setDeleting(null);
    }
  };

  if (!isAdmin) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Credenciais SERPRO
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Configure as credenciais SERPRO para o tenant: <strong>{currentTenant?.name}</strong>
        </p>
      </div>

      {/* Mode Selection Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Key className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Modo de Operação
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Escolha como as credenciais SERPRO serão utilizadas para este tenant.
            </p>

            {/* Mode Info */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${mode === 'managed' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-slate-300 dark:border-navy-700 bg-slate-50 dark:bg-navy-800'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">Modo Gerenciado</span>
                  {mode === 'managed' && <Badge variant="default">Ativo</Badge>}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Investigaree fornece e gerencia as credenciais SERPRO (SaaS tradicional).
                  Custos de consulta incluídos no plano do cliente.
                </p>
              </div>

              <div className={`p-4 rounded-lg border-2 ${mode === 'byo' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-slate-300 dark:border-navy-700 bg-slate-50 dark:bg-navy-800'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Unlock className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">Modo BYO (Bring Your Own)</span>
                  {mode === 'byo' && <Badge variant="default">Ativo</Badge>}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Cliente fornece suas próprias credenciais SERPRO (White Label).
                  Cliente paga diretamente ao SERPRO pelas consultas.
                </p>
              </div>
            </div>

            {notes && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">{notes}</p>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleModeToggle}
            disabled={saving}
            variant={mode === 'managed' ? 'default' : 'outline'}
            className="ml-6"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Alterando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Alternar Modo
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Credentials Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Credenciais Configuradas
          </h2>
          {mode === 'managed' && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500">
              <AlertTriangle className="w-4 h-4" />
              <span>Modo gerenciado - credenciais abaixo não são utilizadas</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableApis.map((apiName) => {
            const credential = credentials.find((c) => c.api_name === apiName);
            const hasError = credential?.validation_error;
            const isValidated = credential?.last_validated_at && !hasError;

            return (
              <Card
                key={apiName}
                className={`p-4 ${mode === 'byo' && !credential ? 'border-2 border-dashed border-slate-300 dark:border-navy-700' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {SERPRO_API_LABELS[apiName]}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {SERPRO_API_DESCRIPTIONS[apiName]}
                    </p>
                  </div>
                  {credential && (
                    <Badge variant={isValidated ? 'default' : hasError ? 'destructive' : 'secondary'} className="ml-2">
                      {isValidated ? <Check className="w-3 h-3 mr-1" /> : hasError ? <X className="w-3 h-3 mr-1" /> : null}
                      {isValidated ? 'OK' : hasError ? 'Erro' : 'Não testada'}
                    </Badge>
                  )}
                </div>

                {credential ? (
                  <div className="space-y-2">
                    <div className="text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Consumer Key:</span>
                      <p className="font-mono text-slate-900 dark:text-white truncate">
                        {credential.consumer_key}
                      </p>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Ambiente:</span>
                      <Badge variant="outline" className="ml-2">
                        {credential.environment === 'production' ? 'Produção' : 'Trial'}
                      </Badge>
                    </div>
                    {hasError && (
                      <div className="text-xs text-red-500 dark:text-red-400 mt-2">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        {credential.validation_error}
                      </div>
                    )}
                    {isValidated && (
                      <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                        <Check className="w-3 h-3 inline mr-1" />
                        Validada em {new Date(credential.last_validated_at!).toLocaleString('pt-BR')}
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddCredential(apiName)}
                        disabled={saving}
                        className="flex-1"
                      >
                        <Key className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleValidateCredential(apiName)}
                        disabled={validating === apiName}
                        className="flex-1"
                      >
                        {validating === apiName ? (
                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Shield className="w-3 h-3 mr-1" />
                        )}
                        Validar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCredential(apiName)}
                        disabled={deleting === apiName}
                      >
                        {deleting === apiName ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddCredential(apiName)}
                    disabled={saving}
                    className="w-full"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar Credencial
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {credentials.find((c) => c.api_name === editingApi) ? 'Editar' : 'Adicionar'} Credencial
            </DialogTitle>
            <DialogDescription>
              API: {editingApi && SERPRO_API_LABELS[editingApi]}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="consumer_key">Consumer Key</Label>
              <Input
                id="consumer_key"
                value={formData.consumer_key}
                onChange={(e) => setFormData({ ...formData, consumer_key: e.target.value })}
                placeholder="Digite o Consumer Key"
                className="font-mono"
              />
            </div>

            <div>
              <Label htmlFor="consumer_secret">Consumer Secret</Label>
              <Input
                id="consumer_secret"
                type="password"
                value={formData.consumer_secret}
                onChange={(e) => setFormData({ ...formData, consumer_secret: e.target.value })}
                placeholder="Digite o Consumer Secret"
                className="font-mono"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Será criptografado e nunca será exibido novamente.
              </p>
            </div>

            <div>
              <Label htmlFor="environment">Ambiente</Label>
              <select
                id="environment"
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value as SerproEnvironment })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-navy-700 rounded-lg bg-white dark:bg-navy-800 text-slate-900 dark:text-white"
              >
                <option value="production">Produção</option>
                <option value="trial">Trial</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCredential} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
