import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserRole, Cafe, Category, MenuItem, Waiter, TableCall, Order, AppState } from './types';
import PublicMenu from './components/PublicMenu';
import CafeAdminDashboard from './components/CafeAdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import WaiterDashboard from './components/WaiterDashboard';
import Login from './components/Login';
import { 
  initialCafes, 
  initialCategories, 
  initialItems, 
  initialWaiters, 
  initialTableCalls, 
  initialOrders 
} from './mockData';

const AppContent: React.FC<{ 
  state: AppState, 
  onLogin: (user: any) => void,
  onLogout: () => void,
  updateItems: (items: MenuItem[]) => void,
  updateCategories: (categories: Category[]) => void,
  addCafe: (cafe: Cafe) => void,
  addWaiter: (waiter: Waiter) => void,
  deleteWaiter: (waiterId: string) => void,
  addTableCall: (call: TableCall) => void,
  resolveTableCall: (callId: string) => void,
  addOrder: (order: Order) => void,
  updateOrderStatus: (orderId: string, status: Order['status']) => void,
  toggleItemActive: (itemId: string) => void,
  currentUser: any
}> = ({ 
  state, 
  onLogin, 
  onLogout,
  updateItems, 
  updateCategories, 
  addCafe, 
  addWaiter,
  deleteWaiter,
  addTableCall,
  resolveTableCall,
  addOrder,
  updateOrderStatus,
  toggleItemActive,
  currentUser 
}) => {
  const location = useLocation();
  const isPublicMenu = location.pathname.startsWith('/menu/');

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <Login 
            cafes={state.cafes} 
            waiters={state.waiters} 
            onLogin={onLogin} 
          />
        } 
      />
      
      {/* Public QR Menu for guests on table */}
      <Route 
        path="/menu/:slug" 
        element={
          <PublicMenu 
            cafes={state.cafes} 
            categories={state.categories} 
            items={state.items} 
            onCallWaiter={addTableCall}
            onCreateOrder={addOrder}
          />
        } 
      />
      
      {/* Cafe Admin Dashboard */}
      <Route 
        path="/admin" 
        element={
          currentUser?.role === UserRole.CAFE_ADMIN ? (
            <CafeAdminDashboard 
              cafe={state.cafes.find(c => c.id === currentUser.cafeId) || state.cafes[0]} 
              categories={state.categories} 
              items={state.items} 
              waiters={state.waiters}
              tableCalls={state.tableCalls}
              orders={state.orders}
              onUpdateItems={updateItems}
              onUpdateCategories={updateCategories}
              onAddWaiter={addWaiter}
              onDeleteWaiter={deleteWaiter}
              onResolveCall={resolveTableCall}
              onLogout={onLogout}
            />
          ) : <Navigate to="/login" replace />
        } 
      />

      {/* Waiter Dashboard */}
      <Route 
        path="/waiter" 
        element={
          currentUser?.role === UserRole.WAITER ? (
            <WaiterDashboard 
              waiter={state.waiters.find(w => w.id === currentUser.waiterId) || state.waiters[0]}
              cafe={state.cafes.find(c => c.id === currentUser.cafeId) || state.cafes[0]}
              categories={state.categories}
              items={state.items}
              tableCalls={state.tableCalls}
              orders={state.orders}
              onResolveCall={resolveTableCall}
              onUpdateOrderStatus={updateOrderStatus}
              onToggleItemActive={toggleItemActive}
              onAddOrder={addOrder}
              onLogout={onLogout}
            />
          ) : <Navigate to="/login" replace />
        } 
      />

      {/* Super Admin Dashboard */}
      <Route 
        path="/super-admin" 
        element={
          currentUser?.role === UserRole.SUPER_ADMIN ? (
            <SuperAdminDashboard 
              cafes={state.cafes} 
              waiters={state.waiters}
              onAddCafe={addCafe} 
              onAddWaiter={addWaiter}
              onDeleteWaiter={deleteWaiter}
              onLogout={onLogout}
            />
          ) : <Navigate to="/login" replace />
        } 
      />

      {/* Root redirect to first cafe menu with table=1 */}
      <Route path="/" element={<Navigate to={`/menu/${state.cafes[0]?.slug || 'osh-markazi'}?table=1`} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentRole: UserRole.CUSTOMER,
    cafes: initialCafes,
    categories: initialCategories,
    items: initialItems,
    waiters: initialWaiters,
    tableCalls: initialTableCalls,
    orders: initialOrders
  });

  const [currentUser, setCurrentUser] = useState<any>(null);

  const updateItems = (newItems: MenuItem[]) => setState(prev => ({ ...prev, items: newItems }));
  const updateCategories = (newCats: Category[]) => setState(prev => ({ ...prev, categories: newCats }));
  const addCafe = (newCafe: Cafe) => setState(prev => ({ ...prev, cafes: [...prev.cafes, newCafe] }));
  
  const addWaiter = (newWaiter: Waiter) => setState(prev => ({ 
    ...prev, 
    waiters: [...prev.waiters, newWaiter] 
  }));

  const deleteWaiter = (waiterId: string) => setState(prev => ({
    ...prev,
    waiters: prev.waiters.filter(w => w.id !== waiterId)
  }));

  const addTableCall = (call: TableCall) => setState(prev => ({
    ...prev,
    tableCalls: [call, ...prev.tableCalls]
  }));

  const resolveTableCall = (callId: string) => setState(prev => ({
    ...prev,
    tableCalls: prev.tableCalls.map(c => c.id === callId ? { ...c, status: 'resolved' as const } : c)
  }));

  const addOrder = (order: Order) => setState(prev => ({
    ...prev,
    orders: [order, ...prev.orders]
  }));

  const updateOrderStatus = (orderId: string, status: Order['status']) => setState(prev => ({
    ...prev,
    orders: prev.orders.map(o => o.id === orderId ? { ...o, status } : o)
  }));

  const toggleItemActive = (itemId: string) => setState(prev => ({
    ...prev,
    items: prev.items.map(it => it.id === itemId ? { ...it, isActive: !it.isActive } : it)
  }));

  const handleLogin = (user: any) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50">
        <AppContent 
          state={state} 
          onLogin={handleLogin} 
          onLogout={handleLogout}
          updateItems={updateItems} 
          updateCategories={updateCategories} 
          addCafe={addCafe}
          addWaiter={addWaiter}
          deleteWaiter={deleteWaiter}
          addTableCall={addTableCall}
          resolveTableCall={resolveTableCall}
          addOrder={addOrder}
          updateOrderStatus={updateOrderStatus}
          toggleItemActive={toggleItemActive}
          currentUser={currentUser}
        />
      </div>
    </HashRouter>
  );
};

export default App;
