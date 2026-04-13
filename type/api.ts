export type ApiProduct = {
  _id: string;
  name: string;
  sellingPrice: number;
  imageUrl: string[];
};

export type ProductDisplayProps = {
  title: string;
  subtitle: string;
  products: ApiProduct[];
};

export type ProductCardProps = {
  title: string;
  price: string;
  image: string;
};