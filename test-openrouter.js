async function testOpenRouter() {
    const apiMessages = [
        {
            role: 'user',
            content: 'Jelaskan dasar hukum Faraidh dalam Islam'
        }
    ];

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'AsetSantun'
            },
            body: JSON.stringify({
                model: 'arcee-ai/trinity-large-preview:free',
                messages: apiMessages
            })
        });

        console.log('Status code:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            return;
        }

        const data = await response.json();
        console.log('API Response data:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testOpenRouter();
