# Photo credits

All four photographs are Mauritian subjects sourced from Wikimedia Commons. Three are
**CC0** and the "Why Mauritius?" panorama is **CC BY 2.0**, which makes the footer
credit line a **licence obligation** rather than a courtesy; all four are credited
either way. The line is rendered from the `data-photo-credit` element and generated
from `PHOTO_CREDIT` in `_tooling/localise_mu.py`. If you swap any photo, update this
file **and** that constant, then re-run `localise_mu.py`, `assemble.py mauritius` and
`build_unipage.py mauritius`.

**Three of the four are Port Louis** — a narrower spread than the other pages manage,
and a forced one. Commons has no usable permissively-licensed photograph of Ebène
CyberCity, where five of the listed institutions actually are, nor of Rose Hill,
Quatre Bornes or Vacoas; the one Curepipe frame is an overcast car park. The three
Port Louis images are at least genuinely different in scale and register — a tight
canal corridor, a wide harbour skyline, and a civic square. If someone ever
commissions photography for these pages, **Ebène is the gap worth filling first.**

CC BY-SA, NC and ND images were deliberately avoided, as on the other twelve pages.

Each file was cropped and resized from the Commons original with `sips`. The output
dimensions match the Polish, UAE, Malaysian, Singapore, French, Australian, New
Zealand, German, Irish and Canadian files, which in turn match the slots, so the
layout cannot shift.

**No photograph has an identifiable person as its subject** — the same rule the other
twelve pages follow.

## What Mauritius made hard, and what that cost

Commons' permissively-licensed Mauritian photography is thin and lopsided. It
concentrates almost entirely on two subjects — **Port Louis / Caudan Waterfront** and
the **Pamplemousses botanical garden** — plus a large body of *coastal resort* imagery
that is unusable here for a different reason: a page selling a degree must not open
with a holiday brochure.

Three candidates were rejected and each is worth recording:

* `File:UOM - 20.03.10 (4488335211).jpg` and its three siblings (CC BY 2.0, 2048×1536)
  were the obvious first choice for the hero — they are the only permissively-licensed
  photographs of a **University of Mauritius** campus on Commons, and this is a page
  about studying there. Rejected on inspection: all four are **flood-damage
  photographs**, taken on 20 March 2010, showing standing brown water through a
  colonnade and storm debris across the lawns. At thumbnail size they read as an
  ordinary campus walkway. This is the same defect that dropped Wawel from the Polish
  page and Al Fahidi from the UAE one — a frame that reads as *this place is in
  trouble* — and it is the reason the hero is a city view rather than a campus.
* `File:Vue de la place de Caudan Waterfront (Port Louis) - 1.jpg` (CC0, 4032×3024)
  was the first choice for the settlement panel: a genuine daytime civic view of the
  capital, correctly licensed, exactly the right subject. Rejected on a magnified
  check — a man walks through the **immediate left foreground**, side-on but close
  enough to resolve at the delivered width. That is nearer than the "strip of
  pedestrians at distance" the Poznań frame was accepted with.
* `File:Port Louis Waterfront. (6719488523).jpg` (CC BY 2.0) was the alternative
  night frame. Rejected for legibility, not content: roughly two thirds of it is
  unbroken black sky and black water, so at panel size it reads as an empty rectangle
  with a strip of lights.

---

## students-campus.jpg — hero (`#home`), 1200×1143

> **The filename does not describe the subject**, and it is kept because
> `students-campus.jpg` is a literal key in the compiled stylesheet — the class
> `bg-[url('/assets/img/photos/students-campus.jpg')]` plus the matching escaped
> selector and `url()` in `assets/css/main.css`, and the `<link rel="preload">` in the
> page shell. Renaming the file means editing all of those together;
> `verify_site.py` fails on a mismatch, the browser fails silently.

- **Depicts:** the **Caudan Waterfront canal in Port Louis**, looking inland — the
  cast-iron colonnade of the old waterfront arcade along the left bank, the terraced
  modern block opposite, the road bridge and the city's mid-rise blocks closing the
  view, and the Moka range behind them.
- **Commons file page:** https://commons.wikimedia.org/wiki/File:Caudan_Waterfront_(Port_Louis),_vue_d%27un_canal.jpg
- **Author / photographer:** Benoît Prieur
- **Licence:** CC0 — https://creativecommons.org/publicdomain/zero/1.0
- **Attribution required:** no (credited anyway)
- **Crop:** original 4032×3024 (exactly 4:3) → `sips -c 2500 2624 --cropOffset 0 704`
  (1.0499:1) → resized to 1200×1143, quality 82. Horizontally centred; vertically
  taken from the **top**, dropping the nearest 524 px of water.
