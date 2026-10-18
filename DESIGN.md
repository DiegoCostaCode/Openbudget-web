# DESIGN.md — OpenBudget · Technical Brutalism

> Especificação de design do frontend OpenBudget (Angular 21 + Tailwind CSS v4).
> Escrita para ser seguida por humanos **e por outros modelos de IA**. Tudo aqui é normativo.

---

## 0. Como usar este documento

1. **Fonte da verdade:** este arquivo. O [`prototype.html`](./prototype.html) é a referência visual, mas onde os dois divergem **vale o DESIGN.md** (divergências listadas na §11).
2. **Hierarquia obrigatória:** `Tokens → Primitivos → Componentes → Padrões → Layouts`. Um nível só pode usar níveis abaixo dele.
3. **Nunca invente tokens, cores, raios ou sombras.** Se algo não existe aqui, componha a partir dos primitivos existentes. Se for realmente impossível, pare e pergunte.
4. **Classes canônicas:** as strings de classe de cada componente são o contrato. Copie-as; não "aproxime".
5. Antes de entregar qualquer UI, rode o **checklist da §12**.

---

## 1. Princípios (invioláveis)

| # | Princípio | Regra prática |
|---|---|---|
| P1 | **Geometria de 90°** | Zero `rounded-*`. Única exceção: o cursor (§9.1). |
| P2 | **Monocromia absoluta** | Só preto, grafite, prata e branco. **Proibido qualquer matiz** (azul, verde, vermelho, laranja…). Hierarquia vem de luminosidade, peso e borda. |
| P3 | **Sem sombras, sem gradientes em componentes** | O único gradiente do sistema é o fundo da página (§2.5). Nenhum `shadow-*`, `glow` ou `blur`. |
| P4 | **Extrato é o protagonista** | Layout *ledger-centric*: o extrato diário ocupa a largura total; o resto é secundário e compacto. |
| P5 | **Zero ruído textual** | Nada de textos didáticos ("Esta é sua projeção…", "Clique para…", "Categoria:"). Dados, datas e rótulos curtos falam por si. |
| P6 | **Precisão tipográfica** | Interface inteira em monoespaçada; todo número com `tabular-nums`. |
| P7 | **Revelação progressiva** | Insights começam recolhidos; detalhes do dia só abrem sob demanda. |

---

## 2. Tokens

### 2.1 Paleta primitiva (referência — **não use direto em componentes**)

| Primitivo | Hex | Observação |
|---|---|---|
| `obsidian-950` | `#050507` | Preto base |
| `obsidian-900` | `#0A0A0E` | Superfície de painéis |
| `obsidian-850` | `#101015` | Reservado (não usado) |
| `obsidian-800` | `#16161D` | Hover de superfície |
| `obsidian-700` | `#22222B` | Reservado (não usado) |
| `graphite-scroll` | `#272733` | Thumb do scrollbar |
| `silver-100` | `#FFFFFF` | Branco puro |
| `silver-200` | `#F4F4F6` | |
| `silver-300` | `#D4D4D8` | |
| `silver-400` | `#A1A1AA` | |
| `silver-500` | `#71717A` | |
| `silver-600` | `#52525B` | **Novo.** O protótipo usa `text-silver-600` sem defini-lo |
| `canvas-top` | `#09090E` | Só no gradiente de fundo |
| `canvas-bottom` | `#030305` | Só no gradiente de fundo |

### 2.2 Tokens semânticos de cor (**os únicos permitidos em componentes**)

**Superfícies**

| Token | Valor | Classe | Uso |
|---|---|---|---|
| `canvas` | `#050507` | `bg-canvas` | Fundo da página, header do app |
| `surface` | `#0A0A0E` | `bg-surface` | Painéis, itens de transação, cards |
| `surface-sunken` | `#050507` | `bg-surface-sunken` | Barras de painel, cabeçalho de colunas, gavetas internas |
| `surface-hover` | `#16161D` | `hover:bg-surface-hover` | Hover de botão secundário |

**Tints (sobreposição branca translúcida)**

| Token | Valor | Classe | Uso |
|---|---|---|---|
| `tint-hover` | `rgb(255 255 255 / .03)` | `hover:bg-tint-hover` | Hover de linhas e faixas clicáveis |
| `tint-selected` | `rgb(255 255 255 / .04)` | `bg-tint-selected` | Fundo da linha de hoje |
| `tint-fill` | `rgb(255 255 255 / .05)` | `bg-tint-fill` | Caixa de ícone, hover de segmento, card de hoje (mobile) |
| `tint-strong` | `rgb(255 255 255 / .10)` | `bg-tint-strong` | Badge, hover de botão tint |

**Linhas (bordas e divisores)**

| Token | Valor | Classe | Uso |
|---|---|---|---|
| `line-faint` | `rgb(255 255 255 / .10)` | `border-line-faint` / `divide-line-faint` | Divisores entre linhas do extrato, borda de item, caixa de ícone |
| `line` | `rgb(255 255 255 / .15)` | `border-line` | Painel secundário, barras de painel, header do app |
| `line-strong` | `rgb(255 255 255 / .20)` | `border-line-strong` | Painel primário (extrato), controles, badges, hover de item |
| `line-heavy` | `rgb(255 255 255 / .30)` | `border-line-heavy` | Reservado para foco de container / estados ativos fortes |

**Texto**

| Token | Valor | Classe | Uso | Contraste em `surface` |
|---|---|---|---|---|
| `fg` | `#FFFFFF` | `text-fg` | Valores principais, títulos, entradas, saldo realizado | ≈ 19.8:1 |
| `fg-secondary` | `#F4F4F6` | `text-fg-secondary` | Texto padrão do body, datas passadas, saldo projetado | ≈ 18:1 |
| `fg-tertiary` | `#D4D4D8` | `text-fg-tertiary` | Saídas, datas futuras, legendas de card | ≈ 13.4:1 |
| `fg-muted` | `#A1A1AA` | `text-fg-muted` | Cabeçalho de colunas, segmentos inativos, toggles | ≈ 7.7:1 |
| `fg-subtle` | `#71717A` | `text-fg-subtle` | Rótulos micro, dia da semana, metadados | ≈ 4.1:1 ⚠️ |
| `fg-faint` | `#52525B` | `text-fg-faint` | Estado vazio (`// SEM MOVIMENTAÇÕES`) — **só decorativo** | ≈ 2.6:1 |

