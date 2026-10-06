// Seed catalog for StayNest: users + listings.
// Consumed by prisma/seed.js. Everyone's password is seeded as "1234".

const sampleUsers = [
  // --- Hosts ---
  { email: "neha.kulkarni@gmail.com", username: "nehak", fullName: "Neha Kulkarni", phone: "+91 98220 41167", bio: "Left a corporate job in Pune to run a handful of little places on the Goan coast. Ask me for the best sunset spots that aren't in the guidebooks.", isHost: true, role: "host" },
  { email: "rohit.bhatia@gmail.com", username: "rohitb", phone: "9816044521", fullName: "Rohit Bhatia", bio: "Ex-mountaineer, now mostly make sure the bukhari is lit before guests arrive.", isHost: true, role: "host" },
  { email: "farhan.sheikh@gmail.com", username: "farhansk", fullName: "Farhan Sheikh", phone: "+91-9829011456", bio: "My family has run this haveli for four generations. Happy to point you to the good street food, not just the tourist stuff.", isHost: true, role: "host" },
  { email: "sanjay.purohit@gmail.com", username: "sanjayp", fullName: "Sanjay Purohit", phone: null, bio: null, isHost: true, role: "host" },
  { email: "meenakshi.iyer@gmail.com", username: "meenu_iyer", fullName: "Meenakshi Iyer", phone: "+91 94470 12398", bio: null, isHost: true, role: "host" },
  { email: "devika.menon@gmail.com", username: "devika.m", fullName: "Devika Menon", phone: "+91 9847712233", bio: "Grew up on the backwaters, still haven't gotten tired of them.", isHost: true, role: "host" },
  { email: "arvind.shetty@gmail.com", username: "arvinds", fullName: "Arvind Shetty", phone: "+91 94481 55620", bio: "Third-generation coffee planter. Free plantation walk with every stay, no extra charge.", isHost: true, role: "host" },
  { email: "ritu.chawla@gmail.com", username: "chawla.ritu", fullName: "Ritu Chawla", phone: "9822011098", bio: "Weekend host, weekday marketing manager in Mumbai. Replies fastest after 7pm.", isHost: true, role: "host" },
  { email: "imran.qureshi@gmail.com", username: "imranq", fullName: "Imran Qureshi", phone: "+91 98200 33321", bio: null, isHost: true, role: "host" },
  { email: "marco.silva@gmail.com", username: "marco.silva", fullName: "Marco Silva", phone: null, bio: "Property manager for a few flats across three cities. My team handles check-in even when I'm travelling.", isHost: true, role: "host" },
  { email: "tenzin.norbu@gmail.com", username: "tenzin_n", fullName: "Tenzin Norbu", phone: "+91 94191 22087", bio: "Grew up in Leh, still can't get over these mountains every morning.", isHost: true, role: "host" },
  { email: "priyanka.das@gmail.com", username: "priyanka.das", fullName: "Priyanka Das", phone: "+91 90641 78823", bio: null, isHost: true, role: "host" },
  { email: "karan.oberoi@gmail.com", username: "karanoberoi", fullName: "Karan Oberoi", phone: "9897123456", bio: "Certified rafting instructor, occasional host when the season's slow.", isHost: true, role: "host" },
  { email: "suresh.naidu@gmail.com", username: "suresh_naidu", fullName: "Suresh Naidu", phone: null, bio: null, isHost: true, role: "host" },
  { email: "ayesha.contractor@gmail.com", username: "ayesha.c", fullName: "Ayesha Contractor", phone: "+91 94433 20087", bio: "French Quarter regular, three cats, one very old house.", isHost: true, role: "host" },
  { email: "deepak.agarwal@gmail.com", username: "deepakag", fullName: "Deepak Agarwal", phone: "+91 9415067234", bio: null, isHost: true, role: "host" },
  { email: "vikram.rathore@gmail.com", username: "vik.rathore", fullName: "Vikram Rathore", phone: "9880112233", bio: "History nerd — will talk your ear off about the ruins if you let me.", isHost: true, role: "admin" },
  { email: "elena.kovac@gmail.com", username: "elena.k", fullName: "Elena Kovač", phone: "+41 79 220 5541", bio: "Based between Bali and Zurich, managing a small portfolio of design-forward homes.", isHost: true, role: "host" },

  // --- Guests ---
  { email: "demo@gmail.com", username: "demouser", fullName: "Demo User", phone: null, bio: null, isHost: false, role: "user" },
  { email: "priya.venkatesh@gmail.com", username: "priya.v", fullName: "Priya Venkatesh", phone: "+91 99887 76655", bio: "Food blogger. Will judge your kitchen amenities.", isHost: false, role: "user" },
  { email: "arjun.kapoor@gmail.com", username: "arjunk92", fullName: "Arjun Kapoor", phone: null, bio: null, isHost: false, role: "user" },
  { email: "tanya.sen@gmail.com", username: "tanya_sen", fullName: "Tanya Sen", phone: "+91 98333 44556", bio: "Photographer. Always looking for good light.", isHost: false, role: "user" },
  { email: "kavya.reddy@gmail.com", username: "kavya.r", fullName: "Kavya Reddy", phone: "9700123456", bio: null, isHost: false, role: "user" },
  { email: "nikhil.bansal@gmail.com", username: "nikhilb", fullName: "Nikhil Bansal", phone: "+91 98111 22456", bio: "Weekend trekker from Delhi.", isHost: false, role: "user" },
  { email: "simran.kaur@gmail.com", username: "simran.k", fullName: "Simran Kaur", phone: null, bio: null, isHost: false, role: "user" },
  { email: "aditya.rao@gmail.com", username: "adityarao", fullName: "Aditya Rao", phone: "+91 90080 44112", bio: "Remote dev — I need decent wifi wherever I go.", isHost: false, role: "user" },
  { email: "pooja.nair@gmail.com", username: "pooja_nair", fullName: "Pooja Nair", phone: null, bio: null, isHost: false, role: "user" },
  { email: "rahul.verma@gmail.com", username: "rahul.verma7", fullName: "Rahul Verma", phone: "9871234509", bio: null, isHost: false, role: "user" },
  { email: "sneha.joshi@gmail.com", username: "snehaj", fullName: "Sneha Joshi", phone: "+91 98200 91122", bio: "Traveling with my dog, so pet policy is the first thing I check.", isHost: false, role: "user" },
  { email: "amitabh.sinha@gmail.com", username: "amitabhs", fullName: "Amitabh Sinha", phone: null, bio: null, isHost: false, role: "user" },
  { email: "divya.krishnan@gmail.com", username: "divya.k", fullName: "Divya Krishnan", phone: "+91 94860 33221", bio: "Trying to visit every hill station in South India before I turn 30.", isHost: false, role: "user" },
  { email: "vivek.malhotra@gmail.com", username: "vivekm", fullName: "Vivek Malhotra", phone: "9811233445", bio: null, isHost: false, role: "user" },
  { email: "ishita.bose@gmail.com", username: "ishita.bose", fullName: "Ishita Bose", phone: null, bio: "Bookworm, prefer quiet stays over party ones.", isHost: false, role: "user" },
  { email: "rajesh.pillai@gmail.com", username: "rajesh_pillai", fullName: "Rajesh Pillai", phone: "+91 94470 88213", bio: null, isHost: false, role: "user" },
  { email: "anushka.desai@gmail.com", username: "anushka.d", fullName: "Anushka Desai", phone: null, bio: null, isHost: false, role: "user" },
  { email: "manoj.tiwari@gmail.com", username: "manojt", fullName: "Manoj Tiwari", phone: "9415067234", bio: null, isHost: false, role: "user" },
  { email: "neha.kapoor@gmail.com", username: "neha.kap", fullName: "Neha Kapoor", phone: "+91 98110 22987", bio: "Second time using StayNest — first stay was in Coorg and it spoiled me.", isHost: false, role: "user" },
  { email: "suresh.bhatt@gmail.com", username: "suresh_b", fullName: "Suresh Bhatt", phone: null, bio: null, isHost: false, role: "user" },
  { email: "kritika.mehra@gmail.com", username: "kritika.m", fullName: "Kritika Mehra", phone: "+91 98920 11743", bio: "Plan everything three months in advance, sorry not sorry.", isHost: false, role: "user" },
  { email: "yash.thakur@gmail.com", username: "yasht", fullName: "Yash Thakur", phone: null, bio: null, isHost: false, role: "user" },
  { email: "alok.chaturvedi@gmail.com", username: "alokc", fullName: "Alok Chaturvedi", phone: "9450112233", bio: null, isHost: false, role: "user" },
  { email: "meghna.pillai@gmail.com", username: "meghna_p", fullName: "Meghna Pillai", phone: "+91 90360 22187", bio: "Solo female traveler. Always read the reviews twice before booking.", isHost: false, role: "user" },
  { email: "harish.kumar@gmail.com", username: "harishk", fullName: "Harish Kumar", phone: null, bio: null, isHost: false, role: "user" },
  { email: "swati.agnihotri@gmail.com", username: "swati.a", fullName: "Swati Agnihotri", phone: "+91 98765 10023", bio: null, isHost: false, role: "user" },
  { email: "faisal.ahmed@gmail.com", username: "faisal_a", fullName: "Faisal Ahmed", phone: "9836044521", bio: "Cricket, biryani, and long weekend getaways, roughly in that order.", isHost: false, role: "user" },
  { email: "ramesh.gowda@gmail.com", username: "rameshg", fullName: "Ramesh Gowda", phone: null, bio: null, isHost: false, role: "user" },
  { email: "lakshmi.n@gmail.com", username: "lakshmi_n", fullName: "Lakshmi Narayanan", phone: "+91 94422 66710", bio: null, isHost: false, role: "user" },
  { email: "james.whitfield@gmail.com", username: "jwhitfield", fullName: "James Whitfield", phone: "+91 98450 77621", bio: "British expat living in Bengaluru, spending most weekends exploring the rest of the country.", isHost: false, role: "user" },
  { email: "sofia.marin@gmail.com", username: "sofia.marin", fullName: "Sofia Marín", phone: "+34 611 224 590", bio: "Backpacking through South Asia for a few months.", isHost: false, role: "user" },
  { email: "chen.wei@gmail.com", username: "chen_wei", fullName: "Chen Wei", phone: null, bio: null, isHost: false, role: "user" },
];

