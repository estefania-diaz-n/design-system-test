declare module '@tefi/design-system' {
  import type { ComponentType } from 'react';

  const exports: Record<string, ComponentType<Record<string, unknown>> | unknown>;
  export = exports;
}

declare module '@tefi/design-system/dist/style.css';
declare module '@tefi/design-system/styles.css';
