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
import { Siswa } from '@/types';
import { Loader2, PencilIcon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Props {
    siswa: Siswa;
}

const Edit = ({ siswa }: Props) => {
    const [open, setOpen] = useState(false);

    // Ikuti pattern yang sama dengan Anggaran - gunakan destructuring yang sama
    const { data, setData, post, errors, processing } = useForm<{
        nama: string;
        nisn: string;
        kelas: string;
        jurusan: string;
        angkatan: string;
        foto: File | null;
    }>({
        nama: siswa.nama,
        nisn: siswa.nisn,
        kelas: siswa.kelas,
        jurusan: siswa.jurusan,
        angkatan: siswa.angkatan,
        foto: null,
    });

    useEffect(() => {
        setData({
            nama: siswa.nama,
            nisn: siswa.nisn,
            kelas: siswa.kelas,
            jurusan: siswa.jurusan,
            angkatan: siswa.angkatan,
            foto: null,
        });
    }, [siswa, setData]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("admin.siswa.update", siswa.id), {
            forceFormData: true,
            onSuccess: () => setOpen(false),
            onError: (errors) => console.log("Form submission errors:", errors),
            preserveScroll: true,
        });
    };

    return (
        <div>
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
                            <div>
                                <Label htmlFor="nama">Nama</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    required
                                />
                                {errors.nama && <p className="text-red-500">{errors.nama}</p>}
                            </div>
                            <div>
                                <Label htmlFor="nisn">NISN</Label>
                                <Input
                                    id="nisn"
                                    value={data.nisn}
                                    onChange={(e) => setData('nisn', e.target.value)}
                                    required
                                />
                                {errors.nisn && <p className="text-red-500">{errors.nisn}</p>}
                            </div>
                            <div>
                                <Label htmlFor="jurusan">Jurusan</Label>
                                <Select
                                    value={data.jurusan}
                                    onValueChange={(value) => setData('jurusan', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih jurusan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ipa">IPA</SelectItem>
                                        <SelectItem value="ips">IPS</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jurusan && <p className="text-red-600">{errors.jurusan}</p>}
                            </div>
                            <div>
                                <Label htmlFor="kelas">Kelas</Label>
                                <Select
                                    value={data.kelas}
                                    onValueChange={(value) => setData('kelas', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="11">11</SelectItem>
                                        <SelectItem value="12">12</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.kelas && <p className="text-red-600">{errors.kelas}</p>}
                            </div>
                            <div>
                                <Label htmlFor="angkatan">Angkatan</Label>
                                <Input
                                    id="angkatan"
                                    value={data.angkatan}
                                    onChange={(e) => setData('angkatan', e.target.value)}
                                    required
                                />
                                {errors.angkatan && <p className="text-red-500">{errors.angkatan}</p>}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="foto">Foto</Label>
                                <Input
                                    id="foto"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData("foto", e.target.files?.[0] || null)}
                                />
                                {errors.foto && <p className="text-red-500">{errors.foto}</p>}
                                {/* Tampilkan foto lama */}
                                {siswa.foto && (
                                    <img
                                        src={`/storage/${siswa.foto}`}
                                        alt="Foto lama"
                                        className="mt-2 h-16 rounded"
                                    />
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Save Changes'
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