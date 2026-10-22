import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronForward, peopleOutline, personOutline, sparklesOutline } from 'ionicons/icons';
import { HeroHeaderComponent } from '../../components/hero-header/hero-header.component';

@Component({
  selector: 'app-developers',
  templateUrl: './developers.page.html',
  styleUrls: ['./developers.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, HeroHeaderComponent],
})
export class DevelopersPage {
  team = [
    { name: 'John Paulino', role: 'Leader', focus: 'Fresh of Verdant' },
    { name: 'Khyle Gamboa', role: 'Member', focus: 'Fresh of Verdant' },
    { name: 'Iyad Ghazal', role: 'Member', focus: 'Fresh of Verdant' },
    { name: 'Reyniel Jose', role: 'Member', focus: 'Fresh of Verdant' },
    { name: 'Carl Pardo', role: 'Member', focus: 'Fresh of Verdant' },
  ];

  constructor() {
    addIcons({ chevronForward, peopleOutline, personOutline, sparklesOutline });
  }
}
