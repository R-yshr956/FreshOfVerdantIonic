import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonHeader, IonToolbar, IonIcon, MenuController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, cartOutline, ellipsisHorizontal, lockClosedOutline, menuOutline, optionsOutline, searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonIcon, RouterLink],
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() align: 'center' | 'left' = 'center';
  @Input() backHref = '/home';       // where Back goes if there is no history
  @Input() rightIcon = '';           // icon name, e.g. 'search-outline'
  @Input() rightLabel = '';          // small text under the right icon, e.g. '2 of 3'
  @Input() rightLink = '';
  @Output() rightClick = new EventEmitter<void>();

  constructor(private menuController: MenuController) {
    // Any icon name passed in through rightIcon must be registered here
    addIcons({ arrowBack, cartOutline, ellipsisHorizontal, lockClosedOutline, menuOutline, optionsOutline, searchOutline });
  }

  openMenu() {
    void this.menuController.open('main-menu');
  }
}
