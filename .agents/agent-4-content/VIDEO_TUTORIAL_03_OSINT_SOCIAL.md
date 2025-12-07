# 🎬 ROTEIRO VÍDEO TUTORIAL #3: OSINT em Redes Sociais

**Título:** OSINT em Redes Sociais: Ferramentas e Técnicas de Investigação Digital (2025)
**Duração estimada:** 12-15 minutos
**Objetivo:** Ensinar técnicas OSINT para investigação em redes sociais (Instagram, LinkedIn, Facebook, TikTok) com conformidade LGPD
**Público-alvo:** Investigadores, compliance officers, RH, segurança corporativa, jornalistas investigativos

---

## 📋 ESTRUTURA DO VÍDEO

### ✅ ABERTURA (0:00 - 0:45)

**Hook visual ultra-dinâmico:**
- Montagem rápida: perfil fake sendo desmascarado, geolocalização revelando mentira, conexões ocultas sendo mapeadas
- Screenshots de ferramentas OSINT em ação (Maltego, Sherlock, Google Dorks)
- Investigador descobrindo fraude via Instagram

**Narração:**
> "144 milhões de brasileiros usam redes sociais. E 93% deles compartilham informações públicas que podem ser usadas em investigações forenses. Neste vídeo, vou te ensinar OSINT - Open Source Intelligence - as mesmas técnicas que FBI, Polícia Federal e investigadores forenses usam para rastrear pessoas, identificar fraudes e coletar provas em redes sociais. E o melhor: 100% LEGAL dentro da LGPD. Em 12 minutos, você vai dominar ferramentas que a maioria dos profissionais nem sabe que existe."

**CTA direto:**
> "Se você trabalha com investigação, segurança ou compliance, esse vídeo vai revolucionar seu trabalho. Vamos lá!"

---

### 📚 INTRODUÇÃO (0:45 - 1:45)

**Título na tela:** "Arsenal OSINT Completo 2025"

**Lista visual (animada):**
1. ✅ O que é OSINT e por que é 100% legal (LGPD-compliant)
2. ✅ Panorama das redes sociais brasileiras (WhatsApp 147Mi, Instagram 134Mi)
3. ✅ Ferramentas essenciais: Sherlock, Maltego, Google Dorks, OSINT Brazuca
4. ✅ Técnicas avançadas: busca reversa de imagens, análise de metadados EXIF
5. ✅ Como mapear conexões e identificar vínculos ocultos
6. ✅ Casos reais: fraudes desmascaradas via OSINT

**Narração:**
> "Meu nome é [Nome], perito criminal há [X] anos. Usei OSINT para resolver [X] casos de fraude, ocultação de patrimônio e background check. Hoje vou entregar o passo a passo completo, sem enrolação."

---

### 🔍 PARTE 1: O QUE É OSINT E LEGALIDADE (LGPD) (1:45 - 3:15)

**Infográfico animado:**

```
┌─────────────────────────────────────────────┐
│ OSINT = Open Source Intelligence            │
│ (Inteligência de Fontes Abertas)            │
├─────────────────────────────────────────────┤
│ DEFINIÇÃO:                                  │
│ Coleta, análise e uso de informações        │
│ PUBLICAMENTE ACESSÍVEIS para investigação   │
│                                             │
│ FONTES:                                     │
│ ✅ Redes sociais públicas                   │
│ ✅ Sites governamentais (.gov.br)           │
│ ✅ Bancos de dados abertos                  │
│ ✅ Registros públicos                       │
│ ✅ Notícias e publicações                   │
│                                             │
│ NÃO É OSINT:                                │
│ ❌ Invadir contas privadas (crime!)         │
│ ❌ Criar perfis falsos (viola ToS)          │
│ ❌ Interceptar mensagens (crime!)           │
│ ❌ Hackear sistemas (crime!)                │
└─────────────────────────────────────────────┘
```

**Narração:**
> "OSINT é 100% legal porque usa APENAS dados públicos. Se alguém publica uma foto no Instagram com perfil público, é informação manifestamente pública segundo a LGPD (Lei 13.709/2018, Art. 7º, VI). Mas atenção: finalidade legítima é obrigatória - você pode usar para investigação, compliance, due diligence, background check. NÃO pode usar para perseguição, discriminação ou venda de dados."

