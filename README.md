# Tutee Connect — Study in Mauritius

The Mauritian landing page. Same DOM, same classes, same animations as the
reference site; the content is localised from the UK page by
`../_tooling/localise_mu.py` per `../_tooling/MAURITIUS_SPEC.md`, and the
institution directory is generated from the Higher Education Commission's own
registers by `../_tooling/build_dataset_mu.py`.

Nothing in this directory is hand-edited. Everything is generated.

## Build

```bash
cd "/Users/tuteeconnect/Landing Page/_tooling"

python3 build_dataset_mu.py          # rebuild the dataset from the vendored HEC captures
python3 build_dataset_mu.py --refresh    # ...re-downloading the two HEC feeds and the HEI page first
python3 localise_mu.py               # regenerate fragments-mauritius/ + this site's two JS files
python3 assemble.py mauritius        # rebuild MAURITIUS/index.html
python3 build_unipage.py mauritius   # rebuild MAURITIUS/universities.html
python3 verify_site.py mauritius     # check the result
python3 check_twins.py mauritius     # review what the localiser handed through unchanged
```

Local preview: double-click `Start Local Server.command`, or
`python3 serve.py` (port 8012). To exercise the enquiry form as well, use
`RESEND_API_KEY=re_... python3 ../_tooling/devserver.py mauritius`.

## Fidelity to the reference

`MAURITIUS/index.html` has **1850 elements against the UK page's 1852**, and the
whole of that difference is accounted for:

* the two decorative "Financial AID" currency icons are lucide `banknote`
  instead of `circle-pound-sterling`, and `banknote` has one child fewer — so
  −2. This is the same delta the Malaysian, UAE and Polish pages carry.
* the `#universities` background panel's Tailwind arbitrary-value class points
  at `mauritius-city.jpg` instead of `uk-city.jpg`.

There is **no other structural difference at all**: not one tag, not one class.
Every reveal, hover, carousel scroll, accordion and modal is the reference's own
behaviour, because none of them was touched — `localise_mu.py` diffs the
tag+class skeleton of every fragment before writing and refuses to write if
anything moved.

## The directory: 41 institutions, and why not 45

**Registration is the permission.** Under the Higher Education Act 2017 no body
may provide higher education in Mauritius unless it is registered with the HEC,
and the Passport and Immigration Office's Student Visa guidelines require a seat
at a registered institution before a visa exists to apply for. So the register
is not a quality filter this page chose — it is the legal precondition, exactly
as CRICOS is in Australia and EMGS in Malaysia.

| | |
| --- | --- |
| HEC publicly-funded institutions | 10 |
| HEC registered private HEIs | 35 |
| **−2** | public institutions an international applicant has no route into |
| **−2** | private HEIs with no accredited programme to enrol in |
| **= 41** | listed |

The second subtraction is Australia's "no live course" rule and it lands
exactly: HEC's own website says it regulates **33 private HEIs**, which is what
is left once the two empty rows go.

### The two public exclusions

The reference card hardcodes `Intl. Admits: Yes`, so an institution nobody can
apply to cannot be listed. This is Germany's Verwaltungshochschulen rule.

* **Atal Bihari Vajpayee Institute of Public Service and Innovation** — its 2025
  Act establishes it "as the apex training body for **public officers**"; s.4(a)
  makes its first object training "to public officers"; the Explanatory
  Memorandum says it grants degrees and other awards "to Public Officers". s.7
  leaves admission to its discretion, but the objects bound it.
* **Mauritius Institute of Health** — an **awarding** body, not an admitting
  one. Its nursing awards are made under an affiliation agreement for programmes
  *conducted by* the Ministry of Health's Central School of Nursing and by
  Polytechnics Mauritius; its paramedical courses run for named cohorts of
  Ministry recruits and Fire and Rescue Services cadres; its one "Regional /
  International" offering is a distance programme for UNFPA staff.

AIPSI is also the only institution whose HEC category is unpublished — the 2022
snapshot predates it and names MITD in that slot. So the one record that would
have needed an editorial judgement is the one that gets excluded, which is the
right way round.

