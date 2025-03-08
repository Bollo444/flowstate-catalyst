<<<<<<< HEAD
import React from 'react';
import { FiHome, FiFile, FiBox, FiLayout, FiMessageSquare, FiBell, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>FlowState</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <FiHome className="icon" />
              <span className="label">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/flow">
              <FiFile className="icon" />
              <span className="label">Flow</span>
            </Link>
          </li>
          <li>
            <Link to="/tasks">
              <FiLayout className="icon" />
              <span className="label">Tasks</span>
            </Link>
          </li>
          <li>
            <Link to="/team">
              <FiBox className="icon" />
              <span className="label">Team</span>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <FiSettings className="icon" />
              <span className="label">Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/messages">
              <FiMessageSquare className="icon" />
              <span className="label">Messages</span>
            </Link>
          </li>
          <li>
            <Link to="/notifications">
              <FiBell className="icon" />
              <span className="label">Notifications</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
=======
'use client';

import React from 'react';
import { Search, Inbox, UserCheck, UserPlus, Lock, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => { // TODO: Implement dynamic pinning functionality
  // Add a console.log to verify the component is rendering
  console.log('Sidebar component rendering');

  const menuItems = [
    { icon: <Search className="w-5 h-5" />, label: 'Search', href: '/search' },
    { icon: <Inbox className="w-5 h-5" />, label: 'Inbox', href: '/inbox' },
    { icon: <UserCheck className="w-5 h-5" />, label: 'Assigned to me', href: '/assigned-to-me' },
    { icon: <UserPlus className="w-5 h-5" />, label: 'Created by me', href: '/created-by-me' },
    { icon: <Lock className="w-5 h-5" />, label: 'Private tasks', href: '/private-tasks' },
    { icon: <MoreHorizontal className="w-5 h-5" />, label: 'More', href: '/more' },
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#1E1E1E] text-white p-4 border-r border-[#2D2D2D]">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Project Dashboard</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2D2D2D] transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
>>>>>>> 7d9ee070489d2151403e6b883b553afda5d85c0e
