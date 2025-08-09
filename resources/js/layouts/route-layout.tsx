import Toastify from '@/components/Toastify';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react'
import { toast } from "react-toastify"

export default function RouteLayout({ children }: { children: React.ReactNode }) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash && flash?.error) {
            toast.error(flash.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } else if (flash && flash?.success) {
            toast.success(flash.success, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }, [flash]);

    return (
        <div>
            {flash?.success && <Toastify />}
            {flash?.error && <Toastify />}
            {children}
        </div>
    )
}
