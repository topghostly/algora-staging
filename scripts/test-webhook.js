const crypto = require('crypto');
const http = require('http');

// Configuration
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_live_8531ec563515d77d66bbad5f8d3798a43281be24'; // Use env var or fallback for testing
const PLAN_CODE_BASIC = process.env.NEXT_PUBLIC_PAYSTACK_PLAN_BASIC || 'PLN_j21wywwc8o33oxc';
const EMAIL = 'paystack_test_123@example.com';

// Payload
const payload = {
    event: 'charge.success',
    data: {
        id: 123456789,
        domain: 'live',
        status: 'success',
        reference: 'test_ref_' + Date.now(),
        amount: 200000,
        message: null,
        gateway_response: 'Successful',
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        channel: 'card',
        currency: 'NGN',
        ip_address: '127.0.0.1',
        metadata: {},
        fees: 100,
        customer: {
            id: 987654321,
            first_name: 'Paystack',
            last_name: 'Tester',
            email: EMAIL,
            customer_code: 'CUS_xxxxxxxx',
            phone: '',
            metadata: {},
            risk_action: 'default'
        },
        plan: {
            id: 111,
            name: 'Basic',
            plan_code: PLAN_CODE_BASIC,
            description: 'Basic Plan',
            amount: 200000,
            interval: 'monthly',
            send_invoices: true,
            send_sms: true,
            currency: 'NGN'
        },
        subscription_code: 'SUB_test123456'
    }
};

// Calculate Signature
const body = JSON.stringify(payload);
const signature = crypto.createHmac('sha512', SECRET_KEY)
    .update(body)
    .digest('hex');

// Send Request
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/paystack/webhook',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-paystack-signature': signature,
        'Content-Length': body.length
    }
};

const req = http.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(body);
req.end();
