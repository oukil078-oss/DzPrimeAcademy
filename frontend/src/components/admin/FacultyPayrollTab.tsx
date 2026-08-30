'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Plus, Landmark, Trash2 } from 'lucide-react';
import { formatDZD } from '@/lib/format';

interface FacultyPayrollTabProps {
  locale: string;
  onLiabilityChange: (total: number) => void;
}

export const FacultyPayrollTab: React.FC<FacultyPayrollTabProps> = ({ locale, onLiabilityChange }) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', university: '', specialty: '', hourlyRateDzd: 10000, ccpAccount: '', ccpCle: '' });

  const load = () => {
    fetch('/api/teachers')
      .then((r) => r.json())
      .then((data) => {
        setTeachers(data);
        const total = data
          .flatMap((t: any) => t.payouts || [])
          .filter((p: any) => p.status === 'PENDING')
          .reduce((sum: number, p: any) => sum + p.amountDzd, 0);
        onLiabilityChange(total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id: string) => {
    await fetch(`/api/teachers/${id}/payout`, { method: 'POST' });
    load();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
    load();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', email: '', university: '', specialty: '', hourlyRateDzd: 10000, ccpAccount: '', ccpCle: '' });
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-4" data-testid="faculty-payroll-tab">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <Landmark className="w-4 h-4 text-lime-400" />
          {locale === 'ar' ? 'سجل مستحقات الأساتذة وتسويات CCP' : 'Faculty Payroll & CCP Ledger'}
        </h3>
        <button
          data-testid="add-teacher-btn"
          onClick={() => setShowForm(!showForm)}
          className="px-3.5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{locale === 'ar' ? 'إضافة أستاذ' : 'Ajouter'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} data-testid="add-teacher-form" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input required placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Nom complet'} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input required placeholder={locale === 'ar' ? 'الجامعة' : 'Université'} value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input placeholder={locale === 'ar' ? 'التخصص' : 'Spécialité'} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input type="number" placeholder="Hourly Rate DZD" value={form.hourlyRateDzd} onChange={(e) => setForm({ ...form, hourlyRateDzd: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input placeholder="CCP Account" value={form.ccpAccount} onChange={(e) => setForm({ ...form, ccpAccount: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <button type="submit" data-testid="submit-teacher-btn" className="sm:col-span-3 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs">
            {locale === 'ar' ? 'حفظ الأستاذ' : 'Enregistrer'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto no-scrollbar rounded-2xl border border-white/10">
        <table className="w-full min-w-[820px] text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase bg-white/[0.02]">
              <th className="py-3 px-4">{locale === 'ar' ? 'الأستاذ' : 'Enseignant'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'الجامعة' : 'Université'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'الساعات' : 'Heures'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'الطلبة' : 'Étudiants'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'الأجر/ساعة' : 'Taux/h'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'الحصة الشهرية' : 'Part Mensuelle'}</th>
              <th className="py-3 px-4">CCP</th>
              <th className="py-3 px-4 text-center">{locale === 'ar' ? 'الإجراء' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-200">
            {!loading && teachers.map((t) => {
              const pendingPayout = (t.payouts || []).find((p: any) => p.status === 'PENDING');
              return (
                <tr key={t.id} data-testid={`teacher-row-${t.id}`} className="hover:bg-white/[0.03]">
                  <td className="py-3 px-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-lime-400/20 text-lime-300 flex items-center justify-center font-bold">
                        {t.user?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div>{t.user?.name}</div>
                        <div className="text-[10px] text-gray-500">{t.specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{t.university}</td>
                  <td className="py-3 px-4 font-mono">{t.hoursTaught}h</td>
                  <td className="py-3 px-4 font-mono">{t.studentsCount}</td>
                  <td className="py-3 px-4 font-mono">{formatDZD(t.hourlyRateDzd, locale)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-lime-400">{formatDZD(t.monthlyShareDzd, locale)}</td>
                  <td className="py-3 px-4 font-mono text-[11px]">{t.ccpAccount} {t.ccpCle && `Clé ${t.ccpCle}`}</td>
                  <td className="py-3 px-4 text-center">
                    {pendingPayout ? (
                      <button data-testid={`approve-payout-${t.id}`} onClick={() => handleApprove(t.id)} className="px-3 py-1.5 rounded-xl bg-lime-400 text-slate-950 text-[11px] font-bold flex items-center gap-1 mx-auto">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{locale === 'ar' ? 'صرف المستحقات' : 'Approuver'}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold">✓ {locale === 'ar' ? 'مصروف' : 'Payé'}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