// Deterministic, distinct placeholder avatar per user (pravatar.cc serves stable real face photos by index).
sampleUsers.forEach((u, i) => {
  u.profileImageUrl = `https://i.pravatar.cc/300?img=${(i % 70) + 1}`;
});

// ------------------------------------------------------------------
// Listings catalog
// ------------------------------------------------------------------

const IMAGES = {
  "beach-house": [
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
  ],
  villa: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
  ],
  apartment: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
  ],
  house: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
  ],
  cottage: [
    "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop",
  ],
  cabin: [
    "https://images.unsplash.com/photo-1518602164578-cd0074062767?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
  ],
  "mountain-lodge": [
    "https://images.unsplash.com/photo-1518602164578-cd0074062767?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=1200&auto=format&fit=crop",
  ],
  hotel: [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
  ],
  camping: [
    "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=1200&auto=format&fit=crop",
  ],
  farmhouse: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=1200&auto=format&fit=crop",
  ],
  "guest-house": [
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop",
  ],
  resort: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
  ],
  bungalow: [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop",
  ],
};

const AMENITY_BIAS = {
  "beach-house": ["wifi", "air-conditioning", "kitchen", "hot-water", "tv", "free-parking", "swimming-pool", "pet-friendly", "workspace", "washing-machine"],
  villa: ["wifi", "swimming-pool", "air-conditioning", "kitchen", "free-parking", "tv", "hot-water", "workspace", "washing-machine", "pet-friendly"],
  apartment: ["wifi", "workspace", "tv", "air-conditioning", "washing-machine", "kitchen", "hot-water", "free-parking", "swimming-pool", "pet-friendly"],
  house: ["wifi", "kitchen", "free-parking", "hot-water", "tv", "washing-machine", "air-conditioning", "workspace", "pet-friendly", "swimming-pool"],
  cottage: ["wifi", "hot-water", "kitchen", "free-parking", "tv", "pet-friendly", "workspace", "air-conditioning", "washing-machine", "swimming-pool"],
  cabin: ["hot-water", "wifi", "kitchen", "free-parking", "tv", "pet-friendly", "workspace", "air-conditioning", "washing-machine", "swimming-pool"],
  "mountain-lodge": ["hot-water", "wifi", "free-parking", "kitchen", "tv", "workspace", "pet-friendly", "air-conditioning", "washing-machine", "swimming-pool"],
  hotel: ["wifi", "air-conditioning", "tv", "hot-water", "workspace", "free-parking", "kitchen", "washing-machine", "swimming-pool", "pet-friendly"],
  camping: ["hot-water", "free-parking", "wifi", "kitchen", "tv", "pet-friendly", "workspace", "air-conditioning", "washing-machine", "swimming-pool"],
  farmhouse: ["free-parking", "kitchen", "pet-friendly", "hot-water", "wifi", "tv", "workspace", "air-conditioning", "washing-machine", "swimming-pool"],
  "guest-house": ["wifi", "hot-water", "kitchen", "tv", "free-parking", "workspace", "air-conditioning", "washing-machine", "pet-friendly", "swimming-pool"],
  resort: ["wifi", "swimming-pool", "air-conditioning", "tv", "hot-water", "kitchen", "free-parking", "workspace", "washing-machine", "pet-friendly"],
  bungalow: ["wifi", "free-parking", "kitchen", "hot-water", "tv", "air-conditioning", "pet-friendly", "workspace", "washing-machine", "swimming-pool"],
};

