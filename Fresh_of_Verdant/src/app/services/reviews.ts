import { Injectable, signal } from '@angular/core';

export interface UserReview {
  id: string;
  author: string;
  rating: number;
  createdAt: string;
  text: string;
  productId: number | null;
  productName: string | null;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly storageKey = 'fv-user-reviews';
  readonly reviews = signal<UserReview[]>(this.load());

  add(review: Omit<UserReview, 'id' | 'createdAt'>): UserReview {
    const saved: UserReview = { ...review, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const next = [...this.reviews(), saved];
    this.reviews.set(next);
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(next));
    } catch {
      // Keep the submitted review visible for the current session if storage is unavailable.
    }
    return saved;
  }

  forProduct(productId: number): UserReview[] {
    return this.reviews().filter((review) => review.productId === productId);
  }

  private load(): UserReview[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((review): review is UserReview =>
        !!review && typeof review.id === 'string' && typeof review.author === 'string' &&
        typeof review.rating === 'number' && typeof review.createdAt === 'string' &&
        typeof review.text === 'string' &&
        (review.productId === null || typeof review.productId === 'number') &&
        (review.productName === null || typeof review.productName === 'string'),
      );
    } catch {
      return [];
    }
  }
}
