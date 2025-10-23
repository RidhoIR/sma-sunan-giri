import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
    flash: {
        success: string;
        error: string;
    };
    siswas: Siswa[];
    wali_siswas: WaliSiswa[];
    tagihans: Tagihan[];
    tagihan_details: DetailTagihan[];
    biayas: Biaya[];
    pembayarans: Pembayaran[];
    banks: Bank[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    no_hp: string;
    akses: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Siswa {
    id: number;
    nama: string;
    nisn: string;
    jurusan: string;
    kelas: string;
    angkatan: string;
    foto: string;
}

export interface WaliSiswa {
    id: number;
    siswa: Siswa;
    wali: User;
    user: User;
}

export interface Biaya {
    id: number;
    nama: string;
    jumlah: number;
    tahun_ajaran: string;
    user: User;
}

export interface Tagihan {
    id: number;
    user: User;
    siswa: Siswa;
    angkatan: string;
    kelas: string;
    tanggal_tagihan: string;
    tanggal_jatuh_tempo: string;
    keterangan: string;
    denda: number;
    status: string;
    details: DetailTagihan[];
    pembayarans: Pembayaran[];
    latest_pembayaran: Pembayaran;
    totalDibayar: number;
    sisaBayar: number;
}

export interface DetailTagihan {
    id: number;
    tagihan: Tagihan;
    nama_biaya: string;
    jumlah_biaya: number;
}

export interface Pembayaran {
    id: number;
    tagihan: Tagihan;
    user: User;
    wali: User;
    wali_bank: WaliBank;
    bank_sekolah: BankSekolah;
    jumlah_dibayar: number;
    metode_pembayaran: string;
    bukti_pembayaran: string;
    status_konfirmasi: string;
    tanggal_konfirmasi: string;
    tanggal_pembayaran: string;
}

export interface BankSekolah {
    id: number;
    kode: string;
    nama_bank: string;
    nama_rekening: string;
    nomor_rekening: string;
}

export interface Bank {
    id: number;
    code: string;
    name: string;
}

export interface WaliBank {
    id: number;
    wali: User;
    kode: string;
    nama_bank: string;
    nama_rekening: string;
    nomor_rekening: string;
}

export type NotificationItem = {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    url: string;
};


