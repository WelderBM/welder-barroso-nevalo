# Portfólio Welder Barroso — welder-barroso-nevalo

Site pessoal e portfólio de Welder Barroso, vitrine da marca **Nevalo**, em produção em
**welderbarroso.dev**. Página única, **100% vanilla** (HTML semântico + CSS3 + JS puro,
sem framework, sem npm, sem build). É a peça central da presença profissional — o
posicionamento-alvo é **"frontend com base sólida de backend/arquitetura"**, e toda
mudança reforça isso.

**Se você é uma sessão nova, leia isto inteiro antes de mexer em qualquer coisa.** Antes de
assumir que a árvore está limpa, rode `git branch --show-current` + `git status` (e
`git branch -a` se for operar em git). Se o HEAD estiver numa branch que você não criou ou
houver modificações que não são suas: **PARA, avisa, e não "corrige" o chão por conta
própria.**

## Restrições invioláveis
- ❌ Nada de framework, biblioteca npm, bundler ou build step. Continua vanilla.
- ❌ Nada de cor hex crua no CSS — **sempre** `var(--token)` (tokens abaixo).
- ❌ Nada de JS novo de scroll/animação — reutilizar a classe `.reveal`.
- ✅ Font Awesome (`fa-solid`/`fa-brands`) e Google Fonts já estão no `<head>` — usar, não recarregar.
- ✅ Preservar o fim de linha do HTML (`index.html` usa **CRLF**).
- ✅ Acessibilidade sempre: `alt` em imagem, `aria-label` em botão-ícone, ordem de headings coerente, contraste (tema escuro).

## Arquivos e estrutura
```
index.html    → toda a página (uma só)
style.css     → todos os estilos (tokens no :root)
scripts.js    → cursor, canvas de fundo, flip cards, reveal, globe.gl, lazy iframe
assets/       → prints dos projetos + foto de perfil (.png)
README.md     → descrição bilíngue
```
**Ordem das seções (a navbar espelha):**
`#hero → #sobre → #stack → #projetos → #prototipagem → #experiencia → #formacao → #contato`
> Toda seção nova exige `<li><a href="#id">` correspondente em `ul.nav-links`, na mesma
> ordem, e `<div class="divider"></div>` separando das vizinhas.

## Design System (Nevalo) — tokens no `:root`
```css
--ink:#03080f;  --deep:#060e1c;  --navy:#0a1628;
--surface:#0e1e34;  --surface2:#142540;
--teal:#1be4c8;  --teal-dim:rgba(27,228,200,.1);  --teal-glow:rgba(27,228,200,.05);
--water:#a8d8ea;  --gold:#d4a853;
--white:#f0f4f8;  --mist:#7a90a4;  --mist2:#3d5166;
--border:rgba(168,216,234,.07);
```
Fontes: **Bebas Neue** (títulos) · **Lora** (corpo serifado) · **DM Mono** (labels/mono).

## Convenções de código (o "jeito da casa")
- **Cabeçalho de seção:** `<section id> → <div class="sec-header reveal"> → <div class="sec-tag"> (mono) + <h2 class="sec-title"> (Bebas)`.
- **Animação de entrada:** classe `.reveal` no bloco; o `IntersectionObserver` já está em `scripts.js` (~L134). Nada de JS novo.
- **Botões:** `.btn.btn-primary`, modificador `.btn-sm`.
- **Cards de projeto:** `.projects-grid > .proj.reveal > .proj-flip-inner` (`.proj-front`/`.proj-back`), flip no hover; tags via `.proj-tag`.
- **Embed pesado/iframe:** padrão *lazy* — placeholder clicável `.iframe-placeholder` que só carrega ao clique (ver `loadFigmaEmbed`). Aplicar a qualquer preview ao vivo.
- **Antes de criar abstração nova, procure o padrão já existente pra reaproveitar** (sec-header, card de projeto, botão, reveal, iframe-placeholder). Consistência > novidade.
- **Sem comentário decorativo** — só quando o *porquê* não é óbvio (decisão contra-intuitiva, limitação, bug que já mordeu).

