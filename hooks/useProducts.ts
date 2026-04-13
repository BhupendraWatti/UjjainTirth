import {
  fetchPackageById,
  fetchPackages,
} from "@/services/packagesServices";
import { Package } from "@/types/product";
import { useCallback, useEffect, useState } from "react";

/**
 * Hook to fetch all packages (list view - basic fields)
 */
export const usePackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPackages();
      setPackages(data);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  return { packages, loading, error, reload: loadPackages };
};

/**
 * Hook to fetch full package details by ID
 * (includes package_details & additional_info)
 */
export const usePackageDetail = (id: number | null) => {
  const [packageDetail, setPackageDetail] = useState<Package | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPackageById(id);
      setPackageDetail(data);
    } catch (err) {
      setError("Failed to load package details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadDetail();
    } else {
      setPackageDetail(null);
    }
  }, [id, loadDetail]);

  return { packageDetail, loading, error, reload: loadDetail };
};
