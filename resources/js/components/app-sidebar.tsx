import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Data Users',
        href: '/admin/user',
        icon: LayoutGrid,
    },
    {
        title: 'Data Rekening Sekolah',
        href: '/admin/rekening',
        icon: LayoutGrid,
    },
    {
        title: 'Data Wali Murid',
        href: '/admin/wali-murid',
        icon: LayoutGrid,
    },
    {
        title: 'Data Siswa',
        href: '/admin/siswa',
        icon: LayoutGrid,
    },
    {
        title: 'Data Biaya',
        href: '/admin/biaya',
        icon: LayoutGrid
    },
    {
        title: 'Data Tagihan',
        href: '/admin/tagihan',
        icon: LayoutGrid
    },
    {
        title: 'Data Pembayaran',
        href: '/admin/pembayaran',
        icon: LayoutGrid
    },
    {
        title: 'Laporan',
        href: '/admin/laporan',
        icon: LayoutGrid
    }
];

const waliNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/wali/dashboard', icon: LayoutGrid },
    { title: 'Data Siswa', href: '/wali/siswa', icon: LayoutGrid },
    { title: 'Data Tagihan', href: '/wali/tagihan', icon: LayoutGrid },
    { title: 'Data Pembayaran', href: '/wali/pembayaran', icon: LayoutGrid },

];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const {auth} = usePage<SharedData>().props;
    const user = auth.user;

    const mainNavItems = user?.akses === 'admin' ? adminNavItems : waliNavItems;
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
