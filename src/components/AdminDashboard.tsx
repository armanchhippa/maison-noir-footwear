import { useState, useEffect, useCallback } from 'react';
import { Lock, BarChart3, Package, Plus, Trash2, X, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, OrderRow } from '../lib/supabase';

const ADMIN_PASSWORD = 'maison2024';

export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-24">
        <div className="w-full max-w-sm bg-gradient-to-b from-[#141414] to-[#0a0a0a] rounded-2xl border border-white/10 p-8">
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#c9a14a]/10 border border-[#c9a14a]/30 flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#c9a14a]" />
            </div>
            <h2 className="font-[Syne] text-xl font-extrabold text-white tracking-wide">Admin Access</h2>
            <p className="text-xs text-white/50">Enter password to manage the atelier.</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pw === ADMIN_PASSWORD) {
                setAuthed(true);
                setErr('');
              } else {
                setErr('Incorrect password.');
              }
            }}
            className="space-y-3"
          >
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              className="w-full h-12 px-4 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#c9a14a] outline-none"
            />
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <button className="w-full h-12 rounded-lg bg-[#c9a14a] text-black font-bold text-xs tracking-[0.25em] uppercase">
              Unlock
            </button>
            <p className="text-[10px] text-white/30 text-center">Demo password: maison2024</p>
          </form>
        </div>
      </div>
    );
  }

  return <AdminPanel onLogout={() => setAuthed(false)} />;
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<'analytics' | 'orders' | 'products'>('analytics');
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, p] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
    ]);
    setOrders((o.data as OrderRow[]) ?? []);
    setProducts((p.data as Product[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-[Syne] text-2xl md:text-3xl font-extrabold text-white tracking-wide">Atelier Dashboard</h1>
          <p className="text-xs text-white/40 mt-1 tracking-wide uppercase">Manage orders, products & analytics</p>
        </div>
        <button onClick={onLogout} className="self-start px-4 h-10 rounded-lg border border-white/15 text-white/70 text-xs tracking-[0.2em] uppercase hover:text-[#c9a14a]">
          Sign Out
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'analytics' as const, icon: BarChart3, label: 'Analytics' },
          { id: 'orders' as const, icon: ShoppingBag, label: 'Orders' },
          { id: 'products' as const, icon: Package, label: 'Products' },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 h-10 rounded-lg text-xs tracking-[0.2em] uppercase border transition-all ${
                tab === t.id ? 'bg-[#c9a14a] text-black border-[#c9a14a]' : 'border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-white/40 text-sm">Loading…</div>
      ) : tab === 'analytics' ? (
        <Analytics orders={orders} />
      ) : tab === 'orders' ? (
        <OrdersTable orders={orders} onUpdate={load} />
      ) : (
        <ProductsManager products={products} onChanged={load} />
      )}
    </div>
  );
}