**Ação**

| Token | Valor | Classe | Uso |
|---|---|---|---|
| `accent` | `#FFFFFF` | `bg-accent` / `border-accent` | Fundo de botão primário, indicador de hoje |
| `accent-hover` | `#D4D4D8` | `hover:bg-accent-hover` | Hover do primário |
| `on-accent` | `#050507` | `text-on-accent` | Texto/ícone sobre `accent` |

**Utilitários:** `scroll-thumb` `#272733`, `scroll-thumb-hover` `#52525B`.

> **Regras de cor**
> - Proibido `white`, `black`, `gray-*`, hex cru ou modificador de opacidade (`/15`) em componentes — use os tokens acima.
> - Proibido qualquer matiz. Entrada vs. saída se distingue por **sinal, peso e luminosidade** (§4.6), nunca por verde/vermelho.

### 2.3 Tipografia

| Token | Valor |
|---|---|
| `font-mono` (**padrão do body**) | `"JetBrains Mono", ui-monospace, monospace` — pesos carregados: 400, 500, 700 |
| `font-sans` (reservado) | `"Inter", ui-sans-serif, system-ui` — só para textos longos de prosa (hoje: nenhum) |

**Escala (únicos tamanhos permitidos)**

| Classe | Tamanho / altura de linha | Uso |
|---|---|---|
| `text-micro` | 10px / 14px | Rótulos micro, dia da semana, badges, metadados, deltas no mobile |
| `text-label` | 11px / 16px | Cabeçalho de colunas, texto de barras de painel, toggles |
| `text-xs` | 12px / 16px | **Base da UI**: linhas do extrato, botões, itens |
| `text-sm` | 14px / 20px | Ênfase: data e saldo de hoje, saldo na faixa de insights, marca |
| `text-xl` | 20px / 28px | Valor de bloco de métrica |
| `text-2xl` | 24px / 32px | Métrica principal (saldo) no painel de insights |
| `text-3xl` | 30px / 36px | Saldo hero no mobile |

**Pesos:** `font-normal` (400), `font-medium` (500), `font-bold` (700). **Proibido `font-extrabold`/`font-black`** — a fonte só tem até 700.

**Caixa e espaçamento entre letras**

| Contexto | Regra |
|---|---|
| Rótulos, cabeçalhos, botões, badges, títulos de barra | `uppercase` |
| Descrição de transação, legendas de card | Caixa normal (como digitado) |
| Rótulos micro, cabeçalho de colunas, botão primário | `tracking-wider` (0.05em) |
| Título de barra de painel, rótulo de bloco de métrica | `tracking-widest` (0.1em) |
| Marca (wordmark) | `tracking-tight` |
| **Todo número** | `tabular-nums` |

### 2.4 Espaçamento

Base de 4px (`--spacing: 0.25rem`, padrão do Tailwind) com meio-passos de 2px. **Valores permitidos:** `0.5 · 1 · 1.5 · 2 · 2.5 · 3 · 4 · 5 · 6` (2–24px). Nada de valores arbitrários (`p-[13px]`).

| Papel | Valor | Classe |
|---|---|---|
| Margem da página — desktop | 24px | `p-6` |
| Margem da página — mobile | 16px | `p-4` |
| Gap entre seções (toolbar → insights → extrato) — desktop | 16px | `gap-4` |
| Gap entre seções — mobile | 12px | `gap-3` |
| **Gutter do extrato** (alinhamento horizontal de tudo dentro do painel) | 24px | `px-6` (ou `border-l-4 pl-5 pr-6` nas linhas) |
| Inset vertical de barra de painel | 10px | `py-2.5` |
| Inset vertical de linha do extrato | 12px | `py-3` |
| Inset de bloco de métrica | 24px × 16px | `px-6 py-4` |
| Inset de gaveta de detalhes | 24px × 16px | `px-6 py-4` |
| Inset de card / item de transação | 12px | `p-3` |
| Inset de card de saldo (mobile) | 16px | `p-4` |
| Gap: ícone/marcador ↔ texto, grupo de botões | 8px | `gap-2` |
| Gap: caixa de ícone ↔ bloco de texto, logo ↔ wordmark | 12px | `gap-3` |
| Gap: grupos da toolbar | 16px | `gap-4` |
| Separação entre stats inline | 24px | `gap-6` + `border-l border-line pl-6` |
| Empilhamento: rótulo → valor → meta | 4px | `mt-1` |
| Empilhamento: itens de transação | 8px | `gap-2` |
| Empilhamento: cards de dia (mobile) | 6px | `gap-1.5` |

### 2.5 Fundo da página (Studio Titanium)

Único gradiente do sistema. Aplicado **só no `body`**:

```css
background-color: #050507;
background-image:
  radial-gradient(ellipse 80% 60% at 50% -15%, rgb(255 255 255 / 0.08) 0%, transparent 75%),
  linear-gradient(180deg, #09090E 0%, #050507 60%, #030305 100%);
background-attachment: fixed;
```

### 2.6 Bordas, dimensões e camadas

**Larguras de borda:** `1px` (padrão, sempre) · `2px` (reservado: foco de container) · `4px` (indicador de hoje, só à esquerda).
**Raio:** `0` em tudo. **Sombra:** nenhuma.

