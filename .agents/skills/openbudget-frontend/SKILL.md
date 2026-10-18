---
name: openbudget-frontend
description: >-
  Guia de arquitetura, padrões de código, componentes, design tokens e fluxo de dados do frontend OpenBudget (openbudget-app) — Angular 21 / Tailwind CSS v4 / Signals / RxJS / Autenticação via cookie HttpOnly.
  Use esta skill SEMPRE antes de criar, alterar, revisar ou depurar componentes, páginas, serviços, rotas e estilos neste repositório.
---

# OpenBudget App — Arquitetura & Padrões do Frontend

Aplicação SPA de finanças pessoais desenvolvida em **Angular 21 (Standalone)** consumindo a API REST do backend Spring Boot (`http://localhost:8080`).

---

## 1. Stack Tecnológica

| Camada / Ferramenta | Detalhes |
|---|---|
| **Framework** | Angular **21.2.0** (Standalone Components, Zoneless-ready, Control Flow `@if` / `@for`, Signals, `OnPush`) |
| **Estilização** | **Tailwind CSS v4** (`@tailwindcss/postcss: ^4.1.12`, configurado via `@import "tailwindcss";` + `@import "./tokens.css";` em `src/styles.css` — `src/tokens.css` centraliza o `@theme` com reset estrito) |
| **Tipografia** | `Inter` (sans, 300–700) + `JetBrains Mono` (mono, 400–700 — **máximo `font-bold`, nunca `font-black`**) com `tabular-nums` (`tnum`) para valores `BRL` |
| **Locale & Moeda** | `LOCALE_ID = 'pt-BR'` (`registerLocaleData(localePt)`) e `DEFAULT_CURRENCY_CODE = 'BRL'` em `app.config.ts` |
| **Rolagem / UX** | Scroll nativo estilizado (`4px`) ou `smooth-scrollbar` (desktop) + Cursor customizado com inversão (`mix-blend-mode: difference`) |
| **Gerenciamento de Estado** | Angular Signals (`signal`, `computed`, `input`, `output`, `model`) |
| **Comunicação HTTP** | `HttpClient` com interceptor anexando `withCredentials: true` (cookies de sessão JWT) |
| **Build / Testes** | `@angular/build` (esbuild/Vite runner), `vitest: ^4.0.8` |

---

## 2. Estrutura do Projeto (`src/app/`)

Cada componente em `src/app/ui/` reside em sua própria subpasta (`<camada>/<nome-do-componente>/`) contendo `.ts` e `.html` separados, unificando os layouts Desktop e Mobile via media queries (`md:*`):

```
src/
├── tokens.css                # Bloco @theme do Tailwind v4 com reset estrito e tokens do Design System
├── styles.css                # Import do Tailwind v4 + tokens.css, Studio Titanium gradient, scrollbar e cursor
└── app/
    ├── ui/                   # Design System componentizado (ver DESIGN.md §4–§13)
    │   ├── primitives/       # Nível 1: Átomos (ob-button, ob-badge, ob-icon-box, ob-marker, ob-money, ob-date)
    │   ├── components/       # Nível 2: Moléculas (ob-segmented-control, ob-stat, ob-metric-block, ob-panel, ob-panel-bar, ob-ledger-row, ob-transaction-item)
    │   ├── patterns/         # Nível 3: Organismos responsivos (ob-app-header, ob-toolbar, ob-insights-panel, ob-ledger, ob-day-details)
    │   └── behaviors/        # Comportamentos globais (ob-inverted-cursor)
    ├── components/           # Componentes de domínio
    │   └── transaction-form/ # Formulário para inclusão/edição de transações
    ├── guards/               # Guards de rota (ex: authGuard para proteger rota "/")
    ├── interceptors/         # HttpInterceptors (authInterceptor: withCredentials e redirect 401)
    ├── models/               # Modelos e DTOs TypeScript sincronizados com o backend
    │   ├── categories.ts     # Entidade Category (id, name, type)
    │   └── transactions.ts   # TransactionDTO, DaySnapshotDTO, ProjectionSnapshotDTO
    ├── pages/                # Componentes de visão de página (rotas principais — Nível 4 Layouts)
    │   ├── home/             # Shell do Dashboard Ledger-Centric unificado (Desktop 100dvh + Mobile)
    │   └── login/            # Tela de autenticação (email e senha)
    ├── services/             # Camada de integração HTTP e regras de negócio cliente
    │   ├── api.ts            # Wrapper base HTTP (baseUrl http://localhost:8080/)
    │   ├── auth.ts           # Autenticação (login, logout, perfil)
    │   └── transactions.ts   # Endpoints de transações e projeção diária (/transaction/generateview/)
    ├── app.config.ts         # Configuração de providers (HttpClient, Routes, LOCALE_ID pt-BR)
    └── app.routes.ts         # Definição de rotas principais
```

