import { Order } from "@/models/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserOrders {
  fetching: boolean;
  data: Order[];
}

const initialState: UserOrders = {
  fetching: true,
  data: [],
};

export const userOrdersSlice = createSlice({
  name: "userOrders",
  initialState,
  reducers: {
    updateUserOrders: (state, action: PayloadAction<Partial<UserOrders>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateUserOrders } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;