| Elemento | Dimensão | Classe |
|---|---|---|
| Marcador quadrado — sm / md | 6px / 8px | `size-1.5` / `size-2` |
| Ícone — sm / md | 14px / 16px | `size-3.5` / `size-4` |
| Caixa de ícone | 28px | `size-7` |
| Logomarca — desktop / mobile | 28px / 24px | `size-7` / `size-6` |
| Container máximo | 1280px | `max-w-7xl` |
| Viewport do extrato | máx. 640px | `max-h-[640px]` |
| Scrollbar | 4px, quadrado | §9.2 |
| Cursor — repouso / hover | 18px / 30px | §9.1 |

| Camada (z-index) | Valor |
|---|---|
| Linha de hoje (sobre divisores) | `z-10` |
| Cabeçalho de colunas fixo | `z-20` |
| Header do app (sticky) | `z-50` |
| Cursor | `9999` |

### 2.7 Movimento

| Regra | Valor |
|---|---|
| Transição permitida | **só `transition-colors`** (150ms, ease padrão do Tailwind). Proibido `transition-all`. |
| Proibido | scale, bounce, slide, fade de conteúdo, animação de altura |
| Expandir/recolher (insights, dia) | Instantâneo (mostrar/ocultar) |
| Cursor | tamanho 150ms, opacidade 200ms |
| `prefers-reduced-motion: reduce` | desligar todas as transições |

### 2.8 Breakpoints

| Breakpoint | Efeito |
|---|---|
| `< md` (768px) | **Layout mobile** (§8.2): extrato vira lista de cards; barra de ação inferior |
| `sm` (640px) | Faixa de insights exibe ENTRADAS e SAÍDAS |
| `md` (768px) | Layout desktop; blocos de métrica em 4 colunas com `divide-x` |
| `lg` (1024px) | Faixa de insights exibe STATUS |

### 2.9 Iconografia

- Biblioteca: **Lucide** (`lucide-angular`). Traço padrão 2; **2.5 dentro do botão primário**.
- Cor sempre herdada (`currentColor`). Tamanhos: `size-3.5` (dentro de caixa de ícone) ou `size-4` (em botões).
- Conjunto semântico fixo:

| Significado | Ícone |
|---|---|
| Entrada (INCOME) | `arrow-down-left` |
| Saída (EXPENSE) | `arrow-up-right` |
| Criar / incluir | `plus` |

Ícone de transação representa **direção**, não categoria (o backend não fornece ícone de categoria).

---

## 3. Implementação dos tokens (Tailwind v4)

O Tailwind v4 lê tokens do **CSS** (`@theme`), não do `tailwind.config.ts` (esse arquivo é ignorado no v4 e deve ser removido). Conteúdo canônico de `src/styles.css`:

```css
@import "tailwindcss";

@theme {
  /* Reset: só os tokens do projeto existem. Impede bg-blue-*, rounded-lg, shadow-* etc. */
  --color-*: initial;
  --radius-*: initial;
  --shadow-*: initial;
  --inset-shadow-*: initial;
  --drop-shadow-*: initial;

  /* Tipografia */
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --text-micro: 0.625rem;
  --text-micro--line-height: 0.875rem;
  --text-label: 0.6875rem;
  --text-label--line-height: 1rem;

  /* Superfícies */
  --color-canvas: #050507;
  --color-surface: #0A0A0E;
  --color-surface-sunken: #050507;
  --color-surface-hover: #16161D;

  /* Tints */
  --color-tint-hover: rgb(255 255 255 / 0.03);
  --color-tint-selected: rgb(255 255 255 / 0.04);
  --color-tint-fill: rgb(255 255 255 / 0.05);
  --color-tint-strong: rgb(255 255 255 / 0.10);

  /* Linhas */
  --color-line-faint: rgb(255 255 255 / 0.10);
  --color-line: rgb(255 255 255 / 0.15);
  --color-line-strong: rgb(255 255 255 / 0.20);
  --color-line-heavy: rgb(255 255 255 / 0.30);

  /* Texto */
  --color-fg: #FFFFFF;
  --color-fg-secondary: #F4F4F6;
  --color-fg-tertiary: #D4D4D8;
  --color-fg-muted: #A1A1AA;
  --color-fg-subtle: #71717A;
  --color-fg-faint: #52525B;

  /* Ação */
  --color-accent: #FFFFFF;
  --color-accent-hover: #D4D4D8;
  --color-on-accent: #050507;

  /* Utilitários */
  --color-scroll-thumb: #272733;
  --color-scroll-thumb-hover: #52525B;
}

@layer base {
  html { color-scheme: dark; }

  body {
    @apply min-h-dvh bg-canvas font-mono text-xs text-fg-secondary antialiased;
    background-image:
      radial-gradient(ellipse 80% 60% at 50% -15%, rgb(255 255 255 / 0.08) 0%, transparent 75%),
      linear-gradient(180deg, #09090E 0%, #050507 60%, #030305 100%);
    background-attachment: fixed;
  }

  ::selection { background: var(--color-accent); color: var(--color-on-accent); }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--color-canvas); }
  ::-webkit-scrollbar-thumb { background: var(--color-scroll-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--color-scroll-thumb-hover); }

  @media (pointer: fine) {
    *, *::before, *::after { cursor: none !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition: none !important; }
  }
}
```

