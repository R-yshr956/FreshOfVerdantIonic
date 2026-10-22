import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AlertController, IonApp, IonRouterOutlet, IonMenu, IonContent, IonIcon, IonMenuToggle } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { callOutline, cartOutline, codeSlashOutline, gridOutline, helpCircleOutline, homeOutline, cubeOutline, logOutOutline, mailOutline, personOutline, heartOutline, receiptOutline, navigateOutline, locationOutline, shieldCheckmarkOutline, informationCircleOutline, chevronForward, settingsOutline } from 'ionicons/icons';
import { filter } from 'rxjs';
import { CartService } from './services/cart';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, IonApp, IonRouterOutlet, IonMenu, IonContent, IonIcon, IonMenuToggle],
})
export class AppComponent {
  // Menu items: change the title / url / icon here
  menuGroups = [
    { title: 'Home', items: [{ title: 'Home / Dashboard', url: '/home', icon: 'home-outline' }, { title: 'Product List', url: '/products', icon: 'cube-outline' }, { title: 'Categories & Produce', url: '/products?view=categories', icon: 'grid-outline' }] },
    { title: 'Market', items: [{ title: 'My Cart', url: '/cart', icon: 'cart-outline', badge: true }, { title: 'Wishlist', url: '/wishlist', icon: 'heart-outline' }, { title: 'My Orders', url: '/orders', icon: 'receipt-outline' }, { title: 'Delivery Track', url: '/order-tracker', icon: 'navigate-outline' }, { title: 'Help & Support', url: '/contact?section=support', icon: 'help-circle-outline' }] },
    { title: 'Discover our App', items: [{ title: 'About the App', url: '/about', icon: 'information-circle-outline' }, { title: 'History of our App', url: '/app-history', icon: 'information-circle-outline' }, { title: 'About Services', url: '/about-services', icon: 'information-circle-outline' }] },
    { title: 'Others', items: [{ title: 'Settings', url: '/settings', icon: 'settings-outline' }, { title: 'Location', url: '/contact?section=location', icon: 'location-outline' }, { title: 'FAQs', url: '/contact?section=faqs', icon: 'help-circle-outline' }, { title: 'Policies', url: '/about?section=policies', icon: 'shield-checkmark-outline' }, { title: 'Terms & Conditions', url: '/about?section=terms', icon: 'shield-checkmark-outline' }, { title: 'Contact us', url: '/contact?section=contact', icon: 'mail-outline' }, { title: 'Developers', url: '/developers', icon: 'code-slash-outline' }] },
  ];

  showMenu = false;

  constructor(private router: Router, public cart: CartService, private alerts: AlertController) {
    addIcons({ callOutline, cartOutline, codeSlashOutline, gridOutline, helpCircleOutline, homeOutline, cubeOutline, logOutOutline, mailOutline, personOutline, heartOutline, receiptOutline, navigateOutline, locationOutline, shieldCheckmarkOutline, informationCircleOutline, chevronForward, settingsOutline });

    // Hide the side menu on splash / login / register / reset password
    const noMenu = ['/splash', '/login', '/register', '/forgot-password'];
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.showMenu = !noMenu.some((p) => e.urlAfterRedirects.startsWith(p));
    });
  }

  async logout() {
    const alert = await this.alerts.create({ header: 'Logout?', message: 'Are you sure about to Log out?', buttons: [{ text: 'NO', role: 'cancel' }, { text: 'YES', role: 'confirm' }] });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role === 'confirm') this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  isMenuItemActive(url: string) { return this.router.url === url; }
}
