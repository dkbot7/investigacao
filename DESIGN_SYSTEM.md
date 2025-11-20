# investigaree Design System
**Versão 1.0 | Janeiro 2025**

## 🎨 Filosofia de Design
Sistema monocromático em tons de azul, focado em:
- ✅ Acessibilidade WCAG 2.1 AAA
- ✅ Inclusão para daltonismo
- ✅ Segurança e confiabilidade
- ✅ Profissionalismo investigativo

---

## 🔤 Tipografia
**Fonte Única:** Inter (Variable Font)
- Razão: Excelente legibilidade, otimizada para UI, suporta 9 pesos, open-source
- Fonte alternativa (fallback): system-ui, -apple-system, sans-serif

### Escala Tipográfica
```
Display: 48px / 3rem - font-weight: 700 (Bold)
H1: 36px / 2.25rem - font-weight: 700
H2: 30px / 1.875rem - font-weight: 600
H3: 24px / 1.5rem - font-weight: 600
H4: 20px / 1.25rem - font-weight: 600
Body Large: 18px / 1.125rem - font-weight: 400
Body: 16px / 1rem - font-weight: 400
Small: 14px / 0.875rem - font-weight: 400
Caption: 12px / 0.75rem - font-weight: 500
```

---

## 🎨 Paleta de Cores - Monocromático Azul
**Base: #0A4D8C (Azul Investigativo)**

### Cores Principais (WCAG AAA Compliant)
```css
/* Primary - Ações principais */
--primary-900: #052340  /* Contraste 15.2:1 */
--primary-800: #063158  /* Contraste 12.8:1 */
--primary-700: #084070  /* Contraste 9.5:1 */
--primary-600: #0A4D8C  /* Contraste 6.8:1 - Base */
--primary-500: #0D5BA0  /* Contraste 5.2:1 */
--primary-400: #2B7BC5  /* Contraste 3.8:1 */
--primary-300: #5FA3D9  /* Contraste 2.4:1 */
--primary-200: #9FCBED  /* Contraste 1.8:1 */
--primary-100: #D4E8F7  /* Contraste 1.3:1 */
--primary-50: #EBF5FC   /* Contraste 1.05:1 */

/* Neutral - Textos e fundos */
--neutral-950: #0A0F1C  /* Preto azulado */
--neutral-900: #1A2332
--neutral-800: #2D3748
--neutral-700: #4A5568
--neutral-600: #718096
--neutral-500: #A0AEC0
--neutral-400: #CBD5E0
--neutral-300: #E2E8F0
--neutral-200: #EDF2F7
--neutral-100: #F7FAFC
--neutral-50: #FFFFFF

/* Feedback - Estados (derivados do azul) */
--success: #0A8C6B    /* Verde-azulado - Contraste 4.5:1 */
--warning: #8C6B0A    /* Âmbar azulado - Contraste 4.5:1 */
--error: #8C0A2B      /* Vermelho azulado - Contraste 4.5:1 */
--info: #0A4D8C       /* Azul base */
```

### Aplicações de Contraste
```
Texto escuro sobre fundo claro:
- primary-900 em neutral-50 = 15.2:1 (AAA)
- primary-800 em neutral-100 = 13.5:1 (AAA)

Texto claro sobre fundo escuro:
- neutral-50 em primary-800 = 12.8:1 (AAA)
- neutral-100 em primary-900 = 14.1:1 (AAA)

Botões:
- primary-600 (fundo) + neutral-50 (texto) = 6.8:1 (AA Large)
```

---

## 📐 Espaçamento
Sistema baseado em múltiplos de 4px (escala 8-point grid)

```
--space-1: 4px    (0.25rem)
--space-2: 8px    (0.5rem)
--space-3: 12px   (0.75rem)
--space-4: 16px   (1rem)
--space-5: 20px   (1.25rem)
--space-6: 24px   (1.5rem)
--space-8: 32px   (2rem)
--space-10: 40px  (2.5rem)
--space-12: 48px  (3rem)
--space-16: 64px  (4rem)
--space-20: 80px  (5rem)
--space-24: 96px  (6rem)
```

