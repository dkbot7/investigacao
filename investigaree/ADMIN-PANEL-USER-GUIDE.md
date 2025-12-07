# Painel Administrativo - Guia do Usuário

## Índice

1. [Introdução](#introdução)
2. [Acesso ao Painel](#acesso-ao-painel)
3. [Visão Geral](#visão-geral)
4. [Gerenciar Usuários](#gerenciar-usuários)
5. [Gerenciar Tenants](#gerenciar-tenants)
6. [Sistema de Alertas](#sistema-de-alertas)
7. [Logs de Auditoria](#logs-de-auditoria)
8. [Métricas e Analytics](#métricas-e-analytics)
9. [Perguntas Frequentes](#perguntas-frequentes)

---

## Introdução

O **Painel Administrativo** do investigaree é a central de controle para gerenciar usuários, permissões e organizações (tenants). Com ele, você pode:

- 👥 **Gerenciar Usuários**: Conceder e revogar acessos
- 🏢 **Gerenciar Tenants**: Criar e configurar organizações
- 🔔 **Monitorar Alertas**: Receber notificações de eventos importantes
- 📊 **Visualizar Métricas**: Acompanhar o uso da plataforma
- 📋 **Auditar Ações**: Ver histórico completo de alterações

---

## Acesso ao Painel

### Requisitos

Para acessar o painel administrativo, você precisa:

1. **Conta ativa** no investigaree
2. **Email autorizado** como administrador:
   - dkbotdani@gmail.com
   - ibsenmaciel@gmail.com
   - contato@investigaree.com.br

### Como Acessar

1. Faça login na plataforma
2. No menu lateral, clique em **"Admin"** (ícone de escudo dourado)
3. Você será direcionado para `/dashboard/admin`

> **Nota**: Se você não vê o item "Admin" no menu, entre em contato com o suporte para verificar suas permissões.

---

## Visão Geral

Ao acessar o painel, você verá:

### 📊 Cards de Estatísticas (Topo)

Quatro cards principais mostram informações rápidas:

1. **Usuários Totais**: Total de usuários cadastrados
2. **Tenants Ativos**: Organizações ativas no sistema
3. **Aguardando Liberação**: Usuários pendentes de aprovação
4. **Alertas Não Lidos**: Notificações que precisam de atenção

> **Dica**: Clique nos cards para navegar rapidamente para a seção correspondente!

### 🗂️ Abas de Navegação

O painel possui três abas principais:

- **Visão Geral**: Dashboard completo com todas as informações
- **Alertas**: Central de notificações
- **Usuários e Tenants**: Gerenciamento detalhado

### ⚠️ Banner de Modo Desenvolvimento

Se você vê um banner amarelo no topo, significa que está em **modo de desenvolvimento** usando dados simulados. Este banner pode ser fechado clicando no X.

---

## Gerenciar Usuários

### Visualizar Usuários

#### Desktop
Você verá uma tabela com:
- **Email**: Email do usuário
- **Nome**: Nome completo
- **Tenants**: Organizações que o usuário tem acesso (com badges coloridos por role)
- **Último Acesso**: Quando o usuário acessou pela última vez
  - 🟢 Verde: Menos de 1 hora
  - 🔵 Azul: Menos de 1 dia
  - 🟡 Amarelo: Menos de 7 dias
  - ⚪ Cinza: Mais de 7 dias
- **Ações**: Botões para revogar acesso

#### Mobile
Em dispositivos móveis, os usuários são exibidos como **cards** com todas as informações organizadas verticalmente.

### 🔍 Buscar Usuários

1. Use a **caixa de busca** no topo da lista
2. Digite o email ou nome do usuário
3. Os resultados são filtrados automaticamente (com delay de 300ms)
4. A busca funciona em tempo real

### 📄 Paginação

- **Itens por página**: Escolha exibir 5, 10, 25 ou 50 usuários
- **Navegação**: Use os botões "Anterior" e "Próxima"
- **Páginas**: Clique diretamente no número da página desejada
- **Info**: Veja quantos registros estão sendo exibidos (ex: "1-10 de 50")

### ✅ Conceder Acesso

#### Para Usuários Pendentes

1. Localize a seção **"Usuários Aguardando Liberação"** (fundo amarelo)
2. Clique no botão **"Liberar"** ao lado do usuário
3. No modal que abre:
   - Selecione o **Tenant** (organização)
   - Escolha a **Permissão**:
     - 👁️ **Viewer**: Apenas visualizar dados
     - ✏️ **Editor**: Visualizar e editar dados
     - 👑 **Admin**: Acesso total (incluir/excluir)
4. Clique em **"Conceder"**
5. Aguarde a confirmação (toast verde no canto superior direito)

#### Para Usuários Sem Acesso

1. Localize a seção **"Usuários Sem Acesso"** (fundo azul)
2. Clique em **"Conceder Acesso"**
3. Siga os mesmos passos acima

### ❌ Revogar Acesso

1. Na lista de usuários, encontre o usuário desejado
2. Na coluna "Ações", clique no **botão X vermelho** ao lado do tenant
3. Um modal de confirmação será exibido com aviso de ação irreversível
4. Leia atentamente a mensagem de confirmação
5. Clique em **"Revogar Acesso"** para confirmar
6. O usuário perderá acesso imediatamente

> **⚠️ Atenção**: Revogar acesso é uma ação que não pode ser desfeita! O usuário precisará solicitar acesso novamente.

### 📥 Exportar Lista de Usuários (CSV)

1. Clique no botão **"Exportar CSV"** no topo da lista
2. Um arquivo será baixado automaticamente com nome `usuarios_YYYY-MM-DD.csv`
3. O arquivo contém:
   - ID do usuário
   - Nome
   - Email
   - Telefone
   - Tenants (lista separada por ponto e vírgula)
   - Roles (lista separada por ponto e vírgula)
   - Data de criação
   - Último acesso

> **Dica**: O arquivo está formatado para abrir corretamente no Excel com acentuação brasileira.

---

## Gerenciar Tenants

### O que é um Tenant?

Um **Tenant** (ou organização) é uma divisão lógica da plataforma. Cada tenant possui:
- Dados isolados
- Usuários próprios
- Configurações independentes

Exemplos: "CLIENTE_01", "EMPRESA_XYZ", "DEPARTAMENTO_RH"

### Visualizar Tenants

Os tenants são exibidos como **cards** em grade (1-3 colunas dependendo do tamanho da tela):

Cada card mostra:
- **Código**: Identificador único (ex: CLIENTE_01)
- **Nome**: Nome descritivo
- **Status**: Ativo (verde) ou Inativo (vermelho)
- **Usuários**: Quantidade de usuários com acesso

### 🆕 Criar Novo Tenant

1. Clique no botão **"Criar Tenant"** (verde, no topo da seção)
2. No modal que abre:
   - **Código**:
     - Use apenas MAIÚSCULAS, números e underscores (_)
     - Mínimo 3, máximo 20 caracteres
     - Exemplo: `CLIENTE_02`, `FILIAL_SP`
   - **Nome**:
     - Nome descritivo do tenant
     - Exemplo: "Cliente Secundário", "Filial São Paulo"
3. Clique em **"Criar"**
4. O tenant será criado com status "active" automaticamente

> **⚠️ Validações**:
> - O código deve ser único (não pode já existir)
> - O nome não pode estar vazio
> - Códigos inválidos mostrarão erro em vermelho

### 📝 Ver Detalhes do Tenant

1. **Clique no card** do tenant desejado
2. Um modal grande será aberto mostrando:

#### Informações Gerais
- Código (não editável)
- Nome (editável)
- Status (editável)
- Data de criação
- Total de usuários

#### Lista de Usuários com Acesso
- Nome/Email
- Role (Admin/Editor/Viewer)
- Botão para revogar acesso

#### Ações Rápidas
- **Adicionar Usuário**: Direciona para seção de usuários pendentes
- **Ativar/Desativar Tenant**: Alterna o status
- **Fechar**: Fecha o modal

### ✏️ Editar Tenant

1. Abra os detalhes do tenant (clique no card)
2. Clique no botão **"Editar"** (azul, com ícone de lápis)
3. Os campos ficarão editáveis:
   - **Nome**: Altere o nome descritivo
   - **Status**: Escolha "Ativo" ou "Inativo"
4. Opções:
   - **Cancelar**: Desfaz as alterações
   - **Salvar**: Confirma as mudanças (verde, com ícone de disco)

### 🔄 Ativar/Desativar Tenant

1. Abra os detalhes do tenant
2. Clique no botão grande **"Ativar Tenant"** ou **"Desativar Tenant"**
   - Vermelho com ícone de power = Desativar
   - Verde com ícone de power = Ativar
3. Confirme a ação
4. O status será atualizado imediatamente

> **Nota**: Tenants inativos não permitem que usuários acessem seus dados.

---

## Sistema de Alertas

### Tipos de Alertas

O sistema gera alertas automaticamente para:

| Tipo | Descrição | Ícone |
|------|-----------|-------|
| **Novo Usuário** | Usuário se registrou e aguarda liberação | 👤 |
| **Nova Lead** | Visitante preencheu formulário de contato | ✉️ |
| **Acesso Concedido** | Permissão foi concedida a um usuário | ✅ |
| **Acesso Revogado** | Permissão foi removida de um usuário | ❌ |

### Severidade dos Alertas

Alertas são classificados por importância:

- 🔵 **Info** (azul): Informativo
- 🟢 **Success** (verde): Ação bem-sucedida
- 🟡 **Warning** (amarelo): Atenção necessária
- 🔴 **Error** (vermelho): Erro ou problema

### Visualizar Alertas

1. Clique na aba **"Alertas"** no topo
2. Você verá:
   - Badge com contagem de não lidos (se houver)
   - Lista de alertas ordenados por data (mais recentes primeiro)
   - Alertas não lidos ficam com opacidade 100%
   - Alertas lidos ficam com opacidade 60%

### Ações Diretas em Alertas

Alguns alertas possuem **botões de ação rápida**:

#### Alerta de Novo Usuário
- Botão **"Liberar Acesso"**: Abre modal para conceder permissão imediatamente

### Marcar como Lido

#### Individual
1. Encontre o alerta desejado
2. Clique em **"Marcar como lido"** (ícone de check duplo)
3. O alerta ficará semi-transparente

#### Todos de uma vez
1. No topo da lista de alertas, clique em **"Marcar Todos como Lidos"**
2. Todos os alertas serão marcados simultaneamente

---

## Logs de Auditoria

### O que são Logs de Auditoria?

Os logs registram **todas as ações administrativas** realizadas no sistema. Isso garante:
- ✅ Rastreabilidade completa
- ✅ Conformidade com LGPD
- ✅ Segurança e transparência
- ✅ Detecção de atividades suspeitas

### Visualizar Logs

1. Role a página até a seção **"Logs de Auditoria"**
2. Você verá uma **timeline visual** com todos os eventos

### Informações em Cada Log

- **Tipo de Ação**: Badge colorido (ex: "Acesso Concedido")
- **Descrição**: Texto explicativo da ação
- **Tenant**: Código da organização afetada
- **Role**: Permissão concedida/revogada (se aplicável)
- **Fluxo de Usuários**: Quem fez a ação → para quem
- **Metadados**: Informações técnicas (clique em "Ver metadados" para expandir)
- **Timestamp**:
  - Relativo: "5m atrás", "2h atrás"
  - Absoluto: Data e hora completa

### Cores por Tipo de Ação

| Ação | Cor |
|------|-----|
| Acesso Concedido | 🟢 Verde |
| Acesso Revogado | 🔴 Vermelho |
| Tenant Criado | 🔵 Azul |
| Tenant Atualizado | 🟡 Amarelo |
| Tenant Desativado | 🟠 Laranja |
| Tenant Ativado | 🟢 Verde |

### Ver Metadados

1. Clique em **"Ver metadados"** em qualquer log
2. Uma seção expansível mostrará dados técnicos em formato JSON
3. Pode incluir: IP do usuário, navegador, hora exata, etc.

---

## Métricas e Analytics

### Dashboard de Métricas

Role até a seção **"Métricas de Uso"** para ver análises detalhadas.

### 📊 KPIs Principais (4 Cards)

#### 1. Ativos na Última Hora
- **Cor**: Ciano
- **Mostra**: Usuários que acessaram nos últimos 60 minutos
- **Uso**: Monitorar atividade em tempo real

#### 2. Ativos nas Últimas 24h
- **Cor**: Verde
- **Mostra**: Usuários que acessaram no último dia
- **Uso**: Verificar engajamento diário

#### 3. Ativos nos Últimos 7 Dias
- **Cor**: Roxo
- **Mostra**: Usuários que acessaram na última semana
- **Uso**: Análise semanal de uso

#### 4. Crescimento (7 dias)
- **Cor**: Verde (positivo), Vermelho (negativo), Cinza (neutro)
- **Mostra**: Variação percentual comparando última semana com anterior
- **Ícone**:
  - ⬆️ Seta para cima: Crescimento
  - ⬇️ Seta para baixo: Declínio
  - ➖ Traço: Estável
- **Cálculo**: ((Novos últimos 7 dias - Novos 7-14 dias atrás) / Novos 7-14 dias) × 100

### 📈 Distribuição por Permissão

Gráfico de barras horizontais mostrando:

- **Admin** (vermelho): Usuários com permissão total
- **Editor** (amarelo): Usuários com permissão de edição
- **Viewer** (azul): Usuários apenas visualizando

Cada barra mostra:
- Quantidade absoluta de usuários
- Percentual do total
- Progress bar visual animado

### 📉 Outras Métricas

#### Taxa de Ativação
- **O que é**: Percentual de usuários que possuem acesso ativo
- **Cálculo**: (Usuários com acesso / Total de usuários) × 100
- **Progress bar**: Verde com gradiente
- **Ideal**: > 80%

#### Total de Ações
- Soma de todas as ações administrativas registradas
- Inclui: Concessões, revogações, criações, edições

#### Ações nas Últimas 24h
- Atividade administrativa recente
- Útil para monitorar mudanças diárias

### Como Interpretar as Métricas

#### Cenário Saudável ✅
- Taxa de ativação > 80%
- Crescimento positivo
- Muitos usuários ativos nas últimas 24h
- Distribuição equilibrada de roles

#### Sinais de Atenção ⚠️
- Taxa de ativação < 50%: Muitos usuários sem acesso
- Crescimento negativo: Perda de usuários
- Poucos ativos nas últimas 24h: Baixo engajamento
- Muitos admins: Risco de segurança (privilégios excessivos)

---

## Perguntas Frequentes

### Gerenciamento de Usuários

**P: Por quanto tempo um usuário fica "pendente"?**
R: Indefinidamente, até que um admin conceda acesso. Não há expiração automática.

**P: Posso conceder acesso a múltiplos tenants para um usuário?**
R: Sim! Um usuário pode ter acesso a vários tenants com roles diferentes em cada um.

**P: O que acontece se eu revogar o acesso de um usuário que está usando o sistema?**
R: Ele perderá acesso imediatamente. Na próxima ação, será desconectado automaticamente.

**P: Posso alterar a role de um usuário sem revogar o acesso?**
R: Sim, revogue o acesso atual e conceda novamente com a role desejada. (Feature de edição direta em desenvolvimento)

**P: Como sei quando um usuário acessou pela última vez?**
R: Veja a coluna "Último Acesso" na tabela. Cores indicam a recência:
- 🟢 < 1h
- 🔵 < 1d
- 🟡 < 7d
- ⚪ > 7d ou nunca

### Gerenciamento de Tenants

**P: Posso deletar um tenant?**
R: No momento, não. Você pode desativá-lo. (Feature de deleção em desenvolvimento)

**P: O que acontece com os usuários se eu desativar um tenant?**
R: Eles mantêm seus cadastros, mas não conseguem acessar os dados daquele tenant.

**P: Posso reativar um tenant desativado?**
R: Sim! Basta abrir os detalhes e clicar em "Ativar Tenant".

**P: Existe limite de tenants?**
R: Não há limite técnico. O limite depende do seu plano contratado.

**P: Posso renomear o código de um tenant?**
R: Não. O código é imutável após criação. Apenas o nome pode ser alterado.

### Sistema de Alertas

**P: Os alertas expiram?**
R: Não. Eles permanecem até serem marcados como lidos ou removidos manualmente.

**P: Posso configurar quais alertas receber?**
R: No momento, todos os alertas são gerados automaticamente. (Configurações personalizadas em desenvolvimento)

**P: Recebo notificações por email?**
R: Atualmente, apenas no painel. Notificações por email estão em desenvolvimento.

**P: Posso deletar alertas?**
R: No momento, apenas marcar como lido. (Feature de deleção em desenvolvimento)

### Logs de Auditoria

**P: Por quanto tempo os logs são armazenados?**
R: Indefinidamente. Logs são essenciais para conformidade com LGPD.

**P: Posso exportar os logs?**
R: Feature em desenvolvimento. Em breve será possível exportar em CSV/PDF.

**P: Quem pode ver os logs?**
R: Apenas usuários com permissão de admin.

**P: Os logs podem ser alterados ou deletados?**
R: Não. Logs são imutáveis por questões de auditoria e conformidade.

### Métricas

**P: Com que frequência as métricas são atualizadas?**
R: Em tempo real. Sempre que você recarrega a página, os cálculos são refeitos.

**P: Posso exportar as métricas?**
R: Feature em desenvolvimento.

**P: As métricas consideram apenas meu tenant ou todos?**
R: Todos os tenants que você administra.

### Modo Desenvolvimento

**P: O que é o "Modo Desenvolvimento"?**
R: Um modo especial que usa dados simulados (mock) quando a API não está disponível. Útil para testes e desenvolvimento.

**P: Como sei se estou em modo desenvolvimento?**
R: Você verá um banner amarelo no topo da página.

**P: Minhas ações em modo desenvolvimento são salvas?**
R: Não. Mudanças são apenas locais e serão perdidas ao recarregar a página.

**P: Como sair do modo desenvolvimento?**
R: Configure a variável `NEXT_PUBLIC_DEV_MODE=false` no ambiente. Isso ativa a API real.

### Responsividade

**P: Posso usar o painel no celular?**
R: Sim! O painel é totalmente responsivo. Em mobile:
- Tabelas viram cards
- Modais ocupam a tela toda
- Botões ficam em pilha vertical

**P: Alguns recursos não funcionam no mobile?**
R: Todos os recursos funcionam igualmente em desktop e mobile.

### Segurança

**P: Quem pode acessar o painel admin?**
R: Apenas emails autorizados (hardcoded no sistema por segurança).

**P: Posso adicionar mais admins?**
R: Sim, mas requer alteração no código. Entre em contato com o desenvolvedor.

**P: As ações ficam registradas em log?**
R: Sim! Todas as ações administrativas geram logs de auditoria.

**P: É seguro conceder acesso "admin" para muitos usuários?**
R: Não recomendado. Use "admin" apenas para usuários de extrema confiança. Prefira "editor" ou "viewer".

### Performance

**P: O painel fica lento com muitos usuários?**
R: Não. Implementamos paginação e otimizações para lidar com milhares de registros.

**P: A busca é lenta?**
R: Não. Usamos debounce (delay de 300ms) para otimizar e evitar buscas excessivas.

**P: As animações podem ser desligadas?**
R: No momento, não. Mas são GPU-accelerated e não afetam performance.

---

## Atalhos de Teclado

(Feature planejada - em desenvolvimento)

---

## Suporte

### Precisa de Ajuda?

- 📧 **Email**: contato@investigaree.com.br
- 🌐 **Site**: https://investigaree.com.br
- 📱 **WhatsApp**: (11) 99999-9999

### Reportar Bug

Se encontrar um problema:

1. Anote o que você estava fazendo
2. Tire um print da tela (se possível)
3. Verifique o console do navegador (F12 → Console)
4. Envie para contato@investigaree.com.br com:
   - Descrição do problema
   - Passos para reproduzir
   - Prints/logs
   - Navegador e versão

### Solicitar Feature

Tem uma sugestão de melhoria?

1. Descreva a funcionalidade desejada
2. Explique o problema que ela resolve
3. Envie para contato@investigaree.com.br

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Admin** | Administrador com acesso total ao sistema |
| **Tenant** | Organização/cliente com dados isolados |
| **Role** | Nível de permissão (admin/editor/viewer) |
| **Viewer** | Usuário com permissão apenas de visualização |
| **Editor** | Usuário que pode visualizar e editar |
| **Badge** | Etiqueta colorida de identificação |
| **Toast** | Notificação temporária que aparece no canto da tela |
| **Modal** | Janela sobreposta para ações específicas |
| **KPI** | Key Performance Indicator (Indicador Chave de Performance) |
| **CSV** | Comma-Separated Values (formato de planilha) |
| **API** | Application Programming Interface (interface de backend) |
| **Mock** | Dados simulados para testes |
| **Debounce** | Delay intencional para otimizar buscas |
| **LGPD** | Lei Geral de Proteção de Dados |

---

## Atualizações

### Versão 1.0.0 (05/12/2025)

**Lançamento inicial** com:
- ✅ Gerenciamento completo de usuários
- ✅ Gerenciamento de tenants
- ✅ Sistema de alertas
- ✅ Logs de auditoria
- ✅ Dashboard de métricas
- ✅ Design responsivo

### Próximas Features Planejadas

- 🔜 Notificações por email
- 🔜 Edição de role sem revogar/reconceder
- 🔜 Deleção de tenants
- 🔜 Exportação de logs (CSV/PDF)
- 🔜 Configuração personalizada de alertas
- 🔜 Filtros avançados
- 🔜 Atalhos de teclado
- 🔜 Modo escuro/claro

---

**Última atualização**: 05 de dezembro de 2025
**Versão**: 1.0.0

---

© 2025 investigaree. Todos os direitos reservados.
