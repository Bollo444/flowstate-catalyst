module.exports = {
  presets: [
    [
      "next/babel",
      {
        "preset-react": {
          runtime: "automatic",
        },
      },
    ],
  ],
  env: {
    test: {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        ["@babel/preset-react", { runtime: "automatic" }],
        "@babel/preset-typescript",
      ],
      plugins: [
        ["@babel/plugin-transform-runtime", { regenerator: true }],
        ["@babel/plugin-transform-modules-commonjs"],
      ],
    },
    development: {
      presets: ["next/babel"],
    },
    production: {
      presets: ["next/babel"],
    },
  },
};
