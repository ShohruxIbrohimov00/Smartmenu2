export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  CAFE_ADMIN = 'cafe_admin',
  WAITER = 'waiter',
  CUSTOMER = 'customer'
}

export interface Media {
  url: string;
  type: 'image' | 'video';
  orderIndex: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  media: Media[];
  isActive: boolean;
  preparationTime?: string; // e.g. "20-25 daqiqa"
  calories?: number;
  weight?: string; // e.g. "450 g"
  ingredients?: string[];
  isChefSpecial?: boolean;
}

export interface Category {
  id: string;
  cafeId: string;
  name: string;
  orderIndex: number;
}

export interface Cafe {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  adminId: string;
  adminLogin?: string;
  adminPassword?: string;
  themeColor?: string;
  phone?: string;
  address?: string;
  tablesCount?: number;
  wifiName?: string;
  wifiPassword?: string;
}

export interface Waiter {
  id: string;
  cafeId: string;
  name: string;
  login: string;
  password: string;
  phone?: string;
  assignedTables: string[]; // e.g. ["1", "2", "3"] yoki ["Barchasi"]
  isActive: boolean;
}

export interface TableCall {
  id: string;
  cafeId: string;
  tableNumber: string;
  type: 'call_waiter' | 'request_bill';
  createdAt: string;
  status: 'pending' | 'resolved';
  resolvedBy?: string;
}

export interface OrderItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  cafeId: string;
  tableNumber: string;
  items: OrderItem[];
  totalAmount: number;
  cashbackUsed?: number;
  cashbackEarned?: number;
  status: 'new' | 'preparing' | 'served' | 'paid' | 'cancelled';
  createdAt: string;
  waiterName?: string;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  cashbackBalance: number;
  tier: 'Standart' | 'Kumush' | 'Oltin' | 'VIP';
  cashbackPercent: number;
  totalOrdersCount: number;
  totalSpent: number;
  freeSpins: number;
}

export interface AppState {
  currentRole: UserRole;
  activeCafe?: Cafe;
  cafes: Cafe[];
  categories: Category[];
  items: MenuItem[];
  waiters: Waiter[];
  tableCalls: TableCall[];
  orders: Order[];
}
