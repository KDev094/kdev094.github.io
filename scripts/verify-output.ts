import { access } from 'node:fs/promises';
import path from 'node:path';
import { outputFileFor, type StaticRoute } from '../src/lib/routes/manifest';

export async function verifyRequiredOutput(outputDirectory: string, generatedRoutes: StaticRoute[] = []): Promise<void> {
  const requiredOutput = [...new Set([
    outputFileFor('/'),
    outputFileFor('/learning/'),
    ...generatedRoutes.map((route) => outputFileFor(route.pathname)),
  ])];
  const exists = await Promise.all(requiredOutput.map(async (relativePath) => {
    try {
      await access(path.join(outputDirectory, relativePath));
      return true;
    } catch {
      return false;
    }
  }));
  const missing = requiredOutput.filter((_, index) => !exists[index]);
  if (missing.length > 0) throw new Error(`Static render is missing required output: ${missing.join(', ')}`);
}
