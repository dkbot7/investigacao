# 📗 OPERATIONS PLAYBOOK — investigaree

**Versão**: 1.0
**Última atualização**: 21/11/2025
**Documento**: Standard Operating Procedures & Quality Assurance

---

## 🎯 FILOSOFIA OPERACIONAL

### Princípios Core

1. **Qualidade > Velocidade** (mas ambos importam)
2. **Processos replicáveis** (qualquer analyst pode executar)
3. **Checklists obrigatórios** (zero esquecimentos)
4. **Documentação em tempo real** (não depois)
5. **Ética inegociável** (LGPD sempre)

### Service Level Agreements (SLA)

| Plano | Tempo de Entrega | Primeira Resposta | Revisão |
|-------|------------------|-------------------|---------|
| **Standard** | Até 48h | Em até 4h | 1 revisão grátis |
| **Express** | Até 6h | Em até 30min | 2 revisões grátis |

**Penalidades por atraso**:
- Até 2h de atraso: Aviso interno
- 2-6h de atraso: Desconto 10%
- 6-12h de atraso: Desconto 25%
- >12h de atraso: Reembolso total

---

## 📋 SOP 001: PROCESSAMENTO DE NOVO RELATÓRIO

### Fase 1: Recebimento (Automático)

**Trigger**: Cliente completa pagamento no Stripe

**Sistema executa**:
1. ✅ Webhook recebe evento `checkout.session.completed`
2. ✅ Cria registro em `reports` (status: `pending`)
3. ✅ Cria registro em `payments` (status: `paid`)
4. ✅ Envia email confirmação para cliente
5. ✅ Notifica equipe no Slack/Discord

**Output**: Relatório criado com ID único

**Tempo**: <30 segundos (automático)

---

### Fase 2: Triagem (Manual)

**Responsável**: Analyst on-duty

**Ações**:
1. Abrir dashboard admin
2. Ver novo relatório na fila
3. Verificar dados fornecidos pelo cliente:
   - ✅ Nome completo do alvo
   - ✅ CPF (se fornecido)
   - ✅ Email (se fornecido)
   - ✅ Serviços solicitados
   - ✅ Urgência (Standard/Express)
4. Classificar prioridade:
   - 🔴 **P0**: Express + VIP
   - 🟡 **P1**: Express
   - 🟢 **P2**: Standard
5. Atribuir analista disponível
6. Atualizar status: `pending` → `processing`

**Checklist de Triagem**:
- [ ] Dados suficientes para investigação?
- [ ] CPF válido (se fornecido)?
- [ ] Email válido (se fornecido)?
- [ ] Solicitação está dentro do escopo legal?
- [ ] Cliente já fez relatórios antes? (verificar histórico)

**Se dados insuficientes**:
- Contatar cliente via email/WhatsApp
- Solicitar informações adicionais
- Pausar timer do SLA até resposta

**Tempo**: 5-10 minutos

---

### Fase 3: Investigação (Semi-automático)

**Responsável**: Analyst + Sistema

#### 3.1 Execução Automática (Worker)

**Sistema executa** (paralelo):

```
┌─────────────────────────────────────────────────────┐
│  MÓDULO 1: Identidade & Documentos                  │
│  ├── API Brasil: Validar CPF                        │
│  ├── Receita Federal: Situação cadastral            │
│  └── Dados públicos: RG, CNH (se disponível)        │
├─────────────────────────────────────────────────────┤
│  MÓDULO 2: Histórico Criminal                       │
│  ├── Tribunais de Justiça (26 estados + DF)         │
│  ├── STJ: Processos superiores                      │
│  └── Diários oficiais: Citações                     │
├─────────────────────────────────────────────────────┤
│  MÓDULO 3: Presença Digital                         │
│  ├── Google Search: Nome + variações                │
│  ├── Redes sociais: LinkedIn, Instagram, Facebook   │
│  ├── Blogs, fóruns, comentários                     │
│  └── Análise de sentimento (IA)                     │
├─────────────────────────────────────────────────────┤
│  MÓDULO 4: Vínculos Societários                     │
│  ├── Receita Federal: CNPJ associados               │
│  ├── Juntas Comerciais: Contratos sociais           │
│  └── Socios ocultos (cruzamento)                    │
├─────────────────────────────────────────────────────┤
│  MÓDULO 5: Data Breach                              │
│  ├── DeHashed: Credenciais vazadas                  │
│  ├── HaveIBeenPwned: Emails comprometidos           │
│  └── Paste sites: Dados expostos                    │
├─────────────────────────────────────────────────────┤
│  MÓDULO 6: Reputação Online                         │
│  ├── Reclame Aqui: Reclamações                      │
│  ├── Google News: Notícias                          │
│  └── Processos trabalhistas: TST                    │
└─────────────────────────────────────────────────────┘
```

