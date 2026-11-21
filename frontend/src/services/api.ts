import {
  User,
  AirQualityData,
  ForecastData,
  EnvironmentalAlert,
  GeneratedReport,
  MonitoringStation
} from '../types';

const BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('urban_air_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const errData = await res.json();
      errorMsg = errData.detail || errData.message || errorMsg;
    } catch {
      // keep fallback message
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(data: { email: string; password: string; full_name: string; city: string }): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async googleLogin(data: { email: string; full_name: string; avatar_url?: string; city?: string }): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
      });
    } catch {
      // ignore
    }
    localStorage.removeItem('urban_air_token');
  },

  // Onboarding & Profile
  async completeOnboarding(data: any): Promise<User> {
    const res = await fetch(`${BASE_URL}/users/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateProfile(data: any): Promise<User> {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updatePreferences(data: any): Promise<any> {
    const res = await fetch(`${BASE_URL}/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Air Quality
  async getCurrentAirQuality(city: string = 'New York', standard: string = 'US_EPA'): Promise<AirQualityData> {
    const res = await fetch(`${BASE_URL}/air-quality/current?city=${encodeURIComponent(city)}&standard=${standard}`);
    return handleResponse(res);
  },

  async getHistory(city: string = 'New York', days: number = 7): Promise<any> {
    const res = await fetch(`${BASE_URL}/air-quality/history?city=${encodeURIComponent(city)}&days=${days}`);
    return handleResponse(res);
  },

  async getStations(city?: string): Promise<MonitoringStation[]> {
    const url = city ? `${BASE_URL}/air-quality/stations?city=${encodeURIComponent(city)}` : `${BASE_URL}/air-quality/stations`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async getCities(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/air-quality/cities`);
    return handleResponse(res);
  },

  // Advanced Global World Map & Satellite
  async getWorldMapTelemetry(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/air-quality/world-map`);
    return handleResponse(res);
  },

  async getGlobalRankings(): Promise<any> {
    const res = await fetch(`${BASE_URL}/air-quality/global-rankings`);
    return handleResponse(res);
  },

  async getSentinel5PData(): Promise<any> {
    const res = await fetch(`${BASE_URL}/air-quality/sentinel5p-data`);
    return handleResponse(res);
  },

  async getThermalInversion(city: string = 'New York'): Promise<any> {
    const res = await fetch(`${BASE_URL}/air-quality/inversion-detection?city=${encodeURIComponent(city)}`);
    return handleResponse(res);
  },

  async getSourceAttribution(city: string = 'New York'): Promise<any> {
    const res = await fetch(`${BASE_URL}/air-quality/source-attribution?city=${encodeURIComponent(city)}`);
    return handleResponse(res);
  },

  async getLoRaWANMesh(city: string = 'New York'): Promise<any> {
    const res = await fetch(`${BASE_URL}/air-quality/lorawan-mesh?city=${encodeURIComponent(city)}`);
    return handleResponse(res);
  },

  async getVisibilityCalculation(pm25: number, humidity: number, no2: number): Promise<any> {
    const res = await fetch(`${BASE_URL}/air-quality/visibility-calculation?pm25=${pm25}&humidity=${humidity}&no2=${no2}`);
    return handleResponse(res);
  },

  async getCommuteExposure(city: string, mode: string, route: string, duration: number): Promise<any> {
    const res = await fetch(`${BASE_URL}/air-quality/commute-exposure?city=${encodeURIComponent(city)}&mode=${mode}&route=${route}&duration_minutes=${duration}`);
    return handleResponse(res);
  },

  async getAudioBriefing(city: string, standard: string = 'US_EPA'): Promise<any> {
    const res = await fetch(`${BASE_URL}/air-quality/audio-briefing?city=${encodeURIComponent(city)}&standard=${standard}`);
    return handleResponse(res);
  },

  // Forecast
  async getHourlyForecast(city: string = 'New York'): Promise<any> {
    const res = await fetch(`${BASE_URL}/forecast/hourly?city=${encodeURIComponent(city)}`);
    return handleResponse(res);
  },

  async getDailyForecast(city: string = 'New York'): Promise<any> {
    const res = await fetch(`${BASE_URL}/forecast/daily?city=${encodeURIComponent(city)}`);
    return handleResponse(res);
  },

  // AI Assistant
  async sendAIChat(message: string, city: string = 'New York', conversationId?: number, aqiContext?: any): Promise<any> {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        message,
        city,
        conversation_id: conversationId,
        aqi_context: aqiContext,
      }),
    });
    return handleResponse(res);
  },

  // Alerts
  async getAlerts(): Promise<EnvironmentalAlert[]> {
    const res = await fetch(`${BASE_URL}/alerts/`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async markAlertRead(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/alerts/${id}/read`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async markAllAlertsRead(): Promise<void> {
    const res = await fetch(`${BASE_URL}/alerts/mark-all-read`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async triggerTestAlert(): Promise<EnvironmentalAlert> {
    const res = await fetch(`${BASE_URL}/alerts/test-trigger`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Analytics
  async getAnalyticsOverview(city: string = 'New York', days: number = 7): Promise<any> {
    const res = await fetch(`${BASE_URL}/analytics/overview?city=${encodeURIComponent(city)}&days=${days}`);
    return handleResponse(res);
  },

  async compareLocations(cities: string[]): Promise<any[]> {
    const params = cities.map(c => `cities=${encodeURIComponent(c)}`).join('&');
    const res = await fetch(`${BASE_URL}/analytics/locations?${params}`);
    return handleResponse(res);
  },

  // Reports
  async generateReport(data: { report_type: string; city: string; comparison_city?: string; include_ai_summary?: boolean }): Promise<GeneratedReport> {
    const res = await fetch(`${BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getReports(): Promise<GeneratedReport[]> {
    const res = await fetch(`${BASE_URL}/reports/`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getReportDownloadUrl(reportId: number): string {
    return `${BASE_URL}/reports/${reportId}/download`;
  },

  // Admin
  async getAdminDashboard(): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async updateUserRole(userId: number, role: 'user' | 'admin'): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ role }),
    });
    return handleResponse(res);
  },
};
