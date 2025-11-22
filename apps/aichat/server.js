const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Get API key from environment variable
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.error('ERROR: OPENROUTER_API_KEY not found in .env file!');
    console.error('Please create a .env file with: OPENROUTER_API_KEY=your-key-here');
    process.exit(1);
}

// Proxy endpoint for OpenRouter API
app.post('/api/chat', async (req, res) => {
    try {
        const { model, messages, max_tokens, temperature } = req.body;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': req.headers.referer || req.headers.origin || 'http://localhost:' + PORT,
                'X-Title': 'Seraph AI Chat'
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: max_tokens || 8192,
                temperature: temperature || 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 AI Chat server running on http://localhost:${PORT}`);
    console.log(`✅ Using API key: ${OPENROUTER_API_KEY.substring(0, 10)}...`);
});