## The register itself, and the one asymmetry in it

HEC publishes its **private** register as two JSON feeds — institutions, and
every accredited programme at them — which are the DataTables sources behind
<https://www.hec.mu/hei>. Both are vendored in `../_tooling/reference/`.

It publishes **nothing machine-readable for the public sector**: the same page
renders the ten publicly-funded institutions as static markup with a name and a
homepage link and nothing else. That is why
`reference/hec-public-institutions.json` exists and is hand-assembled. The
**names and the membership of that list are HEC's**; every per-institution
detail added to it — town, district, faculties — is quoted from that
institution's **own** site with the source URL recorded on the record. Read its
`_README` before touching it.

One institution's data comes from elsewhere and says so: **utm.ac.mu answers
automated requests with a bot-check interstitial**, so the University of
Technology's address and school list come from WHED (the IAU/UNESCO World Higher
Education Database) and were cross-checked against Wikipedia. Both agree. The
bot check was not worked around.

### The join, and the traps that were not there

Unlike the Malaysian EMGS/MQA join, the two HEC feeds are views of **one**
database, so every programme's `instname` matches an institution's `instname`
byte for byte — 289 programmes, 0 orphans. The builder asserts that rather than
assuming it.

The real work was in the free-text columns:

* **`catdescription` is free text and often compound** — 69 distinct values
  including `Travel / Hotel / Tourism / Marketing`, `Science/ Chemistry` and
  `Business, Management & Administrative Studies`. They are split and folded to
  broad fields; an unmapped token **fails the build** rather than dropping
  silently.
* **`location` is a street address, not a town field.** Towns are matched out of
  it and the district derived from the town, with the **earliest** town in the
  string winning — because several institutions list more than one campus and
  the register puts the principal one first (`Reduit, Montagne Blanche,
  Pamplemousses, Ebène, Rose Belle`).
* **Six rows are `<company> Ltd trading as <institution>`.** The directory shows
  the institution, because showing the company is actively wrong in one case:
  Charles Telfair Company Ltd runs **both** Charles Telfair Institute **and**
  Curtin Mauritius, so those two rows' registered names are identical for their
  first five words. The full registered string always goes into `alt`, so
  searching the company still finds both.
* **The register is internally inconsistent about spelling** — it writes both
  `Ebene` and `Ebène`, both `Quatre Bornes` and `Quatre-Bornes`, both
  `Port Louis` and `Port-Louis`, and `Reduit` where the public institutions
  write `Réduit`. Left alone, two cards would name the same town two different
  ways. That is the **UAE's mixed-spelling defect**, which `check_twins.py`
  cannot see because both spellings are localised text. It is fixed at source in
  `CANON_TOWN`, with every variant kept in `alt`.

### Three towns deliberately carry no district

`Belle Rive`, `Montagne Blanche` and `Pierrefonds` render as the bare town.
Their districts are not settled by the sources — SSR Medical College's own
address reads "Belle Rive, Phoenix" while other references say Flacq; Montagne
Blanche's village council area straddles the Flacq/Moka boundary; and Medine's
Uniciti campus at Pierrefonds gives a postcode and no district while adjoining
Flic en Flac (Black River) and being listed by others as Quatre Bornes. An
unqualified town is true; a district picked between disagreeing sources would
not be. `verify_site.py` has an exact allow-list (`districtless`), so a new
district-less town has to be justified before it can ship.

**Moka and Port Louis** also render bare, for the opposite reason: there the
town and the district have the same name, and "Moka, Moka" is not a location.

## What is real data here, and what is not

**Real, straight off the registers:**

* `name` — the registered name (or, for six rows, the institution named after
  "trading as"; see above).
* `location` — town and district as described above.
* `awards` — **who grants the qualification.** `Own awards` where the
  institution has awarding powers, `Partner awards` where it teaches toward
  another body's award, `Own awards (sub-degree)` for the institutions HEC
  records as awarding at certificate and diploma level only. For private
  institutions this is the register's own `awpower` flag; for public ones it is
  HEC's published categorisation.
