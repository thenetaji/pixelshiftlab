import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssnested from "postcss-nested";

export default {
  plugins: [
    autoprefixer,
    cssnano({
      preset: "default",
    }),
    postcssnested,
  ],
};
