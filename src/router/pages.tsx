import {
  BellOutlined,
  DeploymentUnitOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent, ReactNode } from 'react';

type AppPage = {
  path: string;
  label: string;
  icon: ReactNode;
  component: LazyExoticComponent<ComponentType>;
};

const OverviewPage = lazy(async () => {
  const mod = await import('@/pages/OverviewPage');
  return { default: mod.OverviewPage };
});

const MonitorPage = lazy(async () => {
  const mod = await import('@/pages/MonitorPage');
  return { default: mod.MonitorPage };
});

const AlertsPage = lazy(async () => {
  const mod = await import('@/pages/AlertsPage');
  return { default: mod.AlertsPage };
});

export const appPages: AppPage[] = [
  { path: '/overview', label: '总览', icon: <EyeOutlined />, component: OverviewPage },
  { path: '/monitor', label: '监控选择', icon: <DeploymentUnitOutlined />, component: MonitorPage },
  { path: '/alerts', label: '重点预警', icon: <BellOutlined />, component: AlertsPage }
];

export const defaultRoute = appPages[0]?.path ?? '/overview';