**Output**: Dados brutos consolidados em JSON

**Tempo**: 30 minutos - 2 horas (dependendo de APIs)

---

#### 3.2 Análise Humana (Analyst)

**Responsável**: Senior Analyst

**Ações**:

1. **Revisar Dados Brutos**
   - Abrir JSON consolidado
   - Verificar completude (todos módulos rodaram?)
   - Identificar dados faltantes ou erros

2. **Validação e Cruzamento**
   - Confirmar identidade (nome + CPF + foto)
   - Cruzar informações de fontes diferentes
   - Identificar inconsistências
   - Verificar homônimos (descartar falsos positivos)

3. **Análise de Risco**
   - Red flags críticos:
     - ⚠️ Processos criminais ativos
     - ⚠️ Fraudes documentadas
     - ⚠️ Empresas em recuperação judicial
     - ⚠️ Dívidas milionárias (Serasa)
     - ⚠️ Sócios ocultos com histórico negativo
   - Yellow flags (atenção):
     - ⚠️ Muitas empresas abertas/fechadas
     - ⚠️ Processos trabalhistas recorrentes
     - ⚠️ Exposição de dados em breach
   - Green flags (positivo):
     - ✅ Histórico limpo
     - ✅ Reputação positiva
     - ✅ Empresas saudáveis

4. **Calcular Risk Score** (0-100)
   - 0-20: **Risco Muito Baixo** (verde)
   - 21-40: **Risco Baixo** (verde claro)
   - 41-60: **Risco Médio** (amarelo)
   - 61-80: **Risco Alto** (laranja)
   - 81-100: **Risco Crítico** (vermelho)

**Fórmula do Risk Score**:
```
Score = (
  Processos Criminais × 30 +
  Processos Cíveis × 15 +
  Data Breach × 10 +
  Vínculos Suspeitos × 20 +
  Reputação Negativa × 15 +
  Irregularidades Fiscais × 10
) / Total Possível × 100
```

5. **Escrever Análise Contextual**
   - Resumo executivo (3-5 parágrafos)
   - Destacar pontos críticos
   - Fornecer contexto (não só dados)
   - Recomendar ações

6. **Recomendação Final**
   - ✅ **APROVAR**: Risco baixo, seguir em frente
   - ⚠️ **APROVAR COM RESSALVAS**: Risco médio, mitigar pontos específicos
   - 🔍 **INVESTIGAR MAIS**: Dados inconclusivos, aprofundar
   - ❌ **RECUSAR**: Risco alto, não prosseguir

**Checklist de Análise**:
- [ ] Identidade confirmada (não é homônimo)?
- [ ] Todos os red flags foram investigados?
- [ ] Risk score calculado corretamente?
- [ ] Resumo executivo está claro e objetivo?
- [ ] Recomendação está justificada pelos dados?
- [ ] Fontes foram citadas corretamente?

**Tempo**: 1-3 horas (dependendo da complexidade)

---

### Fase 4: Geração do PDF (Semi-automático)

**Responsável**: Sistema + Analyst (revisão)

#### 4.1 Geração Automática

**Sistema gera PDF** com template profissional:

**Estrutura do PDF**:

