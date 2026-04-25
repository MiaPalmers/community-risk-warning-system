# 险封·社区风险预警平台（前后端联调骨架）

一个可直接导入 VS Code、可直接上传 GitHub 的综合系统骨架，基于 **React + TypeScript + Vite + Ant Design + Node/Express** 构建，面向“社区风险预警智能体”场景。

## 1. 当前已接入

- 总览页（实时视频 + VLM 实时数据 + 百度地图联动）
- 监控选择页（地图 / 列表 / 点位详情）
- 重点预警页（高危事件卡片 + 详情抽屉 + 证据包入口）
- **百度地图 JSAPI GL** 动态加载与点位标注
- **mpegts.js** 低延迟实时视频播放器骨架（适合 HTTP-FLV / MPEG-TS）
- **Qwen OpenAI-Compatible 后端代理**（Node/Express）
- 全局状态管理（Zustand）
- Mock 数据层（可快速替换成真实接口）

## 2. 技术栈

### 前端
- React 19
- TypeScript
- Vite
- React Router
- Ant Design
- Axios
- Zustand
- mpegts.js

### 后端代理
- Node.js
- Express
- dotenv
- cors

## 3. 启动方式

安装依赖：

```bash
npm install
```

前端开发：

```bash
npm run dev
```

后端代理：

```bash
npm run dev:server
```

前后端一起启动：

```bash
npm run dev:all
```

构建前端：

```bash
npm run build
```

## 4. 配置文件

### 4.1 前端配置

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

关键字段：

```env
VITE_BAIDU_MAP_AK=你的百度地图浏览器端AK
VITE_BAIDU_MAP_STYLE_ID=
VITE_BAIDU_MAP_CENTER_LNG=118.796877
VITE_BAIDU_MAP_CENTER_LAT=32.060255
VITE_BAIDU_MAP_ZOOM=16
VITE_QWEN_PROXY_PATH=/api/qwen/chat/completions
VITE_QWEN_MODEL=jackrong-qwen3.5-4b-claude-4.6-opus-distilled-v2:q4_k_m
VITE_DEMO_STREAM_URL=
VITE_DEMO_STREAM_TYPE=flv
```

### 4.2 后端代理配置

复制 `.env.server.example` 为 `.env.server`：

```bash
cp .env.server.example .env.server
```

关键字段：

```env
SERVER_PORT=8787
SERVER_HOST=127.0.0.1
CORS_ORIGIN=http://localhost:5173
ALLOW_LOCAL_FILE_ORIGINS=false
REQUEST_BODY_LIMIT=8mb
CHAT_REQUESTS_PER_MINUTE=30
MAX_CHAT_MESSAGES=16
MAX_CHAT_TOKENS=2048
LOG_MODEL_OUTPUT=false
QWEN_BASE_URL=http://127.0.0.1:1234/v1
QWEN_API_KEY=
QWEN_MODEL=jackrong-qwen3.5-4b-claude-4.6-opus-distilled-v2:q4_k_m
QWEN_TIMEOUT=60000
VLM_HOST=127.0.0.1
VLM_PORT=11434
VLM_FORCE_CPU=false
VLM_GPU_LAYERS=99
VLM_CONTEXT_SIZE=4096
VLM_STARTUP_TIMEOUT_MS=60000
```

## 5. Qwen 代理说明

前端不再直接暴露 API Key，而是统一请求：

```http
POST /api/qwen/chat/completions
```

本地开发时，Vite 会将 `/api` 自动代理到 `http://localhost:8787`。

后端代理入口文件：

```text
server/index.js
```

独立代理默认只绑定 `127.0.0.1`，生产日志默认不输出模型正文；如需排障可临时设置 `LOG_MODEL_OUTPUT=true`。请求体大小、每分钟请求数、消息数量和 `max_tokens` 都可通过 `.env.server` 调整。

你后续如果需要继续扩展，可以在这里接入：
- SSE 流式输出
- 图片上传转存
- 视频关键帧抽取
- 权限校验 / 用户鉴权
- 请求日志与审计

## 6. 实时视频说明

当前播放器组件位于：

```text
src/components/player/LiveVideoPlayer.tsx
```

默认支持：
- `flv`
- `mpegts`
- `hls`（浏览器原生）
- `mp4`

当前建议优先接入：
- 社区监控网关输出的 **HTTP-FLV**
- 或转码网关输出的 **MPEG-TS**

如果后续要做到更低时延，也可以把这一层换成 WebRTC。

## 7. 百度地图说明

地图组件位于：

```text
src/components/CameraMapPanel.tsx
```

SDK 加载器位于：

```text
src/services/map/baiduMap.ts
```

目前已支持：
- 动态加载百度地图 JSAPI GL
- 根据风险等级渲染摄像头点位
- 搜索定位与地图中心联动
- 标准路网 / 卫星图切换
- 点击点位切换当前监控视角

接入要求：
- 需填写真实的“百度地图浏览器端 AK”，不要保留占位文本
- 本地开发时，需将 `http://localhost:5173` 加入百度地图控制台的 Referer 白名单
- JSAPI GL 的脚本入口为 `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=你的AK`，运行时命名空间为 `BMapGL`
- 地图展示坐标请使用 `BD09`；如果你的数据源来自 `WGS84` 或 `GCJ02`，请先转换后再上图

常见故障排查顺序：
1. 确认 `.env` 中 `VITE_BAIDU_MAP_AK` 已填写为真实浏览器端 AK
2. 确认百度地图控制台已放行当前访问域名，例如 `http://localhost:5173`
3. 确认浏览器网络可以访问 `https://api.map.baidu.com`
4. 如果地图加载成功但点位整体偏移，再检查坐标是否为 `BD09`

## 8. 页面结构

```text
src
├─ components
│  ├─ player              # 实时视频播放器
│  └─ ...
├─ data                   # mock 数据
├─ layouts                # 布局
├─ pages                  # 路由页面
├─ router                 # 路由定义
├─ services
│  ├─ llm                 # Qwen 调用封装
│  ├─ map                 # 百度地图 SDK 加载器
│  └─ http.ts             # Axios 实例
├─ store                  # 全局状态
├─ types                  # 类型定义
└─ utils                  # 工具函数

server
└─ index.js               # Qwen 后端代理
```

## 9. 下一步推荐

接下来最值得继续补的是：
- 接入真实摄像头网关或视频平台
- 接入视频截图 / 关键帧抽取接口
- 增加事件趋势图表（ECharts）
- 增加证据包导出与工单流转
- 增加用户登录、权限与审计日志
