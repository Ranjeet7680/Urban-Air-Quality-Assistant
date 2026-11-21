from typing import Dict, Any, Tuple

# US EPA Breakpoints (Clow, Chigh, Ilow, Ihigh)
EPA_PM25_BREAKPOINTS = [
    (0.0, 12.0, 0, 50),
    (12.1, 35.4, 51, 100),
    (35.5, 55.4, 101, 150),
    (55.5, 150.4, 151, 200),
    (150.5, 250.4, 201, 300),
    (250.5, 500.4, 301, 500),
]

EPA_PM10_BREAKPOINTS = [
    (0, 54, 0, 50),
    (55, 154, 51, 100),
    (155, 254, 101, 150),
    (255, 354, 151, 200),
    (355, 424, 201, 300),
    (425, 604, 301, 500),
]

EPA_O3_BREAKPOINTS = [  # in µg/m³ approx 1 ppb ~ 2 µg/m³
    (0, 108, 0, 50),
    (109, 140, 51, 100),
    (141, 170, 101, 150),
    (171, 210, 151, 200),
    (211, 400, 201, 300),
    (401, 800, 301, 500),
]

EPA_NO2_BREAKPOINTS = [
    (0, 100, 0, 50),
    (101, 188, 51, 100),
    (189, 677, 101, 150),
    (678, 1222, 151, 200),
    (1223, 2349, 201, 300),
    (2350, 3849, 301, 500),
]

def calculate_sub_index(conc: float, breakpoints: list) -> int:
    for c_low, c_high, i_low, i_high in breakpoints:
        if c_low <= conc <= c_high:
            index = ((i_high - i_low) / (c_high - c_low)) * (conc - c_low) + i_low
            return round(index)
    if conc > breakpoints[-1][1]:
        return 500
    return 0

def get_aqi_category_and_color(aqi: int, standard: str = "US_EPA") -> Tuple[str, str, str]:
    """
    Returns (category_name, hex_color, health_summary)
    """
    if aqi <= 50:
        return (
            "Good",
            "#16A34A",  # green
            "Air quality is considered satisfactory, and air pollution poses little or no risk."
        )
    elif aqi <= 100:
        return (
            "Moderate",
            "#EAB308",  # yellow/amber
            "Air quality is acceptable; however, some pollutants may cause moderate health concern for sensitive individuals."
        )
    elif aqi <= 150:
        return (
            "Unhealthy for Sensitive Groups",
            "#F97316",  # orange
            "Members of sensitive groups may experience health effects. General public is less likely to be affected."
        )
    elif aqi <= 200:
        return (
            "Unhealthy",
            "#EF4444",  # red
            "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
        )
    elif aqi <= 300:
        return (
            "Very Unhealthy",
            "#A855F7",  # purple
            "Health alert: risk of health effects is increased for everyone in the urban area."
        )
    else:
        return (
            "Hazardous",
            "#881337",  # deep maroon
            "Health warning of emergency conditions: the entire population is more likely to be affected."
        )

# WHO 2021 Reference Guideline Limits (24-hour mean in µg/m³)
WHO_GUIDELINES = {
    "pm2_5": {"limit": 15.0, "unit": "µg/m³", "label": "WHO 24h Mean Limit (15 µg/m³)"},
    "pm10": {"limit": 45.0, "unit": "µg/m³", "label": "WHO 24h Mean Limit (45 µg/m³)"},
    "no2": {"limit": 25.0, "unit": "µg/m³", "label": "WHO 24h Mean Limit (25 µg/m³)"},
    "so2": {"limit": 40.0, "unit": "µg/m³", "label": "WHO 24h Mean Limit (40 µg/m³)"},
    "co": {"limit": 4000.0, "unit": "µg/m³", "label": "WHO 24h Mean Limit (4 mg/m³)"},
    "o3": {"limit": 100.0, "unit": "µg/m³", "label": "WHO 8h Peak Limit (100 µg/m³)"},
}

def get_pollutant_status(code: str, val: float) -> Tuple[str, str]:
    guideline = WHO_GUIDELINES.get(code, {}).get("limit", 50.0)
    ratio = val / guideline if guideline > 0 else 1.0
    if ratio <= 1.0:
        return ("Good", "Within WHO safe air thresholds")
    elif ratio <= 2.5:
        return ("Moderate", f"{round(ratio, 1)}x WHO guideline limit")
    elif ratio <= 5.0:
        return ("Unhealthy", f"{round(ratio, 1)}x WHO guideline limit")
    else:
        return ("Hazardous", f"{round(ratio, 1)}x severe pollution threshold")
