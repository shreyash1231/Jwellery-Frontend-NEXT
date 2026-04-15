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

export interface CustomOrderPayload {
  type: string;
  date: string;
  address: string;
}


export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

