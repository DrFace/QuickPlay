<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Offer Accepted</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="text-align: center; background-color: #8b9297; padding: 20px;">
            <img src="{{ asset('/assets/images/ai-geeks.png') }}" alt="AI Geeks Logo" style="width: 100px; height: auto;">
        </div>
        <div style="padding: 30px;">
            <h1 style="font-size: 22px; color: #333; margin-bottom: 20px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; text-align: center;">
                Job Offer Accepted by {{ $freelancer_first_name }}
            </h1>
            <p style="font-size: 16px; color: #333;">Hello <strong>{{ $first_name }}</strong>,</p>
            <p style="font-size: 16px; color: #333; margin-top: 30px;">
                We are excited to inform you that <strong>{{ $freelancer_first_name }}</strong> has accepted your job offer for the project
                <strong>{{ $contract_title }}</strong>.
            </p>
            <p style="font-size: 16px; color: #333; margin-top: 20px;">
                The project is now active, and you can communicate with the freelancer to start working together.
            </p>
            <p style="font-size: 16px; color: #333; margin-top: 30px;">Best regards,</p>
            <p style="font-size: 16px; color: #333; font-weight: bold; margin: 5px 0;">The AI Geeks Team</p>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #9fb2bf;">
            <p style="font-size: 12px; color: #0a0a0a;">&copy; 2024 AI Geeks. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
