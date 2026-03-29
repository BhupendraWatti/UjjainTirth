import { fetchPackages } from "@/services/packagesServices";
import { Package } from "@/types/product";
import { useEffect, useState } from "react";

export const usePackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPackages = async () => {
    try {
      setLoading(true);
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
