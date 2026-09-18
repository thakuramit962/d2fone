import API from "@/constants/api";
import { APP_VERSION } from "@/constants/appConstant";
import { useState } from "react";

export default function useAppVersion() {
  const [checking, setChecking] = useState(true);
  const [version, setVersion] = useState(APP_VERSION);

  const checkUpdate = () => {
    setChecking(true);
    API.get("check-app-version", {
      params: {
        app_name: "Agriwings",
      },
    })
      .then((res) => {
        setVersion(res.data?.data?.version);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setChecking(false);
      });
  };

  return {
    checkUpdate,
    version,
    checking,
  };
}
