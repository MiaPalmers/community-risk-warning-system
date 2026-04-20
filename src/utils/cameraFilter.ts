import type { CameraPoint } from '@/types';

export function filterCamerasByKeyword(cameras: CameraPoint[], keyword: string): CameraPoint[] {
  const value = keyword.trim().toLowerCase();
  if (!value) return cameras;

  return cameras.filter((camera) =>
    [camera.id, camera.name, camera.area, camera.scene].some((item) =>
      item.toLowerCase().includes(value)
    )
  );
}
