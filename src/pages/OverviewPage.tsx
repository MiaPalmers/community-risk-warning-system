import { Button, Space } from 'antd';
import { MetricCard } from '@/components/MetricCard';
import { SectionCard } from '@/components/SectionCard';
import { VideoPanel } from '@/components/VideoPanel';
import { VlmAnalysisPanel } from '@/components/VlmAnalysisPanel';
import { CameraMapPanel } from '@/components/CameraMapPanel';
import { dashboardMetrics } from '@/data/mock';
import { useAppStore } from '@/store/useAppStore';

export function OverviewPage() {
  const { cameras, activeCameraId, analysis, setActiveCamera } = useAppStore();
  const activeCamera = cameras.find((item) => item.id === activeCameraId) ?? cameras[0];

  return (
    <div className="page-container">
      <div className="metrics-grid">
        {dashboardMetrics.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>

      <div className="overview-body">
        <div className="overview-left">
          <SectionCard
            title="重点监控总览"
            extra={
              <Space size={4}>
                <Button size="small">生成快照</Button>
                <Button size="small" type="primary">进入处置</Button>
              </Space>
            }
          >
            <VideoPanel camera={activeCamera} subtitle="默认播放当前风险最高的监控点位" />
          </SectionCard>

          <VlmAnalysisPanel analysis={analysis} />
        </div>

        <div className="overview-right">
          <SectionCard className="section-fill" title="GIS 摄像头联动地图">
            <CameraMapPanel
              cameras={cameras}
              activeCameraId={activeCameraId}
              onSelect={setActiveCamera}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
