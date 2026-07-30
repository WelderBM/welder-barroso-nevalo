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