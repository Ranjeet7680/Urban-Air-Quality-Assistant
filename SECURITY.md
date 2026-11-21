# Security Policy & Vulnerability Disclosure

## 🛡️ Commitment to Security

The **Urban Air Quality Assistant** platform processes critical environmental and personal health preference data. We maintain a defense-in-depth security architecture conforming to OWASP Top 10 guidelines, NIST SP 800-53 standards, and modern cryptographic hygiene.

---

## 📋 Supported Versions

| Version | Supported | Security Maintenance |
| :--- | :---: | :--- |
| `2.0.x` | ✅ | Active continuous security patches & updates |
| `1.x.x` | ❌ | End of Life (EOL) |

---

## 🔒 Security Architecture & Controls

### 1. Cryptographic Authentication & Password Storage
- **Password Hashing**: User passwords are encrypted using `Bcrypt` with an adaptive computational work factor and automatic salt generation. Raw passwords are never persisted or logged in plain text.
- **Session Tokens**: Stateless JSON Web Tokens (JWT) signed using cryptographically strong keys with bounded expiration (`ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7`).
- **Authorization Scopes**: Role-Based Access Control (`RBAC`) strictly separates citizen accounts from administrative actions (`admin` role enforcement on telemetry pipelines and audit logs).

### 2. Transport & Network Security
- **Strict Transport Security (HSTS)**: `Strict-Transport-Security: max-age=31536000; includeSubDomains` enforced on all responses.
- **Cross-Origin Resource Sharing (CORS)**: Strict origin whitelisting configured via `CORS_ORIGINS`.
- **API Rate Limiting**: Rolling sliding-window rate limiter prevents brute-force attacks and denial-of-service (`180 requests/minute/IP` ceiling with automatic `HTTP 429` enforcement).

### 3. HTTP Security Headers
All API endpoints automatically inject standardized defense-in-depth headers:
- `X-Content-Type-Options: nosniff` (Mitigates MIME-type confusion attacks)
- `X-Frame-Options: DENY` (Prevents clickjacking and unauthorized iframe embedding)
- `X-XSS-Protection: 1; mode=block` (Activates browser-side reflection filters)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`: Restricts script and resource execution to verified origins.
- `Permissions-Policy: geolocation=(self), microphone=(self), camera=()`

### 4. Injection & Data Integrity Defenses
- **SQL Injection Prevention**: All database interactions utilize SQLAlchemy 2.0 ORM with parameterized prepared statements, preventing SQL injection vectors.
- **Input Sanitization**: Pydantic v2 schemas perform strict runtime validation, type checking, and boundary assertions on all payloads.
- **Micro-Sensor Telemetry Verification**: LoRaWAN IoT mesh packets require RSSI/SNR validation and CRC checks prior to ingestion.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please do NOT create a public issue on GitHub. Instead, follow our responsible disclosure process:

1. **Email**: Send a detailed advisory to `security@airsense.eco`.
2. **Details to Include**:
   - Severity assessment (CVSS score if available)
   - Step-by-step reproduction instructions or proof-of-concept
   - Affected endpoints or components
3. **Response Timeline**:
   - Initial acknowledgment: Within 24 hours
   - Triage and impact validation: Within 72 hours
   - Patch delivery: Within 7 business days for high-severity issues
