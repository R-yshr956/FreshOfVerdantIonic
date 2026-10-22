import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonFooter, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cardOutline, cashOutline, checkmark, chevronDown, chatboxEllipsesOutline, locationOutline, mailOutline, personOutline, phonePortraitOutline, callOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { CartService } from '../../services/cart';
import { OrderHistoryService } from '../../services/order-history';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [IonContent, IonFooter, IonIcon, FormsModule, PageHeaderComponent],
})
export class CheckoutPage {
  recipient = { name: 'Mika Santos', phone: '0817 555 0186', email: '' };
  address = { street: '28 Sampaguita Street', barangay: 'San Roque', city: 'Marikina City', zip: '1801' };

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
  payment = 'cod';

  notes = '';
  placingOrder = false;

  constructor(public cart: CartService, private router: Router, private orderHistory: OrderHistoryService, private alerts: AlertController) {
    addIcons({ callOutline, cardOutline, cashOutline, checkmark, chevronDown, chatboxEllipsesOutline, locationOutline, mailOutline, personOutline, phonePortraitOutline, shieldCheckmarkOutline });
  }

  get fee() {
    return this.schedules.find((s) => s.id === this.schedule)!.fee;
  }

  get total() {
    return this.cart.subtotal() + this.fee + this.cart.tax();
  }

  placeOrder() {
    if (this.placingOrder || this.cart.items().length === 0) return;

    const schedule = this.schedules.find((entry) => entry.id === this.schedule)!;
    const orderDetails = {
      items: this.cart.items().map((item) => ({ ...item })),
      total: this.total,
      address: `${this.address.street}, ${this.address.barangay}, ${this.address.city} ${this.address.zip}`,
      payment: this.payment === 'cod' ? 'Cash on Delivery' : 'Cashless',
      deliveryWindow: schedule.time,
    };

    this.placingOrder = true;
    this.cart.clearAfterCheckout().subscribe({
      next: () => {
        const order = this.orderHistory.create(orderDetails);
        void this.router.navigate(['/order-tracker'], { queryParams: { order: order.id } });
      },
      error: () => {
        this.placingOrder = false;
        void this.showCheckoutError();
      },
    });
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
