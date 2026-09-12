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