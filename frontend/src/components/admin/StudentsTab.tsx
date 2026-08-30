'use client';

import React, { useEffect, useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { WILAYAS, getLocalizedWilayaName } from '@/lib/initial-data';
import { Locale } from '@/types';

interface StudentsTabProps {
  locale: Locale;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({ locale }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [wilayaFilter, setWilayaFilter] = useState<string>('ALL');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/students')
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleVerify = async (id: string, isVerified: boolean) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isVerified: !isVerified } : u)));
    await fetch('/api/students', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isVerified: !isVerified }),
    });
  };

  const students = users.filter((u) => u.role === 'STUDENT_FREE' || u.role === 'STUDENT_PAID');

  const filtered = students.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesWilaya = wilayaFilter === 'ALL' || String(u.wilayaCode) === wilayaFilter;
    const matchesTier = tierFilter === 'ALL' || u.role === tierFilter;
    return matchesSearch && matchesWilaya && matchesTier;
  });

  return (
    <div className="space-y-4" data-testid="students-tab">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            data-testid="students-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === 'ar' ? 'بحث بالاسم أو البريد' : 'Rechercher...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500"
          />
        </div>
        <select data-testid="students-wilaya-filter" value={wilayaFilter} onChange={(e) => setWilayaFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
          <option value="ALL">{locale === 'ar' ? 'كل الولايات' : 'Toutes Wilayas'}</option>
          {WILAYAS.map((w) => (
            <option key={w.code} value={w.code}>{w.code} - {getLocalizedWilayaName(w, locale)}</option>
          ))}
        </select>
        <select data-testid="students-tier-filter" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
          <option value="ALL">{locale === 'ar' ? 'كل الفئات' : 'Tous les Tiers'}</option>
          <option value="STUDENT_PAID">Gold VIP</option>
          <option value="STUDENT_FREE">Free</option>
        </select>
      </div>

      <div className="overflow-x-auto no-scrollbar rounded-2xl border border-white/10">
        <table className="w-full min-w-[680px] text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase bg-white/[0.02]">
              <th className="py-3 px-4">{locale === 'ar' ? 'الطالب' : 'Étudiant'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'الولاية' : 'Wilaya'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'الفئة' : 'Tier'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'رقم البطاقة' : 'Card ID'}</th>
              <th className="py-3 px-4 text-center">{locale === 'ar' ? 'حالة البطاقة' : 'Statut'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-200">
            {!loading && filtered.map((u) => (
              <tr key={u.id} data-testid={`student-row-${u.id}`} className="hover:bg-white/[0.03]">
                <td className="py-3 px-4 font-bold text-white">
                  <div>{u.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{u.email}</div>
                </td>
                <td className="py-3 px-4">{u.wilayaCode} ({u.wilayaName})</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'STUDENT_PAID' ? 'bg-lime-400/20 text-lime-300' : 'bg-white/10 text-gray-300'}`}>
                    {u.role === 'STUDENT_PAID' ? 'Gold VIP' : 'Free'}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[11px]">{u.studentCardId}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    data-testid={`toggle-verify-${u.id}`}
                    onClick={() => handleToggleVerify(u.id, u.isVerified)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 mx-auto ${
                      u.isVerified ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>{u.isVerified ? (locale === 'ar' ? 'مفعّلة' : 'Vérifiée') : (locale === 'ar' ? 'غير مفعّلة' : 'En attente')}</span>
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
