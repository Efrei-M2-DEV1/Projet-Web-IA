// Tests for mistralService - validate current implementation without real API calls

describe("MistralService", () => {
  const MISTRAL_MODULE = "@mistralai/mistralai";

  beforeEach(() => {
    jest.resetModules();
    process.env.MISTRAL_API_KEY = "test-key";
    process.env.MISTRAL_MODEL = "test-model";
  });

  it("should export analyzeImageService (module loads with API key)", () => {
    jest.doMock(MISTRAL_MODULE, () => ({
      Mistral: jest
        .fn()
        .mockImplementation(() => ({ chat: { complete: jest.fn() } })),
    }));
    const { analyzeImageService } = require("../mistralService");
    expect(analyzeImageService).toBeDefined();
    expect(typeof analyzeImageService).toBe("function");
  });

  it("parses string JSON response from IA and maps to expected shape", async () => {
    const sample = {
      extractedText: "Eau, Sucre",
      ingredients: [
        {
          name: "Eau",
          category: "natural",
          explanation: "OK",
          riskLevel: "none",
        },
      ],
      score: 80,
      grade: "A",
      positives: ["Faible en sucre"],
      warnings: [],
      recommendations: ["Bonne option"],
    };

    jest.doMock(MISTRAL_MODULE, () => {
      const mockComplete = jest.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(sample) } }],
      });
      return {
        Mistral: jest
          .fn()
          .mockImplementation(() => ({ chat: { complete: mockComplete } })),
      };
    });

    const svc = require("../mistralService");
    const result = await svc.analyzeImageService("data:image/png;base64,xxx");
    expect(result.extractedText).toBe(sample.extractedText);
    expect(result.analysis.score).toBe(80);
    expect(result.analysis.ingredients[0].name).toBe("Eau");
    expect(result.analysis.grade).toBe("A");
  });

  it("parses object response (non-string) from IA", async () => {
    const sampleObj = {
      extractedText: "Farine, Sel",
      ingredients: [
        {
          name: "Farine",
          category: "allergen_major",
          explanation: "Contient gluten",
          riskLevel: "high",
        },
      ],
      score: 60,
      grade: "C",
      positives: [],
      warnings: ["Gluten"],
      recommendations: ["Éviter si intolérance"],
    };

    jest.doMock(MISTRAL_MODULE, () => {
      const mockComplete = jest.fn().mockResolvedValue({
        choices: [{ message: { content: sampleObj } }],
      });
      return {
        Mistral: jest
          .fn()
          .mockImplementation(() => ({ chat: { complete: mockComplete } })),
      };
    });

    const svc = require("../mistralService");
    const result = await svc.analyzeImageService("data:image/png;base64,yyy");
    expect(result.extractedText).toBe(sampleObj.extractedText);
    expect(result.analysis.ingredients[0].category).toBe("allergen_major");
  });

  it("applies fallback when IA returns empty ingredients array or empty text", async () => {
    const sampleEmpty = {
      extractedText: "",
      ingredients: [],
      score: 50,
      grade: "C",
      positives: [],
      warnings: [],
      recommendations: [],
    };

    jest.doMock(MISTRAL_MODULE, () => {
      const mockComplete = jest.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(sampleEmpty) } }],
      });
      return {
        Mistral: jest
          .fn()
          .mockImplementation(() => ({ chat: { complete: mockComplete } })),
      };
    });

    const svc = require("../mistralService");
    const result = await svc.analyzeImageService("data:image/png;base64,zzz");
    expect(result.analysis.ingredients.length).toBeGreaterThan(0);
    expect(typeof result.extractedText).toBe("string");
    expect(result.extractedText.length).toBeGreaterThan(0);
  });

  it("throws a friendly error when IA call fails", async () => {
    jest.doMock(MISTRAL_MODULE, () => {
      const mockComplete = jest
        .fn()
        .mockRejectedValue(new Error("network error"));
      return {
        Mistral: jest
          .fn()
          .mockImplementation(() => ({ chat: { complete: mockComplete } })),
      };
    });

    const svc = require("../mistralService");
    await expect(
      svc.analyzeImageService("data:image/png;base64,err"),
    ).rejects.toThrow(/L'analyse IA a échoué/i);
  });

  it("throws at import time if MISTRAL_API_KEY is missing", () => {
    jest.resetModules();
    // ensure no env is injected by dotenv during import
    delete process.env.MISTRAL_API_KEY;
    // prevent dotenv from reading real .env
    jest.doMock("dotenv", () => ({ config: jest.fn(() => ({})) }));
    // mock Mistral package so requiring fails only due to missing env
    jest.doMock(MISTRAL_MODULE, () => ({ Mistral: jest.fn() }));
    expect(() => require("../mistralService")).toThrow(/MISTRAL_API_KEY/);
  });
});
// filepath: server/src/services/__tests__/mistralService.test.ts
// Tests for mistralService - validate current implementation without real API calls

