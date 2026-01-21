import express from 'express';
import request from 'supertest';
import router from '../api';
import * as analyzeController from '../../controllers/analyzeController';

// Mock du controller
jest.mock('../../controllers/analyzeController');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('API Routes', () => {
  describe('POST /api/analyze', () => {
    it('should handle image upload', async () => {
      const mockAnalyzeImage = analyzeController.analyzeImage as jest.MockedFunction<
        typeof analyzeController.analyzeImage
      >;

      mockAnalyzeImage.mockImplementation((req, res): any => {
        return res.status(200).json({
          extractedText: 'Test',
          analysis: {
            ingredients: [],
            score: 80,
            grade: 'B',
            positives: [],
            warnings: [],
            recommendations: [],
          },
        });
      });

      const response = await request(app)
        .post('/api/analyze')
        .attach('image', Buffer.from('fake-image'), 'test.jpg');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('extractedText');
      expect(response.body).toHaveProperty('analysis');
    });

    it('should reject requests without image', async () => {
      const mockAnalyzeImage = analyzeController.analyzeImage as jest.MockedFunction<
        typeof analyzeController.analyzeImage
      >;

      mockAnalyzeImage.mockImplementation((req, res): any => {
        return res.status(400).json({ error: 'Aucun fichier image reçu.' });
      });

      const response = await request(app).post('/api/analyze');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
