import * as esbuild from "esbuild-wasm";
import axios from "axios";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // #อันเก่าก่อนแก้เรื่องปัญหาไม่รู้ว่าจะไปโหลด pkg มาได้ยังไง
      // build.onResolve({ filter: /.*/ }, async (args: any) => {
      //   console.log("onResolve", args);
      //   return { path: args.path, namespace: "a" };
      // });

      // onResolve ตัวใหม่ที่แก้ปัญหาเรื่องโหลด pkg
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        if (args.path === "index.js")
          return { path: args.path, namespace: "a" };
        else if (args.path === "tiny-test-pkg")
          return {
            path: "https://unpkg.com/tiny-test-pkg@1.0.0/index.js",
            namespace: "a",
          };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            // ปัญหาคือตอนนี้ตัว unpkg ไม่รู้ว่าต้องไปโหลด tiny-path-pkg มาได้ยังไง
            // แก้ตัว onResolve ใหม่นิดหน่อย
            contents: `
              const message = require('tiny-test-pkg');
              console.log(message);
            `,
          };
        }

        // แก้ปัญหาเรื่องโหลด pkg
        const { data } = await axios.get(args.path);
        return {
          loader: "jsx",
          contents: data,
        };
      });
    },
  };
};
