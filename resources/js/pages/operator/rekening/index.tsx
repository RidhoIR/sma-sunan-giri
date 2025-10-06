import { DataTable } from '@/components/DataTable';
import { Bank, BankSekolah, BreadcrumbItem } from '@/types'
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
import { Combobox } from '@/components/ui/combobox';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Rekening Sekolah',
        href: '/admin/rekening',
    },
];

interface Props {
    bank_sekolah: BankSekolah[];
    banks: Bank[];
}
const Index = ({ bank_sekolah, banks }: Props) => {

    const [open, setOpen] = useState(false);
    const { data, setData, post, errors, processing } = useForm({
        nama_rekening: '',
        nomor_rekening: '',
        bank_id: '',
    });

    const optionBank = banks.map((bank) => {
        return {
            value: bank.id.toString(),
            label: bank.name,
        };
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.rekening.store'), {
            onSuccess: () => {
                setOpen(false);
            }
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Data Rekening' />
            <div className='flex justify-between items-center mb-4'>
                <div>
                    <h1 className='text-2xl font-bold capitalize'>Data Rekening</h1>
                    <h2 className='text-sm text-muted-foreground capitalize'>Kelola Data Rekening Sekolah</h2>
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
                                    <Label htmlFor="sheet-demo-bank">Bank</Label>
                                    <Combobox
                                        options={optionBank}
                                        value={data.bank_id}
                                        onValueChange={(value) => setData('bank_id', value)}
                                        placeholder="Pilih bank"
                                        searchPlaceholder="Cari bank..."
                                        emptyText="bank tidak ditemukan."
                                        className="w-full"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-demo-nama">Nama Rekening</Label>
                                    <Input
                                        id="sheet-demo-nama"
                                        value={data.nama_rekening}
                                        onChange={(e) => setData('nama_rekening', e.target.value)}
                                        required
                                    />
                                    {errors.nama_rekening && <p className="text-red-500">{errors.nama_rekening}</p>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-demo-nomor-rekening">Nomor Rekening</Label>
                                    <Input
                                        id="sheet-demo-nomor-rekening"
                                        value={data.nomor_rekening}
                                        onChange={(e) => setData('nomor_rekening', e.target.value)}
                                        required
                                    />
                                    {errors.nomor_rekening && <p className="text-red-500">{errors.nomor_rekening}</p>}
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
                <DataTable data={bank_sekolah} columns={column} />
            </Card>
        </AppLayout >
    )
}

export default Index
