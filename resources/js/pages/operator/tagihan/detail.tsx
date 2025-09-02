import { BreadcrumbItem, DetailTagihan, Pembayaran } from '@/types'
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { File, Loader2, Printer, UserIcon } from 'lucide-react';
import { formatRupiah, formatTanggalIndonesia, formatTanggalIndonesiaLengkap, InputformatRupiah } from '@/lib/utils';
import { useState } from 'react';
import { DatePicker } from '@/components/date-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Data Tagihan',
        href: '/admin/tagihan',
    },
];

interface Props {
    tagihan_detail: DetailTagihan;
    tagihan_details: DetailTagihan[];
    pembayaran: Pembayaran[];
}
const Detail = ({ tagihan_detail, tagihan_details, pembayaran }: Props) => {

    const { data, setData, post, reset, errors, processing } = useForm({
        tagihan_id: tagihan_detail.tagihan.id,
        tanggal_pembayaran: '',
        jumlah_dibayar: '',
    });

    const [date, setDate] = useState<Date | null>(null);
    const handleDateChange = (date: Date | null) => {
        setDate(date);
        setData('tanggal_pembayaran', date ? date.toISOString().split('T')[0] : '');
    }

    // const formatRupiah = (value: string) => {
    //     const numberString = value.replace(/[^,\d]/g, '').toString();
    //     const split = numberString.split(',');
    //     const sisa = split[0].length % 3;
    //     let rupiah = split[0].substr(0, sisa);
    //     const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    //     if (ribuan) {
    //         const separator = sisa ? '.' : '';
    //         rupiah += separator + ribuan.join('.');
    //     }

    //     return rupiah ? `Rp. ${rupiah}` : 'Rp. ';
    // };

    const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('jumlah_dibayar', value);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.pembayaran.store'), {
            onSuccess: () => {
                reset();
            }
        });

    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Tagihan ' + tagihan_detail.tagihan.siswa.nama} />
            <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
                <div className='flex justify-between items-center mb-4'>
                    <div>
                        <h1 className='text-2xl font-bold'>Detail Data Tagihan</h1>
                        <h2 className='text-sm text-muted-foreground'>Informasi lengkap detail data tagihan</h2>
                    </div>
                </div>
                <Card className="bg-white shadow-sm p-4 mb-4">
                    <div className='flex items-center justify-between gap-2'>
                        <div className='flex items-center gap-2'>
                            <UserIcon />
                            <h1 className='text-xl font-bold capitalize'>Informasi Personal</h1>
                        </div>
                        <div>
                            <Link href={route('admin.tagihan.cetakSPP', tagihan_detail.tagihan.siswa.id)}
                                onClick={() => window.open(route('admin.tagihan.cetakSPP', tagihan_detail.tagihan.siswa.id), '_blank')}>
                                <Button>
                                    <File />Kartu SPP
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 mb-4'>
                        <div>
                            {tagihan_detail.tagihan.siswa.foto ? (
                                <img
                                    src={`/storage/${tagihan_detail.tagihan.siswa.foto}`}
                                    alt={tagihan_detail.tagihan.siswa.foto}
                                    className="w-36 h-40 object-cover rounded-md"
                                />
                            ) : (
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(tagihan_detail.tagihan.siswa.foto)}&background=random`}
                                    alt={tagihan_detail.tagihan.siswa.foto}
                                    className="w-36 h-40 object-cover rounded-md"
                                />
                            )}
                        </div>
                        <div>
                            <Table className='md:w-xl'>
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
                    </div>
                </Card>
                <div className='flex gap-4 w-full'>
                    <div className='flex-1'>
                        <Card className='bg-white shadow-sm p-4 h-auto'>
                            <div className='flex items-center gap-2'>
                                <h1 className='text-md font-bold capitalize'>Data Tagihan {formatTanggalIndonesiaLengkap(tagihan_detail.tagihan.tanggal_tagihan)}</h1>
                            </div>
                            <div className="overflow-x-auto overflow-y-auto border rounded-xl">
                                <Table className='overflow-x-auto'>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="font-semibold text-gray-700">No</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Nama</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Jumlah</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tagihan_details.length > 0 ? (
                                            tagihan_details.map((item, index) => (
                                                <TableRow key={index} className="hover:bg-gray-50">
                                                    <TableCell className="text-gray-900">{index + 1}</TableCell>
                                                    <TableCell className="font-medium text-gray-900 capitalize">
                                                        {item.nama_biaya}
                                                    </TableCell>
                                                    <TableCell className="text-gray-900">
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
                                </Table>
                            </div>
                        </Card>
                    </div>
                    <div className='flex-1'>
                        <Card className='bg-white shadow-sm p-4'>
                            <div className='flex items-center gap-2'>
                                <h1 className='text-md font-bold capitalize'>Data Pembayaran</h1>
                            </div>
                            <div className="overflow-x-auto overflow-y-auto border rounded-xl">
                                <Table className='overflow-x-auto'>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="font-semibold text-gray-700">No</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Tanggal</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Jumlah</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pembayaran.length > 0 ? (
                                            <>
                                                {pembayaran.map((item, index) => (
                                                    <TableRow key={index} className="hover:bg-gray-50">
                                                        <TableCell className="text-gray-900">
                                                            <Link href={route('admin.pembayaran.cetakInvoice', item.id)}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    window.open(route('admin.pembayaran.cetakInvoice', item.id), '_blank');
                                                                }}>
                                                                <Printer size={16} className='text-blue-600' />
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className="font-medium text-gray-900 capitalize">
                                                            {formatTanggalIndonesia(item.tanggal_pembayaran)}
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            {formatRupiah(item.jumlah_dibayar)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                                {/* Tambahan baris total */}
                                                <TableRow className="bg-gray-100 font-bold">
                                                    <TableCell colSpan={2} className=" text-gray-900">
                                                        Total Pembayaran
                                                    </TableCell>
                                                    <TableCell className="text-gray-900">
                                                        {formatRupiah(
                                                            pembayaran.reduce((acc, curr) => acc + curr.jumlah_dibayar, 0)
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                                                    Belum ada Pembayaran
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>

                                </Table>
                            </div>
                            <div>
                                <h1 className='text-md font-bold capitalize'>Form Pembayaran</h1>
                            </div>
                            <form className='space-y-4' onSubmit={submit}>
                                <div className="grid gap-3 ">
                                    <DatePicker
                                        label="Tanggal Pembayaran"
                                        placeholder="Pilih Tanggal"
                                        value={date}
                                        onChange={handleDateChange}
                                        required
                                        name="due_date"
                                    />
                                    {errors.tanggal_pembayaran && (<p className="text-red-500">{errors.tanggal_pembayaran}</p>)}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="jumlah">Jumlah<span className='text-red-600'>*</span></Label>
                                    <Input
                                        id="jumlah"
                                        value={InputformatRupiah(data.jumlah_dibayar)}
                                        onChange={handleJumlahChange}
                                        required
                                    />
                                    {errors.jumlah_dibayar && <p className="text-red-600">{errors.jumlah_dibayar}</p>}
                                </div>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Simpan
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout >
    )
}

export default Detail
