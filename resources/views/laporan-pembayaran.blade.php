<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        table,
        th,
        td {
            border: 1px solid #000;
        }

        th,
        td {
            padding: 6px;
            text-align: left;
        }
    </style>
</head>

<body>

    <h2>Laporan Pembayaran</h2>

    <table>
        <thead>
            <tr>
                <th>NISN</th>
                <th>Nama Siswa</th>
                <th>Angkatan</th>
                <th>Tanggal Pembayaran</th>
                <th>Metode Pembayaran</th>
                <th>Status</th>
                <th>Tanggal Pembayaran</th>
                <th>Jumlah</th>
            </tr>
        </thead>
        <tbody>
            @if ($laporanPembayaran->isEmpty())
                <tr>
                    <td colspan="8" style="text-align:center;">
                        Tidak Ada Data
                    </td>
                </tr>
            @else
                @foreach ($laporanPembayaran as $item)
                    <tr>
                        <td>{{ $item->tagihan->siswa->nisn }}</td>
                        <td>{{ $item->tagihan->siswa->nama }}</td>
                        <td>{{ $item->tagihan->siswa->angkatan }}</td>
                        <td>{{ $item->tanggal_pembayaran }}</td>
                        <td>{{ $item->metode_pembayaran }}</td>
                        <td>{{ $item->tanggal_konfirmasi ? 'Sudah Dikonfirmasi' : 'Belum Dikonfirmasi' }}</td>
                        <td>{{ $item->tanggal_konfirmasi }}</td>
                        <td>Rp {{ number_format($item->jumlah_dibayar, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
        </tbody>
    </table>
    @endif

</body>

</html>
