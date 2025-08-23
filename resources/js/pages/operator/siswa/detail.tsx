import { BreadcrumbItem, Siswa, WaliSiswa } from '@/types'
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { UserIcon, Users } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Data Siswa',
        href: '/admin/siswa',
    },
];

interface Props {
    siswa: Siswa;
    wali_siswa: WaliSiswa[];
}
const Detail = ({ siswa, wali_siswa }: Props) => {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={siswa.nama} />
            <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
                <div className='flex justify-between items-center mb-4'>
                    <div>
                        <h1 className='text-2xl font-bold'>Detail Data Siswa</h1>
                        <h2 className='text-sm text-muted-foreground'>Informasi lengkap data siswa berserta wali muridnya</h2>
                    </div>
                </div>
                <Card className="bg-white shadow-sm p-4">
                    <div className='flex items-center gap-2'>
                        <UserIcon />
                        <h1 className='text-xl font-bold capitalize'>Informasi Personal</h1>
                    </div>
                    <div className='flex items-center gap-4 mb-4'>
                        <div>
                            {siswa.foto ? (
                                <img
                                    src={`/storage/${siswa.foto}`}
                                    alt={siswa.nama}
                                    className="w-36 h-40 object-cover rounded-md"
                                />
                            ) : (
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(siswa.nama)}&background=random`}
                                    alt={siswa.nama}
                                    className="w-36 h-40 object-cover rounded-md"
                                />
                            )}
                        </div>
                        <div>
                            <Table className='md:w-xl'>
                                <TableBody>
                                    <TableRow >
                                        <TableCell className="font-medium text-gray-900">NISN</TableCell>
                                        <TableCell className="text-gray-900">: {siswa.nisn}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Nama</TableCell>
                                        <TableCell className="text-gray-900">: {siswa.nama}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Kelas</TableCell>
                                        <TableCell className="text-gray-900">: {siswa.kelas}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Jurusan</TableCell>
                                        <TableCell className="text-gray-900 uppercase">: {siswa.jurusan}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-gray-900">Angkatan</TableCell>
                                        <TableCell className="text-gray-900">: {siswa.angkatan}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Users />
                        <h1 className='text-xl font-bold capitalize'>Data Wali Murid</h1>
                    </div>
                    <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                        <Table className='overflow-x-auto'>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold text-gray-700">No</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Nama</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                                    <TableHead className="font-semibold text-gray-700">No. Telepon</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {wali_siswa.length > 0 ? (
                                    wali_siswa.map((item, index) => (
                                        <TableRow key={index} className="hover:bg-gray-50">
                                            <TableCell className="text-gray-900">{index + 1}</TableCell>
                                            <TableCell className="font-medium text-gray-900">
                                                {item.wali.name}
                                            </TableCell>
                                            <TableCell className="text-gray-900">
                                                {item.wali.email}
                                            </TableCell>
                                            <TableCell className="text-gray-900">
                                                {item.wali.no_hp}
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
        </AppLayout >
    )
}

export default Detail
