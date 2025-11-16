import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Laporan', href: '/operator/laporan' }];

interface Siswa {
    id: number;
    nama: string;
    nisn: string;
    angkatan: string;
}

interface Tagihan {
    id: number;
    status: string;
    created_at: string;
    siswa: Siswa;
    total_tagihan?: number;
}

interface Props {
    laporanTagihan?: Tagihan[];
    filters?: Record<string, any>;
}

const Index = ({ filters = {} }: Props) => {
    // Gunakan form inertia
    const { data, setData, processing } = useForm({
        angkatan: filters.angkatan || '',
        status_tagihan: filters.status_tagihan || '',
        bulan: filters.bulan || '',
        tahun: filters.tahun || '',
        status_pembayaran: filters.status_pembayaran || '',
        angkatan_pembayaran: filters.angkatan_pembayaran || '',
        bulan_pembayaran: filters.bulan_pembayaran || '',
        tahun_pembayaran: filters.tahun_pembayaran || '',
    });



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan" />

            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Laporan</h1>
                    <h2 className="text-sm text-muted-foreground">Filter & lihat laporan</h2>
                </div>
            </div>

            <Card className="space-y-6 p-4">
                <form action={route('admin.laporan.generateLaporanTagihan')} method="GET" target="_blank" className="space-y-4">
                    <h1 className="text-xl font-bold">Laporan Tagihan</h1>

                    {/* Hidden input AGAR DATA TERKIRIM KE LARAVEL */}
                    <input type="hidden" name="angkatan" value={data.angkatan} />
                    <input type="hidden" name="status_tagihan" value={data.status_tagihan} />
                    <input type="hidden" name="bulan" value={data.bulan} />
                    <input type="hidden" name="tahun" value={data.tahun} />

                    <div className="flex flex-wrap gap-4">
                        {/* Angkatan */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="angkatan">Angkatan</Label>
                            <Select onValueChange={(val) => setData('angkatan', val)} value={data.angkatan}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Angkatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2022">2022</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Tagihan */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="status_tagihan">Status Tagihan</Label>
                            <Select onValueChange={(val) => setData('status_tagihan', val)} value={data.status_tagihan}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Lunas">Lunas</SelectItem>
                                    <SelectItem value="Belum Bayar">Belum Bayar</SelectItem>
                                    <SelectItem value="angsur">Belum Lunas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bulan */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="bulan">Bulan</Label>
                            <Select onValueChange={(val) => setData('bulan', val)} value={data.bulan}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        'Januari',
                                        'Februari',
                                        'Maret',
                                        'April',
                                        'Mei',
                                        'Juni',
                                        'Juli',
                                        'Agustus',
                                        'September',
                                        'Oktober',
                                        'November',
                                        'Desember',
                                    ].map((bln) => (
                                        <SelectItem key={bln} value={bln}>
                                            {bln}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tahun */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tahun">Tahun</Label>
                            <Select onValueChange={(val) => setData('tahun', val)} value={data.tahun}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2022">2022</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2025">2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Memproses...' : 'Tampilkan'}
                            </Button>
                        </div>
                    </div>
                </form>

                <form action={route('admin.laporan.generateLaporanPembayaran')} method="GET" target="_blank" className="space-y-4">
                    <h1 className="text-xl font-bold">Laporan Pembayaran</h1>
                    {/* Hidden input AGAR DATA TERKIRIM KE LARAVEL */}
                    <input type="hidden" name="angkatan_pembayaran" value={data.angkatan_pembayaran} />
                    <input type="hidden" name="status_pembayaran" value={data.status_pembayaran} />{' '}
                    <input type="hidden" name="bulan_pembayaran" value={data.bulan_pembayaran} />
                    <input type="hidden" name="tahun_pembayaran" value={data.tahun_pembayaran} />
                    <div className="flex flex-wrap gap-4">
                        {/* Angkatan */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="angkatan">Angkatan</Label>
                            <Select onValueChange={(val) => setData('angkatan_pembayaran', val)} value={data.angkatan_pembayaran}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Angkatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2022">2022</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Tagihan */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="status_pembayaran">Status Pemabayaran</Label>
                            <Select onValueChange={(val) => setData('status_pembayaran', val)} value={data.status_pembayaran}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sudah Dikonfirmasi">Sudah Dikonfirmasi</SelectItem>
                                    <SelectItem value="Belum Dikonfirmasi">Belum Dikonfirmasi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bulan */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="bulan">Bulan</Label>
                            <Select onValueChange={(val) => setData('bulan_pembayaran', val)} value={data.bulan_pembayaran}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        'Januari',
                                        'Februari',
                                        'Maret',
                                        'April',
                                        'Mei',
                                        'Juni',
                                        'Juli',
                                        'Agustus',
                                        'September',
                                        'Oktober',
                                        'November',
                                        'Desember',
                                    ].map((bln) => (
                                        <SelectItem key={bln} value={bln}>
                                            {bln}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tahun */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tahun">Tahun</Label>
                            <Select onValueChange={(val) => setData('tahun_pembayaran', val)} value={data.tahun_pembayaran}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2022">2022</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2025">2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Memproses...' : 'Tampilkan'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
};

export default Index;
