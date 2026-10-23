import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonIcon, MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cartOutline, menuOutline } from 'ionicons/icons';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-green-header',
  templateUrl: './green-header.component.html',
  styleUrls: ['./green-header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonIcon, RouterLink],
})
export class GreenHeaderComponent {
  @Input() subtitle = '';
  @Input() title = '';
  @Input() brandMode = false;

  constructor(public cart: CartService, public auth: AuthService, private menuController: MenuController) {
    addIcons({ cartOutline, menuOutline });
  }

  async openMenu() {
    await this.menuController.open('main-menu');
  }
}
