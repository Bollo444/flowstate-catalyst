import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Calendar, Settings, Inbox, FileText, BarChart2, Package } from 'lucide-react';
import InventoryNavItem from './InventoryNavItem';

interface SidebarNavigationProps {
  className?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ className }) => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <nav className={`space-y-1 ${className || ''}`}>
      <Link 
        href="/"
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        <Home className="mr-2 h-5 w-5" />
        <span>Dashboard</span>
      </Link>
      
      <Link 
        href="/projects"
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/projects') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        <FileText className="mr-2 h-5 w-5" />
        <span>Projects</span>
      </Link>
      
      <Link 
        href="/team"
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/team') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        <Users className="mr-2 h-5 w-5" />
        <span>Team</span>
      </Link>
      
      <Link 
        href="/calendar"
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/calendar') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        <Calendar className="mr-2 h-5 w-5" />
        <span>Calendar</span>
      </Link>
      
      <Link 
        href="/inbox"
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/inbox') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        <Inbox className="mr-2 h-5 w-5" />
        <span>Inbox</span>
      </Link>
      
      <Link 
        href="/analytics"
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/analytics') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        <BarChart2 className="mr-2 h-5 w-5" />
        <span>Analytics</span>
      </Link>
      
      <InventoryNavItem className={isActive('/inventory') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'} />
      
      <Link 
        href="/settings"
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/settings') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
      >
        <Settings className="mr-2 h-5 w-5" />
        <span>Settings</span>
      </Link>
    </nav>
  );
};

export default SidebarNavigation;