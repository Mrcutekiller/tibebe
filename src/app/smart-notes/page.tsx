'use client';

import DashboardLayout from '@/app/dashboard/layout';
import SmartNotesView from '@/components/smart-notes/SmartNotesView';

export default function SmartNotesPage() {
  return (
    <DashboardLayout>
      <SmartNotesView />
    </DashboardLayout>
  );
}
