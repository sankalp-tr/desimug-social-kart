export type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt?: string;
};

export type Seller = Pick<User, '_id' | 'name' | 'role'>;

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stock: number;
  seller: Seller;
};

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  stock: string;
  seller: string;
};