---

## 3. Fluxo de Autenticação & Integração com Backend

1. **Cookie HttpOnly (`acessToken`)**:
   - O backend não retorna o JWT no corpo do login; ele define um cookie `Set-Cookie: acessToken=...; HttpOnly; SameSite=Lax`.
   - Todas as requisições do frontend devem incluir credenciais. O interceptor [`authInterceptor`](file:///C:/Users/diego/openbudget-app/src/app/interceptors/auth-interceptor.ts) injeta `withCredentials: true`.
   - Se qualquer resposta retornar status `401 Unauthorized`, o interceptor redireciona automaticamente para `/login`.

2. **CORS & Portas**:
   - Frontend roda por padrão em `http://localhost:4200`.
   - Backend roda por padrão em `http://localhost:8080`.
   - O backend possui CORS liberado expressamente para `http://localhost:4200` com `allowCredentials(true)`.

---

## 4. Design System Oficial (Technical Brutalism — Titanium & Obsidian)

> **FONTE DA VERDADE OBRIGATÓRIA:** Antes de criar ou editar qualquer componente visual, leia [`DESIGN.md`](file:///C:/Users/diego/openbudget-app/DESIGN.md) na raiz do repositório. O protótipo de referência interativo está em [`prototype.html`](file:///C:/Users/diego/openbudget-app/prototype.html). Em caso de divergência entre o protótipo e a especificação, **prevalece sempre o [`DESIGN.md`](file:///C:/Users/diego/openbudget-app/DESIGN.md)** (consulte a §11 do `DESIGN.md` para a lista de 19 normalizações).

### 4.1. Os 7 Princípios Invioláveis
1. **Geometria 90° Estrita (`rounded-none`):** Proibido qualquer `rounded-*` ou `border-radius > 0` em elementos de UI. A única exceção é o cursor circular customizado (`#custom-cursor`).
2. **Monocromia Absoluta:** Paleta restrita a obsidiana (`#050507`, `#0A0A0E`), zinco/prata (`#52525B` a `#F4F4F6`) e branco puro (`#FFFFFF`). **Zero cores externas** (proibido azul, laranja, verde, vermelho ou amarelo). A distinção entre entrada (`+`), saída (`-`) e alerta (`!`) é feita por **sinal tipográfico, peso, opacidade e estilo de borda**.
3. **Estrutura por Linhas de 1px:** Divisões feitas com bordas de `1px solid` (`border-line`, `border-line-strong`) e hairlines de `1px` (`bg-white/10`), nunca com sombras coloridas ou cards flutuantes.
4. **Fundo Studio Titanium Gradient:** `radial-gradient(ellipse 90% 55% at 50% -10%, rgba(255,255,255,0.09) 0%, rgba(161,161,170,0.03) 45%, rgba(5,5,7,0) 80%), linear-gradient(180deg, #0D0D12 0%, #050507 100%)` no `body`. **Proibido usar grid quadriculado ao fundo.**
5. **Layout Ledger-Centric & Zero Texto Óbvio:** O extrato diário ocupa o centro do viewport; textos instrucionais óbvios são proibidos.
6. **Hierarquia de Ação em Branco Puro:** CTAs primários usam fundo `#FFFFFF` sólido + texto `#050507` em `font-mono uppercase`.
7. **Alinhamento Numérico Tabular:** Todo valor monetário, data ou contador usa `font-mono tabular-nums`.

### 4.2. Tokens Semânticos Principais (`@theme` em `src/styles.css`)

| Categoria | Token Tailwind v4 | Valor | Uso |
|---|---|---|---|
| **Superfícies** | `bg-canvas` / `bg-surface` | `#050507` / `#0A0A0E` | Fundo base / Painéis e barras |
| | `bg-surface-drawer` | `#070709` | Gaveta expandida de transações do dia |
| | `bg-surface-hover` / `bg-surface-today` | `rgba(255,255,255,0.03)` / `0.04` | Hover de linha / Fundo da linha HOJE |
| | `bg-accent` | `#FFFFFF` | Fundo de CTA primário, indicador ativo, cursor |
| **Texto** | `text-fg-pure` / `text-fg` | `#FFFFFF` / `#F4F4F6` | Títulos, entradas `+`, CTAs / Texto primário |
| | `text-fg-secondary` / `text-fg-muted` | `#D4D4D8` / `#A1A1AA` | Descrições, saídas `-` / Subtítulos, controles inativos |
| | `text-fg-subtle` / `text-fg-faint` | `#71717A` / `#52525B` | Rótulos técnicos, cabeçalhos / Traços `--`, desabilitados |
| | `text-fg-inverse` | `#050507` | Texto sobre fundo branco (`bg-accent`) |
| **Bordas** | `border-line-subtle` / `border-line` | `rgba(255,255,255,0.05)` / `0.10` | Divisores internos / Bordas estruturais padrão (1px) |
| | `border-line-strong` / `border-line-heavy` | `rgba(255,255,255,0.20)` / `0.30` | Controles e botões / Hover forte e foco |
| | `border-accent` | `#FFFFFF` | Borda esquerda de 4px da linha HOJE (`border-l-4`) |

### 4.3. Regras Críticas de Layout & Componentes (`DESIGN.md` §4–§9)
- **Gutter de Alinhamento Vertical (`24px` / `px-6`):** Barra de status do painel (`ob-panel-bar`), cabeçalho de colunas do ledger, linhas do extrato (`ob-ledger-row`) e gaveta de detalhes (`ob-day-details`) devem usar `px-6` (`24px`) para alinhamento vertical perfeito.
- **Grade do Ledger (5 Colunas no Desktop):** `grid-cols-12` com: `col-span-2` (Data) + `col-span-4` (Movimentações) + `col-span-2` (Entradas) + `col-span-2` (Saídas) + `col-span-2` (Saldo Projetado).
- **Destaque da Linha "HOJE":** Exclusivamente via `border-l-4 border-l-accent bg-surface-today` (compensando o padding esquerdo com `pl-5` = `20px + 4px = 24px`). **Proibido** exibir badge ou texto `(HOJE)`.
- **Gaveta de Transações do Dia (`ob-day-details`):** **Sempre em lista vertical** (`flex flex-col divide-y divide-line`), um item abaixo do outro em largura total (`w-full`). **Proibido** layout de cards lado a lado.
- **Botão `INCLUIR NESTE DIA`:** Posicionado **sempre abaixo da lista de transações** (`pt-3.5`), usando `ob-button[variant="primary"][size="sm"]` (`bg-accent text-fg-inverse`).
- **Painel de Insights (`ob-insights-panel`):** Recolhido por padrão em uma barra fina de 1 linha (`px-5 py-2.5`), expansível sob demanda em grade de 4 colunas (`divide-x divide-line`).
- **Cursor Invertido (`ob-inverted-cursor`):** Círculo branco de `18px` (`30px` em hover sobre clicáveis) com `mix-blend-mode: difference`, `pointer-events: none` e `cursor: none !important` em dispositivos `pointer: fine`.

---

## 5. Convenções e Boas Práticas de Código

1. **Angular 21 Standalone & Signals**:
   - Componentes `standalone: true` com `ChangeDetectionStrategy.OnPush`.
   - Use as APIs baseadas em signals: `input()`, `input.required()`, `output()`, `model()`, `signal()`, `computed()`.
2. **Componentização em 4 Níveis (`src/app/ui/`)**:
   - Reutilize e componha na ordem: **Primitives (`§4`) → Components (`§5`) → Patterns (`§6`) → Layouts (`§8`)**.
   - Nunca duplique botões, badges, valores monetários ou células de data fora dos primitivos `ob-*`.
3. **Tailwind CSS v4 (`src/styles.css`)**:
   - Configure todos os tokens via diretiva `@theme` em `src/styles.css` (conforme [`DESIGN.md §3`](file:///C:/Users/diego/openbudget-app/DESIGN.md#L129-L179)).
   - Nunca use cores arbitrárias ou classes legadas coloridas (`bg-blue-*`, `text-emerald-*`, `bg-red-*`, `.today-row { background-color: red }`).
4. **Formatação Monetária (`pt-BR`) e Datas**:
   - Registre `localePt` em `app.config.ts` para garantir formato `R$ 1.234,56`.
   - Use sempre `<ob-money>` (ou pipe `currency:'BRL'` com `font-mono tabular-nums`).
   - Datas em ISO `YYYY-MM-DD` para comparação segura de dia atual (`isToday`).
5. **Checklist de Revisão**:
   - Antes de concluir qualquer entrega visual, valide todos os 15 itens do **Checklist de Conformidade (`DESIGN.md §12`)**.

