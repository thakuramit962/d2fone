import { updateToast } from "@/slices/toast-slice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export function useToast() {
  const dispatch = useDispatch();

  const showToast = useCallback(
    (
      title: string,
      message?: string,
      severity?: "success" | "error" | "warning" | "info" | "normal",
    ) => {
      dispatch(updateToast({ title, message, severity }));
    },
    [dispatch],
  );

  return {
    showToast,
  };
}
