import { BankSekolah, BreadcrumbItem, DetailTagihan } from '@/types'
import React from 'react'
import AppLayout from '@/layouts/app-layout';
import { Head, Link,} from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { formatRupiah, formatTanggalIndonesiaLengkap } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Tagihan',
        href: '/wali/detail-tagihan',
    },
];

interface Props {
    tagihan_details: DetailTagihan[];
    tagihan_detail: DetailTagihan;
    bank_sekolah: BankSekolah[];
    totalDibayar: number;
    sisaBayar: number;
}
const Detail = ({ tagihan_details, tagihan_detail, bank_sekolah, totalDibayar, sisaBayar }: Props) => {
    // const [open, setOpen] = useState(false);

    // const { data, setData, post, processing, } = useForm({
    //     siswa_id: '',
    //     wali_id: '',
    // });

    // const { delete: destroy, processing: processingDelete } = useForm({});

    // const submit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     post(route("admin.wali.storeWaliSiswa", wali.id))
    // };

    // const destroyWaliSiswa = (id: number) => {
    //     destroy(route("admin.wali.destroyWaliSiswa", id), {
    //         onSuccess: () => {
    //             setOpen(false);
    //         }

    //     });
    // }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Data Wali Murid' />
            <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
                <div className='flex justify-between items-center mb-4'>
                    <div>
                        <h1 className='text-2xl font-bold'>Detail Tagihan</h1>
                        <h2 className='text-sm text-muted-foreground'>Informasi lengkap tagihan siswa</h2>
                    </div>
                </div>
                <Card className="bg-white shadow-sm p-4">
                    <h1 className='text-xl font-bold capitalize'>Tagihan {tagihan_detail.tagihan.siswa.nama}</h1>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex items-center gap-4 mb-4'>
                            {tagihan_detail.tagihan.siswa.foto ? (
                                <img
                                    src={`/storage/${tagihan_detail.tagihan.siswa.foto}`}
                                    alt={tagihan_detail.tagihan.siswa.nama}
                                    className="w-36 h-40 object-cover rounded-md"
                                />
                            ) : (
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(tagihan_detail.tagihan.siswa.nama)}&background=random`}
                                    alt={tagihan_detail.tagihan.siswa.nama}
                                    className="w-36 h-40 object-cover rounded-md"
                                />
                            )}
                            <Table className=''>
                                <TableBody>
                                    <TableRow >
                                        <TableCell className="font-medium text-gray-900">NISN</TableCell>
                                        <TableCell className="text-gray-900">: {tagihan_detail.tagihan.siswa.nisn}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Nama</TableCell>
                                        <TableCell className="text-gray-900">: {tagihan_detail.tagihan.siswa.nama}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Kelas</TableCell>
                                        <TableCell className="text-gray-900">: {tagihan_detail.tagihan.siswa.kelas}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Jurusan</TableCell>
                                        <TableCell className="text-gray-900 uppercase">: {tagihan_detail.tagihan.siswa.jurusan}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Angkatan</TableCell>
                                        <TableCell className="text-gray-900">: {tagihan_detail.tagihan.siswa.angkatan}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div>
                            <Table className=''>
                                <TableBody>
                                    <TableRow >
                                        <TableCell className="font-medium text-gray-900">No. Tagihan</TableCell>
                                        <TableCell className="text-gray-900">: #SSG-{tagihan_detail.tagihan.id}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Tgl. Tagihan</TableCell>
                                        <TableCell className="text-gray-900">: {formatTanggalIndonesiaLengkap(tagihan_detail.tagihan.tanggal_tagihan)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Tgl. Akhir Pembayaran</TableCell>
                                        <TableCell className="text-gray-900">: {formatTanggalIndonesiaLengkap(tagihan_detail.tagihan.tanggal_jatuh_tempo)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Status Pembayaran</TableCell>
                                        <TableCell className="text-gray-900 capitalize">: {tagihan_detail.tagihan.status}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <a href={route('wali.tagihan.invoice', tagihan_detail.tagihan.id)} className='flex items-center '>
                                                <Printer className='mr-2 text-blue-500 w-5 h-5' /> <span className='text-blue-500'>Cetak Invoice Tagihan</span>
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </div>
                    </div>
                    <Table className='overflow-x-auto border'>
                        <TableHeader>
                            <TableRow className="bg-gray-100 font-semibold border-b-2 border-gray-400 ">
                                <TableCell className="font-semibold text-gray-700 uppercase border-e">No</TableCell>
                                <TableCell className="font-semibold text-gray-700 uppercase border-e">Nama tagihan</TableCell>
                                <TableCell className="font-semibold text-gray-700 uppercase text-end w-60">Jumlah Tagihan</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tagihan_details.length > 0 ? (
                                tagihan_details.map((item, index) => (
                                    <TableRow key={index} className="hover:bg-gray-50">
                                        <TableCell className="text-gray-900 border-e">{index + 1}</TableCell>
                                        <TableCell className="font-medium text-gray-900 capitalize border-e">
                                            {item.nama_biaya}
                                        </TableCell>
                                        <TableCell className="text-gray-900 text-end w-60">
                                            {formatRupiah(item.jumlah_biaya)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                                        Belum ada Data Wali Murid
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow className="bg-red-100 font-semibold">
                                <TableCell className="w-12"></TableCell>
                                <TableCell className="font-bold text-red-500 capitalize text-center border-e">Sisa Belum Dibayar</TableCell>
                                <TableCell className="font-bold text-red-500 text-end">
                                    {formatRupiah(sisaBayar)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                        {tagihan_details.length > 0 && (
                            <TableFooter>
                                <TableRow className="bg-gray-100 font-semibold">
                                    <TableCell className="w-12"></TableCell>
                                    <TableCell className="font-bold text-gray-900 capitalize text-center border-e">Total Pembayaran</TableCell>
                                    <TableCell className="font-bold text-gray-900 text-end">
                                        {formatRupiah(tagihan_details.reduce((total, item) => total + item.jumlah_biaya, 0))}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        )}
                        <TableFooter>
                            <TableRow className="bg-green-100 font-semibold">
                                <TableCell className="w-12"></TableCell>
                                <TableCell className="font-bold text-green-700 capitalize text-center border-e">Total Dibayarkan</TableCell>
                                <TableCell className="font-bold text-green-700 text-end">
                                    {formatRupiah(totalDibayar)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                        
                    </Table>
                    
                    <div className='p-4 bg-gray-200'>
                        Pembayaran Bisa dilakukan dengan cara langsung ke Operator sekolah atau di trasnfer melalui rekening dibawah ini.<br />
                        <u><i> Jangan Melakukan transfer ke rekening selain dari rekening dibawah ini.</i></u> <br />
                        Setelah melakukan pembayaran, silahkan upload bukti pembayaran melalui tombol konfirmasi dibawah ini.
                    </div>
                    <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                        {bank_sekolah.map((item, index) => (
                            <div key={index} className='p-4 bg-violet-200 text-violet-700'>
                                <table className='mb-4'>
                                    <tbody>
                                        <tr>
                                            <td className='md:w-40 '>Bank Tujuan </td>
                                            <td className='font-semibold'> : {item.nama_bank}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama Rekening </td>
                                            <td className='font-semibold'> : {item.nama_rekening}</td>
                                        </tr>
                                        <tr>
                                            <td>No Rekening </td>
                                            <td className='font-semibold'> : {item.nomor_rekening}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* Kondisi tombol konfirmasi */}
                                {tagihan_detail.tagihan.status !== "lunas" && (
                                    <Link
                                        href={route("wali.pembayaran.create", {
                                            tagihan_id: tagihan_detail.tagihan.id,
                                            bank_sekolah_id: item.id,
                                        })}
                                    >
                                        <Button variant="default">Konfirmasi Pembayaran</Button>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                    {tagihan_detail.tagihan.status == "lunas" && (
                        <p className="bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow-md border border-green-300">
                            ✅ Pembayaran ini sudah Lunas
                        </p>
                    )}
                </Card>
            </div>
        </AppLayout >
    )
}

export default Detail
