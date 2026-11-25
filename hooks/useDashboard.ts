import { addNewsletterApi, addToCartAPI, addToCartLocal, fetchAllProducts, fetchBanners, fetchBestProducts, fetchCartService, fetchCategories, fetchCategoriesProducts, fetchRelatedProducts, fetchCollection, fetchFooterDetails, fetchHomeCollections, fetchMarquee, fetchProductReviews, fetchReels, fetchSiteSettings, fetchShopProductFunction, getAllContent, getProductsByCategory, policyQuery } from "@/service/dashboardService";
import { ContentItem, Reel } from "@/type/api";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReviewSort } from "@/service/dashboardService";
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

export const useRelatedProducts = (id: string | undefined) => {
  return useQuery({
    queryKey: ["related-products", id],
    queryFn: () => fetchRelatedProducts(id as string),
    enabled: !!id,
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

// Both category lists merged, so parent/child lookups work across them
export const useAllCategories = () => {
  const { data: funcData, isLoading: funcLoading } = useCategories();
  const { data: prodData, isLoading: prodLoading } = useShopByProductFunction();

  const byId = new Map<string, any>();
  [...(funcData?.data || []), ...(prodData?.data || [])].forEach((c: any) =>
    byId.set(c._id, c)
  );

  return { categories: [...byId.values()], isLoading: funcLoading || prodLoading };
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

export const useMarquee = () => {
  return useQuery({
    queryKey: ["marquee"],
    queryFn: fetchMarquee,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

// Admin switch (Site Settings) for the marquee, sub-category, discount badge and
// coupon updates; false while loading so customers never see a half-switched page
export const useNewFeatures = () => {
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
  return !!data?.newFeaturesEnabled;
};

// Full site settings (feature switch + delivery charge/days); shares the cache with useNewFeatures
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

// A product's reviews, 5 per page; fetchNextPage loads the next 5 ("Load more")
export const useProductReviews = (productId: string | undefined, sort: ReviewSort) => {
  return useInfiniteQuery({
    queryKey: ["product-reviews", productId, sort],
    queryFn: ({ pageParam }) => fetchProductReviews(productId as string, sort, pageParam, 5),
    initialPageParam: 1,
    getNextPageParam: (last) => (last?.hasMore ? last.page + 1 : undefined),
    enabled: !!productId,
    staleTime: 1000 * 60,
  });
};

export const useHomeCollections = () => {
  return useQuery({
    queryKey: ["home-collections"],
    queryFn: fetchHomeCollections,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useCollection = (id: string) => {
  return useQuery({
    queryKey: ["collection", id],
    queryFn: () => fetchCollection(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 1,
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
  return useQuery<ContentItem | null>(policyQuery("shipping-policy", "SHIPPING_POLICY"));
};

export const useExchangePolicy = () => {
  return useQuery<ContentItem | null>(policyQuery("Exchange-policy", "EXCHANGE_POLICY"));
};

export const usePrivacyPolicy = () => {
  return useQuery<ContentItem | null>(policyQuery("Privacy-policy", "PRIVACY_POLICY"));
};


export const useTermsandCondition = () => {
  return useQuery<ContentItem | null>(policyQuery("Terms-policy", "TERMS_AND_CONDITIONS"));
};
