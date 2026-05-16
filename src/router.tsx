import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import HomePage from '@/pages/HomePage';
import ChecklistPage from '@/pages/ChecklistPage';
import SummaryPage from '@/pages/SummaryPage';
import SettingsPage from '@/pages/SettingsPage';
import ViewPage from '@/pages/ViewPage';

const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'checklist', element: <ChecklistPage /> },
      { path: 'summary', element: <SummaryPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'view', element: <ViewPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
