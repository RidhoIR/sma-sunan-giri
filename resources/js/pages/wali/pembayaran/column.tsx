// src/Components/columns.ts

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pembayaran } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';
// import Edit from "./edit";
// import Delete from "./delete";

export const column: ColumnDef<Pembayaran>[] = [
    {
        id: 'no',
        header: 'No.',
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'nisn',
        header: 'NISN',
        cell: ({ row }) => <div className="capitalize">{row.original.tagihan.siswa.nisn}</div>,
    },
    {
        accessorKey: 'nama',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="capitalize">{row.original.tagihan.siswa.nama}</div>,
    },
    {
        accessorKey: 'wali.name',
        header: 'Nama Wali',
        cell: ({ row }) => <div className="capitalize">{row.original.wali.name}</div>,
    },
    {
        accessorKey: 'metode_pembayaran',
        header: 'Metode Pembayaran',
        cell: ({ row }) => <div className="capitalize">{row.original.metode_pembayaran}</div>,
    },
    {
        // Gunakan accessorKey yang relevan jika ada, atau biarkan kosong jika hanya untuk tampilan
        accessorKey: 'tanggal_konfirmasi',
        header: 'Status konfirmasi',
        cell: ({ row }) => {
            // Ambil nilai tanggal_konfirmasi dari data baris
            const tanggalKonfirmasi = row.original.tanggal_konfirmasi;

            // Tentukan status dan warna berdasarkan nilai tanggalKonfirmasi
            const isConfirmed = tanggalKonfirmasi !== null && tanggalKonfirmasi !== undefined;

            // Tentukan label dan warna berdasarkan isConfirmed
            const statusKey = isConfirmed ? 'sudah' : 'belum';

            const statusLabel: Record<string, string> = {
                belum: 'Belum dikonfirmasi',
                sudah: 'Sudah dikonfirmasi',
            };

            // Skema warna untuk status
            const badgeColor: Record<string, string> = {
                belum: 'bg-yellow-500/10 text-yellow-700 border border-yellow-500/30', // Belum (misalnya, kuning/warning)
                sudah: 'bg-green-500/10 text-green-700 border border-green-500/30', // Sudah (misalnya, hijau/success)
            };

            return (
                <Badge className={`rounded-md px-3 py-1 capitalize ${badgeColor[statusKey] ?? 'bg-gray-200 text-gray-700'}`}>
                    {statusLabel[statusKey] ?? 'Unknown'}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const pembayaran = row.original;

            return (
                <div className="flex items-center justify-center gap-2">
                    <Link href={route('wali.pembayaran.detail', pembayaran.id)}>
                        <Button variant="blue">
                            <Eye /> Detail
                        </Button>
                    </Link>
                    {/* <Delete pembayaran={pembayaran} /> */}
                </div>
            );
        },
    },
];
