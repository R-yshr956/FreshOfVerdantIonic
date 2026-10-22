import { computed, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { catchError, finalize, map, of, TimeoutError, timeout } from 'rxjs';
import { Product } from '../models/product';
import { ProductDetailModal } from '../components/product-detail-modal/product-detail-modal.component';
import { ApiProduct, ApiService } from './api';

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  readonly products = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly categoryItems = signal<ProductCategory[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly favorites = signal<number[]>(JSON.parse(localStorage.getItem('fv-favorites') ?? '[]'));

  toggleFavorite(product: Product) {
    const next = this.favorites().includes(product.id)
      ? this.favorites().filter((id) => id !== product.id)
      : [...this.favorites(), product.id];
    this.favorites.set(next);
    localStorage.setItem('fv-favorites', JSON.stringify(next));
  }

  isFavorite(product: Product) { return this.favorites().includes(product.id); }

  constructor(private modalCtrl: ModalController, private api: ApiService) {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.api.products().pipe(
      timeout({ first: 10000 }),
      map((rows) => {
        if (!Array.isArray(rows)) {
          throw new Error('The products endpoint returned an unexpected response. Expected a JSON array.');
        }

        const categories = new Map<number, ProductCategory>();
        for (const row of rows) {
          if (row.category) {
            categories.set(Number(row.category.category_id), {
              id: Number(row.category.category_id),
              name: row.category.category_name,
              description: row.category.description ?? '',
            });
          }
        }

        return {
          products: rows.map((row) => this.toProduct(row)),
          categoryItems: [...categories.values()],
        };
      }),
      catchError((error: unknown) => {
        this.products.set([]);
        this.categories.set([]);
        this.categoryItems.set([]);
        this.error.set(this.getLoadError(error));
        return of({ products: [] as Product[], categoryItems: [] as ProductCategory[] });
      }),
      finalize(() => {
        this.loading.set(false);
      }),
    ).subscribe(({ products, categoryItems }) => {
      this.products.set(products);
      this.categoryItems.set(categoryItems);
        this.categories.set(['Fruits', 'Vegetables', 'Grains', 'Others']);
    });
  }

  private getLoadError(error: unknown): string {
    if (error instanceof TimeoutError) {
      return 'The products API did not respond within 10 seconds. Check the backend connection and try again.';
    }
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Cannot reach the backend at localhost:3000. Check that the server is running.';
      }
      if (error.status >= 500) {
        return 'The backend failed while loading products. Check its server log and Turso database connection.';
      }
      const detail = error.error?.error;
      return typeof detail === 'string' ? detail : `Product request failed (HTTP ${error.status}).`;
    }

    return error instanceof Error ? error.message : 'Could not load products from the backend.';
  }

  private toProduct(row: ApiProduct): Product {
    return {
      id: Number(row.product_id),
      name: row.product_name,
      category: this.resolveCategory(row.product_name, row.category?.category_name),
      price: Number(row.price),
      unit: row.unit,
      description: row.description ?? '',
      rating: 4.2 + Math.random() * 0.8,
      ...this.nutrition(row.product_name),
      image: this.api.assetUrl(row.image_url),
    };
  }

  private resolveCategory(productName: string, apiCategory?: string | null): string {
    const category = apiCategory?.trim().toLowerCase();
    if (category === 'fruit' || category === 'fruits') return 'Fruits';
    if (category === 'vegetable' || category === 'vegetables' || category === 'vegtable' || category === 'vegatables') return 'Vegetables';
    if (category === 'grain' || category === 'grains') return 'Grains';

    const name = productName.trim().toLowerCase().replace(/oes$/, 'o').replace(/ies$/, 'y').replace(/s$/, '');
    const fruits = ['apple', 'strawberry', 'mango', 'blueberry', 'plum', 'pomelo', 'watermelon', 'grape', 'cantaloupe', 'longan', 'olive'];
    const vegetables = ['tomato', 'butternut squash', 'artichoke', 'bell pepper', 'habanero pepper', 'potato', 'onion', 'garlic'];
    const grains = ['rice', 'wheat', 'corn', 'barley', 'oat', 'rye', 'sorghum', 'millet', 'buckwheat', 'einkorn', 'teff'];

    if (fruits.includes(name)) return 'Fruits';
    if (vegetables.includes(name)) return 'Vegetables';
    if (grains.includes(name)) return 'Grains';
    return 'Others';
  }

  private nutrition(name: string) {
    const key = name.toLowerCase().replace(/oes$/, 'o').replace(/ies$/, 'y').replace(/s$/, '');
    const facts: Record<string, [number, number, number, number]> = {
      apple: [52, .3, 13.8, 4.6], strawberry: [32, .7, 7.7, 58.8], mango: [60, .8, 15, 36.4], blueberry: [57, .7, 14.5, 9.7], plum: [46, .7, 11.4, 9.5], pomelo: [38, .8, 9.6, 61], watermelon: [30, .6, 7.6, 8.1], grape: [69, .7, 18.1, 3.2], cantaloupe: [34, .8, 8.2, 36.7], longan: [60, 1.3, 15.1, 84], tomato: [18, .9, 3.9, 13.7], 'butternut squash': [45, 1, 11.7, 21], potato: [77, 2, 17.5, 19.7], artichoke: [47, 3.3, 10.5, 11.7], olive: [145, 1, 3.8, 0], onion: [40, 1.1, 9.3, 7.4], garlic: [149, 6.4, 33.1, 31.2], 'bell pepper': [31, 1, 6, 127.7], 'habanero pepper': [40, 1.9, 8.8, 24], rice: [130, 2.7, 28.2, 0], wheat: [339, 13.7, 71.1, 0], corn: [86, 3.3, 18.7, 6.8], barley: [354, 12.5, 73.5, 0], oat: [389, 16.9, 66.3, 0], rye: [338, 10.3, 75.9, 0], sorghum: [329, 11.3, 72.1, 0], millet: [378, 11, 72.9, 0], buckwheat: [343, 13.3, 71.5, 0], einkorn: [338, 18, 64, 0], teff: [367, 13.3, 73.1, 0],
    };
    const match = facts[key] ?? [0, 0, 0, 0];
    return { calories: match[0], protein: match[1], carbs: match[2], vitaminC: match[3] };
  }

  readonly featured = computed(() => this.products().filter((product) => product.featured).concat(this.products().filter((product) => !product.featured)).slice(0, 4));

  async openDetail(product: Product) {
    const modal = await this.modalCtrl.create({
      component: ProductDetailModal,
      componentProps: { product },
      initialBreakpoint: 0.92,
      breakpoints: [0, 0.92],
      handle: true,
    });
    await modal.present();
  }
}
