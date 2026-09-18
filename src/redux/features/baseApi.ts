import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: axiosBaseQuery(),

  tagTypes: [
    "ME",
    "USERS",
    "USER",
    "CUSTOMERS",
    "CUSTOMER",

    // Products
    "PRODUCTS",
    "PRODUCT",
    "PRODUCT_VERIFICATION",
    "PRODUCT_PURCHASES",
    "PRODUCT_PURCHASE",

    // Catalog
    "BRANDS",
    "BRAND",
    "CATEGORIES",
    "CATEGORY",

    // Orders
    "ORDERS",
    "ORDER",
    "MY_ORDERS",
    "RETURNS",
    "RETURN",

    // Courier
    "COURIERS",
    "COURIER",
    "COURIER_SETTINGS",
    "COURIER_SETTING",

    // Dashboard and POS
    "DASHBOARD_OVERVIEW",
    "DASHBOARD_STATS",
    "POSSTATS",

    // Marketing and content
    "COUPONS",
    "LEADS",
    "LEAD",
    "REVIEWS",
    "REVIEW",
    "PRODUCT_BLOG",
  ],

  // Cache unused query data for 60 seconds.
  keepUnusedDataFor: 60,

  // Prevent automatic refetching unless explicitly required.
  refetchOnFocus: false,
  refetchOnReconnect: false,

  endpoints: () => ({}),
});