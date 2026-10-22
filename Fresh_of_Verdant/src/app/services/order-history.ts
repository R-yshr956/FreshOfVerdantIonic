import { Injectable } from '@angular/core';
import { CartItem } from '../models/product';

export interface TrackedOrder {
  id: string;
  createdAt: string;
  status: 'Confirmed' | 'Packed at Farm Hub' | 'Out for Delivery' | 'Delivered';
  items: CartItem[];
  total: number;
  address: string;
  payment: string;
  deliveryWindow: string;
}

@Injectable({ providedIn: 'root' })
export class OrderHistoryService {
  private readonly storageKey = 'fv-order-history';

  all(): TrackedOrder[] {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
      return Array.isArray(value) ? value as TrackedOrder[] : [];
    } catch {
      return [];
    }
  }

  latest(): TrackedOrder | undefined {
    return this.all()[0];
  }

  find(id: string): TrackedOrder | undefined {
    return this.all().find((order) => order.id === id);
  }

  create(order: Omit<TrackedOrder, 'id' | 'createdAt' | 'status'>): TrackedOrder {
    const createdAt = new Date().toISOString();
    const tracked: TrackedOrder = {
      ...order,
      id: `FOV-${Date.now().toString().slice(-6)}`,
      createdAt,
      status: 'Packed at Farm Hub',
    };
    const orders = [tracked, ...this.all()];
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
    return tracked;
  }
}