**Alerta visual grande:**
🚨 **NUNCA FAÇA:**
- Invadir contas privadas (Art. 154-A CP - Invasão de dispositivo informático)
- Criar perfis falsos para acessar contas privadas
- Usar scraping massivo automatizado (viola Termos de Uso)

---

### 📊 PARTE 2: PANORAMA DAS REDES SOCIAIS NO BRASIL (3:15 - 4:15)

**Infográfico visual com ícones das redes:**

```
🇧🇷 BRASIL - REDES SOCIAIS 2024/2025

📱 WhatsApp: 147 milhões (93,4% dos internautas)
📸 Instagram: 134,6 milhões (rede favorita - 35,9%)
🎥 YouTube: 144 milhões
🎵 TikTok: 120 milhões
👥 Facebook: 111,3 milhões
💼 LinkedIn: 75 milhões (maior mercado da América Latina)

🕐 Tempo médio diário: 3h37min (Brasil é 3º no mundo!)
👥 Usuários ativos: 144 milhões (66,3% da população)
```

**Narração:**
> "144 milhões de brasileiros usam redes sociais ATIVAMENTE. E a maioria compartilha informações públicas: localização, viagens, amigos, emprego, até padrão de vida. Para investigadores, isso é OURO. Vamos aprender a extrair inteligência dessas fontes."

---

### 🛠️ PARTE 3: FERRAMENTAS OSINT ESSENCIAIS (4:15 - 7:30)

#### **Ferramenta 1: Sherlock - Busca de Username em 300+ Redes (4:15 - 5:00)**

**Tela compartilhada:** Terminal executando Sherlock

**Demonstração prática:**

```bash
$ sherlock joaosilva123

[*] Checking username joaosilva123 on:

[+] Instagram: https://instagram.com/joaosilva123 ✓
[+] Twitter: https://twitter.com/joaosilva123 ✓
[+] LinkedIn: https://linkedin.com/in/joaosilva123 ✓
[+] GitHub: https://github.com/joaosilva123 ✓
[+] TikTok: https://tiktok.com/@joaosilva123 ✓
[-] Reddit: Not Found
[-] Pinterest: Not Found

[+] Total: 5 perfis encontrados
```

**Narração:**
> "🔥 Sherlock é SENSACIONAL! Você digita um username (ex: @joaosilva123) e ele busca em mais de 300 redes sociais automaticamente. Em segundos, você descobre TODOS os perfis da pessoa. Instalação gratuita no GitHub."

**Link visual:** github.com/sherlock-project/sherlock

---

#### **Ferramenta 2: Google Dorks - Operadores Avançados (5:00 - 6:00)**

**Split screen:** Google com buscas avançadas + explicação

**Exemplos práticos:**

**Busca 1: Perfis no Instagram**
```
site:instagram.com "João Silva Santos"
```
**Resultado:** Perfis do Instagram que mencionam "João Silva Santos"

**Busca 2: Currículos em PDF**
```
filetype:pdf "João Silva" "currículo"
```
**Resultado:** PDFs com currículos contendo o nome

**Busca 3: Perfis LinkedIn de empresa específica**
```
site:linkedin.com "Empresa XYZ" AND "Gerente"
```
**Resultado:** Gerentes da Empresa XYZ no LinkedIn

**Busca 4: Eventos no Facebook**
```
site:facebook.com/events "Empresa ABC"
```
**Resultado:** Eventos relacionados à Empresa ABC

**Narração:**
> "Google Dorks são operadores mágicos que transformam o Google em ferramenta de investigação profissional. Operadores principais: `site:` (filtrar domínio), `filetype:` (tipo de arquivo), `intitle:` (título), `inurl:` (URL), `AND/OR` (combinar termos)."

**Dica visual:**
> 💡 **DICA PRO:** Combine operadores: `site:linkedin.com "Empresa XYZ" -estagiário` (busca funcionários excluindo estagiários)

---

#### **Ferramenta 3: Maltego - Mapeamento de Conexões (6:00 - 6:45)**

**Tela compartilhada:** Interface do Maltego com grafo de conexões

**Visualização:**
```
          [João Silva]
         /      |      \
    [Maria]  [Carlos] [Ana]
       |        |        |
   [Empresa] [TJ-SP] [LinkedIn]
       |
  [Sócio: Pedro]
```

