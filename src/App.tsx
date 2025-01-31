import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import Index from './pages/Index';
import Admin from './pages/Admin';
import UserManagement from './pages/UserManagement';
import VersionManagement from './pages/VersionManagement';
import MasterDataManagement from './pages/MasterDataManagement';
import MasterDataTypes from './components/master-data/MasterDataTypes';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/versions" element={<VersionManagement />} />
            <Route path="/admin/master-data" element={<MasterDataManagement />} />
            <Route path="/admin/master-data/types" element={<MasterDataTypes />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;