import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BusinessRule {
  id: string;
  rule_name: string;
  rule_description: string | null;
  rule_definition: {
    logic: string;
    product_dimension_id?: string;
    region_dimension_id?: string;
    [key: string]: any;
  };
  version: number;
  created_at?: string;
  updated_at?: string;
}

interface RawBusinessRule {
  id: string;
  rule_name: string;
  rule_description: string | null;
  rule_definition: any;
  version: number;
  created_at?: string;
  updated_at?: string;
}

interface Dimension {
  id: string;
  dimension_name: string;
  identifier: string;
  description: string | null;
  hierarchy: string | null;
  attributes1: string | null;
}

const BusinessLogic = () => {
  const [rules, setRules] = useState<BusinessRule[]>([]);
  const [newRule, setNewRule] = useState({ 
    name: "", 
    description: "", 
    logic: "",
    product_dimension_id: "",
    region_dimension_id: "" 
  });
  const [dimensions1, setDimensions1] = useState<Dimension[]>([]);
  const [dimensions2, setDimensions2] = useState<Dimension[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRules();
    fetchDimensions();
  }, []);

  const transformRule = (rule: RawBusinessRule): BusinessRule => {
    let transformedDefinition: { logic: string; [key: string]: any };
    
    if (typeof rule.rule_definition === 'string') {
      transformedDefinition = { logic: rule.rule_definition };
    } else if (typeof rule.rule_definition === 'object' && rule.rule_definition !== null) {
      transformedDefinition = {
        logic: rule.rule_definition.logic || '',
        product_dimension_id: rule.rule_definition.product_dimension_id,
        region_dimension_id: rule.rule_definition.region_dimension_id,
        ...rule.rule_definition
      };
    } else {
      transformedDefinition = { logic: '' };
    }

    return {
      ...rule,
      rule_definition: transformedDefinition
    };
  };

  const fetchDimensions = async () => {
    try {
      const { data: products, error: error1 } = await supabase
        .from('m_u_product')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: regions, error: error2 } = await supabase
        .from('masterregiondimension')
        .select('*')
        .order('created_at', { ascending: false });

      if (error1) throw error1;
      if (error2) throw error2;

      setDimensions1(products || []);
      setDimensions2(regions || []);
    } catch (error) {
      console.error('Error fetching dimensions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dimensions",
        variant: "destructive",
      });
    }
  };

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('businesslogicrules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData: BusinessRule[] = (data || []).map(transformRule);
      setRules(transformedData);
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
          rule_definition: { 
            logic: newRule.logic,
            product_dimension_id: newRule.product_dimension_id || null,
            region_dimension_id: newRule.region_dimension_id || null
          }
        }])
        .select()
        .single();

      if (error) throw error;

      const transformedRule = transformRule(data);
      setRules(prev => [...prev, transformedRule]);
      setNewRule({ name: "", description: "", logic: "", product_dimension_id: "", region_dimension_id: "" });
      
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
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Dimension</label>
            <Select
              value={newRule.product_dimension_id}
              onValueChange={(value) => setNewRule(prev => ({ ...prev, product_dimension_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product..." />
              </SelectTrigger>
              <SelectContent>
                {dimensions1.map((dim) => (
                  <SelectItem key={dim.id} value={dim.id}>
                    {dim.description || dim.identifier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Region Dimension</label>
            <Select
              value={newRule.region_dimension_id}
              onValueChange={(value) => setNewRule(prev => ({ ...prev, region_dimension_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region..." />
              </SelectTrigger>
              <SelectContent>
                {dimensions2.map((dim) => (
                  <SelectItem key={dim.id} value={dim.id}>
                    {dim.region_description || dim.region_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
