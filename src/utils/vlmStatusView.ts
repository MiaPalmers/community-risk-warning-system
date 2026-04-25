import type { VlmStatus } from '@/store/useAppStore';

type VlmStatusViewContext = 'overview' | 'monitor';

interface VlmStatusView {
  color: string;
  text: string;
}

const overviewStatusView: Record<VlmStatus, VlmStatusView> = {
  idle: { color: 'default', text: '等待连接' },
  loading: { color: 'processing', text: '加载模型...' },
  analyzing: { color: 'processing', text: '分析中...' },
  ready: { color: 'success', text: 'VLM 在线' },
  error: { color: 'error', text: 'VLM 异常' }
};

const monitorStatusView: Record<VlmStatus, VlmStatusView> = {
  idle: { color: 'default', text: '等待连接' },
  loading: { color: 'default', text: '等待连接' },
  analyzing: { color: 'processing', text: '分析中' },
  ready: { color: 'success', text: 'VLM 在线' },
  error: { color: 'error', text: 'VLM 异常' }
};

export function getVlmStatusView(
  status: VlmStatus,
  context: VlmStatusViewContext = 'overview'
): VlmStatusView {
  const statusView = context === 'monitor' ? monitorStatusView : overviewStatusView;
  return statusView[status] ?? statusView.idle;
}
