import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('dependabot workflow', () => {
  it('does not auto-approve or auto-merge dependency updates without review', () => {
    const workflow = fs.readFileSync(new URL('./dependabot-auto-merge.yml', import.meta.url), 'utf8');

    expect(workflow).not.toContain('pull-requests: write');
    expect(workflow).not.toContain('contents: write');
    expect(workflow).not.toContain('gh pr review --approve');
    expect(workflow).not.toContain('gh pr merge');
  });
});
