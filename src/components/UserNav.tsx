import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function UserNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have successfully signed out.",
    });
    navigate('/auth');
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        {format(new Date(), 'MMMM d, yyyy')}
      </div>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback>{user ? getInitials(user.email || '') : '?'}</AvatarFallback>
        </Avatar>
        <div className="hidden md:block">
          <p className="text-sm font-medium">{user?.email}</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}