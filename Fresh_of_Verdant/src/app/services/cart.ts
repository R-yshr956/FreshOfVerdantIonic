import { Injectable, computed, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, map, of, timeout, TimeoutError } from 'rxjs';
import { CartItem, Product } from '../models/product';
import { ApiCart, ApiCartItem, ApiService } from './api';

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>(this.restoreItems());
  user: { fullName: string; email: string } | null = null;
  loading = false;
  saving = false;
  error: string | null = null;

  deliveryFee = 49;
  savings = 0;

  count = computed(() => this.items().reduce((sum, item) => sum + item.qty, 0));
  subtotal = computed(() => this.items().reduce((sum, item) => sum + item.price * item.qty, 0));
  tax = computed(() => Math.round(this.subtotal() * 0.04));
  total = computed(() => this.subtotal() + this.deliveryFee + this.tax());

  constructor(private api: ApiService) {}

  load() {
    this.loading = true;
    this.error = null;
    this.api.cart().pipe(
      timeout({ first: 10000 }),
      map((response: ApiCart) => {
        if (!response || !Array.isArray(response.items)) {
          throw new Error('The cart endpoint returned an unexpected response. Expected a cart with an items array.');
        }
        this.user = response.user ?? null;
        return response.items.map((row) => this.toCartItem(row));
      }),
      catchError((error: unknown) => {
        this.error = this.items().length
          ? 'Could not connect to sync your cart. Showing the saved items on this device.'
          : this.getLoadError(error);
        return of([] as CartItem[]);
      }),
      finalize(() => {
        this.loading = false;
      }),
    ).subscribe((items) => { this.items.set(items); this.saveItems(items); });
  }

  private toCartItem(row: ApiCartItem): CartItem {
    return {
      id: Number(row.product_id),
      name: row.product_name ?? 'Unavailable product',
      price: Number(row.price ?? 0),
      unit: row.unit ?? '',
      qty: Number(row.quantity),
      image: this.api.productImageUrl(row.image_url),
    };
  }

  private getLoadError(error: unknown): string {
    if (error instanceof TimeoutError) return 'The cart service did not respond. Check your connection and try again.';
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        return 'Sign in to view your saved cart.';
      }
      if (error.status === 0) {
        return 'Cannot reach the backend. Check that it is running on port 3000.';
      }
      if (error.status >= 500) {
        return 'Could not load your saved cart. Check the backend log and database connection.';
      }
      const detail = error.error?.error;
      return typeof detail === 'string' ? detail : `Could not load your saved cart (HTTP ${error.status}).`;
    }

    return error instanceof Error ? error.message : 'Could not load your saved cart.';
  }

  add(product: Product, qty = 1) {
    this.saving = true;
    this.error = null;
    const current = this.items().find((item) => item.id === product.id);
    const localItem: CartItem = { id: product.id, name: product.name, price: product.price, unit: product.unit, qty: (current?.qty ?? 0) + qty, image: product.image };
    this.upsertLocal(localItem);
    this.api.addCartItem(product.id, qty).pipe(timeout({ first: 10000 })).subscribe({
      next: (row) => {
        this.upsert(row);
        this.saving = false;
      },
      error: (error: HttpErrorResponse) => this.handleOfflineError(error, 'Saved on this device. It will be available here while the cart service is offline.'),
    });
  }

  clearForSignOut() {
    this.items.set([]);
    this.saveItems([]);
  }

  change(id: number, delta: number) {
    const item = this.items().find((entry) => entry.id === id);
    if (!item) return;
    const quantity = Math.max(1, item.qty + delta);
    if (quantity === item.qty) return;

    this.saving = true;
    this.error = null;
    this.upsertLocal({ ...item, qty: quantity });
    this.api.setCartItemQuantity(id, quantity).pipe(timeout({ first: 10000 })).subscribe({
      next: (row) => {
        this.upsert(row);
        this.saving = false;
      },
      error: (error: HttpErrorResponse) => this.handleOfflineError(error, 'Change saved on this device. The cart service is offline.'),
    });
  }

  remove(id: number) {
    this.saving = true;
    this.error = null;
    this.items.update((list) => list.filter((item) => item.id !== id));
    this.saveItems(this.items());
    this.api.removeCartItem(id).pipe(timeout({ first: 10000 })).subscribe({
      next: () => {
        this.items.update((list) => list.filter((item) => item.id !== id));
        this.saving = false;
      },
      error: (error: HttpErrorResponse) => this.handleOfflineError(error, 'Removal saved on this device. The cart service is offline.'),
    });
  }

  private upsert(row: ApiCartItem) {
    const item = this.toCartItem(row);
    this.upsertLocal(item);
  }

  private upsertLocal(item: CartItem) {
    this.items.update((list) => list.some((entry) => entry.id === item.id)
      ? list.map((entry) => entry.id === item.id ? item : entry)
      : [...list, item]);
    this.saveItems(this.items());
  }

  private restoreItems(): CartItem[] {
    try { return typeof localStorage === 'undefined' ? [] : JSON.parse(localStorage.getItem('fv-cart-items') ?? '[]') as CartItem[]; }
    catch { return []; }
  }

  private saveItems(items: CartItem[]) {
    if (typeof localStorage !== 'undefined') localStorage.setItem('fv-cart-items', JSON.stringify(items));
  }

  private handleOfflineError(error: HttpErrorResponse, fallback: string) {
    this.error = error.status === 401 || error.status === 403
      ? 'Sign in to sync your saved cart. Your device copy is still available.'
      : error.status === 0 ? 'Cannot reach the cart service. Your changes are saved on this device.' : fallback;
    this.saving = false;
  }

}
