// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Biaya} from "@/types";
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import Edit from "./edit";
import Delete from "./delete";



export const column: ColumnDef<Biaya>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
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
        accessorKey: "tahun_ajaran",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tahun Ajaran
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="capitalize">{row.getValue("tahun_ajaran")}</div>,
    },
    {
        accessorKey: "jumlah",
        header: "Jumlah",
        cell: ({ row }) => (
            <div className="capitalize">{formatRupiah(row.getValue("jumlah"))}</div>
        ),
    },
    {
        accessorKey: "user.name",
        header: "Updated_by",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.user.name}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const biaya = row.original

            return (

                <div className="flex gap-2 ">
                    <Edit biaya={biaya} />
                    <Delete biaya={biaya} />
                </div>
            )
        },
    },

];
