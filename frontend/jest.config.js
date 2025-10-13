const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // For React DOM testing
  testEnvironment: "jest-environment-jsdom",

  // Module name mapping
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    
    // Handle CSS imports (with CSS modules)
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

    // Handle CSS imports (without modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    // Handle static asset imports (images, videos, etc.)
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|mp4)$": "<rootDir>/__mocks__/fileMock.js",
  },

  // Transform settings for TypeScript and ESM
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // Ignore node_modules except for ESM packages that need transformation
  transformIgnorePatterns: [
    "/node_modules/(?!(@testing-library|react-markdown)/)",
  ],

  // Optional: increase timeout if tests fetch data
  testTimeout: 10000,
};

module.exports = createJestConfig(customJestConfig);
