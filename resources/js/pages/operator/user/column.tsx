// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types"; // Sesuaikan dengan tipe data Anda
// import Delete from "./Delete";
// import Edit from "./Edit";
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react";
import Edit from "./edit";
import Delete from "./delete";



// Definisikan kolom tabel produk
export const column: ColumnDef<User>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "no_hp",
        header: "No. HP",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("no_hp")}</div>
        ),
    },
    {
        accessorKey: "akses",
        header: "Akses",
        cell: ({ row }) => {
            const akses = row.getValue("akses") as string;

            let badgeClass = '';
            let displayText = akses; // default tampilan sesuai nilai asli

            switch (akses) {
                case 'admin':
                    badgeClass = 'bg-green-500 text-white font-bold';
                    displayText = 'Operator';
                    break;
                case 'wali':
                    badgeClass = 'bg-purple-500 text-white font-bold';
                    displayText = 'Wali Murid'; // ubah teks yang ditampilkan
                    break;
                default:
                    badgeClass = 'bg-gray-500 text-white font-bold';
                    break;
            }

            return (
                <div className={`capitalize inline-flex items-center px-3 py-1 rounded-full ${badgeClass}`}>
                    {displayText}
                </div>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original

            return (

                <div className="flex gap-2 ">
                    <Edit user={user} />
                    <Delete user={user} />
                </div>
            )
        },
    },

];
