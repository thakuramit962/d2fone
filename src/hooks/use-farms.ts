import API from "@/constants/api";
import { patchUser } from "@/slices/auth-slice";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

export interface FetchFarmParams {
  farmer_id?: string;
  farm_id?: string;
}

export default function useFarms() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const fetchFarms = useCallback(({ farmer_id, farm_id }: FetchFarmParams) => {
    const params = {
      ...(farmer_id && { farmer_id }),
      ...(farm_id && { farm_id }),
    };
    setLoading(true);
    API.get("/v1/fetch-farm-details", {
      params: params,
    })
      .then((res) => {
        if (res.data?.status == "success") {
          dispatch(
            patchUser({
              userFarms: res.data.data,
            }),
          );
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    fetchFarms,
    loading,
  };
}
