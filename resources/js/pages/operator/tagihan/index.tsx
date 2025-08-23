import { DataTable } from '@/components/DataTable';
import { BreadcrumbItem, SharedData, Tagihan } from '@/types'
import React, { useState } from 'react'
import { column } from './column';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
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
import { Loader2 } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { MultiSelect, type Option } from "@/components/multi-select"
// import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/date-picker';




const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Tagihan',
        href: '/admin/tagihan',
    },
];

interface Props {
    tagihan: Tagihan[];
}



const Index = ({ tagihan }: Props) => {

    const { biayas } = usePage<SharedData>().props;
    const [open, setOpen] = useState(false);

    // const [openDatePicker, setOpenDatePicker] = useState(false);
    const [dateTagihan, setDateTagihan] = useState<Date | null>(null); // untuk menyimpan tanggal
    const handleDateTagihanChange = (date: Date | null) => {
        setDateTagihan(date);
        setData('tanggal_tagihan', date ? date.toISOString().split('T')[0] : '');
    }

    // const [openDateTempo, setOpenDateTempo] = useState(false);
    const [dateTempo, setDateTempo] = useState<Date | null>(null);
    const handleDateTempoChange = (date: Date | null) => {
        setDateTempo(date);
        setData('tanggal_jatuh_tempo', date ? date.toISOString().split('T')[0] : '');
    }



    const { data, setData, post, errors, processing } = useForm({
        biaya_id: [] as string[],
        tanggal_tagihan: '',
        tanggal_jatuh_tempo: '',
        keterangan: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.tagihan.store'), {
            onSuccess: () => {
                setOpen(false);
            }
        });

    };

    const BiayaList: Option[] = biayas.map((biaya) => ({
        value: String(biaya.id), // value harus string
        label: `${biaya.nama} - ${formatRupiah(biaya.jumlah)}`, // tampilkan nama + harga
    }));

    const [selectedBiaya, setSelectedBiaya] = useState<string[]>([]);

    const handleBiayaChange = (value: string[]) => {
        setSelectedBiaya(value);
        setData('biaya_id', value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Data Tagihan' />
            <div className='flex justify-between items-center mb-4'>
                <div>
                    <h1 className='text-2xl font-bold'>Data Tagihan</h1>
                    <h2 className='text-sm text-muted-foreground'>Kelola Data Tagihan</h2>
                </div>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button className='hover:cursor-pointer' variant="default">+ Tambah Data</Button>
                    </SheetTrigger>
                    <SheetContent className='overflow-auto'>
                        <SheetHeader>
                            <SheetTitle>Tambah Data</SheetTitle>
                            <SheetDescription>
                                Masukkan data sesuai dengan form yang ada dibawah ini
                            </SheetDescription>
                        </SheetHeader>
                        <form onSubmit={submit} className="">
                            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                <div className='grid gap-3'>
                                    <Label htmlFor="sheet-demo-biaya">Biaya Yang Di Tagihkan<span className="text-destructive ml-1">*</span></Label>
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
                                    {errors.tanggal_tagihan && (<p className="text-red-500">{errors.tanggal_tagihan}</p>)}
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
                                    {errors.tanggal_tagihan && (<p className="text-red-500">{errors.tanggal_tagihan}</p>)}
                                </div>
                                <div className='grid gap-3'>
                                    <Label htmlFor='sheet-demo-keterangan'>Keterangan</Label>
                                    <Textarea
                                        id='sheet-demo-keterangan'
                                        placeholder='Masukkan Keterangan'
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                    />
                                    {errors.keterangan && (
                                        <p className="text-red-500">{errors.keterangan}</p>)}
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
                <DataTable data={tagihan} columns={column} />
            </Card>
        </AppLayout >
    )
}

export default Index
