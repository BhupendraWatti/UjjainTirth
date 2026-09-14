import { API_CUSTOM_URL, API_ENDPOINTS, DEFAULT_HEADERS } from "@/constants/api";
import { FetchPoojaParams, PoojaBookingPayload, PoojaItem } from "@/types/pooja";
export type { FetchPoojaParams, PoojaBookingPayload };

export const POOJA_FALLBACK_IMAGES: Record<string, string> = {
  shiva: "https://images.unsplash.com/photo-1609358905581-e5382c23f2f8?w=800&auto=format&fit=crop&q=80",
  special: "https://images.unsplash.com/photo-1545232979-fbf68fe9b10d?w=800&auto=format&fit=crop&q=80",
  protection: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
  prosperity: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1609358905581-e5382c23f2f8?w=800&auto=format&fit=crop&q=80",
};

export const getPoojaFallbackImage = (category: string = ""): string => {
  const c = category.toLowerCase();
  if (c.includes("shiva") || c.includes("rudra")) {
    return POOJA_FALLBACK_IMAGES.shiva;
  }
  if (c.includes("mangal") || c.includes("special") || c.includes("bhat")) {
    return POOJA_FALLBACK_IMAGES.special;
  }
  if (c.includes("protect") || c.includes("bhairav") || c.includes("kaal")) {
    return POOJA_FALLBACK_IMAGES.protection;
  }
  if (c.includes("prosperity") || c.includes("devi") || c.includes("lakshmi")) {
    return POOJA_FALLBACK_IMAGES.prosperity;
  }
  return POOJA_FALLBACK_IMAGES.default;
};

const DEFAULT_WHAT_WE_PROVIDE = [
  {
    icon: "ribbon",
    title: "Authorized Tirtha Purohits",
    description: "Rituals conducted exclusively by certified hereditary Vedic Pandits of Mahakaleshwar & Mangalnath.",
  },
  {
    icon: "videocam",
    title: "Personalized WhatsApp Video Sankalp",
    description: "Pandit records your individualized Name, Gotra & wishes on video before the ritual commences.",
  },
  {
    icon: "leaf",
    title: "100% Pure Vedic Samagri",
    description: "Pure cow milk, genuine Belpatra, consecrated silver Nag-Nagin & temple-prepared offerings.",
  },
  {
    icon: "gift",
    title: "Consecrated Mahakal Prasad Delivery",
    description: "Consecrated Bhasma, Belpatra, Raksha Sutra & dry prasad dispatched via Speed Post with tracking.",
  },
];

