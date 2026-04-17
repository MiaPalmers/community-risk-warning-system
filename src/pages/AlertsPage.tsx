import { Empty, Tag } from 'antd';
import { useMemo } from 'react';
import { RiskEventDetailPanel } from '@/components/RiskEventDetailPanel';
import { SectionCard } from '@/components/SectionCard';
import { useAppStore } from '@/store/useAppStore';
import { eventStatusTextMap } from '@/utils/risk';
import type { RiskEvent } from '@/types';

export function AlertsPage() {
  const { events, selectedEventId, selectEvent, markEventStatus } = useAppStore();

  const currentEvent = useMemo<RiskEvent | undefined>(
    () => events.find((item) => item.id === selectedEventId) ?? events[0],
    [events, selectedEventId]
  );

  const handleSelect = (eventId: string) => {
    selectEvent(eventId);
  };

  return (
    <div className="page-shell compact-page-shell">
      <div className="page-topbar">
        <div className="page-title-block">
          <div className="page-kicker">ALERT DISPATCH BOARD</div>
          <div className="page-title-row">
            <h2>重点预警处置面板</h2>
            <p>左侧按风险等级快速切换事件，右侧固定展示证据、摘要、处置建议与 VLM 研判详情。</p>
          </div>
        </div>

        <div className="page-actions">
          <Tag color="error" style={{ margin: 0 }}>
            A级事件：{events.filter((item) => item.level === 'A').length}
          </Tag>
          <Tag color="warning" style={{ margin: 0 }}>
            待处置：{events.filter((item) => item.status === 'pending').length}
          </Tag>
          <Tag color="processing" style={{ margin: 0 }}>
            当前事件：{currentEvent?.id ?? '暂无'}
          </Tag>
        </div>
      </div>

      {events.length ? (
        <div className="alerts-stage">
          <SectionCard className="section-fill" title="预警事件列表">
            <div className="alerts-list">
              {events.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  className={`alert-list-item ${event.id === currentEvent?.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(event.id)}
                >
                  <div className="alert-list-head">
                    <div className="alert-list-heading">
                      <div className="alert-list-title">{event.title}</div>
                      <div className="alert-list-meta">{event.occurredAt}</div>
                    </div>
                    <div className="alert-list-score">{event.riskScore}</div>
                  </div>

                  <div className="alert-list-summary">{event.summary}</div>

                  <div className="alert-list-foot">
                    <div className="alert-list-tags">
                      {event.tags.slice(0, 2).map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                    <div className="alert-list-status">
                      <span>{event.cameraName}</span>
                      <span>状态：{eventStatusTextMap[event.status]}</span>
                      <Tag
                        color={event.level === 'A' ? 'error' : event.level === 'B' ? 'warning' : 'processing'}
                        style={{ margin: 0 }}
                      >
                        {event.level}级
                      </Tag>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard className="section-fill" title="事件详情与处置">
            <RiskEventDetailPanel
              event={currentEvent}
              onMarkDone={(eventId) => markEventStatus(eventId, 'done')}
            />
          </SectionCard>
        </div>
      ) : (
        <div className="empty-panel">
          <Empty description="暂无高危事件" />
        </div>
      )}
    </div>
  );
}
