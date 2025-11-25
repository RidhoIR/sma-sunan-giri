import { DataTable } from '@/components/DataTable';
import { MultiSelect, type Option } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils';
import { Biaya, BreadcrumbItem, Tagihan } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { column } from './column';
// import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/date-picker';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Tagihan',
        href: '/admin/tagihan',
    },
];

interface Props {
    tagihan: Tagihan[];
    filters?: {
        bulan?: string;
        tahun?: string;
    };
    biaya: Biaya[];
    kelas: { kelas: string }[]; // list kelas
}

const Index = ({ tagihan, filters, biaya, kelas }: Props) => {
    // const { biayas } = usePage<SharedData>().props;
    const [open, setOpen] = useState(false);
    const [bulan, setBulan] = useState(filters?.bulan || '');
    const [tahun, setTahun] = useState(filters?.tahun || '');
    const [dateTagihan, setDateTagihan] = useState<Date | null>(null); // untuk menyimpan tanggal
    const bulanOptions = [
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    const handleDateTagihanChange = (date: Date | null) => {
        setDateTagihan(date);
        setData('tanggal_tagihan', date ? date.toISOString().split('T')[0] : '');
    };
    const handleFilter = () => {
        router.get(route('admin.tagihan.index'), { bulan, tahun }, { preserveState: true });
    };

    const handleReset = () => {
        setBulan('');
        setTahun('');
        router.get(route('admin.tagihan.index'), {}, { preserveState: true });
    };

    const tahunOptions = Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: String(year), label: String(year) };
    });

    const [dateTempo, setDateTempo] = useState<Date | null>(null);
    const handleDateTempoChange = (date: Date | null) => {
        setDateTempo(date);
        setData('tanggal_jatuh_tempo', date ? date.toISOString().split('T')[0] : '');
    };

    const { data, setData, post, errors, processing } = useForm({
        biaya_id: [] as string[],
        tanggal_tagihan: '',
        tanggal_jatuh_tempo: '',
        keterangan: '',
        kelas: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.tagihan.store'), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    const BiayaList: Option[] = biaya.map((biaya) => ({
        value: String(biaya.id), // value harus string
        label: `(${biaya.tahun_ajaran}) ${biaya.nama} - ${formatRupiah(biaya.jumlah)}`, // tampilkan nama + harga
    }));

    const [selectedBiaya, setSelectedBiaya] = useState<string[]>([]);
    const [selectedKelas, setSelectedKelas] = useState("");

    const handleBiayaChange = (value: string[]) => {
        setSelectedBiaya(value);
        setData('biaya_id', value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Tagihan" />
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Data Tagihan</h1>
                    <h2 className="text-sm text-muted-foreground">Kelola Data Tagihan</h2>
                </div>
                <Card className="p-4">
                    <div className="flex items-end gap-4">
                        <div className="grid gap-2">
                            <Label>Bulan</Label>
                            <Select value={bulan} onValueChange={setBulan}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bulanOptions.map((b) => (
                                        <SelectItem key={b.value} value={b.value}>
                                            {b.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Tahun</Label>
                            <Select value={tahun} onValueChange={setTahun}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tahunOptions.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleFilter}>Filter</Button>
                        <Button variant={'blue'} onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </Card>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button className="hover:cursor-pointer" variant="default">
                            + Tambah Data
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-auto">
                        <SheetHeader>
                            <SheetTitle>Tambah Data</SheetTitle>
                            <SheetDescription>Masukkan data sesuai dengan form yang ada dibawah ini</SheetDescription>
                        </SheetHeader>
                        <form onSubmit={submit} className="">
                            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                <div className="grid gap-3">
                                    <Label>Pilih Kelas</Label>
                                    <Select
                                        value={selectedKelas}
                                        onValueChange={(value) => {
                                            setSelectedKelas(value);
                                            setData('kelas', value);
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kelas.map((k) => (
                                                <SelectItem key={k.kelas} value={k.kelas}>
                                                    {k.kelas}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kelas && <p className="text-red-500">{errors.kelas}</p>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-demo-biaya">
                                        Biaya Yang Di Tagihkan<span className="ml-1 text-destructive">*</span>
                                    </Label>
                                    <MultiSelect
                                        options={BiayaList}
                                        onValueChange={handleBiayaChange}
                                        defaultValue={selectedBiaya}
                                        placeholder="Pilih Biaya..."
                                        variant="default"
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <DatePicker
                                        label="Tanggal Tagihan"
                                        placeholder="Pilih Tanggal"
                                        value={dateTagihan}
                                        onChange={handleDateTagihanChange}
                                        required
                                        name="due_date"
                                    />
                                    {errors.tanggal_tagihan && <p className="text-red-500">{errors.tanggal_tagihan}</p>}
                                </div>
                                <div className="grid gap-3">
                                    <DatePicker
                                        label="Tanggal Jatuh Tempo"
                                        placeholder="Pilih Tanggal"
                                        value={dateTempo}
                                        onChange={handleDateTempoChange}
                                        required
                                        name="due_date"
                                    />
                                    {errors.tanggal_tagihan && <p className="text-red-500">{errors.tanggal_tagihan}</p>}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-demo-keterangan">Keterangan</Label>
                                    <Textarea
                                        id="sheet-demo-keterangan"
                                        placeholder="Masukkan Keterangan"
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                    />
                                    {errors.keterangan && <p className="text-red-500">{errors.keterangan}</p>}
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
            <Card className="p-4">
                <DataTable data={tagihan} columns={column} />
            </Card>
        </AppLayout>
    );
};

export default Index;
