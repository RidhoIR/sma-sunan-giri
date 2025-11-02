// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Pembayaran } from "@/types";
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye } from "lucide-react";
import { Link } from "@inertiajs/react";
// import Edit from "./edit";
// import Delete from "./delete";



export const column: ColumnDef<Pembayaran>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "nisn",
        header: "NISN",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.tagihan.siswa.nisn}</div>
        ),
    },
    {
        accessorKey: "nama",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="capitalize">{row.original.tagihan.siswa.nama}</div>,
    },
    {
        accessorKey: "wali.name",
        header: "Nama Wali",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.wali.name}</div>
        ),
    },
    {
        accessorKey: "metode_pembayaran",
        header: "Metode Pembayaran",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.metode_pembayaran}</div>
        ),
    },
    {
        accessorKey: "status_konfirmasi",
        header: "Status Konfirmasi",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.status_konfirmasi}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const pembayaran = row.original

            return (

                <div className="flex justify-center items-center gap-2 ">
                    <Link href={route("wali.pembayaran.detail", pembayaran.id)}>
                        <Button variant='blue'>
                            <Eye />  Detail
                        </Button>
                    </Link>
                    {/* <Delete pembayaran={pembayaran} /> */}
                </div>
            )
        },
    },

];
