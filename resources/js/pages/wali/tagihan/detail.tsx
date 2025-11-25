import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah, formatTanggalIndonesiaLengkap } from '@/lib/utils';
import { BankSekolah, BreadcrumbItem, DetailTagihan } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const [loading, setLoading] = useState(false);

    const [snapReady, setSnapReady] = useState(false);

    useEffect(() => {
        if (!document.getElementById('snap-midtrans')) {
            const snapScript = document.createElement('script');
            snapScript.id = 'snap-midtrans';
            snapScript.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
            snapScript.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);

            // Tambahkan event listener untuk memastikan script sudah load
            snapScript.onload = () => {
                console.log('Snap script loaded successfully');
                setSnapReady(true);
            };

            snapScript.onerror = () => {
                console.error('Failed to load Snap script');
            };

            document.body.appendChild(snapScript);
        } else {
            // Script sudah ada
            setSnapReady(true);
        }
    }, []);

    const handleBayar = async () => {
        try {
            setLoading(true);

            // 🔥 CEK INI DULU
            console.log('=== DEBUG START ===');
            console.log('Tagihan ID:', tagihan_detail.tagihan.id);
            console.log('Route URL:', route('wali.payment.token', tagihan_detail.tagihan.id));
            console.log('CSRF Token:', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'));
            console.log('Window.snap exists:', !!window.snap);

            const response = await fetch(route('wali.payment.token', tagihan_detail.tagihan.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'include',
                body: JSON.stringify({ tagihan_id: tagihan_detail.tagihan.id }),
            });

            console.log('Response status:', response.status);
            console.log('Response OK:', response.ok);

            // 🔥 CEK RAW RESPONSE
            const rawText = await response.text();
            console.log('Raw response:', rawText);

            let data;
            try {
                data = JSON.parse(rawText);
                console.log('Parsed data:', data);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                alert('Response bukan JSON valid: ' + rawText);
                return;
            }

            const snapToken = data.snapToken;

            if (!snapToken) {
                console.error('❌ Snap token missing!');
                alert('Token tidak ditemukan dalam response');
                return;
            }

            console.log('✅ Snap token received:', snapToken);

            if (window.snap) {
                console.log('✅ Opening Snap popup...');
                window.snap.pay(snapToken, {
                    onSuccess: async (result) => {
                        console.log('Payment success:', result);
                        alert('Pembayaran berhasil!');

                        await fetch(route('wali.payment.callback'), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                            },
                            body: JSON.stringify({
                                order_id: result.order_id,
                                status: result.transaction_status,
                                gross_amount: result.gross_amount,
                            }),
                        });
                        router.reload();
                    },
                    onPending: (result) => {
                        console.log('Payment pending:', result);
                        alert('Menunggu pembayaran...');
                    },
                    onError: (result) => {
                        console.error('Payment error:', result);
                        alert('Pembayaran gagal!');
                    },
                    onClose: () => {
                        console.log('Payment popup closed');
                        alert('Kamu menutup popup tanpa menyelesaikan pembayaran');
                    },
                });
            } else {
                console.error('❌ Window.snap not available!');
                alert('Snap belum siap. Coba refresh halaman.');
            }
        } catch (error) {
            console.error('❌ Error in handleBayar:', error);
            alert('Terjadi kesalahan: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Wali Murid" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Detail Tagihan</h1>
                        <h2 className="text-sm text-muted-foreground">Informasi lengkap tagihan siswa</h2>
                    </div>
                </div>
                <Card className="bg-white p-4 shadow-sm">
                    <h1 className="text-xl font-bold capitalize">Tagihan {tagihan_detail.tagihan.siswa.nama}</h1>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4 flex items-center gap-4">
                            {tagihan_detail.tagihan.siswa.foto ? (
                                <img
                                    src={`/storage/${tagihan_detail.tagihan.siswa.foto}`}
                                    alt={tagihan_detail.tagihan.siswa.nama}
                                    className="h-40 w-36 rounded-md object-cover"
                                />
                            ) : (
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(tagihan_detail.tagihan.siswa.nama)}&background=random`}
                                    alt={tagihan_detail.tagihan.siswa.nama}
                                    className="h-40 w-36 rounded-md object-cover"
                                />
                            )}
                            <Table className="">
                                <TableBody>
                                    <TableRow>
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
                            <Table className="">
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">No. Tagihan</TableCell>
                                        <TableCell className="text-gray-900">: #SSG-{tagihan_detail.tagihan.id}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Tgl. Tagihan</TableCell>
                                        <TableCell className="text-gray-900">
                                            : {formatTanggalIndonesiaLengkap(tagihan_detail.tagihan.tanggal_tagihan)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Tgl. Akhir Pembayaran</TableCell>
                                        <TableCell className="text-gray-900">
                                            : {formatTanggalIndonesiaLengkap(tagihan_detail.tagihan.tanggal_jatuh_tempo)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Status Pembayaran</TableCell>
                                        <TableCell className="text-gray-900 capitalize">: {tagihan_detail.tagihan.status}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <a href={route('wali.tagihan.invoice', tagihan_detail.tagihan.id)} className="flex items-center">
                                                <Printer className="mr-2 h-5 w-5 text-blue-500" />{' '}
                                                <span className="text-blue-500">Cetak Invoice Tagihan</span>
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <Table className="overflow-x-auto border">
                        <TableHeader>
                            <TableRow className="border-b-2 border-gray-400 bg-gray-100 font-semibold">
                                <TableCell className="border-e font-semibold text-gray-700 uppercase">No</TableCell>
                                <TableCell className="border-e font-semibold text-gray-700 uppercase">Nama tagihan</TableCell>
                                <TableCell className="w-60 text-end font-semibold text-gray-700 uppercase">Jumlah Tagihan</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tagihan_details.length > 0 ? (
                                tagihan_details.map((item, index) => (
                                    <TableRow key={index} className="hover:bg-gray-50">
                                        <TableCell className="border-e text-gray-900">{index + 1}</TableCell>
                                        <TableCell className="border-e font-medium text-gray-900 capitalize">{item.nama_biaya}</TableCell>
                                        <TableCell className="w-60 text-end text-gray-900">{formatRupiah(item.jumlah_biaya)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-4 text-center text-gray-500">
                                        Belum ada Data Wali Murid
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow className="bg-red-100 font-semibold">
                                <TableCell className="w-12"></TableCell>
                                <TableCell className="border-e text-center font-bold text-red-500 capitalize">Sisa Belum Dibayar</TableCell>
                                <TableCell className="text-end font-bold text-red-500">{formatRupiah(sisaBayar)}</TableCell>
                            </TableRow>
                        </TableFooter>
                        {tagihan_details.length > 0 && (
                            <TableFooter>
                                <TableRow className="bg-gray-100 font-semibold">
                                    <TableCell className="w-12"></TableCell>
                                    <TableCell className="border-e text-center font-bold text-gray-900 capitalize">Total Pembayaran</TableCell>
                                    <TableCell className="text-end font-bold text-gray-900">
                                        {formatRupiah(tagihan_details.reduce((total, item) => total + item.jumlah_biaya, 0))}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        )}
                        <TableFooter>
                            <TableRow className="bg-green-100 font-semibold">
                                <TableCell className="w-12"></TableCell>
                                <TableCell className="border-e text-center font-bold text-green-700 capitalize">Total Dibayarkan</TableCell>
                                <TableCell className="text-end font-bold text-green-700">{formatRupiah(totalDibayar)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <div className="bg-gray-200 p-4">
                        <h1 className="font-semibold">Pembayaran Otomatis</h1>
                        <p className="mt-2">
                            pembayaran otomatis pihak ketiga, anda akan dikenakan biaya tambahan (biaya admin) sebesar {formatRupiah(4000)}
                        </p>
                        {tagihan_detail.tagihan.status !== 'lunas' && (
                            <div className="mt-2">
                                <Button onClick={handleBayar} disabled={loading || !snapReady || tagihan_detail.tagihan.status === 'lunas'}>
                                    {loading ? 'Memproses...' : !snapReady ? 'Loading...' : 'Bayar Sekarang'}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-200 p-4">
                        Pembayaran Bisa dilakukan dengan cara langsung ke Operator sekolah atau di trasnfer melalui rekening dibawah ini.
                        <br />
                        <u>
                            <i> Jangan Melakukan transfer ke rekening selain dari rekening dibawah ini.</i>
                        </u>{' '}
                        <br />
                        Setelah melakukan pembayaran, silahkan upload bukti pembayaran melalui tombol konfirmasi dibawah ini.
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {bank_sekolah.map((item, index) => (
                            <div key={index} className="bg-violet-200 p-4 text-violet-700">
                                <table className="mb-4">
                                    <tbody>
                                        <tr>
                                            <td className="md:w-40">Bank Tujuan </td>
                                            <td className="font-semibold"> : {item.nama_bank}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama Rekening </td>
                                            <td className="font-semibold"> : {item.nama_rekening}</td>
                                        </tr>
                                        <tr>
                                            <td>No Rekening </td>
                                            <td className="font-semibold"> : {item.nomor_rekening}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* Kondisi tombol konfirmasi */}
                                {tagihan_detail.tagihan.status !== 'lunas' && (
                                    <Link
                                        href={route('wali.pembayaran.create', {
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
                    {tagihan_detail.tagihan.status == 'lunas' && (
                        <p className="rounded-lg border border-green-300 bg-green-100 px-4 py-2 text-green-700 shadow-md">
                            ✅ Pembayaran ini sudah Lunas
                        </p>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
};

export default Detail;
