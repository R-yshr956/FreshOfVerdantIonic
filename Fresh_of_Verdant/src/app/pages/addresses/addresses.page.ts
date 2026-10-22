import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';

interface SavedAddress { id: number; label: string; name: string; phone: string; street: string; barangay: string; city: string; zip: string; isDefault: boolean; }

@Component({ selector: 'app-addresses', templateUrl: './addresses.page.html', styleUrls: ['./addresses.page.scss'], standalone: true, imports: [IonContent, FormsModule, GreenHeaderComponent] })
export class AddressesPage {
  private readonly storageKey = 'fv-addresses';
  addresses: SavedAddress[] = this.load();
  draft: Omit<SavedAddress, 'id' | 'isDefault'> = this.blank();
  editingId: number | null = null;
  showForm = false;
  readonly barangays = ['San Roque', 'Concepcion Uno', 'Sto. Niño', 'Malanday', 'Barangka', 'Calumpang', 'Industrial Valley', 'Jesus de la Peña', 'Marikina Heights', 'Nangka', 'Parang', 'Santa Elena', 'Santo Niño', 'Tumana', 'Fortune'];
  readonly cities = ['Marikina City', 'Quezon City', 'Antipolo City', 'Pasig City', 'Manila', 'Makati', 'Taguig', 'Pasay', 'Mandaluyong', 'San Juan', 'Caloocan', 'Las Piñas', 'Parañaque', 'Valenzuela', 'Muntinlupa'];

  private blank(): Omit<SavedAddress, 'id' | 'isDefault'> { return { label: 'Home', name: '', phone: '', street: '', barangay: '', city: '', zip: '' }; }
  private load(): SavedAddress[] {
    try { const stored = localStorage.getItem(this.storageKey); if (stored) return JSON.parse(stored) as SavedAddress[]; } catch { /* use the initial address below */ }
    return [{ id: 1, label: 'Home', name: 'John Paulino', phone: '', street: '24 Sampaguita St.', barangay: 'San Roque', city: 'Quezon City', zip: '', isDefault: true }];
  }
  private persist() { localStorage.setItem(this.storageKey, JSON.stringify(this.addresses)); }
  add() { this.editingId = null; this.draft = this.blank(); this.showForm = true; }
  edit(address: SavedAddress) { this.editingId = address.id; this.draft = { label: address.label, name: address.name, phone: address.phone, street: address.street, barangay: address.barangay, city: address.city, zip: address.zip }; this.showForm = true; }
  save() {
    if (!this.draft.name.trim() || !this.draft.street.trim() || !this.draft.city.trim()) return;
    if (this.editingId !== null) this.addresses = this.addresses.map((a) => a.id === this.editingId ? { ...a, ...this.draft } : a);
    else this.addresses = [...this.addresses, { ...this.draft, id: Date.now(), isDefault: this.addresses.length === 0 }];
    this.persist(); this.showForm = false;
  }
  setDefault(id: number) { this.addresses = this.addresses.map((a) => ({ ...a, isDefault: a.id === id })); this.persist(); }
  remove(id: number) { this.addresses = this.addresses.filter((a) => a.id !== id); if (this.addresses.length && !this.addresses.some((a) => a.isDefault)) this.addresses[0].isDefault = true; this.persist(); }
  cancel() { this.showForm = false; }
}
