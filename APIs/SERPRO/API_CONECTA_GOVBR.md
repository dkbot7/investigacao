# API SERPRO - Conecta Gov.br

**Plataforma de Interoperabilidade e Compartilhamento de Dados Governamentais**

---

## VISÃO GERAL

O **Conecta GOV.BR** é um programa que promove a troca automática e segura de informações entre sistemas governamentais, para que o cidadão não tenha que reapresentar informações que o governo já possua.

### Base Legal

- **Lei 13.726/2018** - Lei da Simplificação
- **Lei 14.129/2021** - Lei do Governo Digital

O compartilhamento de dados entre órgãos é um **direito do cidadão** garantido por lei.

---

## FUNCIONALIDADES

### 1. Troca de Dados entre Órgãos

- Compartilhamento seguro entre órgãos federais
- Interoperabilidade de sistemas governamentais
- Eliminação de reapresentação de documentos

### 2. APIs Disponíveis

| API | Descrição |
|-----|-----------|
| **CBC-CPF** | Cadastro Base do Cidadão |
| **CNPJ** | Cadastro Nacional de Pessoa Jurídica |
| **Simples Nacional** | Informações do Simples |
| **Outras** | Diversas bases governamentais |

### 3. Integração com e-CAC

- Cidadão pode autorizar compartilhamento via e-CAC
- Gera token de autorização
- Controle pelo titular dos dados

---

## PÚBLICO-ALVO

### Quem pode usar

| Tipo | Acesso |
|------|--------|
| **Órgãos Federais** | Acesso direto via Conecta |
| **Estados e Municípios** | Via adesão ao programa |
| **Setor Privado** | Via APIs SERPRO/Dataprev |
| **Cidadão** | Não disponível diretamente |

### Estados que já utilizam

- São Paulo
- Minas Gerais
- Outros em adesão

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 |
| **Token** | Validade de 2 horas |
| **Documentação** | https://doc.conectagov.estaleiro.serpro.gov.br |
| **Portal** | https://www.gov.br/conecta |

### Ambiente de Homologação

- Limite de **1.000 chamadas de teste** por API
- Aumento mediante solicitação justificada
- Contato: conecta@economia.gov.br

---

## MODELO DE ACESSO

### Para Órgãos Públicos

1. Adesão ao programa Conecta Gov.br
2. Configuração de integração
3. Acesso às APIs disponíveis

### Para Setor Privado

O Conecta Gov.br **não está disponível diretamente** para o setor privado.

Para acessar dados governamentais, empresas devem contratar:
- **SERPRO** - APIs comerciais
- **Dataprev** - APIs de benefícios

---

## CASOS DE USO

### 1. Simplificação de Serviços Públicos
Eliminar exigência de documentos que o governo já possui.

### 2. Integração de Sistemas Estaduais
Estados acessando bases federais via Conecta.

### 3. Validação Cadastral
Órgãos validando CPF/CNPJ em tempo real.

### 4. Governo Digital
Automatização de processos intergovernamentais.

---

## CONTATO

| Canal | Informação |
|-------|------------|
| **Email Conecta** | conecta@economia.gov.br |
| **Email SERPRO** | css.serpro@serpro.gov.br |
| **Telefone SERPRO** | 0800 728 2323 |

---

## IMPORTANTE

> Para **empresas privadas** que desejam acessar dados de CPF, CNPJ e outras bases governamentais, o caminho é contratar as APIs comerciais do SERPRO diretamente na Loja SERPRO (https://loja.serpro.gov.br).

---

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO / Gov.br
