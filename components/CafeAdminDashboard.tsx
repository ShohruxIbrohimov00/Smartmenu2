import React, { useState } from 'react';
import { IMG, onImgError } from '../assets';
import { Cafe, Category, MenuItem, Waiter, TableCall, Order, Media } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Image as ImageIcon, 
  QrCode, 
  X, 
  Save, 
  Sparkles, 
  Loader2, 
  Users, 
  UtensilsCrossed, 
  FolderTree, 
  Bell, 
  LogOut,
  Check,
  Printer,
  Key,
  Phone
} from 'lucide-react';
import QRGenerator from './QRGenerator';
import { GoogleGenAI } from "@google/genai";

interface CafeAdminProps {
  cafe: Cafe;
  categories: Category[];
  items: MenuItem[];
  waiters: Waiter[];
  tableCalls: TableCall[];
  orders: Order[];
  onUpdateItems: (items: MenuItem[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onAddWaiter: (waiter: Waiter) => void;
  onDeleteWaiter: (waiterId: string) => void;
  onResolveCall: (callId: string) => void;
  onLogout: () => void;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ') + " so'm";
};

const CafeAdminDashboard: React.FC<CafeAdminProps> = ({ 
  cafe, 
  categories, 
  items, 
  waiters,
  tableCalls,
  orders,
  onUpdateItems, 
  onUpdateCategories,
  onAddWaiter,
  onDeleteWaiter,
  onResolveCall,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'categories' | 'waiters' | 'calls' | 'qr'>('items');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Waiter add modal / state
  const [showAddWaiterModal, setShowAddWaiterModal] = useState(false);
  const [waiterForm, setWaiterForm] = useState({
    name: '',
    login: '',
    password: '',
    phone: '',
    assignedTables: '1, 2, 3, 4, 5'
  });

  // AI Description Generator state
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const cafeCategories = categories.filter(c => c.cafeId === cafe.id);
  const cafeWaiters = waiters.filter(w => w.cafeId === cafe.id);
  const cafeCalls = tableCalls.filter(c => c.cafeId === cafe.id && c.status === 'pending');

  const deleteItem = (id: string) => {
    if (window.confirm('Haqiqatdan ham ushbu taomni o\'chirmoqchimisiz?')) {
      onUpdateItems(items.filter(it => it.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    onUpdateItems(items.map(it => it.id === id ? { ...it, isActive: !it.isActive } : it));
  };

  const saveItem = (item: MenuItem) => {
    if (items.some(it => it.id === item.id)) {
      onUpdateItems(items.map(it => it.id === item.id ? item : it));
    } else {
      onUpdateItems([...items, item]);
    }
    setEditingItem(null);
    setIsAddingItem(false);
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: 'cat-' + Math.random().toString(36).substr(2, 7),
      cafeId: cafe.id,
      name: newCatName,
      orderIndex: cafeCategories.length + 1
    };
    onUpdateCategories([...categories, newCat]);
    setNewCatName('');
  };

  const deleteCategory = (id: string) => {
    if (window.confirm('Kategoriyani o\'chirmoqchimisiz?')) {
      onUpdateCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleCreateWaiter = (e: React.FormEvent) => {
    e.preventDefault();
    const tables = waiterForm.assignedTables
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onAddWaiter({
      id: 'waiter-' + Math.random().toString(36).substr(2, 7),
      cafeId: cafe.id,
      name: waiterForm.name,
      login: waiterForm.login,
      password: waiterForm.password,
      phone: waiterForm.phone,
      assignedTables: tables.length > 0 ? tables : ['1', '2', '3'],
      isActive: true
    });

    setWaiterForm({
      name: '',
      login: '',
      password: '',
      phone: '',
      assignedTables: '1, 2, 3, 4, 5'
    });
    setShowAddWaiterModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 pb-32">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img onError={onImgError} decoding="async"
            src={cafe.logoUrl}
            alt={cafe.name}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
          />
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{cafe.name}</h1>
            <p className="text-xs text-slate-500">
              Kafe Admin Boshqaruvi · Stollar: {cafe.tablesCount || 15} ta · Wi-Fi: {cafe.wifiName || 'Mavjud'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {cafeCalls.length > 0 && (
            <button
              onClick={() => setActiveTab('calls')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse"
            >
              <Bell className="w-4 h-4" />
              <span>{cafeCalls.length} ta chaqiruv</span>
            </button>
          )}

          <a
            href={`#/menu/${cafe.slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Mijoz menyusini ochish ↗
          </a>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'items' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Taomlar Menyusi ({items.filter(it => cafeCategories.some(c => c.id === it.categoryId)).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'categories' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Kategoriyalar ({cafeCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('waiters')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'waiters' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ofitsiantlar ({cafeWaiters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calls')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'calls' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Chaqiruvlar & Buyurtmalar ({cafeCalls.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('qr')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'qr' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Kod & Stol Stendlari</span>
        </button>
      </div>

      {/* TAB 1: ITEMS */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Taomlar ro'yxati</h3>
            <button
              onClick={() => {
                setEditingItem({
                  id: 'item-' + Math.random().toString(36).substr(2, 7),
                  categoryId: cafeCategories[0]?.id || '',
                  name: '',
                  description: '',
                  price: 0,
                  media: [{ url: IMG.palov, type: 'image', orderIndex: 1 }],
                  isActive: true,
                  preparationTime: '15-20 daqiqa'
                });
                setIsAddingItem(true);
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi taom qo'shish</span>
            </button>
          </div>

          <div className="grid gap-3">
            {items
              .filter(it => cafeCategories.some(c => c.id === it.categoryId))
              .map(item => {
                const cat = cafeCategories.find(c => c.id === item.categoryId);
                return (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img onError={onImgError} decoding="async"
                        src={item.media[0]?.url}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                          <span className="text-[11px] text-slate-400">· {cat?.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                        <div className="text-xs font-mono font-bold text-orange-600 mt-1 tabular-nums">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => toggleActive(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          item.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.isActive ? 'Mavjud' : 'Stop-listda'}
                      </button>

                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsAddingItem(false);
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6 max-w-xl">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Yangi kategoriya qo'shish</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="e.g. Desertlar, Salatlar..."
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <button
                onClick={addCategory}
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shrink-0"
              >
                Qo'shish
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mavjud kategoriyalar</h4>
            {cafeCategories.map(cat => (
              <div
                key={cat.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between"
              >
                <span className="text-xs font-bold text-slate-900">{cat.name}</span>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WAITERS */}
      {activeTab === 'waiters' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Kafening Ofitsiantlari</h3>
              <p className="text-xs text-slate-500">
                Har bir ofitsiant o'z login va paroli bilan tizimga kirib, o'z stollariga xizmat ko'rsatadi
              </p>
            </div>

            <button
              onClick={() => setShowAddWaiterModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Ofitsiant qo'shish</span>
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {cafeWaiters.map(waiter => (
              <div
                key={waiter.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                      {waiter.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{waiter.name}</h4>
                      <p className="text-xs text-slate-500">{waiter.phone || 'Telefon kiritilmagan'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteWaiter(waiter.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Login:</span>
                    <strong className="text-slate-900">{waiter.login}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Parol:</span>
                    <strong className="text-slate-900">{waiter.password}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                    <span>Stollar:</span>
                    <strong className="text-purple-700">{waiter.assignedTables.join(', ')}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CALLS & ORDERS */}
      {activeTab === 'calls' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Jonli Chaqiruvlar va Buyurtmalar</h3>
            <p className="text-xs text-slate-500">Mijozlar stoldan ofitsiant chaqirganda yoki chek so'raganda</p>
          </div>

          <div className="grid gap-3">
            {cafeCalls.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
                Hozircha yangi chaqiruvlar yo'q.
              </div>
            ) : (
              cafeCalls.map(call => (
                <div
                  key={call.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                      STOL #{call.tableNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {call.type === 'request_bill' ? '💰 Chek (Hisob) so\'ralmoqda' : '🙋‍♂️ Ofitsiant chaqirilmoqda'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">· {call.createdAt}</span>
                  </div>

                  <button
                    onClick={() => onResolveCall(call.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
                  >
                    Qabul qilindi
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: QR GENERATOR & TABLE TENTS */}
      {activeTab === 'qr' && (
        <QRGenerator cafe={cafe} />
      )}

      {/* MODAL: ADD/EDIT ITEM */}
      {(editingItem || isAddingItem) && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90dvh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isAddingItem ? 'Yangi Taom Qo\'shish' : 'Taomni Tahrirlash'}
              </h3>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsAddingItem(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kategoriya</label>
                <select
                  value={editingItem.categoryId}
                  onChange={e => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none"
                >
                  {cafeCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Taom Nomi</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Manti, Choyxona Palov"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Narxi (so'm)</label>
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={e => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Rasm URL manzili</label>
                <input
                  type="text"
                  value={editingItem.media[0]?.url || ''}
                  onChange={e => setEditingItem({
                    ...editingItem,
                    media: [{ url: e.target.value, type: 'image', orderIndex: 1 }]
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tavsif (Ingredientlar)</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Taom tarkibi va xususiyatlari..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddingItem(false);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={() => saveItem(editingItem)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-md"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD WAITER */}
      {showAddWaiterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Yangi Ofitsiant Qo'shish</h3>
              <button onClick={() => setShowAddWaiterModal(false)} className="p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWaiter} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Ism-familiya</label>
                <input
                  required
                  type="text"
                  value={waiterForm.name}
                  onChange={e => setWaiterForm({ ...waiterForm, name: e.target.value })}
                  placeholder="e.g. Sardor Qodirov"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Login</label>
                  <input
                    required
                    type="text"
                    value={waiterForm.login}
                    onChange={e => setWaiterForm({ ...waiterForm, login: e.target.value })}
                    placeholder="sardor_w"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Parol</label>
                  <input
                    required
                    type="text"
                    value={waiterForm.password}
                    onChange={e => setWaiterForm({ ...waiterForm, password: e.target.value })}
                    placeholder="1234"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Biriktirilgan stollar (vergul bilan)</label>
                <input
                  type="text"
                  value={waiterForm.assignedTables}
                  onChange={e => setWaiterForm({ ...waiterForm, assignedTables: e.target.value })}
                  placeholder="1, 2, 3, 4, 5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Telefon</label>
                <input
                  type="text"
                  value={waiterForm.phone}
                  onChange={e => setWaiterForm({ ...waiterForm, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddWaiterModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeAdminDashboard;
