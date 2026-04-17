import { Badge, List, Tag } from 'antd';
import type { CameraPoint } from '@/types';
import { riskLevelTextMap } from '@/utils/risk';

interface CameraListPanelProps {
  cameras: CameraPoint[];
  activeCameraId: string;
  onSelect: (cameraId: string) => void;
}

export function CameraListPanel({ cameras, activeCameraId, onSelect }: CameraListPanelProps) {
  return (
    <div className="camera-list-wrap">
      <List
        dataSource={cameras}
        renderItem={(item) => (
          <List.Item
            className={`camera-list-item ${item.id === activeCameraId ? 'selected' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <List.Item.Meta
              title={
                <div className="camera-list-title">
                  <span>{item.name}</span>
                  <Tag color={item.status === 'online' ? 'success' : 'default'} style={{ fontSize: 11, lineHeight: '18px', padding: '0 4px' }}>
                    {item.status === 'online' ? '在线' : '离线'}
                  </Tag>
                </div>
              }
              description={`${item.area} · ${item.scene}`}
            />
            <div className="camera-list-side">
              <Badge
                status={item.level === 'high' ? 'error' : item.level === 'medium' ? 'warning' : item.level === 'offline' ? 'default' : 'success'}
                text={<span style={{ fontSize: 11 }}>{riskLevelTextMap[item.level]}</span>}
              />
              <strong style={{ fontSize: 14 }}>{item.riskScore}</strong>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
