import { create } from 'zustand';
import { cameras, events } from '@/data/mock';
import type { CameraPoint, RiskEvent, VlmAnalysis, DetectionBox, TrendPoint } from '@/types';

export type VlmStatus = 'idle' | 'loading' | 'analyzing' | 'ready' | 'error';

const MAX_TREND_POINTS = 30;

interface AppState {
  cameras: CameraPoint[];
  events: RiskEvent[];
  activeCameraId: string;
  selectedEventId?: string;
  analysis: VlmAnalysis;
  vlmStatus: VlmStatus;
  vlmError: string | null;
  detectionBoxes: DetectionBox[];
  analysisTimestamp: number | null;
  setActiveCamera: (cameraId: string) => void;
  selectEvent: (eventId?: string) => void;
  markEventStatus: (eventId: string, status: RiskEvent['status']) => void;
  setAnalysis: (analysis: VlmAnalysis, boxes: DetectionBox[]) => void;
  setVlmStatus: (status: VlmStatus, error?: string) => void;
  tickMockAnalysis: () => void;
}

const waitingAnalysis: VlmAnalysis = {
  riskScore: 0,
  level: 'C',
  hasRisk: false,
  confidence: 0,
  summary: '等待 VLM 模型连接...',
  evidenceTimeline: [],
  breakdown: [
    { label: '规则触发', value: 40 },
    { label: '场景敏感度', value: 25 },
    { label: '持续时长', value: 20 },
    { label: '历史重复性', value: 15 }
  ],
  trend: []
};

const firstEvent = events[0];
const firstCamera = cameras.find((camera) => camera.id === firstEvent?.cameraId) ?? cameras[0];

export const useAppStore = create<AppState>((set, get) => ({
  cameras,
  events,
  activeCameraId: firstCamera.id,
  selectedEventId: firstEvent?.id,
  analysis: waitingAnalysis,
  vlmStatus: 'idle' as VlmStatus,
  vlmError: null,
  detectionBoxes: [],
  analysisTimestamp: null,

  setActiveCamera: (cameraId) => {
    set({
      activeCameraId: cameraId,
      detectionBoxes: [],
      selectedEventId: undefined
    });
  },

  selectEvent: (eventId) => {
    const eventItem = get().events.find((item) => item.id === eventId);
    set({
      selectedEventId: eventId,
      activeCameraId: eventItem?.cameraId ?? get().activeCameraId
    });
  },

  markEventStatus: (eventId, status) =>
    set((state) => ({
      events: state.events.map((item) => (item.id === eventId ? { ...item, status } : item))
    })),

  setAnalysis: (analysis, boxes) => {
    const prevTrend = get().analysis.trend;
    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newPoint: TrendPoint = { time: timeLabel, value: analysis.riskScore };
    const trend: TrendPoint[] = [...prevTrend, newPoint].slice(-MAX_TREND_POINTS);

    set({
      analysis: { ...analysis, trend },
      detectionBoxes: boxes,
      analysisTimestamp: Date.now()
    });
  },

  setVlmStatus: (status, error) =>
    set({
      vlmStatus: status,
      vlmError: error ?? null
    }),

  tickMockAnalysis: () => {
    const prev = get().analysis;
    const jitter = () => Math.floor(Math.random() * 11) - 5;
    const riskScore = Math.max(0, Math.min(100, prev.riskScore + jitter()));
    const level: VlmAnalysis['level'] = riskScore >= 70 ? 'A' : riskScore >= 40 ? 'B' : 'C';
    const b1 = Math.max(5, prev.breakdown[0]?.value ?? 40 + jitter());
    const b2 = Math.max(5, prev.breakdown[1]?.value ?? 25 - jitter());
    const b3 = Math.max(5, prev.breakdown[2]?.value ?? 20 + jitter());
    const b4 = Math.max(5, prev.breakdown[3]?.value ?? 15 - jitter());
    const total = b1 + b2 + b3 + b4;
    const breakdown = [
      { label: '规则触发', value: Math.round((b1 / total) * 100) },
      { label: '场景敏感度', value: Math.round((b2 / total) * 100) },
      { label: '持续时长', value: Math.round((b3 / total) * 100) },
      { label: '历史重复性', value: Math.round((b4 / total) * 100) }
    ];
    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const trend = [...prev.trend, { time: timeLabel, value: riskScore }].slice(-MAX_TREND_POINTS);
    set({
      analysis: {
        ...prev,
        riskScore,
        level,
        hasRisk: riskScore >= 40,
        confidence: Math.min(1, Math.max(0.3, prev.confidence + (Math.random() * 0.1 - 0.05))),
        summary: riskScore >= 70
          ? '检测到高风险指标波动，请关注实时画面'
          : riskScore >= 40
            ? '风险指标处于中等水平，持续监控中'
            : '当前场景风险可控，各项指标正常',
        breakdown,
        trend
      }
    });
  }
}));
