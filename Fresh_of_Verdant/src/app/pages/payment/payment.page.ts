import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cashOutline, phonePortraitOutline, radioButtonOff, radioButtonOn } from 'ionicons/icons';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';

@Component({ selector: 'app-payment', templateUrl: './payment.page.html', styleUrls: ['./payment.page.scss'], standalone: true, imports: [IonContent, IonIcon, FormsModule, GreenHeaderComponent] })
export class PaymentPage {
  method = localStorage.getItem('fv-payment-method') ?? 'cash';
  constructor() { addIcons({ cashOutline, phonePortraitOutline, radioButtonOff, radioButtonOn }); }
  choose(method: string) { this.method = method; localStorage.setItem('fv-payment-method', method); }
}
