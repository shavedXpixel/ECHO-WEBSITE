// Ambient type declarations for reference React/Next.js components

declare module '*.css';

declare module 'react' {
  export type ReactNode = any;
  export type CSSProperties = Record<string, any>;
  export type TouchEvent<T = any> = any;
  export type WheelEvent<T = any> = any;
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useRef<T = any>(initialValue?: T): { current: T };
  export function useState<T = any>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  const React: any;
  export default React;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'ogl' {
  export const Renderer: any;
  export type Renderer = any;
  export const Program: any;
  export type Program = any;
  export const Mesh: any;
  export type Mesh = any;
  export const Triangle: any;
  export type Triangle = any;
  export const Plane: any;
  export type Plane = any;
  export const Texture: any;
  export type Texture = any;
  export const RenderTarget: any;
  export type RenderTarget = any;
  const ogl: any;
  export default ogl;
}

declare module 'next/image' {
  const Image: any;
  export default Image;
}

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
