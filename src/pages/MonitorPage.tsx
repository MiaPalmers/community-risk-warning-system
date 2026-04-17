import { SectionCard } from '@/components/SectionCard';
import { CameraListPanel } from '@/components/CameraListPanel';
import { CameraMapPanel } from '@/components/CameraMapPanel';
import { VideoPanel } from '@/components/VideoPanel';
import { VlmAnalysisPanel } from '@/components/VlmAnalysisPanel';
import { useAppStore } from '@/store/useAppStore';

export function MonitorPage() {
  const { cameras, activeCameraId, analysis, setActiveCamera } = useAppStore();
  const activeCamera = cameras.find((item) => item.id === activeCameraId) ?? cameras[0];

  return (
    <div className="page-container">
      <div className="monitor-row">
        <SectionCard className="section-fill" title="监控点位地图">
          <CameraMapPanel
            cameras={cameras}
            activeCameraId={activeCameraId}
            onSelect={setActiveCamera}
          />
        </SectionCard>

        <SectionCard className="section-fill" title="监控点位列表">
          <CameraListPanel
            cameras={cameras}
            activeCameraId={activeCameraId}
            onSelect={setActiveCamera}
          />
        </SectionCard>
      </div>

      <div className="monitor-row">
        <SectionCard className="section-fill" title="单点实时监控详情">
          <VideoPanel camera={activeCamera} subtitle="点击地图或列表切换当前监控点位" />
        </SectionCard>

        <SectionCard className="section-fill" title="VLM 实时分析">
          <VlmAnalysisPanel analysis={analysis} compact />
        </SectionCard>
      </div>
    </div>
  );
}
