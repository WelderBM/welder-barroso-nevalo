# Contexto — Nova seção "Showcase / Estudo de Caso: Mix Webapp"

> **Para o agente (Claude Code no VS Code):** este documento é o briefing completo para
> criar uma seção de destaque dedicada ao **Mix Webapp** no portfólio. Leia por inteiro
> antes de tocar em qualquer arquivo. Não é para criar projeto novo — é para **elevar** um
> projeto que já existe hoje como um simples card.

---

## 0. Objetivo

Hoje o Mix Webapp aparece no portfólio apenas como o **primeiro flip card** da grade
`.projects-grid`, visualmente idêntico a clones de estudo (Netflix, Instagram, etc.).

O objetivo é **promovê-lo a um estudo de caso dedicado** — uma seção própria, no mesmo
nível hierárquico da seção `#prototipagem` — que conte a história técnica do projeto:
qual problema resolve, quais decisões de arquitetura foram tomadas, e link para a loja
em produção e o repositório.

Isso posiciona o Mix como **o projeto-flagship** do portfólio e reforça o perfil-alvo:
*"frontend com base sólida de backend"* — não fullstack raso.

---

## 1. Estado atual do portfólio (verdade técnica — não presumir nada além disto)

| Item | Valor |
|---|---|
| Tipo | Site estático **vanilla** — HTML + CSS + JS puro. **Sem build, sem framework, sem npm.** |
| Arquivos | `index.html`, `style.css`, `scripts.js`, `assets/` |
| Branch default | `Welder-Barooso-Nevalo` |
| Ícones | Font Awesome (classes `fa-solid`, `fa-brands`) já carregado |
| Fontes | **Bebas Neue** (títulos), **Lora** (corpo serifado), **DM Mono** (labels/mono) — já no `<head>` via Google Fonts |

### 1.1 Ordem atual das seções (e da navbar)
`#hero → #sobre → #stack → #projetos → #prototipagem → #experiencia → #formacao → #contato`

A navbar (`ul.nav-links`) espelha esses ids. **Qualquer seção nova exige entrada
correspondente na navbar.**

### 1.2 Design tokens (do `:root` em `style.css` — usar SEMPRE via `var(--x)`, nunca hex cru)
```css
--ink: #03080f;      --deep: #060e1c;     --navy: #0a1628;
--surface: #0e1e34;  --surface2: #142540;
--teal: #1be4c8;     --teal-dim: rgba(27,228,200,.1);  --teal-glow: rgba(27,228,200,.05);
--water: #a8d8ea;    --gold: #d4a853;
--white: #f0f4f8;    --mist: #7a90a4;     --mist2: #3d5166;
--border: rgba(168,216,234,.07);
```

### 1.3 Padrões estruturais a reutilizar (não inventar novos)
- **Cabeçalho de seção:**
  ```html
  <section id="...">
    <div class="sec-header reveal">
      <div class="sec-tag">Rótulo curto em mono</div>
      <h2 class="sec-title">Título em Bebas</h2>
    </div>
    ...
  </section>
  ```
- **Animação de entrada:** adicionar a classe `.reveal` em blocos que devem animar ao
  entrar na viewport. O observer já está montado em `scripts.js` (linha ~134,
  `IntersectionObserver` sobre `.reveal`). **Não escrever novo JS de scroll.**
- **Botões:** `.btn.btn-primary` (padrão) e modificador `.btn-sm`. Já estilizados.
- **Separador entre seções:** `<div class="divider"></div>` entre uma seção e a próxima.
- **Iframe/preview pesado:** padrão *lazy* — placeholder clicável (`.iframe-placeholder`)
  que só carrega o embed ao clique (ver `loadFigmaEmbed` em `scripts.js`). Se for embutir
  preview ao vivo do Mix, seguir esse padrão para não pesar o load inicial.

### 1.4 Onde o Mix está hoje (o que sai / muda)
Card atual em `index.html`, dentro de `.projects-grid`, é o **primeiro** `.proj.reveal`:
- Tipo: `Web App · Full Stack` · Título: `Mix Webapp`
- Tags: `Next.js`, `Firebase`, `Zustand`
- Imagem: `assets/ecommerce-print.png` · Link: `https://github.com/WelderBM/mix-webapp`

**Decisão a aplicar (ver §3.1):** remover esse card da grade para evitar redundância — o
projeto passa a viver na seção dedicada. A grade `.projects-grid` continua com os demais.

---

## 2. O que é o Mix Webapp (substância para o copy — usar isto, não improvisar)

**Resumo:** e-commerce em produção, feito solo, que serve como loja real **e** peça de
portfólio. É um projeto próprio (marca Nevalo) — **não** é trabalho para cliente pago.

- **Live:** `https://mixnovidades.com` — *antes de adicionar o botão "Ver ao vivo",
  confirmar que a URL resolve; se não, deixar só o link do GitHub.*
- **Repo:** `https://github.com/WelderBM/mix-webapp`
- **Stack real:** Next.js 16 · React 19 · TypeScript · Firebase/Firestore · Zustand · Vercel

### 2.1 O que torna o projeto tecnicamente interessante (os destaques do estudo de caso)
Escolher 3–4 destes para o copy — são o argumento de "base sólida de backend/arquitetura":

