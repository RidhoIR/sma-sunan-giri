import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useForm } from '@inertiajs/react'
import { Pembayaran } from '@/types';
import { Loader2, Trash } from 'lucide-react';

interface Props {
    pembayaran: Pembayaran;
}

const Delete = ({ pembayaran }: Props) => {
    const { delete: destroy, reset, processing } = useForm({})
    const destroyUser = (id: number) => {
        destroy(route("admin.pembayaran.destroy", id), {
            onSuccess: () => reset(),
        });
    }
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="red">
                        <Trash /> Hapus
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete it permanently?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <button
                                disabled={processing}
                                onClick={() => destroyUser(pembayaran.id)}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-red-600 text-white hover:bg-red-700 px-4 py-2"
                            >
                                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Continue"}
                            </button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Delete
