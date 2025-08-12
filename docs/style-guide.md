# Style Guide

Design tokens derived from reference “Эко”.

## Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#ffffff` | основной фон |
| `--bg-secondary` | `#ffffff` | вторичный фон (совпадает с основным) |
| `--text-primary` | `#3f3f3c` | основной текст |
| `--text-secondary` | `#6b6b66` | второстепенный текст |
| `--accent-1` | `#8a9d91` | зелёный акцент, основные кнопки |
| `--accent-2` | `#d4a373` | тёплый акцент |
| `--muted` | `#ffffff` | приглушённые элементы |
| `--border` | `#d2cec5` | границы и контуры |
| `--surface` | `#ffffff` | поверхности |
| `--shadow` | `0 8px 24px rgba(0,0,0,.06)` | тени |

## Typography

- Гарнитуры:
  - Заголовки: `Great Vibes`, cursive.
  - Текст: `Playfair Display`, serif.
  - Даты: `Cinzel`, serif.
- Масштаб (rem): `0.75`, `0.875`, `1`, `1.25`, `1.5`, `2`, `2.5`, `3.5`  (соответствует 12–56 px).
- Межстрочный интервал: 1.5 для текста, 1.2 для заголовков.
- Трекинг для крупных заголовков: `-0.02em`.

## Radii & Shadows

- `--radius-sm`: `0.5rem` (≈8 px)
- `--radius-md`: `0.875rem` (≈14 px)
- `--radius-lg`: `1.25rem` (≈20 px)
- `--shadow`: `0 8px 24px rgba(0,0,0,.06)`

## Spacing & Grid

- Базовый шаг: 8 px.
- Пространства: `--space-1`…`--space-4` = 0.5/1/1.5/2 rem.
- Контейнер: `max-width: 1200px`, `padding-inline: var(--space-3)`.

## Breakpoints

- `--bp-sm`: 480 px
- `--bp-md`: 768 px
- `--bp-lg`: 1024 px
- `--bp-xl`: 1280 px

## Composition patterns

- Крупный hero с именами и датой.
- Светлые карточки с мягкими тенями на кремовом фоне.
- Прозрачные и ghost‑кнопки, зелёный primary.
- Деликатные разделители и воздушные отступы.
