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


✨ feat: Integración del Servicio CentroAcopio y Nueva Página de Login Específica
1. Servicio y Lógica de Negocio
CentroServices.js Agregado:

Se creó un servicio dedicado (CentroServices.js) para manejar todas las interacciones con la API relacionadas con la entidad CentroAcopio.

Función createCentro Implementada: Se añadió una función para manejar el proceso de registro y envío de datos de un nuevo centro de acopio al backend.

2. Interfaz de Usuario (UI) y Rutas
Página LoginCentro.jsx Creada:

Se diseñó y creó una nueva página exclusiva para el formulario de registro de Centros de Acopio.

Incluye validación del formulario y utiliza notificaciones tipo toast para brindar retroalimentación al usuario.

Actualización de Rutas (App.jsx):

Se incluyó una nueva ruta en App.jsx para el acceso a la página LoginCentro.

Mejora de Navegación en el Mapa (RecyclingMap.jsx):

Se actualizó el componente RecyclingMap.jsx para incluir un botón que redirige a los usuarios a la nueva página de creación de centros (LoginCentro.jsx).



🚀 Mejoras de Arquitectura y Limpieza
Se llevaron a cabo varias mejoras a nivel de framework para garantizar un código más robusto y limpio.

Manejo de Autenticación Mejorado:

Se refactorizaron los componentes ProtectedRoute y AuthRoute para ofrecer un flujo de autenticación y redirección más seguro y eficiente a través de la aplicación.

Refactorización del Sistema de Notificaciones:

Se mejoró el manejo de toasts en use-toast.js para asegurar que las notificaciones se muestren correctamente y evitar posibles colisiones de propiedades (props).


♻️ Refactorización Mayor: Gestión de Entregas y Puntos de Usuario
Este conjunto de cambios se centra en la lógica de negocio dentro de EntregasController para vincular las acciones de entrega directamente con la acumulación y deducción de puntos del usuario, asegurando la integridad de los datos a nivel de base de datos.

🛠️ Cambios en el EntregasController (Lógica de Puntos)
Se refactorizaron los métodos del controlador para garantizar que la puntuación del usuario se actualice de forma atómica con la creación o eliminación de una entrega.

1. Creación de Entregas (CrearEntrega)
Validación de Usuario: Se añadió una validación estricta para asegurar la existencia del usuario antes de procesar la entrega.

Cálculo Dinámico de Puntos: La lógica de puntos fue implementada para calcular los puntos que se otorgan al usuario basándose en la cantidad de entregas (o peso/valor) que realiza.

Respuesta Mejorada: El DTO de respuesta para la creación de entregas fue actualizado para incluir el campo PuntosTotalesUsuario, proporcionando retroalimentación inmediata sobre el nuevo saldo de puntos.

2. Eliminación de Entregas (DeleteEntrega)
Deducción Automática: Se modificó el método para restar los puntos correspondientes al usuario cuando una entrega asociada es eliminada, manteniendo la coherencia en el perfil del usuario.

💾 Cambios en la Base de Datos y Modelos
1. Integridad de Datos y Relaciones
Eliminación en Cascada (Cascading Delete): Se modificó la relación de clave foránea en la base de datos para habilitar la eliminación en cascada entre las tablas Entregas y CentrosAcopio.

Esto asegura que si un Centro de Acopio es eliminado, las entregas relacionadas también se manejen adecuadamente, aunque es vital revisar la política de eliminación.

Actualización de Migraciones: Se actualizaron las migraciones de la base de datos para implementar los nuevos cambios en las relaciones y la estructura del modelo CentroAcopio.

2. Limpieza y Nuevos DTOs
Eliminación de Código Muerto: Se eliminó el DTO CentroAcopioCreateDTO no utilizado y propiedades relacionadas del modelo CentroAcopio.

Nuevos DTOs Introducidos:

Se agregaron nuevos DTOs para el manejo limpio y estructurado de los datos de CentroAcopio.

Se creó el DTO EntregaConPuntos para manejar la respuesta ampliada del método CrearEntrega.