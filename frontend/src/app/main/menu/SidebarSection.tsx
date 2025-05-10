// src/app/main/components/SidebarSection.tsx
import { useState } from 'react';
import Link from 'next/link';
import { usePermissions } from '@/hooks/usePermissions';
import { usePathname } from 'next/navigation';

interface SidebarSectionProps {
  title: string;
  icon: string;
  isCollapsed: boolean;
  items: Array<{
    path: string;
    label: string;
    icon: string;
    permission: string;
  }>;
}

export const SidebarSection = ({ title, icon, isCollapsed, items }: SidebarSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { hasPermission } = usePermissions();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  // Filtrar items según permisos
  const visibleItems = items.filter((item) => hasPermission(item.permission));

  if (visibleItems.length === 0) return null;

  return (
    <li>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center rounded p-2 font-medium ${isCollapsed ? 'justify-center' : 'justify-between'} text-gray-800 hover:bg-gray-100`}
      >
        <div className="flex items-center">
          <span className={`text-xl ${isCollapsed ? 'mr-0' : 'mr-3'}`}>{icon}</span>
          {!isCollapsed && <span>{title}</span>}
        </div>
        {!isCollapsed && (
          <span
            className="transition-transform duration-200"
            style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
          >
            ›
          </span>
        )}
      </button>

      {isOpen && (
        <ul className={`mt-1 space-y-1 ${isCollapsed ? '' : 'ml-8'}`}>
          {visibleItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center rounded p-1.5 font-medium ${isCollapsed ? 'justify-center' : ''} ${isActive(item.path) ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span className={`text-base ${isCollapsed ? 'mr-0' : 'mr-2'}`}>{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
