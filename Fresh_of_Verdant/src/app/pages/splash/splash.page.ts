import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonSpinner } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, IonSpinner],
})
export class SplashPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Go to login after 2.5 seconds
    setTimeout(() => this.router.navigateByUrl('/login', { replaceUrl: true }), 2500);
  }
}
