import { useState } from 'react';
import { CartProvider } from './lib/cart';
import { Navigation } from './components/Navigation';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { AdminDashboard } from './components/AdminDashboard';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CollectionsPage } from './pages/CollectionsPage';
import type { Product } from './lib/supabase';

type Page = 'home' | 'shop' | 'collections' | 'admin' | 'cart';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [collectionFilter, setCollectionFilter] = useState<string | undefined>();

  const goShop = () => {
    setCollectionFilter(undefined);
    setPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCollection = (c: string) => {
    setCollectionFilter(c);
    setPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        <Navigation page={page === 'cart' ? 'shop' : page} setPage={(p) => {
          if (p === 'cart') {
            // handled by drawer; stay on current page
            return;
          }
          setCollectionFilter(undefined);
          setPage(p);
        }} />
        <CartDrawer />
        <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />

        <main>
          {page === 'home' && <HomePage onShop={goShop} onQuickView={setQuickView} />}
          {page === 'shop' && <ShopPage onQuickView={setQuickView} collection={collectionFilter} />}
          {page === 'collections' && <CollectionsPage onOpenCollection={openCollection} />}
          {page === 'admin' && <AdminDashboard />}
          {page === 'cart' && <ShopPage onQuickView={setQuickView} collection={collectionFilter} />}
        </main>

        <footer className="border-t border-white/10 bg-black py-10 px-6 md:px-10 mt-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="font-[Syne] text-lg font-extrabold tracking-[0.3em] text-white">MAISON NOIR</p>
              <p className="text-xs text-white/40 mt-2 max-w-xs">Luxury footwear, handcrafted in Italy. Worn by those who move in silence.</p>
            </div>
            <div className="flex gap-8 text-xs text-white/50">
              <div>
                <p className="text-white/80 mb-2 tracking-[0.2em] uppercase text-[10px]">Shop</p>
                <p className="hover:text-[#c9a14a] cursor-pointer" onClick={goShop}>All Footwear</p>
                <p className="hover:text-[#c9a14a] cursor-pointer" onClick={() => setPage('collections')}>Collections</p>
              </div>
              <div>
                <p className="text-white/80 mb-2 tracking-[0.2em] uppercase text-[10px]">Support</p>
                <p>Shipping</p>
                <p>Returns</p>
                <p>Contact</p>
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] text-white/30 mt-8 tracking-[0.2em] uppercase">© 2026 Maison Noir · All Rights Reserved</p>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
