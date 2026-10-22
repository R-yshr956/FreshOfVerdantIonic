import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cartOutline, heart, heartOutline, imageOutline, star } from 'ionicons/icons';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, RouterLink, GreenHeaderComponent],
})
export class WishlistPage {
  constructor(public products: ProductService, private cart: CartService) {
    addIcons({ cartOutline, heart, heartOutline, imageOutline, star });
  }

  get favorites(): Product[] {
    const ids = new Set(this.products.favorites());
    return this.products.products().filter((product) => ids.has(product.id));
  }

  open(product: Product) { this.products.openDetail(product); }
  remove(product: Product, event: Event) { event.stopPropagation(); this.products.toggleFavorite(product); }
  addToCart(product: Product, event: Event) { event.stopPropagation(); this.cart.add(product, 1); }
}