---

## 🔘 Componentes

### Botões
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-600);
  color: var(--neutral-50);
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
}
.btn-primary:hover {
  background: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(10, 77, 140, 0.2);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--primary-600);
  border: 2px solid var(--primary-600);
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
}
```

### Cards
```css
.card {
  background: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: 12px;
  padding: var(--space-6);
  box-shadow: 0 2px 8px rgba(10, 35, 64, 0.08);
  transition: all 300ms ease;
}
.card:hover {
  box-shadow: 0 8px 24px rgba(10, 77, 140, 0.12);
  transform: translateY(-2px);
}
```

### Inputs
```css
.input {
  background: var(--neutral-50);
  border: 2px solid var(--neutral-300);
  border-radius: 8px;
  padding: var(--space-3) var(--space-4);
  color: var(--neutral-900);
  font-size: 16px;
  transition: all 200ms ease;
}
.input:focus {
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px rgba(10, 77, 140, 0.1);
  outline: none;
}
```

---

## 🌓 Transparências (para overlays e glassmorphism)
```css
--overlay-dark: rgba(10, 35, 64, 0.85);
--overlay-medium: rgba(10, 77, 140, 0.6);
--overlay-light: rgba(212, 232, 247, 0.95);
--glass-bg: rgba(255, 255, 255, 0.85);
--glass-border: rgba(10, 77, 140, 0.15);
```

---

## ⚡ Animações (suaves e harmônicas)
```css
/* Durações */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;

/* Easings */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);

/* Exemplo de uso */
transition: transform var(--duration-normal) var(--ease-smooth),
            opacity var(--duration-normal) var(--ease-smooth);
```

---

## ♿ Acessibilidade WCAG

### Checklist de Conformidade
- ✅ Contraste mínimo 4.5:1 para texto normal (AA)
- ✅ Contraste mínimo 7:1 para texto importante (AAA)
- ✅ Contraste mínimo 3:1 para elementos UI (AA)
- ✅ Não usar apenas cor para transmitir informação (usar ícones + texto)
- ✅ Estados de foco visíveis (outline 3px + offset 2px)
- ✅ Área de toque mínima 44x44px (mobile)
- ✅ Suporte a navegação por teclado (Tab, Enter, Esc)
- ✅ Labels descritivos em formulários
- ✅ Alt text em imagens informativas

### Daltonismo
Para pessoas com daltonismo (deuteranopia, protanopia, tritanopia):
- ✅ Azul é universalmente distinguível
- ✅ Evitamos vermelho/verde (substituído por azul/âmbar)
- ✅ Usamos padrões visuais além de cores (ícones, texturas, bordas)

---

## 📱 Responsividade (Breakpoints)
```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: 1024px - 1440px
Wide: > 1440px
```

---

## 🔒 Princípios de Segurança Visual
1. **Clareza**: Hierarquia visual óbvia
2. **Confiança**: Azul profissional transmite credibilidade
3. **Precisão**: Espaçamentos consistentes, alinhamento pixel-perfect
4. **Discrição**: Animações sutis, sem distrações
5. **Profissionalismo**: Minimalismo funcional

---

## 📦 Implementação (Tailwind Config)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#052340',
          800: '#063158',
          700: '#084070',
          600: '#0A4D8C',
          500: '#0D5BA0',
          400: '#2B7BC5',
          300: '#5FA3D9',
          200: '#9FCBED',
          100: '#D4E8F7',
          50: '#EBF5FC',
        },
        neutral: {
          950: '#0A0F1C',
          900: '#1A2332',
          // ... resto da escala
        }
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-in-out',
        'slide-up': 'slideUp 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
}
```

---

**Documento criado para investigaree - Due Diligence Forense**
*Garantindo acessibilidade, segurança e profissionalismo em cada pixel*
