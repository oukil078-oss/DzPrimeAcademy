'use client';

import React, { useEffect, useState } from 'react';
import { Award, Tag, Plus, Trash2, KeyRound } from 'lucide-react';
import { formatDZD } from '@/lib/format';
import { WILAYAS, getLocalizedWilayaName } from '@/lib/initial-data';

interface AmbassadorsTabProps {
  locale: string;
}

export const AmbassadorsTab: React.FC<AmbassadorsTabProps> = ({ locale }) => {
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', wilayaCode: 16, institutionNameAr: '', promoCode: '' });
  const [createdCred, setCreatedCred] = useState<{ email: string; tempPassword: string } | null>(null);

  const load = () => {
    fetch('/api/ambassadors')
      .then((r) => r.json())
      .then(setAmbassadors)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const totalCommission = ambassadors.reduce((sum, a) => sum + (a.commissionDzd || 0), 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const wilaya = WILAYAS.find((w) => w.code === form.wilayaCode);
    const res = await fetch('/api/ambassadors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        wilayaNameAr: wilaya?.nameAr,
        wilayaNameFr: wilaya?.nameFr,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setCreatedCred({ email: form.email, tempPassword: data.tempPassword });
      setForm({ name: '', email: '', wilayaCode: 16, institutionNameAr: '', promoCode: '' });
      setShowForm(false);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/ambassadors/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-4" data-testid="ambassadors-tab">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-lime-400" />
          {locale === 'ar' ? 'شبكة السفراء عبر 58 ولاية - سجل العمولات (10%)' : 'Réseau Ambassadeurs (58 Wilayas) - Ledger Commission (10%)'}
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-300 text-xs font-mono font-bold">
            {locale === 'ar' ? 'إجمالي العمولات: ' : 'Total: '}{formatDZD(totalCommission, locale)}
          </span>
          <button data-testid="add-ambassador-btn" onClick={() => setShowForm(!showForm)} className="px-3.5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'إضافة سفير' : 'Ajouter'}</span>
          </button>
        </div>
      </div>

      {createdCred && (
        <div data-testid="ambassador-created-credentials" className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <KeyRound className="w-4 h-4 shrink-0" />
          <span>{locale === 'ar' ? 'تم إنشاء الحساب:' : 'Compte créé:'} {createdCred.email} / {createdCred.tempPassword}</span>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} data-testid="add-ambassador-form" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input required placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Nom complet'} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <select value={form.wilayaCode} onChange={(e) => setForm({ ...form, wilayaCode: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
            {WILAYAS.map((w) => (
              <option key={w.code} value={w.code}>{w.code} - {getLocalizedWilayaName(w, locale as any)}</option>
            ))}
          </select>
          <input required placeholder={locale === 'ar' ? 'المؤسسة' : 'Institution'} value={form.institutionNameAr} onChange={(e) => setForm({ ...form, institutionNameAr: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input placeholder={locale === 'ar' ? 'كود الترويج (اختياري)' : 'Code Promo (optionnel)'} value={form.promoCode} onChange={(e) => setForm({ ...form, promoCode: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <button type="submit" data-testid="submit-ambassador-btn" className="py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs">
            {locale === 'ar' ? 'حفظ السفير' : 'Enregistrer'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto no-scrollbar rounded-2xl border border-white/10">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase bg-white/[0.02]">
              <th className="py-3 px-4">{locale === 'ar' ? 'السفير' : 'Ambassadeur'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'الولاية' : 'Wilaya'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'كود الترويج' : 'Promo Code'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'الإحالات' : 'Référrals'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'العمولة' : 'Commission'}</th>
              <th className="py-3 px-4 text-center">{locale === 'ar' ? 'الحالة' : 'Statut'}</th>
              <th className="py-3 px-4 text-center">{locale === 'ar' ? 'إجراء' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-200">
            {!loading && ambassadors.map((a) => (
              <tr key={a.id} data-testid={`ambassador-row-${a.id}`} className="hover:bg-white/[0.03]">
                <td className="py-3 px-4 font-bold text-white">{a.user?.name}</td>
                <td className="py-3 px-4">{a.wilayaCode} ({locale === 'ar' ? a.wilayaNameAr : a.wilayaNameFr})</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-lg bg-lime-400/10 text-lime-300 font-mono font-bold flex items-center gap-1 w-fit">
                    <Tag className="w-3 h-3" />
                    {a.promoCode}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono">{a.referralsCount}</td>
                <td className="py-3 px-4 font-mono font-bold text-lime-400">{formatDZD(a.commissionDzd, locale)}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.isVerified ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                    {a.isVerified ? (locale === 'ar' ? 'موثّق' : 'Vérifié') : (locale === 'ar' ? 'قيد المراجعة' : 'En revue')}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button data-testid={`delete-ambassador-${a.id}`} onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-gray-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
