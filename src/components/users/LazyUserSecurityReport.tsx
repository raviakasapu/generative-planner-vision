import { Suspense } from 'react';
import { UserSecurityReport } from './UserSecurityReport';
import { Card } from '@/components/ui/card';

interface LazyUserSecurityReportProps {
  userId: string;
}

export function LazyUserSecurityReport({ userId }: LazyUserSecurityReportProps) {
  return (
    <Suspense fallback={
      <Card className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    }>
      <UserSecurityReport userId={userId} />
    </Suspense>
  );
}