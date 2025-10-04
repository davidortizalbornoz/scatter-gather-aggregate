export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  specifications: {
    [key: string]: string;
  };
  brand: string;
  status: string;
  inStock: boolean;
  discountedPrice: number;
}
