import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { verifyRequiredOutput } from '../scripts/verify-output';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe('static build output verification', () => {
  it('names a missing required nested route', async () => {
    const outputDirectory = await mkdtemp(path.join(os.tmpdir(), 'portfolio-output-'));
    temporaryDirectories.push(outputDirectory);

    await expect(verifyRequiredOutput(outputDirectory, [{ pathname: '/learning/machine-learning/', pageType: 'journey', title: '', description: '', data: {} as never }])).rejects.toThrow(
      'learning/machine-learning/index.html',
    );
  });
});
