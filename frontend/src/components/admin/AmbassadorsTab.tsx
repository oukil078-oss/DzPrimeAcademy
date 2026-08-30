'use client';

import React, { useEffect, useState } from 'react';
import { Award, Tag } from 'lucide-react';
import { formatDZD } from '@/lib/format';
import { getLocalizedWilayaName } from '@/lib/initial-data';

interface AmbassadorsTabProps {
  locale: string;
}

export const AmbassadorsTab: React.FC<AmbassadorsTabProps> = ({ locale }) => {
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ambassadors')
      .then((r) => r.json())
      .then(setAmbassadors)
      .finally(() => setLoading(false));
  }, []);

  const totalCommission = ambassadors.reduce((sum, a) => sum + (a.commissionDzd || 0), 0);

  return (
    <div className="space-y-4" data-testid="ambassadors-tab">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-lime-400" />
          {locale === 'ar' ? 'شبكة السفراء عبر 58 ولاية - سجل العمولات (10%)' : 'Réseau Ambassadeurs (58 Wilayas) - Ledger Commission (10%)'}
        </h3>
        <span className="px-3 py-1.5 rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-300 text-xs font-mono font-bold">
          {locale === 'ar' ? 'إجمالي العمولات: ' : 'Total: '}{formatDZD(totalCommission, locale)}
        </span>
      </div>

      <div className="overflow-x-auto no-scrollbar rounded-2xl border border-white/10">
        <table className="w-full min-w-[700px] text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase bg-white/[0.02]">
              <th className="py-3 px-4">{locale === 'ar' ? 'السفير' : 'Ambassadeur'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'الولاية' : 'Wilaya'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'كود الترويج' : 'Promo Code'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'الإحالات' : 'Référrals'}</th>
              <th className="py-3 px-4">{locale === 'ar' ? 'العمولة' : 'Commission'}</th>
              <th className="py-3 px-4 text-center">{locale === 'ar' ? 'الحالة' : 'Statut'}</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