**Fontes** (em `src/index.html`): carregar só os pesos usados.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
```

> `border` sozinho no v4 usa `currentColor`. **Sempre** combine `border` com um token `border-line-*`.

---

## 4. Primitivos (nível 1)

Elementos indivisíveis. Não contêm outros componentes.

### 4.1 `ob-marker` — marcador quadrado

Indicador de status/seção. **Sempre quadrado.**

| Variante | Classes |
|---|---|
| sm (botões, stats, rodapé) | `inline-block size-1.5 shrink-0 bg-fg` |
| md (título de barra de painel) | `inline-block size-2 shrink-0 bg-fg` |
| neutro (status secundário) | trocar `bg-fg` por `bg-fg-muted` |

### 4.2 `ob-icon-box` — caixa de ícone

```
flex size-7 shrink-0 items-center justify-center border transition-colors
```
- **EXPENSE (saída):** `border-line-faint bg-tint-fill`, ícone interno `size-3.5 text-fg-muted` com traço 2.
- **INCOME (entrada):** Alto contraste invertido: `border-accent bg-accent`, ícone interno `size-3.5 text-on-accent` com traço 2.5 (`strokeWidth="2.5"`).

### 4.3 `ob-badge` — etiqueta de tipo

```
inline-flex items-center border border-line-strong bg-tint-strong px-1.5 py-0.5 text-micro font-bold uppercase text-fg
```
Valores atuais: `FATURA`, `RECORRENTE`. No máximo 1 badge por linha.

### 4.4 Rótulos

| Variante | Classes | Uso |
|---|---|---|
| `micro` | `text-micro uppercase tracking-wider text-fg-subtle` | Rótulo de stat, meta, dia da semana, seções no mobile |
| `micro-wide` | `text-micro uppercase tracking-widest text-fg-subtle` | Rótulo de bloco de métrica |
| `label` | `text-label uppercase tracking-wider text-fg-muted` | Cabeçalho de colunas |
| `bar-title` | `text-xs font-bold uppercase tracking-widest text-fg` | Título de barra de painel |
| `bar-meta` | `text-label uppercase text-fg-subtle` | Metadado à direita de barra |

### 4.5 `ob-date` — data

- Estrutura: **dia da semana → data**, sempre nessa ordem, separados por `gap-2`.
- Dia da semana: 3 letras, maiúsculas, sem ponto (`SEG TER QUA QUI SEX SÁB DOM`) → `text-fg-subtle`.

| Estado temporal | Classes da data |
|---|---|
| Passado | `text-fg-secondary` |
| **Hoje** | `text-sm font-bold text-fg` |
| Futuro (projetado) | `text-fg-tertiary` |

**Formatos:**

| Contexto | Formato | Exemplo |
|---|---|---|
| Célula / card | `DD/MM/YYYY` | `18/10/2026` |
| Card compacto (mobile) | `DD/MM` | `18/10` |
| Metadado técnico em barras/gavetas | `DD.MM.YYYY` | `18.10.2026` |
| Intervalo | `DD/MM/YYYY ➔ DD/MM/YYYY` | `18/10/2026 ➔ 18/10/2027` |

> `formatDate(d, 'EEE', 'pt-BR')` devolve `sáb.`. Normalize: maiúsculas, sem ponto.

### 4.6 `ob-money` — valor monetário

Formato pt-BR: `R$ 15.630,71`. Sinal separado por espaço: `+ R$ 850,00` / `- R$ 64,49`. Ausência de valor: `—` (travessão).

| Variante | Prefixo | Classes |
|---|---|---|
| `balance` — realizado (≤ hoje) | — | `font-bold text-fg tabular-nums` |
| `balance` — projetado (> hoje) | — | `font-bold text-fg-secondary tabular-nums` |
| `income` | `+ ` | `font-bold text-fg tabular-nums` |
| `expense` | `- ` | `font-medium text-fg-tertiary tabular-nums` |
| `empty` | `—` | `text-fg-subtle` |
| `negative-balance` *(proposta, §10)* | `- ` | `bg-accent px-1 font-bold text-on-accent tabular-nums` |

O tamanho é herdado do contexto. Angular: `registerLocaleData(localePt)`, `LOCALE_ID = 'pt-BR'`, `DEFAULT_CURRENCY_CODE = 'BRL'`. (O código atual usa `currency: 'BRL'` com locale padrão `en-US`, que gera `R$15,630.71` — errado.)

### 4.7 `ob-button` — botão

Separado em **base + variante (cor) + tamanho (padding/texto)**. Nunca misture paddings de dois tamanhos.

**Base (sempre):**
```
inline-flex items-center justify-center gap-2 border uppercase transition-colors
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg
disabled:pointer-events-none disabled:opacity-40
```

**Variantes:**

| Variante | Classes | Uso |
|---|---|---|
| `primary` | `border-accent bg-accent font-bold tracking-wider text-on-accent hover:border-accent-hover hover:bg-accent-hover` | Ação principal da região |
| `secondary` | `border-line-strong bg-surface font-medium text-fg hover:bg-surface-hover` | Ações de navegação (IR PARA HOJE) |
| `ghost` | `border-line bg-surface-sunken text-fg-muted hover:text-fg` | Toggles com colchetes |
| `tint` | `border-line-strong bg-tint-fill font-bold text-fg hover:bg-tint-strong` | Ações compactas (mobile) |

**Tamanhos:**

| Tamanho | Classes | Uso |
|---|---|---|
| `xs` | `px-2.5 py-0.5 text-label` | Toggle `[ + INSIGHTS ]` |
| `sm` | `px-4 py-1.5 text-xs` | Ações compactas |
| `md` (padrão) | `px-4 py-2 text-xs` | Toolbar |
| `lg` | `px-4 py-2.5 text-xs` | CTA de bloco |
| `block` (modificador) | `w-full` | Combine com `lg` |

**Regras de conteúdo:**
- Com ícone: `ícone + TEXTO` (`[plus] NOVA TRANSAÇÃO`). **Nunca** repita `+` no texto quando há ícone.
- Ações só de texto usam colchetes: `[ + INSIGHTS ]`, `[ - RECOLHER ]`.
- **No máximo 1 `primary` por região** (toolbar, gaveta do dia, barra inferior mobile).

---

## 5. Componentes (nível 2)

### 5.1 `ob-segmented-control` — seletor de período

```
container: inline-flex border border-line-strong bg-surface-sunken
item:      px-4 py-1.5 text-xs border-r border-line-strong last:border-r-0 transition-colors
ativo:     bg-accent font-bold text-on-accent
inativo:   text-fg-muted hover:bg-tint-fill hover:text-fg
```
Rótulos: `30D` `90D` `12M`. ARIA: `role="radiogroup"` + `role="radio"` / `aria-checked`.

### 5.2 `ob-stat` — estatística inline (faixa de insights)

```
flex items-center gap-2
  [ob-marker sm]              (só no primeiro stat)
  [rótulo micro]  "SALDO ATUAL:"   (com dois-pontos)
  [ob-money]      text-xs; primeiro stat: text-sm
