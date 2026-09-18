import API from "@/constants/api";
import { updateUserOrders } from "@/slices/user-orders-slice";
import { RootState } from "@/store/store";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useUserOrders() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state?.auth);

  const fetchUserOrders = useCallback(async () => {
    if (user?.isLoggedIn) {
      try {
        dispatch(updateUserOrders({ fetching: true }));
        const response = await API.get(`farmer-services`, {
          headers: { Accept: "application/json" },
        });
        if (response.data?.status == "success") {
          dispatch(
            updateUserOrders({ data: response.data?.data?.reverse() ?? [] }),
          );
        } else {
          console.error("Failed to fetch orders: Invalid response format");
        }
      } catch (error: any) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message,
        );
      } finally {
        dispatch(updateUserOrders({ fetching: false }));
      }
    } else {
      dispatch(updateUserOrders({ fetching: false }));
    }
  }, [dispatch, user]);

  return { fetchUserOrders };
}
