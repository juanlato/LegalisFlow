// src/app/main/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
/*
import { DashboardSummary } from './components/DashboardSummary';
import { CasesSummary } from './components/CasesSummary';
import { UpcomingEvents } from './components/UpcomingEvents';
import { RecentActivity } from './components/RecentActivity';
*/
export default function Dashboard() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del dashboard
    const fetchDashboardData = async () => {
      try {
        // Llamada API para obtener estadísticas
        // const response = await getDashboardStats();
        // setStats(response);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"></div>

      {hasPermission('cases:read') && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Resumen de Casos</h2>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {hasPermission('calendar:read') && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Próximos Eventos</h2>
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Actividad Reciente</h2>
        </div>
      </div>
    </div>
  );
}
