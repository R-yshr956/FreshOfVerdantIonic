import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, checkmarkCircleOutline, imageOutline, leafOutline, searchOutline, star } from 'ionicons/icons';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product';
import { ReviewService } from '../../services/reviews';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule, GreenHeaderComponent],
})
export class ProductsPage {
  search = '';
  selectedCategory: string | null = null;
  sortBy = 'latest';
  featuredOnly = false;
  popularOnly = false;
  page = 1;
  readonly pageSize = 15;

  constructor(public productService: ProductService, private cart: CartService, private reviewService: ReviewService, route: ActivatedRoute) {
    addIcons({ add, checkmarkCircleOutline, imageOutline, leafOutline, searchOutline, star });
    route.queryParamMap.subscribe((params) => {
      this.featuredOnly = params.get('featured') === 'true';
      this.popularOnly = params.get('popular') === 'true';
      this.page = 1;
    });
  }

  get filtered(): Product[] {
    const q = this.search.trim().toLowerCase();
    const rows = this.productService.products().filter((p) => {
      const category = p.category.toLowerCase();
      const normalized = category === 'vegetable' || category === 'vegetables' || category === 'vegtable' || category === 'veg tables' ? 'vegetables' : category === 'other' ? 'others' : category === 'fruit' ? 'fruits' : category === 'grain' ? 'grains' : category;
      const searchable = `${p.name} ${p.category}`.toLowerCase();
      return (!this.selectedCategory || normalized === this.selectedCategory.toLowerCase()) && (!q || searchable.includes(q)) && (!this.featuredOnly || this.productService.isFeatured(p)) && (!this.popularOnly || this.productService.isPopular(p));
    });
    return [...rows].sort((a, b) => this.sortBy === 'price-asc' ? a.price - b.price : this.sortBy === 'price-desc' ? b.price - a.price : this.sortBy === 'az' ? a.name.localeCompare(b.name) : this.sortBy === 'oldest' ? a.id - b.id : this.sortBy === 'latest' ? b.id - a.id : this.ratingFor(b.id) - this.ratingFor(a.id));
  }

  ratingFor(productId: number) {
    const reviews = this.reviewService.forProduct(productId);
    return reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  }

  reviewCountFor(productId: number) { return this.reviewService.forProduct(productId).length; }

  get paged() { const start = (this.page - 1) * this.pageSize; return this.filtered.slice(start, start + this.pageSize); }
  get pageCount() { return Math.max(1, Math.ceil(this.filtered.length / this.pageSize)); }

  onSearchChange(value: string) {
    this.search = value;
    this.page = 1;
  }

  pickCategory(cat: string) {
    this.selectedCategory = this.selectedCategory === cat ? null : cat;
    this.page = 1;
  }

  open(p: Product) {
    this.productService.openDetail(p);
  }

  quickAdd(p: Product, event: Event) {
    event.stopPropagation();
    this.cart.add(p, 1);
  }
}
