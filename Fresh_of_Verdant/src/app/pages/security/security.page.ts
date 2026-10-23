import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline, lockClosedOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ApiService } from '../../services/api';

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
  saving = false;

  constructor(private api: ApiService) {
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
    if (this.newPassword.length > 64) {
      this.error = 'Your new password must be 64 characters or fewer.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'The new passwords do not match.';
      return;
    }

    if (this.currentPassword === this.newPassword) {
      this.error = 'Choose a new password that differs from your current password.';
      return;
    }

    this.saving = true;
    this.api.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (result) => {
        this.message = result.message || 'Your password has been changed.';
        this.clearPasswords();
        this.saving = false;
      },
      error: (response) => {
        this.error = response?.error?.error || 'Unable to update your password. Check your current password and try again.';
        this.saving = false;
      },
    });
  }

  private clearPasswords() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
