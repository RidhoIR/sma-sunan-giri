<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Kartu SPP</title>
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
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            /* border: 1px solid black; */
        }

        .table th {
            padding: 6px;
            text-align: left;
            text-color: blue;
            border: 1px solid black;
        }

        .table td {
            padding: 6px;
            border: 1px solid black;
            text-align: start;
        }

        .table td ul {
            margin: 0;
            padding-left: 15px;
            /* bisa diganti 0 kalau mau benar-benar mepet */
        }

        .right {
            text-align: right;
        }
    </style>
</head>

<body>
    <div class="title">
        <h2>Kartu SPP</h2>
    </div>

    <div class="header">
        <table>
            <tr>
                <td>Nama Siswa</td>
                <td>: {{ $siswa->nama }}</td>
            </tr>
        </table>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Tanggal Tagihan</th>
                <th>Item Tagihan</th>
                <th>Total</th>
                <th>Paraf</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($tagihan as $item)
                <tr>
                    <td> {{ \Carbon\Carbon::parse($item->tanggal_tagihan)->translatedFormat('F Y') }}</td>
                    <td>
                        <ul>
                            @foreach ($item->details as $itemDetails)
                                <li>
                                    {{ $itemDetails->nama_biaya }}
                                    ({{ number_format($itemDetails->jumlah_biaya, 0, ',', '.') }})
                                </li>
                            @endforeach
                        </ul>
                    </td>
                    <td> Rp {{ number_format($item->details->sum('jumlah_biaya'), 0, ',', '.') }}</td>
                    <td></td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- <br><br>
    <div class="right">
        <p>Gresik, {{ \Carbon\Carbon::parse($pembayaran->tanggal_pembayaran)->translatedFormat('d F Y') }}</p>
        <br><br>
        <p>Operator {{ $pembayaran->user->name }}</p>
    </div> --}}
</body>

</html>
