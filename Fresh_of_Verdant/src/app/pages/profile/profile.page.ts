import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { callOutline, cardOutline, checkmark, chevronForward, heartOutline, locationOutline, mailOutline, notificationsOutline, pencilOutline, personOutline, settingsOutline, shieldCheckmarkOutline, starOutline } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule, RouterLink, PageHeaderComponent],
})
export class ProfilePage {
  constructor(public products: ProductService) {
    addIcons({ callOutline, cardOutline, checkmark, chevronForward, heartOutline, locationOutline, mailOutline, notificationsOutline, pencilOutline, personOutline, settingsOutline, shieldCheckmarkOutline, starOutline });
  }

  fields = [
    { label: 'Full Name', icon: 'person-outline', value: 'John Doe', type: 'text', editing: false },
    { label: 'Email Address', icon: 'mail-outline', value: 'johndoe@email.com', type: 'email', editing: false },
    { label: 'Mobile Number', icon: 'call-outline', value: '+63 917 555 0210', type: 'tel', editing: false },
    { label: 'Location Address', icon: 'location-outline', value: '24 Sampaguita St., Quezon City', type: 'text', editing: false },
  ];

  save() {
    // TODO: send this.fields to your API
    this.fields.forEach((f) => (f.editing = false));
  }
}
