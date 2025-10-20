// src/Components/columns.ts

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRupiah, formatTanggalIndonesiaLengkap } from '@/lib/utils';
import { Tagihan } from '@/types'; // Sesuaikan dengan tipe data Anda
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

// Definisikan kolom tabel produk
export const column: ColumnDef<Tagihan>[] = [
    {
        id: 'no',
        header: 'No.',
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'siswa.nama',
        header: 'Nama',
        cell: ({ row }) => <div className="capitalize">{row.original.siswa.nama}</div>,
    },
    {
        accessorKey: 'siswa.jurusan',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Jurusan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="uppercase">{row.original.siswa.jurusan}</div>,
    },
    {
        accessorKey: 'kelas',
        header: 'Kelas',
        cell: ({ row }) => <div className="capitalize">{row.original.siswa.kelas}</div>,
    },
    // {
    //     accessorKey: "tanggal_tagihan",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Tgl. Tagihan
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    //     cell: ({ row }) => <div className="capitalize">{formatTanggalIndonesiaLengkap(row.getValue("tanggal_tagihan"))}</div>,
    // },
    {
        accessorKey: 'tanggal_jatuh_tempo',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Tgl. Jatuh Tempo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="capitalize">{formatTanggalIndonesiaLengkap(row.getValue('tanggal_jatuh_tempo'))}</div>,
    },
    {
        accessorKey: 'status',
        header: 'Status Pembayaran',
        cell: ({ row }) => {
            const status = row.original.status;

            const statusLabel: Record<string, string> = {
                baru: 'Belum dibayar',
                lunas: 'Sudah dibayar lunas',
                angsur: 'Belum lunas',
            };

            const badgeColor: Record<string, string> = {
                baru: 'bg-blue-500/10 text-blue-700 border border-blue-500/30',
                angsur: 'bg-yellow-500/10 text-yellow-700 border border-yellow-500/30',
                lunas: 'bg-green-500/10 text-green-700 border border-green-500/30',
            };

            return (
                <Badge className={`rounded-md px-3 py-1 capitalize ${badgeColor[status] ?? 'bg-gray-200 text-gray-700'}`}>
                    {statusLabel[status] ?? status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'totalDibayar',
        header: 'Total Dibayar',
        cell: ({ row }) => <div className="text-blue-500 capitalize">{formatRupiah(row.original.totalDibayar)}</div>,
    },
    {
        accessorKey: 'sisaBayar',
        header: 'Sisa Bayar',
        cell: ({ row }) => <div className="text-red-500 capitalize">{formatRupiah(row.original.sisaBayar)}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const tagihan = row.original;
            const pembayaranTerakhir = tagihan.latest_pembayaran;
            // console.log(pembayaranTerakhir)

            let content;

            if (tagihan.status == 'lunas') {
                content = (
                    <Link href={route('wali.tagihan.show', tagihan.id)}>
                        <Button variant="green">Pembayaran Sudah Lunas</Button>
                    </Link>
                );
            } else if (pembayaranTerakhir && !pembayaranTerakhir.tanggal_konfirmasi) {
                content = <Button variant="yellow">Menunggu Konfirmasi Admin</Button>;
            } else {
                content = (
                    <Link href={route('wali.tagihan.show', tagihan.id)}>
                        <Button variant="default">Lakukan Pembayaran</Button>
                    </Link>
                );
            }

            return <div className="flex gap-2">{content}</div>;
        },
    },
];
