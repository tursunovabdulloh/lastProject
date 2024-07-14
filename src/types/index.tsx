// types.ts
export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  apiKey: string;
  appName: string;
  createdAt: string;
  isAnonymous: boolean;
  lastLoginAt: string;
  providerData: ProviderData[];
  stsTokenManager: STSTokenManager;
}

interface ProviderData {
  providerId: string;
  uid: string;
  displayName: string | null;
  email: string;
  phoneNumber: string | null;
  photoURL: string | null;
}

interface STSTokenManager {
  refreshToken: string;
  accessToken: string;
  expirationTime: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  gender: "male" | "female";
  image?: any;
  sizes: string[];
  color: "";
  rating: number;
}
