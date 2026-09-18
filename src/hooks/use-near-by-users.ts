import API from "@/constants/api";
import { RootState } from "@/store/store";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

interface NearByUserRaw {
  distance: number;
  emp_id: string;
  id: string;
  location_coordinates: string; // "lat,long"
  name: string;
  role: string;
}

interface NearByUserMember {
  distance: number;
  emp_id: string;
  id: string;
  location_coordinates: {
    latitude: number;
    longitude: number;
  };
  name: string;
  role: string;
}

interface NearByUsers {
  loading: boolean;
  error?: string | null;
  members: NearByUserMember[];
}

const DEFAULT_RADIUS = 50;
const DEFAULT_ROLES = "operator,rm";

export default function useNearByUsers() {
  const myLocation = useSelector(
    (state: RootState) => state.appSlice.locationCoords,
  );
  const [usersLocation, setUsersLocation] = useState<NearByUsers>({
    loading: false,
    error: null,
    members: [],
  });

  const getNearByUsers = useCallback(() => {
    if (!myLocation) return;

    const latLong = `${myLocation.latitude},${myLocation.longitude}`;

    setUsersLocation((prev) => ({ ...prev, loading: true, error: null }));

    API.post("/v1/get-nearby-users", {
      location_coordinates: latLong,
      radius: DEFAULT_RADIUS,
      role: DEFAULT_ROLES,
    })
      .then((res) => {
        const members: NearByUserMember[] =
          (res.data?.data as NearByUserRaw[] | undefined)?.map((el) => {
            const [latitude, longitude] = String(el.location_coordinates).split(
              ",",
            );
            return {
              distance: el.distance,
              emp_id: el.emp_id,
              id: el.id,
              location_coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
              },
              name: el.name,
              role: el.role,
            };
          }) ?? [];

        setUsersLocation((prev) => ({ ...prev, members }));
      })
      .catch((err) => {
        setUsersLocation((prev) => ({
          ...prev,
          error: err?.message ?? "Failed to fetch nearby users",
        }));
      })
      .finally(() => {
        setUsersLocation((prev) => ({ ...prev, loading: false }));
      });
  }, [myLocation]);

  return {
    getNearByUsers,
    usersLocation,
  };
}
