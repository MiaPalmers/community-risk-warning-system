import { describe, expect, it } from 'vitest';
import { loadVlmRuntimeConfig } from './vlmRuntimeConfig.js';

describe('vlmRuntimeConfig', () => {
  it('defaults to a localhost CUDA-oriented runtime', () => {
    expect(loadVlmRuntimeConfig({})).toEqual({
      host: '127.0.0.1',
      port: 11434,
      gpuLayers: 99,
      contextSize: 4096,
      startupTimeoutMs: 60000
    });
  });

  it('supports CPU fallback and bounded startup tuning from environment variables', () => {
    expect(loadVlmRuntimeConfig({
      VLM_HOST: '0.0.0.0',
      VLM_PORT: '12345',
      VLM_FORCE_CPU: 'true',
      VLM_CONTEXT_SIZE: '2048',
      VLM_STARTUP_TIMEOUT_MS: '15000'
    })).toEqual({
      host: '127.0.0.1',
      port: 12345,
      gpuLayers: 0,
      contextSize: 2048,
      startupTimeoutMs: 15000
    });
  });
});
