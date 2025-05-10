'use client';

import Link from 'next/link';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { SidebarSection } from './SidebarSection';

type SidebarProps = {
  activeRoute: string;
};

export const Sidebar = ({ activeRoute }: SidebarProps) => {
  const { hasPermission, hasAnyPermission } = usePermissions();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Cierra automáticamente el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMobileOpen(false);
  }, [activeRoute]);

  const isActive = (path: string) => {
    // Caso especial para la ruta principal /main
    if (path === '/main') {
      return activeRoute === '/main';
    }
    return activeRoute.startsWith(path);
  };

  // Contenido del sidebar que se reutiliza
  const renderNavItems = () => (
    <ul className="space-y-2">
      {/* Dashboard */}
      <li>
        <Link
          href="/main"
          className={`flex items-center rounded p-2 font-medium ${isCollapsed ? 'justify-center' : ''} ${isActive('/main') ? 'bg-blue-100 text-blue-800' : 'text-gray-800 hover:bg-gray-100'}`}
        >
          <span className={`text-xl ${isCollapsed ? 'mr-0' : 'mr-3'}`}>📊</span>
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
      </li>

      {/* Insolvencias */}
      {hasAnyPermission(['insolvency-tariffs:read']) && (
        <SidebarSection
          title="Insolvencias"
          icon="📁"
          isCollapsed={isCollapsed}
          items={[
            {
              path: '/main/insolvencies/insolvency-simulator',
              label: 'Simulador',
              icon: '🧮',
              permission: 'insolvency-tariffs:read',
            },
            {
              path: '/main/insolvencies/insolvency-requests',
              label: 'Solicitudes Pendientes',
              icon: '📋',
              permission: 'insolvency-tariffs:read',
            },
            {
              path: '/main/insolvencies/insolvencies',
              label: 'Casos en Firme',
              icon: '✅',
              permission: 'insolvency-tariffs:read',
            },
            {
              path: '/main/insolvencies/insolvency-tariffs',
              label: 'Configuración de Tarifas',
              icon: '⚙️',
              permission: 'insolvency-tariffs:read',
            },
          ]}
        />
      )}

      {/* Casos */}
      {hasAnyPermission(['cases:read']) && (
        <SidebarSection
          title="Casos"
          icon="📁"
          isCollapsed={isCollapsed}
          items={[
            {
              path: '/main/cases/dashboard',
              label: 'Dashboard',
              icon: '📊',
              permission: 'cases:read',
            },
            {
              path: '/main/cases/insolvency',
              label: 'Insolvencia',
              icon: '📝',
              permission: 'insolvency-cases:read',
            },
          ]}
        />
      )}

      {/* Clientes */}
      {hasPermission('clients:read') && (
        <SidebarSection
          title="Clientes"
          icon="👤"
          isCollapsed={isCollapsed}
          items={[
            {
              path: '/main/clients',
              label: 'Ver todos',
              icon: '📋',
              permission: 'clients:read',
            },
            {
              path: '/main/clients/individuals',
              label: 'Individuos',
              icon: '👤',
              permission: 'clients:read',
            },
            {
              path: '/main/clients/companies',
              label: 'Empresas',
              icon: '🏢',
              permission: 'clients:read',
            },
          ]}
        />
      )}


      {/* Configuración */}
      {hasAnyPermission(['users:read', 'roles:read', ]) && (
        <SidebarSection
          title="Configuración"
          icon="⚙️"
          isCollapsed={isCollapsed}
          items={[
            {
              path: '/main/config/users',
              label: 'Usuarios',
              icon: '👥',
              permission: 'users:read',
            },
            {
              path: '/main/config/roles',
              label: 'Roles',
              icon: '🔑',
              permission: 'roles:read',
            },
            {
              path: '/main/config/currencies',
              label: 'Monedas',
              icon: '💱',
              permission: 'currencies:read',
            },
            {
              path: '/main/config/conversion-rates',
              label: 'Tasas de Conversión',
              icon: '📈',
              permission: 'conversion-rates:read',
            },
            {
              path: '/main/config/units-reference',
              label: 'Unidades de Referencia',
              icon: '📏',
              permission: 'units-reference:read',
            },
            
            // Otras opciones de configuración
          ]}
        />
      )}
      {/* Más secciones según necesites */}
    </ul>
  );

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-40 rounded-md bg-white p-2 shadow-md md:hidden"
      >
        {isMobileOpen ? '✕' : '☰'}
      </button>

      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen bg-white shadow-md transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div
          className={`flex items-center border-b p-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
        >
          {/* Botón para colapsar en escritorio - siempre visible */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden items-center justify-center rounded-full p-1.5 hover:bg-gray-100 md:flex"
            aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {'☰'}
          </button>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="text-xl font-semibold whitespace-nowrap text-gray-900">LegalisFlow</h2>
              <p className="max-w-[180px] truncate text-sm text-gray-800">{user?.email}</p>
            </div>
          )}
        </div>

        <nav className={`p-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {renderNavItems()}

          <div className={`mt-8 border-t pt-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={logout}
              className={`flex items-center rounded p-2 font-medium text-red-700 hover:bg-red-50 ${isCollapsed ? 'h-10 w-10 justify-center' : 'w-full text-left'} `}
              aria-label="Cerrar sesión"
            >
              <span className={`text-xl ${isCollapsed ? 'mr-0' : 'mr-3'}`}>🚪</span>
              {!isCollapsed && <span>Cerrar sesión</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Contenedor principal - con margen fijo según el estado */}
      <main
        className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} `}
      >
        {/* Aquí va el contenido de tu página */}
      </main>
    </>
  );
};