* `programs` — subject areas, folded from the field recorded on each accredited
  programme (private) or from the institution's own published faculty list
  (public).
* `type` — HEC's own categorisation of the sector.

**Editorial, and marked as such in the generated file:**

* `alt` — search terms, never rendered: abbreviations (UOM, UTM, MIE, UdM),
  towns, districts, the full registered name and accent-folded spellings.

There is **no invented per-institution statistic** on this page. The UK page's
`offerRate` — still flagged as a launch risk in `../UK/README.md` — has no
counterpart here.

### Why `awards` and not a programme count

Ireland's directory shows a real programme count and it was the obvious first
choice. It does not work here, because the HEC programme feed covers **private
institutions only** — a count would show the University of Mauritius as having
zero. `awards` is published for every institution listed, and it is also the
more consequential fact: HEC records **33 overseas awarding bodies operating
locally**, and **26 of the 41** institutions here teach toward someone else's
degree. A student needs to know whether they will earn a Mauritian, British,
Indian, French or Australian qualification before they choose — not least
because the Young Professional Occupation Permit requires a degree from an
institution recognised by the HEC.

## Ranking: one institution, and twelve rebadged cards

This is the **first page in the set to rewrite every one of the twelve carousel
badges**. New Zealand rewrote four and Singapore eight.

| table | Mauritian coverage |
| --- | --- |
| THE World University Rankings 2026 | **2** institutions, **1** ranked — the University of Mauritius, 1201–1500. The University of Technology is a "Reporter" and holds no position |
| QS World University Rankings | **0**. UoM appears only in QS's 2026 *subject* tables |
| a regional table | **none exists** that reaches twelve, the way QS *Europe* reached twelve Irish and twelve Finnish institutions |

So eleven of the reference's twelve hardcoded `Rank #N` badges would assert a
position the institution does not hold, and the twelfth would assert "#1 of
nothing". Every badge now carries the institution's real HEC standing —
`Public University`, `Degree-Awarding`, `Specialised`, `Own Awards`,
`HEC Registered`. `localise_mu.py` asserts `rebadged == 12`, so a future dataset
cannot quietly restore a fabricated position.

Because no card carries a rank any more, **the copy above them had to stop
claiming one**. Three nodes changed that no other page has had to touch:
"Top Ranked UK Universities" → "Top Mauritian Institutions", "Top Ranked
Universities" → "Leading Mauritian Institutions", and "World's Best
Universities" → "HEC-Registered Institutions". "Universities" was wrong besides:
33 of the 41 institutions listed are not universities.

The directory page keeps `rank` as a sequential 1..41 ordering key and prints
`#N` only where `ranked` is true — entry 1 — and a dash for the other forty.

## Country-specific build notes

* **Currency is the Mauritian rupee (Rs, MUR)**, and `swap_currency: 'rupee'`
  maps to the neutral lucide `banknote`. lucide's `indian-rupee` is the **Indian**
  rupee sign — a different currency, and on a page read largely by applicants
  from India it would actively mislead about which currency a figure is in,
  which is worse than a neutral icon.
* **`family_cta: 'Get Family Permit Help'`** — Mauritius grants a dependant
  *permit* through the EDB alongside the Occupation Permit; there is no Mauritian
  family visa. Second country to set this key, after Finland.
* **Spelling is British `-ise` and `programme`** — Mauritius is a Commonwealth
  country and the HEC register's own column heading is `Programme`.
* **`British` is not a leak pattern here**, unlike on the other twelve pages. It
  is load-bearing content: 26 of 41 institutions teach toward an overseas
  partner's award and the page says so in as many words.
* **`USD` is not a leak either.** The University of Mauritius publishes its own
  international fee schedule in US dollars, so where the page quotes that source
  it quotes its unit. A bare `$` followed by a digit remains a leak — that would
  be inherited US content.
