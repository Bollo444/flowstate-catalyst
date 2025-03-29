import React from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';

interface InventoryNavItemProps {
  className?: string;
}

const InventoryNavItem: React.FC<InventoryNavItemProps> = ({ className }) => {
  return (
    <Link 
      href="/inventory"
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${className || ''}`}
    >
      <Package className="mr-2 h-5 w-5" />
      <span>Inventory</span>
    </Link>
  );
};

export default InventoryNavItem;