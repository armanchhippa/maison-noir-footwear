import { useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import type { Product } from '../lib/supabase';
import { useCart } from '../lib/cart';

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView: (p: Product) => void }) {
  const { add } = useCart();
  const [hovered, setHovered] = useState(false);
  const [color, setColor] = useState(product.colorways[0]?.name ?? '');
  const [angle, setAngle] = useState(false);

  return (
    <div
      className="group relative bg-gradient-to-b from-[#161616] to-[#0c0c0c] rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#c9a14a]/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          onClick={() => setAngle((a) => !a)}
          className={`w-full h-full object-cover cursor-pointer transition-all duration-700 ease-out ${
            angle ? 'scale-110 [transform:scaleX(-1)]' : ''
          } ${hovered ? 'scale-110' : 'scale-100'}`}
          style={{ filter: hovered ? 'brightness(1.05)' : 'brightness(0.95)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-[#c9a14a] hover:border-[#c9a14a]/40 transition-all"
          aria-label="Quick view"
        >
          <Eye className="w-4 h-4" />
        </button>
        <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase text-white/50">
          {product.collection}
        </span>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-[Syne] text-base font-bold text-white tracking-wide">{product.name}</h3>
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/40 mt-0.5">{product.brand}</p>
          </div>
          <p className="font-[Syne] text-base font-bold text-[#c9a14a]">${product.price.toFixed(0)}</p>
        </div>

        <div className="flex items-center gap-2">
          {product.colorways.map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              title={c.name}
              className={`w-6 h-6 rounded-full border transition-all ${
                color === c.name ? 'border-[#c9a14a] scale-110' : 'border-white/20'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        <button
          onClick={() => {
            const size = product.sizes.US[Math.floor(product.sizes.US.length / 2)] ?? 9;
            add(product, size, 'US', color);
          }}
          className="w-full h-10 rounded-lg bg-white/5 border border-white/10 text-white/90 text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#c9a14a] hover:text-black hover:border-[#c9a14a] transition-all duration-300"
        >
          <Plus className="w-3.5 h-3.5" /> Quick Add
        </button>
      </div>
    </div>
  );
}
