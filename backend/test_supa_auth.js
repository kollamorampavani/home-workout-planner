const axios = require('axios');

const testRegistration = async () => {
    try {
        const email = `test_supa_${Date.now()}@example.com`;
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            email,
            password: 'Password123',
            full_name: 'Supa User'
        });
        console.log('Registration Success:', response.data);

        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email,
            password: 'Password123'
        });
        console.log('Login Success:', loginResponse.data);
    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
};

testRegistration();
