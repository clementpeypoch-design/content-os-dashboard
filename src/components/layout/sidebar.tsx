"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeft, Settings, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sections: Record<string, typeof navigationItems> = {};
  navigationItems.forEach(function (item) {
    var sec = item.section || "General";
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(item);
  });

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#1a1a24] bg-[#0a0a0e] transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-[#1a1a24]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#a78bfa] to-[#c084fc]">
          <Zap className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-sm font-bold text-white truncate block">ContentOS</span>
            <span className="text-[10px] text-[#555] truncate block">Dashboard</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn("ml-auto shrink-0 text-[#555] hover:text-white transition-colors", collapsed && "ml-0")}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {Object.entries(sections).map(function ([section, items]) {
          return (
            <div key={section} className="mb-4">
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#444]">
                  {section}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map(function (item) {
                  var isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
                        isActive
                          ? "bg-[#a78bfa]/10 text-[#a78bfa]"
                          : "text-[#666] hover:bg-[#ffffff06] hover:text-[#aaa]"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 h-5 w-[2.5px] -translate-y-1/2 rounded-r-full bg-[#a78bfa]" />
                      )}
                      <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#a78bfa]" : "text-[#555] group-hover:text-[#888]")} />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                      {!collapsed && isActive && <ChevronRight className="ml-auto h-3 w-3 opacity-50" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1a1a24] px-2 py-2">
        <Link
          href="#"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#555] hover:bg-[#ffffff06] hover:text-[#aaa] transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
