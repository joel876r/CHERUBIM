import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { TabId } from './components/Navbar';
import { OverviewView } from './components/OverviewView';
import { LiveMonitorView } from './components/LiveMonitorView';
import { AirfareIndexView } from './components/AirfareIndexView';
import { RouteIntelligenceView } from './components/RouteIntelligenceView';
import { FareExplorerView } from './components/FareExplorerView';
import { TrustEngineView } from './components/TrustEngineView';
import { ConsensusView } from './components/ConsensusView';
import { InflationDecompositionView } from './components/InflationDecompositionView';
import { DataPipelineView } from './components/DataPipelineView';
import { ReproducibilityLedgerView } from './components/ReproducibilityLedgerView';
import { ApiExplorerView } from './components/ApiExplorerView';
import { SystemHealthView } from './components/SystemHealthView';
import { FareFingerprintModal } from './components/FareFingerprintModal';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';

import { 
  APIxCurrent, HistoricalPoint, RouteMeta, 
  LeadTimeData, InflationDecomposition, QualitySummary, 
  FareObservation, UserProfile
} from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<string>('DEL-BOM');
  const [selectedObservation, setSelectedObservation] = useState<FareObservation | null>(null);

  // User Authentication State: Show Login Page First!
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const isAuth = sessionStorage.getItem('cherubim_authenticated');
      const saved = localStorage.getItem('cherubim_user');
      if (isAuth === 'true' && saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Dr. Rajesh Sharma' || parsed.name === 'Alexander') {
          parsed.name = 'R Joel';
          parsed.avatarInitials = 'RJ';
          parsed.email = 'joel@mospi.gov.in';
          localStorage.setItem('cherubim_user', JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed reading user session:', e);
    }
    // null enforces display of LoginPage first
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const handleLoginSuccess = (user: UserProfile) => {
    sessionStorage.setItem('cherubim_authenticated', 'true');
    localStorage.setItem('cherubim_user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cherubim_authenticated');
    localStorage.removeItem('cherubim_user');
    setCurrentUser(null);
  };

  // Core Data States
  const [currentAPIx, setCurrentAPIx] = useState<APIxCurrent | null>(null);
  const [history, setHistory] = useState<HistoricalPoint[]>([]);
  const [routes, setRoutes] = useState<RouteMeta[]>([]);
  const [leadTime, setLeadTime] = useState<LeadTimeData | null>(null);
  const [inflation, setInflation] = useState<InflationDecomposition | null>(null);
  const [quality, setQuality] = useState<QualitySummary | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      const [cur, hist, rts, lt, inf, qual] = await Promise.all([
        api.getCurrentAPIx().catch(() => null),
        api.getHistoricalAPIx('daily').catch(() => []),
        api.getRoutes().catch(() => []),
        api.getLeadTimePressure().catch(() => null),
        api.getInflationDecomposition().catch(() => null),
        api.getQualitySummary().catch(() => null),
      ]);

      if (cur) setCurrentAPIx(cur);
      if (hist) setHistory(hist);
      if (rts) setRoutes(rts);
      if (lt) setLeadTime(lt);
      if (inf) setInflation(inf);
      if (qual) setQuality(qual);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleExport = (format: 'csv' | 'json') => {
    window.open(api.getExportUrl(format), '_blank');
  };

  // 1. Mandatory Gate: Display LoginPage first before revealing application
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Full Application Cockpit
  return (
    <div className="min-h-screen bg-[#06080E] text-slate-100 flex items-center justify-center p-2 sm:p-4 lg:p-6 relative overflow-hidden font-sans">
      {/* Warm Golden/Amber Ambient Spotlight in Background Top-Left */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-amber-600/15 via-orange-600/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-gradient-to-tl from-blue-600/10 via-cyan-600/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

      {/* CHERUBIM Executive Framed Cockpit Tablet Container */}
      <div className="w-full max-w-[1720px] h-[96vh] rounded-[26px] bg-[#0E1119] border border-neutral-700/50 shadow-2xl overflow-hidden flex flex-row relative z-10">
        
        {/* 1. Left Vertical Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 2. Main Center & Right Cockpit View */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0A0D15]">
          {/* Top Header */}
          <TopHeader
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            isLiveMode={isLiveMode}
            setIsLiveMode={setIsLiveMode}
            onRefresh={loadAllData}
            isRefreshing={isRefreshing}
          />

          {/* Scrollable View Container */}
          <main className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {activeTab === 'overview' && (
              <OverviewView
                currentAPIx={currentAPIx}
                history={history}
                routes={routes}
                leadTime={leadTime}
                inflation={inflation}
                quality={quality}
                onNavigate={setActiveTab}
                selectedRoute={selectedRoute}
                onSelectRoute={setSelectedRoute}
                onSelectObservation={setSelectedObservation}
              />
            )}

            {activeTab === 'fare_explorer' && (
              <FareExplorerView
                onSelectObservation={setSelectedObservation}
                initialRoute={selectedRoute}
              />
            )}

            {activeTab === 'route_dna' && (
              <RouteIntelligenceView
                routes={routes}
                selectedRoute={selectedRoute}
                onSelectRoute={setSelectedRoute}
              />
            )}

            {activeTab === 'consensus' && <ConsensusView />}

            {activeTab === 'trust_engine' && <TrustEngineView />}

            {activeTab === 'pipeline' && <DataPipelineView />}

            {activeTab === 'apix_index' && (
              <AirfareIndexView
                currentAPIx={currentAPIx}
                history={history}
                routes={routes}
                onExportLedger={handleExport}
              />
            )}

            {activeTab === 'inflation' && (
              <InflationDecompositionView
                inflation={inflation}
                onSelectRoute={setSelectedRoute}
                onNavigateToDNA={() => setActiveTab('route_dna')}
              />
            )}

            {activeTab === 'ledger' && (
              <ReproducibilityLedgerView
                currentAPIx={currentAPIx}
                routes={routes}
                onExport={handleExport}
              />
            )}

            {activeTab === 'api_explorer' && <ApiExplorerView />}

            {activeTab === 'system_health' && <SystemHealthView />}
          </main>
        </div>
      </div>

      {/* Signature Feature: Fare Fingerprint Modal */}
      <FareFingerprintModal
        observation={selectedObservation}
        onClose={() => setSelectedObservation(null)}
      />

      {/* Government Officer Authentication / Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}

export default App;
