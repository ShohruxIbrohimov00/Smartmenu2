import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, Cafe, Waiter } from '../types';
import { Lock, User, ShieldCheck, Coffee, Users, Utensils, QrCode } from 'lucide-react';

interface LoginProps {
  cafes: Cafe[];
  waiters: Waiter[];
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ cafes, waiters, onLogin }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Check Super Admin
    if (login === 'Superadminshohrux' && password === 'Salom1234') {
      const user = { role: UserRole.SUPER_ADMIN };
      onLogin(user);
      navigate('/super-admin');
      return;
    }

    // 2. Check Cafe Admins
    const cafe = cafes.find(c => c.adminLogin === login && c.adminPassword === password);
    if (cafe) {
      const user = { role: UserRole.CAFE_ADMIN, cafeId: cafe.id };
      onLogin(user);
      navigate('/admin');
      return;
    }

    // 3. Check Waiters
    const waiter = waiters.find(w => w.login === login && w.password === password && w.isActive);
    if (waiter) {
      const user = { role: UserRole.WAITER, waiterId: waiter.id, cafeId: waiter.cafeId };
      onLogin(user);
      navigate('/waiter');
      return;
    }

    setError('Login yoki parol noto\'g\'ri!');
  };

  const handleQuickLogin = (role: 'super' | 'admin' | 'waiter') => {
    if (role === 'super') {
      setLogin('Superadminshohrux');
      setPassword('Salom1234');
    } else if (role === 'admin') {
      setLogin('admin');
      setPassword('123');
    } else {
      setLogin('waiter1');
      setPassword('1234');
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-zinc-900 to-black">
      <div className="w-full max-w-md bg-white rounded-[36px] shadow-2xl p-8 border border-white/20">
        <div className="flex justify-center mb-5">
          <div className="bg-slate-900 p-4 rounded-3xl text-orange-400 shadow-md">
            <Utensils className="w-9 h-9" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-center text-slate-900 mb-1 tracking-tight">SmartMenu Platformasi</h2>
        <p className="text-center text-slate-500 mb-6 text-xs font-medium">Restoran, Kafe, Admin va Ofitsiantlar tizimi</p>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-2xl text-xs mb-5 text-center font-bold border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Login</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={login}
                onChange={e => setLogin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="Login kiriting"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Parol</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="Parol kiriting"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold text-xs mt-3 hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
          >
            Tizimga Kirish
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div className="mt-7 pt-5 border-t border-slate-100 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
            Tezkor Namoyish (Bir marta bosish bilan kirish)
          </p>

          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="w-full text-left p-2.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 hover:bg-orange-100/70 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-orange-600" />
              <div>
                <div className="text-xs font-bold text-orange-950">☕ Kafe Admin (Osh Markazi)</div>
                <div className="text-[10px] text-orange-800 font-mono">admin / 123</div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-orange-600 bg-white px-2 py-0.5 rounded-lg border border-orange-200 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              Tanlash
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('waiter')}
            className="w-full text-left p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 hover:bg-emerald-100/70 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-emerald-950">🤵 Ofitsiant (Farrux Olimov)</div>
                <div className="text-[10px] text-emerald-800 font-mono">waiter1 / 1234</div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              Tanlash
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('super')}
            className="w-full text-left p-2.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 hover:bg-purple-100/70 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-xs font-bold text-purple-950">👑 Super Admin</div>
                <div className="text-[10px] text-purple-800 font-mono">Superadminshohrux / Salom1234</div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-purple-600 bg-white px-2 py-0.5 rounded-lg border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              Tanlash
            </span>
          </button>

          <div className="pt-3 text-center">
            <button
              type="button"
              onClick={() => navigate('/menu/osh-markazi?table=3')}
              className="text-xs text-slate-500 hover:text-orange-600 font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <QrCode className="w-4 h-4 text-orange-600" />
              <span>🍽️ Mijoz QR menyusini ochish (Stol #3) →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
