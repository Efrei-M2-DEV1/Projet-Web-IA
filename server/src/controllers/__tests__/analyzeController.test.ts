import { Request, Response } from 'express';
import fs from 'fs';
import { analyzeImage } from '../analyzeController';

// Mocks
jest.mock('fs');
jest.mock('../../services/mistralService', () => ({
  analyzeImageService: jest.fn(),
}));

const mistralService = require('../../services/mistralService');

describe('AnalyzeController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    jest.clearAllMocks();
  });

  describe('analyzeImage', () => {
    it('should return 400 if no file is provided', async () => {
      mockRequest = {
        file: undefined,
      };

      await analyzeImage(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Aucun fichier image reçu.',
      });
    });

    it('should successfully analyze an image', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/tmp/test.jpg',
      };

      const mockAnalysisResult = {
        extractedText: 'Test ingredients',
        analysis: {
          ingredients: [
            {
              name: 'Sugar',
              category: 'additive',
              explanation: 'Common sweetener',
              riskLevel: 'low',
            },
          ],
          score: 75,
          grade: 'B',
          positives: ['Natural ingredients'],
          warnings: ['Contains sugar'],
          recommendations: ['Consume in moderation'],
        },
      };

      mockRequest = {
        file: mockFile as Express.Multer.File,
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('test'));
      (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);
      (mistralService.analyzeImageService as jest.Mock).mockResolvedValue(
        mockAnalysisResult
      );

      await analyzeImage(mockRequest as Request, mockResponse as Response);

      expect(fs.readFileSync).toHaveBeenCalledWith(mockFile.path);
      expect(mistralService.analyzeImageService).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalledWith(mockFile.path);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockAnalysisResult);
    });

    it('should handle errors and clean up temp file', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/tmp/test.jpg',
      };

      mockRequest = {
        file: mockFile as Express.Multer.File,
      };

      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File read error');
      });
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);

      await analyzeImage(mockRequest as Request, mockResponse as Response);

      expect(fs.unlinkSync).toHaveBeenCalledWith(mockFile.path);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Erreur lors de l'analyse de l'image.",
        details: 'File read error',
      });
    });
  });
});
