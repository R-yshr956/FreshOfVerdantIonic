import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { leafOutline, timeOutline, storefrontOutline } from 'ionicons/icons';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';

@Component({ selector: 'app-history', templateUrl: './app-history.page.html', styleUrls: ['./app-history.page.scss'], standalone: true, imports: [IonContent, IonIcon, GreenHeaderComponent] })
export class AppHistoryPage {
  constructor() { addIcons({ leafOutline, timeOutline, storefrontOutline }); }
}
