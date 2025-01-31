import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const BusinessLogic = () => {
  const { data: rules, isLoading } = useQuery({
    queryKey: ['businessRules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('confg_business_logic_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Business Logic Rules</h2>
      <ul>
        {rules?.map(rule => (
          <li key={rule.id} className="mb-2">
            <h3 className="font-bold">{rule.rule_name}</h3>
            <p>{rule.rule_description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusinessLogic;
