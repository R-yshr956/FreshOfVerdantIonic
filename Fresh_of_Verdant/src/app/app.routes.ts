import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'folder/:folder',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.page').then( m => m.ProductsPage)
  },
  {
    path: 'categories',
    redirectTo: 'folder/categories',
    pathMatch: 'full'
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.page').then( m => m.CartPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist.page').then((m) => m.WishlistPage)
  },
  {
    path: 'addresses',
    loadComponent: () => import('./pages/addresses/addresses.page').then((m) => m.AddressesPage)
  },
  {
    path: 'payment',
    loadComponent: () => import('./pages/payment/payment.page').then((m) => m.PaymentPage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.page').then((m) => m.NotificationsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then((m) => m.SettingsPage)
  },
  {
    path: 'security',
    loadComponent: () => import('./pages/security/security.page').then((m) => m.SecurityPage)
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.page').then( m => m.OrdersPage)
  },
  {
    path: 'reviews',
    loadComponent: () => import('./pages/reviews/reviews.page').then( m => m.ReviewsPage)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.page').then( m => m.CheckoutPage)
  },
  {
    path: 'order-tracker',
    loadComponent: () => import('./pages/order-tracker/order-tracker.page').then( m => m.OrderTrackerPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then( m => m.AboutPage)
  },
  {
    path: 'app-history',
    loadComponent: () => import('./pages/app-history/app-history.page').then(m => m.AppHistoryPage)
  },
  {
    path: 'about-services',
    loadComponent: () => import('./pages/about-services/about-services.page').then(m => m.AboutServicesPage)
  },
  {
    path: 'developers',
    loadComponent: () => import('./pages/developers/developers.page').then( m => m.DevelopersPage)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.page').then( m => m.ContactPage)
  },
  {
    path: 'help-support',
    loadComponent: () => import('./pages/info/info.page').then((m) => m.InfoPage),
    data: { page: 'support' },
  },
  {
    path: 'location',
    loadComponent: () => import('./pages/info/info.page').then((m) => m.InfoPage),
    data: { page: 'location' },
  },
  {
    path: 'faqs',
    loadComponent: () => import('./pages/info/info.page').then((m) => m.InfoPage),
    data: { page: 'faqs' },
  },
  {
    path: 'policies',
    loadComponent: () => import('./pages/info/info.page').then((m) => m.InfoPage),
    data: { page: 'policies' },
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/info/info.page').then((m) => m.InfoPage),
    data: { page: 'terms' },
  },
];
