import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

export function HomePage({ onShop, onQuickView }: { onShop: () => void; onQuickView: (p: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').limit(4).order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts((data as Product[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-14 md:pt-16">
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[560px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
        <div className="relative h-full flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-10">
          <span className="flex items-center gap-2 text-[#c9a14a] text-[11px] tracking-[0.4em] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Autumn / Winter Collection
          </span>
          <h1 className="font-[Syne] text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[0.95] max-w-3xl">
            Step Into<br /><span className="text-[#c9a14a]">The Noir.</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg mt-5 max-w-md leading-relaxed">
            Hand-finished footwear for those who move in silence. Crafted in Italy, worn everywhere.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={onShop}
              className="group flex items-center gap-2 px-7 h-12 rounded-lg bg-[#c9a14a] text-black font-bold text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onShop}
              className="px-7 h-12 rounded-lg border border-white/20 text-white text-xs tracking-[0.25em] uppercase hover:border-[#c9a14a] hover:text-[#c9a14a] transition-colors"
            >
              Explore Lookbook
            </button>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-black border-y border-white/10 overflow-hidden py-3">
        <div className="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap text-[#c9a14a]/70 text-xs tracking-[0.4em] uppercase">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              Complimentary Worldwide Shipping · Handcrafted In Italy · 2-Year Warranty · Carbon-Neutral Delivery
            </span>
          ))}
        </div>
      </div>

      {/* Feature strip */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Truck, title: 'Worldwide Delivery', desc: 'Complimentary express shipping to 80+ countries.' },
          { icon: ShieldCheck, title: 'Authenticity Guaranteed', desc: 'Every pair verified with tamper-proof seal.' },
          { icon: RefreshCw, title: '30-Day Returns', desc: 'Unworn pairs returnable within 30 days, no questions.' },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="flex items-start gap-4 p-5 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="w-11 h-11 rounded-lg bg-[#c9a14a]/10 border border-[#c9a14a]/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#c9a14a]" />
              </div>
              <div>
                <h3 className="font-[Syne] text-sm font-bold text-white">{f.title}</h3>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-10 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[#c9a14a] text-[11px] tracking-[0.3em] uppercase">Just Landed</span>
            <h2 className="font-[Syne] text-3xl md:text-4xl font-extrabold text-white mt-1">Featured Drops</h2>
          </div>
          <button onClick={onShop} className="hidden md:flex items-center gap-2 text-white/60 hover:text-[#c9a14a] text-xs tracking-[0.2em] uppercase">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
