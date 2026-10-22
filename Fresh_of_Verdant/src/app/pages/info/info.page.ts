import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { callOutline, chevronForward, headsetOutline, locationOutline, mailOutline, navigateOutline, receiptOutline, searchOutline, shieldCheckmarkOutline, timeOutline } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

type InfoPageKey = 'support' | 'location' | 'faqs' | 'policies' | 'terms';

@Component({
  selector: 'app-info-page',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, PageHeaderComponent, RouterLink, FormsModule],
})
export class InfoPage {
  readonly page: InfoPageKey;
  showDirections = false;
  supportSearch = '';

  private readonly pages: Record<InfoPageKey, { title: string; subtitle: string }> = {
    support: { title: 'Help & Support', subtitle: 'We’re here to help' },
    location: { title: 'Location', subtitle: 'Visit Verdant Market Hall' },
    faqs: { title: 'FAQs', subtitle: 'Answers to common questions' },
    policies: { title: 'Policies', subtitle: 'How we handle orders and information' },
    terms: { title: 'Terms & Conditions', subtitle: 'Using Fresh of Verdant' },
  };

  readonly faqs = [
    { question: 'Where do you deliver?', answer: 'Delivery availability depends on your address. Enter your location during checkout to see whether delivery is available.' },
    { question: 'When will my order arrive?', answer: 'Choose an available delivery schedule at checkout. You can follow the order steps from Delivery Track or My Orders.' },
    { question: 'How do I pay?', answer: 'Choose Pay on Cash or Cashless at checkout. The available options are shown before you place your order.' },
    { question: 'How can I get help with an order?', answer: 'Open Contact Us from the sidebar and send us your name, email, subject, and message.' },
    { question: 'Can I change or cancel an order?', answer: 'Contact support as soon as possible with your order ID. Changes depend on the order’s preparation and delivery status.' },
  ];

  readonly supportTopics = [
    { question: 'How do I place an order?', answer: 'Browse the product list, add items to your cart, then review your address, delivery schedule, and payment option at checkout.', keywords: 'order buy checkout cart shopping' },
    { question: 'Where can I see my order status?', answer: 'Open My Orders to review current and past orders. Choose Track Order to see the delivery progress for an active order.', keywords: 'status delivery track order history' },
    { question: 'Where do you deliver?', answer: 'Delivery availability depends on your address. Enter your location during checkout to see whether delivery is available.', keywords: 'delivery location address area' },
    { question: 'What payment methods are available?', answer: 'Available payment methods are shown during checkout. Choose from the options listed before placing your order.', keywords: 'payment pay cash cashless' },
  ];

  readonly policySections = [
    { title: 'Orders and availability', body: 'Products and delivery slots are subject to availability. Prices, fees, and the order total are shown at checkout before you place an order.' },
    { title: 'Fresh produce', body: 'Produce may vary in appearance because it is sourced from farms. If an item arrives damaged or incorrect, contact support with your order details.' },
    { title: 'Delivery', body: 'Please provide a complete address and recipient contact details. Delivery timing can change due to availability, weather, or local conditions.' },
    { title: 'Personal information', body: 'Information you submit is used to manage your account, orders, delivery, and support requests. Keep your account details accurate and secure.' },
    { title: 'Support', body: 'For questions or concerns about an order or your information, use the Contact Us page.' },
  ];

  readonly termsSections = [
    { title: 'Using the app', body: 'Use Fresh of Verdant to browse products, manage your account, place orders, and contact support. You are responsible for providing accurate account, recipient, and delivery details.' },
    { title: 'Orders and payment', body: 'Submitting an order is a request to purchase the items shown at checkout. Review the items, address, schedule, fees, and payment method before placing it. Availability and delivery times may change.' },
    { title: 'Product information', body: 'Fresh produce can naturally vary in size, color, and appearance. Product details and availability are provided as accurately as possible.' },
    { title: 'Account security', body: 'Keep your sign-in details private and tell us if you believe your account has been accessed without permission.' },
    { title: 'Changes and contact', body: 'We may update app features or these terms as the service changes. For questions about these terms, contact us through the Contact Us page.' },
  ];

  constructor(route: ActivatedRoute) {
    const key = route.snapshot.data['page'] as InfoPageKey;
    this.page = this.pages[key] ? key : 'faqs';
    addIcons({ callOutline, chevronForward, headsetOutline, locationOutline, mailOutline, navigateOutline, receiptOutline, searchOutline, shieldCheckmarkOutline, timeOutline });
  }

  get title() { return this.pages[this.page].title; }
  get subtitle() { return this.pages[this.page].subtitle; }

  get filteredSupportTopics() {
    const query = this.supportSearch.trim().toLowerCase();
    if (!query) return this.supportTopics;
    return this.supportTopics.filter((topic) => `${topic.question} ${topic.answer} ${topic.keywords}`.toLowerCase().includes(query));
  }

  toggleDirections() {
    this.showDirections = !this.showDirections;
  }
}
