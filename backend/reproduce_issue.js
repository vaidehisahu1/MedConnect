import axios from 'axios';

async function testAuth() {
    const baseURL = 'http://localhost:5000/api';
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Testing with email: ${email}`);

    try {
        // 1. Signup
        console.log('--- Registering User ---');
        const registerRes = await axios.post(`${baseURL}/users/signup`, {
            name: 'Test User',
            email,
            password
        });
        console.log('Registration Success:', registerRes.status);

        // 2. Login
        console.log('--- Logging in User ---');
        const loginRes = await axios.post(`${baseURL}/users/login`, {
            email,
            password
        });
        console.log('Login Success:', loginRes.status);
        console.log('Token received:', !!loginRes.data.token);

    } catch (error) {
        console.error('FAILED:', error.response ? error.response.data : error.message);
    }
}

testAuth();