```
📄 RELATÓRIO DE INVESTIGAÇÃO DIGITAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CAPA
├── Logo investigaree
├── Título: "Relatório de Investigação Digital"
├── Nome do alvo
├── ID do relatório
├── Data de emissão
└── Confidencialidade: "Estritamente Confidencial"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 ÍNDICE
1. Resumo Executivo
2. Metodologia
3. Identidade & Documentos
4. Histórico Criminal
5. Presença Digital
6. Vínculos Societários
7. Data Breach
8. Reputação Online
9. Análise de Risco
10. Recomendações
11. Apêndices

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 RESUMO EXECUTIVO (1 página)
├── Nome completo do alvo
├── CPF (parcialmente mascarado)
├── Risk Score: [0-100] com gráfico visual
├── Principais Red Flags (top 3)
├── Recomendação final
└── Data da análise

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 METODOLOGIA (1 página)
├── Fontes utilizadas (lista completa)
├── Período de análise
├── Limitações conhecidas
└── Disclaimer LGPD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📑 MÓDULOS (1-3 páginas cada)
├── Dados encontrados
├── Análise contextual
├── Red/Yellow/Green flags
└── Screenshots (quando aplicável)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ANÁLISE DE RISCO (2-3 páginas)
├── Risk Score detalhado
├── Fatores que influenciaram o score
├── Timeline de eventos críticos
├── Comparação com benchmark
└── Matriz de risco

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 RECOMENDAÇÕES (1-2 páginas)
├── Ações imediatas
├── Ações de médio prazo
├── Monitoramento sugerido
└── Due diligence adicional (se necessário)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📎 APÊNDICES
├── Glossário de termos
├── Metodologia de cálculo do Risk Score
├── Fontes consultadas (URLs)
└── Disclaimer legal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 RODAPÉ (todas as páginas)
├── Logo investigaree
├── "Confidencial" (watermark)
├── Número da página
└── ID do relatório
```

**Tempo**: 5-10 minutos (automático)

---

#### 4.2 Revisão Humana

**Responsável**: Analyst + QA Lead

**Checklist de Revisão do PDF**:
- [ ] Dados pessoais corretos (nome, CPF)?
- [ ] Risk score visível e destacado?
- [ ] Red flags estão em vermelho e em destaque?
- [ ] Análise contextual está clara?
- [ ] Sem erros de português/gramática?
- [ ] Screenshots legíveis?
- [ ] Fontes citadas corretamente?
- [ ] Recomendação está na primeira página?
- [ ] PDF está protegido (senha opcional)?
- [ ] Watermark "Confidencial" em todas as páginas?

**Se aprovado**: Prosseguir para entrega
**Se reprovado**: Corrigir e re-gerar PDF

**Tempo**: 10-15 minutos

---

### Fase 5: Entrega (Automático)

**Sistema executa**:

1. ✅ Upload PDF para R2 Storage
2. ✅ Gerar URL assinada (válida por 30 dias)
3. ✅ Atualizar status: `processing` → `completed`
4. ✅ Registrar `completed_at` timestamp
5. ✅ Enviar email ao cliente:
   - Link para download
   - Resumo executivo
   - Próximos passos
6. ✅ Notificar equipe (Slack/Discord)
7. ✅ Registrar em analytics (tempo total, módulos usados, etc)

**Email Template**:
```
Assunto: ✅ Seu relatório de investigação está pronto

Olá [Nome Cliente],

Seu relatório de investigação digital sobre [Nome Alvo] foi concluído!

🔍 RESUMO RÁPIDO
━━━━━━━━━━━━━━━━━━━━━━━
Risk Score: [X/100] ([Baixo/Médio/Alto])
Red Flags: [N] encontrado(s)
Recomendação: [APROVAR/APROVAR COM RESSALVAS/RECUSAR]

📥 DOWNLOAD
Acesse seu relatório completo em:
[Link com botão destacado]

⏱️ TEMPO DE PROCESSAMENTO
Solicitado em: [Data/Hora]
Concluído em: [Data/Hora]
Tempo total: [X horas]

📞 SUPORTE
Dúvidas? Responda este email ou fale conosco:
WhatsApp: +55 47 99261-1117

━━━━━━━━━━━━━━━━━━━━━━━
investigaree
Decisões de R$ 1M+ merecem mais do que Google.
```

**Tempo**: <1 minuto (automático)

---

### Métricas de Processo

**Targets**:
| Métrica | Target Standard | Target Express |
|---------|-----------------|----------------|
| **Tempo Total** | <36h | <6h |
| **Tempo Triagem** | <10min | <5min |
| **Tempo Investigação** | <24h | <4h |
| **Tempo Análise** | <3h | <1h |
| **Tempo QA** | <30min | <15min |
| **Taxa de Aprovação QA** | >95% | >90% |

