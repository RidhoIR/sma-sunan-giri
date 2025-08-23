import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { id } from "date-fns/locale";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

export function formatTanggalIndonesia(dateString: string) {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy", { locale: id });
}

export function formatTanggalIndonesiaLengkap(dateString: string) {
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy", { locale: id });
}

export function InputformatRupiah(value: string) {
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
