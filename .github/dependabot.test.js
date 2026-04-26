import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('dependabot config', () => {
  it('covers npm and GitHub Actions with grouped non-major updates', () => {
    const config = fs.readFileSync(new URL('./dependabot.yml', import.meta.url), 'utf8');

    expect(config).toContain("package-ecosystem: 'npm'");
    expect(config).toContain("package-ecosystem: 'github-actions'");
    expect(config).toContain("timezone: 'Asia/Shanghai'");
    expect(config).toContain('npm-production:');
    expect(config).toContain('npm-development:');
    expect(config).toContain('github-actions-non-major:');
    expect(config).toContain("prefix-development: 'chore(dev)'");
    expect(config).toContain("open-pull-requests-limit: 6");
  });
});
