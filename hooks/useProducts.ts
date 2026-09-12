import {
  fetchPackageById,
  fetchPackages,
} from "@/services/packagesServices";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useEffect } from "react";

/**
 * Hook to fetch all packages (list view - basic fields)
 */
export const usePackages = () => {
  const query = useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const imageUrls = (query.data || [])
      .map((p) => p.image?.trim())
      .filter((url): url is string => Boolean(url && url.length > 0));

    if (imageUrls.length > 0) {
      Promise.allSettled(
        imageUrls.map((url) => Image.prefetch(url, "memory-disk")),
      ).catch(() => {});
    }
  }, [query.data]);

  return {
    packages: query.data || [],
    loading: query.isLoading,
    error: query.error ? "Something went wrong" : null,
    reload: query.refetch,
  };
};

/**
 * Hook to fetch full package details by ID
 * (includes package_details & additional_info)
 */
export const usePackageDetail = (id: number | null) => {
  const query = useQuery({
    queryKey: ["package", id],
    queryFn: () => fetchPackageById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10,
  });

  return {
    packageDetail: query.data ?? null,
    loading: query.isLoading,
    error: query.error ? "Failed to load package details" : null,
    reload: query.refetch,
  };
};
