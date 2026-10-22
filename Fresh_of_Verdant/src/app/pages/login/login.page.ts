import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForward, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline, nutritionOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule, RouterLink],
})
export class LoginPage {
  email = '';
  password = '';
  remember = false;
  showPassword = false;
  error = '';
  loading = false;
  emailError = '';
  passwordError = '';

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private auth: AuthService, private products: ProductService, private alertController: AlertController) {
    addIcons({ arrowForward, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline, nutritionOutline });
  }

  signIn() {
    this.error = '';
    this.emailError = '';
    this.passwordError = '';
    const email = this.email.trim();
    if (!email) this.emailError = 'Email Address is required.';
    else if (email.length > 254) this.emailError = 'Email Address must be 254 characters or fewer.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) this.emailError = 'Enter a valid email address.';

    if (!this.password) this.passwordError = 'Password is required.';
    else if (this.password.length > 64) this.passwordError = 'Password must be 64 characters or fewer.';

    if (this.emailError || this.passwordError) {
      this.error = this.emailError || this.passwordError;
      void this.showAlert(this.error);
      return;
    }
    this.loading = true;
    this.api.login(email.toLowerCase(), this.password).subscribe({
      next: (user) => {
        const fullName = user.user?.fullName ?? user.fullName ?? user.name;
        this.auth.signIn(this.email, fullName);
        this.products.connectWishlistToAccount();
        if (fullName) {
          localStorage.setItem('fv-profile-details', JSON.stringify({
            'Full Name': fullName,
            'Email Address': email.toLowerCase(),
          }));
        }
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/home';
        void this.router.navigateByUrl(returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/home', { replaceUrl: true });
      },
      error: (err) => {
        this.error = err.error?.error ?? 'Unable to sign in. Check your connection and details.';
        this.loading = false;
        void this.showAlert(this.error);
      },
    });
  }

  clearEmailError() { this.emailError = ''; this.error = ''; }
  clearPasswordError() { this.passwordError = ''; this.error = ''; }

  goToRegister() {
    void this.router.navigateByUrl('/register');
  }

  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Unable to sign in',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
