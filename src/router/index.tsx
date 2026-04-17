import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { appPages, defaultRoute } from '@/router/pages';

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
      { index: true, element: <Navigate to={defaultRoute} replace /> },
      ...appPages.map(({ path, component: PageComponent }) => ({
        path,
        element: withSuspense(<PageComponent />)
      }))
    ]
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />)
  }
]);
