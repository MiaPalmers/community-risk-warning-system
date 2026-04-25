import { describe, expect, it } from 'vitest';
import {
  API_HEALTH_ROUTE,
  OLLAMA_CHAT_COMPLETIONS_ROUTE,
  OLLAMA_STATUS_ROUTE,
  QWEN_CHAT_COMPLETIONS_ROUTE
} from './apiRoutes.js';

describe('apiRoutes', () => {
  it('keeps public proxy route paths unchanged', () => {
    expect(API_HEALTH_ROUTE).toBe('/api/health');
    expect(QWEN_CHAT_COMPLETIONS_ROUTE).toBe('/api/qwen/chat/completions');
    expect(OLLAMA_CHAT_COMPLETIONS_ROUTE).toBe('/api/ollama/chat/completions');
    expect(OLLAMA_STATUS_ROUTE).toBe('/api/ollama/status');
  });
});
