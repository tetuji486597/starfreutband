require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Log environment
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', port);
console.log('Stripe key configured:', !!process.env.STRIPE_SECRET_KEY);

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://starfreut.com', 'https://www.starfreut.com']
        : '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Request headers:', req.headers);
    next();
});

// Add a simple test endpoint
app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ status: 'ok', message: 'Node.js server is running', env: process.env.NODE_ENV });
});

// Create a checkout session
app.post('/api/create-checkout-session', async (req, res) => {
    console.log('Received checkout request:', req.body);
    const { priceId } = req.body;

    if (!priceId) {
        console.error('No priceId provided in request');
        return res.status(400).json({ error: 'Price ID is required' });
    }

    try {
        console.log('Creating checkout session for price:', priceId);
        
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://starfreut.com'
            : req.headers.origin;
            
        console.log('Using base URL:', baseUrl);
            
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${baseUrl}/success.html`,
            cancel_url: `${baseUrl}/merch.html`,
        });

        console.log('Checkout session created:', session.id);
        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ 
            error: error.message,
            type: error.type,
            code: error.code
        });
    }
});

// Also keep the original endpoint for backward compatibility
app.post('/create-checkout-session', async (req, res) => {
    console.log('Original endpoint hit, redirecting to /api/create-checkout-session');
    req.url = '/api/create-checkout-session';
    app._router.handle(req, res);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Server URL:', process.env.NODE_ENV === 'production' ? 'https://starfreut.com' : `http://localhost:${port}`);
}); 