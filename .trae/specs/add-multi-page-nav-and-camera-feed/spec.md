# 多页面导航与实时摄像头监控 Spec

## Why
当前应用为单页大屏仪表盘，顶部标题栏中间显示静态文字"社区风险预警平台"，中栏仅展示百度地图态势。需要引入多页面导航机制，使用户能在总览、监控选择、重点预警三个视图间切换，并在监控选择页面提供 Windows 摄像头实时画面作为演示。

## What Changes
- 将顶部标题栏中间的"社区风险预警平台"静态文字替换为三个导航按钮：【总览】、【监控选择】、【重点预警】
- 新增三个页面路由：`/overview`（总览，沿用现有 OverviewPage）、`/monitor`（监控选择）、`/alerts`（重点预警）
- 新建 MonitorPage 页面，展示 Windows 摄像头实时画面（通过 `navigator.mediaDevices.getUserMedia` 获取本地摄像头流）
- 新建 AlertsPage 页面，展示重点预警事件列表与详情
- 修改 MainLayout 中栏，使标题栏中间区域渲染导航按钮而非静态文字
- 修改路由配置，注册三个页面路由，默认路由保持 `/overview`
- 在 MonitorPage 中实现摄像头视频流获取与显示的 React hook（useLocalCamera）

## Impact
- Affected code:
  - `src/layouts/MainLayout.tsx` — 标题栏中间区域改为导航按钮
  - `src/router/pages.tsx` — 注册 MonitorPage、AlertsPage 路由
  - `src/router/index.tsx` — 可能微调路由结构
  - `src/pages/MonitorPage.tsx` — 新建，实时摄像头监控页面
  - `src/pages/AlertsPage.tsx` — 新建，重点预警页面
  - `src/hooks/useLocalCamera.ts` — 新建，封装摄像头流获取逻辑
  - `src/styles.css` — 新增导航按钮样式、MonitorPage 布局样式、AlertsPage 布局样式

## ADDED Requirements

### Requirement: 顶部导航按钮
MainLayout 标题栏中间区域应显示三个导航按钮：【总览】、【监控选择】、【重点预警】。当前激活页面的按钮应有高亮样式，点击按钮通过 React Router 导航到对应路由。

#### Scenario: 用户点击导航按钮
- **WHEN** 用户点击【监控选择】按钮
- **THEN** 页面导航到 `/monitor` 路由
- **AND** 【监控选择】按钮呈现高亮激活状态
- **AND** 其他按钮恢复默认样式

#### Scenario: 导航按钮样式
- **WHEN** 大屏加载完成
- **THEN** 标题栏中间显示三个等间距的导航按钮
- **AND** 当前激活页面的按钮有蓝色/青色高亮背景
- **AND** 非激活按钮为半透明背景
- **AND** 按钮风格与整体深蓝科幻主题一致

### Requirement: 总览页面
总览页面（`/overview`）保持现有 OverviewPage 的三栏大屏布局不变，包括左栏设备状态/风险等级/事件统计、中栏百度地图态势和实时预警滚动条、右栏 VLM 研判/事件排行/风险趋势。

#### Scenario: 用户访问总览页面
- **WHEN** 用户点击【总览】按钮或应用默认加载
- **THEN** 显示现有的三栏大屏仪表盘
- **AND** 所有面板内容与当前一致

### Requirement: 监控选择页面（MonitorPage）
监控选择页面（`/monitor`）应展示 Windows 本地摄像头的实时视频画面作为演示。页面采用左右两栏布局：左侧显示摄像头实时画面（大面积），右侧显示摄像头列表和点位信息。

#### Scenario: 用户进入监控选择页面
- **WHEN** 用户点击【监控选择】按钮
- **THEN** 页面请求本地摄像头权限
- **AND** 授权后左侧大面积区域显示摄像头实时画面
- **AND** 右侧显示模拟的监控点位列表（复用 store 中的 cameras 数据）

#### Scenario: 摄像头权限被拒绝
- **WHEN** 用户拒绝摄像头权限请求
- **THEN** 视频区域显示友好的提示信息，说明需要摄像头权限
- **AND** 页面其他功能不受影响

#### Scenario: 摄像头画面显示
- **WHEN** 摄像头成功连接
- **THEN** 视频画面自适应容器大小，保持宽高比
- **AND** 画面上方显示"实时监控"标题
- **AND** 画面上叠加半透明的摄像头名称和时间戳水印

### Requirement: 重点预警页面（AlertsPage）
重点预警页面（`/alerts`）应以列表形式展示所有预警事件，支持按风险等级筛选。页面采用单栏或双栏布局，左侧/上方为预警事件列表，右侧/下方为选中事件的详情展示。

#### Scenario: 用户进入重点预警页面
- **WHEN** 用户点击【重点预警】按钮
- **THEN** 页面展示所有预警事件列表
- **AND** 事件按风险分数从高到低排列
- **AND** 每条事件显示标题、摄像头名称、风险分数、等级标签、发生时间

#### Scenario: 用户点击预警事件
- **WHEN** 用户在预警列表中点击某条事件
- **THEN** 右侧/下方显示该事件的详细信息
- **AND** 包含事件摘要、处置建议、VLM 分析结果
- **AND** 高亮当前选中事件

#### Scenario: 风险等级筛选
- **WHEN** 用户选择某个风险等级筛选条件（如 A 级）
- **THEN** 列表仅显示对应等级的预警事件
- **AND** 清除筛选后恢复显示全部事件

### Requirement: useLocalCamera Hook
新建 `useLocalCamera` 自定义 Hook，封装通过 `navigator.mediaDevices.getUserMedia` 获取本地摄像头视频流的逻辑。Hook 应管理摄像头流的生命周期（请求、获取、清理），返回视频流、加载状态和错误信息。

#### Scenario: Hook 成功获取摄像头流
- **WHEN** 组件挂载且用户授权摄像头
- **THEN** Hook 返回有效的 MediaStream 对象
- **AND** loading 状态为 false
- **AND** error 为 null

#### Scenario: Hook 处理摄像头拒绝
- **WHEN** 用户拒绝摄像头权限
- **THEN** Hook 返回 null 流
- **AND** loading 状态为 false
- **AND** error 包含友好的错误描述

#### Scenario: Hook 清理摄像头流
- **WHEN** 使用 Hook 的组件卸载
- **THEN** 所有摄像头轨道停止
- **AND** 资源被正确释放

## MODIFIED Requirements

### Requirement: MainLayout 标题栏中间区域
标题栏中间区域从显示静态文字"社区风险预警平台"改为渲染三个导航按钮（【总览】、【监控选择】、【重点预警】），使用 `react-router-dom` 的 `NavLink` 或 `useLocation` 判断当前激活路由。

## REMOVED Requirements

无移除需求。现有 OverviewPage 和相关组件保持不变。
