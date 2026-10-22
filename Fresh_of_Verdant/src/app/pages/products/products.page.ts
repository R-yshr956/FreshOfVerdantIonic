import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, checkmarkCircleOutline, imageOutline, leafOutline, searchOutline } from 'ionicons/icons';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product';

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

  constructor(public productService: ProductService, private cart: CartService) {
    addIcons({ add, checkmarkCircleOutline, imageOutline, leafOutline, searchOutline });
  }

  get filtered(): Product[] {
    const q = this.search.trim().toLowerCase();
    const rows = this.productService.products().filter((p) => {
      const category = p.category.toLowerCase();
      const normalized = category === 'vegetable' || category === 'vegetables' || category === 'vegtable' || category === 'veg tables' ? 'vegetables' : category === 'other' ? 'others' : category === 'fruit' ? 'fruits' : category === 'grain' ? 'grains' : category;
      return (!this.selectedCategory || normalized === this.selectedCategory.toLowerCase()) && (!q || p.name.toLowerCase().includes(q)) && (!this.featuredOnly || p.featured) && (!this.popularOnly || p.rating >= 4.5);
    });
    return [...rows].sort((a, b) => this.sortBy === 'price-asc' ? a.price - b.price : this.sortBy === 'price-desc' ? b.price - a.price : this.sortBy === 'az' ? a.name.localeCompare(b.name) : this.sortBy === 'oldest' ? a.id - b.id : this.sortBy === 'latest' ? b.id - a.id : b.rating - a.rating);
  }

  get paged() { const start = (this.page - 1) * this.pageSize; return this.filtered.slice(start, start + this.pageSize); }
  get pageCount() { return Math.max(1, Math.ceil(this.filtered.length / this.pageSize)); }

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
