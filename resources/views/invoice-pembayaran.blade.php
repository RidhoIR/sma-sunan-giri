<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Kwitansi Pembayaran</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        .title {
            text-align: center;
            margin-bottom: 20px;
        }

        .header {
            margin-bottom: 20px;
            width: 100%;
        }


        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table th {
            padding: 6px;
            text-align: left;
            text-color: blue;
        }

        .table td {
            padding: 6px;
            border-top: 1px solid black;
        }

        .right {
            text-align: right;
        }
    </style>
</head>

<body>
    <div class="title">
        <h2>KWITANSI PEMBAYARAN</h2>
    </div>

    <div class="header">
        <table>
            <tr>
                <td>Pembayaran ID</td>
                <td>: {{ '#SSG-' . $pembayaran->id ?? '' }}</td>
            </tr>
            <tr>
                <td>Telah Terima Dari</td>
                <td>: {{ $pembayaran->wali->name }}</td>
            </tr>
            <tr>
                <td>Uang Sejumlah</td>
                <td style="font-style: italic">: {{ $terbilang }}</td>
            </tr>
            <tr>
                <td>Untuk Pembayaran</td>
                <td>: Tagihan Bulan
                    {{ \Carbon\Carbon::parse($pembayaran->tagihan->tanggal_tagihan)->translatedFormat('F') }}</td>
            </tr>
        </table>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Tanggal Pembayaran</th>
                <th>Jumlah Dibayar</th>
                <th>Metode</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td> {{ \Carbon\Carbon::parse($pembayaran->tanggal_pembayaran)->format('d/m/Y') }}</td>
                <td> Rp {{ number_format($pembayaran->jumlah_dibayar, 0, ',', '.') }}</td>
                <td> {{ $pembayaran->metode_pembayaran }}</td>
            </tr>
        </tbody>
    </table>

    <br><br>
    <div class="right">
        <p>Gresik, {{ \Carbon\Carbon::parse($pembayaran->tanggal_pembayaran)->translatedFormat('d F Y') }}</p>
        <br><br>
        <p>Operator {{ $pembayaran->user->name }}</p>
    </div>
</body>

</html>
