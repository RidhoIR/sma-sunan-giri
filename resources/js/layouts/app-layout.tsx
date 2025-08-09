import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import RouteLayout from './route-layout';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <RouteLayout>
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6'>

                {children}
            </div>
        </AppLayoutTemplate>
    </RouteLayout>
);