describe("MistralService", () => {
  const MISTRAL_MODULE = "@mistralai/mistralai";

  beforeEach(() => {
    jest.resetModules();
    process.env.MISTRAL_API_KEY = "test-key";
    process.env.MISTRAL_MODEL = "test-model";
  });

  it("should export analyzeImageService (module loads with API key)", () => {
    jest.doMock(MISTRAL_MODULE, () => ({
      Mistral: jest
        .fn()
        .mockImplementation(() => ({ chat: { complete: jest.fn() } })),
    }));
    const { analyzeImageService } = require("../mistralService");
    expect(analyzeImageService).toBeDefined();
    expect(typeof analyzeImageService).toBe("function");
  });

  it("parses string JSON response from IA and maps to expected shape", async () => {
    const sample = {
      extractedText: "Eau, Sucre",
      ingredients: [
        {
          name: "Eau",
          category: "natural",
          explanation: "OK",
          riskLevel: "none",
        },
      ],
      score: 80,
      grade: "A",
      positives: ["Faible en sucre"],
      warnings: [],
      recommendations: ["Bonne option"],
    };

    jest.doMock(MISTRAL_MODULE, () => {
      const mockComplete = jest.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(sample) } }],
      });
      return {
        Mistral: jest
          .fn()
          .mockImplementation(() => ({ chat: { complete: mockComplete } })),
      };
    });

    const svc = require("../mistralService");
    const result = await svc.analyzeImageService("data:image/png;base64,xxx");
    expect(result.extractedText).toBe(sample.extractedText);
    expect(result.analysis.score).toBe(80);
    expect(result.analysis.ingredients[0].name).toBe("Eau");
    expect(result.analysis.grade).toBe("A");
  });

  it("parses object response (non-string) from IA", async () => {
    const sampleObj = {
      extractedText: "Farine, Sel",
      ingredients: [
        {
          name: "Farine",
          category: "allergen_major",
          explanation: "Contient gluten",
          riskLevel: "high",
        },
      ],
      score: 60,
      grade: "C",
      positives: [],
      warnings: ["Gluten"],
      recommendations: ["Éviter si intolérance"],
    };

    jest.doMock(MISTRAL_MODULE, () => {
      const mockComplete = jest.fn().mockResolvedValue({
        choices: [{ message: { content: sampleObj } }],
      });
      return {
        Mistral: jest
          .fn()
          .mockImplementation(() => ({ chat: { complete: mockComplete } })),
      };
    });

    const svc = require("../mistralService");
    const result = await svc.analyzeImageService("data:image/png;base64,yyy");
    expect(result.extractedText).toBe(sampleObj.extractedText);
    expect(result.analysis.ingredients[0].category).toBe("allergen_major");
  });

  it("applies fallback when IA returns empty ingredients array or empty text", async () => {
    const sampleEmpty = {
      extractedText: "",
      ingredients: [],
      score: 50,
      grade: "C",
      positives: [],
      warnings: [],
      recommendations: [],
    };

    jest.doMock(MISTRAL_MODULE, () => {
      const mockComplete = jest.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(sampleEmpty) } }],
      });
      return {
        Mistral: jest
          .fn()
          .mockImplementation(() => ({ chat: { complete: mockComplete } })),
      };
    });

    const svc = require("../mistralService");
    const result = await svc.analyzeImageService("data:image/png;base64,zzz");
    expect(result.analysis.ingredients.length).toBeGreaterThan(0);
    expect(typeof result.extractedText).toBe("string");
    expect(result.extractedText.length).toBeGreaterThan(0);
  });

  it("throws a friendly error when IA call fails", async () => {
    jest.doMock(MISTRAL_MODULE, () => {
      const mockComplete = jest
        .fn()
        .mockRejectedValue(new Error("network error"));
      return {
        Mistral: jest
          .fn()
          .mockImplementation(() => ({ chat: { complete: mockComplete } })),
      };
    });

    const svc = require("../mistralService");
    await expect(
      svc.analyzeImageService("data:image/png;base64,err"),
    ).rejects.toThrow(/L'analyse IA a échoué/i);
  });

  it("throws at import time if MISTRAL_API_KEY is missing", () => {
    jest.resetModules();
    // ensure no env is injected by dotenv during import
    delete process.env.MISTRAL_API_KEY;
    // prevent dotenv from reading real .env
    jest.doMock("dotenv", () => ({ config: jest.fn(() => ({})) }));
    // mock Mistral package so requiring fails only due to missing env
    jest.doMock(MISTRAL_MODULE, () => ({ Mistral: jest.fn() }));
    expect(() => require("../mistralService")).toThrow(/MISTRAL_API_KEY/);
  });
});
