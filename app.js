/* =====================================================================
   Surani & Sons — app.js
   Static site logic: data, rendering, GSAP motion, modal, guides.
   ===================================================================== */
(() => {
'use strict';

/* ------------------------------ CONFIG ------------------------------ */
// Replace with your real inbox before deploying. Enquiries open the visitor's
// email app pre-filled (GitHub Pages has no backend). To use a form service
// instead (Formspree, Web3Forms, etc.), swap submitEnquiry() below.
const CONFIG = {
  brand: 'Surani & Sons',
  email: 'enquiries@suranisons.example'
};

/* ------------------------------ HELPERS ------------------------------ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const hasGSAP = typeof window.gsap !== 'undefined';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const state = { mode: 'retail', cat: null, mat: null, origin: 'all', shape: null, colorTab: 'all', clarityTab: 'all' };

const unsplash = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
const GEM_FALLBACK = `<svg width="64" height="64" viewBox="0 0 100 100" opacity=".5"><polygon points="28,14 72,14 94,40 50,92 6,40" fill="none" stroke="#d4af37" stroke-width="3" stroke-linejoin="round"/><polyline points="6,40 94,40 M28,14 40,40 50,92 60,40 72,14" fill="none" stroke="#d4af37" stroke-width="2" stroke-linejoin="round"/></svg>`;

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 3200);
}

function animateIn(els, opts = {}) {
  if (!hasGSAP || reduceMotion || !els.length) return;
  gsap.fromTo(els, { y: 36, opacity: 0 }, {
    y: 0, opacity: 1, duration: .8, stagger: .06, ease: 'power3.out',
    clearProps: 'transform,opacity', ...opts
  });
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

/* ------------------------------ DATA ------------------------------ */
const CATEGORIES = [
  { name: 'Necklaces', img: unsplash('photo-1599643478518-a784e5dc4c8f'), blurb: 'Rivières, pendants and statement collars.' },
  { name: 'Rings', img: unsplash('photo-1605100804763-247f67b3557e'), blurb: 'Solitaires, halos, eternity and cocktail rings.' },
  { name: 'Earrings', img: unsplash('photo-1535632066927-ab7c9ab60908'), blurb: 'Studs, drops and chandeliers.' },
  { name: 'Bracelets', img: unsplash('photo-1611652022419-a9419f74343d'), blurb: 'Tennis, link and cuff bracelets.' },
  { name: 'Bangles', img: unsplash('photo-1573408301185-9146fe634ad0'), blurb: 'Kadas, stacking and gem-set bangles.' },
  { name: 'Tiaras', img: unsplash('photo-1515562141207-7a88fb7ce338'), blurb: 'Bridal and ceremonial headpieces.' }
];

const MATERIALS = [
  { name: 'Yellow Gold', note: '18K · 22K', grad: 'radial-gradient(circle at 30% 25%, #fff0a8, #d4af37 55%, #7a5a12)' },
  { name: 'White Gold', note: '14K · 18K', grad: 'radial-gradient(circle at 30% 25%, #ffffff, #c9ccd1 55%, #6b6f78)' },
  { name: 'Rose Gold', note: '14K · 18K', grad: 'radial-gradient(circle at 30% 25%, #ffe0d3, #e2a58f 55%, #8a4a3a)' },
  { name: 'Platinum', note: 'PT950', grad: 'radial-gradient(circle at 30% 25%, #ffffff, #dfe3ea 45%, #8e95a3)' },
  { name: 'Diamond-Encrusted', note: 'Pavé · Micro-set', grad: 'conic-gradient(from 20deg, #fff, #cfe4ff, #fff, #ffe9b8, #fff, #d8f0ff, #fff)' }
];

const PRODUCTS = [
  { id: 'aurora', name: 'Aurora Solitaire Ring', cat: 'Rings', mat: ['Platinum'], img: unsplash('photo-1605100804763-247f67b3557e'), badge: 'Signature', rt: 'Signature', wt: 'Volume A', desc: 'A six-prong solitaire designed to let the centre stone take the light.', specs: ['Metal: PT950 platinum', 'Centre stone: round brilliant, certified (size to order)', 'Sizing and engraving available', 'Wholesale: made-to-order, minimum applies'] },
  { id: 'soleil', name: 'Soleil Rivière Necklace', cat: 'Necklaces', mat: ['Yellow Gold', 'Diamond-Encrusted'], img: unsplash('photo-1599643478518-a784e5dc4c8f'), badge: 'Heirloom', rt: 'Prestige', wt: 'Volume B', desc: 'Graduated brilliants in a continuous line, set in warm 18K yellow gold.', specs: ['Metal: 18K yellow gold', 'Stones: graduated round brilliants', 'Length adjustable on request', 'Wholesale: matched-stone sets quoted per lot'] },
  { id: 'rose-eclipse', name: 'Rosé Eclipse Earrings', cat: 'Earrings', mat: ['Rose Gold'], img: unsplash('photo-1535632066927-ab7c9ab60908'), badge: 'New', rt: 'Signature', wt: 'Volume A', desc: 'Crescent drops in rose gold with a bezel-set diamond accent.', specs: ['Metal: 18K rose gold', 'Stones: bezel-set diamonds', 'Post and lever-back options', 'Wholesale: stock and made-to-order'] },
  { id: 'imperial', name: 'Imperial Tennis Bracelet', cat: 'Bracelets', mat: ['White Gold', 'Diamond-Encrusted'], img: unsplash('photo-1611652022419-a9419f74343d'), badge: 'Best seller', rt: 'Prestige', wt: 'Volume B', desc: 'A flexible line of matched diamonds with a hidden safety clasp.', specs: ['Metal: 18K white gold', 'Stones: matched round brilliants', 'Concealed box clasp with safety catch', 'Wholesale: per-carat-weight pricing'] },
  { id: 'maharani', name: 'Maharani Kada Bangle', cat: 'Bangles', mat: ['Yellow Gold'], img: unsplash('photo-1573408301185-9146fe634ad0'), badge: 'Artisan', rt: 'Signature', wt: 'Volume A', desc: 'Hand-engraved 22K bangle inspired by royal court jewelry.', specs: ['Metal: 22K yellow gold', 'Hand-engraved motifs', 'Sized to wrist measurement', 'Wholesale: designs available for white-label'] },
  { id: 'celestine', name: 'Celestine Tiara', cat: 'Tiaras', mat: ['Platinum', 'Diamond-Encrusted'], img: unsplash('photo-1515562141207-7a88fb7ce338'), badge: 'Bespoke', rt: 'Atelier', wt: 'Project', desc: 'A convertible bridal tiara with detachable sections, made to commission.', specs: ['Metal: platinum', 'Stones: pavé and marquise accents', 'Comb and band fittings', 'Commission-only; lead time quoted per project'] },
  { id: 'halo', name: 'Halo Cushion Ring', cat: 'Rings', mat: ['Rose Gold', 'Diamond-Encrusted'], img: unsplash('photo-1611591437281-460bfbe1220a'), badge: 'Romantic', rt: 'Prestige', wt: 'Volume B', desc: 'A cushion-cut centre cradled by a micro-pavé halo and rose-gold shank.', specs: ['Metal: 18K rose gold', 'Centre: cushion cut (certified)', 'Micro-pavé halo and shank', 'Wholesale: mountings sold with or without centre'] },
  { id: 'lumiere', name: 'Lumière Chandelier Earrings', cat: 'Earrings', mat: ['Yellow Gold', 'Diamond-Encrusted'], img: unsplash('photo-1602173574767-37ac01994b2a'), badge: 'Evening', rt: 'Prestige', wt: 'Volume B', desc: 'Tiered, articulated drops that move with every step.', specs: ['Metal: 18K yellow gold', 'Stones: pear and round brilliants', 'Articulated links', 'Wholesale: made-to-order'] }
];

const STONES = [
  { id: 1, shape: 'Round', ct: 1.02, color: 'D', clarity: 'VVS1', origin: 'natural', cert: 'GIA' },
  { id: 2, shape: 'Round', ct: 0.71, color: 'F', clarity: 'VS1', origin: 'lab', cert: 'IGI' },
  { id: 3, shape: 'Oval', ct: 1.51, color: 'G', clarity: 'VS2', origin: 'natural', cert: 'GIA' },
  { id: 4, shape: 'Oval', ct: 2.03, color: 'E', clarity: 'VS1', origin: 'lab', cert: 'IGI' },
  { id: 5, shape: 'Princess', ct: 1.2, color: 'H', clarity: 'SI1', origin: 'natural', cert: 'GIA' },
  { id: 6, shape: 'Cushion', ct: 3.01, color: 'F', clarity: 'VVS2', origin: 'lab', cert: 'IGI' },
  { id: 7, shape: 'Emerald', ct: 2.1, color: 'G', clarity: 'IF', origin: 'natural', cert: 'GIA' },
  { id: 8, shape: 'Asscher', ct: 1.75, color: 'E', clarity: 'VS2', origin: 'natural', cert: 'GIA' },
  { id: 9, shape: 'Marquise', ct: 1.05, color: 'I', clarity: 'SI1', origin: 'natural', cert: 'IGI' },
  { id: 10, shape: 'Pear', ct: 1.3, color: 'D', clarity: 'VS1', origin: 'lab', cert: 'IGI' },
  { id: 11, shape: 'Radiant', ct: 2.52, color: 'J', clarity: 'VS2', origin: 'lab', cert: 'IGI' },
  { id: 12, shape: 'Round', ct: 0.5, color: 'K', clarity: 'SI2', origin: 'natural', cert: 'GIA' },
  { id: 13, shape: 'Cushion', ct: 1.12, color: 'Fancy Yellow', clarity: 'VS1', origin: 'natural', cert: 'GIA' },
  { id: 14, shape: 'Pear', ct: 0.9, color: 'M', clarity: 'SI1', origin: 'natural', cert: 'IGI' },
  { id: 15, shape: 'Princess', ct: 2.0, color: 'F', clarity: 'VVS1', origin: 'lab', cert: 'IGI' },
  { id: 16, shape: 'Emerald', ct: 1.4, color: 'D', clarity: 'FL', origin: 'natural', cert: 'GIA' },
  { id: 17, shape: 'Oval', ct: 0.8, color: 'H', clarity: 'VS2', origin: 'natural', cert: 'GIA' },
  { id: 18, shape: 'Round', ct: 4.01, color: 'G', clarity: 'VVS2', origin: 'lab', cert: 'IGI' }
];

const COLOR_TABS = [
  { key: 'all', label: 'All colours', test: () => true },
  { key: 'colorless', label: 'Colourless D–F', test: c => ['D', 'E', 'F'].includes(c) },
  { key: 'near', label: 'Near colourless G–J', test: c => ['G', 'H', 'I', 'J'].includes(c) },
  { key: 'faint', label: 'Faint K–M', test: c => ['K', 'L', 'M'].includes(c) },
  { key: 'fancy', label: 'Fancy colours', test: c => c.startsWith('Fancy') }
];
const CLARITY_TABS = [
  { key: 'all', label: 'All clarities', test: () => true },
  { key: 'flawless', label: 'FL / IF', test: c => ['FL', 'IF'].includes(c) },
  { key: 'vvs', label: 'VVS1–VVS2', test: c => c.startsWith('VVS') },
  { key: 'vs', label: 'VS1–VS2', test: c => c.startsWith('VS') && !c.startsWith('VVS') },
  { key: 'si', label: 'SI1–SI2', test: c => c.startsWith('SI') }
];

const ORIGINS = [
  { key: 'natural', title: 'Natural Mined', img: unsplash('photo-1617038220319-276d3cfab638', 900), body: 'Formed over hundreds of millions to billions of years deep in the earth and recovered by mining. Each stone is unique, and traceable provenance is available on request.', points: ['Graded by GIA or IGI', 'Provenance documentation available', 'Strong long-term collectability', 'Resale values vary with grade and market'] },
  { key: 'lab', title: 'Lab-Grown', img: unsplash('photo-1602173574767-37ac01994b2a', 900), body: 'Real diamonds with the same crystal structure and chemistry as mined stones, grown in a laboratory using HPHT or CVD methods. Always disclosed and laser-inscribed.', points: ['Chemically and optically diamond', 'Typically priced well below natural', 'Larger, higher-grade stones are accessible', 'Resale values are generally much lower than natural'] }
];

const DIAMOND_TYPES = [
  { type: 'Type Ia', rarity: 12, freq: 'Most natural diamonds (roughly 95%)', body: 'Contains nitrogen in clustered aggregates. Ranges from colourless to yellow or brown. Most gem-quality natural diamonds fall here.' },
  { type: 'Type Ib', rarity: 55, freq: 'Very rare in nature', body: 'Isolated single nitrogen atoms give an intense yellow to orange-brown. Most HPHT-grown yellow diamonds are Type Ib.' },
  { type: 'Type IIa', rarity: 72, freq: 'Roughly 1–2% of natural diamonds', body: 'Virtually nitrogen-free: exceptional transparency and high thermal conductivity. Many famous large stones are IIa, as are most CVD lab-grown diamonds.' },
  { type: 'Type IIb', rarity: 96, freq: 'Extremely rare', body: 'Contains boron, giving a blue to grey tint and semiconductor behaviour. The source of rare blue diamonds.' },
  { type: 'Carbonado', rarity: 88, freq: 'Informally called “Type Ic”', body: 'A porous, polycrystalline black-to-dark-grey aggregate, not a single gem crystal. Opaque; valued for industrial use and as a distinctive design material.' }
];

const SHAPES = {
  Round: { svg: '<circle cx="50" cy="50" r="40"/>', note: 'The most brilliant shape and the only one with a standardised GIA cut grade. Highest demand, so typically the highest price per carat.', ratio: 'L:W 1.00', tip: 'Best for solitaires and maximum sparkle.' },
  Princess: { svg: '<rect x="14" y="14" width="72" height="72"/>', note: 'A square brilliant with pointed corners — modern, sharp and bright. Protect the corners with V-prong settings.', ratio: 'L:W 1.00–1.05', tip: 'Great value and strong face-up size.' },
  Cushion: { svg: '<rect x="12" y="12" width="76" height="76" rx="22"/>', note: 'Soft rounded corners with larger facets, giving a romantic, vintage look. Look closely at the cut and symmetry.', ratio: 'L:W 1.00–1.20', tip: 'Warm, antique character.' },
  Oval: { svg: '<ellipse cx="50" cy="50" rx="30" ry="42"/>', note: 'An elongated brilliant that can look larger than a round of the same weight and flatter the finger. Check for a bow-tie shadow across the centre.', ratio: 'L:W 1.30–1.50', tip: 'Looks larger per carat.' },
  Emerald: { svg: '<polygon points="34,8 66,8 82,24 82,76 66,92 34,92 18,76 18,24"/>', note: 'A step cut with long, clean facets that emphasise clarity over sparkle. Inclusions are easier to see, so choose clarity carefully.', ratio: 'L:W 1.30–1.60', tip: 'Elegant, understated, “hall-of-mirrors” effect.' },
  Asscher: { svg: '<polygon points="28,12 72,12 88,28 88,72 72,88 28,88 12,72 12,28"/>', note: 'A square step cut with cropped corners and a deep pavilion. An Art Deco classic with a hypnotic, concentric glow.', ratio: 'L:W 1.00–1.05', tip: 'Art Deco romance.' },
  Marquise: { svg: '<path d="M50 6 C80 30 80 70 50 94 C20 70 20 30 50 6Z"/>', note: 'A boat-shaped brilliant with two points that maximises apparent length and finger coverage. Protect both tips in the setting.', ratio: 'L:W 1.75–2.15', tip: 'Longest-looking per carat.' },
  Pear: { svg: '<path d="M50 6 C50 6 80 40 80 64 A30 30 0 0 1 20 64 C20 40 50 6 50 6Z"/>', note: 'A teardrop that blends round and marquise. Worn point-up or point-down; check that the point is centred and the shoulders are even.', ratio: 'L:W 1.45–1.75', tip: 'Versatile for rings, pendants and drops.' },
  Radiant: { svg: '<polygon points="30,10 70,10 84,24 84,76 70,90 30,90 16,76 16,24"/>', note: 'A rectangular brilliant with trimmed corners — the fire of a round in a rectangular outline. Durable and good at hiding small inclusions.', ratio: 'L:W 1.00–1.50', tip: 'Brilliance with a strong, modern outline.' }
};

const ANATOMY = {
  table: { title: 'Table', pos: [330, 66], spec: 'Typically ~54–60% of the diameter in a well-cut round', body: 'The large flat facet on top — the window through which light enters and exits. Its size and its balance with the crown angle shape both brilliance (white light) and fire (spectral colour).', why: 'A very large table can reduce fire; a very small one can reduce brilliance. The relationship to the crown angle matters more than the percentage alone.' },
  crown: { title: 'Crown', pos: [440, 112], spec: 'Crown angle typically ~34–35° for a round brilliant', body: 'The upper section between the table and the girdle. Its facets bend light as it enters and split it into spectral colours before it travels to the pavilion.', why: 'Crown angle and height work together with the pavilion angle. Mismatched pairs can dull a stone even when each number looks acceptable.' },
  girdle: { title: 'Girdle', pos: [460, 158], spec: 'Ideal range: thin to slightly thick', body: 'The narrow band around the stone’s widest edge. It protects the edge from chipping and gives the setting something to grip.', why: 'Extremely thin girdles chip more easily; extremely thick ones add weight that doesn’t show face-up. Look for an even thickness all around.' },
  pavilion: { title: 'Pavilion', pos: [395, 230], spec: 'Pavilion angle typically ~40.6–41° for a round brilliant', body: 'The lower section below the girdle. Its facets act like mirrors, reflecting light back through the table toward the eye.', why: 'Too shallow and light leaks out the bottom; too steep and it escapes through the sides or leaves a dark centre. Both reduce sparkle.' },
  culet: { title: 'Culet', pos: [277, 356], spec: 'Best graded “none” or “very small”', body: 'The tiny facet — or point — at the very bottom of the pavilion, there to protect the tip from chipping.', why: 'A large culet can look like a small dot through the table. Most modern stones have none or a very small culet.' }
};
const ANATOMY_FOOT = 'Overall for a well-cut round brilliant: total depth ≈ 59–62.5% of the diameter. Fancy shapes follow different proportion ranges.';

const CUT_GRADES = [
  { g: 'Excellent', d: 'Maximum brilliance, fire and scintillation. Light is returned almost entirely through the table.' },
  { g: 'Very Good', d: 'Nearly indistinguishable from Excellent to most eyes, often at a noticeably lower price.' },
  { g: 'Good', d: 'Reflects most light; a good balance for tighter budgets, with visibly less sparkle than higher grades.' },
  { g: 'Fair', d: 'Allows noticeable light leakage, giving a duller appearance.' },
  { g: 'Poor', d: 'Significant light loss through the sides or bottom. Generally not recommended.' }
];
const COLOR_GRADES = 'DEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const colorInfo = i => i <= 2 ? ['Colourless', 'Rarest and most valuable; the absence of colour lets maximum light through.'] : i <= 6 ? ['Near colourless', 'Slight colour is hard to detect face-up, especially once set — often the best value.'] : i <= 9 ? ['Faint', 'Colour is visible to a trained eye and increasingly noticeable in larger stones.'] : i <= 14 ? ['Very light', 'Light yellow or brown tint is easy to see.'] : ['Light', 'Obvious tint. Beyond Z, stronger colours are graded as “fancy colour” instead.'];
const CLARITY_GRADES = [
  { g: 'FL', n: 0, d: 'Flawless: no inclusions or blemishes visible under 10× magnification.' },
  { g: 'IF', n: 0, d: 'Internally Flawless: no inclusions, only minor surface blemishes at 10×.' },
  { g: 'VVS1', n: 1, d: 'Very, Very Slightly Included: inclusions are extremely difficult to see at 10×.' },
  { g: 'VVS2', n: 2, d: 'Very, Very Slightly Included: inclusions very difficult to see at 10×.' },
  { g: 'VS1', n: 2, d: 'Very Slightly Included: minor inclusions that are difficult to see at 10×.' },
  { g: 'VS2', n: 3, d: 'Very Slightly Included: minor inclusions somewhat easy to see at 10×; typically eye-clean.' },
  { g: 'SI1', n: 4, d: 'Slightly Included: inclusions are noticeable at 10×; often still eye-clean.' },
  { g: 'SI2', n: 5, d: 'Slightly Included: inclusions are easy to see at 10× and may be visible to the eye.' },
  { g: 'I1', n: 7, d: 'Included: inclusions are obvious and may affect transparency and brilliance.' },
  { g: 'I2', n: 9, d: 'Included: prominent inclusions that clearly affect appearance.' },
  { g: 'I3', n: 12, d: 'Included: heavy inclusions that may affect durability as well as appearance.' }
];

const FAQS = [
  { q: 'Do you ship internationally, and how are shipments protected?', a: 'Yes. We ship to most countries via insured, tracked, signature-required carriers specialising in high-value cargo. Duties, import taxes and any licensing requirements depend on the destination and are confirmed in your quotation. Some destinations may be restricted under sanctions or local regulation.' },
  { q: 'Which certificates do your diamonds carry?', a: 'Our loose diamonds are graded by independent laboratories — principally GIA and IGI. The report number is laser-inscribed on the girdle of most certified stones where size permits and can be verified on the issuing laboratory’s website. Lab-grown stones are always identified as lab-grown on the report and our invoice.' },
  { q: 'How does secure vault logistics work?', a: 'For high-value orders and investor programmes we can arrange insured, segregated storage with third-party vault operators, with itemised inventory records and verification on request. Storage fees, insurance cover and release procedures are agreed in writing before any stone is deposited.' },
  { q: 'What are your wholesale minimums and terms?', a: 'Minimums vary by category — finished jewelry, loose stones, parcels and melee each have their own thresholds. Verified trade customers can discuss volume tiers, white-label manufacturing and payment structures such as escrow. Share your business details through the Enquire form and we will respond with a written quotation.' },
  { q: 'Can I buy online?', a: 'Not directly. Because each stone and piece is individually graded, sized and insured, we handle every purchase through a personal consultation or written quotation rather than an online checkout. Use Explore to browse and Enquire to start the conversation.' },
  { q: 'Do you offer custom and bespoke jewelry?', a: 'Yes. Our studios produce bespoke pieces from sketch and 3D render through casting, setting and finishing. Timelines depend on complexity and stone availability and are confirmed with your quotation.' },
  { q: 'How do I verify that a stone is natural or lab-grown?', a: 'Only laboratory instruments can reliably tell them apart. Every stone we sell comes with a grading report stating its origin. We recommend independent verification for any diamond purchased elsewhere.' }
];

const OFFICES = [
  { city: 'Mumbai', region: 'India', role: 'Cutting, Manufacturing & Trade Desk', tz: 'IST (UTC+5:30)' },
  { city: 'Dubai', region: 'United Arab Emirates', role: 'Middle East & Africa Trading Hub', tz: 'GST (UTC+4)' },
  { city: 'Antwerp', region: 'Belgium', role: 'European Rough & Polished Sourcing', tz: 'CET (UTC+1)' },
  { city: 'New York', region: 'United States', role: 'Americas Wholesale & Retail Clients', tz: 'ET (UTC−5)' },
  { city: 'Hong Kong', region: 'SAR China', role: 'Asia-Pacific Distribution', tz: 'HKT (UTC+8)' },
  { city: 'London', region: 'United Kingdom', role: 'Private Client & Investor Relations', tz: 'GMT (UTC+0)' }
];

const TERMS = [
  { h: '1. Quotations & pricing', p: 'All prices are quoted in writing for a stated validity period. Diamond and metal prices fluctuate; quotations not accepted and funded within the validity period may be revised.' },
  { h: '2. Orders & acceptance', p: 'An order is binding only when we issue a written order confirmation and receive the agreed deposit or payment instrument. We may decline orders at our discretion, including where verification cannot be completed.' },
  { h: '3. Payment & escrow', p: 'Payment may be by bank transfer or, for qualifying trade orders, through an independent escrow arrangement under which funds are released on agreed delivery or inspection milestones. Third-party escrow and bank fees are stated in the quotation.' },
  { h: '4. Compliance & verification', p: 'We carry out know-your-customer, anti-money-laundering and sanctions screening on all trade customers and on retail orders above applicable thresholds. We may request identification, business documents and source-of-funds information, and may withhold or cancel orders that cannot be cleared.' },
  { h: '5. Shipping, risk & insurance', p: 'Goods are shipped fully insured under the agreed Incoterm. Risk passes as stated on the contract. Recipients must inspect packaging on delivery and report visible damage to the carrier and to us immediately.' },
  { h: '6. Duties & taxes', p: 'Unless the contract states otherwise, import duties, VAT or GST and local clearance charges are the responsibility of the buyer. Customers should check local import rules before ordering.' },
  { h: '7. Inspection, returns & memo', p: 'Returns, inspection periods and memo (consignment) terms are set out in the sales contract. Custom, resized and bespoke items are generally non-returnable. Returned items must be unworn, undamaged and accompanied by original certificates.' },
  { h: '8. Disclosure & governing law', p: 'Origin (natural or lab-grown), treatments and certification are disclosed on all stones. Contracts are governed by the law and dispute-resolution forum stated in the sales agreement; consumer rights that cannot be waived by law remain unaffected.' }
];

const DIAL_CODES = [
  ['+1', 'US / Canada'], ['+7', 'Russia / Kazakhstan'], ['+20', 'Egypt'], ['+27', 'South Africa'], ['+30', 'Greece'], ['+31', 'Netherlands'],
  ['+32', 'Belgium'], ['+33', 'France'], ['+34', 'Spain'], ['+39', 'Italy'], ['+41', 'Switzerland'], ['+44', 'United Kingdom'], ['+49', 'Germany'],
  ['+52', 'Mexico'], ['+55', 'Brazil'], ['+60', 'Malaysia'], ['+61', 'Australia'], ['+62', 'Indonesia'], ['+63', 'Philippines'], ['+65', 'Singapore'],
  ['+66', 'Thailand'], ['+81', 'Japan'], ['+82', 'South Korea'], ['+84', 'Vietnam'], ['+86', 'China'], ['+90', 'Türkiye'], ['+91', 'India'],
  ['+92', 'Pakistan'], ['+94', 'Sri Lanka'], ['+212', 'Morocco'], ['+234', 'Nigeria'], ['+254', 'Kenya'], ['+852', 'Hong Kong'], ['+880', 'Bangladesh'],
  ['+960', 'Maldives'], ['+966', 'Saudi Arabia'], ['+971', 'UAE'], ['+972', 'Israel'], ['+974', 'Qatar'], ['+977', 'Nepal']
];

/* ------------------------------ SHARED SVG ------------------------------ */
function shapeSVG(name, size = 84) {
  const s = SHAPES[name];
  const id = 'g' + Math.random().toString(36).slice(2, 8);
  return `<svg class="stone-svg" style="width:${size}px;height:${size}px" viewBox="0 0 100 100" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#cfe3ff"/><stop offset="1" stop-color="#8aa3c7"/></linearGradient></defs>
    <g fill="url(#${id})" fill-opacity=".85" stroke="rgba(255,255,255,.9)" stroke-width="1.6" stroke-linejoin="round">${s.svg}</g>
    <g fill="none" stroke="rgba(255,255,255,.65)" stroke-width="1" stroke-linejoin="round" transform="translate(50 50) scale(.55) translate(-50 -50)">${s.svg}</g>
  </svg>`;
}
function shapeIcon(name) {
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="rgba(212,175,55,.12)" stroke="currentColor" stroke-width="3" stroke-linejoin="round">${SHAPES[name].svg}</g></svg>`;
}

/* ------------------------------ LOADER & INTRO ------------------------------ */
function initLoader() {
  const loader = $('#loader');
  const bar = $('.loader-bar i', loader);
  requestAnimationFrame(() => (bar.style.width = '100%'));
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    if (hasGSAP && !reduceMotion) {
      gsap.to(loader, { opacity: 0, duration: .7, ease: 'power2.inOut', onComplete: () => { loader.style.display = 'none'; heroIntro(); } });
    } else {
      loader.style.display = 'none';
      $$('[data-count]').forEach(el => { el.textContent = (+el.dataset.count).toLocaleString(); });
    }
  };
  window.addEventListener('load', () => setTimeout(finish, 900));
  setTimeout(finish, 3200); // safety net
}

function heroIntro() {
  if (!hasGSAP) return;
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('#hero-eyebrow', { y: 20, opacity: 0, duration: .8 })
    .from('.hero-word', { yPercent: 115, rotate: 4, duration: 1.2, stagger: .12 }, '-=.5')
    .from('#hero-sub', { y: 24, opacity: 0, duration: 1 }, '-=.7')
    .from('#hero-cta .btn', { y: 24, opacity: 0, duration: .9, stagger: .12, clearProps: 'transform,opacity' }, '-=.7')
    .from('#hero-stats > div', { y: 24, opacity: 0, duration: .9, stagger: .1 }, '-=.6')
    .from('#hero-gem', { scale: .6, opacity: 0, rotateY: -60, duration: 1.6, ease: 'expo.out' }, 0.3);
  gsap.to('#hero-gem', { y: -16, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 });
  gsap.fromTo('#gem-shine', { x: -140 }, { x: 560, duration: 2.2, repeat: -1, repeatDelay: 2.4, ease: 'power2.inOut' });
  $$('[data-count]').forEach(el => {
    const target = +el.dataset.count; const o = { v: 0 };
    gsap.to(o, { v: target, duration: 2.4, ease: 'power2.out', delay: 1, onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString(); } });
  });
}

/* ------------------------------ SPARKLE CANVAS ------------------------------ */
function initSparkles() {
  const c = $('#sparkles');
  if (!c || reduceMotion) return;
  const ctx = c.getContext('2d');
  let w, h, dpr, parts = [], running = true;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = c.clientWidth; h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(90, Math.floor((w * h) / 18000));
    parts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + .4, s: Math.random() * .3 + .05, p: Math.random() * Math.PI * 2, t: Math.random() * .02 + .008, hue: Math.random() < .2 ? 0 : 45 }));
  };
  const draw = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.p += p.t; p.y -= p.s; if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      const a = (Math.sin(p.p) + 1) / 2;
      ctx.globalAlpha = a * .85;
      ctx.fillStyle = p.hue ? '#f1d77a' : '#ff6b6b';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      if (p.r > 1.5 && a > .8) {
        ctx.strokeStyle = '#fff3b0'; ctx.lineWidth = .6; ctx.globalAlpha = a * .6;
        ctx.beginPath(); ctx.moveTo(p.x - 6, p.y); ctx.lineTo(p.x + 6, p.y); ctx.moveTo(p.x, p.y - 6); ctx.lineTo(p.x, p.y + 6); ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  };
  resize(); window.addEventListener('resize', resize);
  new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) draw(); }).observe($('#hero'));
  draw();
}

/* ------------------------------ NAV / MODE ------------------------------ */
function initNav() {
  const nav = $('#nav'); const prog = $('#progress');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
  };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  const mm = $('#mobile-menu'); const mb = $('#menu-btn');
  const setMenu = open => { mm.classList.toggle('open', open); mb.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : ''; };
  mb.addEventListener('click', () => setMenu(true));
  $('#menu-close').addEventListener('click', () => setMenu(false));
  $$('.mnav').forEach(a => a.addEventListener('click', () => setMenu(false)));

  const links = $$('.nav-link');
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id)); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => io.observe(s));

  $$('.mode-switch button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode, true)));
  $$('[data-set-mode]').forEach(a => a.addEventListener('click', () => setMode(a.dataset.setMode, true)));
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
}

function setMode(mode, announce) {
  state.mode = mode;
  $$('.mode-switch button').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
  $$('.tier-tag').forEach(t => {
    const on = t.dataset.tier === mode;
    t.classList.toggle('on', on);
    t.classList.toggle('w', on && mode === 'wholesale');
  });
  if (announce) toast(mode === 'wholesale' ? 'Wholesale view — volume tiers highlighted' : 'Retail view — signature tiers highlighted');
}

/* ------------------------------ HUB ------------------------------ */
function initHub() {
  const go = mode => { setMode(mode, true); scrollToId('collections'); };
  [['#hub-retail', 'retail'], ['#hub-wholesale', 'wholesale']].forEach(([sel, mode]) => {
    const el = $(sel);
    el.addEventListener('click', () => go(mode));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(mode); } });
  });
}

/* ------------------------------ COLLECTIONS ------------------------------ */
function renderCategories() {
  $('#cat-grid').innerHTML = CATEGORIES.map((c, i) => `
    <article class="glass cat-card p-4 flex flex-col" data-tilt>
      <span class="cat-num">0${i + 1}</span>
      <div class="card-img tilt-pop-sm" style="aspect-ratio:4/3"><div class="fallback">${GEM_FALLBACK}</div><img src="${c.img}" alt="${c.name} collection" loading="lazy" onerror="this.style.display='none'" /></div>
      <div class="pt-5 px-1 flex-1 flex flex-col">
        <h3 class="font-display text-3xl mb-1">${c.name}</h3>
        <p class="text-sm text-[#a9a18b] mb-5 flex-1">${c.blurb}</p>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm flex-1" data-explore-cat="${c.name}">Explore</button>
          <button class="btn btn-gold btn-sm flex-1" data-enquire="${c.name} collection">Enquire</button>
        </div>
      </div>
    </article>`).join('');

  $('#mat-grid').innerHTML = MATERIALS.map(m => `
    <article class="glass p-6 text-center flex flex-col items-center" data-tilt>
      <div class="mat-swatch tilt-pop mb-4" style="background:${m.grad}"></div>
      <h3 class="font-display text-2xl mb-1">${m.name}</h3>
      <p class="text-[.68rem] tracking-[.2em] uppercase text-[#8f8878] mb-5">${m.note}</p>
      <div class="flex gap-2 w-full mt-auto">
        <button class="btn btn-ghost btn-sm flex-1" style="padding-inline:.5rem" data-explore-mat="${m.name}">Explore</button>
        <button class="btn btn-gold btn-sm flex-1" style="padding-inline:.5rem" data-enquire="${m.name} jewelry">Enquire</button>
      </div>
    </article>`).join('');
}

/* ------------------------------ PRODUCTS ------------------------------ */
function renderProducts(animate = true) {
  const list = PRODUCTS.filter(p => (!state.cat || p.cat === state.cat) && (!state.mat || p.mat.includes(state.mat)));
  const grid = $('#product-grid');
  grid.innerHTML = list.length ? list.map(p => `
    <article class="glass p-4 flex flex-col" data-tilt data-pid="${p.id}">
      <div class="card-img tilt-pop-sm"><div class="fallback">${GEM_FALLBACK}</div><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'" /><span class="badge">${p.badge}</span></div>
      <div class="pt-5 px-1 flex-1 flex flex-col">
        <p class="text-[.6rem] tracking-[.26em] uppercase text-[#8f8878] mb-2">${p.cat} · ${p.mat.join(' · ')}</p>
        <h3 class="font-display text-2xl leading-tight mb-2">${p.name}</h3>
        <p class="text-sm text-[#a9a18b] leading-relaxed mb-4">${p.desc}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="tier-tag ${state.mode === 'retail' ? 'on' : ''}" data-tier="retail">Retail · ${p.rt}</span>
          <span class="tier-tag ${state.mode === 'wholesale' ? 'on w' : ''}" data-tier="wholesale">Wholesale · ${p.wt}</span>
        </div>
        <div class="acc-panel" id="spec-${p.id}"><div style="padding:0 0 1rem;max-width:none"><ul class="text-xs text-[#a9a18b] space-y-1.5 border-t border-white/10 pt-3">${p.specs.map(s => `<li>&#9670; ${s}</li>`).join('')}</ul><p class="text-[.7rem] text-[#6f6757] mt-3">Price on request — quoted in your currency.</p></div></div>
        <div class="flex gap-2 mt-auto">
          <button class="btn btn-ghost btn-sm flex-1" data-explore="${p.id}" aria-expanded="false" aria-controls="spec-${p.id}">Explore</button>
          <button class="btn btn-gold btn-sm flex-1" data-enquire="${p.name}">Enquire Now</button>
        </div>
      </div>
    </article>`).join('') : '<p class="empty-state">No pieces match this combination yet — clear a filter or enquire for a bespoke commission.</p>';

  const parts = [];
  if (state.cat) parts.push(state.cat); if (state.mat) parts.push(state.mat);
  $('#filter-summary').textContent = parts.length ? `Showing ${list.length} · ${parts.join(' + ')}` : 'Showing all pieces';
  $('#filter-clear').classList.toggle('hidden', !parts.length);
  if (animate) animateIn($$('#product-grid > article'));
}

function toggleSpecs(id, btn) {
  const panel = $('#spec-' + id);
  const open = panel.style.maxHeight && panel.style.maxHeight !== '0px';
  panel.style.maxHeight = open ? '0px' : panel.scrollHeight + 'px';
  btn.textContent = open ? 'Explore' : 'Close';
  btn.setAttribute('aria-expanded', String(!open));
}

/* ------------------------------ LOOSE DIAMONDS ------------------------------ */
function renderOrigins() {
  $('#origin-cards').innerHTML = ORIGINS.map(o => `
    <article class="glass p-6 md:p-8 flex flex-col sm:flex-row gap-6 transition-opacity duration-500" data-origin-card="${o.key}" data-tilt>
      <div class="card-img tilt-pop-sm sm:w-2/5 shrink-0" style="aspect-ratio:4/5"><div class="fallback">${GEM_FALLBACK}</div><img src="${o.img}" alt="${o.title} diamond" loading="lazy" onerror="this.style.display='none'" /></div>
      <div class="flex flex-col">
        <h4 class="font-display text-3xl mb-3">${o.title}</h4>
        <p class="text-sm text-[#a9a18b] leading-relaxed mb-4">${o.body}</p>
        <ul class="text-xs text-[#b9b19b] space-y-2 mb-6">${o.points.map(p => `<li>&#9670; ${p}</li>`).join('')}</ul>
        <div class="mt-auto flex gap-2"><button class="btn btn-ghost btn-sm" data-pick-origin="${o.key}">View stones</button><button class="btn btn-gold btn-sm" data-enquire="${o.title} loose diamonds">Enquire</button></div>
      </div>
    </article>`).join('');
}
function syncOrigin() {
  $$('#origin-toggle button').forEach(b => b.classList.toggle('on', b.dataset.origin === state.origin));
  $$('[data-origin-card]').forEach(c => { c.style.opacity = state.origin === 'all' || c.dataset.originCard === state.origin ? 1 : .35; });
  renderStones();
}

function renderTypes() {
  $('#type-grid').innerHTML = DIAMOND_TYPES.map(t => `
    <article class="glass type-card flex flex-col">
      <p class="text-[.62rem] tracking-[.28em] uppercase text-gold mb-2">Classification</p>
      <h4 class="font-display text-3xl mb-1">${t.type}</h4>
      <p class="text-xs text-[#8f8878] mb-4">${t.freq}</p>
      <p class="text-sm text-[#a9a18b] leading-relaxed mb-5 flex-1">${t.body}</p>
      <p class="text-[.6rem] tracking-[.22em] uppercase text-[#8f8878] mb-2">Rarity</p>
      <div class="rarity"><i style="width:${t.rarity}%"></i></div>
    </article>`).join('');
}

function renderShapes() {
  $('#shape-grid').innerHTML = Object.keys(SHAPES).map(n => `<button class="shape-btn ${state.shape === n ? 'active' : ''}" data-shape="${n}" aria-pressed="${state.shape === n}">${shapeIcon(n)}<span>${n}</span></button>`).join('');
  const n = state.shape || 'Round'; const s = SHAPES[n];
  $('#shape-detail').innerHTML = `
    <div>
      <div class="flex items-center justify-between mb-4"><span class="eyebrow">${state.shape ? 'Selected shape' : 'Select a shape'}</span><span class="text-xs text-[#8f8878]">${s.ratio}</span></div>
      <div class="flex justify-center my-4">${shapeSVG(n, 150)}</div>
      <h4 class="font-display text-4xl mb-3 text-center">${n}</h4>
      <p class="text-sm text-[#a9a18b] leading-relaxed mb-3">${s.note}</p>
      <p class="text-xs text-gold">&#9670; ${s.tip}</p>
    </div>
    <div class="mt-6 flex gap-2 flex-wrap"><button class="btn btn-ghost btn-sm" data-filter-shape="${n}">${state.shape ? 'Clear shape filter' : 'View ' + n + ' stones'}</button><button class="btn btn-gold btn-sm" data-enquire="${n} cut loose diamond">Enquire</button></div>`;
}

function renderStoneFilters() {
  $('#color-tabs').innerHTML = COLOR_TABS.map(t => `<button class="chip ${state.colorTab === t.key ? 'active' : ''}" data-color-tab="${t.key}">${t.label}</button>`).join('');
  $('#clarity-tabs').innerHTML = CLARITY_TABS.map(t => `<button class="chip ${state.clarityTab === t.key ? 'active' : ''}" data-clarity-tab="${t.key}">${t.label}</button>`).join('');
}
function renderStones() {
  const ct = COLOR_TABS.find(t => t.key === state.colorTab).test;
  const cl = CLARITY_TABS.find(t => t.key === state.clarityTab).test;
  const list = STONES.filter(s => (state.origin === 'all' || s.origin === state.origin) && (!state.shape || s.shape === state.shape) && ct(s.color) && cl(s.clarity));
  $('#stone-count').textContent = `${list.length} of ${STONES.length} sample stones`;
  $('#active-shape-note').textContent = state.shape ? `Filtering by shape: ${state.shape} · origin: ${state.origin === 'all' ? 'all' : state.origin === 'lab' ? 'lab-grown' : 'natural'}. Sample inventory shown; live availability is confirmed on enquiry.` : 'Sample inventory shown; live availability is confirmed on enquiry. Select a shape above to narrow further.';
  $('#stone-grid').innerHTML = list.length ? list.map(s => `
    <article class="glass stone-card flex items-center gap-5" data-tilt>
      <div class="tilt-pop-sm shrink-0">${shapeSVG(s.shape, 84)}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2 mb-1"><h4 class="font-display text-2xl">${s.ct.toFixed(2)} ct ${s.shape}</h4></div>
        <p class="text-xs text-[#a9a18b] mb-1">Colour <strong class="text-[#f5efe0]">${s.color}</strong> · Clarity <strong class="text-[#f5efe0]">${s.clarity}</strong></p>
        <p class="text-[.62rem] tracking-[.18em] uppercase mb-3"><span class="${s.origin === 'lab' ? 'text-[#7fd3ff]' : 'text-gold'}">${s.origin === 'lab' ? 'Lab-grown' : 'Natural'}</span> <span class="text-[#8f8878]">· ${s.cert} report</span></p>
        <div class="flex gap-2"><button class="btn btn-ghost btn-sm" style="padding-inline:.9rem" data-enquire="${s.ct.toFixed(2)} ct ${s.shape} ${s.color}/${s.clarity} ${s.origin === 'lab' ? 'lab-grown' : 'natural'} (${s.cert})">Enquire</button></div>
      </div>
    </article>`).join('') : '<p class="empty-state">No sample stones match these filters. Enquire — we source to specification.</p>';
  animateIn($$('#stone-grid > article'), { stagger: .04 });
}

/* ------------------------------ ANATOMY ------------------------------ */
function initAnatomy() {
  const panel = $('#anatomy-panel');
  const keys = Object.keys(ANATOMY);
  let current = null;
  const show = (key, user) => {
    if (key === current && !user) return;
    current = key; const a = ANATOMY[key];
    $$('#anatomy-svg .part').forEach(p => p.classList.toggle('active', p.dataset.part === key));
    $$('#anatomy-svg .lbl').forEach(p => p.classList.toggle('active', p.dataset.part === key));
    const pulse = $('#anatomy-pulse'); pulse.setAttribute('cx', a.pos[0]); pulse.setAttribute('cy', a.pos[1]);
    panel.innerHTML = `
      <div class="flex flex-wrap gap-2 mb-6">${keys.map(k => `<button class="chip ${k === key ? 'active' : ''}" data-anat="${k}">${ANATOMY[k].title}</button>`).join('')}</div>
      <div class="anat-content">
        <p class="eyebrow mb-3">Anatomy · ${keys.indexOf(key) + 1} of ${keys.length}</p>
        <h3 class="font-display text-5xl mb-3 gold-text">${a.title}</h3>
        <p class="text-xs tracking-[.14em] uppercase text-gold mb-5">${a.spec}</p>
        <p class="text-[#b9b19b] leading-relaxed mb-5">${a.body}</p>
        <div class="border-l-2 border-crimson pl-4 mb-6"><p class="text-[.62rem] tracking-[.24em] uppercase text-[#8f8878] mb-1">Why it matters</p><p class="text-sm text-[#a9a18b] leading-relaxed">${a.why}</p></div>
      </div>
      <p class="mt-auto text-xs text-[#6f6757] leading-relaxed border-t border-white/10 pt-4">${ANATOMY_FOOT}</p>`;
    if (hasGSAP && !reduceMotion) gsap.from('.anat-content > *', { y: 14, opacity: 0, duration: .5, stagger: .06, ease: 'power2.out' });
  };
  $('#anatomy-svg').addEventListener('click', e => { const t = e.target.closest('[data-part]'); if (t) show(t.dataset.part, true); });
  if (fineHover) $('#anatomy-svg').addEventListener('mouseover', e => { const t = e.target.closest('[data-part]'); if (t) show(t.dataset.part); });
  panel.addEventListener('click', e => { const b = e.target.closest('[data-anat]'); if (b) show(b.dataset.anat, true); });
  show('table', true);
}

/* ------------------------------ 4Cs ------------------------------ */
const tip = t => `<i class="tooltip-i" tabindex="0" aria-label="${t}">i<span class="tip">${t}</span></i>`;

function cutSVG(kind) {
  const cfg = {
    shallow: { cy: 120, ray: '82,8 138,96 150,150', ok: false, label: 'Too shallow' },
    ideal: { cy: 150, ray: '82,8 142,104 58,106 114,8', ok: true, label: 'Ideal' },
    deep: { cy: 185, ray: '82,8 150,100 52,134 10,170', ok: false, label: 'Too deep' }
  }[kind];
  const col = cfg.ok ? '#6ee7a8' : '#ff6b6b';
  return `<div class="text-center"><svg viewBox="0 0 200 200" class="w-full max-w-[200px] mx-auto" role="img" aria-label="${cfg.label} cut: light ${cfg.ok ? 'returns through the top' : 'escapes'}">
    <polygon points="62,35 138,35 180,70 100,${cfg.cy} 20,70" fill="rgba(212,175,55,.14)" stroke="#d4af37" stroke-width="2" stroke-linejoin="round"/>
    <line x1="20" y1="70" x2="180" y2="70" stroke="#d4af37" stroke-width="2"/>
    <polyline points="${cfg.ray}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" ${cfg.ok ? '' : 'stroke-dasharray="1 0"'}/>
    <circle cx="82" cy="8" r="3.5" fill="${col}"/>
  </svg><p class="text-xs tracking-[.2em] uppercase mt-2 ${cfg.ok ? 'text-[#6ee7a8]' : 'text-[#ff8a8a]'}">${cfg.label}</p></div>`;
}

function renderC(which) {
  const body = $('#c-body');
  if (which === 'cut') {
    body.innerHTML = `
      <div class="grid lg:grid-cols-2 gap-10">
        <div>
          <h4 class="font-display text-4xl mb-3">Cut ${tip('Cut is the quality of a diamond’s proportions, symmetry and polish — not its shape. GIA grades overall cut only for standard round brilliants.')}</h4>
          <p class="text-[#a9a18b] leading-relaxed mb-6">Cut determines how well a diamond handles light. It is the factor most within a cutter’s control and the one that most affects sparkle.</p>
          <div class="grid grid-cols-3 gap-3">${cutSVG('shallow')}${cutSVG('ideal')}${cutSVG('deep')}</div>
        </div>
        <div>
          <p class="field-label">GIA cut grade (round brilliant)</p>
          <div class="flex flex-wrap gap-2 mb-5" id="cut-btns">${CUT_GRADES.map((c, i) => `<button class="grade-btn ${i === 0 ? 'active' : ''}" data-cut="${i}">${c.g}</button>`).join('')}</div>
          <div class="glass p-6"><h5 class="font-display text-3xl gold-text mb-2" id="cut-title">${CUT_GRADES[0].g}</h5><p class="text-sm text-[#b9b19b] leading-relaxed" id="cut-desc">${CUT_GRADES[0].d}</p></div>
        </div>
      </div>`;
    $('#cut-btns').addEventListener('click', e => {
      const b = e.target.closest('[data-cut]'); if (!b) return;
      $$('#cut-btns .grade-btn').forEach(x => x.classList.toggle('active', x === b));
      const c = CUT_GRADES[+b.dataset.cut]; $('#cut-title').textContent = c.g; $('#cut-desc').textContent = c.d;
    });
  }
  if (which === 'color') {
    body.innerHTML = `
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h4 class="font-display text-4xl mb-3">Colour ${tip('Colour grading measures the absence of colour in white diamonds, from D (colourless) to Z (light). Fancy-colour diamonds are graded separately.')}</h4>
          <p class="text-[#a9a18b] leading-relaxed mb-6">The GIA scale runs from D to Z. Differences between adjacent grades are subtle; most buyers find the best value in the near-colourless range.</p>
          <div class="color-strip mb-3" aria-hidden="true"><span class="marker" id="color-marker" style="left:0%"></span></div>
          <div class="flex justify-between text-[.62rem] tracking-[.2em] uppercase text-[#8f8878] mb-6"><span>D · Colourless</span><span>Z · Light</span></div>
          <div class="flex flex-wrap gap-2" id="color-btns">${COLOR_GRADES.map((g, i) => `<button class="grade-btn ${i === 0 ? 'active' : ''}" data-color="${i}">${g}</button>`).join('')}</div>
        </div>
        <div class="glass p-8 text-center">
          <svg id="color-gem" viewBox="0 0 100 100" class="w-40 h-40 mx-auto mb-4"><polygon points="28,14 72,14 94,40 50,92 6,40" fill="#fff" stroke="#fff" stroke-opacity=".8" stroke-width="2" stroke-linejoin="round"/><polyline points="6,40 94,40 M28,14 40,40 50,92 60,40 72,14" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.2"/></svg>
          <p class="text-[.62rem] tracking-[.28em] uppercase text-gold mb-1" id="color-group"></p>
          <h5 class="font-display text-5xl gold-text mb-2" id="color-letter">D</h5>
          <p class="text-sm text-[#b9b19b] leading-relaxed" id="color-desc"></p>
          <p class="text-[.65rem] text-[#6f6757] mt-4">Tint shown is exaggerated for illustration.</p>
        </div>
      </div>`;
    const setColor = i => {
      const [grp, d] = colorInfo(i); const t = i / 22;
      const mix = (a, b) => Math.round(a + (b - a) * t);
      $('#color-gem polygon').setAttribute('fill', `rgb(${mix(255, 240)},${mix(255, 194)},${mix(255, 74)})`);
      $('#color-marker').style.left = `calc(${(i / 22) * 100}% - 2px)`;
      $('#color-group').textContent = grp; $('#color-letter').textContent = COLOR_GRADES[i]; $('#color-desc').textContent = d;
      $$('#color-btns .grade-btn').forEach((b, k) => b.classList.toggle('active', k === i));
    };
    $('#color-btns').addEventListener('click', e => { const b = e.target.closest('[data-color]'); if (b) setColor(+b.dataset.color); });
    setColor(0);
  }
  if (which === 'clarity') {
    body.innerHTML = `
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h4 class="font-display text-4xl mb-3">Clarity ${tip('Clarity describes internal inclusions and surface blemishes, graded under 10× magnification. Most diamonds contain some; what matters is whether they’re visible to the eye.')}</h4>
          <p class="text-[#a9a18b] leading-relaxed mb-6">Eleven grades from Flawless to Included. Many stones graded VS2–SI1 are “eye-clean” — no inclusions visible without magnification — and offer strong value.</p>
          <div class="flex flex-wrap gap-2" id="clarity-btns">${CLARITY_GRADES.map((c, i) => `<button class="grade-btn ${i === 0 ? 'active' : ''}" data-clarity="${i}">${c.g}</button>`).join('')}</div>
        </div>
        <div class="glass p-8 text-center">
          <svg id="clarity-gem" viewBox="0 0 200 200" class="w-56 h-56 mx-auto mb-4" role="img" aria-label="Top view of a diamond with inclusions"></svg>
          <h5 class="font-display text-5xl gold-text mb-2" id="clarity-letter">FL</h5>
          <p class="text-sm text-[#b9b19b] leading-relaxed" id="clarity-desc"></p>
          <p class="text-[.65rem] text-[#6f6757] mt-4">Inclusion size and number exaggerated for illustration.</p>
        </div>
      </div>`;
    const spots = [[88, 70, 3], [116, 96, 2.5], [76, 112, 3.5], [124, 128, 2.5], [100, 56, 2], [92, 140, 3], [132, 80, 2], [70, 90, 2.5], [108, 118, 3.5], [84, 132, 2], [120, 62, 3], [100, 100, 4]];
    const setClarity = i => {
      const c = CLARITY_GRADES[i];
      const scale = i >= 8 ? 1.7 : i >= 6 ? 1.2 : 0.8;
      let dots = '';
      for (let k = 0; k < c.n; k++) { const [x, y, r] = spots[k]; dots += `<circle cx="${x}" cy="${y}" r="${(r * scale).toFixed(1)}" fill="#4a3a2a" fill-opacity=".75"/>`; }
      $('#clarity-gem').innerHTML = `<defs><radialGradient id="cg" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b6c9e6"/></radialGradient></defs>
        <polygon points="100,14 156,34 186,100 156,166 100,186 44,166 14,100 44,34" fill="url(#cg)" fill-opacity=".9" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
        <g fill="none" stroke="rgba(60,80,120,.35)" stroke-width="1"><polygon points="100,52 134,66 148,100 134,134 100,148 66,134 52,100 66,66"/><polyline points="100,14 100,52 M156,34 134,66 M186,100 148,100 M156,166 134,134 M100,186 100,148 M44,166 66,134 M14,100 52,100 M44,34 66,66"/></g>${dots}`;
      $('#clarity-letter').textContent = c.g; $('#clarity-desc').textContent = c.d;
      $$('#clarity-btns .grade-btn').forEach((b, k) => b.classList.toggle('active', k === i));
    };
    $('#clarity-btns').addEventListener('click', e => { const b = e.target.closest('[data-clarity]'); if (b) setClarity(+b.dataset.clarity); });
    setClarity(0);
  }
  if (which === 'carat') {
    body.innerHTML = `
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h4 class="font-display text-4xl mb-3">Carat ${tip('One carat equals 200 milligrams and is divided into 100 points. Carat measures weight, not size — shape and cut change how large a stone looks.')}</h4>
          <p class="text-[#a9a18b] leading-relaxed mb-8">Carat is weight. Price per carat usually rises in steps at popular weights such as 0.50, 1.00 and 2.00 ct, so a stone just under a threshold can offer better value with little visible difference.</p>
          <label class="field-label" for="carat-range">Drag to compare weight <strong id="carat-out" class="text-gold ml-2 text-base font-display">1.00 ct</strong></label>
          <input id="carat-range" type="range" min="0.25" max="5" step="0.05" value="1" />
          <div class="flex justify-between text-[.62rem] text-[#8f8878] mt-2"><span>0.25 ct</span><span>5.00 ct</span></div>
          <dl class="grid grid-cols-3 gap-4 mt-8 text-center"><div class="glass p-4"><dt class="text-[.58rem] tracking-[.2em] uppercase text-[#8f8878]">Weight</dt><dd class="font-display text-2xl gold-text" id="carat-mg">200 mg</dd></div><div class="glass p-4"><dt class="text-[.58rem] tracking-[.2em] uppercase text-[#8f8878]">Points</dt><dd class="font-display text-2xl gold-text" id="carat-pts">100</dd></div><div class="glass p-4"><dt class="text-[.58rem] tracking-[.2em] uppercase text-[#8f8878]">Round Ø approx.</dt><dd class="font-display text-2xl gold-text" id="carat-mm">6.5 mm</dd></div></dl>
        </div>
        <div class="glass p-8 flex flex-col items-center justify-center min-h-[340px]">
          <svg viewBox="0 0 300 300" class="w-full max-w-[300px]" role="img" aria-label="Approximate face-up size of a round diamond at the selected weight">
            <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(255,255,255,.1)" stroke-dasharray="3 6"/>
            <circle id="carat-ref" cx="150" cy="150" r="45.5" fill="none" stroke="rgba(212,175,55,.45)" stroke-dasharray="4 4"/>
            <circle id="carat-circle" cx="150" cy="150" r="45.5" fill="rgba(207,227,255,.35)" stroke="#fff" stroke-width="2"/>
            <circle id="carat-inner" cx="150" cy="150" r="25" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2"/>
            <text x="150" y="286" text-anchor="middle" fill="#8f8878" font-size="10" letter-spacing="2">DASHED RING = 1.00 CT REFERENCE</text>
          </svg>
          <p class="text-xs text-[#6f6757] text-center mt-3">Based on a well-cut round brilliant; other shapes face-up differently at the same weight.</p>
        </div>
      </div>`;
    const range = $('#carat-range');
    const upd = () => {
      const ct = +range.value; const mm = 6.5 * Math.cbrt(ct); const r = mm * 7;
      $('#carat-out').textContent = ct.toFixed(2) + ' ct'; $('#carat-mg').textContent = Math.round(ct * 200) + ' mg';
      $('#carat-pts').textContent = Math.round(ct * 100); $('#carat-mm').textContent = mm.toFixed(1) + ' mm';
      $('#carat-circle').setAttribute('r', r.toFixed(1)); $('#carat-inner').setAttribute('r', (r * .55).toFixed(1));
    };
    range.addEventListener('input', upd); upd();
  }
  if (hasGSAP && !reduceMotion) gsap.from('#c-body > *', { y: 20, opacity: 0, duration: .6, ease: 'power2.out', clearProps: 'transform,opacity' });
}
function initFourCs() {
  $('#c-tabs').addEventListener('click', e => {
    const b = e.target.closest('[data-c]'); if (!b) return;
    $$('#c-tabs .c-tab').forEach(t => { t.classList.toggle('active', t === b); t.setAttribute('aria-selected', String(t === b)); });
    renderC(b.dataset.c);
  });
  renderC('cut');
}

/* ------------------------------ FAQ / OFFICES / TERMS ------------------------------ */
function initFAQ() {
  $('#faq').innerHTML = FAQS.map((f, i) => `
    <div class="acc-item ${i === 0 ? 'open' : ''}">
      <button class="acc-btn" aria-expanded="${i === 0}" aria-controls="faq-${i}"><span>${f.q}</span><span class="acc-icon" aria-hidden="true"></span></button>
      <div class="acc-panel" id="faq-${i}" role="region"><div>${f.a}</div></div>
    </div>`).join('');
  const items = $$('#faq .acc-item');
  const setOpen = (item, open) => {
    item.classList.toggle('open', open);
    $('.acc-btn', item).setAttribute('aria-expanded', String(open));
    const p = $('.acc-panel', item); p.style.maxHeight = open ? p.scrollHeight + 'px' : '0px';
  };
  items.forEach((it, i) => { if (i === 0) setOpen(it, true); });
  $('#faq').addEventListener('click', e => {
    const b = e.target.closest('.acc-btn'); if (!b) return;
    const item = b.parentElement; const willOpen = !item.classList.contains('open');
    items.forEach(x => setOpen(x, false)); setOpen(item, willOpen);
  });
  window.addEventListener('resize', () => items.forEach(it => { if (it.classList.contains('open')) { const p = $('.acc-panel', it); p.style.maxHeight = p.scrollHeight + 'px'; } }));
}
function renderOfficesTerms() {
  $('#offices').innerHTML = OFFICES.map(o => `
    <article class="glass office-card"><p class="text-[.6rem] tracking-[.28em] uppercase text-gold mb-2">${o.region}</p><h4 class="font-display text-3xl mb-1">${o.city}</h4><p class="text-xs text-[#a9a18b] leading-relaxed mb-2">${o.role}</p><p class="text-[.65rem] text-[#6f6757]">Local time: ${o.tz}</p></article>`).join('');
  $('#terms-list').innerHTML = TERMS.map(t => `<div><h4>${t.h}</h4><p>${t.p}</p></div>`).join('');
}

/* ------------------------------ FORMS / MODAL ------------------------------ */
function fillDial(sel) {
  const guess = (() => { try { const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return '+91'; if (tz.startsWith('Asia/Dubai')) return '+971'; if (tz.startsWith('Europe/London')) return '+44'; if (tz.startsWith('America/')) return '+1'; } catch (e) { /* ignore */ } return '+91'; })();
  sel.innerHTML = DIAL_CODES.map(([c, n]) => `<option value="${c}" ${c === guess ? 'selected' : ''}>${c} · ${n}</option>`).join('');
}

function mailto(subject, lines) {
  const body = lines.filter(Boolean).join('\n');
  return { href: `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, body };
}
function validate(fields) {
  let ok = true;
  fields.forEach(({ el, test }) => {
    const bad = !test(el.value.trim()); el.classList.toggle('invalid', bad); if (bad) ok = false;
    el.addEventListener('input', () => el.classList.remove('invalid'), { once: true });
  });
  return ok;
}
const emailOK = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function initModal() {
  const modal = $('#modal'); const form = $('#enquiry-form'); let lastFocus = null; let kind = 'retail';
  fillDial($('#e-dial')); fillDial($('#c-dial'));

  const setKind = k => {
    kind = k;
    $$('.seg button', form).forEach(b => b.classList.toggle('on', b.dataset.kind === k));
    $('#wholesale-fields').classList.toggle('hidden', k !== 'wholesale');
  };
  const open = interest => {
    lastFocus = document.activeElement;
    $('#modal-interest').textContent = interest || 'General consultation';
    $('#modal-form-wrap').classList.remove('hidden'); $('#modal-success').classList.add('hidden');
    setKind(state.mode); modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    if (hasGSAP && !reduceMotion) { gsap.fromTo('#modal .sheet', { y: 40, opacity: 0, scale: .97 }, { y: 0, opacity: 1, scale: 1, duration: .6, ease: 'power3.out', clearProps: 'transform,opacity' }); gsap.fromTo('#modal .backdrop', { opacity: 0 }, { opacity: 1, duration: .4 }); }
    setTimeout(() => $('#e-name').focus(), 120);
  };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); };

  $$('.seg button', form).forEach(b => b.addEventListener('click', () => setKind(b.dataset.kind)));
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = $$('button, input, select, textarea, a[href]', modal).filter(x => x.offsetParent !== null);
      if (!f.length) return; const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = [{ el: $('#e-name'), test: v => v.length > 1 }, { el: $('#e-email'), test: emailOK }];
    if (kind === 'wholesale') fields.push({ el: $('#e-company'), test: v => v.length > 1 });
    if (!validate(fields)) { toast('Please complete the highlighted fields.'); return; }
    const phone = $('#e-phone').value.trim();
    const { href, body } = mailto(`${kind === 'wholesale' ? 'Wholesale quotation' : 'Retail consultation'} — ${$('#modal-interest').textContent}`, [
      `Type: ${kind === 'wholesale' ? 'Wholesale (B2B) quotation' : 'Retail (B2C) consultation'}`,
      `Interest: ${$('#modal-interest').textContent}`,
      `Name: ${$('#e-name').value.trim()}`,
      `Email: ${$('#e-email').value.trim()}`,
      phone && `Phone: ${$('#e-dial').value} ${phone}`,
      kind === 'wholesale' && `Company: ${$('#e-company').value.trim()}`,
      kind === 'wholesale' && $('#e-qty').value.trim() && `Quantity / volume: ${$('#e-qty').value.trim()}`,
      $('#e-country').value.trim() && `Country: ${$('#e-country').value.trim()}`,
      `Timeline: ${$('#e-timeline').value}`,
      '', $('#e-msg').value.trim() && `Details:\n${$('#e-msg').value.trim()}`
    ]);
    $('#summary-copy').value = `To: ${CONFIG.email}\n\n${body}`;
    $('#modal-form-wrap').classList.add('hidden'); $('#modal-success').classList.remove('hidden');
    if (hasGSAP && !reduceMotion) { const t = $('#tick'); const len = t.getTotalLength(); gsap.fromTo(t, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: .9, ease: 'power2.out' }); }
    window.location.href = href;
    form.reset(); fillDial($('#e-dial'));
  });

  $('#copy-summary').addEventListener('click', async () => {
    const ta = $('#summary-copy');
    try { await navigator.clipboard.writeText(ta.value); toast('Summary copied.'); } catch (e) { ta.select(); document.execCommand && document.execCommand('copy'); toast('Summary selected — copy it manually if needed.'); }
  });

  /* contact page form */
  $('#contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const ok = validate([{ el: $('#c-name'), test: v => v.length > 1 }, { el: $('#c-email'), test: emailOK }, { el: $('#c-msg'), test: v => v.length > 4 }]);
    if (!ok) { toast('Please complete the highlighted fields.'); return; }
    const phone = $('#c-phone').value.trim();
    const { href } = mailto(`Website enquiry — ${$('#c-type').value}`, [
      `Name: ${$('#c-name').value.trim()}`, `Email: ${$('#c-email').value.trim()}`, phone && `Phone: ${$('#c-dial').value} ${phone}`,
      `I am a: ${$('#c-type').value}`, $('#c-company').value.trim() && `Company: ${$('#c-company').value.trim()}`, '', $('#c-msg').value.trim()
    ]);
    window.location.href = href; toast('Opening your email app with your message…'); e.target.reset(); fillDial($('#c-dial'));
  });

  window.openEnquiry = open;
}

