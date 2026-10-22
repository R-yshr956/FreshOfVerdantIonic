import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonCheckbox } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForward, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline, nutritionOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonCheckbox, FormsModule, RouterLink],
})
export class LoginPage {
  email = '';
  password = '';
  remember = false;
  showPassword = false;
  error = '';
  loading = false;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private auth: AuthService) {
    addIcons({ arrowForward, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline, nutritionOutline });
  }

  signIn() {
    this.error = '';
    if (!this.email.trim() || !this.password) {
      this.error = 'Enter your email address and password.';
      return;
    }
    this.loading = true;
    this.api.login(this.email, this.password).subscribe({
      next: (user) => {
        this.auth.signIn(this.email, user.fullName ?? user.name);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/home';
        void this.router.navigateByUrl(returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/home', { replaceUrl: true });
      },
      error: (err) => {
        this.error = err.error?.error ?? 'Unable to sign in. Check your connection and details.';
        this.loading = false;
      },
    });
  }
}
