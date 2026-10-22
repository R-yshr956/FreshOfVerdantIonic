import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { callOutline, locationOutline, mailOutline, personOutline, pricetagOutline, sendOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { HeroHeaderComponent } from '../../components/hero-header/hero-header.component';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule, HeroHeaderComponent],
})
export class ContactPage {
  form = { name: '', email: '', subject: '', message: '' };

  constructor(private auth: AuthService, private router: Router) {
    addIcons({ callOutline, locationOutline, mailOutline, personOutline, pricetagOutline, sendOutline, shieldCheckmarkOutline });
  }

  submit() {
    if (!this.auth.isAuthenticated) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    // TODO: send this.form to your API
    console.log(this.form);
  }
}
