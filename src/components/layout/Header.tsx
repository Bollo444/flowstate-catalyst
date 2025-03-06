'use client';

import React from 'react';
import { Users, Plus, Settings, User } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  const headerItems = [
    { icon: <Users className="w-5 h-5" />, label: 'Team', href: '/team' },
    { icon: <Plus className="w-5 h-5" />, label: 'New', href: '/new' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/settings' },
    { icon: <User className="w-5 h-5" />, label: 'Profile', href: '/profile' },
  ];

  return (
    <header className="h-16 bg-[#1E1E1E] border-b border-[#2D2D2D] px-6">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {headerItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2D2D2D] transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <Link href="/auth/signin" className="px-4 py-2 bg-[#50B584] hover:bg-[#3d8b64] rounded-lg transition-colors">
          Sign In
        </Link>
        <Link href="/auth/signup" className="px-4 py-2 bg-[#50B584] hover:bg-[#3d8b64] rounded-lg transition-colors">
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;
