import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cartOutline, cubeOutline, heartOutline, leafOutline, navigateOutline } from 'ionicons/icons';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';

@Component({ selector: 'app-about-services', templateUrl: './about-services.page.html', styleUrls: ['./about-services.page.scss'], standalone: true, imports: [IonContent, IonIcon, GreenHeaderComponent] })
export class AboutServicesPage {
  constructor() { addIcons({ cartOutline, cubeOutline, heartOutline, leafOutline, navigateOutline }); }
}
