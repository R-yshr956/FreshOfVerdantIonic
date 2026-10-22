export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string; // kg, pc, pack...
  description: string;
  rating: number;
  calories: number;
  protein: number;
  carbs: number;
  vitaminC: number;
  featured?: boolean; // shows in "Fresh picks" on the home page
  image?: string;
  fallbackImage?: string;
  fallbackImageCredit?: { text: string; url: string };
  imageCredit?: { text: string; url: string };
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  qty: number;
  image?: string;
}
