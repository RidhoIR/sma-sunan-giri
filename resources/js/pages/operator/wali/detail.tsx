import { BreadcrumbItem, Siswa, User, WaliSiswa } from '@/types'
import React, { useState } from 'react'
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { GraduationCap, Loader2, Trash, UserIcon, UserPlus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { CommandCombobox } from '@/components/combobox-command';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Data Wali Murid',
        href: '/admin/wali',
    },
];

interface Props {
    wali: User;
    wali_siswa: WaliSiswa[];
    siswa_belum_dimiliki: Siswa[];
}
const Detail = ({ wali, wali_siswa, siswa_belum_dimiliki }: Props) => {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, } = useForm({
        siswa_id: '',
        wali_id: '',
    });

    const { delete: destroy, processing: processingDelete } = useForm({});


    const optionSiswa = siswa_belum_dimiliki.map((item) => ({
        label: item.nisn + ' - ' + item.nama,
        value: item.id.toString(),
    }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.wali.storeWaliSiswa", wali.id))
    };

    const destroyWaliSiswa = (id: number) => {
        destroy(route("admin.wali.destroyWaliSiswa", id), {
            onSuccess: () => {
                setOpen(false);
            }

        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Data Wali Murid' />
            <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
                <div className='flex justify-between items-center mb-4'>
                    <div>
                        <h1 className='text-2xl font-bold'>Detail Data Wali Murid</h1>
                        <h2 className='text-sm text-muted-foreground'>Informasi lengkap data wali murid dan anak yang diasuh</h2>
                    </div>
                </div>
                <Card className="bg-white shadow-sm p-4">
                    <div className='flex items-center gap-2'>
                        <UserIcon />
                        <h1 className='text-xl font-bold capitalize'>Informasi Personal</h1>
                    </div>
                    <div className='mb-4'>
                        <Table className='md:w-xl'>
                            <TableBody>
                                <TableRow >
                                    <TableCell className="font-medium text-gray-900">Nama</TableCell>
                                    <TableCell className="text-gray-900">: {wali.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Email</TableCell>
                                    <TableCell className="text-gray-900">: {wali.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">No. Telepon</TableCell>
                                    <TableCell className="text-gray-900">: {wali.no_hp}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div className='flex items-center gap-2'>
                        <UserPlus />
                        <h1 className='text-xl font-bold capitalize'>Tambah Data Anak</h1>
                    </div>
                    <form onSubmit={submit}>
                        <div className='mb-4'>
                            <Label htmlFor="mahasiswa_id">Pilih Siswa</Label>
                            <CommandCombobox
                                value={data.siswa_id}
                                onValueChange={(value) => setData('siswa_id', value)}
                                options={optionSiswa} />
                        </div>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </form>
                    <div className='flex items-center gap-2'>
                        <GraduationCap />
                        <h1 className='text-xl font-bold capitalize'>Data Anak ({wali_siswa.length} Anak)</h1>
                    </div>
                    <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold text-gray-700">No</TableHead>
                                    <TableHead className="font-semibold text-gray-700">NISN</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Nama</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Updated_by</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {wali_siswa.length > 0 ? (
                                    wali_siswa.map((item, index) => (
                                        <TableRow key={index} className="hover:bg-gray-50">
                                            <TableCell className="text-gray-900">{index + 1}</TableCell>
                                            <TableCell className="font-medium text-gray-900">
                                                {item.siswa.nisn}
                                            </TableCell>
                                            <TableCell className="text-gray-900">
                                                {item.siswa.nama}
                                            </TableCell>
                                            <TableCell className="text-gray-900">
                                                {item.user.name}
                                            </TableCell>
                                            <TableCell className="text-gray-900">
                                                <Dialog open={open} onOpenChange={setOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive">
                                                            <Trash />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Confirm</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to delete it permanently? <span className='text-red-500'>{item.siswa.nama}</span>
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button variant="outline">Cancel</Button>
                                                            </DialogClose>
                                                            <Button type='submit' variant={'destructive'} onClick={() => destroyWaliSiswa(item.id)} disabled={processingDelete}>
                                                                {processingDelete && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                Continue
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                                            Belum ada Data Anak
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </AppLayout >
    )
}

export default Detail
