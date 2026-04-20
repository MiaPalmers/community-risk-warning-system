# 修复 CI 构建因 .env 缺失导致 exe 无法正常运行 Spec

## Why
`.env` 和 `.env.server` 被 `.gitignore` 排除，GitHub 仓库中不包含这些文件。CI 构建时没有 `.env`，导致：
1. **构建时**：Vite 无法读取 `VITE_*` 变量（如 `VITE_BAIDU_MAP_AK`），渲染进程中的地图、模型名等功能降级或失效。
2. **运行时**：打包后的 exe 通过 `dotenv.config()` 尝试读取 `.env.server`，但路径为相对路径，在打包环境下无法正确定位到 exe 同级目录，导致 Qwen 代理服务无法配置。

## What Changes
- 修改 `.github/workflows/build.yml`，在 `npm run build` 之前从 GitHub Secrets 创建 `.env` 文件，确保 Vite 构建时能嵌入所有 `VITE_*` 变量。
- 修改 `electron/main.ts`，将 `dotenv.config()` 的路径从相对路径改为基于 `app.getPath('exe')` 目录的绝对路径，确保打包后的 exe 能正确读取 exe 同级目录下的 `.env.server`。
- 修改 `package.json` 的 `build.files` 配置，将 `.env.server.example` 打包进发行版，方便用户参考配置。

## Impact
- Affected specs: CI/CD 构建流程、Electron 运行时配置加载
- Affected code: `.github/workflows/build.yml`、`electron/main.ts`、`package.json`

## ADDED Requirements

### Requirement: CI 构建时注入环境变量
系统 SHALL 在 CI 构建流程中，在 `npm run build` 步骤之前，从 GitHub Secrets 创建 `.env` 文件，使 Vite 构建时能正确嵌入所有 `VITE_*` 前缀的环境变量。

#### Scenario: CI 构建成功嵌入环境变量
- **WHEN** CI workflow 触发构建
- **THEN** 在执行 `npm run build` 之前，`.env` 文件已从 GitHub Secrets 中创建
- **AND** 构建产物中 `import.meta.env.VITE_BAIDU_MAP_AK` 等变量值正确

### Requirement: 打包后 exe 能从 exe 同级目录读取 .env.server
系统 SHALL 在 Electron 主进程中，使用基于可执行文件所在目录的绝对路径来加载 `.env.server`，而非相对路径。

#### Scenario: 用户将 .env.server 放在 exe 同级目录
- **WHEN** 用户在 exe 同级目录放置 `.env.server` 文件
- **THEN** Electron 主进程能正确读取其中的配置项（如 `QWEN_BASE_URL`、`QWEN_API_KEY`）

#### Scenario: .env.server 不存在时优雅降级
- **WHEN** exe 同级目录没有 `.env.server` 文件
- **THEN** 应用仍可正常启动，Qwen 代理服务使用默认配置（API 功能不可用，但不崩溃）

### Requirement: 发行版包含 .env.server.example
系统 SHALL 在打包产物中包含 `.env.server.example` 文件，供用户参考创建自己的 `.env.server`。

#### Scenario: 用户解压发行版后可参考配置模板
- **WHEN** 用户解压 CI 生成的 zip 包
- **THEN** 能在包内找到 `.env.server.example` 文件，其中包含所有可配置项的说明和示例值
