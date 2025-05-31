## Estructura del proyecto

```bash
car-link-frontend/
├── app/ # Directorio principal de la aplicación (App Router)
│ ├── (auth)/ # Grupo de rutas de autenticación
│ │ ├── login/ # Página de inicio de sesión
│ │ ├── register/ # Página de registro
│ │ └── layout.tsx # Layout compartido para rutas de autenticación
│ ├── (dashboard)/ # Grupo de rutas para usuarios autenticados
│ │ ├── layout.tsx # Layout para dashboard (con sidebar, navbar)
│ │ ├── page.tsx # Página principal del dashboard
│ │ ├── profile/ # Perfil de usuario
│ │ ├── vehicles/ # Gestión de vehículos
│ │ │ ├── page.tsx # Lista de vehículos
│ │ │ ├── [id]/ # Página de detalle de vehículo
│ │ │ ├── add/ # Página para añadir vehículo
│ │ │ └── edit/[id]/ # Página para editar vehículo
│ │ └── rentals/ # Gestión de alquileres
│ ├── page.tsx # Página de inicio
│ ├── layout.tsx # Layout raíz
│ └── globals.css # Estilos globales
├── components/ # Componentes reutilizables
│ ├── ui/ # Componentes UI básicos
│ ├── forms/ # Componentes de formularios
│ ├── layout/ # Componentes de layout (Navbar, Footer, etc.)
│ └── vehicles/ # Componentes específicos de vehículos
├── lib/ # Utilidades y configuraciones
│ ├── api/ # Cliente API y funciones fetch
│ ├── utils/ # Funciones de utilidad
│ ├── hooks/ # Hooks personalizados
│ └── types/ # Definiciones de tipos TypeScript
├── store/ # Estado global (si usas Redux, Zustand, etc.)
├── public/ # Archivos estáticos
├── next.config.js # Configuración de Next.js
├── tailwind.config.js # Configuración de Tailwind CSS
└── package.json # Dependencias
```
