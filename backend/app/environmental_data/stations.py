from typing import List, Dict, Any

GLOBAL_CITIES: Dict[str, Dict[str, Any]] = {
    # NORTH AMERICA
    "New York": {
        "city": "New York",
        "country": "United States",
        "continent": "North America",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "timezone": "America/New_York",
        "stations": [
            {
                "station_code": "NYC-MN-01",
                "name": "Manhattan Central Park Station",
                "operator": "New York DEC / EPA Region 2",
                "sensor_type": "Thermo Fisher 5014i Continuous BAM",
                "latitude": 40.7829,
                "longitude": -73.9654,
                "elevation": 42.0,
                "status": "active"
            },
            {
                "station_code": "NYC-BK-02",
                "name": "Brooklyn Queens Expressway Station",
                "operator": "New York DEC",
                "sensor_type": "Teledyne T640x Optical PM",
                "latitude": 40.6925,
                "longitude": -73.9904,
                "elevation": 18.0,
                "status": "active"
            }
        ]
    },
    "Los Angeles": {
        "city": "Los Angeles",
        "country": "United States",
        "continent": "North America",
        "latitude": 34.0522,
        "longitude": -118.2437,
        "timezone": "America/Los_Angeles",
        "stations": [
            {
                "station_code": "LAX-DT-01",
                "name": "Downtown LA North Main Station",
                "operator": "South Coast AQMD",
                "sensor_type": "BAM-1020 & UV Photometric O3",
                "latitude": 34.0664,
                "longitude": -118.2268,
                "elevation": 87.0,
                "status": "active"
            }
        ]
    },
    "Chicago": {
        "city": "Chicago",
        "country": "United States",
        "continent": "North America",
        "latitude": 41.8781,
        "longitude": -87.6298,
        "timezone": "America/Chicago",
        "stations": [
            {
                "station_code": "ORD-LP-01",
                "name": "Loop Lakefront Atmospheric Monitor",
                "operator": "Illinois EPA",
                "sensor_type": "Met One BAM-1020",
                "latitude": 41.8827,
                "longitude": -87.6233,
                "elevation": 181.0,
                "status": "active"
            }
        ]
    },
    "Toronto": {
        "city": "Toronto",
        "country": "Canada",
        "continent": "North America",
        "latitude": 43.6532,
        "longitude": -79.3832,
        "timezone": "America/Toronto",
        "stations": [
            {
                "station_code": "YYZ-DT-01",
                "name": "Toronto Bay Street Air Observatory",
                "operator": "Ontario Ministry of the Environment",
                "sensor_type": "FIDAS 200 Optical Aerosol",
                "latitude": 43.6515,
                "longitude": -79.3802,
                "elevation": 90.0,
                "status": "active"
            }
        ]
    },
    "Mexico City": {
        "city": "Mexico City",
        "country": "Mexico",
        "continent": "North America",
        "latitude": 19.4326,
        "longitude": -99.1332,
        "timezone": "America/Mexico_City",
        "stations": [
            {
                "station_code": "MEX-CH-01",
                "name": "Chapultepec Valley Station",
                "operator": "SEDEMA SIMAT",
                "sensor_type": "Thermo BAM-1020 Continuous",
                "latitude": 19.4204,
                "longitude": -99.1820,
                "elevation": 2240.0,
                "status": "active"
            }
        ]
    },

    # EUROPE
    "London": {
        "city": "London",
        "country": "United Kingdom",
        "continent": "Europe",
        "latitude": 51.5074,
        "longitude": -0.1278,
        "timezone": "Europe/London",
        "stations": [
            {
                "station_code": "LON-WM-01",
                "name": "Westminster Marylebone Road",
                "operator": "Defra / King's College London",
                "sensor_type": "FIDAS 200 Optical Spectrometer",
                "latitude": 51.5225,
                "longitude": -0.1546,
                "elevation": 35.0,
                "status": "active"
            },
            {
                "station_code": "LON-BL-02",
                "name": "Bloomsbury Russell Square",
                "operator": "London Air Quality Network (LAQN)",
                "sensor_type": "TEOM-FDMS 1405-DF",
                "latitude": 51.5218,
                "longitude": -0.1301,
                "elevation": 28.0,
                "status": "active"
            }
        ]
    },
    "Paris": {
        "city": "Paris",
        "country": "France",
        "continent": "Europe",
        "latitude": 48.8566,
        "longitude": 2.3522,
        "timezone": "Europe/Paris",
        "stations": [
            {
                "station_code": "PAR-CE-01",
                "name": "Champs-Élysées Haussmann Monitor",
                "operator": "Airparif",
                "sensor_type": "Thermo TEOM Microbalance",
                "latitude": 48.8718,
                "longitude": 2.3023,
                "elevation": 45.0,
                "status": "active"
            }
        ]
    },
    "Berlin": {
        "city": "Berlin",
        "country": "Germany",
        "continent": "Europe",
        "latitude": 52.5200,
        "longitude": 13.4050,
        "timezone": "Europe/Berlin",
        "stations": [
            {
                "station_code": "BER-MT-01",
                "name": "Berlin Mitte Alexanderplatz Station",
                "operator": "Senatsverwaltung für Umwelt Berlin",
                "sensor_type": "Continuous Chemiluminescence & Photometer",
                "latitude": 52.5219,
                "longitude": 13.4132,
                "elevation": 34.0,
                "status": "active"
            }
        ]
    },
    "Madrid": {
        "city": "Madrid",
        "country": "Spain",
        "continent": "Europe",
        "latitude": 40.4168,
        "longitude": -3.7038,
        "timezone": "Europe/Madrid",
        "stations": [
            {
                "station_code": "MAD-PR-01",
                "name": "Retiro Royal Park Air Observatory",
                "operator": "Ayuntamiento de Madrid",
                "sensor_type": "Grimm Aerosol Optical BAM",
                "latitude": 40.4153,
                "longitude": -3.6844,
                "elevation": 667.0,
                "status": "active"
            }
        ]
    },
    "Stockholm": {
        "city": "Stockholm",
        "country": "Sweden",
        "continent": "Europe",
        "latitude": 59.3293,
        "longitude": 18.0686,
        "timezone": "Europe/Stockholm",
        "stations": [
            {
                "station_code": "ARN-VG-01",
                "name": "Södermalm Hornsgatan Clean Air Sensor",
                "operator": "Stockholms Luft- och Bulleranalys",
                "sensor_type": "TEOM Optical BAM-1020",
                "latitude": 59.3175,
                "longitude": 18.0531,
                "elevation": 24.0,
                "status": "active"
            }
        ]
    },
    "Zurich": {
        "city": "Zurich",
        "country": "Switzerland",
        "continent": "Europe",
        "latitude": 47.3769,
        "longitude": 8.5417,
        "timezone": "Europe/Zurich",
        "stations": [
            {
                "station_code": "ZRH-KB-01",
                "name": "Kaserne Urban Clean Air Base",
                "operator": "NABEL Switzerland",
                "sensor_type": "Empa Multi-Gas Spectrometer",
                "latitude": 47.3779,
                "longitude": 8.5302,
                "elevation": 410.0,
                "status": "active"
            }
        ]
    },

    # ASIA & PACIFIC
    "Delhi": {
        "city": "Delhi",
        "country": "India",
        "continent": "Asia",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "timezone": "Asia/Kolkata",
        "stations": [
            {
                "station_code": "DEL-AV-01",
                "name": "Anand Vihar Clean Air Station",
                "operator": "Central Pollution Control Board (CPCB)",
                "sensor_type": "Met One BAM 1020 Beta Attenuation",
                "latitude": 28.6476,
                "longitude": 77.3158,
                "elevation": 210.0,
                "status": "active"
            },
            {
                "station_code": "DEL-ITO-02",
                "name": "ITO Junction Environmental Monitor",
                "operator": "DPCC / CPCB",
                "sensor_type": "Grimm EDM 180 Optical Aerosol Spectrometer",
                "latitude": 28.6289,
                "longitude": 77.2415,
                "elevation": 215.0,
                "status": "active"
            }
        ]
    },
    "Mumbai": {
        "city": "Mumbai",
        "country": "India",
        "continent": "Asia",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "timezone": "Asia/Kolkata",
        "stations": [
            {
                "station_code": "BOM-CL-01",
                "name": "Colaba Coastal Air Station",
                "operator": "MPCB / SAFAR",
                "sensor_type": "Beta Attenuation Monitor",
                "latitude": 18.9067,
                "longitude": 72.8147,
                "elevation": 10.0,
                "status": "active"
            }
        ]
    },
    "Tokyo": {
        "city": "Tokyo",
        "country": "Japan",
        "continent": "Asia",
        "latitude": 35.6762,
        "longitude": 139.6503,
        "timezone": "Asia/Tokyo",
        "stations": [
            {
                "station_code": "TYO-SJ-01",
                "name": "Shinjuku Metropolitan Monitoring Station",
                "operator": "Tokyo Metropolitan Environmental Bureau",
                "sensor_type": "Beta-ray Absorption / NDIR Monitor",
                "latitude": 35.6895,
                "longitude": 139.6917,
                "elevation": 40.0,
                "status": "active"
            }
        ]
    },
    "Beijing": {
        "city": "Beijing",
        "country": "China",
        "continent": "Asia",
        "latitude": 39.9042,
        "longitude": 116.4074,
        "timezone": "Asia/Shanghai",
        "stations": [
            {
                "station_code": "PEK-CY-01",
                "name": "Chaoyang Olympic Park Station",
                "operator": "Beijing Municipal Ecological Environment Bureau",
                "sensor_type": "BAM-1020 & Gas Filter Correlation CO",
                "latitude": 40.0029,
                "longitude": 116.3905,
                "elevation": 43.0,
                "status": "active"
            }
        ]
    },
    "Seoul": {
        "city": "Seoul",
        "country": "South Korea",
        "continent": "Asia",
        "latitude": 37.5665,
        "longitude": 126.9780,
        "timezone": "Asia/Seoul",
        "stations": [
            {
                "station_code": "ICN-JN-01",
                "name": "Jongno-gu Environmental Central",
                "operator": "Korea Environment Corporation (AirKorea)",
                "sensor_type": "Beta-ray Absorption Teledyne 602",
                "latitude": 37.5720,
                "longitude": 127.0050,
                "elevation": 55.0,
                "status": "active"
            }
        ]
    },
    "Singapore": {
        "city": "Singapore",
        "country": "Singapore",
        "continent": "Asia",
        "latitude": 1.3521,
        "longitude": 103.8198,
        "timezone": "Asia/Singapore",
        "stations": [
            {
                "station_code": "SIN-MB-01",
                "name": "Marina Bay Coastal Air Observatory",
                "operator": "National Environment Agency (NEA)",
                "sensor_type": "Laser Particle & Gas Analyzer",
                "latitude": 1.2840,
                "longitude": 103.8607,
                "elevation": 8.0,
                "status": "active"
            }
        ]
    },
    "Sydney": {
        "city": "Sydney",
        "country": "Australia",
        "continent": "Oceania",
        "latitude": -33.8688,
        "longitude": 151.2093,
        "timezone": "Australia/Sydney",
        "stations": [
            {
                "station_code": "SYD-CBD-01",
                "name": "Sydney Observatory Hill Station",
                "operator": "NSW Department of Planning and Environment",
                "sensor_type": "TEOM Ambient Particulate Monitor",
                "latitude": -33.8596,
                "longitude": 151.2048,
                "elevation": 41.0,
                "status": "active"
            }
        ]
    },

    # MIDDLE EAST & AFRICA
    "Dubai": {
        "city": "Dubai",
        "country": "United Arab Emirates",
        "continent": "Middle East",
        "latitude": 25.2048,
        "longitude": 55.2708,
        "timezone": "Asia/Dubai",
        "stations": [
            {
                "station_code": "DXB-ZF-01",
                "name": "Zabeel Park Air Quality Station",
                "operator": "Dubai Municipality Environment Dept",
                "sensor_type": "Thermo Continuous Optical & DustTrak",
                "latitude": 25.2345,
                "longitude": 55.2980,
                "elevation": 12.0,
                "status": "active"
            }
        ]
    },
    "Cairo": {
        "city": "Cairo",
        "country": "Egypt",
        "continent": "Africa",
        "latitude": 30.0444,
        "longitude": 31.2357,
        "timezone": "Africa/Cairo",
        "stations": [
            {
                "station_code": "CAI-MZ-01",
                "name": "Mokattam Atmospheric Monitor",
                "operator": "Egyptian Environmental Affairs Agency (EEAA)",
                "sensor_type": "BAM-1020 Dust & Desert Aerosol",
                "latitude": 30.0180,
                "longitude": 31.2950,
                "elevation": 175.0,
                "status": "active"
            }
        ]
    },
    "Johannesburg": {
        "city": "Johannesburg",
        "country": "South Africa",
        "continent": "Africa",
        "latitude": -26.2041,
        "longitude": 28.0473,
        "timezone": "Africa/Johannesburg",
        "stations": [
            {
                "station_code": "JNB-ST-01",
                "name": "Sandton Metro Atmospheric Base",
                "operator": "South African Weather Service (SAAQIS)",
                "sensor_type": "FIDAS 200 Spectrometer",
                "latitude": -26.1076,
                "longitude": 28.0567,
                "elevation": 1690.0,
                "status": "active"
            }
        ]
    },

    # SOUTH AMERICA
    "São Paulo": {
        "city": "São Paulo",
        "country": "Brazil",
        "continent": "South America",
        "latitude": -23.5505,
        "longitude": -46.6333,
        "timezone": "America/Sao_Paulo",
        "stations": [
            {
                "station_code": "SAO-IB-01",
                "name": "Ibirapuera Park Clean Air Monitor",
                "operator": "CETESB São Paulo",
                "sensor_type": "BAM-1020 & Chemiluminescence NOx",
                "latitude": -23.5874,
                "longitude": -46.6576,
                "elevation": 760.0,
                "status": "active"
            }
        ]
    },
    "Buenos Aires": {
        "city": "Buenos Aires",
        "country": "Argentina",
        "continent": "South America",
        "latitude": -34.6037,
        "longitude": -58.3816,
        "timezone": "America/Argentina/Buenos_Aires",
        "stations": [
            {
                "station_code": "BUE-PM-01",
                "name": "Puerto Madero Waterfront Sensor",
                "operator": "Agencia de Protección Ambiental (APRA)",
                "sensor_type": "Met One Laser Optical PM",
                "latitude": -34.6110,
                "longitude": -58.3640,
                "elevation": 15.0,
                "status": "active"
            }
        ]
    }
}
