// India state → cities mapping
export const statesAndCities = {
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Delhi": ["New Delhi", "Dwarka", "Rohini", "Noida", "Gurugram"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
};

// City center coordinates
export const cityCenters = {
  Chennai: [13.0827, 80.2707],
  Coimbatore: [11.0168, 76.9558],
  Madurai: [9.9252, 78.1198],
  Tiruchirappalli: [10.7905, 78.7047],
  Salem: [11.6643, 78.1460],
  Bengaluru: [12.9716, 77.5946],
  Mysuru: [12.2958, 76.6394],
  Mangaluru: [12.9141, 74.8560],
  Hubballi: [15.3647, 75.1240],
  Belagavi: [15.8497, 74.4977],
  Mumbai: [19.0760, 72.8777],
  Pune: [18.5204, 73.8567],
  Nagpur: [21.1458, 79.0882],
  Nashik: [19.9975, 73.7898],
  Aurangabad: [19.8762, 75.3433],
  Hyderabad: [17.3850, 78.4867],
  Warangal: [17.9784, 79.5941],
  Nizamabad: [18.6726, 78.0940],
  Karimnagar: [18.4386, 79.1288],
  Khammam: [17.2473, 80.1514],
  "New Delhi": [28.6139, 77.2090],
  Dwarka: [28.5921, 77.0460],
  Rohini: [28.7489, 77.0697],
  Noida: [28.5355, 77.3910],
  Gurugram: [28.4595, 77.0266],
  Kolkata: [22.5726, 88.3639],
  Howrah: [22.5958, 88.2636],
  Durgapur: [23.5204, 87.3119],
  Asansol: [23.6832, 86.9820],
  Siliguri: [26.7271, 88.3953],
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311],
  Vadodara: [22.3072, 73.1812],
  Rajkot: [22.3039, 70.8022],
  Bhavnagar: [21.7645, 72.1519],
  Jaipur: [26.9124, 75.7873],
  Jodhpur: [26.2389, 73.0243],
  Udaipur: [24.5854, 73.7125],
  Kota: [25.2138, 75.8648],
  Ajmer: [26.4499, 74.6399],
  Lucknow: [26.8467, 80.9462],
  Kanpur: [26.4499, 80.3319],
  Agra: [27.1767, 78.0081],
  Varanasi: [25.3176, 82.9739],
  Allahabad: [25.4358, 81.8463],
  Thiruvananthapuram: [8.5241, 76.9366],
  Kochi: [9.9312, 76.2673],
  Kozhikode: [11.2588, 75.7804],
  Thrissur: [10.5276, 76.2144],
  Kollam: [8.8932, 76.6141],
};

// Keywords that strongly indicate a government facility (case-insensitive)
// Used client-side to filter OSM results
export const govKeywords = [
  "government", "govt", "gov ", "g\\.h\\.", " gh ",
  "corporation", "municipal", "district", "collectorate", "collector",
  "taluk", "tahsildar", "panchayat", "zilla",
  "primary health", "community health", "phc", "chc",
  "civil hospital", "general hospital", "public hospital",
  "esi ", "esic", "esi hospital",
  "medical college", "kilpauk", "jipmer", "aiims", "pgimer",
  "military", "army", "air force", "navy", "coast guard", "bsf", "crpf",
  "railway", "central railway", "southern railway",
  "post office", "speed post", "india post",
  "police", "thana", "thane",
  "court", "tribunal", "sessions", "high court", "magistrate",
  "secretariat", "mantralaya",
  "sbi", "state bank", "bank of india", "canara bank", "union bank",
  "punjab national", "pnb", "bank of baroda", "central bank", "uco bank",
  "indian bank", "allahabad bank", "syndicate bank", "andhra bank",
  "epfo", "provident fund", "pf office",
  "registration office", "sub registrar", "registrar",
  "ration", "pds", "fair price",
  "anganwadi", "icds",
  "pwd", "public works",
  "fire station", "fire brigade",
  "ration shop", "ration store",
  "income tax", "gst office", "customs",
  "tehsil", "mandal", "block office",
];

