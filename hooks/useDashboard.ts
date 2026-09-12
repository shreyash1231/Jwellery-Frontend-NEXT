import { addNewsletterApi, addToCartAPI, addToCartLocal, fetchAllProducts, fetchBanners, fetchBestProducts, fetchCartService, fetchCategories, fetchCategoriesProducts, fetchFooterDetails, fetchReels, fetchShopProductFunction, getAllContent, getProductsByCategory } from "@/service/dashboardService";
import { ContentItem, Reel } from "@/type/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


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

export const useFooter = () => {
  return useQuery({
    queryKey: ["footer"],
    queryFn: fetchFooterDetails,
    staleTime: 1000 * 60 * 10, // cache 10 min
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

export const useNewsletter = () => {
  return useMutation({
    mutationFn: addNewsletterApi,

    onSuccess: (data) => {
      console.log("Success:", data);
    },

    onError: (error: any) => {
      console.error("Error:", error?.response?.data || error.message);
    },
  });
};

export const useReels = () => {
  return useQuery<Reel[]>({
    queryKey: ["reels"],
    queryFn: fetchReels,
    staleTime: 1000 * 60 * 5, // 5 min cache
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      productData,
    }: {
      productId: string;
      productData: any;
    }) => {
      const token = localStorage.getItem("token");

      if (token) {
        return await addToCartAPI(productId, token);
      } else {
        return addToCartLocal(productData, productId);
      }
    },

    onSuccess: (data: any) => {
      if (data?.success === false) {
        toast.info(data?.message || "Item is already in your cart");
      } else {
        toast.success("Added to cart");
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Could not add item to cart. Please try again."
      );
    },
  });
};

export const useCart = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartService,
  });

  const refetchCart = () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  return { ...query, refetchCart };
};

export const useShippingPolicy = () => {
  return useQuery<ContentItem | null>({
    queryKey: ["shipping-policy"],
    queryFn: async () => {
      const data = await getAllContent();

      const shipping = data.find(
        (item) => item.type === "SHIPPING_POLICY"
      );

      return shipping || null;
    },
  });
};

export const useExchangePolicy = () => {
  return useQuery<ContentItem | null>({
    queryKey: ["Exchange-policy"],
    queryFn: async () => {
      const data = await getAllContent();

      const shipping = data.find(
        (item) => item.type === "EXCHANGE_POLICY"
      );

      return shipping || null;
    },
  });
};

export const usePrivacyPolicy = () => {
  return useQuery<ContentItem | null>({
    queryKey: ["Privacy-policy"],
    queryFn: async () => {
      const data = await getAllContent();

      const shipping = data.find(
        (item) => item.type === "PRIVACY_POLICY"
      );

      return shipping || null;
    },
  });
};


export const useTermsandCondition = () => {
  return useQuery<ContentItem | null>({
    queryKey: ["Terms-policy"],
    queryFn: async () => {
      const data = await getAllContent();

      const shipping = data.find(
        (item) => item.type === "TERMS_AND_CONDITIONS"
      );

      return shipping || null;
    },
  });
};