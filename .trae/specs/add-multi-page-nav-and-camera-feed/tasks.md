# Tasks

- [x] Task 1: 新建 `useLocalCamera` Hook
  - [x] SubTask 1.1: 创建 `src/hooks/useLocalCamera.ts`，封装 `navigator.mediaDevices.getUserMedia` 逻辑
  - [x] SubTask 1.2: Hook 管理 loading / stream / error 状态，组件卸载时自动释放摄像头轨道

- [x] Task 2: 新建 MonitorPage 实时监控页面
  - [x] SubTask 2.1: 创建 `src/pages/MonitorPage.tsx`，左右两栏布局
  - [x] SubTask 2.2: 左侧使用 `useLocalCamera` Hook 获取摄像头流并通过 `<video>` 元素播放
  - [x] SubTask 2.3: 摄像头画面上叠加"实时监控"标题、摄像头名称和时间戳水印
  - [x] SubTask 2.4: 右侧展示监控点位列表（复用 store 中的 cameras 数据），点击可切换 activeCameraId
  - [x] SubTask 2.5: 处理摄像头权限拒绝情况，显示友好提示

- [x] Task 3: 新建 AlertsPage 重点预警页面
  - [x] SubTask 3.1: 创建 `src/pages/AlertsPage.tsx`，左（列表）右（详情）两栏布局
  - [x] SubTask 3.2: 左侧展示所有预警事件列表，按风险分数降序排列，支持按等级筛选（A/B/C/全部）
  - [x] SubTask 3.3: 右侧展示选中事件的详细信息（摘要、处置建议、VLM 分析）
  - [x] SubTask 3.4: 点击事件高亮并联动右侧详情

- [x] Task 4: 修改 MainLayout 标题栏，添加导航按钮
  - [x] SubTask 4.1: 将 `header-center` 中的静态文字替换为三个 NavLink 按钮：【总览】(`/overview`)、【监控选择】(`/monitor`)、【重点预警】(`/alerts`)
  - [x] SubTask 4.2: 使用 `useLocation` 或 NavLink 的 active 状态控制按钮高亮样式

- [x] Task 5: 注册新页面路由
  - [x] SubTask 5.1: 在 `src/router/pages.tsx` 中新增 MonitorPage 和 AlertsPage 的路由条目
  - [x] SubTask 5.2: 确认默认路由仍为 `/overview`

- [x] Task 6: 添加 CSS 样式
  - [x] SubTask 6.1: 添加导航按钮样式（`.header-nav-btn`、`.header-nav-btn.active`），匹配深蓝科幻主题
  - [x] SubTask 6.2: 添加 MonitorPage 布局样式（左右两栏、视频容器、水印覆盖层、摄像头列表）
  - [x] SubTask 6.3: 添加 AlertsPage 布局样式（事件列表、筛选栏、事件详情面板）

- [x] Task 7: 验证
  - [x] SubTask 7.1: 运行 `npm run typecheck` 确保无类型错误
  - [x] SubTask 7.2: 运行 `npm run build` 确保构建成功

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 5] depends on [Task 2, Task 3]
- [Task 6] depends on [Task 2, Task 3, Task 4]
- [Task 7] depends on [Task 4, Task 5, Task 6]
