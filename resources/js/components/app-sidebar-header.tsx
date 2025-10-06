import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import AppearanceToggleDropdown from './appearance-dropdown';
import NotificationsDropdown from './notifications-dropdown';
import { usePage } from '@inertiajs/react'
import type { NotificationItem } from '@/types'



export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {

    const { notifications } = usePage<{ notifications: NotificationItem[] }>().props

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center justify-between gap-2 w-full">
                <div className='flex items-center gap-2'>
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div className='flex items-center gap-2'>
                    <AppearanceToggleDropdown />
                    <NotificationsDropdown initialItems={notifications} />
                </div>
            </div>
        </header>
    );
}
