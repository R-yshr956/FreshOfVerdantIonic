import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly emailKey = 'fv-auth-email';
  private readonly nameKey = 'fv-auth-name';
  readonly currentUser = signal<string | null>(this.readEmail());
  readonly currentName = signal<string | null>(this.readName());

  get isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  private readEmail(): string | null {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(this.emailKey);
  }

  private readName(): string | null {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(this.nameKey);
  }

  signIn(email: string, name?: string) {
    const normalized = email.trim().toLowerCase();
    const displayName = name?.trim() || this.savedNameFor(normalized) || this.nameFromEmail(normalized);
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(this.emailKey, normalized);
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(this.nameKey, displayName);
    this.currentUser.set(normalized);
    this.currentName.set(displayName);
  }

  signOut() {
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(this.emailKey);
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(this.nameKey);
    this.currentUser.set(null);
    this.currentName.set(null);
    // These are account-specific device copies. Remove them before another account can use this session.
    if (typeof localStorage !== 'undefined') {
      ['fv-cart-items', 'fv-favorites', 'fv-order-history', 'fv-profile-details', 'fv-user-reviews'].forEach((key) => localStorage.removeItem(key));
    }
  }

  private savedNameFor(email: string): string | null {
    try {
      const profile = JSON.parse(localStorage.getItem('fv-profile-details') ?? '{}') as Record<string, unknown>;
      const savedEmail = typeof profile['Email Address'] === 'string' ? profile['Email Address'].toLowerCase() : '';
      const fullName = typeof profile['Full Name'] === 'string' ? profile['Full Name'].trim() : '';
      return savedEmail === email && fullName ? fullName : null;
    } catch {
      return null;
    }
  }

  private nameFromEmail(email: string): string {
    const localPart = email.split('@')[0] ?? '';
    return localPart.split(/[._-]+/).filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join(' ') || 'there';
  }
}
