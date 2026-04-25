import { describe, expect, it } from 'vitest';
import {
  buildProxyErrorResponse,
  buildQwenRequestBody,
  isAllowedCorsOrigin,
  loadQwenProxyConfig,
  parseProxyResponseText
} from './qwenProxy.js';
import { resolveOllamaHealthStatus } from './ollamaHealthStatus.js';
import { DEFAULT_VLM_MODEL_ALIAS } from '../shared/vlmModelConfig.js';

describe('qwenProxy', () => {
  it('normalizes config from environment variables', () => {
    const config = loadQwenProxyConfig({
      CORS_ORIGIN: 'http://localhost:5173, http://localhost:4173',
      QWEN_BASE_URL: 'http://127.0.0.1:1234/v1/',
      QWEN_API_KEY: 'test-key',
      QWEN_MODEL: 'qwen-vl',
      QWEN_TIMEOUT: '12000'
    });

    expect(config.corsOrigin).toEqual(['http://localhost:5173', 'http://localhost:4173']);
    expect(config.qwenBaseUrl).toBe('http://127.0.0.1:1234/v1');
    expect(config.qwenApiKey).toBe('test-key');
    expect(config.qwenModel).toBe('qwen-vl');
    expect(config.qwenTimeout).toBe(12000);
  });

  it('defaults to the Jackrong distilled Qwen3.5 4B model', () => {
    const config = loadQwenProxyConfig({});

    expect(config.qwenModel).toBe(DEFAULT_VLM_MODEL_ALIAS);
  });

  it('uses the default model only when the request body omits model', () => {
    expect(buildQwenRequestBody({ messages: [] }, 'qwen-default')).toEqual({
      model: 'qwen-default',
      messages: []
    });

    expect(buildQwenRequestBody({ model: 'custom', messages: [] }, 'qwen-default')).toEqual({
      model: 'custom',
      messages: []
    });
  });

  it('allows Electron file origins without opening configured web origins broadly', () => {
    const allowedOrigins = ['http://localhost:5173'];

    expect(isAllowedCorsOrigin(undefined, allowedOrigins)).toBe(true);
    expect(isAllowedCorsOrigin('null', allowedOrigins)).toBe(true);
    expect(isAllowedCorsOrigin('file://', allowedOrigins)).toBe(true);
    expect(isAllowedCorsOrigin('http://localhost:5173', allowedOrigins)).toBe(true);
    expect(isAllowedCorsOrigin('https://example.com', allowedOrigins)).toBe(false);
  });

  it('maps Ollama health responses without treating 503 as ready', () => {
    expect(resolveOllamaHealthStatus(200)).toEqual({ ready: true, status: 'ready', gpu: 'unknown' });
    expect(resolveOllamaHealthStatus(503)).toEqual({ ready: false, status: 'loading', gpu: 'unknown' });
    expect(resolveOllamaHealthStatus(500)).toEqual({ ready: false, status: 'error', gpu: 'unknown' });
  });

  it('parses upstream JSON responses', () => {
    expect(parseProxyResponseText('{"choices":[{"message":{"content":"ok"}}]}')).toEqual({
      choices: [{ message: { content: 'ok' } }]
    });
  });

  it('keeps non-JSON upstream responses in a raw payload', () => {
    expect(parseProxyResponseText('service unavailable')).toEqual({ raw: 'service unavailable' });
  });

  it('builds Qwen timeout and proxy error responses without changing payload shape', () => {
    const timeoutError = new Error('aborted');
    timeoutError.name = 'AbortError';

    expect(buildProxyErrorResponse(timeoutError, {
      timeoutMessage: 'Qwen 接口请求超时',
      timeoutType: 'timeout_error',
      fallbackMessage: '代理请求失败',
      fallbackType: 'proxy_error'
    })).toEqual({
      statusCode: 504,
      body: {
        error: {
          message: 'Qwen 接口请求超时',
          type: 'timeout_error'
        }
      }
    });

    expect(buildProxyErrorResponse(new Error('network down'), {
      timeoutMessage: 'Qwen 接口请求超时',
      timeoutType: 'timeout_error',
      fallbackMessage: '代理请求失败',
      fallbackType: 'proxy_error'
    })).toEqual({
      statusCode: 500,
      body: {
        error: {
          message: 'network down',
          type: 'proxy_error'
        }
      }
    });
  });

  it('builds Ollama timeout responses with the existing timeout type', () => {
    const timeoutError = new Error('aborted');
    timeoutError.name = 'AbortError';

    expect(buildProxyErrorResponse(timeoutError, {
      timeoutMessage: 'Ollama 推理超时',
      timeoutType: 'timeout',
      fallbackMessage: '代理请求失败',
      fallbackType: 'proxy_error'
    })).toEqual({
      statusCode: 504,
      body: {
        error: {
          message: 'Ollama 推理超时',
          type: 'timeout'
        }
      }
    });
  });
});
