import request from 'supertest';
import express from 'express';
const app = express();

app.get('/no-rate-limit', (req, res) => {
    res.send('This route has no rate limiting!');
});

describe('GET /no-rate-limit', () => {
    it('should respond with a message indicating no rate limiting', async () => {
        const response = await request(app).get('/no-rate-limit');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('This route has no rate limiting!');
    });
});
