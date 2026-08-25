'use client';

import React from 'react';
import { AmbassadorDirectory } from '@/components/ambassadors/AmbassadorDirectory';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function AmbassadorsPage() {
  const { t } = useTranslation();

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <AmbassadorDirectory />
    </div>
  );
}
