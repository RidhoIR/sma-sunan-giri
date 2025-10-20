<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Invoice Tagihan</title>
    <style>
        body {
            font-size: 14px;
            color: #000;
            margin: 0;
            padding: 0;
        }

        .kop {
            width: 100%;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            margin-bottom: 10px;
        }

        .kop td {
            vertical-align: middle;
            text-align: center;
            border: none;
            /* padding-right: 0; */
        }

        .kop img {
            width: 70px;
            height: auto;
        }

        .kop .text h2 {
            margin: 0;
            font-size: 20px;
            padding: 0;
        }

        .kop .text p {
            margin: 0;
            font-size: 13px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            padding: 6px;
            border: 1px solid black;
            text-align: left;
        }

        th {
            background: #cacaca;
        }

        .no-border td {
            border: none;
            /* border: 1px solid #000; */
        }

        .right {
            text-align: right;
        }

        .footer {
            margin-top: 40px;
            text-align: right;
            font-size: 14px;
        }
    </style>
</head>

<body>
    {{-- === HEADER === --}}
    <table class="kop">
        <tr>
            {{-- Kolom Logo --}}
            <td style="width: 60px; text-align:center; vertical-align: middle;">
                <img src="{{ public_path('sma.png') }}" alt="Logo Sekolah" style="width:65px; height:auto;">
            </td>

            {{-- Kolom Teks --}}
            <td style="text-align:left; vertical-align: middle; padding-left: 10px;">
                <h2 style="margin:0; font-size:18px;"><strong>SMA SUNAN GIRI GRESIK</strong></h2>
                <p style="margin:0; font-size:13px;">Jalan Menganti</p>
            </td>
        </tr>
    </table>


    {{-- === INFORMASI TAGIHAN === --}}
    <table class="no-border">
        <tr>
            <td><strong>Nama :</strong> {{ $tagihan_detail->tagihan->siswa->nama }}
                ({{ $tagihan_detail->tagihan->siswa->nisn }})</td>
            <td class="right"><strong>Invoice :</strong> #{{ $tagihan_detail->tagihan->id }}</td>
        </tr>
        <tr>
            <td><strong>Kelas :</strong> {{ $tagihan_detail->tagihan->siswa->kelas }}</td>
            <td class="right"><strong>Tagihan :</strong>
                {{ \Carbon\Carbon::parse($tagihan_detail->tagihan->tanggal_tagihan)->translatedFormat('d F Y') }}</td>
        </tr>
        <tr>
            <td><strong>Jurusan :</strong> {{ $tagihan_detail->tagihan->siswa->jurusan }}</td>
            <td class="right"><strong>Tenggat :</strong>
                {{ \Carbon\Carbon::parse($tagihan_detail->tagihan->tanggal_jatuh_tempo)->translatedFormat('d F Y') }}
            </td>
        </tr>
    </table>

    {{-- === DETAIL TAGIHAN === --}}
    <table>
        <thead>
            <tr>
                <th style="width: 5%">No</th>
                <th>Item Tagihan</th>
                <th class="right" style="width: 30%">Sub-total</th>
            </tr>
        </thead>
        <tbody>
            @php
                $no = 1;
                $total = 0;
            @endphp
            @foreach ($tagihan_details as $detail)
                <tr>
                    <td>{{ $no++ }}</td>
                    <td>{{ $detail->nama_biaya }}</td>
                    <td class="right">Rp. {{ number_format($detail->jumlah_biaya, 0, ',', '.') }}</td>
                </tr>
                @php $total += $detail->jumlah_biaya; @endphp
            @endforeach
            <tr style="background: #cacaca">
                <td colspan="2" class="right"><strong>TOTAL</strong></td>
                <td class="right"><strong>Rp. {{ number_format($total, 0, ',', '.') }}</strong></td>
            </tr>
        </tbody>
    </table>

    {{-- === FOOTER === --}}
    <div class="footer">
        <p>Gresik, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</p>
        <p>Mengetahui,</p>
        <br><br>
        <p><strong>Operator</strong></p>
    </div>
</body>

</html>
