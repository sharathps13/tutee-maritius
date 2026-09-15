/* ==========================================================================
 * MU_UNIVERSITIES -- Mauritian institution directory dataset
 * --------------------------------------------------------------------------
 * PROVENANCE -- READ BEFORE EDITING
 *
 * Generated. Do not hand-edit: rebuild with
 *   python3 _tooling/build_dataset_mu.py
 *
 * Every institution here comes from the Higher Education Commission's own
 * lists. Nothing is invented and the list is not padded.
 *
 *   HEC -- register of private higher education institutions
 *   https://www.hec.mu/private_institution_search_all_data.php  (35 rows)
 *   HEC -- accredited programmes at those institutions
 *   https://www.hec.mu/private_institution_courses_all_data.php (289 rows)
 *   HEC -- the publicly-funded institutions, https://www.hec.mu/hei (10)
 *     capture: 2026-09-05
 *
 * REGISTRATION IS THE PERMISSION. Under the Higher Education Act 2017 no body
 * may provide higher education in Mauritius unless registered with the HEC,
 * and the Passport and Immigration Office's Student Visa guidelines require a
 * non-citizen to "secure a seat in a tertiary educational institution ...
 * registered" with the Commission before a visa exists to apply for. So the
 * register is not a quality filter this page chose -- it is the legal
 * precondition, as CRICOS is in Australia and EMGS in Malaysia.
 *
 * WHY 41 AND NOT 45
 *
 *   10 publicly-funded institutions + 35 registered private HEIs
 *  -2  public institutions an international applicant has no route into:
 *       the Atal Bihari Vajpayee Institute of Public Service and Innovation,
 *       established by its 2025 Act "as the apex training body for public
 *       officers", and the Mauritius Institute of Health, which AWARDS
 *       qualifications for in-service programmes run by the Ministry of
 *       Health's Central School of Nursing rather than admitting students
 *  -2  private HEIs on the register with no accredited programme to enrol
 *       in (Australia's "no live course" rule). HEC's own site says it
 *       regulates 33 private HEIs, which is exactly what is left.
 *  =41 listed
 *
 * REAL DATA, straight off the registers:
 *   `name`        the registered name, exactly as HEC holds it.
 *   `location`    town and district. For private HEIs the register gives a
 *                 free-text address, so the town is matched out of it and the
 *                 district derived from the town; an address whose town is not
 *                 recognised fails the build rather than being guessed at.
 *   `awards`      WHO GRANTS THE QUALIFICATION -- "Own awards" where the
 *                 institution has awarding powers, "Partner awards" where it
 *                 delivers another body's award, "Own awards (sub-degree)" for
 *                 the institutions HEC records as awarding at certificate and
 *                 diploma level only. For private HEIs this is the register's
 *                 own `awpower` flag; for public ones it is HEC's published
 *                 categorisation of the sector. This is the most consequential
 *                 fact on a Mauritian card: HEC records 33 OVERSEAS awarding
 *                 bodies operating locally, and 26 of the 41 institutions
 *                 here teach toward someone else's degree. It is real data, not
 *                 an invented statistic like the UK page's offerRate.
 *   `programs`    (no "me") the institution's largest subject areas. For
 *                 private HEIs these are folded from the field recorded on each
 *                 of its accredited programmes; for public ones from its own
 *                 published faculty and school list. An unmapped field fails
 *                 the build rather than dropping silently.
 *   `type`        HEC's own categorisation: four public universities, the
 *                 degree-awarding institutions, the institutions awarding at
 *                 sub-degree level, and the private register split on awarding
 *                 powers.
 *
 * EDITORIAL, and marked as such:
 *   `alt`         search terms, never rendered: abbreviations (UOM, UTM, MIE),
 *                 towns, districts and accent-folded spellings. Mauritian names
 *                 are French-orthographic -- Reduit, Ebene, Ilot, Universite
 *                 des Mascareignes -- and an applicant types them unaccented.
 *
 * RANKING -- READ THIS BEFORE ADDING A RANK BADGE ANYWHERE
 *   `rank` is a sequential position 1..41 and is meaningful ONLY for entry 1.
 *   THE World University Rankings 2026 covers two Mauritian institutions and
 *   RANKS one: the University of Mauritius, in the 1201-1500 band. The
 *   University of Technology, Mauritius is a "Reporter" and holds no position.
 *   QS World ranks no Mauritian institution at all -- the University of
 *   Mauritius appears only in QS's subject tables. No regional table reaches
 *   twelve Mauritian institutions the way QS Europe reached twelve Irish and
 *   twelve Finnish ones.
 *
 *   Entries 2-41 carry NO ranking meaning: they are ordered by HEC category
 *   and then alphabetically. The directory UI prints "#N" only where `ranked`
 *   is true and a dash otherwise. The home-page carousel renders twelve cards
 *   with a hardcoded "Rank #N" in the reference DOM, so localise_mu.py rewrites
 *   ALL TWELVE badges to the institution's real HEC standing -- the first page
 *   in this set to rebadge every card. See MAURITIUS_SPEC.md section 12.
 * ========================================================================== */
