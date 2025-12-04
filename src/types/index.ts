export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profilePicture?: string;
  createdAt: string;
}

export interface PalmData {
  id: string;
  userId: string;
  isRegistered: boolean;
  registrationDate?: string;
  registrationLocation?: string;
  template: string;
}

export interface PaymentCard {
  id: string;
  userId: string;
  lastFourDigits: string;
  expirationDate: string;
  cardType: 'visa' | 'mastercard' | 'amex';
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  merchantId: string;
  amount: number;
  status: 'completed' | 'failed' | 'pending';
  timestamp: string;
  merchantName: string;
  terminalId: string;
  receiptId: string;
}

export interface Merchant {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Terminal {
  id: string;
  merchantId: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  lastActivity: string;
}

export interface Product {
  id: string;
  merchantId: string;
  name: string;
  price: number;
  taxRate: number;
  category: string;
}

export interface EnrollmentSession {
  id: string;
  tpeId: string;
  sessionId: string;
  userId?: string;
  status: 'pending' | 'authorized' | 'completed' | 'expired';
  expiresAt: string;
  createdAt: string;
}