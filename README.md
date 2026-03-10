# 🚑 Código 0 — App Sanitaria de Alto Rendimiento

**Código 0** es la interfaz progresiva (PWA) diseñada para Técnicos de Emergencias Sanitarias (TES). Prioriza la velocidad de acceso a protocolos críticos en situaciones de estrés prehospitalario.

## 🎨 Identidad Visual (Brutalismo)
- **Primary:** `#FF6A00` (Naranja Neón)
- **Background:** `#000000` (Negro Puro)
- **Concepto:** Alto contraste, tipografía robusta y eliminación de adornos innecesarios para máxima legibilidad bajo luz solar o estrés.

## 🛠️ Stack Tecnológico
- **Framework:** React 19 + TypeScript.
- **Build Tool:** Vite.
- **Styling:** TailwindCSS (Diseño Brutalista).
- **Icons:** Lucide React.
- **Testing:** Vitest + React Testing Library (Suite sanitaria incluida).

## 📂 Estructura del Repositorio
- `src/components/`: Componentes atómicos y de layout.
- `src/pages/`: Vistas principales (RCP, Ictus, Shock, etc.).
- `src/data/`: Lógica estática de protocolos y validaciones de emergencias.
- `src/hooks/`: Lógica reutilizable y gestión de estado offline.

## 🚀 Instalación y Desarrollo
```bash
# 1. Instalar dependencias
npm install

# 2. Lanzar en desarrollo
npm run dev
```

## 🧪 Validación de Emergencias (Tests)
Es vital asegurar que los protocolos no tengan errores. Ejecuta la suite de pruebas:
```bash
npm run test:run
```
*Incluye verificación de: Ciclos de RCP, Escala de Cincinnati, Criterios qSOFA.*

## 📡 Integración con Backend
Esta app está diseñada para consumir la API de **Código 0 Backend**. Asegúrate de configurar las variables de entorno si necesitas datos dinámicos.

---
© 2026 Planetazuzu | "Haciendo la tecnología invisible para que las **Emergencias** sean lo primero."
