import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BusinessRule {
  id: string;
  rule_name: string;
  rule_description: string | null;
  rule_definition: {
    logic: string;
    [key: string]: any;
  };
  version: number;
}

const BusinessLogic = () => {
  const [rules, setRules] = useState<BusinessRule[]>([]);
  const [newRule, setNewRule] = useState({ name: "", description: "", logic: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('businesslogicrules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
      toast({
        title: "Error",
        description: "Failed to fetch business rules",
        variant: "destructive",
      });
    }
  };

  const handleAddRule = async () => {
    if (!newRule.name || !newRule.logic) return;
    
    try {
      const { data, error } = await supabase
        .from('businesslogicrules')
        .insert([{
          rule_name: newRule.name,
          rule_description: newRule.description || null,
          rule_definition: { logic: newRule.logic }
        }])
        .select()
        .single();

      if (error) throw error;

      setRules(prev => [...prev, data]);
      setNewRule({ name: "", description: "", logic: "" });
      
      toast({
        title: "Rule added",
        description: `${newRule.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding rule:', error);
      toast({
        title: "Error",
        description: "Failed to add business rule",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Business Logic Rules</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rule Name</label>
            <Input
              value={newRule.name}
              onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter rule name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={newRule.description}
              onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter rule description..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logic</label>
            <Input
              value={newRule.logic}
              onChange={(e) => setNewRule(prev => ({ ...prev, logic: e.target.value }))}
              placeholder="Enter rule logic..."
            />
          </div>
        </div>
        <Button onClick={handleAddRule}>Add Rule</Button>
        
        <ScrollArea className="h-[300px] border rounded-md p-4">
          <div className="space-y-2">
            {rules.map((rule) => (
              <Card key={rule.id} className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{rule.rule_name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({rule.rule_definition.logic})
                    </span>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default BusinessLogic;