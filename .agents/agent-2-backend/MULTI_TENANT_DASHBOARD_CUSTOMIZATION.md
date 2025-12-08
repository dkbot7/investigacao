# 🎨 MULTI-TENANT DASHBOARD CUSTOMIZATION

**Pergunta:** Cada tenant pode ter uma área /dashboard diferente dos outros?

**Resposta Curta:** ✅ **SIM!** E temos 3 opções de implementação.

---

## 📊 SITUAÇÃO ATUAL

### ✅ **Multi-Tenancy JÁ IMPLEMENTADO**

O sistema **já possui** infraestrutura completa de multi-tenancy:

**Backend (D1 Database):**
```sql
-- Tabela de tenants
CREATE TABLE tenants (
  id INTEGER PRIMARY KEY,
  tenant_code TEXT UNIQUE NOT NULL,    -- Ex: "CLIENTE_01", "PREFEITURA_SP"
  name TEXT NOT NULL,                   -- Ex: "Cliente 01", "Prefeitura de São Paulo"
  status TEXT DEFAULT 'active'          -- active, inactive, suspended
);

-- Mapeamento usuário ↔ tenant
CREATE TABLE user_tenants (
  user_id TEXT NOT NULL,
  tenant_code TEXT NOT NULL,
  access_level TEXT DEFAULT 'viewer'    -- admin, editor, viewer
);
```

**Frontend:**
- ✅ Hook `useTenant()` detecta tenant do usuário
- ✅ API `GET /api/tenant/info` retorna tenant ativo
- ✅ Todas as consultas filtradas por `tenant_code`

---

## 🎯 OPÇÕES DE CUSTOMIZAÇÃO

---

## **OPÇÃO 1: MÓDULOS HABILITADOS/DESABILITADOS** ⭐ (Recomendado)

**Conceito:** Cada tenant pode ter módulos do dashboard ativados ou desativados.

### Exemplo:
```
CLIENTE_01 (Prefeitura):
  ✅ Funcionários
  ✅ Óbitos
  ✅ Vínculos
  ✅ Benefícios
  ❌ Candidatos (não precisa)
  ❌ Doadores (não precisa)

CLIENTE_02 (Empresa Privada):
  ✅ Funcionários
  ✅ Vínculos
  ✅ Sancionados CEIS
  ✅ OFAC
  ❌ Óbitos (não precisa)
  ❌ Benefícios (não precisa)
```

### Implementação:

#### **1. Adicionar campo `settings` na tabela tenants:**

```sql
-- Migration: 004_add_tenant_settings.sql
ALTER TABLE tenants ADD COLUMN settings TEXT DEFAULT '{}';

-- Exemplo de settings JSON:
{
  "modules": {
    "funcionarios": { "enabled": true },
    "obitos": { "enabled": true },
    "vinculos": { "enabled": true },
    "beneficios": { "enabled": true },
    "sancionados": { "enabled": true },
    "candidatos": { "enabled": false },
    "doadores": { "enabled": false },
    "ofac": { "enabled": false }
  },
  "branding": {
    "logo_url": "https://...",
    "primary_color": "#1e40af",
    "company_name": "Prefeitura Municipal"
  },
  "limits": {
    "max_funcionarios": 10000,
    "max_consultas_mes": 5000
  }
}
```

#### **2. Endpoint de configuração (Backend):**

```typescript
// GET /api/admin/tenants/:code/settings
router.get('/tenants/:code/settings', authMiddleware, async (c) => {
  const { code } = c.req.param();

  const tenant = await c.env.DB.prepare(
    'SELECT settings FROM tenants WHERE tenant_code = ?'
  ).bind(code).first();

  return c.json({
    settings: JSON.parse(tenant.settings || '{}')
  });
});

// PUT /api/admin/tenants/:code/settings
router.put('/tenants/:code/settings', authMiddleware, async (c) => {
  const { code } = c.req.param();
  const settings = await c.req.json();

  await c.env.DB.prepare(
    'UPDATE tenants SET settings = ?, updated_at = CURRENT_TIMESTAMP WHERE tenant_code = ?'
  ).bind(JSON.stringify(settings), code).run();

  return c.json({ success: true });
});
```

#### **3. Hook no Frontend:**

```typescript
// hooks/useTenantSettings.ts
export function useTenantSettings() {
  const { tenant } = useTenant();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (tenant) {
      fetch(`/api/admin/tenants/${tenant.code}/settings`)
        .then(res => res.json())
        .then(data => setSettings(data.settings));
    }
  }, [tenant]);

  const isModuleEnabled = (module: string) => {
    return settings?.modules?.[module]?.enabled ?? true;
  };

  return { settings, isModuleEnabled };
}
```

