import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const SystemAnalytics = () => {
  const { toast } = useToast();
  
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['system-analytics'],
    queryFn: async () => {
      try {
        const [usersCount, planningDataCount, businessRulesCount] = await Promise.all([
          supabase.from('userprofiles').select('*', { count: 'exact', head: true }),
          supabase.from('planningdata').select('*', { count: 'exact', head: true }),
          supabase.from('businesslogicrules').select('*', { count: 'exact', head: true })
        ]);

        if (usersCount.error) throw usersCount.error;
        if (planningDataCount.error) throw planningDataCount.error;
        if (businessRulesCount.error) throw businessRulesCount.error;

        return {
          users: usersCount.count || 0,
          planningData: planningDataCount.count || 0,
          businessRules: businessRulesCount.count || 0
        };
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch analytics: " + error.message,
          variant: "destructive",
        });
        throw error;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">
        Failed to load analytics. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">System Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.users || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Planning Data Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.planningData || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Business Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.businessRules || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};