**Narração:**
> "Maltego é a ferramenta visual mais poderosa de OSINT. Você insere um nome, e-mail ou empresa, e o Maltego mapeia automaticamente: conexões no LinkedIn, perfis de redes sociais, domínios web, IPs, empresas relacionadas. Gera um GRAFO visual de toda a rede de relacionamentos. Existe versão gratuita (Community Edition)."

**Casos de uso:**
- Mapear sócios de empresas e suas interconexões
- Identificar vínculos ocultos entre investigados
- Rastrear infraestrutura de phishing/fraude

---

#### **Ferramenta 4: OSINT Brazuca - Repositório Brasileiro (6:45 - 7:30)**

**Tela compartilhada:** GitHub do OSINT Brazuca

**Narração:**
> "OSINT Brazuca é o projeto brasileiro MAIS COMPLETO de ferramentas OSINT. Mais de 1.600 links organizados: consultas de CPF, CNPJ, tribunais, cartórios, DETRAN, tudo em um só lugar!"

**Link visual grande:** github.com/osintbrazuca/osint-brazuca

**Categorias principais:**
- 🔍 Buscas de CPF/CNPJ
- ⚖️ Tribunais e processos
- 🏢 Empresas e sócios
- 🚗 Veículos (DETRAN)
- 📰 Diários Oficiais
- 🌐 Redes sociais
- 🔐 Dark Web (com avisos legais)

**Narração:**
> "É o canivete suíço do investigador forense brasileiro. SEMPRE comece suas investigações por aqui!"

---

### 🔬 PARTE 4: TÉCNICAS AVANÇADAS (7:30 - 10:30)

#### **Técnica 1: Busca Reversa de Imagens (7:30 - 8:15)**

**Tela compartilhada:** Google Images Reverse Search

**Demonstração:**

1. Acesse: images.google.com
2. Clique no ícone de câmera
3. Upload da foto do investigado ou cole URL
4. Google busca onde mais essa foto aparece

**Resultado exemplo:**
```
Foto encontrada em:
- Instagram: @joaosilva_real
- LinkedIn: João Silva - Gerente XYZ
- Site de notícias: Foto de evento corporativo 2023
- Modelo de banco de imagens (⚠️ foto roubada!)
```

**Narração:**
> "🔥 CASO REAL: Investigação de fraude matrimonial. Vítima enviou foto do 'pretendente' de app de namoro. Busca reversa revelou que a foto era de um modelo espanhol - golpista usando foto roubada. Golpe desmascarado em 2 minutos!"

**Ferramentas adicionais:**
- TinEye (tineye.com)
- Yandex Images (excelente para fotos internacionais)

---

#### **Técnica 2: Análise de Metadados EXIF em Fotos (8:15 - 9:00)**

**Tela compartilhada:** Ferramenta ExifTool

**Demonstração:**

```bash
$ exiftool foto.jpg

File Name                       : foto.jpg
Create Date                     : 2024:03:15 14:23:18
GPS Latitude                    : 23° 33' 1.23" S
GPS Longitude                   : 46° 38' 10.45" W
GPS Position                    : 23.5503417 S, 46.6362361 W
Camera Model Name               : iPhone 13 Pro
```

**Mapa visual:** Coordenadas GPS plotadas no Google Maps

**Narração:**
> "⚠️ ATENÇÃO: Fotos compartilhadas diretamente (WhatsApp, e-mail, sites pessoais) podem conter metadados EXIF: GPS onde foi tirada, data/hora exatas, modelo de câmera. Instagram e Facebook REMOVEM automaticamente esses dados, mas outras fontes não!"

**Caso real:**
> "Investigação de sequestro: foto enviada pelos sequestradores tinha metadados EXIF com coordenadas GPS do cativeiro. Vítima resgatada!"

**Ferramentas:**
- ExifTool (linha de comando)
- Jeffrey's Image Metadata Viewer (online)
- Metapicz (online)

---

#### **Técnica 3: Rastreamento de Geolocalização (9:00 - 9:45)**

**Montagem visual:** Posts do Instagram com geotags

**Técnica:**

1. Acessar perfil público do Instagram
2. Verificar posts com localização (geotags)
3. Mapear locais frequentados
4. Identificar padrões (residência, trabalho, lazer)

**Exemplo visual:**
```
Mapa com pins:
📍 Academia (5x por semana - manhã)
📍 Escritório (Segunda a Sexta)
📍 Restaurante X (Almoço frequente)
📍 Casa (Finais de semana)
```