- **Why centred horizontally:** the canal runs straight down the middle to a vanishing
  point at about 48% of the width, so the composition is near-symmetrical and a
  centred crop keeps both banks — the colonial arcade on one side and the modern
  terraces on the other, which is the whole point of the frame.
- **Why the top and not the middle:** a full-height crop is a legitimate 1.05:1 frame
  and was the first attempt, but it delivered a bottom half that is almost entirely
  flat green water. Dropping the nearest 524 px lifts the arcade, the road bridge and
  the Moka range into the panel and leaves just enough water for the reflections. The
  file is still 2624×2500 before the downsample to 1200×1143, so nothing is
  upscaled.
- **The floating card:** the **"Start Your Journey"** panel overlaps the hero's
  bottom-left corner. Here that costs nothing, because the bottom-left of this frame
  is open water and the left bank's plinth; the arcade, the bridge, the skyline and
  the mountains all sit above and right of it. (This mattered a great deal for the
  waterfall that briefly occupied this slot — see below.)
- **Why 1.05:1 and not 3:2:** the hero panel measures about **596×584 CSS px on
  desktop (1.02:1) and 319×292 on mobile (1.09:1)** — essentially square at every
  breakpoint. The div is `bg-cover bg-center`, so a 1.5:1 file would have a third of
  its width thrown away. This subject loses very little to a near-square crop, because
  the canal is a receding corridor rather than a wide panorama — the interest is in
  the middle and at the vanishing point, not at the edges.
- **Safe to reshape:** referenced only as a CSS `background-image` and a
  `<link rel="preload">` — there is no `<img>` tag for it on either page.
- **No people:** checked at full resolution along the arcade walkway and at the far
  bridge. There is no figure anywhere in the frame — only a parked bus and some cars
  on the far road, at a distance where nothing resolves. Unusually clean for a city
  centre, and it is why this frame was chosen over the other Caudan candidates.
- **Two predecessors, and why each was replaced:**
  1. `File:Port_Louis,_Mauritius_2.jpg` (CC BY 2.0, carrotmadman6) — an aerial night
     view of the capital. Correctly licensed and empty of people, but at panel size it
     read as a dark rectangle and did not say *Mauritius* to a reader who had never
     been there.
  2. `File:Chamarel_Waterfall_in_Mauritius_(53698126454).jpg` (CC BY 2.0, dronepicr) —
     Chamarel Falls, one of the island's most recognisable sights. Bright, empty of
     people, and it fitted the near-square slot beautifully because a waterfall in a
     gorge is a vertical subject. Replaced because it is **the wrong register for the
     page**: this is a landing page about degrees and visas, and a waterfall reads as
     tourism. Its one lasting lesson is recorded above — the crop had to be taken
     flush left so the falls cleared the "Start Your Journey" card, which is the first
     time in this set that an overlay, not the subject, decided a crop.

## team-working.jpg — `#relocate` ("The Pathway to Settlement"), 1400×933

- **Depicts:** the Cathedral of St Louis in **Port Louis**, seen across its formal
  garden and fountain, with the city's low-rise blocks and the hill behind it.
- **Commons file page:** https://commons.wikimedia.org/wiki/File:Port_Louis,_Saint_Louis_Cathedral.jpg
- **Author / photographer:** Karsten Ratzke
- **Licence:** CC0 — https://creativecommons.org/publicdomain/zero/1.0
- **Attribution required:** no (credited anyway)
- **Crop:** original 4928×3248 (1.5172:1) → `sips -c 3248 4872` (exact 3:2, centred)
  → resized to 1400×933, quality 82.
- **Note:** this image is rendered with `w-full h-auto object-cover`, so **its aspect
  ratio drives the layout**. Any replacement must also be 3:2.
- **Why Port Louis for the settlement panel:** every other page in this set puts the
  seat of the deciding authority in this slot — Putrajaya on the Malaysian page,
  Canberra on the Australian, Abu Dhabi on the UAE one. Mauritius has a single seat
  and it is unambiguous: the **Passport and Immigration Office**, Residence Permit
  Section, 8th Floor, Sterling House, Port Louis, decides the Student Visa, issues the
  Residence Permit and renews it every year. Its own building is an unremarkable
  office block with no usable free photograph; the cathedral square is the
  recognisable civic centre of the same city.
