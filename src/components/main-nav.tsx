'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Archive,
  Droplets,
  Pill,
  Bot,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MainNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/appointments', icon: <Calendar />, label: 'Appointments' },
    { href: '/patients', icon: <Users />, label: 'Patients' },
    {
      label: 'Inventory',
      icon: <Archive />,
      subItems: [
        { href: '/inventory/blood', icon: <Droplets />, label: 'Blood Bank' },
        { href: '/inventory/medicine', icon: <Pill />, label: 'Medicines' },
      ],
    },
    { href: '/symptom-checker', icon: <Bot />, label: 'Symptom Checker' },
    { href: '/awareness', icon: <Sparkles />, label: 'Health Awareness' },
  ];

  const isSubItemActive = (subItems: { href: string }[]) => {
    return subItems.some((item) => pathname === item.href);
  };

  return (
    <SidebarMenu>
      {menuItems.map((item, index) =>
        item.subItems ? (
          <Collapsible key={index} defaultOpen={isSubItemActive(item.subItems)}>
            <SidebarMenuItem className="relative">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className="w-full justify-between"
                  isActive={isSubItemActive(item.subItems)}
                >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        'data-[state=open]:rotate-180'
                      )}
                    />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.subItems.map((subItem, subIndex) => (
                  <SidebarMenuSubItem key={subIndex}>
                    <Link href={subItem.href} passHref>
                      <SidebarMenuSubButton
                        isActive={pathname === subItem.href}
                        asChild
                      >
                        <a>
                          {subItem.icon}
                          <span>{subItem.label}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </Link>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={index}>
            <Link href={item.href} passHref>
              <SidebarMenuButton isActive={pathname === item.href}>
                  {item.icon}
                  <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )
      )}
    </SidebarMenu>
  );
}