**Narração:**
> "Geotags revelam ROTINA completa. Em investigações de ocultação de patrimônio, identificamos imóveis não declarados através de check-ins frequentes do investigado em locais específicos."

---

#### **Técnica 4: Análise de Conexões no LinkedIn (9:45 - 10:30)**

**Tela compartilhada:** Perfil LinkedIn + análise de conexões

**Passo a passo:**

1. Acessar perfil LinkedIn público do investigado
2. Ver conexões (se público)
3. Identificar padrões:
   - Conexões com pessoas sancionadas (Portal da Transparência)
   - Vínculos com empresas suspeitas
   - Histórico profissional divergente do currículo

**Caso real:**
> "Investigação de cartel em licitações: 5 empresários investigados compartilhavam 3 conexões em comum no LinkedIn - consultores que intermediavam acordos ilegais. Cartel desmantelado."

**Red Flags LinkedIn:**
- 🚨 Histórico profissional divergente do CNIS
- 🚨 Conexões com pessoas no CEIS (sancionadas)
- 🚨 Gaps (períodos sem emprego não explicados)
- 🚨 Cargo declarado incompatível com formação

---

### 🎯 PARTE 5: CASOS REAIS - OSINT EM AÇÃO (10:30 - 12:00)

**Montagem visual estilo documentário (3 casos)**

#### **Caso 1: Fraude Previdenciária Desmascarada (10:30 - 11:00)**

**Contexto visual:**
> "Segurado do INSS alegava incapacidade total para o trabalho. Recebia auxílio-doença há 18 meses."

**Investigação:**
- Busca no Instagram (perfil público)
- 15 posts em 3 meses: crossfit, corrida, surf
- Vídeos de treinos intensos
- Geotags em academias

**Resultado:**
> "Benefício cancelado. Processo por estelionato instaurado. Recuperação de R$ 54 mil pagos indevidamente."

---

#### **Caso 2: Patrimônio Oculto em Divórcio (11:00 - 11:30)**

**Contexto:**
> "Divórcio litigioso. Marido alegava 'situação financeira crítica'. Declarava renda de R$ 8 mil/mês."

**Investigação via OSINT:**
- LinkedIn: cargo de "Diretor Comercial" em empresa de tecnologia (não declarada)
- Instagram: 12 viagens internacionais em 18 meses (Dubai, Paris, NY)
- Facebook: check-ins em restaurantes de luxo, eventos VIP
- Busca reversa de foto: carro Porsche (R$ 800 mil)

**Resultado:**
> "Cruzamento revelou empresa com faturamento de R$ 12 milhões/ano. Juiz ajustou pensão e bloqueou bens."

---

#### **Caso 3: Perfil Fake de Executivo Descoberto (11:30 - 12:00)**

**Contexto:**
> "Background check de candidato a CEO de multinacional. Currículo impecável."

**Investigação:**
- Sherlock: username testado - 0 perfis encontrados (🚨 RED FLAG!)
- Google: nome completo - nenhum resultado relevante
- LinkedIn: perfil criado há 3 meses (recente demais para executivo sênior)
- Busca reversa foto do perfil: foto de banco de imagens (estoque!)

**Resultado:**
> "Perfil completamente falso. Investigação adicional revelou identidade roubada. Contratação bloqueada."

---

### 📊 CONCLUSÃO E PRÓXIMOS PASSOS (12:00 - 13:00)

**Recap visual:**

✅ **OSINT** = Inteligência de fontes públicas (100% legal)
✅ **Ferramentas essenciais:**
   - Sherlock (busca username)
   - Google Dorks (operadores avançados)
   - Maltego (mapeamento visual)
   - OSINT Brazuca (fontes brasileiras)
✅ **Técnicas:**
   - Busca reversa de imagens
   - Análise de metadados EXIF
   - Rastreamento de geolocalização
   - Análise de conexões LinkedIn

**Narração final:**
> "OSINT não é sobre invadir privacidade. É sobre usar inteligência para proteger empresas, identificar fraudes e tomar decisões informadas com dados públicos. Use com ética, responsabilidade e sempre dentro da LGPD!"

**Recursos:**

