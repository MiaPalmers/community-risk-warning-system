import type { CSSProperties } from 'react';
import type { DetectionBox } from '@/types';

export function getDetectionBoxStyle(box: DetectionBox): CSSProperties {
  return {
    top: `${box.y * 100}%`,
    left: `${box.x * 100}%`,
    width: `${box.width * 100}%`,
    height: `${box.height * 100}%`
  };
}

export function getDetectionBoxClassName(box: DetectionBox): string {
  return `detection-box ${box.risk ? 'danger-box' : 'notice-box'}`;
}

export function formatDetectionBoxConfidence(box: DetectionBox): string {
  return `${Math.round(box.confidence * 100)}%`;
}
