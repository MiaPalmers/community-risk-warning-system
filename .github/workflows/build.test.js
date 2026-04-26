import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('build workflow', () => {
  it('runs tests and typecheck before the production build', () => {
    const workflow = fs.readFileSync(new URL('./build.yml', import.meta.url), 'utf8');

    const testIndex = workflow.indexOf('npm run test');
    const typecheckIndex = workflow.indexOf('npm run typecheck');
    const buildIndex = workflow.indexOf('npm run build');

    expect(testIndex).toBeGreaterThan(-1);
    expect(typecheckIndex).toBeGreaterThan(-1);
    expect(buildIndex).toBeGreaterThan(-1);
    expect(testIndex).toBeLessThan(buildIndex);
    expect(typecheckIndex).toBeLessThan(buildIndex);
  });

  it('skips heavyweight packaging steps for Dependabot pull requests', () => {
    const workflow = fs.readFileSync(new URL('./build.yml', import.meta.url), 'utf8');

    expect(workflow).toContain('IS_DEPENDABOT_PR');
    expect(workflow).toContain("if: env.IS_DEPENDABOT_PR != 'true'");
    expect(workflow).toContain("if: env.IS_DEPENDABOT_PR == 'true'");
    expect(workflow).toContain('Skipping VLM download and Windows packaging for Dependabot pull requests.');
  });
});