## Fluxo de git (regra, não sugestão)
> Estado atual: repo **single-branch**, default `main` (renomeado em 2026-07-30 a pedido do
> Welder — antes era `Welder-Barooso-Nevalo`, com typo; a origin já reflete a troca). Esse é
> o branch de **release/produção** — o que vai pro ar em welderbarroso.dev.

- **Nunca commitar direto no branch de release.** Todo trabalho vive numa branch de feature.
- **Setup único recomendado:** criar uma branch de integração `dev` a partir do release
  (`git checkout main && git pull && git checkout -b dev && git push -u origin dev`).
  Depois disso: toda branch de trabalho nasce de `dev`, todo PR volta pra `dev`, e o release
  é atualizado só por **promoção periódica** `dev` → release (não é o dia a dia).
- **Uma mudança = uma branch = um PR** pequeno e revisável (modelo de dados/conteúdo →
  estilo → integração), não um PR gigante. Nome de branch descritivo.
- Todo PR que atende uma issue referencia com `Closes #N` (merge fecha a issue sozinho).
- **Validação local é obrigatória antes de qualquer merge** (ver "Ritual" abaixo). PRs
  ficam abertos até o Welder validar — isso é esperado, não um bloqueio a resolver sozinho.
- **Merge e deploy são ação do Welder, nunca do agente.** (Confirmar o host/CI com ele
  antes de assumir qualquer comando de publicação — o site está em welderbarroso.dev.)
- **Promoção:** antes de promover `dev` → release, criar tag anotada `promo-YYYY-MM-DD` no
  HEAD de `dev` e dar push — ponto de retorno nomeado para rollback.
- Apagar branches locais já mescladas (`git branch -d`).
- HEAD diferente do esperado ao rodar comando git → para e avisa; nunca "corrige" sozinho.
- *(Não se aplica aqui, diferente do mix-webapp: staging Firebase, worktrees, seed, suíte de testes. Site estático não tem essa maquinaria.)*

## Ritual antes de todo commit (definition of done num site estático)
Sem build/typecheck/testes, o "verde" é manual e não-negociável:
1. Abrir `index.html` no navegador e conferir o **console limpo** (zero erro/warning novo).
2. Conferir a mudança em **desktop E mobile** (largura ≤900px — é onde `scripts.js` degrada:
   cursor e globe desligam, menos partículas). Nada pode quebrar nesses dois pontos.
3. Conferir que **nenhuma âncora da navbar quebrou** e que a seção alvo aparece na ordem certa.
4. Se tocou markup: revisar acessibilidade (alt/aria/headings/contraste).
5. Se adicionou/trocou imagem: ver "Performance" abaixo antes de commitar.

## Performance é regra permanente (não pedido pontual)
O site usa Lighthouse como argumento — regressão de performance é regressão de posicionamento.
- **Imagens de projeto pesam demais hoje: `assets/` = ~22 MB, com `netflix-print.png` em ~9,8 MB.** Toda imagem nova ou trocada deve entrar já otimizada (comprimida, dimensão condizente com o uso, formato eficiente) e com `loading="lazy"`. Não adicionar peso sem necessidade.
- Assumir **celular de entrada como baseline**, não topo de linha. Respeitar a degradação por `isMobile` já existente em qualquer efeito novo.
- Nada de script bloqueante no `<head>`; manter canvas/globe baratos.

## Roteador de skills (gatilho por evento) — ativa quando `.claude/skills/` existir
Skills funcionam só pela pasta `.claude/skills/<nome>/SKILL.md` (não dependem do `settings.json`).
As descriptions disparam bem por *pedido*, mas falham quando o gatilho é um *evento* no meio de outra tarefa — as regras abaixo cobrem isso:
- markup/estrutura HTML alterada (nova seção, conteúdo novo) → rodar a skill de **acessibilidade**.
- mudança visual/CSS significativa → **auditoria de design** (aderência aos tokens, espaçamento, responsivo).
- início de sessão de planejamento, ou sensação de "site crescendo demais" → **varredura de saúde** (links quebrados, assets órfãos, imagens sem lazy, peso da página).
- imagem nova em `assets/` → confirmar otimização (peso/dimensão/`loading="lazy"`).
- HEAD inesperado ao rodar git → para e avisa.
> **Cuidado ao trazer skills do mix-webapp:** as que assumem Next/npm/Vercel/Firestore
> (`deploy-vercel`, `next-performance-guide`, `auditoria-de-dependencias`, `unit-test`/Jest)
> **não se aplicam** a site estático. Triar por aplicabilidade antes de copiar.