- **People:** roughly a dozen figures at distance across the churchyard and pavement.
  Checked at full resolution: nobody is a subject of the frame, no face resolves, and
  the centred crop puts the west front and the fountain on the axis.

## family.jpg — `#relocate` ("Relocating with Your Family?"), 1400×1050

- **Depicts:** a watercourse running through the **Sir Seewoosagur Ramgoolam
  Botanical Garden** at Pamplemousses — palms and traveller's trees along the bank,
  a stand of taro in the foreground, a mown verge and a garden path behind.
- **Commons file page:** https://commons.wikimedia.org/wiki/File:River_in_Sir_Seewoosagur_Ramgoolam_Botanical_Garden,_March_2020.jpg
- **Author / photographer:** Benoît Prieur
- **Licence:** CC0 — https://creativecommons.org/publicdomain/zero/1.0
- **Attribution required:** no (credited anyway)
- **Crop:** **none.** The original is 4032×3024, exactly 4:3, so it was only resized
  to 1400×1050 at quality 82. Nothing is cropped away.
- **Why a public garden, and specifically this one:** the slot sits under "Relocating
  with Your Family?", where the copy's actual message is that the **student route
  carries no family provision** and the family route opens later, with an Occupation
  Permit. The frame therefore has to say *living here*, not *arriving here*.
  Pamplemousses is the island's oldest public garden and the one families actually
  use at the weekend — the same reasoning that put Łazienki in this slot on the
  Polish page and Zabeel Park on the UAE one.
- **No people:** checked at full resolution. The frame is empty of figures.

## mauritius-city.jpg — `#universities` ("Why Mauritius?") background panel, 1400×933

> Referenced by the Tailwind arbitrary-value class
> `bg-[url('/assets/img/photos/mauritius-city.jpg')]`, which is a **literal key** into
> `assets/css/main.css`. Both the class in the HTML and the escaped selector plus
> `url()` in the stylesheet must be changed together — this file was repointed from
> `poland-city.jpg` when the shared CSS was copied over.

- **Depicts:** the **Port Louis harbour basin** at Caudan, looking across the water to
  the city — the MCB tower and the round brick tower of the business district, the
  waterfront restaurants and palms along the quay, the Moka range behind, and the
  harbour reflecting a bright cumulus sky.
- **Commons file page:** https://commons.wikimedia.org/wiki/File:Panorama_of_Port_Louis_Waterfront_(4716846715).jpg
- **Author / photographer:** carrotmadman6
- **Licence:** CC BY 2.0 — https://creativecommons.org/licenses/by/2.0
- **Attribution required:** **yes** (and CC BY also requires indicating that changes
  were made, which the credit line does: "Cropped and resized.")
- **Crop:** original 4855×1600 (a 3.03:1 panorama) → `sips -c 1600 2400 --cropOffset 0
  2400` (exact 3:2, the right-hand half) → resized to 1400×933, quality 82.
- **Why the right-hand half:** the panorama's left end is the bulk sugar terminal and
  its silos — industrial, and not what "Why Mauritius?" is asking. The right half
  carries the business district, the waterfront and the mountains, which is the
  answer. Half a panorama is still 2400×1600 before the downsample, so nothing is
  upscaled.
- **Why a city and not the landmark it replaced:** this panel sits behind "Why
  Mauritius?" — the question a student is actually weighing — and the answer the copy
  gives is about degrees, English-medium teaching and the Young Professional permit.
  A skyline answers that; a beach or a mountain answers a different question.
- **Not a resort shot:** no hotel frontage, no sun-lounger, no swimmer, no beach. It is
  a working harbour with an office district behind it — which is what keeps this page
  from reading as the holiday brochure it must not be.
- **People:** a handful of tiny figures under the awnings on the far quay. Checked at
  full resolution: none resolves, none is a subject, and they are smaller in the frame
  than the pedestrians accepted on the Poznań and St Louis Cathedral frames.
- **What it replaced, and why:** `File:Le_Morne_Brabant,_Maurizio.jpg` (CC0, Jolaus) —
  Le Morne Brabant, a UNESCO World Heritage site and the single most recognisable
  image of the country. It was correctly licensed and empty of people, and it is a
  better *photograph* than this one. It was replaced for the same reason the Chamarel
  hero was: it answers "where should I holiday?", not "where should I study?".
