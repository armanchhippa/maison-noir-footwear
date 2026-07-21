import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../lib/cart';
import { supabase } from '../lib/supabase';
import type { OrderRow } from '../lib/supabase';

export function CartDrawer() {
  const { items, isOpen, close, remove, updateQty, total, count } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', country: '', postal: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const order: Omit<OrderRow, 'id' | 'created_at' | 'status'> = {
        customer_name: form.name,
        email: form.email,
        address: form.address,
        city: form.city,
        country: form.country,
        postal_code: form.postal,
        items,
        total,
      };
      const { error: err } = await supabase.from('orders').insert(order);
      if (err) throw err;
      setDone(true);
      setCheckout(false);
      setForm({ name: '', email: '', address: '', city: '', country: '', postal: '' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Order failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[65] w-full max-w-md bg-gradient-to-b from-[#121212] to-[#0a0a0a] border-l border-white/10 flex flex-col transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#c9a14a]" />
            <h2 className="font-[Syne] text-sm tracking-[0.25em] uppercase font-bold text-white">
              {done ? 'Order Confirmed' : checkout ? 'Checkout' : `Your Bag (${count})`}
            </h2>
          </div>
          <button
            onClick={() => {
              close();
              setCheckout(false);
              setDone(false);
            }}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-[#c9a14a]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-[#c9a14a] flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-black" />
            </div>
            <h3 className="font-[Syne] text-xl font-bold text-white">Thank you</h3>
            <p className="text-sm text-white/60">Your order has been sent to our atelier. You'll receive a confirmation shortly.</p>
            <button
              onClick={() => {
                close();
                setDone(false);
              }}
              className="mt-2 px-6 h-11 rounded-lg bg-[#c9a14a] text-black text-xs tracking-[0.25em] uppercase font-bold"
            >
              Continue
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-3">
            <ShoppingBag className="w-10 h-10 text-white/20" />
            <p className="text-white/50 text-sm">Your bag is empty.</p>
          </div>
        ) : checkout ? (
          <form onSubmit={handleCheckout} className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 p-5 space-y-4">
              {[
                { k: 'name', label: 'Full Name', type: 'text' },
                { k: 'email', label: 'Email', type: 'email' },
                { k: 'address', label: 'Address', type: 'text' },
                { k: 'city', label: 'City', type: 'text' },
                { k: 'country', label: 'Country', type: 'text' },
                { k: 'postal', label: 'Postal Code', type: 'text' },
              ].map((f) => (
                <div key={f.k}>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/40">{f.label}</label>
                  <input
                    required
                    type={f.type}
                    value={form[f.k as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.k]: e.target.value }))}
                    className="mt-1 w-full h-11 px-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#c9a14a] outline-none transition-colors"
                  />
                </div>
              ))}
              {error && <p className="text-red-400 text-xs">{error}</p>}
            </div>
            <div className="p-5 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Total</span>
                <span className="font-[Syne] font-bold text-[#c9a14a] text-lg">${total.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckout(false)}
                  className="flex-1 h-11 rounded-lg border border-white/15 text-white/70 text-xs tracking-[0.2em] uppercase"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] h-11 rounded-lg bg-[#c9a14a] text-black font-bold text-xs tracking-[0.25em] uppercase disabled:opacity-50"
                >
                  {submitting ? 'Placing…' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item, i) => (
                <div key={i} className="flex gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/5">
                  <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-[#1a1a1a]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-[Syne] text-sm font-bold text-white truncate">{item.name}</h4>
                        <p className="text-[10px] text-white/40 tracking-wide uppercase">{item.color} · {item.sizeSystem} {item.size}</p>
                      </div>
                      <button onClick={() => remove(i)} className="text-white/40 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border border-white/10 rounded-md">
                        <button onClick={() => updateQty(i, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-[#c9a14a]">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-white w-5 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(i, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-[#c9a14a]">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-[Syne] text-sm font-bold text-[#c9a14a]">${(item.price * item.qty).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Subtotal</span>
                <span className="font-[Syne] font-bold text-white text-lg">${total.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-white/40">Shipping & taxes calculated at dispatch.</p>
              <button
                onClick={() => setCheckout(true)}
                className="w-full h-12 rounded-lg bg-[#c9a14a] text-black font-bold text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
