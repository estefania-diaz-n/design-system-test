const checklist = [
  'Instala el paquete publicado: npm install @tefi/design-system',
  'Importa los estilos globales del paquete en app/layout.tsx, si tu Design System los exporta.',
  'Reemplaza este contenido por componentes reales para validar estilos, accesibilidad y SSR.',
];

export default function Home() {
  return (
    <main className="page">
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">Next.js 15 · App Router · TypeScript</p>
        <h1 id="hero-title">Sandbox para probar un Design System publicado en npm</h1>
        <p className="lead">
          Este proyecto queda listo para instalar tu librería de componentes y probarla en un entorno limpio,
          sin dependencias adicionales innecesarias.
        </p>
      </section>

      <section className="card" aria-labelledby="next-steps-title">
        <h2 id="next-steps-title">Siguientes pasos</h2>
        <ol>
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="card" aria-labelledby="route-title">
        <h2 id="route-title">Página de pruebas</h2>
        <p>
          Visita <a href="/design-system-test">/design-system-test</a> para ver todos los componentes
          exportados por <code>@tefi/design-system</code> agrupados por categoría.
        </p>
      </section>

      <section className="card" aria-labelledby="example-title">
        <h2 id="example-title">Ejemplo de integración</h2>
        <pre>
          <code>{`// app/layout.tsx
// import '@tefi/design-system/dist/style.css';

// app/page.tsx
// import { Button } from '@tefi/design-system';

// export default function Home() {
//   return <Button>Probar componente</Button>;
// }`}</code>
        </pre>
      </section>
    </main>
  );
}
