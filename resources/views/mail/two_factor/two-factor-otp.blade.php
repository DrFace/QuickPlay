<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ai-Geeks Two-Factor Authentication OTP</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="text-align: center; background-color: #8b9297; padding: 20px;">
            <img src="{{ asset('/assets/images/ai-geeks.png') }}" alt="Ai Geeks Logo" style="width: 100px; height: auto;">
        </div>
        <div style="padding: 30px;">
            <h1 style="font-size: 22px; color: #333; margin-bottom: 20px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; text-align: center;">
                Two-Factor Authentication (2FA) OTP Code
            </h1>
            <p style="font-size: 16px; color: #333;">Hello <strong>{{ $first_name }}</strong>,</p>
            <p style="font-size: 16px; color: #333; margin-top: 30px;">We have received a Two-Factor Authentication (2FA) for your account.</p>
            <p style="font-size: 16px; color: #333; margin-top: 20px;">To complete this process, please use the following OTP code for verification:</p>
            <p style="font-size: 18px; color: #333; font-weight: bold; text-align: center; margin: 20px 0;">Code : <strong>{{ $otp }}</strong></p>
            <p style="font-size: 16px; color: #333; margin-top: 20px;">If you did not request to enable 2FA, please contact our support team immediately to secure your account.</p>
            <p style="font-size: 16px; color: #333; margin-top: 30px;">Thank you for using Ai-Geeks!</p>
            <p style="font-size: 16px; color: #333; margin-top: 30px;">Best regards,</p>
            <p style="font-size: 16px; color: #333; font-weight: bold; margin: 5px 0;">Ai Geeks</p>
            <p style="font-size: 16px; color: #333; font-weight: bold; margin: 0;">The Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #9fb2bf;">
            <p style="font-size: 12px; color: #0a0a0a;">&copy; 2024 Ai Geeks. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
