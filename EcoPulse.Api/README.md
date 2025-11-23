✨ Características Principales


🎯 Transparencia Total
Seguimiento en Tiempo Real: Monitorea cada entrega de material reciclable desde el depósito hasta el procesamiento

Historial Accesible: Los usuarios pueden ver su impacto ambiental medible en kilogramos y puntos

Certificación Digital: Recibos electrónicos de cada entrega con desglose de puntos

⚡ Eficiencia Operativa Inteligente
Rutas Optimizadas: Geolocalización para planificar recolecciones eficientes

Gestión de Centros: Dashboard administrativo para monitoreo de centros de acopio

Alertas Automáticas: Notificaciones cuando los centros alcanzan capacidad

🎮 Gamificación que Motiva
Sistema de Puntos: Convierte kilogramos reciclados en puntos canjeables

Logros y Rangos: Desde "Reciclador Novato" hasta "Héroe Ambiental"

Competencia Sana: Tablas de clasificación comunitaria y desafíos mensuales

Recompensas Tangibles: Alianzas con comercios locales para canje de puntos

🛡️ Arquitectura Robusta
Diseño SAAM: Evaluado para máxima modificabilidad y escalabilidad

API RESTful: Endpoints bien documentados con autenticación JWT

Patrón Repository: Código mantenible y testeable

🏗️ Arquitectura del Sistema
📊 Stack Tecnológico
Capa	Componente	Tecnología
🎨 Presentación	Aplicación Web	React 18 + TypeScript
📱 Mobile	App Móvil	React Native
⚙️ Backend	API RESTful	.NET 8 Web API
🗄️ Datos	ORM	Entity Framework Core 8
💾 Base de Datos	Database	MySQL 8.0+
🔐 Autenticación	Security	JWT + ASP.NET Identity
📍 Geolocalización	 Maps API
📧 Notificaciones	
🚀 Comenzando
Prerrequisitos
.NET 8 SDK 🟣

MySQL Server 8.0+ 🐬

Visual Studio Code/2022 🔧

⚙️ Configuración del Backend (.NET 8 API)
bash
# Clonar el repositorio

cd EcoPulse/Backend

# Instalar dependencias críticas
dotnet add package Pomelo.EntityFrameworkCore.MySql --version 8.0.0
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.0
dotnet add package Swashbuckle.AspNetCore --version 6.5.0
🗃️ Migraciones de Base de Datos
bash
# Crear migración inicial
dotnet ef migrations add InitialCreate -o Data/Migrations

# Aplicar migración
dotnet ef database update

# Verificar estado
dotnet ef database info
🎯 Ejecutar la API
bash
# Desarrolllo
dotnet run -

# Producción
dotnet run --environment Production
La API estará disponible en: http://localhost:5153/ 📡

📚 Estructura del Proyecto
text
EcoPulse/
├── 📁 Backend/
│   ├── 📁 Controllers/          # API Endpoints
│   ├── 📁 Data/                 # DbContext y Entidades
│   ├── 📁 Models/               # DTOs y ViewModels
│   ├── 📁 Services/             # Lógica de negocio
│   └── 📁 Middlewares/          # Middlewares personalizados
├── 📁 Frontend/                 # Aplicación React
└── 📁 Mobile/                   # App React Native

👥 Equipo de Desarrollo

Universidad Tecnológica de Candelaria - Desarrollo e Implementación

Ing. Angel Mar - Arquitectura Backend Y frontend

Ing. Henry Alvaro - Diseño de Gamificación
Ing. Giorgina    - Diseño de Gamificación
Ing. Karla Vera - Experiencia de Usuario


🚀 Actualización y Refactorización del Módulo de Autenticación y Administración
Este conjunto de cambios se centra en optimizar la estructura de la aplicación, mejorar la seguridad en la autenticación y limpiar el código base al eliminar funcionalidades de administración obsoletas o no utilizadas.

✨ Características Principales
Esta versión incluye mejoras significativas en la arquitectura del proyecto, especialmente en cómo se maneja la información del usuario y la autenticación.

Implementación de un Nuevo Servicio de Usuario:

Se creó un nuevo servicio (UserService) para centralizar y encapsular toda la lógica y llamadas a la API relacionadas con la gestión de usuarios (como obtener datos, actualizar perfiles, etc.).

Beneficio: Código más limpio, modular y fácil de mantener.

Refactorización de Autenticación (Login y Registro):

Las páginas de Inicio de Sesión y Registro se actualizaron para utilizar el nuevo UserService para gestionar las llamadas de autenticación.

Mejora de la Experiencia de Usuario: Se mejoró el manejo de errores y la gestión de estados de carga (loading) durante los procesos de autenticación, proporcionando una mejor retroalimentación visual al usuario.

🗑️ Limpieza y Optimización del Código
Se llevó a cabo una limpieza exhaustiva para eliminar código muerto y componentes que ya no son funcionales o necesarios, lo cual contribuye a un proyecto más ligero y rápido.

Eliminación de Componentes de Administración Obsoletos:

Se eliminaron rutas, componentes y páginas de administrador no utilizados.

Se eliminaron las páginas antiguas del panel de administración y de informes, simplificando la estructura de la aplicación.

Limpieza General del Componente Principal (App):

El componente App se limpió al eliminar importaciones y rutas innecesarias, reduciendo su complejidad.

📣 Mejoras en la Interfaz de Usuario
Ajuste de Notificaciones:

Se ajustaron y mejoraron las notificaciones tipo toast para que brinden una retroalimentación más clara y concisa al usuario sobre el éxito o fracaso de las operaciones.


Instalar dependencias:

Bash

npm install
# o yarn install
Iniciar la aplicación:
cd Front-End
npm install
npm install tailwind
npm audit

npm run dev
# o yarn start