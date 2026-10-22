import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFooter, IonIcon } from '@ionic/angular';
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

  barangays = ['San Roque', 'Concepcion Uno', 'Sto. Niño', 'Malanday', 'Barangka', 'Calumpang', 'Industrial Valley', 'Jesus de la Peña', 'Marikina Heights', 'Nangka', 'Parang', 'Santa Elena', 'Santo Niño', 'Tumana', 'Fortune'];
  cities = ['Marikina City', 'Quezon City', 'Antipolo City', 'Pasig City', 'Manila', 'Makati', 'Taguig', 'Pasay', 'Mandaluyong', 'San Juan', 'Caloocan', 'Las Piñas', 'Parañaque', 'Valenzuela', 'Muntinlupa'];

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

  constructor(private cart: CartService, private router: Router, private orderHistory: OrderHistoryService) {
    addIcons({ callOutline, cardOutline, cashOutline, checkmark, chevronDown, chatboxEllipsesOutline, locationOutline, mailOutline, personOutline, phonePortraitOutline, shieldCheckmarkOutline });
  }

  get fee() {
    return this.schedules.find((s) => s.id === this.schedule)!.fee;
  }

  get total() {
    return this.cart.subtotal() + this.fee + this.cart.tax();
  }

  placeOrder() {
    const schedule = this.schedules.find((entry) => entry.id === this.schedule)!;
    const order = this.orderHistory.create({
      items: this.cart.items().map((item) => ({ ...item })),
      total: this.total,
      address: `${this.address.street}, ${this.address.barangay}, ${this.address.city} ${this.address.zip}`,
      payment: this.payment === 'cod' ? 'Cash on Delivery' : 'Cashless',
      deliveryWindow: schedule.time,
    });
    void this.router.navigate(['/order-tracker'], { queryParams: { order: order.id } });
  }
}
