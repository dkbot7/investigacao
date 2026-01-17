'use client';

/**
 * API Keys Management Dashboard
 * Allows users to create and manage API keys for third-party integrations
 */

import { useEffect, useState } from 'react';
import { useAPIKeys } from '@/hooks/useAPIKeys';
import { apiKeysService, APIKey } from '@/lib/services/api-keys.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Key, Copy, Trash2, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

export default function APIKeysPage() {
  const { apiKeys, loading, creating, fetchAPIKeys, createAPIKey, revokeAPIKey } = useAPIKeys();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [newAPIKey, setNewAPIKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    environment: 'test' as 'production' | 'test',
    rate_limit_requests: 100,
    rate_limit_window: 60,
  });

  useEffect(() => {
    fetchAPIKeys();
  }, [fetchAPIKeys]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createAPIKey(formData);
      setNewAPIKey(result.api_key);
      setShowCreateDialog(false);
      setShowKeyDialog(true);

      // Reset form
      setFormData({
        name: '',
        environment: 'test',
        rate_limit_requests: 100,
        rate_limit_window: 60,
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleCopyKey = () => {
    if (newAPIKey) {
      navigator.clipboard.writeText(newAPIKey);
      alert('API Key copiada para área de transferência!');
    }
  };

  const handleRevokeKey = async (keyId: number, keyName: string) => {
    if (confirm(`Tem certeza que deseja revogar a API key "${keyName}"? Esta ação não pode ser desfeita.`)) {
      await revokeAPIKey(keyId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Keys</h1>
          <p className="text-gray-600">
            Gerencie suas chaves de API para integrações de terceiros
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={creating}>
          <Key className="mr-2 h-4 w-4" />
          Nova API Key
        </Button>
      </div>

      {/* Info Card */}
      <Card className="mb-8 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm text-green-900">
                <strong>Importante:</strong> As API keys são exibidas apenas uma vez durante a criação.
                Guarde-as em local seguro. Para segurança, comece sempre com ambiente de teste.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>Suas API Keys</CardTitle>
          <CardDescription>
            {apiKeys.length} {apiKeys.length === 1 ? 'chave cadastrada' : 'chaves cadastradas'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && apiKeys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Carregando...
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma API key criada</h3>
              <p className="text-gray-600 mb-4">
                Crie sua primeira API key para começar a integrar com APIs externas
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                Criar primeira API key
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => {
                const status = apiKeysService.getStatusBadge(key);
                const envColor = apiKeysService.getEnvironmentColor(key.environment);
                const envLabel = apiKeysService.getEnvironmentLabel(key.environment);
                const isActive = apiKeysService.isActive(key);

                return (
                  <div
                    key={key.id}
                    className="border rounded-lg p-4 hover:border-gray-400 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{key.name}</h3>
                          <Badge className={`${status.color} text-white`}>
                            {status.text}
                          </Badge>
                          <Badge className={`${envColor} text-white`}>
                            {envLabel}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 font-mono">
                          {key.key_prefix}{'*'.repeat(24)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          title="Estatísticas (em breve)"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        {isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeKey(key.id, key.name)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Rate Limit</p>
                        <p className="font-medium">
                          {apiKeysService.formatRateLimit(
                            key.rate_limit_requests,
                            key.rate_limit_window
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Requisições</p>
                        <p className="font-medium">{key.requests_count.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Último uso</p>
                        <p className="font-medium">
                          {apiKeysService.formatDate(key.last_used_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Criada em</p>
                        <p className="font-medium">
                          {apiKeysService.formatDate(key.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create API Key Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar nova API Key</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar uma nova chave de API
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateKey}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Nome da chave</Label>
                <Input
                  id="name"
                  placeholder="Ex: Servidor de Produção, App Mobile, etc."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="environment">Ambiente</Label>
                <Select
                  value={formData.environment}
                  onValueChange={(value: 'production' | 'test') =>
                    setFormData({ ...formData, environment: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Teste (Recomendado)</SelectItem>
                    <SelectItem value="production">Produção</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Comece com ambiente de teste para validar sua integração
                </p>
              </div>

              <div>
                <Label htmlFor="rate_limit">Limite de requisições</Label>
                <Input
                  id="rate_limit"
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.rate_limit_requests}
                  onChange={(e) =>
                    setFormData({ ...formData, rate_limit_requests: parseInt(e.target.value) })
                  }
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Requisições permitidas por minuto (padrão: 100)
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? 'Criando...' : 'Criar API Key'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Show New API Key Dialog */}
      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              API Key criada com sucesso!
            </DialogTitle>
            <DialogDescription>
              <strong className="text-red-600">Atenção:</strong> Esta é a única vez que a chave
              completa será exibida. Copie e guarde em local seguro.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label>Sua API Key:</Label>
            <div className="flex gap-2 mt-2">
              <Input value={newAPIKey || ''} readOnly className="font-mono text-sm" />
              <Button onClick={handleCopyKey} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setShowKeyDialog(false);
                setNewAPIKey(null);
              }}
            >
              Entendido, copiei a chave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