function Analytics({ orders }: { orders: OrderRow[] }) {
  const [range, setRange] = useState<'1m' | '2m' | 'all'>('1m');
  const now = new Date();
  const cutoff = new Date(now);
  if (range === '1m') cutoff.setMonth(now.getMonth() - 1);
  else if (range === '2m') cutoff.setMonth(now.getMonth() - 2);
  else cutoff.setFullYear(2000);

  const filtered = orders.filter((o) => new Date(o.created_at) >= cutoff);
  const totalRevenue = filtered.reduce((s, o) => s + Number(o.total), 0);
  const totalOrders = filtered.length;
  const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;

  // Group by day
  const byDay = new Map<string, number>();
  filtered.forEach((o) => {
    const d = new Date(o.created_at).toISOString().slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + Number(o.total));
  });
  const days = Array.from(byDay.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const maxVal = Math.max(1, ...days.map((d) => d[1]));

  // Pad to reasonable number of buckets for visual
  const buckets: { label: string; value: number }[] = [];
  if (days.length === 0) {
    buckets.push({ label: 'No data', value: 0 });
  } else if (days.length <= 14) {
    days.forEach(([label, value]) => buckets.push({ label: label.slice(5), value }));
  } else {
    const step = Math.ceil(days.length / 12);
    for (let i = 0; i < days.length; i += step) {
      const chunk = days.slice(i, i + step);
      const sum = chunk.reduce((s, d) => s + d[1], 0);
      buckets.push({ label: chunk[0][0].slice(5), value: sum });
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign },
          { label: 'Orders', value: totalOrders.toString(), icon: ShoppingBag },
          { label: 'Avg Order', value: `$${avgOrder.toFixed(0)}`, icon: TrendingUp },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-gradient-to-b from-[#161616] to-[#0c0c0c] rounded-2xl border border-white/5 p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/40">{s.label}</span>
                <Icon className="w-4 h-4 text-[#c9a14a]" />
              </div>
              <p className="font-[Syne] text-3xl font-extrabold text-white mt-2">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-b from-[#161616] to-[#0c0c0c] rounded-2xl border border-white/5 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <h3 className="font-[Syne] text-lg font-bold text-white">Sales Performance</h3>
          <div className="flex gap-2">
            {[
              { id: '1m' as const, label: '1 Month' },
              { id: '2m' as const, label: '2 Months' },
              { id: 'all' as const, label: 'All-Time' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`px-3 h-9 rounded-md text-[11px] tracking-[0.15em] uppercase border transition-all ${
                  range === r.id ? 'bg-[#c9a14a] text-black border-[#c9a14a]' : 'border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-56 md:h-64">
          {buckets.map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-[#c9a14a]/30 to-[#c9a14a] transition-all duration-500 hover:from-[#c9a14a]/50 hover:to-[#e8c878] relative"
                style={{ height: `${(b.value / maxVal) * 100}%`, minHeight: b.value > 0 ? '4px' : '0' }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-[#c9a14a] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${b.value.toFixed(0)}
                </span>
              </div>
              <span className="text-[9px] text-white/30 tracking-wide">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersTable({ orders, onUpdate }: { orders: OrderRow[]; onUpdate: () => void }) {
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    onUpdate();
  };

  return (
    <div className="bg-gradient-to-b from-[#161616] to-[#0c0c0c] rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-[10px] tracking-[0.2em] uppercase text-white/40 border-b border-white/10">
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Size</th>
              <th className="p-4">Address</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-white/40">No orders yet.</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <p className="text-white font-medium">{o.customer_name}</p>
                    <p className="text-[11px] text-white/40">{o.email}</p>
                  </td>
                  <td className="p-4 text-white/70">{o.items.length} item(s)</td>
                  <td className="p-4 text-white/70">
                    {o.items.map((i, idx) => (
                      <span key={idx} className="block text-[11px]">
                        {i.sizeSystem} {i.size}
                      </span>
                    ))}
                  </td>
                  <td className="p-4 text-white/70 text-xs">
                    {o.address}, {o.city}, {o.country}
                  </td>
                  <td className="p-4 font-[Syne] font-bold text-[#c9a14a]">${Number(o.total).toFixed(0)}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`px-2 h-8 rounded-md text-[11px] border bg-black/40 outline-none ${
                        o.status === 'Delivered' ? 'text-green-400 border-green-400/30' :
                        o.status === 'Cancelled' ? 'text-red-400 border-red-400/30' :
                        'text-[#c9a14a] border-[#c9a14a]/30'
                      }`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s} className="text-white bg-black">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductsManager({ products, onChanged }: { products: Product[]; onChanged: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', image_url: '', description: '', collection: 'Main' });
  const [saving, setSaving] = useState(false);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const price = parseFloat(form.price);
    if (!form.name || isNaN(price) || !form.image_url) {
      setSaving(false);
      return;
    }
    await supabase.from('products').insert({
      name: form.name,
      price,
      image_url: form.image_url,
      description: form.description,
      collection: form.collection,
      colorways: [{ name: 'Noir', hex: '#0a0a0a' }, { name: 'Bone', hex: '#e8e2d5' }],
      sizes: { US: [7, 8, 9, 10, 11, 12], UK: [6, 7, 8, 9, 10, 11], EU: [40, 41, 42, 43, 44, 45] },
    });
    setForm({ name: '', price: '', image_url: '', description: '', collection: 'Main' });
    setShowAdd(false);
    setSaving(false);
    onChanged();
  };

  const removeProduct = async (id: string) => {
    if (!confirm('Remove this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    onChanged();
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="font-[Syne] text-lg font-bold text-white">Catalog ({products.length})</h3>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#c9a14a] text-black font-bold text-xs tracking-[0.2em] uppercase"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addProduct} className="bg-gradient-to-b from-[#161616] to-[#0c0c0c] rounded-2xl border border-white/10 p-5 grid md:grid-cols-2 gap-3">
          <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 px-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-[#c9a14a]" />
          <input required type="number" step="0.01" placeholder="Price ($)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="h-11 px-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-[#c9a14a]" />
          <input required placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="h-11 px-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-[#c9a14a] md:col-span-2" />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="h-11 px-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-[#c9a14a] md:col-span-2" />
          <select value={form.collection} onChange={(e) => setForm({ ...form, collection: e.target.value })} className="h-11 px-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-[#c9a14a]">
            {['Main', 'Performance', 'Limited'].map((c) => <option key={c} className="bg-black">{c}</option>)}
          </select>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="flex-1 h-11 rounded-lg border border-white/15 text-white/70 text-xs tracking-[0.2em] uppercase">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 h-11 rounded-lg bg-[#c9a14a] text-black font-bold text-xs tracking-[0.2em] uppercase disabled:opacity-50">Save</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((p) => (
          <div key={p.id} className="bg-gradient-to-b from-[#161616] to-[#0c0c0c] rounded-xl border border-white/5 overflow-hidden group">
            <div className="aspect-square bg-[#1a1a1a] overflow-hidden relative">
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              <button
                onClick={() => removeProduct(p.id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-white/70 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3">
              <h4 className="font-[Syne] text-sm font-bold text-white truncate">{p.name}</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-wide">{p.collection}</p>
              <p className="font-[Syne] text-sm font-bold text-[#c9a14a] mt-1">${p.price.toFixed(0)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
