<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 6px; text-align: left; }
    </style>
</head>
<body>

<h2>Laporan Tagihan</h2>

<table>
    <thead>
        <tr>
            <th>Nama Siswa</th>
            <th>NISN</th>
            <th>Angkatan</th>
            <th>Status</th>
            <th>Total Tagihan</th>
            <th>Tanggal</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($laporanTagihan as $item)
        <tr>
            <td>{{ $item->siswa->nama }}</td>
            <td>{{ $item->siswa->nisn }}</td>
            <td>{{ $item->siswa->angkatan }}</td>
            <td>{{ ucfirst($item->status) }}</td>
            <td>Rp {{ number_format($item->total_tagihan, 0, ',', '.') }}</td>
            <td>{{ $item->created_at->format('d/m/Y') }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

</body>
</html>
