import { useState } from 'react';
import { Segmented, Tag } from 'antd';
import { useAppStore } from '@/store/useAppStore';

const levelTagColor: Record<string, string> = {
  A: 'error',
  B: 'warning',
  C: 'processing'
};

export function AlertsPage() {
  const { events, selectedEventId, selectEvent } = useAppStore();
  const [filter, setFilter] = useState<string>('全部');

  const filteredEvents = [...events]
    .sort((a, b) => b.riskScore - a.riskScore)
    .filter((event) => {
      if (filter === '全部') return true;
      return `${event.level}级` === filter;
    });

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  return (
    <div className="alerts-layout">
      <div className="alerts-list-col">
        <div className="alerts-filter-bar">
          <Segmented
            options={['全部', 'A级', 'B级', 'C级']}
            value={filter}
            onChange={(value) => setFilter(value as string)}
          />
        </div>
        <div className="alerts-event-list">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`alerts-event-item${event.id === selectedEventId ? ' active' : ''}`}
              onClick={() => selectEvent(event.id)}
            >
              <div className="alerts-event-item-header">
                <span className="alerts-event-item-title">{event.title}</span>
                <Tag color={levelTagColor[event.level] ?? 'default'} style={{ margin: 0 }}>
                  {event.level}级
                </Tag>
              </div>
              <div className="alerts-event-item-meta">
                <span>{event.cameraName}</span>
                <span>风险分: {event.riskScore}</span>
                <span>{event.occurredAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="alerts-detail-col">
        {selectedEvent ? (
          <div className="alerts-detail-panel">
            <div className="alerts-detail-title">{selectedEvent.title}</div>

            <div className="alerts-detail-section">
              <h4>事件概要</h4>
              <p>{selectedEvent.summary}</p>
            </div>

            <div className="alerts-detail-section">
              <h4>处置建议</h4>
              <p>{selectedEvent.suggestion}</p>
            </div>

            <div className="alerts-detail-section">
              <h4>VLM 研判结果</h4>
              <div className="alerts-detail-vlm">
                <div>
                  <span>风险分：</span>
                  <strong>{selectedEvent.analysis.riskScore}</strong>
                </div>
                <div>
                  <span>等级：</span>
                  <Tag color={levelTagColor[selectedEvent.analysis.level] ?? 'default'}>
                    {selectedEvent.analysis.level}级
                  </Tag>
                </div>
                <div>
                  <span>置信度：</span>
                  <strong>{(selectedEvent.analysis.confidence * 100).toFixed(1)}%</strong>
                </div>
                <div>
                  <span>摘要：</span>
                  <span>{selectedEvent.analysis.summary}</span>
                </div>
                {selectedEvent.analysis.evidenceTimeline.length > 0 && (
                  <div>
                    <span>证据时间线：</span>
                    <ul>
                      {selectedEvent.analysis.evidenceTimeline.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="alerts-detail-panel">
            <p>请从左侧列表选择一条预警事件查看详情</p>
          </div>
        )}
      </div>
    </div>
  );
}
