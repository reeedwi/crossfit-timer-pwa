// React module declarations
declare module 'react' {
  import * as React from 'react';
  
  // Add React hooks
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useRef: typeof React.useRef;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useContext: typeof React.useContext;
  export const useReducer: typeof React.useReducer;
  
  export = React;
  export as namespace React;
}

declare module 'react-dom/client' {
  import * as ReactDOMClient from 'react-dom/client';
  export = ReactDOMClient;
  export as namespace ReactDOMClient;
}

declare module 'react-dom' {
  import * as ReactDOM from 'react-dom';
  export = ReactDOM;
  export as namespace ReactDOM;
}

// Vite module declarations
declare module 'vite' {
  export function defineConfig(config: any): any;
}

declare module '@vitejs/plugin-react' {
  const plugin: any;
  export default plugin;
}

declare module 'vite-plugin-pwa' {
  export const VitePWA: any;
}

declare module 'workbox-window' {
  export class Workbox {
    constructor(scriptURL: string, options?: any);
    register(): Promise<any>;
  }
}

// Global declarations
interface Window {
  setInterval(handler: TimerHandler, timeout?: number, ...arguments: any[]): number;
  clearInterval(id?: number): void;
}

// Audio interface
interface HTMLAudioElement {
  play(): Promise<void>;
  pause(): void;
  src: string;
}

// JSX namespace
declare namespace JSX {
  interface IntrinsicElements {
    // Define all HTML elements used in the components
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
    select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
    option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
    span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
    header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    // Add a fallback for any other elements
    [elemName: string]: any;
  }
  
  interface ElementClass {
    render: any;
  }
  
  interface ElementAttributesProperty {
    props: any;
  }
  
  interface ElementChildrenAttribute {
    children: any;
  }
}

// Timer types
type TimerType = 'amrap' | 'emom' | 'forTime' | null;

// Sound effect types
type SoundEffect = 'beep' | 'longBeep' | 'doubleBeep'; 