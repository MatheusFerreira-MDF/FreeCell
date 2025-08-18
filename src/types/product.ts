export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'eletronicos' | 'utilidades' | 'controle-remoto';
  retailPrice: number;
  wholesalePrice: number;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  neighborhood: string;
  city: string;
}

export type PriceType = 'retail' | 'wholesale';