# ui/

Primitivos de estilo, não um design system à parte. Cada um existe porque o
padrão já se repetia em 2+ lugares — não adicione variant nova sem um segundo
uso real puxando por ela.

Tokens vêm de `src/index.css` (`@theme`): `ground`, `surface`, `steel`, `amber`,
`ember`, `figure`, `bone`, `slate`, `hair`, `radius-card` (`rounded-card`).

## Button
`variant`: `primary` (`rounded-card` âmbar, ação de envio — nada de pill/círculo,
o design não é rounded) · `secondary` (retângulo, borda que vira âmbar no hover
— CTA de formulário) · `ghost` (toggle discreto, usa `active` pra grudar o
estado aberto/selecionado em âmbar).

## Input
Campo bordado padrão (`rounded-card border-hair`). Não serve pro textarea do
Composer — aquele é borderless e vive dentro de um `Panel`, não é um campo
autônomo.

## Panel
`rounded-lg border-hair bg-surface`, sem shadow no base — cada uso define a
própria elevação (`shadow-sm` pra inline, `shadow-lg` pra dropdown flutuante).
Combinar variant de shadow não é seguro sem tailwind-merge, então isso é
propositalmente deixado de fora do primitivo.

## Label
Readout uppercase com tracking, sem variant — só o estilo dos headers de
seção do `SourcesControl` por enquanto. Ganha `size`/`tone` de volta (era
`cva`) se aparecer um segundo padrão real puxando por isso.

## Dot
Indicador de status (`online` | `offline`), usado no `HealthDot`.
