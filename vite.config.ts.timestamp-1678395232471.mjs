// vite.config.ts
import { defineConfig } from "file:///Users/mohammad/Documents/work/IconoclastArtistsReact_Base-toVite/Iconoclast/node_modules/vite/dist/node/index.js";
import react from "file:///Users/mohammad/Documents/work/IconoclastArtistsReact_Base-toVite/Iconoclast/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tsconfigPaths from "file:///Users/mohammad/Documents/work/IconoclastArtistsReact_Base-toVite/Iconoclast/node_modules/vite-tsconfig-paths/dist/index.mjs";
import { esbuildCommonjs } from "file:///Users/mohammad/Documents/work/IconoclastArtistsReact_Base-toVite/Iconoclast/node_modules/@originjs/vite-plugin-commonjs/lib/index.js";
var vite_config_default = defineConfig({
  build: {
    // Relative to the root
    outDir: "public"
  },
  define: {
    global: {},
    process: {
      env: {}
    }
  },
  plugins: [
    react({
      include: ["ts", "tsx", "js", "jsx", "html"]
    }),
    tsconfigPaths()
  ],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        esbuildCommonjs([
          "@aws-sdk/client-cognito-identity",
          "@aws-sdk/credential-providers",
          "@aws-sdk/client-s3",
          "react-date-picker"
        ])
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbW9oYW1tYWQvRG9jdW1lbnRzL3dvcmsvSWNvbm9jbGFzdEFydGlzdHNSZWFjdF9CYXNlLXRvVml0ZS9JY29ub2NsYXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbW9oYW1tYWQvRG9jdW1lbnRzL3dvcmsvSWNvbm9jbGFzdEFydGlzdHNSZWFjdF9CYXNlLXRvVml0ZS9JY29ub2NsYXN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tb2hhbW1hZC9Eb2N1bWVudHMvd29yay9JY29ub2NsYXN0QXJ0aXN0c1JlYWN0X0Jhc2UtdG9WaXRlL0ljb25vY2xhc3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcbmltcG9ydCB7IGVzYnVpbGRDb21tb25qcyB9IGZyb20gXCJAb3JpZ2luanMvdml0ZS1wbHVnaW4tY29tbW9uanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICAvLyBSZWxhdGl2ZSB0byB0aGUgcm9vdFxuICAgIG91dERpcjogXCJwdWJsaWNcIixcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgZ2xvYmFsOiB7fSxcbiAgICBwcm9jZXNzOiB7XG4gICAgICBlbnY6IHt9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICBpbmNsdWRlOiBbXCJ0c1wiLCBcInRzeFwiLCBcImpzXCIsIFwianN4XCIsIFwiaHRtbFwiXSxcbiAgICB9KSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gIF0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIGVzYnVpbGRDb21tb25qcyhbXG4gICAgICAgICAgXCJAYXdzLXNkay9jbGllbnQtY29nbml0by1pZGVudGl0eVwiLFxuICAgICAgICAgIFwiQGF3cy1zZGsvY3JlZGVudGlhbC1wcm92aWRlcnNcIixcbiAgICAgICAgICBcIkBhd3Mtc2RrL2NsaWVudC1zM1wiLFxuICAgICAgICAgIFwicmVhY3QtZGF0ZS1waWNrZXJcIixcbiAgICAgICAgXSksXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1osU0FBUyxvQkFBb0I7QUFDbmIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsdUJBQXVCO0FBRWhDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQTtBQUFBLElBRUwsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLFFBQVEsQ0FBQztBQUFBLElBQ1QsU0FBUztBQUFBLE1BQ1AsS0FBSyxDQUFDO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLFNBQVMsQ0FBQyxNQUFNLE9BQU8sTUFBTSxPQUFPLE1BQU07QUFBQSxJQUM1QyxDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsU0FBUztBQUFBLFFBQ1AsZ0JBQWdCO0FBQUEsVUFDZDtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
