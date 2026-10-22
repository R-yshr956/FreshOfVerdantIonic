import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { callOutline, locationOutline, mailOutline, personOutline, pricetagOutline, sendOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { HeroHeaderComponent } from '../../components/hero-header/hero-header.component';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule, HeroHeaderComponent],
})
export class ContactPage {
  form = { name: '', email: '', subject: '', message: '' };
  submitting = false;

  get isSignedIn() { return this.auth.isAuthenticated; }

  constructor(private auth: AuthService, private router: Router, private api: ApiService, private alerts: AlertController) {
    addIcons({ callOutline, locationOutline, mailOutline, personOutline, pricetagOutline, sendOutline, shieldCheckmarkOutline });
  }

  submit() {
    if (!this.auth.isAuthenticated) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const details = {
      name: this.form.name.trim(),
      email: this.form.email.trim().toLowerCase(),
      subject: this.form.subject.trim(),
      message: this.form.message.trim(),
    };
    const validationError = this.validate(details);
    if (validationError) {
      void this.showAlert('Please check your details', validationError);
      return;
    }

    this.submitting = true;
    this.api.submitComplaint(details).subscribe({
      next: ({ complaintId }) => {
        this.submitting = false;
        this.form.subject = '';
        this.form.message = '';
        void this.showAlert('Message submitted', `Your inquiry was sent successfully. Reference #${complaintId}.`);
      },
      error: (error) => {
        this.submitting = false;
        if (error.status === 401 || error.status === 403) {
          void this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
          return;
        }
        void this.showAlert('Unable to submit message', error.error?.error ?? 'Please check your connection and try again.');
      },
    });
  }

  signInToSendInquiry() {
    void this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  private validate(details: { name: string; email: string; subject: string; message: string }): string | null {
    if (!details.name) return 'Name is required.';
    if (details.name.length < 2 || details.name.length > 200) return 'Name must be between 2 and 200 characters.';
    if (!details.email) return 'Email is required.';
    if (details.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) return 'Enter a valid email address.';
    if (!details.subject) return 'Subject is required.';
    if (details.subject.length > 200) return 'Subject must be 200 characters or fewer.';
    if (!details.message) return 'Message is required.';
    if (details.message.length > 5000) return 'Message must be 5,000 characters or fewer.';
    return null;
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alerts.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}
