# claude-lessons.md — registro vivo de lições

Catálogo de bugs reais, causas-raiz e padrões descobertos neste repositório, pra **não
redescobrir o mesmo problema** em outra sessão ou máquina.

**Como usar:** se você (Claude) aprender algo que vai te morder de novo — um gotcha, uma
decisão de arquitetura não óbvia, um bug sutil, uma dívida técnica — registre aqui **antes**
de terminar a tarefa. Uma entrada por lição, no formato abaixo.

**Pipeline de graduação:** quando uma categoria acumula 3+ entradas relacionadas, ou uma
lição vira um procedimento com passos a seguir, ela gradua para uma skill em
`.claude/skills/` — e a entrada aqui fica com uma linha apontando para a skill.

**Formato de entrada:**
```
## [categoria] Título curto
**Data:** AAAA-MM-DD · **Status:** aberto | resolvido
**Sintoma:** o que se observa.
**Causa-raiz:** por que acontece.
**Correção / padrão:** o que fazer (ou o que já foi feito).
```

---

## [performance] Assets de imagem pesados demais (~22 MB no total)
**Data:** 2026-07-30 · **Status:** aberto

**Sintoma:** o carregamento da página arrasta, principalmente no primeiro acesso e em rede
móvel. O portfólio usa Lighthouse como argumento de posicionamento, então isso é regressão
direta do que o site se propõe a demonstrar.

**Causa-raiz:** os prints dos projetos em `assets/` são PNGs não otimizados, em dimensão e
peso muito acima do necessário para o tamanho em que são exibidos. Medição em 2026-07-30:

| Arquivo | Peso |
|---|---|
| `netflix-print.png` | ~9,8 MB |
| `login-test-print.png` | ~2,6 MB |
| `ecommerce-print.png` | ~2,3 MB |
| `instagram-print.png` | ~2,1 MB |
| `baber-print.png` | ~1,9 MB |
| `previsao-temp-print.png` | ~1,6 MB |
| `perfil-welder.png` | ~1,1 MB |
| `rifa-print.png` | ~632 KB |
| `pigz-test-print.png` | ~88 KB |
| **Total** | **~22 MB** |

O `netflix-print.png` sozinho é ~45% do peso e o maior ofensor isolado.

**Correção / padrão (roda em site estático, sem build):**
1. **Redimensionar** cada print para a dimensão máxima em que aparece na tela (os cards e
   mockups não precisam de imagem em resolução cheia).
2. **Converter para formato eficiente** — WebP (ou AVIF) no lugar de PNG; se quiser
   fallback, `<picture>` com `<source type="image/webp">` + `<img>` PNG leve.
3. **Comprimir** o resultado (mirar dezenas/poucas centenas de KB por print, não MB).
4. Garantir `loading="lazy"` em toda `<img>` de projeto (os cards já usam em parte — conferir
   cobertura total).
5. Meta prática: derrubar o total de ~22 MB para a casa de **1–2 MB**. Priorizar o
   `netflix-print.png` primeiro (maior ganho por esforço).

**Nota de convenção:** daqui pra frente, imagem nova em `assets/` entra **já otimizada**
(ver regra de performance no `CLAUDE.md`). Toda nova imagem sem otimização é uma regressão,
não um item de backlog.

> Se esta categoria de performance acumular mais entradas (ex.: fontes, canvas, globe.gl,
> bundle de scripts), considerar graduar para uma skill `varredura-de-saude` adaptada a site
> estático.

---

## [acessibilidade] Contraste, landmark e iframe sem title — achados reais do Lighthouse
**Data:** 2026-07-30 · **Status:** resolvido (branch `fix/lighthouse-a11y-perf`, commit `23f865e`)

