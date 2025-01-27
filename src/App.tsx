import { BrowserRouter as Router } from 'react-router-dom';
import Index from './pages/Index';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Index />
      </AuthProvider>
    </Router>
  );
}

export default App;