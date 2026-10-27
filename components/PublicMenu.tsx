import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { onImgError } from '../assets';
import { useParams, useSearchParams } from 'react-router-dom';
import { Cafe, Category, MenuItem, TableCall, Order, CustomerProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Receipt, 
  Clock, 
  Flame, 
  X, 
  Check, 
  Plus, 
  Minus, 
  Wifi, 
  Coffee, 
  ChevronRight, 
  Copy, 
  CheckCheck, 
  UtensilsCrossed, 
  MessageSquare,
  Gift,
  History,
  User,
  Sparkles,
  Trophy,
  Wallet,
  Phone,
  Share2,
  RotateCw,
  Award,
  ArrowRight,
  ShieldCheck,
  Percent
} from 'lucide-react';

interface PublicMenuProps {
  cafes: Cafe[];
  categories: Category[];
  items: MenuItem[];
  onCallWaiter?: (call: TableCall) => void;
  onCreateOrder?: (order: Order) => void;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ') + " so'm";
};

// Wheel Prizes Configuration
const WHEEL_PRIZES = [
  { id: 1, label: "25 000 so'm Keshbek", type: "cashback", value: 25000, color: "#ea580c" },
  { id: 2, label: "Bepul Choynak Choy", type: "item", value: "Choynak Choy", color: "#0f172a" },
  { id: 3, label: "50 000 so'm Keshbek", type: "cashback", value: 50000, color: "#9333ea" },
  { id: 4, label: "Bepul Tandir Somsa", type: "item", value: "Tandir Somsa", color: "#d97706" },
  { id: 5, label: "10% Chegirma", type: "discount", value: 10, color: "#059669" },
  { id: 6, label: "Asalli Pahlava", type: "item", value: "Asalli Pahlava", color: "#e11d48" }
];

