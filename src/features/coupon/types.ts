export type DiscountType = "PERCENT" | "FIXED";

export interface ICoupon {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit?: number;
  usedCount?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCouponPayload {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit?: number;
}

export interface UpdateCouponPayload extends CreateCouponPayload {
  isActive?: boolean;
}

export interface ApplyCouponPayload {
  code: string;
  total: number;
}

export interface ApplyCouponResponse {
  discount: number;
  finalTotal: number;
  couponId: string;
}

export interface GetCouponsResponse {
  success: boolean;
  message: string;
  data: ICoupon[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface GetCouponsQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
  isActive?: boolean;
}
