import { ContentItem } from "@/type/api";
import axios from "axios";

const normalizeBaseUrl = (value?: string) => {
  if (!value) return "http://localhost:5000";
  return value.trim().replace(/\/+$/, "");
};

export const API = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL);

// Banners
export const fetchBanners = async () => {
  const res = await axios.get(`${API}/api/v1/user/get-all-banners`);
  return res.data;
};

// Best products
export const fetchBestProducts = async () => {
  const res = await axios.get(`${API}/api/v1/user/get-bestSeller-products`);
  return res.data;
};

// All products
export const fetchAllProducts = async () => {
  const res = await axios.get(`${API}/api/v1/user/get-All-products`);
  return res.data;
};

// Categories
export const fetchCategories = async () => {
  const res = await axios.get(`${API}/api/v1/user/get-shop-by-func-categories`);
  return res.data;
};

export const fetchCategoriesProducts = async (id:string) => {
  const res = await axios.get(`${API}/api/v1/user/get-All-products?categoryId=${id}`);
  return res.data;
};



export const fetchShopProductFunction = async () => {
  const res = await axios.get(`${API}/api/v1/user/get-shop-by-prod-categories`);
  return res.data;
};


export const getProductsByCategory = async (categoryId: string) => {
  const res = await axios.get(`${API}/api/v1/user/get-all-products`,
    {
      params: {
        page: 1,
        limit: 12,
        categoryId,
      },
    }
  );

  return res.data;
};

export type MarqueeSettings = {
  messages: string[];
  textColor: string;
  backgroundColor: string;
  speed: number;
  isActive: boolean;
};

export type DeliverySettings = {
  deliveryCharge: number;
  // Orders above this ship free; 0 means delivery is always charged
  freeDeliveryAbove: number;
  // fixed: arrives in deliveryDaysMin days; range: between deliveryDaysMin and deliveryDaysMax days
  deliveryDaysType: "fixed" | "range";
  deliveryDaysMin: number;
  deliveryDaysMax: number;
};

export type SiteSettings = DeliverySettings & {
  newFeaturesEnabled: boolean;
};

// Same defaults as the server (the old fixed rule: ₹200 on orders up to ₹5000)
export const DEFAULT_DELIVERY: DeliverySettings = {
  deliveryCharge: 200,
  freeDeliveryAbove: 5000,
  deliveryDaysType: "range",
  deliveryDaysMin: 3,
  deliveryDaysMax: 7,
};

// Delivery charge for an order total after coupon; must match the server's rule
export const shippingChargeFor = (orderTotal: number, s: DeliverySettings = DEFAULT_DELIVERY) => {
  const freeAbove = Number(s.freeDeliveryAbove) || 0;
  if (freeAbove > 0 && orderTotal > freeAbove) return 0;
  return Math.max(0, Number(s.deliveryCharge) || 0);
};

const num = (v: unknown, fallback: number) => (Number.isFinite(Number(v)) && v !== null && v !== "" ? Number(v) : fallback);

// Off unless the admin has switched it on, so a failed request shows the old site
export const fetchSiteSettings = async (): Promise<SiteSettings> => {
  const res = await axios.get(`${API}/api/v1/user/get-site-settings`);
  const d = res.data?.data || {};
  return {
    newFeaturesEnabled: !!d.newFeaturesEnabled,
    deliveryCharge: num(d.deliveryCharge, DEFAULT_DELIVERY.deliveryCharge),
    freeDeliveryAbove: num(d.freeDeliveryAbove, DEFAULT_DELIVERY.freeDeliveryAbove),
    deliveryDaysType: d.deliveryDaysType === "fixed" ? "fixed" : "range",
    deliveryDaysMin: num(d.deliveryDaysMin, DEFAULT_DELIVERY.deliveryDaysMin),
    deliveryDaysMax: num(d.deliveryDaysMax, DEFAULT_DELIVERY.deliveryDaysMax),
  };
};

// Product reviews (added by the admin; customers can only read them)
export type ReviewSort = "newest" | "verified" | "photos";

export type ReviewMedia = { type: "image" | "video"; url: string };

export type ProductReview = {
  _id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  media: ReviewMedia[];
  reviewedAt: string;
};