**Sintoma:** rodando Lighthouse contra `welderbarroso.dev` (produção) e localhost
(`logs/lighthouse-30-07-2026/*.json`, 3 relatórios), a categoria Accessibility ficou em
0.94 (produção) e 0.88 (local) — não 100. Nenhuma auditoria anterior (design-audit, ou a
skill `accessibility-test` como estava) tinha pego isso, porque `accessibility-test` estava
travada em pressupor Next.js/npm (ver correção na própria skill) e nunca rodou de verdade
aqui.

**Causa-raiz — três achados distintos, todos confirmados nos 3 relatórios:**
1. **`color-contrast`**: `var(--mist2)` (`#3d5166`) usado como cor de texto direto sobre
   `var(--ink)`/`var(--deep)`/`var(--navy)` dá razão de contraste ~2.45:1 — bem abaixo do
   mínimo de 4.5:1. Ocorre em pelo menos três lugares: `.foot-copy` (footer), `.hero-scroll`
   ("SCROLL PARA EXPLORAR") e `.proj-tag` (as tags dos cards de projeto, ex. "NEXT.JS",
   "FIREBASE"). `--mist2` foi pensado como cor "apagada"/secundária no design system, mas
   isso a torna baixa demais pra texto lido diretamente — só serve pra elementos decorativos
   ou com peso visual extra (borda + fundo), não texto solto.
2. **`landmark-one-main`**: `index.html` não tem nenhum elemento `<main>` — todo o conteúdo
   entre `<nav>` e `<footer>` está solto em `<section>`s sem um landmark pai. Leitor de tela
   não tem como pular direto pro conteúdo principal.
3. **`frame-title`**: o iframe do Figma (criado dinamicamente por `loadFigmaEmbed` em
   `scripts.js` quando o usuário clica no `.iframe-placeholder`) nasce sem atributo `title`.
   Mesmo problema se replica nos iframes de preview dos mockups PC/mobile quando carregados.

**Correção / padrão (nenhuma aplicada ainda — só diagnosticada):**
1. Não usar `--mist2` como `color` de texto direto sobre `--ink`/`--deep`/`--navy`. Alternativas:
   clarear o próprio texto (`--mist` já tem contraste melhor — conferir se atinge 4.5:1 antes
   de trocar cego) ou manter `--mist2` só em bordas/preenchimentos decorativos.
2. Adicionar `<main>` envolvendo as `<section>` de `#hero` até `#contato` (antes do `<footer>`).
3. Adicionar `title` no `<iframe>` criado por `loadFigmaEmbed` (ex.:
   `title="Protótipo Figma — Netflix Clone"`) e nos iframes de preview dos mockups quando o
   JS os instanciar.

**Nota de metodologia (não é bug, mas quase virou um):** os relatórios também mostraram
`errors-in-console` e itens pesados de `unused-javascript`/`unminified-javascript` vindos de
`chrome-extension://...` (gerenciador de senha, outra extensão desconhecida) — **ruído do
navegador que rodou o teste, não bug do site**. O próprio Lighthouse avisou em `runWarnings`
("Chrome extensions negatively affected this page's load performance"). Rodar Lighthouse
sempre em aba anônima/perfil limpo daqui pra frente, e ao ler um JSON de Lighthouse, descartar
qualquer `source: "violation"` ou item de audit cuja URL comece com `chrome-extension://`
antes de reportar como achado real.

---

## [performance] Achados do Lighthouse — main thread, Font Awesome e metodologia de terceiros
**Data:** 2026-07-30 · **Status:** aberto

**Sintoma:** performance caiu pra 0.57 em produção (`welderbarroso.dev`) — Total Blocking
Time ~3.6s, Speed Index ~3.8s, Time to Interactive ~5.4s. Os outros dois relatórios locais
mostraram números ainda piores (TBT até 5.5s, total-byte-weight de ~26 MB), mas parte
relevante desses números **não é do nosso site** — ver nota de metodologia abaixo.