export const enrichPoojaItemWithVedicDefaults = (item: PoojaItem): PoojaItem => {
  const titleLower = (item.title || "").toLowerCase();
  const id = item.id;

  const result: PoojaItem = { ...item };

  // If what_we_provide is empty from API, provide standard 4 trust pillars
  if (!result.what_we_provide || result.what_we_provide.length === 0) {
    result.what_we_provide = DEFAULT_WHAT_WE_PROVIDE;
  }

  // 1. Maha Rudrabhishek
  if (id === 5654 || titleLower.includes("rudra")) {
    if (!result.temple || result.temple === "") {
      result.temple = "Mahakaleshwar Jyotirlinga, Ujjain";
    }
    if (!result.description || result.description === "") {
      result.description =
        "Maha Rudrabhishek at the sacred Mahakaleshwar Jyotirlinga is one of Sanatana Dharma's most reverent Vedic rituals. Mahakaleshwar is the only Dakshin-Mukhi Swayambhu Jyotirlinga, the cosmic master of Kaal (Time) and Mrityu (Death). Performed by authorized Vedic Purohits according to Shukla Yajurveda traditions, the ritual invokes the benevolent form of Rudra. The workflow proceeds through continuous ceremonial Abhishek with Panchamrut and holy Gangajal/Narmada Jal, while Brahmins chant the sacred Namakam and Chamakam hymns alongside 108 Mahamrityunjaya japas. Concluded with the offering of consecrated Mahakal Bhasma, Bilva Patra, and Shodashopachara Aarti, this pooja dispels chronic physical ailments and bestows profound spiritual peace.";
    }
    if (!result.muhurat_timings || result.muhurat_timings === "") {
      result.muhurat_timings =
        "Daily: 06:00 AM – 11:30 AM (Bhasma Aarti to Madhyahna; Pradosh & Somwar especially auspicious)";
    }
    if (!result.badge_tag || result.badge_tag === "") {
      result.badge_tag = "Mahakal Kripa";
    }
    if (result.starting_price === null || result.starting_price === undefined) {
      result.starting_price = 2100;
    }
    if (!result.samagri_list || result.samagri_list.length === 0) {
      result.samagri_list = [
        "Panchamrut (Pure Cow Milk, Fresh Curd, Desi Ghee, Raw Honey, Mishri)",
        "Holy Gangajal & Sacred Narmada Waters",
        "Sanctified Mahakaleshwar Bhasma from Bhasma Aarti",
        "Fresh Unbroken Bilva Patra (Belpatra) & Dhatura Offerings",
        "Sugandhit Malayagiri Chandan, Roli & Pure Cotton Janeu",
        "Akshat, Camphor, Dhoop, Ghee Deepam & Naivedyam",
        "Fresh Seasonal Fruits, Sweets & Temple Prasad",
      ];
    }
    if (!result.benefits || result.benefits.length === 0) {
      result.benefits = [
        "Bestows Ayurvriddhi (longevity) and aids rapid recovery from chronic illnesses",
        "Neutralizes malefic planetary influences including Shani Sade Sati & Rahu afflictions",
        "Removes severe negative energies, evil eye, and spiritual blockages",
        "Invokes immense mental clarity, soul purification, and household prosperity",
      ];
    }
    if (!result.dakshina_tiers || result.dakshina_tiers.length === 0) {
      result.dakshina_tiers = [
        {
          title: "Laghu Rudrabhishek",
          price: 2100,
          description:
            "Standard individual Vedic abhishek with single Pandit; includes WhatsApp sankalp video & prasad dispatch.",
        },
        {
          title: "Maha Rudrabhishek (Vishesh)",
          price: 5100,
          description:
            "Complete ritual led by 3 Vedic Acharyas with Chhatra Pujan, Bilva Archana, and live video darshan.",
        },
        {
          title: "Ekadashani Rudrabhishek",
          price: 11000,
          description:
            "Elaborate ritual with 11 Vedic priests reciting 11 rounds of Shri Rudram with Mahamrityunjaya Havan.",
        },
      ];
    }
    if (!result.workflow_steps || result.workflow_steps.length === 0) {
      result.workflow_steps = [
        {
          step_number: 1,
          title: "Purvanga Shuddhi & Achaman",
          description: "Devotee and altar sanctification with holy Narmada and Gangajal.",
        },
        {
          step_number: 2,
          title: "Individualized Yajman Sankalp",
          description: "Priest takes formal vow reciting devotee Name, Gotra, and specific intentions on video.",
        },
        {
          step_number: 3,
          title: "Gauri-Ganesh & Kalash Sthapana",
          description: "Invocation of Vignaharta Lord Ganesha and planetary deities for unobstructed ritual execution.",
        },
        {
          step_number: 4,
          title: "Panchamrut & Sugandhit Dhara",
          description: "Continuous abhishek of the Shivling with cow milk, curd, ghee, honey, and holy water.",
        },
        {
          step_number: 5,
          title: "Rudra Suktam & Mahamrityunjaya Jaap",
          description: "Powerful Vedic recitations of Namakam, Chamakam, and 108 Shiva mantras.",
        },
        {
          step_number: 6,
          title: "Bhasma, Bilva & Dhatura Arpan",
          description: "Offering unbroken Belpatra, Dhatura flowers, and sanctified Mahakal Bhasma.",
        },
        {
          step_number: 7,
          title: "Shodashopachara Aarti & Prasad Packing",
          description: "Kapur Aarti, blessings, and packing consecrated prasad for doorstep delivery.",
        },
      ];
    }
  }

  // 2. Mangalnath Bhat Pooja
  else if (id === 5659 || titleLower.includes("mangal") || titleLower.includes("bhat")) {
    if (!result.temple || result.temple === "") {
      result.temple = "Mangalnath Temple, Ujjain";
    }
    if (!result.description || result.description === "") {
      result.description =
        "The Mangalnath Temple in Ujjain is revered in the Matsya and Skanda Puranas as the exact geographical birthplace of planet Mars (Mangal Grah) and the ancient center of the Earth (Nabhideep). Individuals suffering from Mangal/Manglik/Kuja Dosh experience severe impediments in marriage, turbulent relationships, health issues, and financial debts. The sacred 'Bhat Pooja' is an esoteric Vedic therapy: because Mars is considered an intensely fiery and aggressive Graha, the Shivling at Mangalnath is ceremoniously adorned and covered with freshly prepared, sanctified boiled rice (Bhat) blended with red sandalwood and holy waters. This cooling offering appeases Bhagwan Mangal, harmonizes Martian vitality into courage, and eliminates matrimonial discord.";
    }
    if (!result.muhurat_timings || result.muhurat_timings === "") {
      result.muhurat_timings =
        "Tuesdays & Auspicious Muhurats: 06:00 AM – 02:00 PM (Bhaum Pradosh & Navami especially potent)";
    }
    if (!result.badge_tag || result.badge_tag === "") {
      result.badge_tag = "Dosh Nivarana";
    }
    if (result.starting_price === null || result.starting_price === undefined) {
      result.starting_price = 3100;
    }
    if (!result.samagri_list || result.samagri_list.length === 0) {
      result.samagri_list = [
        "Fresh Cooked Bhat (Cooling rice offering prepared strictly in temple kitchen)",
        "Raktachandan (Red Sandalwood Powder) & Pure Kasturi Kumkum",
        "Lal Vastra & Angavastram (Sacred red cloth offering for Mars)",
        "Lal Masoor Dal, Jaggery (Gur) & Pure Copper Nag / Coin",
        "Red Flowers (Gulab, Kaner) & Navagraha Samidha wood",
        "Pure Cow Ghee, Camphor & Gangajal for Snan",
        "Sanctified Mangal Raksha Sutra & Mangalnath Bhasma",
      ];
    }
    if (!result.benefits || result.benefits.length === 0) {
      result.benefits = [
        "Neutralizes severe Manglik (Kuja) Dosh causing prolonged marriage delays",
        "Brings emotional harmony, mutual understanding, and stability to married life",
        "Transforms uncontrollable anger, impulsiveness, and blood-related ailments",
        "Relieves persistent financial debts (Rina Mukti), court cases, and property disputes",
      ];
    }
    if (!result.dakshina_tiers || result.dakshina_tiers.length === 0) {
      result.dakshina_tiers = [
        {
          title: "Standard Mangal Bhat Pooja",
          price: 3100,
          description:
            "Core Bhat Arpan and Shanti Vidhi by certified Mangalnath Purohit; includes photo/video darshan.",
        },
        {
          title: "Vishesh Mangal Dosh Nivaran",
          price: 5500,
          description:
            "Includes complete Bhat Pooja, Lal Vastra offering, Navagraha Mangal Havan, and consecrated prasad.",
        },
        {
          title: "Sampoorna Bhat Pooja & Mangal Havan",
          price: 8500,
          description:
            "Comprehensive 3-Pandit ritual for couple/family with 10,000 Mangal Jaap, complete Havan, and silver coin.",
        },
      ];
    }
    if (!result.workflow_steps || result.workflow_steps.length === 0) {
      result.workflow_steps = [
        {
          step_number: 1,
          title: "Pavitra Snan & Purvanga Vidhi",
          description: "Holy water purification on the banks of Shipra and temple premises.",
        },
        {
          step_number: 2,
          title: "Angaraka Gotra Sankalp",
          description: "Solemn vow by priest with Yajman Gotra, planetary chart, and matrimonial prayers.",
        },
        {
          step_number: 3,
          title: "Gauri-Ganesh & Navagraha Pujan",
          description: "Invoking Vignaharta and balancing all planetary influences.",
        },
        {
          step_number: 4,
          title: "Panchamrut Snan & Shodashopachara",
          description: "Ceremonial bathing of Mangalnath Mahadev before the rice offering.",
        },
        {
          step_number: 5,
          title: "Bhat Arpan (Core Cooling Rite)",
          description: "Covering the sacred Lingam with freshly cooked rice and red sandalwood to calm fiery energies.",
        },
        {
          step_number: 6,
          title: "Mangal Gayatri & Bhauma Stotra Jaap",
          description: "Continuous Vedic chanting of Mars mantras for dosh pacification.",
        },
        {
          step_number: 7,
          title: "Navagraha Havan & Raksha Sutra",
          description: "Sacred fire oblation, tying the sanctified red thread, and prasad blessing.",
        },
      ];
    }
  }

  // 3. Kaal Sarp Dosh Shanti
  else if (id === 5660 || titleLower.includes("kaal") || titleLower.includes("sarp")) {
    if (!result.temple || result.temple === "") {
      result.temple = "Ram Ghat & Mahakaleshwar, Ujjain";
    }
    if (!result.description || result.description === "") {
      result.description =
        "In Vedic astrology, Kaal Sarp Dosh occurs when all seven primary planets are hemmed between the malefic shadow nodes Rahu (the serpent's head) and Ketu (the serpent's tail). This leads to recurring failures, career stagnation, sudden setbacks, and mental unrest. Ujjain, resting on the holy banks of the sacred Shipra River under the sovereign guard of Lord Mahakal, is recognized across scriptures as the foremost Tirtha for Sarpa Dosh Nivarana. Performed at sacred Ram Ghat, this intensive ritual involves sanctifying a consecrated pair of silver Nag-Nagin, reciting 21,000 Rahu-Ketu beeja mantras, conducting a purifying Sarpa Shanti Havan, and ceremoniously performing the Visarjan of the serpent idols into the holy Shipra waters.";
    }
    if (!result.muhurat_timings || result.muhurat_timings === "") {
      result.muhurat_timings =
        "Amavasya, Nag Panchami & Daily: 07:00 AM – 01:00 PM (Monday & Saturday especially effective)";
    }
    if (!result.badge_tag || result.badge_tag === "") {
      result.badge_tag = "Rahu-Ketu Shanti";
    }
    if (result.starting_price === null || result.starting_price === undefined) {
      result.starting_price = 4500;
    }
    if (!result.samagri_list || result.samagri_list.length === 0) {
      result.samagri_list = [
        "Consecrated Pair of Pure Silver Nag-Nagin (Serpent Idols)",
        "Kala Til (Black Sesame), Jau (Barley) & Mustard Offerings",
        "Fresh Cow Milk for Serpent Idols Abhishekam",
        "Black, Dark Blue & Yellow Vastra for Rahu-Ketu Shanti",
        "Loban, Guggul, Camphor & Special Sarpa Havan Samagri",
        "Coconut (Shriphal), Supari, Betel Leaves & Sacred Janeyu",
        "Consecrated Sarpa Raksha Yantra & Mahakal Bhasma Prasad",
      ];
    }
    if (!result.benefits || result.benefits.length === 0) {
      result.benefits = [
        "Liberates from all 12 types of Kaal Sarp Dosh (Anant, Kulik, Vasuki, Shankhpal, etc.)",
        "Clears inexplicable stagnation in job promotions, business growth, and finances",
        "Eliminates chronic mental anxiety, sleep disorders, and recurring dreams of snakes",
        "Promotes Santan Sukh (fertility and family peace) and dissolves generational pitra burdens",
      ];
    }
    if (!result.dakshina_tiers || result.dakshina_tiers.length === 0) {
      result.dakshina_tiers = [
        {
          title: "Standard Kaal Sarp Shanti",
          price: 4500,
          description:
            "Standard Vedic ritual with Nag-Nagin Pujan, Jaap, and holy Shipra Visarjan; video darshan included.",
        },
        {
          title: "Maha Kaal Sarp Dosh Nivaran",
          price: 7500,
          description:
            "Elaborate ritual with 2 Vedic Pandits, dedicated Sarpa Havan, silver Nag-Nagin, and sanctified Yantra.",
        },
        {
          title: "Sampoorna Rahu-Ketu & Sarpa Shanti",
          price: 11000,
          description:
            "Full 3-Pandit ceremony with 21,000 mantra chants, Mahamrityunjaya samputa, Havan, and doorstep prasad.",
        },
      ];
    }
    if (!result.workflow_steps || result.workflow_steps.length === 0) {
      result.workflow_steps = [
        {
          step_number: 1,
          title: "Shipra Snan & Purifying Achaman",
          description: "Holy river purification at Ram Ghat, Ujjain, before ritual commencement.",
        },
        {
          step_number: 2,
          title: "Sarpa Dosh Shanti Sankalp",
          description: "Individual vow by Vedic Pandit with Yajman Gotra and family names.",
        },
        {
          step_number: 3,
          title: "Gauri-Ganesh & Navagraha Sthapana",
          description: "Establishing the sacred altar and invoking divine protection.",
        },
        {
          step_number: 4,
          title: "Silver Nag-Nagin Abhishek",
          description: "Ceremonial bathing of consecrated silver serpent pair with milk and Gangajal.",
        },
        {
          step_number: 5,
          title: "Rahu-Ketu Beeja Mantra Recitation",
          description: "Intensive Vedic japa to pacify the serpent nodes.",
        },
        {
          step_number: 6,
          title: "Purifying Sarpa Shanti Havan",
          description: "Sacred fire oblation with black sesame, barley, and special samidha.",
        },
        {
          step_number: 7,
          title: "Shipra Visarjan & Final Aarti",
          description:
            "Immersing the serpent idols in Shipra waters with prayers for liberation, followed by prasad consecration.",
        },
      ];
    }
  }

  return result;
};

