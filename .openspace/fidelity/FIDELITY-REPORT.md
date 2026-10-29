# Visual fidelity

Overall match: **72/100** — fonts, type sizes, spacing and each section measured in a browser on both sites (75%), and how alike the pages look as pictures (25%). How it's scored: docs/qa/import-fidelity.md.

Scored two ways, side by side: **72/100 corrected**, 72/100 by the strict v3 scorer. The corrected score reads three things the strict one gets wrong (navigation in a header themed "brand", off-screen slides counted as columns, a picture-only band on a phone); the pages below list where it did.

Auto-tuning raised it from 54/100:

- section padding 130px
- section padding on phones 51px
- text on light sections #4a4a45, as on the original (13 of 17 sections)
- background on light sections #f2ead8, as on the original (7 of 16 sections)
- /catalog: "A small reading list.": 2 cards per row, as on the original
- /connect: "Subscribe for what matters to you.": its background #faf4e5, as on the original
- /connect: "Subscribe for what matters to you.": its background #faf4e5, as on the original
- /connect: "Questions. Projects. Partnerships. Knowledge. Stories. Inspiration.": 2 cards per row, as on the original
- /donate: "Every dollar follows a clear path.": its background #faf4e5, as on the original
- /donate: "Every dollar follows a clear path.": its background #faf4e5, as on the original
- /donate: "Every dollar follows a clear path.": its background #faf4e5, as on the original
- /donate: "Move toward a more connected Front Range.": its background #faf4e5, as on the original
- /mission: "Our vision is a remembering.": its background #faf4e5, as on the original
- /mission: "Our vision is a remembering.": its background #faf4e5, as on the original
- /mission: "Our vision is a remembering.": the image takes 7/12 of the width, as on the original
- /mission: "Our vision is a remembering.": its background #faf4e5, as on the original
- /mission: "We know the way is together.": 2 cards per row, as on the original
- /mission: "We know the way is together.": the image takes 7/12 of the width, as on the original
- /mission: "What guides us.": 3 cards per row, as on the original
- /mission: "What guides us.": its background #e5d9bf, as on the original
- /mission: "What guides us.": its background #e5d9bf, as on the original
- /mission: "What guides us.": its background #e5d9bf, as on the original
- /programs: "Commons Sense Teach-Ins.": the image takes 5/12 of the width, as on the original
- /programs: "Solidarity Suppers.": its background #faf4e5, as on the original
- /programs: "Solidarity Suppers.": the image takes 5/12 of the width, as on the original
- /programs: "Solidarity Suppers.": its background #faf4e5, as on the original
- /programs: "Neighborhood Resiliency Programs.": the image takes 5/12 of the width, as on the original
- /programs: "Community Grant Rounds.": its background #faf4e5, as on the original
- /programs: "Community Grant Rounds.": the image takes 5/12 of the width, as on the original
- /programs: "Community Grant Rounds.": its background #faf4e5, as on the original

Without custom components: 65/100; with the sections recreated as components: 71/100.

## / at 1440px — 69/100

