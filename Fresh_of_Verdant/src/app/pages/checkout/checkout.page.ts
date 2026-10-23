import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonFooter, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cardOutline, cashOutline, checkmark, chevronDown, chatboxEllipsesOutline, locationOutline, mailOutline, personOutline, phonePortraitOutline, callOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { CartService } from '../../services/cart';
import { OrderHistoryService } from '../../services/order-history';
import { CashlessWalletService } from '../../services/cashless-wallet';

interface SavedAddress {
  id: number;
  label: string;
  name: string;
  phone: string;
  street: string;
  barangay: string;
  city: string;
  zip: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [IonContent, IonFooter, IonIcon, FormsModule, PageHeaderComponent],
})
export class CheckoutPage {
  recipient = { name: '', phone: '', email: '' };
  savedAddresses: SavedAddress[] = this.loadSavedAddresses();
  selectedAddressId: number | null = this.savedAddresses.find((entry) => entry.isDefault)?.id ?? this.savedAddresses[0]?.id ?? null;
  address = { street: '', barangay: '', city: 'Marikina City', zip: '' };

  private readonly zipCodes: Record<string, string> = {
    'Marikina City': '1800', 'Quezon City': '1100', Manila: '1000', 'Makati City': '1200',
    'Pasig City': '1600', 'Taguig City': '1630', 'Pasay City': '1300', 'Mandaluyong City': '1550',
    'San Juan City': '1500', 'Caloocan City': '1400', 'Las Piñas City': '1740',
    'Parañaque City': '1700', 'Valenzuela City': '1440', 'Muntinlupa City': '1770',
    'Malabon City': '1470', 'Navotas City': '1485', 'Antipolo City': '1870',
  };
  private readonly marikinaZipByBarangay: Record<string, string> = {
    'San Roque': '1801', 'Kalumpang': '1801', 'Industrial Valley': '1802',
    'Barangka': '1803', 'Tañong': '1803', 'Jesus de la Peña': '1804', 'Malanday': '1805',
    'Concepcion Uno': '1807', 'Tumana': '1807', 'Nangka': '1808', 'Parang': '1809',
    'Fortune': '1809', 'Marikina Heights': '1810', 'Concepcion Dos': '1811', 'Sto. Niño': '1800',
  };

  readonly cities = [
    'Marikina City', 'Quezon City', 'Manila', 'Makati City', 'Pasig City', 'Taguig City',
    'Pasay City', 'Mandaluyong City', 'San Juan City', 'Caloocan City', 'Las Piñas City',
    'Parañaque City', 'Valenzuela City', 'Muntinlupa City', 'Malabon City', 'Navotas City',
    'Antipolo City',
  ];
  private readonly barangaysByCity: Record<string, string[]> = {
    'Marikina City': ['San Roque', 'Concepcion Uno', 'Sto. Niño', 'Malanday', 'Barangka', 'Calumpang', 'Industrial Valley', 'Jesus de la Peña', 'Marikina Heights', 'Nangka', 'Parang', 'Santa Elena', 'Tumana', 'Fortune'],
    'Quezon City': ['Batasan Hills', 'Commonwealth', 'Diliman', 'Holy Spirit', 'Project 6', 'Tandang Sora', 'Bagong Pag-asa', 'Loyola Heights', 'Pinyahan'],
    'Manila': ['Binondo', 'Ermita', 'Malate', 'Paco', 'Pandacan', 'Sampaloc', 'San Miguel', 'Santa Cruz', 'Tondo'],
    'Makati City': ['Bel-Air', 'Guadalupe Nuevo', 'Guadalupe Viejo', 'Palanan', 'Poblacion', 'San Lorenzo', 'Urdaneta'],
    'Pasig City': ['Bagong Ilog', 'Kapitolyo', 'Maybunga', 'Manggahan', 'Rosario', 'Santolan', 'Ugong'],
    'Taguig City': ['Bagumbayan', 'Bicutan', 'Fort Bonifacio', 'Pinagsama', 'Ususan', 'Western Bicutan'],
    'Pasay City': ['Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 76', 'Barangay 183'],
    'Mandaluyong City': ['Addition Hills', 'Barangka', 'Highway Hills', 'Plainview', 'Wack-Wack Greenhills'],
    'San Juan City': ['Batis', 'Greenhills', 'Little Baguio', 'Pedro Cruz', 'Salapan', 'West Crame'],
    'Caloocan City': ['Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 8', 'Barangay 176'],
    'Las Piñas City': ['Almanza Uno', 'BF International Village', 'Pamplona Uno', 'Talon Uno', 'Zapote'],
    'Parañaque City': ['Baclaran', 'Don Bosco', 'La Huerta', 'San Antonio', 'San Dionisio', 'Tambo'],
    'Valenzuela City': ['Canumay East', 'Gen. T. de Leon', 'Karuhatan', 'Marulas', 'Maysan', 'Malanday'],
    'Muntinlupa City': ['Alabang', 'Bayanan', 'Putatan', 'Sucat', 'Tunasan'],
    'Malabon City': ['Catmon', 'Concepcion', 'Longos', 'Potrero', 'Tonsuya'],
    'Navotas City': ['Bangkulasi', 'North Bay Boulevard North', 'North Bay Boulevard South', 'San Jose', 'Tanza'],
    'Antipolo City': ['Cupang', 'Dalig', 'Mayamot', 'San Isidro', 'San Jose', 'San Roque'],
  };

  get barangays(): string[] {
    return this.barangaysByCity[this.address.city] ?? [];
  }

