import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ScreenContainer from "@/components/layout/ScreenContainer";
import { AvailabilityScreen } from "@/components/common/AvailabilityLoader";
import { fetchJyotirlingTours } from "@/services/jyotirlingTourService";
import { JyotirlingTour } from "@/types/jyotirlingTour";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
 
const getNormalizedCoreName = (name: string): string => {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .replace(/\b(temple|jyotirlinga|jyotirling|tours|tour)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

const cleanLocationText = (text: string) => {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, "").trim();
};

const FALLBACK_TOURS: JyotirlingTour[] = [
  {
    id: 1001,
    slug: "somnath-temple",
    title: "Somnath Temple",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLyodVi0ZXpkiXIeKGr5SM5Q7ktVSdunFqRD5ZsHd-7utty3Z0AHHqgwkKVdanjV5fxdbN3euwRnX5HSAQ_oTuaSUhIJnZDu9xDEoRfoPWRfeV132_-6EMJBipzRJz2g4i2A_4ObmfgqyHH1HZlhL6SGHjcfXd1N_c8iUeByv34zMpCey5zER2Z3_pMlRza0SPkBw4xQW0p9UWV-yKKzN7XUAEMUKDyS2Z5hPd4PRB-RA__y2ndr9uhK6tAPxEVUksSYoMCAx7hylK",
    featured_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLyodVi0ZXpkiXIeKGr5SM5Q7ktVSdunFqRD5ZsHd-7utty3Z0AHHqgwkKVdanjV5fxdbN3euwRnX5HSAQ_oTuaSUhIJnZDu9xDEoRfoPWRfeV132_-6EMJBipzRJz2g4i2A_4ObmfgqyHH1HZlhL6SGHjcfXd1N_c8iUeByv34zMpCey5zER2Z3_pMlRza0SPkBw4xQW0p9UWV-yKKzN7XUAEMUKDyS2Z5hPd4PRB-RA__y2ndr9uhK6tAPxEVUksSYoMCAx7hylK",
    acf: {
      jyotirling_name: "Somnath Temple",
      jyotirling_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLyodVi0ZXpkiXIeKGr5SM5Q7ktVSdunFqRD5ZsHd-7utty3Z0AHHqgwkKVdanjV5fxdbN3euwRnX5HSAQ_oTuaSUhIJnZDu9xDEoRfoPWRfeV132_-6EMJBipzRJz2g4i2A_4ObmfgqyHH1HZlhL6SGHjcfXd1N_c8iUeByv34zMpCey5zER2Z3_pMlRza0SPkBw4xQW0p9UWV-yKKzN7XUAEMUKDyS2Z5hPd4PRB-RA__y2ndr9uhK6tAPxEVUksSYoMCAx7hylK",
      jyotirling_location_tag: { id: 1, name: "Gujarat", slug: "gujarat" },
      jyotirling_description: "The first among the twelve Jyotirlinga shrines of Shiva, located in Prabhas Patan, Gujarat. It is an eternal shrine.",
      jyotirling_location: "Prabhas Patan, Gujarat, India",
      latitude: "20.8880",
      longitude: "70.4010"
    }
  },
  {
    id: 1002,
    slug: "mallikarjuna-temple",
    title: "Mallikarjuna Temple",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHQGMCPi8rJC0OYmcn4BijTeRlsP89atc1nBZXQ0AD-mkuSi-exvef23_4escqzj2EQowvgN787i66aTb7OgtNmfyTTtMg6IWVpSp95ucZ7P75H9SC-vbyGAcfT03kfJJKy1AmqKvYnOXPSISwT73Xf9wS-O4mpBr1PcEpu1q1AxbY5UhEdGhiy1OSNGNyWXJ24nysu0uV-K7LBE8SxJeSFaEFXWRtyLZKeCWUDL8IXEqKWEEj9drlwzKBS0v8wzctQMjWtRxR_Uv3",
    featured_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHQGMCPi8rJC0OYmcn4BijTeRlsP89atc1nBZXQ0AD-mkuSi-exvef23_4escqzj2EQowvgN787i66aTb7OgtNmfyTTtMg6IWVpSp95ucZ7P75H9SC-vbyGAcfT03kfJJKy1AmqKvYnOXPSISwT73Xf9wS-O4mpBr1PcEpu1q1AxbY5UhEdGhiy1OSNGNyWXJ24nysu0uV-K7LBE8SxJeSFaEFXWRtyLZKeCWUDL8IXEqKWEEj9drlwzKBS0v8wzctQMjWtRxR_Uv3",
    acf: {
      jyotirling_name: "Mallikarjuna Temple",
      jyotirling_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHQGMCPi8rJC0OYmcn4BijTeRlsP89atc1nBZXQ0AD-mkuSi-exvef23_4escqzj2EQowvgN787i66aTb7OgtNmfyTTtMg6IWVpSp95ucZ7P75H9SC-vbyGAcfT03kfJJKy1AmqKvYnOXPSISwT73Xf9wS-O4mpBr1PcEpu1q1AxbY5UhEdGhiy1OSNGNyWXJ24nysu0uV-K7LBE8SxJeSFaEFXWRtyLZKeCWUDL8IXEqKWEEj9drlwzKBS0v8wzctQMjWtRxR_Uv3",
      jyotirling_location_tag: { id: 2, name: "Andhra Pradesh", slug: "andhra-pradesh" },
      jyotirling_description: "Situated on Shri Shaila Mountain by the banks of the Pātāla Gangā, Krishna River in Andhra Pradesh.",
      jyotirling_location: "Srisailam, Andhra Pradesh, India",
      latitude: "16.0742",
      longitude: "78.8681"
    }
  },
  {
    id: 1003,
    slug: "mahakaleshwar-temple",
    title: "Mahakaleshwar Temple",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0DwH4C1dQhsPTmSDbE287245M2ueEp5OTlmBlWHykTp5EVSCRcOriMDh54UGyN14nflvGHBbhXbYIVfq4mKjr7DPU4nWqE8HxH0-UxOi2nMMO2_x-zOgAp9HxuKa94Ds3-bfsD4YjfwQe4L1nEoX77bYa9kRfBZzyA0BCitFtQD9oaxiixLjA6mEe2NFLzCeadX8kpzfVvWyg8Gar9pthsODLp_ed3_BovOooTYRvO7ez4UzYAjXlM_-EBIXmklqBC-GoEmPM_eqO",
    featured_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0DwH4C1dQhsPTmSDbE287245M2ueEp5OTlmBlWHykTp5EVSCRcOriMDh54UGyN14nflvGHBbhXbYIVfq4mKjr7DPU4nWqE8HxH0-UxOi2nMMO2_x-zOgAp9HxuKa94Ds3-bfsD4YjfwQe4L1nEoX77bYa9kRfBZzyA0BCitFtQD9oaxiixLjA6mEe2NFLzCeadX8kpzfVvWyg8Gar9pthsODLp_ed3_BovOooTYRvO7ez4UzYAjXlM_-EBIXmklqBC-GoEmPM_eqO",
    acf: {
      jyotirling_name: "Mahakaleshwar Temple",
      jyotirling_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0DwH4C1dQhsPTmSDbE287245M2ueEp5OTlmBlWHykTp5EVSCRcOriMDh54UGyN14nflvGHBbhXbYIVfq4mKjr7DPU4nWqE8HxH0-UxOi2nMMO2_x-zOgAp9HxuKa94Ds3-bfsD4YjfwQe4L1nEoX77bYa9kRfBZzyA0BCitFtQD9oaxiixLjA6mEe2NFLzCeadX8kpzfVvWyg8Gar9pthsODLp_ed3_BovOooTYRvO7ez4UzYAjXlM_-EBIXmklqBC-GoEmPM_eqO",
      jyotirling_location_tag: { id: 3, name: "Ujjain, MP", slug: "ujjain-mp" },
      jyotirling_description: "Located in the ancient city of Ujjain, Madhya Pradesh, beside the Rudra Sagar lake. Famous for its Bhasma Aarti.",
      jyotirling_location: "Ujjain, Madhya Pradesh, India",
      latitude: "23.1827",
      longitude: "75.7682"
    }
  },
  {
    id: 1004,
    slug: "omkareshwar-temple",
    title: "Omkareshwar Temple",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwGWlsbh2EcVWbKDRRJqOLlg-Y-Tet8SsDQ74M1FT5Wp2vd5harotj2HDBEpGSqtlyrtbfA5zNngB8rvBuUcVY9S1PaobrHXtXfvHdkMsiUq4vjeC6MJehqIwPA3FfNgCy0zLunkZrXJkU6u42bAoZNQnE44wpc18L9CATcxCCEGDdrQu_T_1YWIJLYPFMotkJI9cCMPFmhEgoFkzGgpP664qaSe3Lcj26PdniYtMUCDZSN6WXb3o8GejLSAbMHRu1O3pm_Y6xftN2",
    featured_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwGWlsbh2EcVWbKDRRJqOLlg-Y-Tet8SsDQ74M1FT5Wp2vd5harotj2HDBEpGSqtlyrtbfA5zNngB8rvBuUcVY9S1PaobrHXtXfvHdkMsiUq4vjeC6MJehqIwPA3FfNgCy0zLunkZrXJkU6u42bAoZNQnE44wpc18L9CATcxCCEGDdrQu_T_1YWIJLYPFMotkJI9cCMPFmhEgoFkzGgpP664qaSe3Lcj26PdniYtMUCDZSN6WXb3o8GejLSAbMHRu1O3pm_Y6xftN2",
    acf: {
      jyotirling_name: "Omkareshwar Temple",
      jyotirling_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwGWlsbh2EcVWbKDRRJqOLlg-Y-Tet8SsDQ74M1FT5Wp2vd5harotj2HDBEpGSqtlyrtbfA5zNngB8rvBuUcVY9S1PaobrHXtXfvHdkMsiUq4vjeC6MJehqIwPA3FfNgCy0zLunkZrXJkU6u42bAoZNQnE44wpc18L9CATcxCCEGDdrQu_T_1YWIJLYPFMotkJI9cCMPFmhEgoFkzGgpP664qaSe3Lcj26PdniYtMUCDZSN6WXb3o8GejLSAbMHRu1O3pm_Y6xftN2",
      jyotirling_location_tag: { id: 4, name: "Madhya Pradesh", slug: "madhya-pradesh" },
      jyotirling_description: "An island situated in the Narmada river, said to be in the shape of the Hindu symbol 'Om'.",
      jyotirling_location: "Omkareshwar, Madhya Pradesh, India",
      latitude: "22.2475",
      longitude: "76.1511"
    }
  },
  {
    id: 1005,
    slug: "vaidyanath-temple",
    title: "Vaidyanath Temple",
    image: "https://images.unsplash.com/photo-1542397284-874605985836?q=80&w=300&auto=format&fit=crop",
    featured_image: "https://images.unsplash.com/photo-1542397284-874605985836?q=80&w=300&auto=format&fit=crop",
    acf: {
      jyotirling_name: "Vaidyanath Temple",
      jyotirling_image: "https://images.unsplash.com/photo-1542397284-874605985836?q=80&w=300&auto=format&fit=crop",
      jyotirling_location_tag: { id: 5, name: "Jharkhand", slug: "jharkhand" },
      jyotirling_description: "Also known as Baba Dham, located in Deoghar, Jharkhand. It is revered as the Divine Healer.",
      jyotirling_location: "Deoghar, Jharkhand, India",
      latitude: "24.4925",
      longitude: "86.6999"
    }
  },
  {
    id: 1006,
    slug: "kedarnath-temple",
    title: "Kedarnath Temple",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=300&auto=format&fit=crop",
    featured_image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=300&auto=format&fit=crop",
    acf: {
      jyotirling_name: "Kedarnath Temple",
      jyotirling_image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=300&auto=format&fit=crop",
      jyotirling_location_tag: { id: 6, name: "Uttarakhand", slug: "uttarakhand" },
      jyotirling_description: "The northernmost and highest of the 12 Jyotirlingas, nested in the snow-clad Himalayas of Garhwal.",
      jyotirling_location: "Kedarnath, Uttarakhand, India",
      latitude: "30.7352",
      longitude: "79.0669"
    }
  },
  {
    id: 1007,
    slug: "bhimashankar-temple",
    title: "Bhimashankar Temple",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=300&auto=format&fit=crop",
    featured_image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=300&auto=format&fit=crop",
    acf: {
      jyotirling_name: "Bhimashankar Temple",
      jyotirling_image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=300&auto=format&fit=crop",
      jyotirling_location_tag: { id: 7, name: "Maharashtra", slug: "maharashtra" },
      jyotirling_description: "Located near Pune, Maharashtra, in the Ghat region of the Sahyadri hills. Source of the Bhima River.",
      jyotirling_location: "Pune, Maharashtra, India",
      latitude: "19.0720",
      longitude: "73.5358"
    }
  },
  {
    id: 1008,
    slug: "kashi-vishwanath",
    title: "Kashi Vishwanath Temple",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=300&auto=format&fit=crop",
    featured_image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=300&auto=format&fit=crop",
    acf: {
      jyotirling_name: "Kashi Vishwanath Temple",
      jyotirling_image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=300&auto=format&fit=crop",
      jyotirling_location_tag: { id: 8, name: "Uttar Pradesh", slug: "uttar-pradesh" },
      jyotirling_description: "Located in Varanasi on the holy banks of the Ganges. The most celebrated temple in Hindu history.",
      jyotirling_location: "Varanasi, Uttar Pradesh, India",
      latitude: "25.3109",
      longitude: "83.0104"
    }
  },
  {
    id: 1009,
    slug: "trimbakeshwar-temple",
    title: "Trimbakeshwar Temple",
    image: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?q=80&w=300&auto=format&fit=crop",
    featured_image: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?q=80&w=300&auto=format&fit=crop",
    acf: {
      jyotirling_name: "Trimbakeshwar Temple",
      jyotirling_image: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?q=80&w=300&auto=format&fit=crop",
      jyotirling_location_tag: { id: 7, name: "Maharashtra", slug: "maharashtra" },
      jyotirling_description: "Located in Nashik, Maharashtra. Notable for its three-faced linga representing Brahma, Vishnu, and Shiva.",
      jyotirling_location: "Trimbak, Maharashtra, India",
      latitude: "19.9325",
      longitude: "73.5307"
    }
  },
  {
    id: 1010,
    slug: "nageshwar-temple",
    title: "Nageshwar Temple",
    image: "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?q=80&w=300&auto=format&fit=crop",
    featured_image: "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?q=80&w=300&auto=format&fit=crop",
    acf: {
      jyotirling_name: "Nageshwar Temple",
      jyotirling_image: "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?q=80&w=300&auto=format&fit=crop",
      jyotirling_location_tag: { id: 1, name: "Gujarat", slug: "gujarat" },
      jyotirling_description: "Situated on the coast of Saurashtra, Gujarat, near Dwarka. Revered as the lord of serpents.",
      jyotirling_location: "Dwarka, Gujarat, India",
      latitude: "22.3378",
      longitude: "69.0827"
    }
  },
  {
    id: 1011,
    slug: "ramanathaswamy-temple",
    title: "Ramanathaswamy Temple",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop",
    featured_image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop",
    acf: {
      jyotirling_name: "Ramanathaswamy Temple",
      jyotirling_image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=300&auto=format&fit=crop",
      jyotirling_location_tag: { id: 9, name: "Tamil Nadu", slug: "tamil-nadu" },
      jyotirling_description: "Located on Rameswaram Island in Tamil Nadu. Built by Lord Rama and famous for its longest corridors.",
      jyotirling_location: "Rameswaram, Tamil Nadu, India",
      latitude: "9.2881",
      longitude: "79.3174"
    }
  },
  {
    id: 1012,
    slug: "grishneshwar-temple",
    title: "Grishneshwar Temple",
    image: "https://images.unsplash.com/photo-1608958416719-f9c3f25d97f2?q=80&w=300&auto=format&fit=crop",
    featured_image: "https://images.unsplash.com/photo-1608958416719-f9c3f25d97f2?q=80&w=300&auto=format&fit=crop",
    acf: {
      jyotirling_name: "Grishneshwar Temple",
      jyotirling_image: "https://images.unsplash.com/photo-1608958416719-f9c3f25d97f2?q=80&w=300&auto=format&fit=crop",
      jyotirling_location_tag: { id: 7, name: "Maharashtra", slug: "maharashtra" },
      jyotirling_description: "Located near Ellora Caves in Aurangabad, Maharashtra. The last or twelfth Jyotirlinga on earth.",
      jyotirling_location: "Ellora, Maharashtra, India",
      latitude: "20.0253",
      longitude: "75.1683"
    }
  }
];

export default function JyotirlingasScreen() {
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  const [tours, setTours] = useState<JyotirlingTour[]>(FALLBACK_TOURS);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState<JyotirlingTour | null>(null);

  const handleViewMap = useCallback((tour: JyotirlingTour) => {
    const lat = tour.acf?.latitude;
    const lng = tour.acf?.longitude;
    const address = tour.acf?.jyotirling_location || tour.title;
    
    if (lat && lng && lat.trim() !== "" && lng.trim() !== "") {
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      Linking.openURL(url).catch((err) => console.error("An error occurred", err));
      return;
    }

    const query = encodeURIComponent(`${tour.title} ${address}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url).catch((err) => console.error("An error occurred", err));
  }, []);

  // Dynamic layout calculation based on device width (tablet responsiveness)
  const isTablet = width >= 768;
  const numColumns = isTablet ? 2 : 1;
  const cardWidth = isTablet ? (width - 44) / 2 : "100%";

  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true);
        const response = await fetchJyotirlingTours();
        if (response && response.data && response.data.length > 0) {
          const apiData = response.data;
          const merged = [...apiData];
          
          FALLBACK_TOURS.forEach((fallback) => {
            const fallbackCore = getNormalizedCoreName(fallback.title);
            const exists = apiData.some((item) => {
              const itemCore = getNormalizedCoreName(item.title);
              const itemSlugCore = getNormalizedCoreName(item.slug);
              const fallbackSlugCore = getNormalizedCoreName(fallback.slug);
              
              return (
                itemCore === fallbackCore ||
                itemSlugCore === fallbackSlugCore ||
                itemCore.includes(fallbackCore) ||
                fallbackCore.includes(itemCore)
              );
            });
            
            if (!exists) {
              merged.push(fallback);
            }
          });
          
          setTours(merged);
        }
      } catch (err) {
        console.error("Failed to fetch tours from API:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);
 
  // Filter list based on search term
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const titleMatch = tour.title.toLowerCase().includes(search.toLowerCase());
      const descMatch = (tour.acf?.jyotirling_description || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      const locationMatch = (tour.acf?.jyotirling_location || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      
      const tag = tour.acf?.jyotirling_location_tag;
      const tagMatch = typeof tag === "string" 
        ? tag.toLowerCase().includes(search.toLowerCase())
        : tag?.name.toLowerCase().includes(search.toLowerCase());
 
      return titleMatch || descMatch || locationMatch || tagMatch;
    });
  }, [tours, search]);
 
  const renderItem = useCallback(({ item }: { item: JyotirlingTour }) => {
    const tag = item.acf?.jyotirling_location_tag;
    const tagName = typeof tag === "string" ? tag : tag?.name || "";
    const imageUri = item.image || item.acf?.jyotirling_image;
 
    return (
      <TouchableOpacity
        style={[styles.card, { width: cardWidth }]}
        activeOpacity={0.85}
        onPress={() => setSelectedTour(item)}
      >
        <Image
          source={imageUri ? { uri: imageUri } : require("../../assets/images/ujjain_tirth_logo.png")}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardDetails}>
          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.acf?.jyotirling_description}
            </Text>
          </View>
          {tagName ? (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{tagName}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }, [cardWidth]);

  const jyotirlingaImages = useMemo(() => {
    return (tours || [])
      .map((t) => t.image || t.featured_image || t.acf?.jyotirling_image)
      .filter((img): img is string => typeof img === "string" && img.trim().length > 0);
  }, [tours]);

  return (
    <ScreenContainer>
      <AvailabilityScreen
        isLoading={loading}
        count={tours.length || 12}
        label="Jyotirlingas Available"
        subtitle="Somnath, Mahakaleshwar & Sacred Shrines"
        images={jyotirlingaImages}
        revealDurationMs={650}
      >
        <View style={styles.mainArea}>
          {/* Header Block */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="#8B1E1E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>12 Jyotirlingas</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={18}
              color="#8B1E1E"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search 12 Jyotirlingas..."
              placeholderTextColor="#888"
              value={search}
              onChangeText={setSearch}
              clearButtonMode="while-editing"
            />
          </View>

          {/* List representation */}
          <FlatList
            key={numColumns} // Re-bind on column change to prevent runtime error
            data={filteredTours}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={numColumns}
            columnWrapperStyle={isTablet ? styles.tabletRow : null}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#888" />
                <Text style={styles.emptyText}>
                  No Jyotirlingas found matching “{search}”
                </Text>
              </View>
            }
          />

          {/* Detail Modal */}
          <Modal
            visible={selectedTour !== null}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setSelectedTour(null)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                {selectedTour && (
                  <>
                    <View style={styles.modalHeaderImageContainer}>
                      {/* Blurred background image to fill space beautifully */}
                      <Image
                        source={selectedTour.image || selectedTour.acf?.jyotirling_image ? { uri: selectedTour.image || selectedTour.acf?.jyotirling_image } : require("../../assets/images/ujjain_tirth_logo.png")}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                        blurRadius={15}
                      />
                      {/* Semi-transparent dark overlay for contrast */}
                      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0, 0, 0, 0.15)" }]} />
                      {/* Sharp, full image in the foreground */}
                      <Image
                        source={selectedTour.image || selectedTour.acf?.jyotirling_image ? { uri: selectedTour.image || selectedTour.acf?.jyotirling_image } : require("../../assets/images/ujjain_tirth_logo.png")}
                        style={styles.modalImage}
                        resizeMode="contain"
                      />
                      <TouchableOpacity
                        style={styles.modalCloseBtn}
                        onPress={() => setSelectedTour(null)}
                      >
                        <Ionicons name="close" size={24} color="#FFF" />
                      </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                      {selectedTour.acf?.jyotirling_location_tag ? (
                        <View style={styles.modalTagBadge}>
                          <Text style={styles.modalTagText}>
                            {typeof selectedTour.acf.jyotirling_location_tag === "string"
                              ? selectedTour.acf.jyotirling_location_tag
                              : selectedTour.acf.jyotirling_location_tag.name}
                          </Text>
                        </View>
                      ) : null}

                      <Text style={styles.modalTitle}>{selectedTour.title}</Text>

                      <Text style={styles.modalDescription}>
                        {selectedTour.acf?.jyotirling_description}
                      </Text>
                      
                      {selectedTour.acf?.jyotirling_location ? (
                        <View style={styles.locationContainer}>
                          <Ionicons name="location-sharp" size={16} color="#8B1E1E" />
                          <Text style={styles.locationText}>
                            {cleanLocationText(selectedTour.acf.jyotirling_location)}
                          </Text>
                        </View>
                      ) : null}
                    </ScrollView>

                    <TouchableOpacity
                      style={styles.mapButton}
                      onPress={() => handleViewMap(selectedTour)}
                    >
                      <Ionicons name="map-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                      <Text style={styles.mapButtonText}>View on Map</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </AvailabilityScreen>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mainArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FDE8E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8B1E1E",
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: {
    width: 44,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1B1C1C",
    fontWeight: "500",
    height: "100%",
  },
  listContent: {
    paddingBottom: 80,
  },
  tabletRow: {
    justifyContent: "space-between",
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.card,
  },
  cardImage: {
    width: 110,
    height: 85,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceMuted,
  },
  cardDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.regular,
    color: COLORS.sacred,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    lineHeight: 18,
  },
  tagBadge: {
    backgroundColor: COLORS.primaryTint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  tagText: {
    color: COLORS.primaryDeep,
    fontSize: 11,
    fontFamily: FONTS.body.bold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 12,
    color: "#555",
    fontSize: 15,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#F5F2EA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeaderImageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  modalCloseBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalScroll: {
    marginBottom: 16,
  },
  modalTagBadge: {
    backgroundColor: COLORS.primaryTint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  modalTagText: {
    color: COLORS.primaryDeep,
    fontSize: 12,
    fontFamily: FONTS.body.bold,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 22,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.sacredTint,
    padding: 10,
    borderRadius: RADIUS.sm,
    marginTop: 8,
  },
  locationText: {
    fontSize: 13,
    fontFamily: FONTS.body.medium,
    color: COLORS.sacred,
    marginLeft: 6,
    flex: 1,
  },
  mapButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    height: 48,
    borderRadius: RADIUS.sm,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.subtle,
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: FONTS.body.semiBold,
  },
});
