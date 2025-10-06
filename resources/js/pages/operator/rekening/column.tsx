// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { BankSekolah} from "@/types";
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react";
import Edit from "./edit";
import Delete from "./delete";



export const column: ColumnDef<BankSekolah>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "nama_bank",
        header: "Nama Bank",
        cell: ({ row }) => (
            <div className="capitalize">{(row.getValue("nama_bank"))}</div>
        ),
    },
    {
        accessorKey: "kode",
        header: "Kode Transfer",
        cell: ({ row }) => (
            <div className="capitalize">{(row.getValue("kode"))}</div>
        ),
    },
    {
        accessorKey: "nama_rekening",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Pemilik Rekening
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="capitalize">{row.getValue("nama_rekening")}</div>,
    },
    {
        accessorKey: "nomor_rekening",
        header: "No. Rekening",
        cell: ({ row }) => (
            <div className="capitalize">{(row.getValue("nomor_rekening"))}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const bank_sekolah = row.original

            return (

                <div className="flex gap-2 ">
                    <Edit bank_sekolah={bank_sekolah} />
                    <Delete bank_sekolah={bank_sekolah} />
                </div>
            )
        },
    },

];
