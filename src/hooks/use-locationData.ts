import API from "@/constants/api";
import { capitalizeWords, states } from "@/utils/app-helper";
import { useCallback, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoadingState = "district" | "subdistrict" | "village" | null;

interface SelectionItemsType {
  id: string;
  label: string;
  value: string;
}

interface StateType {
  [key: string]: unknown;
}

interface LocationSlice {
  selected: SelectionItemsType[];
  list: SelectionItemsType[];
}

interface UseLocationDataReturn {
  loading: LoadingState;
  stateList: SelectionItemsType[];
  selectedState: StateType[];
  district: LocationSlice;
  subDistrict: LocationSlice;
  village: LocationSlice;
  setSelectedState: React.Dispatch<React.SetStateAction<StateType[]>>;
  setDistrict: React.Dispatch<React.SetStateAction<LocationSlice>>;
  setSubDistrict: React.Dispatch<React.SetStateAction<LocationSlice>>;
  setVillage: React.Dispatch<React.SetStateAction<LocationSlice>>;
  fetchData: (
    state: string,
    district?: string,
    subDistrict?: string,
  ) => Promise<void>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_SLICE: LocationSlice = { selected: [], list: [] };

// ─── Pure helpers (defined outside — stable, no deps) ────────────────────────

const resolveLoadingState = (
  state: string,
  district: string,
  subDistrict: string,
): LoadingState => {
  if (state && district && subDistrict) return "village";
  if (state && district) return "subdistrict";
  if (state) return "district";
  return null;
};

const stateList: SelectionItemsType[] = states
  .map((state, index) => ({
    id: `state-${index + 1}`,
    label: state,
    value: capitalizeWords(state),
  }))
  .sort((a, b) =>
    a.value.replace(/\s/g, "").localeCompare(b.value.replace(/\s/g, "")),
  );

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLocationData(): UseLocationDataReturn {
  const [loading, setLoading] = useState<LoadingState>(null);
  const [selectedState, setSelectedState] = useState<StateType[]>([]);
  const [district, setDistrict] = useState<LocationSlice>(EMPTY_SLICE);
  const [subDistrict, setSubDistrict] = useState<LocationSlice>(EMPTY_SLICE);
  const [village, setVillage] = useState<LocationSlice>(EMPTY_SLICE);

  const clearDownstream = useCallback((from: LoadingState) => {
    if (from === "district") {
      setDistrict(EMPTY_SLICE);
      setSubDistrict(EMPTY_SLICE);
      setVillage(EMPTY_SLICE);
    } else if (from === "subdistrict") {
      setSubDistrict(EMPTY_SLICE);
      setVillage(EMPTY_SLICE);
    } else if (from === "village") {
      setVillage(EMPTY_SLICE);
    }
  }, []);

  const fetchData = useCallback(
    async (state: string, district = "", subDistrict = "") => {
      // Extract string value if an object is passed accidentally
      const stateVal =
        typeof state === "object" && state !== null
          ? (state as SelectionItemsType).value
          : state;

      const level = resolveLoadingState(stateVal, district, subDistrict);
      if (!level) return;

      setLoading(level);

      try {
        const res = await API.post("get_location_data", {
          state: stateVal,
          district,
          sub_district: subDistrict,
        });

        if (!res.data?.data) {
          clearDownstream(level);
          return;
        }

        const dataList: SelectionItemsType[] = res.data.data.map(
          (name: string, index: number) => ({
            id: `location-${index + 1}`,
            label: name,
            value: name,
          }),
        );

        if (level === "district") {
          setDistrict({ selected: [], list: dataList });
          setSubDistrict(EMPTY_SLICE);
          setVillage(EMPTY_SLICE);
        } else if (level === "subdistrict") {
          setSubDistrict({ selected: [], list: dataList });
          setVillage(EMPTY_SLICE);
        } else {
          setVillage({ selected: [], list: dataList });
        }
      } catch (err) {
        console.error("Error fetching location data:", err);
      } finally {
        setLoading(null);
      }
    },
    [clearDownstream],
  );

  return {
    loading,
    stateList,
    selectedState,
    district,
    subDistrict,
    village,
    setSelectedState,
    setDistrict,
    setSubDistrict,
    setVillage,
    fetchData,
  };
}
