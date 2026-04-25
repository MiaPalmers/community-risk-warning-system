import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  VLM_MODEL_FILE,
  VLM_MODEL_REPO,
  VLM_MMPROJ_FILE
} from '../shared/vlmModelConfig.js';

const oldUnslothRepo = 'unsloth/Qwen3.5-4B-GGUF';
const oldModelFile = 'Qwen3.5-4B-Q4_K_M.gguf';

function read(path) {
  return readFileSync(path, 'utf8');
}

describe('VLM model packaging configuration', () => {
  it('downloads the Jackrong distilled Qwen GGUF in the GitHub build workflow', () => {
    const workflow = read('.github/workflows/build.yml');

    expect(workflow).toContain(VLM_MODEL_REPO);
    expect(workflow).toContain(VLM_MODEL_FILE);
    expect(workflow).toContain(VLM_MMPROJ_FILE);
    expect(workflow).not.toContain(oldUnslothRepo);
    expect(workflow).not.toContain(oldModelFile);
  });

  it('keeps local download and Electron startup model filenames on shared config', () => {
    const downloadScript = read('scripts/download-model.js');
    const ollamaManager = read('electron/ollamaManager.ts');

    expect(downloadScript).toContain('../shared/vlmModelConfig.js');
    expect(downloadScript).toContain('VLM_MODEL_FILE');
    expect(downloadScript).toContain('VLM_MODEL_URL');
    expect(downloadScript).toContain('VLM_MMPROJ_FILE');
    expect(downloadScript).toContain('VLM_MMPROJ_URL');
    expect(ollamaManager).toContain('../shared/vlmModelConfig.js');
    expect(ollamaManager).toContain('VLM_MODEL_FILE');
    expect(ollamaManager).toContain('VLM_MMPROJ_FILE');
    expect(downloadScript).not.toContain(oldUnslothRepo);
    expect(downloadScript).not.toContain(oldModelFile);
    expect(ollamaManager).not.toContain(oldModelFile);
  });
});
