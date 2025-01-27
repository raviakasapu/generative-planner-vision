import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "I understand you want to analyze the data. Let me help you with that.", 
        isUser: false 
      }]);
      toast({
        title: "Query processed",
        description: "The AI has processed your request.",
      });
    }, 1000);
    setInput("");
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-4 font-medium border-b">AI Assistant</div>
      <ScrollArea className="flex-grow p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-4 p-3 rounded-lg ${
              msg.isUser
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted"
            } max-w-[80%] ${msg.isUser ? "ml-auto" : "mr-auto"}`}
          >
            {msg.text}
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </Card>
  );
};

export default ChatInterface;