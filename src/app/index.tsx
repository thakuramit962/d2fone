import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

export default function Index() {
  const hasOnboarded = useSelector(
    (state: RootState) => state?.appSlice?.hasOnboarded,
  );

  return <Redirect href={hasOnboarded ? "/tabs/home" : "/landing"} />;
}
