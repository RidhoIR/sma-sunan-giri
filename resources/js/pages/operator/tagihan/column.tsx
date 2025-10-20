// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Tagihan } from "@/types"; // Sesuaikan dengan tipe data Anda
import { Button } from "@/components/ui/button"
import { ArrowUpDown, File } from "lucide-react";

import { Link } from "@inertiajs/react";
import { formatRupiah, formatTanggalIndonesiaLengkap } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";



// Definisikan kolom tabel produk
export const column = (tahun: string | number): ColumnDef<Tagihan>[] => [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "siswa.nama",
        header: "Nama",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.siswa.nama}</div>
        ),
    },
    {
        accessorKey: "siswa.jurusan",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    jurusan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="uppercase">{row.original.siswa.jurusan}</div>,
    },
    {
        accessorKey: "tanggal_tagihan",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tanggal Tagihan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="capitalize">{formatTanggalIndonesiaLengkap(row.getValue("tanggal_tagihan"))}</div>,
    },
    {
        accessorKey: "kelas",
        header: "Kelas",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.siswa.kelas}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status Pembayaran",
        cell: ({ row }) => {
            const status = row.original.status;

            const statusLabel: Record<string, string> = {
                baru: "Belum dibayar",
                lunas: "Sudah dibayar lunas",
                angsur: "Belum lunas",
            };

            const badgeColor: Record<string, string> = {
                baru: "bg-blue-500/10 text-blue-700 border border-blue-500/30",
                angsur: "bg-yellow-500/10 text-yellow-700 border border-yellow-500/30",
                lunas: "bg-green-500/10 text-green-700 border border-green-500/30",
            };

            return (
                <Badge className={`capitalize px-3 py-1 rounded-md ${badgeColor[status] ?? "bg-gray-200 text-gray-700"}`}>
                    {statusLabel[status] ?? status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "totalDibayar",
        header: "Total Dibayar",
        cell: ({ row }) => (
            <div className="capitalize text-blue-500">{formatRupiah(row.original.totalDibayar)}</div>
        ),
    },
    {
        accessorKey: "sisaBayar",
        header: "Sisa Bayar",
        cell: ({ row }) => (
            <div className="capitalize text-red-500">{formatRupiah(row.original.sisaBayar)}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const tagihan = row.original

            return (

                <div className="flex gap-2 ">
                    {/* <Edit tagihan={tagihan} />
                    <Delete tagihan={tagihan} /> */}
                    <Link href={route("admin.tagihan.show", tagihan.id)}>
                        <Button variant={"blue"}>
                            Detail
                        </Button>
                    </Link>
                    <Button onClick={() => window.open(route('admin.tagihan.cetakSPP', {
                        id: tagihan.siswa.id,
                        tahun: tahun || new Date().getFullYear(),
                    }), '_blank')}>
                        <File /> Kartu SPP
                    </Button>
                </div>
            )
        },
    },

];