**Causa-raiz (achados reais, do próprio domínio):**
1. **Font Awesome via cdnjs carrega o kit inteiro pra usar uma dúzia de ícones** —
   `unused-css-rules` reporta 98,4% do CSS do Font Awesome (18,5 KB de 18,9 KB) sem uso, e os
   webfonts (`fa-solid-900.woff2`, `fa-brands-400.woff2`) custam ~225–295ms de
   `font-display-insight` por não terem `font-display: swap` (o CDN não aceita esse parâmetro
   como o Google Fonts aceita).
2. **`globe.gl` (a lib do globo 3D no hero) é a maior fatia de JS não usado do próprio site**:
   43,5% de 272 KB (118 KB) não executado, e é candidato forte pro grosso do Total Blocking
   Time — é uma lib pesada (Three.js por baixo) rodando incondicional no desktop.
3. **`assets/perfil-welder.png`** aparece de novo em `image-delivery-insight` — mesmo achado
   já registrado na entrada de performance acima, agora confirmado por ferramenta externa.
4. Google Fonts CSS, Font Awesome CSS e o próprio `style.css` aparecem em
   `render-blocking-insight` — nenhum é absurdo isoladamente (329ms + 407ms de desperdício
   estimado), mas somam.

**Nota de metodologia (gap novo — quase gerou pânico por número errado):** o relatório
`welderbarroso.dev-2.json` mostrou `total-byte-weight` de **~26 MB** e CLS de 0.535 (péssimo).
Investigando o detalhe, quase todo esse peso vem de **recursos de terceiro carregados depois
de clicar num `.iframe-placeholder`** — o embed do Figma sozinho carrega ~9,6 MB de WASM
(harfbuzz) + ~4,3 MB de JS, e o preview do `iteamflix-clone.netlify.app` carrega pôsteres de
filme em PNG não otimizado (vários de 200–340 KB cada). **Isso não é regressão do payload
inicial do site** — é o padrão *lazy* (`.iframe-placeholder`) funcionando como projetado: o
peso só existe se o visitante pedir. Mas se alguém rodar Lighthouse sem saber disso, vai
achar que o site pesa 26 MB de cara, o que é falso. **Daqui pra frente: sempre auditar em dois
estados separados — antes de clicar nos placeholders (payload real do primeiro load) e depois
(payload do embed, opt-in) — e nunca somar os dois como se fossem a mesma coisa.**

**Correção / padrão:**
1. **Resolvido** (`fix/lighthouse-a11y-perf`, commit `23f865e`): `globe.gl` já estava atrás da
   degradação `isMobile`, mas no desktop rodava síncrono no meio do carregamento crítico —
   agora a criação do globo (`initGlobe()`) é adiada com `requestIdleCallback` (fallback
   `setTimeout` pra navegador sem suporte), pra não competir com o main thread na janela
   crítica. Não precisou de `IntersectionObserver`/`.reveal` porque o hero já está visível
   desde o primeiro frame — adiar por tempo ocioso é o que faz sentido aqui, não por scroll.
2. **Aberto**: Font Awesome via cdnjs carregando o kit inteiro pra ~15 ícones usados (98% do
   CSS não usado). Não mexido ainda — subsetar exigiria o Kit builder do próprio Font Awesome
   (conta + build) ou trocar pra SVG inline em cada ícone, e o CLAUDE.md pede "usar, não
   recarregar" o que já está no `<head>`; qualquer uma das duas rotas muda _como_ o ícone é
   servido, não é só "recarregar" — mas ainda assim é uma mudança de dependência/padrão que
   merece confirmação explícita antes de aplicar, não decisão unilateral numa sessão de fix.
3. **Aberto**: dívida de imagens (~22 MB, entrada acima) — resolver ela também resolve boa
   parte do `image-delivery-insight`.

**Gap de cobertura descoberto:** não existe skill de performance aplicável a este repo —
`next-performance-guide` é 100% Next.js e não serve aqui (ver correção no `design-audit`).
Enquanto isso, a auditoria de performance deste repo é: gerar Lighthouse JSON manualmente
(ver `accessibility-test` Modo B, mesmo mecanismo) e ler os `audits` de performance direto.