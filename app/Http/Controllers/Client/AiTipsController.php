<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Services\OpenAIServices\OpenAIService;

class AiTipsController extends Controller
{
    protected $openAIService;

    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }

    public function getTips($description)
    {
        $prompt = 'Provide only 4 tips in json array [ tips, explanation ] without any other text for improving this project description: '.$description;

        $tips = $this->openAIService->generateTips($prompt);

        return response()->json(
            [
                'tips' => $tips,
            ],
            200
        );
    }
}