/* ------------------------------ TILT ------------------------------ */
function initTilt() {
  if (!fineHover || reduceMotion) return;
  let active = null;
  document.addEventListener('pointermove', e => {
    const el = e.target.closest && e.target.closest('[data-tilt]');
    if (active && active !== el) reset(active);
    if (!el) { active = null; return; }
    active = el;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.classList.add('is-tilting');
    el.style.transform = `perspective(900px) rotateX(${((.5 - py) * 12).toFixed(2)}deg) rotateY(${((px - .5) * 14).toFixed(2)}deg) translateY(-8px)`;
    el.style.setProperty('--mx', (px * 100) + '%'); el.style.setProperty('--my', (py * 100) + '%');
    el.style.boxShadow = '0 40px 80px -30px rgba(212,175,55,.35), 0 25px 60px -20px rgba(0,0,0,.9)';
  }, { passive: true });
  document.addEventListener('pointerleave', () => active && reset(active));
  function reset(el) { el.classList.remove('is-tilting'); el.style.transform = ''; el.style.boxShadow = ''; if (el === active) active = null; }
}

/* ------------------------------ CLICK DELEGATION ------------------------------ */
function initClicks() {
  document.addEventListener('click', e => {
    const t = e.target;
    const enq = t.closest('[data-enquire]'); if (enq) { window.openEnquiry(enq.getAttribute('data-enquire')); return; }
    const ex = t.closest('[data-explore]'); if (ex) { toggleSpecs(ex.dataset.explore, ex); return; }
    const ec = t.closest('[data-explore-cat]'); if (ec) { state.cat = ec.dataset.exploreCat; renderProducts(); scrollToId('products'); return; }
    const em = t.closest('[data-explore-mat]'); if (em) { state.mat = em.dataset.exploreMat; renderProducts(); scrollToId('products'); return; }
    if (t.closest('#filter-clear')) { state.cat = null; state.mat = null; renderProducts(); return; }
    const po = t.closest('[data-pick-origin]'); if (po) { state.origin = po.dataset.pickOrigin; syncOrigin(); $('#stone-grid').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const ob = t.closest('#origin-toggle button'); if (ob) { state.origin = ob.dataset.origin; syncOrigin(); return; }
    const sh = t.closest('[data-shape]'); if (sh) { state.shape = state.shape === sh.dataset.shape ? null : sh.dataset.shape; renderShapes(); renderStones(); return; }
    const fs = t.closest('[data-filter-shape]'); if (fs) { if (state.shape) { state.shape = null; renderShapes(); renderStones(); } else { state.shape = fs.dataset.filterShape; renderShapes(); renderStones(); } $('#color-tabs').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const ctab = t.closest('[data-color-tab]'); if (ctab) { state.colorTab = ctab.dataset.colorTab; renderStoneFilters(); renderStones(); return; }
    const cltab = t.closest('[data-clarity-tab]'); if (cltab) { state.clarityTab = cltab.dataset.clarityTab; renderStoneFilters(); renderStones(); return; }
  });
}

/* ------------------------------ SCROLL REVEALS ------------------------------ */
function initReveals() {
  if (!hasGSAP) return;
  document.documentElement.classList.remove('no-js');
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  ['#cat-grid', '#mat-grid', '#product-grid', '#stone-grid', '#origin-cards', '#type-grid', '#offices', '#terms-list'].forEach(sel => {
    const g = $(sel); if (!g) return;
    ScrollTrigger.create({ trigger: g, start: 'top 85%', once: true, onEnter: () => animateIn($$(':scope > *', g), { stagger: .08 }) });
  });
  // kinetic section titles
  gsap.utils.toArray('.section-title').forEach(t => {
    gsap.from(t, { clipPath: 'inset(0 0 100% 0)', y: 40, duration: 1.1, ease: 'power4.out', clearProps: 'clipPath,transform', scrollTrigger: { trigger: t, start: 'top 90%', once: true } });
  });
  // parallax glows and hero gem
  gsap.to('.hero-glow', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hub-panel .bg', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '#hub', start: 'top bottom', end: 'bottom top', scrub: true } });
  if (fineHover) {
    const hero = $('#hero'); const gem = $('#hero-gem');
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      gsap.to(gem, { rotateY: ((e.clientX - r.left) / r.width - .5) * 22, rotateX: -((e.clientY - r.top) / r.height - .5) * 14, duration: 1, ease: 'power2.out', overwrite: 'auto' });
    });
  }
}

/* ------------------------------ INIT ------------------------------ */
function init() {
  initLoader();
  initNav();
  initHub();
  renderCategories();
  renderProducts(false);
  renderOrigins();
  renderTypes();
  renderShapes();
  renderStoneFilters();
  renderStones();
  initAnatomy();
  initFourCs();
  initFAQ();
  renderOfficesTerms();
  initModal();
  initClicks();
  initTilt();
  initSparkles();
  initReveals();
  syncOrigin();
  if (!hasGSAP) { const l = $('#loader'); if (l) l.style.display = 'none'; }
  ScrollTriggerRefresh();
}
function ScrollTriggerRefresh() {
  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 600));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
