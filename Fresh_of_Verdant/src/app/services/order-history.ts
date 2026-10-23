import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../models/product';

export interface TrackedOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  total: number;
  address: string;
  payment: string;
  deliveryWindow: string;
  deliverySchedule?: 'standard' | 'same-day';
  refundRequested?: boolean;
}

export type OrderStatus = 'Confirmed' | 'Packed at Farm Hub' | 'Out for Delivery' | 'Delivered';

const ORDER_STAGE_DESCRIPTIONS: Array<{ status: OrderStatus; desc: string }> = [
  { status: 'Confirmed', desc: 'We received your order and reserved the produce.' },
  { status: 'Packed at Farm Hub', desc: 'Farmers are sorting and packing your fresh picks.' },
  { status: 'Out for Delivery', desc: 'Your driver is on the way with your order.' },
  { status: 'Delivered', desc: 'Farm-fresh goodness is at your doorstep.' },
];

@Injectable({ providedIn: 'root' })
export class OrderHistoryService {
  private readonly storageKey = 'fv-order-history';
  private readonly savedOrders = signal<TrackedOrder[]>(this.restore());
  private readonly clock = signal(Date.now());
  readonly orders = computed(() => {
    const now = this.clock();
    return this.savedOrders().map((order) => ({ ...order, status: this.statusAt(order, now) }));
  });
  readonly count = computed(() => this.orders().length);
  readonly deliveredCount = computed(() => this.orders().filter((order) => order.status === 'Delivered').length);

  constructor() {
    setInterval(() => this.clock.set(Date.now()), 5000);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) this.clock.set(Date.now());
      });
    }
  }

  all(): TrackedOrder[] {
    return this.orders();
  }

  latest(): TrackedOrder | undefined {
    return this.all()[0];
  }

  find(id: string): TrackedOrder | undefined {
    return this.all().find((order) => order.id === id);
  }

  requestRefund(id: string): boolean {
    const orders = this.savedOrders();
    if (!orders.some((order) => order.id === id)) return false;
    const updated = orders.map((order) => order.id === id ? { ...order, refundRequested: true } : order);
    this.savedOrders.set(updated);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    return true;
  }

  create(order: Omit<TrackedOrder, 'id' | 'createdAt' | 'status'>): TrackedOrder {
    const createdAt = new Date().toISOString();
    const tracked: TrackedOrder = {
      ...order,
      id: `FOV-${Date.now().toString().slice(-6)}`,
      createdAt,
      status: 'Packed at Farm Hub',
    };
    const orders = [tracked, ...this.savedOrders()];
    this.savedOrders.set(orders);
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
    return tracked;
  }

  clearForSignOut() {
    this.savedOrders.set([]);
    localStorage.removeItem(this.storageKey);
  }

  timeline(order: TrackedOrder) {
    const stages = this.stagesFor(order);
    const currentStatus = this.statusAt(order, this.clock());
    const currentIndex = stages.findIndex((stage) => stage.status === currentStatus);
    const createdAt = new Date(order.createdAt).getTime();

    return stages.map((stage, index) => ({
      title: stage.status,
      desc: stage.desc,
      state: currentStatus === 'Delivered' || index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'pending',
      meta: currentStatus === 'Delivered'
        ? this.formatTime(new Date(createdAt + stage.timelineAfterMs))
        : index < currentIndex
          ? this.formatTime(new Date(createdAt + stage.afterMs))
        : index === currentIndex
          ? 'In progress'
          : index === currentIndex + 1 ? 'Next' : 'Pending',
    }));
  }

  timelineTimes(order: TrackedOrder): string[] {
    const offsets = order.deliverySchedule === 'same-day' ? [1, 2, 4, 5] : [2, 4, 6, 8];
    const createdAt = new Date(order.createdAt).getTime();
    return offsets.map((minutes) => this.formatTime(new Date(createdAt + minutes * 60_000)));
  }

  statusFor(order: TrackedOrder): OrderStatus {
    return this.statusAt(order, this.clock());
  }

  private statusAt(order: TrackedOrder, now: number): OrderStatus {
    const createdAt = new Date(order.createdAt).getTime();
    if (!Number.isFinite(createdAt)) return order.status ?? 'Confirmed';
    const elapsed = Math.max(0, now - createdAt);
    return [...this.stagesFor(order)].reverse().find((stage) => elapsed >= stage.afterMs)?.status ?? 'Confirmed';
  }

  private stagesFor(order: TrackedOrder) {
    const sameDay = order.deliverySchedule === 'same-day';
    const milestoneMinutes = sameDay ? [1, 2, 4, 5] : [2, 4, 6, 8];
    const progressionMinutes = sameDay ? [0, 0, 4, 5] : [0, 0, 6, 8];
    return ORDER_STAGE_DESCRIPTIONS.map((stage, index) => ({
      ...stage,
      // Checkout starts the simulation at Packed; the later milestones follow the selected schedule.
      afterMs: progressionMinutes[index] * 60_000,
      timelineAfterMs: milestoneMinutes[index] * 60_000,
    }));
  }

  private formatTime(value: Date) {
    return value.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  private restore(): TrackedOrder[] {
    try {
      const value: unknown = typeof localStorage === 'undefined'
        ? []
        : JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
      return Array.isArray(value) ? value as TrackedOrder[] : [];
    } catch {
      return [];
    }
  }
}
