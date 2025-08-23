// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Tagihan } from "@/types"; // Sesuaikan dengan tipe data Anda
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react";
import Edit from "./edit";
import Delete from "./delete";
import { Link } from "@inertiajs/react";



// Definisikan kolom tabel produk
export const column: ColumnDef<Tagihan>[] = [
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
            const wali = row.original

            return (

                <div className="flex gap-2 ">
                    {/* <Edit wali={wali} />
                    <Delete wali={wali} /> */}
                    <Link href={route("admin.tagihan.show", wali.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Detail</Link>
                </div>
            )
        },
    },

];
