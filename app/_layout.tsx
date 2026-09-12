import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import {
  Fraunces_400Regular,
  Fraunces_600SemiBold,
} from "@expo-google-fonts/fraunces";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import { AuthProvider } from "@/context/AuthContext";
import { fetchPackages } from "@/services/packagesServices";
import { fetchParikramaData } from "@/services/parikramaService";
import { fetchPoojas } from "@/services/poojaService";
import {
  fetchAccommodation,
  fetchService,
} from "@/services/serviceServices";
import { fetchTemples } from "@/services/templeService";
import { fetchTransportServices } from "@/services/transportService";

type TemplePage = Awaited<ReturnType<typeof fetchTemples>>;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Fraunces-Regular": Fraunces_400Regular,
    "Fraunces-SemiBold": Fraunces_600SemiBold,
    "Manrope-Regular": Manrope_400Regular,
    "Manrope-Medium": Manrope_500Medium,
    "Manrope-SemiBold": Manrope_600SemiBold,
    "Manrope-Bold": Manrope_700Bold,
  });

  // Create a single query client instance
  const checkForUpdate = async () => {
    if (!__DEV__) {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.log("Update error:", e);
      }
    }
  };
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5, // 5 minutes cache
            gcTime: 1000 * 60 * 30, // Keep splash/OTP-prefetched data for 30 minutes
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  useEffect(() => {
    checkForUpdate();
  }, []);

  useEffect(() => {
    const prefetchAppData = async () => {
      // One request at a time prevents background warming from competing with OTP.
      await queryClient.prefetchQuery({
        queryKey: ["services"],
        queryFn: fetchService,
        retry: false,
      });

      await queryClient.prefetchQuery({
        queryKey: ["packages"],
        queryFn: fetchPackages,
        retry: false,
      });

      await queryClient.prefetchInfiniteQuery({
        queryKey: ["temples", undefined, null],
        queryFn: ({ pageParam = 1 }) =>
          fetchTemples({ page: pageParam, tag: null }),
        initialPageParam: 1,
        getNextPageParam: (lastPage: TemplePage, allPages: TemplePage[]) => {
          const nextPage = allPages.length + 1;
          return nextPage > lastPage.totalPages ? undefined : nextPage;
        },
        retry: false,
      });

      await queryClient.prefetchQuery({
        queryKey: ["poojas"],
        queryFn: fetchPoojas,
        retry: false,
      });

      await queryClient.prefetchQuery({
        queryKey: ["accommodation"],
        queryFn: fetchAccommodation,
        retry: false,
      });

      await queryClient.prefetchQuery({
        queryKey: ["transport_services"],
        queryFn: fetchTransportServices,
        retry: false,
      });

      await queryClient.prefetchQuery({
        queryKey: ["narmada_parikrama"],
        queryFn: fetchParikramaData,
        retry: false,
      });
    };

    void prefetchAppData();
  }, [queryClient]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
