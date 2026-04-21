# Tasks

- [x] Task 1: 修改导航栏按钮顺序
  - [x] 调整 MainLayout.tsx 中导航链接顺序为：监控选择、总览、重点预警

- [x] Task 2: 重构 OverviewPage 为三栏布局
  - [x] 将 OverviewPage.tsx 从 2×2 网格改为三栏布局（左-中-右）
  - [x] 左侧面板：视频/实时监控画面（上） + VLM 实时数据（下）
  - [x] 中间面板：地图显示摄像头位置（上） + 数据分析板块（环形图+折线图）（下）
  - [x] 右侧面板：重点预警事件列表

- [x] Task 3: 更新 CSS 样式
  - [x] 修改 `.overview-grid` 为三栏布局（约 3:4:3 比例）
  - [x] 确保各面板正确排列：左侧纵向分上下两区、中间纵向分上下两区、右侧为预警列表
  - [x] 保留现有的暗色科技风格主题

- [x] Task 4: VLM 数据面板适配
  - [x] 确保 VlmAnalysisPanel 在左侧面板中以 compact 模式展示4个分析维度
  - [x] 显示风险分数和等级（如 "风险分数 80 等级：A"）

- [x] Task 5: 右侧重点预警面板
  - [x] 在右侧面板中展示预警事件列表，包含事件标题、风险等级标签、风险分数
  - [x] 支持点击事件切换关联摄像头

- [x] Task 6: 验证页面显示
  - [x] 运行 `npm run typecheck` 确保类型检查通过
  - [x] 运行 `npm run build` 确保构建通过

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 2
- Task 4 和 Task 5 依赖 Task 2 和 Task 3
- Task 6 依赖所有前置任务
