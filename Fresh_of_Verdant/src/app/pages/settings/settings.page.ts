import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cardOutline, chevronForward, helpCircleOutline, locationOutline, notificationsOutline, personOutline, settingsOutline } from 'ionicons/icons';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';

@Component({ selector: 'app-settings', templateUrl: './settings.page.html', styleUrls: ['./settings.page.scss'], standalone: true, imports: [IonContent, IonIcon, RouterLink, GreenHeaderComponent] })
export class SettingsPage {
  constructor() { addIcons({ cardOutline, chevronForward, helpCircleOutline, locationOutline, notificationsOutline, personOutline, settingsOutline }); }
}
