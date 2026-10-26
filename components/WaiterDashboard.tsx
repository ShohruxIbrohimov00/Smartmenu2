import React, { useState } from 'react';
import { onImgError } from '../assets';
import { Cafe, Category, MenuItem, Waiter, TableCall, Order } from '../types';
import { 
  Bell, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  ChefHat, 
  Coffee, 
  User, 
  Phone, 
  LogOut, 
  AlertCircle,
  Plus,
  X,
  Search,
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface WaiterDashboardProps {
  waiter: Waiter;
  cafe: Cafe;
  categories: Category[];
  items: MenuItem[];
  tableCalls: TableCall[];
  orders: Order[];
  onResolveCall: (callId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onToggleItemActive: (itemId: string) => void;
  onAddOrder: (order: Order) => void;
  onLogout: () => void;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ') + " so'm";
};

const WaiterDashboard: React.FC<WaiterDashboardProps> = ({
  waiter,
  cafe,
  categories,
  items,
  tableCalls,
  orders,
  onResolveCall,
  onUpdateOrderStatus,
  onToggleItemActive,
  onAddOrder,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'calls' | 'orders' | 'menu' | 'qr'>('calls');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedOrderTable, setSelectedOrderTable] = useState<string>(waiter.assignedTables[0] || '1');
  const [orderCart, setOrderCart] = useState<{ [itemId: string]: number }>({});
  const [qrModalTable, setQrModalTable] = useState<string>(waiter.assignedTables[0] || '1');

  // Filter calls & orders for this cafe
  const cafeCalls = tableCalls.filter(c => c.cafeId === cafe.id && c.status === 'pending');
  const cafeOrders = orders.filter(o => o.cafeId === cafe.id);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderItemsList = Object.entries(orderCart)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => {
        const item = items.find(it => it.id === itemId)!;
        return { item, quantity: qty };
      });

    if (orderItemsList.length === 0) return;

    const totalAmount = orderItemsList.reduce((sum, current) => sum + (current.item.price * current.quantity), 0);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newOrder: Order = {
      id: 'ord-' + Math.random().toString(36).substr(2, 7),
      cafeId: cafe.id,
      tableNumber: selectedOrderTable,
      items: orderItemsList,
      totalAmount,
      status: 'new',
      createdAt: timeStr,
      waiterName: waiter.name
    };

    onAddOrder(newOrder);
    setOrderCart({});
    setShowNewOrderModal(false);
  };

  const origin = window.location.origin + window.location.pathname;
  const qrTableUrl = `${origin}#/menu/${cafe.slug}?table=${qrModalTable}`;

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900 pb-28">
      {/* Waiter Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight">{waiter.name}</h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Navbatchilikda
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {cafe.name} · Stollar: <span className="text-slate-200 font-medium">{waiter.assignedTables.join(', ')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('qr')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="QR ko'rsatish"
            >
              <QrCode className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 transition-colors"
              title="Chiqish"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <button
            onClick={() => setActiveTab('calls')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center gap-1 ${
              activeTab === 'calls' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-1">
              <Bell className="w-4 h-4" />
              {cafeCalls.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cafeCalls.length}
                </span>
              )}
            </div>
            <span>Chaqiruvlar</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'orders' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Buyurtmalar</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'menu' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Stop-List</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'qr' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Stol QR</span>
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-6">
        {/* TAB 1: CALLS */}
        {activeTab === 'calls' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Stollardan Kelgan Chaqiruvlar</h2>
                <p className="text-xs text-slate-500">Mijozlar ofitsiantni yoki hisob-kitobni so'raganda shu yerda ko'rinadi</p>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-200/80 px-2.5 py-1 rounded-lg text-slate-700">
                Faol: {cafeCalls.length}
              </span>
            </div>

            {cafeCalls.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Hozircha yangi chaqiruvlar yo'q</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Mijozlar o'z stolidagi QR menyu orqali "Ofitsiantni chaqirish" yoki "Hisob-kitob so'rash" tugmasini bossa, darhol shu yerda ko'rsatiladi.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {cafeCalls.map(call => {
                  const isBill = call.type === 'request_bill';
                  return (
                    <div
                      key={call.id}
                      className={`p-4 rounded-2xl border transition-all shadow-sm flex items-center justify-between ${
                        isBill 
                          ? 'bg-amber-50/80 border-amber-200/80' 
                          : 'bg-rose-50/80 border-rose-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${isBill ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white animate-bounce'}`}>
                          {isBill ? <Receipt className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs">
                              STOL № {call.tableNumber}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">Vaqt: {call.createdAt}</span>
                          </div>
                          <p className={`text-xs font-bold mt-1 ${isBill ? 'text-amber-900' : 'text-rose-900'}`}>
                            {isBill ? '💰 Hisob-kitob (Chek) olib kelish so\'ralmoqda' : '🙋‍♂️ Ofitsiant stolga chaqirilmoqda'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onResolveCall(call.id)}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95 shrink-0"
                      >
                        <Check className="w-4 h-4" />
                        <span>Borildi</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Buyurtmalar Nazorati</h2>
                <p className="text-xs text-slate-500">Stollar bo'yicha qabul qilingan va tayyorlanayotgan taomlar</p>
              </div>
              <button
                onClick={() => setShowNewOrderModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-orange-400" />
                <span>Yangi buyurtma olish</span>
              </button>
            </div>

            {cafeOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center shadow-sm">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-700">Hozircha buyurtmalar yo'q</h3>
                <p className="text-xs text-slate-500 mt-1">Yangi buyurtma qo'shish yoki mijozlar QR menyusidan buyurtma berishini kuting.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {cafeOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                          STOL № {order.tableNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Buyurtma #{order.id.slice(-4)}</span>
                        <span className="text-xs text-slate-400 font-mono">· {order.createdAt}</span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-1.5">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer ${
                            order.status === 'new'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : order.status === 'preparing'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : order.status === 'served'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <option value="new">Yangi</option>
                          <option value="preparing">Tayyorlanmoqda</option>
                          <option value="served">Yetkazildi (Stolda)</option>
                          <option value="paid">To'landi (Yopildi)</option>
                          <option value="cancelled">Bekor qilindi</option>
                        </select>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="space-y-1.5">
                      {order.items.map((oi, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-slate-700">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                              {oi.quantity}x
                            </span>
                            <span className="font-medium">{oi.item.name}</span>
                          </div>
                          <span className="font-mono text-slate-500 tabular-nums">
                            {formatPrice(oi.item.price * oi.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Jami hisob:</span>
                      <span className="text-sm font-black text-slate-900 font-mono tabular-nums">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STOP-LIST / MENU AVAILABILITY */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Stop-List (Taomlar Mavjudligi)</h2>
              <p className="text-xs text-slate-500">
                Agar oshxonada biror taom tugasa, uni o'chirib qo'ying — mijozlar menyusida avtomatik "Mavjud emas" deb ko'rinadi.
              </p>
            </div>

            <div className="grid gap-2.5">
              {items.map(item => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img onError={onImgError} decoding="async"
                      src={item.media[0]?.url}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <p className="text-xs font-mono text-slate-500 tabular-nums">{formatPrice(item.price)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleItemActive(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      item.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {item.isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Mavjud</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Stop-Listda</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: QUICK QR SHOW */}
        {activeTab === 'qr' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mijozga QR Kod Ko'rsatish</h2>
              <p className="text-xs text-slate-500">Mijoz so'raganda stol raqamini tanlab, telefoningiz ekranidan skaner qildiring</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <label className="text-xs font-bold text-slate-700">Stol raqami:</label>
                <select
                  value={qrModalTable}
                  onChange={(e) => setQrModalTable(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                >
                  {waiter.assignedTables.map(t => (
                    <option key={t} value={t}>{t}-stol</option>
                  ))}
                  <option value="1">1-stol</option>
                  <option value="2">2-stol</option>
                  <option value="3">3-stol</option>
                  <option value="4">4-stol</option>
                  <option value="5">5-stol</option>
                </select>
              </div>

              <div className="inline-block p-4 bg-slate-50 rounded-3xl border border-slate-200 mb-4">
                <QRCodeCanvas
                  value={qrTableUrl}
                  size={220}
                  level="H"
                  className="rounded-2xl"
                />
              </div>

              <div className="text-xs text-slate-500 font-mono">
                {cafe.name} · Stol #{qrModalTable}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: New Order Take (Waiter POS) */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90dvh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Yangi Buyurtma Olish</h3>
                <p className="text-xs text-slate-500">Ofitsiant tomonidan stolga buyurtma yozish</p>
              </div>
              <button onClick={() => setShowNewOrderModal(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="flex flex-col flex-grow overflow-hidden mt-4">
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Stolni tanlang</label>
                <select
                  value={selectedOrderTable}
                  onChange={(e) => setSelectedOrderTable(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none"
                >
                  {waiter.assignedTables.map(t => (
                    <option key={t} value={t}>{t}-stol</option>
                  ))}
                  <option value="1">1-stol</option>
                  <option value="2">2-stol</option>
                  <option value="3">3-stol</option>
                  <option value="4">4-stol</option>
                  <option value="5">5-stol</option>
                </select>
              </div>

              <div className="flex-grow overflow-y-auto space-y-2 pr-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taomlar ro'yxati</p>
                {items.filter(it => it.isActive).map(item => {
                  const qty = orderCart[item.id] || 0;
                  return (
                    <div key={item.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-slate-500 font-mono tabular-nums">{formatPrice(item.price)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderCart(prev => ({ ...prev, [item.id]: Math.max(0, (prev[item.id] || 0) - 1) }))}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold font-mono">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setOrderCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))}
                          className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Buyurtmani yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaiterDashboard;