* **The hero "200+ Tie-ups" stat had to go**, as it did on the Finnish page.
  Mauritian higher education is 45 institutions in total; "200+" would claim
  about five times more relationships than institutions exist, on a page whose
  own directory can be counted in a minute. It reads **41**, the same number the
  directory lists.

## The copy claims this page must never get wrong

Four, and `localise_mu.py` asserts each of them survives in both JS files.

1. **Part-time work is 20 hours a week and it is NOT automatic.** The University
   of Mauritius's own wording is that a student "**may be** authorised", after a
   written request routed through the institution to the Ministry. Every
   aggregator drops that condition, which is how a student ends up budgeting on
   money they are not cleared to earn.
2. **The institution must be HEC-registered**, or there is no visa to apply for
   — and the same check returns three years later, because the Young
   Professional Occupation Permit requires an HEC-recognised degree.
3. **The medical tests must be redone in Mauritius within one month of arrival**,
   or the provisional entry permit is cancelled. This is the deadline applicants
   miss.
4. **The Student Visa carries no dependant provision.** The PIO's guidelines
   make none; the dependant permit hangs off the Occupation Permit regime. This
   page **reverses** one of the reference's claims rather than restating it —
   `Partners & children, with full work rights.` is true in Poland, Finland,
   Germany and Ireland and is deliberately left standing there, but in Mauritius
   a dependant permit carries **no work right at all**.

## Figures on the page, and where they came from

| figure | source |
| --- | --- |
| USD 6,000 / USD 5,000 a year block fee | University of Mauritius, *Fees Applicable to International Students* |
| 50% block-fee scholarship for Indian applicants | the same document — "Asian Developing Countries (e.g India, Pakistan, Sri Lanka, Bangladesh, Nepal, China and Indonesia)", or an approved recruitment agent |
| Rs 189,300 a year, Doctor of Medicine | the same document |
| 20 hours a week, on authorisation | University of Mauritius, *Work and Study* |
| Rs 25,000 a month, six sectors, six months, 3 years (YPOP) | Passport and Immigration Office, *Occupation Permit*; sector list and salary confirmed against the EDB's 2026 guidance |
| Rs 50,000 a month, Professional OP; PR after 5 years | EDB 2026 guidance (post-September-2025 reforms) |
| Rs 17,745 a month national minimum wage, from 1 Jan 2026 | Government Gazette, 17 January 2026 |
| Student visa process, 2 weeks, 3-month provisional permit, 1-month medical | HEC / PIO, *Guidelines for Application and Issue of Student Visa* |
| 41 institutions, awards, subjects, locations | the HEC registers, captured 2026-09-05 |

## Things a reviewer should check before launch

1. **The UoM fee schedule is dated 12 February 2020** and the University
   "reserves the right to review General Fees, Tuition Fees and other charges for
   any given academic year". It is the most recent one UoM publishes and
   third-party aggregates bracketing USD 4,000–7,000 corroborate the order of
   magnitude — but the page says "about", and it should not be tightened to an
   exact 2026 quotation without a newer source.
2. **The government contradicts itself on the Occupation Permit numbers.** The
   PIO's page still carries the pre-reform figures (Rs 150,000, permanent
   residence after 3 years) and still writes "TEC" for the Commission that was
   replaced in 2017. The page follows the **EDB**. Re-check before launch,
   because this is a live policy area.
3. **The 20-hour figure is institutional guidance, not the gazette.** The
   Employment (Non-Citizens) (Restriction) Exemptions (Amendment) Regulations
   2013 are cited everywhere for it, but the text could not be retrieved:
   workpermit.mu's legislation page serves a *different* 2013 amendment and the
   Attorney-General's consolidated Act is a scanned image. Every source checked
   agrees on 20 hours; none of them is the regulation itself.
4. **`hec-public-institutions.json` does not refresh.** `--refresh` re-captures
   the two private feeds and the HEI page only, because HEC serves no feed for
   the public sector. If the ten change, re-read `hec-hei-page.html` and update
   that file by hand.
5. **Photo licences.** One of the four is CC BY 2.0, which makes the footer
   credit line a licence obligation. See `assets/img/photos/CREDITS.md`.
