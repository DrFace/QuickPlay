<?php

namespace App\Services\OpenAIServices;

use GuzzleHttp\Client;

class OpenAIService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client;
    }

    public function generateTips($prompt)
    {

        $url = 'https://api.openai.com/v1/chat/completions';
        $headers = [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer '.config('services.openai.secret'),
        ];
        $body = [
            'model' => 'gpt-4o-mini',
            'messages' => [['role' => 'user', 'content' => $prompt]],
        ];
        $response = $this->client->post($url, [
            'headers' => $headers,
            'json' => $body,
        ]);
        $result = json_decode($response->getBody()->getContents(), true);

        if (preg_match('/```json\s*(.*?)\s*```/s', $result['choices'][0]['message']['content'], $matches)) {
            $jsonContent = $matches[1];
        } else {
            $jsonContent = $response;
        }

        $tips = json_decode($jsonContent, true);

        return $tips;

    }
}
