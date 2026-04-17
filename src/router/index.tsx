import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';

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

const ModelCenterPage = lazy(async () => {
  const mod = await import('@/pages/ModelCenterPage');
  return { default: mod.ModelCenterPage };
});

const NotFoundPage = lazy(async () => {
  const mod = await import('@/pages/NotFoundPage');
  return { default: mod.NotFoundPage };
});

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: '40vh',
        display: 'grid',
        placeItems: 'center'
      }}
    >
      <Spin size="large" tip="页面加载中..." />
    </div>
  );
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      { path: '/overview', element: withSuspense(<OverviewPage />) },
      { path: '/monitor', element: withSuspense(<MonitorPage />) },
      { path: '/alerts', element: withSuspense(<AlertsPage />) },
      { path: '/model-center', element: withSuspense(<ModelCenterPage />) }
    ]
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />)
  }
]);
