export interface User {
  id: number;
  email: string;
  full_name: string;
  city: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  profile?: UserProfile;
  preferences?: UserPreferences;
}

export interface UserProfile {
  preferred_aqi_standard: 'US_EPA' | 'WHO' | 'EAQI' | 'NAQI';
  health_conditions: string[];
  bio?: string;
  phone?: string;
  avatar_url?: string;
}

export interface UserPreferences {
  notification_email: boolean;
  notification_inapp: boolean;
  notification_push: boolean;
  aqi_alert_threshold: number;
  favorite_cities: string[];
  interests: string[];
  dark_mode: boolean;
}

export interface Pollutant {
  pollutant_code: string;
  pollutant_name: string;
  concentration: number;
  unit: string;
  standard_limit?: number;
  sub_index?: number;
  change_24h: number;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  standard_note: string;
}

export interface MonitoringStation {
  id: number;
  station_code: string;
  name: string;
  operator: string;
  sensor_type: string;
  latitude: number;
  longitude: number;
  elevation: number;
  status: string;
  city: string;
  country: string;
  current_aqi?: number;
  aqi_category?: string;
  aqi_color?: string;
  last_sync: string;
}

export interface AirQualityData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  observation_time: string;
  last_updated: string;
  data_source: string;
  aqi: number;
  aqi_category: string;
  aqi_color: string;
  dominant_pollutant: string;
  health_summary: string;
  temperature_c: number;
  humidity_percent: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  standard_used: string;
  station_info?: {
    name: string;
    station_code: string;
    operator: string;
    sensor_type: string;
    elevation: number;
    status: string;
  };
  pollutants: Pollutant[];
}

export interface HourlyForecast {
  time: string;
  timestamp: string;
  aqi: number;
  category: string;
  color: string;
  pm25: number;
  pm10: number;
  ozone?: number;
  temperature?: number;
}

export interface DailyForecast {
  date: string;
  iso_date: string;
  avg_aqi: number;
  max_aqi: number;
  min_aqi: number;
  category: string;
  color: string;
  dominant_pollutant: string;
  recommendation: string;
}

export interface ForecastData {
  city: string;
  provider: string;
  generated_at: string;
  confidence: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface EnvironmentalAlert {
  id: number;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'hazardous';
  alert_type: string;
  location_name: string;
  aqi_value?: number;
  is_read: boolean;
  created_at: string;
}

export interface GeneratedReport {
  id: number;
  title: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'location_comparison';
  location_name: string;
  period_start: string;
  period_end: string;
  avg_aqi: number;
  max_aqi: number;
  dominant_pollutant: string;
  summary: string;
  ai_analysis?: string;
  data_source: string;
  status: string;
  created_at: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  measured_badge?: string;
  forecast_badge?: string;
  ai_badge?: string;
  suggested_actions?: string[];
  citations?: string[];
  timestamp: string;
}
