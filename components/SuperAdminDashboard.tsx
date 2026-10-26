import React, { useState } from 'react';
import { IMG, onImgError } from '../assets';
import { Cafe, Waiter, UserRole } from '../types';
import { 
  Store, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  Users, 
  Coffee, 
  Key, 
  Phone, 
  Trash2, 
  Check, 
  LogOut,
  QrCode
} from 'lucide-react';

interface SuperAdminProps {
  cafes: Cafe[];
  waiters: Waiter[];
  onAddCafe: (cafe: Cafe) => void;
  onAddWaiter: (waiter: Waiter) => void;
  onDeleteWaiter: (waiterId: string) => void;
  onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminProps> = ({ 
  cafes, 
  waiters, 
  onAddCafe, 
  onAddWaiter, 
  onDeleteWaiter,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'cafes' | 'waiters' | 'add-cafe' | 'add-waiter'>('cafes');
  
  // Cafe Form
  const [cafeForm, setCafeForm] = useState({ 
    name: '', 
    slug: '', 
    logoUrl: '',
    login: '', 
    password: '',
    phone: '',
    address: '',
    tablesCount: 15,
    wifiName: '',
    wifiPassword: ''
  });

  // Waiter Form
  const [waiterForm, setWaiterForm] = useState({
    cafeId: cafes[0]?.id || '',
    name: '',
    login: '',
    password: '',
    phone: '',
    assignedTables: '1, 2, 3, 4, 5'
  });

  const handleCafeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCafeId = 'cafe-' + Math.random().toString(36).substr(2, 7);
    onAddCafe({
      id: newCafeId,
      name: cafeForm.name,
      slug: cafeForm.slug.toLowerCase().replace(/\s+/g, '-'),
      logoUrl: cafeForm.logoUrl || IMG.logo,
      adminId: 'admin-' + Math.random().toString(36).substr(2, 5),
      adminLogin: cafeForm.login,
      adminPassword: cafeForm.password,
      themeColor: '#ea580c',
      phone: cafeForm.phone || '+998 71 200 00 00',
      address: cafeForm.address || 'Toshkent shahri',
      tablesCount: Number(cafeForm.tablesCount) || 12,
      wifiName: cafeForm.wifiName,
      wifiPassword: cafeForm.wifiPassword
    });

    setCafeForm({ 
      name: '', 
      slug: '', 
      logoUrl: '', 
      login: '', 
      password: '',
      phone: '',
      address: '',
      tablesCount: 15,
      wifiName: '',
      wifiPassword: ''
    });
    setActiveTab('cafes');
  };

  const handleWaiterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waiterForm.cafeId) return;

    const tables = waiterForm.assignedTables
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onAddWaiter({
      id: 'waiter-' + Math.random().toString(36).substr(2, 7),
      cafeId: waiterForm.cafeId,
      name: waiterForm.name,
      login: waiterForm.login,
      password: waiterForm.password,
      phone: waiterForm.phone,
      assignedTables: tables.length > 0 ? tables : ['1', '2', '3'],
      isActive: true
    });

