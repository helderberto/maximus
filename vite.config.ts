import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [dts({ tsconfigPath: './tsconfig.build.json', bundleTypes: true })],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    lib: {
      entry: { index: 'src/index.ts', react: 'src/react.ts' },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
  test: {
    globals: true,
    // Node's own localStorage global would shadow the happy-dom one.
    execArgv: ['--no-experimental-webstorage'],
  },
});
