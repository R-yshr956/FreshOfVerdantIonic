import { Component, Input } from '@angular/core';
import { IonHeader, IonToolbar, IonIcon, MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chatbubbleEllipsesOutline, codeSlashOutline, menuOutline } from 'ionicons/icons';

@Component({
  selector: 'app-hero-header',
  templateUrl: './hero-header.component.html',
  styleUrls: ['./hero-header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonIcon],
})
export class HeroHeaderComponent {
  @Input() eyebrow = 'FRESH OF VERDANT';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() rightIcon = '';
  @Input() textBlack = false;

  constructor(private menuController: MenuController) {
    addIcons({ chatbubbleEllipsesOutline, codeSlashOutline, menuOutline });
  }

  openMenu() {
    void this.menuController.open('main-menu');
  }
}