// Building categories — queries fetch broadly, client filters by gov keywords
export const buildingCategories = [
  {
    id: "hospital",
    label: "Government Hospitals",
    icon: "🏥",
    color: "#e74c3c",
    // Fetch ALL hospitals, then filter client-side
    overpassTags: [
      { node: true, way: true, tags: { amenity: "hospital" } },
      { node: true, way: true, tags: { amenity: "clinic", "operator:type": "government" } },
      { node: true, way: true, tags: { healthcare: "hospital" } },
    ],
    filterByGovKeywords: true,
    // Also include anything explicitly tagged as government
    includeIfTag: { "operator:type": "government" },
  },
  {
    id: "pf_office",
    label: "PF / EPFO Offices",
    icon: "🏛️",
    color: "#8e44ad",
    overpassTags: [
      { node: true, way: true, tags: { office: "government" } },
      { node: true, way: true, tags: { amenity: "public_building" } },
    ],
    filterByGovKeywords: true,
    nameKeywords: ["provident fund", "epfo", "pf office", "employees provident"],
  },
  {
    id: "revenue",
    label: "Revenue / Tahsildar",
    icon: "📋",
    color: "#e67e22",
    overpassTags: [
      { node: true, way: true, tags: { office: "government" } },
      { node: true, way: true, tags: { amenity: "townhall" } },
      { node: true, way: true, tags: { amenity: "public_building" } },
    ],
    filterByGovKeywords: true,
    nameKeywords: ["tahsildar", "revenue", "collectorate", "collector", "district office", "tehsil", "mandal", "taluk office"],
  },
  {
    id: "registration",
    label: "Registration Dept",
    icon: "📝",
    color: "#2980b9",
    overpassTags: [
      { node: true, way: true, tags: { office: "government" } },
      { node: true, way: true, tags: { amenity: "public_building" } },
    ],
    filterByGovKeywords: true,
    nameKeywords: ["registration", "sub registrar", "registrar office", "stamp"],
  },
  {
    id: "ration_shop",
    label: "Ration / PDS Offices",
    icon: "🏪",
    color: "#27ae60",
    // In OSM India, PDS offices are tagged as office=government with PDS-related names.
    // e.g. "Tamil Nadu Public Distribution Scheme Service Office" (TNPDS)
    // Also catches: shop=convenience with operator:type=public (a few are tagged this way)
    overpassTags: [
      { node: true, way: true, tags: { office: "government" } },
      { node: true, way: true, tags: { shop: "convenience", "operator:type": "public" } },
      { node: true, way: true, tags: { shop: "convenience", "operator:type": "government" } },
    ],
    filterByGovKeywords: true,
    nameKeywords: [
      "ration", "pds", "public distribution", "civil supplies",
      "tncsc", "tnpds", "fair price", "fps",
      "food corporation of india", "food supply", "annapoorna",
      "kerosene", "essential commodities",
    ],
  },
  {
    id: "uphc",
    label: "UPHC / Primary Health",
    icon: "🩺",
    color: "#c0392b",
    // UPHCs in OSM India are tagged healthcare=centre, often without amenity tag
    // PHCs (Primary Health Centres) share the same tag pattern
    overpassTags: [
      { node: true, way: true, tags: { healthcare: "centre" } },
      { node: true, way: true, tags: { amenity: "clinic", "operator:type": "government" } },
      { node: true, way: true, tags: { amenity: "clinic", "operator:type": "public" } },
    ],
    filterByGovKeywords: true,
    nameKeywords: [
      "uphc", "urban primary health", "urban health centre", "urban health center",
      "uhp", "primary health centre", "primary health center", "phc", "chc",
      "community health centre", "community health center",
      "dispensary", "govt dispensary", "government dispensary",
      "corporation dispensary", "municipal dispensary",
      "health post", "sub centre", "subcentre",
    ],
  },
  {
    label: "Police Stations",
    icon: "👮",
    color: "#2c3e50",
    overpassTags: [
      { node: true, way: true, tags: { amenity: "police" } },
    ],
    filterByGovKeywords: false, // All police are government
  },
  {
    id: "post_office",
    label: "Post Offices",
    icon: "📮",
    color: "#f39c12",
    overpassTags: [
      { node: true, way: true, tags: { amenity: "post_office" } },
    ],
    filterByGovKeywords: false, // All post offices are government in India
  },
  {
    id: "court",
    label: "Courts",
    icon: "⚖️",
    color: "#7f8c8d",
    overpassTags: [
      { node: true, way: true, tags: { amenity: "courthouse" } },
    ],
    filterByGovKeywords: false,
  },
  {
    id: "bank",
    label: "Government Banks",
    icon: "🏦",
    color: "#1abc9c",
    overpassTags: [
      { node: true, way: true, tags: { amenity: "bank" } },
    ],
    filterByGovKeywords: true,
    nameKeywords: [
      "sbi", "state bank", "bank of india", "canara bank", "union bank",
      "punjab national", "pnb", "bank of baroda", "central bank", "uco bank",
      "indian bank", "allahabad bank", "syndicate bank", "andhra bank",
      "maharashtra bank", "bank of maharashtra",
    ],
  },
  {
    id: "school",
    label: "Government Schools",
    icon: "🏫",
    color: "#d35400",
    overpassTags: [
      { node: true, way: true, tags: { amenity: "school" } },
    ],
    filterByGovKeywords: true,
    // "govt." with dot, "aided", "higher secondary" combos, corporation schools etc.
    nameKeywords: [
      "government", "govt", "govt.", "g.h.s", "ghss", "ghps",
      "municipal", "corporation", "panchayat union", "panchayat",
      "kendriya vidyalaya", "kv ", "jawahar navodaya", "navodaya", "jnv",
      "aided", "model school", "kasturba", "eklavya",
      "zila parishad", "zilla parishad", "nagar palika",
    ],
  },
];
