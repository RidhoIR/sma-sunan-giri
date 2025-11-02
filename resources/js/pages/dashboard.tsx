// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Bell, CreditCard, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    totalPembayaran: number;
    totalSiswa: number;
    jumlahPembayaran: number;
    unreadNotifications: number;
}

export default function Dashboard({ totalPembayaran, totalSiswa, jumlahPembayaran, unreadNotifications }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-primary from-primary via-secondary to-accent p-8 text-primary-foreground shadow-lg">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white blur-3xl"></div>
                    </div>
                    <div className="relative">
                        <h1 className="mb-2 text-4xl font-bold">Selamat Datang Kembali 👋</h1>
                        <p className="text-lg opacity-90">Kelola data pembayaran SPP dengan mudah dan efisien</p>
                    </div>
                </div>
            </div>
            <div className="mb-8 flex items-start gap-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <div className="shrink-0">
                    <Bell className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900">Notifikasi Pembayaran</h3>
                    <p className="mt-1 text-sm text-yellow-800">
                        Kamu memiliki <span className="font-bold">{unreadNotifications ?? 0} notifikasi</span> pembayaran yang belum ditinjau. Segera
                        tinjau untuk memastikan kelancaran sistem.
                    </p>
                    <Link href={route('admin.pembayaran.index')}>
                        <Button className="mt-3 bg-yellow-600 text-white hover:bg-yellow-700">Lihat Data Pembayaran</Button>
                    </Link>
                </div>
            </div>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Total Students Card */}
                <Card className="overflow-hidden border-0 shadow-md transition-shadow hover:shadow-lg">
                    <CardContent className="relative p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="mb-1 text-sm font-medium text-muted-foreground">Total Siswa</p>
                                <p className="text-3xl font-bold text-foreground">{totalSiswa ?? 0}</p>
                                <p className="mt-2 text-xs text-muted-foreground">Data aktif</p>
                            </div>
                            <div className="shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Payments Card */}
                <Card className="overflow-hidden border-0 shadow-md transition-shadow hover:shadow-lg">
                    <CardContent className="relative p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="mb-1 text-sm font-medium text-muted-foreground">Total Pembayaran</p>
                                <p className="truncate text-2xl font-bold text-foreground">{formatRupiah(jumlahPembayaran ?? 0)}</p>
                                <p className="mt-2 text-xs text-muted-foreground">Selama ini</p>
                            </div>
                            <div className="shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <CreditCard className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Notifications Card */}
                <Card className="overflow-hidden border-0 shadow-md transition-shadow hover:shadow-lg">
                    <CardContent className="relative p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="mb-1 text-sm font-medium text-muted-foreground">Notifikasi Tertunda</p>
                                <p className="text-3xl font-bold text-foreground">{unreadNotifications ?? 0}</p>
                                <p className="mt-2 text-xs text-muted-foreground">Memerlukan tindakan</p>
                            </div>
                            <div className="shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
