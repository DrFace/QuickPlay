<!DOCTYPE html>
<html>

<head>
    <title>Invoice</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
        }

        .footer {
            font-size: 0.875rem;
            padding: 1rem;
            background-color: rgb(241 245 249);
        }

        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            font-size: 16px;
            line-height: 24px;
            color: #555;
        }

        .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            border-collapse: collapse;
        }

        .invoice-box table td {
            padding: 5px;
            vertical-align: top;
        }

        .invoice-box table tr td:nth-child(2) {
            text-align: center;
        }

        .invoice-box table tr td:nth-child(3) {
            text-align: right;
        }

        .invoice-box table tr.top table td {
            padding-bottom: 20px;
        }

        .invoice-box table tr.top table td.title {
            font-size: 30px;
            line-height: 45px;
            color: #333;
        }

        .invoice-box table tr.information table td {
            padding-bottom: 5px;
        }

        .invoice-box table tr.heading td {
            background: #1582e9;
            border-bottom: 1px solid #1b7bd4;
            font-weight: bold;
            color: #fff;
        }

        .invoice-box table tr.details td {
            padding-bottom: 20px;
        }

        .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
        }

        .invoice-box table tr.item.last td {
            border-bottom: none;
        }

        .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #fcfcfc;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
                <td colspan="3">
                    <table>
                        <tr>

                            <td style="text-align: left;">

                                Created: {{ $payment_date }}<br>
                                Bank: {{ $bank }}<br>
                                Payment Method : {{ $account }}<br>
                                Name: {{ $name }}<br>
                            </td>
                            <td class="title">
                                <h2>Invoice</h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            {{-- <tr class="information">
                <td colspan="3">
                    <table>
                        <tr>
                            <td>
                                <strong>Issuer:</strong><br>
                                {{ $issue_by }}
                            </td>
                            <td style="text-align: right;">
                                <strong>Rate (per 1Kg):</strong><br>
                                Rs. {{ $rate }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr> --}}

            <tr class="heading">
                <td>
                    Create At
                </td>
                <td>
                    Description
                </td>
                <td>
                    Payment
                </td>
            </tr>
            @foreach ($paymentRecords as $record)
                <tr class="item">
                    <td>{{ $record['create_at'] }}</td>
                    <td>{{ $record['description'] }}</td>
                    <td>$ {{ number_format($record['payment'], 2) }}</td>
                </tr>
            @endforeach

            <tr class="total">
                <td></td>
                <td><strong>Total Payment:</strong></td>
                <td><strong>$ {{ number_format($payment_amount, 2) }}</strong></td>
            </tr>
        </table>
    </div>
    <div class="footer margin-top">
        <div>Thank you</div>
        <div>&copy; Ai-geeks</div>
    </div>
</body>

</html>