---

## 🎯 SOP 002: QUALITY CONTROL (QC)

### Níveis de QC

#### Nível 1: Auto-checklist (Analyst)
- Executado pelo próprio analyst
- Antes de marcar como "pronto para QA"
- Baseado em checklist obrigatório

#### Nível 2: Peer Review (Senior Analyst)
- Outro analyst revisa
- Verifica dados, análise e conclusões
- Pode aprovar ou solicitar correções

#### Nível 3: QA Lead (QA Manager)
- Amostragem aleatória (10% dos relatórios)
- Auditoria completa
- Feedback para melhoria de processos

### Checklist Completo de QC

#### ✅ DADOS
- [ ] CPF válido e verificado
- [ ] Nome completo correto (sem abreviações)
- [ ] Data de nascimento confirmada (se disponível)
- [ ] Endereço atualizado (se disponível)
- [ ] Todos os módulos solicitados foram executados

#### ✅ INVESTIGAÇÃO
- [ ] Fontes confiáveis (gov.br, tribunais oficiais, etc)
- [ ] Datas atualizadas (últimos 90 dias preferencialmente)
- [ ] Sem dados de homônimos (confirmado identidade)
- [ ] Screenshots legíveis e relevantes
- [ ] URLs acessíveis e arquivadas

#### ✅ ANÁLISE
- [ ] Risk Score calculado corretamente
- [ ] Red flags justificados com evidências
- [ ] Contexto fornecido (não só dados brutos)
- [ ] Análise imparcial (sem viés)
- [ ] Recomendação alinhada com dados

#### ✅ ÉTICA & LGPD
- [ ] Dados apenas de fontes públicas
- [ ] Sem métodos invasivos/ilegais
- [ ] Disclaimer LGPD no relatório
- [ ] Dados sensíveis mascarados quando necessário
- [ ] Consentimento do cliente registrado

#### ✅ FORMATAÇÃO
- [ ] PDF profissional (template correto)
- [ ] Sem erros de português
- [ ] Screenshots alinhadas e legendadas
- [ ] Índice clicável (hyperlinks)
- [ ] Logo e marca d'água presentes

#### ✅ ENTREGA
- [ ] Email de entrega enviado
- [ ] Link de download funcionando
- [ ] Cliente notificado no dashboard
- [ ] Tempo de entrega dentro do SLA

---

## 🚨 SOP 003: HANDLING DE EXCEÇÕES

### Caso 1: Dados Insuficientes

**Problema**: Cliente forneceu apenas nome (sem CPF, email, etc)

**Ação**:
1. Pausar processamento
2. Contatar cliente via email + WhatsApp:
   ```
   Olá [Nome],

   Para garantir a precisão do seu relatório sobre [Nome Alvo],
   precisamos de mais informações:

   - CPF (obrigatório)
   - Data de nascimento (opcional, mas recomendado)
   - Cidade/Estado (opcional)

   Isso garante que não confundamos com homônimos.

   Aguardamos seu retorno em até 48h.
   ```
3. Se cliente não responder em 48h:
   - Oferecer reembolso OU
   - Prosseguir com disclaimer de "dados limitados"

---

### Caso 2: Homônimos Múltiplos

**Problema**: Encontrados 5+ pessoas com mesmo nome e cidade

**Ação**:
1. Solicitar CPF ou data de nascimento
2. Usar fotos de redes sociais para confirmação
3. Se impossível confirmar:
   - Reportar inconclusivo
   - Sugerir investigação adicional (upgrade para deep dive)
   - Reembolsar se cliente não aceitar

---

### Caso 3: Red Flag Crítico

**Problema**: Descoberto processo criminal grave (homicídio, fraude milionária, etc)

**Ação**:
1. **Não alertar o alvo** (risco legal)
2. Confirmar dados em fontes secundárias
3. Incluir no relatório com destaque máximo
4. Se Express: Ligar para cliente além de email
5. Oferecer consultoria jurídica (parceiro advogado)

---

### Caso 4: Atraso no SLA

**Problema**: Vai estourar o prazo (6h Express ou 48h Standard)

