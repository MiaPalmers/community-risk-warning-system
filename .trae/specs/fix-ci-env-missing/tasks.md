# Tasks

- [x] Task 1: 修改 CI workflow 从 GitHub Secrets 注入 .env
  - [x] SubTask 1.1: 在 `.github/workflows/build.yml` 的 `npm run build` 之前添加步骤，使用 GitHub Secrets 创建 `.env` 文件
- [x] Task 2: 修改 Electron 主进程的 dotenv 路径解析
  - [x] SubTask 2.1: 修改 `electron/main.ts`，将 `dotenv.config()` 的 `.env.server` 路径改为基于 `app.getPath('exe')` 目录的绝对路径
  - [x] SubTask 2.2: 添加 `.env.server` 文件不存在的容错处理，确保应用不会崩溃
- [x] Task 3: 将 .env.server.example 纳入打包配置
  - [x] SubTask 3.1: 修改 `package.json` 的 `build.files`，添加 `.env.server.example` 的包含规则
- [x] Task 4: 验证构建和类型检查通过
  - [x] SubTask 4.1: 运行 `npm run typecheck` 确认类型无误（electron 部分通过，其余为已有 vitest 声明问题）
  - [x] SubTask 4.2: 运行 `npm run build` 确认构建成功

# Task Dependencies
- [Task 4] depends on [Task 1], [Task 2], [Task 3]
- [Task 1], [Task 2], [Task 3] 之间无依赖，可并行执行
