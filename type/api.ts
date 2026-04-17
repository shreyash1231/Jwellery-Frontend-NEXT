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
  id: string;
  productData: any;
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


export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  countryCode: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: number;
  countryCode: number;
  authProvider: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}