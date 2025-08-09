// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Siswa, } from "@/types";
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react";
import Edit from "./edit";
import Delete from "./delete";



// Definisikan kolom tabel produk
export const column: ColumnDef<Siswa>[] = [
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
            <div className="capitalize">{row.getValue("nisn")}</div>
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
        cell: ({ row }) => <div className="capitalize">{row.getValue("nama")}</div>,
    },
    {
        accessorKey: "jurusan",
        header: "Jurusan",
        cell: ({ row }) => (
            <div className="uppercase">{row.getValue("jurusan")}</div>
        ),
    },
    {
        accessorKey: "kelas",
        header: "Kelas",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("kelas")}</div>
        ),
    },
    {
        accessorKey: "angkatan",
        header: "Angkatan",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("angkatan")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const siswa = row.original

            return (

                <div className="flex gap-2 ">
                    <Edit siswa={siswa} />
                    <Delete siswa={siswa} />
                </div>
            )
        },
    },

];
