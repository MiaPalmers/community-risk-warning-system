import { useEffect, useRef, useState } from 'react';
import { Tag } from 'antd';
import { useLocalCamera } from '@/hooks/useLocalCamera';
import { useAppStore } from '@/store/useAppStore';

export function MonitorPage() {
  const { stream, loading, error } = useLocalCamera();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [timestamp, setTimestamp] = useState(() => new Date().toLocaleString());

  const { cameras, activeCameraId, setActiveCamera } = useAppStore();
  const activeCamera = cameras.find((c) => c.id === activeCameraId);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="monitor-layout">
      <div className="monitor-video-col">
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            正在连接摄像头...
          </div>
        )}
        {error && <div className="monitor-video-error">{error}</div>}
        {stream && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="monitor-video-element"
            />
            <div className="monitor-video-overlay">
              <div>实时监控</div>
              <div>{activeCamera?.name ?? '未知摄像头'}</div>
              <div>{timestamp}</div>
            </div>
          </>
        )}
      </div>

      <div className="monitor-list-col">
        <div className="panel">
          <div className="panel-title">监控点位列表</div>
          <div className="monitor-camera-list">
            {cameras.map((camera) => (
              <div
                key={camera.id}
                className={`monitor-camera-item ${camera.id === activeCameraId ? 'active' : ''}`}
                onClick={() => setActiveCamera(camera.id)}
              >
                <div>{camera.name}</div>
                <div>{camera.area}</div>
                <Tag color={camera.status === 'online' ? 'success' : 'default'}>
                  {camera.status === 'online' ? '在线' : '离线'}
                </Tag>
                <div>{camera.riskScore}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
