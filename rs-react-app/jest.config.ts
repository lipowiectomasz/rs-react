import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '\\.css$': 'jest-css-modules-transform',
  },
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
  collectCoverageFrom: ['**/*.tsx', '!src/App.tsx'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '\\.test\\.tsx$',
    '\\.spec\\.tsx$',
    'src/__tests__/setup.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/setup.ts'],
};

