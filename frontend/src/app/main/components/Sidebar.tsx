'use client';

import Link from 'next/link';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

type SidebarProps = {
  activeRoute: string;
};

export const Sidebar = ({ activeRoute }: SidebarProps) => {
  const { hasPermission } = usePermissions();
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
      <li>
        <Link href="/main" 
              className={`flex items-center p-2 rounded font-medium ${isCollapsed ? 'justify-center' : ''} ${isActive('/main') ? 'bg-blue-100 text-blue-800' : 'text-gray-800 hover:bg-gray-100'}`}>
          <span className={`text-xl ${isCollapsed ? 'mr-0' : 'mr-3'}`}>📊</span>
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
      </li>
      
      {hasPermission('users:read') && (
        <li>
          <Link href="/main/users"
                className={`flex items-center p-2 rounded font-medium ${isCollapsed ? 'justify-center' : ''} ${isActive('/main/users') ? 'bg-blue-100 text-blue-800' : 'text-gray-800 hover:bg-gray-100'}`}>
            <span className={`text-xl ${isCollapsed ? 'mr-0' : 'mr-3'}`}>👥</span>
            {!isCollapsed && <span>Usuarios</span>}
          </Link>
        </li>
      )}
      
      {hasPermission('roles:read') && (
        <li>
          <Link href="/main/roles"
                className={`flex items-center p-2 rounded font-medium ${isCollapsed ? 'justify-center' : ''} ${isActive('/main/roles') ? 'bg-blue-100 text-blue-800' : 'text-gray-800 hover:bg-gray-100'}`}>
            <span className={`text-xl ${isCollapsed ? 'mr-0' : 'mr-3'}`}>🔑</span>
            {!isCollapsed && <span>Roles</span>}
          </Link>
        </li>
      )}
    </ul>
  );
  
  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-40 md:hidden bg-white p-2 rounded-md shadow-md"
      >
        {isMobileOpen ? '✕' : '☰'}
      </button>
      
      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-md z-30
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        <div className={`flex items-center p-4 border-b ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {/* Botón para colapsar en escritorio - siempre visible */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-full hover:bg-gray-100 hidden md:flex items-center justify-center"
            aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {'☰'}
          </button>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="text-xl font-semibold text-gray-900 whitespace-nowrap">LegalisFlow</h2>
              <p className="text-sm text-gray-800 truncate max-w-[180px]">{user?.email}</p>
            </div>
          )}
          
          
        </div>
        
        <nav className={`p-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {renderNavItems()}
          
          <div className={`pt-4 border-t mt-8 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <button 
              onClick={logout} 
              className={`
                p-2 font-medium text-red-700 hover:bg-red-50 rounded flex items-center
                ${isCollapsed ? 'justify-center w-10 h-10' : 'w-full text-left'}
              `}
              aria-label="Cerrar sesión"
            >
              <span className={`text-xl ${isCollapsed ? 'mr-0' : 'mr-3'}`}>🚪</span>
              {!isCollapsed && <span>Cerrar sesión</span>}
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Contenedor principal - con margen fijo según el estado */}
      <main className={`
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}
      `}>
        {/* Aquí va el contenido de tu página */}
      </main>
    </>
  );
};