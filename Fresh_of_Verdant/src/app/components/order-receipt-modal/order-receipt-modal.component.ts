import { Component, Input } from '@angular/core';
import { IonContent, IonIcon, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, receiptOutline } from 'ionicons/icons';
import { TrackedOrder } from '../../services/order-history';

@Component({
  selector: 'app-order-receipt-modal',
  templateUrl: './order-receipt-modal.component.html',
  styleUrls: ['./order-receipt-modal.component.scss'],
  standalone: true,
  imports: [IonContent, IonIcon],
})
export class OrderReceiptModalComponent {
  @Input({ required: true }) order!: TrackedOrder;
  @Input() allowRefund = true;

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline, receiptOutline });
  }

  get placedAt() {
    return new Date(this.order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  }

  get itemsSubtotal() {
    return this.order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  get deliveryAndTax() {
    return Math.max(0, this.order.total - this.itemsSubtotal);
  }

  close() {
    return this.modalCtrl.dismiss(undefined, 'close');
  }

  requestRefund() {
    return this.modalCtrl.dismiss(undefined, 'request-refund');
  }
}
