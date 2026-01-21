// Tests du service Mistral - Note: Ce service nécessite une clé API valide
// Les tests ci-dessous sont des tests d'intégration simplifiés
describe('MistralService', () => {
  describe('analyzeImageService', () => {
    it('should be defined', () => {
      const { analyzeImageService } = require('../mistralService');
      expect(analyzeImageService).toBeDefined();
      expect(typeof analyzeImageService).toBe('function');
    });

    // Note: Pour tester complètement ce service, utilisez des tests d'intégration
    // avec une vraie clé API dans un environnement de test dédié
  });
});
