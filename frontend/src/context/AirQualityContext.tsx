import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AirQualityData, EnvironmentalAlert } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface AirQualityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedStandard: string;
  setSelectedStandard: (standard: string) => void;
  airQuality: AirQualityData | null;
  isLoadingAQ: boolean;
  refreshAQ: () => Promise<void>;
  alerts: EnvironmentalAlert[];
  unreadAlertsCount: number;
  refreshAlerts: () => Promise<void>;
  markAlertRead: (id: number) => Promise<void>;
  markAllAlertsRead: () => Promise<void>;
}

const AirQualityContext = createContext<AirQualityContextType | undefined>(undefined);

export const AirQualityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>(() => user?.city || 'New York');
  const [selectedStandard, setSelectedStandard] = useState<string>(() => user?.profile?.preferred_aqi_standard || 'US_EPA');
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [isLoadingAQ, setIsLoadingAQ] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<EnvironmentalAlert[]>([]);

  // Update selected city if user changes city
  useEffect(() => {
    if (user?.city && user.city !== selectedCity) {
      setSelectedCity(user.city);
    }
  }, [user?.city, selectedCity]);

  const loadAirQuality = useCallback(async () => {
    setIsLoadingAQ(true);
    try {
      const data = await api.getCurrentAirQuality(selectedCity, selectedStandard);
      setAirQuality(data);
    } catch (err) {
      console.error('Error fetching current air quality:', err);
    } finally {
      setIsLoadingAQ(false);
    }
  }, [selectedCity, selectedStandard]);

  const loadAlerts = async () => {
    try {
      const list = await api.getAlerts();
      setAlerts(list);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  useEffect(() => {
    loadAirQuality();
  }, [loadAirQuality]);

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const markAlertRead = async (id: number) => {
    try {
      await api.markAlertRead(id);
      setAlerts(prev => prev.map(a => (a.id === id ? { ...a, is_read: true } : a)));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAlertsRead = async () => {
    try {
      await api.markAllAlertsRead();
      setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadAlertsCount = alerts.filter(a => !a.is_read).length;

  return (
    <AirQualityContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        selectedStandard,
        setSelectedStandard,
        airQuality,
        isLoadingAQ,
        refreshAQ: loadAirQuality,
        alerts,
        unreadAlertsCount,
        refreshAlerts: loadAlerts,
        markAlertRead,
        markAllAlertsRead,
      }}
    >
      {children}
    </AirQualityContext.Provider>
  );
};

export const useAirQuality = (): AirQualityContextType => {
  const context = useContext(AirQualityContext);
  if (!context) {
    throw new Error('useAirQuality must be used within an AirQualityProvider');
  }
  return context;
};
