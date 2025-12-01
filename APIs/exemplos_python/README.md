# Exemplos Python - investigaree APIs

Exemplos de consulta às APIs de investigação em Python.

## Instalação

```bash
cd APIs/exemplos_python
pip install -r requirements.txt
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
# Infosimples
INFOSIMPLES_API_TOKEN=seu_token

# Portal da Transparência
PORTAL_TRANSPARENCIA_API_KEY=sua_chave

# BigDataCorp
BIGDATACORP_TOKEN=seu_token

# Escavador
ESCAVADOR_BEARER_TOKEN=seu_token

# investigaree API
INVESTIGAREE_API_URL=https://api.investigaree.com.br
INVESTIGAREE_TOKEN=seu_firebase_token
```

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `consultas_apis.py` | Classes para consultar APIs (Infosimples, Portal Transparência, etc) |
| `processamento_lote.py` | Script para processar lista de CPFs em lote |
| `requirements.txt` | Dependências Python |

## Uso Rápido

### Consulta Individual

```python
from consultas_apis import Infosimples, PortalTransparencia

# Verificar óbito
info = Infosimples()
resultado = info.verificar_obito('123.456.789-00', '01/01/1990')
print(resultado)

# Verificar benefícios
portal = PortalTransparencia()
auxilios = portal.consultar_auxilio_emergencial('12345678900')
print(f"Parcelas: {len(auxilios)}")
```

### Processamento em Lote

```bash
python processamento_lote.py --input funcionarios.xlsx --output resultado.xlsx
```

Opções:
- `--input`: Arquivo de entrada (Excel ou CSV)
- `--output`: Arquivo de saída
- `--coluna-cpf`: Nome da coluna com CPF (default: cpf)
- `--coluna-data`: Nome da coluna com data de nascimento
- `--coluna-nome`: Nome da coluna com nome
- `--delay`: Delay entre requisições em segundos (default: 0.5)

## APIs Suportadas

| API | Classe | Métodos |
|-----|--------|---------|
| Infosimples | `Infosimples` | `consultar_cpf`, `verificar_obito`, `consultar_cnpj` |
| Portal Transparência | `PortalTransparencia` | `consultar_auxilio_emergencial`, `consultar_bolsa_familia`, `consultar_bpc`, `consultar_ceis`, `consultar_cnep` |
| BigDataCorp | `BigDataCorp` | `consultar_processos_cpf`, `consultar_dados_completos` |
| Escavador | `Escavador` | `buscar_processos_cpf`, `obter_capa_processo`, `obter_movimentacoes` |
| investigaree | `InvestigareeAPI` | `obter_dashboard`, `listar_funcionarios`, `exportar_dados`, etc |

## Exemplo de Saída

```
=== Exemplo: Consulta CPF ===

CPF: 12345678900
Nome: JOÃO DA SILVA
Situação: REGULAR
Está morto: NÃO

=== Exemplo: Consulta Benefícios ===

Auxílio Emergencial: 5 parcelas encontradas
Total recebido: R$ 3.000,00

Nenhuma sanção CEIS encontrada
```

---

**Atualizado em:** 30/11/2025
