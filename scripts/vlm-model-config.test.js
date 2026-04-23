import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const jackrongRepo = 'Jackrong/Qwen3.5-4B-Claude-4.6-Opus-Reasoning-Distilled-v2-GGUF';
const jackrongModelFile = 'Qwen3.5-4B.Q4_K_M.gguf';
const oldUnslothRepo = 'unsloth/Qwen3.5-4B-GGUF';
const oldModelFile = 'Qwen3.5-4B-Q4_K_M.gguf';

function read(path) {
  return readFileSync(path, 'utf8');
}

describe('VLM model packaging configuration', () => {
  it('downloads the Jackrong distilled Qwen GGUF in the GitHub build workflow', () => {
    const workflow = read('.github/workflows/build.yml');

    expect(workflow).toContain(jackrongRepo);
    expect(workflow).toContain(jackrongModelFile);
    expect(workflow).not.toContain(oldUnslothRepo);
    expect(workflow).not.toContain(oldModelFile);
  });

  it('keeps local download and Electron startup model filenames aligned', () => {
    const downloadScript = read('scripts/download-model.js');
    const ollamaManager = read('electron/ollamaManager.ts');

    expect(downloadScript).toContain(jackrongRepo);
    expect(downloadScript).toContain(jackrongModelFile);
    expect(ollamaManager).toContain(jackrongModelFile);
    expect(downloadScript).not.toContain(oldUnslothRepo);
    expect(downloadScript).not.toContain(oldModelFile);
    expect(ollamaManager).not.toContain(oldModelFile);
  });
});
