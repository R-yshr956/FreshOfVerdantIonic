import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonIcon, IonCheckbox } from '@ionic/angular';
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
  fieldErrors: Record<string, string> = {};
  private readonly maxNameLength = 80;
  private readonly maxEmailLength = 254;
  private readonly maxPasswordLength = 64;

  constructor(private router: Router, private api: ApiService, private auth: AuthService, private alertController: AlertController) {
    addIcons({ arrowForward, callOutline, chevronForward, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline, nutritionOutline, personOutline, shieldCheckmarkOutline });
  }

  register() {
    this.error = '';
    this.fieldErrors = this.validateForm();
    const firstError = Object.values(this.fieldErrors)[0];
    if (firstError) {
      this.error = firstError;
      void this.showAlert(firstError);
      return;
    }

    this.loading = true;
    this.api.register({ fullName: this.form.fullName.trim(), email: this.form.email.trim().toLowerCase(), password: this.form.password, phoneNumber: this.form.phone.trim() }).subscribe({
      next: () => {
        localStorage.setItem('fv-profile-details', JSON.stringify({ 'Full Name': this.form.fullName.trim(), 'Email Address': this.form.email.trim().toLowerCase(), 'Mobile Number': this.form.phone.trim() }));
        this.auth.signIn(this.form.email, this.form.fullName);
        void this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      error: (err) => {
        this.error = err.error?.error ?? 'Unable to register. Check your connection and details.';
        this.loading = false;
        void this.showAlert(this.error);
      },
    });
  }

  clearFieldError(field: string) {
    delete this.fieldErrors[field];
    this.error = '';
  }

  private validateForm(): Record<string, string> {
    const errors: Record<string, string> = {};
    const name = this.form.fullName.trim();
    const email = this.form.email.trim();
    const phone = this.form.phone.trim();
    const phoneDigits = phone.replace(/\D/g, '');

    if (!name) errors['fullName'] = 'Full Name is required.';
    else if (name.length < 2) errors['fullName'] = 'Full Name must be at least 2 characters.';
    else if (name.length > this.maxNameLength) errors['fullName'] = `Full Name must be ${this.maxNameLength} characters or fewer.`;
    else if (!/^[\p{L}\p{M}][\p{L}\p{M} .’'-]*$/u.test(name)) errors['fullName'] = 'Use letters, spaces, apostrophes, periods, or hyphens in your name.';

    if (!email) errors['email'] = 'Email Address is required.';
    else if (email.length > this.maxEmailLength) errors['email'] = `Email Address must be ${this.maxEmailLength} characters or fewer.`;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors['email'] = 'Enter a valid email address.';

    if (!phone) errors['phone'] = 'Contact / Phone Number is required.';
    else if (!/^[+\d() .-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) errors['phone'] = 'Enter a valid phone number with 7 to 15 digits.';

    if (!this.form.password) errors['password'] = 'Password is required.';
    else if (this.form.password.length < 8) errors['password'] = 'Password must be at least 8 characters.';
    else if (this.form.password.length > this.maxPasswordLength) errors['password'] = `Password must be ${this.maxPasswordLength} characters or fewer.`;

    if (!this.form.confirmPassword) errors['confirmPassword'] = 'Confirm Password is required.';
    else if (this.form.password !== this.form.confirmPassword) errors['confirmPassword'] = 'Passwords do not match.';

    if (!this.agree) errors['terms'] = 'Please agree to the Terms & Conditions.';
    return errors;
  }

  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Please check your details',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
