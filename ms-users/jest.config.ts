import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts',
    '!**/*.dto.ts',
    '!**/*.schema.ts',
    '!**/interfaces/**',
    '!**/config/**',
    '!**/database/**',
    '!users.providers.ts',
    '!main.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
