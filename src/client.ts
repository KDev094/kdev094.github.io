type Theme = 'dark' | 'light';
const themeKey = 'portfolio-theme';
const sunIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"/></svg>';
const moonIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 1 0 6 6 7 7 0 1 1-6-6Z"/></svg>';

function preferredTheme(document: Document, storage: Storage): Theme {
  try {
    const saved = storage.getItem(themeKey);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // A blocked storage API must not prevent navigation or theme changes.
  }
  const prefersDark = document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark || document.querySelector('[data-surface="dark"]') ? 'dark' : 'light';
}

export function initializeEnhancements(document: Document, storage: Storage): void {
  const root = document.documentElement;
  const themeControl = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  const menuControl = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const navigation = document.querySelector<HTMLElement>('#site-navigation');

  function setTheme(theme: Theme) {
    root.dataset.theme = theme;
    if (themeControl) {
      themeControl.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      themeControl.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeControl.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  setTheme(preferredTheme(document, storage));
  if (themeControl) {
    themeControl.hidden = false;
    themeControl.addEventListener('click', () => {
      const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(theme);
      try { storage.setItem(themeKey, theme); } catch { /* Keep the in-page choice usable. */ }
    });
  }

  if (menuControl && navigation) {
    const setMenu = (open: boolean) => {
      root.dataset.menuOpen = String(open);
      menuControl.setAttribute('aria-expanded', String(open));
      menuControl.textContent = open ? 'Close' : 'Menu';
    };
    setMenu(false);
    menuControl.hidden = false;
    menuControl.addEventListener('click', () => setMenu(root.dataset.menuOpen !== 'true'));
    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && root.dataset.menuOpen === 'true') {
        setMenu(false);
        menuControl.focus();
      }
    });
    // CSS collapses mobile navigation only after a working control is attached.
    root.dataset.enhanced = 'true';
  }
}

export function initializeClient(): void {
  // Accessing localStorage itself can throw in restricted browsing contexts.
  const storage = {
    getItem: (key: string) => window.localStorage.getItem(key),
    setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
  } as Storage;
  initializeEnhancements(document, storage);
}
