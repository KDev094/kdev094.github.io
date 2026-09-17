import { describe, expect, it } from 'vitest';
import { siteBase } from '../src/lib/routes/paths';

describe('siteBase', () => {
  it('keeps directory links relative to Vite base', () => {
    expect(siteBase('/learning/dsa/')).toBe('/portfolio/learning/dsa/');
  });
});
