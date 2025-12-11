'use client';

/**
 * Página de Consulta CNPJ - Integração Kanban
 *
 * Fluxo:
 * 1. Usuário digita CNPJ
 * 2. Escolhe tipo de consulta (Básica, QSA, ou Completa)
 * 3. Consulta SERPRO (R$ 0,50 - R$ 1,50)
 * 4. Auto-cria card no Kanban (status: 'investigando')
 * 5. Redireciona para Kanban com card destacado
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2,
  Search,
  Building2,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Users,
} from 'lucide-react';

type TipoConsulta = 'basica' | 'qsa' | 'completa';

export default function ConsultaCnpjPage() {
  const router = useRouter();
  const [cnpj, setCnpj] = useState('');
  const [tipoConsulta, setTipoConsulta] = useState<TipoConsulta>('basica');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [kanbanCardCreated, setKanbanCardCreated] = useState(false);

  // Formatar CNPJ enquanto digita
  const handleCnpjChange = (value: string) => {
    // Remove tudo que não é número
    const numeros = value.replace(/\D/g, '');

    // Aplica máscara: 00.000.000/0000-00
    let cnpjFormatado = numeros;
    if (numeros.length <= 14) {
      cnpjFormatado = numeros
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }

    setCnpj(cnpjFormatado);
  };

  const getCusto = (tipo: TipoConsulta): number => {
    switch (tipo) {
      case 'basica':
        return 0.50;
      case 'qsa':
        return 1.00;
      case 'completa':
        return 1.50;
    }
  };

  const handleConsultar = async () => {
    setError('');
    setResultado(null);
    setKanbanCardCreated(false);

    // Validação básica
    const cnpjNumeros = cnpj.replace(/\D/g, '');
    if (cnpjNumeros.length !== 14) {
      setError('CNPJ inválido. Digite 14 dígitos.');
      return;
    }

    setLoading(true);

    try {
      // 1. Consultar SERPRO baseado no tipo
      let dadosCnpj: any;
      let metadataKey: string;

      switch (tipoConsulta) {
        case 'basica':
          dadosCnpj = await serproService.consultarCnpjBasica(cnpjNumeros);
          metadataKey = 'cnpj_basica';
          break;
        case 'qsa':
          dadosCnpj = await serproService.consultarCnpjQsa(cnpjNumeros);
          metadataKey = 'cnpj_qsa';
          break;
        case 'completa':
          dadosCnpj = await serproService.consultarCnpjEmpresa(cnpjNumeros);
          metadataKey = 'cnpj_completa';
          break;
      }

      setResultado(dadosCnpj);

      // 2. Auto-criar card no Kanban
      const tenantCode = 'CLIENTE_01'; // TODO: Pegar do contexto do usuário

      await criarFuncionarioDeSerpro(tenantCode, {
        cnpj: cnpjNumeros,
        tipo: `consulta_${metadataKey}`,
        metadata: {
          api: metadataKey,
          razao_social: dadosCnpj.razao_social || dadosCnpj.nome_empresarial,
          nome_fantasia: dadosCnpj.nome_fantasia,
          situacao_cadastral: dadosCnpj.situacao_cadastral,
          tipo_consulta: tipoConsulta,
          consultado_em: new Date().toISOString(),
          qsa_count: dadosCnpj.qsa?.length || 0,
        },
        custo: getCusto(tipoConsulta),
        status_investigacao: 'investigando',
      });

      setKanbanCardCreated(true);

    } catch (err: any) {
      console.error('[Consulta CNPJ] Erro:', err);
      setError(err.message || 'Erro ao consultar CNPJ. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToKanban = () => {
    const cnpjNumeros = cnpj.replace(/\D/g, '');
    router.push(`/dashboard/investigacoes?view=kanban&highlight=cnpj-${cnpjNumeros}`);
  };

  return (
    <div className="container max-w-6xl py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Consulta CNPJ</h1>
        <p className="text-muted-foreground mt-2">
          Consulte dados de CNPJ no SERPRO e adicione automaticamente ao Kanban
        </p>
      </div>

      {/* Formulário de Consulta */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Consulta</CardTitle>
          <CardDescription>
            Escolha o tipo de consulta e digite o CNPJ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Tipo de Consulta */}
          <div className="space-y-3 sm:space-y-3">
            <Label>Tipo de Consulta</Label>
            <RadioGroup
              value={tipoConsulta}
              onValueChange={(value) => setTipoConsulta(value as TipoConsulta)}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4"
            >
              <Label
                htmlFor="basica"
                className={`flex flex-col items-start gap-2 rounded-lg border-2 p-3 sm:p-4 cursor-pointer transition-colors ${
                  tipoConsulta === 'basica' ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <RadioGroupItem value="basica" id="basica" />
                  <div className="flex-1">
                    <div className="font-semibold">Básica</div>
                    <div className="text-xs text-muted-foreground">Dados cadastrais</div>
                  </div>
                  <Badge variant="secondary" className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">R$ 0,50</Badge>
                </div>
              </Label>

              <Label
                htmlFor="qsa"
                className={`flex flex-col items-start gap-2 rounded-lg border-2 p-3 sm:p-4 cursor-pointer transition-colors ${
                  tipoConsulta === 'qsa' ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <RadioGroupItem value="qsa" id="qsa" />
                  <div className="flex-1">
                    <div className="font-semibold">QSA</div>
                    <div className="text-xs text-muted-foreground">Quadro Societário</div>
                  </div>
                  <Badge variant="secondary" className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">R$ 1,00</Badge>
                </div>
              </Label>

              <Label
                htmlFor="completa"
                className={`flex flex-col items-start gap-2 rounded-lg border-2 p-3 sm:p-4 cursor-pointer transition-colors ${
                  tipoConsulta === 'completa' ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <RadioGroupItem value="completa" id="completa" />
                  <div className="flex-1">
                    <div className="font-semibold">Completa</div>
                    <div className="text-xs text-muted-foreground">Básica + QSA</div>
                  </div>
                  <Badge variant="secondary" className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">R$ 1,50</Badge>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Campo CNPJ */}
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={cnpj}
                onChange={(e) => handleCnpjChange(e.target.value)}
                maxLength={18}
                disabled={loading}
                className="font-mono text-sm sm:text-base pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-2.5"
              />
              <Button
                onClick={handleConsultar}
                disabled={loading || cnpj.length < 18}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Consultar ({getCusto(tipoConsulta).toFixed(2)})
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 sm:gap-0">
              <CardTitle>Resultado da Consulta</CardTitle>
              {kanbanCardCreated && (
                <Badge variant="default" className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">
                  <CheckCircle className="h-3 w-3" />
                  Adicionado ao Kanban
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dados" className="w-full">
              <TabsList>
                <TabsTrigger value="dados">Dados Cadastrais</TabsTrigger>
                {(tipoConsulta === 'qsa' || tipoConsulta === 'completa') && resultado.qsa && (
                  <TabsTrigger value="qsa">
                    Sócios ({resultado.qsa.length})
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="dados" className="space-y-4 sm:space-y-6 mt-6">
                {/* Dados Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Razão Social</Label>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {resultado.razao_social || resultado.nome_empresarial}
                      </p>
                    </div>
                  </div>

                  {resultado.nome_fantasia && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Nome Fantasia</Label>
                      <p>{resultado.nome_fantasia}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">CNPJ</Label>
                    <p className="font-mono">{cnpj}</p>
                  </div>

                  {resultado.situacao_cadastral && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Situação Cadastral</Label>
                      <Badge
                        variant={
                          resultado.situacao_cadastral === 'ATIVA' ? 'default' :
                          resultado.situacao_cadastral === 'BAIXADA' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {resultado.situacao_cadastral}
                      </Badge>
                    </div>
                  )}

                  {resultado.data_situacao_cadastral && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Data da Situação</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p>{resultado.data_situacao_cadastral}</p>
                      </div>
                    </div>
                  )}

                  {resultado.endereco && (
                    <div className="space-y-1 md:col-span-2">
                      <Label className="text-xs text-muted-foreground">Endereço</Label>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm">
                          {resultado.endereco.logradouro}, {resultado.endereco.numero}
                          {resultado.endereco.complemento && ` - ${resultado.endereco.complemento}`}
                          <br />
                          {resultado.endereco.bairro} - {resultado.endereco.municipio}/{resultado.endereco.uf}
                          <br />
                          CEP: {resultado.endereco.cep}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {(tipoConsulta === 'qsa' || tipoConsulta === 'completa') && resultado.qsa && (
                <TabsContent value="qsa" className="mt-6">
                  <div className="space-y-3">
                    {resultado.qsa.map((socio: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{socio.nome}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Qualificação:</span>{' '}
                            {socio.qualificacao}
                          </div>
                          {socio.cpf_cnpj && (
                            <div>
                              <span className="text-muted-foreground">CPF/CNPJ:</span>{' '}
                              <span className="font-mono">{socio.cpf_cnpj}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 pt-6 mt-6 border-t">
              <Button
                onClick={handleGoToKanban}
                size="lg"
                className="flex-1"
              >
                Ir para o Kanban
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setResultado(null);
                  setCnpj('');
                  setKanbanCardCreated(false);
                }}
              >
                Nova Consulta
              </Button>
            </div>

            {/* Info */}
            <Alert className="mt-4">
              <AlertDescription className="text-sm">
                <strong>Card criado no Kanban</strong> com status <Badge variant="outline">Investigando</Badge>.
                Você pode mover o card entre as colunas para gerenciar o fluxo da investigação.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
