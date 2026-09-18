import API from "@/constants/api";
import { s3BucketUrl } from "@/constants/appConstant";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

interface Banner {
  fetching: Boolean;
  data: any[];
}
const initial: Banner = {
  fetching: false,
  data: [],
};

export function useBanners() {
  const dispatch = useDispatch();

  const [banner, setBanner] = useState<Banner>(initial);

  const fetchBanners = useCallback(async () => {
    try {
      setBanner((prev) => ({ ...prev, fetching: true }));
      const response = await API.get(`app-banner`, {
        headers: { Accept: "application/json" },
        params: {
          role: "farmer",
        },
      });

      if (response.data?.statuscode == "200") {
        const all = response.data?.data?.map(
          (img: any) => `${s3BucketUrl}/${img?.image}`,
        );
        setBanner((prev) => ({ ...prev, data: all }));
      } else {
        console.error(
          "Failed to fetch banners:",
          response.data?.message || "Unknown error",
        );
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setBanner((prev) => ({ ...prev, fetching: false }));
    }
  }, [dispatch]);

  return {
    fetchBanners,
    banner,
  };
}
