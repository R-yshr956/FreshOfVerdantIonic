import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonCheckbox } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForward, callOutline, chevronForward, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline, nutritionOutline, personOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonCheckbox, FormsModule, RouterLink],
})
export class RegisterPage {
  form = { fullName: '', email: '', phone: '', password: '', confirmPassword: '' };
  agree = false;
  showPassword = false;
  showConfirm = false;
  error = '';
  loading = false;

  constructor(private router: Router, private api: ApiService, private auth: AuthService) {
    addIcons({ arrowForward, callOutline, chevronForward, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline, nutritionOutline, personOutline, shieldCheckmarkOutline });
  }

  register() {
    this.error = '';
    if (!this.form.fullName.trim() || !this.form.email.trim() || !this.form.password) {
      this.error = 'Please complete your name, email, and password.';
      return;
    }
    if (this.form.password.length < 8) {
      this.error = 'Your password must be at least 8 characters.';
      return;
    }
    if (this.form.password !== this.form.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    if (!this.agree) {
      this.error = 'Please agree to the Terms & Conditions.';
      return;
    }

    this.loading = true;
    this.api.register({ fullName: this.form.fullName, email: this.form.email, password: this.form.password, phoneNumber: this.form.phone }).subscribe({
      next: () => {
        localStorage.setItem('fv-profile-details', JSON.stringify({ 'Full Name': this.form.fullName.trim(), 'Email Address': this.form.email.trim().toLowerCase(), 'Mobile Number': this.form.phone.trim() }));
        this.auth.signIn(this.form.email, this.form.fullName);
        void this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      error: (err) => {
        this.error = err.error?.error ?? 'Unable to register. Check your connection and details.';
        this.loading = false;
      },
    });
  }
}
