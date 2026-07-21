import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';

export function CollectionsPage({ onOpenCollection }: { onOpenCollection: (c: string) => void }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => setProducts((data as Product[]) ?? []));
  }, []);

  const collections = Array.from(new Set(products.map((p) => p.collection)));

  const hero: Record<string, { img: string; title: string; desc: string }> = {
    Main: { img: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'The Main Line', desc: 'Everyday luxury, redefined.' },
    Performance: { img: 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'Performance', desc: 'Engineered for motion.' },
    Limited: { img: 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg?auto=compress&cs=tinysrgb&w=1200', title: 'Limited Edition', desc: 'When rarity meets craft.' },
  };

  return (
    <div className="pt-20 md:pt-24 pb-24 max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-8">
        <span className="text-[#c9a14a] text-[11px] tracking-[0.3em] uppercase">Curated</span>
        <h1 className="font-[Syne] text-3xl md:text-5xl font-extrabold text-white mt-1">Collections</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {collections.map((c) => {
          const meta = hero[c] ?? hero.Main;
          const items = products.filter((p) => p.collection === c);
          return (
            <button
              key={c}
              onClick={() => onOpenCollection(c)}
              className="group relative h-72 md:h-96 rounded-2xl overflow-hidden text-left"
            >
              <img src={meta.img} alt={c} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 p-6 md:p-8">
                <span className="text-[#c9a14a] text-[11px] tracking-[0.3em] uppercase">{items.length} Pieces</span>
                <h2 className="font-[Syne] text-2xl md:text-3xl font-extrabold text-white mt-1">{meta.title}</h2>
                <p className="text-white/60 text-sm mt-1">{meta.desc}</p>
                <span className="inline-flex items-center gap-2 mt-4 text-white text-xs tracking-[0.2em] uppercase group-hover:text-[#c9a14a] transition-colors">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
