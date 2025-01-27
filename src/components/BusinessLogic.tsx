import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BusinessLogic = () => {
  const [rules, setRules] = useState<Array<{ id: string; name: string; logic: string; version: number }>>([]);
  const [name, setName] = useState("");
  const [logic, setLogic] = useState("");
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

      setRules(data.map(rule => ({
        id: rule.id,
        name: rule.rule_name,
        logic: rule.rule_definition.logic || '',
        version: rule.version
      })));
    } catch (error) {
      console.error('Error fetching rules:', error);
      toast({
        title: "Error",
        description: "Failed to fetch business rules",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !logic.trim()) return;
    
    try {
      const version = rules.filter(r => r.name === name).length + 1;
      
      const { data, error } = await supabase
        .from('businesslogicrules')
        .insert([{
          rule_name: name,
          rule_description: `Version ${version} of ${name}`,
          rule_definition: { logic },
          version
        }])
        .select()
        .single();

      if (error) throw error;

      setRules(prev => [...prev, {
        id: data.id,
        name: data.rule_name,
        logic: data.rule_definition.logic,
        version: data.version
      }]);
      
      setName("");
      setLogic("");
      
      toast({
        title: "Rule saved",
        description: `${name} v${version} has been saved successfully.`,
      });
    } catch (error) {
      console.error('Error saving rule:', error);
      toast({
        title: "Error",
        description: "Failed to save business rule",
        variant: "destructive",
      });
    }
  };

  const handleExecute = async (ruleId: string) => {
    try {
      toast({
        title: "Executing rule",
        description: "Rule execution started...",
      });
      // TODO: Implement rule execution logic
    } catch (error) {
      console.error('Error executing rule:', error);
      toast({
        title: "Error",
        description: "Failed to execute business rule",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Business Logic Generator</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rule Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter rule name..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Logic</label>
          <Textarea
            value={logic}
            onChange={(e) => setLogic(e.target.value)}
            placeholder="Enter business logic..."
            rows={4}
          />
        </div>
        <Button onClick={handleSave}>Save Rule</Button>
        
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Saved Rules</h3>
          <div className="space-y-2">
            {rules.map((rule) => (
              <Card key={rule.id} className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{rule.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">v{rule.version}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExecute(rule.id)}
                  >
                    Execute
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BusinessLogic;