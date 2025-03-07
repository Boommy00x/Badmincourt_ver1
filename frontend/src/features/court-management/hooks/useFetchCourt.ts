import { useState, useCallback } from "react";
import type { Court } from "../types/court";

import { fetchCourtService } from "../services/courtFetchServices";

export function useFetchCourts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCourtService.fetchCourts();

      // console.log("Processed Courts Data:", data);

      setCourts(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch courts");
      console.error("Error in useCourts hook:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    courts,
    isLoading,
    error,
    fetchCourts,
  };
}
