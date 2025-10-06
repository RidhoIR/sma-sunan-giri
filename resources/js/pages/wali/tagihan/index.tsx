import { DataTable } from '@/components/DataTable';
import { BreadcrumbItem, Tagihan } from '@/types'
import React, { useState } from 'react'
import { column } from './column';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Loader2 } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { MultiSelect, type Option } from "@/components/multi-select"
// import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
