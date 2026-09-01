'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  Landmark,
  PiggyBank,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  CreditCard,
  Send,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/dashboard/AnimatedCounter';
import { formatDZD } from '@/lib/format';

interface FinancialOverviewTabProps {
  locale: string;
  payrollLiability: number;
}

export const FinancialOverviewTab: React.FC<FinancialOverviewTabProps> = ({ locale, payrollLiability }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'MONTH' | 'ANNUAL'>('MONTH');
  const [activeTooltipMonth, setActiveTooltipMonth] = useState<string | null>('Mar');

  const totalBalance = 8450000;
  const monthlyIncome = 5420000;
  const netMargin = Math.max(0, monthlyIncome - payrollLiability);

  const transactions = [
    {
      id: 'tx-1',
      nameAr: 'صرف مستحقات أستاذ: د. يوسف منصوري',
      nameFr: 'Virement Enseignant: Dr. Youssef Mansouri',
      category: 'TEACHER_PAYOUT',
      method: 'CCP / Algérie Poste',
      amount: -120000,
      date: '28 Fév 2026',
      status: 'COMPLETE',
    },
    {
      id: 'tx-2',
      nameAr: 'تفعيل بطاقة جامعية رقمية (VIP Gold)',
      nameFr: 'Activation Carte Digitale (VIP Gold)',
      category: 'CARD_PURCHASE',
      method: 'Edahabia / CIB',
      amount: 2500,
      date: '28 Fév 2026',
      status: 'COMPLETE',
    },
    {
      id: 'tx-3',
      nameAr: 'اشتراك حزمة البكالوريا الذهبية',
      nameFr: 'Abonnement Pack BAC Excellence',
      category: 'BUNDLE_SUB',
      method: 'BaridiMob',
      amount: 4500,
      date: '27 Fév 2026',
      status: 'COMPLETE',
    },
    {
      id: 'tx-4',
      nameAr: 'عمولة سفير ولاية وهران (Wilaya 31)',
      nameFr: 'Commission Ambassadeur (Wilaya 31)',
      category: 'AMBASSADOR_COMMISSION',
      method: 'CCP Transfer',
      amount: -35000,
      date: '26 Fév 2026',
      status: 'COMPLETE',
    },
    {
      id: 'tx-5',
      nameAr: 'حجز مقياس الخوارزميات L1 Info',
      nameFr: 'Achat Module Algorithmique L1',
      category: 'COURSE_PURCHASE',
      method: 'CIB / Edahabia',
      amount: 3800,
      date: '25 Fév 2026',
      status: 'COMPLETE',
    },
  ];

  return (
    <div className="space-y-6 font-arabic" data-testid="financial-overview-tab">
      {/* ================= 1. TOP FINANCIAL BENTO ROW (Moneed & Finova Style) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: My Balance with Sparkline & Actions (Moneed Style) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#0B1021] border border-white/10 p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {locale === 'ar' ? 'الرصيد المالي الكلي' : 'Total Platform Balance'}
              </span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                {showBalance ? formatDZD(totalBalance) : '•••••••• DZD'}
              </h2>
              {/* Mini Sparkline Bar Graphic */}
              <div className="flex items-end gap-1 h-8 shrink-0">
                {[30, 50, 45, 75, 60, 90, 100].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`w-2 rounded-t-sm ${i >= 5 ? 'bg-gold-400' : 'bg-slate-700'}`}
                  />
                ))}
              </div>
            </div>
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <span>+12.5%</span>
              <span className="text-slate-400 font-normal">
                {locale === 'ar' ? 'نمو الرصيد هذا الشهر مقارنة بالسابق' : 'Balance increase, Good progress'}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons Bar */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
            <button className="py-2 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-black transition-all flex items-center justify-center gap-1 shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'إيداع' : 'Add Funds'}</span>
            </button>
            <button className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1">
              <Send className="w-3.5 h-3.5 text-gold-400" />
              <span>{locale === 'ar' ? 'صرف CCP' : 'Payout'}</span>
            </button>
            <button className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>{locale === 'ar' ? 'تقرير' : 'Report'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Income & Inflow (Moneed Style) */}
        <div className="lg:col-span-3 rounded-3xl bg-[#0B1021] border border-white/10 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase">
                {locale === 'ar' ? 'إيرادات الشهر' : 'Income'}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              +18.4%
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-mono">
              {formatDZD(monthlyIncome)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {locale === 'ar' ? 'زيادة الإيرادات بنسبة 9.1% عن الشهر السابق.' : 'Income increased by 9.1% from last month.'}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Sub</span>
              <span className="text-white font-bold">3,800,000 DZD</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Cards</span>
              <span className="text-gold-400 font-bold">1,620,000 DZD</span>
            </div>
          </div>
        </div>

        {/* Card 3: Expenses & Payroll Liability (Moneed Style) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0B1021] border border-white/10 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase">
                {locale === 'ar' ? 'مستحقات الأساتذة المعلقة' : 'Expense & Payroll'}
              </span>
            </div>
            <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
              Pending
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
              {formatDZD(payrollLiability)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {locale === 'ar' ? 'جاهز للتحويل عبر بريد الجزائر (CCP).' : 'Ready for CCP payout batch.'}
            </p>
          </div>

          {/* Expense Ratio Bar */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="w-full h-2.5 rounded-full bg-white/10 flex overflow-hidden p-0.5">
              <div className="bg-gold-500 h-full rounded-full w-[50%]" title="Faculty" />
              <div className="bg-emerald-400 h-full rounded-full w-[30%] ml-1" title="Ambassadors" />
              <div className="bg-slate-600 h-full rounded-full w-[20%] ml-1" title="Ops" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold-500" /> Faculty (50%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Amb (30%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600" /> Ops (20%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. MIDDLE MATRIX: CASHFLOW CHART + SPENDING DONUT + GOALS GAUGE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cashflow Chart (Moneed & Finova Style) */}
        <div className="lg:col-span-6 rounded-3xl bg-[#0B1021] border border-white/10 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">
                {locale === 'ar' ? 'مخطط التدفقات النقدية (Cashflow Chart)' : 'Cashflow Chart'}
              </h3>
              <span className="text-xs text-slate-400 font-mono">INCOME VS. PAYOUT LIABILITY</span>
            </div>

            <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
              <button
                onClick={() => setChartPeriod('MONTH')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  chartPeriod === 'MONTH' ? 'bg-gold-500 text-navy-950 font-black' : 'text-slate-400'
                }`}
              >
                2026
              </button>
              <button
                onClick={() => setChartPeriod('ANNUAL')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  chartPeriod === 'ANNUAL' ? 'bg-gold-500 text-navy-950 font-black' : 'text-slate-400'
                }`}
              >
                6 Month
              </button>
            </div>
          </div>

          {/* Stacked Bars Visualizer with Hover Tooltip Card */}
          <div className="relative h-48 flex items-end justify-between gap-3 pt-6 px-3">
            {[
              { m: 'Jan', inc: 60, exp: 25 },
              { m: 'Feb', inc: 75, exp: 35 },
              { m: 'Mar', inc: 95, exp: 40, isHover: activeTooltipMonth === 'Mar' },
              { m: 'Apr', inc: 80, exp: 30 },
              { m: 'May', inc: 85, exp: 38 },
              { m: 'Jun', inc: 70, exp: 28 },
            ].map((bar) => (
              <div
                key={bar.m}
                onMouseEnter={() => setActiveTooltipMonth(bar.m)}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
              >
                {bar.isHover && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 p-2.5 rounded-xl bg-slate-900 border border-gold-500/40 shadow-xl text-[10px] font-mono text-white space-y-1 z-10">
                    <div className="text-gold-400 font-bold">{bar.m} 2026 Overview</div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-emerald-400">Income:</span>
                      <span>5,420,000 DZD</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-rose-400">Expense:</span>
                      <span>1,791,000 DZD</span>
                    </div>
                  </div>
                )}

                {/* Stacked Double Bar */}
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  <div
                    style={{ height: `${bar.inc}%` }}
                    className="w-3.5 sm:w-4 rounded-t-lg bg-gold-400 group-hover:bg-gold-300 transition-all shadow-sm"
                  />
                  <div
                    style={{ height: `${bar.exp}%` }}
                    className="w-3.5 sm:w-4 rounded-t-lg bg-emerald-500 group-hover:bg-emerald-400 transition-all shadow-sm"
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400">{bar.m}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-gold-400" /> {locale === 'ar' ? 'المداخيل (Income)' : 'Income'}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-500" /> {locale === 'ar' ? 'المستحقات (Payouts)' : 'Expense'}</span>
          </div>
        </div>

        {/* Spending & Track Breakdown Donut (Finova Style) */}
        <div className="lg:col-span-3 rounded-3xl bg-[#0B1021] border border-white/10 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white">
              {locale === 'ar' ? 'توزع المداخيل حسب المسار' : 'Revenue Breakdown'}
            </h3>
            <span className="text-xs text-gold-400 font-mono font-bold">2026</span>
          </div>

          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-gold-400"
                strokeDasharray="35, 100"
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray="25, 100"
                strokeDashoffset="-35"
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-sky-400"
                strokeDasharray="20, 100"
                strokeDashoffset="-60"
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-black font-mono">100%</span>
              <span className="text-[9px] text-slate-400 uppercase">National</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gold-400" /> BAC Packs</span>
              <span className="text-white font-bold">35%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> University LMD</span>
              <span className="text-white font-bold">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /> Medical & Health</span>
              <span className="text-white font-bold">20%</span>
            </div>
          </div>
        </div>

        {/* Goals & Reserve Arc Gauge (Moneed Style) */}
        <div className="lg:col-span-3 rounded-3xl bg-[#0B1021] border border-white/10 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white">
              {locale === 'ar' ? 'صندوق الأمان المالي' : 'Platform Goals & Reserve'}
            </h3>
            <Sparkles className="w-4 h-4 text-gold-400" />
          </div>

          {/* Half Circle Gauge */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center space-y-2">
            <span className="text-xs text-slate-400 font-mono block">Payroll Reserve Goal</span>
            <div className="text-2xl font-black text-gold-400 font-mono">
              {formatDZD(payrollLiability)}
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">/ 2,500,000 DZD Target</span>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-gold-500 to-emerald-400 rounded-full w-[72%]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Ambassador Payouts</span>
              <span className="text-emerald-400 font-bold">100% Ready</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Server & Meet Costs</span>
              <span className="text-gold-400 font-bold">Optimized</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. RECENT TRANSACTIONS STREAM (Images 4 & 5 Style) ================= */}
      <div className="rounded-3xl bg-[#0B1021] border border-white/10 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-black text-white">
              {locale === 'ar' ? 'سجل العمليات والتحويلات المالية المباشرة' : 'Recent Transaction Stream'}
            </h3>
            <p className="text-xs text-slate-400">
              {locale === 'ar' ? 'تحديث فوري لمدفوعات الطلبة، تفعيل البطاقات، وصرف مستحقات الأساتذة.' : 'Live platform ledger of subscriptions, payouts, and card verifications.'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gold-400 self-start sm:self-auto">
            LIVE TRANSACTIONS
          </span>
        </div>

        <div className="space-y-2.5">
          {transactions.map((tx) => {
            const isNegative = tx.amount < 0;
            return (
              <div
                key={tx.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 flex items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isNegative ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isNegative ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {locale === 'ar' ? tx.nameAr : tx.nameFr}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {tx.method} • {tx.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-sm sm:text-base font-black font-mono ${
                      isNegative ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {isNegative ? '' : '+'}
                    {formatDZD(tx.amount)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
