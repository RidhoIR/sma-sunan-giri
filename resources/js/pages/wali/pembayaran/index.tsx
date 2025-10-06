import React from 'react'
import { Pembayaran, BreadcrumbItem } from '@/types'
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/DataTable';
import { column } from './column';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Pembayaran',
        href: '/wali/pembayaran',
    },
];

interface Props {
    pembayaran: Pembayaran[]
}

const index = ({ pembayaran }: Props) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Data Pembayaran' />
            <div className='flex justify-between items-center mb-4'>
                <div>
                    <h1 className='text-2xl font-bold'>Data Pembayaran</h1>
                    <h2 className='text-sm text-muted-foreground'>Data Pembayaran Siswa</h2>
                </div>
            </div>
            <Card className='p-4'>
                <DataTable data={pembayaran} columns={column} />
            </Card>
        </AppLayout >
    )
}

export default index