## Documentação viva
- **`docs/claude-lessons.md`** — catálogo de bugs reais, causas-raiz e padrões descobertos,
  pra não redescobrir o mesmo problema em outra sessão. Se você (Claude) aprender algo que
  vai te morder de novo — gotcha de biblioteca, decisão de arquitetura não óbvia, bug sutil —
  registre lá **antes** de terminar a tarefa. *(Primeira semente sugerida: o peso de 22 MB
  dos assets e o plano de otimização.)*
- **Pipeline de graduação:** lição nova entra no `claude-lessons.md`; quando uma categoria
  acumula 3+ entradas relacionadas ou vira um procedimento com passos, ela gradua pra uma
  skill em `.claude/skills/` (o lessons.md fica com uma linha apontando pra skill).

## Sobre o dono (para escrever copy correto)
Fatos autoritativos — usar estes se editar Sobre/Experiência/Formação/projetos:
- Welder Barroso de Melo, ~22 anos, Boa Vista, Roraima. Fundador da **Nevalo** (nevalo.dev).
- **Stack:** React, Next.js, TypeScript, Tailwind, Firebase, React Native, Node.js.
- **Experiência:** R2T (fev–dez 2022, único frontend, Lighthouse 60→90+) · Pigz (fev–jun 2025, React/React Native).
- **Formação:** ITEAM Full Stack (372h, término ~jul/2026) · Estácio Eng. de Software (2026–~2029/2030) · Técnico em Informática pelo **IFRR** (nome correto: IFRR).
- **Produção:** mixnovidades.com · **Portfólio:** welderbarroso.dev · **GitHub:** github.com/WelderBM.
- **Contato:** welderbarroso.dev@gmail.com · WhatsApp +55 95 98400-6377 · LinkedIn linkedin.com/in/welder-barroso-37b654207.

### Guardrails de veracidade (não estourar)
- ❌ **Nevalo = projetos pessoais.** Sem cliente pago, sem receita, sem número de usuários. Não inventar métrica de negócio, prêmio ou depoimento. A marca é posicionamento e identidade — não faturamento.
- ❌ **Não** afirmar nível de inglês (ex.: "B1/B2"). Leitura é forte; conversação/escuta em desenvolvimento e **não calibradas por teste**. Se precisar mencionar, algo como "inglês técnico para leitura" — nada de nível certificado.
- ✅ Nomes corretos sempre: **IFRR**, **ITEAM**, **Estácio**, **Nevalo**.
- ✅ "Números" só se verificáveis no próprio código/stack, nunca métrica de negócio.

## Projeto-flagship: Mix Webapp
É o projeto mais robusto do portfólio e deve ser tratado como destaque (hoje está subdimensionado como um flip card na grade).
- **Live:** mixnovidades.com · **Repo:** github.com/WelderBM/mix-webapp
- **Stack:** Next.js · React · TypeScript · Firebase/Firestore · Zustand · Tailwind · Vercel
- **Substância (usar no copy, tudo verídico):** e-commerce de presentes/decoração feito solo, em produção; **Kit Builder** (montagem de presente, atrás de feature flag fail-closed); **Central de Fitas** com modos rolo/metro/laço (família `Fita`, antiga "Laço"; laços prontos = `READY_BOW`); taxonomia multi-eixo (`type/category/StoreSection/tags`) com navbar gerada da coleção `categories`; `SectionSource` como união discriminada (manual/category/tag/auto); checkout com PIX, entrega ou retirada; painel admin próprio; CI/CD na Vercel.
> **Tarefa ativa relacionada:** promover o Mix de flip card a uma **seção dedicada de
> estudo de caso**. Se existir `docs/showcase-mix-context.md`, segui-lo. Ao criar a seção,
> remover o flip card antigo do Mix da grade para não duplicar.