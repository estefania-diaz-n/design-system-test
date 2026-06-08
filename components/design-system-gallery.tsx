'use client';

import { Component, createElement, type ComponentType, type ErrorInfo, type ReactNode } from 'react';
import * as DesignSystem from '@tefi/design-system';
import {
  createComponentExample,
  isLikelyComponent,
  sortCategories,
  type ComponentExample,
  type DesignSystemCategory,
} from '@/lib/design-system-examples';

type ExportedComponent = {
  Component: ComponentType<Record<string, unknown>>;
  example: ComponentExample;
};

type ComponentPreviewProps = {
  component: ExportedComponent;
};

type ComponentPreviewState = {
  hasError: boolean;
};

class ComponentPreviewBoundary extends Component<ComponentPreviewProps, ComponentPreviewState> {
  state: ComponentPreviewState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ComponentPreviewState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('No se pudo renderizar el componente de @tefi/design-system.', {
      component: this.props.component.example.name,
      error,
      info,
    });
  }

  render() {
    const { Component: ExampleComponent, example } = this.props.component;

    if (this.state.hasError) {
      return (
        <div className="ds-preview-fallback" role="note">
          <strong>{example.name}</strong> está exportado por la librería, pero necesita props o contexto adicional
          para renderizarse en este sandbox.
        </div>
      );
    }

    return (
      <div className="ds-preview-surface">
        {createElement(ExampleComponent, example.props, example.children)}
      </div>
    );
  }
}

function getExportedComponents() {
  return Object.entries(DesignSystem)
    .filter(([name, value]) => isLikelyComponent(name, value))
    .map(([name, Component]) => ({
      Component,
      example: createComponentExample(name),
    }))
    .sort((componentA, componentB) => componentA.example.name.localeCompare(componentB.example.name));
}

function groupByCategory(components: ExportedComponent[]) {
  const groups = components.reduce<Map<DesignSystemCategory, ExportedComponent[]>>((accumulator, component) => {
    const current = accumulator.get(component.example.category) ?? [];
    current.push(component);
    accumulator.set(component.example.category, current);
    return accumulator;
  }, new Map());

  return sortCategories(Array.from(groups.entries()));
}

function PropsTable({ props }: { props: Record<string, unknown> }) {
  const entries = Object.entries(props);

  if (entries.length === 0) {
    return <p className="ds-muted">Este ejemplo no requiere props para su render inicial.</p>;
  }

  return (
    <dl className="ds-props-list">
      {entries.map(([key, value]) => (
        <div key={key}>
          <dt>{key}</dt>
          <dd>{JSON.stringify(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function CodeExample({ example }: { example: ComponentExample }) {
  const props = Object.entries(example.props)
    .filter(([key]) => !key.startsWith('aria-'))
    .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
    .join(' ');
  const children = typeof example.children === 'string' ? example.children : '';
  const usage = children
    ? `<${example.name}${props ? ` ${props}` : ''}>${children}</${example.name}>`
    : `<${example.name}${props ? ` ${props}` : ''} />`;

  return (
    <pre className="ds-code">
      <code>{usage}</code>
    </pre>
  );
}

export function DesignSystemGallery() {
  const components = getExportedComponents();
  const groupedComponents = groupByCategory(components);
  const nonComponentExports = Object.keys(DesignSystem).filter((name) => !components.some((item) => item.example.name === name));

  return (
    <div className="ds-gallery">
      <section className="ds-hero" aria-labelledby="design-system-test-title">
        <p className="ds-eyebrow">@tefi/design-system</p>
        <h1 id="design-system-test-title">Prueba de componentes exportados</h1>
        <p>
          Esta página importa la librería como namespace, detecta todos los exports con forma de componente React,
          los agrupa por categoría y genera un ejemplo base para cada uno.
        </p>
        <div className="ds-summary" aria-label="Resumen de exports">
          <span>{components.length} componentes detectados</span>
          <span>{groupedComponents.length} categorías</span>
          <span>{nonComponentExports.length} exports auxiliares</span>
        </div>
      </section>

      {components.length === 0 ? (
        <section className="ds-empty-state" role="status">
          <h2>No se detectaron componentes renderizables</h2>
          <p>
            Verifica que <code>@tefi/design-system</code> esté instalado y que sus componentes se exporten con nombres
            en PascalCase desde el entrypoint principal.
          </p>
        </section>
      ) : (
        groupedComponents.map(([category, categoryComponents]) => (
          <section className="ds-category" key={category} aria-labelledby={`${category}-title`}>
            <div className="ds-category-header">
              <h2 id={`${category}-title`}>{category}</h2>
              <span>{categoryComponents.length} componentes</span>
            </div>

            <div className="ds-grid">
              {categoryComponents.map((component) => (
                <article className="ds-component-card" key={component.example.name}>
                  <header>
                    <h3>{component.example.name}</h3>
                    <p>{component.example.description}</p>
                  </header>

                  <ComponentPreviewBoundary component={component} />

                  <details>
                    <summary>Props del ejemplo</summary>
                    <PropsTable props={component.example.props} />
                  </details>

                  <CodeExample example={component.example} />
                </article>
              ))}
            </div>
          </section>
        ))
      )}

      {nonComponentExports.length > 0 && (
        <section className="ds-utilities" aria-labelledby="utilities-title">
          <h2 id="utilities-title">Exports auxiliares</h2>
          <p>También se encontraron exports que no parecen componentes React renderizables.</p>
          <ul>
            {nonComponentExports.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
