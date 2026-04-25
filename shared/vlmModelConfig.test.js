import { describe, expect, it } from 'vitest';
import {
  DEFAULT_VLM_MODEL_ALIAS,
  VLM_MODEL_FILE,
  VLM_MODEL_REPO,
  VLM_MODEL_URL,
  VLM_MMPROJ_FILE,
  VLM_MMPROJ_URL
} from './vlmModelConfig.js';

describe('vlmModelConfig', () => {
  it('keeps the current Jackrong model alias and file names unchanged', () => {
    expect(DEFAULT_VLM_MODEL_ALIAS).toBe('jackrong-qwen3.5-4b-claude-4.6-opus-distilled-v2:q4_k_m');
    expect(VLM_MODEL_REPO).toBe('Jackrong/Qwen3.5-4B-Claude-4.6-Opus-Reasoning-Distilled-v2-GGUF');
    expect(VLM_MODEL_FILE).toBe('Qwen3.5-4B.Q4_K_M.gguf');
    expect(VLM_MMPROJ_FILE).toBe('mmproj-BF16.gguf');
  });

  it('derives Hugging Face download URLs from the shared repo and filenames', () => {
    expect(VLM_MODEL_URL).toBe(`https://huggingface.co/${VLM_MODEL_REPO}/resolve/main/${VLM_MODEL_FILE}`);
    expect(VLM_MMPROJ_URL).toBe(`https://huggingface.co/${VLM_MODEL_REPO}/resolve/main/${VLM_MMPROJ_FILE}`);
  });
});
