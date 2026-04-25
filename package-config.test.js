import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

describe('package configuration', () => {
  it('keeps Windows packages branded with metadata and an icon', () => {
    expect(packageJson.description).toBeTruthy();
    expect(packageJson.author).toBeTruthy();
    expect(packageJson.build.win.icon).toBe('build/icon.ico');
  });
});
