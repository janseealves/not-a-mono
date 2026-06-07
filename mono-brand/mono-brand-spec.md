# [mono] — sistema de identidade

Specs técnicas da identidade visual do **MONO**, a persona do agente de `not-a-monolith`.
Versão `brandbook v1`. Tudo aqui é pronto pra colar no front.

---

## conceito em uma linha

MONO é o superintendente que **parece um monolito, mas é modular**. O símbolo é uma laje
de 4 segmentos: em repouso, um bloco coeso; em trabalho, a laje **dobra nas juntas** —
os segmentos giram em ângulos alternados (16°) e formam um zigue-zague articulado, como
o TARS reconfigurando o próprio corpo.

- **MONO** → a persona do agente (tem voz, personalidade, "corpo" = a laje).
- **not-a-monolith** → o projeto/repo que arma a piada antes do MONO entrar em cena.

---

## regra de aplicação (importante)

- **A figura é preta; o âmbar é o chão.** O ícone vive sobre um campo âmbar — preto sobre âmbar.
- **O âmbar fica reservado ao ícone**, como um selo. No resto da interface o ambiente é **escuro**
  (obsidiana). Para uso monocromático dentro da UI escura, existe o símbolo em âmbar sobre transparente.
- Cantos do *tile* arredondados (~22%); **segmentos sempre retângulos de canto reto**.

---

## paleta

| token | nome | hex | uso |
|---|---|---|---|
| `--ground` | obsidiana | `#0B0C0E` | fundo da UI (ambiente escuro) |
| `--surface` | grafite | `#16181C` | cards, painéis |
| `--surface-2` | aço | `#23262C` | relevo, trilhos, bordas ativas |
| `--accent` | âmbar | `#FFB02E` | chão do ícone · ênfase · estado ativo |
| `--accent-deep` | brasa | `#C8740A` | profundidade, estado pressionado |
| `--figure` | preto | `#0A0B0D` | a figura do símbolo (segmentos) |
| `--text` | osso | `#E7E4DD` | texto primário |
| `--text-muted` | ardósia | `#6B7079` | texto secundário, labels |
| `--hair` | — | `rgba(231,228,221,.10)` | divisores finos |

**Disciplina:** UI escura com **um** âmbar. O âmbar é caro — chão do ícone, ênfase e estado ativo.
Texto nunca em âmbar (exceto micro-ênfase pontual).

---

## tipografia

| papel | família | pesos | uso |
|---|---|---|---|
| display | **Martian Mono** | 400 / 500 / 600 / 700 | wordmark, títulos, números |
| corpo | **IBM Plex Mono** | 300 / 400 / 500 / 600 | texto, labels, console |

Wordmark: Martian Mono **600**, all-lowercase, `letter-spacing` ~-0.04em.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Martian+Mono:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## variáveis CSS (cole no `:root`)

```css
:root{
  --ground:#0B0C0E;
  --surface:#16181C;
  --surface-2:#23262C;
  --accent:#FFB02E;
  --accent-deep:#C8740A;
  --figure:#0A0B0D;
  --text:#E7E4DD;
  --text-muted:#6B7079;
  --hair:rgba(231,228,221,.10);

  --font-display:'Martian Mono',monospace;
  --font-mono:'IBM Plex Mono',monospace;
  --radius:3px;
}
body{background:var(--ground);color:var(--text);font-family:var(--font-mono);font-weight:300}
```

## tailwind (extend)

```js
theme:{ extend:{
  colors:{
    ground:'#0B0C0E', surface:'#16181C', steel:'#23262C',
    amber:'#FFB02E', ember:'#C8740A', figure:'#0A0B0D',
    bone:'#E7E4DD', slate:'#6B7079',
  },
  fontFamily:{
    display:['"Martian Mono"','monospace'],
    mono:['"IBM Plex Mono"','monospace'],
  },
}}
```

---

## wordmark

Forma: `[mono]` — colchetes em âmbar (peso 400), nome em osso (peso 600), sobre obsidiana.
Os colchetes são o **array de um elemento só**: a lista que finge ser singular.
Sobre âmbar, distinção pelo peso (colchetes 400, nome 600), ambos em obsidiana.

**Faça:** sempre minúsculo · colchetes mais leves que o nome · espaçamento monospace nativo.
**Não faça:** capitalizar · trocar fonte ou itálico · pintar o nome de âmbar.

---

## símbolo — índice de arquivos (pasta `logo/`)

| arquivo | uso |
|---|---|
| `mono-icon-articulated-{1024,512,192}.png` | **app icon primário** — preto articulado sobre âmbar |
| `mono-icon-monolith-{1024,512,192}.png` | versão em repouso — preto coeso sobre âmbar |
| `mono-favicon-{64,48,32,16}.png` | favicon — preto sobre âmbar |
| `mono-symbol-articulated-amber-1024.png` | símbolo monocromático âmbar p/ **UI escura** |
| `mono-symbol-monolith-amber-1024.png` | idem, repouso |
| `mono-symbol-{articulated,monolith}-black-1024.png` | símbolo preto sobre transparente (campos claros/âmbar) |
| `mono-wordmark-{obsidian,bone,amber}.png` | wordmark `[mono]` por fundo |

Geometria: 4 segmentos retangulares. Articulação = cada junta dobra **16°** em direções
alternadas, mantendo os segmentos conectados (uma laje que se dobra, não pedaços soltos).

---

## voz do MONO

Seco, preciso, levemente afiado. Fala pouco, acerta o ponto, provoca de vez em quando.
Nunca bajula, nunca enrola. Herança dos diais de humor/honestidade do TARS.

| ajuste | efeito |
|---|---|
| franqueza alta | "Encontrei. Estava no terceiro documento — sempre está. 0.42s." |
| humor alto | "Achei. Você poderia ter feito um grep, mas é pra isso que eu existo." |
| diplomático | "Localizei o que precisava. Avise se quiser que eu detalhe." |

Defaults: humor 60 · franqueza 90 · verbosidade 25.

---

## próximo passo

Com os tokens acima, o front vira execução: a UI mostra o MONO **pensando** — cada estágio
do grafo (ingest → retrieve → reason → respond) dobra uma junta do slab. A interface é a
anatomia do monolito se articulando em tempo real.
