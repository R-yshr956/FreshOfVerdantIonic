import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline, lockClosedOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-security',
  templateUrl: './security.page.html',
  styleUrls: ['./security.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule, PageHeaderComponent],
})
export class SecurityPage {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  showPasswords = false;
  message = '';
  error = '';

  constructor() {
    addIcons({ eyeOffOutline, eyeOutline, lockClosedOutline, shieldCheckmarkOutline });
  }

  changePassword() {
    this.error = '';
    this.message = '';
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.error = 'Enter your current password and complete both new password fields.';
      return;
    }
    if (this.newPassword.length < 8) {
      this.error = 'Your new password must be at least 8 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'The new passwords do not match.';
      return;
    }

    this.message = 'Password updates are not connected to the account service yet. Your password has not been changed.';
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
