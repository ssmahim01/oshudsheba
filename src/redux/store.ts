import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "./features/baseApi";
import { ordersReducer } from "./features/orders/ordersSlice";

import cartReducer from "@/redux/slices/CartSlice";
import couponReducer from "@/redux/slices/CouponSlice";
import wishReducer from "@/redux/slices/wishSlice";
import viewModeReducer from "@/redux/slices/viewModeSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,

    orders: ordersReducer,
    cart: cartReducer,
    coupon: couponReducer,
    wish: wishReducer,
    viewMode: viewModeReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),

  // Keep enabled during development to detect state issues.
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