window.MU_UNIVERSITIES = [
  { id: "university-of-mauritius", name: "University of Mauritius", rank: 1, location: "Réduit, Moka", type: "Public University", awards: "Own awards", programs: "Agriculture, Engineering, IT & Computing, Law, Health & Medicine", alt: "UOM, Réduit, Moka, Reduit" , ranked: true },
  { id: "open-university-of-mauritius", name: "Open University of Mauritius", rank: 2, location: "Réduit, Moka", type: "Public University", awards: "Own awards", programs: "Accounting & Finance, Law, Business & Management, Education, IT & Computing", alt: "OU, Réduit, Moka, Reduit" , ranked: false },
  { id: "universite-des-mascareignes", name: "Université des Mascareignes", rank: 3, location: "Beau Plan, Pamplemousses", type: "Public University", awards: "Own awards", programs: "Business & Management, Engineering, IT & Computing", alt: "UdM, Beau Plan, Pamplemousses, Universite des Mascareignes" , ranked: false },
  { id: "university-of-technology-mauritius", name: "University of Technology, Mauritius", rank: 4, location: "Pointe aux Sables, Port Louis", type: "Public University", awards: "Own awards", programs: "Business & Management, Engineering, Tourism & Hospitality, Health & Medicine", alt: "UTM, Pointe aux Sables, Port Louis" , ranked: false },
  { id: "mauritius-institute-of-education", name: "Mauritius Institute of Education", rank: 5, location: "Réduit, Moka", type: "Degree-Awarding Institution", awards: "Own awards", programs: "Natural Sciences, Education, Arts & Humanities", alt: "MIE, Réduit, Moka, Reduit" , ranked: false },
  { id: "academy-of-design-and-innovation", name: "Academy of Design and Innovation", rank: 6, location: "Ebène, Plaines Wilhems", type: "Specialised Institution", awards: "Own awards (sub-degree)", programs: "Architecture & Design", alt: "ADI, Ebène, Plaines Wilhems, Ebene" , ranked: false },
  { id: "mahatma-gandhi-institute", name: "Mahatma Gandhi Institute", rank: 7, location: "Moka", type: "Specialised Institution", awards: "Own awards (sub-degree)", programs: "Arts & Humanities, Architecture & Design, Social Sciences", alt: "MGI, Moka" , ranked: false },
  { id: "rabindranath-tagore-institute", name: "Rabindranath Tagore Institute", rank: 8, location: "Îlôt, Pamplemousses", type: "Specialised Institution", awards: "Own awards (sub-degree)", programs: "Arts & Humanities, Architecture & Design, Social Sciences", alt: "RTI, Îlôt, Pamplemousses, Ilot" , ranked: false },
  { id: "african-leadership-college-of-higher-education", name: "African Leadership College of Higher Education", rank: 9, location: "Powder Mill, Pamplemousses", type: "Private Institution (own awards)", awards: "Own awards", programs: "Business & Management, IT & Computing", alt: "Powder Mill, Pamplemousses, African Leadership (Mauritius) Ltd trading as African Leadership College of Higher Education" , ranked: false },
  { id: "amity-institute-of-higher-education", name: "Amity Institute of Higher Education", rank: 10, location: "Pierrefonds", type: "Private Institution (own awards)", awards: "Own awards", programs: "Business & Management, IT & Computing, Tourism & Hospitality, Marketing & Communication", alt: "Pierrefonds" , ranked: false },
  { id: "charles-telfair-institute", name: "Charles Telfair Institute", rank: 11, location: "Moka", type: "Private Institution (own awards)", awards: "Own awards", programs: "Business & Management, Accounting & Finance", alt: "Moka, Charles Telfair Company Ltd Trading as Charles Telfair Institute" , ranked: false },
  { id: "jss-academy-of-higher-education-and-research-mauritius-ltd", name: "JSS Academy of Higher Education and Research (Mauritius) Ltd", rank: 12, location: "Vacoas, Plaines Wilhems", type: "Private Institution (own awards)", awards: "Own awards", programs: "Health & Medicine, Natural Sciences, Business & Management", alt: "Vacoas, Plaines Wilhems" , ranked: false },
  { id: "polytechnics-mauritius-ltd", name: "Polytechnics Mauritius Ltd", rank: 13, location: "Réduit, Moka", type: "Private Institution (own awards)", awards: "Own awards", programs: "IT & Computing, Health & Medicine, Tourism & Hospitality", alt: "Réduit, Moka, Reduit" , ranked: false },
  { id: "rushmore-ltd", name: "Rushmore Ltd", rank: 14, location: "Quatre Bornes, Plaines Wilhems", type: "Private Institution (own awards)", awards: "Own awards", programs: "Business & Management, Health & Medicine, Arts & Humanities, IT & Computing, Engineering", alt: "Quatre Bornes, Plaines Wilhems" , ranked: false },
  { id: "vit-mauritius-education-ltd", name: "VIT (Mauritius) Education Ltd", rank: 15, location: "Quatre Bornes, Plaines Wilhems", type: "Private Institution (own awards)", awards: "Own awards", programs: "Engineering", alt: "Quatre Bornes, Plaines Wilhems" , ranked: false },
  { id: "amity-global-business-school", name: "Amity Global Business School", rank: 16, location: "Quatre Bornes, Plaines Wilhems", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, Accounting & Finance, Law", alt: "Quatre Bornes, Plaines Wilhems" , ranked: false },
  { id: "analysis-institute-of-management-ltd", name: "Analysis Institute of Management Ltd", rank: 17, location: "Ebène, Plaines Wilhems", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, Marketing & Communication, Accounting & Finance", alt: "Ebène, Plaines Wilhems, Ebene" , ranked: false },
  { id: "anna-medical-college", name: "Anna Medical College", rank: 18, location: "Montagne Blanche", type: "Private Institution", awards: "Partner awards", programs: "Health & Medicine", alt: "Montagne Blanche, Maragadham Education Ltd operating as Anna Medical College" , ranked: false },
  { id: "assas-international-mauritius-limited", name: "Assas International (Mauritius) Limited", rank: 19, location: "Pierrefonds", type: "Private Institution", awards: "Partner awards", programs: "Law, Business & Management, Accounting & Finance", alt: "Pierrefonds, Assas International (Mauritius) Limited operating as a branch campus of Université Paris-Panthéon-Assas, France, Assas International (Mauritius) Limited operating as a branch campus of Universite Paris-Pantheon-Assas, France" , ranked: false },
  { id: "belstar-training-services-ltd", name: "Belstar Training Services Ltd", rank: 20, location: "Ebène, Plaines Wilhems", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, Accounting & Finance", alt: "Ebène, Plaines Wilhems, Ebene" , ranked: false },
  { id: "curtin-mauritius", name: "Curtin Mauritius", rank: 21, location: "Moka", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, Marketing & Communication, IT & Computing, Social Sciences, Accounting & Finance", alt: "Moka, Charles Telfair Company Ltd Trading as Curtin Mauritius" , ranked: false },
  { id: "ensa-nantes-mauritius", name: "ENSA Nantes (Mauritius)", rank: 22, location: "Quatre Bornes, Plaines Wilhems", type: "Private Institution", awards: "Partner awards", programs: "Architecture & Design", alt: "Quatre Bornes, Plaines Wilhems" , ranked: false },
  { id: "glamis-business-school-ltd", name: "Glamis Business School Ltd", rank: 23, location: "Quatre Bornes, Plaines Wilhems", type: "Private Institution", awards: "Partner awards", programs: "Accounting & Finance, Business & Management", alt: "Quatre Bornes, Plaines Wilhems" , ranked: false },
  { id: "global-coaching-solutions-ltd", name: "Global Coaching Solutions Ltd", rank: 24, location: "Port Louis", type: "Private Institution", awards: "Partner awards", programs: "Accounting & Finance", alt: "Port Louis" , ranked: false },
  { id: "honoris-educational-network-ltd", name: "Honoris Educational Network Ltd", rank: 25, location: "Highlands, Moka", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, Accounting & Finance, IT & Computing, Marketing & Communication", alt: "Highlands, Moka" , ranked: false },
  { id: "iimm-studies-mauritius-ltd", name: "IIMM Studies (Mauritius) Ltd", rank: 26, location: "Goodlands, Rivière du Rempart", type: "Private Institution", awards: "Partner awards", programs: "Health & Medicine", alt: "Goodlands, Rivière du Rempart" , ranked: false },
  { id: "institut-escoffier-ltd", name: "Institut Escoffier Ltd", rank: 27, location: "St Pierre, Moka", type: "Private Institution", awards: "Partner awards", programs: "Marketing & Communication, Tourism & Hospitality, Business & Management, IT & Computing", alt: "St Pierre, Moka" , ranked: false },
  { id: "iomit-s-ssr-medical-college", name: "IOMIT'S SSR Medical College", rank: 28, location: "Belle Rive", type: "Private Institution", awards: "Partner awards", programs: "Health & Medicine", alt: "Belle Rive" , ranked: false },
  { id: "kredence-capacity-building-kcb", name: "Kredence Capacity Building (KCB)", rank: 29, location: "Port Louis", type: "Private Institution", awards: "Partner awards", programs: "Business & Management", alt: "Port Louis, Kredence Capacity Building Ltd trading as Kredence Capacity Building (KCB)" , ranked: false },
  { id: "lexcorp-training-institute", name: "Lexcorp Training Institute", rank: 30, location: "Port Louis", type: "Private Institution", awards: "Partner awards", programs: "Accounting & Finance", alt: "Port Louis" , ranked: false },
  { id: "london-college-of-accountancy-ltd", name: "London College of Accountancy Ltd", rank: 31, location: "Port Louis", type: "Private Institution", awards: "Partner awards", programs: "Accounting & Finance", alt: "Port Louis" , ranked: false },
  { id: "mcci-business-school-ltd", name: "MCCI Business School Ltd", rank: 32, location: "Ebène, Plaines Wilhems", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, Accounting & Finance, IT & Computing, Marketing & Communication, Tourism & Hospitality", alt: "Ebène, Plaines Wilhems, Ebene" , ranked: false },
  { id: "middlesex-university-mauritius", name: "Middlesex University Mauritius", rank: 33, location: "Flic en Flac, Black River", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, IT & Computing, Law, Engineering, Accounting & Finance", alt: "Flic en Flac, Black River" , ranked: false },
  { id: "ocep-aussie-ltd", name: "Ocep Aussie Ltd", rank: 34, location: "Forest Side, Plaines Wilhems", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, IT & Computing, Accounting & Finance", alt: "Forest Side, Plaines Wilhems" , ranked: false },
  { id: "the-education-trust", name: "The Education Trust", rank: 35, location: "Curepipe, Plaines Wilhems", type: "Private Institution", awards: "Partner awards", programs: "Arts & Humanities", alt: "Curepipe, Plaines Wilhems" , ranked: false },
  { id: "trianon-hospitality-tourism-company-ltd", name: "Trianon Hospitality & Tourism Company Ltd", rank: 36, location: "Quatre Bornes, Plaines Wilhems", type: "Private Institution", awards: "Partner awards", programs: "Tourism & Hospitality", alt: "Quatre Bornes, Plaines Wilhems" , ranked: false },
  { id: "uniciti-education-hub-ltd", name: "Uniciti Education Hub Ltd", rank: 37, location: "Pierrefonds", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, Marketing & Communication, Health & Medicine, IT & Computing, Education", alt: "Pierrefonds" , ranked: false },
  { id: "uom-enterprise-ltd", name: "UOM Enterprise Ltd", rank: 38, location: "Ebène, Plaines Wilhems", type: "Private Institution", awards: "Partner awards", programs: "Law, Business & Management, Marketing & Communication", alt: "Ebène, Plaines Wilhems, Ebene" , ranked: false },
  { id: "uom-trust", name: "UOM Trust", rank: 39, location: "Réduit, Moka", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, Accounting & Finance, IT & Computing", alt: "Réduit, Moka, Reduit" , ranked: false },
  { id: "whitefield-business-school-ltd", name: "Whitefield Business School Ltd", rank: 40, location: "Curepipe, Plaines Wilhems", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, IT & Computing, Education", alt: "Curepipe, Plaines Wilhems" , ranked: false },
  { id: "yk-business-school-ltd", name: "YK Business School Ltd", rank: 41, location: "Highlands, Moka", type: "Private Institution", awards: "Partner awards", programs: "Business & Management, Marketing & Communication", alt: "Highlands, Moka" , ranked: false }
];
