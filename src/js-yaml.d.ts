declare module 'js-yaml' {
  export const FAILSAFE_SCHEMA: unknown;

  export function safeLoad(input: string, options?: { schema?: unknown }): unknown;

  const yaml: { FAILSAFE_SCHEMA: typeof FAILSAFE_SCHEMA; safeLoad: typeof safeLoad };
  export default yaml;
}
