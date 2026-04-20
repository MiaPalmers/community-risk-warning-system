import { useEffect, useRef } from 'react';
import type { CameraPoint } from '@/types';
import { riskColorMap, riskLevelTextMap } from '@/utils/risk';
import { buildMarkerSvg } from '@/services/map/baiduMap';

interface UseCameraMarkersOptions {
  map: any;
  mapReady: boolean;
  cameras: CameraPoint[];
  interactive?: boolean;
  onSelect?: (cameraId: string) => void;
  activeCameraId?: string;
  allCameras?: CameraPoint[];
}

export function useCameraMarkers(options: UseCameraMarkersOptions) {
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    const map = options.map;
    const BMapGL = window.BMapGL;
    if (!options.mapReady || !map || !BMapGL) return;

    map.clearOverlays();
    markersRef.current.clear();

    options.cameras.forEach((camera) => {
      if (!camera.mapPoint) return;

      const point = new BMapGL.Point(camera.mapPoint.lng, camera.mapPoint.lat);
      const icon = new BMapGL.Icon(buildMarkerSvg(riskColorMap[camera.level]), new BMapGL.Size(28, 28));
      const marker = new BMapGL.Marker(point, { icon });
      const label = new BMapGL.Label(camera.name, {
        position: point,
        offset: new BMapGL.Size(18, -12)
      });

      label.setStyle({
        color: '#fff',
        background: 'rgba(7, 13, 24, 0.88)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '999px',
        padding: '4px 10px',
        fontSize: '12px'
      });

      const infoHtml = `
        <div style="min-width:220px;padding:4px 2px;line-height:1.8;">
          <div style="font-weight:700;font-size:15px;color:#0f172a;">${camera.name}</div>
          <div>设备 ID：${camera.id}</div>
          <div>区域：${camera.area} · ${camera.scene}</div>
          <div>今日风险事件：${camera.todayEvents}</div>
          <div>风险等级：${riskLevelTextMap[camera.level]}</div>
        </div>
      `;
      const infoWindow = new BMapGL.InfoWindow(infoHtml, { width: 260, title: '摄像头详情' });

      if (options.interactive) {
        marker.addEventListener('click', () => {
          options.onSelect?.(camera.id);
          map.openInfoWindow(infoWindow, point);
        });
        label.addEventListener('click', () => {
          options.onSelect?.(camera.id);
          map.openInfoWindow(infoWindow, point);
        });
      }

      map.addOverlay(marker);
      map.addOverlay(label);
      markersRef.current.set(camera.id, marker);
    });
  }, [options.cameras, options.interactive, options.mapReady, options.map, options.onSelect]);

  useEffect(() => {
    const map = options.map;
    const BMapGL = window.BMapGL;
    const allCams = options.allCameras ?? options.cameras;
    const activeCamera = allCams.find((camera) => camera.id === options.activeCameraId);
    if (!options.mapReady || !map || !BMapGL || !activeCamera?.mapPoint) return;

    const activePoint = new BMapGL.Point(activeCamera.mapPoint.lng, activeCamera.mapPoint.lat);
    map.panTo(activePoint);
  }, [options.activeCameraId, options.allCameras, options.cameras, options.mapReady, options.map]);

  return markersRef;
}
