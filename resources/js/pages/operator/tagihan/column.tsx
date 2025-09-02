// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Tagihan } from "@/types"; // Sesuaikan dengan tipe data Anda
import { Button } from "@/components/ui/button"
import { ArrowUpDown, File } from "lucide-react";

import { Link } from "@inertiajs/react";
import { formatTanggalIndonesiaLengkap } from "@/lib/utils";



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
        accessorKey: "angkatan",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Angkatan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("angkatan")}</div>,
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
            <div className="capitalize">{row.getValue("kelas")}</div>
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
