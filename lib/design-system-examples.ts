import type { ComponentType, ReactNode } from 'react';

export type DesignSystemCategory =
  | 'Acciones'
  | 'Formularios'
  | 'Feedback'
  | 'Navegación'
  | 'Layout'
  | 'Contenido'
  | 'Data display'
  | 'Overlays'
  | 'Otros componentes';

export type ComponentExample = {
  name: string;
  category: DesignSystemCategory;
  description: string;
  props: Record<string, unknown>;
  children?: ReactNode;
};

const categoryMatchers: Array<{
  category: DesignSystemCategory;
  pattern: RegExp;
  description: string;
}> = [
  {
    category: 'Acciones',
    pattern: /(button|action|cta|iconbutton|link|toggle|switch)/i,
    description: 'Componente orientado a ejecutar acciones o cambios de estado.',
  },
  {
    category: 'Formularios',
    pattern: /(input|field|form|select|checkbox|radio|textarea|label|control|date|calendar|picker|search|slider|upload)/i,
    description: 'Componente para capturar, seleccionar o validar información del usuario.',
  },
  {
    category: 'Feedback',
    pattern: /(alert|toast|notification|message|badge|tag|chip|spinner|loader|progress|skeleton|status|empty)/i,
    description: 'Componente para comunicar estados, resultados o retroalimentación visual.',
  },
  {
    category: 'Navegación',
    pattern: /(nav|menu|breadcrumb|tabs|tab|pagination|step|sidebar|drawer|link)/i,
    description: 'Componente para orientar y permitir desplazamiento dentro de una interfaz.',
  },
  {
    category: 'Layout',
    pattern: /(layout|grid|row|col|column|container|stack|space|divider|section|panel|box|flex)/i,
    description: 'Componente para estructurar, separar o distribuir contenido.',
  },
  {
    category: 'Data display',
    pattern: /(table|list|card|avatar|stat|metric|data|timeline|accordion|collapse)/i,
    description: 'Componente para presentar colecciones, entidades o datos estructurados.',
  },
  {
    category: 'Overlays',
    pattern: /(modal|dialog|popover|tooltip|dropdown|sheet|overlay|portal)/i,
    description: 'Componente que aparece sobre el contenido para mostrar información contextual o flujos secundarios.',
  },
  {
    category: 'Contenido',
    pattern: /(text|title|heading|typography|paragraph|image|logo|icon|media)/i,
    description: 'Componente para presentar contenido visual o textual.',
  },
];

const categoryOrder: DesignSystemCategory[] = [
  'Acciones',
  'Formularios',
  'Feedback',
  'Navegación',
  'Layout',
  'Contenido',
  'Data display',
  'Overlays',
  'Otros componentes',
];

const childlessPattern = /(input|textarea|select|checkbox|radio|switch|toggle|slider|progress|spinner|loader|skeleton|avatar|icon|image|divider)/i;

function getCategory(name: string) {
  const match = categoryMatchers.find((matcher) => matcher.pattern.test(name));

  return {
    category: match?.category ?? 'Otros componentes',
    description: match?.description ?? 'Componente exportado por @tefi/design-system.',
  };
}

function getExampleProps(name: string): Record<string, unknown> {
  const lowerName = name.toLowerCase();
  const props: Record<string, unknown> = {
    'aria-label': `Ejemplo de ${name}`,
  };

  if (lowerName.includes('button')) {
    props.type = 'button';
  }

  if (/(input|field|search)/i.test(name)) {
    props.placeholder = `Escribe en ${name}`;
    props.name = `${name}-example`;
  }

  if (/textarea/i.test(name)) {
    props.placeholder = `Describe un caso de uso para ${name}`;
    props.rows = 3;
  }

  if (/(select|dropdown|combobox)/i.test(name)) {
    props.placeholder = 'Selecciona una opción';
    props.options = [
      { label: 'Opción A', value: 'a' },
      { label: 'Opción B', value: 'b' },
    ];
  }

  if (/(checkbox|switch|toggle)/i.test(name)) {
    props.checked = true;
    props.defaultChecked = true;
  }

  if (/radio/i.test(name)) {
    props.name = `${name}-group`;
    props.value = 'sample';
    props.checked = true;
  }

  if (/(badge|tag|chip|status)/i.test(name)) {
    props.variant = 'primary';
  }

  if (/(progress|slider)/i.test(name)) {
    props.value = 60;
    props.max = 100;
  }

  if (/(avatar|image)/i.test(name)) {
    props.alt = `Ejemplo de ${name}`;
  }

  if (/(modal|dialog|popover|tooltip|drawer|sheet)/i.test(name)) {
    props.open = true;
  }

  return props;
}

function getExampleChildren(name: string) {
  if (childlessPattern.test(name)) {
    return undefined;
  }

  if (/(title|heading)/i.test(name)) {
    return `Título con ${name}`;
  }

  if (/(text|paragraph|typography)/i.test(name)) {
    return `Texto de ejemplo renderizado con ${name}.`;
  }

  return `Ejemplo de ${name}`;
}

export function isLikelyComponent(name: string, value: unknown): value is ComponentType<Record<string, unknown>> {
  if (!/^[A-Z]/.test(name)) {
    return false;
  }

  if (typeof value === 'function') {
    return true;
  }

  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const reactType = (value as { $$typeof?: symbol }).$$typeof?.toString() ?? '';

  return reactType.includes('react.memo') || reactType.includes('react.forward_ref');
}

export function createComponentExample(name: string): ComponentExample {
  const category = getCategory(name);

  return {
    name,
    category: category.category,
    description: category.description,
    props: getExampleProps(name),
    children: getExampleChildren(name),
  };
}

export function sortCategories<T>(entries: Array<[DesignSystemCategory, T]>) {
  return entries.sort(([categoryA], [categoryB]) => categoryOrder.indexOf(categoryA) - categoryOrder.indexOf(categoryB));
}