```
Stats subsequentes: `border-l border-line pl-6`.

### 5.3 `ob-metric-block` — bloco de métrica (insights expandido)

```
px-6 py-4
  [rótulo micro-wide]
  [ob-money]  mt-1 text-xl   (métrica principal: text-2xl)
  [meta]      mt-1 text-micro uppercase text-fg-subtle   (meta de alerta: text-fg-muted)
```

### 5.4 `ob-panel` — container

| Variante | Classes | Uso |
|---|---|---|
| `primary` | `border border-line-strong bg-surface` | Extrato |
| `secondary` | `border border-line bg-surface` | Painel de insights |

### 5.5 `ob-panel-bar` — barra de cabeçalho/rodapé de painel

```
flex items-center justify-between gap-4 bg-surface-sunken px-6 py-2.5
  topo:   + border-b border-line
  rodapé: + border-t border-line
esquerda: flex items-center gap-2 → [ob-marker md + bar-title]   (rodapé: marker sm + bar-meta)
direita:  [bar-meta]
```

### 5.6 `ob-ledger-row` — linha do extrato (desktop)

**Grid de 5 colunas (12 trilhas):**

| Coluna | Trilhas | Alinhamento | Conteúdo |
|---|---|---|---|
| DATA | `col-span-2` | esquerda | `ob-date` |
| LANÇAMENTOS | `col-span-4` | esquerda | Regra de resumo (abaixo) |
| ENTRADAS | `col-span-2` | direita | `ob-money income` ou `empty` |
| SAÍDAS | `col-span-2` | direita | `ob-money expense` ou `empty` |
| SALDO | `col-span-2` | direita | `ob-money balance` |

**Classes:**
```
padrão: grid grid-cols-12 items-center border-l-4 border-l-transparent py-3 pl-5 pr-6 text-xs
        cursor-pointer transition-colors hover:bg-tint-hover
hoje:   substituir border-l-transparent por border-l-accent e adicionar bg-tint-selected relative z-10
```
(`border-l-4` + `pl-5` = 24px → alinhado com o gutter do extrato.)

**Regra de resumo — coluna LANÇAMENTOS** (nunca repetir valores aqui):

| Nº de transações | Conteúdo | Classes |
|---|---|---|
| 0 | `// SEM MOVIMENTAÇÕES` | `text-fg-faint` |
| 1 | `[ob-badge?] Descrição` | `truncate text-fg-tertiary` (`gap-2`) |
| ≥ 2 | `[ob-marker sm] N LANÇAMENTOS` | `uppercase text-fg-tertiary` |

**Hoje:** identificado **só** pela borda esquerda de 4px + tint + peso da data. **Proibido** badge/texto "HOJE" ou "(SÁB)" entre parênteses.

**Comportamento:** clique alterna a gaveta do dia (§6.5). **Um dia aberto por vez** (acordeão). Semântica: `<button>`-like com `aria-expanded` e Enter/Espaço.

### 5.7 `ob-transaction-item` — item de transação

```
flex items-center justify-between gap-3 border border-line-faint bg-surface p-3
transition-colors hover:border-line-strong

esquerda: flex items-center gap-3
  [ob-icon-box]  (arrow-down-left | arrow-up-right)
  div:
    descrição: block text-xs font-bold   entrada → text-fg · saída → text-fg-secondary
    categoria: text-micro uppercase text-fg-subtle   (só o nome; sem prefixo "Categoria:")
direita: [ob-money income|expense] text-xs
```
Sem categoria → omitir a linha (não escrever "Sem categoria").

### 5.8 `ob-day-card` — card de dia (mobile)

```
padrão: flex items-center justify-between border border-line-faint bg-surface p-3 text-xs
hoje:   border-line-strong border-l-4 border-l-accent bg-tint-fill

esquerda:
  data: padrão text-micro text-fg-subtle · hoje text-xs font-bold text-fg   (formato DD/MM)
  resumo: mesma regra da coluna LANÇAMENTOS, font-bold
direita (text-right):
  saldo: ob-money balance (hoje: text-sm)
  delta: block text-micro — ob-money income|expense|empty
```

---

## 6. Padrões (nível 3)

### 6.1 `ob-app-header`

```
sticky top-0 z-50 flex items-center justify-between border-b border-line bg-canvas px-6 py-3
marca: flex items-center gap-3
  logomarca: flex size-7 items-center justify-center bg-accent text-sm font-bold text-on-accent → "OB"
  wordmark:  text-sm font-bold uppercase tracking-tight text-fg → "OPENBUDGET"
direita: (a definir — usuário/sair, §10)
```

> O seletor `DESKTOP LEDGER / MOBILE VIEW`, o subtítulo `TECHNICAL BRUTALISM` e o badge `GEOMETRIA RETANGULAR` do protótipo são **ferramentas do protótipo**. Não implementar.

### 6.2 `ob-toolbar`

```
flex items-center justify-between gap-4
esquerda: ob-segmented-control
direita:  flex items-center gap-2
  ob-button secondary md → [ob-marker sm] IR PARA HOJE
  ob-button primary md   → [plus size-4 stroke-2.5] NOVA TRANSAÇÃO
```

### 6.3 `ob-insights-panel`

