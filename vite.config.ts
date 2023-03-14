import react from '@vitejs/plugin-react';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

import path from 'path';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: process.cwd(),

  build: {
    chunkSizeWarningLimit: 2000,
    sourcemap: false,

    outDir: path.join(process.cwd(), 'public'),
    rollupOptions: {
      cache: false,
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        // @ts-ignore
        rollupNodePolyFill()
      ]
    }
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser', //fix production build,
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      sys: 'util',
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      path: 'rollup-plugin-node-polyfills/polyfills/path',
      querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
      punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
      url: 'rollup-plugin-node-polyfills/polyfills/url',
      string_decoder: 'rollup-plugin-node-polyfills/polyfills/string-decoder',
      // buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      http: 'rollup-plugin-node-polyfills/polyfills/http',
      https: 'rollup-plugin-node-polyfills/polyfills/http',
      os: 'rollup-plugin-node-polyfills/polyfills/os',
      assert: 'rollup-plugin-node-polyfills/polyfills/assert',
      constants: 'rollup-plugin-node-polyfills/polyfills/constants',
      _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
      _stream_passthrough:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
      _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
      _stream_transform:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
      timers: 'rollup-plugin-node-polyfills/polyfills/timers',
      console: 'rollup-plugin-node-polyfills/polyfills/console',
      vm: 'rollup-plugin-node-polyfills/polyfills/vm',
      zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
      tty: 'rollup-plugin-node-polyfills/polyfills/tty',
      domain: 'rollup-plugin-node-polyfills/polyfills/domain'
    }
  },

  plugins: [
    react({
      include: ['ts', 'tsx', 'js', 'jsx', 'html']
    }),
    tsconfigPaths()
  ],
  server: {
    host: true,
    port: 8085,
    hmr: {host: 'localhost'}
  },

  optimizeDeps: {
    exclude: [
      'amplify',
      'cypress',
      'src/api.schema.graphql',
      'cypress.config.js',
      'scripts'
    ]
  }
});
