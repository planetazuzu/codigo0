<div align="center">

# 🚑 CÓDIGO 0

### App Sanitaria de Alto Rendimiento para TES

*"Haciendo la tecnología invisible para que las Emergencias sean lo primero."*

---

![CI](https://github.com/planetazuzu/codigo0/actions/workflows/ci.yml/badge.svg)
![Version](https://img.shields.io/github/v/release/planetazuzu/codigo0?color=FF6A00)
![License](https://img.shields.io/github/license/planetazuzu/codigo0?color=FF6A00)
![PWA](https://img.shields.io/badge/PWA-ready-FF6A00?logo=pwa&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)

</div>

---

**Código 0** es una PWA diseñada específicamente para **Técnicos de Emergencias Sanitarias (TES)**. Prioriza el acceso inmediato a protocolos críticos en situaciones de estrés prehospitalario donde cada segundo importa.

> ⚡ Funciona **offline**. Diseñada para entornos sin cobertura.

---

## Tabla de contenidos

- [Protocolos disponibles](#-protocolos-disponibles)
- [Stack tecnológico](#-stack-tecnológico)
- [Instalación](#-instalación)
- [Tests](#-validación-de-protocolos-tests)
- [Variables de entorno](#-variables-de-entorno)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Identidad visual](#-identidad-visual)
- [Backend](#-integración-con-backend)
- [Licencia](#-licencia)

---

## 🫀 Protocolos disponibles

| Protocolo | Estado |
|-----------|--------|
| RCP Adulto / Pediátrico | ✅ Disponible |
| Ictus — Escala de Cincinnati | ✅ Disponible |
| Shock — Criterios qSOFA | ✅ Disponible |
| *Más protocolos en desarrollo* | 🔄 En progreso |

---

## 🛠 Stack tecnológico

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)

| Capa | Tecnología |
|------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Estilos | TailwindCSS — Diseño Brutalista |
| Iconos | Lucide React |
| Testing | Vitest + React Testing Library |

---

## 🚀 Instalación

**Requisitos previos:** Node.js 20+ y npm 10+

```bash
# 1. Clonar el repositorio
git clone https://github.com/planetazuzu/codigo0.git
cd codigo0

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Lanzar en desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## 🧪 Validación de protocolos (Tests)

Los protocolos sanitarios no admiten errores. La suite de tests verifica
la integridad de cada protocolo antes de cualquier despliegue.

```bash
# Ejecutar todos los tests
npm run test:run

# Modo watch (desarrollo)
npm run test
```

**Cobertura de la suite:**

- ✅ Ciclos de RCP (adulto y pediátrico)
- ✅ Escala de Cincinnati (ictus)
- ✅ Criterios qSOFA (sepsis/shock)

---

## 🔧 Variables de entorno

Copia `.env.example` y rellena los valores necesarios:

```bash
cp .env.example .env
```

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `VITE_API_URL` | URL base del backend Código 0 | Solo con backend activo |
| `VITE_OFFLINE_MODE` | Forzar modo offline (`true`/`false`) | No |

> La app funciona completamente sin backend en modo offline.

---

## 📂 Estructura del proyecto

```
src/
├── components/     # Componentes atómicos y de layout
├── pages/          # Vistas principales (RCP, Ictus, Shock...)
├── data/           # Protocolos estáticos y validaciones
├── hooks/          # Lógica reutilizable y gestión offline
└── types/          # Tipos TypeScript compartidos
```

---

## 🎨 Identidad visual

Código 0 usa un sistema de diseño **brutalista** optimizado para uso en campo:
alto contraste, tipografía robusta y sin adornos que distraigan bajo luz solar
o situaciones de estrés.

| Token | Valor | Propósito |
|-------|-------|-----------|
| Primary | `#FF6A00` | Acciones críticas, alertas |
| Background | `#000000` | Máximo contraste |
| Concepto | Brutalismo | Legibilidad sobre estética |

---

## 📡 Integración con backend

Esta PWA está diseñada para funcionar en **modo offline por defecto**. Si
necesitas datos dinámicos, configura la variable `VITE_API_URL` apuntando
al servicio Código 0 Backend.

```
VITE_API_URL=https://api.codigo0.planetazuzu.com
```

---

## 📄 Licencia

© 2026 [Planetazuzu](https://github.com/planetazuzu). Todos los derechos reservados.