**Ação**:
1. Notificar cliente ANTES do deadline:
   ```
   Olá [Nome],

   Estamos processando seu relatório Express sobre [Nome Alvo].

   Devido à complexidade [razão específica], precisaremos de
   mais [X horas] para garantir a precisão.

   Como compensação, oferecemos:
   - Desconto de 25% neste relatório OU
   - 1 relatório Standard grátis no futuro

   Pedimos desculpas pelo atraso.
   ```
2. Aplicar desconto automaticamente
3. Escalar para gerente se >12h de atraso

---

### Caso 5: Cliente Insatisfeito

**Problema**: Cliente reclama da qualidade ou quer reembolso

**Ação**:
1. Responder em até 1h
2. Entender a reclamação:
   - Dados incorretos?
   - Análise superficial?
   - Expectativa não atendida?
3. Oferecer soluções:
   - **Revisão gratuita** (se dentro de 7 dias)
   - **Relatório complementar** (aprofundar pontos específicos)
   - **Reembolso parcial** (50%) se insatisfação leve
   - **Reembolso total** se erro grave nosso
4. Documentar caso para melhoria de processos

---

## 📊 INDICADORES OPERACIONAIS (KPIs)

### KPIs Primários

| KPI | Target | Medição |
|-----|--------|---------|
| **SLA Compliance** | >95% | % de entregas no prazo |
| **Quality Score** | >4.5/5 | NPS dos relatórios |
| **First-Time Approval Rate** | >90% | % aprovados na primeira QA |
| **Revision Request Rate** | <10% | % de clientes que pedem revisão |
| **Refund Rate** | <2% | % de reembolsos totais |

### KPIs Secundários

| KPI | Target | Medição |
|-----|--------|---------|
| **Avg Processing Time (Standard)** | <30h | Tempo médio real |
| **Avg Processing Time (Express)** | <5h | Tempo médio real |
| **Red Flags Discovery Rate** | >15% | % de relatórios com red flags |
| **Data Completeness** | >85% | % de módulos com dados |
| **Analyst Productivity** | 3-5/day | Relatórios por analyst/dia |

### Medição

**Ferramentas**:
- Dashboard admin (analytics em tempo real)
- Supabase (queries SQL)
- Google Sheets (manual tracking inicial)
- Metabase/Looker (futuro)

**Cadência**:
- **Daily**: SLA compliance, processing time
- **Weekly**: Quality score, revision rate
- **Monthly**: All KPIs + trends

---

## 🔐 SEGURANÇA OPERACIONAL (LGPD)

### Princípios LGPD

1. **Finalidade**: Dados usados apenas para investigação
2. **Adequação**: Compatível com contexto fornecido
3. **Necessidade**: Apenas dados essenciais
4. **Livre acesso**: Cliente pode pedir dados dele a qualquer momento
5. **Qualidade**: Dados precisos e atualizados
6. **Transparência**: Fontes sempre citadas
7. **Segurança**: Criptografia e acesso restrito
8. **Prevenção**: Medidas para evitar vazamentos
9. **Não discriminação**: Sem uso abusivo de dados
10. **Responsabilização**: Auditoria e logs

### Data Retention Policy

| Tipo de Dado | Retenção | Ação após período |
|--------------|----------|-------------------|
| **Relatórios (PDF)** | 90 dias | Deletar do R2 (cliente já baixou) |
| **Dados brutos (JSON)** | 30 dias | Deletar do Supabase |
| **Logs de acesso** | 180 dias | Arquivar ou deletar |
| **Dados de pagamento** | 5 anos | Manter (obrigação fiscal) |
| **Consentimento LGPD** | Indefinido | Manter (prova de compliance) |

### Acesso Restrito

**Roles e Permissões**:

| Role | Acesso |
|------|--------|
| **Analyst** | Criar/editar relatórios atribuídos a si |
| **Senior Analyst** | Ver todos relatórios, fazer QA |
| **QA Manager** | Auditoria completa, aprovar/reprovar |
| **Admin** | Full access, deletar dados |
| **Cliente** | Apenas seus próprios relatórios |

**Logs de Audit**:
- Quem acessou qual relatório e quando
- Quem baixou PDFs
- Quem fez alterações
- IP de acesso

---

## 🚑 DISASTER RECOVERY

