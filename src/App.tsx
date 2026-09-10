import { useState, useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// ─── Data ────────────────────────────────────────────────────────────────────

type Tour = {
  id: string
  category: 'safari' | 'kilimanjaro' | 'zanzibar'
  name: string
  duration: string
  price: number
  groupSize: string
  difficulty: string
  highlights: string[]
  description: string
  includes: string[]
  image: string
  badge?: string
}

const tours: Tour[] = [
  // Safaris
  {
    id: 's1',
    category: 'safari',
    name: '10 Days Northern Tanzania Circuit',
    duration: '10 days / 9 nights',
    price: 3500,
    groupSize: '2–8 people',
    difficulty: 'Easy',
    badge: 'Most Popular',
    highlights: ['Serengeti National Park', 'Ngorongoro Crater', 'Lake Manyara', 'Tarangire NP'],
    description:
      'The definitive East African safari experience. Journey through the northern circuit visiting legendary parks where the Big Five roam freely across golden savanna. Witness the Ngorongoro Crater at dawn, track lions on the Serengeti plains, and encounter elephants beneath ancient baobabs in Tarangire.',
    includes: [
      'All park fees',
      'Private 4WD Land Cruiser',
      'Expert bilingual guide',
      'Full-board accommodation',
      'Airport transfers',
      'Bottled water daily',
    ],
    image:
      'https://images.unsplash.com/photo-1602410125631-7e736e36797c?w=800&h=520&fit=crop&auto=format',
  },
  {
    id: 's2',
    category: 'safari',
    name: '5 Days Serengeti Migration Safari',
    duration: '5 days / 4 nights',
    price: 2200,
    groupSize: '2–6 people',
    difficulty: 'Easy',
    badge: 'Seasonal',
    highlights: ['Great Wildebeest Migration', 'River crossings', 'Ngorongoro Crater', 'Big Five'],
    description:
      "Time your safari with one of nature's greatest spectacles — over 1.5 million wildebeest and 200,000 zebra in perpetual motion. Best experienced December–January (calving season) and July–September (dramatic Mara River crossings). A life-altering five days in the wild.",
    includes: [
      'All park fees & conservation fees',
      'Private 4WD Land Cruiser',
      'Expert guide',
      'Tented camp accommodation',
      'All meals',
      'Airport transfers',
    ],
    image:
      'https://images.unsplash.com/photo-1532574754390-44dc5c6780bb?w=800&h=520&fit=crop&auto=format',
  },
  {
    id: 's3',
    category: 'safari',
    name: '6 Days Luxury Tented Camp Safari',
    duration: '6 days / 5 nights',
    price: 4800,
    groupSize: '2–4 people',
    difficulty: 'Easy',
    badge: 'Luxury',
    highlights: ['Luxury tented camps', 'Sundowner cocktails', 'Serengeti & Ngorongoro', 'Bush dinners'],
    description:
      'Sleep under canvas without sacrificing comfort. Private luxury tented camps with ensuite bathrooms, four-poster beds, and candlelit bush dinners. Morning game drives, afternoon sundowners, and evenings filled with the sounds of the African night. This is the Hemingway fantasy, fully realised.',
    includes: [
      'Luxury tented camp stays',
      'All park & conservation fees',
      'Private guide & vehicle',
      'All meals & selected drinks',
      'Bush dinner experience',
      'Laundry service',
    ],
    image:
      'https://images.unsplash.com/photo-1613864309738-9102a9e22883?w=800&h=520&fit=crop&auto=format',
  },
  {
    id: 's4',
    category: 'safari',
    name: '11 Days Kenya–Tanzania Luxury Safari',
    duration: '11 days / 10 nights',
    price: 5500,
    groupSize: '2–6 people',
    difficulty: 'Easy',
    badge: 'Cross-border',
    highlights: ['Masai Mara', 'Serengeti', 'Amboseli', 'Ngorongoro', 'Dual country experience'],
    description:
      "A sweeping cross-border odyssey combining Kenya's Masai Mara — the other half of the migration ecosystem — with Tanzania's unmatched northern circuit. Experience cultural encounters with Maasai communities, elephant-filled Amboseli with Kilimanjaro as backdrop, and the endless Serengeti plains.",
    includes: [
      'All park fees (Kenya & Tanzania)',
      'Cross-border transfers',
      'Private vehicles throughout',
      'Expert guides in each country',
      'Luxury lodge accommodation',
      'All meals',
    ],
    image:
      'https://images.unsplash.com/photo-1703934169695-9c91c8bc69c3?w=800&h=520&fit=crop&auto=format',
  },
  {
    id: 's5',
    category: 'safari',
    name: '13 Days Tanzania & Zanzibar',
    duration: '13 days / 12 nights',
    price: 4200,
    groupSize: '2–8 people',
    difficulty: 'Easy',
    highlights: ['Full northern circuit safari', 'Stone Town', 'Zanzibar beaches', 'Spice tour'],
    description:
      "The complete Tanzania experience — begin in the bush tracking wildlife across the northern circuit, then unwind on Zanzibar's powdery white beaches. Explore the UNESCO World Heritage labyrinth of Stone Town, take a sunset dhow cruise, and let the turquoise Indian Ocean wash away the dust of the savanna.",
    includes: [
      'All park & conservation fees',
      'Return flight Arusha–Zanzibar',
      'Private guide & vehicle',
      'Safari lodge & beach hotel',
      'Spice tour & Stone Town walk',
      'All meals on safari',
    ],
    image:
      'https://images.unsplash.com/photo-1737319377856-c147ac09d9ec?w=800&h=520&fit=crop&auto=format',
  },
  {
    id: 's6',
    category: 'safari',
    name: '12 Days Bird Watching Safari',
    duration: '12 days / 11 nights',
    price: 3800,
    groupSize: '2–6 people',
    difficulty: 'Easy',
    highlights: ['1,000+ bird species', 'Lake Natron flamingos', 'Tarangire birds', 'Expert ornithologist'],
    description:
      'Tanzania is home to over 1,100 bird species. This specialist itinerary is designed for serious birders, visiting key habitats from acacia woodland to Rift Valley soda lakes. Witness clouds of flamingos at Lake Natron, lilac-breasted rollers on the Serengeti, and spectacular raptors over the Ngorongoro highlands.',
    includes: [
      'Expert ornithologist guide',
      'All park fees',
      'Private 4WD with roof hatch',
      'Full-board lodges',
      'Binoculars loan',
      'Detailed bird checklist',
    ],
    image:
      'https://images.unsplash.com/photo-1650609344968-b9b52a653ed4?w=800&h=520&fit=crop&auto=format',
  },

  // Kilimanjaro
  {
    id: 'k1',
    category: 'kilimanjaro',
    name: 'Marangu Route',
    duration: '6 days / 5 nights',
    price: 1800,
    groupSize: '1–12 people',
    difficulty: 'Moderate',
    badge: 'Most Accessible',
    highlights: ['Hut accommodation', 'Coca-Cola Route', 'Mandara & Horombo Huts', 'Summit: Uhuru Peak 5,895m'],
    description:
      "The \"Coca-Cola Route\" is Kilimanjaro's only trail with hut accommodation, making it the most comfortable option. Gradual gradients through montane forest, moorland, and alpine desert. While the most accessible, reaching Uhuru Peak — Africa's highest point — demands real preparation and determination.",
    includes: [
      'All park & rescue fees',
      'Hut accommodation',
      'Professional mountain guide',
      'Porters & cook',
      'All meals on mountain',
      'Safety equipment',
    ],
    image:
      'https://images.unsplash.com/photo-1716404211069-dc368a7247fd?w=800&h=520&fit=crop&auto=format',
  },
  {
    id: 'k2',
    category: 'kilimanjaro',
    name: 'Machame Route',
    duration: '7 days / 6 nights',
    price: 2100,
    groupSize: '1–12 people',
    difficulty: 'Challenging',
    badge: 'Best Views',
    highlights: ['Scenic "Whisky Route"', 'Lava Tower acclimatisation', 'Barranco Wall', 'Highest success rate'],
    description:
      "The \"Whisky Route\" offers superior scenery and a better acclimatisation profile than Marangu, rewarding trekkers with some of Kilimanjaro's most dramatic landscapes. The iconic Barranco Wall scramble, the lunar Western Breach, and the spectacular Southern Ice Fields make this the most photographed route on the mountain.",
    includes: [
      'All park & rescue fees',
      'Tented camp accommodation',
      'Expert mountain guide',
      'Porters & chef',
      'All meals & hot drinks',
      'Oxygen & pulse oximeter',
    ],
    image:
      'https://images.unsplash.com/photo-1716404214250-8d34f6b0bc24?w=800&h=520&fit=crop&auto=format',
  },
  {
    id: 'k3',
    category: 'kilimanjaro',
    name: 'Lemosho Route',
    duration: '8 days / 7 nights',
    price: 2400,
    groupSize: '1–10 people',
    difficulty: 'Challenging',
    badge: 'Highest Success Rate',
    highlights: ['Remote & pristine', 'Best acclimatisation', 'Western Breach', 'Shira Plateau'],
    description:
      "The gold standard Kilimanjaro route. Approaching from the west, Lemosho is the most remote, least crowded, and offers the best acclimatisation profile of any path up the mountain. Starting at the magnificent Shira Plateau, trekkers traverse the full breadth of Kilimanjaro's ecosystem before the final push to Uhuru.",
    includes: [
      'All park & rescue fees',
      'Premium tented camps',
      'Senior guide (10+ years)',
      'Dedicated porter team',
      'All gourmet mountain meals',
      'Emergency oxygen supply',
    ],
    image:
      'https://images.unsplash.com/photo-1650609344968-b9b52a653ed4?w=800&h=520&fit=crop&auto=format',
  },
  {
    id: 'k4',
    category: 'kilimanjaro',
    name: 'Rongai Route',
    duration: '7 days / 6 nights',
    price: 2000,
    groupSize: '1–10 people',
    difficulty: 'Moderate',
    highlights: ['Northern wilderness', 'Kenya border approach', 'Wildlife sightings', 'Less crowded'],
    description:
      "Approaching from the north near the Kenyan border, Rongai is Kilimanjaro's only northern route — quieter, wilder, and with a distinctly different character. The landscape feels more remote, wildlife encounters are more frequent, and the descent via the southern Marangu route offers a complete cross-mountain traverse.",
    includes: [
      'All park & rescue fees',
      'Tented camp accommodation',
      'Professional guide',
      'Porters & cook',
      'All meals on mountain',
      'Safety briefing & equipment',
    ],
    image:
      'https://images.unsplash.com/photo-1739703213318-acc03d446981?w=800&h=520&fit=crop&auto=format',
  },

  // Zanzibar
  {
    id: 'z1',
    category: 'zanzibar',
    name: '5 Days Zanzibar Explorer',
    duration: '5 days / 4 nights',
    price: 1200,
    groupSize: '2–10 people',
    difficulty: 'Easy',
    badge: 'Best Value',
    highlights: ['Stone Town UNESCO site', 'Spice farm tour', 'Snorkelling Mnemba Atoll', 'Nungwi beach'],
    description:
      'Five perfect days discovering the Spice Island. Lose yourself in the ancient Arab-influenced labyrinth of Stone Town, breathe in the intoxicating scent of cinnamon and cloves on a spice farm tour, then surrender to the dazzling white sands of the north coast.',
    includes: [
      'Airport transfers',
      'Beach hotel (4-star)',
      'Stone Town guided walk',
      'Spice farm tour',
      'Snorkelling trip',
      'Sunset dhow cruise',
    ],
    image:
      'https://images.unsplash.com/photo-1731329571540-a1d6dfc902b8?w=800&h=520&fit=crop&auto=format',
  },
  {
    id: 'z2',
    category: 'zanzibar',
    name: '7 Days Zanzibar Paradise',
    duration: '7 days / 6 nights',
    price: 1800,
    groupSize: '2–8 people',
    difficulty: 'Easy',
    highlights: ['Kendwa & Nungwi beaches', 'Dolphin tour Kizimkazi', 'Prison Island', 'Jozani Forest'],
    description:
      'A week of pure island bliss. Swim with dolphins at dawn in Kizimkazi, visit the giant tortoises of Prison Island, walk among red colobus monkeys in Jozani Forest, and spend long afternoons on turquoise water that shifts from jade to cobalt as the tide moves. Nothing compares to a full week on this island.',
    includes: [
      'All airport transfers',
      'Boutique beach hotel',
      'Dolphin snorkelling tour',
      'Prison Island trip',
      'Jozani Forest guided walk',
      'All breakfasts & 2 dinners',
    ],
    image:
      'https://images.unsplash.com/photo-1621583628955-42fbc37bf424?w=800&h=520&fit=crop&auto=format',
  },
  {
    id: 'z3',
    category: 'zanzibar',
    name: '3 Days Stone Town & Spice Discovery',
    duration: '3 days / 2 nights',
    price: 650,
    groupSize: '2–12 people',
    difficulty: 'Easy',
    highlights: ["UNESCO Stone Town", 'Spice farm', 'Local market', 'Palace Museum', 'Forodhani food stalls'],
    description:
      "A rich cultural immersion in one of East Africa's most evocative cities. Stone Town's winding lanes are a palimpsest of Swahili, Arab, Indian, and Portuguese history. By night, join locals at Forodhani's waterfront food stalls for fresh seafood grilled over charcoal as dhows drift past.",
    includes: [
      'Stone Town boutique riad',
      'Expert cultural guide',
      'Spice farm visit & lunch',
      'Palace Museum entry',
      'Forodhani evening food tour',
      'Airport transfers',
    ],
    image:
      'https://images.unsplash.com/photo-1577455486223-089171b4572f?w=800&h=520&fit=crop&auto=format',
  },
]

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = 'safari' | 'kilimanjaro' | 'zanzibar'

type Booking = {
  ref: string
  tour: Tour
  name: string
  email: string
  phone: string
  date: string
  guests: number
  total: number
  notes: string
  bookedAt: string
}

type View = 'home' | 'explore' | 'plan' | 'trips' | 'profile'

type ModalState =
  | { type: 'none' }
  | { type: 'tour'; tour: Tour }
  | { type: 'register' }
  | { type: 'booking'; tour: Tour }

// ─── Route Data ───────────────────────────────────────────────────────────────

type RouteStop = { lat: number; lng: number; label: string }

const TOUR_STOPS: Record<string, RouteStop[]> = {
  // ── Safaris ──────────────────────────────────────────────────────────────
  s1: [
    { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
    { lat: -3.8500, lng: 36.0167, label: 'Tarangire NP' },
    { lat: -3.6000, lng: 35.8333, label: 'Lake Manyara' },
    { lat: -3.2500, lng: 35.5000, label: 'Ngorongoro' },
    { lat: -2.3333, lng: 34.8333, label: 'Serengeti' },
    { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
  ],
  s2: [
    { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
    { lat: -3.2500, lng: 35.5000, label: 'Ngorongoro' },
    { lat: -2.3333, lng: 34.8333, label: 'Serengeti' },
    { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
  ],
  s3: [
    { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
    { lat: -2.3333, lng: 34.8333, label: 'Serengeti' },
    { lat: -3.2500, lng: 35.5000, label: 'Ngorongoro' },
    { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
  ],
  s4: [
    { lat: -1.2921, lng: 36.8219, label: 'Nairobi' },
    { lat: -1.5000, lng: 35.1333, label: 'Masai Mara' },
    { lat: -2.6528, lng: 37.2583, label: 'Amboseli' },
    { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
    { lat: -3.2500, lng: 35.5000, label: 'Ngorongoro' },
    { lat: -2.3333, lng: 34.8333, label: 'Serengeti' },
    { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
  ],
  s5: [
    { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
    { lat: -3.8500, lng: 36.0167, label: 'Tarangire NP' },
    { lat: -3.6000, lng: 35.8333, label: 'Lake Manyara' },
    { lat: -3.2500, lng: 35.5000, label: 'Ngorongoro' },
    { lat: -2.3333, lng: 34.8333, label: 'Serengeti' },
    { lat: -6.1659, lng: 39.1989, label: 'Zanzibar' },
  ],
  s6: [
    { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
    { lat: -2.4167, lng: 36.0000, label: 'Lake Natron' },
    { lat: -2.3333, lng: 34.8333, label: 'Serengeti' },
    { lat: -3.2500, lng: 35.5000, label: 'Ngorongoro' },
    { lat: -3.8500, lng: 36.0167, label: 'Tarangire NP' },
    { lat: -3.3869, lng: 36.6830, label: 'Arusha' },
  ],
  // ── Kilimanjaro ──────────────────────────────────────────────────────────
  k1: [
    { lat: -3.2513, lng: 37.5116, label: 'Marangu Gate (1,860m)' },
    { lat: -3.1720, lng: 37.4556, label: 'Mandara Hut (2,700m)' },
    { lat: -3.1067, lng: 37.4078, label: 'Horombo Hut (3,720m)' },
    { lat: -3.0800, lng: 37.3619, label: 'Kibo Hut (4,703m)' },
    { lat: -3.0753, lng: 37.3533, label: 'Uhuru Peak (5,895m)' },
  ],
  k2: [
    { lat: -3.2167, lng: 37.3333, label: 'Machame Gate (1,800m)' },
    { lat: -3.1667, lng: 37.3167, label: 'Machame Camp (3,000m)' },
    { lat: -3.1167, lng: 37.2833, label: 'Shira Camp (3,840m)' },
    { lat: -3.0967, lng: 37.3033, label: 'Lava Tower (4,600m)' },
    { lat: -3.1167, lng: 37.3167, label: 'Barranco Camp (3,950m)' },
    { lat: -3.0867, lng: 37.3511, label: 'Barafu Camp (4,673m)' },
    { lat: -3.0753, lng: 37.3533, label: 'Uhuru Peak (5,895m)' },
  ],
  k3: [
    { lat: -3.1100, lng: 37.0667, label: 'Londorossi Gate (2,100m)' },
    { lat: -3.1167, lng: 37.1667, label: 'Big Tree Camp (2,780m)' },
    { lat: -3.1000, lng: 37.2167, label: 'Shira 1 Camp (3,500m)' },
    { lat: -3.1167, lng: 37.2833, label: 'Shira 2 Camp (3,840m)' },
    { lat: -3.0967, lng: 37.3033, label: 'Lava Tower (4,600m)' },
    { lat: -3.1167, lng: 37.3167, label: 'Barranco (3,950m)' },
    { lat: -3.0867, lng: 37.3511, label: 'Barafu Camp (4,673m)' },
    { lat: -3.0753, lng: 37.3533, label: 'Uhuru Peak (5,895m)' },
  ],
  k4: [
    { lat: -3.0500, lng: 37.5167, label: 'Rongai Gate (1,950m)' },
    { lat: -3.0500, lng: 37.4833, label: 'Simba Camp (2,625m)' },
    { lat: -3.0667, lng: 37.4333, label: 'Second Cave (3,449m)' },
    { lat: -3.0667, lng: 37.4000, label: 'Third Cave (3,800m)' },
    { lat: -3.0667, lng: 37.3833, label: 'School Hut (4,703m)' },
    { lat: -3.0753, lng: 37.3533, label: 'Uhuru Peak (5,895m)' },
    { lat: -3.1067, lng: 37.4078, label: 'Horombo Hut (3,720m)' },
    { lat: -3.2513, lng: 37.5116, label: 'Marangu Gate (1,860m)' },
  ],
  // ── Zanzibar ─────────────────────────────────────────────────────────────
  z1: [
    { lat: -6.2167, lng: 39.2333, label: 'Airport' },
    { lat: -6.1659, lng: 39.1989, label: 'Stone Town' },
    { lat: -6.1667, lng: 39.3000, label: 'Spice Farm' },
    { lat: -5.8667, lng: 39.3667, label: 'Mnemba Atoll' },
    { lat: -5.7258, lng: 39.3036, label: 'Nungwi Beach' },
  ],
  z2: [
    { lat: -6.1659, lng: 39.1989, label: 'Stone Town' },
    { lat: -6.1389, lng: 39.1731, label: 'Prison Island' },
    { lat: -5.7258, lng: 39.3036, label: 'Nungwi' },
    { lat: -5.7333, lng: 39.2833, label: 'Kendwa' },
    { lat: -6.4500, lng: 39.4833, label: 'Kizimkazi' },
    { lat: -6.3167, lng: 39.4000, label: 'Jozani Forest' },
    { lat: -6.1659, lng: 39.1989, label: 'Stone Town' },
  ],
  z3: [
    { lat: -6.2167, lng: 39.2333, label: 'Airport' },
    { lat: -6.1659, lng: 39.1989, label: 'Stone Town' },
    { lat: -6.1667, lng: 39.3000, label: 'Spice Farm' },
    { lat: -6.1628, lng: 39.1889, label: 'Forodhani Market' },
    { lat: -6.1642, lng: 39.1917, label: 'Palace Museum' },
  ],
}

// Map type IDs per category
// Route line colors per category
const ROUTE_COLOR: Record<string, string> = {
  safari: '#c4622d',
  kilimanjaro: '#d4a017',
  zanzibar: '#1a3a2a',
}

// ─── 3D Route Map (MapLibre GL) ───────────────────────────────────────────────

// Per-category map settings
const MAP_CONFIG: Record<string, { pitch: number; bearing: number; terrainExaggeration: number }> = {
  safari:      { pitch: 52, bearing: -20, terrainExaggeration: 1.4 },
  kilimanjaro: { pitch: 68, bearing: -35, terrainExaggeration: 2.8 },
  zanzibar:    { pitch: 48, bearing: 10,  terrainExaggeration: 1.0 },
}

// Free satellite + terrain MapLibre style (no API key needed)
function buildMapStyle(exaggeration: number): maplibregl.StyleSpecification {
  return {
    version: 8 as const,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
      satellite: {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '© Esri, Maxar, Earthstar Geographics',
        maxzoom: 19,
      },
      terrain: {
        type: 'raster-dem',
        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
        tileSize: 256,
      },
      hillshade: {
        type: 'raster-dem',
        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
        tileSize: 256,
      },
    },
    layers: [
      { id: 'satellite', type: 'raster', source: 'satellite' },
      {
        id: 'hillshade',
        type: 'hillshade',
        source: 'hillshade',
        paint: {
          'hillshade-exaggeration': 0.4,
          'hillshade-shadow-color': '#2a1f0e',
          'hillshade-highlight-color': '#fffdf7',
        },
      },
    ],
    terrain: { source: 'terrain', exaggeration },
  }
}

const FLY_ZOOM: Record<string, number> = { safari: 10, kilimanjaro: 13, zanzibar: 12 }

function TourMap3D({ tour, activeDay }: { tour: Tour; activeDay: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerWrappers = useRef<HTMLElement[]>([])
  const markerPins = useRef<HTMLElement[]>([])
  const markerPopups = useRef<maplibregl.Popup[]>([])
  const stops = TOUR_STOPS[tour.id] ?? []

  // ── Activate a stop: enlarge pin, show pulse beacon, fly camera ──────────
  const activateStop = (idx: number) => {
    const map = mapRef.current
    const stop = stops[idx]
    if (!map || !stop) return

    markerWrappers.current.forEach((wrap, i) => {
      const pin = markerPins.current[i]
      const isActive = i === idx

      wrap.style.zIndex = isActive ? '20' : '1'

      // Scale the pin
      pin.style.transform = isActive ? 'scale(1.55)' : 'scale(1)'
      pin.style.boxShadow = isActive
        ? '0 0 0 3px rgba(255,255,255,0.9), 0 6px 20px rgba(0,0,0,0.6)'
        : '0 3px 10px rgba(0,0,0,0.5)'

      // Toggle pulse rings
      wrap.querySelectorAll<HTMLElement>('.beacon-ring').forEach(r => { r.style.display = isActive ? 'block' : 'none' })

      // Toggle beam
      wrap.querySelectorAll<HTMLElement>('.beacon-beam').forEach(b => { b.style.display = isActive ? 'block' : 'none' })

      // Open popup on active, close others
      if (isActive) {
        markerPopups.current[i]?.addTo(map)
      } else {
        markerPopups.current[i]?.remove()
      }
    })

    const cfg = MAP_CONFIG[tour.category]
    map.flyTo({
      center: [stop.lng, stop.lat],
      zoom: FLY_ZOOM[tour.category],
      pitch: cfg.pitch + 5,
      bearing: cfg.bearing + idx * 3,
      duration: 1600,
      essential: true,
    })
  }

  // ── Build map on mount ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !stops.length) return

    const cfg = MAP_CONFIG[tour.category]
    const avgLat = stops.reduce((s, p) => s + p.lat, 0) / stops.length
    const avgLng = stops.reduce((s, p) => s + p.lng, 0) / stops.length

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildMapStyle(cfg.terrainExaggeration),
      center: [avgLng, avgLat],
      zoom: 7,
      pitch: cfg.pitch,
      bearing: cfg.bearing,
    })
    mapRef.current = map

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }),
      'bottom-right'
    )

    map.on('load', () => {
      const coords = stops.map((s) => [s.lng, s.lat])

      map.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} },
      })
      map.addLayer({
        id: 'route-glow', type: 'line', source: 'route',
        paint: { 'line-color': '#ffffff', 'line-width': 10, 'line-opacity': 0.22, 'line-blur': 4 },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      })
      map.addLayer({
        id: 'route-line', type: 'line', source: 'route',
        paint: { 'line-color': ROUTE_COLOR[tour.category], 'line-width': 3.5, 'line-opacity': 0.95 },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      })
      map.addLayer({
        id: 'route-dash', type: 'line', source: 'route',
        paint: { 'line-color': '#ffffff', 'line-width': 1.5, 'line-opacity': 0.55, 'line-dasharray': [3, 6] },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      })

      // ── Build markers with beacon elements ──────────────────────────────
      markerWrappers.current = []
      markerPins.current = []
      markerPopups.current = []

      stops.forEach((stop, i) => {
        const isSummit = stop.label.includes('Uhuru Peak')
        const isFirst = i === 0
        const isLast = i === stops.length - 1 && stop.label !== stops[0].label
        const bg = isSummit ? '#d4a017' : isFirst ? '#1a3a2a' : isLast ? '#c4622d' : '#1a3a2a'

        // Wrapper — relative positioned so rings/beams anchor to it
        const wrap = document.createElement('div')
        wrap.style.cssText = 'position:relative;width:28px;height:28px;cursor:pointer;'

        // Pulsing ring
        const ring = document.createElement('div')
        ring.className = 'beacon-ring'
        ring.style.cssText = [
          'display:none;position:absolute;',
          'top:50%;left:50%;',
          'width:28px;height:28px;border-radius:50%;',
          `background:${bg};`,
          'transform:translate(-50%,-50%);',
          'animation:beacon-pulse 1.4s ease-out infinite;',
          'pointer-events:none;',
        ].join('')
        wrap.appendChild(ring)

        // Second ring (offset phase)
        const ring2 = document.createElement('div')
        ring2.className = 'beacon-ring'
        ring2.style.cssText = ring.style.cssText
        ring2.style.animationDelay = '0.5s'
        wrap.appendChild(ring2)

        // Vertical beam
        const beam = document.createElement('div')
        beam.className = 'beacon-beam'
        beam.style.cssText = [
          'display:none;position:absolute;',
          'left:50%;bottom:100%;',
          'width:3px;height:40px;',
          'transform:translateX(-50%);',
          `background:linear-gradient(to top, ${bg}, transparent);`,
          'animation:beacon-beam-pulse 1.4s ease-in-out infinite;',
          'pointer-events:none;border-radius:2px;',
        ].join('')
        wrap.appendChild(beam)

        // Pin
        const pin = document.createElement('div')
        pin.style.cssText = [
          'position:relative;z-index:2;',
          'width:28px;height:28px;border-radius:50%;',
          `background:${bg};`,
          'border:2.5px solid #fff;',
          'display:flex;align-items:center;justify-content:center;',
          'color:#fff;font-size:10px;font-weight:700;',
          "font-family:'Outfit',sans-serif;",
          'box-shadow:0 3px 10px rgba(0,0,0,0.5);',
          'transition:transform .2s ease, box-shadow .2s ease;',
        ].join('')
        pin.textContent = isSummit ? '★' : String(i + 1)
        wrap.appendChild(pin)

        // Click on pin: activate this day
        wrap.addEventListener('click', () => activateStop(i))

        const popup = new maplibregl.Popup({
          offset: [0, -18],
          closeButton: false,
          className: 'tour-popup',
          anchor: 'bottom',
        })
        popup.setHTML(
          `<div style="font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;color:#1a3a2a;white-space:nowrap;">` +
          `<span style="opacity:.5;margin-right:4px;">Day ${i + 1}</span>${stop.label}</div>`
        )

        new maplibregl.Marker({ element: wrap })
          .setLngLat([stop.lng, stop.lat])
          .addTo(map)

        markerWrappers.current.push(wrap)
        markerPins.current.push(pin)
        markerPopups.current.push(popup)
      })

      // Initial fit, then activate first day
      const lngs = stops.map((s) => s.lng)
      const lats = stops.map((s) => s.lat)
      map.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        { padding: { top: 60, bottom: 80, left: 60, right: 60 }, duration: 1800, pitch: cfg.pitch }
      )
      map.once('moveend', () => activateStop(0))
    })

    return () => {
      map.remove()
      mapRef.current = null
      markerWrappers.current = []
      markerPins.current = []
      markerPopups.current = []
    }
  }, [tour.id])

  // ── React to day changes from the itinerary ───────────────────────────────
  useEffect(() => {
    if (mapRef.current?.loaded()) {
      activateStop(activeDay)
    }
  }, [activeDay])

  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
      {/* Map canvas */}
      <div ref={containerRef} style={{ height: 360, width: '100%', backgroundColor: '#1a2a1e' }} />

      {/* Stop legend */}
      <div
        className="px-4 py-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs"
        style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
      >
        {stops.map((s, i) => {
          const isSummit = s.label.includes('Uhuru Peak')
          const isLast = i === stops.length - 1 && s.label !== stops[0].label
          const bg = isSummit ? '#d4a017' : i === 0 ? '#1a3a2a' : isLast ? '#c4622d' : '#1a3a2a'
          return (
            <span key={i} className="flex items-center gap-1.5">
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white font-bold flex-shrink-0"
                style={{ fontSize: 8, backgroundColor: bg }}
              >
                {isSummit ? '★' : i + 1}
              </span>
              {s.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function RouteMap({ tour, activeDay }: { tour: Tour; activeDay: number }) {
  const subtitle =
    tour.category === 'kilimanjaro' ? '3D Terrain — Satellite View' :
    tour.category === 'zanzibar' ? '3D Map — Zanzibar Island' :
    '3D Map — East Africa'

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Route Navigation Map
        </h3>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
      <TourMap3D tour={tour} activeDay={activeDay} />
    </div>
  )
}

// ─── Travel Schedule Data ────────────────────────────────────────────────────

type DayEntry = {
  day: number
  title: string
  sub?: string
  activities: Array<{ icon: string; text: string }>
  badge?: string
  color: string   // header accent color
}

const SCHEDULES: Record<string, DayEntry[]> = {
  s1: [
    { day:1, title:'Arusha Arrival', color:'#1a3a2a', activities:[{icon:'✈️',text:'Arrive & hotel check-in'},{icon:'🌿',text:'Team briefing & safari prep'},{icon:'🛍️',text:'Optional Maasai market walk'}] },
    { day:2, title:'Tarangire NP', color:'#8b4513', badge:'Elephants', activities:[{icon:'🐘',text:'Largest elephant herds in Tanzania'},{icon:'🦅',text:'400+ bird species sighting'},{icon:'🌳',text:'Ancient baobab forests'}] },
    { day:3, title:'Lake Manyara', color:'#2e7d52', badge:'Flamingos', activities:[{icon:'🦩',text:'Pink flamingo colonies on the lake'},{icon:'🦁',text:'Tree-climbing lions — a rare sight'},{icon:'🐒',text:'Blue monkey & hippo pools'}] },
    { day:4, title:'Ngorongoro Crater', color:'#c4622d', badge:'Big Five', activities:[{icon:'🦏',text:'Black rhino in the crater floor'},{icon:'🦁',text:'Dense lion pride territory'},{icon:'🌄',text:'Crater rim sunset views'}] },
    { day:5, title:'Enter Serengeti', color:'#1a3a2a', activities:[{icon:'🐆',text:'Cheetah on the open plains'},{icon:'🌅',text:'First Serengeti sunset'},{icon:'⛺',text:'Tented camp dinner under stars'}] },
    { day:6, title:'Serengeti Plains', color:'#6b4c11', badge:'Migration', activities:[{icon:'🦓',text:'Wildebeest & zebra herds'},{icon:'🦅',text:'Martial eagle & vulture circles'},{icon:'🚙',text:'Full-day game drive'}] },
    { day:7, title:'Serengeti West', color:'#2e7d52', activities:[{icon:'🦛',text:'Hippo pools at Retima'},{icon:'🐊',text:'Crocodile crossing points'},{icon:'🌙',text:'Night sky stargazing'}] },
    { day:8, title:'Serengeti Sunrise', color:'#d4a017', badge:'Optional', activities:[{icon:'🎈',text:'Hot air balloon safari (optional)'},{icon:'🍾',text:'Champagne bush breakfast'},{icon:'📷',text:'Golden hour photography'}] },
    { day:9, title:'Return via Ngorongoro', color:'#8b4513', activities:[{icon:'🏔️',text:'Highland rim scenic drive'},{icon:'👨‍👩‍👧',text:'Maasai village cultural visit'},{icon:'🛏️',text:'Arusha hotel overnight'}] },
    { day:10, title:'Departure', color:'#1a3a2a', activities:[{icon:'🌍',text:'Final souvenir shopping'},{icon:'✈️',text:'Airport transfer & farewell'}] },
  ],
  s2: [
    { day:1, title:'Arusha Arrival', color:'#1a3a2a', activities:[{icon:'✈️',text:'Arrive Arusha, hotel briefing'},{icon:'🌿',text:'Safari gear check & prep'}] },
    { day:2, title:'Ngorongoro Crater', color:'#c4622d', badge:'Big Five', activities:[{icon:'🦏',text:'Black rhino encounter'},{icon:'🦁',text:'Lion pride on crater floor'},{icon:'🦬',text:'Massive buffalo herds'}] },
    { day:3, title:'Enter Serengeti', color:'#1a3a2a', activities:[{icon:'🐆',text:'Cheetah tracking'},{icon:'🦒',text:'Giraffe at golden hour'},{icon:'⛺',text:'Tented camp arrival'}] },
    { day:4, title:'Great Migration', color:'#d4a017', badge:'Spectacle', activities:[{icon:'🦓',text:'1.5 million wildebeest'},{icon:'🐊',text:'River crossing drama'},{icon:'🦅',text:'Predator-prey action'}] },
    { day:5, title:'Departure', color:'#2e7d52', activities:[{icon:'🌅',text:'Final sunrise game drive'},{icon:'✈️',text:'Return Arusha & depart'}] },
  ],
  s3: [
    { day:1, title:'Arusha → Camp', color:'#1a3a2a', activities:[{icon:'✈️',text:'Arrive & transfer to luxury camp'},{icon:'🍷',text:'Sundowner cocktail welcome'}] },
    { day:2, title:'Serengeti Morning', color:'#d4a017', badge:'Luxury', activities:[{icon:'☀️',text:'Sunrise game drive'},{icon:'🍽️',text:'Bush breakfast in the plains'},{icon:'🐆',text:'Cheetah & lion sightings'}] },
    { day:3, title:'Full Serengeti Day', color:'#6b4c11', activities:[{icon:'🎈',text:'Hot air balloon option'},{icon:'🦒',text:'Giraffe & elephant encounters'},{icon:'🌙',text:'Candlelit bush dinner'}] },
    { day:4, title:'Ngorongoro Rim', color:'#2e7d52', activities:[{icon:'🏔️',text:'Scenic highland drive'},{icon:'🌄',text:'Crater rim sundowner'},{icon:'⛺',text:'Premium tented camp'}] },
    { day:5, title:'Ngorongoro Crater', color:'#c4622d', badge:'Big Five', activities:[{icon:'🦏',text:'Rhino in the caldera'},{icon:'🦁',text:'Lion & leopard tracking'},{icon:'🍾',text:'Farewell camp dinner'}] },
    { day:6, title:'Departure Day', color:'#1a3a2a', activities:[{icon:'🌅',text:'Final sunrise from camp'},{icon:'✈️',text:'Return Arusha & depart'}] },
  ],
  s4: [
    { day:1, title:'Arrive Nairobi', color:'#1a3a2a', activities:[{icon:'✈️',text:'Arrive Nairobi, hotel check-in'},{icon:'🍽️',text:'Welcome dinner, Kenya briefing'}] },
    { day:2, title:'Masai Mara', color:'#c4622d', badge:'Kenya', activities:[{icon:'🦁',text:'Masai Mara lion prides'},{icon:'🦒',text:'Giraffe & topi herds'},{icon:'🌅',text:'Mara sunset'}] },
    { day:3, title:'Migration Crossing', color:'#d4a017', badge:'Spectacle', activities:[{icon:'🦓',text:'Mara River wildebeest crossing'},{icon:'🐊',text:'Crocodile ambush'},{icon:'📷',text:'Professional photo opportunity'}] },
    { day:4, title:'Amboseli NP', color:'#2e7d52', activities:[{icon:'🐘',text:'Largest free-range elephants'},{icon:'🏔️',text:'Kilimanjaro backdrop views'},{icon:'🦩',text:'Wetland bird life'}] },
    { day:5, title:'Amboseli Full Day', color:'#8b4513', activities:[{icon:'🦛',text:'White & black rhino'},{icon:'🐆',text:'Leopard in acacia trees'},{icon:'🌙',text:'Night game drive'}] },
    { day:6, title:'Cross into Tanzania', color:'#1a3a2a', activities:[{icon:'🛣️',text:'Scenic Tanzania border drive'},{icon:'👨‍👩‍👧',text:'Maasai boma cultural visit'},{icon:'🏨',text:'Arusha hotel'}] },
    { day:7, title:'Ngorongoro Crater', color:'#c4622d', badge:'Big Five', activities:[{icon:'🦏',text:'Rhino in caldera bowl'},{icon:'🦁',text:'Crater floor lion prides'},{icon:'🦬',text:'Massive buffalo herds'}] },
    { day:8, title:'Enter Serengeti', color:'#6b4c11', activities:[{icon:'🐆',text:'Cheetah on open plains'},{icon:'🦒',text:'Giraffe at Seronera'},{icon:'⛺',text:'Luxury camp arrival'}] },
    { day:9, title:'Serengeti Full Day', color:'#d4a017', badge:'Migration', activities:[{icon:'🦓',text:'Wildebeest columns'},{icon:'🦅',text:'Raptor & vulture watch'},{icon:'🌙',text:'Starlit bush dinner'}] },
    { day:10, title:'Serengeti → Arusha', color:'#2e7d52', activities:[{icon:'🌅',text:'Final sunrise drive'},{icon:'🛍️',text:'Arusha curio market'},{icon:'🏨',text:'Last night hotel'}] },
    { day:11, title:'Departure', color:'#1a3a2a', activities:[{icon:'✈️',text:'Airport transfer & farewell'}] },
  ],
  s5: [
    { day:1, title:'Arusha Arrival', color:'#1a3a2a', activities:[{icon:'✈️',text:'Arrive & safari briefing'},{icon:'🌿',text:'Hotel & prep'}] },
    { day:2, title:'Tarangire NP', color:'#8b4513', badge:'Elephants', activities:[{icon:'🐘',text:'Giant elephant families'},{icon:'🦁',text:'Lion & leopard'},{icon:'🌳',text:'Baobab landscape'}] },
    { day:3, title:'Lake Manyara', color:'#2e7d52', activities:[{icon:'🦩',text:'Flamingo shores'},{icon:'🦁',text:'Tree-climbing lions'},{icon:'🐒',text:'Treetop canopy walk'}] },
    { day:4, title:'Ngorongoro', color:'#c4622d', badge:'Big Five', activities:[{icon:'🦏',text:'Rhino encounter'},{icon:'🦁',text:'Dense predator zone'},{icon:'🌄',text:'Crater sunset'}] },
    { day:5, title:'Serengeti Entry', color:'#6b4c11', activities:[{icon:'🦓',text:'First migration herds'},{icon:'🐆',text:'Cheetah territory'},{icon:'⛺',text:'Camp dinner'}] },
    { day:6, title:'Serengeti Full Day', color:'#d4a017', badge:'Migration', activities:[{icon:'🦓',text:'Great wildebeest migration'},{icon:'🦅',text:'Sky predators'},{icon:'🌙',text:'Night sounds'}] },
    { day:7, title:'Fly to Zanzibar', color:'#1a7a8a', badge:'Beach!', activities:[{icon:'✈️',text:'Morning flight to Zanzibar'},{icon:'🏖️',text:'Beach hotel check-in'},{icon:'🌊',text:'First dip in the Indian Ocean'}] },
    { day:8, title:'Stone Town', color:'#c4622d', activities:[{icon:'🕌',text:'UNESCO labyrinth walk'},{icon:'🌶️',text:'Spice & food tour'},{icon:'🎭',text:'Taarab music evening'}] },
    { day:9, title:'Spice Farm & Beach', color:'#2e7d52', activities:[{icon:'🌿',text:'Spice plantation tour'},{icon:'🏄',text:'Nungwi beach afternoon'},{icon:'🌅',text:'Sunset dhow cruise'}] },
    { day:10, title:'Nungwi & Snorkelling', color:'#1a7a8a', activities:[{icon:'🤿',text:'Coral reef snorkelling'},{icon:'🐢',text:'Sea turtle sanctuary'},{icon:'🏖️',text:'Beach leisure day'}] },
    { day:11, title:'Zanzibar Leisure', color:'#d4a017', activities:[{icon:'🛶️',text:'Traditional dhow trip'},{icon:'🦀',text:'Seafood beach BBQ'},{icon:'🌴',text:'Sunset cocktails'}] },
    { day:12, title:'Stone Town Farewell', color:'#8b4513', activities:[{icon:'🛍️',text:'Market shopping'},{icon:'☕',text:'Rooftop café morning'}] },
    { day:13, title:'Departure', color:'#1a3a2a', activities:[{icon:'✈️',text:'Transfer to airport & depart'}] },
  ],
  s6: [
    { day:1, title:'Arusha Birds', color:'#2e7d52', badge:'Birding', activities:[{icon:'🦜',text:'Usambiro barbet & sunbirds'},{icon:'🔭',text:'Optics check & briefing'},{icon:'📋',text:'Birding checklist issued'}] },
    { day:2, title:'Arusha NP', color:'#1a3a2a', activities:[{icon:'🦢',text:'Momella Lakes waterbirds'},{icon:'🦩',text:'Grey crowned cranes'},{icon:'🐦',text:'150+ species in one day'}] },
    { day:3, title:'Lake Natron', color:'#c4622d', badge:'Flamingos', activities:[{icon:'🦩',text:'Millions of lesser flamingos'},{icon:'🌋',text:'Ol Doinyo Lengai volcano'},{icon:'📷',text:'Aerial flamingo panorama'}] },
    { day:4, title:'Natron Wetlands', color:'#d4a017', activities:[{icon:'🦅',text:'Raptors & eagles overhead'},{icon:'🪶',text:'Rare endemic species'},{icon:'🚶',text:'Dawn walking birding trail'}] },
    { day:5, title:'Serengeti Birds', color:'#8b4513', activities:[{icon:'🦅',text:'Martial eagle & bateleur'},{icon:'🦜',text:'Lilac-breasted roller'},{icon:'🔭',text:'Spotting scopes in use'}] },
    { day:6, title:'Serengeti Full Day', color:'#6b4c11', activities:[{icon:'🐦',text:'500+ species tally'},{icon:'🦆',text:'Grey-breasted spurfowl'},{icon:'🌙',text:'Nightjar night walk'}] },
    { day:7, title:'Ngorongoro Highlands', color:'#2e7d52', badge:'Endemic', activities:[{icon:'🦜',text:'Ngorongoro endemic birds'},{icon:'🌿',text:'Forest bird walk'},{icon:'🏔️',text:'Highland panorama'}] },
    { day:8, title:'Crater Floor', color:'#c4622d', activities:[{icon:'🦩',text:'Flamingos on soda lake'},{icon:'🦅',text:'Augur buzzard sightings'},{icon:'🌄',text:'Crater rim at dusk'}] },
    { day:9, title:'Tarangire Birding', color:'#8b4513', badge:'Special', activities:[{icon:'🐦',text:'Yellow-collared lovebirds'},{icon:'🦅',text:'Kori bustard display'},{icon:'🐘',text:'Birds around elephant herds'}] },
    { day:10, title:'Tarangire Full Day', color:'#1a3a2a', activities:[{icon:'🦜',text:'500-species milestone'},{icon:'🌳',text:'Baobab woodland specialities'},{icon:'📋',text:'Final checklist review'}] },
    { day:11, title:'Wrap-up Arusha', color:'#2e7d52', activities:[{icon:'🦜',text:'Arusha NP farewell walk'},{icon:'🍽️',text:'Farewell birders dinner'}] },
    { day:12, title:'Departure', color:'#1a3a2a', activities:[{icon:'✈️',text:'Airport transfer & depart'}] },
  ],
  k1: [
    { day:1, title:'Marangu Gate → Mandara', color:'#2e7d52', sub:'1,860m → 2,700m · 7km · 4–5h', badge:'Start', activities:[{icon:'🌿',text:'Register at Marangu Gate'},{icon:'🌲',text:'Hike through montane rainforest'},{icon:'🏠',text:'Mandara hut arrival & dinner'}] },
    { day:2, title:'Mandara → Horombo', color:'#4a7c59', sub:'2,700m → 3,720m · 12km · 6–7h', activities:[{icon:'🌾',text:'Enter heath & moorland zone'},{icon:'🏔️',text:'First views of Kibo summit'},{icon:'🏠',text:'Horombo huts overnight'}] },
    { day:3, title:'Acclimatisation Day', color:'#6b5a45', sub:'3,720m · Rest & short hike', badge:'Acclimatise', activities:[{icon:'🫁',text:'Rest & altitude adjustment'},{icon:'🥾',text:'Short Zebra Rocks hike'},{icon:'💧',text:'Hydration & medical check'}] },
    { day:4, title:'Horombo → Kibo Hut', color:'#8b6914', sub:'3,720m → 4,703m · 9km · 6h', activities:[{icon:'🌬️',text:'Cross the alpine desert saddle'},{icon:'❄️',text:'Temperature drops sharply'},{icon:'🏠',text:'Kibo stone hut — rest until midnight'}] },
    { day:5, title:'Summit Push → Uhuru', color:'#d4a017', sub:'4,703m → 5,895m → 3,720m', badge:'Summit!', activities:[{icon:'🌙',text:'Midnight start — headlamps on'},{icon:'⛰️',text:'Gilman\'s Point (5,681m)'},{icon:'★',text:'Uhuru Peak 5,895m — Africa\'s roof!'},{icon:'🏃',text:'Descent to Horombo'}] },
    { day:6, title:'Descent to Marangu', color:'#1a3a2a', sub:'3,720m → 1,860m · 20km', activities:[{icon:'🏅',text:'Certificate awarded at gate'},{icon:'🎉',text:'Celebration & farewell'},{icon:'✈️',text:'Return transfer to Arusha'}] },
  ],
  k2: [
    { day:1, title:'Machame Gate → Camp', color:'#2e7d52', sub:'1,800m → 3,000m · 11km · 5–7h', badge:'Start', activities:[{icon:'🌿',text:'Register & enter rainforest'},{icon:'🌲',text:'Dense canopy & mud trail'},{icon:'⛺',text:'Machame camp — tented dinner'}] },
    { day:2, title:'Machame → Shira', color:'#4a7c59', sub:'3,000m → 3,840m · 5km · 4–5h', activities:[{icon:'🌾',text:'Emerge onto Shira Plateau'},{icon:'🌋',text:'Lava tower visible ahead'},{icon:'⛺',text:'Shira camp — starlit plains'}] },
    { day:3, title:'Shira → Barranco', color:'#c4622d', sub:'3,840m → 3,950m via 4,600m · 10km · 6–7h', badge:'Acclimatise', activities:[{icon:'🏔️',text:'Climb Lava Tower (4,600m)'},{icon:'⬇️',text:'Descend to Barranco (3,950m)'},{icon:'🌙',text:'"Climb high, sleep low" principle'}] },
    { day:4, title:'Barranco Wall', color:'#8b4513', sub:'3,950m → 4,035m · 5km · 4h', activities:[{icon:'🧗',text:'Iconic Barranco Wall scramble'},{icon:'📷',text:'360° Kilimanjaro summit views'},{icon:'⛺',text:'Karanga camp overnight'}] },
    { day:5, title:'Karanga → Barafu', color:'#6b4c11', sub:'4,035m → 4,673m · 5km · 4h', activities:[{icon:'❄️',text:'Enter alpine desert zone'},{icon:'🫁',text:'Final acclimatisation walk'},{icon:'🛌',text:'Sleep 6pm — 11pm summit prep'}] },
    { day:6, title:'Summit Night + Descent', color:'#d4a017', sub:'4,673m → 5,895m → 3,100m', badge:'Summit!', activities:[{icon:'🌙',text:'Midnight summit departure'},{icon:'★',text:'Uhuru Peak 5,895m at dawn!'},{icon:'🏃',text:'Long descent to Mweka Camp'}] },
    { day:7, title:'Mweka Gate · Depart', color:'#1a3a2a', sub:'3,100m → 1,640m · 10km · 4h', activities:[{icon:'🏅',text:'Summit certificate awarded'},{icon:'🎉',text:'Tips & team celebration'},{icon:'✈️',text:'Transfer to Arusha hotel'}] },
  ],
  k3: [
    { day:1, title:'Londorossi → Big Tree', color:'#2e7d52', sub:'2,100m → 2,780m · 9km · 3–4h', badge:'Start', activities:[{icon:'🌲',text:'Ancient montane forest'},{icon:'🐒',text:'Colobus monkey sightings'},{icon:'⛺',text:'Big Tree Camp dinner'}] },
    { day:2, title:'Big Tree → Shira 1', color:'#4a7c59', sub:'2,780m → 3,500m · 8km · 5h', activities:[{icon:'🌾',text:'Transition to heathland'},{icon:'🏔️',text:'Shira Plateau panorama'},{icon:'⛺',text:'Shira 1 tented camp'}] },
    { day:3, title:'Shira 1 → Shira 2', color:'#8b6914', sub:'3,500m → 3,840m · 5km · 3–4h', activities:[{icon:'🌋',text:'Explore Shira Cathedral'},{icon:'📷',text:'Kibo peak framed by lava'},{icon:'⛺',text:'Shira 2 camp, star gazing'}] },
    { day:4, title:'Shira 2 → Barranco', color:'#c4622d', sub:'3,840m → 3,950m via 4,600m', badge:'Acclimatise', activities:[{icon:'🏔️',text:'Touch Lava Tower (4,600m)'},{icon:'⬇️',text:'Descend to Barranco Valley'},{icon:'🌙',text:'Best acclimatisation profile'}] },
    { day:5, title:'Barranco → Karanga', color:'#8b4513', sub:'3,950m → 4,035m · 5km · 4h', activities:[{icon:'🧗',text:'Barranco Wall scramble'},{icon:'🦅',text:'Lammergeier vulture sightings'},{icon:'⛺',text:'Karanga camp'}] },
    { day:6, title:'Karanga → Barafu', color:'#6b4c11', sub:'4,035m → 4,673m · 5km · 4h', activities:[{icon:'❄️',text:'Lunar alpine desert'},{icon:'🫁',text:'Oxygen levels at 50%'},{icon:'🛌',text:'Early sleep for summit night'}] },
    { day:7, title:'Summit + Descent', color:'#d4a017', sub:'4,673m → 5,895m → 3,100m', badge:'Summit!', activities:[{icon:'🌙',text:'Midnight summit push'},{icon:'★',text:'Uhuru Peak 5,895m at sunrise!'},{icon:'🏃',text:'Descend to Mweka Camp'}] },
    { day:8, title:'Mweka Gate · Depart', color:'#1a3a2a', sub:'3,100m → 1,640m', activities:[{icon:'🏅',text:'Certificate ceremony'},{icon:'🎉',text:'Porter tips & celebration'},{icon:'✈️',text:'Arusha transfer'}] },
  ],
  k4: [
    { day:1, title:'Rongai Gate → Simba', color:'#2e7d52', sub:'1,950m → 2,625m · 9km · 3–4h', badge:'North', activities:[{icon:'🌿',text:'Kenya border wilderness'},{icon:'🦁',text:'Wildlife corridor zone'},{icon:'⛺',text:'Simba Camp — remote & quiet'}] },
    { day:2, title:'Simba → Second Cave', color:'#4a7c59', sub:'2,625m → 3,449m · 10km · 5h', activities:[{icon:'🌾',text:'Moorland & heather zone'},{icon:'📷',text:'Mawenzi peak comes into view'},{icon:'⛺',text:'Second Cave Camp'}] },
    { day:3, title:'Second → Third Cave', color:'#8b6914', sub:'3,449m → 3,800m · 9km · 4–5h', activities:[{icon:'❄️',text:'Temperature drops below 5°C'},{icon:'🏔️',text:'Kibo summit dominates skyline'},{icon:'⛺',text:'Third Cave Camp'}] },
    { day:4, title:'Third Cave → School Hut', color:'#6b4c11', sub:'3,800m → 4,703m · 6km · 5h', activities:[{icon:'🌬️',text:'Exposed ridgeline trail'},{icon:'🫁',text:'Final acclimatisation'},{icon:'🛌',text:'School Hut — rest before midnight'}] },
    { day:5, title:'Summit Push → Uhuru', color:'#d4a017', sub:'4,703m → 5,895m → 3,720m', badge:'Summit!', activities:[{icon:'🌙',text:'Midnight start in the dark'},{icon:'★',text:'Uhuru Peak 5,895m!'},{icon:'🏃',text:'Long descent to Horombo Hut'}] },
    { day:6, title:'Horombo → Marangu', color:'#2e7d52', sub:'3,720m → 1,860m · 20km', activities:[{icon:'🌲',text:'Rainforest re-entry descent'},{icon:'🏅',text:'Summit certificate at Marangu'},{icon:'🎉',text:'Celebration dinner'}] },
    { day:7, title:'Return to Arusha', color:'#1a3a2a', activities:[{icon:'🚐',text:'Transfer to Arusha'},{icon:'🏨',text:'Hotel rest & recovery'},{icon:'✈️',text:'Onward flight or extra night'}] },
  ],
  z1: [
    { day:1, title:'Arrive Stone Town', color:'#1a7a8a', badge:'Welcome!', activities:[{icon:'✈️',text:'Arrive & boutique riad check-in'},{icon:'🕌',text:'Old Fort & Jamhuri Gardens'},{icon:'🦞',text:'Forodhani seafood night market'}] },
    { day:2, title:'Stone Town Guided Tour', color:'#c4622d', activities:[{icon:'🏛️',text:'Palace Museum of Zanzibar'},{icon:'🚪',text:'Famous carved Arab doors'},{icon:'📿',text:'Darajani bazaar shopping'}] },
    { day:3, title:'Spice Farm & Beach', color:'#2e7d52', badge:'Fragrant', activities:[{icon:'🌶️',text:'Cinnamon, clove & vanilla tour'},{icon:'🏖️',text:'North coast beach afternoon'},{icon:'🌅',text:'Sunset dhow cruise'}] },
    { day:4, title:'Mnemba Atoll & Nungwi', color:'#1a7a8a', badge:'Snorkel', activities:[{icon:'🤿',text:'Pristine coral reef snorkelling'},{icon:'🐠',text:'Tropical fish & sea turtles'},{icon:'🏄',text:'Nungwi beach sunset'}] },
    { day:5, title:'Departure', color:'#1a3a2a', activities:[{icon:'🏖️',text:'Final beach morning'},{icon:'✈️',text:'Airport transfer & depart'}] },
  ],
  z2: [
    { day:1, title:'Arrive Stone Town', color:'#1a7a8a', badge:'Welcome!', activities:[{icon:'✈️',text:'Arrive & Stone Town check-in'},{icon:'🕌',text:'Evening Forodhani market'},{icon:'🍹',text:'Rooftop sunset drinks'}] },
    { day:2, title:'Prison Island & Town', color:'#c4622d', activities:[{icon:'🐢',text:'Giant Aldabra tortoises'},{icon:'🏝️',text:'Prison Island snorkel'},{icon:'🚪',text:'Carved door walking tour'}] },
    { day:3, title:'North Coast — Nungwi', color:'#1a7a8a', badge:'Beach', activities:[{icon:'🏖️',text:'White sand Nungwi arrival'},{icon:'🤿',text:'Afternoon snorkelling reef'},{icon:'🌙',text:'Beach bonfire dinner'}] },
    { day:4, title:'Kendwa & Sunset Cruise', color:'#d4a017', activities:[{icon:'🏖️',text:'Kendwa beach morning'},{icon:'⛵',text:'Traditional dhow sunset sail'},{icon:'🦞',text:'Seafood BBQ on the beach'}] },
    { day:5, title:'Kizimkazi Dolphins', color:'#2e7d52', badge:'Dolphins!', activities:[{icon:'🐬',text:'Spinner dolphins at dawn'},{icon:'🤿',text:'Swim with dolphins'},{icon:'🌊',text:'Indian Ocean blue water'}] },
    { day:6, title:'Jozani Forest', color:'#1a3a2a', activities:[{icon:'🐒',text:'Red colobus monkey canopy'},{icon:'🌴',text:'Mangrove nature trail'},{icon:'🌅',text:'Final beach sunset'}] },
    { day:7, title:'Departure', color:'#1a7a8a', activities:[{icon:'🏖️',text:'Leisure morning'},{icon:'✈️',text:'Airport transfer & depart'}] },
  ],
  z3: [
    { day:1, title:'Arrive Stone Town', color:'#1a7a8a', badge:'Welcome!', activities:[{icon:'✈️',text:'Arrive & boutique riad'},{icon:'🏛️',text:'Old Fort evening visit'},{icon:'🦞',text:'Forodhani waterfront market'}] },
    { day:2, title:'Spice Farm & Culture', color:'#2e7d52', badge:'Fragrant', activities:[{icon:'🌶️',text:'Spice farm tour & tasting lunch'},{icon:'🏛️',text:'Palace Museum of Wonders'},{icon:'📿',text:'Darajani spice bazaar'}] },
    { day:3, title:'Stone Town & Depart', color:'#c4622d', activities:[{icon:'🚪',text:'Dawn carved-door photo walk'},{icon:'☕',text:'Rooftop café breakfast'},{icon:'✈️',text:'Airport transfer & depart'}] },
  ],
}

// ─── Travel Schedule Component ────────────────────────────────────────────────

function TravelSchedule({ tourId, activeDay, onDayChange }: { tourId: string; activeDay: number; onDayChange: (d: number) => void }) {
  const days = SCHEDULES[tourId] ?? []
  if (!days.length) return null
  const setActiveDay = onDayChange

  const safeDay = Math.min(activeDay, days.length - 1)
  const selected = days[safeDay]
  const isKili = tourId.startsWith('k')

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Day-by-Day Itinerary
        </h3>
        <span className="text-xs text-muted-foreground">{days.length} days</span>
      </div>

      {/* Day selector strip — horizontal scroll */}
      <div
        className="flex gap-2 pb-2 mb-4 justify-center flex-wrap"
        style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
      >
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              backgroundColor: safeDay === i ? d.color : 'var(--muted)',
              color: safeDay === i ? '#fff' : 'var(--muted-foreground)',
              border: '2px solid',
              borderColor: safeDay === i ? d.color : 'transparent',
              minWidth: 54,
            }}
          >
            <span className="text-base leading-none font-bold">{d.day}</span>
            <span style={{ fontSize: 9, opacity: 0.85 }}>Day</span>
          </button>
        ))}
      </div>

      {/* Selected day card — infographic style */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '2px solid', borderColor: selected.color, boxShadow: `0 6px 24px ${selected.color}22` }}
      >
        {/* Card header */}
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{ backgroundColor: selected.color }}
        >
          {/* Day badge */}
          <div
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', fontFamily: 'Playfair Display, serif' }}
          >
            {selected.day}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white leading-tight" style={{ fontFamily: 'Playfair Display, serif', fontSize: 16 }}>
              {selected.title}
            </div>
            {selected.sub && (
              <div className="text-white/70 text-xs mt-0.5">{selected.sub}</div>
            )}
          </div>
          {selected.badge && (
            <span
              className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.22)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }}
            >
              {selected.badge}
            </span>
          )}
        </div>

        {/* Activities */}
        <div className="px-5 py-4 space-y-3" style={{ backgroundColor: 'var(--card)' }}>
          {selected.activities.map((act, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 leading-none mt-0.5">{act.icon}</span>
              <span className="text-sm leading-snug" style={{ color: 'var(--foreground)' }}>{act.text}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-5 py-3 flex items-center gap-3" style={{ backgroundColor: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
          <span className="text-xs text-muted-foreground flex-shrink-0">Day {selected.day} of {days.length}</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(selected.day / days.length) * 100}%`, backgroundColor: selected.color }}
            />
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => setActiveDay(Math.max(0, safeDay - 1))}
              disabled={safeDay === 0}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors disabled:opacity-30"
              style={{ backgroundColor: selected.color, color: '#fff' }}
            >
              ‹
            </button>
            <button
              onClick={() => setActiveDay(Math.min(days.length - 1, safeDay + 1))}
              disabled={safeDay === days.length - 1}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors disabled:opacity-30"
              style={{ backgroundColor: selected.color, color: '#fff' }}
            >
              ›
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function IconChevron({ dir = 'right' }: { dir?: 'right' | 'down' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ transform: dir === 'down' ? 'rotate(90deg)' : 'none' }}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .89h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  )
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Easy: 'bg-emerald-100 text-emerald-800',
    Moderate: 'bg-amber-100 text-amber-800',
    Challenging: 'bg-orange-100 text-orange-800',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[level] ?? 'bg-gray-100 text-gray-700'}`}>
      {level}
    </span>
  )
}

