import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bagCheckOutline, megaphoneOutline, notificationsOutline, radioOutline } from 'ionicons/icons';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';

type NotificationPrefs = { orders: boolean; delivery: boolean; offers: boolean; app: boolean };

@Component({ selector: 'app-notifications', templateUrl: './notifications.page.html', styleUrls: ['./notifications.page.scss'], standalone: true, imports: [IonContent, IonIcon, FormsModule, GreenHeaderComponent] })
export class NotificationsPage {
  prefs: NotificationPrefs = this.load();
  constructor() { addIcons({ bagCheckOutline, megaphoneOutline, notificationsOutline, radioOutline }); }
  private load(): NotificationPrefs {
    try { const saved = localStorage.getItem('fv-notification-prefs'); if (saved) return { orders: true, delivery: true, offers: false, app: true, ...JSON.parse(saved) as Partial<NotificationPrefs> }; } catch { /* retain defaults */ }
    return { orders: true, delivery: true, offers: false, app: true };
  }
  save() { localStorage.setItem('fv-notification-prefs', JSON.stringify(this.prefs)); }
}
