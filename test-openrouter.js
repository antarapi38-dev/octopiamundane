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
