import { DataTable } from '@/components/DataTable';
import { Biaya, BreadcrumbItem } from '@/types'
import React, { useState } from 'react'
import { column } from './column';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Biaya',
        href: '/admin/biaya',
    },
];

interface Props {
    biaya: Biaya[];
}
const Index = ({ biaya }: Props) => {

    const [open, setOpen] = useState(false);
    const { data, setData, post, errors, processing } = useForm({
        nama: '',
        jumlah: '',
    });

    const formatRupiah = (value: string) => {
        const numberString = value.replace(/[^,\d]/g, '').toString();
        const split = numberString.split(',');
        const sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        return rupiah ? `Rp. ${rupiah}` : 'Rp. ';
    };

    const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('jumlah', value);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.biaya.store'), {
            onSuccess: () => {
                setOpen(false);
            }
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Data Wali Murid' />
            <div className='flex justify-between items-center mb-4'>
                <div>
                    <h1 className='text-2xl font-bold capitalize'>Data Biaya</h1>
                    <h2 className='text-sm text-muted-foreground capitalize'>Kelola Data Biaya</h2>
                </div>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button className='hover:cursor-pointer' variant="default">+ Tambah Data</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Tambah Data</SheetTitle>
                            <SheetDescription>
                                Masukkan data sesuai dengan form yang ada dibawah ini
                            </SheetDescription>
                        </SheetHeader>
                        <form onSubmit={submit}>
                            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-demo-nama">Nama</Label>
                                    <Input
                                        id="sheet-demo-nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        required
                                    />
                                    {errors.nama && <p className="text-red-500">{errors.nama}</p>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="jumlah">Jumlah<span className='text-red-600'>*</span></Label>
                                    <Input
                                        id="jumlah"
                                        value={formatRupiah(data.jumlah)}
                                        onChange={handleJumlahChange}
                                        required
                                    />
                                    {errors.jumlah && <p className="text-red-600">{errors.jumlah}</p>}
                                </div>
                            </div>
                            <SheetFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Simpan
                                </Button>
                                <SheetClose asChild>
                                    <Button variant="outline">Close</Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>
            <Card className='p-4'>
                <DataTable data={biaya} columns={column} />
            </Card>
        </AppLayout >
    )
}

export default Index