```
ob-panel secondary
├─ faixa (sempre visível) — <button aria-expanded aria-controls>
│    flex w-full flex-wrap items-center justify-between gap-4 px-6 py-2.5
│    cursor-pointer transition-colors hover:bg-tint-hover
│    ├─ flex flex-wrap items-center gap-6
│    │    ob-stat  SALDO ATUAL   (sempre)
│    │    ob-stat  ENTRADAS      (hidden sm:flex)
│    │    ob-stat  SAÍDAS        (hidden sm:flex)
│    │    ob-stat  STATUS        (hidden lg:flex · marker neutro · text-label text-fg-muted)
│    └─ rótulo visual com aparência de ob-button ghost xs: "[ + INSIGHTS ]" / "[ - RECOLHER ]"
└─ área expandida (oculta por padrão)
     border-t border-line bg-surface-sunken
     grid grid-cols-1 divide-y divide-line md:grid-cols-4 md:divide-x md:divide-y-0
       ob-metric-block × 4: SALDO HOJE (2xl) · ENTRADAS PREVISTAS · SAÍDAS PREVISTAS · MENOR SALDO PROJETADO
```
Estado inicial: **recolhido**. O toggle é só visual (a faixa inteira é o botão) — não aninhe dois elementos interativos.

### 6.4 `ob-ledger` — extrato

```
ob-panel primary
├─ ob-panel-bar (topo): [marker md] EXTRATO ··· 365D
├─ cabeçalho de colunas:
│    grid grid-cols-12 border-b border-line bg-surface-sunken px-6 py-2.5 + rótulo label
│    DATA · LANÇAMENTOS · ENTRADAS (dir.) · SAÍDAS (dir.) · SALDO (dir.)
├─ corpo rolável: max-h-[640px] overflow-y-auto divide-y divide-line-faint
│    ob-ledger-row × N
│    └─ ob-day-details (inline, logo abaixo da linha aberta)
└─ ob-panel-bar (rodapé): [marker sm] SINCRONIZADO ··· 18/10/2026 ➔ 18/10/2027
```
**Comportamentos:**
- Ao carregar, rolar até hoje e centralizar.
- `IR PARA HOJE` rola até a linha de hoje (centralizada, rolagem suave).
- Rolagem via `smooth-scrollbar` (já no projeto) com o estilo da §9.2.

### 6.5 `ob-day-details` — gaveta do dia

```
border-y border-line bg-surface-sunken px-6 py-4
├─ cabeçalho: mb-2 flex items-center justify-between border-b border-line-faint pb-2
│     esquerda: text-label uppercase tracking-wider text-fg-subtle → "TRANSAÇÕES // 18.10.2026"
│     direita:  text-micro uppercase text-fg-subtle → "2 ITENS"
├─ lista: flex flex-col gap-2 → ob-transaction-item × N
│     vazia: "// SEM MOVIMENTAÇÕES" text-fg-faint
└─ CTA: mt-4 → ob-button primary lg block → [plus] INCLUIR NESTE DIA
```
- Itens **sempre em lista vertical** de largura total. Proibido lado a lado.
- CTA **sempre abaixo da lista**, nunca no cabeçalho. Sem sombra/glow.

### 6.6 Padrões mobile

**`ob-mobile-topbar`**
```
flex items-center justify-between border-b border-line-strong bg-surface px-4 py-3
marca: logomarca size-6 text-xs "OB" + wordmark text-xs
direita: text-micro text-fg-muted → "12M"
```

**`ob-mobile-balance`**
```
border border-line-strong bg-surface p-4
  rótulo micro: "SALDO TOTAL"
  ob-money balance: mt-0.5 text-3xl
  ações: mt-4 grid grid-cols-2 gap-2 border-t border-line pt-3
    ob-button tint sm → [arrow-down-left] ENTRADA
    ob-button tint sm → [arrow-up-right] SAÍDA
```

**`ob-mobile-day-list`**
```
flex flex-col gap-1.5 pt-2
  rótulo micro: "PRÓXIMOS DIAS"
  ob-day-card × N   (toque expande ob-day-details abaixo, igual ao desktop)
```

**`ob-mobile-action-bar`**
```
sticky bottom-0 border-t border-line-strong bg-canvas p-3
  ob-button primary lg block → [plus] NOVA TRANSAÇÃO
```

---

## 7. Árvore de hierarquia

```
Tokens (§2–3)
└─ Primitivos
   ├─ ob-marker
   ├─ ob-icon-box
   ├─ ob-badge
   ├─ rótulos (micro, micro-wide, label, bar-title, bar-meta)
   ├─ ob-date
   ├─ ob-money
   └─ ob-button
      └─ Componentes
         ├─ ob-segmented-control   ← ob-button-like items
         ├─ ob-stat                ← marker, rótulo, money
         ├─ ob-metric-block        ← rótulo, money
         ├─ ob-panel / ob-panel-bar← marker, rótulos
         ├─ ob-ledger-row          ← date, badge, marker, money
         ├─ ob-transaction-item    ← icon-box, money
         └─ ob-day-card            ← date, money
            └─ Padrões
               ├─ ob-app-header
               ├─ ob-toolbar            ← segmented, button
               ├─ ob-insights-panel     ← panel, stat, metric-block
               ├─ ob-ledger             ← panel, panel-bar, ledger-row, day-details
               ├─ ob-day-details        ← transaction-item, button
               └─ ob-mobile-*           ← day-card, button, money
                  └─ Layouts (§8)
```

---

## 8. Layouts (nível 4)

### 8.1 Desktop (`≥ md`)

