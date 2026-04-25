import { describe, expect, it } from 'vitest';
import {
  DEFAULT_VLM_MODEL_ALIAS,
  VLM_MODEL_FILE,
  VLM_MODEL_REPO,
  VLM_MODEL_SHA256,
  VLM_MODEL_URL,
  VLM_MMPROJ_FILE,
  VLM_MMPROJ_SHA256,
  VLM_MMPROJ_URL
} from './vlmModelConfig.js';

describe('vlmModelConfig', () => {
  it('keeps the current Jackrong model alias and file names unchanged', () => {
    expect(DEFAULT_VLM_MODEL_ALIAS).toBe('jackrong-qwen3.5-4b-claude-4.6-opus-distilled-v2:q4_k_m');
    expect(VLM_MODEL_REPO).toBe('Jackrong/Qwen3.5-4B-Claude-4.6-Opus-Reasoning-Distilled-v2-GGUF');
    expect(VLM_MODEL_FILE).toBe('Qwen3.5-4B.Q4_K_M.gguf');
    expect(VLM_MMPROJ_FILE).toBe('mmproj-BF16.gguf');
    expect(VLM_MODEL_SHA256).toBe('de8cf2454c46ec34e6b991dc11f5dd42d543926272d8a59d36ceb5a2eaf7962a');
    expect(VLM_MMPROJ_SHA256).toBe('32c003c4247825cd765bd882c0c2d3b3b071f4f909aa00f9e1d6404ba2422cf0');
  });

  it('derives Hugging Face download URLs from the shared repo and filenames', () => {
    expect(VLM_MODEL_URL).toBe(`https://huggingface.co/${VLM_MODEL_REPO}/resolve/main/${VLM_MODEL_FILE}`);
    expect(VLM_MMPROJ_URL).toBe(`https://huggingface.co/${VLM_MODEL_REPO}/resolve/main/${VLM_MMPROJ_FILE}`);
  });
});
