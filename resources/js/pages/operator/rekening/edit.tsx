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
import { useForm, usePage } from "@inertiajs/react";
import { BankSekolah, SharedData } from '@/types';
import { Loader2, PencilIcon } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

interface Props {
    bank_sekolah: BankSekolah;
}

const Edit = ({ bank_sekolah}: Props) => {
    const [open, setOpen] = useState(false);
    const {banks} = usePage<SharedData>().props;
    const { put, data, setData, processing, errors, } = useForm({
        nama_rekening: bank_sekolah.nama_rekening,
        nomor_rekening: bank_sekolah.nomor_rekening,
        bank_id: bank_sekolah.kode,
    });

    useEffect(() => {
        setData({
            nama_rekening: bank_sekolah.nama_rekening,
            nomor_rekening: bank_sekolah.nomor_rekening,
            bank_id: bank_sekolah.kode,
        });
    }, [bank_sekolah, setData]);

    const optionBank = banks.map((bank) => {
        return {
            value: bank.code,
            label: bank.name,
        };
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.rekening.update", bank_sekolah.id), {
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
                                <Label htmlFor="sheet-demo-bank">Bank</Label>
                                <Combobox
                                    options={optionBank}
                                    value={data.bank_id}
                                    onValueChange={(value) => setData('bank_id', value)}
                                    placeholder="Pilih bank"
                                    searchPlaceholder="Cari bank..."
                                    emptyText="bank tidak ditemukan."
                                    className="w-full"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-demo-nama">Nama Rekening</Label>
                                <Input
                                    id="sheet-demo-nama"
                                    value={data.nama_rekening}
                                    onChange={(e) => setData('nama_rekening', e.target.value)}
                                    required
                                />
                                {errors.nama_rekening && <p className="text-red-500">{errors.nama_rekening}</p>}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-demo-nomor-rekening">Nomor Rekening</Label>
                                <Input
                                    id="sheet-demo-nomor-rekening"
                                    value={data.nomor_rekening}
                                    onChange={(e) => setData('nomor_rekening', e.target.value)}
                                    required
                                />
                                {errors.nomor_rekening && <p className="text-red-500">{errors.nomor_rekening}</p>}
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
