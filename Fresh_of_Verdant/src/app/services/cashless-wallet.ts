import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CashlessWalletService {
  private readonly balanceKey = 'fv-cashless-wallet-balance';
  private readonly historyKey = 'fv-cashless-wallet-history';
  readonly balance = signal(this.readBalance());
  readonly transactions = signal(this.readTransactions());

  addDemoFunds(amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.balance.set(this.balance() + amount);
    this.saveBalance();
    this.record({ label: 'Demo funds added', amount, createdAt: new Date().toISOString() });
  }

  charge(amount: number, label: string) {
    if (!Number.isFinite(amount) || amount <= 0 || this.balance() < amount) return false;
    this.balance.set(this.balance() - amount);
    this.saveBalance();
    this.record({ label, amount: -amount, createdAt: new Date().toISOString() });
    return true;
  }

  restoreCharge(amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.balance.set(this.balance() + amount);
    this.saveBalance();
    this.record({ label: 'Order payment reversed', amount, createdAt: new Date().toISOString() });
  }

  canPay(amount: number) {
    return Number.isFinite(amount) && amount > 0 && this.balance() >= amount;
  }

  private readBalance() {
    try {
      const stored = localStorage.getItem(this.balanceKey);
      return stored === null ? 2500 : Math.max(0, Number(stored) || 0);
    } catch { return 2500; }
  }

  private saveBalance() {
    localStorage.setItem(this.balanceKey, String(this.balance()));
  }

  private readTransactions(): Array<{ label: string; amount: number; createdAt: string }> {
    try {
      const stored = localStorage.getItem(this.historyKey);
      return stored ? JSON.parse(stored) as Array<{ label: string; amount: number; createdAt: string }> : [];
    } catch { return []; }
  }

  private record(transaction: { label: string; amount: number; createdAt: string }) {
    const entries = [transaction, ...this.transactions()].slice(0, 20);
    this.transactions.set(entries);
    localStorage.setItem(this.historyKey, JSON.stringify(entries));
  }
}
