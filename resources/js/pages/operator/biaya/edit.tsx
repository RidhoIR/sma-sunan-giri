import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { Biaya } from '@/types';
import { Loader2, PencilIcon } from 'lucide-react';

interface Props {
    biaya: Biaya;
}

const Edit = ({ biaya }: Props) => {
    const [open, setOpen] = useState(false);
    const { put, data, setData, processing, errors, } = useForm({
        nama: biaya.nama,
        jumlah: biaya.jumlah.toString(),
        tahun_ajaran: biaya.tahun_ajaran,
    });

    useEffect(() => {
        setData({
            nama: biaya.nama,
            jumlah: biaya.jumlah.toString(),
            tahun_ajaran: biaya.tahun_ajaran,
        });
    }, [biaya, setData]);

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
        setData('jumlah', value);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.biaya.update", biaya.id), {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <div>
            {/* Dialog and form for editing biaya */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={"blue"}>
                        <PencilIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Data</DialogTitle>
                        <DialogDescription>
                            Masukkan data yang ingin diubah sesuai dengan form yang ada dibawah ini
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit}>
                        <div className="space-y-4">
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
                                <Label htmlFor="sheet-demo-tahun_ajaran">Tahun Ajaran</Label>
                                <Input
                                    id="sheet-demo-tahun_ajaran"
                                    value={data.tahun_ajaran}
                                    onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                    required
                                />
                                {errors.tahun_ajaran && <p className="text-red-500">{errors.tahun_ajaran}</p>}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="jumlah">Jumlah<span className='text-red-600'>*</span></Label>
                                <Input
                                    id="jumlah"
                                    value={formatRupiah(data.jumlah)}
                                    onChange={handleJumlahChange}
                                    required
                                />
                                {errors.jumlah && <p className="text-red-600">{errors.jumlah}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Save Change'
                                    )}
                                </Button>
                                <Button type="button" onClick={() => setOpen(false)}>Cancel</Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Edit;
