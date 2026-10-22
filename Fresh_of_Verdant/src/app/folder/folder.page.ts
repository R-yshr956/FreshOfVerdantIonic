import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { imageOutline, leafOutline } from 'ionicons/icons';
import { GreenHeaderComponent } from '../components/green-header/green-header.component';
import { Product } from '../models/product';
import { ProductService } from '../services/product';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule, GreenHeaderComponent],
})
export class FolderPage {
  categoryOrder: 'az' | 'za' = 'az';

  constructor(public products: ProductService) {
    addIcons({ imageOutline, leafOutline });
  }

  get sortedCategories(): string[] {
    const categories = [...new Set(this.products.products().map((product) => product.category.trim()).filter(Boolean))];
    return categories.sort((a, b) => this.categoryOrder === 'az' ? a.localeCompare(b) : b.localeCompare(a));
  }

  productsIn(category: string): Product[] {
    return this.products.products()
      .filter((product) => product.category.trim() === category)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  description(product: Product): string {
    return product.description.trim() || `${product.name} is a fresh ${product.category.toLowerCase()} pick. Enjoy it as part of a balanced diet.`;
  }

  openProduct(product: Product) {
    void this.products.openDetail(product);
  }
}
