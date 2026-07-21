import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

export function ShopPage({ onQuickView, collection }: { onQuickView: (p: Product) => void; collection?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>(collection ?? 'All');
  const [sort, setSort] = useState<'new' | 'low' | 'high'>('new');

  useEffect(() => {
    if (collection) setFilter(collection);
  }, [collection]);

  useEffect(() => {
    setLoading(true);
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts((data as Product[]) ?? []);
        setLoading(false);
      });
  }, []);

  const collections = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.collection)))], [products]);

  const visible = useMemo(() => {
    let list = filter === 'All' ? products : products.filter((p) => p.collection === filter);
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, filter, sort]);

  return (
    <div className="pt-20 md:pt-24 pb-24 max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-8">
        <span className="text-[#c9a14a] text-[11px] tracking-[0.3em] uppercase">The Collection</span>
        <h1 className="font-[Syne] text-3xl md:text-5xl font-extrabold text-white mt-1">Shop All Footwear</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {collections.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 h-9 rounded-full text-xs tracking-[0.15em] uppercase border whitespace-nowrap transition-all ${
                filter === c ? 'bg-[#c9a14a] text-black border-[#c9a14a]' : 'border-white/15 text-white/60 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="h-10 px-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-[#c9a14a]"
        >
          <option value="new" className="bg-black">Newest</option>
          <option value="low" className="bg-black">Price: Low to High</option>
          <option value="high" className="bg-black">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="text-white/40 text-center py-20">No products in this collection.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </div>
  );
}
