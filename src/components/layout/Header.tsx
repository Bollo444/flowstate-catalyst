"use client";

import React from "react";
import { Users, Plus, Settings, User } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const headerItems = [
    { icon: <Users className="w-5 h-5" />, label: "Team", href: "/team" },
    { icon: <Plus className="w-5 h-5" />, label: "New", href: "/new" },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      href: "/settings",
    },
    { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile" },
  ];

  return (
    <header className="h-16 px-6 bg-background-light text-foreground-light border-b border-border-light dark:bg-background-dark dark:text-foreground-dark dark:border-border-dark">
      {/* TODO: Add Logo/Brand and potentially user dropdown */}
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {headerItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              // Use theme colors for hover effect
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-light-secondary dark:hover:bg-background-dark-secondary transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <Link
          href="/auth/signin"
          // Use primary theme color for button background, assuming light text
          className="px-4 py-2 bg-primary-light text-white hover:bg-opacity-90 dark:bg-primary-dark dark:hover:bg-opacity-90 rounded-lg transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          // Use primary theme color for button background, assuming light text
          className="px-4 py-2 bg-primary-light text-white hover:bg-opacity-90 dark:bg-primary-dark dark:hover:bg-opacity-90 rounded-lg transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;
