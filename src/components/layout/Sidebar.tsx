"use client";

import React, { useState } from "react";
import {
  Search,
  Inbox,
  UserCheck,
  UserPlus,
  Lock,
  MoreHorizontal,
  ChevronsLeft,
  ChevronsRight,
  // TODO: Consider adding a dedicated 'Pin' icon if required later
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log("Sidebar component rendering. Collapsed:", isCollapsed);

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-screen bg-background-light-secondary text-foreground-light dark:bg-background-dark dark:text-foreground-dark p-4 border-r border-border-light dark:border-border-dark transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-20 items-center" : "w-64" // Center items when collapsed
      )}
    >
      {/* Logo/Branding */}
      <div className="mb-8 flex items-center justify-center h-10"> {/* Ensure consistent height */}
        <span
          className={clsx(
            "text-2xl font-semibold whitespace-nowrap",
            isCollapsed && "hidden" // Hide text logo when collapsed
          )}
        >
          Flowstate
        </span>
        <span
          className={clsx(
            "text-2xl font-bold w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full", // Styled initial
            !isCollapsed && "hidden" // Hide initial when expanded
          )}
          title="Flowstate" // Add title for accessibility
        >
          F
        </span>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark-secondary transition-colors",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon}
                <span className={clsx(isCollapsed && "sr-only")}> {/* Use sr-only for better accessibility when collapsed */}
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse/Expand Button */}
      <button
        onClick={toggleSidebar}
        className="mt-4 p-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark-secondary self-center"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
          <ChevronsRight className="w-5 h-5" />
        ) : (
          <ChevronsLeft className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
