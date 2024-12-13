const request = require('supertest');
const app = require('./server'); // Import the app
const http = require('http');

let server;
let address;

jest.setTimeout(30000); // Set Jest timeout to 30 seconds

beforeAll((done) => {
    server = http.createServer(app);
    server.listen(0, () => { // Use port 0 for a dynamic port
        address = server.address().port;
        console.log(`Test server started on port ${address}`);
        done();
    });
});

afterAll((done) => {
    server.close((err) => {
        if (err) {
            console.error('Error closing server:', err);
        } else {
            console.log('Test server closed');
        }
        done();
    });
});

test('Express server is listening on a dynamic port', async () => {
    console.log(`Testing server on http://localhost:${address}`);
    const response = await request(`http://localhost:${address}`).get('/');
    console.log(`Received response with status: ${response.status}`);
    expect(response.status).toBe(200); // Expects the default route to respond
});
