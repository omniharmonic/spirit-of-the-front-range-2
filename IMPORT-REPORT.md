# Import report: SPIRIT of the Front Range

Imported from https://spiritofthefrontrange.org on 2026-10-29 with `openspace import url`.
Sources: page HTML, the sitemap. 45 requests.

## Summary

- **13** pages, **0** collection items in 0 collection(s)
- **26** media files (6.8 MB) downloaded into `media/`
- **0** redirects so old addresses keep working
- **6** item(s) need your attention (below)

## Pages

| Old address | OpenSpace | Title | Sections | Blocks |
| --- | --- | --- | ---: | ---: |
| `/` | `/` | Home | 12 | 33 |
| `/mission` | `/mission` | → Mission | 11 | 21 |
| `/programs` | `/programs` | → Programs | 11 | 16 |
| `/the-commons` | `/the-commons` | → The Commons | 7 | 12 |
| `/stewards` | `/stewards` | → Stewards | 8 | 13 |
| `/connect` | `/connect` | → Connect | 5 | 11 |
| `/catalog` | `/catalog` | A small reading list. | 4 | 6 |
| `/donate` | `/donate` | Donate to SPIRIT. | 7 | 14 |
| `/words` | `/words` | Words from people we trust. | 11 | 17 |
| `/programs/commons-sense-education` | `/programs/commons-sense-education` | Commons Sense Teach-Ins We all benefit from Commons Sense. | 8 | 14 |
| `/programs/community-grant-rounds` | `/programs/community-grant-rounds` | Community Grant Rounds | 6 | 11 |
| `/programs/neighborhood-resiliency` | `/programs/neighborhood-resiliency` | Neighborhood Resiliency Programs because there is no going it alone. | 8 | 14 |
| `/programs/solidarity-suppers` | `/programs/solidarity-suppers` | Solidarity Suppers be fed with intention. | 8 | 14 |

## Design

The look was recreated with OpenSpace's own design system (Site Styles tokens, section color themes, layouts and section presets), not by copying the original site's CSS or code.

- Brand color #e8b58a (the site's accent color).
- Fonts on the original site: Bricolage Grotesque Variable / Public Sans Variable → pairing "Bricolage Grotesque & Geist" (Bricolage Grotesque / Geist), the closest curated match. Licensed fonts can be uploaded in Site Styles → Fonts.
- Type scale on the original site: Heading 1 is 6.5× body text (very large; OpenSpace's display preset is the nearest). Density "comfortable" from the section heights.
- Fonts on the original site kept as they are (JetBrains Mono): free on Google Fonts, self-hosted with the site.
- Bricolage Grotesque Variable (a licensed font) can't be copied, so Bricolage Grotesque — the closest measured shape (x-height, width) among free fonts — stands in. With a web licence, upload the real font in Site Styles → Your fonts.
- Public Sans Variable (a licensed font) can't be copied, so Rosarivo — the closest measured shape (x-height, width) among free fonts — stands in. With a web licence, upload the real font in Site Styles → Your fonts.
- Type scale on the original site (the live site, measured in a browser) kept: display 128px/54.5px, heading 1 128px/54.5px, heading 2 65.6px/32.5px, body 19.7px/16.7px, eyebrows 13.7px/11.9px caps.
- Page rhythm on the original site (the live site, measured in a browser): content 1352px wide, sections padded 81px (32px on phones) — kept in Site Styles.
- The contrast solver adjusted 3 color pairing(s) so every section theme meets WCAG AA (e.g. light accent, light accent-hover).
- Page background #f2ead8 on the original site → #fcfaf7 (text contrast 15.5:1).

Design check: 2 error(s), 13 warning(s).

- **error** (/): Eyebrow over the background photo can drop to 4.45:1 contrast on bright or dark parts of the photo; it needs 4.5:1.
- **error** (/): Link over the background photo can drop to 4.45:1 contrast on bright or dark parts of the photo; it needs 4.5:1.
- warning (/): Four sections in a row use the light color theme, so the page reads as one long block.
- warning (/mission): Four sections in a row use the light color theme, so the page reads as one long block.
- warning (/programs): Four sections in a row use the light color theme, so the page reads as one long block.
- warning (/the-commons): Four sections in a row use the light color theme, so the page reads as one long block.
- warning (/stewards): Four sections in a row use the light color theme, so the page reads as one long block.
- warning (/catalog): “Governing the Commons” jumps from Heading 1 to Heading 3, skipping a level.
- warning (/donate): Four sections in a row use the light color theme, so the page reads as one long block.
- warning (/words): “Bioregional Coordination: A Hybrid Framework for Network Commons” jumps from Heading 2 to Heading 4, skipping a level.
- warning (/words): Four sections in a row use the light color theme, so the page reads as one long block.
- warning (/programs/commons-sense-education): Four sections in a row use the light color theme, so the page reads as one long block.
- … and 3 more: run Design check in Studio or `design_check` with Claude.

## Needs attention

### Blocks that need a look

- A columns block couldn't be imported (fields.items.0.body: Text is longer than 400 characters; fields.items.1.body: Text is longer than 400 characters). _(/)_
- A columns block couldn't be imported (fields.items.2.body: Text is longer than 400 characters). _(/, /words)_
- A 3-column table with 5 rows doesn't fit OpenSpace's table block (up to 6 columns, 40 rows, short cells); it was kept as text, one line per row. _(/donate)_

### Links

- Text link to /admin/index.html led to a page that wasn't imported; the link was removed. _(footer)_

### Design

- Layout: "We belong to more places than we have names for.": its background #faf4e5, as on the original. _(/)_
- Layout: "We know the way is together.": its background #f2ead8, as on the original. _(/)_
- Layout: "Ways to get involved.": its background #e5d9bf, as on the original. _(/)_
- Layout: "Four Pillars, woven together.": its background #f2ead8, as on the original. _(/)_
- Layout: "We come together for something beautiful.": its background #1f1e1b, as on the original. _(/)_
- A photo section's overlay was darkened from 25% to 70% so its text stays readable. _(/)_
- A photo section's overlay was darkened from 25% to 60% so its text stays readable. _(/, /mission, /programs, /the-commons, +9 more)_

## Not moved by the importer

- Scripts, animations and anything rendered only by JavaScript (try `--render` for script-built pages).
- Server-side features: shops, logins, search, comments.
- Form submissions, newsletter subscribers, member accounts and comments.
- Analytics and SEO history (search engines follow the redirects).

## Next steps

1. `npm install`, then `npx openspace check` (it should report no errors) and `npx openspace dev` to look around.
2. Bring it to visual parity with Claude: in this folder run `claude`, then `/openspace:migrate https://spiritofthefrontrange.org` (or ask Claude to compare each page with the original). It screenshots both sites at desktop and mobile and adjusts presets, Site Styles and sections — never raw HTML.
3. Fix the items under **Needs attention**, then publish (push to GitHub, or `publish` with Claude).
4. Move the domain only after the new site is live and checked:
   - add the custom domain in OpenSpace (`deploy.customDomain` in `openspace.json`, or the Hub);
   - at your DNS provider (your registrar or elsewhere), point the records at the new host as the domain guide says (GitHub Pages: `A`/`CNAME` records; Cloudflare: the Pages project's records);
   - keep the old hosting until the new site serves your domain over HTTPS and the redirects work; then cancel it (and transfer the domain if you like).

## Phones

Made 1 phone-only adjustment so the site reads well on phones (use a 40px logo on phones). The desktop design is unchanged.
