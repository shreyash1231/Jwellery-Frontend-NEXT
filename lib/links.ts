// Readable URLs: /product/bridal-potli-bag, /categories/wedding-gifts.
// Falls back to the id for anything that has no slug yet (old ids still open the page).
type Linkable = { _id?: string; slug?: string } | null | undefined;

export const productPath = (p: Linkable) => `/product/${p?.slug || p?._id || ""}`;
export const categoryPath = (c: Linkable) => `/categories/${c?.slug || c?._id || ""}`;
export const collectionPath = (c: Linkable) => `/collections/${c?.slug || c?._id || ""}`;