    setWaiterForm({
      cafeId: cafes[0]?.id || '',
      name: '',
      login: '',
      password: '',
      phone: '',
      assignedTables: '1, 2, 3, 4, 5'
    });
    setActiveTab('waiters');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-32">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Super Admin Platformasi</h1>
              <p className="text-xs text-slate-500">Barcha restoranlar, adminlar va ofitsiantlarni markaziy boshqarish</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs font-mono px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-slate-500">Kafelar: <strong className="text-slate-900">{cafes.length}</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Ofitsiantlar: <strong className="text-slate-900">{waiters.length}</strong></span>
          </div>

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
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('cafes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cafes' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Kafelar va Adminlar ({cafes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('waiters')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'waiters' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ofitsiantlar Ro'yxati ({waiters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add-cafe')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'add-cafe' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Kafe Qo'shish</span>
        </button>

        <button
          onClick={() => setActiveTab('add-waiter')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'add-waiter' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Ofitsiant Qo'shish</span>
        </button>
      </div>

      {/* TAB: CAFES */}
      {activeTab === 'cafes' && (
        <div className="grid gap-4 md:grid-cols-2">
          {cafes.map(cafe => {
            const cafeWaiters = waiters.filter(w => w.cafeId === cafe.id);
            return (
              <div key={cafe.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img onError={onImgError} decoding="async" 
                      src={cafe.logoUrl} 
                      alt="" 
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs" 
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{cafe.name}</h4>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">/{cafe.slug}</p>
                      <p className="text-xs text-slate-500 mt-1">{cafe.address}</p>
                    </div>
                  </div>

                  <a 
                    href={`#/menu/${cafe.slug}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl transition-colors"
                    title="Ochiq menyuni ko'rish"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Credentials & stats */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Admin Login:</span>
                    <strong className="text-slate-900">{cafe.adminLogin}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Admin Parol:</span>
                    <strong className="text-slate-900">{cafe.adminPassword}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                    <span>Ofitsiantlar soni:</span>
                    <strong className="text-purple-600">{cafeWaiters.length} nafar</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">Stollar soni: {cafe.tablesCount || 15} ta</span>
                  <a
                    href={`#/menu/${cafe.slug}?table=1`}
                    className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Stol #1 QR ko'rinishi</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB: WAITERS LIST */}
      {activeTab === 'waiters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Barcha kafelar ofitsiantlari</h3>
            <button
              onClick={() => setActiveTab('add-waiter')}
              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors"
            >
              + Yangi ofitsiant qo'shish
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Ofitsiant Ismi</th>
                    <th className="px-5 py-3.5">Restoran / Kafe</th>
                    <th className="px-5 py-3.5">Biriktirilgan Stollar</th>
                    <th className="px-5 py-3.5">Login / Parol</th>
                    <th className="px-5 py-3.5">Telefon</th>
                    <th className="px-5 py-3.5 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {waiters.map(waiter => {
                    const cafe = cafes.find(c => c.id === waiter.cafeId);
                    return (
                      <tr key={waiter.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                            {waiter.name.charAt(0)}
                          </span>
                          <span>{waiter.name}</span>
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-700">
                          {cafe?.name || 'Noma\'lum'}
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-600">
                          {waiter.assignedTables.join(', ')}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs">
                          <span className="text-slate-900 font-bold">{waiter.login}</span> / <span className="text-slate-500">{waiter.password}</span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 font-mono">
                          {waiter.phone || '-'}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => onDeleteWaiter(waiter.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ADD CAFE */}
      {activeTab === 'add-cafe' && (
        <div className="max-w-2xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mx-auto">
          <h3 className="text-lg font-black text-slate-900 mb-1">Yangi Kafe & Admin Qo'shish</h3>
          <p className="text-xs text-slate-500 mb-6">Restoran uchun yangi hisob va admin boshqaruv panelini yaratish</p>

          <form onSubmit={handleCafeSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kafe nomi</label>
                <input 
                  required
                  type="text" 
                  value={cafeForm.name}
                  onChange={e => setCafeForm({ ...cafeForm, name: e.target.value })}
                  placeholder="e.g. Navro'z Choyxonasi" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-orange-500/20 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">URL Slug (Manzil)</label>
                <input 
                  required
                  type="text" 
                  value={cafeForm.slug}
                  onChange={e => setCafeForm({ ...cafeForm, slug: e.target.value })}
                  placeholder="e.g. navroz-choyxona" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-orange-500/20 outline-none" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Admin Login</label>
                <input 
                  required
                  type="text" 
                  value={cafeForm.login}
                  onChange={e => setCafeForm({ ...cafeForm, login: e.target.value })}
                  placeholder="Admin uchun login" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-orange-500/20 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Admin Parol</label>
                <input 
                  required
                  type="text" 
                  value={cafeForm.password}
                  onChange={e => setCafeForm({ ...cafeForm, password: e.target.value })}
                  placeholder="Admin paroli" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-orange-500/20 outline-none" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Telefon raqam</label>
                <input 
                  type="text" 
                  value={cafeForm.phone}
                  onChange={e => setCafeForm({ ...cafeForm, phone: e.target.value })}
                  placeholder="+998 71 200 00 00" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-orange-500/20 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Stollar soni</label>
                <input 
                  type="number" 
                  value={cafeForm.tablesCount}
                  onChange={e => setCafeForm({ ...cafeForm, tablesCount: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-orange-500/20 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Manzil</label>
              <input 
                type="text" 
                value={cafeForm.address}
                onChange={e => setCafeForm({ ...cafeForm, address: e.target.value })}
                placeholder="Toshkent shahri, Amir Temur shoh ko'chasi" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-orange-500/20 outline-none" 
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md text-xs mt-4"
            >
              Kafeni Saqlash va Adminni Faollashtirish
            </button>
          </form>
        </div>
      )}

      {/* TAB: ADD WAITER */}
      {activeTab === 'add-waiter' && (
        <div className="max-w-xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mx-auto">
          <h3 className="text-lg font-black text-slate-900 mb-1">Kafega Yangi Ofitsiant Qo'shish</h3>
          <p className="text-xs text-slate-500 mb-6">Ofitsiant uchun login va parol berib, ma'lum bir stollarni biriktirish</p>

          <form onSubmit={handleWaiterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kafeni tanlang</label>
              <select
                value={waiterForm.cafeId}
                onChange={e => setWaiterForm({ ...waiterForm, cafeId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none"
              >
                {cafes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Ofitsiant Ism-familiyasi</label>
              <input 
                required
                type="text" 
                value={waiterForm.name}
                onChange={e => setWaiterForm({ ...waiterForm, name: e.target.value })}
                placeholder="e.g. Alisher Usmonov" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500/20 outline-none" 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Ofitsiant Login</label>
                <input 
                  required
                  type="text" 
                  value={waiterForm.login}
                  onChange={e => setWaiterForm({ ...waiterForm, login: e.target.value })}
                  placeholder="e.g. alisher_waiter" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500/20 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Ofitsiant Parol</label>
                <input 
                  required
                  type="text" 
                  value={waiterForm.password}
                  onChange={e => setWaiterForm({ ...waiterForm, password: e.target.value })}
                  placeholder="e.g. 1234" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500/20 outline-none" 
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500/20 outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Telefon raqam</label>
              <input 
                type="text" 
                value={waiterForm.phone}
                onChange={e => setWaiterForm({ ...waiterForm, phone: e.target.value })}
                placeholder="+998 90 000 00 00" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500/20 outline-none" 
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-purple-700 text-white font-bold py-3.5 rounded-xl hover:bg-purple-800 transition-colors shadow-md text-xs mt-4"
            >
              Ofitsiantni Saqlash
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
