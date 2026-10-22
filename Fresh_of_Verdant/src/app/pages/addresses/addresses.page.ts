import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { locateOutline, locationOutline } from 'ionicons/icons';
import { GreenHeaderComponent } from '../../components/green-header/green-header.component';

interface SavedAddress { id: number; label: string; name: string; phone: string; street: string; barangay: string; city: string; zip: string; isDefault: boolean; }

@Component({ selector: 'app-addresses', templateUrl: './addresses.page.html', styleUrls: ['./addresses.page.scss'], standalone: true, imports: [IonContent, IonIcon, FormsModule, GreenHeaderComponent] })
export class AddressesPage {
  constructor(private alerts: AlertController) { addIcons({ locateOutline, locationOutline }); }
  private readonly storageKey = 'fv-addresses';
  addresses: SavedAddress[] = this.load();
  draft: Omit<SavedAddress, 'id' | 'isDefault'> = this.blank();
  editingId: number | null = null;
  showForm = false;
  mapPinX = 50;
  mapPinY = 44;
  isDraggingPin = false;
  isLocating = false;
  readonly barangays = ['San Roque', 'Concepcion Uno', 'Sto. Niño', 'Malanday', 'Barangka', 'Calumpang', 'Industrial Valley', 'Jesus de la Peña', 'Marikina Heights', 'Nangka', 'Parang', 'Santa Elena', 'Santo Niño', 'Tumana', 'Fortune'];
  readonly cities = ['Marikina City', 'Quezon City', 'Antipolo City', 'Pasig City', 'Manila', 'Makati', 'Taguig', 'Pasay', 'Mandaluyong', 'San Juan', 'Caloocan', 'Las Piñas', 'Parañaque', 'Valenzuela', 'Muntinlupa'];

  private blank(): Omit<SavedAddress, 'id' | 'isDefault'> { return { label: 'Home', name: '', phone: '', street: '', barangay: '', city: '', zip: '' }; }
  private load(): SavedAddress[] {
    try { const stored = localStorage.getItem(this.storageKey); if (stored) return JSON.parse(stored) as SavedAddress[]; } catch { /* use the initial address below */ }
    return [{ id: 1, label: 'Home', name: 'John Paulino', phone: '', street: '24 Sampaguita St.', barangay: 'San Roque', city: 'Quezon City', zip: '', isDefault: true }];
  }
  private persist() { localStorage.setItem(this.storageKey, JSON.stringify(this.addresses)); }
  add() { this.editingId = null; this.draft = this.blank(); this.mapPinX = 50; this.mapPinY = 44; this.showForm = true; }
  edit(address: SavedAddress) { this.editingId = address.id; this.draft = { label: address.label, name: address.name, phone: address.phone, street: address.street, barangay: address.barangay, city: address.city, zip: address.zip }; this.mapPinX = 50; this.mapPinY = 44; this.showForm = true; }
  save() {
    if (!this.draft.name.trim() || !this.draft.street.trim() || !this.draft.city.trim()) return;
    if (this.editingId !== null) this.addresses = this.addresses.map((a) => a.id === this.editingId ? { ...a, ...this.draft } : a);
    else this.addresses = [...this.addresses, { ...this.draft, id: Date.now(), isDefault: this.addresses.length === 0 }];
    this.persist(); this.showForm = false;
  }
  setDefault(id: number) { this.addresses = this.addresses.map((a) => ({ ...a, isDefault: a.id === id })); this.persist(); }
  remove(id: number) { this.addresses = this.addresses.filter((a) => a.id !== id); if (this.addresses.length && !this.addresses.some((a) => a.isDefault)) this.addresses[0].isDefault = true; this.persist(); }
  cancel() { this.showForm = false; }

  startPinDrag(event: PointerEvent) { event.preventDefault(); this.isDraggingPin = true; (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId); this.movePin(event); }
  movePin(event: PointerEvent) {
    if (!this.isDraggingPin) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.mapPinX = Math.max(5, Math.min(95, ((event.clientX - rect.left) / rect.width) * 100));
    this.mapPinY = Math.max(12, Math.min(88, ((event.clientY - rect.top) / rect.height) * 100));
    this.draft.street = this.sampleStreet(this.mapPinX, this.mapPinY);
  }
  endPinDrag() { this.isDraggingPin = false; }

  async locateMe() {
    if (!navigator.geolocation) { await this.locationAlert('Location is unavailable in this browser. You can still move the pin or enter the address manually.'); return; }
    this.isLocating = true;
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      this.isLocating = false;
      this.mapPinX = 50; this.mapPinY = 44;
      this.draft.street = `Current location (${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)})`;
      await this.locationAlert('Your device location was detected. The sample map cannot convert it into a street address, so enter the street, barangay, and city for delivery.');
    }, async (error) => {
      this.isLocating = false;
      await this.locationAlert(error.code === error.PERMISSION_DENIED ? 'Location permission was denied. Allow access in browser settings, or enter the address manually.' : 'Could not detect your location. Move the pin or enter the address manually.');
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  }

  private sampleStreet(x: number, y: number) {
    const street = x < 46 || y > 58 ? 'Sampaguita St.' : 'Quezon Ave.';
    return `${Math.max(1, Math.round((y * 11 + x * 7) % 90))} ${street}`;
  }
  private async locationAlert(message: string) { const alert = await this.alerts.create({ message, buttons: ['OK'] }); await alert.present(); }
}
