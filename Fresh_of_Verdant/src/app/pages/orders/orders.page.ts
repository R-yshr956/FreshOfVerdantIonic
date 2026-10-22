import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { imageOutline } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { OrderHistoryService } from '../../services/order-history';
import { ProductService } from '../../services/product';
import { CartItem } from '../../models/product';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, RouterLink, PageHeaderComponent],
})
export class OrdersPage {
  tab: 'active' | 'past' = 'active';

  orders: Array<{ id: string; date: string; status: string; items: string; total: number; previews?: CartItem[] }> = [
    { id: 'FOV-8942', date: 'October 3, 2026 · 10:24 AM', status: 'In Transit', items: '3 fresh items', total: 520 },
    { id: 'FOV-8817', date: 'September 26, 2026 · 4:08 PM', status: 'Delivered', items: '5 pantry items', total: 845 },
    { id: 'FOV-8704', date: 'September 12, 2026 · 8:36 AM', status: 'Delivered', items: '4 market picks', total: 690 },
  ];

  constructor(history: OrderHistoryService, public productService: ProductService) {
    addIcons({ imageOutline });
    const saved = history.all().map((order) => ({
      id: order.id,
      date: new Date(order.createdAt).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' }),
      status: order.status === 'Delivered' ? 'Delivered' : 'In Transit',
      items: `${order.items.reduce((count, item) => count + item.qty, 0)} fresh items`,
      total: order.total,
      previews: order.items,
    }));
    this.orders = [...saved, ...this.orders.filter((sample) => !saved.some((order) => order.id === sample.id))];
  }

  // Active = anything not delivered yet
  get shown() {
    return this.orders.filter((o) => (this.tab === 'active') === (o.status !== 'Delivered'));
  }

  previewsFor(order: (typeof this.orders)[number]): CartItem[] {
    const items = order.previews?.length
      ? order.previews
      : this.productService.products().slice(0, 3).map((product) => ({ id: product.id, name: product.name, price: product.price, unit: product.unit, qty: 1, image: product.image }));
    return items.slice(0, 3).map((item) => ({
      ...item,
      image: item.image ?? this.productService.products().find((product) => product.id === item.id)?.image,
    }));
  }

  reorder(id: string) {
    // TODO: add this order's items back to the cart
    console.log('Reorder', id);
  }
}
