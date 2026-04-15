import axios from "axios";

export const API = process.env.NEXT_PUBLIC_API_URL;

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