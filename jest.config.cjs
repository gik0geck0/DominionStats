module.exports = {
    testMatch: ['<rootDir>/**/__tests__/*.spec.ts', '<rootDir>/**/__tests__/*.spec.js'],
    coverageThreshold: {
        global: {
            statements: 95,
            branches: 84,
            functions: 90,
            lines: 95
        }
    },
    preset: '@lwc/jest-preset',
    moduleFileExtensions: ['js', 'ts'],
    resolver: require.resolve('@lwc/jest-resolver')
};
