import { WeatherReport } from "@/models/weather";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: WeatherReport = {
  fetching: true,
  data: null,
  errorMessage: null,
};

export const weatherReportSlice = createSlice({
  name: "weatherReport",
  initialState,
  reducers: {
    updateWeatherReport: (
      state,
      action: PayloadAction<Partial<WeatherReport>>,
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateWeatherReport } = weatherReportSlice.actions;
export default weatherReportSlice.reducer;
