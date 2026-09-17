export function normalizeBasePath(value = '/'): string {
  return `/${value.split('/').filter(Boolean).join('/')}${value.split('/').filter(Boolean).length ? '/' : ''}`;
}

export function siteBase(pathname: string, basePath?: string): string {
  const configuredBase = basePath ?? import.meta.env?.BASE_URL ??
    (typeof process !== 'undefined' ? process.env.BASE_PATH : undefined) ?? '/';
  const base = normalizeBasePath(configuredBase).replace(/\/$/, '');
  return `${base}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}
