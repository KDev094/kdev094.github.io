import { createContext, useContext } from 'react';
import { siteBase } from '../lib/routes/paths';

export const SiteBaseContext = createContext<string | undefined>(undefined);

/** Resolve links during static rendering, including a document-specific base. */
export function useSitePath() {
  const basePath = useContext(SiteBaseContext);
  return (pathname: string) => siteBase(pathname, basePath);
}
