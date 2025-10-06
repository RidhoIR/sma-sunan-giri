import { BreadcrumbItem, Pembayaran } from '@/types'
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatRupiah, formatTanggalIndonesiaJam, formatTanggalIndonesiaLengkap, } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Pembayaran',
        href: '/admin/pembayaran',
    },
];

interface Props {
    pembayaran: Pembayaran;
}
const Detail = ({ pembayaran }: Props) => {


    const { put, reset, } = useForm({
        tanggal_konfirmasi: '',
    });
    const [openBukti, setOpenBukti] = useState(false);

    // const [date, setDate] = useState<Date | null>(null);
    // const handleDateChange = (date: Date | null) => {
    //     setDate(date);
    //     setData('tanggal_pembayaran', date ? date.toISOString().split('T')[0] : '');
    // }

    const updateKonfirmasi = (id: number) => {
        put(route("admin.pembayaran.konfirmasi", id), {
            onSuccess: () => reset(),
        });
    }



    // const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value.replace(/\D/g, '');
    //     setData('jumlah_dibayar', value);
    // };

    // const submit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     post(route('admin.pembayaran.store'), {
    //         onSuccess: () => {
    //             reset();
    //         }
    //     });

    // };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Pembayaran ' + pembayaran.tagihan.siswa.nama} />
            <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
                <div className='flex justify-between items-center mb-4'>
                    <div>
                        <h1 className='text-2xl font-bold'>Detail Pembayaran {pembayaran.tagihan.siswa.nama}</h1>
                        <h2 className='text-sm text-muted-foreground'>Informasi lengkap detail pembayaran</h2>
                    </div>
                </div>
                <Card className="bg-white shadow-sm p-4 mb-4">
                    <div className=''>
                        <h2 className="uppercase text-lg font-semibold text-white bg-gray-600 p-2">informasi tagihan</h2>
                        <Table className='md:w-full'>
                            <TableBody>
                                <TableRow >
                                    <TableCell className="font-medium text-gray-900 w-40">No</TableCell>
                                    <TableCell className="text-gray-900">: {pembayaran.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Tagihan ID</TableCell>
                                    <TableCell className="text-gray-900">: {pembayaran.tagihan.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Item Tagihan</TableCell>
                                    <TableCell className="text-gray-900">
                                        <Table className="table-auto w-full">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className='w-24'>No</TableHead>
                                                    <TableHead className="">Nama Biaya</TableHead>
                                                    <TableHead className="">Jumlah</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {/* Ganti dengan sumber data detail item Anda */}
                                                {pembayaran.tagihan.details?.map((item, index) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className='w-24'>{index + 1}</TableCell>
                                                        <TableCell className="">{item.nama_biaya}</TableCell>
                                                        <TableCell className="">{formatRupiah(item.jumlah_biaya)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            {pembayaran.tagihan.details?.length > 0 && (
                                                <TableFooter>
                                                    <TableRow className="bg-gray-100 font-semibold">
                                                        <TableCell className="w-12"></TableCell>
                                                        <TableCell className="font-bold text-gray-900 capitalize text-center">Total Tagihan</TableCell>
                                                        <TableCell className="font-bold text-gray-900">
                                                            {formatRupiah(pembayaran.tagihan.details.reduce((total, item) => total + item.jumlah_biaya, 0))}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            )}
                                        </Table>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Total Tagihan</TableCell>
                                    <TableCell className="text-gray-900">: {formatRupiah(pembayaran.tagihan.details.reduce((total, item) => total + item.jumlah_biaya, 0))}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div className=''>
                        <h2 className="uppercase text-lg font-semibold text-white bg-gray-600 p-2">informasi siswa</h2>
                        <Table className='md:w-full'>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900 w-40">Nama Siswa</TableCell>
                                    <TableCell className="text-gray-900">: {pembayaran.tagihan.siswa.nama}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Nama Wali</TableCell>
                                    <TableCell className="text-gray-900">: {pembayaran.wali.name}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    {/* Informasi bank pengirim */}
                    {pembayaran.metode_pembayaran === 'transfer' && (
                        <div className=''>
                            <h2 className="uppercase text-lg font-semibold text-white bg-gray-600 p-2">
                                informasi bank pengirim
                            </h2>
                            <Table className='md:w-full'>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900 w-40">Bank Pengirim</TableCell>
                                        <TableCell className="text-gray-900">
                                            : {pembayaran.wali_bank?.nama_bank ?? '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Nomor Rekening</TableCell>
                                        <TableCell className="text-gray-900">
                                            : {pembayaran.wali_bank?.nomor_rekening ?? '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Pemilik Rekening</TableCell>
                                        <TableCell className="text-gray-900 capitalize">
                                            : {pembayaran.wali_bank?.nama_rekening ?? '-'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    {/* Informasi bank tujuan */}
                    {pembayaran.metode_pembayaran === 'transfer' && (
                        <div className=''>
                            <h2 className="uppercase text-lg font-semibold text-white bg-gray-600 p-2">
                                informasi bank tujuan
                            </h2>
                            <Table className='md:w-full'>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900 w-40">Bank Tujuan Transfer</TableCell>
                                        <TableCell className="text-gray-900">
                                            : {pembayaran.bank_sekolah?.nama_bank ?? '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Nomor Rekening</TableCell>
                                        <TableCell className="text-gray-900">
                                            : {pembayaran.bank_sekolah?.nomor_rekening ?? '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Atas Nama</TableCell>
                                        <TableCell className="text-gray-900 capitalize">
                                            : {pembayaran.bank_sekolah?.nama_rekening ?? '-'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    <div className=''>
                        <h2 className="uppercase text-lg font-semibold text-white bg-gray-600 p-2">informasi pembayaran</h2>
                        <Table className='md:w-full'>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900 capitalize w-40">Metode Pembayaran</TableCell>
                                    <TableCell className="text-gray-900">: {pembayaran.metode_pembayaran}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Tanggal Pembayaran</TableCell>
                                    <TableCell className="text-gray-900">: {formatTanggalIndonesiaLengkap(pembayaran.tanggal_pembayaran)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Jumlah Total Tagihan</TableCell>
                                    <TableCell className="text-gray-900 capitalize">: {formatRupiah(pembayaran.tagihan.details.reduce((total, item) => total + item.jumlah_biaya, 0))}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Jumlah Yang Dibayar</TableCell>
                                    <TableCell className="text-gray-900 capitalize">: {formatRupiah(pembayaran.jumlah_dibayar)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Bukti Pembayaran</TableCell>
                                    <TableCell className="text-gray-900 capitalize">:
                                        <Dialog open={openBukti} onOpenChange={setOpenBukti}>
                                            <DialogTrigger asChild>
                                                <Button variant="link" className="p-0 h-auto text-blue-600 underline">
                                                    Lihat Bukti Pembayaran
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-3xl">
                                                <DialogHeader>
                                                    <DialogTitle>Bukti Pembayaran</DialogTitle>
                                                </DialogHeader>
                                                <img
                                                    src={`/storage/${pembayaran.bukti_pembayaran}`}
                                                    alt="Bukti Pembayaran"
                                                    className="w-full h-auto rounded-md object-contain max-h-[80vh]"
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Status Konfirmasi</TableCell>
                                    <TableCell className="text-gray-900 capitalize">: {pembayaran.status_konfirmasi}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Status Pembayaran</TableCell>
                                    <TableCell className="text-gray-900 capitalize">: {pembayaran.tagihan.status}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-gray-900">Tanggal Konfirmasi</TableCell>
                                    <TableCell className="text-gray-900 capitalize">: {pembayaran.tanggal_konfirmasi
                                        ? formatTanggalIndonesiaJam(pembayaran.tanggal_konfirmasi)
                                        : '-'}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    {pembayaran.tanggal_konfirmasi ? (
                        <p className="bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow-md border border-green-300">
                            ✅ Pembayaran ini sudah dikonfirmasi !!!
                        </p>
                    ) : (
                        <Button
                            variant="default"
                            onClick={() => updateKonfirmasi(pembayaran.id)}
                        >
                            Konfirmasi Pembayaran ini
                        </Button>
                    )}
                </Card>
            </div>
        </AppLayout >
    )
}

export default Detail