```
┌ ob-app-header ──────────────────────────────────────────────────────┐
│ [OB] OPENBUDGET                                            (usuário)│
└─────────────────────────────────────────────────────────────────────┘
 main: mx-auto flex w-full max-w-7xl flex-col gap-4 p-6
 ┌ ob-toolbar ────────────────────────────────────────────────────────┐
 │ [30D][90D][12M]                       [■ IR PARA HOJE] [+ NOVA TRANSAÇÃO]│
 └────────────────────────────────────────────────────────────────────┘
 ┌ ob-insights-panel (recolhido) ─────────────────────────────────────┐
 │ ■ SALDO ATUAL: R$ … │ ENTRADAS: … │ SAÍDAS: … │ STATUS…  [ + INSIGHTS ]│
 └────────────────────────────────────────────────────────────────────┘
 ┌ ob-ledger ─────────────────────────────────────────────────────────┐
 │ ■ EXTRATO                                                      365D │
 │ DATA        LANÇAMENTOS            ENTRADAS     SAÍDAS        SALDO │
 │ QUI 16/10   Supermercado                  —   - R$ 120   R$ 14.890 │
 ┃ SÁB 18/10   ■ 2 LANÇAMENTOS          + R$ 850   - R$ 64   R$ 15.630 │  ← hoje
 │   ┌ ob-day-details ──────────────────────────────────────────────┐ │
 │   │ TRANSAÇÕES // 18.10.2026                              2 ITENS │ │
 │   │ [↙] Consultoria PJ                                  + R$ 850 │ │
 │   │ [↗] Almoço                                          - R$ 64  │ │
 │   │ [+ INCLUIR NESTE DIA]                                        │ │
 │   └──────────────────────────────────────────────────────────────┘ │
 │ ■ SINCRONIZADO                          18/10/2026 ➔ 18/10/2027 │
 └────────────────────────────────────────────────────────────────────┘
```

### 8.2 Mobile (`< md`)

```
ob-mobile-topbar
main: flex flex-col gap-3 p-4
  ob-mobile-balance
  ob-mobile-day-list
ob-mobile-action-bar (sticky bottom)
```
A moldura de celular do protótipo (`390×780`, `border-2`) é só simulação.

---

## 9. Comportamentos globais

### 9.1 Cursor inversor

- Só em `pointer: fine`. O cursor nativo fica oculto (§3, base) e resta **apenas a bolinha**.
- Bolinha branca de 18px com `mix-blend-mode: difference` (inverte o que está por baixo). Em elementos interativos cresce para 30px.
- É a **única** exceção ao raio 0.

```css
.ob-cursor {
  position: fixed; top: 0; left: 0; z-index: 9999;
  width: 18px; height: 18px; border-radius: 50%;
  background: #fff; mix-blend-mode: difference;
  pointer-events: none; opacity: 0;
  transform: translate3d(var(--x, -100px), var(--y, -100px), 0) translate(-50%, -50%);
  transition: width 150ms ease, height 150ms ease, opacity 200ms ease;
}
.ob-cursor[data-visible] { opacity: 1; }
.ob-cursor[data-hover] { width: 30px; height: 30px; }
```

**Implementação no Angular** (obrigatório):
- Um único componente no `App` root; listeners **fora da NgZone** (`NgZone.runOutsideAngular`), posição atualizada via `requestAnimationFrame` setando `--x`/`--y`.
- Hover por **delegação de eventos** (`pointerover` no `document` + `target.closest('button, a, input, select, textarea, [role=button], [data-interactive]')`). O protótipo liga eventos só nos elementos existentes no carregamento — isso quebra com conteúdo renderizado depois.
- `mouseleave` do documento → ocultar.

### 9.2 Scrollbar

4px, quadrado, trilho `canvas`, thumb `scroll-thumb` (hover `scroll-thumb-hover`). Para o `smooth-scrollbar`:

```css
.scrollbar-track { background: transparent !important; }
.scrollbar-track-y { width: 4px !important; }
.scrollbar-thumb { width: 4px !important; border-radius: 0 !important; background: var(--color-scroll-thumb) !important; }
```

### 9.3 Foco e acessibilidade

- Com o cursor nativo oculto, **foco visível é obrigatório**: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg` em todo elemento interativo.
- Linhas e faixas clicáveis: elementos semânticos (`<button>`) ou `role="button"` + `tabindex="0"` + Enter/Espaço + `aria-expanded`.
- Nunca dependa só da cor/luminosidade para significado: entrada/saída sempre têm sinal `+`/`-` e ícone de direção.

---

## 10. Componentes derivados e decisões em aberto

Itens **ausentes no protótipo**. Os marcados *proposto* seguem o sistema, mas precisam de aprovação antes de virar regra.

| Item | Especificação | Status |
|---|---|---|
| Campo de formulário (`ob-field`) | rótulo: `mb-1.5 block text-label uppercase tracking-wider text-fg-muted` · input: `w-full border border-line-strong bg-surface-sunken px-3 py-2 text-xs text-fg placeholder:text-fg-subtle outline-none focus:border-fg` | proposto |
| Erro de validação | input `border-fg` + mensagem `mt-1 text-micro uppercase text-fg` prefixada `ERRO //` | proposto |
| Saldo negativo | célula invertida (`bg-accent text-on-accent`) — única forma de alerta sem usar cor | proposto |
| Carregando | texto `[ CARREGANDO ]` em `text-fg-subtle`; sem spinner circular | proposto |
| Lado direito do `ob-app-header` | usuário / sair | **em aberto** |
| Contraste de `fg-subtle` | ≈ 4.1:1 — **reprova WCAG AA** para texto < 18px. Opções: aceitar para metadados não essenciais ou promover para `fg-muted` | **em aberto** |
| Caret em campos de texto | o cursor nativo oculto também esconde o I-beam em inputs | **em aberto** |
| Badges `FATURA` / `RECORRENTE` | `TransactionDTO` ainda não tem campo que diga isso; depende do backend | **em aberto** |

---

## 11. Divergências: protótipo → especificação

O protótipo tem inconsistências. Implemente **a especificação**:

