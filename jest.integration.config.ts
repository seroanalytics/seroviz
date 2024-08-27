// jest.config.ts
export default {
    preset: 'ts-jest',
    transform: { '^.+\\.ts?$': 'ts-jest' },
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*"
    ],
    coverageDirectory: "coverage",
    testEnvironment: "jsdom",
    coveragePathIgnorePatterns : [
        "mocks.ts", "reportWebVitals", "index.tsx"
    ],
    setupFilesAfterEnv: ["./test/setupTests.ts","./test/setupIntegrationTests.ts"],
    testRegex: ".*(\\.itest)\\.[jt]sx?$"
}