export const fetchPoojas = async (params?: FetchPoojaParams): Promise<PoojaItem[]> => {
  let url = `${API_CUSTOM_URL}${API_ENDPOINTS.POOJA}`;
  if (params) {
    const q = new URLSearchParams();
    if (params.category && params.category !== "all") q.set("category", params.category);
    if (params.featured) q.set("featured", "1");
    if (params.search) q.set("search", params.search);
    if (params.temple) q.set("temple", params.temple);
    const qs = q.toString();
    if (qs) url += `?${qs}`;
  }

  const response = await fetch(url, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch poojas: ${response.status}`);
  }

  const data = await response.json();

  return (Array.isArray(data) ? data : []).map((item: any) => {
    const rawImage = typeof item.image === "string" ? item.image.trim() : "";
    const category = (item.category || "shiva").toLowerCase();
    const image = rawImage !== "" ? rawImage : getPoojaFallbackImage(category);

    const parsedItem: PoojaItem = {
      id: Number(item.id) || 0,
      title: item.title || "Vedic Ritual",
      image,
      temple: item.temple || "Mahakaleshwar Temple",
      category,
      duration: item.duration || "45–60 min",
      short_purpose: item.short_purpose || "",
      description: item.description || "",
      starting_price:
        item.starting_price !== null && item.starting_price !== undefined
          ? Number(item.starting_price)
          : null,
      muhurat_timings: item.muhurat_timings || "",
      samagri_list: Array.isArray(item.samagri_list) ? item.samagri_list : [],
      benefits: Array.isArray(item.benefits) ? item.benefits : [],
      dakshina_tiers: Array.isArray(item.dakshina_tiers) ? item.dakshina_tiers : [],
      badge_tag: item.badge_tag || "",
      is_featured: Boolean(item.is_featured),
      workflow_steps: Array.isArray(item.workflow_steps) ? item.workflow_steps : [],
      what_we_provide: Array.isArray(item.what_we_provide) ? item.what_we_provide : [],
    };

    return enrichPoojaItemWithVedicDefaults(parsedItem);
  });
};

export const fetchPoojaById = async (id: number | string): Promise<PoojaItem | null> => {
  const numId = Number(id);
  // Try fetching direct single endpoint first
  try {
    const response = await fetch(`${API_CUSTOM_URL}${API_ENDPOINTS.POOJA}/${numId}`, {
      headers: DEFAULT_HEADERS,
    });
    if (response.ok) {
      const item = await response.json();
      const rawImage = typeof item.image === "string" ? item.image.trim() : "";
      const category = (item.category || "shiva").toLowerCase();
      const image = rawImage !== "" ? rawImage : getPoojaFallbackImage(category);

      const parsedItem: PoojaItem = {
        id: Number(item.id) || numId,
        title: item.title || "Vedic Ritual",
        image,
        temple: item.temple || "Mahakaleshwar Temple",
        category,
        duration: item.duration || "45–60 min",
        short_purpose: item.short_purpose || "",
        description: item.description || "",
        starting_price:
          item.starting_price !== null && item.starting_price !== undefined
            ? Number(item.starting_price)
            : null,
        muhurat_timings: item.muhurat_timings || "",
        samagri_list: Array.isArray(item.samagri_list) ? item.samagri_list : [],
        benefits: Array.isArray(item.benefits) ? item.benefits : [],
        dakshina_tiers: Array.isArray(item.dakshina_tiers) ? item.dakshina_tiers : [],
        badge_tag: item.badge_tag || "",
        is_featured: Boolean(item.is_featured),
        workflow_steps: Array.isArray(item.workflow_steps) ? item.workflow_steps : [],
        what_we_provide: Array.isArray(item.what_we_provide) ? item.what_we_provide : [],
      };

      return enrichPoojaItemWithVedicDefaults(parsedItem);
    }
  } catch {
    // Fall back to searching list cache
  }

  const poojas = await fetchPoojas();
  return poojas.find((p) => p.id === numId) || null;
};

export const submitPoojaBooking = async (
  payload: PoojaBookingPayload
): Promise<{ success: boolean; message: string; pooja_id?: number }> => {
  const response = await fetch(`${API_CUSTOM_URL}/pooja/book`, {
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Booking request failed with status: ${response.status}`);
  }

  return await response.json();
};