| # | Protótipo | Especificação | Motivo |
|---|---|---|---|
| 1 | 4 colunas (sem SAÍDAS; valor da saída escrito no texto) | 5 colunas 2/4/2/2/2 | Saída diária precisa de coluna própria (o app original tinha) |
| 2 | LANÇAMENTOS repete valores `(-R$ 120,00)` | Nunca repete valores | Redundante com as colunas |
| 3 | Cabeçalho e barras em 20px; linhas em 24px | Tudo em 24px (`px-6` / `border-l-4 pl-5 pr-6`) | Desalinhamento de 4px |
| 4 | Linha de hoje com `py-3.5` e `(SÁB)` após a data | `py-3`; dia da semana antes da data | Ritmo vertical e ordem consistentes |
| 5 | `font-black` / `font-extrabold` | Máx. `font-bold` | A fonte só tem até 700 |
| 6 | `text-silver-600` (não definido) | `text-fg-faint` `#52525B` | Classe inexistente |
| 7 | `py-0.2` no badge | `py-0.5` | Classe inválida |
| 8 | Glow `shadow-[…]` no CTA do dia | Sem sombra | P3 |
| 9 | `[plus] [ + INCLUIR NESTE DIA ]` e `+ Nova Transação` só texto | Ícone + texto, sem `+` duplicado | Regra de conteúdo do botão |
| 10 | `Categoria: Alimentação` | `ALIMENTAÇÃO` | P5 |
| 11 | Ícone de categoria (`coffee`) | Ícone de direção | Backend não tem ícone de categoria |
| 12 | `EXTRATO & PROJEÇÃO DIÁRIA` / `JANELA ATIVA: 365 DIAS` / `SINCRONIZADO VIA API BACKEND` | `EXTRATO` / `365D` / `SINCRONIZADO` | P5 |
| 13 | Tints `0.02` e `0.03`; `transition-all` | `tint-hover` (0.03); `transition-colors` | Unificação |
| 14 | Datas `16/10/2026`, `17.10`, `18.10.2026` misturadas | Formatos da §4.5 | Consistência |
| 15 | Vários dias abertos ao mesmo tempo | Um por vez (acordeão) | Igual ao código atual |
| 16 | Padding das faixas/métricas `px-4` / `p-4` | `px-6` | Gutter único |
| 17 | Primário `px-5`, secundário `px-4` | Ambos `px-4` (tamanho `md`) | Escala de tamanhos única |
| 18 | Logomarca mobile `DC` | `OB` | Marca, não iniciais do usuário |
| 19 | Hover do cursor ligado só no carregamento | Delegação de eventos | Conteúdo dinâmico |

---

## 12. Checklist (rode antes de entregar UI)

- [ ] Nenhum `rounded-*` (exceto o cursor).
- [ ] Nenhum matiz; nenhum `white`/`black`/`gray-*`/hex/`/opacidade` em componente — só tokens semânticos.
- [ ] Nenhum `shadow-*`, glow, blur ou gradiente em componente.
- [ ] Todo número com `tabular-nums`; valores em pt-BR com sinal separado por espaço.
- [ ] Só tamanhos `text-micro/label/xs/sm/xl/2xl/3xl` e pesos 400/500/700.
- [ ] Espaçamentos dentro da escala da §2.4; conteúdo do extrato alinhado em 24px.
- [ ] Hoje = só borda esquerda de 4px + tint. Sem texto "HOJE".
- [ ] Transações do dia em lista vertical; CTA abaixo da lista.
- [ ] Insights recolhidos por padrão.
- [ ] Nenhum texto didático/explicativo.
- [ ] No máximo 1 botão `primary` por região; nada de `+` duplicado.
- [ ] Só `transition-colors`; respeita `prefers-reduced-motion`.
- [ ] Foco visível em todo elemento interativo; linhas clicáveis acessíveis por teclado.
- [ ] Componente novo composto a partir dos primitivos existentes (nenhum token inventado).

---

## 13. Mapeamento para o código Angular

**Estrutura sugerida:**
```
src/
├─ styles.css                    # §3 (tokens + base)
└─ app/
   ├─ ui/
   │  ├─ primitives/             # marker, icon-box, badge, date, money, button
   │  ├─ components/             # segmented-control, stat, metric-block, panel, panel-bar,
   │  │                          # ledger-row, transaction-item, day-card
   │  ├─ patterns/               # app-header, toolbar, insights-panel, ledger, day-details, mobile-*
   │  └─ behaviors/              # inverted-cursor
   └─ pages/home/                # compõe os padrões (layout §8)
```
- O atual `components/tabela-registros` vira o padrão `ob-ledger`.
- Prefixo de seletor do design system: `ob-`. Componentes standalone, `ChangeDetectionStrategy.OnPush`, inputs com `input()`.
- Mapeamento de dados: `TransactionDTO.type` `INCOME`/`EXPENSE` → variante de `ob-money` e ícone de direção; `DaySnapshotDTO.balance` → `balance` realizado/projetado conforme a data vs. hoje.

**Padrão de componente (exemplo: `ob-button`)** — seletor de atributo para manter o `<button>` nativo:

```ts
import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

const BASE =
  'inline-flex items-center justify-center gap-2 border uppercase transition-colors ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg ' +
  'disabled:pointer-events-none disabled:opacity-40';

const VARIANTS = {
  primary:   'border-accent bg-accent font-bold tracking-wider text-on-accent hover:border-accent-hover hover:bg-accent-hover',
  secondary: 'border-line-strong bg-surface font-medium text-fg hover:bg-surface-hover',
  ghost:     'border-line bg-surface-sunken text-fg-muted hover:text-fg',
  tint:      'border-line-strong bg-tint-fill font-bold text-fg hover:bg-tint-strong',
} as const;

const SIZES = {
  xs: 'px-2.5 py-0.5 text-label',
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-4 py-2 text-xs',
  lg: 'px-4 py-2.5 text-xs',
} as const;

@Component({
  selector: 'button[obButton], a[obButton]',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
})
export class ObButton {
  variant = input<keyof typeof VARIANTS>('secondary');
  size = input<keyof typeof SIZES>('md');
  block = input(false, { transform: booleanAttribute });

  protected classes = computed(() =>
    [BASE, VARIANTS[this.variant()], SIZES[this.size()], this.block() ? 'w-full' : ''].join(' '),
  );
}
```

```html
<button obButton variant="primary" size="lg" block>
  <lucide-icon name="plus" class="size-4" [strokeWidth]="2.5" />
  INCLUIR NESTE DIA
</button>
```
