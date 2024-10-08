export default {
  root: "./src/",
  build: {
    outDir: "../dist",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
      output: {
        comments: false,
      },
    },
  },
};
