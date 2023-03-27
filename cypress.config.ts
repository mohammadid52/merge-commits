import {defineConfig} from 'cypress';

export default defineConfig({
  projectId: 'a6v28z',

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    }
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    }
  }
});
