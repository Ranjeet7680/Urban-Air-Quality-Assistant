# Urban Air Quality Assistant — API Reference Manual

The **Urban Air Quality Assistant API** delivers real-time physical sensor telemetry, atmospheric dispersion modeling, multi-pollutant indices, and grounded AI health intelligence.

Base URL: `http://127.0.0.1:8005/api` (or proxied via `/api` in frontend)

---

## 1. Authentication & Session Security

### `POST /auth/register`
Creates a new citizen account and seeds default preferences and initial welcome alerts.
- **Payload**:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!",
    "full_name": "Dr. Alex Rivera",
    "city": "London"
  }
  ```
- **Response `200 OK`**: Returns JWT access token and user profile object.

### `POST /auth/login`
Authenticates existing credentials.
- **Payload**:
  ```json
  {
    "email": "sarah.chen@urbanair.io",
    "password": "UserPass123!"
  }
  ```

### `POST /auth/google-login`
Simulated or OAuth Google session exchange.

### `GET /auth/me`
Retrieves currently authenticated user with profile, default city, and notification preferences. Requires `Authorization: Bearer <TOKEN>`.

---

## 2. Air Quality Telemetry

### `GET /air-quality/current`
Fetches real-time physical telemetry for the requested city.
- **Query Parameters**:
  - `city` (string, default: `New York`)
  - `standard` (string: `US_EPA`, `WHO`, `EAQI`, `NAQI`)
- **Response `200 OK`**:
  ```json
  {
    "city": "New York",
    "country": "United States",
    "latitude": 40.71,
    "longitude": -74.01,
    "aqi": 82,
    "aqi_category": "Moderate",
    "aqi_color": "#EAB308",
    "dominant_pollutant": "PM2.5",
    "data_source": "Open-Meteo / Copernicus Atmosphere Monitoring Service (CAMS)",
    "temperature_c": 9.5,
    "humidity_percent": 76.0,
    "wind_speed_kmh": 7.2,
    "pollutants": [
      {
        "pollutant_code": "pm2_5",
        "pollutant_name": "Particulate Matter PM2.5",
        "concentration": 27.0,
        "unit": "µg/m³",
        "standard_limit": 15.0,
        "status": "Moderate"
      }
    ]
  }
  ```

### `GET /air-quality/stations`
Lists active physical reference monitoring stations across global metropolises.

### `GET /air-quality/history`
Returns hourly retrospective time-series for the specified number of days (1 to 90).

---

## 3. Atmospheric Forecasting

### `GET /forecast/hourly?city={city}`
Delivers next 24-hour hour-by-hour projected AQI, PM2.5, PM10, Ozone, and ambient temperatures.

### `GET /forecast/daily?city={city}`
Provides 7-day extended forecast with daily peak ranges, dominant pollutant, and activity guidance.

---

## 4. AirSense AI Assistant

### `POST /ai/chat`
Conversational endpoint grounded strictly in real-time physical telemetry.
- **Payload**:
  ```json
  {
    "message": "Is it safe to go for a run in London right now?",
    "city": "London"
  }
  ```
- **Response**:
  - `reply`: Markdown-structured answer clearly segregating `[MEASURED OBSERVATION]`, `[MODEL FORECAST]`, and `[AI SCIENTIFIC EXPLANATION]`.
  - `suggested_actions`: Specific preventive actions.
  - `citations`: Verified environmental health references (WHO 2021, US EPA NAAQS).

---

## 5. Surveillance & Alerts

- `GET /alerts/`: Lists active notifications.
- `PUT /alerts/{id}/read`: Marks alert as acknowledged.
- `POST /alerts/test-trigger`: Simulates immediate spike alert for end-to-end verification.
- `POST /alerts/preferences`: Updates AQI threshold trigger level.

---

## 6. Reports & Audits

- `POST /reports/generate`: Compiles Daily, Weekly, Monthly, or Comparative reports.
- `GET /reports/`: Lists archived audit reports.
- `GET /reports/{id}/download`: Exports report as clean CSV.

---

## 7. Administrative Control

- `GET /admin/dashboard`: Metrics for registered users, active stations, total telemetry, and upstream pipelines.
- `GET /admin/users`: User directory.
- `PUT /admin/users/{id}/role`: Updates user role (`user` vs `admin`).
- `GET /admin/audit-logs`: Immutable security ledger.
