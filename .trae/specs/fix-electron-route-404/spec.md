# 修复 Electron 打包后路由 404 问题 Spec

## Why
Electron 打包为 exe 后，应用启动直接显示"页面不存在 请返回系统首页继续操作"的 404 页面。原因是 `createBrowserRouter` 依赖 HTML5 History API，而该 API 在 `file://` 协议下不可用，导致所有路由匹配失败。

## What Changes
- 将 `createBrowserRouter` 替换为 `createHashRouter`，使路由基于 URL hash 片段工作，完全兼容 `file://` 协议

## Impact
- Affected code: `src/router/index.tsx`
- 影响范围：所有路由的 URL 格式从 `/overview` 变为 `#/overview`，功能行为不变

## ADDED Requirements

### Requirement: Electron 生产环境路由兼容性
系统 SHALL 在 `file://` 协议下正确加载和导航所有已注册路由。

#### Scenario: 打包后的 Electron 应用启动
- **WHEN** 用户打开打包后的 exe 文件
- **THEN** 应用正确加载默认路由页面（`/overview`），而非显示 404 页面

#### Scenario: 页面导航
- **WHEN** 用户在打包后的应用中点击路由链接
- **THEN** 页面正常导航到目标路由，不出现 404

## MODIFIED Requirements

### Requirement: 路由创建方式
路由 SHALL 使用 `createHashRouter` 而非 `createBrowserRouter` 创建，以确保在 Electron 的 `file://` 协议和开发环境的 `http://` 协议下均能正常工作。
