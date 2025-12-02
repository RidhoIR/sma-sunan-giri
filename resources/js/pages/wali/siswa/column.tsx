// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { WaliSiswa, } from "@/types";
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react";
// import Edit from "./edit";
// import Delete from "./delete";
// import { Link } from "@inertiajs/react";



// Definisikan kolom tabel produk
export const column: ColumnDef<WaliSiswa>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "wali.name",
        header: "Nama Wali Murid",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.wali.name}</div>
        ),
    },
    {
        accessorKey: "siswa.nama",
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
        cell: ({ row }) => <div className="capitalize">{row.original.siswa.nama}</div>,
    },
    {
        accessorKey: "siswa.nisn",
        header: "NISN",
        cell: ({ row }) => (
            <div className="uppercase">{row.original.siswa.nisn}</div>
        ),
    },
    {
        accessorKey: "siswa.jurusan",
        header: "Jurusan",
        cell: ({ row }) => (
            <div className="uppercase">{row.original.siswa.jurusan}</div>
        ),
    },
    {
        accessorKey: "siswa.kelas",
        header: "Kelas",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.siswa.kelas}</div>
        ),
    },
    {
        accessorKey: "siswa.angkatan",
        header: "Angkatan",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.siswa.angkatan}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const siswa = row.original

            return (

                <div className="flex gap-2 ">
                    {/* <Edit siswa={siswa} />
                    <Delete siswa={siswa} />
                    <Link href={route("admin.siswa.show", { id: siswa.id })}>
                        <Button variant="default">Detail</Button>
                    </Link> */}
                </div>
            )
        },
    },

];