const AMENITY_LABELS = {
  wifi: "wifi", "air-conditioning": "air conditioning", kitchen: "a kitchen", "free-parking": "free parking",
  "washing-machine": "a washing machine", "swimming-pool": "a swimming pool", "pet-friendly": "pet-friendly rules",
  tv: "a TV", workspace: "a workspace", "hot-water": "hot water",
};

function humanize(list) {
  const words = list.map((a) => AMENITY_LABELS[a] || a);
  if (words.length === 1) return words[0];
  return words.slice(0, -1).join(", ") + " and " + words[words.length - 1];
}

const AMENITY_LINES = [
  (a) => `Comes with ${humanize(a)}.`,
  (a) => `Expect ${humanize(a)} — nothing fancy, everything works.`,
  (a) => `The place has ${humanize(a)}.`,
  (a) => `You'll have ${humanize(a)} for the stay.`,
  (a) => `On offer: ${humanize(a)}.`,
];

const CLOSERS = [
  "Message the host before booking if you're arriving after 9pm.",
  "Great base for exploring the area on foot or by scooter.",
  "Best for 2-4 guests rather than large groups.",
  "Breakfast can be arranged on request for an extra charge.",
  "Parking is available right outside.",
  "Check-in is flexible — just share your train or flight time.",
  "Longer stays welcome, ask about a discount for a week or more.",
  "",
  "The host lives nearby and usually replies within the hour.",
  "Photos are recent and match what you'll see in person.",
  "",
  "Best experienced outside peak monsoon season.",
  "Ten minutes from the nearest ATM and pharmacy.",
  "Popular with both solo travellers and couples.",
];

function buildDescription(hint, amenities, idx) {
  const amenityLine = AMENITY_LINES[idx % AMENITY_LINES.length](amenities);
  const closer = CLOSERS[idx % CLOSERS.length];
  return closer ? `${hint} ${amenityLine} ${closer}` : `${hint} ${amenityLine}`;
}

function pickAmenities(category, idx) {
  const bias = AMENITY_BIAS[category] || AMENITY_BIAS.house;
  const count = 4 + (idx % 4); // 4..7
  return bias.slice(0, count);
}

function pickImages(category, idx) {
  const pool = IMAGES[category] || IMAGES.house;
  const first = pool[idx % pool.length];
  const second = pool[(idx + 1) % pool.length];
  return [first, second];
}

const HOST = {
  neha: "neha.kulkarni@gmail.com", rohit: "rohit.bhatia@gmail.com", farhan: "farhan.sheikh@gmail.com",
  sanjay: "sanjay.purohit@gmail.com", meenakshi: "meenakshi.iyer@gmail.com", devika: "devika.menon@gmail.com",
  arvind: "arvind.shetty@gmail.com", ritu: "ritu.chawla@gmail.com", imran: "imran.qureshi@gmail.com",
  marco: "marco.silva@gmail.com", tenzin: "tenzin.norbu@gmail.com", priyanka: "priyanka.das@gmail.com",
  karan: "karan.oberoi@gmail.com", suresh: "suresh.naidu@gmail.com", ayesha: "ayesha.contractor@gmail.com",
  deepak: "deepak.agarwal@gmail.com", vikram: "vikram.rathore@gmail.com", elena: "elena.kovac@gmail.com",
};

