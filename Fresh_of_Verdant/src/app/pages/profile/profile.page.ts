import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { callOutline, cardOutline, checkmark, chevronForward, heartOutline, locationOutline, mailOutline, notificationsOutline, pencilOutline, personOutline, settingsOutline, shieldCheckmarkOutline, starOutline } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ProductService } from '../../services/product';
import { ReviewService } from '../../services/reviews';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule, RouterLink, PageHeaderComponent],
})
export class ProfilePage {
  constructor(public products: ProductService, public reviewService: ReviewService, private alerts: AlertController) {
    addIcons({ callOutline, cardOutline, checkmark, chevronForward, heartOutline, locationOutline, mailOutline, notificationsOutline, pencilOutline, personOutline, settingsOutline, shieldCheckmarkOutline, starOutline });
    this.loadSavedProfile();
  }

  fields = [
    { label: 'Full Name', icon: 'person-outline', value: 'John Doe', type: 'text', editing: false },
    { label: 'Email Address', icon: 'mail-outline', value: 'johndoe@email.com', type: 'email', editing: false },
    { label: 'Mobile Number', icon: 'call-outline', value: '+63 917 555 0210', type: 'tel', editing: false },
    { label: 'Location Address', icon: 'location-outline', value: '24 Sampaguita St., Quezon City', type: 'text', editing: false },
  ];

  get profileName() { return this.fields.find((field) => field.label === 'Full Name')?.value ?? ''; }
  get profileEmail() { return this.fields.find((field) => field.label === 'Email Address')?.value ?? ''; }
  get profileInitials() {
    const words = this.profileName.trim().split(/\s+/).filter(Boolean);
    return words.length > 1 ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase() : (words[0]?.[0] ?? 'U').toUpperCase();
  }

  async save() {
    this.fields.forEach((f) => (f.editing = false));
    localStorage.setItem('fv-profile-details', JSON.stringify(Object.fromEntries(this.fields.map((field) => [field.label, field.value]))));
    const alert = await this.alerts.create({ message: 'Changes are Saved', buttons: ['OK'] });
    await alert.present();
  }

  private loadSavedProfile() {
    try {
      const saved = JSON.parse(localStorage.getItem('fv-profile-details') ?? '{}') as Record<string, unknown>;
      this.fields.forEach((field) => {
        const value = saved[field.label];
        if (typeof value === 'string') field.value = value;
      });
    } catch {
      // Keep the default profile details if saved data is unavailable or invalid.
    }
  }
}