#### **4. Uso no Dashboard:**

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout() {
  const { isModuleEnabled } = useTenantSettings();

  return (
    <Sidebar>
      <NavItem href="/dashboard/funcionarios">Funcionários</NavItem>

      {isModuleEnabled('obitos') && (
        <NavItem href="/dashboard/obitos">Óbitos</NavItem>
      )}

      {isModuleEnabled('vinculos') && (
        <NavItem href="/dashboard/vinculos">Vínculos</NavItem>
      )}

      {isModuleEnabled('beneficios') && (
        <NavItem href="/dashboard/beneficios">Benefícios</NavItem>
      )}

      {/* ... outros módulos condicionais */}
    </Sidebar>
  );
}
```

#### **5. Página de Admin (Configurar Módulos):**

```typescript
// app/admin/tenants/[code]/settings/page.tsx
export default function TenantSettingsPage({ params }) {
  const { code } = params;
  const [modules, setModules] = useState({});

  const handleToggleModule = (moduleName: string) => {
    setModules(prev => ({
      ...prev,
      [moduleName]: { enabled: !prev[moduleName]?.enabled }
    }));
  };

  const handleSave = async () => {
    await fetch(`/api/admin/tenants/${code}/settings`, {
      method: 'PUT',
      body: JSON.stringify({ modules })
    });
  };

  return (
    <div>
      <h1>Configurar Módulos - {code}</h1>

      <Switch
        checked={modules.obitos?.enabled}
        onChange={() => handleToggleModule('obitos')}
        label="Módulo Óbitos"
      />

      <Switch
        checked={modules.vinculos?.enabled}
        onChange={() => handleToggleModule('vinculos')}
        label="Módulo Vínculos"
      />

      {/* ... outros módulos */}

      <Button onClick={handleSave}>Salvar Configurações</Button>
    </div>
  );
}
```

### ✅ **Vantagens:**
- ✅ Flexibilidade total por tenant
- ✅ Fácil de implementar
- ✅ Mesmo código, diferentes visualizações
- ✅ Admin pode ativar/desativar via UI

### ❌ **Desvantagens:**
- Todos os módulos sempre carregam no código (bundle)
- Não permite customização de layout

---

## **OPÇÃO 2: TEMAS E BRANDING POR TENANT** 🎨

**Conceito:** Cada tenant tem visual/marca própria.

### Implementação:

```typescript
// Adicionar ao settings JSON:
{
  "branding": {
    "logo_url": "https://prefeitura-sp.gov.br/logo.png",
    "primary_color": "#1e40af",
    "secondary_color": "#0f172a",
    "company_name": "Prefeitura de São Paulo",
    "favicon_url": "https://...",
    "custom_css": "..."
  }
}
```

```typescript
// app/layout.tsx
export default function RootLayout() {
  const { settings } = useTenantSettings();

  return (
    <html>
      <head>
        <link rel="icon" href={settings?.branding?.favicon_url} />
        <style>{`
          :root {
            --primary: ${settings?.branding?.primary_color};
            --secondary: ${settings?.branding?.secondary_color};
          }
        `}</style>
      </head>
      <body>
        <Navbar logo={settings?.branding?.logo_url} />
        {children}
      </body>
    </html>
  );
}
```

### ✅ **Vantagens:**
- ✅ White-label completo
- ✅ Cada cliente tem sua marca

---

## **OPÇÃO 3: DASHBOARDS COMPLETAMENTE DIFERENTES** 🚀 (Avançado)

**Conceito:** Cada tenant tem dashboard totalmente diferente (layout, páginas, etc).

### Implementação:

```typescript
// Estrutura de pastas:
app/
  dashboard-prefeitura/      ← Layout específico para prefeituras
    page.tsx
    obitos/
    beneficios/

  dashboard-empresa/         ← Layout específico para empresas
    page.tsx
    vinculos/
    ofac/

  dashboard/                 ← Default genérico
    page.tsx