export type ReviewSummary = {
  average: number;
  count: number;
  distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
  verified: number;
  withMedia: number;
};

export type ReviewPage = {
  reviews: ProductReview[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  summary: ReviewSummary;
};

export const fetchProductReviews = async (
  productId: string,
  sort: ReviewSort,
  page: number,
  limit = 5,
): Promise<ReviewPage> => {
  const res = await axios.get(`${API}/api/v1/user/get-product-reviews/${productId}`, {
    params: { sort, page, limit },
  });
  return res.data?.data;
};

// Collections: homepage previews (first 4 products each) and one full collection
export type CollectionPlacement =
  | "after_banner"
  | "after_signature"
  | "after_categories"
  | "after_best_sellers"
  | "after_shop_the_look"
  | "after_dulhan";

export type CollectionProduct = {
  _id: string;
  name: string;
  sellingPrice: number;
  mrp?: number;
  imageUrl: string[] | string;
  categoryId?: string | { _id: string; name?: string };
  ratingAverage?: number;
  ratingCount?: number;
};

export type HomeCollection = {
  _id: string;
  title: string;
  placement: CollectionPlacement;
  totalProducts: number;
  products: CollectionProduct[];
};

export type CollectionDetail = {
  _id: string;
  title: string;
  totalProducts: number;
  categories: { _id: string; name: string }[];
  products: CollectionProduct[];
};

export const fetchHomeCollections = async (): Promise<HomeCollection[]> => {
  const res = await axios.get(`${API}/api/v1/user/get-home-collections`);
  return res.data?.data || [];
};

export const fetchCollection = async (id: string): Promise<CollectionDetail> => {
  const res = await axios.get(`${API}/api/v1/user/get-collection/${id}`);
  return res.data?.data;
};

export const fetchMarquee = async (): Promise<MarqueeSettings | null> => {
  const res = await axios.get(`${API}/api/v1/user/get-marquee`);
  return res.data?.data ?? null;
};

export const validateCouponApi = async (code: string, amount: number, token: string) => {
  const res = await axios.post(
    `${API}/api/v1/user/validate-coupon`,
    { code, amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data?.data as { discount: number; finalAmount: number; coupon: any };
};

export const fetchReels = async () => {
  const res = await axios.get(`${API}/api/v1/user/get-all-reels`);
  return res.data?.data || []; 
};

export const addNewsletterApi = async (data: { email: string }) => {
  const response = await axios.post(`${API}/api/v1/user/add-newsletter`, data);
  return response.data;
};

export const addToCartAPI = async (productId: string, token: string) => {
  const res = await axios.post(
    `${API}/api/v1/user/cart/add`,
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const addToCartLocal = (productData: any, id: string) => {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const existing = cart.find((item: any) => item._id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...productData,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  return cart;
};

export const updateCartItemAPI = async (
  productId: string,
  action: "increase" | "decrease",
  token: string
) => {
  const res = await axios.patch(
    `${API}/api/v1/user/cart/update`,
    { productId, action },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const removeCartItemAPI = async (productId: string, token: string) => {
  const res = await axios.delete(`${API}/api/v1/user/cart/remove/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateCartItemLocal = (
  productId: string,
  action: "increase" | "decrease"
) => {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cart = cart
    .map((item: any) => {
      if (item._id !== productId) return item;
      const qty =
        action === "increase" ? (item.quantity || 1) + 1 : (item.quantity || 1) - 1;
      return { ...item, quantity: qty };
    })
    .filter((item: any) => (item.quantity || 1) > 0);

  localStorage.setItem("cart", JSON.stringify(cart));

  return cart;
};

export const removeCartItemLocal = (productId: string) => {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart = cart.filter((item: any) => item._id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
};

export const fetchCartService = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    const res = await axios.get(`${API}/api/v1/user/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } else {
    // fallback to local cart
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    return { data: { items: localCart } };
  }
};


export const getAllContent = async (): Promise<ContentItem[]> => {
  const res = await axios.get(`${API}/api/v1/user/get-all-content`);

  if (!res.data?.success) {
    throw new Error("Failed to fetch content");
  }

  return res.data.data;
};

export const fetchFooterDetails = async () => {
  const res = await axios.get(`${API}/api/v1/user/get-in-touch`);
  return res.data?.data?.[0] || null;
};