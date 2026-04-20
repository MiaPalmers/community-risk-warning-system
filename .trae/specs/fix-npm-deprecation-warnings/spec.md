# 修复 npm 弃用警告 Spec

## Why
执行 `npm install` 时出现多个弃用警告（inflight、rimraf@2、glob@7、boolean@3、glob@10），这些均来自 `electron-builder` 的传递依赖。需要尽可能消除这些警告，保持依赖树健康。

## What Changes
- 在 `package.json` 中添加 `overrides` 字段，将可安全替换的弃用包强制升级到最新版本
- 更新 `electron-builder` 到最新版本，利用上游已修复的依赖
- 执行 `npm update` 刷新 lockfile，拉取兼容范围内的最新版本

## Impact
- Affected code: `package.json`、`package-lock.json`
- Affected specs: 无其他 spec 受影响
- 风险：overrides 可能导致不兼容，需通过构建验证

## 依赖链分析

| 弃用包 | 版本 | 来源链 | 可否 override |
|--------|------|--------|---------------|
| inflight | 1.0.6 | glob@7 → inflight | ❌ 随 glob@7 消失而消失 |
| glob | 7.2.3 | temp@0.9.4 → rimraf@2 → glob@7 | ❌ API 不兼容，无法升级 |
| rimraf | 2.6.3 | temp@0.9.4 → rimraf@2 | ❌ temp 要求 v2 API |
| boolean | 3.2.0 | global-agent@3 / roarr@2 → boolean | ✅ 可 override |
| glob | 10.5.0 | cacache → glob@10 | ✅ 可 override 到 glob@11 |

## ADDED Requirements

### Requirement: npm overrides 配置
系统 SHALL 在 `package.json` 中配置 `overrides` 字段，将以下弃用包强制替换为最新兼容版本：
- `boolean` → 最新版本
- `glob`（针对 cacache 中的 glob@10）→ glob@11

### Requirement: electron-builder 更新
系统 SHALL 将 `electron-builder` 更新到最新稳定版本，以获取上游依赖更新。

### Requirement: 构建验证
完成所有更改后，系统 SHALL 通过 `npm run build` 验证项目可正常构建。

#### Scenario: 依赖安装无弃用警告
- **WHEN** 执行 `npm install`
- **THEN** inflight、glob@7、rimraf@2 的警告可能仍存在（来自 electron-builder 深层依赖），但 boolean 和 glob@10 的警告 SHALL 消除

#### Scenario: 构建成功
- **WHEN** 执行 `npm run build`
- **THEN** 构建成功完成，无错误