// [title, location, country, category, price, hostKey, hint]
const RAW = [
  // --- Neha: Goa, Gokarna, Andaman ---
  ["Beachfront Cottage, 2 Min Walk to Calangute Beach", "Calangute, Goa", "India", "beach-house", 4800, "neha", "Right off the road that leads down to Calangute beach, past the fish market stalls."],
  ["Studio Above a Working Cashew Farm, Calangute", "Calangute, Goa", "India", "apartment", 2600, "neha", "Set behind a small family-run cashew farm, about a 10-minute walk from the beach."],
  ["3BHK Pool Villa off Candolim Road", "Calangute, Goa", "India", "villa", 9500, "neha", "A gated villa on the quieter Candolim side, with parking for two cars."],
  ["Baga Beach Loft with Rooftop Seating", "Baga, Goa", "India", "apartment", 3900, "neha", "Above a bakery on the main Baga road, five minutes from Tito's Lane."],
  ["Wooden Beach Shack, Baga Riverside", "Baga, Goa", "India", "beach-house", 3200, "neha", "Built on stilts where the Baga river meets the sea, popular with the shack-hopping crowd."],
  ["Party-Season Villa Near Tito's Lane", "Baga, Goa", "India", "villa", 11000, "neha", "Loud neighbourhood after 10pm — good for groups who want to be close to the clubs."],
  ["Anjuna Flea Market Studio", "Anjuna, Goa", "India", "apartment", 3100, "neha", "Five-minute walk to the Wednesday flea market, gets busy on market days."],
  ["Cliffside A-Frame Cabin, Anjuna", "Anjuna, Goa", "India", "beach-house", 5600, "neha", "Perched on the laterite cliffs above Anjuna beach with a straight drop to the water."],
  ["Boho Garden Villa Near Curlies", "Anjuna, Goa", "India", "villa", 8200, "neha", "A short walk from Curlies and the rest of the beach shacks, quiet during the day."],
  ["Vagator Fort View Cottage", "Vagator, Goa", "India", "cottage", 4400, "neha", "Overlooks Chapora Fort from the back terrace, especially good at sunset."],
  ["Chapora Fort Road Pool Villa", "Vagator, Goa", "India", "villa", 10800, "neha", "On the road up to Chapora Fort, the pool is shared between two villas only."],
  ["Morjim Turtle Beach Bamboo Cottage", "Morjim, Goa", "India", "cottage", 4200, "neha", "Close to the Olive Ridley turtle nesting stretch, no loud music allowed after 11pm."],
  ["Russian Quarter Apartment, Morjim", "Morjim, Goa", "India", "apartment", 3600, "neha", "In the part of Morjim locals call the Russian quarter — most signage here is in Cyrillic too."],
  ["Ashwem Border Luxury Villa", "Morjim, Goa", "India", "villa", 13500, "neha", "Right on the Ashwem-Morjim border, five minutes from La Plage."],
  ["Restored Portuguese Home, Assagao Village", "Assagao, Goa", "India", "house", 7200, "neha", "An old Portuguese-era house in the village core, restored but keeping the original tiled floor."],
  ["Assagao Designer Studio with Plunge Pool", "Assagao, Goa", "India", "apartment", 6000, "neha", "New build behind one of the village cafes, with a small plunge pool on the terrace."],
  ["Palolem Beach Hut on Stilts", "Palolem, Goa", "India", "beach-house", 2800, "neha", "Right on the sand at Palolem — you can hear the waves from the bed."],
  ["Palolem Silent Zone Bamboo Bungalow", "Palolem, Goa", "India", "bungalow", 3300, "neha", "In the designated silent zone at the south end of the beach — no speakers allowed."],
  ["Agonda Beach Coconut Grove Hut", "Agonda, Goa", "India", "beach-house", 2600, "neha", "Set back in a coconut grove, a two-minute walk from Agonda beach."],
  ["Agonda Yoga Retreat Room", "Agonda, Goa", "India", "guest-house", 2200, "neha", "Attached to a small yoga shala that runs morning classes; guests get a discount on drop-ins."],
  ["Cavelossim Riverside Villa", "Cavelossim, Goa", "India", "villa", 8800, "neha", "Backs onto the Sal river — good for kayaking in the early mornings."],
  ["Arossim Beach Family Bungalow", "Cavelossim, Goa", "India", "bungalow", 5400, "neha", "Walking distance from the big resorts on Arossim beach, at a fraction of the price."],
  ["Latin Quarter Heritage House, Fontainhas", "Fontainhas, Panjim, Goa", "India", "house", 5100, "neha", "One of the yellow houses in old Fontainhas — steep stairs, no lift."],
  ["Fontainhas Room Above a Bakery", "Fontainhas, Panjim, Goa", "India", "guest-house", 2400, "neha", "Above a Goan bakery that starts baking at 6am — the smell of poi bread wakes you up."],
  ["Om Beach Cliffside Hut", "Gokarna, Karnataka", "India", "beach-house", 3000, "neha", "Up on the headland between Om beach's two coves, with steps down to the water."],
  ["Kudle Beach View Cottage", "Gokarna, Karnataka", "India", "cottage", 3400, "neha", "First row on Kudle beach — no road noise, since cars can't reach this stretch."],
  ["Radhanagar Beach Bamboo Villa, Havelock Island", "Havelock Island, Andaman", "India", "beach-house", 9000, "neha", "A short walk to Radhanagar beach; ferries from Port Blair take about two hours."],
  ["Scuba Camp Cabin, Havelock", "Havelock Island, Andaman", "India", "cabin", 6500, "neha", "Run alongside a scuba diving centre — ask about combined stay-and-dive packages."],

  // --- Rohit: Himachal / Manali belt ---
  ["Riverside Timber Lodge, Old Manali", "Old Manali, Himachal Pradesh", "India", "mountain-lodge", 4900, "rohit", "Right on the Manalsu river bank — the sound of the water is constant."],
  ["Old Manali Cafe-Street Room", "Old Manali, Himachal Pradesh", "India", "guest-house", 3200, "rohit", "Above one of the cafes on the main Old Manali lane, walkable to everything."],
  ["Log House with Apple Orchard View", "Old Manali, Himachal Pradesh", "India", "cabin", 5300, "rohit", "Surrounded by a small apple orchard that belongs to the host's family."],
  ["Solang Valley Pine Chalet", "Solang Valley, Himachal Pradesh", "India", "cabin", 6500, "rohit", "Close to the paragliding and ropeway point; snow is usually visible from November."],
  ["Solang Meadow View Cottage", "Solang Valley, Himachal Pradesh", "India", "cottage", 5800, "rohit", "Set back from the main tourist strip, quieter than the chalets near the ropeway."],
  ["Naggar Castle Road Cottage", "Naggar, Himachal Pradesh", "India", "cottage", 4600, "rohit", "Ten minutes from Naggar Castle, and far less crowded than the main Manali market."],
  ["Parvati Riverside Camp, Kasol", "Kasol, Himachal Pradesh", "India", "camping", 2600, "rohit", "Tents pitched right along the Parvati river, popular with the backpacker crowd."],
  ["Kasol Israeli Quarter Room", "Kasol, Himachal Pradesh", "India", "guest-house", 2400, "rohit", "Above a hummus place on the main Kasol lane — menus here are in Hebrew too."],
  ["Tosh Village Wooden Room", "Tosh, Himachal Pradesh", "India", "guest-house", 2100, "rohit", "Last village before the trek to Kheerganga; network gets patchy past this point."],
  ["Tosh Apple Orchard Cabin", "Tosh, Himachal Pradesh", "India", "cabin", 3300, "rohit", "Set in an apple orchard on the edge of the village, with wide valley views."],
  ["Jibhi Riverfront Wooden Cabin", "Jibhi, Himachal Pradesh", "India", "cabin", 4300, "rohit", "Right above the Tirthan river; the waterfall walk starts just outside the gate."],
  ["Jibhi Slate-Roof Cottage", "Jibhi, Himachal Pradesh", "India", "cottage", 4700, "rohit", "Traditional Himachali slate-roof construction — one of the oldest homes in the lane."],
  ["Bir Paragliding Landing Site Homestay", "Bir, Himachal Pradesh", "India", "guest-house", 2900, "rohit", "A two-minute walk from the paragliding landing ground, popular with pilots."],
  ["Dharamkot Forest Edge Cottage", "Dharamkot, Himachal Pradesh", "India", "cottage", 3800, "rohit", "At the edge of the deodar forest above McLeod Ganj, quiet aside from birdsong."],
  ["McLeod Ganj Monastery View Room", "Dharamkot, Himachal Pradesh", "India", "guest-house", 2700, "rohit", "Overlooks the Tibetan monastery — morning prayer chants are audible from the balcony."],
  ["Kasauli Pine Glasshouse", "Kasauli, Himachal Pradesh", "India", "bungalow", 3600, "rohit", "Small glass-fronted room in a pine grove just off the Mall Road."],
  ["Kasauli Cantonment Cottage", "Kasauli, Himachal Pradesh", "India", "cottage", 4100, "rohit", "Inside the old cantonment area — ID may be checked at the entry gate."],
  ["Dalhousie Snow View Pine Cottage", "Dalhousie, Himachal Pradesh", "India", "cottage", 5200, "rohit", "Faces Dainkund peak; snowfall is usual between late December and February."],
  ["Shimla Mall Road Heritage Suite", "Shimla, Himachal Pradesh", "India", "hotel", 6800, "rohit", "Two minutes from the Mall Road, in a colonial-era building with modern plumbing."],

  // --- Farhan: Jaipur / Jodhpur / Jaisalmer / Amritsar ---
  ["Bani Park Haveli Room, Jaipur", "Bani Park, Jaipur", "India", "guest-house", 3400, "farhan", "Family haveli in Bani Park, about ten minutes from the walled city by auto."],
  ["Pink City Courtyard Haveli", "Bani Park, Jaipur", "India", "guest-house", 4600, "farhan", "Inside the walled Pink City, with courtyard rooms around a central tulsi plant."],
  ["Amer Road Heritage Suite", "Amer Road, Jaipur", "India", "resort", 8900, "farhan", "On the road up to Amer Fort — elephants sometimes pass by in the morning."],
  ["Blue City Rooftop Haveli", "Jodhpur, Rajasthan", "India", "guest-house", 5100, "farhan", "In the blue-painted lanes below Mehrangarh Fort; the rooftop faces the fort directly."],
  ["Jodhpur Old City Family Home", "Jodhpur, Rajasthan", "India", "guest-house", 3900, "farhan", "Run by the same family for four generations. Breakfast is included."],
  ["Jaisalmer Fort Interior Haveli", "Jaisalmer, Rajasthan", "India", "guest-house", 4200, "farhan", "Inside the living fort itself — note there's no vehicle access right to the door."],
  ["Golden City Sandstone Haveli", "Jaisalmer, Rajasthan", "India", "guest-house", 3700, "farhan", "Just outside the fort walls, a five-minute walk to the main gate."],
  ["Sam Sand Dunes Desert Camp", "Sam Sand Dunes, Jaisalmer", "India", "camping", 4800, "farhan", "Swiss tents on the edge of the dunes; a camel safari can be arranged at reception."],
  ["Golden Temple Lane Homestay", "Amritsar, Punjab", "India", "guest-house", 2800, "farhan", "A seven-minute walk to the Golden Temple, with easy access to the langar hall."],
  ["Jaipur Amer Fort Rooftop Room", "Jaipur, Rajasthan", "India", "guest-house", 3100, "farhan", "Rooftop room with a partial view of Amer Fort in the distance."],

  // --- Sanjay: Udaipur / Pushkar / Bikaner / Mount Abu / Ranthambore / Kutch ---
  ["Lake Pichola View Haveli Room", "Lake Pichola, Udaipur", "India", "guest-house", 6100, "sanjay", "Windows open directly onto Lake Pichola, with the City Palace visible across the water."],
  ["Old City Lakeside Suite, Udaipur", "Lake Pichola, Udaipur", "India", "resort", 8400, "sanjay", "Five-minute walk from Gangaur Ghat; boat rides can be booked right at the ghat."],
  ["City Palace Road Heritage Room", "City Palace Road, Udaipur", "India", "guest-house", 4300, "sanjay", "Close to the City Palace entrance — gets busy during the evening light and sound show."],
  ["Pushkar Lake Sandstone Haveli", "Pushkar, Rajasthan", "India", "guest-house", 3700, "sanjay", "Five ghats down from the main bathing ghat. No meat or alcohol allowed on the premises, per the town's rules."],
  ["Pushkar Camel Fair Season Room", "Pushkar, Rajasthan", "India", "guest-house", 3200, "sanjay", "Books out fast during the November camel fair — ask early."],
  ["Bikaner Royal Desert Haveli", "Bikaner, Rajasthan", "India", "resort", 7200, "sanjay", "A former royal outhouse; camel milk tea is served on the terrace most mornings."],
  ["Mount Abu Sunset Point Cottage", "Mount Abu, Rajasthan", "India", "house", 4300, "sanjay", "A ten-minute walk to Sunset Point, which gets crowded there in the evenings."],
  ["Ranthambore Safari Lodge", "Ranthambore, Rajasthan", "India", "farmhouse", 8900, "sanjay", "Ten minutes from the Zone 3 gate; the host helps book safari slots in advance."],
  ["Rann of Kutch White Desert Camp", "Rann of Kutch, Gujarat", "India", "camping", 5200, "sanjay", "Tents facing the white salt desert, best visited during the winter Rann Utsav."],
  ["Fateh Sagar Lakeview Room", "Fateh Sagar, Udaipur", "India", "guest-house", 3900, "sanjay", "Faces Fateh Sagar lake rather than Pichola — quieter and less touristy."],

  // --- Meenakshi: Munnar / Wayanad / Kochi / Thekkady ---
  ["Munnar Tea Estate Cottage", "Munnar, Kerala", "India", "cottage", 5400, "meenakshi", "Inside a working tea estate; plucking season runs roughly March to May."],
  ["Munnar Mist Valley Room", "Munnar, Kerala", "India", "resort", 9200, "meenakshi", "Faces the valley that fills with mist most mornings before 9am."],
  ["Eravikulam Road Homestay", "Munnar, Kerala", "India", "guest-house", 3600, "meenakshi", "On the road to Eravikulam National Park; Nilgiri tahr sightings are possible nearby."],
  ["Wayanad Rainforest Tree Villa", "Wayanad, Kerala", "India", "cottage", 6700, "meenakshi", "Raised on stilts at the edge of the forest reserve; leeches are possible in monsoon."],
  ["Chembra Peak Base Homestay", "Wayanad, Kerala", "India", "farmhouse", 4400, "meenakshi", "At the base of the trek to Chembra Peak; permits can be arranged by the host."],
  ["Fort Kochi Dutch Quarter House", "Fort Kochi, Kerala", "India", "house", 4800, "meenakshi", "An old Dutch-era house near the Chinese fishing nets, a ten-minute walk to the ferry."],
  ["Mattancherry Spice Market Loft", "Fort Kochi, Kerala", "India", "apartment", 3800, "meenakshi", "Above a spice warehouse in Mattancherry — it smells like cardamom most days."],
  ["Thekkady Periyar Edge Cottage", "Thekkady, Kerala", "India", "cottage", 4600, "meenakshi", "On the edge of Periyar Tiger Reserve; spice plantation walks arranged on request."],

  // --- Devika: Alleppey / Varkala / Kovalam ---
  ["Alleppey Backwater Spice Cottage", "Alleppey, Kerala", "India", "cottage", 5800, "devika", "On a narrow backwater canal — houseboats pass by every morning around 8."],
  ["Punnamada Canal Houseboat-Style Room", "Alleppey, Kerala", "India", "cottage", 6200, "devika", "Built to resemble a docked houseboat, near the Nehru Trophy race's starting point."],
  ["Alleppey Paddy Field View Room", "Alleppey, Kerala", "India", "farmhouse", 4100, "devika", "Faces the paddy fields rather than the canal — cheaper and much quieter."],
  ["Varkala Cliff Ocean View Suite", "Varkala, Kerala", "India", "beach-house", 4100, "devika", "On the cliff strip above Papanasam beach; the sea is visible from the bed."],
  ["Varkala North Cliff Quiet Room", "Varkala, Kerala", "India", "guest-house", 2900, "devika", "North end of the cliff, past the crowded restaurant stretch."],
  ["Kovalam Lighthouse Beach Villa", "Kovalam, Kerala", "India", "beach-house", 6900, "devika", "Near the Kovalam lighthouse, a five-minute walk to the main beach."],

  // --- Arvind: Coorg / Chikmagalur ---
  ["Coorg Coffee Estate Treehouse", "Madikeri, Coorg, Karnataka", "India", "cottage", 6200, "arvind", "Built into a silver oak tree inside a working coffee estate."],
  ["Madikeri Organic Spice Plantation Stay", "Madikeri, Coorg, Karnataka", "India", "farmhouse", 4600, "arvind", "Plantation walk included — pepper and cardamom vines grow alongside the coffee."],
  ["Abbey Falls Road Estate Bungalow", "Madikeri, Coorg, Karnataka", "India", "bungalow", 5100, "arvind", "Two kilometres from Abbey Falls; estate roads can get muddy in monsoon."],
  ["Chikmagalur Coffee Estate Farmstay", "Chikmagalur, Karnataka", "India", "farmhouse", 5200, "arvind", "Mullayanagiri is visible from the estate on clear mornings."],
  ["Baba Budangiri Foothills Cottage", "Chikmagalur, Karnataka", "India", "cottage", 4400, "arvind", "At the foothills of Baba Budangiri, a popular base for the trek."],

  // --- Ritu: Lonavala / Khandala / Mahabaleshwar / Panchgani / Karjat / Igatpuri ---
  ["Lonavala Infinity Pool Estate", "Lonavala, Maharashtra", "India", "villa", 14500, "ritu", "Private infinity pool overlooking the valley — popular for weekend group bookings."],
  ["Pawna Lakeview Cabins", "Lonavala, Maharashtra", "India", "camping", 3300, "ritu", "Right on the Pawna lake edge; the neighbouring campsite runs DJ nights on weekends."],
  ["Tiger Point Road Villa", "Lonavala, Maharashtra", "India", "villa", 11500, "ritu", "Ten minutes from Tiger's Leap viewpoint, gated with 24-hour security."],
  ["Lonavala Chikki Lane Family Villa", "Lonavala, Maharashtra", "India", "villa", 8600, "ritu", "Just off the main chikki-shop lane, with quick access to the expressway."],
  ["Khandala Misty Valley Chalet", "Khandala, Maharashtra", "India", "cottage", 7900, "ritu", "Faces the Duke's Nose ridge; it fogs over most monsoon mornings."],
  ["Mahabaleshwar Strawberry Farm Villa", "Mahabaleshwar, Maharashtra", "India", "farmhouse", 6700, "ritu", "Attached to a strawberry farm — picking season runs January to April."],
  ["Venna Lake Road Cottage", "Mahabaleshwar, Maharashtra", "India", "cottage", 5300, "ritu", "A five-minute walk to Venna Lake, where boating is available."],
  ["Panchgani Tableland Edge Cottage", "Panchgani, Maharashtra", "India", "cottage", 4900, "ritu", "Ten-minute walk to Panchgani Tableland — best visited at sunrise."],
  ["Karjat Riverfront Eco Farmstay", "Karjat, Maharashtra", "India", "farmhouse", 5100, "ritu", "On the Ulhas river; rafting and river-crossing activities run by the host's cousin."],
  ["Igatpuri Hill View Villa", "Igatpuri, Maharashtra", "India", "villa", 9400, "ritu", "Faces the Kalsubai range, close to the Vipassana meditation centre."],

  // --- Imran: Mumbai / Pune ---
  ["Bandra Bandstand Sea-View Flat", "Bandra, Mumbai", "India", "apartment", 8200, "imran", "Two minutes from Bandstand promenade; the sea is visible from the balcony at low tide."],
  ["Pali Hill Designer Apartment", "Bandra, Mumbai", "India", "apartment", 9600, "imran", "In the lanes behind Pali Hill — quiet despite being minutes from Linking Road."],
  ["Colaba Causeway Heritage Flat", "Colaba, Mumbai", "India", "apartment", 7100, "imran", "Above the Causeway market stretch; the Gateway of India is a ten-minute walk."],
  ["Koregaon Park Garden Studio", "Koregaon Park, Pune", "India", "apartment", 4800, "imran", "Near Lane 7, close to the Osho Ashram gates."],
  ["North Main Road Loft, Pune", "Koregaon Park, Pune", "India", "apartment", 4200, "imran", "Above a cafe on North Main Road, popular with weekday business travellers."],
  ["Alibaug Beachfront Pool Villa", "Alibaug, Maharashtra", "India", "villa", 16000, "imran", "A short walk from Nagaon beach, best reached by the RoRo ferry from Mumbai."],

  // --- Marco: Bengaluru / Hyderabad / Kolkata / Chandigarh ---
  ["Indiranagar 100 Feet Road Studio", "Indiranagar, Bengaluru", "India", "apartment", 3800, "marco", "Right off 100 Feet Road, walking distance to most of the pubs and cafes."],
  ["Domlur Garden Flat, Bengaluru", "Indiranagar, Bengaluru", "India", "apartment", 4100, "marco", "Quieter than the main Indiranagar strip; ten minutes by auto to the tech parks."],
  ["Jubilee Hills Skyline Suite, Hyderabad", "Jubilee Hills, Hyderabad", "India", "apartment", 5800, "marco", "Close to Road No. 36; Golconda Fort is visible from the higher floors."],
  ["Park Street Colonial Loft, Kolkata", "Park Street, Kolkata", "India", "apartment", 4500, "marco", "Above an old bookstore on Park Street — Flurys is a five-minute walk."],
  ["Sector 17 Modernist Flat, Chandigarh", "Sector 17, Chandigarh", "India", "apartment", 3600, "marco", "In one of the original Le Corbusier-planned sectors, close to the plaza."],

  // --- Tenzin: Leh / Nubra / Spiti ---
  ["Leh Old Town Mud-Brick Homestay", "Leh, Ladakh", "India", "mountain-lodge", 4200, "tenzin", "A traditional mud-brick house below Leh Palace — altitude acclimatisation is advised."],
  ["Changspa Lane Guesthouse, Leh", "Leh, Ladakh", "India", "guest-house", 3600, "tenzin", "On the popular Changspa backpacker lane; closed for winter from November to April."],
  ["Nubra Valley Sand Dune Camp", "Nubra Valley, Ladakh", "India", "camping", 4600, "tenzin", "Near the Hunder sand dunes, with double-humped camels close by."],
  ["Spiti Valley Solar Homestay", "Spiti Valley, Himachal Pradesh", "India", "mountain-lodge", 3400, "tenzin", "Off-grid and solar-powered; network is patchy throughout the valley."],
  ["Kaza Monastery View Room", "Spiti Valley, Himachal Pradesh", "India", "mountain-lodge", 3100, "tenzin", "Overlooks Kaza's old monastery; road access shuts in heavy winter snow."],

  // --- Priyanka: Darjeeling / Gangtok / Shillong / Cherrapunji / Kaziranga ---
  ["Darjeeling Tea Estate Heritage Villa", "Darjeeling, West Bengal", "India", "hotel", 7800, "priyanka", "Inside a working tea estate; plucking can be watched right from the veranda."],
  ["Mall Road View Cottage, Darjeeling", "Darjeeling, West Bengal", "India", "cottage", 5600, "priyanka", "A ten-minute walk to Mall Road; Kanchenjunga is visible on clear mornings."],
  ["MG Marg Himalayan View Suite, Gangtok", "Gangtok, Sikkim", "India", "hotel", 5600, "priyanka", "Two minutes from MG Marg — no vehicles allowed on that stretch after dark."],
  ["Shillong Police Bazar Eco Cabin", "Shillong, Meghalaya", "India", "cabin", 4100, "priyanka", "Close to Police Bazar; the side streets get quieter once you're off the main road."],
  ["Living Root Bridge Trailhead Camp", "Cherrapunji, Meghalaya", "India", "camping", 2800, "priyanka", "Starting point for the Nongriat living root bridge trek — pack a rain shell regardless of season."],
  ["Kaziranga Rhino Range Lodge", "Kaziranga, Assam", "India", "farmhouse", 5500, "priyanka", "Close to the Kohora range gate; jeep safaris are bookable through the host."],

  // --- Karan: Rishikesh / Nainital / Mussoorie / Almora / Lansdowne ---
  ["Tapovan Riverside Eco Camp, Rishikesh", "Rishikesh, Uttarakhand", "India", "camping", 3200, "karan", "On the Ganga's west bank in Tapovan; the rafting put-in point is five minutes away."],
  ["Laxman Jhula Rooftop Room", "Rishikesh, Uttarakhand", "India", "guest-house", 2700, "karan", "Near Laxman Jhula bridge; the cafe rooftops nearby play a lot of reggae."],
  ["Naini Lake Timber Cottage", "Nainital, Uttarakhand", "India", "cottage", 5400, "karan", "Overlooks Naini Lake; the boat club is a five-minute walk down the Mall Road."],
  ["Camel's Back Road Heritage Chalet", "Mussoorie, Uttarakhand", "India", "cabin", 5900, "karan", "Along Camel's Back Road, with a good sunset walk right outside the door."],
  ["Almora Himalayan Sunrise Cottage", "Almora, Uttarakhand", "India", "mountain-lodge", 4600, "karan", "East-facing rooms catch the sunrise over the Panchachuli peaks."],
  ["Lansdowne Oak Forest Chalet", "Lansdowne, Uttarakhand", "India", "cabin", 3800, "karan", "A quiet cantonment town; mobile network can be unreliable indoors."],

  // --- Suresh: Ooty / Kodaikanal / Coonoor / Coimbatore ---
  ["Ooty Botanical Garden Lake Bungalow", "Ooty, Tamil Nadu", "India", "house", 4800, "suresh", "A five-minute walk to the Botanical Gardens; the toy train station is a short auto ride away."],
  ["Doddabetta Road Cottage", "Ooty, Tamil Nadu", "India", "cottage", 4300, "suresh", "On the road up to Doddabetta Peak, chilly enough for a fireplace most nights."],
  ["Kodaikanal Starry Pine Cottage", "Kodaikanal, Tamil Nadu", "India", "cottage", 4700, "suresh", "Away from streetlights, with good stargazing on clear nights."],
  ["Coaker's Walk View Room", "Kodaikanal, Tamil Nadu", "India", "guest-house", 3400, "suresh", "Overlooks the valley from near Coaker's Walk, a short stroll to the lake."],
  ["Coonoor Tea Garden Colonial Villa", "Coonoor, Tamil Nadu", "India", "cottage", 5100, "suresh", "Inside a colonial-era tea estate bungalow; tea tasting arranged on request."],
  ["Coimbatore Foothills Farmstay", "Coimbatore, Tamil Nadu", "India", "farmhouse", 3900, "suresh", "At the base of the Western Ghats — a good stopover before heading up to Ooty."],

  // --- Ayesha: Puducherry / Chennai ---
  ["French Quarter Villa, White Town", "White Town, Puducherry", "India", "house", 5100, "ayesha", "A yellow colonial facade typical of White Town; Auroville is a 20-minute drive."],
  ["Rue Bussy Courtyard House", "White Town, Puducherry", "India", "guest-house", 3800, "ayesha", "On one of the quieter Rue-named streets, with a courtyard shared between three rooms."],
  ["ECR Seaside Pool Bungalow, Chennai", "ECR, Chennai", "India", "house", 7200, "ayesha", "On East Coast Road, a ten-minute drive from Muttukadu boat house."],
  ["Shore Temple Beach Villa, Mahabalipuram", "Mahabalipuram, Tamil Nadu", "India", "beach-house", 7400, "ayesha", "A ten-minute walk to the Shore Temple, near the stone-carving workshops."],
  ["Serenity Beach Surf Villa, Puducherry", "Serenity Beach, Puducherry", "India", "beach-house", 6200, "ayesha", "Surf lessons available right on Serenity Beach; board rentals at the gate."],

  // --- Deepak: Varanasi / Agra ---
  ["Assi Ghat Riverfront Haveli", "Assi Ghat, Varanasi", "India", "guest-house", 3500, "deepak", "Overlooks the ghats where the evening Ganga aarti is held."],
  ["Varanasi Old City Lane House", "Assi Ghat, Varanasi", "India", "guest-house", 3100, "deepak", "Deep in the old city lanes, best reached on foot from the main road."],
  ["Taj View Rooftop Homestay, Agra", "Agra, Uttar Pradesh", "India", "guest-house", 3900, "deepak", "The rooftop faces the Taj Mahal directly — sunrise viewing is recommended."],
  ["Fatehabad Road Family Guesthouse", "Agra, Uttar Pradesh", "India", "guest-house", 3300, "deepak", "A ten-minute auto ride from the Taj East Gate, on a quieter residential lane."],

  // --- Vikram: Hampi / Mysuru ---
  ["Hampi Boulder Village Cottage", "Hampi, Karnataka", "India", "guest-house", 2900, "vikram", "Among the boulders in Virupapur Gaddi; cross the river by coracle to reach the ruins."],
  ["Hampi Bazaar Heritage Room", "Hampi, Karnataka", "India", "guest-house", 2600, "vikram", "Right in Hampi Bazaar, walking distance to the Virupaksha Temple."],
  ["Mysuru Palace Courtyard House", "Mysuru, Karnataka", "India", "house", 4300, "vikram", "A ten-minute walk to Mysore Palace, which is lit up on Sunday evenings."],
  ["Devaraja Market Lane Homestay", "Mysuru, Karnataka", "India", "guest-house", 3300, "vikram", "Above a flower stall near Devaraja Market — mornings smell like jasmine."],

  // --- Elena: International ---
  ["Ubud Jungle Infinity Villa", "Ubud, Bali", "Indonesia", "villa", 16500, "elena", "Overlooks the Petanu river gorge, a ten-minute scooter ride to Ubud centre."],
  ["Tegallalang Rice Terrace View Villa", "Ubud, Bali", "Indonesia", "villa", 15200, "elena", "Faces the Tegallalang rice terraces, especially green just after planting."],
  ["Canggu Beach Surf Villa", "Canggu, Bali", "Indonesia", "villa", 14000, "elena", "A two-minute walk to Batu Bolong beach, with board storage provided."],
  ["Oia Cliffside Cave Suite", "Oia, Santorini", "Greece", "resort", 24000, "elena", "Carved into the caldera cliff in Oia — a front-row seat for the sunset crowds."],
  ["Interlaken Alpine Timber Chalet", "Interlaken", "Switzerland", "mountain-lodge", 28000, "elena", "Between Lake Thun and Lake Brienz, near a paragliding launch site."],
  ["Arashiyama Bamboo Grove Machiya", "Arashiyama, Kyoto", "Japan", "house", 12500, "elena", "A traditional townhouse minutes from the Arashiyama bamboo grove."],
  ["Dubai Marina Skyline Apartment", "Dubai Marina, Dubai", "United Arab Emirates", "apartment", 15500, "elena", "A high floor with a Marina walk view; Palm Jumeirah is visible in the distance."],
  ["Le Marais Artist Loft, Paris", "Le Marais, Paris", "France", "apartment", 19500, "elena", "A fourth-floor walk-up in the Marais — no lift, but plenty of character."],
  ["Overwater Lagoon Bungalow, Maldives", "Male Atoll, Maldives", "Maldives", "resort", 32000, "elena", "Direct lagoon access from the deck; seaplane transfer arranged by the resort."],
  ["Notting Hill Garden Townhouse", "Notting Hill, London", "United Kingdom", "house", 22000, "elena", "Just off Portobello Road, where market stalls set up right outside on Saturdays."],
  ["Shimokitazawa Vintage Apartment", "Shimokitazawa, Tokyo", "Japan", "apartment", 16800, "elena", "In Tokyo's vintage-shopping neighbourhood — small, but very well laid out."],
];

const sampleListings = RAW.map(([title, location, country, category, price, hostKey, hint], idx) => {
  const amenities = pickAmenities(category, idx);
  const [img1, img2] = pickImages(category, idx);
  return {
    title,
    description: buildDescription(hint, amenities, idx),
    price,
    location,
    country,
    category,
    amenities,
    hostEmail: HOST[hostKey],
    image: [
      { filename: `seed_${idx}_0`, url: img1 },
      { filename: `seed_${idx}_1`, url: img2 },
    ],
  };
});

module.exports = { sampleUsers, sampleListings };
