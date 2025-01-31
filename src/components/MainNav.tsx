import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MainNav() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mb-8">
      <Link
        to="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive('/') && "text-primary"
        )}
      >
        Home
      </Link>
      <Link
        to="/admin"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive('/admin') && "text-primary"
        )}
      >
        Administration
      </Link>
    </nav>
  );
}