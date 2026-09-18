import API from "@/constants/api";
import { useCallback, useState } from "react";

export function useAllCrops() {
  const [allCrops, setAllCrops] = useState<any[]>([]);
  const [fetchingAllCrops, setFetchingAllCrops] = useState(false);

  const fetchAllCrops = useCallback(async () => {
    try {
      setFetchingAllCrops(true);
      const response = await API.get("/get_crops", {
        headers: { Accept: "application/json" },
      });

      if (response.data?.statuscode === "200") {
        setAllCrops(response.data?.data || []);
      } else {
        console.error(
          "Failed to fetch crops:",
          response.data?.message || "Unknown error",
        );
      }
    } catch (error) {
      console.error("Error fetching crops:", error);
    } finally {
      setFetchingAllCrops(false);
    }
  }, []);

  return {
    fetchAllCrops,
    allCrops,
    fetchingAllCrops,
  };
}
