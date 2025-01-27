import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SystemAnalytics = () => {
  const { data: analytics } = useQuery({
    queryKey: ['system-analytics'],
    queryFn: async () => {
      const [usersCount, planningDataCount, businessRulesCount] = await Promise.all([
        supabase.from('userprofiles').select('*', { count: 'exact', head: true }),
        supabase.from('planningdata').select('*', { count: 'exact', head: true }),
        supabase.from('businesslogicrules').select('*', { count: 'exact', head: true })
      ]);

      return {
        users: usersCount.count || 0,
        planningData: planningDataCount.count || 0,
        businessRules: businessRulesCount.count || 0
      };
    }
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">System Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.users || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Planning Data Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.planningData || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Business Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.businessRules || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};