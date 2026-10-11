import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout.jsx';
import { Dashboard } from './pages/Dashboard/Dashboard.jsx';
import { Apartments } from './pages/Apartments/Apartments.tsx';
import { Tenants } from './pages/Tenants/Tenants.tsx';
import { Payments } from './pages/Payments/Payments.jsx';
import { Settings } from './pages/Settings/Settings.jsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
