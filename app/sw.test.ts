import { Serwist } from "serwist";

// Мокаємо Serwist та defaultCache
jest.mock("serwist", () => ({
  Serwist: jest.fn().mockImplementation((config) => ({
    config,
    addEventListeners: jest.fn(),
  })),
}));
jest.mock("@serwist/next/worker", () => ({
  defaultCache: "mockedDefaultCache",
}));

// Мокаємо глобальний ServiceWorker scope
const mockManifest = [{ url: "/index.html" }, "/main.js"];
(globalThis as any).self = {
  __SW_MANIFEST: mockManifest,
};

describe("Service Worker setup", () => {
  let serwistInstance: any;
  let Serwist: any;

  beforeAll(() => {
    jest.resetModules();
    Serwist = require("serwist").Serwist;
    serwistInstance = require("./sw").serwist;
  });

  it("should instantiate Serwist with correct config", () => {
    expect(Serwist).toHaveBeenCalledWith({
      precacheEntries: mockManifest,
      skipWaiting: true,
      clientsClaim: true,
      navigationPreload: true,
      runtimeCaching: "mockedDefaultCache",
      fallbacks: {
        entries: [
          {
            url: "/~offline",
            matcher: expect.any(Function),
          },
        ],
      },
    });
  });

  it("should call addEventListeners", () => {
    expect(serwistInstance.addEventListeners).toHaveBeenCalled();
  });

  it("fallback matcher should match document requests", () => {
    const fallbackEntry = serwistInstance.config.fallbacks.entries[0];
    expect(fallbackEntry.matcher({ request: { destination: "document" } })).toBe(true);
    expect(fallbackEntry.matcher({ request: { destination: "image" } })).toBe(false);
  });
});