// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { initializeEnhancements } from '../src/client';

let listeners: MockInstance<Document['addEventListener']>;
beforeEach(() => {
  listeners = vi.spyOn(document, 'addEventListener');
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-enhanced');
  document.documentElement.removeAttribute('data-menu-open');
  document.body.innerHTML = `<div class="page"><button data-theme-toggle hidden>Theme</button><button data-menu-toggle hidden aria-expanded="false" aria-controls="site-navigation">Menu</button><nav id="site-navigation"><a href="/learning/">Learning</a></nav></div>`;
  localStorage.clear();
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
});
afterEach(() => {
  for (const [type, listener, options] of listeners.mock.calls) document.removeEventListener(type, listener, options);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('progressive enhancements', () => {
  it('reveals the theme control, switches the palette and persists a preference', () => {
    initializeEnhancements(document, localStorage);
    const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')!;
    expect(button.hidden).toBe(false);
    expect(button.getAttribute('aria-pressed')).toBe('false');
    button.click();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('portfolio-theme')).toBe('dark');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.textContent).toBe('');
    expect(button.querySelector('svg')).not.toBeNull();
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
    button.click();
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('portfolio-theme')).toBe('light');
  });

  it('restores a valid saved preference ahead of the system preference', () => {
    localStorage.setItem('portfolio-theme', 'light');
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    initializeEnhancements(document, localStorage);
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('uses the system dark preference when storage has no valid preference', () => {
    localStorage.setItem('portfolio-theme', 'invalid');
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    initializeEnhancements(document, localStorage);
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('keeps the Learning surface dark by default and lets readers switch it to light', () => {
    document.querySelector('.page')!.setAttribute('data-surface', 'dark');
    initializeEnhancements(document, localStorage);
    expect(document.documentElement.dataset.theme).toBe('dark');
    document.querySelector<HTMLButtonElement>('[data-theme-toggle]')!.click();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('supports toggling the mobile menu and closing it with Escape while returning focus', () => {
    initializeEnhancements(document, localStorage);
    const button = document.querySelector<HTMLButtonElement>('[data-menu-toggle]')!;
    expect(button.hidden).toBe(false);
    button.click();
    expect(document.documentElement.dataset.menuOpen).toBe('true');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    document.querySelector<HTMLAnchorElement>('nav a')!.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.documentElement.dataset.menuOpen).toBe('false');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  it('closes the mobile menu after following a navigation link', () => {
    initializeEnhancements(document, localStorage);
    document.querySelector<HTMLButtonElement>('[data-menu-toggle]')!.click();
    const link = document.querySelector<HTMLAnchorElement>('nav a')!;
    link.addEventListener('click', (event) => event.preventDefault());
    link.click();
    expect(document.documentElement.dataset.menuOpen).toBe('false');
  });

  it('still enhances the page when browser storage is blocked', () => {
    const storage = { getItem() { throw new Error('Storage blocked'); }, setItem() { throw new Error('Storage blocked'); } } as unknown as Storage;
    initializeEnhancements(document, storage);
    document.querySelector<HTMLButtonElement>('[data-theme-toggle]')!.click();
    expect(document.documentElement.dataset.theme).toBe('dark');
    document.querySelector<HTMLButtonElement>('[data-menu-toggle]')!.click();
    expect(document.documentElement.dataset.menuOpen).toBe('true');
  });

  it('tolerates missing enhancement controls and an unavailable media-query API', () => {
    document.body.innerHTML = '<main>Readable content</main>';
    vi.stubGlobal('matchMedia', undefined);
    expect(() => initializeEnhancements(document, localStorage)).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.body.textContent).toBe('Readable content');
  });
});