Checks 68/100 · looks alike 72/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/  
Imported: / (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading 1: present | Bricolage Grotesque Variable 128px | not found | **differs** |
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 2 size | 65.6px | 65.6px | same |
| Heading 3 size | 45.4px | 31.1px | **differs** |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 19.7px | 19.7px | same |
| Lead text size | 31.1px | 31.1px | same |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 13.7px | 13.7px | same |
| Eyebrows letter spacing and case | 0.22em, uppercase | 0.22em, uppercase | same |
| Buttons size | 13.7px | 13.7px | same |
| Buttons letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Navigation size | 11px | 11px | same |
| Navigation letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Content width | 1354px | 1352px | same |
| Section padding | 81px | 130px | **differs** |
| Button corners | 0px | 0px | same |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | SPIRIT of the Front Range. | 84 | Heading: Bricolage Grotesque Variable 128px → Bricolage Grotesque 128px; Text: Fraunces Variable 23.4px italic → Rosarivo 23.4px italic |
| 2 | We belong to more places than we have names for. | 58 | Heading: Bricolage Grotesque Variable 59.5px → Bricolage Grotesque 65.6px; Text: Public Sans Variable 19.7px → Rosarivo 19.7px; Text color: #1f1e1b → #4a4a45; Columns: 3 → 1; Eyebrow and rule: IF YOU LIVE ON THE EARTH, YOU ALREADY SHARE A HOME. → none; Italic lines: 1 → 0 |
| 3 | We know the way is together. | 84 | Heading: Bricolage Grotesque Variable 59.5px → Bricolage Grotesque 59.5px; Text: Public Sans Variable 19.7px → Rosarivo 19.7px; Text color: #1f1e1b → #4a4a45 |
| 4 | Ways to get involved. | 44 | Heading: Bricolage Grotesque Variable 93.7px → Bricolage Grotesque 65.6px; Text: Public Sans Variable 19.7px → Rosarivo 19.7px; Columns: 3 → 2; Italic lines: 1 → 0; Image placement: right, 31% wide → none; Height: 1944px → 519px |
| 5 | SPIRIT was formed in response to the following challenges and pressing concerns facing people of pla | 52 | Heading: Bricolage Grotesque Variable 42px → Bricolage Grotesque 31.1px; Text: Public Sans Variable 19.7px → Rosarivo 19.7px; Columns: 3 → 2; Eyebrow and rule: THE PRESENT MOMENT → none |
| 6 | Four Pillars, woven together. | 59 | Heading: Bricolage Grotesque Variable 93.7px → Bricolage Grotesque 65.6px; Text: Public Sans Variable 19.7px → Rosarivo 19.7px; Italic lines: 1 → 0; Image placement: left, 45% wide → none; Height: 2506px → 420px |
| 7 | Every gift moves us toward a more connected Front Range. | 68 | Heading: Bricolage Grotesque Variable 65.6px → Bricolage Grotesque 65.6px; Text: Public Sans Variable 24.9px → Rosarivo 24.9px; Columns: 4 → 3 |
| 8 | We come together for something beautiful. | 75 | Heading: Bricolage Grotesque Variable 93.7px → Bricolage Grotesque 65.6px |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.h3.size = 45
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.layout.sectionPadding = 81
- Lay the text out in columns (a stack layout with more columns, or the text block's Columns style).
- Add the eyebrow to the heading block.
- Set the closing/pull line in italics (lead style).
- Adjust the stack column spans (image column) or the image's side.

## / at 394px — 66/100

Checks 66/100 · looks alike 66/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/  
Imported: / (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading 1: present | Bricolage Grotesque Variable 54.5px | not found | **differs** |
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 2 size | 32.5px | 33.4px | same |
| Heading 3 size | 29.8px | 25px | **differs** |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 16.7px | 16.8px | same |
| Lead text size | 23px | 25px | same |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 11.9px | 14px | **differs** |
| Eyebrows letter spacing and case | 0.22em, uppercase | 0.2em, uppercase | same |
| Buttons size | 11.9px | 14px | **differs** |
| Buttons letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Section padding | 31.5px | 83px | **differs** |
| Button corners | 0px | 0px | same |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | SPIRIT of the Front Range. | 60 | Heading: Bricolage Grotesque Variable 54.5px → Bricolage Grotesque 102px; Text: Fraunces Variable 18.1px italic → Rosarivo 19px italic; Height: 720px → 1051px |
| 2 | We belong to more places than we have names for. | 72 | Heading: Bricolage Grotesque Variable 32.3px → Bricolage Grotesque 33.4px; Text: Public Sans Variable 16.7px → Rosarivo 16.8px; Text color: #1f1e1b → #4a4a45; Eyebrow and rule: IF YOU LIVE ON THE EARTH, YOU ALREADY SHARE A HOME. → none; Italic lines: 1 → 0 |
| 3 | We know the way is together. | 72 | Heading: Bricolage Grotesque Variable 32.3px → Bricolage Grotesque 48px; Text: Public Sans Variable 16.7px → Rosarivo 16px; Text color: #1f1e1b → #4a4a45 |
| 4 | Ways to get involved. | 59 | Heading: Bricolage Grotesque Variable 46.5px → Bricolage Grotesque 33.4px; Text: Public Sans Variable 16.7px → Rosarivo 16.8px; Italic lines: 1 → 0; Image placement: center, 93% wide → none; Height: 3921px → 612px |
| 5 | SPIRIT was formed in response to the following challenges and pressing concerns facing people of pla | 65 | Heading: Bricolage Grotesque Variable 27.2px → Bricolage Grotesque 25px; Text: Public Sans Variable 16.7px → Rosarivo 16px; Columns: 2 → 1; Height: 955px → 1306px |
| 6 | Four Pillars, woven together. | 59 | Heading: Bricolage Grotesque Variable 46.5px → Bricolage Grotesque 33.4px; Text: Public Sans Variable 16.7px → Rosarivo 16.8px; Italic lines: 1 → 0; Image placement: center, 89% wide → none; Height: 3600px → 507px |
| 7 | Every gift moves us toward a more connected Front Range. | 52 | Heading: Bricolage Grotesque Variable 32.5px → Bricolage Grotesque 52px; Text: Public Sans Variable 19.6px → Rosarivo 20px; Columns: 3 → 1 |
| 8 | We come together for something beautiful. | 75 | Heading: Bricolage Grotesque Variable 46.5px → Bricolage Grotesque 33.4px |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.h3.sizeMobile = 30
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.eyebrow.sizeMobile = 12
- choices.typography.scale.button.sizeMobile = 12
- choices.layout.sectionPaddingMobile = 32
- Add the eyebrow to the heading block.
- Set the closing/pull line in italics (lead style).
- Adjust the stack column spans (image column) or the image's side.
- Lay the text out in columns (a stack layout with more columns, or the text block's Columns style).

## /catalog at 1440px — 70/100

Checks 71/100 · looks alike 66/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/catalog/  
Imported: /catalog (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading 1: present | Bricolage Grotesque Variable 104.4px | not found | **differs** |
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 3 size | 72.6px | 28.3px | **differs** |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 19.7px | 19.7px | same |
| Lead text size | 24.1px | 24.1px | same |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 13.7px | 13.7px | same |
| Eyebrows letter spacing and case | 0.22em, uppercase | 0.22em, uppercase | same |
| Buttons size | 10px | 13.7px | **differs** |
| Buttons letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Navigation size | 11px | 11px | same |
| Navigation letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Content width | 308px | 1338px | **differs** |
| Section padding | 106.5px | 130px | same |
| Button corners | 0px | 0px | same |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | A small reading list. | 64 | Heading: Bricolage Grotesque Variable 104.4px → Bricolage Grotesque 104.4px; Text: Fraunces Variable 24.1px italic → Rosarivo 24.1px italic; Columns: 2 → 1 |
| 2 | (no heading) | 80 | Height: 205px → 324px |
| 3 | Governing the Commons ↗ | 67 | Heading: Bricolage Grotesque Variable 72.6px → Bricolage Grotesque 28.3px; Text: Public Sans Variable 19.7px → Rosarivo 19.7px; Height: 3954px → 1580px |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.h3.size = 73
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.button.size = 10
- choices.layout.contentWidth = 308
- Lay the text out in columns (a stack layout with more columns, or the text block's Columns style).

## /catalog at 390px — 67/100

Checks 64/100 · looks alike 76/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/catalog/  
Imported: /catalog (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading 1: present | Bricolage Grotesque Variable 45.6px | not found | **differs** |
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 3 size | 44.2px | 22.7px | **differs** |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 16.7px | 16.8px | same |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 11.9px | 14px | **differs** |
| Eyebrows letter spacing and case | 0.18em, uppercase | 0.22em, uppercase | **differs** |
| Buttons: present | JetBrains Mono 12.8px | not found | **differs** |
| Section padding | 130.5px | 83px | **differs** |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | A small reading list. | 70 | Heading: Bricolage Grotesque Variable 45.6px → Bricolage Grotesque 84px; Text: Fraunces Variable 18.3px italic → Rosarivo 19px italic |
| 2 | (no heading) | 80 | Height: 248px → 366px |
| 3 | Governing the Commons ↗ | 61 | Heading: Bricolage Grotesque Variable 44.2px → Bricolage Grotesque 22.7px; Text: Public Sans Variable 16.7px → Rosarivo 16.8px; Eyebrow and rule: BOOK → none; Height: 4566px → 2651px |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.h3.sizeMobile = 44
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.eyebrow.sizeMobile = 12
- choices.typography.scale.eyebrow = { letterSpacing: 0.18, case: "uppercase" }
- choices.layout.sectionPaddingMobile = 131
- Add the eyebrow to the heading block.

## /connect at 1440px — 84/100

Checks 87/100 · looks alike 76/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/connect/  
Imported: /connect (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading 1: present | Bricolage Grotesque Variable 104.4px | not found | **differs** |
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 2 size | 72.6px | 72.6px | same |
| Heading 3 size | 31.1px | 31.1px | same |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 19.7px | 19.7px | same |
| Lead text size | 24.9px | 24.9px | same |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 13.7px | 13.7px | same |
| Eyebrows letter spacing and case | 0.22em, uppercase | 0.22em, uppercase | same |
| Buttons size | 14.9px | 13.7px | same |
| Buttons letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Navigation size | 11px | 11px | same |
| Navigation letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Content width | 1338px | 1296px | same |
| Section padding | 168.5px | 130px | same |
| Button corners | 0px | 0px | same |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | Connect with us. | 64 | Heading: Bricolage Grotesque Variable 104.4px → Bricolage Grotesque 104.4px; Text: Fraunces Variable 24.1px italic → Rosarivo 24.1px italic; Columns: 2 → 1 |
| 2 | Subscribe for what matters to you. | 92 | Heading: Bricolage Grotesque Variable 72.6px → Bricolage Grotesque 72.6px; Text: Public Sans Variable 24.9px → Rosarivo 24.9px |
| 3 | Questions. Projects. Partnerships. Knowledge. Stories. Inspiration. | 93 | Heading: Bricolage Grotesque Variable 53.2px → Bricolage Grotesque 53.2px; Text: Public Sans Variable 19.7px → Rosarivo 19.7px |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- Lay the text out in columns (a stack layout with more columns, or the text block's Columns style).

## /connect at 390px — 76/100

Checks 74/100 · looks alike 81/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/connect/  
Imported: /connect (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading 1: present | Bricolage Grotesque Variable 45.6px | not found | **differs** |
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 2 size | 44.2px | 58px | **differs** |
| Heading 3 size | 23px | 25px | same |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 16.7px | 16px | same |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 11.9px | 14px | **differs** |
| Eyebrows letter spacing and case | 0.22em, uppercase | 0.22em, uppercase | same |
| Buttons size | 14.9px | 14px | same |
| Buttons letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Section padding | 193px | 83px | **differs** |
| Button corners | 0px | 0px | same |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | Connect with us. | 70 | Heading: Bricolage Grotesque Variable 45.6px → Bricolage Grotesque 84px; Text: Fraunces Variable 18.3px italic → Rosarivo 19px italic |
| 2 | Subscribe for what matters to you. | 79 | Heading: Bricolage Grotesque Variable 44.2px → Bricolage Grotesque 58px; Text: Public Sans Variable 19.6px → Rosarivo 20px |
| 3 | Questions. Projects. Partnerships. Knowledge. Stories. Inspiration. | 81 | Heading: Bricolage Grotesque Variable 31.1px → Bricolage Grotesque 43px; Text: Public Sans Variable 16.7px → Rosarivo 16px |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.h2.sizeMobile = 44
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.eyebrow.sizeMobile = 12
- choices.layout.sectionPaddingMobile = 193

## /donate at 1440px — 71/100

Checks 68/100 · looks alike 77/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/donate/  
Imported: /donate (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 1 size | 104.4px | 104.4px | same |
| Heading 2 size | 93.7px | 65.6px | **differs** |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 24.9px | 19.7px | **differs** |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 13.7px | 13.7px | same |
| Eyebrows letter spacing and case | 0.22em, uppercase | 0.22em, uppercase | same |
| Buttons size | 14.9px | 13.7px | same |
| Buttons letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Navigation size | 11px | 11px | same |
| Navigation letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Content width | 1338px | 1352px | same |
| Section padding | 146.5px | 130px | same |
| Button corners | 0px | 0px | same |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | Donate to SPIRIT. | 54 | Heading: Bricolage Grotesque Variable 104.4px → Bricolage Grotesque 104.4px; Text: Fraunces Variable 24.1px italic → Rosarivo 19.7px; Eyebrow and rule: TAX-DEDUCTIBLE GIFT TO A 501(C)(3) NONPROFIT → none; Italic lines: 1 → 0 |
| 2 | Every gift moves us toward a more connected Front Range. | 58 | Heading: Bricolage Grotesque Variable 72.6px → Bricolage Grotesque 65.6px; Text: Public Sans Variable 24.9px → Rosarivo 19.7px; Text color: #1f1e1b → #4a4a45; Eyebrow and rule: WHY YOUR GIFT MATTERS → none |
| 3 | Every dollar follows a clear path. | 43 | Heading: Bricolage Grotesque Variable 93.7px → Bricolage Grotesque 65.6px; Text: Public Sans Variable 19.7px → Rosarivo 19.7px; Columns: 2 → 1; Eyebrow and rule: ★ HOW YOUR DOLLAR FLOWS → none; Height: 1282px → 560px |
| 4 | Move toward a more connected Front Range. | 95 | Heading: Bricolage Grotesque Variable 93.7px → Bricolage Grotesque 93.7px |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.h2.size = 94
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.body.size = 25
- Add the eyebrow to the heading block.
- Set the closing/pull line in italics (lead style).
- Lay the text out in columns (a stack layout with more columns, or the text block's Columns style).

## /donate at 390px — 64/100

Checks 59/100 · looks alike 80/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/donate/  
Imported: /donate (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 1 size | 45.6px | 41.7px | same |
| Heading 2 size | 46.5px | 33.4px | **differs** |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 19.6px | 16.8px | **differs** |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 11.9px | 14px | **differs** |
| Eyebrows letter spacing and case | 0.22em, uppercase | 0.22em, uppercase | same |
| Buttons size | 14.9px | 14px | same |
| Buttons letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Section padding | 100px | 83.5px | same |
| Button corners | 0px | 0px | same |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | Donate to SPIRIT. | 64 | Heading: Bricolage Grotesque Variable 45.6px → Bricolage Grotesque 41.7px; Text: Fraunces Variable 18.3px italic → Rosarivo 16.8px; Eyebrow and rule: TAX-DEDUCTIBLE GIFT TO A 501(C)(3) NONPROFIT → none; Italic lines: 1 → 0 |
| 2 | Every gift moves us toward a more connected Front Range. | 36 | Heading: Bricolage Grotesque Variable 44.2px → Bricolage Grotesque 33.4px; Text: Public Sans Variable 19.6px → Rosarivo 16.8px; Text color: #1f1e1b → #4a4a45; Eyebrow and rule: WHY YOUR GIFT MATTERS → none; Height: 922px → 640px |
| 3 | Every dollar follows a clear path. | 61 | Heading: Bricolage Grotesque Variable 46.5px → Bricolage Grotesque 33.4px; Text: Public Sans Variable 16.7px → Rosarivo 16.8px; Eyebrow and rule: ★ HOW YOUR DOLLAR FLOWS → none; Height: 1806px → 503px |
| 4 | Move toward a more connected Front Range. | 55 | Heading: Bricolage Grotesque Variable 46.5px → Bricolage Grotesque 75px; Text: JetBrains Mono 11.9px → JetBrains Mono 14px; Height: 548px → 790px |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.h2.sizeMobile = 47
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.body.sizeMobile = 20
- choices.typography.scale.eyebrow.sizeMobile = 12
- Add the eyebrow to the heading block.
- Set the closing/pull line in italics (lead style).

## /mission at 1440px — 65/100

Checks 63/100 · looks alike 73/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/mission/  
Imported: /mission (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading 1: present | Bricolage Grotesque Variable 104.4px | not found | **differs** |
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 2 size | 93.7px | 65.6px | **differs** |
| Heading 3 size | 45.4px | 28.3px | **differs** |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 19.7px | 19.7px | same |
| Lead text size | 24.9px | 28.3px | **differs** |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 13.7px | 13.7px | same |
| Eyebrows letter spacing and case | 0.22em, uppercase | 0.22em, uppercase | same |
| Buttons size | 13.7px | 13.7px | same |
| Buttons letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Navigation size | 11px | 11px | same |
| Navigation letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Content width | 644px | 1352px | **differs** |
| Section padding | 116px | 130px | same |
| Button corners | 0px | 0px | same |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | A more beautiful Front Range. | 64 | Heading: Bricolage Grotesque Variable 104.4px → Bricolage Grotesque 104.4px; Text: Fraunces Variable 24.1px italic → Rosarivo 24.1px italic; Columns: 2 → 1 |
| 2 | Our vision is a remembering. | 22 | Heading: Bricolage Grotesque Variable 93.7px → Bricolage Grotesque 65.6px; Columns: 2 → 1; Eyebrow and rule: OUR VISION → none; Image placement: right, 27% wide → none; Height: 1034px → 425px |
| 3 | We know the way is together. | 33 | Heading: Bricolage Grotesque Variable 93.7px → Bricolage Grotesque 65.6px; Columns: 2 → 1; Image placement: right, 27% wide → none; Height: 1477px → 355px |
| 4 | What guides us. | 84 | Heading: Bricolage Grotesque Variable 67px → Bricolage Grotesque 65.6px; Text: Public Sans Variable 19.7px → Rosarivo 19.7px; Italic lines: 1 → 0 |
| 5 | (no heading) | 89 | Text: Fraunces Variable 63.5px italic → Rosarivo 63.5px italic |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.h2.size = 94
- choices.typography.scale.h3.size = 45
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.lead.size = 25
- choices.layout.contentWidth = 644
- Lay the text out in columns (a stack layout with more columns, or the text block's Columns style).
- Add the eyebrow to the heading block.
- Adjust the stack column spans (image column) or the image's side.
- Set the closing/pull line in italics (lead style).

## /mission at 390px — 69/100

Checks 66/100 · looks alike 80/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/mission/  
Imported: /mission (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading 1: present | Bricolage Grotesque Variable 45.6px | not found | **differs** |
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 2 size | 46.5px | 33.4px | **differs** |
| Heading 3 size | 29.8px | 22.7px | **differs** |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 16.7px | 16.8px | same |
| Lead text size | 39.1px | 22.7px | **differs** |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 11.9px | 13px | same |
| Eyebrows letter spacing and case | 0.22em, uppercase | 0.22em, uppercase | same |
| Buttons size | 11.9px | 14px | **differs** |
| Buttons letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Section padding | 142px | 83.5px | **differs** |
| Button corners | 0px | 0px | same |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | A more beautiful Front Range. | 70 | Heading: Bricolage Grotesque Variable 45.6px → Bricolage Grotesque 84px; Text: Fraunces Variable 18.3px italic → Rosarivo 19px italic |
| 2 | Our vision is a remembering. | 44 | Heading: Bricolage Grotesque Variable 46.5px → Bricolage Grotesque 33.4px; Eyebrow and rule: OUR VISION → none; Image placement: center, 89% wide → none; Height: 1332px → 293px |
| 3 | We know the way is together. | 56 | Heading: Bricolage Grotesque Variable 46.5px → Bricolage Grotesque 33.4px; Image placement: center, 89% wide → none; Height: 2080px → 262px |
| 4 | What guides us. | 84 | Heading: Bricolage Grotesque Variable 35.7px → Bricolage Grotesque 33.4px; Text: Public Sans Variable 16.7px → Rosarivo 16.8px; Italic lines: 1 → 0 |
| 5 | (no heading) | 78 | Text: Fraunces Variable 39.1px italic → Rosarivo 51px italic |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.h2.sizeMobile = 47
- choices.typography.scale.h3.sizeMobile = 30
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.lead.sizeMobile = 39
- choices.typography.scale.button.sizeMobile = 12
- choices.layout.sectionPaddingMobile = 142
- Add the eyebrow to the heading block.
- Adjust the stack column spans (image column) or the image's side.
- Set the closing/pull line in italics (lead style).

## /programs at 1440px — 84/100

Checks 87/100 · looks alike 78/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/programs/  
Imported: /programs (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading 1: present | Bricolage Grotesque Variable 104.4px | not found | **differs** |
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 2 size | 72.6px | 72.6px | same |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 24.9px | 24.9px | same |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 13.7px | 13.7px | same |
| Eyebrows letter spacing and case | 0.22em, uppercase | 0.22em, uppercase | same |
| Buttons size | 13.7px | 13.7px | same |
| Buttons letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Navigation size | 11px | 11px | same |
| Navigation letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Content width | 1338px | 1338px | same |
| Section padding | 127.5px | 130px | same |
| Button corners | 0px | 0px | same |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | Ways to get involved. | 71 | Heading: Bricolage Grotesque Variable 104.4px → Bricolage Grotesque 104.4px; Text: Public Sans Variable 18.2px → Rosarivo 18.2px; Columns: 2 → 1 |
| 2 | Commons Sense Teach-Ins. | 86 | Heading: Bricolage Grotesque Variable 72.6px → Bricolage Grotesque 72.6px; Text: Public Sans Variable 24.9px → Rosarivo 24.9px; Image crop: 0.8:1 → 0.67:1 |
| 3 | Solidarity Suppers. | 86 | Heading: Bricolage Grotesque Variable 72.6px → Bricolage Grotesque 72.6px; Text: Public Sans Variable 24.9px → Rosarivo 24.9px; Image crop: 0.8:1 → 1.5:1 |
| 4 | Neighborhood Resiliency Programs. | 86 | Heading: Bricolage Grotesque Variable 72.6px → Bricolage Grotesque 72.6px; Text: Public Sans Variable 24.9px → Rosarivo 24.9px; Image crop: 0.8:1 → 1.5:1 |
| 5 | Community Grant Rounds. | 86 | Heading: Bricolage Grotesque Variable 72.6px → Bricolage Grotesque 72.6px; Text: Public Sans Variable 24.9px → Rosarivo 24.9px; Image crop: 0.8:1 → 1.33:1 |
| 6 | Become a founding member of the Front Range Commons. | 93 | Heading: Bricolage Grotesque Variable 93.7px → Bricolage Grotesque 93.7px; Text: Public Sans Variable 24.9px → Rosarivo 24.9px |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- Lay the text out in columns (a stack layout with more columns, or the text block's Columns style).
- Use the original's image proportions (the block's aspect ratio).

## /programs at 390px — 75/100

Checks 75/100 · looks alike 76/100 (screenshots compared).

Original: https://spiritofthefrontrange.org/programs/  
Imported: /programs (local preview)

| Check | Original | Imported | |
|---|---|---|---|
| Heading 1: present | Bricolage Grotesque Variable 45.6px | not found | **differs** |
| Heading font | Bricolage Grotesque Variable | Bricolage Grotesque (close stand-in) | close (70%) |
| Heading 2 size | 44.2px | 58px | **differs** |
| Body font | Public Sans Variable | Rosarivo (close stand-in) | close (85%) |
| Body text size | 19.6px | 20px | same |
| Label font | JetBrains Mono | JetBrains Mono | same |
| Eyebrows size | 11.9px | 14px | **differs** |
| Eyebrows letter spacing and case | 0.22em, uppercase | 0.22em, uppercase | same |
| Buttons size | 11.9px | 14px | **differs** |
| Buttons letter spacing and case | 0.2em, uppercase | 0.2em, uppercase | same |
| Section padding | 82.5px | 83px | same |
| Button corners | 0px | 0px | same |

| # | Section | Match | Differences |
|---|---|---|---|
| 1 | Ways to get involved. | 77 | Heading: Bricolage Grotesque Variable 45.6px → Bricolage Grotesque 84px; Text: Public Sans Variable 16.2px → Rosarivo 15px |
| 2 | Commons Sense Teach-Ins. | 76 | Heading: Bricolage Grotesque Variable 44.2px → Bricolage Grotesque 58px; Text: Public Sans Variable 19.6px → Rosarivo 20px; Image crop: 0.8:1 → 0.67:1 |
| 3 | Solidarity Suppers. | 76 | Heading: Bricolage Grotesque Variable 44.2px → Bricolage Grotesque 58px; Text: Public Sans Variable 19.6px → Rosarivo 20px; Image crop: 0.8:1 → 1.5:1 |
| 4 | Neighborhood Resiliency Programs. | 76 | Heading: Bricolage Grotesque Variable 44.2px → Bricolage Grotesque 58px; Text: Public Sans Variable 19.6px → Rosarivo 20px; Image crop: 0.8:1 → 1.5:1 |
| 5 | Community Grant Rounds. | 76 | Heading: Bricolage Grotesque Variable 44.2px → Bricolage Grotesque 58px; Text: Public Sans Variable 19.6px → Rosarivo 20px; Image crop: 0.8:1 → 1.33:1 |
| 6 | Become a founding member of the Front Range Commons. | 81 | Heading: Bricolage Grotesque Variable 46.5px → Bricolage Grotesque 75px; Text: Public Sans Variable 19.6px → Rosarivo 20px |

What would close the gap:

- Site Styles → choices.typography.heading = { family: "Bricolage Grotesque Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.h2.sizeMobile = 44
- Site Styles → choices.typography.body = { family: "Public Sans Variable" } (Google Fonts), or upload it in Site Styles → Your fonts.
- choices.typography.scale.eyebrow.sizeMobile = 12
- choices.typography.scale.button.sizeMobile = 12
- Use the original's image proportions (the block's aspect ratio).

