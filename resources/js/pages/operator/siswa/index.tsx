import { DataTable } from '@/components/DataTable';
import { BreadcrumbItem, Siswa, } from '@/types'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';




const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Siswa',
        href: '/admin/siswa',
    },
];

interface Props {
    siswa: Siswa[];
}
const Index = ({ siswa }: Props) => {

    const [open, setOpen] = useState(false);
    const { data, setData, post, errors, processing } = useForm({
        nama: '',
        nisn: '',
        jurusan: '',
        kelas: '',
        angkatan: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.siswa.store'), {
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
                    <h1 className='text-2xl font-bold'>Data Siswa</h1>
                    <h2 className='text-sm text-muted-foreground'>Kelola Data Siswa</h2>
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
                                    <Label htmlFor="sheet-demo-nisn">NISN</Label>
                                    <Input
                                        id="sheet-demo-nisn"
                                        value={data.nisn}
                                        onChange={(e) => setData('nisn', e.target.value)}
                                        required
                                    />
                                    {errors.nisn && <p className="text-red-500">{errors.nisn}</p>}
                                </div>
                                <div className='grid gap-3'>
                                    <Label htmlFor="jurusan">Jurusan</Label>
                                    <Select
                                        value={data.jurusan}
                                        onValueChange={(value) => setData('jurusan', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih jurusan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ipa">IPA</SelectItem>
                                            <SelectItem value="ips">IPS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.jurusan && <p className="text-red-600">{errors.jurusan}</p>}
                                </div>
                                <div className='grid gap-3'>
                                    <Label htmlFor="kelas">Kelas</Label>
                                    <Select
                                        value={data.kelas}
                                        onValueChange={(value) => setData('kelas', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="11">11</SelectItem>
                                            <SelectItem value="12">12</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.kelas && <p className="text-red-600">{errors.kelas}</p>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-demo-angkatan">Angkatan</Label>
                                    <Input
                                        id="sheet-demo-angkatan"
                                        type="angkatan"
                                        value={data.angkatan}
                                        onChange={(e) => setData('angkatan', e.target.value)}
                                        required
                                    />
                                    {errors.angkatan && <p className="text-red-500">{errors.angkatan}</p>}
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
                <DataTable data={siswa} columns={column} />
            </Card>
        </AppLayout >
    )
}

export default Index
