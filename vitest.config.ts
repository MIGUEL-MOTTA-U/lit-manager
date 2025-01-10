import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.ts',
        '**/*.spec.ts',
        'dist/',
        '**/config/',
        '**/lib/',
        '**/plugins/',
        '**/authorization/',
        '**/index.ts',
        '**/server.ts',
        '**/interfaces/',
      ],
    },
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist', 'config/**'],
  },
});
