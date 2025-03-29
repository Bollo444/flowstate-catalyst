"use client";

import React from "react";
import {
  Search,
  Inbox,
  UserCheck,
  UserPlus,
  Lock,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  // TODO: Implement dynamic pinning functionality
  // Add a console.log to verify the component is rendering
  console.log("Sidebar component rendering");

  const menuItems = [
    { icon: <Search className="w-5 h-5" />, label: "Search", href: "/search" },
    { icon: <Inbox className="w-5 h-5" />, label: "Inbox", href: "/inbox" },
    {
      icon: <UserCheck className="w-5 h-5" />,
      label: "Assigned to me",
      href: "/assigned-to-me",
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      label: "Created by me",
      href: "/created-by-me",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      label: "Private tasks",
      href: "/private-tasks",
    },
    {
      icon: <MoreHorizontal className="w-5 h-5" />,
      label: "More",
      href: "/more",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-background-light-secondary text-foreground-light dark:bg-background-dark dark:text-foreground-dark p-4 border-r border-border-light dark:border-border-dark">
      {/* TODO: Add a logo or branding element here */}
      <div className="mb-8">
        <h1 className="text-xl font-bold">Project Dashboard</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                // Use theme colors for hover background
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark-secondary transition-colors"
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
