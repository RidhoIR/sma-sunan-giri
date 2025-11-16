import { DataTable } from '@/components/DataTable';
import { BreadcrumbItem, Tagihan } from '@/types'

import { column } from './column';
import AppLayout from '@/layouts/app-layout';
import { Head, } from '@inertiajs/react';

import { Card } from '@/components/ui/card';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Tagihan',
        href: '/admin/tagihan',
    },
];

interface Props {
    tagihan: Tagihan[];

}



const Index = ({ tagihan }: Props) => {

    // const { biayas } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Data Tagihan' />
            <div className='flex justify-between items-center mb-4'>
                <div>
                    <h1 className='text-2xl font-bold'>Data Tagihan</h1>
                    <h2 className='text-sm text-muted-foreground'>Kelola Data Tagihan</h2>
                </div>
            </div>
            <Card className='p-4'>
                <DataTable data={tagihan} columns={column} />
            </Card>
        </AppLayout >
    )
}

export default Index
