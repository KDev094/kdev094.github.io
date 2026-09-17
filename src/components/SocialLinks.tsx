const links = [
  ['LinkedIn', 'https://www.linkedin.com/in/keval-darji-5b980283', <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.64h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.76 2.64 4.76 6.08V21h-3.96v-5.62c0-1.34-.02-3.07-1.87-3.07-1.88 0-2.17 1.46-2.17 2.97V21H9.5V9Z" />],
  ['GitHub', 'https://github.com/KDev094', <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.18-3.37-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.54 1.04 1.54 1.04.9 1.54 2.35 1.1 2.92.84.09-.65.35-1.1.63-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.56 9.56 0 0 1 5 0c1.9-1.3 2.74-1.03 2.74-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .26.18.57.69.48A10 10 0 0 0 12 2Z" />],
  ['Email', 'mailto:kevaldarji@outlook.com', <path d="M3 5h18v14H3V5Zm2 2v.18l7 5.09 7-5.09V7H5Zm14 10V9.73l-7 5.09-7-5.09V17h14Z" />],
] as const;

export function SocialLinks() {
  return <nav className="social-links" aria-label="Social links">{links.map(([label, href, icon]) => <a key={label} href={href} aria-label={label} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}><svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg></a>)}</nav>;
}
