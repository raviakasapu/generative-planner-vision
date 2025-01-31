import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import Admin from './pages/Admin';
import UserManagement from './pages/UserManagement';
import VersionManagement from './pages/VersionManagement';
import MasterDataManagement from './pages/MasterDataManagement';
import Auth from './pages/Auth';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/versions" element={<VersionManagement />} />
              <Route path="/admin/master-data" element={<MasterDataManagement />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;