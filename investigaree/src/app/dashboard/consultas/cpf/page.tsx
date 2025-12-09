'use client';

/**
 * Página de Consulta CPF - Integração Kanban
 *
 * Fluxo:
 * 1. Usuário digita CPF
 * 2. Consulta SERPRO (R$ 0,50)
 * 3. Auto-cria card no Kanban (status: 'investigando')
 * 4. Redireciona para Kanban com card destacado
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { serproService } from '@/lib/services/serpro.service';
import { criarFuncionarioDeSerpro } from '@/lib/services/dados.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, User, Calendar, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function ConsultaCpfPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [kanbanCardCreated, setKanbanCardCreated] = useState(false);

  // Formatar CPF enquanto digita
  const handleCpfChange = (value: string) => {
    // Remove tudo que não é número
    const numeros = value.replace(/\D/g, '');

    // Aplica máscara: 000.000.000-00
    let cpfFormatado = numeros;
    if (numeros.length <= 11) {
      cpfFormatado = numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    setCpf(cpfFormatado);
  };

  const handleConsultar = async () => {
    setError('');
    setResultado(null);
    setKanbanCardCreated(false);

    // Validação básica
    const cpfNumeros = cpf.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) {
      setError('CPF inválido. Digite 11 dígitos.');
      return;
    }

    setLoading(true);

    try {
      // 1. Consultar SERPRO (R$ 0,50)
      const dadosCpf = await serproService.consultarCpf(cpfNumeros);
      setResultado(dadosCpf);

      // 2. Auto-criar card no Kanban
      const tenantCode = 'CLIENTE_01'; // TODO: Pegar do contexto do usuário

      await criarFuncionarioDeSerpro(tenantCode, {
        cpf: cpfNumeros,
        tipo: 'consulta_cpf',
        metadata: {
          api: 'cpf',
          nome: dadosCpf.nome,
          nascimento: dadosCpf.nascimento,
          situacao_codigo: dadosCpf.situacao?.codigo,
          situacao_descricao: dadosCpf.situacao?.descricao,
          consultado_em: new Date().toISOString(),
        },
        custo: 0.50,
        status_investigacao: 'investigando',
      });

      setKanbanCardCreated(true);

    } catch (err: any) {
      console.error('[Consulta CPF] Erro:', err);
      setError(err.message || 'Erro ao consultar CPF. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToKanban = () => {
    const cpfNumeros = cpf.replace(/\D/g, '');
    router.push(`/dashboard/investigacoes?view=kanban&highlight=cpf-${cpfNumeros}`);
  };

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consulta CPF</h1>
        <p className="text-muted-foreground mt-2">
          Consulte dados de CPF no SERPRO e adicione automaticamente ao Kanban
        </p>
      </div>

      {/* Formulário de Consulta */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Consulta</CardTitle>
          <CardDescription>
            Digite o CPF para consultar no SERPRO. Custo: R$ 0,50 por consulta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <div className="flex gap-2">
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => handleCpfChange(e.target.value)}
                maxLength={14}
                disabled={loading}
                className="font-mono"
              />
              <Button
                onClick={handleConsultar}
                disabled={loading || cpf.length < 14}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Consultar
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Resultado da Consulta */}
      {resultado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resultado da Consulta</CardTitle>
              {kanbanCardCreated && (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Adicionado ao Kanban
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dados Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Nome</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{resultado.nome}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">CPF</Label>
                <p className="font-mono">{cpf}</p>
              </div>

              {resultado.nascimento && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Data de Nascimento</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{resultado.nascimento}</p>
                  </div>
                </div>
              )}

              {resultado.situacao && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Situação Cadastral</Label>
                  <Badge
                    variant={
                      resultado.situacao.codigo === '0' ? 'default' :
                      resultado.situacao.codigo === '2' ? 'destructive' :
                      'secondary'
                    }
                  >
                    {resultado.situacao.descricao}
                  </Badge>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                onClick={handleGoToKanban}
                size="lg"
                className="flex-1"
              >
                Ir para o Kanban
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setResultado(null);
                  setCpf('');
                  setKanbanCardCreated(false);
                }}
              >
                Nova Consulta
              </Button>
            </div>

            {/* Info */}
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Card criado no Kanban</strong> com status <Badge variant="outline">Investigando</Badge>.
                Você pode mover o card entre as colunas para gerenciar o fluxo da investigação.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Help Card */}
      {!resultado && (
        <Card>
          <CardHeader>
            <CardTitle>Como funciona?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Consulta SERPRO</p>
                <p>Realizamos uma consulta em tempo real no banco de dados do Governo Federal.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Card no Kanban</p>
                <p>Automaticamente criamos um card no Kanban na coluna &quot;Investigando&quot;.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">Gestão de Workflow</p>
                <p>Mova o card entre as colunas para acompanhar o progresso da investigação.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
