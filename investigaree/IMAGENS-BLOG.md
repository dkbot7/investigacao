# 🎨 Guia de Geração de Imagens - Blog Investigaree

## 📋 Visão Geral

Este documento contém informações sobre o sistema de análise e geração de imagens de capa para os 37 posts do blog Investigaree.

## 📊 Estatísticas Atuais

| Métrica | Valor |
|---------|-------|
| **Total de Posts** | 37 |
| **Imagens Unsplash** | 31 (84%) |
| **Imagens Locais** | 3 (8%) |
| **Imagens YouTube** | 1 (3%) |
| **Outras** | 2 (5%) |

## 🛠️ Arquivos do Sistema

### `analyze-images.js`
Script Node.js que:
- Analisa todos os posts do `mockPosts.ts`
- Identifica contexto baseado em tags e conteúdo
- Gera prompts otimizados para cada post
- Exporta resultado em JSON

**Uso:**
```bash
node analyze-images.js
```

### `image-prompts.json`
Base de dados com 37 prompts prontos, contendo:
- ID e slug do post
- Título completo
- URL da imagem atual
- Fonte da imagem
- Prompt otimizado para geração
- Tags do post

## 🎯 Categorias de Prompts

### 1. Perícia Forense (8 posts)
- **Estilo**: Laboratório profissional, cena de investigação
- **Conceito**: Perito analisando evidências digitais
- **Cores**: Tons azuis frios, iluminação profissional
- **Posts**: PEC Polícias Científicas, Dia do Perito, Cadeia de Custódia, etc.

### 2. Fraudes e Segurança (6 posts)
- **Estilo**: Cibersegurança, segurança digital
- **Conceito**: Escudo digital, proteção de dados, prevenção
- **Cores**: Vermelho/laranja de alerta + azul de segurança
- **Posts**: Golpes Fim de Ano, Red Flags CPF, INSS Fraudes, etc.

### 3. Empresas e Due Diligence (9 posts)
- **Estilo**: Inteligência empresarial, análise corporativa
- **Conceito**: Documentos, análise de empresa, prédio corporativo
- **Cores**: Azul marinho, prata, cores corporativas
- **Posts**: Investigar Empresas SC, Juntas Comerciais, QSA, etc.

### 4. OSINT e Investigação (7 posts)
- **Estilo**: Workspace digital, conceito OSINT
- **Conceito**: Múltiplos monitores, dashboard de análise
- **Cores**: Fundo escuro com displays brilhantes
- **Posts**: OSINT Brasil, Investigação Digital, Consultas Públicas, etc.

### 5. Dados Públicos (5 posts)
- **Estilo**: Visualização de dados, transparência gov
- **Conceito**: Bancos de dados abertos, documentos digitais
- **Cores**: Branco e azul limpo, cores de data viz
- **Posts**: Portal Transparência, TSE, Tribunais, etc.

### 6. Background Check (2 posts)
- **Estilo**: Due diligence profissional
- **Conceito**: Pessoa revisando documentos, verificação checklist
- **Cores**: Tons azuis e cinza profissionais
- **Posts**: Verificar Funcionários, Background Check, etc.

## 📐 Especificações Técnicas

Todos os prompts incluem:

```
Formato: 1200x675px (16:9)
Qualidade: 4K, alta resolução
Composição: Regra dos terços, iluminação profissional
Requisito: Sem texto sobreposto, imagem limpa e profissional
Contexto: Brasileiro quando relevante
```

## 🎨 Como Usar os Prompts

### Opção 1: Stable Diffusion
```bash
# Exemplo para POST #1
Prompt: [copiar de image-prompts.json]
Negative prompt: text, watermark, logo, signature, low quality, blurry
Size: 1200x675
Steps: 30
CFG Scale: 7
Sampler: DPM++ 2M Karras
```

### Opção 2: DALL-E 3 (OpenAI)
```python
import openai

prompt = image_prompts[0]['prompt']
response = openai.Image.create(
    prompt=prompt,
    n=1,
    size="1792x1024"  # Depois fazer crop para 1200x675
)
```

