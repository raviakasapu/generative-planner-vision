import { Link } from "react-router-dom";

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mb-8">
      <Link
        to="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        to="/versions"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Version Management
      </Link>
      <Link
        to="/users"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        User Management
      </Link>
      <Link
        to="/master-data"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Master Data
      </Link>
    </nav>
  );
}