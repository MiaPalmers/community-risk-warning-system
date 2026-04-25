import express from 'express';
import cors from 'cors';
import { resolveOllamaHealthStatus } from './ollamaHealthStatus.js';
import { DEFAULT_VLM_MODEL_ALIAS } from '../shared/vlmModelConfig.js';

function parseCorsOrigin(rawOrigin = 'http://localhost:5173') {
  const trimmed = rawOrigin.trim();
  if (trimmed === '*') {
    return true;
  }

  return trimmed
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isAllowedCorsOrigin(origin, corsOrigin) {
  if (corsOrigin === true) {
    return true;
  }

  if (!origin || origin === 'null' || origin.startsWith('file://')) {
    return true;
  }

  return corsOrigin.includes(origin);
}

function createCorsOriginOption(corsOrigin) {
  if (corsOrigin === true) {
    return true;
  }

  return (origin, callback) => {
    callback(null, isAllowedCorsOrigin(origin, corsOrigin));
  };
}

export function loadQwenProxyConfig(env = process.env) {
  return {
    port: Number(env.SERVER_PORT || 8787),
    corsOrigin: parseCorsOrigin(env.CORS_ORIGIN || 'http://localhost:5173'),
    qwenBaseUrl: (env.QWEN_BASE_URL || '').replace(/\/$/, ''),
    qwenApiKey: env.QWEN_API_KEY || '',
    qwenModel: env.QWEN_MODEL || DEFAULT_VLM_MODEL_ALIAS,
    qwenTimeout: Number(env.QWEN_TIMEOUT || 60000)
  };
}

export function buildQwenRequestBody(body = {}, defaultModel) {
  const requestBody = { ...body };

  if (!requestBody.model) {
    requestBody.model = defaultModel;
  }

  return requestBody;
}

export function parseProxyResponseText(text, onInvalidJson) {
  try {
    return JSON.parse(text);
  } catch {
    onInvalidJson?.(text);
    return { raw: text };
  }
}

export function buildProxyErrorResponse(error, options) {
  const isAbortError = error instanceof Error && error.name === 'AbortError';
  return {
    statusCode: isAbortError ? 504 : 500,
    body: {
      error: {
        message: isAbortError
          ? options.timeoutMessage
          : error instanceof Error
            ? error.message
            : options.fallbackMessage,
        type: isAbortError ? options.timeoutType : options.fallbackType
      }
    }
  };
}

export function createQwenProxyApp(config = loadQwenProxyConfig()) {
  const app = express();

  app.use(
    cors({
      origin: createCorsOriginOption(config.corsOrigin),
      credentials: config.corsOrigin !== true
    })
  );
  app.use(express.json({ limit: '50mb' }));

  createOllamaProxyRoutes(app);

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'community-risk-warning-proxy',
      qwenConfigured: Boolean(config.qwenBaseUrl && config.qwenApiKey),
      model: config.qwenModel,
      timestamp: new Date().toISOString()
    });
  });

  app.post('/api/qwen/chat/completions', async (req, res) => {
    if (!config.qwenBaseUrl || !config.qwenApiKey) {
      return res.status(500).json({
        error: {
          message: 'QWEN_BASE_URL 或 QWEN_API_KEY 未配置，请检查 .env.server',
          type: 'configuration_error'
        }
      });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.qwenTimeout);

    try {
      const response = await fetch(`${config.qwenBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.qwenApiKey}`
        },
        body: JSON.stringify(buildQwenRequestBody(req.body, config.qwenModel)),
        signal: controller.signal
      });

      const text = await response.text();
      const payload = parseProxyResponseText(text);

      return res.status(response.status).json(payload);
    } catch (error) {
      const errorResponse = buildProxyErrorResponse(error, {
        timeoutMessage: 'Qwen 接口请求超时',
        timeoutType: 'timeout_error',
        fallbackMessage: '代理请求失败',
        fallbackType: 'proxy_error'
      });
      return res.status(errorResponse.statusCode).json(errorResponse.body);
    } finally {
      clearTimeout(timer);
    }
  });

  return app;
}

export function createOllamaProxyRoutes(app) {
  const OLLAMA_BASE = 'http://127.0.0.1:11434';

  app.post('/api/ollama/chat/completions', async (req, res) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120000);

    try {
      const response = await fetch(`${OLLAMA_BASE}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        signal: controller.signal
      });

      const text = await response.text();
      const payload = parseProxyResponseText(text, (rawText) => {
        console.error('[ollama-proxy] Non-JSON response:', rawText.slice(0, 500));
      });

      if (payload?.choices?.[0]?.message?.content) {
        const content = payload.choices[0].message.content;
        console.log('[ollama-proxy] Model output length:', content.length);
        if (content.length < 500) {
          console.log('[ollama-proxy] Model output:', content);
        } else {
          console.log('[ollama-proxy] Model output (first 300):', content.slice(0, 300));
          console.log('[ollama-proxy] Model output (last 200):', content.slice(-200));
        }
      }

      return res.status(response.status).json(payload);
    } catch (error) {
      const errorResponse = buildProxyErrorResponse(error, {
        timeoutMessage: 'Ollama 推理超时',
        timeoutType: 'timeout',
        fallbackMessage: '代理请求失败',
        fallbackType: 'proxy_error'
      });
      return res.status(errorResponse.statusCode).json(errorResponse.body);
    } finally {
      clearTimeout(timer);
    }
  });

  app.get('/api/ollama/status', async (_req, res) => {
    try {
      const r = await fetch(`${OLLAMA_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      res.json(resolveOllamaHealthStatus(r.status));
    } catch {
      res.json({ ready: false, status: 'error', gpu: 'unknown' });
    }
  });
}
