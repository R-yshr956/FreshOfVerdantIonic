import { Component } from '@angular/core';
import { ActionSheetController, IonContent, IonFooter, IonIcon, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { callOutline, chatbubbleOutline, checkmark, imageOutline, personOutline, swapVerticalOutline } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { CartService } from '../../services/cart';
import { OrderHistoryService, TrackedOrder } from '../../services/order-history';

@Component({
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.page.html',
  styleUrls: ['./order-tracker.page.scss'],
  standalone: true,
  imports: [IonContent, IonFooter, IonIcon, PageHeaderComponent],
})
export class OrderTrackerPage {
  order?: TrackedOrder;
  orderId = 'FOV-8942';
  orderItems = [] as ReturnType<CartService['items']>;
  orderTotal = 0;
  shippingAddress = '28 Sampaguita St., San Roque, Marikina';
  paymentMethod = 'Cash on Delivery';
  deliveryWindow = 'Tomorrow, 8 AM-12 PM';

  // state: done | active | next | pending
  steps = [
    { title: 'Order Confirmed', desc: 'We received your order and reserved the produce.', meta: '9:42 AM', state: 'done' },
    { title: 'Packed at Farm Hub', desc: 'Farmers are sorting and packing your fresh picks.', meta: 'In progress', state: 'active' },
    { title: 'Out for Delivery', desc: 'Your driver will share a live arrival update.', meta: 'Next', state: 'next' },
    { title: 'Delivered', desc: 'Farm-fresh goodness at your doorstep.', meta: 'Pending', state: 'pending' },
  ];

  constructor(
    public cart: CartService,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private router: Router,
    route: ActivatedRoute,
    history: OrderHistoryService,
  ) {
    addIcons({ callOutline, chatbubbleOutline, checkmark, imageOutline, personOutline, swapVerticalOutline });
    const requestedId = route.snapshot.queryParamMap.get('order');
    this.orderItems = this.cart.items();
    this.orderTotal = this.cart.total();
    this.order = requestedId ? history.find(requestedId) : history.latest();
    if (this.order) {
      this.orderId = this.order.id;
      this.orderItems = this.order.items;
      this.orderTotal = this.order.total;
      this.shippingAddress = this.order.address;
      this.paymentMethod = this.order.payment;
      this.deliveryWindow = this.order.deliveryWindow;
      this.steps[0].meta = this.formatTime(this.order.createdAt);
    }
  }

  private formatTime(value: string) {
    return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  async openOrderActions() {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Order options',
      buttons: [
        { text: 'Copy order ID', handler: () => { void this.copyOrderId(); } },
        { text: 'Main menu', handler: () => { void this.router.navigateByUrl('/home'); } },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  private async copyOrderId() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(this.orderId);
      await this.showToast('Order ID copied');
    } catch {
      await this.showToast(`Order ID: ${this.orderId}`);
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2200, position: 'bottom' });
    await toast.present();
  }
}
