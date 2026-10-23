import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, cardOutline, checkmarkCircleOutline, timeOutline, walletOutline } from 'ionicons/icons';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';
import { CashlessWalletService } from '../../services/cashless-wallet';

@Component({
  selector: 'app-cashless-wallet',
  templateUrl: './cashless-wallet.page.html',
  styleUrls: ['./cashless-wallet.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, DatePipe, GreenHeaderComponent],
})
export class CashlessWalletPage {
  readonly returnTo: string;
  readonly checkoutAmount: number;

  constructor(
    public wallet: CashlessWalletService,
    private router: Router,
    route: ActivatedRoute,
  ) {
    addIcons({ add, cardOutline, checkmarkCircleOutline, timeOutline, walletOutline });
    this.returnTo = route.snapshot.queryParamMap.get('returnTo') === '/checkout' ? '/checkout' : '/profile';
    this.checkoutAmount = Math.max(0, Number(route.snapshot.queryParamMap.get('amount')) || 0);
  }

  addDemoFunds(amount: number) {
    this.wallet.addDemoFunds(amount);
  }

  useWallet() {
    localStorage.setItem('fv-payment-method', 'cashless');
    void this.router.navigateByUrl(this.returnTo);
  }

  formatAmount(amount: number) {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(Math.abs(amount));
  }
}
