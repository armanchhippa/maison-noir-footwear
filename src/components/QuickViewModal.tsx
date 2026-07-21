import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { Product } from '../lib/supabase';
import { useCart } from '../lib/cart';

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add } = useCart();
  const [sizeSystem, setSizeSystem] = useState<'US' | 'UK' | 'EU'>('US');
  const [size, setSize] = useState<number | null>(null);
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    if (product) {
      setSizeSystem('US');
      setSize(null);
      setColor(product.colorways[0]?.name ?? '');
    }
  }, [product]);

  if (!product) return null;

  const sizes = product.sizes[sizeSystem];

  const handleAdd = () => {
    if (size == null) return;
    add(product, size, sizeSystem, color);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease]" onClick={onClose}>
      <div
        className="relative w-full max-w-3xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#c9a14a]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square bg-[#1a1a1a] overflow-hidden">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 md:p-8 space-y-5">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-white/40">{product.brand} · {product.collection}</p>
              <h2 className="font-[Syne] text-2xl font-extrabold text-white mt-1">{product.name}</h2>
              <p className="font-[Syne] text-xl font-bold text-[#c9a14a] mt-2">${product.price.toFixed(0)}</p>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{product.description}</p>

            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/50 mb-2">Colorway · {color}</p>
              <div className="flex items-center gap-2">
                {product.colorways.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      color === c.name ? 'border-[#c9a14a] scale-110' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/50">Size</p>
                <div className="flex gap-1">
                  {(['US', 'UK', 'EU'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSizeSystem(s);
                        setSize(null);
                      }}
                      className={`px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase rounded border transition-all ${
                        sizeSystem === s
                          ? 'bg-[#c9a14a] text-black border-[#c9a14a]'
                          : 'border-white/15 text-white/60 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-9 h-9 px-2 rounded-md text-xs font-medium border transition-all ${
                      size === s
                        ? 'bg-white text-black border-white'
                        : 'border-white/15 text-white/70 hover:border-white/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={size == null}
              className="w-full h-12 rounded-lg bg-[#c9a14a] text-black font-bold text-xs tracking-[0.25em] uppercase flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              {size == null ? 'Select a size' : <>Add to Order · ${(product.price).toFixed(0)}</>}
              {size != null && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
