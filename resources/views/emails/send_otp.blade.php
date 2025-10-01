<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ai-Geeks OTP Verification For Email Change</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="text-align: center; background-color: #acb4b9; padding: 20px;">
            <img src="{{ asset('/assets/images/ai-geeks.png')}}" alt="Ai Geeks Logo" style="width: 100px; height: auto;">
        </div>
        <div style="padding: 30px;">
            <h1 style="font-size: 22px; color: #333; margin-bottom: 20px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; text-align: center;">
                Authorized Email Change OTP Verification
            </h1>
            <p style="font-size: 16px; color: #333;">Hello <strong>{{ $email }}</strong>,</p>
            <p style="font-size: 16px; color: #333; margin-top: 30px;">Your OTP for changing your email is: <strong style="color: #0073e6;">{{ $otp }}</strong></p>
            <p style="font-size: 16px; color: #333;">Thank you for using our application!</p>
            <p style="font-size: 16px; color: #333; margin-top: 30px;">Best regards,</p>
            <p style="font-size: 16px; color: #333; font-weight: bold; margin: 5px 0;">Ai Geeks</p>
            <p style="font-size: 16px; color: #333; font-weight: bold; margin: 0;">The Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #93a5b1;">
            <p style="font-size: 12px; color: #050606;">&copy; 2024 Ai Geeks. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
