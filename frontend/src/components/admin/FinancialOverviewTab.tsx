'use client';

import React from 'react';
import { TrendingUp, Wallet, Landmark, PiggyBank } from 'lucide-react';
import { AnimatedCounter } from '@/components/dashboard/AnimatedCounter';

interface FinancialOverviewTabProps {
  locale: string;
  payrollLiability: number;
}

export const FinancialOverviewTab: React.FC<FinancialOverviewTabProps> = ({ locale, payrollLiability }) => {
  const netMargin = 895000 - Math.max(0, payrollLiability - 1791000);

  const kpis = [
    {
      icon: Wallet,
      labelAr: 'إجمالي الإيرادات مدى الحياة',
      labelFr: 'Revenu Total (Lifetime)',
      value: 4850000,
      changeAr: '+31.0%',
      testid: 'kpi-lifetime-inflow',
    },
    {
      icon: TrendingUp,
      labelAr: 'إيرادات الشهر الحالي',
      labelFr: 'Revenu du Mois en Cours',
      value: 1420000,
      changeAr: '+18.4%',
      testid: 'kpi-month-revenue',
    },
    {
      icon: Landmark,
      labelAr: 'مستحقات الأساتذة المعلقة',
      labelFr: 'Payroll Enseignants (En Attente)',
      value: payrollLiability,
      changeAr: locale === 'ar' ? 'قيد الصرف' : 'Pending',
      testid: 'kpi-payroll-liability',
    },
    {
      icon: PiggyBank,
      labelAr: 'صافي الهامش التشغيلي',
      labelFr: 'Marge Opérationnelle Nette',
      value: Math.max(0, netMargin),
      changeAr: locale === 'ar' ? 'بعد 35% حصة الأساتذة و 10% عمولة السفراء' : 'Après parts 35% & 10%',
      testid: 'kpi-net-margin',
    },
  ];

  return (
    <div className="space-y-6" data-testid="financial-overview-tab">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.testid} data-testid={kpi.testid} className="p-5 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-lime-400/40 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white font-mono tracking-tight">
                <AnimatedCounter value={kpi.value} suffix=" DZD" />
              </h3>
              <p className="text-[11px] text-gray-400 mt-2 font-semibold">{locale === 'ar' ? kpi.labelAr : kpi.labelFr}</p>
              <p className="text-[10px] text-lime-400 font-bold mt-1">{kpi.changeAr}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