  onCityChange(city: string) {
    this.address.city = city;
    this.address.barangay = this.barangays[0] ?? '';
    this.updateZipCode();
    this.selectedAddressId = null;
  }

  onBarangayChange(barangay: string) {
    this.address.barangay = barangay;
    this.updateZipCode();
    this.selectedAddressId = null;
  }

  private updateZipCode() {
    this.address.zip = this.address.city === 'Marikina City'
      ? this.marikinaZipByBarangay[this.address.barangay] ?? this.zipCodes[this.address.city] ?? ''
      : this.zipCodes[this.address.city] ?? '';
  }

  selectSavedAddress(id: number | null) {
    this.selectedAddressId = id;
    this.address = this.addressFromSaved(this.savedAddresses.find((entry) => entry.id === id));
  }

  private loadSavedAddresses(): SavedAddress[] {
    try {
      const stored = localStorage.getItem('fv-addresses');
      return stored ? JSON.parse(stored) as SavedAddress[] : [];
    } catch {
      return [];
    }
  }

  private addressFromSaved(saved?: SavedAddress) {
    const city = saved?.city && this.cities.includes(saved.city) ? saved.city : this.cities[0];
    const barangay = saved?.barangay ?? '';
    return {
      street: saved?.street ?? '',
      barangay,
      city,
      zip: city === 'Marikina City'
        ? this.marikinaZipByBarangay[barangay] ?? this.zipCodes[city] ?? ''
        : this.zipCodes[city] ?? '',
    };
  }

  schedules = [
    { id: 'standard', title: 'Standard', fee: 49, time: 'Tomorrow, 8 AM-12 PM' },
    { id: 'same-day', title: 'Same-Day', fee: 89, time: 'Today, 4-7 PM' },
  ];
  schedule = 'standard';

  payments = [
    { id: 'cod', title: 'Pay on Cash', desc: 'Pay your driver upon arrival', icon: 'cash-outline' },
    { id: 'cashless', title: 'Cashless', desc: 'Pay digitally on delivery', icon: 'phone-portrait-outline' },
  ];
  payment = localStorage.getItem('fv-payment-method') === 'cashless' ? 'cashless' : 'cod';
  cashTendered = '';

  notes = '';
  placingOrder = false;

  constructor(public cart: CartService, private router: Router, private orderHistory: OrderHistoryService, private alerts: AlertController, public wallet: CashlessWalletService) {
    addIcons({ callOutline, cardOutline, cashOutline, checkmark, chevronDown, chatboxEllipsesOutline, locationOutline, mailOutline, personOutline, phonePortraitOutline, shieldCheckmarkOutline });
    this.selectSavedAddress(this.selectedAddressId);
  }

  get fee() {
    return this.schedules.find((s) => s.id === this.schedule)!.fee;
  }

  get total() {
    return this.cart.subtotal() + this.fee + this.cart.tax();
  }

  get totalChange(): number | null {
    if (this.payment === 'cashless') return 0;
    if (!this.cashTendered) return null;
    const tendered = Number(this.cashTendered);
    return Number.isFinite(tendered) ? Math.max(0, tendered - this.total) : null;
  }

  choosePayment(method: string) {
    this.payment = method;
    localStorage.setItem('fv-payment-method', method === 'cashless' ? 'cashless' : 'cash');
    if (method === 'cashless') {
      void this.router.navigate(['/cashless-wallet'], { queryParams: { returnTo: '/checkout', amount: this.total } });
    }
  }

  placeOrder() {
    if (this.placingOrder || this.cart.items().length === 0) return;

    if (this.payment === 'cashless' && !this.wallet.canPay(this.total)) {
      void this.showWalletInsufficient();
      return;
    }

    const schedule = this.schedules.find((entry) => entry.id === this.schedule)!;
    const orderDetails = {
      items: this.cart.items().map((item) => ({ ...item })),
      total: this.total,
      address: `${this.address.street}, ${this.address.barangay}, ${this.address.city} ${this.address.zip}`,
      payment: this.payment === 'cod' ? 'Cash on Delivery' : 'Cashless Wallet',
      deliveryWindow: schedule.time,
      deliverySchedule: this.schedule as 'standard' | 'same-day',
    };

    this.placingOrder = true;
    this.cart.clearAfterCheckout().subscribe({
      next: () => {
        if (this.payment === 'cashless' && !this.wallet.charge(this.total, 'Order payment')) {
          this.placingOrder = false;
          void this.showWalletInsufficient();
          return;
        }
        const order = this.orderHistory.create(orderDetails);
        void this.router.navigate(['/order-tracker'], { queryParams: { order: order.id } });
      },
      error: () => {
        this.placingOrder = false;
        if (this.payment === 'cashless') this.wallet.restoreCharge(this.total);
        void this.showCheckoutError();
      },
    });
  }

  private async showWalletInsufficient() {
    const alert = await this.alerts.create({
      header: 'Wallet balance is too low',
      message: `Add demo funds to cover the ${new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(this.total)} order total.`,
      buttons: [
        { text: 'Not now', role: 'cancel' },
        { text: 'Open Cashless Wallet', handler: () => { void this.router.navigate(['/cashless-wallet'], { queryParams: { returnTo: '/checkout', amount: this.total } }); } },
      ],
    });
    await alert.present();
  }

  private async showCheckoutError() {
    const alert = await this.alerts.create({
      header: 'Unable to complete checkout',
      message: 'Your cart could not be cleared from your account. Please check your connection and try again.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
