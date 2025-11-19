# TODO: Integrar PostgreSQL con Prisma en el proyecto Next.js

## Información Recopilada
- El proyecto usa datos simulados en `src/lib/data.ts`.
- Tipos definidos en `src/lib/types.ts`: User, Expense, Department, Sede, Category, AuditLog.
- PostgreSQL instalado en `C:\Program Files\PostgreSQL\16`, puerto 5432, usuario postgres, contraseña B_Rodriguez2511.
- No hay configuración de base de datos actual.

## Plan
- Instalar Prisma ORM y dependencias necesarias.
- Crear esquema Prisma basado en los tipos existentes.
- Configurar conexión a la base de datos en `.env`.
- Generar cliente Prisma.
- Crear base de datos y tablas.
- Poblar la base de datos con datos simulados.
- Actualizar `src/lib/data.ts` para usar Prisma en lugar de datos simulados.
- Actualizar `src/app/actions.ts` si es necesario para operaciones de base de datos.
- Ejecutar el programa.

## Archivos Dependientes
- `package.json`: Agregar Prisma.
- `prisma/schema.prisma`: Nuevo archivo para esquema.
- `.env`: Configurar DATABASE_URL.
- `src/lib/data.ts`: Modificar para usar Prisma.
- `src/app/actions.ts`: Posible actualización.

## Pasos de Seguimiento
- Instalar dependencias.
- Ejecutar migraciones de Prisma.
- Sembrar la base de datos.
- Probar la aplicación ejecutándola.
