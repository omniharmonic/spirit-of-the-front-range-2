# Pixel-perfect migration of spiritofthefrontrange.org

These scripts rebuilt this OpenSpace site from the original Astro site
(`SPIRIT-of-the-Front-Range/spirit-website`) so that it renders identically while staying
editable in OpenSpace Studio. Work by Benjamin Life (@omniharmonic).

## How it works

`convert.mjs` reads the original site's built pages (`npm run build` with
`USE_CUSTOM_DOMAIN=true`) and, for every page, turns the masthead, each section of `<main>` and
the footer into an OpenSpace custom component:

- Markup is kept as-is. Every text node becomes a text field, every link a link field, every
  image an image field. Repeated siblings (menu items, cards, list entries) become list fields,
  and oversized sections are folded into groups to stay within the 40-field limit.
- CSS is the original stylesheet, trimmed to what each section uses and adapted to the
  component rules: `@layer` unwrapped, `@property` turned into defaults, `rem` converted to px
  (the original root size is 17px), `html`/`body`/`:root` mapped to `:scope`, custom property
  names without digits, and Tailwind class names aliased to safe names.
- Fonts load from Google Fonts. These are the same files the original bundles: Bricolage
  Grotesque, Fraunces and Public Sans are byte-identical, and JetBrains Mono comes as the variable
  version.
- SVG duotone filters can't live in a component, so the nine affected photos have the filter
  baked into the image file (`filters.json` lists what the original browser applied).
- Pages hide OpenSpace's standard header; the site footer is the footer component.
- Every image points at a copy in the OpenSpace media library (`hubmedia.json`). The editor
  only shows images it holds, so files committed straight to `media/` appear in the published
  site but not in Studio. Images over 2400px were uploaded as high-quality 2400px copies
  (`upload/`).

## Keeping Studio in step

Studio edits a draft kept by the OpenSpace Hub. A push to `main` updates the live site but not
that draft. After pushing, call `discard_draft` (it resets the draft to the live version), then
check `get_draft_diff` reports no changes. If a component is renamed or removed, the Hub can keep
the old name on a page; keep the old component name in that case.

## Re-running

```
node .openspace/migration/filters.js            # needs the original served on :8802
node .openspace/migration/convert.mjs <original dist> . .openspace/migration/gfonts.css
npx openspace check && npm run build
node .openspace/migration/compare.js <original url> <new url> out / /mission/ …
node .openspace/migration/layout.js <original page url> <new page url> 1440
WIDTHS=1280,1024,834,768 node .openspace/migration/compare.js …   # other widths
node .openspace/migration/jpgpair.js <screenshot_url pieces> -- <screenshot pieces>   # Studio renderer vs original
```

Run the scripts from a folder that has `linkedom`, `postcss`, `postcss-selector-parser`, `sharp`,
`playwright`, `pngjs` and `pixelmatch` installed.

Note: re-running `convert.mjs` regenerates `content/pages`, `content/components`,
`content/site.json` (footer) and `content/media.json` from the original site, so it overwrites
any edits made in Studio since.
