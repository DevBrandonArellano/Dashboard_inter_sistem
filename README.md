# Sistema B: Dashboard de Reportes Seguro (Interop KMS)

Este es el **Sistema B**, desarrollado como parte del Proyecto Integrador de Desarrollo de Software Seguro. Actúa como el receptor en la arquitectura de microservicios, encargado de procesar datos cifrados y presentarlos en un entorno seguro.

## 🚀 Tecnologías Principales

- **Framework:** [Next.js (App Router)](https://nextjs.org) - Para SSR (Server-Side Rendering) y API Routes seguras.
- **Estilos:** Tailwind CSS - Interfaz en modo oscuro (Dark Mode) con glassmorphism.
- **Identity Provider (SSO):** Keycloak - Autenticación centralizada mediante OpenID Connect.
- **Criptografía (KMS):** HashiCorp Vault - Motor `Transit` para el descifrado simétrico de payloads (AES-256-GCM96) sin exponer llaves criptográficas.

## ⚙️ Arquitectura de Seguridad Implementada

Este sistema implementa los siguientes patrones de software seguro y principios SOLID:
1. **Single Sign-On (SSO):** Delega la autenticación y la validación de 2FA/MFA a Keycloak.
2. **Cifrado como Servicio (KMS):** Las llaves criptográficas nunca residen en el código ni en la base de datos de este sistema. Se consume el API de Vault para descifrar en tiempo real.
3. **Patrón MVC/Capas (SOLID):**
   - **Controllers:** Enrutadores limpios (`app/api/...`).
   - **Services:** Lógica de negocio encapsulada (`lib/services/`).
   - **Repositories:** Abstracción de acceso a datos (`lib/repositories/`).
4. **Protección CSRF/XSS:** Uso de cookies `httpOnly` para los tokens de sesión.

## 💻 Desarrollo Local

1. Clona el repositorio.
2. Copia el archivo `.env.example` a `.env.local` y llena tus credenciales (Keycloak y Vault).
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🛡️ Análisis Estático (SAST)

Este proyecto está integrado con **SonarCloud** para el análisis continuo de calidad y vulnerabilidades a través de GitHub Actions. Asegúrate de configurar tu `SONAR_TOKEN` en los secretos del repositorio.

---
*Desarrollado para la materia de Desarrollo de Software Seguro.*
