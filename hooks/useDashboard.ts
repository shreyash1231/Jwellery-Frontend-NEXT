import { fetchAllProducts, fetchBanners, fetchBestProducts, fetchCategories, fetchCategoriesProducts, fetchShopProductFunction, getProductsByCategory } from "@/service/dashboardService";
import { useQuery } from "@tanstack/react-query";


// Banners
export const useBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};

// Best products
export const useBestProducts = () => {
  return useQuery({
    queryKey: ["best-products"],
    queryFn: fetchBestProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};

// All products
export const useAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};

export const useCategoriesProduct = (id: string) => {
  return useQuery({
    queryKey: ["categories", id], // ✅ include id
    queryFn: () => fetchCategoriesProducts(id), // ✅ wrap in function
    enabled: !!id, // ✅ prevent early call
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};

export const useShopByProductFunction = () => {
  return useQuery({
    queryKey: ["shopbyProductfunction"],
    queryFn: fetchShopProductFunction,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};

export const useProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => getProductsByCategory(categoryId),
    enabled: !!categoryId, // only run when id exists
  });
};

