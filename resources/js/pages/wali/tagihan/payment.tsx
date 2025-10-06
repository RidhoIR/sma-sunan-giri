import { Bank, BankSekolah, BreadcrumbItem, DetailTagihan, Tagihan, WaliBank } from '@/types'
import React, { useState } from 'react'
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, } from '@inertiajs/react';
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
import { BadgeInfoIcon, Info, InfoIcon, Loader2, Printer } from 'lucide-react';
import { DatePicker } from '@/components/date-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pembayaran Wali Murid',
        href: '/wali/pembayaran',
    },
];

interface Props {
    tagihan: Tagihan;
    bank_sekolah: BankSekolah;
    list_bank: BankSekolah[];
    banks: Bank[];
    wali_bank: WaliBank[];
}
const Payment = ({ tagihan, bank_sekolah, list_bank, banks, wali_bank }: Props) => {
    const [open, setOpen] = useState(false);
    const [addNewBank, setAddNewBank] = useState(false); // <-- toggle add new bank
    const today = new Date().toISOString().split('T')[0];


    const { data, errors, setData, post, processing, } = useForm({
        tanggal_pembayaran: today,
        jumlah_pembayaran: '',
        bank_sekolah_id: bank_sekolah.id.toString(), // bank tujuan
        wali_bank_id: '', // bank wali yang sudah ada
        bukti_pembayaran: null,
        // field bank baru
        bank_baru_id: '',
        nama_rekening: '',
        nomor_rekening: '',
        tagihan_id: tagihan.id.toString(),
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
        setData('jumlah_pembayaran', value);
    };

    const optionBankTujuan = list_bank.map((bank) => {
        return {
            value: bank.id.toString(),
            label: bank.nama_bank,
        };
    });

    const optionBankPengirim = banks.map((bank) => {
        return {
            value: bank.id.toString(),
            label: bank.name,
        };
    });

    const optionWaliBank = wali_bank.map((bank) => {
        return {
            value: bank.id.toString(),
            label: bank.nomor_rekening + ' - A.n. ' + bank.nama_rekening,
        };
    })

    const selectedBank = list_bank.find(b => b.id.toString() === data.bank_sekolah_id);


    const [datePembayaran, setDatePembayaran] = useState<Date | null>(new Date());
    const handleDatePembayaranChange = (date: Date | null) => {
        setDatePembayaran(date);
        setData('tanggal_pembayaran', date ? date.toISOString().split('T')[0] : '');
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("wali.pembayaran.store"))
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Pembayaran Wali Murid' />
            <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
                <Card className="bg-white shadow-sm p-4">
                    <h1>ini pembayaran</h1>
                    <form onSubmit={submit} className="">
                        <div className="grid flex-1 auto-rows-min gap-6">
                            <div className='flex gap-2 mb-2'>
                                <InfoIcon /> Informasi Rekening Pengirim
                            </div>
                            <div className='grid bg-gray-200 p-4 gap-4'>
                                {/* checkbox/toggle */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="addNewBank"
                                        checked={addNewBank}
                                        onChange={() => setAddNewBank(!addNewBank)}
                                    />
                                    <label htmlFor="addNewBank" className="text-sm">
                                        Tambah Bank Baru
                                    </label>
                                </div>

                                {/* mode 1: pilih bank lama */}
                                {!addNewBank && (
                                    <div className="grid gap-3">
                                        <Label>Bank Pengirim (sudah terdaftar)</Label>
                                        <Combobox
                                            options={optionWaliBank}
                                            value={data.wali_bank_id}
                                            onValueChange={(value) => setData('wali_bank_id', value)}
                                            placeholder="Pilih bank yang pernah digunakan"
                                            searchPlaceholder="Cari bank..."
                                            emptyText="bank tidak ditemukan."
                                            className="w-full"
                                        />
                                    </div>
                                )}

                                {/* mode 2: input bank baru */}
                                {addNewBank && (
                                    <>
                                        <div className="grid gap-3">
                                            <Label htmlFor="nama_bank_baru">Nama Bank Baru</Label>
                                            <Combobox
                                                options={optionBankPengirim}
                                                value={data.bank_baru_id}
                                                onValueChange={(value) => setData('bank_baru_id', value)}
                                                placeholder="Pilih bank"
                                                searchPlaceholder="Cari bank..."
                                                emptyText="bank tidak ditemukan."
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="nama_pemilik_rekening">Nama Pemilik Rekening</Label>
                                            <Input
                                                id="nama_pemilik_rekening"
                                                value={data.nama_rekening}
                                                onChange={(e) => setData('nama_rekening', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="nomor_rekening_pengirim">Nomor Rekening Pengirim</Label>
                                            <Input
                                                id="nomor_rekening_pengirim"
                                                value={data.nomor_rekening}
                                                onChange={(e) => setData('nomor_rekening', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                <div className='flex gap-2 mb-2'>
                                    <InfoIcon /> Informasi Rekening Tujuan
                                </div>
                                <div className='grid bg-violet-200 p-4 gap-4'>
                                    <div className="grid gap-3">
                                        <Label htmlFor="sheet-demo-bank">Bank Tujuan Pembayaran</Label>
                                        <Combobox
                                            options={optionBankTujuan}
                                            value={data.bank_sekolah_id}
                                            onValueChange={(value) => setData('bank_sekolah_id', value)}
                                            placeholder="Pilih bank"
                                            searchPlaceholder="Cari bank..."
                                            emptyText="bank tidak ditemukan."
                                            className="w-full"
                                        />
                                    </div>
                                    {selectedBank && (
                                        <div className='bg-gray-200 p-4'>
                                            <table className=''>
                                                <tbody>
                                                    <tr>
                                                        <td className='md:w-40 '>Bank Tujuan </td>
                                                        <td className='font-semibold'> : {selectedBank.nama_bank}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Nama Rekening </td>
                                                        <td className='font-semibold'> : {selectedBank.nama_rekening}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>No Rekening </td>
                                                        <td className='font-semibold'> : {selectedBank.nomor_rekening}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className='flex gap-2 mb-2'>
                                    <InfoIcon /> Informasi Pembayaran
                                </div>
                                <div className='grid bg-gray-200 p-4 gap-4'>
                                    <div className="grid gap-3">
                                        <DatePicker
                                            label="Tanggal Pembayaran"
                                            placeholder="Pilih Tanggal"
                                            value={datePembayaran}
                                            onChange={handleDatePembayaranChange}
                                            required
                                            name="due_date"
                                        />
                                        {errors.tanggal_pembayaran && (<p className="text-red-500">{errors.tanggal_pembayaran}</p>)}
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="jumlah_pembayaran">Jumlah Pembayaran<span className='text-red-600'>*</span></Label>
                                        <Input
                                            id="jumlah_pembayaran"
                                            value={formatRupiah(data.jumlah_pembayaran)}
                                            onChange={handleJumlahChange}
                                            required
                                        />
                                        {errors.jumlah_pembayaran && <p className="text-red-600">{errors.jumlah_pembayaran}</p>}
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="bukti_pembayaran">Bukti Pembayaran<span className='text-red-600'>*</span></Label>
                                        <Input
                                            id="bukti_pembayaran"
                                            type='file'
                                            // value={data.bukti_pembayaran}
                                            onChange={(e) => setData('bukti_pembayaran', e.target.files?.[0] ?? null)}
                                            required
                                        />
                                        {errors.bukti_pembayaran && <p className="text-red-600">{errors.bukti_pembayaran}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                        <Button variant="outline">Close</Button>
                    </form>
                </Card>
            </div>
        </AppLayout >
    )
}

export default Payment
