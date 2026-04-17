import { Alert, Button, Card, Descriptions, Form, Input, message, Tag, Typography } from 'antd';
import { useState } from 'react';
import { http } from '@/services/http';

const codeSample = `{
  "model": "qwen3.5-vl",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "请分析这张社区监控截图中的风险" },
        { "type": "image_url", "image_url": { "url": "https://example.com/scene.jpg" } }
      ]
    }
  ],
  "temperature": 0.2,
  "max_tokens": 1024
}`;

const frontendEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '未设置（默认同源）',
  qwenProxyPath: import.meta.env.VITE_QWEN_PROXY_PATH || '/api/qwen/chat/completions',
  qwenModel: import.meta.env.VITE_QWEN_MODEL || 'qwen3.5-vl',
  baiduAk: import.meta.env.VITE_BAIDU_MAP_AK ? '已配置' : '未配置',
  demoStreamUrl: import.meta.env.VITE_DEMO_STREAM_URL || '未配置',
  demoStreamType: import.meta.env.VITE_DEMO_STREAM_TYPE || 'flv'
};

export function ModelCenterPage() {
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<Record<string, unknown>>();
  const [api, contextHolder] = message.useMessage();

  const handleHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await http.get('/api/health');
      setHealth(response.data);
      api.success('代理服务已连通');
    } catch (error) {
      api.error(error instanceof Error ? error.message : '代理服务检查失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {contextHolder}
      <div className="model-grid">
        <Card title="前端运行配置" variant="borderless">
          <Descriptions column={1} size="small" labelStyle={{ width: 120 }}>
            <Descriptions.Item label="API Base URL">{frontendEnv.apiBaseUrl}</Descriptions.Item>
            <Descriptions.Item label="Qwen 代理路径">{frontendEnv.qwenProxyPath}</Descriptions.Item>
            <Descriptions.Item label="默认模型">{frontendEnv.qwenModel}</Descriptions.Item>
            <Descriptions.Item label="百度地图 AK">{frontendEnv.baiduAk}</Descriptions.Item>
            <Descriptions.Item label="演示流地址">{frontendEnv.demoStreamUrl}</Descriptions.Item>
            <Descriptions.Item label="演示流类型">{frontendEnv.demoStreamType}</Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 8 }}>
            <Button type="primary" size="small" loading={loading} onClick={handleHealthCheck}>
              检查后端代理状态
            </Button>
          </div>

          {health ? (
            <Alert
              style={{ marginTop: 8 }}
              type="success"
              showIcon
              message="代理服务返回成功"
              description={<pre className="code-block">{JSON.stringify(health, null, 2)}</pre>}
            />
          ) : null}
        </Card>

        <Card title="后端代理配置模板" variant="borderless">
          <Form layout="vertical" size="small">
            <Form.Item label="QWEN_BASE_URL">
              <Input placeholder="写入 .env.server，例如 https://xxx/v1" />
            </Form.Item>
            <Form.Item label="QWEN_API_KEY">
              <Input.Password placeholder="写入 .env.server" />
            </Form.Item>
            <Form.Item label="QWEN_MODEL">
              <Input placeholder="qwen3.5-vl" />
            </Form.Item>
            <Form.Item label="SERVER_PORT / CORS_ORIGIN">
              <Input placeholder="例如 8787 / http://localhost:5173" />
            </Form.Item>
            <Alert
              type="info"
              showIcon
              message="后端代理模式"
              description="前端统一请求 /api/qwen/chat/completions，由本地 Node/Express 服务转发到 Qwen 接口。"
            />
          </Form>
        </Card>

        <Card title="请求体示例" variant="borderless">
          <Typography.Paragraph style={{ fontSize: 11, marginBottom: 6 }}>
            前端通过 <Tag>/api/qwen/chat/completions</Tag> 访问后端代理，再由代理转发到 Qwen 接口。
          </Typography.Paragraph>
          <pre className="code-block">{codeSample}</pre>
        </Card>

        <Card title="开发说明" variant="borderless">
          <Typography.Paragraph style={{ fontSize: 11, marginBottom: 4 }}>
            1. 前端复制 <Tag>.env.example</Tag> 为 <Tag>.env</Tag>
          </Typography.Paragraph>
          <Typography.Paragraph style={{ fontSize: 11, marginBottom: 4 }}>
            2. 后端复制 <Tag>.env.server.example</Tag> 为 <Tag>.env.server</Tag>
          </Typography.Paragraph>
          <Typography.Paragraph style={{ fontSize: 11, marginBottom: 4 }}>
            3. 开发时执行 <Tag>npm run dev:all</Tag>，Vite 会把 <Tag>/api</Tag> 请求代理到本地 Node 服务
          </Typography.Paragraph>
          <Typography.Paragraph style={{ fontSize: 11, marginBottom: 0 }}>
            4. 地图 AK 需要百度地图浏览器端密钥；视频流可先填 HTTP-FLV / MPEG-TS 地址
          </Typography.Paragraph>
        </Card>
      </div>
    </div>
  );
}
