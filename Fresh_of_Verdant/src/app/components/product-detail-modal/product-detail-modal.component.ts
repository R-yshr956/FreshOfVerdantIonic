import { Component, Input } from '@angular/core';
import { AlertController, IonContent, IonIcon, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, cartOutline, close, heart, heartOutline, imageOutline, leafOutline, removeOutline, star, starOutline } from 'ionicons/icons';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart';
import { ProductService } from '../../services/product';
import { ReviewService, UserReview } from '../../services/reviews';

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.scss'],
  standalone: true,
  imports: [IonContent, IonIcon],
})
export class ProductDetailModal {
  @Input() product!: Product; // passed in through componentProps
  qty = 1;
  liked = false;
  private touchStartX = 0;

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController, private cart: CartService, public products: ProductService, public reviewService: ReviewService) {
    addIcons({ addOutline, cartOutline, close, heart, heartOutline, imageOutline, leafOutline, removeOutline, star, starOutline });
  }

  async toggleFavorite() {
    const removing = this.products.isFavorite(this.product);
    const alert = await this.alertCtrl.create({
      message: removing ? 'Are you removing that Wishlist?' : 'Are you adding that Wishlist?',
      buttons: [
        { text: 'Yes', role: 'confirm' },
        { text: 'No', role: 'cancel' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== 'confirm') return;

    this.products.toggleFavorite(this.product);
    this.liked = this.products.isFavorite(this.product);
  }

  onSwipeStart(event: TouchEvent) { this.touchStartX = event.changedTouches[0]?.clientX ?? 0; }

  onSwipeEnd(event: TouchEvent) {
    const distance = (event.changedTouches[0]?.clientX ?? this.touchStartX) - this.touchStartX;
    if (Math.abs(distance) < 90) return;
    const list = this.products.products();
    const index = list.findIndex((item) => item.id === this.product.id);
    const next = list[index + (distance < 0 ? 1 : -1)];
    if (next) { this.product = next; this.qty = 1; this.liked = this.products.isFavorite(next); }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  change(delta: number) {
    this.qty = Math.max(1, this.qty + delta);
  }

  get total() {
    return this.product.price * this.qty;
  }

  get productReviews(): UserReview[] { return this.reviewService.forProduct(this.product.id); }
  get productRating() { return this.productReviews.length ? this.productReviews.reduce((sum, review) => sum + review.rating, 0) / this.productReviews.length : 0; }
  get roundedRating() { return Math.round(this.productRating); }

  get healthNotes(): string[] {
    const notes: Record<string, string[]> = {
      apples: ['52 kcal per 100 g makes this one of the lighter fruit choices.', 'Provides 4.6 mg vitamin C and 13.8 g carbohydrates per 100 g.'],
      strawberries: ['Provides 58.8 mg vitamin C per 100 g, one of the highest values in this catalogue.', 'At 32 kcal per 100 g, it is a lower-energy fruit choice.'],
      mangoes: ['Provides 36.4 mg vitamin C per 100 g.', 'Its 15 g carbohydrates per 100 g make it a naturally sweet fruit.'],
      blueberries: ['Provides 57 kcal and 14.5 g carbohydrates per 100 g.', 'Contains 9.7 mg vitamin C per 100 g.'],
      plums: ['Provides 46 kcal per 100 g.', 'Contains 11.4 g carbohydrates and 9.5 mg vitamin C per 100 g.'],
      pomelo: ['Provides 61 mg vitamin C per 100 g.', 'At 38 kcal per 100 g, it is a relatively low-energy citrus fruit.'],
      watermelons: ['Provides 30 kcal per 100 g, the lowest value among the listed fruits.', 'Contains 7.6 g carbohydrates and 8.1 mg vitamin C per 100 g.'],
      grapes: ['Provides 69 kcal per 100 g.', 'Contains 18.1 g carbohydrates per 100 g, so consider serving size.'],
      cantaloupe: ['Provides 36.7 mg vitamin C per 100 g.', 'At 34 kcal per 100 g, it is a light fruit option.'],
      longan: ['Provides 84 mg vitamin C per 100 g.', 'Contains 15.1 g carbohydrates per 100 g.'],
      tomatoes: ['Provides 18 kcal per 100 g.', 'Contains 13.7 mg vitamin C per 100 g.'],
      'butternut squash': ['Provides 45 kcal per 100 g.', 'Contains 11.7 g carbohydrates and 21 mg vitamin C per 100 g.'],
      artichokes: ['Provides 3.3 g protein per 100 g, higher than most vegetables listed.', 'Contains 10.5 g carbohydrates per 100 g.'],
      olives: ['Provides 145 kcal per 100 g, making it more energy-dense than the other listed produce.', 'Its vitamin C content is 0 mg per 100 g in this nutrition reference.'],
      'bell peppers': ['Provides 127.7 mg vitamin C per 100 g, the highest value in this catalogue.', 'At 31 kcal per 100 g, it adds vitamin C with relatively few calories.'],
      'habanero peppers': ['Provides 24 mg vitamin C per 100 g.', 'Choose a small portion to suit your tolerance for heat.'],
      potatoes: ['Provides 17.5 g carbohydrates per 100 g.', 'Contains 19.7 mg vitamin C and 2 g protein per 100 g.'],
      onions: ['Provides 40 kcal per 100 g.', 'Contains 9.3 g carbohydrates and 7.4 mg vitamin C per 100 g.'],
      garlics: ['Provides 6.4 g protein per 100 g, relatively high for a vegetable.', 'Its 149 kcal per 100 g reflects its concentrated nutrition; garlic is usually eaten in small portions.'],
      rice: ['Provides 130 kcal and 28.2 g carbohydrates per 100 g of cooked rice.', 'Contains 2.7 g protein per 100 g.'],
      wheat: ['Provides 13.7 g protein per 100 g, the highest value among the listed grains.', 'Contains 71.1 g carbohydrates per 100 g.'],
      corn: ['Provides 86 kcal per 100 g.', 'Contains 3.3 g protein, 18.7 g carbohydrates, and 6.8 mg vitamin C per 100 g.'],
      barley: ['Provides 12.5 g protein per 100 g.', 'Contains 73.5 g carbohydrates per 100 g; serve alongside vegetables and protein foods.'],
      oats: ['Provides 16.9 g protein per 100 g, among the highest grain values listed.', 'Contains 66.3 g carbohydrates per 100 g.'],
      rye: ['Provides 75.9 g carbohydrates per 100 g.', 'Contains 10.3 g protein per 100 g.'],
      sorghum: ['Provides 11.3 g protein per 100 g.', 'Contains 72.1 g carbohydrates per 100 g.'],
      millet: ['Provides 11 g protein per 100 g.', 'Contains 72.9 g carbohydrates per 100 g.'],
      buckwheat: ['Provides 13.3 g protein per 100 g.', 'Contains 71.5 g carbohydrates per 100 g.'],
      einkorn: ['Provides 18 g protein per 100 g, the highest grain value listed.', 'Contains 64 g carbohydrates per 100 g.'],
      teff: ['Provides 13.3 g protein per 100 g.', 'Contains 73.1 g carbohydrates per 100 g.'],
    };
    return notes[this.product.name.trim().toLowerCase()] ?? [
      `Provides ${this.product.calories} kcal per 100 g.`,
      `Contains ${this.product.protein} g protein and ${this.product.carbs} g carbohydrates per 100 g.`,
    ];
  }

  addToCart() {
    this.cart.add(this.product, this.qty);
    this.modalCtrl.dismiss();
  }
}