// ─── Tour Card ───────────────────────────────────────────────────────────────

function TourCard({ tour, onSelect }: { tour: Tour; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="card-surface interactive group overflow-hidden"
    >
      <div className="relative overflow-hidden bg-muted" style={{ height: 220 }}>
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {tour.badge && (
          <span
            className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
          >
            {tour.badge}
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs">
          <IconMapPin />
          <span>{tour.highlights[0]}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-semibold leading-snug group-hover:text-primary transition-colors"
            style={{ font: 'var(--text-h3)' }}
          >
            {tour.name}
          </h3>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span style={{ font: 'var(--text-small)', color: 'var(--muted-foreground)' }}>{tour.duration}</span>
          <span className="text-muted-foreground">·</span>
          <DifficultyBadge level={tour.difficulty} />
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{tour.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <div className="font-bold text-xl" style={{ color: 'var(--primary)' }}>
              ${tour.price.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground"> / person</span>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: 13 }}
            onClick={(e) => { e.stopPropagation(); onSelect() }}
          >
            View <IconChevron />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Tour Modal ───────────────────────────────────────────────────────────────

function TourModal({ tour, onClose, onBook }: { tour: Tour; onClose: () => void; onBook: () => void }) {
  const [activeDay, setActiveDay] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-card flex flex-col"
        style={{
          maxWidth: 'min(96vw, 1200px)',
          height: 'min(94vh, 900px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Two-column shell ── */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">

          {/* LEFT — hero + scrollable content */}
          <div className="flex flex-col flex-1 min-w-0 min-h-0">

            {/* Hero image */}
            <div className="relative flex-shrink-0" style={{ height: 'clamp(180px, 26vh, 320px)' }}>
              <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-white bg-black/30 hover:bg-black/50 transition-colors"
              >
                <IconClose />
              </button>
              {tour.badge && (
                <span
                  className="absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
                >
                  {tour.badge}
                </span>
              )}
              <div className="absolute bottom-5 left-6 right-6">
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(20px,3vw,30px)', color: 'white', lineHeight: 1.2 }}>
                  {tour.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-white/80 text-sm">{tour.duration}</span>
                  <span className="text-white/50">·</span>
                  <span className="text-white/80 text-sm">{tour.groupSize}</span>
                  <span className="text-white/50">·</span>
                  <DifficultyBadge level={tour.difficulty} />
                </div>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-7">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Overview</h3>
                <p style={{ color: 'var(--foreground)', lineHeight: 1.75, fontSize: 14 }}>{tour.description}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {tour.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-xs px-3 py-1 rounded-full border"
                      style={{ borderColor: 'var(--border)', color: 'var(--foreground)', backgroundColor: 'var(--muted)' }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">What's Included</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tour.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <span className="flex-shrink-0 text-emerald-600"><IconCheck /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <TravelSchedule tourId={tour.id} activeDay={activeDay} onDayChange={setActiveDay} />

              <RouteMap tour={tour} activeDay={activeDay} />
            </div>
          </div>

          {/* RIGHT — sticky pricing sidebar */}
          <div
            className="flex-shrink-0 lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-l overflow-y-auto"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
          >
            <div className="p-5 md:p-6 space-y-5">
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Price from</div>
                <div className="text-4xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'Playfair Display, serif' }}>
                  ${tour.price.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">per person</div>
              </div>

              <div className="space-y-2 text-sm border-t border-b py-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{tour.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Group size</span>
                  <span className="font-medium">{tour.groupSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className="font-medium">{tour.difficulty}</span>
                </div>
              </div>

              <div className="flex gap-1 items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ color: 'var(--accent)' }}><IconStar /></span>
                ))}
                <span className="text-xs text-muted-foreground ml-1">5.0 (47 reviews)</span>
              </div>

              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <div className="text-xs text-muted-foreground mb-1">Price from</div>
                <div className="text-4xl font-bold mb-1" style={{ color: 'var(--primary)', fontFamily: 'Playfair Display, serif' }}>
                  ${tour.price.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mb-5">per person</div>

                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Group size</span>
                    <span className="font-medium">{tour.groupSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty</span>
                    <span className="font-medium">{tour.difficulty}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  No payment now — our team will confirm availability and send a detailed proposal within 24 hours.
                </p>
                <button
                  onClick={onBook}
                  className="w-full py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity mb-2"
                  style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
                >
                  Book This Tour
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-lg font-medium text-sm border hover:bg-muted transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  Back to Tours
                </button>
              </div>
            </div>
          </div>

        </div>{/* end two-column shell */}
      </div>
    </div>
  )
}

// ─── Booking Modal ────────────────────────────────────────────────────────────

function BookingModal({ tour, onClose, onBooked }: { tour: Tour; onClose: () => void; onBooked: (b: Booking) => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', guests: '2', notes: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const ref = 'HMW-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000)
    const booking: Booking = {
      ref,
      tour,
      name: form.name,
      email: form.email,
      phone: form.phone,
      date: form.date,
      guests: parseInt(form.guests),
      total: tour.price * parseInt(form.guests),
      notes: form.notes,
      bookedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    }
    setTimeout(() => onBooked(booking), 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div
        className="w-full max-w-lg rounded-xl bg-card p-8 relative"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.35)', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <IconClose />
        </button>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: 'var(--primary)' }}>
              <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full inline-block" style={{ animation: 'spin 0.8s linear infinite', borderWidth: 3 }} />
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22 }} className="mb-2">Confirming your booking…</h2>
            <p className="text-muted-foreground text-sm">Securing your adventure with our Arusha team.</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22 }} className="mb-1">Book Your Adventure</h2>
            <p className="text-sm text-muted-foreground mb-6">{tour.name} — from ${tour.price.toLocaleString()}/person</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', '--tw-ring-color': 'var(--primary)' } as React.CSSProperties}
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                    placeholder="jane@email.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">No. of Guests</label>
                  <select
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Preferred Start Date *</label>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Special Requests</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all resize-none"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                  placeholder="Dietary requirements, accessibility needs, special occasions..."
                />
              </div>

              <div
                className="flex items-center justify-between py-3 px-4 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <span className="text-muted-foreground">Estimated Total</span>
                <span className="text-lg font-bold" style={{ color: 'var(--primary)', fontFamily: 'Playfair Display, serif' }}>
                  ${(tour.price * parseInt(form.guests)).toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-secondary w-full"
              >
                Send Enquiry
              </button>
              <p className="text-xs text-center text-muted-foreground">
                No payment now — our team will confirm availability and send a detailed proposal.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Booked Page ──────────────────────────────────────────────────────────────

function BookedPage({ booking, onBack, onLogout, userName }: { booking: Booking; onBack: () => void; onLogout: () => void; userName: string }) {
  const { tour, ref, name, email, phone, date, guests, total, notes, bookedAt } = booking
  const [activeTab, setActiveTab] = useState<'booking' | 'account'>('booking')
  const [scrolled, setScrolled] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => { window.removeEventListener('scroll', handler); window.scrollTo(0, 0) }
  }, [])

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  const categoryLabel = tour.category === 'safari' ? 'Safari' : tour.category === 'kilimanjaro' ? 'Kilimanjaro' : 'Zanzibar'
  const categoryColor = tour.category === 'safari' ? 'var(--secondary)' : tour.category === 'kilimanjaro' ? 'var(--accent)' : 'var(--primary)'

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

      {/* ── Navbar ── */}
      <Navbar
        onRegister={() => setShowRegister(true)}
        onLogout={onLogout}
        onHome={onBack}
        onNavLink={(id) => { onBack(); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120) }}
        scrolled={scrolled}
        userName={userName}
      />
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}

      {/* ── Account Tab ── */}
      {activeTab === 'account' && (
        <div className="max-w-2xl mx-auto px-5 md:px-10 py-14 mt-16">
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
              style={{ backgroundColor: 'var(--primary)', background: 'linear-gradient(135deg, #1a3a2a, #2a5a3a)', fontFamily: 'Playfair Display, serif' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--foreground)' }}>{userName}</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)', fontFamily: 'Outfit, sans-serif' }}>{email}</p>
          </div>

          <div className="space-y-4">
            {/* My Bookings card */}
            <button
              onClick={() => setActiveTab('booking')}
              className="w-full flex items-center gap-4 p-5 rounded-2xl border text-left hover:shadow-md transition-shadow"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: 'rgba(26,58,42,0.1)' }}>🎫</div>
              <div className="flex-1">
                <div className="font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--foreground)' }}>My Bookings</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>1 active booking · {ref}</div>
              </div>
              <span style={{ color: 'var(--muted-foreground)' }}>→</span>
            </button>

            {/* Journey Flow card */}
            <button
              onClick={() => { setActiveTab('booking'); setTimeout(() => document.getElementById('journey-flow')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
              className="w-full flex items-center gap-4 p-5 rounded-2xl border text-left hover:shadow-md transition-shadow"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: 'rgba(196,98,45,0.1)' }}>🗺️</div>
              <div className="flex-1">
                <div className="font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--foreground)' }}>Tour Journey Flow</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Explore the Tanzania route — Arusha to Zanzibar</div>
              </div>
              <span style={{ color: 'var(--muted-foreground)' }}>→</span>
            </button>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { label: 'Tours Booked', value: '1', icon: '🌍' },
                { label: 'Countries', value: '1', icon: '🏳️' },
                { label: 'Days Planned', value: tour.duration.split(' ')[0], icon: '📅' },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl border p-4 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--foreground)' }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'Outfit, sans-serif' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity mt-2"
              style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', fontFamily: 'Outfit, sans-serif' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* ── My Booking tab ── */}
      {activeTab === 'booking' && <>

      {/* ── Hero ── */}
      <div className="relative" style={{ height: 'clamp(220px, 35vh, 380px)', marginTop: 64 }}>
        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)' }} />

        {/* Confirmed badge */}
        <div className="absolute top-6 left-6 md:top-8 md:left-10 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
          style={{ backgroundColor: '#16a34a', color: 'white', boxShadow: '0 4px 16px rgba(22,163,74,0.4)' }}>
          ✓ Booking Confirmed
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
            style={{ backgroundColor: categoryColor, color: 'white', opacity: 0.9 }}>
            {categoryLabel}
          </div>
          <h1 className="text-white leading-tight mb-1"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(22px, 4vw, 38px)', textShadow: '0 2px 12px rgba(0,0,0,0.5)', maxWidth: 700 }}>
            {tour.name}
          </h1>
          <p className="text-white/70 text-sm">{tour.duration} · {tour.groupSize}</p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Booking reference banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 rounded-2xl"
              style={{ backgroundColor: 'var(--primary)', background: 'linear-gradient(135deg, #1a3a2a 0%, #2a5a3a 100%)' }}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(212,160,23,0.8)' }}>Booking Reference</p>
                <p className="font-bold text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: 2 }}>{ref}</p>
                <p className="text-white/50 text-xs mt-1">Booked on {bookedAt}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(212,160,23,0.8)' }}>Status</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm" style={{ backgroundColor: 'rgba(22,163,74,0.2)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Confirmed
                </div>
              </div>
            </div>

            {/* Tour highlights */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                <span className="text-base">🌍</span>
                <h2 className="font-semibold" style={{ fontFamily: 'Playfair Display, serif', fontSize: 17 }}>Tour Highlights</h2>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  {tour.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: categoryColor + '22' }}>
                        <span style={{ fontSize: 10, color: categoryColor }}>✓</span>
                      </div>
                      <span className="text-sm leading-snug" style={{ color: 'var(--foreground)' }}>{h}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{tour.description}</p>
              </div>
            </div>

            {/* What's included */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                <span className="text-base">✅</span>
                <h2 className="font-semibold" style={{ fontFamily: 'Playfair Display, serif', fontSize: 17 }}>What is Included</h2>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-3">
                {tour.includes.map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#16a34a22' }}>
                      <span style={{ fontSize: 10, color: '#16a34a' }}>✓</span>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {notes && (
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-base">📝</span>
                  <h2 className="font-semibold" style={{ fontFamily: 'Playfair Display, serif', fontSize: 17 }}>Special Requests</h2>
                </div>
                <p className="px-6 py-4 text-sm leading-relaxed text-muted-foreground">{notes}</p>
              </div>
            )}

            {/* Next steps */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                <span className="text-base">🗓️</span>
                <h2 className="font-semibold" style={{ fontFamily: 'Playfair Display, serif', fontSize: 17 }}>What Happens Next</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { step: '1', title: 'Confirmation email sent', desc: `A full itinerary and booking summary has been sent to ${email}.`, done: true },
                  { step: '2', title: 'Team review (within 24 hrs)', desc: 'Our Arusha team will review your request and verify availability.', done: false },
                  { step: '3', title: 'Final proposal & deposit', desc: 'We send you a tailored proposal — no obligation until you confirm.', done: false },
                  { step: '4', title: 'Preparation & travel briefing', desc: 'Gear lists, visa info, and a personal call with your lead guide.', done: false },
                ].map(({ step, title, desc, done }) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: done ? '#16a34a' : 'var(--muted)', color: done ? 'white' : 'var(--muted-foreground)' }}>
                      {done ? '✓' : step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-5">

            {/* Summary card */}
            <div className="rounded-2xl border overflow-hidden sticky top-24" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--primary)' }}>
                <h3 className="font-bold text-white" style={{ fontFamily: 'Playfair Display, serif', fontSize: 15 }}>Booking Summary</h3>
                <p className="text-white/55 text-xs mt-0.5">Ref: {ref}</p>
              </div>

              <div className="p-5 space-y-4">
                {/* Guest info */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">Guest Details</p>
                  <div className="space-y-2.5">
                    {[
                      { icon: '👤', label: name },
                      { icon: '✉️', label: email },
                      ...(phone ? [{ icon: '📞', label: phone }] : []),
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm">
                        <span className="text-base w-5 text-center">{row.icon}</span>
                        <span style={{ color: 'var(--foreground)' }}>{row.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2.5" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">Trip Details</p>
                  {[
                    { icon: '📅', label: 'Departure', value: formattedDate },
                    { icon: '🗓️', label: 'Duration', value: tour.duration },
                    { icon: '👥', label: 'Guests', value: `${guests} ${guests === 1 ? 'person' : 'people'}` },
                    { icon: '⚡', label: 'Difficulty', value: tour.difficulty },
                  ].map(row => (
                    <div key={row.label} className="flex items-start gap-2.5 text-sm">
                      <span className="text-base w-5 text-center flex-shrink-0">{row.icon}</span>
                      <div className="flex-1 flex justify-between gap-2">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-medium text-right" style={{ color: 'var(--foreground)' }}>{row.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Price Breakdown</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">${tour.price.toLocaleString()} × {guests} guests</span>
                      <span style={{ color: 'var(--foreground)' }}>${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Park fees & permits</span>
                      <span style={{ color: 'var(--foreground)' }}>Included</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Airport transfers</span>
                      <span style={{ color: 'var(--foreground)' }}>Included</span>
                    </div>
                    <div className="border-t pt-2.5 flex justify-between font-bold text-base" style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: 'var(--foreground)' }}>Total</span>
                      <span style={{ color: 'var(--primary)', fontFamily: 'Playfair Display, serif' }}>${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="border-t pt-4 space-y-2.5" style={{ borderColor: 'var(--border)' }}>
                  <button onClick={onBack}
                    className="w-full py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                    Explore More Tours
                  </button>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <span>📞</span>
                    <span>Questions? +255 754 744 300</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Greeter card */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--primary)', background: 'linear-gradient(135deg, #1a3a2a, #2a5a3a)' }}>
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Welcome,</p>
              <p className="text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>{userName} 🎉</p>
              <p className="text-white/65 text-xs mt-2 leading-relaxed">
                Your adventure is one step closer. Our Arusha team will reach out within 24 hours to finalise everything.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Journey Flow — inline below booking body ── */}
      <div id="journey-flow">
        <BookedJourneyFlow onBrowse={onBack} />
      </div>

      </>}
    </div>
  )
}

// ─── Booked Journey Flow ──────────────────────────────────────────────────────

function BookedJourneyFlow({ onBrowse }: { onBrowse: () => void }) {
  const [activeStop, setActiveStop] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const stop = JOURNEY_STOPS[activeStop]

  return (
    <div
      ref={sectionRef}
      style={{ backgroundColor: '#0f2318' }}
      className="relative overflow-hidden"
    >
      {/* Dot texture */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, #c4622d 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(26,58,42,0.5) 0%, transparent 65%)' }} />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-14">
        {/* Header */}
        <div className="text-center mb-14"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#d4a017', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.2em' }}>
            Your Tanzania Route
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 48px)', color: '#f5f0e8', lineHeight: 1.15 }}>
            The Complete Journey
          </h2>
          <p style={{ color: 'rgba(245,240,232,0.55)', fontFamily: 'Outfit, sans-serif', fontSize: 15, maxWidth: 460, margin: '12px auto 0' }}>
            From the gateway city of Arusha to the spice-scented shores of Zanzibar — six legendary stops.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mb-12 overflow-x-auto pb-4"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s' }}>
          <div className="min-w-max mx-auto flex items-start justify-center gap-0 px-4">
            {JOURNEY_STOPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <button onClick={() => setActiveStop(i)} className="flex flex-col items-center" style={{ minWidth: 108 }}>
                  {/* Ring + dot */}
                  <div style={{
                    width: activeStop === i ? 54 : 40,
                    height: activeStop === i ? 54 : 40,
                    borderRadius: '50%',
                    border: `2px solid ${activeStop === i ? s.dotColor : 'rgba(255,255,255,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: activeStop === i ? 'rgba(26,58,42,0.9)' : 'rgba(15,35,24,0.5)',
                    boxShadow: activeStop === i ? `0 0 22px ${s.dotColor}55` : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                    <div style={{
                      width: activeStop === i ? 18 : 11,
                      height: activeStop === i ? 18 : 11,
                      borderRadius: '50%',
                      backgroundColor: i <= activeStop ? s.dotColor : 'rgba(255,255,255,0.22)',
                      boxShadow: i <= activeStop ? `0 0 8px ${s.dotColor}70` : 'none',
                      transition: 'all 0.3s ease',
                    }} />
                  </div>
                  <div className="mt-3 text-center px-1">
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: activeStop === i ? 14 : 12, color: activeStop === i ? '#f5f0e8' : 'rgba(245,240,232,0.45)', fontWeight: 600, transition: 'all 0.2s' }}>
                      {s.name}
                    </div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: activeStop === i ? s.dotColor : 'rgba(245,240,232,0.28)', marginTop: 2, transition: 'all 0.2s' }}>
                      {s.subtitle}
                    </div>
                  </div>
                </button>

                {i < JOURNEY_STOPS.length - 1 && (
                  <div style={{
                    width: 48,
                    height: 2,
                    flexShrink: 0,
                    marginTop: -40,
                    background: i < activeStop ? `linear-gradient(90deg, ${JOURNEY_STOPS[i].dotColor}, ${JOURNEY_STOPS[i+1].dotColor})` : 'none',
                    borderTop: i < activeStop ? 'none' : '2px dashed rgba(255,255,255,0.15)',
                    transition: 'all 0.4s ease',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detail card */}
        <div
          key={stop.id}
          className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(15,35,24,0.75)',
            backdropFilter: 'blur(16px)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
          }}
        >
          {/* Photo */}
          <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
            <img src={stop.image} alt={stop.name} className="absolute inset-0 w-full h-full object-cover"
              style={{ transition: 'opacity 0.4s ease' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(15,35,24,0.55))' }} />
            <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full flex items-center gap-1.5"
              style={{ backgroundColor: stop.dotColor, boxShadow: `0 4px 16px ${stop.dotColor}55` }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                Stop {activeStop + 1}/{JOURNEY_STOPS.length}
              </span>
            </div>
            <div className="absolute bottom-5 left-5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>▲ {stop.elevation}</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div style={{ color: stop.dotColor, fontSize: 11, fontFamily: 'Outfit, sans-serif', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                Day {stop.days}
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 3vw, 34px)', color: '#f5f0e8', lineHeight: 1.1, marginBottom: 4 }}>
                {stop.name}
              </h3>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: stop.dotColor, marginBottom: 20 }}>{stop.subtitle}</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'rgba(245,240,232,0.72)', lineHeight: 1.75, marginBottom: 24 }}>
                {stop.description}
              </p>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.35)', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Highlights
                </div>
                <div className="flex flex-wrap gap-2">
                  {stop.highlights.map(h => (
                    <span key={h} className="px-3 py-1 rounded-full text-xs"
                      style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.11)', color: 'rgba(245,240,232,0.78)' }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Prev / dots / Next */}
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button onClick={() => setActiveStop(Math.max(0, activeStop - 1))} disabled={activeStop === 0}
                style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: activeStop === 0 ? 'rgba(245,240,232,0.18)' : 'rgba(245,240,232,0.65)', cursor: activeStop === 0 ? 'not-allowed' : 'pointer' }}>
                ← Prev
              </button>
              <div className="flex items-center gap-1.5">
                {JOURNEY_STOPS.map((_, i) => (
                  <button key={i} onClick={() => setActiveStop(i)} style={{
                    width: activeStop === i ? 20 : 6, height: 6, borderRadius: 3,
                    backgroundColor: activeStop === i ? stop.dotColor : 'rgba(255,255,255,0.18)',
                    transition: 'all 0.3s ease', cursor: 'pointer',
                  }} />
                ))}
              </div>
              <button onClick={() => setActiveStop(Math.min(JOURNEY_STOPS.length - 1, activeStop + 1))} disabled={activeStop === JOURNEY_STOPS.length - 1}
                style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: activeStop === JOURNEY_STOPS.length - 1 ? 'rgba(245,240,232,0.18)' : 'rgba(245,240,232,0.65)', cursor: activeStop === JOURNEY_STOPS.length - 1 ? 'not-allowed' : 'pointer' }}>
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center"
          style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.8s ease 0.5s' }}>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'rgba(245,240,232,0.38)', marginBottom: 14 }}>
            Ready to follow this route?
          </p>
          <button
            onClick={onBrowse}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90 hover:scale-105"
            style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: '#c4622d', color: '#f5f0e8', boxShadow: '0 8px 32px rgba(196,98,45,0.35)' }}
          >
            Browse Tour Packages →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Register Modal ───────────────────────────────────────────────────────────

function RegisterModal({ onClose, onAuth }: { onClose: () => void; onAuth: (name: string) => void }) {
  const [tab, setTab] = useState<'register' | 'login'>('register')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const displayName = tab === 'register'
      ? form.name.trim()
      : form.email.split('@')[0]
    onAuth(displayName || 'Explorer')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div
        className="w-full max-w-md rounded-xl bg-card p-8 relative"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <IconClose />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
              style={{ backgroundColor: 'var(--primary)' }}>
              <IconUser />
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24 }} className="mb-2">Welcome!</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Your account has been created. You can now save favourite tours and receive personalised itineraries.
            </p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              Explore Tours
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24 }} className="mb-1">
                {tab === 'register' ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-sm text-muted-foreground">HakunaMatataWorld</p>
            </div>

            {/* Tab switcher */}
            <div className="flex rounded-lg p-1 mb-6" style={{ backgroundColor: 'var(--muted)' }}>
              {(['register', 'login'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-2 text-sm font-medium rounded-md transition-all"
                  style={{
                    backgroundColor: tab === t ? 'var(--card)' : 'transparent',
                    color: tab === t ? 'var(--foreground)' : 'var(--muted-foreground)',
                    boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {t === 'register' ? 'Register' : 'Sign In'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                    placeholder="Your full name"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Password *</label>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                  placeholder="••••••••"
                />
              </div>
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Confirm Password *</label>
                  <input
                    required
                    type="password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 transition-all"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                    placeholder="••••••••"
                  />
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                {tab === 'register' ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) { setError('Please enter your username and password.'); return }
    setError(''); setLoading(true)
    setTimeout(() => onLogin(username.trim()), 900)
  }

  return (
    <div className="fixed inset-0 flex" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* ── Left image panel ── */}
      <div className="hidden lg:flex relative flex-col justify-between w-[52%] flex-shrink-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1602410125631-7e736e36797c?w=1200&h=1400&fit=crop&auto=format"
          alt="Serengeti sunrise"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(26,58,42,0.55) 0%, rgba(0,0,0,0.35) 60%, rgba(196,98,45,0.25) 100%)' }} />

        {/* Brand */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)', color: 'white' }}>
              HM
            </div>
            <span className="text-white font-semibold text-xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              HakunaM<span style={{ color: '#d4a017' }}>atataWorld</span>
            </span>
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10 p-10 pb-12">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#d4a017', fontSize: 18 }}>★</span>)}
          </div>
          <p className="text-white leading-relaxed mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontStyle: 'italic', maxWidth: 420 }}>
            "Every sunrise in the Serengeti reminded me that this was not just a trip — it was a transformation."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40">
              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&h=80&fit=crop&auto=format" alt="Guest" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Sophie Hartmann</div>
              <div className="text-white/55 text-xs">Verified Guest · Berlin, Germany</div>
            </div>
          </div>

          {/* Mini stat pills */}
          <div className="flex gap-3 mt-8 flex-wrap">
            {[{ v: '500+', l: 'Happy Guests' }, { v: '13', l: 'Tours' }, { v: '4.9★', l: 'Rated' }].map(s => (
              <div key={s.l} className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                {s.v} <span style={{ opacity: 0.65 }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-14 py-12 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
        {/* Mobile brand */}
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: 'var(--primary)' }}>HM</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: 16 }}>HakunaMatataWorld</span>
        </div>

        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>Welcome back</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--foreground)', lineHeight: 1.2 }} className="mb-2">
            Sign in to your<br />adventure account
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Enter any username and password to continue.</p>

          <form onSubmit={submit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: 15 }}>👤</span>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
                  placeholder="e.g. jane.explorer"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Password</label>
                <button type="button" className="text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--secondary)' }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: 15 }}>🔒</span>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:opacity-70 transition-opacity"
                  style={{ fontSize: 15 }}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs font-medium px-4 py-3 rounded-lg" style={{ backgroundColor: 'rgba(196,98,45,0.1)', color: 'var(--secondary)', border: '1px solid rgba(196,98,45,0.25)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 relative overflow-hidden"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', marginTop: 8 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" style={{ animation: 'spin 0.7s linear infinite' }} />
                  Signing in…
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t" style={{ borderColor: 'var(--border)' }} />
            <span className="text-xs text-muted-foreground px-2">or</span>
            <div className="flex-1 border-t" style={{ borderColor: 'var(--border)' }} />
          </div>

          {/* Social login placeholders */}
          <div className="grid grid-cols-2 gap-3">
            {[{ icon: '🌐', label: 'Google' }, { icon: '🍎', label: 'Apple' }].map(s => (
              <button key={s.label} type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all hover:opacity-80"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground mt-8">
            New to HakunaMatataWorld?{' '}
            <button type="button" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}
              onClick={() => onLogin('Explorer')}>
              Start exploring →
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ onRegister, onLogout, onHome, onNavLink, view, onNavigate, scrolled, userName }: {
  onRegister: () => void; onLogout?: () => void; onHome?: () => void; onNavLink?: (id: string) => void;
  view?: View; onNavigate?: (v: View) => void; scrolled: boolean; userName?: string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const solid = scrolled || (view && view !== 'home')

  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
    transition: 'all 0.3s ease',
    backgroundColor: solid ? 'rgba(245,240,232,0.97)' : 'transparent',
    backdropFilter: solid ? 'blur(14px)' : 'none',
    borderBottom: solid ? '1px solid var(--border)' : 'none',
  }
  const linkColor = solid ? 'var(--foreground)' : 'white'

  const NAV_LINKS = [
    { label: 'Home', id: 'home', view: 'home' as View },
    { label: 'Explore', id: 'explore', view: 'explore' as View },
    { label: 'Plan', id: 'plan', view: 'plan' as View },
    ...(userName ? [{ label: 'My Trips', id: 'trips', view: 'trips' as View }] : []),
    { label: 'About', id: 'about', view: null },
    { label: 'Contact', id: 'contact', view: null },
  ]

  const handleLink = (item: typeof NAV_LINKS[0]) => {
    if (item.view) { onNavigate?.(item.view); return }
    onNavLink?.(item.id)
  }

  return (
    <nav style={navStyle}>
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={onHome} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: solid ? 'var(--primary)' : 'rgba(255,255,255,0.2)', border: '2px solid', borderColor: solid ? 'var(--primary)' : 'rgba(255,255,255,0.6)' }}>
              HM
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: 17, color: linkColor }}>
              HakunaM<span style={{ color: solid ? 'var(--secondary)' : 'var(--accent)' }}>atataWorld</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map(item => (
              <button key={item.label} onClick={() => handleLink(item)}
                className="text-sm font-medium transition-all hover:opacity-70"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  color: view === item.view && item.view ? 'var(--secondary)' : linkColor,
                  fontWeight: view === item.view && item.view ? 600 : 400,
                  borderBottom: view === item.view && item.view ? '2px solid var(--secondary)' : '2px solid transparent',
                  paddingBottom: 2,
                }}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {/* Plan My Trip CTA — desktop */}
            <button onClick={() => onNavigate?.('plan')}
              className="btn btn-secondary hidden lg:flex"
              style={{ padding: '10px 18px', fontSize: 13.5 }}>
              Plan My Trip ✦
            </button>
            {userName ? (
              <div className="hidden lg:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 cursor-pointer"
                  onClick={() => onNavigate?.('profile')}
                  style={{ backgroundColor: 'var(--primary)' }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <button onClick={onLogout}
                  className="btn"
                  style={{
                    padding: '7px 14px', fontSize: 12,
                    backgroundColor: solid ? 'var(--muted)' : 'rgba(255,255,255,0.15)',
                    color: linkColor, border: '1px solid', borderColor: solid ? 'var(--border)' : 'rgba(255,255,255,0.3)',
                    boxShadow: 'none',
                  }}>
                  Sign out
                </button>
              </div>
            ) : (
              <button onClick={onRegister}
                className="btn hidden lg:flex"
                style={{
                  padding: '10px 18px', fontSize: 13.5,
                  backgroundColor: solid ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
                  color: 'white', border: '1px solid', borderColor: solid ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(8px)', boxShadow: solid ? 'var(--shadow-sm)' : 'none',
                }}>
                <IconUser /> Sign In
              </button>
            )}
            <button className="lg:hidden p-2 rounded-lg" style={{ color: linkColor }} onClick={() => setMobileOpen(!mobileOpen)}>
              <IconMenu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
          <div className="flex flex-col px-5 py-4 gap-1">
            {NAV_LINKS.map(item => (
              <button key={item.label} onClick={() => { handleLink(item); setMobileOpen(false) }}
                className="text-sm font-medium py-2.5 text-left px-3 rounded-lg transition-colors hover:bg-muted"
                style={{ fontFamily: 'Outfit, sans-serif', color: view === item.view && item.view ? 'var(--primary)' : 'var(--foreground)', fontWeight: view === item.view && item.view ? 600 : 400 }}>
                {item.label}
              </button>
            ))}
            <button onClick={() => { onNavigate?.('plan'); setMobileOpen(false) }}
              className="btn btn-secondary mt-2 w-full">
              Plan My Trip ✦
            </button>
            {!userName && (
              <button onClick={() => { onRegister(); setMobileOpen(false) }}
                className="btn btn-primary mt-1 w-full">
                <IconUser /> Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="relative" style={{ height: '100vh', minHeight: 620 }}>
      <div className="absolute inset-0 bg-primary">
        <img
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop&auto=format&q=85"
          alt="Elephant herd at golden hour on the Tanzanian savanna"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/55" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-5 pt-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
          style={{ backgroundColor: 'rgba(212,160,23,0.2)', border: '1px solid rgba(212,160,23,0.5)', color: '#f5d062' }}>
          <IconMapPin />
          Arusha, Tanzania · 10+ Years of Excellence
        </div>

        <h1
          className="text-white mb-4 leading-tight"
          style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(38px, 6vw, 72px)', maxWidth: 780, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
        >
          Your luxurious African adventure begins here
        </h1>

        <p className="text-white/80 mb-10 max-w-xl leading-relaxed" style={{ fontSize: 'clamp(15px, 2vw, 18px)' }}>
          Bespoke safaris, Kilimanjaro expeditions, and Zanzibar escapes crafted by a Tanzania-based team with 10+ years in the field.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onExplore}
            className="btn btn-secondary"
            style={{ padding: '14px 28px', fontSize: 14.5 }}
          >
            Explore All Tours
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Stats Ticker ─────────────────────────────────────────────────────────────

function useCountUp(target: number, trigger: boolean, duration = 1600) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let frame: number
    let start: number | null = null
    const step = (ts: number) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(target * eased)
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [trigger, target, duration])
  return value
}

function StatsTicker() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const travellers = useCountUp(500, visible)
  const packages = useCountUp(13, visible)
  const rating = useCountUp(4.9, visible, 1400)

  const stats = [
    { value: `${Math.round(travellers)}+`, label: 'Happy Travellers' },
    { value: `${Math.round(packages)}`, label: 'Tour Packages' },
    { value: `${rating.toFixed(1)}★`, label: 'TripAdvisor Rating' },
  ]

  return (
    <section ref={sectionRef} className="py-10 px-5" style={{ backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="text-center">
            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--primary)' }}>
              {stat.value}
            </div>
            <div className="text-xs md:text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Category Tabs ────────────────────────────────────────────────────────────

const CATEGORIES: { key: Category; label: string; count: number; subtitle: string }[] = [
  { key: 'safari', label: 'Tanzania Safaris', count: 6, subtitle: 'Big Five, migration & luxury tented camps' },
  { key: 'kilimanjaro', label: 'Mount Kilimanjaro', count: 4, subtitle: 'Africa\'s highest peak — 5,895m' },
  { key: 'zanzibar', label: 'Zanzibar Beaches', count: 3, subtitle: 'Spice islands, coral reefs & culture' },
]

const CATEGORY_IMAGES: Record<Category, string> = {
  safari: 'https://images.unsplash.com/photo-1532574754390-44dc5c6780bb?w=600&h=340&fit=crop&auto=format',
  kilimanjaro: 'https://images.unsplash.com/photo-1716404211069-dc368a7247fd?w=600&h=340&fit=crop&auto=format',
  zanzibar: 'https://images.unsplash.com/photo-1731329571540-a1d6dfc902b8?w=600&h=340&fit=crop&auto=format',
}

// ─── Why Us ───────────────────────────────────────────────────────────────────

function WhyUs() {
  const reasons = [
    { icon: '🌍', title: 'Locally Based', desc: 'Headquartered in Arusha at the foot of Kilimanjaro — we know this land intimately.' },
    { icon: '🚙', title: 'Own Fleet', desc: 'Modified pop-top Land Cruiser 4WDs ensure comfort, reliability, and optimal game-viewing.' },
    { icon: '🗣️', title: 'Multilingual Guides', desc: 'Expert guides fluent in English, German, Spanish, Italian, Russian & Chinese.' },
    { icon: '✂️', title: 'Tailor-Made', desc: 'Every itinerary is built around you — your pace, your interests, your budget.' },
    { icon: '🏆', title: "TripAdvisor's Choice", desc: 'Consistently rated among Tanzania\'s top operators by independent travellers.' },
    { icon: '💰', title: 'Transparent Pricing', desc: 'Direct operator pricing — no agency mark-up. What you see is what you pay.' },
  ]

  return (
    <section id="about" className="py-20 px-5 md:px-8" style={{ backgroundColor: 'var(--primary)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
            Why Choose Us
          </div>
          <h2 className="text-white mb-3" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)' }}>
            A Different Kind of Safari Company
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: 'rgba(245,240,232,0.7)' }}>
            Born in Tanzania, built on trust. Ten years of delivering exceptional experiences across East Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="rounded-xl p-6 transition-transform hover:-translate-y-1"
              style={{ backgroundColor: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.12)' }}
            >
              <div className="text-3xl mb-4">{r.icon}</div>
              <h3 className="font-semibold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif', fontSize: 18 }}>{r.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.65)' }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Destinations Strip ───────────────────────────────────────────────────────

function Destinations() {
  const dests = [
    { name: 'Serengeti', country: 'Tanzania', image: 'https://images.unsplash.com/photo-1613864309738-9102a9e22883?w=400&h=500&fit=crop&auto=format' },
    { name: 'Ngorongoro', country: 'Tanzania', image: 'https://images.unsplash.com/photo-1703934169695-9c91c8bc69c3?w=400&h=500&fit=crop&auto=format' },
    { name: 'Kilimanjaro', country: 'Tanzania', image: 'https://images.unsplash.com/photo-1716404214250-8d34f6b0bc24?w=400&h=500&fit=crop&auto=format' },
    { name: 'Zanzibar', country: 'Tanzania', image: 'https://images.unsplash.com/photo-1737319377856-c147ac09d9ec?w=400&h=500&fit=crop&auto=format' },
    { name: 'Masai Mara', country: 'Kenya', image: 'https://images.unsplash.com/photo-1739703213318-acc03d446981?w=400&h=500&fit=crop&auto=format' },
  ]

  return (
    <section className="py-20 px-5 md:px-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>
            Key Destinations
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--foreground)' }}>
            Places That Will Stay With You Forever
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {dests.map((d) => (
            <div key={d.name} className="group relative rounded-xl overflow-hidden cursor-pointer bg-muted" style={{ aspectRatio: '4/5' }}>
              <img
                src={d.image}
                alt={d.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="text-white font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>{d.name}</div>
                <div className="text-white/60 text-xs">{d.country}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="py-20 px-5 md:px-8" style={{ backgroundColor: 'var(--muted)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>
            Get in Touch
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--foreground)' }}>
            Plan Your Dream Trip
          </h2>
          <p className="mt-3 text-muted-foreground">Our Arusha team is available 7 days a week</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h3 className="font-semibold" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20 }}>Tanzania Office</h3>
            <div className="space-y-3 text-sm">
              {['+255 754 744 300', '+255 766 254 433'].map((p) => (
                <div key={p} className="flex items-center gap-3 text-muted-foreground">
                  <IconPhone /><span>{p}</span>
                </div>
              ))}
              {['info@africanqueenadventures.com', 'sales@africanqueenadventures.com'].map((e) => (
                <div key={e} className="flex items-center gap-3 text-muted-foreground">
                  <IconMail /><span>{e}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-3" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20 }}>Hungary Office</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-3"><IconPhone /><span>+36 30 222 7292</span></div>
                <div className="flex items-center gap-3"><IconMail /><span>hungary@africanqueenadventures.com</span></div>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6 bg-card border" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 18 }}>Quick Enquiry</h3>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                placeholder="Your name"
              />
              <input
                type="email"
                className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                placeholder="Email address"
              />
              <textarea
                rows={3}
                className="w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 resize-none"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                placeholder="Tell us about your dream trip..."
              />
              <button
                className="w-full py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ onRegister }: { onRegister: () => void }) {
  return (
    <footer className="py-10 px-5 md:px-8 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: 'var(--primary)' }}>HM</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: 15, color: 'var(--foreground)' }}>
            HakunaMatataWorld
          </span>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          © 2026 HakunaMatataWorld Ltd. · Arusha, Tanzania · TripAdvisor Travelers' Choice
        </div>
        <button
          onClick={onRegister}
          className="text-xs font-medium hover:opacity-70 transition-opacity"
          style={{ color: 'var(--secondary)' }}
        >
          Register an account
        </button>
      </div>
    </footer>
  )
}

// ─── Tour Journey Flow ────────────────────────────────────────────────────────

const JOURNEY_STOPS = [
  {
    id: 'arusha',
    name: 'Arusha',
    subtitle: 'HQ & start point',
    color: '#c4622d',
    dotColor: '#c4622d',
    image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=600&h=400&fit=crop&auto=format',
    description: 'Your Tanzania adventure begins in Arusha — the safari capital. Nestled between Mt. Meru and Kilimanjaro, it\'s the gateway to Africa\'s most celebrated wildlife parks.',
    highlights: ['Gateway city', 'Cultural Market', 'Arusha NP', 'Mt. Meru views'],
    days: '1–2',
    elevation: '1,387m',
  },
  {
    id: 'tarangire',
    name: 'Tarangire',
    subtitle: 'Elephant country',
    color: '#d4a017',
    dotColor: '#d4a017',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop&auto=format',
    description: 'Tarangire\'s ancient baobab forests shelter the highest concentration of elephants in northern Tanzania. Thousand-strong herds gather at the seasonal river during dry season.',
    highlights: ['Giant Baobabs', 'Elephant Herds', 'Baobab Valley', 'Night Drives'],
    days: '3–4',
    elevation: '1,100m',
  },
  {
    id: 'serengeti',
    name: 'Serengeti',
    subtitle: 'Endless plains',
    color: '#d4a017',
    dotColor: '#d4a017',
    image: 'https://images.unsplash.com/photo-1602410125631-7e736e36797c?w=600&h=400&fit=crop&auto=format',
    description: 'The Serengeti — "endless plains" in Maasai — is Earth\'s greatest wildlife theatre. Witness the Great Migration, lion prides at dawn, and skies painted gold at sunset.',
    highlights: ['Great Migration', 'Big Five', 'Hot Air Balloons', 'Sunset Drives'],
    days: '5–7',
    elevation: '920m',
  },
  {
    id: 'ngorongoro',
    name: 'Ngorongoro',
    subtitle: 'The Crater',
    color: '#d4a017',
    dotColor: '#d4a017',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&h=400&fit=crop&auto=format',
    description: 'The world\'s largest intact volcanic caldera. Over 25,000 animals live within its 260 km² floor — a self-contained Eden where predators and prey play out ancient dramas daily.',
    highlights: ['Crater Floor', 'Black Rhino', 'Maasai Culture', 'Flamingo Lake'],
    days: '8',
    elevation: '2,286m',
  },
  {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    subtitle: 'Roof of Africa',
    color: '#6b8c6b',
    dotColor: '#6b8c6b',
    image: 'https://images.unsplash.com/photo-1621414050946-1b84c4e21a31?w=600&h=400&fit=crop&auto=format',
    description: 'Africa\'s highest peak at 5,895m. The iconic snow-capped summit rises above the savanna and can be reached by determined trekkers via six distinct routes — no technical climbing required.',
    highlights: ['Summit 5,895m', 'Glacial Ice Fields', 'Six Routes', 'Unique Ecosystems'],
    days: '9–15',
    elevation: '5,895m',
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar',
    subtitle: 'Coast & spice',
    color: '#c4622d',
    dotColor: '#c4622d',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=600&h=400&fit=crop&auto=format',
    description: 'Complete your journey on the Spice Island — turquoise Indian Ocean waters, powder-white sands, and the labyrinthine alleys of UNESCO-listed Stone Town. A perfect safari finale.',
    highlights: ['Stone Town', 'Spice Tours', 'Snorkelling', 'Pristine Beaches'],
    days: '16–19',
    elevation: 'Sea level',
  },
]

function TourJourneyFlow() {
  const [activeStop, setActiveStop] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const stop = JOURNEY_STOPS[activeStop]

  return (
    <section
      ref={sectionRef}
      id="journey"
      style={{ backgroundColor: '#0f2318', minHeight: '100vh' }}
      className="relative overflow-hidden"
    >
      {/* Background texture dots */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #c4622d 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(26,58,42,0.6) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: '#d4a017', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.2em' }}
          >
            The Tanzania Journey
          </div>
          <h2
            className="mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: '#f5f0e8',
              lineHeight: 1.15,
            }}
          >
            From Savanna to Summit<br />
            <em style={{ color: '#d4a017' }}>to Sea</em>
          </h2>
          <p style={{ color: 'rgba(245,240,232,0.65)', fontFamily: 'Outfit, sans-serif', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
            Every HakunaMatataWorld tour flows through these legendary destinations — click each stop to explore what awaits you.
          </p>
        </div>

        {/* Journey Timeline */}
        <div className="relative mb-16 overflow-x-auto">
          <div className="min-w-max mx-auto flex items-center justify-center gap-0 px-4">
            {JOURNEY_STOPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                {/* Stop node */}
                <button
                  onClick={() => setActiveStop(i)}
                  className="flex flex-col items-center group relative"
                  style={{ minWidth: 100 }}
                >
                  {/* Outer ring for active */}
                  <div
                    className="transition-all duration-300"
                    style={{
                      width: activeStop === i ? 52 : 38,
                      height: activeStop === i ? 52 : 38,
                      borderRadius: '50%',
                      border: `2px solid ${activeStop === i ? s.dotColor : 'rgba(255,255,255,0.15)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: activeStop === i ? 'rgba(26,58,42,0.8)' : 'rgba(15,35,24,0.6)',
                      boxShadow: activeStop === i ? `0 0 20px ${s.dotColor}60` : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        width: activeStop === i ? 18 : 12,
                        height: activeStop === i ? 18 : 12,
                        borderRadius: '50%',
                        backgroundColor: i <= activeStop ? s.dotColor : 'rgba(255,255,255,0.25)',
                        transition: 'all 0.3s ease',
                        boxShadow: i <= activeStop ? `0 0 8px ${s.dotColor}80` : 'none',
                      }}
                    />
                  </div>

                  {/* Labels */}
                  <div className="mt-3 text-center">
                    <div
                      className="font-semibold text-sm transition-colors duration-200"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        color: activeStop === i ? '#f5f0e8' : 'rgba(245,240,232,0.55)',
                        fontSize: activeStop === i ? 15 : 13,
                      }}
                    >
                      {s.name}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: activeStop === i ? s.dotColor : 'rgba(245,240,232,0.3)', fontFamily: 'Outfit, sans-serif' }}
                    >
                      {s.subtitle}
                    </div>
                  </div>
                </button>

                {/* Dashed connector */}
                {i < JOURNEY_STOPS.length - 1 && (
                  <div
                    className="mx-2 flex-shrink-0"
                    style={{
                      width: 56,
                      height: 2,
                      background: i < activeStop
                        ? `linear-gradient(90deg, ${JOURNEY_STOPS[i].dotColor}, ${JOURNEY_STOPS[i + 1].dotColor})`
                        : 'none',
                      borderTop: i < activeStop ? 'none' : '2px dashed rgba(255,255,255,0.18)',
                      marginTop: -32,
                      transition: 'all 0.4s ease',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detail Card */}
        <div
          key={stop.id}
          className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            backgroundColor: 'rgba(15,35,24,0.7)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Image side */}
          <div className="relative overflow-hidden" style={{ minHeight: 360 }}>
            <img
              src={stop.image}
              alt={stop.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transition: 'all 0.5s ease' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(15,35,24,0.5) 100%)' }}
            />
            {/* Stop number badge */}
            <div
              className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: stop.dotColor, boxShadow: `0 4px 16px ${stop.dotColor}60` }}
            >
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, fontWeight: 600, color: '#fff' }}>
                Stop {activeStop + 1} of {JOURNEY_STOPS.length}
              </span>
            </div>
            {/* Elevation badge */}
            <div
              className="absolute bottom-5 left-5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                ▲ {stop.elevation}
              </span>
            </div>
          </div>

          {/* Info side */}
          <div className="p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div style={{ color: stop.dotColor, fontSize: 12, fontFamily: 'Outfit, sans-serif', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Day {stop.days}
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3vw, 36px)', color: '#f5f0e8', lineHeight: 1.1 }}>
                    {stop.name}
                  </h3>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: stop.dotColor, marginTop: 4 }}>
                    {stop.subtitle}
                  </p>
                </div>
              </div>

              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: 'rgba(245,240,232,0.75)', lineHeight: 1.7, marginBottom: 28 }}>
                {stop.description}
              </p>

              {/* Highlights */}
              <div>
                <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.4)', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Highlights
                </div>
                <div className="flex flex-wrap gap-2">
                  {stop.highlights.map(h => (
                    <span
                      key={h}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        backgroundColor: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(245,240,232,0.8)',
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setActiveStop(Math.max(0, activeStop - 1))}
                disabled={activeStop === 0}
                className="flex items-center gap-2 transition-opacity"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 14,
                  color: activeStop === 0 ? 'rgba(245,240,232,0.2)' : 'rgba(245,240,232,0.7)',
                  cursor: activeStop === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Previous
              </button>

              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {JOURNEY_STOPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStop(i)}
                    style={{
                      width: activeStop === i ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: activeStop === i ? stop.dotColor : 'rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveStop(Math.min(JOURNEY_STOPS.length - 1, activeStop + 1))}
                disabled={activeStop === JOURNEY_STOPS.length - 1}
                className="flex items-center gap-2 transition-opacity"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 14,
                  color: activeStop === JOURNEY_STOPS.length - 1 ? 'rgba(245,240,232,0.2)' : 'rgba(245,240,232,0.7)',
                  cursor: activeStop === JOURNEY_STOPS.length - 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'rgba(245,240,232,0.45)', marginBottom: 16 }}>
            Ready to follow this route?
          </p>
          <a
            href="#tours"
            onClick={e => { e.preventDefault(); document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90 hover:scale-105"
            style={{
              fontFamily: 'Outfit, sans-serif',
              backgroundColor: '#c4622d',
              color: '#f5f0e8',
              boxShadow: '0 8px 32px rgba(196,98,45,0.35)',
            }}
          >
            Browse Tour Packages →
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav({ view, onNavigate, userName }: { view: View; onNavigate: (v: View) => void; userName: string | null }) {
  const items: Array<{ key: View; label: string; svg: React.ReactNode }> = [
    {
      key: 'home', label: 'Home',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    {
      key: 'explore', label: 'Explore',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    },
    {
      key: 'plan', label: 'Plan',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    },
    ...(userName ? [{
      key: 'trips' as View, label: 'My Trips',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    }] : []),
    {
      key: 'profile', label: 'Profile',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
  ]
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{ backgroundColor: 'var(--card)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex">
        {items.map(item => {
          const active = view === item.key
          return (
            <button key={item.key} onClick={() => onNavigate(item.key)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors"
              style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}>
              {item.svg}
              <span style={{ fontSize: 10, fontFamily: 'Outfit, sans-serif', fontWeight: active ? 600 : 400, lineHeight: 1 }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Experience Categories ────────────────────────────────────────────────────

const EXPERIENCE_CATS = [
  { label: 'Wildlife Safari', emoji: '🦁', color: '#c4622d', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=260&fit=crop&auto=format', count: '6 tours' },
  { label: 'Kilimanjaro', emoji: '🏔️', color: '#1a3a2a', image: 'https://images.unsplash.com/photo-1621414050946-1b84c4e21a31?w=400&h=260&fit=crop&auto=format', count: '4 routes' },
  { label: 'Zanzibar Escape', emoji: '🏖️', color: '#2a7a9a', image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=400&h=260&fit=crop&auto=format', count: '3 packages' },
  { label: 'Cultural Immersion', emoji: '🎭', color: '#8b5a2b', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=260&fit=crop&auto=format', count: 'Maasai & more' },
  { label: 'Luxury Travel', emoji: '✨', color: '#b8860b', image: 'https://images.unsplash.com/photo-1532574754390-44dc5c6780bb?w=400&h=260&fit=crop&auto=format', count: 'Tented camps' },
  { label: 'Family Adventures', emoji: '👨‍👩‍👧', color: '#2e7d32', image: 'https://images.unsplash.com/photo-1602410125631-7e736e36797c?w=400&h=260&fit=crop&auto=format', count: 'All ages' },
  { label: 'Romantic Getaway', emoji: '🌅', color: '#ad1457', image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=400&h=260&fit=crop&auto=format', count: 'Honeymoon ready' },
  { label: 'Photography Trips', emoji: '📸', color: '#37474f', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=260&fit=crop&auto=format', count: 'Golden hour shots' },
]

function ExperienceCategories({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section className="py-20 px-5 md:px-8" style={{ backgroundColor: 'var(--card)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)', fontFamily: 'Outfit, sans-serif' }}>
              Explore By Experience
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 38px)', color: 'var(--foreground)', lineHeight: 1.2 }}>
              How do you want to<br /><em>feel alive?</em>
            </h2>
          </div>
          <button onClick={() => onNavigate('explore')}
            className="hidden md:flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'var(--secondary)', fontFamily: 'Outfit, sans-serif' }}>
            View all →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {EXPERIENCE_CATS.map((cat, i) => (
            <button key={cat.label} onClick={() => onNavigate('explore')}
              className="relative rounded-2xl overflow-hidden text-left group"
              style={{ height: i < 4 ? 'clamp(160px, 20vw, 220px)' : 'clamp(120px, 14vw, 160px)' }}>
              <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <div className="text-xl mb-0.5">{cat.emoji}</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(12px, 1.5vw, 15px)', color: '#fff', fontWeight: 600, lineHeight: 1.2 }}>{cat.label}</div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{cat.count}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Reviews Section ──────────────────────────────────────────────────────────

const REVIEWS = [
  {
    name: 'Sophie Hartmann', country: 'Germany', flag: '🇩🇪',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&h=80&fit=crop&auto=format',
    trip: '10 Days Northern Circuit', rating: 5,
    text: "Every sunrise in the Serengeti reminded me this was not just a trip — it was a transformation. Our guide knew each animal by name. Utterly flawless from pickup to drop-off.",
  },
  {
    name: 'Marcus Thompson', country: 'United States', flag: '🇺🇸',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    trip: 'Lemosho Route — Kilimanjaro', rating: 5,
    text: "Standing on Uhuru Peak at dawn with the clouds below me — I cried. The team kept me safe, motivated, and laughing the entire way up. Worth every step.",
  },
  {
    name: 'Amara Osei-Bonsu', country: 'United Kingdom', flag: '🇬🇧',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format',
    trip: '5 Days Zanzibar Premium', rating: 5,
    text: "Stone Town is magic, the beaches are paradise, and the spice tour was something I never expected to love so much. HakunaMatata arranged everything perfectly.",
  },
]

function ReviewsSection() {
  return (
    <section className="py-20 px-5 md:px-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)', fontFamily: 'Outfit, sans-serif' }}>
            Traveler Stories
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 38px)', color: 'var(--foreground)' }}>
            What our guests say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#d4a017', fontSize: 18 }}>★</span>)}
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'var(--muted-foreground)', marginLeft: 6 }}>4.9 · 500+ reviews</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex gap-1">{[...Array(r.rating)].map((_, i) => <span key={i} style={{ color: '#d4a017', fontSize: 14 }}>★</span>)}</div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--foreground)', lineHeight: 1.75, fontStyle: 'italic', flexGrow: 1 }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{r.name} {r.flag}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'var(--muted-foreground)' }}>{r.trip}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Gallery Section ──────────────────────────────────────────────────────────

const GALLERY_PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop&auto=format', alt: 'Elephant herd at sunset', span: 'col-span-2' },
  { src: 'https://images.unsplash.com/photo-1621414050946-1b84c4e21a31?w=400&h=400&fit=crop&auto=format', alt: 'Kilimanjaro summit', span: '' },
  { src: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=400&h=400&fit=crop&auto=format', alt: 'Zanzibar beach', span: '' },
  { src: 'https://images.unsplash.com/photo-1532574754390-44dc5c6780bb?w=400&h=400&fit=crop&auto=format', alt: 'Wildebeest migration', span: '' },
  { src: 'https://images.unsplash.com/photo-1602410125631-7e736e36797c?w=600&h=400&fit=crop&auto=format', alt: 'Serengeti sunrise', span: 'col-span-2' },
]

function GallerySection() {
  return (
    <section className="py-20 px-5 md:px-8" style={{ backgroundColor: 'var(--card)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)', fontFamily: 'Outfit, sans-serif' }}>From The Field</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 38px)', color: 'var(--foreground)' }}>
            Tanzania through the lens
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {GALLERY_PHOTOS.map((p, i) => (
            <div key={i} className={`relative rounded-2xl overflow-hidden group ${p.span}`}
              style={{ height: 'clamp(160px, 18vw, 260px)' }}>
              <img src={p.src} alt={p.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>{p.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Explore Screen ───────────────────────────────────────────────────────────

const FILTER_CHIPS = ['All', 'Wildlife', 'Kilimanjaro', 'Zanzibar', 'Luxury', 'Family', 'Short (≤5 days)', 'Budget-friendly', 'Photography', 'Cultural']
const SORT_OPTIONS = ['Most Popular', 'Price: Low → High', 'Price: High → Low', 'Duration']

function ExploreScreen({ onSelectTour }: { onSelectTour: (t: Tour) => void }) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [sort, setSort] = useState('Most Popular')
  const [listView, setListView] = useState(false)

  const filtered = tours.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (activeFilter === 'All') return true
    if (activeFilter === 'Wildlife') return t.category === 'safari'
    if (activeFilter === 'Kilimanjaro') return t.category === 'kilimanjaro'
    if (activeFilter === 'Zanzibar') return t.category === 'zanzibar'
    if (activeFilter === 'Luxury') return (t.badge === 'Luxury' || t.price >= 4000)
    if (activeFilter === 'Family') return t.difficulty === 'Easy'
    if (activeFilter === 'Short (≤5 days)') return parseInt(t.duration) <= 5
    if (activeFilter === 'Budget-friendly') return t.price < 2000
    return true
  }).sort((a, b) => {
    if (sort === 'Price: Low → High') return a.price - b.price
    if (sort === 'Price: High → Low') return b.price - a.price
    if (sort === 'Duration') return parseInt(a.duration) - parseInt(b.duration)
    return 0
  })

  return (
    <div className="pt-20 pb-24 md:pb-10" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-5 md:px-8 py-8" style={{ backgroundColor: 'var(--primary)', background: 'linear-gradient(135deg, #1a3a2a 0%, #2a5a3a 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(212,160,23,0.85)', fontFamily: 'Outfit, sans-serif' }}>
            Discover Tanzania
          </p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 4vw, 38px)', color: '#f5f0e8', lineHeight: 1.2, marginBottom: 16 }}>
            Where will your story<br /><em style={{ color: '#d4a017' }}>take you?</em>
          </h1>
          {/* Search bar */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search tours, destinations, experiences…"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#f5f0e8', fontFamily: 'Outfit, sans-serif', backdropFilter: 'blur(8px)' }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {FILTER_CHIPS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                fontFamily: 'Outfit, sans-serif',
                backgroundColor: activeFilter === f ? 'var(--primary)' : 'var(--card)',
                color: activeFilter === f ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                border: '1px solid', borderColor: activeFilter === f ? 'var(--primary)' : 'var(--border)',
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Sort + count + toggle */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'var(--muted-foreground)' }}>
            <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{filtered.length}</span> tours found
          </p>
          <div className="flex items-center gap-2">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="text-xs rounded-lg px-3 py-2 outline-none"
              style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {[false, true].map(isList => (
                <button key={String(isList)} onClick={() => setListView(isList)}
                  className="p-2 transition-colors"
                  style={{ backgroundColor: listView === isList ? 'var(--primary)' : 'var(--card)', color: listView === isList ? 'white' : 'var(--muted-foreground)' }}>
                  {isList
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--foreground)', marginBottom: 8 }}>No tours found</h3>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--muted-foreground)' }}>Try a different search or filter.</p>
            <button onClick={() => { setSearch(''); setActiveFilter('All') }}
              className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
              Clear filters
            </button>
          </div>
        ) : listView ? (
          <div className="flex flex-col gap-4">
            {filtered.map(t => (
              <button key={t.id} onClick={() => onSelectTour(t)}
                className="flex gap-4 rounded-2xl overflow-hidden text-left hover:shadow-md transition-shadow"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <img src={t.image} alt={t.name} className="w-28 md:w-40 flex-shrink-0 object-cover" style={{ height: 120 }} />
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    {t.badge && <span className="text-xs font-bold px-2 py-0.5 rounded-full mr-2"
                      style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)', fontFamily: 'Outfit, sans-serif' }}>{t.badge}</span>}
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(14px, 2vw, 17px)', color: 'var(--foreground)', marginTop: t.badge ? 6 : 0 }}>{t.name}</h3>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>{t.duration} · {t.groupSize} · {t.difficulty}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600, color: 'var(--primary)' }}>From ${t.price.toLocaleString()}</span>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--secondary)' }}>View trip →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(t => (
              <TourCard key={t.id} tour={t} onSelect={() => onSelectTour(t)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Plan Screen ──────────────────────────────────────────────────────────────

const PLAN_DESTINATIONS = [
  { id: 'serengeti', label: 'Serengeti', emoji: '🦁', image: 'https://images.unsplash.com/photo-1602410125631-7e736e36797c?w=200&h=130&fit=crop&auto=format' },
  { id: 'ngorongoro', label: 'Ngorongoro', emoji: '🌋', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=200&h=130&fit=crop&auto=format' },
  { id: 'kilimanjaro', label: 'Kilimanjaro', emoji: '🏔️', image: 'https://images.unsplash.com/photo-1621414050946-1b84c4e21a31?w=200&h=130&fit=crop&auto=format' },
  { id: 'zanzibar', label: 'Zanzibar', emoji: '🏖️', image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=200&h=130&fit=crop&auto=format' },
  { id: 'tarangire', label: 'Tarangire', emoji: '🐘', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=200&h=130&fit=crop&auto=format' },
  { id: 'arusha', label: 'Arusha', emoji: '🌿', image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=200&h=130&fit=crop&auto=format' },
]
const PLAN_INTERESTS = ['Wildlife', 'Adventure', 'Beach', 'Culture', 'Luxury', 'Romance', 'Family', 'Photography']
const PLAN_STYLES = [
  { key: 'comfort', label: 'Comfort', sub: 'Mid-range lodges', price: '$1,500–3,000' },
  { key: 'premium', label: 'Premium', sub: 'Superior camps', price: '$3,000–5,000' },
  { key: 'luxury', label: 'Luxury', sub: 'Private tented camps', price: '$5,000–8,000' },
  { key: 'ultra', label: 'Ultra Luxury', sub: 'Exclusive fly-camps', price: '$8,000+' },
]
const PLAN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function PlanScreen({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [step, setStep] = useState(1)
  const [destinations, setDestinations] = useState<string[]>([])
  const [month, setMonth] = useState('')
  const [travelers, setTravelers] = useState({ adults: 2, children: 0 })
  const [budget, setBudget] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [style, setStyle] = useState('')
  const [generated, setGenerated] = useState(false)

  const totalSteps = 6
  const progress = (step / totalSteps) * 100

  const toggleDest = (id: string) => setDestinations(d => d.includes(id) ? d.filter(x => x !== id) : [...d, id])
  const toggleInterest = (i: string) => setInterests(d => d.includes(i) ? d.filter(x => x !== i) : [...d, i])

  const canNext = () => {
    if (step === 1) return destinations.length > 0
    if (step === 2) return month !== ''
    if (step === 3) return travelers.adults > 0
    if (step === 4) return budget !== ''
    if (step === 5) return interests.length > 0
    if (step === 6) return style !== ''
    return false
  }

  const estimatedDays = Math.max(5, destinations.length * 2 + (destinations.includes('kilimanjaro') ? 5 : 0))
  const selectedStyle = PLAN_STYLES.find(s => s.key === style)
  const routeStr = destinations.map(id => PLAN_DESTINATIONS.find(d => d.id === id)?.label).filter(Boolean).join(' → ')

  if (generated) {
    return (
      <div className="pt-20 pb-24 md:pb-10" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto px-5 md:px-8 py-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
              style={{ backgroundColor: 'rgba(26,58,42,0.1)' }}>✨</div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)', fontFamily: 'Outfit, sans-serif' }}>Your Custom Journey</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 4vw, 38px)', color: 'var(--foreground)' }}>Tanzania Adventure</h2>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--muted-foreground)', marginTop: 8 }}>{month} departure · {travelers.adults + travelers.children} traveler{travelers.adults + travelers.children !== 1 ? 's' : ''}</p>
          </div>

          <div className="rounded-2xl overflow-hidden border mb-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="p-6 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--primary)', background: 'linear-gradient(135deg, #1a3a2a, #2a5a3a)' }}>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[{ label: 'Duration', value: `${estimatedDays} days` }, { label: 'Style', value: selectedStyle?.label || '' }, { label: 'Est. Cost', value: selectedStyle?.price || '' }].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'rgba(212,160,23,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#f5f0e8', marginTop: 4 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Your Route</div>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'var(--foreground)' }}>{routeStr || 'Tanzania Circuit'}</p>
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Experiences</div>
                <div className="flex flex-wrap gap-2">
                  {interests.map(i => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs"
                      style={{ backgroundColor: 'rgba(26,58,42,0.08)', color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}>{i}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Accommodation</div>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--foreground)' }}>{selectedStyle?.sub}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={() => onNavigate('explore')}
              className="w-full py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--primary)', color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: 15 }}>
              Build My Journey →
            </button>
            <button onClick={() => { setStep(1); setGenerated(false); setDestinations([]); setMonth(''); setInterests([]); setStyle('') }}
              className="w-full py-3 rounded-xl font-medium text-sm hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', fontFamily: 'Outfit, sans-serif' }}>
              Start over
            </button>
          </div>
        </div>
      </div>
    )
  }

  const stepTitles = ['Where do you want to go?', 'When are you traveling?', 'How many travelers?', 'What is your budget?', 'What experiences interest you?', 'Choose your travel style']

  return (
    <div className="pt-20 pb-24 md:pb-10" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--muted-foreground)' }}>Step {step} of {totalSteps}</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--secondary)', fontWeight: 600 }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: 'var(--primary)' }} />
          </div>
          <h2 className="mt-6" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(22px, 3.5vw, 30px)', color: 'var(--foreground)' }}>
            {stepTitles[step - 1]}
          </h2>
        </div>

        {/* Step 1 – Destinations */}
        {step === 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PLAN_DESTINATIONS.map(d => {
              const sel = destinations.includes(d.id)
              return (
                <button key={d.id} onClick={() => toggleDest(d.id)}
                  className="relative rounded-2xl overflow-hidden text-left transition-all"
                  style={{ height: 120, border: '2px solid', borderColor: sel ? 'var(--primary)' : 'transparent', boxShadow: sel ? '0 0 0 2px var(--primary)' : 'none' }}>
                  <img src={d.image} alt={d.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)' }} />
                  {sel && <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--primary)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div style={{ fontSize: 16, marginBottom: 2 }}>{d.emoji}</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, color: '#fff', fontWeight: 600 }}>{d.label}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Step 2 – Month */}
        {step === 2 && (
          <div className="grid grid-cols-4 gap-2">
            {PLAN_MONTHS.map(m => (
              <button key={m} onClick={() => setMonth(m)}
                className="py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: month === m ? 'var(--primary)' : 'var(--card)', color: month === m ? 'white' : 'var(--foreground)', border: '1px solid', borderColor: month === m ? 'var(--primary)' : 'var(--border)' }}>
                {m}
              </button>
            ))}
          </div>
        )}

        {/* Step 3 – Travelers */}
        {step === 3 && (
          <div className="space-y-4">
            {([['adults', 'Adults', '18+ years'], ['children', 'Children', 'Under 18']] as const).map(([key, label, sub]) => (
              <div key={key} className="flex items-center justify-between p-5 rounded-2xl"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, color: 'var(--foreground)' }}>{label}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{sub}</div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setTravelers(t => ({ ...t, [key]: Math.max(key === 'adults' ? 1 : 0, t[key] - 1) }))}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>−</button>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--foreground)', minWidth: 24, textAlign: 'center' }}>{travelers[key]}</span>
                  <button onClick={() => setTravelers(t => ({ ...t, [key]: t[key] + 1 }))}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: 'var(--primary)', color: 'white' }}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 4 – Budget */}
        {step === 4 && (
          <div className="space-y-3">
            {[['$500 – $1,500', 'Budget explorer', ''], ['$1,500 – $3,500', 'Comfort traveler', 'Most popular'], ['$3,500 – $6,000', 'Premium experience', ''], ['$6,000+', 'Ultra luxury', '']].map(([val, label, tag]) => (
              <button key={val} onClick={() => setBudget(val)}
                className="w-full flex items-center justify-between p-5 rounded-2xl text-left transition-all"
                style={{ backgroundColor: 'var(--card)', border: '2px solid', borderColor: budget === val ? 'var(--primary)' : 'var(--border)' }}>
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, color: 'var(--foreground)' }}>{val} <span style={{ fontSize: 13, fontFamily: 'Outfit, sans-serif', fontWeight: 400, color: 'var(--muted-foreground)' }}>per person</span></div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--muted-foreground)', marginTop: 3 }}>{label}</div>
                </div>
                {tag && <span className="px-2 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)', fontFamily: 'Outfit, sans-serif' }}>{tag}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Step 5 – Interests */}
        {step === 5 && (
          <div className="flex flex-wrap gap-3">
            {PLAN_INTERESTS.map(i => {
              const sel = interests.includes(i)
              return (
                <button key={i} onClick={() => toggleInterest(i)}
                  className="px-5 py-3 rounded-full text-sm font-semibold transition-all"
                  style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: sel ? 'var(--primary)' : 'var(--card)', color: sel ? 'white' : 'var(--foreground)', border: '1px solid', borderColor: sel ? 'var(--primary)' : 'var(--border)' }}>
                  {i}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 6 – Style */}
        {step === 6 && (
          <div className="space-y-3">
            {PLAN_STYLES.map(s => (
              <button key={s.key} onClick={() => setStyle(s.key)}
                className="w-full flex items-center justify-between p-5 rounded-2xl text-left transition-all"
                style={{ backgroundColor: 'var(--card)', border: '2px solid', borderColor: style === s.key ? 'var(--primary)' : 'var(--border)' }}>
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, color: 'var(--foreground)' }}>{s.label}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--muted-foreground)', marginTop: 3 }}>{s.sub}</div>
                </div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--secondary)' }}>{s.price}</span>
              </button>
            ))}
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex gap-3 mt-10">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', fontFamily: 'Outfit, sans-serif' }}>
              ← Back
            </button>
          )}
          <button
            onClick={() => step === totalSteps ? setGenerated(true) : setStep(s => s + 1)}
            disabled={!canNext()}
            className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: 'var(--primary)', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
            {step === totalSteps ? 'Generate My Trip ✨' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Trips Screen ─────────────────────────────────────────────────────────────

const TODAY_SCHEDULE = [
  { time: '06:30', activity: 'Wake up call & bush breakfast', icon: '☕', done: true },
  { time: '07:00', activity: 'Morning game drive — Central Serengeti', icon: '🚙', done: true },
  { time: '13:00', activity: 'Return to camp · Lunch', icon: '🍽️', done: false },
  { time: '15:30', activity: 'Afternoon game drive — Ndutu plains', icon: '🦁', done: false },
  { time: '18:30', activity: 'Sundowner & bush dinner', icon: '🌅', done: false },
]

const CHECKLIST_ITEMS = [
  { label: 'Passport valid 6+ months', done: true },
  { label: 'Tanzania e-Visa obtained', done: true },
  { label: 'Travel insurance purchased', done: true },
  { label: 'Yellow fever vaccination', done: true },
  { label: 'Malaria prophylaxis', done: true },
  { label: 'Flights booked', done: true },
  { label: 'Packing list completed', done: false },
  { label: 'Airport transfer confirmed', done: false },
  { label: 'Emergency contacts noted', done: false },
  { label: 'USD cash prepared', done: false },
]

function TripsScreen({ booking, onNavigate }: { booking: Booking | null; onNavigate: (v: View) => void }) {
  const [checkDone, setCheckDone] = useState<boolean[]>(CHECKLIST_ITEMS.map(i => i.done))
  const completedCount = checkDone.filter(Boolean).length

  const demoTour = booking?.tour || tours.find(t => t.id === 's1')!
  const ref = booking?.ref || 'HMW-DEMO'
  const departureDate = booking?.date ? new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Aug 18, 2025'

  return (
    <div className="pt-20 pb-24 md:pb-10" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-8">

        {/* Active trip card */}
        <div className="rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid var(--border)' }}>
          <div className="relative" style={{ height: 180 }}>
            <img src={demoTour.image} alt={demoTour.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.65))' }} />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2"
                    style={{ backgroundColor: '#16a34a', color: 'white' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600 }}>Active Trip</span>
                  </div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#f5f0e8', lineHeight: 1.2 }}>{demoTour.name}</h2>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>{departureDate} · {demoTour.duration}</p>
                </div>
                <div className="text-right">
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ref</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, color: '#d4a017', letterSpacing: 1 }}>{ref}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="px-5 py-4" style={{ backgroundColor: 'var(--card)' }}>
            <div className="flex justify-between mb-1.5">
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--muted-foreground)' }}>Day 4 of 14</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--secondary)', fontWeight: 600 }}>29% complete</span>
            </div>
            <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
              <div className="h-full rounded-full" style={{ width: '29%', backgroundColor: 'var(--secondary)' }} />
            </div>
            <div className="flex justify-between mt-3 text-xs overflow-x-auto gap-2">
              {['Arusha', 'Tarangire', 'Serengeti', 'Ngorongoro', 'Zanzibar'].map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i <= 2 ? 'var(--secondary)' : 'var(--muted)' }} />
                  <span style={{ fontFamily: 'Outfit, sans-serif', color: i <= 2 ? 'var(--secondary)' : 'var(--muted-foreground)', fontWeight: i === 2 ? 600 : 400 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today */}
        <div className="rounded-2xl border overflow-hidden mb-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(26,58,42,0.06)' }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Today</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--foreground)', marginTop: 2 }}>Serengeti National Park</h3>
            </div>
            <div className="text-right">
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--muted-foreground)' }}>🌤 24°C</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'var(--muted-foreground)', marginTop: 1 }}>Partly cloudy</div>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {TODAY_SCHEDULE.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="text-center flex-shrink-0" style={{ minWidth: 44 }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, color: item.done ? 'var(--muted-foreground)' : 'var(--primary)' }}>{item.time}</div>
                </div>
                <div className="w-px self-stretch" style={{ backgroundColor: item.done ? 'var(--muted)' : 'var(--primary)', opacity: 0.3 }} />
                <div className={`flex-1 ${item.done ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--foreground)', textDecoration: item.done ? 'line-through' : 'none' }}>{item.activity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel readiness checklist */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, color: 'var(--foreground)' }}>Travel Readiness</h3>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{completedCount} of {CHECKLIST_ITEMS.length} completed</p>
            </div>
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--muted)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--primary)" strokeWidth="3"
                  strokeDasharray={`${(completedCount / CHECKLIST_ITEMS.length) * 100} 100`} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center"
                style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, fontWeight: 700, color: 'var(--primary)' }}>
                {Math.round((completedCount / CHECKLIST_ITEMS.length) * 100)}%
              </span>
            </div>
          </div>
          <div className="p-5 space-y-2">
            {CHECKLIST_ITEMS.map((item, i) => (
              <button key={i} onClick={() => setCheckDone(d => { const n = [...d]; n[i] = !n[i]; return n })}
                className="w-full flex items-center gap-3 py-2 text-left hover:opacity-80 transition-opacity">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ backgroundColor: checkDone[i] ? 'var(--primary)' : 'var(--muted)', border: checkDone[i] ? 'none' : '1.5px solid var(--border)' }}>
                  {checkDone[i] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: checkDone[i] ? 'var(--muted-foreground)' : 'var(--foreground)', textDecoration: checkDone[i] ? 'line-through' : 'none' }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {!booking && (
          <div className="mt-8 text-center rounded-2xl p-8 border border-dashed" style={{ borderColor: 'var(--border)' }}>
            <div className="text-3xl mb-3">🌍</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--foreground)', marginBottom: 8 }}>No trip booked yet</h3>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--muted-foreground)', marginBottom: 16 }}>Browse our tours and start planning your African adventure.</p>
            <button onClick={() => onNavigate('explore')}
              className="px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--primary)', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
              Explore Tours →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Profile Screen ───────────────────────────────────────────────────────────

function ProfileScreen({ userName, booking, onLogout, onNavigate, onRegister }: { userName: string | null; booking: Booking | null; onLogout: () => void; onNavigate: (v: View) => void; onRegister: () => void }) {
  if (!userName) {
    return (
      <div className="pt-20 pb-24 md:pb-10 flex flex-col items-center justify-center text-center px-5"
        style={{ minHeight: '70vh', backgroundColor: 'var(--background)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>👤</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--foreground)' }}>You're browsing as a guest</h2>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--muted-foreground)', marginTop: 8, maxWidth: 320 }}>
          Create an account to save trips, view your booking history, and get personalized recommendations.
        </p>
        <button onClick={onRegister}
          className="mt-6 px-6 py-3 rounded-full text-white font-semibold"
          style={{ backgroundColor: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>
          Create Account / Sign In
        </button>
      </div>
    )
  }
  const menuItems = [
    { icon: '🎫', label: 'My Bookings', sub: booking ? `1 active · ${booking.ref}` : 'No active bookings', action: () => onNavigate('trips') },
    { icon: '🗺️', label: 'Tour Journey Flow', sub: 'Arusha to Zanzibar route', action: () => onNavigate('trips') },
    { icon: '❤️', label: 'Saved Trips', sub: '3 tours saved', action: () => {} },
    { icon: '📄', label: 'Travel Documents', sub: 'Passport, visa, insurance', action: () => {} },
    { icon: '🔔', label: 'Notifications', sub: 'Trip alerts & offers', action: () => {} },
    { icon: '🌐', label: 'Language & Currency', sub: 'English · USD', action: () => {} },
    { icon: '❓', label: 'Help & Support', sub: '24/7 concierge', action: () => {} },
  ]
  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="pt-20 pb-24 md:pb-10" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-5 md:px-8 py-8" style={{ backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-2xl mx-auto flex items-center gap-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
            style={{ backgroundColor: 'var(--primary)', fontFamily: 'Playfair Display, serif', background: 'linear-gradient(135deg, #1a3a2a, #2a5a3a)' }}>
            {initials}
          </div>
          <div className="flex-1">
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--foreground)' }}>{userName}</h2>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'var(--muted-foreground)', marginTop: 4 }}>HakunaMatataWorld member</p>
            <div className="flex gap-4 mt-3">
              {[{ v: booking ? '1' : '0', l: 'Trips' }, { v: '3', l: 'Saved' }, { v: '4.9★', l: 'Rating' }].map(s => (
                <div key={s.l} className="text-center">
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'var(--foreground)', fontWeight: 600 }}>{s.v}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'var(--muted-foreground)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 md:px-8 py-6 space-y-2">
        {menuItems.map(item => (
          <button key={item.label} onClick={item.action}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-left hover:shadow-sm transition-shadow"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: 'rgba(26,58,42,0.06)' }}>{item.icon}</div>
            <div className="flex-1">
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--foreground)' }}>{item.label}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--muted-foreground)', marginTop: 1 }}>{item.sub}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}

        {/* Support CTA */}
        <div className="rounded-2xl p-5 mt-4" style={{ backgroundColor: 'var(--primary)', background: 'linear-gradient(135deg, #1a3a2a, #2a5a3a)' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#f5f0e8', marginBottom: 8 }}>Need help?</h3>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'rgba(245,240,232,0.65)', marginBottom: 14 }}>Our travel concierge team is available 24/7 for you.</p>
          <div className="flex gap-2">
            {[{ icon: '📞', label: 'Call Us' }, { icon: '💬', label: 'WhatsApp' }].map(btn => (
              <button key={btn.label} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#f5f0e8', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'Outfit, sans-serif' }}>
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onLogout}
          className="w-full py-3.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity mt-2"
          style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', fontFamily: 'Outfit, sans-serif' }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [userName, setUserName] = useState<string | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [view, setView] = useState<View>('home')
  const [activeCategory, setActiveCategory] = useState<Category>('safari')
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view])

  const closeModal = () => setModal({ type: 'none' })
  const navigate = (v: View) => setView(v)

  // BookedPage shown after real booking completion
  if (booking && view === 'booked' as unknown as View) {
    return (
      <BookedPage
        booking={booking}
        userName={userName ?? booking.name}
        onBack={() => { setBooking(null); setView('home') }}
        onLogout={() => { setUserName(null); setBooking(null); setView('home') }}
      />
    )
  }

  const navbarProps = {
    onRegister: () => setModal({ type: 'register' }),
    onLogout: () => { setUserName(null); setBooking(null); setView('home') },
    onHome: () => navigate('home'),
    onNavLink: (id: string) => {
      if (['explore', 'plan', 'trips', 'profile'].includes(id)) { navigate(id as View); return }
      navigate('home')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
    },
    view,
    onNavigate: navigate,
    scrolled: view === 'home' ? scrolled : true,
    userName,
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 0 }}>
      <Navbar {...navbarProps} />

      {/* ── Home ── */}
      {view === 'home' && <>
        <Hero onExplore={() => document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth' })} />
        <StatsTicker />

        <section id="tours" className="py-20 px-5 md:px-8" style={{ backgroundColor: 'var(--background)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>Our Packages</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--foreground)' }}>Choose Your Adventure</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">From the golden Serengeti plains to the snow cap of Kilimanjaro and the turquoise waters of Zanzibar.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {CATEGORIES.map((cat) => (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                  id={cat.key === 'safari' ? 'safaris' : cat.key === 'kilimanjaro' ? 'kilimanjaro' : 'zanzibar'}
                  className="relative rounded-xl overflow-hidden text-left transition-all duration-300 bg-muted"
                  style={{ height: 160, border: '2px solid', borderColor: activeCategory === cat.key ? 'var(--primary)' : 'var(--border)', boxShadow: activeCategory === cat.key ? '0 4px 20px rgba(26,58,42,0.2)' : 'none' }}>
                  <img src={CATEGORY_IMAGES[cat.key]} alt={cat.label} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: activeCategory === cat.key ? 0.65 : 0.5 }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-white font-semibold text-base leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.label}</div>
                        <div className="text-white/60 text-xs mt-0.5">{cat.subtitle}</div>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ml-2"
                        style={{ backgroundColor: activeCategory === cat.key ? 'var(--accent)' : 'rgba(255,255,255,0.15)', color: activeCategory === cat.key ? 'var(--accent-foreground)' : 'white' }}>
                        {cat.count}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.filter((t) => t.category === activeCategory).map((tour) => (
                <TourCard key={tour.id} tour={tour} onSelect={() => setModal({ type: 'tour', tour })} />
              ))}
            </div>
          </div>
        </section>

        <ExperienceCategories onNavigate={navigate} />
        <TourJourneyFlow />
        <ReviewsSection />
        <GallerySection />
        <WhyUs />
        <Destinations />
        <Contact />
        <Footer onRegister={() => setModal({ type: 'register' })} />
      </>}

      {/* ── Explore ── */}
      {view === 'explore' && <ExploreScreen onSelectTour={t => setModal({ type: 'tour', tour: t })} />}

      {/* ── Plan ── */}
      {view === 'plan' && <PlanScreen onNavigate={navigate} />}

      {/* ── My Trips ── */}
      {view === 'trips' && <TripsScreen booking={booking} onNavigate={navigate} />}

      {/* ── Profile ── */}
      {view === 'profile' && (
        <ProfileScreen
          userName={userName}
          booking={booking}
          onLogout={() => { setUserName(null); setBooking(null); setView('home') }}
          onNavigate={navigate}
          onRegister={() => setModal({ type: 'register' })}
        />
      )}

      {/* Mobile bottom nav */}
      <BottomNav view={view} onNavigate={navigate} userName={userName} />

      {/* Modals */}
      {modal.type === 'tour' && (
        <TourModal tour={modal.tour} onClose={closeModal} onBook={() => setModal({ type: 'booking', tour: modal.tour })} />
      )}
      {modal.type === 'booking' && (
        <BookingModal tour={modal.tour} onClose={closeModal} onBooked={b => { setBooking(b); setModal({ type: 'none' }); navigate('trips') }} />
      )}
      {modal.type === 'register' && <RegisterModal onClose={closeModal} onAuth={name => setUserName(name)} />}
    </div>
  )
}
