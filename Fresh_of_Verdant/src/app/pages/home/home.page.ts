import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cartOutline, cubeOutline, imageOutline, sparklesOutline } from 'ionicons/icons';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, RouterLink, GreenHeaderComponent],
})
export class HomePage {
  @ViewChild('promoTrack') private promoTrack?: ElementRef<HTMLDivElement>;

  promoIndex = 0;
  promos = [
    { tag: 'WEEKEND HARVEST', title: 'Save 20% on farm-fresh bundles', subtitle: 'Picked this morning. Delivered today.', image: 'assets/images/promos/harvest-bundle.jpg', alt: 'Autumn harvest fruits and vegetables' },
    { tag: 'GROWN NEARBY', title: 'Fresh greens for every table', subtitle: 'Find crisp local vegetables today.', image: 'assets/images/promos/fresh-market.jpg', alt: 'Colorful fresh vegetables at a market' },
    { tag: 'SWEET SEASON', title: 'Make room for something fresh', subtitle: 'Browse this week’s fruit picks.', image: 'assets/images/promos/fruit-and-veg.jpg', alt: 'Fresh fruits and vegetables on a dark surface' },
  ];

  constructor(public products: ProductService, private cart: CartService, private auth: AuthService) {
    addIcons({ cartOutline, cubeOutline, imageOutline, sparklesOutline });
  }

  get greeting() {
    return this.auth.isAuthenticated ? `Welcome, ${this.auth.currentName() || 'there'}` : 'Welcome to the';
  }

  open(product: Product) {
    this.products.openDetail(product);
  }

  addToCart(product: Product, event: Event) { event.stopPropagation(); this.cart.add(product, 1); }

  onPromoScroll() {
    const track = this.promoTrack?.nativeElement;
    if (track) this.promoIndex = Math.round(track.scrollLeft / track.clientWidth);
  }

  showPromo(index: number) {
    const track = this.promoTrack?.nativeElement;
    if (track) track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  }
}