📥 **Download grátis:** Checklist de Background Check
📚 **Artigo completo:** OSINT em Redes Sociais (link blog)
🔗 **OSINT Brazuca:** github.com/osintbrazuca/osint-brazuca
📚 **Próxima série:** Técnicas Avançadas de Investigação Forense

---

### 📢 CALL TO ACTION (13:00 - 13:30)

🔔 **Inscreva-se** no canal - próximos vídeos: Investigação Forense Avançada
👍 **Deixe seu like** se você aprendeu algo novo
💬 **Comente:** Qual ferramenta OSINT você já conhecia? Qual foi novidade?

**Pergunta de engajamento:**
> "Você já usou OSINT em alguma investigação? Conta aqui nos comentários!"

---

## 🎨 ELEMENTOS VISUAIS

- ✅ Demonstrações em tempo real de ferramentas
- ✅ Screenshots de resultados reais (anonimizados)
- ✅ Grafos visuais (Maltego)
- ✅ Mapas de geolocalização
- ✅ Montagem de casos reais (estilo investigativo)
- ✅ Alertas legais destacados (LGPD, crimes)
- ✅ Lower thirds com credenciais do apresentador

---

## 📊 MÉTRICAS DE SUCESSO

- 🎯 **Retenção média:** 60%+ (conteúdo altamente engajador)
- 🎯 **AVD:** 8+ minutos
- 🎯 **CTR:** 6%+ (thumbnail com ferramentas + "OSINT")
- 🎯 **Conversão checklist:** 20-30%
- 🎯 **Compartilhamentos:** Alto (conteúdo prático único)

---

## 🔗 LINKS NA DESCRIÇÃO

**Ferramentas Mencionadas:**
- Sherlock: https://github.com/sherlock-project/sherlock
- Maltego: https://www.maltego.com/
- OSINT Brazuca: https://github.com/osintbrazuca/osint-brazuca
- ExifTool: https://exiftool.org/
- Google Images Reverse: https://images.google.com/
- TinEye: https://tineye.com/

**Recursos Gratuitos:**
- Checklist Background Check (PDF): [link]
- Artigo: OSINT em Redes Sociais (Guia Completo): [link blog]
- Série "Fontes Públicas Brasil" (10 posts): [link]

**Legislação:**
- LGPD (Lei 13.709/2018): http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- Código Penal - Art. 154-A (Invasão de dispositivo): [link]

---

## 📝 TIMESTAMPS (CAPÍTULOS)

0:00 - Introdução: O Poder do OSINT
0:45 - O que é OSINT e legalidade (LGPD)
1:45 - Panorama redes sociais Brasil 2025
3:15 - Ferramenta #1: Sherlock (busca username)
4:15 - Ferramenta #2: Google Dorks (operadores avançados)
5:00 - Ferramenta #3: Maltego (mapeamento conexões)
6:00 - Ferramenta #4: OSINT Brazuca (fontes brasileiras)
6:45 - Técnica avançada #1: Busca reversa de imagens
7:30 - Técnica avançada #2: Análise EXIF (metadados)
8:15 - Técnica avançada #3: Rastreamento geolocalização
9:00 - Técnica avançada #4: Análise LinkedIn
9:45 - Caso real #1: Fraude previdenciária
10:30 - Caso real #2: Patrimônio oculto divórcio
11:00 - Caso real #3: Perfil fake de executivo
11:30 - Conclusão e recursos gratuitos
12:00 - CTA e próximos vídeos

---

## ✅ CHECKLIST PRÉ-PUBLICAÇÃO

- [ ] Vídeo editado com demonstrações práticas
- [ ] Legendas em português
- [ ] Thumbnail: ferramentas OSINT + texto "Investigação 2025"
- [ ] Título SEO: "OSINT em Redes Sociais: Ferramentas e Técnicas (2025) | Investigação Digital"
- [ ] Tags: OSINT, redes sociais, investigação digital, Sherlock, Maltego, Google Dorks, LGPD, background check, Instagram, LinkedIn
- [ ] Avisos legais sobre LGPD e uso ético
- [ ] Links de ferramentas testados
- [ ] Playlist: "Tutoriais - Fontes Públicas Brasil"

---

**Status:** ✅ Roteiro completo - Pronto para gravação
**Estimativa produção:** 3-4 dias (gravação + edição com muitas demos)
**Potencial viral:** Alto (OSINT é trending topic em 2025)