const PublicMenu: React.FC<PublicMenuProps> = ({ 
  cafes, 
  categories, 
  items,
  onCallWaiter,
  onCreateOrder
}) => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTable = searchParams.get('table');

  // Bottom Navigation Active Tab: 'menu' | 'bonuses' | 'orders' | 'profile'
  const [currentTab, setCurrentTab] = useState<'menu' | 'bonuses' | 'orders' | 'profile'>('menu');
  useEffect(() => { window.scrollTo(0, 0); }, [currentTab]);

  const [currentTable, setCurrentTable] = useState<string>(urlTable || '1');
  const [isChangingTable, setIsChangingTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Detail Modal for Food Item
  const [activeDetailItem, setActiveDetailItem] = useState<MenuItem | null>(null);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);
  const [detailNotes, setDetailNotes] = useState<string>('');

  // Wi-Fi Modal
  const [showWifiModal, setShowWifiModal] = useState<boolean>(false);
  const [isCopiedWifi, setIsCopiedWifi] = useState<boolean>(false);

  // Cart State: { [itemId]: { quantity: number, notes?: string } }
  const [cart, setCart] = useState<{ [itemId: string]: { quantity: number; notes?: string } }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [useCashbackInOrder, setUseCashbackInOrder] = useState(false);

  // Customer Loyalty & Cashback Profile State
  const [profile, setProfile] = useState<CustomerProfile>({
    name: 'Alisher Zokirov',
    phone: '+998 90 123 45 67',
    cashbackBalance: 48500,
    tier: 'Oltin',
    cashbackPercent: 5,
    totalOrdersCount: 14,
    totalSpent: 1850000,
    freeSpins: 2
  });

  // Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<typeof WHEEL_PRIZES[0] | null>(null);

  // Local Order History
  const [customerOrders, setCustomerOrders] = useState<Order[]>([
    {
      id: 'ord-8831',
      cafeId: 'cafe-1',
      tableNumber: '3',
      items: [
        { item: items[0] || initialFallbackItem, quantity: 2 },
        { item: items[2] || initialFallbackItem, quantity: 4 }
      ],
      totalAmount: 132000,
      cashbackEarned: 6600,
      status: 'served',
      createdAt: 'Bugun, 11:35'
    },
    {
      id: 'ord-7612',
      cafeId: 'cafe-1',
      tableNumber: '3',
      items: [
        { item: items[1] || initialFallbackItem, quantity: 3 }
      ],
      totalAmount: 72000,
      cashbackEarned: 3600,
      status: 'paid',
      createdAt: '22-Oktabr, 19:40'
    }
  ]);

  // Confirmation Modals for Calling Waiter / Bill
  const [confirmCallType, setConfirmCallType] = useState<'call_waiter' | 'request_bill' | null>(null);

  // Toast notification banner
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'call' | 'bill' | 'order', text: string } | null>(null);

  const activeCafe = useMemo(() => {
    return cafes.find(c => c.slug === slug) || cafes[0];
  }, [cafes, slug]);

  const cafeCategories = useMemo(() => {
    return categories.filter(c => c.cafeId === activeCafe?.id);
  }, [categories, activeCafe]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? item.categoryId === selectedCategory : true;
      const isCafeItem = cafeCategories.some(cat => cat.id === item.categoryId);
      return matchesSearch && matchesCategory && isCafeItem && item.isActive;
    });
  }, [items, searchQuery, selectedCategory, cafeCategories]);

  // Cart calculations
  const cartItemsCount = Object.values(cart).reduce((sum, entry) => sum + entry.quantity, 0);
  const cartGrossAmount = Object.entries(cart).reduce((sum, [itemId, entry]) => {
    const it = items.find(i => i.id === itemId);
    return sum + (it ? it.price * entry.quantity : 0);
  }, 0);

  // Cashback discount
  const applicableCashback = useCashbackInOrder 
    ? Math.min(profile.cashbackBalance, cartGrossAmount) 
    : 0;
  const cartFinalAmount = Math.max(0, cartGrossAmount - applicableCashback);
  const potentialCashbackEarn = Math.round(cartFinalAmount * (profile.cashbackPercent / 100));
  const qualifiesForSpin = cartGrossAmount >= 200000;

  const quickAddToCart = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setCart(prev => ({
      ...prev,
      [itemId]: {
        quantity: (prev[itemId]?.quantity || 0) + 1,
        notes: prev[itemId]?.notes || ''
      }
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[itemId] && updated[itemId].quantity > 1) {
        updated[itemId].quantity -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  // Open Food Detail Modal
  const openItemDetail = (item: MenuItem) => {
    setActiveDetailItem(item);
    setDetailQuantity(cart[item.id]?.quantity || 1);
    setDetailNotes(cart[item.id]?.notes || '');
  };

  const saveDetailToCart = () => {
    if (!activeDetailItem) return;
    setCart(prev => ({
      ...prev,
      [activeDetailItem.id]: {
        quantity: detailQuantity,
        notes: detailNotes.trim()
      }
    }));
    setActiveDetailItem(null);
    setFeedbackMessage({
      type: 'order',
      text: `${activeDetailItem.name} (${detailQuantity} ta) savatga qo'shildi!`
    });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const copyWifiPassword = () => {
    if (activeCafe?.wifiPassword) {
      navigator.clipboard.writeText(activeCafe.wifiPassword);
      setIsCopiedWifi(true);
      setTimeout(() => setIsCopiedWifi(false), 2500);
    }
  };

  const handleCallWaiterAction = (type: 'call_waiter' | 'request_bill') => {
    if (!activeCafe) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newCall: TableCall = {
      id: 'call-' + Math.random().toString(36).substr(2, 7),
      cafeId: activeCafe.id,
      tableNumber: currentTable,
      type,
      createdAt: timeStr,
      status: 'pending'
    };

    if (onCallWaiter) {
      onCallWaiter(newCall);
    }

    setConfirmCallType(null);
    setFeedbackMessage({
      type: type === 'call_waiter' ? 'call' : 'bill',
      text: type === 'call_waiter'
        ? `${currentTable}-stolga ofitsiant chaqirildi! Tez orada yetib keladi.`
        : `${currentTable}-stol uchun hisob-kitob (chek) so'raldi!`
    });

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4500);
  };

  const handleSubmitOrder = () => {
    if (cartItemsCount === 0 || !activeCafe) return;

    const orderItems = Object.entries(cart).map(([itemId, entry]) => {
      const item = items.find(it => it.id === itemId)!;
      return { 
        item, 
        quantity: entry.quantity,
        notes: entry.notes 
      };
    });

    const now = new Date();
    const timeStr = `Bugun, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newOrder: Order = {
      id: 'ord-' + Math.random().toString(36).substr(2, 6),
      cafeId: activeCafe.id,
      tableNumber: currentTable,
      items: orderItems,
      totalAmount: cartFinalAmount,
      cashbackUsed: applicableCashback,
      cashbackEarned: potentialCashbackEarn,
      status: 'new',
      createdAt: timeStr
    };

    if (onCreateOrder) {
      onCreateOrder(newOrder);
    }

    // Update Customer Profile with cashback & spins
    setProfile(prev => ({
      ...prev,
      cashbackBalance: Math.max(0, prev.cashbackBalance - applicableCashback) + potentialCashbackEarn,
      totalOrdersCount: prev.totalOrdersCount + 1,
      totalSpent: prev.totalSpent + cartFinalAmount,
      freeSpins: qualifiesForSpin ? prev.freeSpins + 1 : prev.freeSpins
    }));

    setCustomerOrders(prev => [newOrder, ...prev]);

    setCart({});
    setIsCartOpen(false);
    setUseCashbackInOrder(false);

    setFeedbackMessage({
      type: 'order',
      text: qualifiesForSpin 
        ? `Buyurtma qabul qilindi! +${formatPrice(potentialCashbackEarn)} keshbek va 1 ta bepul Baraban aylantirish berildi!` 
        : `Buyurtma qabul qilindi! +${formatPrice(potentialCashbackEarn)} keshbek hisobingizga qo'shildi.`
    });

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 5500);
  };

  // Re-order past order
  const handleReorder = (order: Order) => {
    const newCart: { [itemId: string]: { quantity: number; notes?: string } } = {};
    order.items.forEach(oi => {
      newCart[oi.item.id] = { quantity: oi.quantity, notes: oi.notes };
    });
    setCart(newCart);
    setCurrentTab('menu');
    setIsCartOpen(true);
    setFeedbackMessage({
      type: 'order',
      text: `Avvalgi buyurtma savatga qayta joylandi!`
    });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Omad barabani: nishon tanlangan sektorning aynan o'rtasiga kelib to'xtaydi.
  const spinWheel = () => {
    if (isSpinning || profile.freeSpins <= 0) return;

    setIsSpinning(true);
    setWonPrize(null);

    const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const selectedPrize = WHEEL_PRIZES[prizeIndex];
    const segmentAngle = 360 / WHEEL_PRIZES.length;
    const currentAngle = ((wheelRotation % 360) + 360) % 360;
    // Sektorlar yuqoridagi ko'rsatkichdan soat yo'nalishi bo'yicha hisoblanadi.
    const prizeCenterAngle = (prizeIndex + 0.5) * segmentAngle;
    const alignment = (360 - ((currentAngle + prizeCenterAngle) % 360)) % 360;
    const extraRotations = 360 * 7;
    const totalRotation = wheelRotation + extraRotations + alignment;

    setWheelRotation(totalRotation);

    // CSS animatsiya davomiyligi bilan bir xil bo'lishi kerak.
    window.setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);
      setProfile(prev => ({
        ...prev,
        freeSpins: Math.max(0, prev.freeSpins - 1),
        cashbackBalance: selectedPrize.type === 'cashback'
          ? prev.cashbackBalance + (selectedPrize.value as number)
          : prev.cashbackBalance
      }));
    }, 5400);
  };

  // Kafe topilmagan holatni xavfsiz boshqarish.
  if (!activeCafe) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Kafe topilmadi</h1>
          <p className="mt-2 text-sm text-slate-500">Havolani tekshirib, qayta urinib ko'ring.</p>
        </div>
      </div>
    );
  }

  const tableList = Array.from({ length: activeCafe.tablesCount || 15 }, (_, i) => (i + 1).toString());

  return (
    <div className="min-h-[100dvh] bg-neutral-900 flex justify-center text-slate-900 font-sans select-none sm:py-6">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed top-4 inset-x-4 z-50 max-w-md mx-auto pointer-events-auto"
          >
            <div className="p-4 rounded-2xl bg-slate-950/95 backdrop-blur-xl text-white shadow-2xl flex items-center gap-3 border border-white/20">
              <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex-grow pr-1">
                <p className="text-xs font-bold leading-snug">{feedbackMessage.text}</p>
              </div>
              <button onClick={() => setFeedbackMessage(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mobile App Frame (iPhone / Modern Mobile Canvas) */}
      <div className="w-full max-w-md bg-white min-h-[100dvh] sm:min-h-[92dvh] sm:rounded-[44px] shadow-2xl border-x sm:border border-slate-800/10 flex flex-col relative overflow-hidden pb-24">
        
        {/* ===================== TAB 1: TAOMLAR (MENU) ===================== */}
        {currentTab === 'menu' && (
          <div className="flex-grow flex flex-col">
            {/* Luxury Header */}
            <div className="relative bg-gradient-to-b from-stone-950 via-zinc-900 to-stone-900 text-white px-5 pt-6 pb-6 rounded-b-[40px] shadow-xl">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img onError={onImgError} decoding="async"
                    src={activeCafe.logoUrl}
                    alt={activeCafe.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-white/20 shadow-md ring-2 ring-white/10"
                  />
                  <div>
                    <h1 className="text-lg font-black tracking-tight leading-tight">{activeCafe.name}</h1>
                    <p className="text-[10px] text-amber-400 font-bold tracking-widest uppercase mt-0.5">
                      Raqamli Smart Menyu
                    </p>
                  </div>
                </div>

                {/* Table Badge & Quick Switch */}
                <button
                  onClick={() => setIsChangingTable(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  <span>Stol #{currentTable}</span>
                </button>
              </div>

              {/* Quick Action Buttons: Call Waiter & Bill */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={() => setConfirmCallType('call_waiter')}
                  className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Bell className="w-4 h-4 text-orange-400" />
                  <span>Ofitsiantni chaqirish</span>
                </button>

                <button
                  onClick={() => setConfirmCallType('request_bill')}
                  className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Receipt className="w-4 h-4 text-amber-400" />
                  <span>Chek (Hisob) so'rash</span>
                </button>
              </div>

              {/* Wi-Fi & Cashback Ribbon */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => setShowWifiModal(true)}
                  className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors"
                >
                  <Wifi className="w-3.5 h-3.5 text-amber-400" />
                  <span>Wi-Fi: <strong className="text-white font-semibold">{activeCafe.wifiName}</strong></span>
                </button>

                <div 
                  onClick={() => setCurrentTab('bonuses')}
                  className="flex items-center gap-1.5 text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-xl border border-amber-500/30 cursor-pointer active:scale-95 transition-all"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Keshbek: {formatPrice(profile.cashbackBalance)}</span>
                </div>
              </div>
            </div>

            {/* Sticky Search & Category Bar */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 pt-3 pb-2.5 border-b border-slate-100 shadow-xs">
              <div className="relative mb-2.5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Taom yoki ichimlik nomi..."
                  className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Tabs */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    !selectedCategory
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Barchasi
                </button>

                {cafeCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Items List */}
            <main className="p-4 space-y-3.5 flex-grow">
              <AnimatePresence initial={false}>
                {filteredItems.map(item => {
                  const qtyInCart = cart[item.id]?.quantity || 0;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => openItemDetail(item)}
                      className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-shadow flex gap-3.5 cursor-pointer group"
                    >
                      {/* Photo with aspect-ratio */}
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                        <img onError={onImgError} decoding="async"
                          src={item.media[0]?.url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {item.isChefSpecial && (
                          <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                            Tavsiya
                          </span>
                        )}
                        {item.weight && (
                          <span className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded-md font-mono">
                            {item.weight}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-between flex-grow min-w-0 py-0.5">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100/80">
                          <div>
                            <span className="text-xs font-black text-slate-900 font-mono tabular-nums">
                              {formatPrice(item.price)}
                            </span>
                            {item.preparationTime && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                <span>{item.preparationTime}</span>
                              </div>
                            )}
                          </div>

                          {qtyInCart === 0 ? (
                            <button
                              onClick={(e) => quickAddToCart(e, item.id)}
                              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Qo'shish</span>
                            </button>
                          ) : (
                            <div 
                              onClick={(e) => e.stopPropagation()} 
                              className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl"
                            >
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs active:scale-90"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold font-mono px-1">{qtyInCart}</span>
                              <button
                                onClick={(e) => quickAddToCart(e, item.id)}
                                className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs active:scale-90"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredItems.length === 0 && (
                <div className="text-center py-16 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">Taom topilmadi</h4>
                  <p className="text-xs text-slate-400 mt-1">Boshqa so'z bilan qidirib ko'ring yoki toifani o'zgartiring.</p>
                </div>
              )}
            </main>
          </div>
        )}

        {/* ===================== TAB 2: BONUSLAR & OMAD BARABANI ===================== */}
        {currentTab === 'bonuses' && (
          <div className="p-4 space-y-5 flex-grow">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Keshbek & Sovg'alar</h2>
                <p className="text-xs text-slate-500">Doimiy mijozlar uchun maxsus imtiyozlar</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700">
                <Gift className="w-6 h-6" />
              </div>
            </div>

            {/* Cashback Balance Card */}
            <div className="bg-gradient-to-br from-stone-900 via-neutral-900 to-black text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-amber-500/30">
              <div className="absolute right-[-20px] top-[-20px] w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>{profile.tier} Mijoz Statusi</span>
                  </span>
                  <div className="text-2xl font-black font-mono mt-1 text-white tabular-nums">
                    {formatPrice(profile.cashbackBalance)}
                  </div>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-xl text-xs font-mono font-bold text-amber-300 border border-white/10">
                  {profile.cashbackPercent}% Keshbek
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Har bir buyurtmangizdan {profile.cashbackPercent}% hamyoningizga qaytadi. Istalgan buyurtmangizni keshbek hisobidan to'lashingiz mumkin.
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-stone-400">
                <span>Jami tejalgan: <strong className="text-white font-mono tabular-nums">{formatPrice(profile.totalSpent * 0.05)}</strong></span>
                <span>Tashriflar: <strong className="text-white">{profile.totalOrdersCount} marta</strong></span>
              </div>
            </div>

            {/* Lucky Wheel (Omad Barabani) Section */}
            <div className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-b from-white via-orange-50/40 to-amber-50/70 p-5 text-center shadow-[0_18px_55px_-28px_rgba(234,88,12,0.35)] sm:p-7">
              <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-amber-200/30 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-orange-200/30 blur-2xl" />

              <div className="relative z-10">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-orange-700 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Omad Barabani</span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-900">Omadingizni sinab ko'ring!</h3>
                <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-slate-500">
                  200 000 so'mdan ortiq har bir buyurtma uchun 1 ta bepul aylantirish.
                </p>
              </div>

              <div className="relative z-10 mt-4 inline-flex items-center gap-2 rounded-full border border-slate-800/10 bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-md">
                <RotateCw className={`h-4 w-4 text-amber-400 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>Qolgan urinish:</span>
                <strong className="font-mono text-sm text-amber-300">{profile.freeSpins}</strong>
              </div>

              {/* Haqiqiy sektor ko'rinishidagi, silliq aylanadigan baraban */}
              <div className="relative mx-auto my-6 flex h-[304px] w-[304px] max-w-full items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-orange-500 to-amber-700 shadow-[0_16px_32px_-12px_rgba(124,45,18,0.55)]" />
                <div className="absolute inset-[5px] rounded-full border border-white/70" />

                {/* Ko'rsatkich baraban tashqarisida turadi va aylanmaydi */}
                <div className="absolute left-1/2 top-[-3px] z-30 -translate-x-1/2 drop-shadow-[0_3px_3px_rgba(0,0,0,0.35)]">
                  <div className="relative h-0 w-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-slate-950" />
                  <div className="absolute left-1/2 top-[-2px] h-0 w-0 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[17px] border-l-transparent border-r-transparent border-t-amber-300" />
                </div>

                <div
                  className="relative h-[280px] w-[280px] overflow-hidden rounded-full border-[5px] border-slate-950 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.3)] will-change-transform"
                  style={{
                    background: `conic-gradient(${WHEEL_PRIZES.map((prize, idx) => `${prize.color} ${idx * (360 / WHEEL_PRIZES.length)}deg ${(idx + 1) * (360 / WHEEL_PRIZES.length)}deg`).join(', ')})`,
                    transform: `rotate(${wheelRotation}deg)`,
                    transition: isSpinning ? 'transform 5.4s cubic-bezier(0.12, 0.78, 0.08, 1)' : 'none'
                  }}
                >
                  {/* Sektorlar orasidagi nozik oq chiziqlar */}
                  {WHEEL_PRIZES.map((prize, idx) => {
                    const angle = (idx * 360) / WHEEL_PRIZES.length;
                    return (
                      <div
                        key={`divider-${prize.id}`}
                        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-1/2 w-px origin-top bg-white/75"
                        style={{ transform: `rotate(${angle}deg) translateX(-50%)` }}
                      />
                    );
                  })}

                  {WHEEL_PRIZES.map((prize, idx) => {
                    const segmentAngle = 360 / WHEEL_PRIZES.length;
                    const midAngle = (idx + 0.5) * segmentAngle;
                    const radians = (midAngle * Math.PI) / 180;
                    const radius = 79;
                    const x = Math.sin(radians) * radius;
                    const y = -Math.cos(radians) * radius;
                    return (
                      <div
                        key={prize.id}
                        className="pointer-events-none absolute z-[2] flex h-[44px] w-[82px] -translate-x-1/2 -translate-y-1/2 items-center justify-center px-1 text-center text-[9px] font-black leading-[1.15] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] sm:text-[10px]"
                        style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                      >
                        <span>{prize.label}</span>
                      </div>
                    );
                  })}

                  {/* Markaziy medal */}
                  <div className="absolute left-1/2 top-1/2 z-10 flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[4px] border-amber-300 bg-gradient-to-br from-slate-800 to-slate-950 text-amber-300 shadow-[0_4px_12px_rgba(0,0,0,0.45)] ring-2 ring-white/80">
                    <Trophy className="h-6 w-6 drop-shadow" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={spinWheel}
                disabled={isSpinning || profile.freeSpins <= 0}
                className={`relative z-10 w-full rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-[0.12em] transition duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 disabled:cursor-not-allowed active:scale-[0.98] ${
                  isSpinning
                    ? 'bg-slate-800 text-white shadow-md'
                    : profile.freeSpins > 0
                      ? 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white shadow-[0_10px_24px_-8px_rgba(234,88,12,0.65)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-8px_rgba(234,88,12,0.7)]'
                      : 'bg-slate-200 text-slate-400 shadow-none'
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {isSpinning && <RotateCw className="h-4 w-4 animate-spin" />}
                  {isSpinning
                    ? "Baraban aylanmoqda..."
                    : profile.freeSpins > 0
                      ? "Barabanni aylantirish"
                      : "Urinishlar qolmagan"}
                </span>
              </button>

              {wonPrize && (
                <motion.div
                  initial={{ y: 8, scale: 0.97, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="relative z-10 mt-4 overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-amber-950 shadow-sm"
                  role="status"
                  aria-live="polite"
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">🎉 Tabriklaymiz!</div>
                  <div className="mt-1 text-base font-black text-orange-700">{wonPrize.label}</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
                    Yutug'ingiz hisobingizga biriktirildi.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: ZAKAZLAR TARIXI ===================== */}
        {currentTab === 'orders' && (
          <div className="p-4 space-y-4 flex-grow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Buyurtmalar Tarixi</h2>
                <p className="text-xs text-slate-500">Stol buyurtmalari va keshbek hisobotlari</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-700">
                <History className="w-5 h-5" />
              </div>
            </div>

            {customerOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">Hozircha buyurtmalar yo'q</h4>
                <p className="text-xs text-slate-400 mt-1">Menyudan taom tanlang va buyurtma bering.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {customerOrders.map(order => (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-slate-900 text-white px-2.5 py-1 rounded-xl">
                          STOL #{order.tableNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">#{order.id.slice(-4)}</span>
                      </div>

                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${
                        order.status === 'served' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : order.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {order.status === 'served' ? 'Yetkazilgan' : order.status === 'paid' ? 'To\'langan' : 'Tayyorlanmoqda'}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="space-y-1.5 text-xs">
                      {order.items.map((oi, i) => (
                        <div key={i} className="flex justify-between items-center text-slate-700">
                          <span className="font-medium">
                            <strong className="text-slate-900 font-mono">{oi.quantity}x</strong> {oi.item.name}
                          </span>
                          <span className="font-mono text-slate-500 tabular-nums">
                            {formatPrice(oi.item.price * oi.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total & Cashback Earned */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>+{formatPrice(order.cashbackEarned || Math.round(order.totalAmount * 0.05))} Keshbek</span>
                        </div>
                        <div className="text-sm font-black text-slate-900 font-mono tabular-nums">
                          {formatPrice(order.totalAmount)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleReorder(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Qayta buyurtma</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: PROFIL ===================== */}
        {currentTab === 'profile' && (
          <div className="p-4 space-y-4 flex-grow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Mijoz Profili</h2>
                <p className="text-xs text-slate-500">Shaxsiy hisob va sozlamalar</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-700">
                <User className="w-5 h-5" />
              </div>
            </div>

            {/* Profile Avatar Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                {profile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">{profile.name}</h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                    {profile.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{profile.phone}</p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">
                  ✓ Doimiy 5% keshbek faollashtirilgan
                </p>
              </div>
            </div>

            {/* Loyalty Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hamyon Keshbek</div>
                <div className="text-lg font-black text-slate-900 font-mono mt-1 tabular-nums">
                  {formatPrice(profile.cashbackBalance)}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1">To'lovga tayyor</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Omad Barabani</div>
                <div className="text-lg font-black text-slate-900 font-mono mt-1">
                  {profile.freeSpins} ta aylantirish
                </div>
                <div className="text-[10px] text-orange-600 font-semibold mt-1">Sovg'a yutib oling</div>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
              <button
                onClick={() => setShowWifiModal(true)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Wifi className="w-4 h-4 text-amber-500" />
                  <span>Kafening Bepul Wi-Fi Tarmog'i</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleCallWaiterAction('call_waiter')}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-orange-500" />
                  <span>Stolga Ofitsiant Chaqirish (Stol #{currentTable})</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="p-4 flex items-center justify-between text-xs font-bold text-slate-800">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>Kafening Ma'muriyati</span>
                </div>
                <span className="font-mono text-slate-500 text-xs">{activeCafe.phone || '+998 71 200 00 20'}</span>
              </div>
            </div>

            {/* Cafe Info Footer */}
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-1">
              <div className="font-bold text-slate-800">{activeCafe.name}</div>
              <div>{activeCafe.address || 'Toshkent shahri, Amir Temur ko\'chasi'}</div>
              <div className="text-[10px] text-slate-400 pt-1">SmartMenu SaaS Mobile Edition 2026</div>
            </div>
          </div>
        )}

        {/* ===================== FLOATING CART TRIGGER BAR ===================== */}
        <AnimatePresence>
          {cartItemsCount > 0 && currentTab === 'menu' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-24 inset-x-4 z-30 max-w-md mx-auto pointer-events-auto"
            >
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full bg-slate-950 text-white p-3.5 rounded-3xl shadow-2xl flex items-center justify-between border border-white/20 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                    {cartItemsCount}
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] text-slate-400 font-medium">Savat: {cartItemsCount} ta taom · Stol #{currentTable}</div>
                    <div className="text-sm font-black font-mono tabular-nums text-white">
                      {formatPrice(cartGrossAmount)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <span>Savatni ko'rish</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================== iPHONE FROSTED GLASS FLOATING BOTTOM TAB BAR ===================== */}
        <div className="fixed bottom-2 inset-x-3 sm:inset-x-auto sm:w-full sm:max-w-md z-40 pointer-events-auto">
          <nav className="bg-slate-950/85 backdrop-blur-2xl border border-white/15 rounded-full p-1.5 shadow-2xl flex items-center justify-around text-white">
            {/* Tab 1: Taomlar */}
            <button
              onClick={() => setCurrentTab('menu')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center transition-all ${
                currentTab === 'menu' 
                  ? 'bg-white/15 text-white font-black shadow-sm' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-bold">Taomlar</span>
            </button>

            {/* Tab 2: Bonuslar & Baraban */}
            <button
              onClick={() => setCurrentTab('bonuses')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center relative transition-all ${
                currentTab === 'bonuses' 
                  ? 'bg-white/15 text-amber-300 font-black shadow-sm' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] tracking-tight mt-0.5 font-bold">Bonuslar</span>
              {profile.freeSpins > 0 && (
                <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              )}
            </button>

            {/* Tab 3: Buyurtmalar Tarixi */}
            <button
              onClick={() => setCurrentTab('orders')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center transition-all ${
                currentTab === 'orders' 
                  ? 'bg-white/15 text-white font-black shadow-sm' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-bold">Zakazlar</span>
            </button>

            {/* Tab 4: Profil */}
            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center transition-all ${
                currentTab === 'profile' 
                  ? 'bg-white/15 text-white font-black shadow-sm' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-bold">Profil</span>
            </button>
          </nav>
        </div>

      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. FOOD DETAIL MODAL / BOTTOM SHEET */}
      <AnimatePresence>
        {activeDetailItem && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDetailItem(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative bg-white rounded-t-[40px] sm:rounded-3xl max-w-md w-full max-h-[92dvh] flex flex-col shadow-2xl overflow-hidden z-10"
            >
              {/* Header Image */}
              <div className="relative h-64 w-full bg-slate-900 shrink-0">
                <img onError={onImgError} decoding="async"
                  src={activeDetailItem.media[0]?.url}
                  alt={activeDetailItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <button
                  onClick={() => setActiveDetailItem(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    {activeDetailItem.isChefSpecial && (
                      <span className="inline-block bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider mb-1.5 shadow-sm">
                        ⭐ Oshpaz Maxsus Tavsiyasi
                      </span>
                    )}
                    <h2 className="text-xl font-black text-white tracking-tight drop-shadow-sm">
                      {activeDetailItem.name}
                    </h2>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-amber-400 font-mono tabular-nums drop-shadow-sm">
                      {formatPrice(activeDetailItem.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-5 flex-grow overflow-y-auto space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-500 border-b border-slate-100 pb-3">
                  {activeDetailItem.weight && (
                    <span className="font-semibold text-slate-700">Og'irligi: {activeDetailItem.weight}</span>
                  )}
                  {activeDetailItem.weight && activeDetailItem.calories && <span>·</span>}
                  {activeDetailItem.calories && (
                    <span className="flex items-center gap-1 text-slate-700">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>{activeDetailItem.calories} kkal</span>
                    </span>
                  )}
                  {activeDetailItem.preparationTime && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{activeDetailItem.preparationTime}</span>
                      </span>
                    </>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Taom haqida</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeDetailItem.description}
                  </p>
                </div>

                {activeDetailItem.ingredients && activeDetailItem.ingredients.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tarkibi va masalliqlar</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDetailItem.ingredients.map((ing, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>Maxsus istak yoki izoh (ixtiyoriy)</span>
                  </h4>
                  <input
                    type="text"
                    value={detailNotes}
                    onChange={e => setDetailNotes(e.target.value)}
                    placeholder="Masalan: piyozsiz, achchiqroq bo'lsin..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Bottom Sticky Action Footer */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/70 flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-xs">
                  <button
                    onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-base transition-colors active:scale-95"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-black font-mono text-sm">{detailQuantity}</span>
                  <button
                    onClick={() => setDetailQuantity(detailQuantity + 1)}
                    className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base transition-colors active:scale-95"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={saveDetailToCart}
                  className="flex-grow py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-lg shadow-orange-600/20 transition-all active:scale-95 flex items-center justify-between"
                >
                  <span>Savatga qo'shish</span>
                  <span className="font-mono tabular-nums">
                    {formatPrice(activeDetailItem.price * detailQuantity)}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. CART REVIEW & CASHBACK CHECKOUT DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative bg-white rounded-t-[40px] sm:rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[88dvh] flex flex-col z-10"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">Sizning Buyurtmangiz</h3>
                  <p className="text-xs text-slate-500">Stol raqami: <strong>№ {currentTable}</strong></p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items in Cart */}
              <div className="flex-grow overflow-y-auto py-3 space-y-3">
                {Object.entries(cart).map(([itemId, entry]) => {
                  const item = items.find(it => it.id === itemId);
                  if (!item) return null;
                  return (
                    <div key={itemId} className="flex items-center justify-between text-xs py-2 border-b border-slate-50">
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-slate-400 font-mono tabular-nums">{formatPrice(item.price)}</div>
                        {entry.notes && (
                          <div className="text-[11px] text-amber-600 italic mt-0.5">"{entry.notes}"</div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(itemId)}
                          className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-mono font-bold">{entry.quantity}</span>
                        <button
                          onClick={(e) => quickAddToCart(e, itemId)}
                          className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cashback toggle & Spin alert */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                {/* 200k Wheel trigger teaser */}
                {qualifiesForSpin ? (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Sparkles className="w-4 h-4 text-orange-600 shrink-0 animate-bounce" />
                    <span>🎉 200 000 so'mdan oshdi! 1 ta bepul Omad Barabanida aylantirish beriladi!</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl flex items-center justify-between">
                    <span>Omad Barabaniga yana:</span>
                    <strong className="text-orange-600 font-mono tabular-nums">
                      {formatPrice(200000 - cartGrossAmount)}
                    </strong>
                  </div>
                )}

                {/* Cashback balance usage checkbox */}
                {profile.cashbackBalance > 0 && (
                  <label className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={useCashbackInOrder}
                        onChange={(e) => setUseCashbackInOrder(e.target.checked)}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900">Keshbekdan to'lash</span>
                        <div className="text-[10px] text-slate-500">Mavjud: {formatPrice(profile.cashbackBalance)}</div>
                      </div>
                    </div>
                    {useCashbackInOrder && (
                      <span className="text-xs font-mono font-bold text-emerald-600">
                        -{formatPrice(applicableCashback)}
                      </span>
                    )}
                  </label>
                )}

                {/* Final Total */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs font-bold text-slate-500 block">Jami to'lov:</span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      +{formatPrice(potentialCashbackEarn)} keshbek qaytadi
                    </span>
                  </div>
                  <span className="text-lg font-black text-slate-900 font-mono tabular-nums">
                    {formatPrice(cartFinalAmount)}
                  </span>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 active:scale-95"
                >
                  Buyurtmani Tasdiqlash (Stol #{currentTable})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CONFIRMATION MODAL FOR CALLING WAITER OR BILL */}
      <AnimatePresence>
        {confirmCallType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmCallType(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl max-w-xs w-full p-6 text-center shadow-2xl z-10"
            >
              <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                confirmCallType === 'call_waiter' ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {confirmCallType === 'call_waiter' ? <Bell className="w-7 h-7" /> : <Receipt className="w-7 h-7" />}
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1">
                {confirmCallType === 'call_waiter' ? 'Ofitsiantni chaqirish' : 'Hisob-kitob (Chek) so\'rash'}
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                <strong>Stol № {currentTable}</strong> uchun xabar yuborilsinmi?
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmCallType(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => handleCallWaiterAction(confirmCallType)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-md"
                >
                  Ha, yuborish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. TABLE SELECTOR SHEET */}
      <AnimatePresence>
        {isChangingTable && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChangingTable(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative bg-white rounded-t-[40px] sm:rounded-3xl max-w-sm w-full p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Stol Raqamini Tanlang</h3>
                  <p className="text-xs text-slate-500">Siz o'tirgan stol raqami</p>
                </div>
                <button onClick={() => setIsChangingTable(false)} className="p-1.5 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1">
                {tableList.map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setCurrentTable(t);
                      setSearchParams({ table: t });
                      setIsChangingTable(false);
                    }}
                    className={`py-3 rounded-2xl text-xs font-black transition-all ${
                      currentTable === t
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    #{t}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setCurrentTable('VIP 1');
                    setSearchParams({ table: 'VIP 1' });
                    setIsChangingTable(false);
                  }}
                  className={`col-span-2 py-3 rounded-2xl text-xs font-black transition-all ${
                    currentTable === 'VIP 1' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  VIP 1 xona
                </button>
                <button
                  onClick={() => {
                    setCurrentTable('VIP 2');
                    setSearchParams({ table: 'VIP 2' });
                    setIsChangingTable(false);
                  }}
                  className={`col-span-2 py-3 rounded-2xl text-xs font-black transition-all ${
                    currentTable === 'VIP 2' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  VIP 2 xona
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. WI-FI MODAL
          Ataylab Framer Motion/AnimatePresence ishlatilmayapti:
          modal faqat bir marta mount bo'ladi va ikki marta animatsiya qilmaydi. */}
      {showWifiModal &&
        activeCafe &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wifi-modal-title"
          >
            <button
              type="button"
              aria-label="Modalni yopish"
              onClick={() => setShowWifiModal(false)}
              className="absolute inset-0 bg-black/70"
            />

            <div className="relative z-10 w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl">
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setShowWifiModal(false)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Wifi className="h-6 w-6" />
              </div>

              <h3 id="wifi-modal-title" className="mb-1 text-base font-black text-slate-900">
                {activeCafe.name} Wi-Fi
              </h3>
              <p className="mb-4 text-xs text-slate-500">
                Restoran mijozlari uchun bepul Wi-Fi
              </p>

              <div className="mb-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-left text-xs">
                <div>
                  <span className="mb-1 block text-[10px] uppercase text-slate-400">
                    Tarmoq nomi (SSID)
                  </span>
                  <strong className="break-all font-sans text-sm text-slate-900">
                    {activeCafe.wifiName || 'Wi-Fi nomi kiritilmagan'}
                  </strong>
                </div>

                <div>
                  <span className="mb-1 block text-[10px] uppercase text-slate-400">
                    Parol
                  </span>
                  <strong className="break-all text-sm text-orange-600">
                    {activeCafe.wifiPassword || 'Parolsiz'}
                  </strong>
                </div>
              </div>

              {activeCafe.wifiPassword ? (
                <button
                  type="button"
                  onClick={copyWifiPassword}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-700"
                >
                  {isCopiedWifi ? (
                    <CheckCheck className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span>{isCopiedWifi ? 'Nusxalandi!' : 'Parolni nusxalash'}</span>
                </button>
              ) : (
                <p className="text-xs text-slate-500">Ushbu tarmoq parol talab qilmaydi.</p>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

// Fallback dummy item for typing safety
const initialFallbackItem: MenuItem = {
  id: 'fallback-1',
  categoryId: 'cat-1',
  name: 'Palov',
  description: 'To\'y oshi',
  price: 42000,
  media: [],
  isActive: true
};

export default PublicMenu;
