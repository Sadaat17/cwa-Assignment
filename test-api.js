// Test the game completion API
async function testAPI() {
    try {
        console.log('Testing POST to /api/game-completion...');

        const response = await fetch('http://localhost:3000/api/game-completion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: 'API Test User',
                completionStatus: 'completed',
                timeTaken: 75,
                totalChallenges: 5,
                challengesCompleted: 5,
            }),
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', data);

        if (response.ok) {
            console.log('✅ API POST works!');
        } else {
            console.log('❌ API POST failed:', data);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testAPI();

