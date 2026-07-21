import { Home, ShoppingBag, ShoppingCart, Lock, LayoutGrid } from 'lucide-react';
import { useCart } from '../lib/cart';
import { Logo } from './Logo';

type Page = 'home' | 'shop' | 'collections' | 'admin' | 'cart';

export function Navigation({
  page,
  setPage,
}: {
  page: Page;
  setPage: (p: Page) => void;
}) {
  const { count, open } = useCart();

  const go = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCart = () => {
    if (page !== 'shop' && page !== 'collections') {
      open();
    } else {
      open();
    }
  };

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden md:flex fixed top-0 inset-x-0 z-50 h-16 items-center justify-between px-8 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => go('home')} className="flex items-center gap-3 text-white">
          <Logo className="w-9 h-6 text-[#c9a14a]" />
          <span className="font-[Syne] text-xl tracking-[0.35em] font-extrabold">MAISON&nbsp;NOIR</span>
        </button>
        <nav className="flex items-center gap-10 text-[13px] tracking-[0.25em] uppercase">
          {(['home', 'shop', 'collections', 'admin'] as Page[]).map((p) => (
            <button
              key={p}
              onClick={() => go(p)}
              className={`transition-colors duration-300 hover:text-[#c9a14a] ${
                page === p ? 'text-[#c9a14a]' : 'text-white/80'
              }`}
            >
              {p}
            </button>
          ))}
          <button onClick={openCart} className="relative flex items-center gap-2 text-white/80 hover:text-[#c9a14a] transition-colors">
            <ShoppingCart className="w-4 h-4" />
            <span className="absolute -top-2 -right-3 bg-[#c9a14a] text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {count}
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile top header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-center bg-black/80 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => go('home')} className="flex items-center gap-2 text-white">
          <Logo className="w-8 h-5 text-[#c9a14a]" />
          <span className="font-[Syne] text-base tracking-[0.3em] font-extrabold">MAISON&nbsp;NOIR</span>
        </button>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 grid grid-cols-4 bg-black/90 backdrop-blur-xl border-t border-white/10">
        {[
          { id: 'home' as Page, icon: Home, label: 'Home' },
          { id: 'shop' as Page, icon: ShoppingBag, label: 'Shop' },
          { id: 'cart' as Page, icon: ShoppingCart, label: 'Cart', badge: count },
          { id: 'admin' as Page, icon: Lock, label: 'Admin' },
        ].map((item) => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
                active ? 'text-[#c9a14a]' : 'text-white/60'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-[0.15em] uppercase">{item.label}</span>
              {item.badge ? (
                <span className="absolute top-2 right-1/2 translate-x-4 bg-[#c9a14a] text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </>
  );
}
