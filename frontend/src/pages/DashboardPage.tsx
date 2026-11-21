import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { OverviewView } from './dashboard/OverviewView';
import { WorldMapView } from './dashboard/WorldMapView';
import { LiveAirQualityView } from './dashboard/LiveAirQualityView';
import { PollutionMapView } from './dashboard/PollutionMapView';
import { AirSenseAIView } from './dashboard/AirSenseAIView';
import { AdvancedTechView } from './dashboard/AdvancedTechView';
import { ForecastView } from './dashboard/ForecastView';
import { HealthRecommendationsView } from './dashboard/HealthRecommendationsView';
import { HistoricalAnalyticsView } from './dashboard/HistoricalAnalyticsView';
import { AlertsView } from './dashboard/AlertsView';
import { ReportsView } from './dashboard/ReportsView';
import { SettingsView } from './dashboard/SettingsView';
import { AdminView } from './dashboard/AdminView';

export const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [currentTab, setCurrentTab] = useState<string>(initialTab);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    setSearchParams({ tab: tabId });
  };

  return (
    <DashboardLayout currentTab={currentTab} onTabChange={handleTabChange}>
      {currentTab === 'overview' && <OverviewView onNavigateTab={handleTabChange} />}
      {currentTab === 'world-map' && <WorldMapView onNavigateTab={handleTabChange} />}
      {currentTab === 'live-aqi' && <LiveAirQualityView />}
      {currentTab === 'pollution-map' && <PollutionMapView />}
      {currentTab === 'airsense-ai' && <AirSenseAIView />}
      {currentTab === 'advanced-tech' && <AdvancedTechView />}
      {currentTab === 'forecast' && <ForecastView />}
      {currentTab === 'health' && <HealthRecommendationsView />}
      {currentTab === 'analytics' && <HistoricalAnalyticsView />}
      {currentTab === 'alerts' && <AlertsView />}
      {currentTab === 'reports' && <ReportsView />}
      {currentTab === 'settings' && <SettingsView />}
      {currentTab === 'admin' && <AdminView />}
    </DashboardLayout>
  );
};
