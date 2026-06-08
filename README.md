# design-system-test

Aplicación base creada con Next.js 15, App Router y TypeScript para probar y validar un Design System publicado en npm.

## Requisitos

- Node.js 18.18 o superior.
- npm como gestor de paquetes.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el sandbox. La página `/design-system-test` renderiza los componentes exportados por `@tefi/design-system`.

## Probar @tefi/design-system

1. Instala dependencias:

   ```bash
   npm install
   ```

   El proyecto ya declara `@tefi/design-system` en `package.json`.

2. Si tu paquete exporta estilos globales, impórtalos en `app/layout.tsx`:

   ```tsx
   import '@tefi/design-system/dist/style.css';
   ```

3. Importa y renderiza componentes en `app/page.tsx`:

   ```tsx
   import { Button } from '@tefi/design-system';

   export default function Home() {
     return <Button>Probar componente</Button>;
   }
   ```

## Scripts disponibles

- `npm run dev`: levanta el servidor de desarrollo.
- `npm run build`: genera una build de producción.
- `npm run start`: sirve la build de producción.
- `npm run typecheck`: valida TypeScript sin emitir archivos.

## Ruta de validación

- `/design-system-test`: importa `@tefi/design-system`, detecta los componentes exportados en PascalCase, los agrupa por categoría y muestra un ejemplo de uso para cada uno.
- Los estilos globales del paquete se importan desde `app/layout.tsx`.
