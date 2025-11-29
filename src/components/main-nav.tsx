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
  SidebarMenuSkeleton,
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
  Mail,
  TrendingUp,
  Bed,
  FileText,
  HeartPulse,
  ClipboardCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { AppUser } from '@/lib/types';


const doctorMenuItems = [
    { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/community-health', icon: <HeartPulse />, label: 'Community Health' },
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
    { href: '/symptom-checker', icon: <Bot />, label: 'Medico' },
    { href: '/disease-predictor', icon: <TrendingUp />, label: 'Disease Predictor' },
    { href: '/bed-predictor', icon: <Bed />, label: 'Bed Predictor' },
    { href: '/prescription-emailer', icon: <Mail />, label: 'Prescription Emailer' },
    { href: '/report-summarizer', icon: <FileText />, label: 'Report Summarizer' },
    { href: '/awareness', icon: <Sparkles />, label: 'Health Awareness' },
  ];

const patientMenuItems = [
    { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/appointments', icon: <Calendar />, label: 'Appointments' },
    { href: '/family-health', icon: <Users />, label: 'Family Health' },
    { href: '/health-plan', icon: <ClipboardCheck />, label: 'My Health Plan'},
    { href: '/symptom-checker', icon: <Bot />, label: 'Medico' },
    { href: '/awareness', icon: <Sparkles />, label: 'Health Awareness' },
];


function MainNav({ pathname, user }: { pathname: string, user: AppUser }) {
  const menuItems = user.role === 'doctor' ? doctorMenuItems : patientMenuItems;

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
                      >
                          {subItem.icon}
                          <span>{subItem.label}</span>
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

export function MainNavWrapper() {
    const pathname = usePathname();
    const { data: user, isLoading } = useUser();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted || isLoading || !user) {
        const skeletonItems = user?.role === 'doctor' ? doctorMenuItems : patientMenuItems;
        return (
            <SidebarMenu>
                {skeletonItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                        <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        );
    }

    return <MainNav pathname={pathname} user={user} />;
}
