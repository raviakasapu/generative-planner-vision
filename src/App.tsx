import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Admin from './pages/Admin';
import UserManagement from './pages/UserManagement';
import VersionManagement from './pages/VersionManagement';
import MasterDataManagement from './pages/MasterDataManagement';
import MasterDataTypes from './components/master-data/MasterDataTypes';

function App() {
  return (
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
  );
}

export default App;