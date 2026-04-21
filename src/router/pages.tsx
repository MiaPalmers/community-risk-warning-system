import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

type AppPage = {
  path: string;
  label: string;
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
  { path: '/overview', label: '总览', component: OverviewPage },
  { path: '/monitor', label: '监控选择', component: MonitorPage },
  { path: '/alerts', label: '重点预警', component: AlertsPage },
];

export const defaultRoute = '/overview';