- **Engine de kits customizáveis (KitBuilder):** o cliente monta o próprio presente
  combinando produtos; a montagem fica atrás de uma *feature flag* (fail-closed) para
  controlar o que vai à produção.
- **Modelagem de domínio de produtos:** famílias **Fita / Laço / kit**, com tipos como
  `RIBBON` (Fita) e `READY_BOW` (laços prontos) — domínio de negócio real modelado em
  tipos.
- **Arquitetura de taxonomia multi-eixo:** produtos classificados por
  `type / category / StoreSection / tags`; a **navbar é gerada dinamicamente** a partir
  da coleção `categories` (nada hard-coded).
- **`SectionSource` como union discriminada:** cada vitrine da loja pode ser alimentada
  por modo `manual`, `category`, `tag` ou `auto` — modelado com discriminated unions em
  TypeScript.
- **UX de carrinho e pedidos:** `CartSidebar` com *progressive disclosure*; `OrdersTab`
  com restauração de scroll/estado; painel admin próprio.
- **Fluxo de engenharia:** CI/CD na Vercel; branch `dev` de integração e `master` de
  produção protegido; automação de tarefas via infraestrutura de *skills* em
  `.claude/skills/`; trabalho paralelo com git worktrees.

### 2.2 Guardrails de veracidade (importante — não estourar isto)
- ✅ Pode: "loja em produção", "projeto próprio", "e-commerce full stack", descrever a
  arquitetura acima.
- ❌ Não pode: inventar número de usuários, faturamento, clientes, "milhares de pedidos",
  prêmios, ou qualquer métrica. Não há cliente pago nem receita — é projeto pessoal.
- Se precisar de "números", usar fatos verificáveis do próprio código/stack
  (ex.: "Next.js 16 / React 19", "tipagem estrita em TypeScript"), nunca métricas de negócio.

---

## 3. Especificação da nova seção

### 3.1 Posicionamento (decisão de arquitetura — recomendação + alternativa)
**Recomendado:** inserir a seção **logo após `#stack` e antes de `#projetos`** (id
sugerido: `#mix` ou `#estudo-de-caso`). Assim o flagship aparece *antes* da grade de
projetos menores — o visitante vê o melhor primeiro. Remover o flip card do Mix da grade.

**Alternativa:** manter a ordem e inserir entre `#projetos` e `#prototipagem`. Escolher
esta só se o Welder preferir que a grade venha antes. *Confirmar a preferência antes de
mover; na dúvida, seguir a recomendada.*

Em ambos os casos: **atualizar a navbar** com o novo link (ex.: `<li><a href="#mix">Mix</a></li>`)
e adicionar `<div class="divider"></div>` para separar da seção seguinte.

### 3.2 Estrutura de conteúdo (formato estudo de caso, não card)
Sugestão de blocos dentro da seção (adaptar às classes existentes; criar CSS novo só se
necessário e sempre com os tokens de `:root`):

1. **`sec-header`** — `sec-tag`: "Estudo de Caso" · `sec-title`: "Mix Webapp".
2. **Linha de contexto** (1–2 frases): o que é a loja e para quem (presentes/decoração,
   com kits montáveis).
3. **Destaques de arquitetura** — 3–4 itens da §2.1, cada um com título curto + 1 frase.
   Pode usar cards/grid ou lista com ícones Font Awesome.
4. **Stack** — chips reutilizando o visual de `.proj-tag`.
5. **Media** — usar `assets/ecommerce-print.png` (já existe). Preview ao vivo é opcional
   e, se usado, deve seguir o padrão *lazy* do §1.3.
6. **CTAs** — `.btn.btn-primary` "Ver ao vivo →" (só se a URL resolver) + botão/anchor
   "Ver no GitHub →".

### 3.3 Assets
- Já disponível: `assets/ecommerce-print.png`.
- Se quiser um print mais atual da loja, **não gerar imagem** — pedir o arquivo ao Welder
  e referenciá-lo por caminho relativo.

---

## 4. Restrições de implementação (o que NÃO fazer)
- **Nada de dependências novas.** Sem npm, sem framework, sem bibliotecas. Continua vanilla.
- **Nada de JS de animação novo** — reaproveitar `.reveal`.
- **Nada de cor hex crua** — sempre `var(--token)`.
- **Não quebrar a navbar** — todo id de seção precisa do link correspondente.
- Preservar o estilo de fim de linha do repositório (o HTML atual usa CRLF).
- Manter acessibilidade: `alt` nas imagens, `aria-label` em botões-ícone, contraste
  suficiente (o tema é escuro).
- Mudança em **um branch/PR próprio** seguindo o fluxo do Welder (não commitar direto na
  branch default).

## 5. Checklist de aceite
- [ ] Seção dedicada do Mix criada com `sec-header` no padrão existente.
- [ ] Flip card antigo do Mix removido da `.projects-grid` (sem card órfão/duplicado).
- [ ] Novo link na navbar, apontando para o id correto, na ordem certa.
- [ ] `divider` adicionado entre a nova seção e a seguinte.
- [ ] 3–4 destaques de arquitetura, todos verídicos (§2.1), sem métrica inventada (§2.2).
- [ ] CTAs corretos; "Ver ao vivo" só se `mixnovidades.com` resolver.
- [ ] Somente tokens `var(--x)`; sem dependência nova; `.reveal` reutilizado.
- [ ] Página abre sem erro de console e sem quebrar seções vizinhas.