### Opção 3: Midjourney
```
/imagine [prompt do JSON] --ar 16:9 --v 6 --style raw --q 2
```

### Opção 4: Leonardo.AI
```
1. Copiar prompt do JSON
2. Selecionar modelo: Leonardo Kino XL
3. Dimensões: Custom 1200x675
4. Prompt Magic: v3
5. PhotoReal: Enabled
```

## 📝 Exemplo de Prompt Completo

**Post #3: Fraudes de Fim de Ano**

```
Professional stock photo for blog post about "Golpes de Fim de Ano em SC: Como Se Proteger da Onda de Frau".

Visual concept: digital security shield, protected data, hacker prevention.

Style: cybersecurity concept, digital security.

Mood: alert, protective, warning.

Color palette: red and orange alert tones, contrasted with blue secure elements.

Composition: wide horizontal format 1200x675px, rule of thirds, professional lighting, high quality, 4K resolution, suitable for blog header image.

Brazilian context when relevant. No text overlay, clean professional image.
```

## 🔄 Workflow Recomendado

1. **Escolher post** → Abrir `image-prompts.json`
2. **Copiar prompt** → Do campo `"prompt"`
3. **Gerar imagem** → Usar ferramenta preferida (DALL-E, Midjourney, etc)
4. **Revisar** → Verificar se atende aos critérios
5. **Salvar** → Em `public/images/blog/[slug].jpg`
6. **Atualizar** → `coverImage` no `mockPosts.ts`
7. **Regenerar** → `node generate-mockposts.js`
8. **Deploy** → Build e deploy

## 💡 Dicas de Otimização

### Melhorar Prompts
- Adicionar "Brazilian government building" para contexto local
- Especificar "no people visible" se quiser abstrato
- Usar "close-up" ou "wide angle" para variar composição

### Ferramentas Gratuitas
- **Bing Image Creator** (DALL-E 3 grátis)
- **Leonardo.AI** (150 créditos/dia grátis)
- **Stable Diffusion Online** (vários sites)

### Ferramentas Pagas
- **Midjourney** ($10/mês) - Melhor qualidade
- **DALL-E 3 via ChatGPT Plus** ($20/mês)
- **Leonardo.AI Pro** ($12/mês) - Melhor custo-benefício

## 📈 Priorização

### Alta Prioridade (Featured Posts)
1. ✅ Post #1: PEC Polícias Científicas (featured)
2. ✅ Post #2: Investigar Empresas SC (featured)
3. ✅ Post #3: Fraudes Fim de Ano (featured)

### Média Prioridade (Imagens Locais)
4. Post #11: Dia Perito - Ibsen Maciel (`/images/dia-perito-criminal-ibsen.png`)
5. Post #12: Consulta CPF (`/images/blog/consulta-cpf-fontes-publicas.jpg`)
6. Post #13: Dia Perito 4 Dez (`/images/dia-perito-criminal.jpg`)

### Baixa Prioridade (Unsplash OK)
- Manter Unsplash nos demais 31 posts (já são imagens de qualidade)

## 🎯 Próximos Passos

- [ ] Gerar imagens para os 3 posts featured
- [ ] Substituir 3 imagens locais por versões profissionais
- [ ] Considerar criar imagens brandizadas (com paleta Investigaree)
- [ ] A/B test: imagens geradas vs Unsplash (conversão)

## 📚 Recursos

- [Unsplash](https://unsplash.com) - Imagens atuais
- [Bing Image Creator](https://www.bing.com/create) - DALL-E 3 grátis
- [Leonardo.AI](https://leonardo.ai) - Gerador com créditos grátis
- [Stable Diffusion Web](https://stablediffusionweb.com) - SD online

---

**Criado em**: 2025-12-19
**Última atualização**: 2025-12-19
**Total de prompts**: 37
**Status**: ✅ Pronto para uso