```

```typescript
// app/dashboard/page.tsx
export default async function DashboardRedirect() {
  const tenant = await getTenantInfo();

  // Redireciona para dashboard específico
  switch (tenant.type) {
    case 'prefeitura':
      redirect('/dashboard-prefeitura');
    case 'empresa':
      redirect('/dashboard-empresa');
    default:
      redirect('/dashboard-default');
  }
}
```

### ✅ **Vantagens:**
- ✅ Customização total
- ✅ Cada cliente tem experiência única

### ❌ **Desvantagens:**
- Manutenção duplicada
- Mais complexo
- Código duplicado

---

## 🎯 **RECOMENDAÇÃO**

### **USAR OPÇÃO 1 + OPÇÃO 2 COMBINADAS:**

1. **Módulos habilitados/desabilitados** (OPÇÃO 1)
2. **Branding customizado** (OPÇÃO 2)

**Resultado:**
- ✅ Mesma base de código
- ✅ Cada tenant ativa apenas módulos que precisa
- ✅ Cada tenant tem sua marca (logo, cores)
- ✅ Fácil manutenção
- ✅ Escalável

---

## 📋 **IMPLEMENTAÇÃO PASSO A PASSO**

### **PASSO 1: Migration (Backend)**

```sql
-- backend/workers/database/migrations/004_add_tenant_settings.sql
ALTER TABLE tenants ADD COLUMN settings TEXT DEFAULT '{}';
ALTER TABLE tenants ADD COLUMN tenant_type TEXT DEFAULT 'generic'; -- prefeitura, empresa, generic
```

### **PASSO 2: Endpoint de Settings (Backend)**

```typescript
// backend/workers/api/src/routes/tenants.routes.ts
router.get('/tenants/:code/settings', authMiddleware, getTenantSettings);
router.put('/tenants/:code/settings', authMiddleware, updateTenantSettings);
```

### **PASSO 3: Hook Frontend**

```typescript
// investigaree/src/hooks/useTenantSettings.ts
export function useTenantSettings() {
  // Implementação acima
}
```

### **PASSO 4: UI de Admin**

```typescript
// investigaree/src/app/admin/tenants/[code]/settings/page.tsx
// Página para admin configurar módulos
```

### **PASSO 5: Aplicar no Dashboard**

```typescript
// investigaree/src/app/dashboard/layout.tsx
// Sidebar condicional baseado em módulos habilitados
```

---

## 💡 **EXEMPLOS DE USO**

### **Exemplo 1: Prefeitura Municipal**
```json
{
  "tenant_code": "PREFEITURA_SP",
  "tenant_type": "prefeitura",
  "settings": {
    "modules": {
      "funcionarios": { "enabled": true },
      "obitos": { "enabled": true },
      "vinculos": { "enabled": true },
      "beneficios": { "enabled": true },
      "sancionados": { "enabled": true },
      "candidatos": { "enabled": false },
      "doadores": { "enabled": false },
      "ofac": { "enabled": false }
    },
    "branding": {
      "company_name": "Prefeitura de São Paulo",
      "logo_url": "https://prefeitura.sp.gov.br/logo.png",
      "primary_color": "#004080",
      "secondary_color": "#0066cc"
    }
  }
}
```

### **Exemplo 2: Empresa Privada (Compliance)**
```json
{
  "tenant_code": "EMPRESA_ABC",
  "tenant_type": "empresa",
  "settings": {
    "modules": {
      "funcionarios": { "enabled": true },
      "vinculos": { "enabled": true },
      "sancionados": { "enabled": true },
      "ofac": { "enabled": true },
      "obitos": { "enabled": false },
      "beneficios": { "enabled": false },
      "candidatos": { "enabled": false },
      "doadores": { "enabled": false }
    },
    "branding": {
      "company_name": "ABC Compliance Corp",
      "logo_url": "https://abc.com/logo.png",
      "primary_color": "#1e40af",
      "secondary_color": "#0f172a"
    }
  }
}
```

---

## ⏱️ **ESTIMATIVA DE IMPLEMENTAÇÃO**

### **Backend (Agent 2):**
- Migration: 15 minutos
- Endpoints settings: 1-2 horas
- Testes: 30 minutos

**Total Backend:** 2-3 horas

### **Frontend (Agent 3):**
- Hook `useTenantSettings`: 1 hora
- Sidebar condicional: 1 hora
- Página admin settings: 2-3 horas
- Branding system: 2-3 horas

**Total Frontend:** 6-8 horas

### **TOTAL GERAL:** 8-11 horas

---

## ✅ **DECISÃO**

**O que você quer fazer?**

**A) Implementar OPÇÃO 1 (Módulos on/off)** - 2-3h backend + 3-4h frontend
**B) Implementar OPÇÃO 1 + 2 (Módulos + Branding)** - 8-11h total
**C) Implementar OPÇÃO 3 (Dashboards diferentes)** - 20-30h (complexo)
**D) Apenas documentar e deixar para depois**

**Minha recomendação:** OPÇÃO B (Módulos + Branding) - máxima flexibilidade com manutenção fácil! 🚀

---

**Documentação criada por:** Agent 2 (Backend Engineer)
**Data:** 2025-12-08
**Status:** ✅ AGUARDANDO DECISÃO
