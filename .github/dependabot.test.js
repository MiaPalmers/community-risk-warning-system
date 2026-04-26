import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('dependabot config', () => {
  it('covers npm and GitHub Actions with grouped non-major updates', () => {
    const config = fs.readFileSync(new URL('./dependabot.yml', import.meta.url), 'utf8');
    const githubActionsBlock = config.split("  - package-ecosystem: 'github-actions'")[1];

    expect(config).toContain("package-ecosystem: 'npm'");
    expect(config).toContain("package-ecosystem: 'github-actions'");
    expect(config).toContain("timezone: 'Asia/Shanghai'");
    expect(config).toContain('npm-production:');
    expect(config).toContain('npm-development:');
    expect(config).toContain('github-actions-non-major:');
    expect(config).toContain("prefix-development: 'chore(dev)'");
    expect(config).toContain("open-pull-requests-limit: 6");
    expect(config).toContain("default-days: 3");
    expect(config).toContain("semver-major-days: 14");
    expect(githubActionsBlock).not.toContain('semver-major-days');
    expect(githubActionsBlock).not.toContain('semver-minor-days');
    expect(githubActionsBlock).not.toContain('semver-patch-days');
  });
});