### Cenários e Planos

#### Cenário 1: Cloudflare Down

**Probabilidade**: Muito baixa (<0.01%)
**Impacto**: Alto (site e API offline)

**Plano**:
1. Monitorar status: https://www.cloudflarestatus.com/
2. Comunicar clientes via email (backup SendGrid)
3. Se >2h offline: Migrar DNS temporariamente para Vercel
4. Post-mortem após resolução

#### Cenário 2: Supabase Down

**Probabilidade**: Baixa (<0.1%)
**Impacto**: Alto (sem acesso a dados)

**Plano**:
1. Backups diários automáticos (Supabase nativo)
2. Backup manual semanal (dump PostgreSQL)
3. Se >1h offline: Restaurar último backup em instância temporária
4. Migrar DNS do DB

#### Cenário 3: Analyst Chave Doente/Ausente

**Probabilidade**: Média (~5%/mês)
**Impacto**: Médio (atraso em entregas)

**Plano**:
1. Sempre ter 2+ analysts treinados
2. Documentação completa (este playbook)
3. Redistribuir relatórios para outros analysts
4. Contratar freelancer se necessário

#### Cenário 4: Data Breach (Vazamento)

**Probabilidade**: Baixa (<1%)
**Impacto**: Crítico (reputação + LGPD)

**Plano**:
1. **Contenção imediata** (isolar sistema afetado)
2. **Investigação** (como aconteceu, o que vazou)
3. **Notificação** (ANPD em 72h, clientes afetados)
4. **Remediação** (corrigir vulnerabilidade)
5. **Comunicação pública** (transparência)
6. **Pós-mortem** (lições aprendidas)

---

## 📈 ESCALAMENTO OPERACIONAL

### De 10 → 100 Relatórios/Mês

**Gargalos**:
- ❌ Analyst time (gargalo principal)
- ❌ QA manual (tudo revisado)
- ❌ Processos manuais (triagem, upload)

**Soluções**:
- ✅ Automação de 50% da investigação (IA + workers)
- ✅ Contratar 2+ analysts (ou treinar VAs)
- ✅ QA por amostragem (não 100%)
- ✅ Dashboard admin melhorado

---

### De 100 → 1000 Relatórios/Mês

**Gargalos**:
- ❌ Custo de APIs externas
- ❌ Tempo de processamento (fila grande)
- ❌ Estrutura de dados (Supabase limits)

**Soluções**:
- ✅ Negociar contratos de volume com APIs
- ✅ Fila assíncrona (workers + KV)
- ✅ Migrar para PostgreSQL dedicado (se necessário)
- ✅ Team de 5+ analysts (3 turnos)
- ✅ Automação de 80%+ do processo

---

## 📚 ANEXOS

### Anexo A: Templates de Email

**Confirmação de Pedido**:
```
Assunto: ✅ Pedido confirmado - Relatório #[ID]

Olá [Nome],

Seu pedido foi confirmado!

🎯 DETALHES DO PEDIDO
━━━━━━━━━━━━━━━━━━━━━━━
Alvo: [Nome Alvo]
Plano: [Standard/Express]
Serviços: [Lista]
Valor: R$ [Valor]
Prazo: Até [Data/Hora]

📊 PRÓXIMOS PASSOS
1. Estamos processando sua investigação
2. Você receberá atualizações por email
3. O relatório final será enviado em até [X horas]

Acompanhe em tempo real: [Link Dashboard]

Dúvidas? Responda este email.
```

---

### Anexo B: Glossário de Termos

| Termo | Definição |
|-------|-----------|
| **Red Flag** | Indicador de risco alto que requer atenção imediata |
| **Risk Score** | Métrica 0-100 que resume o risco total |
| **OSINT** | Open Source Intelligence (investigação em fontes abertas) |
| **Data Breach** | Vazamento de dados pessoais em incidentes de segurança |
| **Homônimo** | Pessoa com mesmo nome (mas identidade diferente) |
| **RLS** | Row Level Security (segurança em nível de linha no DB) |

---

**Documento mantido por**: Equipe de Operations
**Revisão**: Mensal
**Próxima revisão**: Dez 2025

---

*"Excelência operacional não é um ato, mas um hábito." — Aristóteles*
