import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const BusinessLogic = () => {
  const [rules, setRules] = useState<Array<{ name: string; logic: string; version: number }>>([]);
  const [name, setName] = useState("");
  const [logic, setLogic] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!name.trim() || !logic.trim()) return;
    
    const newRule = {
      name,
      logic,
      version: rules.filter(r => r.name === name).length + 1
    };
    
    setRules(prev => [...prev, newRule]);
    setName("");
    setLogic("");
    
    toast({
      title: "Rule saved",
      description: `${name} v${newRule.version} has been saved successfully.`,
    });
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
            {rules.map((rule, i) => (
              <Card key={i} className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{rule.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">v{rule.version}</span>
                  </div>
                  <Button variant="outline" size="sm">Execute</Button>
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