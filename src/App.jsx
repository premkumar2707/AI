import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const FindCenters = lazy(() => import('./pages/FindCenters'));
const LiveTracker = lazy(() => import('./pages/LiveTracker'));
const StaffDashboard = lazy(() => import('./pages/StaffDashboard'));
const KioskMode = lazy(() => import('./pages/KioskMode'));
const SimulationDemo = lazy(() => import('./pages/SimulationDemo'));
const SmartVisitPlanner = lazy(() => import('./pages/SmartVisitPlanner'));

const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="find-centers" element={<FindCenters />} />
            <Route path="live-status" element={<LiveTracker />} />
            <Route path="smart-planner" element={<SmartVisitPlanner />} />
            <Route path="simulation" element={<SimulationDemo />} />
            <Route path="my-tokens" element={<div className="p-20 text-center text-3xl font-black text-slate-200">My Tokens Page</div>} />
            <Route path="admin-login" element={<div className="p-20 text-center text-3xl font-black text-slate-200">Admin Login Page</div>} />
            <Route path="staff" element={<StaffDashboard />} />
          </Route>
          <Route path="kiosk" element={<KioskMode />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
