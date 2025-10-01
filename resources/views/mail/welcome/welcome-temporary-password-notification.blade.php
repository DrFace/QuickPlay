<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to AI Geeks</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="text-align: center; background-color: #8b9297; padding: 20px;">
            <img src="{{ asset('/assets/images/ai-geeks.png') }}" alt="AI Geeks Logo" style="width: 100px; height: auto;">
        </div>
        <div style="padding: 30px;">
            <h1 style="font-size: 22px; color: #333; margin-bottom: 20px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; text-align: center;">
                Welcome to AI Geeks!
            </h1>
            <p style="font-size: 16px; color: #333;">Hello <strong>{{ $first_name }}</strong>,</p>
            <p style="font-size: 16px; color: #333; margin-top: 30px;">We're excited to have you on board! Please use the temporary password below to access your account:</p>
            <p style="font-size: 18px; color: #333; font-weight: bold; text-align: center; margin: 20px 0;">Temporary Password: <strong>{{ $temporaryPassword }}</strong></p>
            <p style="font-size: 16px; color: #333; margin-top: 20px;">For security purposes, we strongly recommend updating your password immediately after logging in.</p>
            <p style="font-size: 16px; color: #333; margin-top: 30px;">Thank you for choosing AI Geeks! We look forward to supporting your journey.</p>
            <p style="font-size: 16px; color: #333; margin-top: 30px;">Best regards,</p>
            <p style="font-size: 16px; color: #333; font-weight: bold; margin: 5px 0;">The AI Geeks Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #9fb2bf;">
            <p style="font-size: 12px; color: #0a0a0a;">&copy; 2024 AI Geeks. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
