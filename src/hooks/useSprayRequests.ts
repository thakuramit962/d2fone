import API from "@/constants/api";
import { updateProcessingState } from "@/slices/processing-state-slice";
import { updateSprayRequests } from "@/slices/spray-request-slice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "./useToast";

export interface SprayRequestPayload {
  // type: "update" | "create";
  request_id: string;
  crop_id?: string | number;
  crop_name?: string;
  request_date?: string;
  acreage?: string | number;
  farm_id?: string | number;
  farmer_rejected_remarks?: string;
  rejected_remarks?: string;
  status?: "0" | "1";
}

export default function useSprayRequests() {
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const fetchMyRequests = useCallback(() => {
    dispatch(updateSprayRequests({ loading: true, error: null }));
    API.get("/v1/fetch-farmer-spray-requests", {
      params: {
        status: undefined, // 0|1|2
      },
    })
      .then((res) => {
        if (res.data?.status === "success")
          dispatch(updateSprayRequests({ list: res.data?.data ?? [] }));
        else
          dispatch(updateSprayRequests({ error: "Could not load requests" }));
      })
      .catch(() => {
        dispatch(updateSprayRequests({ error: "Could not load requests" }));
      })
      .finally(() => {
        dispatch(updateSprayRequests({ loading: false }));
      });
  }, []);

  const updateRequest = useCallback(
    (
      data: SprayRequestPayload,
      successCallback?: () => void,
      errorCallback?: (msg: string) => void,
    ) => {
      dispatch(updateProcessingState(true));

      const url = "/v1/update-farmer-request";

      API.post(url, data)
        .then((res) => {
          if (res.data?.status === "success") {
            showToast("Request updates successfully!", "", "success");
            successCallback?.();
          } else {
            errorCallback?.(res.data?.msg || "Failed to update");
          }
        })
        .catch((err) => {
          console.error(err);
          errorCallback?.(err || "Failed to update");
        })
        .finally(() => {
          dispatch(updateProcessingState(false));
        });
    },
    [],
  );

  return {
    fetchMyRequests,
    updateRequest,
  };
}
