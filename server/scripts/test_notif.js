
import fetch from 'node-fetch';

async function testNotifications() {
    try {
        const res = await fetch('http://localhost:5050/api/notifications?userId=3');
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Data:', data);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

testNotifications();
