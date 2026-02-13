const fetch = require('node-fetch');

async function testSessionApi() {
    console.log("Testing Session API...");
    try {
        // Note: This might fail if auth is required, but we check if the endpoint is reachable
        const res = await fetch('http://localhost:3000/api/session');
        const status = res.status;
        console.log(`API Status: ${status}`);
        
        if (status === 401) {
            console.log("✅ API is protected by Auth (Expected).");
        } else if (status === 200) {
            const data = await res.json();
            console.log("✅ API is reachable. Data:", data);
        } else {
            console.log(`❌ API returned unexpected status: ${status}`);
        }
    } catch (err) {
        console.error("❌ Failed to reach API:", err.message);
    }
}

testSessionApi();
