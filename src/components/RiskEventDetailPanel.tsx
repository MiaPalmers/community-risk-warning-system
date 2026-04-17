import { Button, Empty, Space, Tag } from 'antd';
import type { RiskEvent } from '@/types';
import { VlmAnalysisPanel } from './VlmAnalysisPanel';
import { eventStatusTextMap } from '@/utils/risk';

interface RiskEventDetailPanelProps {
  event?: RiskEvent;
  onMarkDone: (eventId: string) => void;
}

function buildEventMetaItems(event: RiskEvent) {
  return [
    { label: '事件类型', value: event.eventType },
    { label: '监控点位', value: event.cameraName },
    { label: '发生时间', value: event.occurredAt },
    { label: '状态', value: eventStatusTextMap[event.status] }
  ];
}

function buildEventNoteItems(event: RiskEvent) {
  return [
    { label: '事件摘要', value: event.summary },
    { label: '处置建议', value: event.suggestion }
  ];
}

export function RiskEventDetailPanel({ event, onMarkDone }: RiskEventDetailPanelProps) {
  if (!event) {
    return (
      <div className="event-detail-empty">
        <Empty description="请选择左侧事件查看详情" />
      </div>
    );
  }

  const metaItems = buildEventMetaItems(event);
  const noteItems = buildEventNoteItems(event);

  return (
    <div className="event-detail-panel">
      <div className="event-detail-hero">
        <div>
          <div className="event-detail-label">当前处置对象</div>
          <div className="event-detail-title">{event.title}</div>
          <div className="event-detail-subtitle">
            {event.cameraName} · {event.area} · {event.occurredAt}
          </div>
        </div>

        <Space size={6} wrap>
          <Tag color={event.level === 'A' ? 'error' : event.level === 'B' ? 'warning' : 'processing'}>
            {event.level}级
          </Tag>
          <Tag>{eventStatusTextMap[event.status]}</Tag>
          <Tag color="processing">风险分 {event.riskScore}</Tag>
        </Space>
      </div>

      <div className="event-detail-grid">
        <div className="snapshot-box event-snapshot-box">{event.snapshot}</div>

        <div className="event-brief-grid">
          {metaItems.map((item) => (
            <div key={item.label} className="brief-tile">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="event-summary-grid">
        {noteItems.map((item) => (
          <div key={item.label} className="detail-note-card">
            <span>{item.label}</span>
            <p>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="event-tag-row detail-tag-row">
        {event.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <div className="event-analysis-shell">
        <VlmAnalysisPanel analysis={event.analysis} variant="summary" />
      </div>

      <div className="drawer-footer">
        <Button size="small">生成证据包</Button>
        <Button size="small" type="primary">
          推送处置
        </Button>
        <Button size="small" onClick={() => onMarkDone(event.id)}>
          标记已处置
        </Button>
      </div>
    </div>
  );
}
