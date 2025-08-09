import { DataTable } from '@/components/DataTable';
import { BreadcrumbItem, User } from '@/types'
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
        title: 'Data Wali Murid',
        href: '/admin/wali',
    },
];

interface Props {
    wali: User[];
}
const Index = ({ wali }: Props) => {

    const [open, setOpen] = useState(false);
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        email: '',
        no_hp: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.wali.store'), {
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
                    <h1 className='text-2xl font-bold'>Data Wali Murid</h1>
                    <h2 className='text-sm text-muted-foreground'>Kelola Data Wali Murid</h2>
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
                                    <Label htmlFor="sheet-demo-name">Name</Label>
                                    <Input
                                        id="sheet-demo-name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-demo-email">Email</Label>
                                    <Input
                                        id="sheet-demo-email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                                </div>
                                <div className='grid gap-3'>
                                    <Label htmlFor="sheet-demo-no_hp">No. Handphone</Label>
                                    <Input
                                        id="sheet-demo-no_hp"
                                        type="number"
                                        value={data.no_hp}
                                        onChange={(e) => setData('no_hp', e.target.value)}
                                        required
                                    />
                                    {errors.no_hp && <p className="text-red-500">{errors.no_hp}</p>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-demo-password">Password</Label>
                                    <Input
                                        id="sheet-demo-password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && <p className="text-red-500">{errors.password}</p>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-demo-password_confirmation">Konfirmasi Password</Label>
                                    <Input
                                        id="sheet-demo-password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    {errors.password_confirmation && <p className="text-red-500">{errors.password_confirmation}</p>}
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
                <DataTable data={wali} columns={column} />
            </Card>
        </AppLayout >
    )
}

export default Index
